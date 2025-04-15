import { Monster } from "../creatures/Monster";

export interface CurrentMapData {
  currentRegionId: string;
  currentNodeId: string | null;
  goingToNodeId: string | null;
  visitedNodeIdList: string[];
  boss: Monster[];
  viewState?: {
    x: number;
    y: number;
    scale: number;
  };
  isMovingBetweenNodes?: boolean;
}
