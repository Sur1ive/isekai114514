import {
  Node,
  NodeType,
  NormalMonsterNode,
  BossNode,
  TreasureNode,
  ToOtherRegionNode,
  EliteMonsterNode,
  ResourceNode,
} from "./Node";
import { Player } from "../creatures/Player";
import { Monster, applyVariant } from "../creatures/Monster";
import { randomMonsterType } from "../creatures/utils";
import { randomInt, randomFloat } from "../utils";
import { randomItemType, generateItem } from "../items/itemUtils";
import * as d3 from "d3";
import router from "@/router";
import { useBattleStore, BattleContext } from "@/stores/battleStore";
import { usePlayerStore } from "@/stores/playerStore";

// 全局变量，用于存储当前地图的引用
declare global {
  interface Window {
    currentMapSvg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    currentZoomBehavior?: d3.ZoomBehavior<Element, unknown>;
    currentNodeElements?: d3.Selection<
      d3.BaseType,
      Node,
      d3.BaseType,
      unknown
    >;
    currentEdgeElements?: d3.Selection<
      d3.BaseType,
      unknown,
      d3.BaseType,
      unknown
    >;
    updateMapForNode?: (player: Player, newNodeId: string) => void;
  }
}

function navigateToMap() {
  const currentRoute = router.currentRoute.value;
  if (currentRoute.name === "map") {
    // Force re-render by adding timestamp query
    router.replace({ name: "map", query: { _t: Date.now().toString() } });
  } else {
    router.push({ name: "map" });
  }
}

function goToNormalMonsterNode(node: NormalMonsterNode, player: Player) {
  const monsterData = randomMonsterType(node.monsterList);
  if (!monsterData) {
    player.goToNode(node.id);
    navigateToMap();
    return;
  }
  const monsterLevel = randomInt(monsterData.minLevel, monsterData.maxLevel);
  const monster = new Monster(monsterData.monster, monsterLevel, 1);
  applyVariant(monster);
  const battleStore = useBattleStore();
  battleStore.startBattle(monster, BattleContext.NormalMonster);
  router.push({ name: "battle" });
}

function goToEliteMonsterNode(node: EliteMonsterNode, player: Player) {
  if (Math.random() < node.treasureProbability) {
    const treasureNode: TreasureNode = {
      ...node,
      type: NodeType.Treasure,
      firstTimeTreasureList: node.treasureList,
      repeatableTreasureList: node.treasureList,
    };
    goToTreasureNode(treasureNode, player);
    return;
  } else {
    const monsterData = randomMonsterType(node.monsterList);
    if (!monsterData) {
      player.goToNode(node.id);
      navigateToMap();
      return;
    }
    const monsterIndividualStrength = randomFloat(
      monsterData.minIndividualStrength,
      monsterData.maxIndividualStrength,
    );
    const monsterLevel = randomInt(monsterData.minLevel, monsterData.maxLevel);
    const monster = new Monster(
      monsterData.monster,
      monsterLevel,
      monsterIndividualStrength,
    );
    applyVariant(monster);
    const battleStore = useBattleStore();
    battleStore.startBattle(monster, BattleContext.NormalMonster);
    router.push({ name: "battle" });
  }
}

function goToBossNode(node: BossNode, player: Player) {
  const bossStageList = node.bossStageList;
  if (!bossStageList) {
    player.goToNode(node.id);
    navigateToMap();
    return;
  }

  let bossList = player.persistedBoss[node.id];
  if (!bossList || bossList.length === 0) {
    bossList = [];
    bossStageList.forEach((bossStage) => {
      const bossLevel = randomInt(bossStage.minLevel, bossStage.maxLevel);
      const individualStrength = randomInt(
        bossStage.minIndividualStrength,
        bossStage.maxIndividualStrength,
      );
      const boss = new Monster(bossStage.monster, bossLevel, individualStrength);
      applyVariant(boss);
      bossList.push(boss);
    });
    player.persistedBoss[node.id] = bossList;
  }

  player.currentMapData.bossNodeId = node.id;

  const boss = bossList[0] as Monster;
  console.log(boss);
  const playerStore = usePlayerStore();
  playerStore.save();
  const battleStore = useBattleStore();
  battleStore.startBattle(boss, BattleContext.Boss);
  router.push({ name: "battle" });
}

function goToTreasureNode(node: TreasureNode, player: Player) {
  let treasureList = node.firstTimeTreasureList;
  if (player.unlockedNodeIdList.includes(node.id)) {
    treasureList = node.repeatableTreasureList;
  }
  if (!player.currentMapData.visitedNodeIdList.includes(node.id)) {
    const treasureData = randomItemType(treasureList);
    if (treasureData) {
      const treasureLevel = randomInt(
        treasureData.minLevel,
        treasureData.maxLevel,
      );
      const treasure = generateItem(treasureData.item, treasureLevel);
      player.pack.push(treasure);
      treasure.showItemToast();
    }
  }
  player.goToNode(node.id);
  navigateToMap();
}

export function isResourceNodeAvailable(nodeId: string, player: Player): boolean {
  const lastCollected = player.resourceNodeLastCollectedTime[nodeId];
  if (!lastCollected) return true;
  const currentHourStart = new Date();
  currentHourStart.setMinutes(0, 0, 0);
  return currentHourStart.getTime() > lastCollected;
}

function goToResourceNode(node: ResourceNode, player: Player) {
  if (isResourceNodeAvailable(node.id, player)) {
    for (const drop of node.guaranteedDropList) {
      for (let i = 0; i < drop.quantity; i++) {
        const item = generateItem(drop.item, drop.level);
        player.pack.push(item);
        item.showItemToast();
      }
    }
    if (node.randomDropList.length > 0) {
      const randomDrop = randomItemType(node.randomDropList);
      if (randomDrop) {
        const level = randomInt(randomDrop.minLevel, randomDrop.maxLevel);
        const item = generateItem(randomDrop.item, level);
        player.pack.push(item);
        item.showItemToast();
      }
    }
    player.resourceNodeLastCollectedTime[node.id] = Date.now();
  }
  player.goToNode(node.id);
  navigateToMap();
}

function goToOtherRegionNode(node: ToOtherRegionNode, player: Player) {
  player.goToNode(node.id);
  const region = node.region;
  if (!player.unlockedRegionIdList.includes(region.id)) {
    player.unlockedRegionIdList.push(region.id);
  }
  if (region.isOpen) {
    player.goToRegion(region.id);
    player.goToNode(region.startNode.id);
    navigateToMap();
    return;
  } else {
    alert("前面的区域以后再来探索吧？");
  }
}

export function goToNode(node: Node, player: Player) {
  player.currentMapData.goingToNodeId = node.id;

  // 资源节点始终需要检查刷新状态，不走平滑过渡
  if (node.type === NodeType.Resource) {
    goToResourceNode(node as ResourceNode, player);
    return;
  }

  // 如果节点已访问且我们有可用的地图引用，执行平滑过渡
  if (
    player.currentMapData.visitedNodeIdList.includes(node.id) &&
    window.currentMapSvg &&
    window.updateMapForNode
  ) {
    // 更新玩家位置
    player.goToNode(player.currentMapData.goingToNodeId);

    // 执行平滑过渡而不是重新渲染
    window.updateMapForNode(player, node.id);

    return;
  }

  // 原有逻辑，处理未访问过的节点
  if (player.currentMapData.visitedNodeIdList.includes(node.id)) {
    player.goToNode(player.currentMapData.goingToNodeId);
    navigateToMap();
    return;
  }

  if (node.type === NodeType.NormalMonster) {
    goToNormalMonsterNode(node as NormalMonsterNode, player);
  } else if (node.type === NodeType.EliteMonster) {
    goToEliteMonsterNode(node as EliteMonsterNode, player);
  } else if (node.type === NodeType.Boss) {
    goToBossNode(node as BossNode, player);
  } else if (node.type === NodeType.Treasure) {
    goToTreasureNode(node as TreasureNode, player);
  } else if (node.type === NodeType.ToOtherRegion) {
    goToOtherRegionNode(node as ToOtherRegionNode, player);
  } else {
    player.goToNode(player.currentMapData.goingToNodeId);
    navigateToMap();
    return;
  }
}
