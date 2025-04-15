import { CreatureType } from "../creatures/creatureConfigs";
import { NodeType, CampNode, NormalMonsterNode, EmptyNode } from "./Node";
import { Region } from "./Region";
import centerMarshForestImage from "../assets/centerMarshForest.png";

export const centerMarshForestCanyonEntranceNode: NormalMonsterNode = {
  name: "溪谷入口",
  id: "centerMarshForestCanyonEntrance",
  description: "溪谷入口",
  type: NodeType.NormalMonster,
  position: { x: 890, y: 390 },
  toNodeList: [],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
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

export const centerMarshForestHillFootNode: NormalMonsterNode = {
  name: "山脚下",
  id: "centerMarshForestHillFoot",
  description: "山脚下",
  type: NodeType.NormalMonster,
  position: { x: 640, y: 370 },
  toNodeList: [],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
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

export const centerMarshForestToVeryEastNode: EmptyNode = {
  name: "一路向东",
  id: "centerMarshForestToVeryEast",
  description: "一路向东",
  type: NodeType.Empty,
  position: { x: 1500, y: 450 },
  toNodeList: [],
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
  name: "对岸路口",
  id: "centerMarshForestOppositeRoad",
  description: "对岸路口",
  type: NodeType.Empty,
  position: { x: 820, y: 650 },
  toNodeList: [centerMarshForestToEastNode],
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
  toNodeList: [centerMarshForestOppositeRoadNode],
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
  toNodeList: [centerMarshForestRiverBankNode, centerMarshForestRoadNode],
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
