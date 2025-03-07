import { Creature } from "./Creature";
import { CreatureType } from "./CreatureType";

export class Player extends Creature {
  constructor(name: string) {
    super(name, CreatureType.Player, 0, 1);
  }

  levelup() {
    this.level++;
  }
}
