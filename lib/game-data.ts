import { 
  CharacterClass, 
  Equipment, 
  Item, 
  Monster, 
  Potion, 
  Skill, 
  Currency 
} from './rpg.models';

export const ITEMS_DB: { [key: string]: Potion | Equipment | Currency | Item } = {
  // --- Moeda e Valiosos (Preço 0 = Não pode comprar) ---
  'gold_coin': { id: 'gold_coin', name: 'Ouro', type: 'Currency', value: 1, price: 0, description: 'Moeda de ouro.' },
  'gem_rare': { id: 'gem_rare', name: 'Jóia Rara', type: 'Item', price: 0, description: 'Um item valioso para vender (por 500 G).' },

  // --- Poções (Compráveis) ---
  'potion_heal': { id: 'potion_heal', name: 'Poção de Cura', type: 'Potion', effect: 'heal', value: 20, price: 50, description: 'Cura 20 HP.' },
  'potion_heal_large': { id: 'potion_heal_large', name: 'Poção de Cura Grande', type: 'Potion', effect: 'heal', value: 50, price: 250, description: 'Cura 50 HP.' },
  'potion_str': { 
    id: 'potion_str', name: 'Poção de Força', type: 'Potion', 
    effect: 'buff', value: 3, price: 75,
    buffId: 'damage_buff', duration: 10,
    description: 'Aumenta sua Força por 10 turnos.'
  },
  'potion_def': {
    id: 'potion_def', name: 'Poção de Casca Grossa', type: 'Potion',
    effect: 'buff', value: 2, price: 120,
    buffId: 'damage_reduction', duration: 10,
    description: 'Reduz o dano recebido por 10 turnos.'
  },

  // --- Equipamentos Tier 1 (Drops Iniciais / Loja Básica) ---
  'sword_rusty': { id: 'sword_rusty', name: 'Espada Enferrujada', type: 'Equipment', slot: 'weapon', stats: { str: 2 }, price: 40, description: 'Uma espada velha.' },
  'armor_leather': { id: 'armor_leather', name: 'Armadura de Couro', type: 'Equipment', slot: 'armor', stats: { hp: 10 }, price: 50, description: 'Proteção básica.' },
  'staff_apprentice': { id: 'staff_apprentice', name: 'Cajado de Aprendiz', type: 'Equipment', slot: 'weapon', stats: { int: 2 }, price: 45, description: 'Um galho com um cristal.' },

  // --- Equipamentos Tier 2 (Builds Diversas) ---
  'sword_iron': { id: 'sword_iron', name: 'Espada de Ferro', type: 'Equipment', slot: 'weapon', stats: { str: 5 }, price: 250, description: 'Uma espada militar.' },
  'armor_iron': { id: 'armor_iron', name: 'Armadura de Ferro', type: 'Equipment', slot: 'armor', stats: { hp: 25 }, price: 300, description: 'Proteção mediana.' },
  'staff_magic': { id: 'staff_magic', name: 'Cajado Mágico', type: 'Equipment', slot: 'weapon', stats: { int: 5 }, price: 260, description: 'Um cajado com poder.' },
  // Build DEX (Ladino)
  'dagger_iron': { id: 'dagger_iron', name: 'Adaga de Ferro', type: 'Equipment', slot: 'weapon', stats: { dex: 3, str: 1 }, price: 240, description: 'Rápida e leve.' },
  'shadow_leather': { id: 'shadow_leather', name: 'Couro Sombrio', type: 'Equipment', slot: 'armor', stats: { hp: 20, dex: 2 }, price: 300, description: 'Armadura leve para agilidade.' },
  // Build Híbrida (Mago/Guerreiro?)
  'spellblade_iron': { id: 'spellblade_iron', name: 'Lâmina Rúnica', type: 'Equipment', slot: 'weapon', stats: { str: 2, int: 2 }, price: 300, description: 'Uma espada que pulsa com mana.' },
  'robe_mage': { id: 'robe_mage', name: 'Robe de Mago', type: 'Equipment', slot: 'armor', stats: { hp: 15, int: 3 }, price: 280, description: 'Foco puro, pouca defesa.' },

  // --- Equipamentos Tier 3 (Fim de Jogo) ---
  'sword_steel': { id: 'sword_steel', name: 'Espada de Aço', type: 'Equipment', slot: 'weapon', stats: { str: 8, dex: 1 }, price: 700, description: 'Uma lâmina de qualidade.' },
  'armor_steel': { id: 'armor_steel', name: 'Armadura de Aço', type: 'Equipment', slot: 'armor', stats: { hp: 40, str: 1 }, price: 800, description: 'Proteção pesada.' },
  'dagger_steel': { id: 'dagger_steel', name: 'Adaga de Aço', type: 'Equipment', slot: 'weapon', stats: { dex: 5, str: 2 }, price: 650, description: 'Uma adaga de assassino.' },
  'robe_master': { id: 'robe_master', name: 'Robe de Arquimago', type: 'Equipment', slot: 'armor', stats: { hp: 25, int: 5 }, price: 750, description: 'Tecido com poder.' },

  // --- Equipamento Exclusivo da Loja (Tier 3.5) ---
  'armor_platinum': { id: 'armor_platinum', name: 'Armadura de Platina', type: 'Equipment', slot: 'armor', stats: { hp: 45, str: 2, dex: 2 }, price: 5000, description: 'Incrivelmente rara e resistente. Só na loja.' },

  // --- Equipamentos Lendários (Drops Raros / Não compráveis) ---
  'sword_void': { id: 'sword_void', name: 'Lâmina do Vazio', type: 'Equipment', slot: 'weapon', stats: { str: 10, int: 5 }, price: 0, description: 'Pulsa com energia escura.' },
  'robe_void': { id: 'robe_void', name: 'Manto do Vazio', type: 'Equipment', slot: 'armor', stats: { hp: 30, int: 5 }, price: 0, description: 'Costurado com sombras.' },
  'armor_dragonscale': { id: 'armor_dragonscale', name: 'Armadura de Escamas', type: 'Equipment', slot: 'armor', stats: { hp: 50, str: 3, dex: 3 }, price: 0, description: 'Lendária. Forjada de uma dragoa.' }
};

export const SKILLS_DB: Skill[] = [
  // --- MAGO ---
  // Nv. 1
  { id: 'm_poison', name: 'Nuvem Venenosa', type: 'Magic', target: 'Enemy', description: 'Causa 2 de dano por 5 turnos.', cooldown: 3, unlockLevel: 1, classRequirement: 'Mago', effects: [{ type: 'apply_status', effectId: 'poisoned', duration: 5, potency: 2 }] },
  { id: 'm_bolt', name: 'Tapa Elétrico', type: 'Magic', target: 'Enemy', description: 'Causa 6 de dano e paralisa por 1 turno.', cooldown: 3, unlockLevel: 1, classRequirement: 'Mago', effects: [{ type: 'direct_damage', value: 6 }, { type: 'apply_status', effectId: 'paralyzed', duration: 2 }] },
  { id: 'm_flame', name: 'Chamas Concentradas', type: 'Magic', target: 'Enemy', description: 'Causa 3 de dano e queima por 1 de dano.', cooldown: 1, unlockLevel: 1, classRequirement: 'Mago', effects: [{ type: 'direct_damage', value: 3 }, { type: 'apply_status', effectId: 'burning', potency: 1, duration: 3 }] },
  // Nv. 3
  { id: 'm_fireball', name: 'Bola de Fogo', type: 'Magic', target: 'Enemy', description: 'Causa 15 de dano de fogo.', cooldown: 3, unlockLevel: 3, classRequirement: 'Mago', effects: [{ type: 'direct_damage', value: 15 }] },
  // Nv. 5
  { id: 'm_shield', name: 'Escudo de Mana', type: 'Magic', target: 'Self', description: 'Reduz o dano recebido por 3 turnos.', cooldown: 6, unlockLevel: 5, classRequirement: 'Mago', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 4, potency: 5 }] },
  // Nv. 8 (Ultimate)
  { id: 'm_blizzard', name: 'Nevasca', type: 'Magic', target: 'Enemy', description: 'Causa 25 de dano e paralisa.', cooldown: 8, unlockLevel: 8, classRequirement: 'Mago', effects: [{ type: 'direct_damage', value: 25 }, { type: 'apply_status', effectId: 'paralyzed', duration: 3 }] },

  // --- GUERREIRO ---
  // Nv. 1
  { id: 'g_buff_str', name: 'Grito de Guerra', type: 'Skill', target: 'Self', description: 'Aumenta sua Força por 2 turnos.', cooldown: 5, unlockLevel: 1, classRequirement: 'Guerreiro', effects: [{ type: 'apply_status', effectId: 'damage_buff', duration: 3, potency: 3 }] },
  { id: 'g_buff_def', name: 'Casca Grossa', type: 'Skill', target: 'Self', description: 'Reduz o dano recebido por 2 turnos.', cooldown: 5, unlockLevel: 1, classRequirement: 'Guerreiro', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 3, potency: 2 }] },
  // Nv. 3
  { id: 'g_heavy_slam', name: 'Golpe Pesado', type: 'Skill', target: 'Enemy', description: 'Um golpe devastador que causa 12 de dano.', cooldown: 3, unlockLevel: 3, classRequirement: 'Guerreiro', effects: [{ type: 'direct_damage', value: 12 }] },
  // Nv. 5
  { id: 'g_blade_spin', name: 'Giro da Lâmina', type: 'Skill', target: 'Enemy', description: 'Causa 10 de dano, ignorando parte da defesa.', cooldown: 4, unlockLevel: 5, classRequirement: 'Guerreiro', effects: [{ type: 'direct_damage', value: 10 }] }, // (A parte de ignorar defesa é só flavor por enquanto)
  // Nv. 8 (Ultimate)
  { id: 'g_fury', name: 'Fúria Implacável', type: 'Skill', target: 'Self', description: 'Aumenta drasticamente sua Força por 3 turnos.', cooldown: 8, unlockLevel: 8, classRequirement: 'Guerreiro', effects: [{ type: 'apply_status', effectId: 'damage_buff', duration: 4, potency: 10 }] },
  
  // --- LADINO ---
  // Nv. 1
  { id: 'l_invisible', name: 'Furtividade', type: 'Skill', target: 'Self', description: 'Fica invisível. O próximo ataque inimigo provavelmente errará.', cooldown: 6, unlockLevel: 1, classRequirement: 'Ladino', effects: [{ type: 'apply_status', effectId: 'invisible', duration: 2 }] },
  // Nv. 3
  { id: 'l_double_attack', name: 'Ataque Duplo', type: 'Skill', target: 'Enemy', description: 'Ataca duas vezes rapidamente.', cooldown: 2, unlockLevel: 3, classRequirement: 'Ladino', effects: [{ type: 'direct_damage', value: 5 }, { type: 'direct_damage', value: 5 }] },
  // Nv. 5
  { id: 'l_backstab', name: 'Apunhalar', type: 'Skill', target: 'Enemy', description: 'Um golpe preciso que causa 18 de dano.', cooldown: 5, unlockLevel: 5, classRequirement: 'Ladino', effects: [{ type: 'direct_damage', value: 18 }] },
  // Nv. 8 (Ultimate)
  { id: 'l_smoke_bomb', name: 'Bomba de Fumaça', type: 'Skill', target: 'Self', description: 'Fica invisível e envenena o inimigo.', cooldown: 8, unlockLevel: 8, classRequirement: 'Ladino', effects: [{ type: 'apply_status', effectId: 'invisible', duration: 3 }, { type: 'apply_status', effectId: 'poisoned', duration: 5, potency: 3 }] }
];

export const MONSTERS_DB: Monster[] = [
  { id: 'm01', name: 'Slime', stats: { hp: 10, str: 2, dex: 1, int: 1 }, expReward: 10, minLevel: 1, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 0.5 }
  ]},
  { id: 'm02', name: 'Rato Gigante', stats: { hp: 15, str: 3, dex: 3, int: 1 }, expReward: 15, minLevel: 1, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 0.3 },
    { item: ITEMS_DB['potion_heal'], dropChance: 0.1 }
  ]},
  { id: 'm03', name: 'Goblin', stats: { hp: 25, str: 5, dex: 4, int: 2 }, expReward: 25, minLevel: 3, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 0.8 },
    { item: ITEMS_DB['sword_rusty'], dropChance: 0.05 },
    { item: ITEMS_DB['dagger_iron'], dropChance: 0.02 }, // Drop de T2
    { item: ITEMS_DB['potion_str'], dropChance: 0.02 },
    { item: ITEMS_DB['potion_def'], dropChance: 0.02 }
  ]},
  { id: 'm04', name: 'Orc', stats: { hp: 50, str: 8, dex: 3, int: 2 }, expReward: 50, minLevel: 5, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 1.0 },
    { item: ITEMS_DB['armor_iron'], dropChance: 0.05 },
    { item: ITEMS_DB['sword_iron'], dropChance: 0.05 },
    { item: ITEMS_DB['robe_mage'], dropChance: 0.03 }, // Drop de T2
    { item: ITEMS_DB['potion_heal_large'], dropChance: 0.01 }
  ]},
  { id: 'm05', name: 'Lower Demon', stats: { hp: 100, str: 12, dex: 8, int: 8 }, expReward: 120, minLevel: 8, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 1.0 },
    { item: ITEMS_DB['potion_heal_large'], dropChance: 0.1 },
    { item: ITEMS_DB['sword_steel'], dropChance: 0.05 }, // Drop de T3
    { item: ITEMS_DB['dagger_steel'], dropChance: 0.05 }, // Drop de T3
    { item: ITEMS_DB['gem_rare'], dropChance: 0.02 }
  ]},
  { id: 'm06', name: 'Rei Vazio', stats: { hp: 200, str: 20, dex: 15, int: 15 }, expReward: 500, minLevel: 10, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 1.0 },
    { item: ITEMS_DB['sword_void'], dropChance: 0.1 }, // Lendário
    { item: ITEMS_DB['robe_void'], dropChance: 0.1 }, // Lendário
    { item: ITEMS_DB['armor_dragonscale'], dropChance: 0.05 }, // Lendário
    { item: ITEMS_DB['gem_rare'], dropChance: 0.5 }
  ]},
];

export const availableClasses: CharacterClass[] = [
  { 
    name: 'Guerreiro', 
    description: 'Focado em força bruta.',
    baseStats: { hp: 20, str: 5, dex: 3, int: 1 },
    levelUpGains: { hp: 8, str: 3, dex: 1, int: 0 }
  },
  { 
    name: 'Ladino', 
    description: 'Ágil e astuto.',
    baseStats: { hp: 15, str: 3, dex: 5, int: 3 },
    levelUpGains: { hp: 5, str: 1, dex: 3, int: 1 }
  },
  { 
    name: 'Mago', 
    description: 'Inteligência é sua maior arma.',
    baseStats: { hp: 12, str: 1, dex: 3, int: 5 },
    levelUpGains: { hp: 3, str: 0, dex: 1, int: 3 }
  }
];