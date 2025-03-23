import { Player } from "../creatures/Player";
import { getAppElement } from "./utils";
import { Node } from "../maps/Node";
import { Region } from "../maps/Region";
import ruinImage from "../assets/ruin.png";
import { renderMainMenu } from "./mainMenu";
import * as d3 from "d3";
import { Popover } from 'bootstrap';

export function renderMapPage(player: Player, region: Region): void {
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
  const nodes: { id: string; x: number; y: number; label: string }[] = [];
  const edges: { source: string; target: string }[] = [];
  const visited = new Set<string>();

  function traverse(node: Node): void {
    if (visited.has(node.name)) return;
    visited.add(node.name);

    nodes.push({
      id: node.name,
      label: node.name,
      x: node.position.x,
      y: node.position.y
    });

    node.toNodeList.forEach(child => {
      edges.push({
        source: node.name,
        target: child.name
      });
      traverse(child);
    });
  }
  traverse(region.startNode);

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


  // 绘制边（采用二次贝塞尔曲线实现平滑过渡）
  const edgeGroup = zoomableGroup.append("g").attr("class", "edges");
  edges.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return;

    // 计算控制点，这里简单让控制点在两个节点的中间并上移一定距离（可根据需求调整）
    const cx = (sourceNode.x + targetNode.x) / 2;
    const cy = (sourceNode.y + targetNode.y) / 2 - 50;
    const pathData = `M ${sourceNode.x} ${sourceNode.y} Q ${cx} ${cy}, ${targetNode.x} ${targetNode.y}`;

    edgeGroup.append("path")
             .attr("d", pathData)
             .attr("stroke", "#ccc")
             .attr("stroke-width", 2)
             .attr("fill", "none");
  });

  // 绘制节点（用圆形和文字组合）
  const nodeGroup = zoomableGroup.append("g").attr("class", "nodes");
  const nodeG = nodeGroup.selectAll("g.node")
                         .data(nodes)
                         .enter()
                         .append("g")
                         .attr("class", "node")
                         .attr("transform", (d) => `translate(${d.x}, ${d.y})`)
                         .style("cursor", "pointer")
                         .on("click", (_event: MouseEvent, d) => {
                           console.log(`点击了节点 ${d.id}`);
                           // 这里可以扩展节点点击后的逻辑
                         });

  // 绘制节点圆形
  nodeG.append("circle")
       .attr("r", 10)
       .attr("fill", "#6FB1FC")
       .attr("stroke", "none");

  // // 添加节点文字
  // nodeG.append("text")
  // .attr("x", 20)   // x轴偏移，可调整
  // .attr("y", 5)    // y轴偏移（垂直居中）
  // .text(d => d.label)
  // .attr("text-anchor", "start")  // 标签左对齐
  // .attr("font-size", "12px")
  // .attr("fill", "#333");

nodeG.on("click", function(event, d) {
  // this 即为当前被点击的节点
  // 如果已经存在 popover，先销毁它
  const existingPopover = Popover.getInstance(this);
  if(existingPopover) {
    existingPopover.dispose();
  }

  // 设置 popover 所需的属性
  this.setAttribute("data-bs-toggle", "popover");
  this.setAttribute("data-bs-trigger", "focus"); // 手动触发 popover 的显示/隐藏
  this.setAttribute("data-bs-title", `节点 ${d.id} 信息`);
  this.setAttribute("data-bs-content", `这里可以显示节点 ${d.id} 的详细信息。`);

  // 初始化 popover，指定 container 为 body 以防显示问题
  const popover = new Popover(this, {
    container: 'body',
    trigger: 'focus'
  });

  // 显示 popover
  popover.show();
});

  // 添加淡入动画
  nodeG.attr("opacity", 0)
       .transition()
       .duration(500)
       .attr("opacity", 1);

  // 返回营地按钮绑定事件
  document.getElementById("return-btn")?.addEventListener("click", () => {
    player.isAtHome = true;
    player.currentNode = null;
    renderMainMenu(player);
  });
}
