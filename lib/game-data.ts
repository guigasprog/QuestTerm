import { 
  CharacterClass, 
  Equipment, 
  Item, 
  Monster, 
  Potion, 
  Skill, 
  Currency,
  Summon
} from './rpg.models';

// --- 1. BANCO DE DADOS DE INVOCAÇÕES ---
export const SUMMONS_DB: Record<string, Summon> = {
  's_skeleton': { id: 's_skeleton', name: 'Esqueleto Guerreiro', stats: { hp: 30, maxHp: 30, dmg: 8 } },
  's_wolf': { id: 's_wolf', name: 'Lobo Espiritual', stats: { hp: 25, maxHp: 25, dmg: 12 } },
  's_bear': { id: 's_bear', name: 'Urso Pardo', stats: { hp: 60, maxHp: 60, dmg: 15 } },
  's_fire_elem': { id: 's_fire_elem', name: 'Elemental de Fogo', stats: { hp: 40, maxHp: 40, dmg: 25 } },
  's_golem': { id: 's_golem', name: 'Golem de Carne', stats: { hp: 100, maxHp: 100, dmg: 20 } },
};

// --- 2. BANCO DE DADOS DE ITENS ---
export const ITEMS_DB: { [key: string]: Potion | Equipment | Currency | Item } = {
  // --- Moeda e Valiosos (Preço 0 = Não pode comprar, só vender) ---
  'gold_coin': { id: 'gold_coin', name: 'Ouro', type: 'Currency', value: 1, price: 0, description: 'Moeda de ouro.' },
  'gem_ruby': { id: 'gem_ruby', name: 'Rubi', type: 'Item', value: 250, price: 0, description: 'Uma gema vermelha. Vende por 125 G.' },
  'gem_sapphire': { id: 'gem_sapphire', name: 'Safira', type: 'Item', value: 350, price: 0, description: 'Uma gema azul. Vende por 175 G.' },
  'gold_bar': { id: 'gold_bar', name: 'Barra de Ouro', type: 'Item', value: 1000, price: 0, description: 'Muito pesada. Vende por 500 G.' },
  'gem_rare': { id: 'gem_rare', name: 'Jóia Rara', type: 'Item', value: 500, price: 0, description: 'Um item valioso. Vende por 250 G.' },

  // --- Poções (Compráveis) ---
  'potion_heal': { id: 'potion_heal', name: 'Poção de Cura', type: 'Potion', effect: 'heal', value: 20, price: 50, description: 'Cura 20 HP.' },
  'potion_heal_large': { id: 'potion_heal_large', name: 'Poção de Cura Grande', type: 'Potion', effect: 'heal', value: 50, price: 250, description: 'Cura 50 HP.' },
  'elixir_heal_max': { id: 'elixir_heal_max', name: 'Elixir de Vida', type: 'Potion', effect: 'heal', value: 150, price: 800, description: 'Cura 150 HP.' },
  
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
  'potion_dex': {
    id: 'potion_dex', name: 'Poção de Agilidade', type: 'Potion',
    effect: 'buff', value: 3, price: 100,
    buffId: 'damage_buff', duration: 10, // Usando damage_buff genérico por enquanto ou crie dexterity_buff
    description: 'Aumenta sua Agilidade por 10 turnos.'
  },

  // --- Equipamentos Tier 1 (Iniciais - Value 1) ---
  'sword_rusty': { id: 'sword_rusty', name: 'Espada Enferrujada', type: 'Equipment', slot: 'weapon', stats: { str: 2 }, tier: 1, price: 40, description: 'Uma espada velha.' },
  'dagger_rusty': { id: 'dagger_rusty', name: 'Adaga Enferrujada', type: 'Equipment', slot: 'weapon', stats: { dex: 2 }, tier: 1, price: 40, description: 'Uma adaga gasta.' },
  'staff_apprentice': { id: 'staff_apprentice', name: 'Cajado de Aprendiz', type: 'Equipment', slot: 'weapon', stats: { int: 2 }, tier: 1, price: 45, description: 'Um galho com um cristal.' },
  'mace_cleric': { id: 'mace_cleric', name: 'Maça de Clérigo', type: 'Equipment', slot: 'weapon', stats: { str: 1, int: 1 }, tier: 1, price: 45, description: 'Simples, mas sagrada.' },
  'bow_hunter': { id: 'bow_hunter', name: 'Arco de Caça', type: 'Equipment', slot: 'weapon', stats: { dex: 2 }, tier: 1, price: 45, description: 'Feito de madeira flexível.' },
  
  'armor_leather': { id: 'armor_leather', name: 'Armadura de Couro', type: 'Equipment', slot: 'armor', stats: { hp: 10 }, tier: 1, price: 50, description: 'Proteção básica.' },
  'robe_cloth': { id: 'robe_cloth', name: 'Robe de Pano', type: 'Equipment', slot: 'armor', stats: { hp: 5, int: 1 }, tier: 1, price: 40, description: 'Roupas simples de linho.' },

  // --- Equipamentos Tier 2 (Intermediários - Value 2) ---
  'sword_iron': { id: 'sword_iron', name: 'Espada de Ferro', type: 'Equipment', slot: 'weapon', stats: { str: 5 }, tier: 2, price: 250, description: 'Uma espada militar.' },
  'battleaxe_iron': { id: 'battleaxe_iron', name: 'Machado de Ferro', type: 'Equipment', slot: 'weapon', stats: { str: 7, dex: -1 }, tier: 2, price: 280, description: 'Poderoso, mas lento.' },
  'staff_magic': { id: 'staff_magic', name: 'Cajado Mágico', type: 'Equipment', slot: 'weapon', stats: { int: 5 }, tier: 2, price: 260, description: 'Um cajado com poder.' },
  'dagger_iron': { id: 'dagger_iron', name: 'Adaga de Ferro', type: 'Equipment', slot: 'weapon', stats: { dex: 3, str: 1 }, tier: 2, price: 240, description: 'Rápida e leve.' },
  'bow_composite': { id: 'bow_composite', name: 'Arco Composto', type: 'Equipment', slot: 'weapon', stats: { dex: 5 }, tier: 2, price: 270, description: 'Alcance superior.' },
  'hammer_war': { id: 'hammer_war', name: 'Martelo de Guerra', type: 'Equipment', slot: 'weapon', stats: { str: 4, int: 2 }, tier: 2, price: 280, description: 'Esmaga infiéis.' },

  'armor_iron': { id: 'armor_iron', name: 'Armadura de Ferro', type: 'Equipment', slot: 'armor', stats: { hp: 25 }, tier: 2, price: 300, description: 'Proteção mediana.' },
  'shadow_leather': { id: 'shadow_leather', name: 'Couro Sombrio', type: 'Equipment', slot: 'armor', stats: { hp: 20, dex: 2 }, tier: 2, price: 300, description: 'Armadura leve para agilidade.' },
  'robe_mage': { id: 'robe_mage', name: 'Robe de Mago', type: 'Equipment', slot: 'armor', stats: { hp: 15, int: 3 }, tier: 2, price: 280, description: 'Foco puro, pouca defesa.' },

  // --- Equipamentos Tier 3 (Avançados - Value 3) ---
  'sword_steel': { id: 'sword_steel', name: 'Espada de Aço', type: 'Equipment', slot: 'weapon', stats: { str: 8, dex: 1 }, tier: 3, price: 700, description: 'Uma lâmina de qualidade.' },
  'dagger_steel': { id: 'dagger_steel', name: 'Adaga de Aço', type: 'Equipment', slot: 'weapon', stats: { dex: 5, str: 2 }, tier: 3, price: 650, description: 'Uma adaga de assassino.' },
  'staff_archmage': { id: 'staff_archmage', name: 'Cajado de Arquimago', type: 'Equipment', slot: 'weapon', stats: { int: 8, hp: 5 }, tier: 3, price: 720, description: 'Canaliza grande poder.' },
  'bow_elven': { id: 'bow_elven', name: 'Arco Élfico', type: 'Equipment', slot: 'weapon', stats: { dex: 8, int: 1 }, tier: 3, price: 750, description: 'Precisão élfica.' },
  
  'armor_steel': { id: 'armor_steel', name: 'Armadura de Aço', type: 'Equipment', slot: 'armor', stats: { hp: 40, str: 1 }, tier: 3, price: 800, description: 'Proteção pesada.' },
  'tunic_shadow': { id: 'tunic_shadow', name: 'Túnica das Sombras', type: 'Equipment', slot: 'armor', stats: { hp: 30, dex: 4 }, tier: 3, price: 780, description: 'Feita de seda de aranha.' },
  'robe_master': { id: 'robe_master', name: 'Robe de Arquimago', type: 'Equipment', slot: 'armor', stats: { hp: 25, int: 5 }, tier: 3, price: 750, description: 'Tecido com poder.' },

  // --- Tier 4 (Exclusivo da Loja - Value 4) ---
  'armor_platinum': { id: 'armor_platinum', name: 'Armadura de Platina', type: 'Equipment', slot: 'armor', stats: { hp: 45, str: 2, dex: 2 }, tier: 4, price: 5000, description: 'Incrivelmente rara e resistente.' },

  // --- Tier 5 (Lendários - Drop Only - Value 5) ---
  'sword_void': { id: 'sword_void', name: 'Lâmina do Vazio', type: 'Equipment', slot: 'weapon', stats: { str: 10, int: 5 }, tier: 5, price: 0, description: 'Pulsa com energia escura.' },
  'robe_void': { id: 'robe_void', name: 'Manto do Vazio', type: 'Equipment', slot: 'armor', stats: { hp: 30, int: 5 }, tier: 5, price: 0, description: 'Costurado com sombras.' },
  'daggers_soul': { id: 'daggers_soul', name: 'Adagas da Alma', type: 'Equipment', slot: 'weapon', stats: { dex: 10, str: 2 }, tier: 5, price: 0, description: 'Se movem sozinhas.' },
  'armor_dragonscale': { id: 'armor_dragonscale', name: 'Armadura de Escamas', type: 'Equipment', slot: 'armor', stats: { hp: 50, str: 3, dex: 3 }, tier: 5, price: 0, description: 'Lendária. Forjada de uma dragoa.' }
};

// --- 3. BANCO DE DADOS DE HABILIDADES ---
export const SKILLS_DB: Skill[] = [
  // ================== MAGO ==================
  // Base
  { id: 'm_poison', name: 'Nuvem Venenosa', type: 'Magic', target: 'Enemy', description: 'Causa 2 de dano por 5 turnos.', cooldown: 3, unlockLevel: 1, classRequirement: 'Mago', effects: [{ type: 'apply_status', effectId: 'poisoned', duration: 5, potency: 2 }] },
  { id: 'm_bolt', name: 'Tapa Elétrico', type: 'Magic', target: 'Enemy', description: 'Causa 6 de dano e paralisa por 1 turno.', cooldown: 3, unlockLevel: 1, classRequirement: 'Mago', effects: [{ type: 'direct_damage', value: 6 }, { type: 'apply_status', effectId: 'paralyzed', duration: 2 }] },
  { id: 'm_flame', name: 'Chamas Concentradas', type: 'Magic', target: 'Enemy', description: 'Causa 3 de dano e queima.', cooldown: 1, unlockLevel: 1, classRequirement: 'Mago', effects: [{ type: 'direct_damage', value: 3 }, { type: 'apply_status', effectId: 'burning', potency: 1, duration: 3 }] },
  { id: 'm_fireball', name: 'Bola de Fogo', type: 'Magic', target: 'Enemy', description: 'Causa 15 de dano de fogo.', cooldown: 3, unlockLevel: 3, classRequirement: 'Mago', effects: [{ type: 'direct_damage', value: 15 }] },
  { id: 'm_shield', name: 'Escudo de Mana', type: 'Magic', target: 'Self', description: 'Reduz dano recebido.', cooldown: 6, unlockLevel: 5, classRequirement: 'Mago', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 4, potency: 5 }] },
  // Evoluções (Invocador)
  { id: 'sum_skeleton', name: 'Erguer Mortos', type: 'Magic', target: 'Self', description: 'Invoca um Esqueleto.', cooldown: 4, unlockLevel: 10, classRequirement: 'Invocador', effects: [{ type: 'summon', summonId: 's_skeleton' }] },
  { id: 'sum_golem', name: 'Criar Golem', type: 'Magic', target: 'Self', description: 'Invoca um Golem tanque.', cooldown: 10, unlockLevel: 20, classRequirement: 'Necromante', effects: [{ type: 'summon', summonId: 's_golem' }] },
  { id: 'sum_elem', name: 'Invocar Elemental', type: 'Magic', target: 'Self', description: 'Invoca um Elemental de Fogo.', cooldown: 8, unlockLevel: 20, classRequirement: 'Mestre Elemental', effects: [{ type: 'summon', summonId: 's_fire_elem' }] },
  // Evoluções (Feiticeiro -> Arquimago)
  { id: 'm_blizzard', name: 'Nevasca', type: 'Magic', target: 'Enemy', description: 'Causa 25 de dano e paralisa.', cooldown: 8, unlockLevel: 10, classRequirement: 'Feiticeiro', effects: [{ type: 'direct_damage', value: 25 }, { type: 'apply_status', effectId: 'paralyzed', duration: 3 }] },
  { id: 'm_armageddon', name: 'Armageddon', type: 'Magic', target: 'Enemy', description: 'A magia final. Causa 100 de dano.', cooldown: 15, unlockLevel: 20, classRequirement: 'Arquimago', effects: [{ type: 'direct_damage', value: 100 }, { type: 'apply_status', effectId: 'burning', potency: 5, duration: 3 }] },

  // ================== GUERREIRO ==================
  // Base
  { id: 'g_buff_str', name: 'Grito de Guerra', type: 'Skill', target: 'Self', description: 'Aumenta Força.', cooldown: 5, unlockLevel: 1, classRequirement: 'Guerreiro', effects: [{ type: 'apply_status', effectId: 'damage_buff', duration: 3, potency: 3 }] },
  { id: 'g_buff_def', name: 'Casca Grossa', type: 'Skill', target: 'Self', description: 'Reduz dano recebido.', cooldown: 5, unlockLevel: 1, classRequirement: 'Guerreiro', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 3, potency: 2 }] },
  { id: 'g_heavy_slam', name: 'Golpe Pesado', type: 'Skill', target: 'Enemy', description: 'Golpe de 12 de dano.', cooldown: 3, unlockLevel: 3, classRequirement: 'Guerreiro', effects: [{ type: 'direct_damage', value: 12 }] },
  { id: 'g_blade_spin', name: 'Giro da Lâmina', type: 'Skill', target: 'Enemy', description: 'Causa 10 de dano.', cooldown: 4, unlockLevel: 5, classRequirement: 'Guerreiro', effects: [{ type: 'direct_damage', value: 10 }] },
  // Evoluções (Bárbaro)
  { id: 'b_rage', name: 'Raiva', type: 'Skill', target: 'Self', description: 'Aumenta muito a Força.', cooldown: 6, unlockLevel: 10, classRequirement: 'Bárbaro', effects: [{ type: 'apply_status', effectId: 'damage_buff', duration: 4, potency: 10 }] },
  { id: 'b_roar', name: 'Rugido Bestial', type: 'Skill', target: 'Enemy', description: 'Paralisa e causa dano.', cooldown: 6, unlockLevel: 20, classRequirement: 'Bestial', effects: [{ type: 'direct_damage', value: 30 }, { type: 'apply_status', effectId: 'paralyzed', duration: 2 }] },
  { id: 'b_berserk', name: 'Fúria Berserker', type: 'Skill', target: 'Self', description: 'Força Extrema.', cooldown: 10, unlockLevel: 20, classRequirement: 'Berserker', effects: [{ type: 'apply_status', effectId: 'damage_buff', duration: 5, potency: 25 }] },
  // Evoluções (Cavaleiro)
  { id: 'k_shield_wall', name: 'Muralha', type: 'Skill', target: 'Self', description: 'Defesa massiva.', cooldown: 8, unlockLevel: 10, classRequirement: 'Cavaleiro', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 3, potency: 10 }] },
  { id: 'k_rally', name: 'Comando', type: 'Skill', target: 'Self', description: 'Buffs defensivos e ofensivos.', cooldown: 8, unlockLevel: 20, classRequirement: 'General', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 4, potency: 5 }, { type: 'apply_status', effectId: 'damage_buff', duration: 4, potency: 5 }] },

  // ================== LADINO ==================
  // Base
  { id: 'l_invisible', name: 'Furtividade', type: 'Skill', target: 'Self', description: 'Fica invisível.', cooldown: 6, unlockLevel: 1, classRequirement: 'Ladino', effects: [{ type: 'apply_status', effectId: 'invisible', duration: 2 }] },
  { id: 'l_poison_stab', name: 'Ataque Peçonhento', type: 'Skill', target: 'Enemy', description: 'Causa 3 de dano e envenena.', cooldown: 3, unlockLevel: 1, classRequirement: 'Ladino', effects: [{ type: 'direct_damage', value: 3 }, { type: 'apply_status', effectId: 'poisoned', duration: 5, potency: 3 }] },
  { id: 'l_double_attack', name: 'Ataque Duplo', type: 'Skill', target: 'Enemy', description: 'Ataca duas vezes.', cooldown: 2, unlockLevel: 3, classRequirement: 'Ladino', effects: [{ type: 'direct_damage', value: 5 }, { type: 'direct_damage', value: 5 }] },
  { id: 'l_backstab', name: 'Apunhalar', type: 'Skill', target: 'Enemy', description: 'Golpe de 18 dano.', cooldown: 5, unlockLevel: 5, classRequirement: 'Ladino', effects: [{ type: 'direct_damage', value: 18 }] },
  // Evoluções (Assassino)
  { id: 'l_bleed_out', name: 'Hemorragia', type: 'Skill', target: 'Enemy', description: 'Sangramento profundo.', cooldown: 5, unlockLevel: 10, classRequirement: 'Assassino', effects: [{ type: 'apply_status', effectId: 'poisoned', duration: 4, potency: 8 }] },
  { id: 'l_phantom', name: 'Golpe Fantasma', type: 'Skill', target: 'Enemy', description: 'Dano massivo (80).', cooldown: 12, unlockLevel: 20, classRequirement: 'Lâmina Fantasma', effects: [{ type: 'direct_damage', value: 80 }, { type: 'apply_status', effectId: 'invisible', duration: 2 }] },
  // Evoluções (Shadow Walker - antigo Ranger movido)
  { id: 'l_shadow_step', name: 'Passo das Sombras', type: 'Skill', target: 'Self', description: 'Invisibilidade longa.', cooldown: 8, unlockLevel: 10, classRequirement: 'Shadow Walker', effects: [{ type: 'apply_status', effectId: 'invisible', duration: 4 }] },

  // ================== CLÉRIGO ==================
  // Base
  { id: 'c_holy_light', name: 'Luz Sagrada', type: 'Magic', target: 'Enemy', description: 'Queima com luz (8 dano).', cooldown: 2, unlockLevel: 1, classRequirement: 'Clérigo', effects: [{ type: 'direct_damage', value: 8 }] },
  { id: 'c_bless', name: 'Benção', type: 'Magic', target: 'Self', description: 'Aumenta defesa e força.', cooldown: 5, unlockLevel: 1, classRequirement: 'Clérigo', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 3, potency: 2 }, { type: 'apply_status', effectId: 'damage_buff', duration: 3, potency: 1 }] },
  { id: 'c_smite', name: 'Punição Divina', type: 'Magic', target: 'Enemy', description: 'Dano sagrado (15) e atordoa.', cooldown: 5, unlockLevel: 5, classRequirement: 'Clérigo', effects: [{ type: 'direct_damage', value: 15 }, { type: 'apply_status', effectId: 'paralyzed', duration: 1 }] },
  // Evoluções (Sacerdote)
  { id: 'c_divine_int', name: 'Intervenção Divina', type: 'Magic', target: 'Self', description: 'Imunidade a dano por 2 turnos.', cooldown: 12, unlockLevel: 10, classRequirement: 'Sacerdote', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 2, potency: 999 }] },
  // Evoluções (Paladino)
  { id: 'c_holy_fire', name: 'Fogo Sagrado', type: 'Magic', target: 'Enemy', description: 'Queima o inimigo com fé.', cooldown: 4, unlockLevel: 10, classRequirement: 'Paladino', effects: [{ type: 'direct_damage', value: 20 }, { type: 'apply_status', effectId: 'burning', duration: 3, potency: 5 }] },
  { id: 'c_avatar', name: 'Avatar Divino', type: 'Magic', target: 'Self', description: 'Imortal e forte.', cooldown: 20, unlockLevel: 20, classRequirement: 'Cruzado', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 3, potency: 999 }, { type: 'apply_status', effectId: 'damage_buff', duration: 3, potency: 20 }] },

  // ================== DRUIDA ==================
  // Base
  { id: 'd_thorns', name: 'Espinhos', type: 'Magic', target: 'Enemy', description: 'Causa 5 de dano e sangra.', cooldown: 2, unlockLevel: 1, classRequirement: 'Druida', effects: [{ type: 'direct_damage', value: 5 }, { type: 'apply_status', effectId: 'poisoned', duration: 3, potency: 2 }] },
  { id: 'd_nature_touch', name: 'Toque Natural', type: 'Magic', target: 'Self', description: 'Aumenta defesa.', cooldown: 5, unlockLevel: 1, classRequirement: 'Druida', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 2, potency: 2 }] },
  // Evoluções (Xamã)
  { id: 'sum_wolf', name: 'Espírito do Lobo', type: 'Magic', target: 'Self', description: 'Invoca um lobo.', cooldown: 5, unlockLevel: 10, classRequirement: 'Xamã', effects: [{ type: 'summon', summonId: 's_wolf' }] },
  { id: 'sum_bear', name: 'Espírito do Urso', type: 'Magic', target: 'Self', description: 'Invoca um urso.', cooldown: 8, unlockLevel: 20, classRequirement: 'Senhor das Feras', effects: [{ type: 'summon', summonId: 's_bear' }] },
  // Evoluções (Metamorfo)
  { id: 'd_bear_form', name: 'Forma de Urso', type: 'Magic', target: 'Self', description: 'Aumenta muito a defesa.', cooldown: 8, unlockLevel: 10, classRequirement: 'Metamorfo', effects: [{ type: 'apply_status', effectId: 'damage_reduction', duration: 4, potency: 10 }] },

  // ================== CAÇADOR ==================
  // Base
  { id: 'r_quick_shot', name: 'Disparo Rápido', type: 'Skill', target: 'Enemy', description: 'Tiro rápido de 6 de dano.', cooldown: 1, unlockLevel: 1, classRequirement: 'Caçador', effects: [{ type: 'direct_damage', value: 6 }] },
  { id: 'r_trap', name: 'Armadilha', type: 'Skill', target: 'Enemy', description: 'Prende o inimigo (Paralisa 2t).', cooldown: 6, unlockLevel: 3, classRequirement: 'Caçador', effects: [{ type: 'apply_status', effectId: 'paralyzed', duration: 2 }] },
  { id: 'r_volley', name: 'Chuva de Flechas', type: 'Skill', target: 'Enemy', description: 'Vários disparos (3x4 dano).', cooldown: 4, unlockLevel: 5, classRequirement: 'Caçador', effects: [{ type: 'direct_damage', value: 4 }, { type: 'direct_damage', value: 4 }, { type: 'direct_damage', value: 4 }] },
  // Evoluções (Hunter)
  { id: 'r_poison_arrow', name: 'Flecha Venenosa', type: 'Skill', target: 'Enemy', description: 'Dano e veneno forte.', cooldown: 4, unlockLevel: 10, classRequirement: 'Hunter', effects: [{ type: 'direct_damage', value: 15 }, { type: 'apply_status', effectId: 'poisoned', duration: 4, potency: 6 }] },
  { id: 'r_call_wild', name: 'Chamado Selvagem', type: 'Skill', target: 'Self', description: 'Invoca um Lobo.', cooldown: 6, unlockLevel: 20, classRequirement: 'Beastmaster', effects: [{ type: 'summon', summonId: 's_wolf' }] },
  // Evoluções (Sniper)
  { id: 'r_snipe', name: 'Tiro Preciso', type: 'Skill', target: 'Enemy', description: 'Um tiro na cabeça. 40 de dano.', cooldown: 8, unlockLevel: 10, classRequirement: 'Sniper', effects: [{ type: 'direct_damage', value: 40 }] },
  { id: 'r_rain_arrows', name: 'Tempestade', type: 'Skill', target: 'Enemy', description: 'Apaga o sol (10x12 dano).', cooldown: 15, unlockLevel: 20, classRequirement: 'Sharpshooter', effects: [{ type: 'direct_damage', value: 12 }, { type: 'direct_damage', value: 12 }, { type: 'direct_damage', value: 12 }, { type: 'direct_damage', value: 12 }, { type: 'direct_damage', value: 12 }, { type: 'direct_damage', value: 12 }, { type: 'direct_damage', value: 12 }, { type: 'direct_damage', value: 12 }, { type: 'direct_damage', value: 12 }, { type: 'direct_damage', value: 12 }] }
];

// --- 4. ÁRVORE DE EVOLUÇÃO (Configuração) ---
export const CLASS_EVOLUTIONS: Record<string, { level: number, options: string[] }> = {
  // TIER 1 -> TIER 2 (Nível 10)
  'Guerreiro': { level: 10, options: ['Bárbaro', 'Cavaleiro'] },
  'Ladino': { level: 10, options: ['Assassino', 'Shadow Walker'] }, 
  'Mago': { level: 10, options: ['Invocador', 'Feiticeiro'] },
  'Clérigo': { level: 10, options: ['Sacerdote', 'Paladino'] },
  'Druida': { level: 10, options: ['Xamã', 'Metamorfo'] },
  'Caçador': { level: 10, options: ['Hunter', 'Sniper'] },

  // TIER 2 -> TIER 3 (Nível 20 - Elite)
  'Bárbaro': { level: 20, options: ['Berserker', 'Bestial'] },
  'Cavaleiro': { level: 20, options: ['General'] },
  'Assassino': { level: 20, options: ['Lâmina Fantasma'] },
  'Shadow Walker': { level: 20, options: ['Nightstalker'] },
  'Invocador': { level: 20, options: ['Necromante', 'Mestre Elemental'] },
  'Feiticeiro': { level: 20, options: ['Arquimago'] },
  'Sacerdote': { level: 20, options: ['Sumo Sacerdote'] },
  'Paladino': { level: 20, options: ['Cruzado'] },
  'Xamã': { level: 20, options: ['Senhor das Feras'] },
  'Metamorfo': { level: 20, options: ['Avatar da Natureza'] },
  'Hunter': { level: 20, options: ['Beastmaster'] },
  'Sniper': { level: 20, options: ['Sharpshooter'] },
};

// --- 5. BANCO DE DADOS DE TODAS AS CLASSES (Base, Sub e Elite) ---
export const CLASSES_DB: Record<string, CharacterClass> = {
  // === GUERREIRO ===
  'Guerreiro': { name: 'Guerreiro', description: 'Focado em força bruta.', baseStats: { hp: 20, str: 5, dex: 3, int: 1 }, levelUpGains: { hp: 8, str: 3, dex: 1, int: 0 } },
  'Bárbaro': { name: 'Bárbaro', description: 'Fúria incontrolável.', baseStats: { hp: 25, str: 7, dex: 3, int: 0 }, levelUpGains: { hp: 10, str: 4, dex: 1, int: 0 } },
  'Cavaleiro': { name: 'Cavaleiro', description: 'Defesa e tática.', baseStats: { hp: 22, str: 6, dex: 2, int: 2 }, levelUpGains: { hp: 9, str: 3, dex: 2, int: 1 } },
  'Berserker': { name: 'Berserker', description: 'Poder máximo.', baseStats: { hp: 30, str: 10, dex: 4, int: 0 }, levelUpGains: { hp: 12, str: 6, dex: 2, int: -1 } },
  'Bestial': { name: 'Bestial', description: 'Monstro de batalha.', baseStats: { hp: 35, str: 8, dex: 5, int: 0 }, levelUpGains: { hp: 15, str: 5, dex: 2, int: 0 } },
  'General': { name: 'General', description: 'Comanda o campo.', baseStats: { hp: 28, str: 7, dex: 4, int: 4 }, levelUpGains: { hp: 10, str: 4, dex: 3, int: 2 } },

  // === MAGO ===
  'Mago': { name: 'Mago', description: 'Artes arcanas.', baseStats: { hp: 12, str: 1, dex: 3, int: 5 }, levelUpGains: { hp: 3, str: 0, dex: 1, int: 3 } },
  'Invocador': { name: 'Invocador', description: 'Invoca criaturas.', baseStats: { hp: 14, str: 1, dex: 3, int: 6 }, levelUpGains: { hp: 4, str: 0, dex: 2, int: 4 } },
  'Feiticeiro': { name: 'Feiticeiro', description: 'Poder bruto.', baseStats: { hp: 12, str: 0, dex: 4, int: 7 }, levelUpGains: { hp: 3, str: 0, dex: 3, int: 5 } },
  'Necromante': { name: 'Necromante', description: 'Comanda mortos.', baseStats: { hp: 20, str: 2, dex: 2, int: 8 }, levelUpGains: { hp: 6, str: 1, dex: 1, int: 5 } },
  'Mestre Elemental': { name: 'Mestre Elemental', description: 'Fúria elemental.', baseStats: { hp: 15, str: 0, dex: 4, int: 10 }, levelUpGains: { hp: 4, str: 0, dex: 3, int: 7 } },
  'Arquimago': { name: 'Arquimago', description: 'Ápice da magia.', baseStats: { hp: 15, str: 0, dex: 3, int: 12 }, levelUpGains: { hp: 5, str: 0, dex: 2, int: 8 } },

  // === LADINO ===
  'Ladino': { name: 'Ladino', description: 'Ágil e mortal.', baseStats: { hp: 15, str: 3, dex: 5, int: 3 }, levelUpGains: { hp: 5, str: 1, dex: 3, int: 1 } },
  'Assassino': { name: 'Assassino', description: 'Especialista.', baseStats: { hp: 16, str: 4, dex: 7, int: 2 }, levelUpGains: { hp: 5, str: 2, dex: 5, int: 1 } },
  'Shadow Walker': { name: 'Shadow Walker', description: 'Caminha nas sombras.', baseStats: { hp: 16, str: 3, dex: 6, int: 4 }, levelUpGains: { hp: 5, str: 1, dex: 4, int: 2 } },
  'Lâmina Fantasma': { name: 'Lâmina Fantasma', description: 'Mata sem ser visto.', baseStats: { hp: 18, str: 3, dex: 10, int: 4 }, levelUpGains: { hp: 6, str: 2, dex: 7, int: 2 } },
  'Nightstalker': { name: 'Nightstalker', description: 'Pesadelo vivo.', baseStats: { hp: 20, str: 4, dex: 9, int: 5 }, levelUpGains: { hp: 7, str: 2, dex: 6, int: 3 } },

  // === CLÉRIGO ===
  'Clérigo': { name: 'Clérigo', description: 'Guerreiro sagrado.', baseStats: { hp: 22, str: 4, dex: 1, int: 4 }, levelUpGains: { hp: 7, str: 2, dex: 0, int: 2 } },
  'Sacerdote': { name: 'Sacerdote', description: 'Cura e suporte.', baseStats: { hp: 20, str: 2, dex: 2, int: 6 }, levelUpGains: { hp: 6, str: 1, dex: 1, int: 4 } },
  'Paladino': { name: 'Paladino', description: 'Tanque sagrado.', baseStats: { hp: 28, str: 6, dex: 0, int: 3 }, levelUpGains: { hp: 9, str: 4, dex: 0, int: 2 } },
  'Sumo Sacerdote': { name: 'Sumo Sacerdote', description: 'Voz dos deuses.', baseStats: { hp: 22, str: 2, dex: 3, int: 9 }, levelUpGains: { hp: 7, str: 1, dex: 2, int: 6 } },
  'Cruzado': { name: 'Cruzado', description: 'Espada da justiça.', baseStats: { hp: 35, str: 8, dex: 1, int: 4 }, levelUpGains: { hp: 12, str: 5, dex: 1, int: 3 } },

  // === DRUIDA ===
  'Druida': { name: 'Druida', description: 'Protetor da natureza.', baseStats: { hp: 18, str: 2, dex: 3, int: 4 }, levelUpGains: { hp: 6, str: 1, dex: 1, int: 2 } },
  'Xamã': { name: 'Xamã', description: 'Comunga espíritos.', baseStats: { hp: 20, str: 3, dex: 2, int: 5 }, levelUpGains: { hp: 7, str: 2, dex: 1, int: 3 } },
  'Metamorfo': { name: 'Metamorfo', description: 'Muda de forma.', baseStats: { hp: 25, str: 5, dex: 4, int: 2 }, levelUpGains: { hp: 8, str: 3, dex: 2, int: 1 } },
  'Senhor das Feras': { name: 'Senhor das Feras', description: 'Lidera a alcateia.', baseStats: { hp: 25, str: 5, dex: 5, int: 5 }, levelUpGains: { hp: 9, str: 3, dex: 3, int: 3 } },
  'Avatar da Natureza': { name: 'Avatar da Natureza', description: 'Força da vida.', baseStats: { hp: 35, str: 6, dex: 3, int: 6 }, levelUpGains: { hp: 12, str: 4, dex: 2, int: 4 } },

  // === CAÇADOR ===
  'Caçador': { name: 'Caçador', description: 'Mestre do arco.', baseStats: { hp: 18, str: 2, dex: 6, int: 2 }, levelUpGains: { hp: 6, str: 1, dex: 3, int: 0 } },
  'Hunter': { name: 'Hunter', description: 'Caçador furtivo.', baseStats: { hp: 20, str: 3, dex: 7, int: 2 }, levelUpGains: { hp: 7, str: 2, dex: 4, int: 1 } },
  'Sniper': { name: 'Sniper', description: 'Tiro de longa distância.', baseStats: { hp: 18, str: 1, dex: 9, int: 3 }, levelUpGains: { hp: 5, str: 1, dex: 5, int: 1 } },
  'Beastmaster': { name: 'Beastmaster', description: 'Luta com bestas.', baseStats: { hp: 25, str: 5, dex: 6, int: 4 }, levelUpGains: { hp: 9, str: 3, dex: 3, int: 2 } },
  'Sharpshooter': { name: 'Sharpshooter', description: 'Mira perfeita.', baseStats: { hp: 20, str: 2, dex: 12, int: 2 }, levelUpGains: { hp: 6, str: 1, dex: 7, int: 1 } },
};

// --- 6. MONSTROS (Bosses e Níveis) ---
export const MONSTERS_DB: Monster[] = [
  { id: 'm01', name: 'Slime', stats: { hp: 10, str: 2, dex: 1, int: 1 }, expReward: 12, minLevel: 1, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 0.7 }, // Era 0.5
    { item: ITEMS_DB['potion_heal'], dropChance: 0.15 } // Novo
  ]},
  { id: 'm02', name: 'Rato Gigante', stats: { hp: 15, str: 3, dex: 3, int: 1 }, expReward: 18, minLevel: 1, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 0.6 }, // Era 0.3
    { item: ITEMS_DB['potion_heal'], dropChance: 0.3 } // Era 0.1 (Agora é essencial)
  ]},
  { id: 'm_skeleton', name: 'Esqueleto', stats: { hp: 20, str: 4, dex: 2, int: 1 }, expReward: 25, minLevel: 2, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 0.8 }, // Era 0.5
    { item: ITEMS_DB['potion_heal'], dropChance: 0.25 },
    { item: ITEMS_DB['sword_rusty'], dropChance: 0.1 },
  ]},
  
  // Nível 3-4 (Caverna)
  { id: 'm03', name: 'Goblin', stats: { hp: 25, str: 5, dex: 4, int: 2 }, expReward: 32, minLevel: 3, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 0.9 }, // Era 0.8
    { item: ITEMS_DB['potion_heal'], dropChance: 0.3 }, // Adicionado para sustain
    { item: ITEMS_DB['dagger_iron'], dropChance: 0.05 },
    { item: ITEMS_DB['potion_str'], dropChance: 0.1 }, // Era 0.02
  ]},
  { id: 'm_zombie', name: 'Zumbi', stats: { hp: 35, str: 6, dex: 1, int: 1 }, expReward: 40, minLevel: 4, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 0.9 },
    { item: ITEMS_DB['potion_heal'], dropChance: 0.3 },
    { item: ITEMS_DB['armor_leather'], dropChance: 0.1 },
    { item: ITEMS_DB['potion_def'], dropChance: 0.1 }
  ]},
  
  // Nível 5-7 (Masmorra)
  { id: 'm04', name: 'Orc', stats: { hp: 50, str: 8, dex: 3, int: 2 }, expReward: 65, minLevel: 5, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 1.0 }, // Sempre dropa ouro
    { item: ITEMS_DB['potion_heal'], dropChance: 0.4 }, // Alta chance de cura
    { item: ITEMS_DB['armor_iron'], dropChance: 0.08 },
    { item: ITEMS_DB['sword_iron'], dropChance: 0.08 },
    { item: ITEMS_DB['potion_heal_large'], dropChance: 0.1 } // Era 0.01
  ]},
  { id: 'm_troll', name: 'Troll', stats: { hp: 80, str: 10, dex: 2, int: 1 }, expReward: 95, minLevel: 6, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 1.0 },
    { item: ITEMS_DB['potion_heal_large'], dropChance: 0.2 },
    { item: ITEMS_DB['battleaxe_iron'], dropChance: 0.1 },
    { item: ITEMS_DB['gem_ruby'], dropChance: 0.1 } // Era 0.01
  ]},
  { id: 'm_necromancer', name: 'Necromante', stats: { hp: 60, str: 4, dex: 5, int: 10 }, expReward: 110, minLevel: 7, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 1.0 },
    { item: ITEMS_DB['potion_int'], dropChance: 0.3 }, // Novo drop
    { item: ITEMS_DB['staff_magic'], dropChance: 0.1 },
    { item: ITEMS_DB['robe_mage'], dropChance: 0.1 },
  ]},
  
  // Nível 8-9 (Abismo)
  { id: 'm05', name: 'Lower Demon', stats: { hp: 100, str: 12, dex: 8, int: 8 }, expReward: 160, minLevel: 8, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 1.0 },
    { item: ITEMS_DB['potion_heal_large'], dropChance: 0.4 }, // Essencial nesse nível
    { item: ITEMS_DB['sword_steel'], dropChance: 0.1 },
    { item: ITEMS_DB['gem_sapphire'], dropChance: 0.15 }
  ]},
  { id: 'm_golem', name: 'Golem de Aço', stats: { hp: 150, str: 15, dex: 1, int: 1 }, expReward: 200, minLevel: 9, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 1.0 },
    { item: ITEMS_DB['potion_def'], dropChance: 0.4 },
    { item: ITEMS_DB['armor_steel'], dropChance: 0.1 },
    { item: ITEMS_DB['tunic_shadow'], dropChance: 0.1 },
  ]},
  
  // Bosses (10+)
  { id: 'm06', name: 'Rei Vazio', stats: { hp: 200, str: 20, dex: 15, int: 15 }, expReward: 800, minLevel: 10, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 1.0 },
    { item: ITEMS_DB['elixir_heal_max'], dropChance: 1.0 }, // Garante cura total
    { item: ITEMS_DB['sword_void'], dropChance: 0.2 },
    { item: ITEMS_DB['robe_void'], dropChance: 0.2 },
    { item: ITEMS_DB['gold_bar'], dropChance: 0.5 } // Rico!
  ]},
  { id: 'm_dragon', name: 'Dragão Ancião', stats: { hp: 300, str: 25, dex: 10, int: 10 }, expReward: 1500, minLevel: 12, lootTable: [
    { item: ITEMS_DB['gold_coin'], dropChance: 1.0 },
    { item: ITEMS_DB['elixir_heal_max'], dropChance: 1.0 },
    { item: ITEMS_DB['armor_dragonscale'], dropChance: 0.2 },
    { item: ITEMS_DB['daggers_soul'], dropChance: 0.2 },
    { item: ITEMS_DB['gold_bar'], dropChance: 1.0 } // Sempre dropa barra de ouro
  ]},
];

// --- 7. CLASSES INICIAIS (Filtradas) ---
export const availableClasses: CharacterClass[] = [
  CLASSES_DB['Guerreiro'],
  CLASSES_DB['Ladino'],
  CLASSES_DB['Mago'],
  CLASSES_DB['Clérigo'],
  CLASSES_DB['Druida'],
  CLASSES_DB['Caçador']
];