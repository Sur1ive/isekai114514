import { CampNode, Node } from "./Node";
import { centerMarshForestRegion } from "./centerMarshForest";
import { ruinRegion } from "./ruin";

export interface Region {
  name: string;
  id: string;
  description: string;
  isOpen: boolean;
  startNode: CampNode;
  nodeList: Node[];
}

// regionId: Region
export const RegionList = {
  centerMarshForest: centerMarshForestRegion,
  ruin: ruinRegion,
} as const;

export function getRegionById(id: string): Region {
  return RegionList[id as keyof typeof RegionList];
}
