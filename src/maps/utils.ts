import { Node, NodeType, NormalMonsterNode, BossNode, TreasureNode, ToOtherRegionNode, EliteMonsterNode } from "./Node";
import { renderBattlePage } from "../pages/battlePage";
import { Player } from "../creatures/Player";
import { Monster } from "../creatures/Monster";
import { renderMainMenu } from "../pages/mainMenu";
import { renderMapPage } from "../pages/mapPage";
import { randomMonsterType } from "../creatures/utils";
import { randomInt, randomFloat } from "../utils";
import { BattleResult } from "../battle/types";
import { randomItemType, generateItem } from "../items/itemUtils";
import * as d3 from "d3";

// 全局变量，用于存储当前地图的引用
declare global {
  interface Window {
    currentMapSvg?: d3.Selection<SVGSVGElement, unknown, null, undefined>;
    currentZoomBehavior?: d3.ZoomBehavior<Element, unknown>;
    currentNodeElements?: d3.Selection<d3.BaseType, Node, d3.BaseType, unknown>;
    currentEdgeElements?: d3.Selection<d3.BaseType, unknown, d3.BaseType, unknown>;
    updateMapForNode?: (player: Player, newNodeId: string) => void;
  }
}

function normalBattleHandler(player: Player, _monster: Monster, result: BattleResult) {
  if (result === BattleResult.Lose || result === BattleResult.Withdraw || player.currentMapData.goingToNodeId === null) {
    renderMainMenu(player);
    return;
  }
  player.goToNode(player.currentMapData.goingToNodeId);
  renderMapPage(player);
}

function goToNormalMonsterNode(node: NormalMonsterNode, player: Player) {
  const monsterData = randomMonsterType(node.monsterList);
  if (!monsterData) {
    player.goToNode(node.id);
    renderMapPage(player);
    return;
  }
  const monsterLevel = randomInt(monsterData.minLevel, monsterData.maxLevel);
  const monster = new Monster(monsterData.monster, monsterLevel, 1);
  renderBattlePage(player, monster, null, null, normalBattleHandler);
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
      renderMapPage(player);
      return;
    }
    const monsterIndividualStrength = randomFloat(monsterData.minIndividualStrength, monsterData.maxIndividualStrength);
    const monsterLevel = randomInt(monsterData.minLevel, monsterData.maxLevel);
    const monster = new Monster(monsterData.monster, monsterLevel, monsterIndividualStrength);
    renderBattlePage(player, monster, null, null, normalBattleHandler);
  }
}

function bossBattleHandler(player: Player, monster: Monster, result: BattleResult) {
  if (result === BattleResult.Lose || result === BattleResult.Withdraw) {
    const bossHealthBefore = player.currentMapData.boss[0].health;
    const bossHealthAfter = monster.health;
    if (bossHealthBefore - bossHealthAfter > monster.getMaxHealth() * 0.2) {
      player.currentMapData.boss[0].health = bossHealthAfter;
    }
    renderMainMenu(player);
    return;
  }
  player.currentMapData.boss.shift();
  if (player.currentMapData.boss.length === 0) {
    if (player.currentMapData.goingToNodeId) {
      player.goToNode(player.currentMapData.goingToNodeId);
      renderMapPage(player);
      return;
    } else {
      renderMainMenu(player);
      return;
    }
  }
  renderBattlePage(player, player.currentMapData.boss[0] as Monster, null, null, bossBattleHandler);
}

function goToBossNode(node: BossNode, player: Player) {
  const bossStageList = node.bossStageList;
  if (!bossStageList) {
    player.goToNode(node.id);
    renderMapPage(player);
    return;
  }
  if (player.currentMapData.boss.length === 0) {
    bossStageList.forEach((bossStage) => {
      const bossLevel = randomInt(bossStage.minLevel, bossStage.maxLevel);
      const individualStrength = randomInt(bossStage.minIndividualStrength, bossStage.maxIndividualStrength);
      const boss = new Monster(bossStage.monster, bossLevel, individualStrength);
      player.currentMapData.boss.push(boss);
    });
  }
  const boss = player.currentMapData.boss[0] as Monster;
  console.log(boss);
  renderBattlePage(player, boss, null, null, bossBattleHandler);
}

function goToTreasureNode(node: TreasureNode, player: Player) {
  let treasureList = node.firstTimeTreasureList;
  if (player.unlockedNodeIdList.includes(node.id)) {
    treasureList = node.repeatableTreasureList;
  }
  if (!player.currentMapData.visitedNodeIdList.includes(node.id)) {
    const treasureData = randomItemType(treasureList);
    if (treasureData) {
      const treasureLevel = randomInt(treasureData.minLevel, treasureData.maxLevel);
      const treasure = generateItem(treasureData.item, treasureLevel);
      player.pack.push(treasure);
      treasure.showItemToast();
    }
  }
  player.goToNode(node.id);
  renderMapPage(player);
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
    renderMapPage(player);
    return;
  } else {
    alert("前面的区域以后再来探索吧？");
  }
}

export function goToNode(node: Node, player: Player) {
  player.currentMapData.goingToNodeId = node.id;

  // 如果节点已访问且我们有可用的地图引用，执行平滑过渡
  if (player.currentMapData.visitedNodeIdList.includes(node.id) &&
      window.currentMapSvg &&
      window.updateMapForNode) {

    // 更新玩家位置
    player.goToNode(player.currentMapData.goingToNodeId);

    // 执行平滑过渡而不是重新渲染
    window.updateMapForNode(player, node.id);

    return;
  }

  // 原有逻辑，处理未访问过的节点
  if (player.currentMapData.visitedNodeIdList.includes(node.id)) {
    player.goToNode(player.currentMapData.goingToNodeId);
    renderMapPage(player);
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
    renderMapPage(player);
    return;
  }
}
