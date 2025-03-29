import { Creature } from "../creatures/Creature";

export interface CurrentMapData {
  currentRegionId: string;
  currentNodeId: string | null;
  goingToNodeId: string | null;
  visitedNodeIdList: string[];
  boss: Creature[];
  viewState?: {
    x: number;
    y: number;
    scale: number;
  };
  isMovingBetweenNodes?: boolean;
}
