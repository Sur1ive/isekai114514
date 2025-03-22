import { CreatureType } from "../creatures/creatureConfigs";
import { NodeType, StartNode, NormalMonsterNode } from "./Node";
import { Region } from "./Region";

export const forestNode1_1: NormalMonsterNode = {
  name: "森林1-1",
  description: "森林1-1",
  type: NodeType.NormalMonster,
  isCleared: false,
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

export const forestNode0_1: StartNode = {
  name: "森林入口",
  description: "森林入口",
  type: NodeType.Start,
  isCleared: false,
  position: { x: 200, y: 200 },
  toNodeList: [forestNode1_1],
};

export const forestRegion: Region = {
  name: "森林",
  description: "森林",
  isUnlocked: false,
  startNode: forestNode0_1,
};
