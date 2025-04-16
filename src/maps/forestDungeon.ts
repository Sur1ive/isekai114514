import { NodeType, CampNode } from "./Node";
import { Region } from "./Region";
import forestDungeonImage from "../assets/redTea.png";

export const forestDungeonStartNode: CampNode = {
  name: "森林迷宫入口",
  id: "forestDungeonStart",
  description: "还没做地图",
  type: NodeType.Camp,
  position: { x: 880, y: 1300 },
  toNodeList: [],
};

export const forestDungeonRegion: Region = {
  name: "森林地下城",
  id: "forestDungeon",
  description: "森林地下城",
  isOpen: false,
  startNode: forestDungeonStartNode,
  mapImage: forestDungeonImage,
  mapWidth: 1024,
  mapHeight: 1024,
};
