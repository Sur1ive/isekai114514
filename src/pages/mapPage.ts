import { Player } from "../creatures/Player";
import { getAppElement } from "./utils";
import { Node } from "../maps/Node";
import ruinImage from "../assets/ruin.png";
// import frameImage from "../assets/frame.png";
import { renderMainMenu } from "./mainMenu";
import * as d3 from "d3";
import { goToNode } from "../maps/utils";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { getRegionById } from "../maps/Region";

export function renderMapPage(player: Player): void {
  const appElement = getAppElement();

  // 设置页面结构：一个 SVG 容器和返回按钮
  appElement.innerHTML = `
  <div id="map-container" class="d-flex flex-column" style="flex: 1;">

    <svg id="map-svg" style="flex: 1;"></svg>

    <button id="return-btn" type="button" class="btn btn-primary" style="
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);
      z-index: 10;
    ">
      返回营地
    </button>

  </div>
  `;

  // 构造节点和边的数据
  const nodesData: { id: string; x: number; y: number; label: string; node: Node }[] = [];
  const edgesData: { source: string; target: string }[] = [];
  const visited = new Set<string>();

  function traverse(node: Node): void {
    if (visited.has(node.id)) return;
    visited.add(node.id);

    nodesData.push({
      id: node.id,
      label: node.name,
      x: node.position.x,
      y: node.position.y,
      node: node
    });

    node.toNodeList.forEach(child => {
      edgesData.push({
        source: node.id,
        target: child.id
      });
      traverse(child);
    });
  }
  traverse(getRegionById(player.currentMapData.currentRegionId).startNode);

  // 选择 SVG 容器
  const svg = d3.select<SVGSVGElement, unknown>("#map-svg");
  // 创建包含所有图形的容器组
  const zoomableGroup = svg.append("g").attr("class", "zoomable");

  // 定义 zoom 行为
  const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 2])
  // translateExtent 限制平移的区域范围：
  // 左上角和右下角的坐标确定了背景图在 SVG 中能出现的极限位置
    .translateExtent([[0, 0], [1000, 1000]])
    .on("zoom", (event) => {
      zoomableGroup.attr("transform", event.transform);
    });

  // 将 zoom 行为绑定到 SVG 上，支持鼠标拖动、滚轮缩放和触摸手势
  svg.call(zoomBehavior);

  // 添加背景图像，确保它在最底层
  zoomableGroup.append('image')
    .attr('xlink:href', ruinImage)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', 1000)
    .attr('height', 1000)
    .lower();

  // //添加frame
  // svg.append('image')
  // .attr('xlink:href', frameImage)
  // .attr('x', 0)
  // .attr('y', 0)
  // .attr('width', 1000)
  // .attr('height', 1000)
  // .style('z-index', '2')
  // .style('pointer-events', 'none');

  // 绘制边（采用二次贝塞尔曲线实现平滑过渡）
  const edgeGroup = zoomableGroup.append("g").attr("class", "edges");
  edgesData.forEach(edge => {
    const sourceNode = nodesData.find(n => n.id === edge.source);
    const targetNode = nodesData.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return;

    // 计算连线是否可见
    const isSourceVisible = isNodeVisible(sourceNode.node, player, nodesData);
    const isTargetVisible = isNodeVisible(targetNode.node, player, nodesData);

    // 连线样式根据节点可访问性决定
    const isAccessiblePath = isAccessibleEdge(sourceNode.node, targetNode.node, player);

    // 如果源节点和目标节点至少有一个不可见，或路径不可访问，则不显示连线
    if (!isSourceVisible || !isTargetVisible) {
      return;
    }

    // 计算控制点，这里简单让控制点在两个节点的中间并上移一定距离（可根据需求调整）
    const cx = (sourceNode.x + targetNode.x) / 2;
    const cy = (sourceNode.y + targetNode.y) / 2 - 50;
    const pathData = `M ${sourceNode.x} ${sourceNode.y} Q ${cx} ${cy}, ${targetNode.x} ${targetNode.y}`;

    edgeGroup.append("path")
             .attr("d", pathData)
             .attr("stroke", isAccessiblePath ? "#4caf50" : "#aaa") // 可访问路径为绿色，否则为灰色
             .attr("stroke-width", isAccessiblePath ? 3 : 1.5)
             .attr("fill", "none")
             .attr("opacity", isAccessiblePath ? 1 : 0.6);
  });

  // 判断节点是否可见的辅助函数
  function isNodeVisible(node: Node, player: Player, nodesData: { id: string; x: number; y: number; label: string; node: Node }[]): boolean {
    const isUnlocked = player.unlockedNodeIdList.includes(node.id);
    const isCurrentNode = player.currentMapData.currentNodeId === node.id;
    const isVisited = player.currentMapData.visitedNodeIdList.includes(node.id);
    const isStartNode = !player.currentMapData.currentNodeId && node === getRegionById(player.currentMapData.currentRegionId).startNode;
    const isAccessible = player.currentMapData.currentNodeId
      ? nodesData.find(n => n.id === player.currentMapData.currentNodeId)?.node.toNodeList.some(n => n.id === node.id)
      : false;

    return isUnlocked || isCurrentNode || isVisited || isAccessible || isStartNode;
  }

  // 判断连线是否可访问的辅助函数
  function isAccessibleEdge(sourceNode: Node, targetNode: Node, player: Player): boolean {
    // 如果源节点是当前节点，且目标节点在 toNodeList 中，则连线可访问
    if (player.currentMapData.currentNodeId === sourceNode.id &&
        sourceNode.toNodeList.some(n => n.id === targetNode.id)) {
      return true;
    }

    // 如果目标节点是当前节点，且源节点在 toNodeList 中，则连线可访问
    if (player.currentMapData.currentNodeId === targetNode.id &&
        targetNode.toNodeList.some(n => n.id === sourceNode.id)) {
      return true;
    }

    // 如果源节点和目标节点都是已访问节点，则连线可访问
    if (player.currentMapData.visitedNodeIdList.includes(sourceNode.id) &&
        player.currentMapData.visitedNodeIdList.includes(targetNode.id)) {
      return true;
    }

    return false;
  }

  // 绘制节点（用圆形和文字组合）
  const nodeGroup = zoomableGroup.append("g").attr("class", "nodes");
  const nodeG = nodeGroup.selectAll("g.node")
                         .data(nodesData)
                         .enter()
                         .append("g")
                         .attr("class", "node")
                         .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
                         .style("cursor", "pointer")
                         .style("display", (d) => {
                           return isNodeVisible(d.node, player, nodesData) ? "block" : "none";
                         });

  // 绘制节点圆形
  nodeG.append("circle")
       .attr("r", 10)
       .attr("fill", (d) => {
         // 当前节点显示为蓝色
         if (player.currentMapData.currentNodeId === d.node.id) {
           return "#007bff"; // 蓝色
         }

         // 如果当前没有节点，且是区域起始节点，则显示为蓝色
         if (!player.currentMapData.currentNodeId &&
             d.node === getRegionById(player.currentMapData.currentRegionId).startNode) {
           return "#007bff"; // 蓝色
         }

         // 可前往节点显示为绿色（当前节点的toNodeList或已访问节点）
         const isAccessible = player.currentMapData.currentNodeId
           ? nodesData.find(n => n.id === player.currentMapData.currentNodeId)?.node.toNodeList.some(n => n.id === d.node.id)
           : false;
         const isVisited = player.currentMapData.visitedNodeIdList.includes(d.node.id);

         if (isAccessible || isVisited) {
           return "#28a745"; // 绿色
         }

         // 已解锁但不可访问的节点显示为灰色
         return "#6c757d"; // 灰色
       })
       .attr("stroke", "#333")
       .attr("stroke-width", 1);

  // // 添加节点文字
  // nodeG.append("text")
  // .attr("x", 20)   // x轴偏移，可调整
  // .attr("y", 5)    // y轴偏移（垂直居中）
  // .text(d => d.label)
  // .attr("text-anchor", "start")  // 标签左对齐
  // .attr("font-size", "12px")
  // .attr("fill", "#333");

  // tooltips
  nodeG.each(function(d) {
    const node = d.node;

    tippy(this, {
      content: `
        <div>
          <h3>${node.name}</h3>
          <p>${node.description}</p>
          <a class="btn btn-primary" id="go-${node.id}">
            前往
          </a>
        </div>
      `,
      allowHTML: true,
      interactive: true,      // 允许点击 popover 内部而不消失
      trigger: 'click',       // 点击触发
      hideOnClick: true,      // 点击外部自动隐藏
      appendTo: document.body, // 将 tippy 插入 body
      onShown(instance) {
        // 在弹出后获取 popover 内部的按钮
        const button = instance.popper.querySelector(`#go-${node.id}`);
        if (button) {
          button.addEventListener("click", (e) => {
            e.stopPropagation(); // 防止点击传播关闭 popover
            instance.hide();
            goToNode(node, player);
          });
        }
      }
    });
  });

  // 添加淡入动画
  nodeG.attr("opacity", 0)
       .transition()
       .duration(500)
       .attr("opacity", 1);

  // 返回营地按钮绑定事件
  document.getElementById("return-btn")?.addEventListener("click", () => {
    renderMainMenu(player);
  });
}
