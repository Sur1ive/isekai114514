import { CampNode, Node } from "./Node";
import { southforestRegion } from "./forest";
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
  southforest: southforestRegion,
  ruin: ruinRegion,
} as const;

export function getRegionById(id: string): Region {
  return RegionList[id as keyof typeof RegionList];
}
