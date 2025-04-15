import { CreatureType } from "../creatures/creatureConfigs";
import { ItemType } from "../items/types";
import { Region, RegionList } from "./Region";

export enum NodeType {
  NormalMonster = "NormalMonster",
  EliteMonster = "EliteMonster",
  Boss = "Boss",
  Empty = "Empty",
  Treasure = "Treasure",
  Camp = "Camp",
  BackHome = "BackHome",
  Rest = "Rest",
  Event = "Event",
  ToOtherRegion = "ToOtherRegion",
}

export interface Node {
  id: string;
  name: string;
  description: string;
  type: NodeType;
  position: { x: number; y: number };
  toNodeList: Node[];
  fromNodeList?: Node[];
}

export function getNodeById(id: string): Node | undefined {
  const nodesList = Object.values(RegionList).flatMap((region) => region.nodeList!);
  return nodesList.find((node) => node.id === id);
}

export interface CampNode extends Node {
  type: NodeType.Camp;
}

export interface TreasureNode extends Node {
  type: NodeType.Treasure;
  firstTimeTreasureList: {
    item: ItemType;
    minLevel: number;
    maxLevel: number;
    weight: number;
  }[];
  repeatableTreasureList: {
    item: ItemType;
    minLevel: number;
    maxLevel: number;
    weight: number;
  }[];
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

export interface ToOtherRegionNode extends Node {
  type: NodeType.ToOtherRegion;
  region: Region;
}

export interface EmptyNode extends Node {
  type: NodeType.Empty;
}

export interface BossNode extends Node {
  type: NodeType.Boss;
  bossStageList: {
    monster: CreatureType;
    maxLevel: number;
    minLevel: number;
    maxIndividualStrength: number;
    minIndividualStrength: number;
  }[];
}
