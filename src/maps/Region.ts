import { StartNode } from "./Node";

export interface Region {
  name: string;
  description: string;
  isUnlocked: boolean;
  startNode: StartNode;
}
