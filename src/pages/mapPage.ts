import { Player } from "../creatures/Player";
import { getAppElement } from "./utils";
import { Node } from "../maps/Node";
import ruinImage from "../assets/ruin.png";
import { renderMainMenu } from "./mainMenu";
import * as d3 from "d3";
import { goToNode } from "../maps/utils";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import { getRegionById } from "../maps/Region";

export function renderMapPage(player: Player): void {
  const appElement = getAppElement();

  // 获取当前区域
  const currentRegion = getRegionById(player.currentMapData.currentRegionId);
  player.isAtHome = false;

  if (!currentRegion) {
    console.error("当前区域不存在");
    renderMainMenu(player);
    return;
  }

  if (!player.currentMapData.currentNodeId) {
    player.currentMapData.currentNodeId = currentRegion.startNode.id;
  }

  // 获取地图尺寸和图像
  const mapWidth = currentRegion.mapWidth || 1000;
  const mapHeight = currentRegion.mapHeight || 1000;
  const mapImage = currentRegion.mapImage || ruinImage;

  // 使用预计算的节点和边数据
  const nodes = [...currentRegion.nodeList!]; // 克隆数组避免修改原始数据
  const edgesData = [...currentRegion.edgesData!];

  // 获取当前位置名称
  let currentLocationName = '营地';
  const currentNode = nodes.find(n => n.id === player.currentMapData.currentNodeId);
  if (currentNode) {
    currentLocationName = currentNode.name;
  } else {
    currentLocationName = '未知';
  }

  // 辅助函数：获取节点颜色
  function getNodeColor(node: Node, currentNodeId: string): string {
    // 当前节点显示为蓝色
    if (currentNodeId === node.id) {
      return "#007bff"; // 蓝色
    }

    // 可前往节点显示为绿色（当前节点的相邻节点）
    const currNode = nodes.find(n => n.id === currentNodeId);
    const isAccessible = currNode!.toNodeList.some(n => n.id === node.id) ||
                        currNode!.fromNodeList?.some(n => n.id === node.id);
    if (isAccessible) {
      return "#28a745"; // 绿色
    }

    // 可见但不可前往的节点显示为灰色
    if (isNodeVisible(node, player, nodes)) {
      return "#6c757d"; // 灰色
    }

    // 其他节点不可见
    return "#6c757d"; // 灰色
  }

  // 辅助函数：判断边是否可访问
  function isEdgeAccessible(sourceNode: Node, targetNode: Node, currentNodeId: string): boolean {
    // player当前节点是源节点或目标节点，则连线可访问
    if (currentNodeId === sourceNode.id || currentNodeId === targetNode.id) {
      return true;
    }
    return false;
  }

  // 设置页面结构：一个 SVG 容器和返回按钮
  appElement.innerHTML = `
  <div id="map-container" class="d-flex flex-column" style="flex: 1; position: relative;">
    <!-- 地图标题和信息栏 -->
    <div class="map-header" style="
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 10px 20px;
      border-bottom: 2px solid #4caf50;
      z-index: 10;
      display: flex;
      justify-content: space-between;
      align-items: center;
    ">
      <div>
        <h2 style="margin: 0; font-size: 1.5rem;">
          ${currentRegion.name || '未知区域'}
        </h2>
        <p style="margin: 0; font-size: 0.9rem; opacity: 0.8;">
          当前生命值: <span style="color: #4caf50; font-weight: bold;">${player.health}/${player.getMaxHealth()}</span>
        </p>
      </div>
      <div id="player-location" style="font-size: 0.9rem;">
        当前位置: <span style="color: #4caf50; font-weight: bold;">
          ${currentLocationName}
        </span>
      </div>
    </div>

    <!-- 地图控制面板 -->
    <div class="map-controls" style="
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
    ">
      <button id="zoom-in-btn" class="btn btn-sm btn-dark" style="width: 40px; height: 40px;">
        +
      </button>
      <button id="zoom-out-btn" class="btn btn-sm btn-dark" style="width: 40px; height: 40px;">
        -
      </button>
      <button id="center-map-btn" class="btn btn-sm btn-dark" style="width: 40px; height: 40px;">
        ⌖
      </button>
    </div>

    <!-- 地图图例 -->
    <div class="map-legend" style="
      position: absolute;
      bottom: 80px;
      left: 20px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      border-radius: 5px;
      padding: 10px;
      z-index: 10;
      font-size: 0.9rem;
    ">
      <div style="margin-bottom: 5px; font-weight: bold;">地图图例:</div>
      <div style="display: flex; align-items: center; margin-bottom: 5px;">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: #007bff; margin-right: 10px;"></div>
        <span>当前位置</span>
      </div>
      <div style="display: flex; align-items: center; margin-bottom: 5px;">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: #28a745; margin-right: 10px;"></div>
        <span>可前往地点</span>
      </div>
      <div style="display: flex; align-items: center;">
        <div style="width: 12px; height: 12px; border-radius: 50%; background: #6c757d; margin-right: 10px;"></div>
        <span>已知地点</span>
      </div>
    </div>

    <svg id="map-svg" style="flex: 1; background-color: #1a1a1a;"></svg>

    <button id="return-btn" type="button" class="btn btn-primary" style="
      position: absolute;
      left: 50%;
      bottom: 20px;
      transform: translateX(-50%);
      z-index: 10;
      background-color: #4caf50;
      border: none;
      padding: 10px 20px;
      border-radius: 30px;
      box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    ">
      返回营地
    </button>
  </div>
  `;

  // 选择 SVG 容器
  const svg = d3.select<SVGSVGElement, unknown>("#map-svg");

  // 保存对地图的全局引用
  window.currentMapSvg = svg as unknown as d3.Selection<SVGSVGElement, unknown, null, undefined>;

  // 创建包含所有图形的容器组
  const zoomableGroup = svg.append("g").attr("class", "zoomable");

  // 定义 zoom 行为 - 根据地图尺寸调整
  const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.5, 2])
    .translateExtent([[0, 0], [mapWidth, mapHeight]])
    .on("zoom", (event) => {
      zoomableGroup.attr("transform", event.transform);

      // 保存当前视图状态
      if (!player.currentMapData.viewState) {
        player.currentMapData.viewState = {
          x: 0,
          y: 0,
          scale: 1
        };
      }
      player.currentMapData.viewState = {
        x: event.transform.x,
        y: event.transform.y,
        scale: event.transform.k
      };
    });

  // 保存对缩放行为的全局引用
  window.currentZoomBehavior = zoomBehavior as unknown as d3.ZoomBehavior<Element, unknown>;

  // 将 zoom 行为绑定到 SVG 上，支持鼠标拖动、滚轮缩放和触摸手势
  svg.call(zoomBehavior);

  // 定义居中函数，方便复用
  function centerToNode(targetNode: { position: { x: number; y: number; } } | undefined) {
    if (targetNode) {
      const svgWidth = svg.node()?.clientWidth || 800;
      const svgHeight = svg.node()?.clientHeight || 600;
      // 修正居中计算，确保节点位于视图正中央
      const transform = d3.zoomIdentity
        .translate(svgWidth / 2, svgHeight / 2)
        .scale(1.2)
        .translate(-targetNode.position.x, -targetNode.position.y);

      svg.transition().duration(750).call(zoomBehavior.transform, transform);
    }
  }

  // 添加背景图像，使用动态尺寸
  zoomableGroup.append('image')
    .attr('xlink:href', mapImage)
    .attr('x', 0)
    .attr('y', 0)
    .attr('width', mapWidth)
    .attr('height', mapHeight)
    .attr('filter', 'brightness(0.9) contrast(1.1)')
    .lower();

  // 添加网格背景增加深度感，根据地图尺寸调整
  const gridSize = Math.min(mapWidth, mapHeight) / 20; // 动态计算网格尺寸
  const gridGroup = zoomableGroup.append("g").attr("class", "grid").lower();
  for(let x = 0; x <= mapWidth; x += gridSize) {
    gridGroup.append("line")
      .attr("x1", x)
      .attr("y1", 0)
      .attr("x2", x)
      .attr("y2", mapHeight)
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-width", 1);
  }
  for(let y = 0; y <= mapHeight; y += gridSize) {
    gridGroup.append("line")
      .attr("x1", 0)
      .attr("y1", y)
      .attr("x2", mapWidth)
      .attr("y2", y)
      .attr("stroke", "rgba(255, 255, 255, 0.05)")
      .attr("stroke-width", 1);
  }

  // 绘制边（采用二次贝塞尔曲线实现平滑过渡）
  const edgeGroup = zoomableGroup.append("g").attr("class", "edges");
  edgesData.forEach(edge => {
    const sourceNode = nodes.find(n => n.id === edge.source);
    const targetNode = nodes.find(n => n.id === edge.target);
    if (!sourceNode || !targetNode) return;

    // 计算连线是否可见
    const isSourceVisible = isNodeVisible(sourceNode, player, nodes);
    const isTargetVisible = isNodeVisible(targetNode, player, nodes);

    // 连线样式根据节点可访问性决定
    const isAccessiblePath = isAccessibleEdge(sourceNode, targetNode, player);

    // 如果源节点和目标节点至少有一个不可见，或路径不可访问，则不显示连线
    if (!isSourceVisible || !isTargetVisible) {
      return;
    }

    // 计算控制点，这里简单让控制点在两个节点的中间并上移一定距离（可根据需求调整）
    const cx = (sourceNode.position.x + targetNode.position.x) / 2;
    const cy = (sourceNode.position.y + targetNode.position.y) / 2 - 50;
    const pathData = `M ${sourceNode.position.x} ${sourceNode.position.y} Q ${cx} ${cy}, ${targetNode.position.x} ${targetNode.position.y}`;

    edgeGroup.append("path")
             .attr("d", pathData)
             .attr("stroke", isAccessiblePath ? "#4caf50" : "#aaa") // 可访问路径为绿色，否则为灰色
             .attr("stroke-width", isAccessiblePath ? 3 : 1.5)
             .attr("fill", "none")
             .attr("opacity", isAccessiblePath ? 1 : 0.6);
  });

  // 判断节点是否可见的辅助函数
  function isNodeVisible(node: Node, player: Player, nodes: Node[]): boolean {
    const isUnlocked = player.unlockedNodeIdList.includes(node.id);
    const isCurrentNode = player.currentMapData.currentNodeId === node.id;
    const isVisited = player.currentMapData.visitedNodeIdList.includes(node.id);
    const isStartNode = node.id === currentRegion!.startNode.id;
    const isAdjoinVisitedNode = player.currentMapData.visitedNodeIdList.some(id => {
      const visitedNode = nodes.find(n => n.id === id);
      if (visitedNode) {
        return visitedNode.toNodeList.some(n => n.id === node.id) || visitedNode.fromNodeList?.some(n => n.id === node.id);
      }
      return false;
    });

    return isUnlocked || isCurrentNode || isVisited || isAdjoinVisitedNode || isStartNode;
  }

  // 判断连线是否可访问的辅助函数
  function isAccessibleEdge(sourceNode: Node, targetNode: Node, player: Player): boolean {
    // player当前节点是源节点或目标节点，则连线可访问
    if (player.currentMapData.currentNodeId === sourceNode.id || player.currentMapData.currentNodeId === targetNode.id) {
      return true;
    }
    return false;
  }

  // 绘制节点（用圆形和文字组合）
  const nodeGroup = zoomableGroup.append("g").attr("class", "nodes");
  const nodeG = nodeGroup.selectAll("g.node")
                         .data(nodes)
                         .enter()
                         .append("g")
                         .attr("class", "node")
                         .attr("transform", (d) => `translate(${d.position.x}, ${d.position.y})`)
                         .style("cursor", "pointer")
                         .style("display", (d) => {
                           return isNodeVisible(d, player, nodes) ? "block" : "none";
                         });

  // 保存对节点和边的全局引用
  window.currentNodeElements = nodeG as unknown as d3.Selection<d3.BaseType, Node, d3.BaseType, unknown>;
  window.currentEdgeElements = edgeGroup.selectAll("path");

  // 绘制节点圆形，添加更精美的样式
  nodeG.append("circle")
       .attr("r", 12)
       .attr("fill", (d) => getNodeColor(d, player.currentMapData.currentNodeId!))
       .attr("stroke", "#f8f9fa")
       .attr("stroke-width", 2)
       .attr("filter", "drop-shadow(0px 2px 3px rgba(0,0,0,0.5))");

  // 节点发光效果
  nodeG.append("circle")
       .attr("r", 20)
       .attr("fill", "none")
       .attr("stroke", (d) => {
         if (player.currentMapData.currentNodeId === d.id) {
           return "#007bff";
         }
         if (!player.currentMapData.currentNodeId &&
             d === currentRegion.startNode) {
           return "#007bff";
         }
         return "transparent";
       })
       .attr("stroke-width", 2)
       .attr("opacity", 0.5)
       .attr("stroke-dasharray", "3,3")
       .style("animation", "pulse 2s infinite");

  // 添加节点标签
  nodeG.append("text")
     .attr("x", 0)
     .attr("y", -20)
     .text(d => d.name)
     .attr("text-anchor", "middle")
     .attr("font-size", "12px")
     .attr("fill", "#f8f9fa")
     .attr("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.8))")
     .style("pointer-events", "none");

  // tooltips
  nodeG.each(function(d) {
    const node = d;

    // 检查是否为当前节点或起始节点
    const isCurrentNode = player.currentMapData.currentNodeId === node.id;

    // 检查节点是否可前往
    const currentNode = nodes.find(n => n.id === player.currentMapData.currentNodeId);
    const isAccessible = currentNode!.toNodeList.some(n => n.id === d.id) || currentNode!.fromNodeList?.some(n => n.id === d.id);

    // 只有可前往的节点才显示前往按钮
    const canGo = !isCurrentNode && isAccessible;

    tippy(this, {
      content: `
        <div>
          <h3>${node.name}</h3>
          <p>${node.description}</p>
          ${canGo ?
            `<a class="btn btn-primary" id="go-${node.id}">
              前往
            </a>` :
            ''
          }
        </div>
      `,
      allowHTML: true,
      interactive: true,      // 允许点击 popover 内部而不消失
      trigger: 'click',       // 点击触发
      hideOnClick: true,      // 点击外部自动隐藏
      appendTo: document.body, // 将 tippy 插入 body
      onShown(instance) {
        // 只有可前往的节点才添加点击事件
        if (canGo) {
          const button = instance.popper.querySelector(`#go-${node.id}`);
          if (button) {
            button.addEventListener("click", (e) => {
              e.stopPropagation(); // 防止点击传播关闭 popover
              instance.hide();

              // 设置标志，表示正在进行节点间移动
              player.currentMapData.isMovingBetweenNodes = true;

              // 前往新节点
              goToNode(node, player);
            });
          }
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

  // 添加地图控制功能事件
  document.getElementById("zoom-in-btn")?.addEventListener("click", () => {
    svg.transition().duration(300).call(zoomBehavior.scaleBy, 1.3);
  });

  document.getElementById("zoom-out-btn")?.addEventListener("click", () => {
    svg.transition().duration(300).call(zoomBehavior.scaleBy, 0.7);
  });

  document.getElementById("center-map-btn")?.addEventListener("click", () => {
    // 居中到当前节点
    const currentNodeId = player.currentMapData.currentNodeId;
    const targetNode = nodes.find(n => n.id === currentNodeId);

    centerToNode(targetNode);
  });

  // 在地图加载时尝试恢复上次的视图状态，或者自动居中到当前节点
  setTimeout(() => {
    // 检查是否有保存的视图状态
    if (player.currentMapData.viewState) {
      // 恢复之前保存的视图状态
      const savedState = player.currentMapData.viewState;

      // 如果是从节点间移动而来，使用平滑动画过渡到新节点
      if (player.currentMapData.isMovingBetweenNodes) {
        // 获取当前节点
        const currentNodeId = player.currentMapData.currentNodeId;
        const targetNode = nodes.find(n => n.id === currentNodeId);

        if (targetNode) {
          // 计算目标变换
          const svgWidth = svg.node()?.clientWidth || 800;
          const svgHeight = svg.node()?.clientHeight || 600;

          // 使用保存的缩放级别，但移动到新节点位置
          const transform = d3.zoomIdentity
            .translate(svgWidth / 2, svgHeight / 2)
            .scale(savedState.scale)
            .translate(-targetNode.position.x, -targetNode.position.y);

          // 应用带动画的变换
          svg.transition()
            .duration(750)
            .call(zoomBehavior.transform, transform);
        }

        // 重置移动标志
        player.currentMapData.isMovingBetweenNodes = false;
      } else {
        // 直接恢复上次视图状态，无动画
        const transform = d3.zoomIdentity
          .translate(savedState.x, savedState.y)
          .scale(savedState.scale);

        svg.call(zoomBehavior.transform, transform);
      }
    } else {
      // 如果没有保存状态，则默认居中到当前节点
      const currentNodeId = player.currentMapData.currentNodeId;
      const targetNode = nodes.find(n => n.id === currentNodeId);

      centerToNode(targetNode);
    }
  }, 100); // 短暂延迟确保SVG已完全加载并且有正确的尺寸

  // 在HTML头部添加一些CSS
  const styleElement = document.createElement('style');
  styleElement.textContent = `
    @keyframes pulse {
      0% { stroke-opacity: 0.8; r: 16; }
      50% { stroke-opacity: 0.4; r: 20; }
      100% { stroke-opacity: 0.8; r: 16; }
    }
  `;
  document.head.appendChild(styleElement);

  // 定义更新地图的函数，用于平滑过渡
  window.updateMapForNode = function(player: Player, newNodeId: string) {
    try {
      // 1. 更新当前位置标签
      const currentNode = nodes.find(n => n.id === newNodeId);
      if (currentNode) {
        const playerLocationEl = document.getElementById("player-location");
        if (playerLocationEl) {
          playerLocationEl.innerHTML = `当前位置: <span style="color: #4caf50; font-weight: bold;">${currentNode.name}</span>`;
        }
      }

      // 2. 更新节点颜色和样式
      if (window.currentNodeElements) {
        window.currentNodeElements.selectAll("circle:first-child")
          .attr("fill", function(_d) {
            try {
              // 安全地访问属性
              const element = this as Element;
              const parent = element.parentNode as Element;
              const nodeData = d3.select(parent).datum() as Node;
              if (!nodeData) return "#6c757d"; // 默认灰色

              // 使用相同的节点颜色逻辑
              return getNodeColor(nodeData, newNodeId);
            } catch (e) {
              console.warn("Error updating node color:", e);
              return "#6c757d"; // 出错时返回默认灰色
            }
          });

        // 更新发光效果
        window.currentNodeElements.selectAll("circle:nth-child(2)")
          .attr("stroke", function(_d) {
            try {
              const element = this as Element;
              const parent = element.parentNode as Element;
              const nodeData = d3.select(parent).datum() as Node;
              if (!nodeData) return "transparent";

              if (newNodeId === nodeData.id) {
                return "#007bff"; // 当前节点发光
              }
              return "transparent";
            } catch (e) {
              console.warn("Error updating glow effect:", e);
              return "transparent";
            }
          });
      }

      // 3. 更新边的样式 - 使用更安全的方法
      if (window.currentEdgeElements) {
        window.currentEdgeElements
          .attr("stroke", function(_d) {
            try {
              // 从DOM属性获取数据，避免依赖d3数据绑定
              const element = this as SVGPathElement;
              const pathData = element.getAttribute("d");
              if (!pathData) return "#aaa"; // 如果没有路径数据，返回默认灰色

              // 使用正则表达式或手动解析从pathData中提取连接的节点
              // 通常, d="M x1 y1 Q cx cy, x2 y2"表示从(x1,y1)到(x2,y2)的曲线
              const matches = pathData.match(/M\s*(\d+)\s*(\d+).+?(\d+)\s*(\d+)$/);
              if (!matches) return "#aaa";

              const [, x1, y1, x2, y2] = matches.map(Number);

              // 根据坐标找出相应的节点
              const sourceNode = nodes.find(n => Math.abs(n.position.x - x1) < 1 && Math.abs(n.position.y - y1) < 1);
              const targetNode = nodes.find(n => Math.abs(n.position.x - x2) < 1 && Math.abs(n.position.y - y2) < 1);

              if (!sourceNode || !targetNode) return "#aaa";

              // 使用相同的边可访问性逻辑
              if (isEdgeAccessible(sourceNode, targetNode, newNodeId)) {
                return "#4caf50";
              }

              return "#aaa";
            } catch (e) {
              console.warn("Error updating edge color:", e);
              return "#aaa"; // 出错时返回默认灰色
            }
          })
          .attr("stroke-width", function() {
            // 简化逻辑 - 直接根据颜色决定宽度
            return d3.select(this).attr("stroke") === "#4caf50" ? 3 : 1.5;
          })
          .attr("opacity", function() {
            // 简化逻辑 - 直接根据颜色决定透明度
            return d3.select(this).attr("stroke") === "#4caf50" ? 1 : 0.6;
          });
      }

      // 4. 更新tippy提示，销毁现有的并重新创建
      if (window.currentNodeElements) {
        window.currentNodeElements.each(function(d) {
          const node = d as Node;

          // 销毁现有的tippy实例
          // @ts-expect-error - tippy可能在某些类型定义中不存在这个属性
          const tippyInstance = (this as Element)._tippy;
          if (tippyInstance) {
            tippyInstance.destroy();
          }

          // 检查是否为当前节点
          const isCurrentNode = newNodeId === node.id;

          // 检查节点是否可前往
          const currNode = nodes.find(n => n.id === newNodeId);
          const isAccessible = currNode?.toNodeList.some(n => n.id === node.id) ||
                               currNode?.fromNodeList?.some(n => n.id === node.id);

          // 只有可前往的节点才显示前往按钮
          const canGo = !isCurrentNode && isAccessible;

          // 创建新的tippy实例
          tippy(this as SVGGElement, {
            content: `
              <div>
                <h3>${node.name}</h3>
                <p>${node.description}</p>
                ${canGo ?
                  `<a class="btn btn-primary" id="go-${node.id}">
                    前往
                  </a>` :
                  ''
                }
              </div>
            `,
            allowHTML: true,
            interactive: true,
            trigger: 'click',
            hideOnClick: true,
            appendTo: document.body,
            onShown(instance) {
              // 只有可前往的节点才添加点击事件
              if (canGo) {
                const button = instance.popper.querySelector(`#go-${node.id}`);
                if (button) {
                  button.addEventListener("click", (e) => {
                    e.stopPropagation();
                    instance.hide();

                    // 设置标志，表示正在进行节点间移动
                    player.currentMapData.isMovingBetweenNodes = true;

                    // 前往新节点
                    goToNode(node, player);
                  });
                }
              }
            }
          });
        });
      }

      // 5. 平滑过渡到新节点
      const targetNode = nodes.find(n => n.id === newNodeId);
      if (targetNode && window.currentMapSvg && window.currentZoomBehavior) {
        const svgWidth = window.currentMapSvg.node()?.clientWidth || 800;
        const svgHeight = window.currentMapSvg.node()?.clientHeight || 600;

        // 使用当前缩放级别
        const currentScale = player.currentMapData.viewState?.scale || 1.2;

        // 创建平滑过渡
        const transform = d3.zoomIdentity
          .translate(svgWidth / 2, svgHeight / 2)
          .scale(currentScale)
          .translate(-targetNode.position.x, -targetNode.position.y);

        // 使用类型断言修复类型错误
        const zoomTransform = window.currentZoomBehavior.transform as unknown as
          (transition: d3.Transition<SVGSVGElement, unknown, null, undefined>, transform: d3.ZoomTransform) => void;

        window.currentMapSvg.transition()
          .duration(750)
          .call(zoomTransform, transform);
      }
    } catch (e) {
      console.error("Error in updateMapForNode:", e);
      // 出错时回退到完整重新渲染
      renderMapPage(player);
    }
  };
}
