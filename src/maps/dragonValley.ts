import { NodeType, CampNode, BossNode } from "./Node";
import { Region } from "./Region";
import dragonValleyImage from "../assets/dragonValley.png";
import { CreatureType } from "../creatures/creatureConfigs";

export const dragonValleyBossNode: BossNode = {
  name: "龙 (boss)",
  id: "dragonValleyBoss",
  description: "懒得做地图了，直接开干",
  type: NodeType.Boss,
  position: { x: 620, y: 200 },
  toNodeList: [],
  bossStageList: [
    {
      monster: CreatureType.Dragon,
      maxLevel: 30,
      minLevel: 25,
      maxIndividualStrength: 1.1,
      minIndividualStrength: 0.9,
    },
    {
      monster: CreatureType.AngryDragon,
      maxLevel: 30,
      minLevel: 25,
      maxIndividualStrength: 1.1,
      minIndividualStrength: 0.9,
    },
    {
      monster: CreatureType.WeakDragon,
      maxLevel: 30,
      minLevel: 25,
      maxIndividualStrength: 1.1,
      minIndividualStrength: 0.9,
    },
  ],
};

export const dragonValleyEntranceNode: CampNode = {
  name: "龙之溪谷入口",
  id: "dragonValleyEntrance",
  description: "龙之溪谷入口",
  type: NodeType.Camp,
  position: { x: 500, y: 900 },
  toNodeList: [dragonValleyBossNode],
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
