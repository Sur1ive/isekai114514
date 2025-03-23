import { Player } from "../creatures/Player";
import { getAppElement } from "./utils";
import { Node } from "../maps/Node";
import { Region } from "../maps/Region";
import ruinImage from "../assets/ruin.png";
import { renderMainMenu } from "./mainMenu";
import cytoscape from 'cytoscape';

export function renderMapPage(player: Player, region: Region): void {
  const appElement = getAppElement();

  appElement.innerHTML = `
  <div id="cy" style="width: 100vw; height: 100vh;"></div>
  <button id="return-btn" type="button" class="btn btn-primary" style="
      position: absolute;
      left: 20px;
      top: 80px;
      z-index: 999;
    ">
    返回营地
  </button>
  `;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const elements: any[] = [];
  const visited = new Set<string>();

  // 递归遍历节点，将所有节点和边添加到 elements 数组中
  function traverse(node: Node): void {
    if (visited.has(node.name)) return;
    visited.add(node.name);

    // 添加当前节点
    elements.push({
      data: { id: node.name, label: node.name },
      position: { x: node.position.x, y: node.position.y }
    });

    // 遍历子节点，并添加边
    node.toNodeList.forEach(child => {
      elements.push({
        data: { source: node.name, target: child.name }
      });
      traverse(child);
    });
  }

  // 从区域的起始节点开始遍历
  traverse(region.startNode);

  // 初始化 Cytoscape
  const cy = cytoscape({
    container: document.getElementById('cy'),
    elements: elements,
    style: [
      // 背景节点样式：注意增加 active/selected 状态下的样式重写
      {
        selector: 'node.background',
        style: {
          'background-image': ruinImage,
          'background-fit': 'cover',
          'shape': 'rectangle',
          'border-width': 0,
          'z-index': 0
        }
      },
      // 禁止背景节点在 active 和 selected 状态下显示特效
      {
        selector: 'node.background:selected, node.background:active',
        style: {
          'overlay-opacity': 0,
          'background-color': 'inherit',
          'border-width': 0
        }
      },
      {
        selector: 'node',
        style: {
          'label': 'data(label)',
          'background-color': '#6FB1FC',
          'text-valign': 'center',
          'color': '#fff',
          'width': '40px',
          'height': '40px',
          'font-size': '12px'
        }
      },
      {
        selector: 'edge',
        style: {
          'line-color': '#ccc',
          'target-arrow-shape': 'triangle',
          'curve-style': 'bezier'
        }
      }
    ],
    // 如果节点数据中已有坐标，则使用 preset 布局
    layout: {
      name: 'preset'
    },
    // 降低鼠标滚轮缩放灵敏度
    wheelSensitivity: 0.1,
    // 禁用节点拖拽
    autoungrabify: true,
    minZoom: 0.5,
    maxZoom: 2,
    userPanningEnabled: true,
    userZoomingEnabled: true
  });

  // 计算当前所有节点的边界，排除背景节点（如果已存在）
  const otherNodes = cy.elements().filter(ele => ele.data('id') !== 'background');
  const bbox = otherNodes.boundingBox();
  const margin = 50; // 给背景增加一些边距
  const bgWidth = bbox.x2 - bbox.x1 + margin * 2;
  const bgHeight = bbox.y2 - bbox.y1 + margin * 2;
  const bgCenterX = (bbox.x1 + bbox.x2) / 2;
  const bgCenterY = (bbox.y1 + bbox.y2) / 2;

  // 添加背景节点
  cy.add({
    group: 'nodes',
    data: { id: 'background' },
    position: { x: bgCenterX, y: bgCenterY },
    selectable: false,
    classes: 'background',
    style: {
      'width': bgWidth,
      'height': bgHeight
      // pointer-events 在 Cytoscape 中可能不起作用
    }
  });

  // 将背景节点放到最底层
  cy.getElementById('background').style('z-index', 0);
  cy.elements().not('#background').style('z-index', 1);

  // 为背景节点绑定事件处理，阻止事件冒泡
  const bgNode = cy.getElementById('background');
  ['tap', 'click', 'cxttap'].forEach(eventType => {
    bgNode.on(eventType, (e) => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  // 绑定返回营地按钮事件
  document.getElementById('return-btn')?.addEventListener('click', () => {
    player.isAtHome = true;
    player.currentNode = null;
    renderMainMenu(player);
  });
}
