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

    <!-- 地图控制面板 -->
    <div
      class="map-controls"
      style="
        position: absolute;
        top: 70px;
        right: 20px;
        background: rgba(0, 0, 0, 0.7);
        border-radius: 5px;
        padding: 10px;
        z-index: 10;
        display: flex;
        flex-direction: column;
        gap: 10px;
      "
    >
      <button class="btn btn-sm btn-dark" style="width: 40px; height: 40px" @click="zoomIn">+</button>
      <button class="btn btn-sm btn-dark" style="width: 40px; height: 40px" @click="zoomOut">-</button>
      <button class="btn btn-sm btn-dark" style="width: 40px; height: 40px" @click="centerMap">⌖</button>
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
      "
    >
      <div style="margin-bottom: 5px; font-weight: bold">地图图例:</div>
      <div style="display: flex; align-items: center; margin-bottom: 5px">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: #007bff; margin-right: 10px"></div>
        <span>当前位置</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 5px">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: #28a745; margin-right: 10px"></div>
        <span>可前往地点</span>
      </div>
      <div style="display: flex; align-items: center">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: #6c757d; margin-right: 10px"></div>
        <span>已知地点</span>
      </div>
    </div>

    <svg id="map-svg" ref="svgRef" style="flex: 1; background-color: #1a1a1a"></svg>

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
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/playerStore";
import { Node } from "@/maps/Node";
import { getRegionById } from "@/maps/Region";
import { goToNode } from "@/maps/utils";
import ruinImage from "@/assets/ruin.png";
import * as d3 from "d3";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css";

const router = useRouter();
const playerStore = usePlayerStore();

const svgRef = ref<SVGSVGElement | null>(null);

// 响应式数据
const regionName = ref("未知区域");
const playerHealth = ref(0);
const playerMaxHealth = ref(0);
const currentLocationName = ref("营地");

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
    .attr("r", 12)
    .attr("fill", (d) => getNodeColor(d, player.currentMapData.currentNodeId!))
    .attr("stroke", "#f8f9fa")
    .attr("stroke-width", 2)
    .attr("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.5))");

  // 发光效果
  nodeG
    .append("circle")
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
        window.currentNodeElements.selectAll("circle:first-child").attr("fill", function () {
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

        window.currentNodeElements.selectAll("circle:nth-child(2)").attr("stroke", function () {
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
