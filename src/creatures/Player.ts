import { Creature } from "./Creature";
import { Log } from "../log";

export class Player extends Creature {
  log: Log;

  constructor(name: string) {
    super(name, "player", 0, 1);
    this.log = new Log();
  }

  levelup() {
    this.level++;
  }
}
