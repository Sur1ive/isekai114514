import { Creature } from "./Creature";
import { saveGame } from "../save";

export class Player extends Creature {
  maxHealth: number;
  log: string[];
  autoRecoverIntervalId: number;
  autoSaveIntervalId: number;

  constructor(name: string) {
    super(name, "player", 0, 1);
    this.maxHealth = this.health;
    this.log = [];
    this.autoRecoverIntervalId = -1;
    this.autoSaveIntervalId = -1;
  }

  // 更新生命值显示
  updateHealthDisplay(player: Player): void {
    const healthElement = document.getElementById('health-display');
    if (healthElement) {
      healthElement.innerText = `hp: ${player.health.toFixed(2)} / ${player.maxHealth.toFixed(0)} + ${(1/1000 * player.maxHealth).toFixed(2)}/s`;
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

  getLastNLog(n: number): string {
    return this.log.slice(-n).join("<br>");
  }
}
