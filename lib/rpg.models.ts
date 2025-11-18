export interface Stats {
  hp: number;
  str: number;
  dex: number;
  int: number;
}

export type TrainableStat = Exclude<keyof Stats, "hp">;

export interface CharacterClass {
  name: string;
  description: string;
  baseStats: Stats;
  levelUpGains: Stats;
}

export type ItemType = "Potion" | "Equipment" | "Currency" | "Item";
export type EquipmentSlot = "weapon" | "armor";

export interface Item {
  id: string;
  name: string;
  type: ItemType;
  description: string;
  price: number;
  value?: number;
}

export interface Potion extends Item {
  type: "Potion";
  effect: "heal" | "poison" | "buff";
  value: number;
  buffId?: StatusEffectId;
  duration?: number;
}

export interface Equipment extends Item {
  type: "Equipment";
  slot: EquipmentSlot;
  stats: Partial<Stats>;
  tier: number;
}

export interface Currency extends Item {
  type: "Currency";
  value: number;
}

export type SkillType = "Magic" | "Skill";
export type SkillTarget = "Self" | "Enemy";
export type StatusEffectId =
  | "poisoned"
  | "damage_buff"
  | "dexterity_buff"
  | "intelligence_buff"
  | "invisible"
  | "damage_reduction"
  | "burning"
  | "paralyzed";

export interface StatusEffect {
  id: StatusEffectId;
  duration: number;
  potency?: number;
}

export interface SkillEffect_ApplyStatus {
  type: "apply_status";
  effectId: StatusEffectId;
  duration: number;
  potency?: number;
}

export interface SkillEffect_DirectDamage {
  type: "direct_damage";
  value: number;
}

export interface SkillEffect_Summon {
  type: "summon";
  summonId: string;
}

export type SkillEffect =
  | SkillEffect_ApplyStatus
  | SkillEffect_DirectDamage
  | SkillEffect_Summon;

export interface Skill {
  id: string;
  name: string;
  type: SkillType;
  target: SkillTarget;
  description: string;
  cooldown: number;
  unlockLevel: number;
  effects: SkillEffect[];
  classRequirement: string;
}

export interface MemorialEntry {
  id: string;
  date: string;
  name: string;
  className: string;
  level: number;
  gold: number;
  finalStats: Stats;
  equipment: {
    weapon: string;
    armor: string;
  };
  monsterKills: [string, number][];
}

export interface Summon {
  id: string;
  name: string;
  stats: {
    hp: number;
    maxHp: number;
    dmg: number;
  };
}

export interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  pushed_at: string;
}

export interface GitHubCommit {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: {
      name: string;
      date: string;
    };
  };
}

export class Character {
  name: string;
  charClass: CharacterClass;

  level: number;
  exp: number;
  expToNextLevel: number;

  baseStats: Stats;
  currentHP: number;

  inventory: Item[] = [];
  gold: number = 0;
  equipment: {
    weapon: Equipment | null;
    armor: Equipment | null;
  };

  knownSkills: Skill[] = [];
  skillCooldowns: Map<string, number> = new Map();
  statusEffects: StatusEffect[] = [];

  monsterKills: Map<string, number> = new Map();

  stamina: number = 3;
  lastStaminaRefresh: number = 0;

  attributePoints: number = 0;

  constructor(name: string, charClass: CharacterClass) {
    this.name = name;
    this.charClass = charClass;
    this.baseStats = { ...charClass.baseStats };
    this.level = 1;
    this.exp = 0;
    this.expToNextLevel = 100;
    this.equipment = { weapon: null, armor: null };
    this.currentHP = this.getCombatStats().hp;
    this.lastStaminaRefresh = Date.now();
  }

  getCombatStats(): Stats {
    const combatStats = { ...this.baseStats };
    const weapon = this.equipment.weapon;
    const armor = this.equipment.armor;

    if (weapon && weapon.stats) {
      for (const key in weapon.stats) {
        const stat = key as keyof Stats;
        combatStats[stat] =
          (combatStats[stat] || 0) + (weapon.stats[stat] || 0);
      }
    }
    if (armor && armor.stats) {
      for (const key in armor.stats) {
        const stat = key as keyof Stats;
        combatStats[stat] = (combatStats[stat] || 0) + (armor.stats[stat] || 0);
      }
    }

    this.statusEffects.forEach((effect) => {
      if (effect.id === "damage_buff") {
        combatStats.str += effect.potency || 0;
      }
      if (effect.id === "dexterity_buff") {
        combatStats.dex += effect.potency || 0;
      }
      if (effect.id === "intelligence_buff") {
        combatStats.int += effect.potency || 0;
      }
    });

    return combatStats;
  }

  addExp(amount: number): boolean {
    this.exp += amount;
    if (this.exp >= this.expToNextLevel) {
      this.levelUp();
      return true;
    }
    return false;
  }

  private levelUp() {
    this.level++;
    this.exp -= this.expToNextLevel;
    this.expToNextLevel = Math.floor(this.expToNextLevel * 1.5);

    const gains = this.charClass.levelUpGains;

    this.baseStats.hp += gains.hp;
    this.baseStats.str += gains.str;
    this.baseStats.dex += gains.dex;
    this.baseStats.int += gains.int;

    this.attributePoints += 3;

    this.currentHP = this.getCombatStats().hp;
  }

  tickTurn() {
    this.skillCooldowns.forEach((duration, skillId) => {
      duration--;
      if (duration <= 0) {
        this.skillCooldowns.delete(skillId);
      } else {
        this.skillCooldowns.set(skillId, duration);
      }
    });

    this.statusEffects = this.statusEffects.filter((effect) => {
      effect.duration--;
      return effect.duration > 0;
    });
  }

  addStatusEffect(effect: StatusEffect) {
    this.statusEffects = this.statusEffects.filter((e) => e.id !== effect.id);
    this.statusEffects.push(effect);
  }
}

export interface Monster {
  id: string;
  name: string;
  stats: Stats;
  expReward: number;
  minLevel: number;
  lootTable: {
    item: Item;
    dropChance: number;
  }[];
}

export interface CombatMonster extends Monster {
  currentHP: number;
  statusEffects: StatusEffect[];
}
