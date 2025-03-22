import { Player } from "../creatures/Player";
import { getAppElement } from "./utils";
import { Node } from "../maps/Node";
import { Region } from "../maps/Region";

import cytoscape from 'cytoscape';

export function renderMapPage(player: Player, region: Region): void {
  const appElement = getAppElement();

  appElement.innerHTML = `<div id="cy" style="width: 100%; height: 600px;"></div>`;

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
    // 禁用整体平移
    // userPanningEnabled: false,
    // 禁用节点拖拽
    autoungrabify: true
  });

  // 将玩家当前节点置于画布的指定位置（此处示例为视图中心）
  const playerNodeId = region.startNode.name;
  const playerNode = cy.getElementById(playerNodeId);
  if (playerNode) {
    cy.center(playerNode);
    // 如果需要让玩家节点处于画布的其他位置（例如：右下角），可以通过调整 pan 来实现：
    // const desiredPosition = { x: 500, y: 400 }; // 画布内的固定坐标
    // const nodePosition = playerNode.position();
    // cy.pan({
    //   x: nodePosition.x - desiredPosition.x,
    //   y: nodePosition.y - desiredPosition.y
    // });
  }
}
