import { Creature } from "./Creature";

export class Player extends Creature {
  log: string[];

  constructor(name: string) {
    super(name, "player", 0, 1);
    this.log = [];
  }

  levelup() {
    this.level++;
  }

  addLog(log: string): void {
    this.log.push(log);
  }

  getLogs(): string {
    return this.log.join("<br>");
  }

  getLastNLog(n: number): string {
    return this.log.slice(-n).join("<br>");
  }
}
