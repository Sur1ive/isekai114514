export interface CurrentMapData {
  currentRegionId: string;
  currentNodeId: string | null;
  goingToNodeId: string | null;
  visitedNodeIdList: string[];
  bossNodeId?: string;
  viewState?: {
    x: number;
    y: number;
    scale: number;
  };
  isMovingBetweenNodes?: boolean;
}
