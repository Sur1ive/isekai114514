import { CreatureType } from "../creatures/creatureConfigs";
import { ItemType } from "../items/types";

export enum NodeType {
  NormalMonster = "NormalMonster",
  EliteMonster = "EliteMonster",
  Boss = "Boss",
  Treasure = "Treasure",
  Start = "Start",
  BackHome = "BackHome",
  Rest = "Rest",
  Event = "Event",
}

export interface Node {
  name: string;
  description: string;
  type: NodeType;
  isCleared: boolean;
  position: { x: number; y: number };
  toNodeList: Node[];
}

export interface StartNode extends Node {
  type: NodeType.Start;
}

export interface NormalMonsterNode extends Node {
  type: NodeType.NormalMonster;
  monsterList: {
    monster: CreatureType;
    maxLevel: number;
    minLevel: number;
    weight: number;
  }[];
}

export interface EliteMonsterNode extends Node {
  type: NodeType.EliteMonster;
  treasureProbability: number;
  treasureList: {
    item: ItemType;
    minLevel: number;
    maxLevel: number;
    weight: number;
  }[];
  monsterList: {
    monster: CreatureType;
    maxLevel: number;
    minLevel: number;
    maxIndividualStrength: number;
    minIndividualStrength: number;
    weight: number;
  }[];
}

export interface BossNode extends Node {
  type: NodeType.Boss;
  monsterList: {
    monster: CreatureType;
    maxLevel: number;
    minLevel: number;
    maxIndividualStrength: number;
    minIndividualStrength: number;
  }[];
}
