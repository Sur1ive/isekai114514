import { Creature } from "./Creature";
import { saveGame } from "../save";

export class Player extends Creature {
  log: string[];
  tempLog: string[];
  autoRecoverIntervalId: number;
  autoSaveIntervalId: number;

  capturedMonster: {name: string, level: number}[];

  constructor(name: string) {
    super(name, "player", 0, 1);
    this.log = [];
    this.tempLog = [];
    this.autoRecoverIntervalId = -1;
    this.autoSaveIntervalId = -1;
    this.capturedMonster = [];
  }

  // 更新生命值显示
  updateHealthDisplay(player: Player): void {
    const healthElement = document.getElementById('health-display');
    if (healthElement) {
      healthElement.innerText = `hp: ${player.health.toFixed(2)} / ${player.maxHealth.toFixed(0)} + ${(1/100 * player.maxHealth).toFixed(2)}/s`;
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
      this.updateHealthDisplay(this);
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
