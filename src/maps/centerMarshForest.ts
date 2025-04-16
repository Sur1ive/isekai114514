import { CreatureType } from "../creatures/creatureConfigs";
import { NodeType, CampNode, NormalMonsterNode, EmptyNode, TreasureNode, ToOtherRegionNode } from "./Node";
import { Region } from "./Region";
import centerMarshForestImage from "../assets/centerMarshForest.png";
import { ConsumableType } from "../items/consumableConfigs";
import { eastMarshForestRegion } from "./eastMarshForest";
import { dragonValleyRegion } from "./dragonValley";
import { northwestMarshForestRegion } from "./northwestMarshForest";

export const centerMarshForestCanyonEntranceNode: ToOtherRegionNode = {
  name: "溪谷入口",
  id: "centerMarshForestCanyonEntrance",
  description: "溪谷入口",
  type: NodeType.ToOtherRegion,
  position: { x: 890, y: 390 },
  toNodeList: [],
  region: dragonValleyRegion,
};

export const centerMarshForestToCanyonNode: NormalMonsterNode = {
  name: "前往溪谷的路",
  id: "centerMarshForestToCanyon",
  description: "前往溪谷的路",
  type: NodeType.NormalMonster,
  position: { x: 950, y: 430 },
  toNodeList: [centerMarshForestCanyonEntranceNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const centerMarshForestCaveNode: TreasureNode = {
  name: "山洞",
  id: "centerMarshForestCave",
  description: "山洞",
  type: NodeType.Treasure,
  position: { x: 490, y: 210 },
  toNodeList: [],
  firstTimeTreasureList: [
    {
      item: ConsumableType.SilverChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 1,
    },
  ],
  repeatableTreasureList: [
    {
      item: ConsumableType.SilverChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 0.05,
    },
    {
      item: ConsumableType.BrokenChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 0.75,
    },
    {
      item: ConsumableType.WoodenChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 2,
    },
  ],
};

export const centerMarshForestCrossTheHillNode: ToOtherRegionNode = {
  name: "翻山越野",
  id: "centerMarshForestCrossTheHill",
  description: "翻山越野",
  type: NodeType.ToOtherRegion,
  position: { x: 140, y: 120 },
  toNodeList: [],
  region: northwestMarshForestRegion,
};

export const centerMarshForestHillTiredNode: NormalMonsterNode = {
  name: "爬山好累",
  id: "centerMarshForestHillTired",
  description: "爬山好累",
  type: NodeType.NormalMonster,
  position: { x: 280, y: 190 },
  toNodeList: [centerMarshForestCrossTheHillNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const centerMarshForestHillRoadNode: NormalMonsterNode = {
  name: "登山路",
  id: "centerMarshForestHillRoad",
  description: "登山路",
  type: NodeType.NormalMonster,
  position: { x: 420, y: 240 },
  toNodeList: [centerMarshForestHillTiredNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const centerMarshForestHillFootNode: NormalMonsterNode = {
  name: "山脚下",
  id: "centerMarshForestHillFoot",
  description: "山脚下",
  type: NodeType.NormalMonster,
  position: { x: 640, y: 370 },
  toNodeList: [centerMarshForestCaveNode, centerMarshForestHillRoadNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const centerMarshForestSkyNode: NormalMonsterNode = {
  name: "一飞冲天啊我",
  id: "centerMarshForestSky",
  description: "一飞冲天啊我",
  type: NodeType.NormalMonster,
  position: { x: 980, y: 100 },
  toNodeList: [centerMarshForestCanyonEntranceNode],
  monsterList: [
    {
      monster: CreatureType.Ayulsa,
      maxLevel: 100,
      minLevel: 100,
      weight: 1,
    },
  ],
};

export const centerMarshForestFarRoadNode: NormalMonsterNode = {
  name: "路的远方",
  id: "centerMarshForestFarRoad",
  description: "路的远方",
  type: NodeType.NormalMonster,
  position: { x: 790, y: 440 },
  toNodeList: [centerMarshForestHillFootNode, centerMarshForestToCanyonNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const centerMarshForestToVeryEastNode: ToOtherRegionNode = {
  name: "一路向东",
  id: "centerMarshForestToVeryEast",
  description: "一路向东",
  type: NodeType.ToOtherRegion,
  position: { x: 1500, y: 450 },
  toNodeList: [],
  region: eastMarshForestRegion,
};

export const centerMarshForestToEastNode: EmptyNode = {
  name: "向东行",
  id: "centerMarshForestToEast",
  description: "向东行",
  type: NodeType.Empty,
  position: { x: 1150, y: 500 },
  toNodeList: [centerMarshForestToVeryEastNode],
};

export const centerMarshForestOppositeRoadNode: EmptyNode = {
  name: "对岸的路",
  id: "centerMarshForestOppositeRoad",
  description: "对岸的路",
  type: NodeType.Empty,
  position: { x: 900, y: 500 },
  toNodeList: [centerMarshForestToCanyonNode],
};

export const centerMarshForestOppositeCrossingNode: EmptyNode = {
  name: "对岸路口",
  id: "centerMarshForestOppositeCrossing",
  description: "对岸路口",
  type: NodeType.Empty,
  position: { x: 820, y: 650 },
  toNodeList: [centerMarshForestOppositeRoadNode, centerMarshForestToEastNode],
};

export const centerMarshForestRoadNode: NormalMonsterNode = {
  name: "顺路",
  id: "centerMarshForestRoad",
  description: "顺路",
  type: NodeType.NormalMonster,
  position: { x: 450, y: 450 },
  toNodeList: [centerMarshForestFarRoadNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const centerMarshForestRiverBankNode: NormalMonsterNode = {
  name: "河岸",
  id: "centerMarshForestRiverBank",
  description: "河岸",
  type: NodeType.NormalMonster,
  position: { x: 640, y: 620 },
  toNodeList: [centerMarshForestOppositeCrossingNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const centerMarshForestNearRuinNode: CampNode = {
  name: "遗迹周边",
  id: "centerMarshForestNearRuin",
  description: "遗迹周边",
  type: NodeType.Camp,
  position: { x: 170, y: 900 },
  toNodeList: [centerMarshForestRiverBankNode, centerMarshForestRoadNode, centerMarshForestSkyNode],
};

export const centerMarshForestRegion: Region = {
  name: "池沼森林中部 黄金平原",
  id: "centerMarshForest",
  description: "池沼森林中部 黄金平原",
  isOpen: true,
  startNode: centerMarshForestNearRuinNode,
  mapImage: centerMarshForestImage,
  mapWidth: 1536,
  mapHeight: 1024,
};
