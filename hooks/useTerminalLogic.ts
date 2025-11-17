import { useEffect, useReducer, useState } from 'react';
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
} from '@/lib/rpg.models';
import { 
  ITEMS_DB,
  MONSTERS_DB, 
  availableClasses
} from '@/lib/game-data';

const LOCALSTORAGE_KEY = 'questTermSaveGame';
const MEMORIAL_KEY = 'questTermMemorial';

interface GameState {
  character: Character | null;
  gameState: 'IDLE' | 'AWAITING_NAME' | 'AWAITING_CLASS' | 'IN_COMBAT';
  tempName: string;
  currentMonster: CombatMonster | null;
  combatLog: string[];
  shopStock: Item[];
  shopLastRefresh: number;
}

type GameAction =
  | { type: 'START_CREATION' }
  | { type: 'SET_NAME'; payload: string }
  | { type: 'SET_CLASS'; payload: string }
  | { type: 'TRAIN'; payload: TrainableStat }
  | { type: 'FIND_BATTLE'; payload: CombatMonster }
  | { type: 'PLAYER_ATTACK'; payload: { playerDamage: number; monsterDamage: number } }
  | { type: 'END_COMBAT'; payload: { exp: number; loot: Item[], log: string[], gold: number, monsterName: string } }
  | { type: 'RUN_AWAY' }
  | { type: 'GAME_OVER' }
  | { type: 'EQUIP_ITEM'; payload: Equipment }
  | { type: 'ADD_ITEM'; payload: Item }
  | { type: 'PLAYER_HEAL'; payload: number }
  | { type: 'REMOVE_ITEM_BY_ID'; payload: string }
  | { type: 'APPLY_PLAYER_STATUS'; payload: StatusEffect }
  | { type: 'SET_SHOP_STOCK'; payload: { stock: Item[]; timestamp: number } }
  | { type: 'BUY_ITEM'; payload: { item: Item; cost: number } }
  | { type: 'LOAD_CHARACTER'; payload: Character }
  | { type: 'ABANDON_CHARACTER' };

const initialGameState: GameState = {
  character: null,
  gameState: 'IDLE',
  tempName: '',
  currentMonster: null,
  combatLog: [],
  shopStock: [], 
  shopLastRefresh: 0,
};


  const cloneCharacter = (char: Character): Character => {
    // 1. Cria uma nova instância de classe
    const newChar = new Character(char.name, char.charClass);
    // 2. Copia todos os dados (level, hp, gold, stats, etc)
    Object.assign(newChar, char);
    // 3. Re-hidrata os Maps
    newChar.skillCooldowns = new Map(char.skillCooldowns);
    newChar.monsterKills = new Map(char.monsterKills);
    return newChar;
  };

function gameReducer(state: GameState, action: GameAction): GameState {
  if (!state.character) {
    switch (action.type) {
      case 'START_CREATION':
        return { ...initialGameState, gameState: 'AWAITING_NAME' };
      case 'SET_NAME':
        return { ...state, gameState: 'AWAITING_CLASS', tempName: action.payload };
      case 'SET_CLASS':
        const chosenClass = availableClasses.find(c => c.name.toLowerCase() === action.payload);
        if (!chosenClass) return state;
        return {
          ...state,
          gameState: 'IDLE',
          tempName: '',
          character: new Character(state.tempName, chosenClass),
        };
      case 'LOAD_CHARACTER':
        return { ...state, character: action.payload };
      default:
        return state;
    }
  }

  switch (action.type) {
    case 'TRAIN': {
      if (!state.character) return state;
      const newChar = cloneCharacter(state.character); // Clone
      newChar.baseStats[action.payload]++; // Modifique o clone
      return { ...state, character: newChar }; // Retorne o clone
    }
      
    case 'FIND_BATTLE':
      return { ...state, gameState: 'IN_COMBAT', currentMonster: action.payload, combatLog: [] };
    
    case 'PLAYER_ATTACK': {
      if (!state.currentMonster || !state.character) return state;
      const { playerDamage, monsterDamage } = action.payload;
      
      // O monstro também precisa ser clonado
      const newMonster = { ...state.currentMonster }; 
      newMonster.currentHP -= playerDamage;
      
      const newChar = cloneCharacter(state.character);
      newChar.currentHP -= monsterDamage;
      
      return { ...state, character: newChar, currentMonster: newMonster };
    }

    case 'END_COMBAT': { 
      if (!state.character) return state;
      const { exp, loot, log, gold, monsterName } = action.payload;
      const newChar = cloneCharacter(state.character);
      
      newChar.gold += gold;
      
      const currentKills = newChar.monsterKills.get(monsterName) || 0;
      newChar.monsterKills.set(monsterName, currentKills + 1);
      
      const leveledUp = newChar.addExp(exp); // Este método muta 'newChar'
      newChar.inventory.push(...loot);
      
      if (leveledUp) {
        log.push(`*** VOCÊ SUBIU DE NÍVEL! Agora você é nível ${newChar.level}! ***`);
      }
      return { ...state, gameState: 'IDLE', currentMonster: null, combatLog: log, character: newChar };
    }
      
    case 'RUN_AWAY':
      return { ...state, gameState: 'IDLE', currentMonster: null, combatLog: ["Você fugiu covardemente."] };
      
    case 'GAME_OVER': {
      if (!state.character) return state;
      const newChar = cloneCharacter(state.character);
      newChar.exp = Math.floor(newChar.exp / 2);
      newChar.currentHP = newChar.getCombatStats().hp;
      return { ...state, gameState: 'IDLE', currentMonster: null, combatLog: ["Você morreu e perdeu metade do seu EXP..."], character: newChar };
    }
      
    case 'EQUIP_ITEM': {
      if (!state.character) return state;
      const newChar = cloneCharacter(state.character);
      const item = action.payload;
      const oldItem = newChar.equipment[item.slot];
      
      if (oldItem) newChar.inventory.push(oldItem);
      newChar.inventory = newChar.inventory.filter(i => i.id !== item.id);
      newChar.equipment[item.slot] = item;
      newChar.currentHP = Math.min(
        newChar.getCombatStats().hp, 
        newChar.currentHP + (item.stats.hp || 0)
      );
      return { ...state, character: newChar };
    }

    case 'SET_SHOP_STOCK':
      return { 
        ...state, 
        shopStock: action.payload.stock, 
        shopLastRefresh: action.payload.timestamp 
      };

    case 'BUY_ITEM':
      if (!state.character) return state;
      const newCharBuy = cloneCharacter(state.character);
      const { item, cost } = action.payload;
      newCharBuy.gold -= cost;
      newCharBuy.inventory.push(item);
      return { ...state, character: newCharBuy };

    case 'ADD_ITEM':
      if (!state.character) return state;
      const newCharAdd = cloneCharacter(state.character);
      newCharAdd.inventory.push(action.payload);
      return { ...state, character: newCharAdd };

    case 'PLAYER_HEAL': {
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

    case 'REMOVE_ITEM_BY_ID': {
      if (!state.character) return state;
      const newCharRemove = cloneCharacter(state.character);
      const index = newCharRemove.inventory.findIndex(i => i.id === action.payload);
      if (index > -1) {
        newCharRemove.inventory.splice(index, 1);
      }
      return { ...state, character: newCharRemove };
    }

    case 'APPLY_PLAYER_STATUS': {
      if (!state.character) return state;
      const newCharStatus = cloneCharacter(state.character);
      newCharStatus.addStatusEffect(action.payload); // Método muta newCharStatus
      return { ...state, character: newCharStatus };
    }

    case 'ABANDON_CHARACTER':
      return initialGameState;

    default:
      return state;
  }
}

export function useTerminalLogic() {

  const [history, setHistory] = useState<string[]>([
    "Bem-vindo ao QuestTerm (v1.0.0)",
    "Portfólio interativo de Guilherme Delgado Martins.",
    "Digite 'help' para ver a lista de comandos."
  ]);
  
  const [gameState, dispatch] = useReducer(gameReducer, initialGameState);

  const [projects, setProjects] = useState<GitHubRepo[] | null>(null);

  const saveToMemorial = (character: Character) => {
    try {
      const entry: MemorialEntry = {
        id: `${Date.now()}-${character.name}`,
        date: new Date().toLocaleString('pt-BR'),
        name: character.name,
        className: character.charClass.name,
        level: character.level,
        gold: character.gold,
        finalStats: character.getCombatStats(),
        equipment: {
          weapon: character.equipment.weapon?.name || 'Nenhum',
          armor: character.equipment.armor?.name || 'Nenhum',
        },
        monsterKills: Array.from(character.monsterKills.entries()),
      };

      const savedMemorial = localStorage.getItem(MEMORIAL_KEY);
      const entries: MemorialEntry[] = savedMemorial ? JSON.parse(savedMemorial) : [];

      entries.push(entry);

      localStorage.setItem(MEMORIAL_KEY, JSON.stringify(entries));

    } catch (err) {
      console.error("Falha ao salvar no memorial", err);
    }
  };

  const showMemorial = (): string[] => {
    const savedMemorial = localStorage.getItem(MEMORIAL_KEY);
    if (!savedMemorial) {
      return ["O Memorial dos Heróis Caídos está vazio."];
    }
    
    const entries: MemorialEntry[] = JSON.parse(savedMemorial);
    if (entries.length === 0) {
      return ["O Memorial dos Heróis Caídos está vazio."];
    }
    
    const log: string[] = ["--- Memorial dos Heróis Caídos ---"];
    
    const lastHero = entries[entries.length - 1];

    log.push(`Último Herói: ${lastHero.name}, o ${lastHero.className} (Nível ${lastHero.level})`);
    log.push(`  Registrado em: ${lastHero.date}`);
    log.push(`  Ouro Final: ${lastHero.gold} G`);
    log.push(`  Equipamento: ${lastHero.equipment.weapon} | ${lastHero.equipment.armor}`);
    log.push(`  Atributos Finais: HP(${lastHero.finalStats.hp}) STR(${lastHero.finalStats.str}) DEX(${lastHero.finalStats.dex}) INT(${lastHero.finalStats.int})`);
    
    if (lastHero.monsterKills.length > 0) {
      log.push("  Registro de Eliminações:");
      lastHero.monsterKills.forEach(([name, count]) => {
        log.push(`    - ${name}: ${count}`);
      });
    } else {
      log.push("  Não eliminou nenhum monstro.");
    }
    
    if (entries.length > 1) {
      log.push(`(E ${entries.length - 1} outros heróis caídos...)`);
    }

    return log;
  };

  useEffect(() => {
    const GITHUB_USERNAME = 'guigasprog';
    const API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=pushed&direction=desc&per_page=6`;

    const fetchProjects = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error('Falha ao buscar dados do GitHub');
        }
        const data: GitHubRepo[] = await response.json();
        setProjects(data);
      } catch (error) {
        console.error(error);
        setProjects([]);
      }
    };

    fetchProjects();
  }, []);

  useEffect(() => {
    try {
      const savedString = localStorage.getItem(LOCALSTORAGE_KEY);
      if (savedString) {
        const savedData = JSON.parse(savedString);
        
        const charClass = availableClasses.find(c => c.name === savedData.charClass.name);

        if (charClass) {
          const newChar = new Character(savedData.name, charClass);
          Object.assign(newChar, savedData);
          newChar.skillCooldowns = new Map(savedData.skillCooldowns);
          newChar.monsterKills = new Map(savedData.monsterKills);
          dispatch({ type: 'LOAD_CHARACTER', payload: newChar });
          setHistory(prev => [...prev, `Jogo salvo de '${newChar.name}' (Nível ${newChar.level}) carregado.`]);
        }
      } else {
        setHistory(prev => [...prev, "Digite 'new game' para começar uma nova aventura."]);
      }
    } catch (err) {
      console.error("Falha ao carregar save", err);
      localStorage.removeItem(LOCALSTORAGE_KEY);
      setHistory(prev => [...prev, "Save corrompido. Comece um novo jogo."]);
    }
  }, []); 

  useEffect(() => {
    try {
      if (gameState.character) {
        const dataToSave = { 
          ...gameState.character, 
          skillCooldowns: Array.from(gameState.character.skillCooldowns.entries()),
          monsterKills: Array.from(gameState.character.monsterKills.entries()) 
        };
        localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(dataToSave));
      } else {
        localStorage.removeItem(LOCALSTORAGE_KEY);
      }
    } catch (err) {
      console.error("Falha ao salvar jogo", err);
    }
  }, [gameState.character]);

  const processCombatTurn = (action: 'attack' | 'run' | { skill: Skill } | { item: Item }): string[] => {
    const { character, currentMonster } = gameState;
    if (!character || !currentMonster) return ["Erro: Combate inválido."];

    const playerStats = character.getCombatStats();
    const log: string[] = [];
    let playerDamage = 0;
    
    if (action === 'attack') {
      const monsterStats = currentMonster.stats;
      playerDamage = Math.max(1, Math.floor(playerStats.str - (monsterStats.dex / 2)));
      currentMonster.currentHP -= playerDamage;
      log.push(`> Você ataca o ${currentMonster.name} causando ${playerDamage} de dano.`);
      
    } else if (action === 'run') {
      log.push("> Você tenta fugir...");
      const playerLevel = character.level;
      const monsterLevel = currentMonster.minLevel;
      const levelDifference = monsterLevel - playerLevel;

      const baseChance = 0.8;
      const penaltyPerLevel = 0.1;
      const dexBonus = playerStats.dex * 0.015;
      
      let escapeChance = baseChance - (levelDifference * penaltyPerLevel) + dexBonus;
      escapeChance = Math.max(0.1, Math.min(0.95, escapeChance));
      
      const roll = Math.random();
          
      if (roll <= escapeChance) {
        dispatch({ type: 'RUN_AWAY' });
        log.push("  ...e consegue escapar!");
        return log;
      } else {
        log.push("  ...mas o monstro bloqueia seu caminho!");
      }

    } else if ('item' in action) {
      log.push(`> Você usa '${action.item.name}'!`);
      
      if (action.item.type === 'Potion') {
        const potion = action.item as Potion;
        if (potion.effect === 'heal') {
          dispatch({ type: 'PLAYER_HEAL', payload: potion.value });
          log.push(`  Você recupera ${potion.value} HP.`);
        }
      }
      dispatch({ type: 'REMOVE_ITEM_BY_ID', payload: action.item.id });

    } else {
      const skill = action.skill;
      log.push(`> Você usa '${skill.name}'!`);
      character.skillCooldowns.set(skill.id, skill.cooldown);
      const target = skill.target === 'Self' ? character : currentMonster;

      skill.effects.forEach(effect => {
        switch (effect.type) {
          case 'apply_status': {
            const intPotencyBonus = Math.floor(playerStats.int / 4);
            const dexDurationBonus = (Math.random() < (playerStats.dex / 25) ? 1 : 0);
            
            const finalPotency = (effect.potency || 0) + intPotencyBonus;
            const finalDuration = effect.duration + dexDurationBonus;

            const newEffect: StatusEffect = { 
              id: effect.effectId, 
              duration: finalDuration, 
              potency: finalPotency > 0 ? finalPotency : undefined
            };

            if ('charClass' in target) {
              target.addStatusEffect(newEffect);
            } else {
              target.statusEffects = target.statusEffects.filter(e => e.id !== newEffect.id);
              target.statusEffects.push(newEffect);
            }
            log.push(`  O ${target.name} é afetado por '${effect.effectId}'!`);
            break;
          }
          case 'direct_damage':
            const intDamageBonus = Math.floor(playerStats.int / 2);
            playerDamage = effect.value + intDamageBonus;
            currentMonster.currentHP -= playerDamage;
            log.push(`  Causando ${effect.value} + (${intDamageBonus}) de dano!`);
            break;
        }
      });
    }

    currentMonster.statusEffects.forEach(effect => {
      if (effect.id === 'poisoned' && effect.potency) {
        currentMonster.currentHP -= effect.potency;
        log.push(`> O ${currentMonster.name} sofre ${effect.potency} de dano de veneno.`);
      }
      if (effect.id === 'burning' && effect.potency) {
        currentMonster.currentHP -= effect.potency;
        log.push(`> O ${currentMonster.name} sofre ${effect.potency} de dano de fogo.`);
      }
    });

    if (currentMonster.currentHP <= 0) {
      log.push(`> O ${currentMonster.name} foi derrotado!`);
      
      const loot: Item[] = []; 
      let goldFound = 0;

      currentMonster.lootTable.forEach(drop => {
        if (Math.random() < drop.dropChance) {
          const baseItem = drop.item;
          switch (baseItem.type) {
            case 'Currency': {
              const baseAmount = currentMonster.minLevel * 2;
              const randomFactor = (Math.random() - 0.5);
              const amount = Math.max(1, Math.floor(baseAmount + baseAmount * randomFactor));
              goldFound += amount;
              log.push(`  + Você encontrou ${amount}x ${baseItem.name}!`);
              break;
            }
            case 'Potion': {
              const amount = Math.random() < 0.8 ? 1 : 2;
              for (let i = 0; i < amount; i++) {
                loot.push(baseItem);
              }
              log.push(`  + Você encontrou ${amount}x ${baseItem.name}!`);
              break;
            }
            case 'Equipment': {
              loot.push(baseItem);
              log.push(`  + Você encontrou ${baseItem.name}!`);
              break;
            }
          }
        }
      });

      const exp = currentMonster.expReward;
      
      dispatch({ type: 'END_COMBAT', payload: { 
        exp, 
        loot, 
        log, 
        gold: goldFound, 
        monsterName: currentMonster.name // <-- PASSE O NOME
      }});
      
      log.push(`Você ganhou ${exp} EXP.`);
      if (loot.length === 0 && goldFound === 0) {
        log.push("O monstro não derrubou nada.");
      }
      
      return log;
    }
    
    const isParalyzed = currentMonster.statusEffects.find(e => e.id === 'paralyzed');

    if (isParalyzed) {
      log.push(`> O ${currentMonster.name} está paralisado e não pode se mover!`);
    } else {
      const isInvisible = character.statusEffects.find(e => e.id === 'invisible');
      
      if (isInvisible) {
        log.push(`> O ${currentMonster.name} ataca, mas você está invisível e ele erra!`);
      } else {
        const monsterStats = currentMonster.stats;
        let monsterDamage = Math.max(1, Math.floor(monsterStats.str - (playerStats.dex / 2)));
        
        const reduceDmg = character.statusEffects.find(e => e.id === 'damage_reduction');
        if (reduceDmg && reduceDmg.potency) {
          monsterDamage = Math.max(0, monsterDamage - reduceDmg.potency);
          log.push(`  Sua 'Casca Grossa' reduz o dano!`);
        }
        
        character.currentHP -= monsterDamage;
        log.push(`> O ${currentMonster.name} ataca você causando ${monsterDamage} de dano.`);
      }
    }

    character.tickTurn();
    currentMonster.statusEffects = currentMonster.statusEffects.filter(e => {
      e.duration--;
      return e.duration > 0;
    });

    if (character.currentHP <= 0) {
      log.push(`> *** VOCÊ MORREU ***`);
      saveToMemorial(character);
      dispatch({ type: 'GAME_OVER' });
      return log;
    }

    return log;
  };

  const generateShopStock = (): Item[] => {
    const vendorableItems = Object.values(ITEMS_DB).filter(item => 
      (item.type === 'Potion' || item.type === 'Equipment') && item.price > 0
    );
    const shuffled = vendorableItems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const checkAndRefreshShop = (): Item[] => {
    const now = Date.now();
    const oneHour = 1000 * 60 * 60;
    const timeElapsed = now - gameState.shopLastRefresh;

    if (timeElapsed > oneHour || gameState.shopStock.length === 0) {
      const newStock = generateShopStock();
      dispatch({ 
        type: 'SET_SHOP_STOCK', 
        payload: { stock: newStock, timestamp: now } 
      });
      return newStock;
    }
    
    return gameState.shopStock;
  };

  const handleFindBattle = (): string[] => {
    if (!gameState.character) return ["Crie um personagem primeiro."];
    
    const charLevel = gameState.character.level;
    const availableSpawns = MONSTERS_DB.filter(m => m.minLevel <= charLevel);
    const weightedSpawns = availableSpawns.flatMap(m => Array(m.minLevel).fill(m));
    if (weightedSpawns.length === 0) return ["Nenhum monstro encontrado..."];
    const monsterTemplate = weightedSpawns[Math.floor(Math.random() * weightedSpawns.length)];

    const combatMonster: CombatMonster = {
      ...monsterTemplate,
      currentHP: monsterTemplate.stats.hp,
      statusEffects: []
    };
    
    dispatch({ type: 'FIND_BATTLE', payload: combatMonster });
    return [
      `!!! Um ${combatMonster.name} selvagem (Nível ${combatMonster.minLevel}) aparece !!!`, 
      "Digite 'attack', 'use', 'cast' ou 'run'."
    ];
  };

  const handleEquip = (args: string[]): string[] => {
    if (!gameState.character) return ["Crie um personagem primeiro."];
    const itemName = args.join(' ');
    if (!itemName) return ["Uso: equip [nome do item]"];
    
    const item = gameState.character.inventory.find(i => i.name.toLowerCase() === itemName.toLowerCase());
    
    if (!item) return [`Item '${itemName}' não encontrado no inventário.`];
    if (item.type !== 'Equipment') return [`'${item.name}' não é um item equipável.`];
    
    dispatch({ type: 'EQUIP_ITEM', payload: item as Equipment });
    return [`Você equipou ${item.name}.`];
  };

  const showAbilities = (): string[] => {
    if (!gameState.character) return ["Crie um personagem primeiro."];
    const { knownSkills, skillCooldowns } = gameState.character;
    
    if (knownSkills.length === 0) return ["Você não conhece nenhuma habilidade."];

    return [
      '--- Suas Habilidades ---',
      ...knownSkills.map(skill => {
        const cooldown = skillCooldowns.get(skill.id);
        return `  - ${skill.name} (${skill.type}) [${cooldown ? `RECARGA: ${cooldown}t` : 'PRONTO'}]\n     ${skill.description}`;
      })
    ];
  };

  const showHelp = (): string[] => [
    '--- Comandos do Portfólio ---',
    '  help           - Mostra esta lista de ajuda.',
    '  projects       - Exibe meus projetos do GitHub.',
    '  open [numero]  - Abre um projeto no GitHub.',
    '  skills         - Lista minhas habilidades técnicas.',
    '  contact        - Mostra minhas informações de contato.',
    '  clear          - Limpa o histórico do terminal.',
    '',
    '--- Comandos do RPG (Fora de Combate) ---',
    '  new game | ng  - Inicia a criação de um novo personagem.',
    '  abandon character - Apaga seu personagem salvo.',
    '  memorial       - Mostra o registro do último herói caído.',
    '  stats          - Exibe os atributos do seu personagem.',
    '  abilities      - Lista suas habilidades e magias.',
    '  i | inventory  - Mostra seu inventário.',
    '  use [item]     - Usa um item (ex: Poção de Cura).',
    '  equip [item]   - Equipa um item do inventário.',
    '  train          - Treina e melhora 1 atributo aleatório.',
    '  f | find battle - Procura por um monstro para lutar.',
    '  shop           - Mostra a loja (estoque rotativo).',
    '  buy [numero]   - Compra um item da loja.',
    '',
    '--- Comandos de Combate (Apenas em batalha) ---',
    '  stats          - Mostra stats do jogador e monstro (ação livre).',
    '  a | attack     - Ataca o monstro com sua arma.',
    '  use [item/hab] - Usa um ITEM (Poção) ou HABILIDADE (Grito de Guerra).',
    '  cast [magia]   - Lança uma MAGIA (Bola de Fogo).',
    '  run            - Tenta fugir da batalha.'
  ];

  const listClasses = (): string[] => {
    return availableClasses.map(c => 
      `  - ${c.name}: ${c.description} (HP:${c.baseStats.hp} STR:${c.baseStats.str} DEX:${c.baseStats.dex} INT:${c.baseStats.int})`
    );
  };
  
  const showPortfolio = (): string[] => {
    if (projects === null) {
      return ["Carregando projetos do GitHub..."];
    }
    
    if (projects.length === 0) {
      return ["Não foi possível carregar projetos ou nenhum repositório encontrado."];
    }
    
    const projectLines = projects.map((repo, index) => {
      const description = repo.description || 'Sem descrição.';
      return `  ${index + 1}. ${repo.name} (★${repo.stargazers_count})\n     - ${description}`;
    });

    return [
      '--- Meus Projetos (do GitHub) ---',
      ...projectLines,
      "  (Use `open [número]` para abrir no navegador)"
    ];
  };
  
  const showSkills = (): string[] => [
    '--- Habilidades ---',
    '  Frontend:   Angular, React, TypeScript, TailwindCSS',
    '  Backend:    Java (Spring-Boot), Node.js (Express)',
    '  Mobile:     React Native (Expo, Bare)',
    '  Database:   PostgreSQL, MongoDB, Redis',
    '  DevOps:     Docker, GitHub Actions, AWS (S3, EC2)',
    '  Design:     Figma, UI/UX Principles'
  ];

  const showStats = (): string[] => {
    if (!gameState.character) return ["Sem personagem. Digite 'new character'."];
    
    const char = gameState.character;
    const base = char.baseStats;
    const combat = char.getCombatStats();
    const statsLines = [
      `--- STATUS: ${char.name} (O ${char.charClass.name}) ---`,
      `  Nível: ${char.level} (${char.exp} / ${char.expToNextLevel} EXP)`,
      `  Ouro:  ${char.gold} G`,
      `  HP:    ${char.currentHP} / ${combat.hp} ${combat.hp > base.hp ? `(${base.hp}+${combat.hp - base.hp})` : ''}`,
      `  STR:   ${combat.str} ${combat.str > base.str ? `(${base.str}+${combat.str - base.str})` : ''}`,
      `  DEX:   ${combat.dex} ${combat.dex > base.dex ? `(${base.dex}+${combat.dex - base.dex})` : ''}`,
      `  INT:   ${combat.int} ${combat.int > base.int ? `(${base.int}+${combat.int - base.int})` : ''}`,
      `--- Equipamento ---`,
      `  Arma:  ${char.equipment.weapon?.name || 'Nenhuma'}`,
      `  Armadura: ${char.equipment.armor?.name || 'Nenhuma'}`,
    ];
    if (gameState.character && gameState.character.statusEffects.length > 0) {
      statsLines.push('--- Efeitos Ativos ---');
      gameState.character.statusEffects.forEach(e => {
        statsLines.push(`  - ${e.id} (${e.duration} turnos restantes)`);
      });
    }
    return statsLines;
  };

  const showMonsterStats = (monster: CombatMonster): string[] => {
    return [
      `--- STATUS: ${monster.name} (Nível ${monster.minLevel}) ---`,
      `  HP:  ${monster.currentHP} / ${monster.stats.hp}`,
      `  STR: ${monster.stats.str} | DEX: ${monster.stats.dex} | INT: ${monster.stats.int}`,
      `  Efeitos: ${monster.statusEffects.length > 0 ? monster.statusEffects.map(e => e.id).join(', ') : 'Nenhum'}`,
    ];
  };

  const showInventory = (): string[] => {
    if (!gameState.character || gameState.character.inventory.length === 0) {
      return ["Seu inventário está vazio."];
    }
    return [
      '--- Inventário ---',
      ...Object.entries(
        gameState.character.inventory.reduce((acc, item) => {
          acc[item.name] = (acc[item.name] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      ).map(([name, count]) => `  - ${name} ${count > 1 ? `(x${count})` : ''}`)
    ];
  };

  const executeCommand = (command: string) => {
    const lowerCommand = command.toLowerCase().trim();
    const [cmd, ...args] = lowerCommand.split(' ');

    setHistory(prev => [...prev, `> ${command}`]);
    
    let response: string[] = [];

    if (gameState.gameState === 'AWAITING_NAME') {
      dispatch({ type: 'SET_NAME', payload: command.trim() });
      response = [`Belo nome, ${command.trim()}!`, "Agora, escolha sua classe (digite o nome):", ...listClasses()];
      setHistory(prev => [...prev, ...response]);
      return;
    }
    
    if (gameState.gameState === 'AWAITING_CLASS') {
      dispatch({ type: 'SET_CLASS', payload: lowerCommand });
      const chosenClass = availableClasses.find(c => c.name.toLowerCase() === lowerCommand);
      if (chosenClass) {
        response = [`Personagem criado! Você é um ${chosenClass.name}.`, "Digite 'stats' para ver seus atributos ou 'f' para encontrar uma batalha."];
      } else {
        response = ["Classe não encontrada. Tente novamente:", ...listClasses()];
      }
      setHistory(prev => [...prev, ...response]);
      return;
    }
    
    if (gameState.gameState === 'IN_COMBAT') {
      let playerAction: 'attack' | 'run' | 'invalid' | { skill: Skill } | { item: Item } = 'invalid';
      let responseLog: string[] = [];
      let stopExecution = false;

      if (cmd === 'stats') {
        responseLog.push(...showStats());
        if (gameState.currentMonster) {
          responseLog.push(...showMonsterStats(gameState.currentMonster));
        }
        stopExecution = true;
      }
      
      else if ((cmd === 'cast' || cmd === 'use') && args.length === 0) {
        responseLog = (cmd === 'use') ? showInventory() : showAbilities();
        stopExecution = true;
      }

      if (stopExecution) {
        setHistory(prev => [...prev, ...responseLog]);
        return;
      }

      if (cmd === 'attack' || cmd === 'a') {
        playerAction = 'attack';
      } 
      
      else if (cmd === 'run') {
        playerAction = 'run';
      }
      
      else if (cmd === 'cast') {
        const skillName = args.join(' ');
        const skill = gameState.character?.knownSkills.find(s => s.name.toLowerCase() === skillName.toLowerCase());
        
        if (skill) {
          if (skill.type !== 'Magic') {
            responseLog = [`'${skill.name}' é uma Habilidade. Use 'use'.`];
            stopExecution = true;
          } else {
            const cooldownTurns = gameState.character?.skillCooldowns.get(skill.id);
            if (cooldownTurns) {
              responseLog = [`A habilidade '${skill.name}' está em recarga! (${cooldownTurns} turnos).`];
              stopExecution = true;
            } else {
              playerAction = { skill };
            }
          }
        } else {
          responseLog = [`Magia '${skillName}' não encontrada.`];
          stopExecution = true;
        }
      } 
      
      else if (cmd === 'use') {
        const name = args.join(' ');
        const item = gameState.character?.inventory.find(i => i.name.toLowerCase() === name.toLowerCase());
        
        if (item) {
          if (item.type === 'Potion') {
            playerAction = { item };
          } else {
            responseLog = [`Você não pode 'usar' ${item.name} em combate.`];
            stopExecution = true;
          }
        } else {
          const skill = gameState.character?.knownSkills.find(s => s.name.toLowerCase() === name.toLowerCase());
          if (skill) {
            if (skill.type !== 'Skill') {
              responseLog = [`'${skill.name}' é uma Magia. Use 'cast'.`];
              stopExecution = true;
            } else {
              const cooldownTurns = gameState.character?.skillCooldowns.get(skill.id);
              if (cooldownTurns) {
                responseLog = [`A habilidade '${skill.name}' está em recarga! (${cooldownTurns} turnos).`];
                stopExecution = true;
              } else {
                playerAction = { skill };
              }
            }
          } else {
            responseLog = [`'${name}' não encontrado no inventário ou nas habilidades.`];
            stopExecution = true;
          }
        }
      }

      if (stopExecution) {
        setHistory(prev => [...prev, ...responseLog]);
        return;
      }
      
      if (playerAction === 'invalid') {
        responseLog = ["Comando inválido em combate. Use 'attack', 'run', 'use', 'cast', ou 'stats'."];
      } else {
        responseLog = processCombatTurn(playerAction); 
      }
      
      setHistory(prev => [...prev, ...responseLog]);
      return;
    }

    const requiresChar = ['stats', 'train', 'i', 'inventory', 'equip', 'f', 'find', 'abilities'];
    if (requiresChar.includes(cmd) && !gameState.character) {
      response = ["Você precisa criar um personagem primeiro. Digite 'new game'."];
      setHistory(prev => [...prev, ...response]);
      return;
    }

    switch (cmd) {
      case 'shop': {
        const stock = checkAndRefreshShop();
        response = [
          "--- Loja do Aventureiro ---",
          "(O estoque muda a cada hora)",
          ...stock.map((item, index) => 
            `  ${index + 1}. ${item.name} (${item.type}) - ${item.price} G`
          ),
          "Use 'buy [numero]' para comprar."
        ];
        break;
      }

      case 'buy': {
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

        dispatch({ type: 'BUY_ITEM', payload: { item: itemToBuy, cost: itemToBuy.price } });
        response = [`Você comprou ${itemToBuy.name} por ${itemToBuy.price} G.`];
        break;
      }
      case 'help':
        response = showHelp();
        break;
      case 'projects':
        response = showPortfolio();
        break;
      case 'skills':
        response = showSkills();
        break;
      case 'contact':
        response = ['Você pode me encontrar em: guilherme.d.martins@outlook.com', 'Github: https://github.com/guigasprog'];
        break;
      case 'clear':
        setHistory([]);
        return;
      case 'new':
        if (args[0] === 'game') {
          dispatch({ type: 'START_CREATION' });
          response = ["Iniciando criação...", "Qual é o nome do seu aventureiro?"];
        } else {
           response = [`Comando '${command}' não encontrado.`];
        }
        break;
      case 'ng':
        dispatch({ type: 'START_CREATION' });
        response = ["Iniciando criação...", "Qual é o nome do seu aventureiro?"];
        break;
      case 'classes':
        response = listClasses();
        break;
      case 'stats':
        response = showStats();
        break;
      case 'train':
        const statsPool: TrainableStat[] = ['str', 'dex', 'int'];
        const randomStat = statsPool[Math.floor(Math.random() * statsPool.length)];
        dispatch({ type: 'TRAIN', payload: randomStat });
        response = [`Você treinou arduamente e aumentou sua ${randomStat.toUpperCase()}!`, "(Digite 'stats' para ver)"];
        break;
      case 'inventory':
      case 'i':
        response = showInventory();
        break;
      case 'abilities':
        response = showAbilities();
        break;
      case 'equip':
        response = handleEquip(args);
        break;
      case 'find':
      case 'f':
        if (args[0] === 'battle' || cmd === 'f') {
          response = handleFindBattle();
        } else {
           response = [`Comando '${command}' não encontrado.`];
        }
        break;
      case 'open': {
        if (!projects || projects.length === 0) {
          response = ["Projetos ainda não carregados. Tente novamente em um segundo."];
          break;
        }
        const index = parseInt(args[0], 10) - 1;
        
        if (isNaN(index) || index < 0 || index >= projects.length) {
          response = [`Uso: open [1-${projects.length}]`];
        } else {
          const repo = projects[index];
          window.open(repo.html_url, '_blank');
          response = [`Abrindo ${repo.name} no GitHub...`];
        }
        break;
      }
      case 'use': {
        if (!gameState.character) {
          response = ["Você precisa criar um personagem primeiro."];
          break;
        }
        
        const name = args.join(' ');
        if (!name) {
          response = ["Uso: use [nome do item]"];
          break;
        }

        const item = gameState.character.inventory.find(i => i.name.toLowerCase() === name.toLowerCase());

        if (!item) {
          response = [`'${name}' não encontrado no inventário.`];
          break;
        }

        if (item.type !== 'Potion') {
          response = [`Você só pode 'usar' poções fora de combate.`];
          break;
        }

        const potion = item as Potion;

        switch (potion.effect) {
          case 'heal': {
            const maxHP = gameState.character.getCombatStats().hp;
            if (gameState.character.currentHP >= maxHP) {
              response = ["Você já está com a vida cheia."];
            } else {
              dispatch({ type: 'PLAYER_HEAL', payload: potion.value });
              dispatch({ type: 'REMOVE_ITEM_BY_ID', payload: potion.id });
              response = [`Você usou ${potion.name} e recuperou ${potion.value} HP.`];
            }
            break;
          }

          case 'buff': {
            if (!potion.buffId || !potion.duration) {
              response = ["Erro: Esta poção de buff está configurada incorretamente."];
              break;
            }

            const statusId: StatusEffectId = potion.buffId;
            const duration = potion.duration;
            const potency = potion.value;

            dispatch({ 
              type: 'APPLY_PLAYER_STATUS', 
              payload: { id: statusId, duration: duration, potency: potency } 
            });
            dispatch({ type: 'REMOVE_ITEM_BY_ID', payload: potion.id });
            response = [`Você usou ${potion.name} e sente o efeito (${statusId}) por ${duration} turnos!`];
            break;
          }

          case 'poison': {
            response = ["Você se olha estranhamente... por que você usaria isso em você mesmo?"];
            break;
          }
        }
        break;
      }
      case 'memorial':
        response = showMemorial();
        break;
      case 'abandon':
        if (args[0] === 'character') {
          if (gameState.character) {
            saveToMemorial(gameState.character);
            dispatch({ type: 'ABANDON_CHARACTER' });
            response = ["Personagem abandonado. O progresso foi apagado.", "Digite 'new game' para começar de novo."];
          } else {
            response = ["Não há personagem para abandonar."];
          }
        } else {
          response = ["Comando inválido. Você quis dizer: 'abandon character' ?"];
        }
        break;
      default:
        response = [`Comando '${command}' não encontrado. Digite 'help'.`];
    }
    
    setHistory(prev => [...prev, ...response]);
  };

  return { history, executeCommand, gameState };
}