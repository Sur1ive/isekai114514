import { Creature } from "./Creature";
import { saveGame } from "../save";
import { CreatureType } from "./creatureConfigs";
import { Monster } from "./Monster";

export class Player extends Creature {
  log: string[] = [];
  tempLog: string[] = [];
  autoRecoverIntervalId: number = -1;
  autoSaveIntervalId: number = -1;
  capturedMonster: Monster[] = [];

  constructor(name: string, type: CreatureType) {
    // 为了使用class-transforme保存，设定默认值，默认值并没有意义
    name = name || "吴田所";
    type = type || CreatureType.Player;

    super(name, type, 0, 1);
  }

  getHealthDisplay(): string {
    return `hp: ${this.health.toFixed(2)} / ${this.maxHealth.toFixed(0)} + ${(1/100 * this.maxHealth).toFixed(2)}/s`;
  }
  // 更新生命值显示
  updateHealthDisplay(): void {
    const healthElement = document.getElementById('health-display');
    if (healthElement) {
      healthElement.innerText = this.getHealthDisplay();
    }
  }

  recoverHealth(amount: number): void {
    this.health = Math.min(this.health + amount, this.maxHealth);
  }

  startAdventure(): void {
    clearInterval(this.autoRecoverIntervalId);
    clearInterval(this.autoSaveIntervalId);
    this.autoRecoverIntervalId = -1;
    this.autoSaveIntervalId = -1;
  }

  backToTown(): void {
    clearInterval(this.autoRecoverIntervalId);
    clearInterval(this.autoSaveIntervalId);
    this.autoRecoverIntervalId = setInterval(() => {
      this.recoverHealth(1/100 * this.maxHealth);
      this.updateHealthDisplay();
    }, 1000);
    this.autoSaveIntervalId = setInterval(() => {
      saveGame(this);
    }, 10000);
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

  getLastNLog(n: number): string {
    return this.log.slice(-n).join("<br>");
  }
}
