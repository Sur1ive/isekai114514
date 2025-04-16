import { NodeType, CampNode, ToOtherRegionNode, NormalMonsterNode } from "./Node";
import { Region } from "./Region";
import northwestMarshForestImage from "../assets/northwestMarshForest.png";
import { forestDungeonRegion } from "./forestDungeon";
import { CreatureType } from "../creatures/creatureConfigs";

export const blackForestDungeonNode: ToOtherRegionNode = {
  name: "地下城入口",
  id: "blackForestDungeon",
  description: "地下城入口",
  type: NodeType.ToOtherRegion,
  position: { x: 250, y: 400 },
  toNodeList: [],
  region: forestDungeonRegion,
};

export const blackForestCenterNode: NormalMonsterNode = {
  name: "黑森林中央",
  id: "blackForestCenter",
  description: "黑森林中央",
  type: NodeType.NormalMonster,
  position: { x: 550, y: 1130 },
  toNodeList: [blackForestDungeonNode],
  monsterList: [
    {
      monster: CreatureType.Horse,
      maxLevel: 40,
      minLevel: 30,
      weight: 1,
    },
  ],
};

export const northwestMarshForestStartNode: CampNode = {
  name: "黑森林入口",
  id: "northwestMarshForestStart",
  description: "还没做地图",
  type: NodeType.Camp,
  position: { x: 880, y: 1300 },
  toNodeList: [blackForestCenterNode],
};

export const northwestMarshForestRegion: Region = {
  name: "池沼森林西北部 黑森林",
  id: "northwestMarshForest",
  description: "池沼森林西北部 黑森林",
  isOpen: true,
  startNode: northwestMarshForestStartNode,
  mapImage: northwestMarshForestImage,
  mapWidth: 1024,
  mapHeight: 1536,
};
