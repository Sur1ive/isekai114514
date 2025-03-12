import { Creature } from "./Creature";
import { CreatureType } from "./creatureConfigs";
import { Monster } from "./Monster";

export class Player extends Creature {
  log: string[] = [];
  tempLog: string[] = [];
  capturedMonster: Monster[] = [];
  isAtHome: boolean = true;

  constructor(name: string, type: CreatureType) {
    // 为了使用class-transformer保存，设定默认值，默认值并没有意义
    name = name || "吴田所";
    type = type || CreatureType.Player;

    super(name, type, 0, 1);
  }

  getHealthDisplay(): string {
    const amount = this.ability.con / 5 * this.maxHealth / 900;
    return `hp: ${this.health.toFixed(2)} / ${this.maxHealth.toFixed(0)} + ${(amount).toFixed(2)}/s`;
  }

  // 更新生命值显示
  updateHealthDisplay(): void {
    const healthElement = document.getElementById('health-display');
    if (healthElement) {
      healthElement.innerText = this.getHealthDisplay();
    }
  }

  autoRecoverHpDot(): void {
    const amount = this.ability.con / 5 * this.maxHealth / 900;
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  levelup() {
    // 升级会回血
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

  addTempLog(log: string): void {
    this.tempLog.push(log);
  }

  getTempLogs(): string {
    return this.tempLog.join("<br>");
  }

  clearTempLogs(): void {
    this.tempLog = [];
  }

  joinTempLogs(): void {
    this.log.push(this.tempLog.join("<br>"));
    this.tempLog = [];
  }
}
