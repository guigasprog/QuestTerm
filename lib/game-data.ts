import {
  CharacterClass,
  Equipment,
  Item,
  Monster,
  Potion,
  Skill,
  Currency,
  Summon,
} from "./rpg.models";

export const SUMMONS_DB: Record<string, Summon> = {
  // --- NECROMANCIA (Invocador -> Necromante) ---
  s_skeleton: {
    id: "s_skeleton",
    name: "Esqueleto Guerreiro",
    stats: { hp: 40, maxHp: 40, dmg: 10 }, // Básico: "Carne de canhão"
  },
  s_zombie: {
    id: "s_zombie",
    name: "Zumbi Putrefato",
    stats: { hp: 80, maxHp: 80, dmg: 5 }, // Tanque inicial
  },
  s_flesh_golem: {
    id: "s_flesh_golem",
    name: "Golem de Carne",
    stats: { hp: 200, maxHp: 200, dmg: 20 }, // Tanque de Elite (Necromante)
  },
  s_lich_pet: {
    id: "s_lich_pet",
    name: "Servo Lich",
    stats: { hp: 100, maxHp: 100, dmg: 45 }, // DPS Mágico de Elite
  },

  // --- ELEMENTALISMO (Invocador -> Mestre Elemental) ---
  s_fire_elem: {
    id: "s_fire_elem",
    name: "Elemental de Fogo",
    stats: { hp: 60, maxHp: 60, dmg: 30 }, // DPS Alto (Vidro)
  },
  s_earth_elem: {
    id: "s_earth_elem",
    name: "Elemental de Terra",
    stats: { hp: 150, maxHp: 150, dmg: 10 }, // Tanque Puro
  },
  s_storm_elem: {
    id: "s_storm_elem",
    name: "Elemental da Tempestade",
    stats: { hp: 120, maxHp: 120, dmg: 50 }, // Elite DPS (Mestre Elemental)
  },

  // --- NATUREZA / BESTIAL (Druida -> Xamã / Caçador -> Beastmaster) ---
  s_wolf: {
    id: "s_wolf",
    name: "Lobo Espiritual",
    stats: { hp: 50, maxHp: 50, dmg: 15 }, // Equilibrado e Rápido
  },
  s_bear: {
    id: "s_bear",
    name: "Urso Pardo",
    stats: { hp: 120, maxHp: 120, dmg: 12 }, // Tanque Bestial
  },
  s_treant: {
    id: "s_treant",
    name: "Ent Guardião",
    stats: { hp: 300, maxHp: 300, dmg: 35 }, // Elite (Avatar da Natureza / Guardião de Gaia)
  },
  s_raptor: {
    id: "s_raptor",
    name: "Raptor Alpha",
    stats: { hp: 80, maxHp: 80, dmg: 40 }, // Elite DPS (Senhor das Feras)
  },

  // --- OUTROS (Ladino/Sombra) ---
  s_shadow_clone: {
    id: "s_shadow_clone",
    name: "Clone das Sombras",
    stats: { hp: 1, maxHp: 1, dmg: 60 }, // "Glass Cannon" (Morre com 1 hit, mas bate muito)
  },
};

export const ITEMS_DB: { [key: string]: Potion | Equipment | Currency | Item } =
  {
    // --- Moeda e Valiosos (Preço 0 = Não pode comprar na loja, apenas vender) ---
    gold_coin: {
      id: "gold_coin",
      name: "Ouro",
      type: "Currency",
      value: 1,
      price: 0,
      description: "Moeda de ouro.",
    },
    gem_ruby: {
      id: "gem_ruby",
      name: "Rubi",
      type: "Item",
      value: 250,
      price: 0,
      description: "Uma gema vermelha brilhante. (Venda: 250 G)",
    },
    gem_sapphire: {
      id: "gem_sapphire",
      name: "Safira",
      type: "Item",
      value: 350,
      price: 0,
      description: "Uma gema azul profunda. (Venda: 350 G)",
    },
    gold_bar: {
      id: "gold_bar",
      name: "Barra de Ouro",
      type: "Item",
      value: 1000,
      price: 0,
      description: "Muito pesada e valiosa. (Venda: 1000 G)",
    },
    gem_rare: {
      id: "gem_rare",
      name: "Jóia Rara",
      type: "Item",
      value: 500,
      price: 0,
      description: "Um item valioso antigo. (Venda: 500 G)",
    },

    // --- Poções (Compráveis e Usáveis) ---
    potion_heal: {
      id: "potion_heal",
      name: "Poção de Cura",
      type: "Potion",
      effect: "heal",
      value: 30,
      price: 50,
      description: "Recupera 30 de Vida.",
    },
    potion_heal_large: {
      id: "potion_heal_large",
      name: "Poção Maior",
      type: "Potion",
      effect: "heal",
      value: 100,
      price: 250,
      description: "Recupera 100 de Vida.",
    },
    elixir_heal_max: {
      id: "elixir_heal_max",
      name: "Elixir da Vida",
      type: "Potion",
      effect: "heal",
      value: 999,
      price: 800,
      description: "Recupera toda a Vida.",
    },

    potion_str: {
      id: "potion_str",
      name: "Poção de Força",
      type: "Potion",
      effect: "buff",
      value: 3,
      price: 80,
      buffId: "damage_buff",
      duration: 10,
      description: "Aumenta sua Força por 10 turnos.",
    },
    potion_def: {
      id: "potion_def",
      name: "Poção de Ferro",
      type: "Potion",
      effect: "buff",
      value: 3,
      price: 120,
      buffId: "damage_reduction",
      duration: 10,
      description: "Reduz o dano recebido por 10 turnos.",
    },
    potion_dex: {
      id: "potion_dex",
      name: "Poção de Agilidade",
      type: "Potion",
      effect: "buff",
      value: 3,
      price: 100,
      buffId: "dexterity_buff",
      duration: 10,
      description: "Aumenta seus reflexos e % crítica por 10 turnos.",
    },
    potion_int: {
      id: "potion_int",
      name: "Poção de Inteligencia",
      type: "Potion",
      effect: "buff",
      value: 3,
      price: 100,
      buffId: "intelligence_buff",
      duration: 10,
      description: "Aumenta sua inteligencia por 10 turnos.",
    },

    // --- Equipamentos Tier 1 (Iniciais - Nível 1-4) ---
    sword_rusty: {
      id: "sword_rusty",
      name: "Espada Velha",
      type: "Equipment",
      slot: "weapon",
      stats: { str: 2 },
      tier: 1,
      price: 40,
      description: "Melhor que lutar com as mãos.",
    },
    dagger_rusty: {
      id: "dagger_rusty",
      name: "Adaga Velha",
      type: "Equipment",
      slot: "weapon",
      stats: { dex: 2 },
      tier: 1,
      price: 40,
      description: "Pequena e enferrujada.",
    },
    staff_wood: {
      id: "staff_wood",
      name: "Cajado de Madeira",
      type: "Equipment",
      slot: "weapon",
      stats: { int: 2 },
      tier: 1,
      price: 40,
      description: "Um galho com um cristal simples.",
    },
    mace_cleric: {
      id: "mace_cleric",
      name: "Maça de Clérigo",
      type: "Equipment",
      slot: "weapon",
      stats: { str: 1, int: 1 },
      tier: 1,
      price: 45,
      description: "Simples, mas sagrada.",
    },

    armor_cloth: {
      id: "armor_cloth",
      name: "Trapos",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 5 },
      tier: 1,
      price: 20,
      description: "Não protege muito.",
    },
    armor_leather: {
      id: "armor_leather",
      name: "Couro Batido",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 15 },
      tier: 1,
      price: 60,
      description: "Leve proteção.",
    },
    robe_apprentice: {
      id: "robe_apprentice",
      name: "Robe de Aprendiz",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 5, int: 1 },
      tier: 1,
      price: 50,
      description: "Roupas de estudo.",
    },

    // --- Equipamentos Tier 2 (Intermediários - Nível 5-9) ---
    sword_iron: {
      id: "sword_iron",
      name: "Espada de Ferro",
      type: "Equipment",
      slot: "weapon",
      stats: { str: 5 },
      tier: 2,
      price: 250,
      description: "Uma lâmina militar padrão.",
    },
    axe_battle: {
      id: "axe_battle",
      name: "Machado de Batalha",
      type: "Equipment",
      slot: "weapon",
      stats: { str: 8, dex: -1 },
      tier: 2,
      price: 300,
      description: "Pesado e mortal.",
    },
    dagger_steel: {
      id: "dagger_steel",
      name: "Adaga de Aço",
      type: "Equipment",
      slot: "weapon",
      stats: { dex: 6, str: 1 },
      tier: 2,
      price: 280,
      description: "Afiada e leve.",
    },
    bow_long: {
      id: "bow_long",
      name: "Arco Longo",
      type: "Equipment",
      slot: "weapon",
      stats: { dex: 7 },
      tier: 2,
      price: 290,
      description: "Alcance superior.",
    },
    staff_ruby: {
      id: "staff_ruby",
      name: "Cajado de Rubi",
      type: "Equipment",
      slot: "weapon",
      stats: { int: 7, hp: 10 },
      tier: 2,
      price: 350,
      description: "Canaliza o calor do fogo.",
    },

    armor_chain: {
      id: "armor_chain",
      name: "Cota de Malha",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 40, str: 1 },
      tier: 2,
      price: 400,
      description: "Boa defesa contra cortes.",
    },
    robe_silk: {
      id: "robe_silk",
      name: "Robe de Seda",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 20, int: 4 },
      tier: 2,
      price: 350,
      description: "Tecido encantado.",
    },
    armor_studded: {
      id: "armor_studded",
      name: "Couro Reforçado",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 30, dex: 2 },
      tier: 2,
      price: 320,
      description: "Permite movimento livre.",
    },

    // --- Equipamentos Tier 3 (Avançados - Nível 10-15) ---
    sword_steel: {
      id: "sword_steel",
      name: "Espada de Aço Nobre",
      type: "Equipment",
      slot: "weapon",
      stats: { str: 9, dex: 2 },
      tier: 3,
      price: 800,
      description: "Forjada por mestres.",
    },
    hammer_war: {
      id: "hammer_war",
      name: "Martelo de Guerra",
      type: "Equipment",
      slot: "weapon",
      stats: { str: 12, hp: 20 },
      tier: 3,
      price: 900,
      description: "Esmaga ossos e armaduras.",
    },
    staff_archmage: {
      id: "staff_archmage",
      name: "Cajado do Arquimago",
      type: "Equipment",
      slot: "weapon",
      stats: { int: 12, hp: 30 },
      tier: 3,
      price: 1200,
      description: "Vibra com poder arcano.",
    },
    bow_elven: {
      id: "bow_elven",
      name: "Arco Élfico",
      type: "Equipment",
      slot: "weapon",
      stats: { dex: 10, int: 2 },
      tier: 3,
      price: 1100,
      description: "Precisão sobrenatural.",
    },

    armor_plate: {
      id: "armor_plate",
      name: "Armadura de Placas",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 100, str: 2 },
      tier: 3,
      price: 1500,
      description: "Um tanque ambulante.",
    },
    robe_void_touched: {
      id: "robe_void_touched",
      name: "Robe do Vazio",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 50, int: 8 },
      tier: 3,
      price: 1400,
      description: "Tocado pelas sombras.",
    },
    armor_shadow: {
      id: "armor_shadow",
      name: "Traje das Sombras",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 60, dex: 6 },
      tier: 3,
      price: 1300,
      description: "Quase invisível no escuro.",
    },

    // --- Tier 4 (Loja Exclusiva / Raros - Nível 16-19) ---
    armor_platinum: {
      id: "armor_platinum",
      name: "Armadura de Platina",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 150, str: 5, dex: 2 },
      tier: 4,
      price: 5000,
      description: "Incrivelmente rara e brilhante. Só na loja.",
    },
    sword_mithril: {
      id: "sword_mithril",
      name: "Lâmina de Mithril",
      type: "Equipment",
      slot: "weapon",
      stats: { str: 15, dex: 5 },
      tier: 4,
      price: 4500,
      description: "Leve como pena, dura como diamante.",
    },
    staff_crystal: {
      id: "staff_crystal",
      name: "Cetro de Cristal",
      type: "Equipment",
      slot: "weapon",
      stats: { int: 18, hp: 50 },
      tier: 4,
      price: 4800,
      description: "Poder puro cristalizado.",
    },

    // --- Tier 5 (Lendários - Apenas Drop de Bosses - Nível 20+) ---
    sword_void: {
      id: "sword_void",
      name: "Lâmina do Caos",
      type: "Equipment",
      slot: "weapon",
      stats: { str: 25, int: 10 },
      tier: 5,
      price: 0,
      description: "Pulsa com a energia do fim dos tempos.",
    },
    robe_archon: {
      id: "robe_archon",
      name: "Manto do Arconte",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 100, int: 20 },
      tier: 5,
      price: 0,
      description: "Tecido com fios de luz estelar.",
    },
    daggers_soul: {
      id: "daggers_soul",
      name: "Devoradoras de Almas",
      type: "Equipment",
      slot: "weapon",
      stats: { dex: 20, str: 5 },
      tier: 5,
      price: 0,
      description: "Elas sussurram quando você mata.",
    },
    armor_dragon: {
      id: "armor_dragon",
      name: "Escama de Dragão",
      type: "Equipment",
      slot: "armor",
      stats: { hp: 250, str: 10, dex: 5 },
      tier: 5,
      price: 0,
      description: "A proteção definitiva. Indestrutível.",
    },
  };

export const CLASSES_DB: Record<string, CharacterClass> = {
  // =================================================================
  // GUERREIRO (Força / Vida / Defesa)
  // =================================================================
  Guerreiro: {
    name: "Guerreiro",
    description: "Lutador equilibrado.",
    baseStats: { hp: 25, str: 4, dex: 2, int: 1 },
    levelUpGains: { hp: 6, str: 2, dex: 1, int: 0 },
  },
  // Ramo A: Dano Bruto
  Bárbaro: {
    name: "Bárbaro",
    description: "Foca em dano bruto e risco.",
    baseStats: { hp: 30, str: 6, dex: 2, int: 0 },
    levelUpGains: { hp: 8, str: 3, dex: 1, int: 0 },
  },
  Berserker: {
    name: "Berserker",
    description: "Fúria assassina incessante.",
    baseStats: { hp: 40, str: 9, dex: 3, int: 0 },
    levelUpGains: { hp: 10, str: 4, dex: 1, int: 0 },
  },
  Destruidor: {
    name: "Destruidor",
    description: "Esmaga exércitos sozinho.",
    baseStats: { hp: 60, str: 14, dex: 4, int: 0 },
    levelUpGains: { hp: 12, str: 5, dex: 2, int: 0 },
  },
  "Deus da Guerra": {
    name: "Deus da Guerra",
    description: "A encarnação da batalha.",
    baseStats: { hp: 100, str: 25, dex: 5, int: 0 },
    levelUpGains: { hp: 20, str: 8, dex: 3, int: 0 },
  },
  // Ramo B: Defesa/Tank
  Defensor: {
    name: "Defensor",
    description: "Especialista em escudos.",
    baseStats: { hp: 35, str: 4, dex: 1, int: 1 },
    levelUpGains: { hp: 10, str: 2, dex: 0, int: 0 },
  },
  Cavaleiro: {
    name: "Cavaleiro",
    description: "Tanque de elite tático.",
    baseStats: { hp: 50, str: 6, dex: 1, int: 2 },
    levelUpGains: { hp: 12, str: 2, dex: 1, int: 1 },
  },
  Comandante: {
    name: "Comandante",
    description: "Lidera pela resistência.",
    baseStats: { hp: 80, str: 8, dex: 2, int: 4 },
    levelUpGains: { hp: 15, str: 3, dex: 1, int: 2 },
  },
  "Bastião Divino": {
    name: "Bastião Divino",
    description: "Imortal e inabalável.",
    baseStats: { hp: 180, str: 12, dex: 0, int: 5 },
    levelUpGains: { hp: 25, str: 4, dex: 0, int: 3 },
  },

  // =================================================================
  // MAGO (Inteligência / Área / Invocação)
  // =================================================================
  Mago: {
    name: "Mago",
    description: "Estudioso das artes arcanas.",
    baseStats: { hp: 15, str: 1, dex: 2, int: 5 },
    levelUpGains: { hp: 3, str: 0, dex: 1, int: 3 },
  },
  // Ramo A: Dano Mágico Puro
  Elementalista: {
    name: "Elementalista",
    description: "Mestre do Fogo e Gelo.",
    baseStats: { hp: 18, str: 0, dex: 2, int: 8 },
    levelUpGains: { hp: 4, str: 0, dex: 1, int: 4 },
  },
  Feiticeiro: {
    name: "Feiticeiro",
    description: "Poder arcano instável.",
    baseStats: { hp: 22, str: 0, dex: 3, int: 12 },
    levelUpGains: { hp: 4, str: 0, dex: 1, int: 5 },
  },
  Arquimago: {
    name: "Arquimago",
    description: "Sábio supremo da magia.",
    baseStats: { hp: 30, str: 0, dex: 4, int: 18 },
    levelUpGains: { hp: 5, str: 0, dex: 2, int: 6 },
  },
  "Avatar Arcano": {
    name: "Avatar Arcano",
    description: "Magia pura em forma física.",
    baseStats: { hp: 50, str: 0, dex: 5, int: 35 },
    levelUpGains: { hp: 6, str: 0, dex: 3, int: 10 },
  },
  // Ramo B: Necromancia/Debuffs
  Ocultista: {
    name: "Ocultista",
    description: "Magia negra e maldições.",
    baseStats: { hp: 20, str: 1, dex: 2, int: 7 },
    levelUpGains: { hp: 5, str: 0, dex: 1, int: 3 },
  },
  Necromante: {
    name: "Necromante",
    description: "Ergue os mortos.",
    baseStats: { hp: 25, str: 2, dex: 2, int: 10 },
    levelUpGains: { hp: 6, str: 1, dex: 1, int: 4 },
  },
  Lich: {
    name: "Lich",
    description: "Venceu a morte.",
    baseStats: { hp: 45, str: 3, dex: 1, int: 15 },
    levelUpGains: { hp: 8, str: 1, dex: 1, int: 5 },
  },
  "Senhor da Morte": {
    name: "Senhor da Morte",
    description: "Comanda legiões de almas.",
    baseStats: { hp: 70, str: 5, dex: 2, int: 25 },
    levelUpGains: { hp: 10, str: 2, dex: 2, int: 8 },
  },

  // =================================================================
  // LADINO (Destreza / Crítico / Furtividade)
  // =================================================================
  Ladino: {
    name: "Ladino",
    description: "Rápido, astuto e letal.",
    baseStats: { hp: 18, str: 2, dex: 5, int: 2 },
    levelUpGains: { hp: 5, str: 1, dex: 3, int: 1 },
  },
  // Ramo A: Assassinato/Melee
  Assassino: {
    name: "Assassino",
    description: "Dano crítico e veneno.",
    baseStats: { hp: 20, str: 3, dex: 8, int: 1 },
    levelUpGains: { hp: 5, str: 2, dex: 4, int: 0 },
  },
  Ninja: {
    name: "Ninja",
    description: "Mestre das sombras e ilusão.",
    baseStats: { hp: 25, str: 4, dex: 12, int: 2 },
    levelUpGains: { hp: 6, str: 2, dex: 5, int: 1 },
  },
  Sombra: {
    name: "Sombra",
    description: "Ninguém te vê chegar.",
    baseStats: { hp: 30, str: 5, dex: 16, int: 4 },
    levelUpGains: { hp: 6, str: 2, dex: 6, int: 2 },
  },
  "Lâmina Fantasma": {
    name: "Lâmina Fantasma",
    description: "A morte invisível.",
    baseStats: { hp: 50, str: 8, dex: 30, int: 5 },
    levelUpGains: { hp: 8, str: 3, dex: 8, int: 2 },
  },
  // Ramo B: Ranged/Arco
  Ranger: {
    name: "Ranger",
    description: "Combate preciso à distância.",
    baseStats: { hp: 22, str: 2, dex: 7, int: 2 },
    levelUpGains: { hp: 6, str: 1, dex: 3, int: 1 },
  },
  Caçador: {
    name: "Caçador",
    description: "Usa armadilhas e pets.",
    baseStats: { hp: 28, str: 3, dex: 10, int: 3 },
    levelUpGains: { hp: 7, str: 2, dex: 4, int: 1 },
  },
  "Atirador de Elite": {
    name: "Atirador de Elite",
    description: "Um tiro, uma morte.",
    baseStats: { hp: 32, str: 2, dex: 18, int: 2 },
    levelUpGains: { hp: 6, str: 1, dex: 6, int: 1 },
  },
  "Predador Apex": {
    name: "Predador Apex",
    description: "O topo da cadeia alimentar.",
    baseStats: { hp: 60, str: 5, dex: 25, int: 4 },
    levelUpGains: { hp: 10, str: 3, dex: 7, int: 2 },
  },

  // =================================================================
  // DRUIDA (Híbrido / Natureza / Metamorfose)
  // =================================================================
  Druida: {
    name: "Druida",
    description: "Protetor do equilíbrio.",
    baseStats: { hp: 20, str: 3, dex: 3, int: 3 },
    levelUpGains: { hp: 5, str: 1, dex: 1, int: 1 },
  },
  // Ramo A: Metamorfose/Tank
  Metamorfo: {
    name: "Metamorfo",
    description: "Transforma-se em feras.",
    baseStats: { hp: 28, str: 6, dex: 4, int: 1 },
    levelUpGains: { hp: 8, str: 3, dex: 2, int: 0 },
  },
  Fera: {
    name: "Fera",
    description: "Força animal bruta.",
    baseStats: { hp: 40, str: 10, dex: 6, int: 0 },
    levelUpGains: { hp: 10, str: 4, dex: 2, int: 0 },
  },
  Behemoth: {
    name: "Behemoth",
    description: "Tanque natural gigante.",
    baseStats: { hp: 90, str: 15, dex: 5, int: 0 },
    levelUpGains: { hp: 15, str: 5, dex: 1, int: 0 },
  },
  "Avatar Selvagem": {
    name: "Avatar Selvagem",
    description: "A fúria da floresta.",
    baseStats: { hp: 160, str: 25, dex: 10, int: 5 },
    levelUpGains: { hp: 20, str: 6, dex: 3, int: 1 },
  },
  // Ramo B: Invocação/Magia Natural
  Xamã: {
    name: "Xamã",
    description: "Totems e espíritos.",
    baseStats: { hp: 22, str: 2, dex: 2, int: 6 },
    levelUpGains: { hp: 5, str: 1, dex: 1, int: 3 },
  },
  "Invocador Natural": {
    name: "Invocador Natural",
    description: "Chama aliados da mata.",
    baseStats: { hp: 25, str: 2, dex: 3, int: 10 },
    levelUpGains: { hp: 6, str: 0, dex: 1, int: 4 },
  },
  Sábio: {
    name: "Sábio",
    description: "Magia da natureza antiga.",
    baseStats: { hp: 35, str: 3, dex: 4, int: 15 },
    levelUpGains: { hp: 7, str: 1, dex: 1, int: 5 },
  },
  "Guardião de Gaia": {
    name: "Guardião de Gaia",
    description: "Protetor do mundo.",
    baseStats: { hp: 80, str: 5, dex: 5, int: 25 },
    levelUpGains: { hp: 12, str: 2, dex: 2, int: 8 },
  },

  // =================================================================
  // PALADINO (Força / Inteligência / Sagrado)
  // =================================================================
  Paladino: {
    name: "Paladino",
    description: "Guerreiro da luz.",
    baseStats: { hp: 24, str: 4, dex: 1, int: 3 },
    levelUpGains: { hp: 7, str: 2, dex: 0, int: 2 },
  },
  // Ramo A: Defesa/Suporte
  Guardião: {
    name: "Guardião",
    description: "A muralha impenetrável.",
    baseStats: { hp: 35, str: 5, dex: 1, int: 3 },
    levelUpGains: { hp: 10, str: 1, dex: 0, int: 1 },
  },
  Templário: {
    name: "Templário",
    description: "Líder sagrado de batalha.",
    baseStats: { hp: 60, str: 8, dex: 2, int: 5 },
    levelUpGains: { hp: 12, str: 3, dex: 1, int: 2 },
  },
  "Cruzado Divino": {
    name: "Cruzado Divino",
    description: "A espada da igreja.",
    baseStats: { hp: 90, str: 12, dex: 3, int: 8 },
    levelUpGains: { hp: 15, str: 4, dex: 1, int: 3 },
  },
  "Avatar da Luz": {
    name: "Avatar da Luz",
    description: "Luz pura em forma física.",
    baseStats: { hp: 180, str: 20, dex: 5, int: 15 },
    levelUpGains: { hp: 20, str: 6, dex: 2, int: 5 },
  },
  // Ramo B: Dano Sagrado (Inquisidor)
  Inquisidor: {
    name: "Inquisidor",
    description: "Queima hereges.",
    baseStats: { hp: 25, str: 5, dex: 2, int: 6 },
    levelUpGains: { hp: 6, str: 2, dex: 0, int: 3 },
  },
  Exorcista: {
    name: "Exorcista",
    description: "Bane o mal.",
    baseStats: { hp: 40, str: 6, dex: 4, int: 10 },
    levelUpGains: { hp: 7, str: 2, dex: 1, int: 4 },
  },
  "Caçador de Demônios": {
    name: "Caçador de Demônios",
    description: "O terror das trevas.",
    baseStats: { hp: 65, str: 10, dex: 6, int: 15 },
    levelUpGains: { hp: 9, str: 3, dex: 2, int: 5 },
  },
  "Mão de Deus": {
    name: "Mão de Deus",
    description: "O julgamento final.",
    baseStats: { hp: 110, str: 15, dex: 10, int: 30 },
    levelUpGains: { hp: 12, str: 5, dex: 4, int: 8 },
  },
};

// --- 4. ÁRVORE DE EVOLUÇÃO COMPLETA (Níveis 5, 10, 15, 20) ---
export const CLASS_EVOLUTIONS: Record<
  string,
  { level: number; options: string[] }
> = {
  // ================== GUERREIRO ==================
  Guerreiro: { level: 5, options: ["Bárbaro", "Defensor"] },

  // Caminho do Dano
  Bárbaro: { level: 10, options: ["Berserker"] },
  Berserker: { level: 15, options: ["Destruidor"] },
  Destruidor: { level: 20, options: ["Deus da Guerra"] },

  // Caminho da Defesa
  Defensor: { level: 10, options: ["Cavaleiro"] },
  Cavaleiro: { level: 15, options: ["Comandante"] }, // Renomeado de Templário (conflito)
  Comandante: { level: 20, options: ["Bastião Divino"] },

  // ================== MAGO ==================
  Mago: { level: 5, options: ["Elementalista", "Ocultista"] },

  // Caminho Elemental
  Elementalista: { level: 10, options: ["Feiticeiro"] },
  Feiticeiro: { level: 15, options: ["Arquimago"] },
  Arquimago: { level: 20, options: ["Avatar Arcano"] },

  // Caminho das Trevas
  Ocultista: { level: 10, options: ["Necromante"] },
  Necromante: { level: 15, options: ["Lich"] },
  Lich: { level: 20, options: ["Senhor da Morte"] },

  // ================== LADINO ==================
  Ladino: { level: 5, options: ["Assassino", "Ranger"] },

  // Caminho do Assassinato
  Assassino: { level: 10, options: ["Ninja"] },
  Ninja: { level: 15, options: ["Sombra"] },
  Sombra: { level: 20, options: ["Lâmina Fantasma"] },

  // Caminho do Tiro
  Ranger: { level: 10, options: ["Rastreador"] }, // Renomeado de Caçador (conflito)
  Rastreador: { level: 15, options: ["Atirador de Elite"] },
  "Atirador de Elite": { level: 20, options: ["Predador Apex"] },

  // ================== DRUIDA ==================
  Druida: { level: 5, options: ["Metamorfo", "Xamã"] },

  // Caminho da Fera
  Metamorfo: { level: 10, options: ["Fera"] },
  Fera: { level: 15, options: ["Behemoth"] },
  Behemoth: { level: 20, options: ["Avatar Selvagem"] },

  // Caminho dos Espíritos
  Xamã: { level: 10, options: ["Invocador Natural"] },
  "Invocador Natural": { level: 15, options: ["Sábio"] },
  Sábio: { level: 20, options: ["Guardião de Gaia"] },

  // ================== CLÉRIGO ==================
  Clérigo: { level: 5, options: ["Sacerdote", "Paladino"] }, // Paladino aqui é subclasse/caminho híbrido se não for base
  // Nota: Se Paladino é classe base também, aqui ele funciona como uma "especialização de combate" do Clérigo.

  // Caminho do Suporte
  Sacerdote: { level: 10, options: ["Sumo Sacerdote"] },
  "Sumo Sacerdote": { level: 15, options: ["Profeta"] },
  Profeta: { level: 20, options: ["Santo Vivo"] },

  // Caminho do Combate Sagrado (Derivado de Clérigo)
  // Se o jogador escolheu Paladino como base, ele usa a árvore abaixo.
  // Se veio de Clérigo -> Paladino, ele segue aqui:
  // (Para simplificar, vamos manter nomes únicos ou fundir os caminhos)

  // ================== PALADINO (Classe Base) ==================
  Paladino: { level: 5, options: ["Guardião", "Inquisidor"] },

  // Caminho da Proteção
  Guardião: { level: 10, options: ["Templário"] },
  Templário: { level: 15, options: ["Cruzado Divino"] },
  "Cruzado Divino": { level: 20, options: ["Avatar da Luz"] },

  // Caminho da Punição
  Inquisidor: { level: 10, options: ["Exorcista"] },
  Exorcista: { level: 15, options: ["Caçador de Demônios"] },
  "Caçador de Demônios": { level: 20, options: ["Mão de Deus"] },

  // ================== CAÇADOR (Classe Base) ==================
  Caçador: { level: 5, options: ["Hunter", "Sniper"] }, // Usando termos em inglês ou renomear para "Caçador Furtivo" / "Franco-Atirador"

  // Caminho dos Pets
  Hunter: { level: 10, options: ["Beastmaster"] },
  Beastmaster: { level: 15, options: ["Senhor das Feras"] }, // Cuidado com colisão com Druida, se houver
  "Senhor das Feras": { level: 20, options: ["Rei da Selva"] },

  // Caminho do Tiro Longo
  Sniper: { level: 10, options: ["Sharpshooter"] },
  Sharpshooter: { level: 15, options: ["Olho Mortal"] },
  "Olho Mortal": { level: 20, options: ["Morte Silenciosa"] },
};

export const availableClasses: CharacterClass[] = [
  CLASSES_DB["Guerreiro"],
  CLASSES_DB["Ladino"],
  CLASSES_DB["Mago"],
  CLASSES_DB["Clérigo"],
  CLASSES_DB["Druida"],
  CLASSES_DB["Caçador"],
  CLASSES_DB["Paladino"], // <-- ADICIONADO: Agora o Paladino é jogável!
];

// --- 3. BANCO DE DADOS DE HABILIDADES (Recheado) ---
export const SKILLS_DB: Skill[] = [
  // ================== MAGO ==================
  {
    id: "m_poison",
    name: "Nuvem Venenosa",
    type: "Magic",
    target: "Enemy",
    description: "Causa 2 de dano por 5 turnos.",
    cooldown: 3,
    unlockLevel: 1,
    classRequirement: "Mago",
    effects: [
      { type: "apply_status", effectId: "poisoned", duration: 5, potency: 2 },
    ],
  },
  {
    id: "m_bolt",
    name: "Tapa Elétrico",
    type: "Magic",
    target: "Enemy",
    description: "Causa 6 de dano e paralisa por 1 turno.",
    cooldown: 3,
    unlockLevel: 1,
    classRequirement: "Mago",
    effects: [
      { type: "direct_damage", value: 6 },
      { type: "apply_status", effectId: "paralyzed", duration: 2 },
    ],
  },
  {
    id: "m_flame",
    name: "Chamas Concentradas",
    type: "Magic",
    target: "Enemy",
    description: "Causa 3 de dano e queima.",
    cooldown: 1,
    unlockLevel: 1,
    classRequirement: "Mago",
    effects: [
      { type: "direct_damage", value: 3 },
      { type: "apply_status", effectId: "burning", potency: 1, duration: 3 },
    ],
  },
  {
    id: "m_fireball",
    name: "Bola de Fogo",
    type: "Magic",
    target: "Enemy",
    description: "Causa 15 de dano de fogo.",
    cooldown: 3,
    unlockLevel: 3,
    classRequirement: "Mago",
    effects: [{ type: "direct_damage", value: 15 }],
  },
  {
    id: "m_shield",
    name: "Escudo de Mana",
    type: "Magic",
    target: "Self",
    description: "Reduz dano recebido.",
    cooldown: 6,
    unlockLevel: 5,
    classRequirement: "Mago",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 4,
        potency: 5,
      },
    ],
  },
  // Evoluções (Invocador)
  {
    id: "sum_skeleton",
    name: "Erguer Mortos",
    type: "Magic",
    target: "Self",
    description: "Invoca um Esqueleto.",
    cooldown: 4,
    unlockLevel: 10,
    classRequirement: "Invocador",
    effects: [{ type: "summon", summonId: "s_skeleton" }],
  },
  {
    id: "sum_golem",
    name: "Criar Golem",
    type: "Magic",
    target: "Self",
    description: "Invoca um Golem tanque.",
    cooldown: 10,
    unlockLevel: 20,
    classRequirement: "Necromante",
    effects: [{ type: "summon", summonId: "s_golem" }],
  },
  {
    id: "sum_elem",
    name: "Invocar Elemental",
    type: "Magic",
    target: "Self",
    description: "Invoca um Elemental de Fogo.",
    cooldown: 8,
    unlockLevel: 20,
    classRequirement: "Mestre Elemental",
    effects: [{ type: "summon", summonId: "s_fire_elem" }],
  },
  // Evoluções (Feiticeiro -> Arquimago)
  {
    id: "m_blizzard",
    name: "Nevasca",
    type: "Magic",
    target: "Enemy",
    description: "Causa 25 de dano e paralisa.",
    cooldown: 8,
    unlockLevel: 10,
    classRequirement: "Feiticeiro",
    effects: [
      { type: "direct_damage", value: 25 },
      { type: "apply_status", effectId: "paralyzed", duration: 3 },
    ],
  },
  {
    id: "m_armageddon",
    name: "Armageddon",
    type: "Magic",
    target: "Enemy",
    description: "A magia final. Causa 100 de dano.",
    cooldown: 15,
    unlockLevel: 20,
    classRequirement: "Arquimago",
    effects: [
      { type: "direct_damage", value: 100 },
      { type: "apply_status", effectId: "burning", potency: 5, duration: 3 },
    ],
  },

  // ================== GUERREIRO ==================
  {
    id: "g_buff_str",
    name: "Grito de Guerra",
    type: "Skill",
    target: "Self",
    description: "Aumenta Força.",
    cooldown: 5,
    unlockLevel: 1,
    classRequirement: "Guerreiro",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_buff",
        duration: 3,
        potency: 3,
      },
    ],
  },
  {
    id: "g_buff_def",
    name: "Casca Grossa",
    type: "Skill",
    target: "Self",
    description: "Reduz dano recebido.",
    cooldown: 5,
    unlockLevel: 1,
    classRequirement: "Guerreiro",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 3,
        potency: 2,
      },
    ],
  },
  {
    id: "g_heavy_slam",
    name: "Golpe Pesado",
    type: "Skill",
    target: "Enemy",
    description: "Golpe de 12 de dano.",
    cooldown: 3,
    unlockLevel: 3,
    classRequirement: "Guerreiro",
    effects: [{ type: "direct_damage", value: 12 }],
  },
  {
    id: "g_blade_spin",
    name: "Giro da Lâmina",
    type: "Skill",
    target: "Enemy",
    description: "Causa 10 de dano.",
    cooldown: 4,
    unlockLevel: 5,
    classRequirement: "Guerreiro",
    effects: [{ type: "direct_damage", value: 10 }],
  },
  // Evoluções (Bárbaro)
  {
    id: "b_rage",
    name: "Raiva",
    type: "Skill",
    target: "Self",
    description: "Aumenta muito a Força.",
    cooldown: 6,
    unlockLevel: 10,
    classRequirement: "Bárbaro",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_buff",
        duration: 4,
        potency: 10,
      },
    ],
  },
  {
    id: "b_roar",
    name: "Rugido Bestial",
    type: "Skill",
    target: "Enemy",
    description: "Paralisa e causa dano.",
    cooldown: 6,
    unlockLevel: 20,
    classRequirement: "Bestial",
    effects: [
      { type: "direct_damage", value: 30 },
      { type: "apply_status", effectId: "paralyzed", duration: 2 },
    ],
  },
  {
    id: "b_berserk",
    name: "Fúria Berserker",
    type: "Skill",
    target: "Self",
    description: "Força Extrema.",
    cooldown: 10,
    unlockLevel: 20,
    classRequirement: "Berserker",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_buff",
        duration: 5,
        potency: 25,
      },
    ],
  },
  // Evoluções (Cavaleiro)
  {
    id: "k_shield_wall",
    name: "Muralha",
    type: "Skill",
    target: "Self",
    description: "Defesa massiva.",
    cooldown: 8,
    unlockLevel: 10,
    classRequirement: "Cavaleiro",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 3,
        potency: 10,
      },
    ],
  },
  {
    id: "k_rally",
    name: "Comando",
    type: "Skill",
    target: "Self",
    description: "Buffs defensivos e ofensivos.",
    cooldown: 8,
    unlockLevel: 20,
    classRequirement: "General",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 4,
        potency: 5,
      },
      {
        type: "apply_status",
        effectId: "damage_buff",
        duration: 4,
        potency: 5,
      },
    ],
  },

  // ================== LADINO ==================
  {
    id: "l_invisible",
    name: "Furtividade",
    type: "Skill",
    target: "Self",
    description: "Fica invisível.",
    cooldown: 6,
    unlockLevel: 1,
    classRequirement: "Ladino",
    effects: [{ type: "apply_status", effectId: "invisible", duration: 2 }],
  },
  {
    id: "l_poison_stab",
    name: "Ataque Peçonhento",
    type: "Skill",
    target: "Enemy",
    description: "Causa 3 de dano e envenena.",
    cooldown: 3,
    unlockLevel: 1,
    classRequirement: "Ladino",
    effects: [
      { type: "direct_damage", value: 3 },
      { type: "apply_status", effectId: "poisoned", duration: 5, potency: 3 },
    ],
  },
  {
    id: "l_double_attack",
    name: "Ataque Duplo",
    type: "Skill",
    target: "Enemy",
    description: "Ataca duas vezes.",
    cooldown: 2,
    unlockLevel: 3,
    classRequirement: "Ladino",
    effects: [
      { type: "direct_damage", value: 5 },
      { type: "direct_damage", value: 5 },
    ],
  },
  {
    id: "l_backstab",
    name: "Apunhalar",
    type: "Skill",
    target: "Enemy",
    description: "Golpe de 18 dano.",
    cooldown: 5,
    unlockLevel: 5,
    classRequirement: "Ladino",
    effects: [{ type: "direct_damage", value: 18 }],
  },
  // Evoluções (Assassino)
  {
    id: "l_bleed_out",
    name: "Hemorragia",
    type: "Skill",
    target: "Enemy",
    description: "Sangramento profundo.",
    cooldown: 5,
    unlockLevel: 10,
    classRequirement: "Assassino",
    effects: [
      { type: "apply_status", effectId: "poisoned", duration: 4, potency: 8 },
    ],
  },
  {
    id: "l_phantom",
    name: "Golpe Fantasma",
    type: "Skill",
    target: "Enemy",
    description: "Dano massivo (80).",
    cooldown: 12,
    unlockLevel: 20,
    classRequirement: "Lâmina Fantasma",
    effects: [
      { type: "direct_damage", value: 80 },
      { type: "apply_status", effectId: "invisible", duration: 2 },
    ],
  },
  // Evoluções (Shadow Walker)
  {
    id: "l_shadow_step",
    name: "Passo das Sombras",
    type: "Skill",
    target: "Self",
    description: "Invisibilidade longa.",
    cooldown: 8,
    unlockLevel: 10,
    classRequirement: "Shadow Walker",
    effects: [{ type: "apply_status", effectId: "invisible", duration: 4 }],
  },

  // ================== CLÉRIGO ==================
  {
    id: "c_holy_light",
    name: "Luz Sagrada",
    type: "Magic",
    target: "Enemy",
    description: "Queima com luz (8 dano).",
    cooldown: 2,
    unlockLevel: 1,
    classRequirement: "Clérigo",
    effects: [{ type: "direct_damage", value: 8 }],
  },
  {
    id: "c_bless",
    name: "Benção",
    type: "Magic",
    target: "Self",
    description: "Aumenta defesa e força.",
    cooldown: 5,
    unlockLevel: 1,
    classRequirement: "Clérigo",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 3,
        potency: 2,
      },
      {
        type: "apply_status",
        effectId: "damage_buff",
        duration: 3,
        potency: 1,
      },
    ],
  },
  {
    id: "c_smite",
    name: "Punição Divina",
    type: "Magic",
    target: "Enemy",
    description: "Dano sagrado (15) e atordoa.",
    cooldown: 5,
    unlockLevel: 5,
    classRequirement: "Clérigo",
    effects: [
      { type: "direct_damage", value: 15 },
      { type: "apply_status", effectId: "paralyzed", duration: 1 },
    ],
  },
  // Evoluções (Sacerdote)
  {
    id: "c_divine_int",
    name: "Intervenção Divina",
    type: "Magic",
    target: "Self",
    description: "Imunidade a dano por 2 turnos.",
    cooldown: 12,
    unlockLevel: 10,
    classRequirement: "Sacerdote",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 2,
        potency: 999,
      },
    ],
  },
  // Evoluções (Paladino)
  {
    id: "c_holy_fire",
    name: "Fogo Sagrado",
    type: "Magic",
    target: "Enemy",
    description: "Queima o inimigo com fé.",
    cooldown: 4,
    unlockLevel: 10,
    classRequirement: "Paladino",
    effects: [
      { type: "direct_damage", value: 20 },
      { type: "apply_status", effectId: "burning", duration: 3, potency: 5 },
    ],
  },
  {
    id: "c_avatar",
    name: "Avatar Divino",
    type: "Magic",
    target: "Self",
    description: "Imortal e forte.",
    cooldown: 20,
    unlockLevel: 20,
    classRequirement: "Cruzado",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 3,
        potency: 999,
      },
      {
        type: "apply_status",
        effectId: "damage_buff",
        duration: 3,
        potency: 20,
      },
    ],
  },

  // ================== DRUIDA ==================
  {
    id: "d_thorns",
    name: "Espinhos",
    type: "Magic",
    target: "Enemy",
    description: "Causa 5 de dano e sangra.",
    cooldown: 2,
    unlockLevel: 1,
    classRequirement: "Druida",
    effects: [
      { type: "direct_damage", value: 5 },
      { type: "apply_status", effectId: "poisoned", duration: 3, potency: 2 },
    ],
  },
  {
    id: "d_nature_touch",
    name: "Toque Natural",
    type: "Magic",
    target: "Self",
    description: "Aumenta defesa.",
    cooldown: 5,
    unlockLevel: 1,
    classRequirement: "Druida",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 2,
        potency: 2,
      },
    ],
  },
  // Evoluções (Xamã)
  {
    id: "sum_wolf",
    name: "Espírito do Lobo",
    type: "Magic",
    target: "Self",
    description: "Invoca um lobo.",
    cooldown: 5,
    unlockLevel: 10,
    classRequirement: "Xamã",
    effects: [{ type: "summon", summonId: "s_wolf" }],
  },
  {
    id: "sum_bear",
    name: "Espírito do Urso",
    type: "Magic",
    target: "Self",
    description: "Invoca um urso.",
    cooldown: 8,
    unlockLevel: 20,
    classRequirement: "Senhor das Feras",
    effects: [{ type: "summon", summonId: "s_bear" }],
  },
  // Evoluções (Metamorfo)
  {
    id: "d_bear_form",
    name: "Forma de Urso",
    type: "Magic",
    target: "Self",
    description: "Aumenta muito a defesa.",
    cooldown: 8,
    unlockLevel: 10,
    classRequirement: "Metamorfo",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 4,
        potency: 10,
      },
    ],
  },

  // ================== CAÇADOR ==================
  {
    id: "r_quick_shot",
    name: "Disparo Rápido",
    type: "Skill",
    target: "Enemy",
    description: "Tiro rápido de 6 de dano.",
    cooldown: 1,
    unlockLevel: 1,
    classRequirement: "Caçador",
    effects: [{ type: "direct_damage", value: 6 }],
  },
  {
    id: "r_trap",
    name: "Armadilha",
    type: "Skill",
    target: "Enemy",
    description: "Prende o inimigo (Paralisa 2t).",
    cooldown: 6,
    unlockLevel: 3,
    classRequirement: "Caçador",
    effects: [{ type: "apply_status", effectId: "paralyzed", duration: 2 }],
  },
  {
    id: "r_volley",
    name: "Chuva de Flechas",
    type: "Skill",
    target: "Enemy",
    description: "Vários disparos (3x4 dano).",
    cooldown: 4,
    unlockLevel: 5,
    classRequirement: "Caçador",
    effects: [
      { type: "direct_damage", value: 4 },
      { type: "direct_damage", value: 4 },
      { type: "direct_damage", value: 4 },
    ],
  },
  // Evoluções (Hunter)
  {
    id: "r_poison_arrow",
    name: "Flecha Venenosa",
    type: "Skill",
    target: "Enemy",
    description: "Dano e veneno forte.",
    cooldown: 4,
    unlockLevel: 10,
    classRequirement: "Hunter",
    effects: [
      { type: "direct_damage", value: 15 },
      { type: "apply_status", effectId: "poisoned", duration: 4, potency: 6 },
    ],
  },
  {
    id: "r_call_wild",
    name: "Chamado Selvagem",
    type: "Skill",
    target: "Self",
    description: "Invoca um Lobo.",
    cooldown: 6,
    unlockLevel: 20,
    classRequirement: "Beastmaster",
    effects: [{ type: "summon", summonId: "s_wolf" }],
  },
  // Evoluções (Sniper)
  {
    id: "r_snipe",
    name: "Tiro Preciso",
    type: "Skill",
    target: "Enemy",
    description: "Um tiro na cabeça. 40 de dano.",
    cooldown: 8,
    unlockLevel: 10,
    classRequirement: "Sniper",
    effects: [{ type: "direct_damage", value: 40 }],
  },
  {
    id: "r_rain_arrows",
    name: "Tempestade",
    type: "Skill",
    target: "Enemy",
    description: "Apaga o sol (10x12 dano).",
    cooldown: 15,
    unlockLevel: 20,
    classRequirement: "Sharpshooter",
    effects: [
      { type: "direct_damage", value: 12 },
      { type: "direct_damage", value: 12 },
      { type: "direct_damage", value: 12 },
      { type: "direct_damage", value: 12 },
      { type: "direct_damage", value: 12 },
      { type: "direct_damage", value: 12 },
      { type: "direct_damage", value: 12 },
      { type: "direct_damage", value: 12 },
      { type: "direct_damage", value: 12 },
      { type: "direct_damage", value: 12 },
    ],
  },

  // ================== PALADINO (Atualizado) ==================
  {
    id: "p_smite",
    name: "Golpe Divino",
    type: "Magic",
    target: "Enemy",
    description: "Dano físico + sagrado (STR+INT).",
    cooldown: 2,
    unlockLevel: 1,
    classRequirement: "Paladino",
    effects: [{ type: "direct_damage", value: 8 }],
  },
  {
    id: "p_shield_faith",
    name: "Escudo da Fé",
    type: "Magic",
    target: "Self",
    description: "Aumenta defesa.",
    cooldown: 4,
    unlockLevel: 1,
    classRequirement: "Paladino",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 3,
        potency: 3,
      },
    ],
  },

  // Subclasse: Guardião (Lv 5)
  {
    id: "gua_bastion",
    name: "Bastião",
    type: "Skill",
    target: "Self",
    description: "Defesa massiva.",
    cooldown: 5,
    unlockLevel: 5,
    classRequirement: "Guardião",
    effects: [
      {
        type: "apply_status",
        effectId: "damage_reduction",
        duration: 3,
        potency: 5,
      },
    ],
  },

  // Subclasse: Inquisidor (Lv 5)
  {
    id: "inq_brand",
    name: "Marca Herege",
    type: "Magic",
    target: "Enemy",
    description: "Queima o inimigo.",
    cooldown: 3,
    unlockLevel: 5,
    classRequirement: "Inquisidor",
    effects: [
      { type: "apply_status", effectId: "burning", duration: 4, potency: 4 },
    ],
  },

  // Elite: Templário (Lv 10)
  {
    id: "temp_wrath",
    name: "Ira Sagrada",
    type: "Magic",
    target: "Enemy",
    description: "Dano em área massivo.",
    cooldown: 6,
    unlockLevel: 10,
    classRequirement: "Templário",
    effects: [{ type: "direct_damage", value: 40 }],
  },

  // Elite: Exorcista (Lv 10)
  {
    id: "exo_banish",
    name: "Banir",
    type: "Magic",
    target: "Enemy",
    description: "Dano alto e paralisia.",
    cooldown: 8,
    unlockLevel: 10,
    classRequirement: "Exorcista",
    effects: [
      { type: "direct_damage", value: 30 },
      { type: "apply_status", effectId: "paralyzed", duration: 2 },
    ],
  },
];

// --- 6. MONSTROS (Rebalanceados: +XP, +Loot de Cura/Ouro) ---
export const MONSTERS_DB: Monster[] = [
  // === Nível 1-2 (Floresta/Esgoto) ===
  {
    id: "m01",
    name: "Slime",
    stats: { hp: 10, str: 2, dex: 1, int: 1 },
    expReward: 12,
    minLevel: 1,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 0.7 }, // Chance alta de ouro
      { item: ITEMS_DB["potion_heal"], dropChance: 0.15 }, // Chance de cura
    ],
  },
  {
    id: "m02",
    name: "Rato Gigante",
    stats: { hp: 15, str: 3, dex: 3, int: 1 },
    expReward: 18,
    minLevel: 1,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 0.6 },
      { item: ITEMS_DB["potion_heal"], dropChance: 0.3 }, // 30% de chance de cura
    ],
  },
  {
    id: "m_skeleton",
    name: "Esqueleto",
    stats: { hp: 22, str: 4, dex: 2, int: 1 },
    expReward: 25,
    minLevel: 2,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 0.8 },
      { item: ITEMS_DB["potion_heal"], dropChance: 0.25 },
      { item: ITEMS_DB["sword_rusty"], dropChance: 0.1 },
    ],
  },

  // === Nível 3-4 (Caverna/Ruínas) ===
  {
    id: "m03",
    name: "Goblin",
    stats: { hp: 28, str: 5, dex: 4, int: 2 },
    expReward: 35,
    minLevel: 3,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 0.9 },
      { item: ITEMS_DB["potion_heal"], dropChance: 0.35 }, // Goblin carrega poções roubadas
      { item: ITEMS_DB["dagger_iron"], dropChance: 0.05 },
      { item: ITEMS_DB["potion_str"], dropChance: 0.1 },
    ],
  },
  {
    id: "m_zombie",
    name: "Zumbi",
    stats: { hp: 40, str: 6, dex: 1, int: 1 },
    expReward: 45,
    minLevel: 4,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 0.8 },
      { item: ITEMS_DB["potion_heal"], dropChance: 0.2 },
      { item: ITEMS_DB["armor_leather"], dropChance: 0.1 },
      { item: ITEMS_DB["potion_def"], dropChance: 0.1 },
    ],
  },

  // === Nível 5-7 (Masmorra Profunda) ===
  {
    id: "m04",
    name: "Orc",
    stats: { hp: 60, str: 9, dex: 3, int: 2 },
    expReward: 70,
    minLevel: 5,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 1.0 }, // Sempre dropa ouro
      { item: ITEMS_DB["potion_heal"], dropChance: 0.4 },
      { item: ITEMS_DB["armor_iron"], dropChance: 0.08 },
      { item: ITEMS_DB["sword_iron"], dropChance: 0.08 },
      { item: ITEMS_DB["potion_heal_large"], dropChance: 0.1 },
    ],
  },
  {
    id: "m_troll",
    name: "Troll",
    stats: { hp: 90, str: 12, dex: 2, int: 1 },
    expReward: 100,
    minLevel: 6,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 1.0 },
      { item: ITEMS_DB["potion_heal_large"], dropChance: 0.25 },
      { item: ITEMS_DB["battleaxe_iron"], dropChance: 0.1 },
      { item: ITEMS_DB["gem_ruby"], dropChance: 0.15 }, // Tesouro
    ],
  },
  {
    id: "m_necromancer",
    name: "Necromante",
    stats: { hp: 65, str: 4, dex: 5, int: 12 },
    expReward: 120,
    minLevel: 7,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 1.0 },
      { item: ITEMS_DB["potion_int"], dropChance: 0.3 },
      { item: ITEMS_DB["staff_magic"], dropChance: 0.1 },
      { item: ITEMS_DB["robe_mage"], dropChance: 0.1 },
    ],
  },

  // === Nível 8-9 (Abismo) ===
  {
    id: "m05",
    name: "Demônio Menor",
    stats: { hp: 120, str: 14, dex: 8, int: 8 },
    expReward: 170,
    minLevel: 8,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 1.0 },
      { item: ITEMS_DB["potion_heal_large"], dropChance: 0.4 }, // Essencial aqui
      { item: ITEMS_DB["sword_steel"], dropChance: 0.1 },
      { item: ITEMS_DB["gem_sapphire"], dropChance: 0.2 },
    ],
  },
  {
    id: "m_golem",
    name: "Golem de Aço",
    stats: { hp: 180, str: 16, dex: 1, int: 1 },
    expReward: 210,
    minLevel: 9,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 1.0 },
      { item: ITEMS_DB["potion_def"], dropChance: 0.4 },
      { item: ITEMS_DB["armor_steel"], dropChance: 0.1 },
      { item: ITEMS_DB["tunic_shadow"], dropChance: 0.1 },
    ],
  },

  // === Bosses (10+) ===
  {
    id: "m06",
    name: "Rei Vazio",
    stats: { hp: 300, str: 20, dex: 15, int: 20 },
    expReward: 1000,
    minLevel: 10,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 1.0 },
      { item: ITEMS_DB["elixir_heal_max"], dropChance: 1.0 }, // Recompensa garantida
      { item: ITEMS_DB["sword_void"], dropChance: 0.2 },
      { item: ITEMS_DB["robe_void"], dropChance: 0.2 },
      { item: ITEMS_DB["gold_bar"], dropChance: 0.5 }, // Rico!
    ],
  },
  {
    id: "m_dragon",
    name: "Dragão Ancião",
    stats: { hp: 500, str: 30, dex: 10, int: 25 },
    expReward: 2000,
    minLevel: 12,
    lootTable: [
      { item: ITEMS_DB["gold_coin"], dropChance: 1.0 },
      { item: ITEMS_DB["elixir_heal_max"], dropChance: 1.0 },
      { item: ITEMS_DB["armor_dragonscale"], dropChance: 0.2 },
      { item: ITEMS_DB["daggers_soul"], dropChance: 0.2 },
      { item: ITEMS_DB["gold_bar"], dropChance: 1.0 }, // Sempre dropa barra de ouro
    ],
  },
];
