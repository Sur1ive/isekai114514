import { NodeType, CampNode, BossNode, EliteMonsterNode, TreasureNode } from "./Node";
import { Region } from "./Region";
import dragonValleyImage from "../assets/dragonValley.png";
import { CreatureType } from "../creatures/creatureConfigs";
import { ConsumableType } from "@/items/consumableConfigs";

export const dragonValleyTreasureNode: TreasureNode = {
  name: "龙之财宝",
  id: "dragonValleyTreasure",
  description: "龙的财宝就藏在这里",
  type: NodeType.Treasure,
  firstTimeTreasureList: [
    {
      item: ConsumableType.GoldChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 1,
    },
    {
      item: ConsumableType.DiamondChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 0.01,
    },
  ],
  repeatableTreasureList: [
    {
      item: ConsumableType.SilverChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 0.95,
    },
    {
      item: ConsumableType.GoldChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 0.05,
    },
    {
      item: ConsumableType.DiamondChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 0.002,
    },
  ],
  position: { x: 830, y: 250 },
  toNodeList: [],
};

export const dragonValleyBossNode: BossNode = {
  name: "龙 (boss)",
  id: "dragonValleyBoss",
  description: "懒得做地图了，直接开干",
  type: NodeType.Boss,
  position: { x: 620, y: 200 },
  toNodeList: [dragonValleyTreasureNode],
  bossStageList: [
    {
      monster: CreatureType.Dragon,
      maxLevel: 10,
      minLevel: 10,
      maxIndividualStrength: 1.1,
      minIndividualStrength: 0.9,
    },
    {
      monster: CreatureType.AngryDragon,
      maxLevel: 10,
      minLevel: 10,
      maxIndividualStrength: 1.1,
      minIndividualStrength: 0.9,
    },
    {
      monster: CreatureType.WeakDragon,
      maxLevel: 10,
      minLevel: 10,
      maxIndividualStrength: 1.1,
      minIndividualStrength: 0.9,
    },
  ],
};

export const dragonValleyMiddleNode: EliteMonsterNode = {
  name: "龙之溪谷中部",
  id: "dragonValleyMiddle",
  description: "龙之溪谷中部",
  type: NodeType.EliteMonster,
  position: { x: 570, y: 700 },
  toNodeList: [dragonValleyBossNode],
  monsterList: [
    {
      monster: CreatureType.DiscardedGolem,
      maxLevel: 10,
      minLevel: 10,
      maxIndividualStrength: 1.2,
      minIndividualStrength: 0.8,
      weight: 1,
    },
    {
      monster: CreatureType.Horse,
      maxLevel: 10,
      minLevel: 10,
      maxIndividualStrength: 1.2,
      minIndividualStrength: 0.8,
      weight: 1,
    },
  ],
  treasureProbability: 0,
  treasureList: [],
};

export const dragonValleyEntranceNode: CampNode = {
  name: "龙之溪谷入口",
  id: "dragonValleyEntrance",
  description: "龙之溪谷入口",
  type: NodeType.Camp,
  position: { x: 500, y: 900 },
  toNodeList: [dragonValleyMiddleNode],
};

export const dragonValleyRegion: Region = {
  name: "池沼森林最北端 龙之溪谷",
  id: "dragonValley",
  description: "池沼森林最北端 龙之溪谷",
  isOpen: true,
  startNode: dragonValleyEntranceNode,
  mapImage: dragonValleyImage,
  mapWidth: 1024,
  mapHeight: 1024,
};
