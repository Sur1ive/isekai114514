<template>
  <div id="map-container" class="d-flex flex-column" style="flex: 1; position: relative">
    <!-- 地图标题和信息栏 -->
    <div
      class="map-header"
      style="
        background: rgba(0, 0, 0, 0.7);
        color: white;
        padding: 10px 20px;
        border-bottom: 2px solid #4caf50;
        z-index: 10;
        display: flex;
        justify-content: space-between;
        align-items: center;
      "
    >
      <div>
        <h2 style="margin: 0; font-size: 1.5rem">
          {{ regionName }}
        </h2>
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.8">
          当前生命值: <span style="color: #4caf50; font-weight: bold">{{ playerHealth }}/{{ playerMaxHealth }}</span>
        </p>
      </div>
      <div id="player-location" style="font-size: 0.9rem">
        当前位置: <span style="color: #4caf50; font-weight: bold">{{ currentLocationName }}</span>
      </div>
    </div>

    <!-- 地图图例 -->
    <div
      class="map-legend"
      style="
        position: absolute;
        bottom: 80px;
        left: 20px;
        background: rgba(0, 0, 0, 0.7);
        color: white;
        border-radius: 5px;
        padding: 10px;
        z-index: 10;
        font-size: 0.9rem;
        cursor: pointer;
        user-select: none;
      "
      @click="legendCollapsed = !legendCollapsed"
    >
      <div style="font-weight: bold; display: flex; justify-content: space-between; align-items: center">
        <span>图例</span>
        <span style="font-size: 0.7rem; opacity: 0.6; margin-left: 8px">{{ legendCollapsed ? '▸' : '▼' }}</span>
      </div>
      <template v-if="!legendCollapsed">
        <div style="display: flex; align-items: center; margin-top: 5px; margin-bottom: 5px">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #007bff; margin-right: 10px"></div>
          <span>当前位置</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #28a745; margin-right: 10px"></div>
          <span>可前往地点</span>
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px">
          <div style="width: 12px; height: 12px; border-radius: 50%; background: #6c757d; margin-right: 10px"></div>
          <span>已知地点</span>
        </div>
        <div style="display: flex; align-items: center">
          <div style="position: relative; width: 12px; height: 12px; margin-right: 10px">
            <div style="width: 12px; height: 12px; border-radius: 50%; background: #6c757d"></div>
            <div style="position: absolute; top: -4px; right: -4px; width: 8px; height: 8px; border-radius: 50%; background: #ffc107; border: 1px solid #fff"></div>
          </div>
          <span>有未探索路径</span>
        </div>
      </template>
    </div>

    <!-- 地图区域（相对定位容器，boss血条浮于其上） -->
    <div style="flex: 1; position: relative">
      <!-- 左上角信息叠层：Boss 血条 + 资源节点状态 -->
      <div class="map-overlay-left">
        <!-- Boss 血条 -->
        <div v-if="hasBossNode" class="boss-gauge">
          <div class="boss-gauge-header">
            <span class="boss-gauge-label">BOSS</span>
            <span class="boss-gauge-name">{{ bossSpawned ? bossCurrentStageName : bossNodeName }}</span>
            <span v-if="bossCleared" class="boss-gauge-clear">CLEAR</span>
          </div>
          <div class="boss-gauge-bar-bg">
            <div
              v-if="bossSpawned"
              class="boss-gauge-bar-fill"
              :style="{ width: bossHpPercent + '%', backgroundColor: bossHpColor }"
            ></div>
            <div v-else-if="bossCleared" class="boss-gauge-bar-fill" style="width: 0%"></div>
            <div v-else class="boss-gauge-bar-fill boss-gauge-bar-unknown" style="width: 100%"></div>
            <template v-if="bossSpawned && bossTotalStages > 1">
              <div
                v-for="i in bossTotalStages - 1"
                :key="i"
                class="boss-gauge-stage-divider"
                :style="{ left: (i / bossTotalStages) * 100 + '%' }"
              ></div>
            </template>
            <div class="boss-gauge-bar-text">
              <template v-if="bossSpawned">
                {{ Math.ceil(bossCurrentHp) }} / {{ Math.ceil(bossTotalMaxHp) }}
              </template>
              <template v-else-if="bossCleared">CLEAR</template>
              <template v-else>???</template>
            </div>
          </div>
        </div>

        <!-- 资源节点状态 -->
        <div
          v-for="rn in resourceNodes"
          :key="rn.id"
          class="resource-indicator"
          :class="rn.available ? 'resource-available' : 'resource-empty'"
        >
          <div class="resource-icon-wrap">
            <span class="resource-icon">{{ rn.available ? '🎁' : '📦' }}</span>
            <span v-if="rn.available" class="resource-sparkle">✦</span>
          </div>
          <div class="resource-info">
            <span class="resource-indicator-name">{{ rn.name }}</span>
            <span v-if="rn.available" class="resource-badge">可获取</span>
            <span v-else class="resource-cooldown">空 · {{ nextRefreshTime }}刷新</span>
          </div>
        </div>
      </div>

      <!-- 地图控制面板 -->
      <div class="map-controls-container">
        <div class="map-controls-panel" @click="controlsCollapsed ? controlsCollapsed = false : undefined">
          <div v-if="controlsCollapsed" class="map-controls-collapsed" @click="controlsCollapsed = false">
            <span>缩放▼</span>
          </div>
          <template v-else>
            <div class="map-controls-buttons">
              <button class="btn btn-sm btn-dark" style="width: 32px; height: 32px" @click.stop="zoomIn">+</button>
              <button class="btn btn-sm btn-dark" style="width: 32px; height: 32px" @click.stop="zoomOut">-</button>
              <button class="btn btn-sm btn-dark" style="width: 32px; height: 32px" @click.stop="centerMap">⌖</button>
              <button class="btn btn-sm btn-dark" style="width: 32px; height: 24px; font-size: 0.65rem; opacity: 0.6" @click.stop="controlsCollapsed = true">▲</button>
            </div>
          </template>
        </div>
      </div>

      <svg id="map-svg" ref="svgRef" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-color: #1a1a1a"></svg>
    </div>

    <button
      type="button"
      class="btn btn-primary"
      style="
        position: absolute;
        left: 50%;
        bottom: 20px;
        transform: translateX(-50%);
        z-index: 10;
        background-color: #4caf50;
        border: none;
        padding: 10px 20px;
        border-radius: 30px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
      "
      @click="router.push({ name: 'main-menu' })"
    >
      返回营地
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/playerStore";
import { Node, NodeType } from "@/maps/Node";
import type { BossNode } from "@/maps/Node";
import { isResourceNodeAvailable } from "@/maps/utils";
import { getRegionById } from "@/maps/Region";
import { goToNode } from "@/maps/utils";
import { Monster } from "@/creatures/Monster";
import ruinImage from "@/assets/ruin.png";
import * as d3 from "d3";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const router = useRouter();
const playerStore = usePlayerStore();

const svgRef = ref<SVGSVGElement | null>(null);

// 响应式数据
const legendCollapsed = ref(true);
const controlsCollapsed = ref(false);
const regionName = ref("未知区域");
const playerHealth = ref(0);
const playerMaxHealth = ref(0);
const currentLocationName = ref("营地");

// 资源节点状态
const resourceNodes = ref<{ id: string; name: string; available: boolean }[]>([]);
let resourceTimerId: ReturnType<typeof setInterval> | null = null;

const nextRefreshTime = computed(() => {
  const next = new Date();
  next.setHours(next.getHours() + 1, 0, 0, 0);
  return `${next.getHours().toString().padStart(2, '0')}:00`;
});

function updateResourceNodes() {
  const player = playerStore.player;
  if (!player) return;
  const region = getRegionById(player.currentMapData.currentRegionId);
  if (!region?.nodeList) return;

  resourceNodes.value = region.nodeList
    .filter((n) => n.type === NodeType.Resource)
    .map((n) => ({
      id: n.id,
      name: n.name,
      available: isResourceNodeAvailable(n.id, player),
    }));
}

// Boss 血条
const hasBossNode = ref(false);
const bossNodeName = ref("");
const bossSpawned = ref(false);
const bossCleared = ref(false);
const bossTotalStages = ref(0);
const bossRemainingStages = ref(0);
const bossCurrentHp = ref(0);
const bossTotalMaxHp = ref(0);
const bossCurrentStageName = ref("");
const bossHpPercent = computed(() => {
  if (bossTotalMaxHp.value <= 0) return 0;
  return Math.max(0, Math.min(100, (bossCurrentHp.value / bossTotalMaxHp.value) * 100));
});
const bossHpColor = computed(() => {
  const p = bossHpPercent.value;
  if (p > 50) return "#e74c3c";
  if (p > 25) return "#e67e22";
  return "#c0392b";
});

function updateBossGauge() {
  const player = playerStore.player;
  if (!player) return;
  const region = getRegionById(player.currentMapData.currentRegionId);
  if (!region?.nodeList) return;

  const bossNode = region.nodeList.find((n) => n.type === NodeType.Boss) as BossNode | undefined;
  hasBossNode.value = !!bossNode;
  if (!bossNode) return;

  bossNodeName.value = bossNode.name;
  bossTotalStages.value = bossNode.bossStageList.length;

  const bossList = player.persistedBoss[bossNode.id] || [];
  bossSpawned.value = bossList.length > 0;
  bossCleared.value = !bossSpawned.value && player.unlockedNodeIdList.includes(bossNode.id);

  if (bossSpawned.value) {
    bossRemainingStages.value = bossList.length;
    const currentBoss = bossList[0] as Monster;
    bossCurrentStageName.value = currentBoss.name;
    bossCurrentHp.value = bossList.reduce((sum, b) => sum + (b as Monster).health, 0);
    bossTotalMaxHp.value = bossList.reduce((sum, b) => sum + (b as Monster).getMaxHealth(), 0);
    const defeatedStages = bossTotalStages.value - bossList.length;
    for (let i = 0; i < defeatedStages; i++) {
      bossTotalMaxHp.value += bossNode.bossStageList[i]
        ? new Monster(bossNode.bossStageList[i].monster, bossNode.bossStageList[i].maxLevel, bossNode.bossStageList[i].maxIndividualStrength).getMaxHealth()
        : 0;
    }
  }
}

// D3 引用
let svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
let zoomBehavior: d3.ZoomBehavior<SVGSVGElement, unknown>;
let styleElement: HTMLStyleElement | null = null;

function zoomIn() {
  if (svg && zoomBehavior) {
    svg.transition().duration(300).call(zoomBehavior.scaleBy, 1.3);
  }
}

function zoomOut() {
  if (svg && zoomBehavior) {
    svg.transition().duration(300).call(zoomBehavior.scaleBy, 0.7);
  }
}

function centerMap() {
  const player = playerStore.player;
  if (!player) return;
  const currentRegion = getRegionById(player.currentMapData.currentRegionId);
  if (!currentRegion?.nodeList) return;
  const nodes = currentRegion.nodeList;
  const currentNodeId = player.currentMapData.currentNodeId;
  const targetNode = nodes.find((n) => n.id === currentNodeId);
  centerToNode(targetNode);
}

function centerToNode(targetNode: { position: { x: number; y: number } } | undefined) {
  if (targetNode && svg && zoomBehavior) {
    const svgWidth = svg.node()?.clientWidth || 800;
    const svgHeight = svg.node()?.clientHeight || 600;
    const transform = d3.zoomIdentity
      .translate(svgWidth / 2, svgHeight / 2)
      .scale(1.2)
      .translate(-targetNode.position.x, -targetNode.position.y);
    svg.transition().duration(750).call(zoomBehavior.transform, transform);
  }
}

onMounted(() => {
  if (!playerStore.player) {
    router.push({ name: "main-menu" });
    return;
  }
  const player = playerStore.player;

  const currentRegion = getRegionById(player.currentMapData.currentRegionId);
  player.isAtHome = false;

  if (!currentRegion) {
    console.error("当前区域不存在");
    router.push({ name: "main-menu" });
    return;
  }

  if (!player.currentMapData.currentNodeId) {
    player.currentMapData.currentNodeId = currentRegion.startNode.id;
  }

  // 设置响应式数据
  regionName.value = currentRegion.name || "未知区域";
  playerHealth.value = player.health;
  playerMaxHealth.value = player.getMaxHealth();

  const mapWidth = currentRegion.mapWidth || 1000;
  const mapHeight = currentRegion.mapHeight || 1000;
  const mapImage = currentRegion.mapImage || ruinImage;
  const nodes = [...currentRegion.nodeList!];
  const edgesData = [...currentRegion.edgesData!];

  // 获取当前位置名称
  const currentNode = nodes.find((n) => n.id === player.currentMapData.currentNodeId);
  currentLocationName.value = currentNode ? currentNode.name : "未知";

  // 辅助函数
  function getNodeColor(node: Node, currentNodeId: string): string {
    if (currentNodeId === node.id) return "#007bff";
    const currNode = nodes.find((n) => n.id === currentNodeId);
    const isAccessible =
      currNode!.toNodeList.some((n) => n.id === node.id) || currNode!.fromNodeList?.some((n) => n.id === node.id);
    if (isAccessible) return "#28a745";
    return "#6c757d";
  }

  function isEdgeAccessible(sourceNode: Node, targetNode: Node, currentNodeId: string): boolean {
    return currentNodeId === sourceNode.id || currentNodeId === targetNode.id;
  }

  function isNodeVisible(node: Node): boolean {
    const isUnlocked = player.unlockedNodeIdList.includes(node.id);
    const isCurrentNode = player.currentMapData.currentNodeId === node.id;
    const isVisited = player.currentMapData.visitedNodeIdList.includes(node.id);
    const isStartNode = node.id === currentRegion!.startNode.id;
    const isAdjoinVisitedNode = player.currentMapData.visitedNodeIdList.some((id) => {
      const visitedNode = nodes.find((n) => n.id === id);
      if (visitedNode) {
        return visitedNode.toNodeList.some((n) => n.id === node.id) || visitedNode.fromNodeList?.some((n) => n.id === node.id);
      }
      return false;
    });
    return isUnlocked || isCurrentNode || isVisited || isAdjoinVisitedNode || isStartNode;
  }

  function isAccessibleEdge(sourceNode: Node, targetNode: Node): boolean {
    return (
      player.currentMapData.currentNodeId === sourceNode.id || player.currentMapData.currentNodeId === targetNode.id
    );
  }

  function hasHiddenNeighbors(node: Node): boolean {
    const allNeighbors = [...node.toNodeList, ...(node.fromNodeList ?? [])];
    return allNeighbors.some((n) => !isNodeVisible(n));
  }

  // D3 初始化
  svg = d3.select<SVGSVGElement, unknown>(svgRef.value!);
  window.currentMapSvg = svg as unknown as d3.Selection<SVGSVGElement, unknown, null, undefined>;

  const zoomableGroup = svg.append("g").attr("class", "zoomable");

  zoomBehavior = d3
    .zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 2])
    .translateExtent([
      [0, 0],
      [mapWidth, mapHeight],
    ])
    .on("zoom", (event) => {
      zoomableGroup.attr("transform", event.transform);
      if (!player.currentMapData.viewState) {
        player.currentMapData.viewState = { x: 0, y: 0, scale: 1 };
      }
      player.currentMapData.viewState = {
        x: event.transform.x,
        y: event.transform.y,
        scale: event.transform.k,
      };
    });

  window.currentZoomBehavior = zoomBehavior as unknown as d3.ZoomBehavior<Element, unknown>;
  svg.call(zoomBehavior);

  // 背景图像
  zoomableGroup
    .append("image")
    .attr("xlink:href", mapImage)
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", mapWidth)
    .attr("height", mapHeight)
    .attr("filter", "brightness(0.9) contrast(1.1)")
    .lower();

  // 网格背景
  const gridSize = Math.min(mapWidth, mapHeight) / 20;
  const gridGroup = zoomableGroup.append("g").attr("class", "grid").lower();
  for (let x = 0; x <= mapWidth; x += gridSize) {
    gridGroup
      .append("line")
      .attr("x1", x).attr("y1", 0).attr("x2", x).attr("y2", mapHeight)
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-width", 1);
  }
  for (let y = 0; y <= mapHeight; y += gridSize) {
    gridGroup
      .append("line")
      .attr("x1", 0).attr("y1", y).attr("x2", mapWidth).attr("y2", y)
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-width", 1);
  }

  // 绘制边
  const edgeGroup = zoomableGroup.append("g").attr("class", "edges");
  edgesData.forEach((edge) => {
    const sourceNode = nodes.find((n) => n.id === edge.source);
    const targetNode = nodes.find((n) => n.id === edge.target);
    if (!sourceNode || !targetNode) return;

    const isSourceVisible = isNodeVisible(sourceNode);
    const isTargetVisible = isNodeVisible(targetNode);
    const isAccessiblePath = isAccessibleEdge(sourceNode, targetNode);

    if (!isSourceVisible || !isTargetVisible) return;

    const cx = (sourceNode.position.x + targetNode.position.x) / 2;
    const cy = (sourceNode.position.y + targetNode.position.y) / 2 - 50;
    const pathData = `M ${sourceNode.position.x} ${sourceNode.position.y} Q ${cx} ${cy}, ${targetNode.position.x} ${targetNode.position.y}`;

    edgeGroup
      .append("path")
      .attr("d", pathData)
      .attr("stroke", isAccessiblePath ? "#4caf50" : "#aaa")
      .attr("stroke-width", isAccessiblePath ? 3 : 1.5)
      .attr("fill", "none")
      .attr("opacity", isAccessiblePath ? 1 : 0.6);
  });

  // 绘制节点
  const nodeGroup = zoomableGroup.append("g").attr("class", "nodes");
  const nodeG = nodeGroup
    .selectAll("g.node")
    .data(nodes)
    .enter()
    .append("g")
    .attr("class", "node")
    .attr("transform", (d) => `translate(${d.position.x}, ${d.position.y})`)
    .style("cursor", "pointer")
    .style("display", (d) => (isNodeVisible(d) ? "block" : "none"));

  window.currentNodeElements = nodeG as unknown as d3.Selection<d3.BaseType, Node, d3.BaseType, unknown>;
  window.currentEdgeElements = edgeGroup.selectAll("path");

  // 节点圆形
  nodeG
    .append("circle")
    .attr("class", "node-circle")
    .attr("r", 12)
    .attr("fill", (d) => getNodeColor(d, player.currentMapData.currentNodeId!))
    .attr("stroke", "#f8f9fa")
    .attr("stroke-width", 2)
    .attr("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.5))");

  // 未探索邻居指示器
  nodeG
    .append("circle")
    .attr("class", "node-indicator")
    .attr("r", 5)
    .attr("cx", 14)
    .attr("cy", -10)
    .attr("fill", "#ffc107")
    .attr("stroke", "#fff")
    .attr("stroke-width", 1)
    .style("pointer-events", "none")
    .style("display", (d) => (isNodeVisible(d) && hasHiddenNeighbors(d)) ? "block" : "none");

  // 发光效果
  nodeG
    .append("circle")
    .attr("class", "node-glow")
    .attr("r", 20)
    .attr("fill", "none")
    .attr("stroke", (d) => {
      if (player.currentMapData.currentNodeId === d.id) return "#007bff";
      if (!player.currentMapData.currentNodeId && d === currentRegion.startNode) return "#007bff";
      return "transparent";
    })
    .attr("stroke-width", 2)
    .attr("opacity", 0.5)
    .attr("stroke-dasharray", "3,3")
    .style("animation", "pulse 2s infinite");

  // 节点标签
  nodeG
    .append("text")
    .attr("x", 0)
    .attr("y", -20)
    .text((d) => d.name)
    .attr("text-anchor", "middle")
    .attr("font-size", "12px")
    .attr("fill", "#f8f9fa")
    .attr("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.8))")
    .style("pointer-events", "none");

  // tooltips
  nodeG.each(function (d) {
    const node = d;
    const isCurrentNode = player.currentMapData.currentNodeId === node.id;
    const currNode = nodes.find((n) => n.id === player.currentMapData.currentNodeId);
    const isAccessible =
      currNode!.toNodeList.some((n) => n.id === d.id) || currNode!.fromNodeList?.some((n) => n.id === d.id);
    const canGo = !isCurrentNode && isAccessible;

    tippy(this, {
      content: `
        <div>
          <h3>${node.name}</h3>
          <p>${node.description}</p>
          ${canGo ? `<a class="btn btn-primary" id="go-${node.id}">前往</a>` : ""}
        </div>
      `,
      allowHTML: true,
      interactive: true,
      trigger: "click",
      hideOnClick: true,
      appendTo: document.body,
      onShown(instance) {
        if (canGo) {
          const button = instance.popper.querySelector(`#go-${node.id}`);
          if (button) {
            button.addEventListener("click", (e) => {
              e.stopPropagation();
              instance.hide();
              player.currentMapData.isMovingBetweenNodes = true;
              goToNode(node, player);
            });
          }
        }
      },
    });
  });

  // 淡入动画
  nodeG.attr("opacity", 0).transition().duration(500).attr("opacity", 1);

  // CSS 动画
  styleElement = document.createElement("style");
  styleElement.textContent = `
    @keyframes pulse {
      0% { stroke-opacity: 0.8; r: 16; }
      50% { stroke-opacity: 0.4; r: 20; }
      100% { stroke-opacity: 0.8; r: 16; }
    }
  `;
  document.head.appendChild(styleElement);

  // Boss 血条初始化
  updateBossGauge();

  // 资源节点状态初始化，每分钟检查刷新
  updateResourceNodes();
  resourceTimerId = setInterval(updateResourceNodes, 60_000);

  // 视图状态恢复/自动居中
  setTimeout(() => {
    if (player.currentMapData.viewState) {
      const savedState = player.currentMapData.viewState;
      if (player.currentMapData.isMovingBetweenNodes) {
        const targetNode = nodes.find((n) => n.id === player.currentMapData.currentNodeId);
        if (targetNode) {
          const svgWidth = svg.node()?.clientWidth || 800;
          const svgHeight = svg.node()?.clientHeight || 600;
          const transform = d3.zoomIdentity
            .translate(svgWidth / 2, svgHeight / 2)
            .scale(savedState.scale)
            .translate(-targetNode.position.x, -targetNode.position.y);
          svg.transition().duration(750).call(zoomBehavior.transform, transform);
        }
        player.currentMapData.isMovingBetweenNodes = false;
      } else {
        const transform = d3.zoomIdentity.translate(savedState.x, savedState.y).scale(savedState.scale);
        svg.call(zoomBehavior.transform, transform);
      }
    } else {
      const targetNode = nodes.find((n) => n.id === player.currentMapData.currentNodeId);
      centerToNode(targetNode);
    }
  }, 100);

  // updateMapForNode 函数
  window.updateMapForNode = function (player, newNodeId) {
    try {
      // 更新位置标签
      const curNode = nodes.find((n) => n.id === newNodeId);
      if (curNode) {
        currentLocationName.value = curNode.name;
      }

      // 更新节点颜色
      if (window.currentNodeElements) {
        window.currentNodeElements.selectAll(".node-circle").attr("fill", function () {
          try {
            const element = this as Element;
            const parent = element.parentNode as Element;
            const nodeData = d3.select(parent).datum() as Node;
            if (!nodeData) return "#6c757d";
            return getNodeColor(nodeData, newNodeId);
          } catch (e) {
            console.warn("Error updating node color:", e);
            return "#6c757d";
          }
        });

        window.currentNodeElements.selectAll(".node-indicator").style("display", function () {
          try {
            const element = this as Element;
            const parent = element.parentNode as Element;
            const nodeData = d3.select(parent).datum() as Node;
            if (!nodeData) return "none";
            return (isNodeVisible(nodeData) && hasHiddenNeighbors(nodeData)) ? "block" : "none";
          } catch {
            return "none";
          }
        });

        window.currentNodeElements.selectAll(".node-glow").attr("stroke", function () {
          try {
            const element = this as Element;
            const parent = element.parentNode as Element;
            const nodeData = d3.select(parent).datum() as Node;
            if (!nodeData) return "transparent";
            return newNodeId === nodeData.id ? "#007bff" : "transparent";
          } catch (e) {
            console.warn("Error updating glow effect:", e);
            return "transparent";
          }
        });
      }

      // 更新边样式
      if (window.currentEdgeElements) {
        window.currentEdgeElements
          .attr("stroke", function () {
            try {
              const element = this as SVGPathElement;
              const pathData = element.getAttribute("d");
              if (!pathData) return "#aaa";
              const matches = pathData.match(/M\s*(\d+)\s*(\d+).+?(\d+)\s*(\d+)$/);
              if (!matches) return "#aaa";
              const [, x1, y1, x2, y2] = matches.map(Number);
              const sNode = nodes.find((n) => Math.abs(n.position.x - x1) < 1 && Math.abs(n.position.y - y1) < 1);
              const tNode = nodes.find((n) => Math.abs(n.position.x - x2) < 1 && Math.abs(n.position.y - y2) < 1);
              if (!sNode || !tNode) return "#aaa";
              return isEdgeAccessible(sNode, tNode, newNodeId) ? "#4caf50" : "#aaa";
            } catch (e) {
              console.warn("Error updating edge color:", e);
              return "#aaa";
            }
          })
          .attr("stroke-width", function () {
            return d3.select(this).attr("stroke") === "#4caf50" ? 3 : 1.5;
          })
          .attr("opacity", function () {
            return d3.select(this).attr("stroke") === "#4caf50" ? 1 : 0.6;
          });
      }

      // 更新 tippy
      if (window.currentNodeElements) {
        window.currentNodeElements.each(function (d) {
          const node = d as Node;
          // @ts-expect-error - tippy 可能在某些类型定义中不存在
          const tippyInstance = (this as Element)._tippy;
          if (tippyInstance) tippyInstance.destroy();

          const isCurrNode = newNodeId === node.id;
          const currNode = nodes.find((n) => n.id === newNodeId);
          const isAccessible =
            currNode?.toNodeList.some((n) => n.id === node.id) || currNode?.fromNodeList?.some((n) => n.id === node.id);
          const canGo = !isCurrNode && isAccessible;

          tippy(this as SVGGElement, {
            content: `
              <div>
                <h3>${node.name}</h3>
                <p>${node.description}</p>
                ${canGo ? `<a class="btn btn-primary" id="go-${node.id}">前往</a>` : ""}
              </div>
            `,
            allowHTML: true,
            interactive: true,
            trigger: "click",
            hideOnClick: true,
            appendTo: document.body,
            onShown(instance) {
              if (canGo) {
                const button = instance.popper.querySelector(`#go-${node.id}`);
                if (button) {
                  button.addEventListener("click", (e) => {
                    e.stopPropagation();
                    instance.hide();
                    player.currentMapData.isMovingBetweenNodes = true;
                    goToNode(node, player);
                  });
                }
              }
            },
          });
        });
      }

      // 平滑过渡到新节点
      const targetNode = nodes.find((n) => n.id === newNodeId);
      if (targetNode && window.currentMapSvg && window.currentZoomBehavior) {
        const svgWidth = window.currentMapSvg.node()?.clientWidth || 800;
        const svgHeight = window.currentMapSvg.node()?.clientHeight || 600;
        const currentScale = player.currentMapData.viewState?.scale || 1.2;
        const transform = d3.zoomIdentity
          .translate(svgWidth / 2, svgHeight / 2)
          .scale(currentScale)
          .translate(-targetNode.position.x, -targetNode.position.y);

        const zoomTransform = window.currentZoomBehavior.transform as unknown as (
          transition: d3.Transition<SVGSVGElement, unknown, null, undefined>,
          transform: d3.ZoomTransform,
        ) => void;

        window.currentMapSvg.transition().duration(750).call(zoomTransform, transform);
      }
    } catch (e) {
      console.error("Error in updateMapForNode:", e);
      router.push({ name: "map", query: { _t: Date.now().toString() } });
    }
  };
});

onBeforeUnmount(() => {
  if (resourceTimerId) clearInterval(resourceTimerId);

  // 清理全局引用
  window.currentMapSvg = undefined;
  window.currentZoomBehavior = undefined;
  window.currentNodeElements = undefined;
  window.currentEdgeElements = undefined;
  window.updateMapForNode = undefined;

  // 清理样式
  if (styleElement && styleElement.parentNode) {
    styleElement.parentNode.removeChild(styleElement);
  }
});
</script>

<style scoped>
.map-overlay-left {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 15;
  pointer-events: none;
  width: min(260px, 40vw);
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.boss-gauge {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  padding: 5px 10px 7px;
}

.resource-indicator {
  border-radius: 6px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.resource-available {
  background: linear-gradient(135deg, rgba(40, 30, 10, 0.85), rgba(60, 45, 15, 0.85));
  border: 1px solid rgba(255, 193, 7, 0.5);
  box-shadow: 0 0 8px rgba(255, 193, 7, 0.2), inset 0 0 12px rgba(255, 193, 7, 0.05);
  animation: resource-glow 2.5s ease-in-out infinite;
}

.resource-empty {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(108, 117, 125, 0.3);
}

@keyframes resource-glow {
  0%, 100% { box-shadow: 0 0 6px rgba(255, 193, 7, 0.15), inset 0 0 10px rgba(255, 193, 7, 0.03); }
  50% { box-shadow: 0 0 12px rgba(255, 193, 7, 0.35), inset 0 0 14px rgba(255, 193, 7, 0.08); }
}

.resource-icon-wrap {
  position: relative;
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.resource-icon {
  font-size: 16px;
  line-height: 1;
}

.resource-empty .resource-icon {
  filter: grayscale(0.7) brightness(0.6);
}

.resource-sparkle {
  position: absolute;
  top: -4px;
  right: -6px;
  font-size: 10px;
  color: #ffd54f;
  animation: sparkle-blink 1.4s ease-in-out infinite;
}

@keyframes sparkle-blink {
  0%, 100% { opacity: 0.3; transform: scale(0.8); }
  50% { opacity: 1; transform: scale(1.2); }
}

.resource-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.resource-indicator-name {
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.resource-available .resource-indicator-name {
  color: #ffe082;
}

.resource-empty .resource-indicator-name {
  color: #adb5bd;
}

.resource-badge {
  font-size: 9px;
  font-weight: 700;
  color: #fff;
  background: linear-gradient(90deg, #e6a817, #f9c846);
  padding: 0 5px;
  border-radius: 3px;
  width: fit-content;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.3);
}

.resource-cooldown {
  font-size: 9px;
  color: #868e96;
}

.boss-gauge-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 3px;
}

.boss-gauge-label {
  background: #dc3545;
  color: #fff;
  font-weight: 700;
  font-size: 9px;
  letter-spacing: 1px;
  padding: 0 5px;
  border-radius: 2px;
}

.boss-gauge-name {
  color: #f8f9fa;
  font-size: 11px;
  font-weight: 600;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.boss-gauge-stage {
  color: rgba(255, 255, 255, 0.7);
  font-size: 10px;
  white-space: nowrap;
}

.boss-gauge-clear {
  color: #4caf50;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
}

.boss-gauge-bar-bg {
  position: relative;
  height: 12px;
  background: #444;
  border-radius: 2px;
  overflow: hidden;
}

.boss-gauge-bar-fill {
  height: 100%;
  transition: width 0.8s ease-out, background-color 0.5s ease;
  border-radius: 3px 0 0 3px;
}

.boss-gauge-bar-unknown {
  background-color: #6c757d !important;
  animation: unknown-pulse 3s ease-in-out infinite;
}

@keyframes unknown-pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.7; }
}

.boss-gauge-stage-divider {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 1px;
  background: rgba(255, 255, 255, 0.25);
  z-index: 2;
}

.boss-gauge-bar-text {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
  z-index: 3;
}

.map-controls-container {
  position: absolute;
  top: 10px;
  right: 20px;
  z-index: 15;
}

.map-controls-panel {
  background: rgba(0, 0, 0, 0.7);
  border-radius: 5px;
  padding: 6px;
  cursor: pointer;
}

.map-controls-collapsed {
  color: rgba(255, 255, 255, 0.7);
  font-size: 11px;
  padding: 0 4px;
  user-select: none;
}

.map-controls-buttons {
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: center;
}
</style>
