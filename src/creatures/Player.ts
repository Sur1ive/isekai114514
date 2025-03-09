import { Creature } from "./Creature";
import { saveGame } from "../save";

export class Player extends Creature {
  log: string[];
  tempLog: string[];
  autoRecoverIntervalId: number;
  autoSaveIntervalId: number;

  capturedMonster: {name: string, level: number}[];

  constructor(name: string, type: string) {
    super(name, type, 0, 1);
    this.log = [];
    this.tempLog = [];
    this.autoRecoverIntervalId = -1;
    this.autoSaveIntervalId = -1;
    this.capturedMonster = [];
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
