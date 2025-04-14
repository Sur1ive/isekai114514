import { CreatureType } from "../creatures/creatureConfigs";
import { NodeType, CampNode, NormalMonsterNode, EmptyNode } from "./Node";
import { Region } from "./Region";
import centerMarshForestImage from "../assets/centerMarshForest.png";

export const centerMarshForestToEastNode: EmptyNode = {
  name: "一路向东",
  id: "centerMarshForestToEast",
  description: "一路向东",
  type: NodeType.Empty,
  position: { x: 1150, y: 500 },
  toNodeList: [],
};

export const centerMarshForestOppositeRoadNode: EmptyNode = {
  name: "对岸路口",
  id: "centerMarshForestOppositeRoad",
  description: "对岸路口",
  type: NodeType.Empty,
  position: { x: 820, y: 650 },
  toNodeList: [centerMarshForestToEastNode],
};

export const centerMarshForestFarRoadNode: NormalMonsterNode = {
  name: "远方的路",
  id: "centerMarshForestFarRoad",
  description: "远方的路",
  type: NodeType.NormalMonster,
  position: { x: 450, y: 450 },
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
  toNodeList: [centerMarshForestRiverBankNode, centerMarshForestFarRoadNode],
};

export const centerMarshForestRegion: Region = {
  name: "池沼森林中部 黄金平原",
  id: "centerMarshForest",
  description: "池沼森林中部 黄金平原",
  isOpen: true,
  startNode: centerMarshForestNearRuinNode,
  nodeList: [centerMarshForestNearRuinNode, centerMarshForestRiverBankNode, centerMarshForestFarRoadNode, centerMarshForestOppositeRoadNode, centerMarshForestToEastNode],
  mapImage: centerMarshForestImage,
  mapWidth: 1536,
  mapHeight: 1024,
};
