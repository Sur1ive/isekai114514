import { CreatureType } from "../creatures/creatureConfigs";
import { NodeType, CampNode, NormalMonsterNode } from "./Node";
import { Region } from "./Region";
import centerMarshForestImage from "../assets/centerMarshForest.png";

export const centerMarshForestNode1_1: NormalMonsterNode = {
  name: "森林1-1",
  id: "centerMarshForest1_1",
  description: "森林1-1",
  type: NodeType.NormalMonster,
  position: { x: 100, y: 100 },
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

export const centerMarshForestNearRuinNode: CampNode = {
  name: "遗迹周边",
  id: "centerMarshForestNearRuin",
  description: "遗迹周边",
  type: NodeType.Camp,
  position: { x: 200, y: 200 },
  toNodeList: [centerMarshForestNode1_1],
};

export const centerMarshForestRegion: Region = {
  name: "池沼森林・中部",
  id: "centerMarshForest",
  description: "池沼森林・中部",
  isOpen: true,
  startNode: centerMarshForestNearRuinNode,
  nodeList: [centerMarshForestNearRuinNode, centerMarshForestNode1_1],
  mapImage: centerMarshForestImage,
  mapWidth: 1536,
  mapHeight: 1024,
};
