import { CampNode, Node } from "./Node";
import { centerMarshForestRegion } from "./centerMarshForest";
import { eastMarshForestRegion } from "./eastMarshForest";
import { northwestMarshForestRegion } from "./northwestMarshForest";
import { ruinRegion } from "./ruin";
import { dragonValleyRegion } from "./dragonValley";
import { forestDungeonRegion } from "./forestDungeon";

export interface EdgeData {
  source: string;
  target: string;
}

export interface Region {
  name: string;
  id: string;
  description: string;
  isOpen: boolean;
  startNode: CampNode;
  mapImage: string;
  mapWidth: number;
  mapHeight: number;

  // 计算得到的数据
  nodeList?: Node[];
  edgesData?: EdgeData[];
}

// regionId: Region
export const RegionList = {
  ruin: ruinRegion,
  centerMarshForest: centerMarshForestRegion,
  eastMarshForest: eastMarshForestRegion,
  northwestMarshForest: northwestMarshForestRegion,
  dragonValley: dragonValleyRegion,
  forestDungeon: forestDungeonRegion,
};

// 预计算地图的节点和边数据
export function calculateMapData(region: Region): void {
  if (region.nodeList && region.edgesData) {
    // 如果已经计算过，直接返回
    return;
  }

  const nodeList: Node[] = [];
  const edgesData: EdgeData[] = [];
  const visited = new Set<string>();

  function traverse(node: Node, fromNode: Node | null): void {
    if (visited.has(node.id)) {
      node.fromNodeList!.push(fromNode!);
      return;
    }
    visited.add(node.id);
    node.fromNodeList = fromNode ? [fromNode] : [];

    // 添加节点到列表
    nodeList.push(node);

    node.toNodeList.forEach(child => {
      edgesData.push({
        source: node.id,
        target: child.id
      });

      traverse(child, node);
    });
  }

  traverse(region.startNode, null);

  // 保存计算结果
  region.nodeList = nodeList;
  region.edgesData = edgesData;
}

// 初始化所有地图数据
export function initializeAllMapData(): void {
  Object.values(RegionList).forEach(region => {
    calculateMapData(region);
  });
}

export function getRegionById(id: string): Region | undefined {
  const region = RegionList[id as keyof typeof RegionList];
  if (!region) return;
  // 确保地图数据已计算
  calculateMapData(region);
  return region;
}
