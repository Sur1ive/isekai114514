import { CreatureType } from "../creatures/creatureConfigs";
import { NodeType, CampNode, NormalMonsterNode } from "./Node";
import { Region } from "./Region";

export const forestNode1_1: NormalMonsterNode = {
  name: "森林1-1",
  id: "forest1_1",
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

export const forestNode0_1: CampNode = {
  name: "森林入口",
  id: "forest0_1",
  description: "森林入口",
  type: NodeType.Camp,
  position: { x: 200, y: 200 },
  toNodeList: [forestNode1_1],
};

export const southforestRegion: Region = {
  name: "池沼森林・南部",
  id: "southforest",
  description: "池沼森林・南部",
  isOpen: false,
  startNode: forestNode0_1,
  nodeList: [forestNode0_1, forestNode1_1],
};
