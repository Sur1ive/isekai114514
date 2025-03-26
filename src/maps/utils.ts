import { Node, NodeType, NormalMonsterNode, BossNode, TreasureNode, ToOtherRegionNode } from "./Node";
import { renderBattlePage } from "../pages/battlePage";
import { Player } from "../creatures/Player";
import { Monster } from "../creatures/Monster";
import { renderMainMenu } from "../pages/mainMenu";
import { renderMapPage } from "../pages/mapPage";
import { randomMonsterType } from "../creatures/utils";
import { randomInt } from "../utils";
import { BattleResult } from "../battle/types";
import { getRegionById } from "./Region";
import { randomItemType, generateItem } from "../items/itemUtils";

function normalBattleHandler(player: Player, _monster: Monster, result: BattleResult) {
  if (result === BattleResult.Lose || result === BattleResult.Withdraw || player.currentMapData.goingToNodeId === null) {
    renderMainMenu(player);
    return;
  }
  player.goToNode(player.currentMapData.goingToNodeId);
  renderMapPage(player);
}

function goToNormalMonsterNode(node: NormalMonsterNode, player: Player) {
  const monsterData = randomMonsterType((node as NormalMonsterNode).monsterList);
  if (!monsterData) {
    player.goToNode(node.id);
    renderMapPage(player);
    return;
  }
  const monsterLevel = randomInt(monsterData.minLevel, monsterData.maxLevel);
  const monster = new Monster(monsterData.monster, monsterLevel, 1);
  renderBattlePage(player, monster, null, null, normalBattleHandler);
}

function goToBossNode(node: BossNode, player: Player) {
  // const bossStageList = (node as BossNode).bossStageList;
  // if (!bossStageList) {
  //   player.goToNode(node.id);
  //   renderMapPage(player);
  //   return;
  // }
  // if (!player.currentMapData.boss) {
  //   bossStageList.forEach((bossStage) => {
  //     const bossLevel = randomInt(bossStage.minLevel, bossStage.maxLevel);
  //     const individualStrength = randomInt(bossStage.minIndividualStrength, bossStage.maxIndividualStrength);
  //     const boss = new Monster(bossStage.monster, bossLevel, individualStrength);
  //     player.currentMapData.boss.push(boss);
  //   });
  // } else {
  //   const boss = player.currentMapData.boss;
  // }
  // renderBattlePage(player, boss, null, null, bossBattleHandler);
  player.goToNode(node.id);
  renderMapPage(player);
}

function goToTreasureNode(node: TreasureNode, player: Player) {
  let treasureList = (node as TreasureNode).firstTimeTreasureList;
  if (player.unlockedNodeIdList.includes(node.id)) {
    treasureList = (node as TreasureNode).repeatableTreasureList;
  }
  if (!player.currentMapData.visitedNodeIdList.includes(node.id)) {
    const treasureData = randomItemType(treasureList);
    if (treasureData) {
      const treasureLevel = randomInt(treasureData.minLevel, treasureData.maxLevel);
      const treasure = generateItem(treasureData.item, treasureLevel);
      player.pack.push(treasure);
    }
  }
  player.goToNode(node.id);
  renderMapPage(player);
}

function goToOtherRegionNode(node: ToOtherRegionNode, player: Player) {
  const region = getRegionById(node.region.id);
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

  if (player.currentMapData.visitedNodeIdList.includes(node.id)) {
    player.goToNode(player.currentMapData.goingToNodeId);
    renderMapPage(player);
    return;
  }

  if (node.type === NodeType.NormalMonster) {
    goToNormalMonsterNode(node as NormalMonsterNode, player);
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
