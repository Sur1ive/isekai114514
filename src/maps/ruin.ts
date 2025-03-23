import { CreatureType } from "../creatures/creatureConfigs";
import { NodeType, StartNode, NormalMonsterNode } from "./Node";
import { Region } from "./Region";

export const ruinNode3_2: NormalMonsterNode = {
  name: "遗迹出口",
  description: "遗迹出口",
  type: NodeType.NormalMonster,
  isCleared: false,
  position: { x: 450, y: 900 },
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

export const ruinNode2_1: NormalMonsterNode = {
  name: "靠近出口的房间",
  description: "靠近出口的房间",
  type: NodeType.NormalMonster,
  isCleared: false,
  position: { x: 600, y: 700 },
  toNodeList: [ruinNode3_2],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const ruinNode2_2: NormalMonsterNode = {
  name: "哥布林的藏宝室",
  description: "哥布林的藏宝室",
  type: NodeType.NormalMonster,
  isCleared: false,
  position: { x: 700, y: 550 },
  toNodeList: [ruinNode2_1],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const ruinNode1_1: NormalMonsterNode = {
  name: "遗迹走廊",
  description: "遗迹走廊",
  type: NodeType.NormalMonster,
  isCleared: false,
  position: { x: 500, y: 550 },
  toNodeList: [ruinNode2_1, ruinNode2_2],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const ruinNode0_1: StartNode = {
  name: "遗迹深处的房间",
  description: "遗迹深处的房间",
  type: NodeType.Start,
  isCleared: true,
  position: { x: 300, y: 450 },
  toNodeList: [ruinNode1_1],
};

export const ruinRegion: Region = {
  name: "遗迹",
  description: "遗迹",
  isUnlocked: true,
  startNode: ruinNode0_1,
};
