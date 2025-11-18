import { useEffect, useReducer, useState } from "react";
import {
  Character,
  CombatMonster,
  Item,
  Equipment,
  TrainableStat,
  Potion,
  GitHubRepo,
  Skill,
  StatusEffect,
  StatusEffectId,
  MemorialEntry,
  Summon,
  GitHubCommit,
} from "@/lib/rpg.models";
import {
  CLASSES_DB,
  CLASS_EVOLUTIONS,
  ITEMS_DB,
  MONSTERS_DB,
  SUMMONS_DB,
  SKILLS_DB,
  availableClasses,
} from "@/lib/game-data";

const LOCALSTORAGE_KEY = "questTermSaveGame";
const MEMORIAL_KEY = "questTermMemorial";
const SHOP_KEY = "questTermShop";

interface GameState {
  character: Character | null;
  gameState: "IDLE" | "AWAITING_NAME" | "AWAITING_CLASS" | "IN_COMBAT";
  tempName: string;
  currentMonster: CombatMonster | null;
  combatLog: string[];
  shopStock: Item[];
  shopLastRefresh: number;
  activeSummons: Summon[];
  actionsTaken: number; // NEW: Track actions in current turn
}

type GameAction =
  | { type: "START_CREATION" }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_CLASS"; payload: string }
  | {
      type: "TRAIN";
      payload: { stat: TrainableStat; gain: number; xp: number };
    }
  | {
      type: "DISTRIBUTE_POINT";
      payload: { stat: TrainableStat; amount: number };
    }
  | { type: "FIND_BATTLE"; payload: CombatMonster }
  | {
      type: "UPDATE_COMBAT_TURN";
      payload: { character: Character; monster: CombatMonster; log: string[] };
    }
  | {
      type: "END_COMBAT";
      payload: {
        exp: number;
        loot: Item[];
        log: string[];
        gold: number;
        monsterName: string;
      };
    }
  | { type: "RUN_AWAY" }
  | { type: "GAME_OVER" }
  | { type: "EQUIP_ITEM"; payload: Equipment }
  | { type: "ADD_ITEM"; payload: Item }
  | { type: "PLAYER_HEAL"; payload: number }
  | { type: "REMOVE_ITEM_BY_ID"; payload: string }
  | { type: "APPLY_PLAYER_STATUS"; payload: StatusEffect }
  | { type: "SET_SHOP_STOCK"; payload: { stock: Item[]; timestamp: number } }
  | { type: "BUY_ITEM"; payload: { item: Item; cost: number } }
  | { type: "LOAD_CHARACTER"; payload: Character }
  | { type: "ABANDON_CHARACTER" }
  | { type: "USE_STAMINA" }
  | {
      type: "SELL_ITEM";
      payload: { itemId: string; price: number; qty: number };
    }
  | { type: "RESTORE_GAME_STATE"; payload: Partial<GameState> }
  | { type: "SUMMON_CREATURE"; payload: Summon }
  | { type: "EVOLVE_CLASS"; payload: string }
  | { type: "SUMMON_ATTACK_MONSTER"; payload: number }
  | {
      type: "MONSTER_ATTACK_SUMMON";
      payload: { index: number; damage: number };
    }
  | { type: "INCREMENT_ACTION" } // NEW
  | { type: "RESET_ACTION" }; // NEW

const initialGameState: GameState = {
  character: null,
  gameState: "IDLE",
  tempName: "",
  currentMonster: null,
  combatLog: [],
  shopStock: [],
  shopLastRefresh: 0,
  activeSummons: [],
  actionsTaken: 0,
};

const cloneCharacter = (char: Character): Character => {
  const newChar = new Character(char.name, char.charClass);
  Object.assign(newChar, char);
  newChar.skillCooldowns = new Map(char.skillCooldowns);
  newChar.monsterKills = new Map(char.monsterKills);
  return newChar;
};

const getNewSkills = (className: string, level: number): Skill[] => {
  return SKILLS_DB.filter(
    (s) => s.unlockLevel === level && s.classRequirement === className
  );
};

const createHealthBar = (
  current: number,
  max: number,
  length: number = 20
): string => {
  const percentage = max > 0 ? current / max : 0;
  const filledBars = Math.round(percentage * length);
  const emptyBars = length - filledBars;
  const displayCurrent = Math.max(0, current);
  const bar = `[${"■".repeat(filledBars)}${"-".repeat(emptyBars)}]`;
  return `${bar} ${(percentage * 100).toFixed(0)}% (${displayCurrent}/${max})`;
};

function gameReducer(state: GameState, action: GameAction): GameState {
  if (!state.character) {
    switch (action.type) {
      case "START_CREATION":
        return { ...initialGameState, gameState: "AWAITING_NAME" };
      case "SET_NAME":
        return {
          ...state,
          gameState: "AWAITING_CLASS",
          tempName: action.payload,
        };
      case "SET_CLASS":
        const chosenClass = availableClasses.find(
          (c) => c.name.toLowerCase() === action.payload
        );
        if (!chosenClass) return state;

        const newChar = new Character(state.tempName, chosenClass);
        const initialSkills = getNewSkills(chosenClass.name, 1);
        newChar.knownSkills.push(...initialSkills);

        return {
          ...state,
          gameState: "IDLE",
          tempName: "",
          character: newChar,
        };
      case "LOAD_CHARACTER":
        return { ...state, character: action.payload };
      case "RESTORE_GAME_STATE":
        return { ...state, ...action.payload };
      default:
        return state;
    }
  }

  switch (action.type) {
    case "UPDATE_COMBAT_TURN": {
      return {
        ...state,
        character: action.payload.character,
        currentMonster: action.payload.monster,
      };
    }
    case "TRAIN": {
      if (!state.character) return state;
      const newChar = cloneCharacter(state.character);
      newChar.baseStats[action.payload.stat] += action.payload.gain;
      const leveledUp = newChar.addExp(action.payload.xp);
      if (leveledUp) {
        newChar.attributePoints += 3;
        const learnedSkills = getNewSkills(
          newChar.charClass.name,
          newChar.level
        );
        if (learnedSkills.length > 0) {
          newChar.knownSkills.push(...learnedSkills);
        }
      }
      return { ...state, character: newChar };
    }

    case "DISTRIBUTE_POINT": {
      if (!state.character) return state;
      const newChar = cloneCharacter(state.character);
      const { stat, amount } = action.payload;
      if (newChar.attributePoints >= amount) {
        newChar.baseStats[stat] += amount;
        newChar.attributePoints -= amount;
      }
      return { ...state, character: newChar };
    }

    case "USE_STAMINA": {
      if (!state.character) return state;
      const newChar = cloneCharacter(state.character);
      newChar.stamina--;
      newChar.lastStaminaRefresh = Date.now();
      return { ...state, character: newChar };
    }

    case "FIND_BATTLE":
      return {
        ...state,
        gameState: "IN_COMBAT",
        currentMonster: action.payload,
        combatLog: [],
        actionsTaken: 0,
      };
    case "SUMMON_CREATURE":
      if (state.activeSummons.length >= 3) return state;
      return {
        ...state,
        activeSummons: [...state.activeSummons, action.payload],
      };

    case "EVOLVE_CLASS": {
      if (!state.character) return state;
      const newCharEvolved = cloneCharacter(state.character);
      const newClassDefinition = CLASSES_DB[action.payload];
      if (newClassDefinition) {
        newCharEvolved.charClass = newClassDefinition;
        const evolvedSkills = getNewSkills(
          newClassDefinition.name,
          newCharEvolved.level
        );
        evolvedSkills.forEach((s) => {
          if (!newCharEvolved.knownSkills.some((k) => k.id === s.id)) {
            newCharEvolved.knownSkills.push(s);
          }
        });
      } else {
        newCharEvolved.charClass.name = action.payload;
      }
      return { ...state, character: newCharEvolved };
    }

    case "SUMMON_ATTACK_MONSTER":
      if (!state.currentMonster) return state;
      const monsterHurt = { ...state.currentMonster };
      monsterHurt.currentHP -= action.payload;
      return { ...state, currentMonster: monsterHurt };

    case "MONSTER_ATTACK_SUMMON":
      const summons = [...state.activeSummons];
      const targetSummon = { ...summons[action.payload.index] };
      targetSummon.stats.hp -= action.payload.damage;
      if (targetSummon.stats.hp <= 0) {
        summons.splice(action.payload.index, 1);
      } else {
        summons[action.payload.index] = targetSummon;
      }
      return { ...state, activeSummons: summons };

    case "END_COMBAT": {
      if (!state.character) return state;
      const { exp, loot, log, gold, monsterName } = action.payload;
      const newChar = cloneCharacter(state.character);
      newChar.gold += gold;
      const currentKills = newChar.monsterKills.get(monsterName) || 0;
      newChar.monsterKills.set(monsterName, currentKills + 1);

      const leveledUp = newChar.addExp(exp);
      newChar.inventory.push(...loot);

      if (leveledUp) {
        log.push(
          `*** VOCÊ SUBIU DE NÍVEL! Agora você é nível ${newChar.level}! ***`
        );
        newChar.attributePoints += 3;
        const learnedSkills = getNewSkills(
          newChar.charClass.name,
          newChar.level
        );
        if (learnedSkills.length > 0) {
          newChar.knownSkills.push(...learnedSkills);
          log.push(
            `Você aprendeu novas habilidades: ${learnedSkills
              .map((s) => s.name)
              .join(", ")}`
          );
        }
        log.push(
          `Você ganhou +3 pontos de atributo! Use 'up [stat] [qtd]' para distribuir.`
        );
      }

      return {
        ...state,
        gameState: "IDLE",
        currentMonster: null,
        combatLog: log,
        character: newChar,
        activeSummons: [],
        actionsTaken: 0,
      };
    }

    case "RUN_AWAY":
      return {
        ...state,
        gameState: "IDLE",
        currentMonster: null,
        combatLog: ["Você fugiu covardemente."],
        actionsTaken: 0,
      };

    case "RESTORE_GAME_STATE":
      return { ...state, ...action.payload };

    case "GAME_OVER": {
      if (!state.character) return state;
      const newChar = cloneCharacter(state.character);
      newChar.exp = Math.floor(newChar.exp / 2);
      newChar.currentHP = newChar.getCombatStats().hp;
      return {
        ...state,
        gameState: "IDLE",
        currentMonster: null,
        combatLog: ["Você morreu e perdeu metade do seu EXP..."],
        character: newChar,
        actionsTaken: 0,
      };
    }

    // ... (Item actions) ...
    case "EQUIP_ITEM": {
      if (!state.character) return state;
      const newChar = cloneCharacter(state.character);
      const item = action.payload;
      const oldItem = newChar.equipment[item.slot];
      if (oldItem) newChar.inventory.push(oldItem);
      newChar.inventory = newChar.inventory.filter((i) => i.id !== item.id);
      newChar.equipment[item.slot] = item;
      newChar.currentHP = Math.min(
        newChar.getCombatStats().hp,
        newChar.currentHP + (item.stats.hp || 0)
      );
      return { ...state, character: newChar };
    }

    case "SET_SHOP_STOCK":
      return {
        ...state,
        shopStock: action.payload.stock,
        shopLastRefresh: action.payload.timestamp,
      };

    case "BUY_ITEM":
      if (!state.character) return state;
      const newCharBuy = cloneCharacter(state.character);
      const { item, cost } = action.payload;
      newCharBuy.gold -= cost;
      newCharBuy.inventory.push(item);
      return { ...state, character: newCharBuy };

    case "SELL_ITEM": {
      if (!state.character) return state;
      const newCharSell = cloneCharacter(state.character);
      const { itemId, price, qty } = action.payload;
      let itemsRemoved = 0;
      for (let i = 0; i < qty; i++) {
        const index = newCharSell.inventory.findIndex(
          (item) => item.id === itemId
        );
        if (index > -1) {
          newCharSell.inventory.splice(index, 1);
          itemsRemoved++;
        } else {
          break;
        }
      }
      newCharSell.gold += price * itemsRemoved;
      return { ...state, character: newCharSell };
    }

    case "ADD_ITEM":
      if (!state.character) return state;
      const newCharAdd = cloneCharacter(state.character);
      newCharAdd.inventory.push(action.payload);
      return { ...state, character: newCharAdd };

    case "PLAYER_HEAL": {
      if (!state.character) return state;
      const newCharHeal = cloneCharacter(state.character);
      const healAmount = action.payload;
      const maxHP = newCharHeal.getCombatStats().hp;
      newCharHeal.currentHP = Math.min(
        maxHP,
        newCharHeal.currentHP + healAmount
      );
      return { ...state, character: newCharHeal };
    }

    case "REMOVE_ITEM_BY_ID": {
      if (!state.character) return state;
      const newCharRemove = cloneCharacter(state.character);
      const index = newCharRemove.inventory.findIndex(
        (i) => i.id === action.payload
      );
      if (index > -1) {
        newCharRemove.inventory.splice(index, 1);
      }
      return { ...state, character: newCharRemove };
    }

    case "APPLY_PLAYER_STATUS": {
      if (!state.character) return state;
      const newCharStatus = cloneCharacter(state.character);
      newCharStatus.addStatusEffect(action.payload);
      return { ...state, character: newCharStatus };
    }

    case "INCREMENT_ACTION":
      return { ...state, actionsTaken: state.actionsTaken + 1 };

    case "RESET_ACTION":
      return { ...state, actionsTaken: 0 };

    case "ABANDON_CHARACTER":
      return initialGameState;

    default:
      return state;
  }
}

export function useTerminalLogic() {
  const [history, setHistory] = useState<string[]>([
    "Bem-vindo ao QuestTerm (v1.0.0)",
    "Portfólio interativo de Guilherme Delgado Martins.",
    "Digite 'help' para ver a lista de comandos.",
    "Digite 'new game' para começar uma nova aventura.",
  ]);

  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);
  const [isInitialized, setIsInitialized] = useState(false);
  const [projects, setProjects] = useState<GitHubRepo[] | null>(null);
  const [commits, setCommits] = useState<GitHubCommit[] | null>(null);

  // ... (saveToMemorial, showMemorial, fetchProjects, fetchCommits, showPatchNotes, load/save useEffects - same as before)
  const saveToMemorial = (character: Character) => {
    try {
      const entry: MemorialEntry = {
        id: `${Date.now()}-${character.name}`,
        date: new Date().toLocaleString("pt-BR"),
        name: character.name,
        className: character.charClass.name,
        level: character.level,
        gold: character.gold,
        finalStats: character.getCombatStats(),
        equipment: {
          weapon: character.equipment.weapon?.name || "Nenhum",
          armor: character.equipment.armor?.name || "Nenhum",
        },
        monsterKills: Array.from(character.monsterKills.entries()),
      };
      const savedMemorial = localStorage.getItem(MEMORIAL_KEY);
      const entries: MemorialEntry[] = savedMemorial
        ? JSON.parse(savedMemorial)
        : [];
      entries.push(entry);
      localStorage.setItem(MEMORIAL_KEY, JSON.stringify(entries));
    } catch (err) {
      console.error("Falha ao salvar no memorial", err);
    }
  };

  const showMemorial = (): string[] => {
    const savedMemorial = localStorage.getItem(MEMORIAL_KEY);
    if (!savedMemorial) return ["O Memorial dos Heróis Caídos está vazio."];
    const entries: MemorialEntry[] = JSON.parse(savedMemorial);
    if (entries.length === 0)
      return ["O Memorial dos Heróis Caídos está vazio."];

    const log: string[] = ["--- Memorial dos Heróis Caídos ---"];
    const lastHero = entries[entries.length - 1];
    log.push(
      `Último Herói: ${lastHero.name}, o ${lastHero.className} (Nível ${lastHero.level})`
    );
    log.push(`  Registrado em: ${lastHero.date}`);
    log.push(`  Ouro Final: ${lastHero.gold} G`);
    log.push(
      `  Equipamento: ${lastHero.equipment.weapon} | ${lastHero.equipment.armor}`
    );
    log.push(
      `  Atributos Finais: HP(${lastHero.finalStats.hp}) STR(${lastHero.finalStats.str}) DEX(${lastHero.finalStats.dex}) INT(${lastHero.finalStats.int})`
    );

    if (lastHero.monsterKills.length > 0) {
      log.push("  Registro de Eliminações:");
      lastHero.monsterKills.forEach(([name, count]) =>
        log.push(`    - ${name}: ${count}`)
      );
    } else {
      log.push("  Não eliminou nenhum monstro.");
    }
    if (entries.length > 1)
      log.push(`(E ${entries.length - 1} outros heróis caídos...)`);
    return log;
  };

  useEffect(() => {
    const GITHUB_USERNAME = "guigasprog";
    const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=6`;
    const fetchProjects = async () => {
      try {
        const res = await fetch(API_URL);
        if (res.ok) setProjects(await res.json());
        else setProjects([]);
      } catch {
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

  useEffect(() => {
    const GITHUB_USERNAME = "guigasprog";
    const GITHUB_REPO = "QuestTerm";
    const API_URL = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/commits?per_page=10`;
    const fetchCommits = async () => {
      try {
        const res = await fetch(API_URL);
        if (res.ok) setCommits(await res.json());
        else setCommits([]);
      } catch {
        setCommits([]);
      }
    };
    fetchCommits();
  }, []);

  const showPatchNotes = (): string[] => {
    if (commits === null) return ["Carregando Patch Notes..."];
    if (commits.length === 0)
      return ["Não foi possível carregar os commits recentes."];
    return [
      "--- Patch Notes (Últimos Commits) ---",
      ...commits.map(
        (c) =>
          `  [${new Date(c.commit.author.date).toLocaleDateString("pt-BR")}] ${
            c.commit.message.split("\n")[0]
          }`
      ),
      "  (Digite 'open repo' para ver o código completo)",
    ];
  };

  // LOAD GAME
  useEffect(() => {
    try {
      const savedString = localStorage.getItem(LOCALSTORAGE_KEY);
      if (savedString) {
        const savedData = JSON.parse(savedString);
        const charData = savedData.character;
        const charClass =
          availableClasses.find((c) => c.name === charData.charClass.name) ||
          CLASSES_DB[charData.charClass.name];

        if (charClass) {
          const newChar = new Character(charData.name, charClass);
          Object.assign(newChar, charData);

          if (typeof charData.currentHP === "number") {
            newChar.currentHP = charData.currentHP;
          }

          newChar.skillCooldowns = new Map(charData.skillCooldowns);
          newChar.monsterKills = new Map(charData.monsterKills);

          if (newChar.stamina === undefined) {
            newChar.stamina = 3;
            newChar.lastStaminaRefresh = Date.now();
          }
          if (newChar.attributePoints === undefined) {
            newChar.attributePoints = 0;
          }

          dispatch({ type: "LOAD_CHARACTER", payload: newChar });
          dispatch({
            type: "RESTORE_GAME_STATE",
            payload: {
              gameState: savedData.gameState || "IDLE",
              currentMonster: savedData.currentMonster || null,
              shopStock: savedData.shopStock || [],
              shopLastRefresh: savedData.shopLastRefresh || 0,
              activeSummons: savedData.activeSummons || [],
              actionsTaken: savedData.actionsTaken || 0, // Restore actions taken
            },
          });
          setHistory((prev) => [
            ...prev,
            `Jogo salvo de '${newChar.name}' (Nível ${newChar.level}) carregado.`,
          ]);
          if (savedData.gameState === "IN_COMBAT") {
            setHistory((prev) => [
              ...prev,
              `ATENÇÃO: Você está em combate com ${savedData.currentMonster.name}!`,
            ]);
          }
        }
      }
    } catch (err) {
      console.error("Falha ao carregar save", err);
      localStorage.removeItem(LOCALSTORAGE_KEY);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // SAVE GAME
  useEffect(() => {
    if (!isInitialized) return;
    try {
      const { character } = gameState;
      if (character) {
        const dataToSave = {
          ...gameState,
          character: {
            ...character,
            skillCooldowns: Array.from(character.skillCooldowns.entries()),
            monsterKills: Array.from(character.monsterKills.entries()),
          },
        };
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(dataToSave));
      } else {
        localStorage.removeItem(LOCALSTORAGE_KEY);
      }
    } catch (err) {
      console.error("Falha ao salvar jogo", err);
    }
  }, [gameState, isInitialized]);

  // ... (findInList, showCombatAbilities, showCombatInventory, listClasses, showPortfolio, showSkills, showMonsterStats, showInventory, showAbilities, showHelp, generateShopStock, checkAndRefreshShop, handleFindBattle, handleEquip) ...
  const findInList = <T extends { name: string; id: string }>(
    query: string,
    list: T[]
  ): T | undefined => {
    const uniqueList = [
      ...new Map(list.map((item) => [item.id, item])).values(),
    ];
    const index = parseInt(query, 10) - 1;
    if (!isNaN(index) && index >= 0 && index < uniqueList.length) {
      return list.find((i) => i.id === uniqueList[index].id);
    }
    const lowerQuery = query.toLowerCase();
    return list.find((item) => item.name.toLowerCase().includes(lowerQuery));
  };

  const showCombatAbilities = (): string[] => {
    if (!gameState.character) return ["Erro."];
    const { knownSkills, skillCooldowns } = gameState.character;
    if (knownSkills.length === 0)
      return ["Você não conhece nenhuma habilidade."];
    const log = ["--- Habilidades (Combate) ---"];
    knownSkills.forEach((skill, index) => {
      const cooldown = skillCooldowns.get(skill.id);
      const prefix = `  ${index + 1}. ${skill.name} (${skill.type})`;
      log.push(
        cooldown
          ? `${prefix} - [RECARGA: ${cooldown}t]`
          : `${prefix} - [PRONTO]`
      );
    });
    return log;
  };

  const showCombatInventory = (): string[] => {
    if (!gameState.character) return ["Erro."];
    const potions = gameState.character.inventory.filter(
      (i) => i.type === "Potion"
    );
    if (potions.length === 0) return ["Você não tem poções utilizáveis."];
    const uniquePotions = [
      ...new Map(potions.map((item) => [item.id, item])).values(),
    ];
    const log = ["--- Poções (Combate) ---"];
    uniquePotions.forEach((item, index) => {
      const count = potions.filter((i) => i.id === item.id).length;
      log.push(`  ${index + 1}. ${item.name} (x${count})`);
    });
    return log;
  };

  const listClasses = (): string[] => {
    return availableClasses.map(
      (c, index) =>
        `  ${index + 1}. ${c.name}: ${c.description} (HP:${
          c.baseStats.hp
        } STR:${c.baseStats.str} DEX:${c.baseStats.dex} INT:${c.baseStats.int})`
    );
  };

  const showPortfolio = (): string[] => {
    if (projects === null) return ["Carregando projetos do GitHub..."];
    if (projects.length === 0) return ["Não foi possível carregar projetos."];
    const projectLines = projects.map((repo, index) => {
      const description = repo.description || "Sem descrição.";
      return `  ${index + 1}. ${repo.name} (★${
        repo.stargazers_count
      })\n     - ${description}`;
    });
    return [
      "--- Meus Projetos (do GitHub) ---",
      ...projectLines,
      "  (Use `open [número]` para abrir no navegador)",
    ];
  };

  const showSkills = (): string[] => [
    "--- Habilidades ---",
    "  Frontend:   Angular, React, TypeScript, TailwindCSS",
    "  Backend:    Java (Spring-Boot), Node.js (Express)",
    "  Mobile:     React Native (Expo, Bare)",
    "  Database:   PostgreSQL, MongoDB, Redis",
    "  DevOps:     Docker, GitHub Actions, AWS (S3, EC2)",
    "  Design:     Figma, UI/UX Principles",
  ];

  const showStats = (): string[] => {
    if (!gameState.character) return ["Sem personagem."];
    const char = gameState.character;
    const base = char.baseStats;
    const combat = char.getCombatStats();
    const healthBar = createHealthBar(char.currentHP, combat.hp);

    // Cálculos para exibição
    const critChance = Math.min(75, combat.dex * 0.2).toFixed(1);
    const extraActions = Math.floor(combat.dex / 30);
    const magicBoost = (Math.floor(combat.int / 5) * 0.05 * 100).toFixed(0);
    const magicDuration = Math.floor(combat.int / 10);

    const statsLines = [
      `--- STATUS: ${char.name} (O ${char.charClass.name}) ---`,
      `  Nível: ${char.level} (${char.exp} / ${char.expToNextLevel} EXP)`,
      `  Pontos de Atributo: ${char.attributePoints}`,
      `  Ouro:  ${char.gold} G`,
      `  HP:    ${healthBar}`,
      `  -----------------------`,
      `  STR:   ${combat.str} ${
        combat.str > base.str ? `(${base.str}+${combat.str - base.str})` : ""
      }`,
      `  DEX:   ${combat.dex} ${
        combat.dex > base.dex ? `(${base.dex}+${combat.dex - base.dex})` : ""
      }`,
      `         (Crítico: ${critChance}% | Ações/Turno: ${1 + extraActions})`,
      `  INT:   ${combat.int} ${
        combat.int > base.int ? `(${base.int}+${combat.int - base.int})` : ""
      }`,
      `         (Poder Mágico: +${magicBoost}% | Duração Extra: +${magicDuration}t)`,
      `  -----------------------`,
      `--- Equipamento ---`,
      `  Arma:  ${char.equipment.weapon?.name || "Nenhuma"}`,
      `  Armadura: ${char.equipment.armor?.name || "Nenhuma"}`,
    ];
    if (gameState.character.statusEffects.length > 0) {
      statsLines.push("--- Efeitos Ativos ---");
      gameState.character.statusEffects.forEach((e) => {
        statsLines.push(`  - ${e.id} (${e.duration} turnos restantes)`);
      });
    }
    if (gameState.activeSummons.length > 0) {
      statsLines.push("--- Invocações ---");
      gameState.activeSummons.forEach((s) => {
        statsLines.push(`  - ${s.name}: ${s.stats.hp}/${s.stats.maxHp} HP`);
      });
    }
    return statsLines;
  };

  const showMonsterStats = (monster: CombatMonster): string[] => {
    const healthBar = createHealthBar(monster.currentHP, monster.stats.hp);
    return [
      `--- STATUS: ${monster.name} (Nível ${monster.minLevel}) ---`,
      `  HP:  ${healthBar}`,
      `  STR: ${monster.stats.str} | DEX: ${monster.stats.dex} | INT: ${monster.stats.int}`,
      `  Efeitos: ${
        monster.statusEffects.length > 0
          ? monster.statusEffects.map((e) => e.id).join(", ")
          : "Nenhum"
      }`,
    ];
  };

  const showInventory = (): string[] => {
    if (!gameState.character || gameState.character.inventory.length === 0)
      return ["Seu inventário está vazio."];
    const inventoryList = gameState.character.inventory;
    const uniqueItems = [
      ...new Map(inventoryList.map((item) => [item.id, item])).values(),
    ];
    return [
      "--- Inventário ---",
      ...uniqueItems.map((item, index) => {
        const count = inventoryList.filter((i) => i.id === item.id).length;
        const tierInfo =
          item.type === "Equipment" ? ` [T${(item as Equipment).tier}]` : "";
        const sellPrice = Math.floor(item.price / 2);
        return `  ${index + 1}. ${item.name}${tierInfo} ${
          count > 1 ? `(x${count})` : ""
        } [Vende: ${sellPrice}G]`;
      }),
      "Use 'equip [num]', 'use [num]' ou 'sell [num] [qty]'.",
    ];
  };

  const showAbilities = (): string[] => {
    if (!gameState.character) return ["Crie um personagem primeiro."];
    const { knownSkills, skillCooldowns } = gameState.character;
    if (knownSkills.length === 0)
      return ["Você não conhece nenhuma habilidade."];
    return [
      "--- Suas Habilidades ---",
      ...knownSkills.map((skill, index) => {
        const cooldown = skillCooldowns.get(skill.id);
        return `  ${index + 1}. ${skill.name} (${skill.type}) [${
          cooldown ? `RECARGA: ${cooldown}t` : "PRONTO"
        }]\n     ${skill.description}`;
      }),
      "Use 'cast [num/nome]' ou 'use [num/nome]' em combate.",
    ];
  };

  const showHelp = (): string[] => [
    "--- Comandos do Portfólio ---",
    "  help           - Mostra esta lista de ajuda.",
    "  projects       - Exibe meus projetos do GitHub.",
    "  pn | patchnotes - Mostra as últimas atualizações do sistema.",
    "  open [numero]  - Abre um projeto no GitHub.",
    "  skills         - Lista minhas habilidades técnicas.",
    "  contact        - Mostra minhas informações de contato.",
    "  clear          - Limpa o histórico do terminal.",
    "",
    "--- Comandos do RPG (Fora de Combate) ---",
    "  new game | ng  - Inicia a criação de um novo personagem.",
    "  abandon character - Apaga seu personagem salvo.",
    "  memorial       - Mostra o registro do último herói caído.",
    "  stats          - Exibe os atributos do seu personagem.",
    "  abilities      - Lista suas habilidades e magias.",
    "  i | inventory  - Mostra seu inventário.",
    "  use [item]     - Usa um item (ex: Poção de Cura).",
    "  equip [item]   - Equipa um item do inventário.",
    "  train          - Treina e melhora 1 atributo aleatório.",
    "  up [stat] [qtd] - Distribui pontos de atributo (STR, DEX, INT).",
    "  f | find battle - Procura por um monstro para lutar.",
    "  shop           - Mostra a loja (estoque rotativo).",
    "  buy [numero]   - Compra um item da loja.",
    "  sell [item] [qtd] - Vende um item da loja.",
    "  evolve [classe] - Evolui sua classe (Nv. 10/20).",
    "",
    "--- Comandos de Combate (Apenas em batalha) ---",
    "  stats          - Mostra stats do jogador e monstro (ação livre).",
    "  a | attack     - Ataca o monstro com sua arma.",
    "  use [item/hab] - Usa um ITEM (Poção) ou HABILIDADE (Grito de Guerra).",
    "  cast [magia]   - Lança uma MAGIA (Bola de Fogo).",
    "  run            - Tenta fugir da batalha.",
  ];

  const generateShopStock = (): Item[] => {
    const vendorableItems = Object.values(ITEMS_DB).filter(
      (item) =>
        (item.type === "Potion" || item.type === "Equipment") && item.price > 0
    );
    const shuffled = vendorableItems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const checkAndRefreshShop = (): Item[] => {
    const now = Date.now();
    const oneHour = 1000 * 60 * 60;
    const storedShop = localStorage.getItem(SHOP_KEY);
    if (storedShop) {
      const { stock, timestamp } = JSON.parse(storedShop);
      if (now - timestamp < oneHour) {
        if (
          gameState.shopStock.length === 0 ||
          gameState.shopLastRefresh !== timestamp
        ) {
          dispatch({ type: "SET_SHOP_STOCK", payload: { stock, timestamp } });
        }
        return stock;
      }
    }
    const newStock = generateShopStock();
    localStorage.setItem(
      SHOP_KEY,
      JSON.stringify({ stock: newStock, timestamp: now })
    );
    dispatch({
      type: "SET_SHOP_STOCK",
      payload: { stock: newStock, timestamp: now },
    });
    return newStock;
  };

  const handleFindBattle = (): string[] => {
    if (!gameState.character) return ["Crie um personagem primeiro."];
    const charLevel = gameState.character.level;
    const availableSpawns = MONSTERS_DB.filter((m) => m.minLevel <= charLevel);
    const weightedSpawns = availableSpawns.flatMap((m) =>
      Array(m.minLevel).fill(m)
    );
    if (weightedSpawns.length === 0) return ["Nenhum monstro encontrado..."];
    const monsterTemplate =
      weightedSpawns[Math.floor(Math.random() * weightedSpawns.length)];
    const combatMonster: CombatMonster = {
      ...monsterTemplate,
      currentHP: monsterTemplate.stats.hp,
      statusEffects: [],
    };
    dispatch({ type: "FIND_BATTLE", payload: combatMonster });
    return [
      `!!! Um ${combatMonster.name} selvagem (Nível ${combatMonster.minLevel}) aparece !!!`,
      "Digite 'attack', 'use', 'cast' ou 'run'.",
    ];
  };

  const handleEquip = (args: string[]): string[] => {
    if (!gameState.character) return ["Crie um personagem primeiro."];
    const itemName = args.join(" ");
    if (!itemName) return ["Uso: equip [nome do item]"];
    const item = findInList(itemName, gameState.character.inventory);
    if (!item) return [`Item '${itemName}' não encontrado no inventário.`];
    if (item.type !== "Equipment")
      return [`'${item.name}' não é um item equipável.`];
    dispatch({ type: "EQUIP_ITEM", payload: item as Equipment });
    return [`Você equipou ${item.name}.`];
  };

  const saveGameNow = (stateToSave: GameState) => {
    try {
      const { character } = stateToSave;
      if (character) {
        const dataToSave = {
          ...stateToSave,
          character: {
            ...character,
            skillCooldowns: Array.from(character.skillCooldowns.entries()),
            monsterKills: Array.from(character.monsterKills.entries()),
          },
        };
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(dataToSave));
      }
    } catch (err) {
      console.error("Falha ao salvar jogo manualmente", err);
    }
  };

  const processCombatTurn = (
    action: "attack" | "run" | { skill: Skill } | { item: Item }
  ): string[] => {
    const { character, currentMonster } = gameState;
    if (!character || !currentMonster) return ["Erro: Combate inválido."];

    const charClone = cloneCharacter(character);
    const monsterClone = {
      ...currentMonster,
      statusEffects: [...currentMonster.statusEffects],
    };
    const playerStats = charClone.getCombatStats();
    const log: string[] = [];

    const critChance = Math.min(0.75, playerStats.dex * 0.002);
    const extraActions = Math.floor(playerStats.dex / 30);
    const totalActions = 1 + extraActions;

    const magicDmgMult = 1 + Math.floor(playerStats.int / 5) * 0.05;
    const magicDurationBonus = Math.floor(playerStats.int / 10);

    const isRepeatableAction =
      action === "attack" || (typeof action === "object" && "skill" in action);
    const loops = isRepeatableAction ? totalActions : 1;

    for (let i = 0; i < loops; i++) {
      if (monsterClone.currentHP <= 0) break;

      if (i > 0) log.push(`> [VELOCIDADE] Sua DEX permite uma ação extra!`);

      // 1. ATAQUE BÁSICO
      if (action === "attack") {
        const monsterStats = monsterClone.stats;
        let playerDamage = Math.max(
          1,
          Math.floor(playerStats.str - monsterStats.dex / 2)
        );

        if (Math.random() < critChance) {
          playerDamage = Math.floor(playerDamage * 2);
          log.push(`> CRÍTICO! (Chance: ${(critChance * 100).toFixed(1)}%)`);
        }

        monsterClone.currentHP -= playerDamage;
        log.push(
          `> Você ataca o ${monsterClone.name} causando ${playerDamage} de dano.`
        );
      }

      // 2. FUGIR (Não repete)
      else if (action === "run") {
        log.push("> Você tenta fugir...");
        const playerLevel = charClone.level;
        const monsterLevel = monsterClone.minLevel;
        const levelDifference = monsterLevel - playerLevel;
        const baseChance = 0.8;
        const penaltyPerLevel = 0.1;
        const dexBonus = playerStats.dex * 0.015;

        const escapeChance = Math.max(
          0.1,
          Math.min(
            0.95,
            baseChance - levelDifference * penaltyPerLevel + dexBonus
          )
        );

        if (Math.random() <= escapeChance) {
          dispatch({ type: "RUN_AWAY" });
          log.push("  ...e consegue escapar!");
          return log; // Sai da função imediatamente
        }
        log.push("  ...mas o monstro bloqueia seu caminho!");
      }

      // 3. USAR ITEM (Não repete)
      else if (typeof action === "object" && "item" in action) {
        log.push(`> Você usa '${action.item.name}'!`);
        if (action.item.type === "Potion") {
          const potion = action.item as Potion;
          if (potion.effect === "heal") {
            const maxHP = charClone.getCombatStats().hp;
            charClone.currentHP = Math.min(
              maxHP,
              charClone.currentHP + potion.value
            );
            log.push(`  Você recupera ${potion.value} HP.`);
          }
        }
        // Remove do inventário
        const index = charClone.inventory.findIndex(
          (it) => it.id === action.item.id
        );
        if (index > -1) charClone.inventory.splice(index, 1);
      }

      // 4. USAR HABILIDADE/MAGIA
      else if (typeof action === "object" && "skill" in action) {
        const skill = action.skill;

        // Cooldown só aplica na primeira execução
        if (i === 0) {
          log.push(`> Você usa '${skill.name}'!`);
          charClone.skillCooldowns.set(skill.id, skill.cooldown);
        } else {
          log.push(`> Você usa '${skill.name}' NOVAMENTE!`);
        }

        const target = skill.target === "Self" ? charClone : monsterClone;

        skill.effects.forEach((effect) => {
          switch (effect.type) {
            case "summon": {
              if (i === 0) {
                // Só invoca uma vez
                if (gameState.activeSummons.length >= 3) {
                  log.push("Limite de invocações atingido!");
                } else {
                  const summonTemplate = SUMMONS_DB[effect.summonId];
                  const newSummon = {
                    ...summonTemplate,
                    id: `${summonTemplate.id}_${Date.now()}`,
                  };
                  dispatch({ type: "SUMMON_CREATURE", payload: newSummon });
                  log.push(`Você invocou ${newSummon.name}!`);
                }
              }
              break;
            }
            case "apply_status": {
              let finalDuration = effect.duration;
              // Bônus de INT para duração (apenas Magias)
              if (skill.type === "Magic") {
                finalDuration += magicDurationBonus;
                if (magicDurationBonus > 0 && i === 0)
                  log.push(`  (INT Bonus: +${magicDurationBonus} turnos)`);
              }

              const newEffect: StatusEffect = {
                id: effect.effectId,
                duration: finalDuration,
                potency: effect.potency,
              };

              if ("charClass" in target) target.addStatusEffect(newEffect);
              else {
                // Lógica manual para monstro (pois não é classe Character)
                target.statusEffects = target.statusEffects.filter(
                  (e) => e.id !== newEffect.id
                );
                target.statusEffects.push(newEffect);
              }
              log.push(
                `  O ${
                  target === charClone ? "Você" : target.name
                } é afetado por '${effect.effectId}'!`
              );
              break;
            }
            case "direct_damage": {
              let dmg = effect.value;

              // Scaling de INT (Magia)
              if (skill.type === "Magic") {
                const oldDmg = dmg;
                dmg = Math.floor(dmg * magicDmgMult);
                if (dmg > oldDmg && i === 0)
                  log.push(`  (Amplificado por INT: ${oldDmg} -> ${dmg})`);
              }

              // Scaling de DEX (Crítico em tudo)
              if (Math.random() < critChance) {
                dmg = Math.floor(dmg * 2);
                log.push(`  CRÍTICO!`);
              }

              monsterClone.currentHP -= dmg;
              log.push(`  Causando ${dmg} de dano!`);
              break;
            }
          }
        });
      }
    } // Fim do Loop de Ações do Jogador

    // --- TURNO DAS INVOCAÇÕES ---
    if (gameState.activeSummons.length > 0 && monsterClone.currentHP > 0) {
      let totalSummonDamage = 0;
      gameState.activeSummons.forEach((summon) => {
        totalSummonDamage += summon.stats.dmg;
        log.push(
          `> ${summon.name} ataca causando ${summon.stats.dmg} de dano.`
        );
      });
      monsterClone.currentHP -= totalSummonDamage;
      dispatch({ type: "SUMMON_ATTACK_MONSTER", payload: totalSummonDamage });
    }

    // --- PROCESSA STATUS (DoT) ---
    monsterClone.statusEffects.forEach((effect) => {
      if (effect.id === "poisoned" && effect.potency) {
        monsterClone.currentHP -= effect.potency;
        log.push(
          `> O ${monsterClone.name} sofre ${effect.potency} de dano de veneno.`
        );
      }
      if (effect.id === "burning" && effect.potency) {
        monsterClone.currentHP -= effect.potency;
        log.push(
          `> O ${monsterClone.name} sofre ${effect.potency} de dano de fogo.`
        );
      }
    });

    // --- CHECA MORTE DO MONSTRO ---
    if (monsterClone.currentHP <= 0) {
      log.push(`> O ${monsterClone.name} foi derrotado!`);

      const loot: Item[] = [];
      let goldFound = 0;

      monsterClone.lootTable.forEach((drop) => {
        if (Math.random() < drop.dropChance) {
          const baseItem = drop.item;
          if (baseItem.type === "Currency") {
            const amount = Math.max(
              1,
              Math.floor(monsterClone.minLevel * 2 * (1 + Math.random()))
            );
            goldFound += amount;
            log.push(`  + Você encontrou ${amount}x Ouro!`);
          } else {
            loot.push(baseItem);
            log.push(`  + Você encontrou ${baseItem.name}!`);
          }
        }
      });

      // IMPORTANTE: Aqui despachamos END_COMBAT, que também salva o jogo
      const exp = monsterClone.expReward;
      dispatch({
        type: "END_COMBAT",
        payload: {
          exp,
          loot,
          log,
          gold: goldFound,
          monsterName: monsterClone.name,
        },
      });
      return log;
    }

    // --- TURNO DO MONSTRO ---
    const isParalyzed = monsterClone.statusEffects.find(
      (e) => e.id === "paralyzed"
    );

    if (isParalyzed) {
      log.push(`> O ${monsterClone.name} está paralisado e não pode se mover!`);
    } else {
      // Escolhe Alvo (0 = Player, 1+ = Summons)
      const targetsCount = 1 + gameState.activeSummons.length;
      const targetIndex = Math.floor(Math.random() * targetsCount);
      const monsterStats = monsterClone.stats;

      if (targetIndex === 0) {
        // Ataca Jogador
        const isInvisible = charClone.statusEffects.find(
          (e) => e.id === "invisible"
        );
        if (isInvisible) {
          log.push(
            `> O ${monsterClone.name} ataca, mas você está invisível e ele erra!`
          );
        } else {
          let monsterDamage = Math.max(
            1,
            Math.floor(monsterStats.str - playerStats.dex / 2)
          );

          const reduceDmg = charClone.statusEffects.find(
            (e) => e.id === "damage_reduction"
          );
          if (reduceDmg && reduceDmg.potency) {
            monsterDamage = Math.max(0, monsterDamage - reduceDmg.potency);
            log.push(`  Sua defesa reduz o dano!`);
          }

          charClone.currentHP -= monsterDamage;
          log.push(
            `> O ${monsterClone.name} ataca VOCÊ causando ${monsterDamage} de dano.`
          );
        }
      } else {
        // Ataca Summon
        const summonIndex = targetIndex - 1;
        const targetSummon = gameState.activeSummons[summonIndex];
        const damageToSummon = Math.max(1, monsterStats.str); // Dano puro nos summons

        log.push(
          `> O ${monsterClone.name} ataca ${targetSummon.name} causando ${damageToSummon} de dano.`
        );

        // Atualiza o estado dos summons via Action separada (pois activeSummons não está no monsterClone)
        dispatch({
          type: "MONSTER_ATTACK_SUMMON",
          payload: { index: summonIndex, damage: damageToSummon },
        });

        if (targetSummon.stats.hp - damageToSummon <= 0) {
          log.push(`  ${targetSummon.name} foi destruído!`);
        }
      }
    }

    // --- FINALIZAÇÃO DO TURNO ---
    charClone.tickTurn(); // Reduz cooldowns e status do player

    // Reduz status do monstro manualmente
    monsterClone.statusEffects = monsterClone.statusEffects.filter((e) => {
      e.duration--;
      return e.duration > 0;
    });

    // Check de Game Over
    if (charClone.currentHP <= 0) {
      log.push(`> *** VOCÊ MORREU ***`);
      saveToMemorial(charClone);
      dispatch({ type: "GAME_OVER" });
      return log;
    }

    // --- CRÍTICO: SALVA O ESTADO DO COMBATE ---
    // Despacha a atualização para o React State
    dispatch({
      type: "UPDATE_COMBAT_TURN",
      payload: { character: charClone, monster: monsterClone, log },
    });

    // Salva no LocalStorage IMEDIATAMENTE
    // (Isso garante que se der F5 agora, a vida estará atualizada)
    saveGameNow({
      ...gameState,
      character: charClone,
      currentMonster: monsterClone,
      activeSummons: gameState.activeSummons, // (Nota: summons atualizados via dispatch acima podem ter um delay de 1 frame no save manual aqui, mas é aceitável)
    });

    return log;
  };

  const executeCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    const [cmd, ...args] = lowerCommand.split(" ");
    setHistory((prev) => [...prev, `> ${command}`]);
    let response: string[] = [];

    if (gameState.gameState === "AWAITING_NAME") {
      dispatch({ type: "SET_NAME", payload: command.trim() });
      response = [
        `Belo nome, ${command.trim()}!`,
        "Agora, escolha sua classe (digite o nome ou número):",
        ...listClasses(),
      ];
      setHistory((prev) => [...prev, ...response]);
      return;
    }

    if (gameState.gameState === "AWAITING_CLASS") {
      let chosenClass;
      const index = parseInt(lowerCommand, 10);
      if (!isNaN(index) && index > 0 && index <= availableClasses.length) {
        chosenClass = availableClasses[index - 1];
      } else {
        chosenClass = availableClasses.find(
          (c) => c.name.toLowerCase() === lowerCommand
        );
      }
      if (chosenClass) {
        dispatch({
          type: "SET_CLASS",
          payload: chosenClass.name.toLowerCase(),
        });
        response = [
          `Personagem criado!`,
          `Você tem 3 pontos de atributo para gastar.`,
          "Digite 'stats' ou 'up [stat] [qtd]'.",
        ];
      } else {
        response = [
          `Classe '${command}' não encontrada.`,
          "Escolha pelo nome ou número:",
          ...listClasses(),
        ];
      }
      setHistory((prev) => [...prev, ...response]);
      return;
    }

    if (gameState.gameState === "IN_COMBAT") {
      let playerAction:
        | "attack"
        | "run"
        | "invalid"
        | { skill: Skill }
        | { item: Item } = "invalid";
      let responseLog: string[] = [];
      let stopExecution = false;

      if (cmd === "stats") {
        responseLog.push(...showStats());
        if (gameState.currentMonster)
          responseLog.push(...showMonsterStats(gameState.currentMonster));
        stopExecution = true;
      } else if ((cmd === "cast" || cmd === "use") && args.length === 0) {
        responseLog =
          cmd === "use" ? showCombatInventory() : showCombatAbilities();
        stopExecution = true;
      }

      if (stopExecution) {
        setHistory((prev) => [...prev, ...responseLog]);
        return;
      }

      if (cmd === "attack" || cmd === "a") playerAction = "attack";
      else if (cmd === "run") playerAction = "run";
      else if (cmd === "cast") {
        const query = args.join(" ");
        const allSkills = gameState.character?.knownSkills || [];
        const magicSkills = allSkills.filter((s) => s.type === "Magic");
        const skill = findInList(query, magicSkills);
        if (skill) {
          const cooldownTurns = gameState.character?.skillCooldowns.get(
            skill.id
          );
          if (cooldownTurns) {
            responseLog = [
              `A habilidade '${skill.name}' está em recarga! (${cooldownTurns} turnos).`,
            ];
            stopExecution = true;
          } else playerAction = { skill };
        } else {
          responseLog = [`Magia '${query}' não encontrada.`];
          stopExecution = true;
        }
      } else if (cmd === "use") {
        const query = args.join(" ");
        const allItems = gameState.character?.inventory || [];
        const potions = allItems.filter((i) => i.type === "Potion");
        const item = findInList(query, potions);
        if (item) playerAction = { item };
        else {
          const allSkills = gameState.character?.knownSkills || [];
          const nonMagicSkills = allSkills.filter((s) => s.type !== "Magic");
          const skill = findInList(query, nonMagicSkills);
          if (skill) {
            const cooldownTurns = gameState.character?.skillCooldowns.get(
              skill.id
            );
            if (cooldownTurns) {
              responseLog = [
                `A habilidade '${skill.name}' está em recarga! (${cooldownTurns} turnos).`,
              ];
              stopExecution = true;
            } else playerAction = { skill };
          } else {
            responseLog = [`'${query}' não é uma Poção ou Habilidade válida.`];
            stopExecution = true;
          }
        }
      }

      if (stopExecution) {
        setHistory((prev) => [...prev, ...responseLog]);
        return;
      }

      if (playerAction === "invalid") {
        responseLog = [
          "Comando inválido em combate. Use 'attack', 'run', 'use', 'cast', ou 'stats'.",
        ];
      } else {
        responseLog = processCombatTurn(playerAction);
      }
      setHistory((prev) => [...prev, ...responseLog]);
      return;
    }

    const requiresChar = [
      "stats",
      "train",
      "i",
      "inventory",
      "equip",
      "f",
      "find",
      "abilities",
      "up",
    ];
    if (requiresChar.includes(cmd) && !gameState.character) {
      response = [
        "Você precisa criar um personagem primeiro. Digite 'new game'.",
      ];
      setHistory((prev) => [...prev, ...response]);
      return;
    }

    switch (cmd) {
      case "up": {
        if (!gameState.character) {
          response = ["Crie um personagem."];
          break;
        }
        const stat = args[0] as TrainableStat;
        const amount = parseInt(args[1] || "1", 10);
        if (!["str", "dex", "int"].includes(stat)) {
          response = ["Uso: up [str | dex | int] [qtd]"];
          break;
        }
        if (gameState.character.attributePoints < amount) {
          response = [
            `Pontos insuficientes. Você tem ${gameState.character.attributePoints}.`,
          ];
          break;
        }
        dispatch({ type: "DISTRIBUTE_POINT", payload: { stat, amount } });
        response = [`Você aumentou ${stat.toUpperCase()} em ${amount}!`];
        break;
      }
      case "train": {
        if (!gameState.character) {
          response = ["Crie um personagem."];
          break;
        }
        const { character } = gameState;
        const now = Date.now();
        const oneDay = 1000 * 60 * 60 * 24;
        if (now - character.lastStaminaRefresh > oneDay) character.stamina = 3;

        if (character.stamina <= 0) {
          const timeLeft = oneDay - (now - character.lastStaminaRefresh);
          const hours = Math.floor(timeLeft / (1000 * 60 * 60));
          const minutes = Math.floor(
            (timeLeft % (1000 * 60 * 60)) / (1000 * 60)
          );
          response = [`Você está exausto. Volte em ${hours}h ${minutes}m.`];
          break;
        }

        const statToTrain = args[0]?.toLowerCase() as TrainableStat;
        if (!["str", "dex", "int"].includes(statToTrain)) {
          response = ["Uso: train [str | dex | int]"];
          break;
        }

        const gain = Math.floor(Math.random() * 3) + 1;
        const xp = Math.floor(Math.random() * 16) + 5;

        dispatch({ type: "TRAIN", payload: { stat: statToTrain, gain, xp } });
        dispatch({ type: "USE_STAMINA" });
        response = [
          `Treino intenso! +${gain} ${statToTrain.toUpperCase()} e +${xp} XP.`,
          `(Stamina: ${character.stamina - 1})`,
        ];
        break;
      }
      case "shop": {
        const stock = checkAndRefreshShop();
        response = [
          "--- Loja do Aventureiro ---",
          "(O estoque muda a cada hora)",
          ...stock.map(
            (item, index) =>
              `  ${index + 1}. ${item.name} (${item.type}) - ${item.price} G`
          ),
          "Use 'buy [numero]' para comprar.",
        ];
        break;
      }
      case "buy": {
        if (!gameState.character) {
          response = ["Crie um personagem primeiro."];
          break;
        }
        const stock = checkAndRefreshShop();
        const index = parseInt(args[0], 10) - 1;
        if (isNaN(index) || index < 0 || index >= stock.length) {
          response = [`Item inválido. Use 'buy [1-${stock.length}]'.`];
          break;
        }
        const itemToBuy = stock[index];
        if (gameState.character.gold < itemToBuy.price) {
          response = [`Você não tem Ouro suficiente! (${itemToBuy.price} G).`];
          break;
        }
        dispatch({
          type: "BUY_ITEM",
          payload: { item: itemToBuy, cost: itemToBuy.price },
        });
        response = [`Você comprou ${itemToBuy.name} por ${itemToBuy.price} G.`];
        break;
      }
      case "sell": {
        if (!gameState.character) {
          response = ["Crie um personagem primeiro."];
          break;
        }
        const query = args[0];
        const qtyArg = args[1];
        if (!query) {
          response = ["Uso: sell [nome/num] [qtd] (Ex: sell ouro 5)"];
          break;
        }
        const itemTemplate = findInList(query, gameState.character.inventory);
        if (!itemTemplate) {
          response = [`Item '${query}' não encontrado no inventário.`];
          break;
        }
        if (itemTemplate.price <= 0) {
          response = [`${itemTemplate.name} não tem valor comercial.`];
          break;
        }
        const countOwned = gameState.character.inventory.filter(
          (i) => i.id === itemTemplate.id
        ).length;
        let qtyToSell = 1;
        if (qtyArg) {
          const parsedQty = parseInt(qtyArg, 10);
          if (isNaN(parsedQty) || parsedQty <= 0) {
            response = [`Quantidade inválida: '${qtyArg}'.`];
            break;
          }
          qtyToSell = parsedQty;
        }
        if (qtyToSell > countOwned) {
          response = [`Você só tem ${countOwned}x ${itemTemplate.name}.`];
          break;
        }
        const sellPriceUnit = Math.floor(itemTemplate.price / 2);
        const totalGain = sellPriceUnit * qtyToSell;
        dispatch({
          type: "SELL_ITEM",
          payload: {
            itemId: itemTemplate.id,
            price: sellPriceUnit,
            qty: qtyToSell,
          },
        });
        response = [
          `Você vendeu ${qtyToSell}x ${itemTemplate.name} por ${totalGain} G.`,
        ];
        break;
      }
      case "evolve": {
        if (!gameState.character) {
          response = ["Crie um personagem primeiro."];
          break;
        }
        const char = gameState.character;
        const currentClass = char.charClass.name;
        const evolutionData = CLASS_EVOLUTIONS[currentClass];
        if (!evolutionData) {
          response = [
            `A classe ${currentClass} não tem mais evoluções disponíveis.`,
          ];
          break;
        }
        if (char.level < evolutionData.level) {
          response = [
            `Você precisa ser nível ${evolutionData.level} para evoluir (Nível atual: ${char.level}).`,
          ];
          break;
        }
        const inputQuery = args.join(" ");
        if (!inputQuery) {
          response = [
            `Evoluções disponíveis para ${currentClass}:`,
            ...evolutionData.options.map(
              (opt, index) => `  ${index + 1}. ${opt}`
            ),
            `Digite 'evolve [Nome ou Número]' para evoluir.`,
          ];
          break;
        }
        let validOption: string | undefined;
        const index = parseInt(inputQuery, 10);
        if (
          !isNaN(index) &&
          index > 0 &&
          index <= evolutionData.options.length
        ) {
          validOption = evolutionData.options[index - 1];
        } else {
          validOption = evolutionData.options.find(
            (opt) => opt.toLowerCase() === inputQuery.toLowerCase()
          );
        }
        if (validOption) {
          dispatch({ type: "EVOLVE_CLASS", payload: validOption });
          response = [
            `*** PARABÉNS! ***`,
            `Você evoluiu de ${currentClass} para ${validOption}!`,
            `Novas habilidades e poderes foram desbloqueados.`,
          ];
        } else {
          response = [
            `'${inputQuery}' não é uma opção válida. Escolha entre 1 e ${evolutionData.options.length}.`,
          ];
        }
        break;
      }
      case "help":
        response = showHelp();
        break;
      case "pn":
      case "patchnotes":
        response = showPatchNotes();
        break;
      case "repo":
        window.open("https://github.com/guigasprog/QuestTerm", "_blank");
        response = ["Abrindo repositório oficial..."];
        break;
      case "projects":
        response = showPortfolio();
        break;
      case "skills":
        response = showSkills();
        break;
      case "contact":
        response = [
          "Você pode me encontrar em: guilherme.d.martins@outlook.com",
          "Github: https://github.com/guigasprog",
        ];
        break;
      case "clear":
        setHistory([]);
        return;
      case "new":
        if (args[0] === "game") {
          dispatch({ type: "START_CREATION" });
          response = [
            "Iniciando criação...",
            "Qual é o nome do seu aventureiro?",
          ];
        } else response = [`Comando '${command}' não encontrado.`];
        break;
      case "ng":
        dispatch({ type: "START_CREATION" });
        response = [
          "Iniciando criação...",
          "Qual é o nome do seu aventureiro?",
        ];
        break;
      case "classes":
        response = listClasses();
        break;
      case "stats":
        response = showStats();
        break;
      case "inventory":
      case "i":
        response = showInventory();
        break;
      case "abilities":
        response = showAbilities();
        break;
      case "equip":
        response = handleEquip(args);
        break;
      case "find":
      case "f":
        if (args[0] === "battle" || cmd === "f") response = handleFindBattle();
        else response = [`Comando '${command}' não encontrado.`];
        break;
      case "open": {
        if (!projects || projects.length === 0) {
          response = [
            "Projetos ainda não carregados. Tente novamente em um segundo.",
          ];
          break;
        }
        const index = parseInt(args[0], 10) - 1;
        if (isNaN(index) || index < 0 || index >= projects.length) {
          response = [`Uso: open [1-${projects.length}]`];
        } else {
          const repo = projects[index];
          window.open(repo.html_url, "_blank");
          response = [`Abrindo ${repo.name} no GitHub...`];
        }
        break;
      }
      case "use": {
        if (!gameState.character) {
          response = ["Você precisa criar um personagem primeiro."];
          break;
        }
        const query = args.join(" ");
        if (!query) {
          response = ["Uso: use [nome do item] ou [numero do inventário]"];
          break;
        }
        const item = findInList(query, gameState.character.inventory);
        if (!item) {
          response = [`'${query}' não encontrado no inventário.`];
          break;
        }
        if (item.type !== "Potion") {
          response = [`Você só pode 'usar' poções fora de combate.`];
          break;
        }
        const potion = item as Potion;
        switch (potion.effect) {
          case "heal": {
            const maxHP = gameState.character.getCombatStats().hp;
            if (gameState.character.currentHP >= maxHP)
              response = ["Você já está com a vida cheia."];
            else {
              dispatch({ type: "PLAYER_HEAL", payload: potion.value });
              dispatch({ type: "REMOVE_ITEM_BY_ID", payload: potion.id });
              response = [
                `Você usou ${potion.name} e recuperou ${potion.value} HP.`,
              ];
            }
            break;
          }
          case "buff": {
            if (!potion.buffId || !potion.duration) {
              response = [
                "Erro: Esta poção de buff está configurada incorretamente.",
              ];
              break;
            }
            const statusId: StatusEffectId = potion.buffId;
            const duration = potion.duration;
            const potency = potion.value;
            dispatch({
              type: "APPLY_PLAYER_STATUS",
              payload: { id: statusId, duration: duration, potency: potency },
            });
            dispatch({ type: "REMOVE_ITEM_BY_ID", payload: potion.id });
            response = [
              `Você usou ${potion.name} e sente o efeito (${statusId}) por ${duration} turnos!`,
            ];
            break;
          }
          case "poison":
            response = [
              "Você se olha estranhamente... por que você usaria isso em você mesmo?",
            ];
            break;
        }
        break;
      }
      case "memorial":
        response = showMemorial();
        break;
      case "abandon":
        if (args[0] === "character") {
          if (gameState.character) {
            saveToMemorial(gameState.character);
            dispatch({ type: "ABANDON_CHARACTER" });
            response = [
              "Personagem abandonado. O progresso foi apagado.",
              "Digite 'new game' para começar de novo.",
            ];
          } else response = ["Não há personagem para abandonar."];
        } else
          response = [
            "Comando inválido. Você quis dizer: 'abandon character' ?",
          ];
        break;
      default:
        response = [`Comando '${command}' não encontrado. Digite 'help'.`];
    }

    setHistory((prev) => [...prev, ...response]);
  };

  return { history, executeCommand, gameState };
}
