import { NodeType, CampNode } from "./Node";
import { Region } from "./Region";
import eastMarshForestImage from "../assets/eastMarshForest.png";

export const eastMarshForestStartNode: CampNode = {
  name: "风和日丽的森林",
  id: "eastMarshForestStart",
  description: "还没做地图",
  type: NodeType.Camp,
  position: { x: 340, y: 900 },
  toNodeList: [],
};

export const eastMarshForestRegion: Region = {
  name: "池沼森林东部 风和日丽的森林",
  id: "eastMarshForest",
  description: "池沼森林东部 风和日丽的森林",
  isOpen: true,
  startNode: eastMarshForestStartNode,
  mapImage: eastMarshForestImage,
  mapWidth: 1024,
  mapHeight: 1024,
};
