import { CreatureType } from "../creatures/creatureConfigs";
import { NodeType, CampNode, NormalMonsterNode, TreasureNode, EliteMonsterNode, ResourceNode } from "./Node";
import { Region } from "./Region";
import eastMarshForestImage from "../assets/eastMarshForest.png";
import { ConsumableType } from "../items/consumableConfigs";

export const eastMarshForestDeepTreasureNode: ResourceNode = {
  name: "树洞巢穴中的宝箱",
  id: "eastMarshForestDeepTreasure",
  description: "巨大的老树的树根处有一个隐蔽的洞穴。洞口被藤蔓遮掩，但仔细看能发现里面似乎有什么东西在闪闪发光。每隔一段时间，似乎又会有新的物资出现。",
  type: NodeType.Resource,
  position: { x: 280, y: 180 },
  toNodeList: [],
  guaranteedDropList: [
    {
      item: ConsumableType.LifePotion,
      level: 5,
      quantity: 2,
    },
  ],
  randomDropList: [
    {
      item: ConsumableType.WoodenChest,
      minLevel: 5,
      maxLevel: 7,
      weight: 0.75,
    },
    {
      item: ConsumableType.SilverChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 0.25,
    },
    {
      item: ConsumableType.GoldChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 0.005,
    },
    {
      item: ConsumableType.DiamondChest,
      minLevel: 10,
      maxLevel: 15,
      weight: 0.0001,
    },
  ],
};

export const eastMarshForestDeepPathNode: NormalMonsterNode = {
  name: "深处的小路",
  id: "eastMarshForestDeepPath",
  description: "小路在这里变得更加狭窄，两旁的灌木丛中时不时传来窸窸窣窣的声音。阳光穿过枝叶洒落在地面上，形成了斑驳的光影。",
  type: NodeType.NormalMonster,
  position: { x: 600, y: 200 },
  toNodeList: [],
  monsterList: [
    {
      monster: CreatureType.Deer,
      maxLevel: 14,
      minLevel: 10,
      weight: 1,
    },
  ],
};

export const eastMarshForestEliteNode: EliteMonsterNode = {
  name: "摩尔的领地",
  id: "eastMarshForestElite",
  description: "地面上散落着动物的骨骸和爪印，空气中弥漫着一股野兽的气息。这里似乎是摩尔的领地，来往的旅人需要格外小心。",
  type: NodeType.EliteMonster,
  position: { x: 440, y: 320 },
  toNodeList: [eastMarshForestDeepTreasureNode, eastMarshForestDeepPathNode],
  monsterList: [
    {
      monster: CreatureType.Mole,
      maxLevel: 9,
      minLevel: 6,
      maxIndividualStrength: 1.2,
      minIndividualStrength: 0.8,
      weight: 1,
    },
  ],
  treasureProbability: 0,
  treasureList: [],
};

export const eastMarshForestRestNode: CampNode = {
  name: "溪流旁的空地",
  id: "eastMarshForestRest",
  description: "溪流旁有一片开阔的空地，草地上还留有篝火的痕迹，看来经常有旅人在此歇脚。清澈的溪水潺潺流过，让人感到无比舒适。",
  type: NodeType.Camp,
  position: { x: 420, y: 470 },
  toNodeList: [eastMarshForestEliteNode],
};

export const eastMarshForestPathNode: NormalMonsterNode = {
  name: "林间小径",
  id: "eastMarshForestPath",
  description: "一条蜿蜒的小径穿过林间，两旁的花草在微风中轻轻摇曳。偶尔可以听到鸟儿欢快的鸣叫声，但也要提防潜伏在灌木中的小怪物。",
  type: NodeType.NormalMonster,
  position: { x: 400, y: 620 },
  toNodeList: [eastMarshForestRestNode],
  monsterList: [
    {
      monster: CreatureType.Slime,
      maxLevel: 7,
      minLevel: 5,
      weight: 0.5,
    },
    {
      monster: CreatureType.Deer,
      maxLevel: 7,
      minLevel: 5,
      weight: 1.5,
    },
  ],
};

export const eastMarshForestTreasureNode: TreasureNode = {
  name: "河畔的藏宝处",
  id: "eastMarshForestTreasure",
  description: "河流在这里拐了一个弯，形成了一个小小的水潭。清澈的水面下隐约可见一些闪光的东西，水潭边的大石头后似乎藏着什么。",
  type: NodeType.Treasure,
  position: { x: 360, y: 760 },
  toNodeList: [eastMarshForestPathNode],
  firstTimeTreasureList: [
    {
      item: ConsumableType.WoodenChest,
      minLevel: 5,
      maxLevel: 7,
      weight: 1,
    },
  ],
  repeatableTreasureList: [],
};

export const eastMarshForestStartNode: CampNode = {
  name: "风和日丽的森林",
  id: "eastMarshForestStart",
  description: "阳光透过茂密的树冠洒落，将这片森林染上了一层温暖的金色。微风拂过，带来了花草和泥土的清香。远处的河流闪着粼粼波光，这里的一切都显得那么宁静祥和。",
  type: NodeType.Camp,
  position: { x: 340, y: 900 },
  toNodeList: [eastMarshForestTreasureNode],
};

export const eastMarshForestRegion: Region = {
  name: "池沼森林东部 风和日丽的森林",
  id: "eastMarshForest",
  description: "池沼森林的东部区域，因为常年阳光充沛而被称为\"风和日丽的森林\"。这里的生态相对温和，适合初出茅庐的冒险者前来历练。据说有一种喜欢囤积宝物的奇特生物生活在森林深处。",
  isOpen: true,
  startNode: eastMarshForestStartNode,
  mapImage: eastMarshForestImage,
  mapWidth: 1024,
  mapHeight: 1024,
};
