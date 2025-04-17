import { CreatureType } from "../creatures/creatureConfigs";
import { NodeType, CampNode, NormalMonsterNode, EmptyNode, TreasureNode, ToOtherRegionNode, EliteMonsterNode } from "./Node";
import { Region } from "./Region";
import centerMarshForestImage from "../assets/centerMarshForest.png";
import { ConsumableType } from "../items/consumableConfigs";
import { eastMarshForestRegion } from "./eastMarshForest";
import { dragonValleyRegion } from "./dragonValley";
import { northwestMarshForestRegion } from "./northwestMarshForest";

export const centerMarshForestCanyonEntranceNode: ToOtherRegionNode = {
  name: "溪谷入口",
  id: "centerMarshForestCanyonEntrance",
  description: "陡峭的山壁间开辟出一条狭窄的通道，水流从高处倾泻而下，形成了一片溪谷。空气中弥漫着潮湿的气息，远处传来奇异的回声。",
  type: NodeType.ToOtherRegion,
  position: { x: 890, y: 390 },
  toNodeList: [],
  region: dragonValleyRegion,
};

export const centerMarshForestToCanyonNode: EliteMonsterNode = {
  name: "前往溪谷的路",
  id: "centerMarshForestToCanyon",
  description: "这条泥泞的小路逐渐向上攀升，两旁的树木越来越稀疏。地面上散落着奇怪的足迹，似乎有不少生物经常在此活动。",
  type: NodeType.EliteMonster,
  position: { x: 950, y: 430 },
  toNodeList: [centerMarshForestCanyonEntranceNode],
  monsterList: [
    {
      monster: CreatureType.DiscardedGolem,
      maxLevel: 25,
      minLevel: 20,
      maxIndividualStrength: 1.2,
      minIndividualStrength: 0.8,
      weight: 1,
    },
    {
      monster: CreatureType.TreasureSlime,
      maxLevel: 25,
      minLevel: 20,
      maxIndividualStrength: 1.5,
      minIndividualStrength: 0.5,
      weight: 0.5,
    },
  ],
  treasureProbability: 0,
  treasureList: [],
};

export const centerMarshForestCaveNode: TreasureNode = {
  name: "山洞",
  id: "centerMarshForestCave",
  description: "一个黑漆漆的洞口隐藏在山壁间，洞内散发出一股奇异的气味。传说有探险者在这里发现过宝藏，但也有不少人进去后再没出来。",
  type: NodeType.Treasure,
  position: { x: 490, y: 210 },
  toNodeList: [],
  firstTimeTreasureList: [
    {
      item: ConsumableType.SilverChest,
      minLevel: 15,
      maxLevel: 25,
      weight: 1,
    },
  ],
  repeatableTreasureList: [
    {
      item: ConsumableType.SilverChest,
      minLevel: 15,
      maxLevel: 25,
      weight: 0.05,
    },
    {
      item: ConsumableType.BrokenChest,
      minLevel: 15,
      maxLevel: 25,
      weight: 0.2,
    },
    {
      item: ConsumableType.WoodenChest,
      minLevel: 15,
      maxLevel: 25,
      weight: 0.75,
    },
  ],
};

export const centerMarshForestCrossTheHillNode: ToOtherRegionNode = {
  name: "翻山越野",
  id: "centerMarshForestCrossTheHill",
  description: "这条险峻的山路蜿蜒向上，通往森林的西北部。路途艰难，但据说那边的景色和宝藏值得这一番辛苦。小心脚下的松散碎石。",
  type: NodeType.ToOtherRegion,
  position: { x: 140, y: 120 },
  toNodeList: [],
  region: northwestMarshForestRegion,
};

export const centerMarshForestHillTiredNode: EliteMonsterNode = {
  name: "爬山好累",
  id: "centerMarshForestHillTired",
  description: "陡峭的山坡让人气喘吁吁，这里的空气变得稀薄。周围的岩石上有被野兽磨爪的痕迹，偶尔能听到远处传来的低吼声。",
  type: NodeType.EliteMonster,
  position: { x: 280, y: 190 },
  toNodeList: [centerMarshForestCrossTheHillNode],
  monsterList: [
    {
      monster: CreatureType.DiscardedGolem,
      maxLevel: 30,
      minLevel: 25,
      maxIndividualStrength: 1.2,
      minIndividualStrength: 0.8,
      weight: 1,
    },
    {
      monster: CreatureType.Horse,
      maxLevel: 30,
      minLevel: 25,
      maxIndividualStrength: 1.2,
      minIndividualStrength: 0.8,
      weight: 1,
    },
    {
      monster: CreatureType.TreasureSlime,
      maxLevel: 30,
      minLevel: 25,
      maxIndividualStrength: 1.5,
      minIndividualStrength: 0.5,
      weight: 0.5,
    },
  ],
  treasureProbability: 0.1,
  treasureList: [],
};

export const centerMarshForestHillRoadNode: NormalMonsterNode = {
  name: "登山路",
  id: "centerMarshForestHillRoad",
  description: "一条被踩踏出来的山间小路，两旁长满了高大的针叶树。地面上偶尔可以看到一些奇怪的蘑菇，色彩斑斓，但不知是否有毒。",
  type: NodeType.NormalMonster,
  position: { x: 420, y: 240 },
  toNodeList: [centerMarshForestHillTiredNode],
  monsterList: [
    {
      monster: CreatureType.Wolf,
      maxLevel: 27,
      minLevel: 22,
      weight: 1,
    },
  ],
};

export const centerMarshForestHillFootNode: NormalMonsterNode = {
  name: "山脚下",
  id: "centerMarshForestHillFoot",
  description: "山脚下的这片区域草木茂盛，空气中夹杂着泥土和植物的芬芳。从这里往上看，山峰似乎直插云霄。地上有一些零散的脚印和动物留下的痕迹。",
  type: NodeType.NormalMonster,
  position: { x: 640, y: 370 },
  toNodeList: [centerMarshForestCaveNode, centerMarshForestHillRoadNode],
  monsterList: [
    {
      monster: CreatureType.Wolf,
      maxLevel: 25,
      minLevel: 20,
      weight: 1,
    },
  ],
};

export const centerMarshForestSkyNode: NormalMonsterNode = {
  name: "一飞冲天啊我",
  id: "centerMarshForestSky",
  description: "我他喵的直接飞到天上",
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
  description: "道路在这里分叉，一条通向群山，另一条则前往溪谷。远处的景色被薄雾笼罩，隐约可见一些高大的树影。四周异常安静，只有微风吹过树叶的沙沙声。",
  type: NodeType.NormalMonster,
  position: { x: 790, y: 440 },
  toNodeList: [centerMarshForestHillFootNode, centerMarshForestToCanyonNode],
  monsterList: [
    {
      monster: CreatureType.Goblin,
      maxLevel: 22,
      minLevel: 17,
      weight: 1,
    },
  ],
};

export const centerMarshForestToVeryEastNode: ToOtherRegionNode = {
  name: "一路向东",
  id: "centerMarshForestToVeryEast",
  description: "这条蜿蜒的小路向森林的东部深处延伸，道路两旁的植被变得越来越茂密和异域。空气中弥漫着一股奇特的香气，引人好奇东边究竟隐藏着什么。",
  type: NodeType.ToOtherRegion,
  position: { x: 1500, y: 450 },
  toNodeList: [],
  region: eastMarshForestRegion,
};

export const centerMarshForestToEastNode: EmptyNode = {
  name: "向东行",
  id: "centerMarshForestToEast",
  description: "东行的路变得平坦开阔，两旁的树木高大挺拔，树干上覆盖着绿色的苔藓。偶尔能听到鸟儿的鸣叫，阳光透过树叶在地面上投下斑驳的光影。",
  type: NodeType.Empty,
  position: { x: 1150, y: 500 },
  toNodeList: [centerMarshForestToVeryEastNode],
};

export const centerMarshForestOppositeRoadNode: NormalMonsterNode = {
  name: "对岸的路",
  id: "centerMarshForestOppositeRoad",
  description: "站在河的对岸，这条小径曲折地通向远方。地面上铺满了厚厚的落叶，踩上去发出沙沙的声音。周围的空气清新而潮湿，令人心旷神怡。",
  type: NodeType.NormalMonster,
  position: { x: 900, y: 500 },
  toNodeList: [centerMarshForestToCanyonNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 22,
      minLevel: 17,
      weight: 1,
    },
  ],
};

export const centerMarshForestRuinInsideNode: TreasureNode = {
  name: "巢穴内部",
  id: "centerMarshForestRuinInside",
  description: "一片近代遗迹，似乎被怪物当成了巢穴。",
  type: NodeType.Treasure,
  firstTimeTreasureList: [
    {
      item: ConsumableType.WoodenChest,
      minLevel: 5,
      maxLevel: 15,
      weight: 1,
    },
  ],
  repeatableTreasureList: [
    {
      item: ConsumableType.BrokenChest,
      minLevel: 5,
      maxLevel: 15,
      weight: 0.6,
    },
    {
      item: ConsumableType.WoodenChest,
      minLevel: 5,
      maxLevel: 15,
      weight: 0.4,
    },
    {
      item: ConsumableType.SilverChest,
      minLevel: 5,
      maxLevel: 15,
      weight: 0.01,
    },
  ],
  position: { x: 1190, y: 750 },
  toNodeList: [],
};

export const centerMarshForestRuinNode: NormalMonsterNode = {
  name: "断壁残垣",
  id: "centerMarshForestRuin",
  description: "一片近代遗迹，似乎被怪物当成了巢穴。",
  type: NodeType.NormalMonster,
  monsterList: [
    {
      monster: CreatureType.Wolf,
      maxLevel: 15,
      minLevel: 10,
      weight: 1,
    },
  ],
  position: { x: 1050, y: 800 },
  toNodeList: [centerMarshForestRuinInsideNode],
};

export const centerMarshForestOppositeCrossingNode: EmptyNode = {
  name: "对岸路口",
  id: "centerMarshForestOppositeCrossing",
  description: "河对岸的这个路口连接着几条不同的小路。河水清澈见底，能看到一些小鱼在水中游动。岸边生长着一些奇特的水生植物，颜色艳丽夺目。",
  type: NodeType.Empty,
  position: { x: 820, y: 650 },
  toNodeList: [centerMarshForestOppositeRoadNode, centerMarshForestToEastNode, centerMarshForestRuinNode],
};

export const centerMarshForestRoadNode: NormalMonsterNode = {
  name: "顺路",
  id: "centerMarshForestRoad",
  description: "一条被踩踏得十分平整的小路，似乎是这一带最常被使用的道路。",
  type: NodeType.NormalMonster,
  position: { x: 450, y: 450 },
  toNodeList: [centerMarshForestFarRoadNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 17,
      minLevel: 12,
      weight: 1,
    },
  ],
};

export const centerMarshForestRiverBankNode: NormalMonsterNode = {
  name: "河岸",
  id: "centerMarshForestRiverBank",
  description: "一条宽阔的河流缓缓流淌，水面平静如镜。河岸边长满了芦苇和各种水生植物，时不时能看到一些小动物前来饮水。远处有一座简易的木桥连接着两岸。",
  type: NodeType.NormalMonster,
  position: { x: 640, y: 620 },
  toNodeList: [centerMarshForestOppositeCrossingNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 12,
      minLevel: 7,
      weight: 1,
    },
  ],
};

export const centerMarshForestNearRuinNode: CampNode = {
  name: "遗迹周边",
  id: "centerMarshForestNearRuin",
  description: "从遗迹中走出",
  type: NodeType.Camp,
  position: { x: 170, y: 900 },
  toNodeList: [centerMarshForestRiverBankNode, centerMarshForestRoadNode, centerMarshForestSkyNode],
};

export const centerMarshForestRegion: Region = {
  name: "池沼森林中部 黄金平原",
  id: "centerMarshForest",
  description: "池沼森林的中心地带，被当地人称为\"黄金平原\"。这里地势平坦，植被丰富多样，各种珍稀草药和生物在此繁衍生息。阳光透过树冠洒落，将地面染成金色，因此得名。这一区域也是通往其他地区的重要枢纽。",
  isOpen: true,
  startNode: centerMarshForestNearRuinNode,
  mapImage: centerMarshForestImage,
  mapWidth: 1536,
  mapHeight: 1024,
};
