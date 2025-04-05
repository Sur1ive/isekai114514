import { CreatureType } from "../creatures/creatureConfigs";
import { NodeType, CampNode, NormalMonsterNode, ToOtherRegionNode, BossNode, TreasureNode } from "./Node";
import { Region } from "./Region";
import { southforestRegion } from "./forest";
import { ConsumableType } from "../items/consumableConfigs";

export const ruinNode3_2: ToOtherRegionNode = {
  name: "遗迹出口",
  id: "ruin3_2",
  description: "外面是一眼望不到头的森林，你可以闻到森林中传来的泥土和青草的气息",
  type: NodeType.ToOtherRegion,
  position: { x: 450, y: 900 },
  toNodeList: [],
  region: southforestRegion,
};

export const ruinNode2_1: BossNode = {
  name: "靠近出口的房间",
  id: "ruin2_1",
  description: "一只强壮且凶恶的哥布林正镇守在这里",
  type: NodeType.Boss,
  position: { x: 600, y: 700 },
  toNodeList: [ruinNode3_2],
  bossStageList: [
    {
      monster: CreatureType.FrightenedGoblinLeader,
      maxLevel: 1,
      minLevel: 1,
      maxIndividualStrength: 1.1,
      minIndividualStrength: 1,
    },
    {
      monster: CreatureType.AngryGoblinLeader,
      maxLevel: 1,
      minLevel: 1,
      maxIndividualStrength: 1.1,
      minIndividualStrength: 1,
    },
  ],
};

export const ruinNode2_2: TreasureNode = {
  name: "哥布林的藏宝室",
  id: "ruin2_2",
  description: "哥布林把掠夺来的宝物藏在了这里",
  type: NodeType.Treasure,
  position: { x: 700, y: 550 },
  toNodeList: [ruinNode2_1],
  firstTimeTreasureList: [
    {
      item: ConsumableType.SilverChest,
      minLevel: 1,
      maxLevel: 1,
      weight: 1,
    },
  ],
  repeatableTreasureList: [],
};

export const ruinNode1_1: NormalMonsterNode = {
  name: "遗迹走廊",
  id: "ruin1_1",
  description: "这个遗迹似乎已经成为了哥布林的巢穴",
  type: NodeType.NormalMonster,
  position: { x: 500, y: 550 },
  toNodeList: [ruinNode2_1, ruinNode2_2],
  monsterList: [
    {
      monster: CreatureType.Goblin,
      maxLevel: 1,
      minLevel: 1,
      weight: 1,
    },
  ],
};

export const ruinNode0_1: CampNode = {
  name: "遗迹深处的房间",
  id: "ruin0_1",
  description: "遗迹深处的房间，被厚厚的石门封锁着。正中间正是你躺了一百年的石棺",
  type: NodeType.Camp,
  position: { x: 300, y: 450 },
  toNodeList: [ruinNode1_1],
};

export const ruinRegion: Region = {
  name: "遗迹",
  id: "ruin",
  description: "遗迹",
  isOpen: true,
	startNode: ruinNode0_1,
  nodeList: [ruinNode0_1, ruinNode1_1, ruinNode2_1, ruinNode2_2, ruinNode3_2],
};
