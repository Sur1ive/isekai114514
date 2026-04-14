import { Creature } from "./Creature";
import { CreatureType } from "./creatureConfigs";
import type { Monster } from "./Monster";
import { CurrentMapData } from "../maps/CurrentMapData";

export class Player extends Creature {
  static readonly LIFE_SPRING_MAX = 1000;
  static readonly LIFE_SPRING_REFILL_SECONDS = 7200; // 30分钟回满

  log: string[] = [];
  tempLog: string[] = [];
  capturedMonster: Monster[] = [];
  activePetIndex: number = -1;
  persistedBoss: Record<string, Monster[]> = {};
  isAtHome: boolean = true;
  exp: number = 0;
  isPlayer: boolean = true;
  lifeSpring: number = Player.LIFE_SPRING_MAX;
  currentMapData: CurrentMapData = {
    currentRegionId: "ruin",
    currentNodeId: null,
    goingToNodeId: null,
    visitedNodeIdList: [],
  };
  unlockedRegionIdList: string[] = ["ruin"];
  unlockedNodeIdList: string[] = [];
  resourceNodeLastCollectedTime: Record<string, number> = {};

  constructor(name: string, type: CreatureType) {
    // 为了使用class-transformer保存，设定默认值，默认值并没有意义
    name = name || "吴田所";
    type = type || CreatureType.Player;

    super(name, type, 0, 1);
  }

  /**
   * 根据当前等级计算下一次升级所需经验
   * 1-10级：线性增长，100 + 100 * level
   * 10-20级：线性增长，1000 + (level - 10) * 400
   * 20级以上：指数增长，5000 * 1.2^(level - 20)
   */
  getNextLevelExp(): number {
    if (this.level <= 10) {
      return 100 * this.level;
    } else if (this.level <= 20) {
      return 1000 + (this.level - 10) * 400;
    } else {
      return 5000 * Math.pow(1.2, this.level - 20);
    }
  }

  checkLevelUp(): boolean {
    let requiredExp = this.getNextLevelExp();
    let levelUp = false;
    while (this.exp >= requiredExp) {
      this.exp -= requiredExp;
      this.levelup();
      levelUp = true;
      requiredExp = this.getNextLevelExp();
    }
    return levelUp;
  }

  getExpDisplay(): string {
    const nextExp = this.getNextLevelExp();
    const percent = Math.min(100, (this.exp / nextExp) * 100);
    return `
      <div class="progress" style="height: 2px; position: relative;">
        <div class="progress-bar" role="progressbar" style="width: ${percent}%;"
             aria-valuenow="${this.exp}" aria-valuemin="0" aria-valuemax="${nextExp}">
        </div>
      </div>
    `;
  }

  // 多态：玩家的生命值上限计算公式与怪物不同
  maxHealthFormula(con: number, siz: number): number {
    return con * 15 + siz * 5;
  }

  getHealthDisplay(): string {
    const maxHealth = this.getMaxHealth();
    const percent = Math.min(100, (this.health / maxHealth) * 100);
    return `
    <div class="progress" style="height: 20px; position: relative; background-color: #444;">
      <div class="progress-bar bg-danger" role="progressbar" style="width: ${percent}%;"
           aria-valuenow="${this.health}" aria-valuemin="0" aria-valuemax="${maxHealth}">
      </div>
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        <div style="text-align: center; line-height: 20px; font-size: 0.9rem; font-weight: bold; color: #fff;">
          hp: ${this.health.toFixed(1)} / ${maxHealth.toFixed(1)}
        </div>
      </div>
    </div>
  `;
  }
  // 更新生命值显示
  updateHealthDisplay(): void {
    const healthElement = document.getElementById("health-display");
    if (healthElement) {
      healthElement.innerHTML = this.getHealthDisplay();
    }
  }

  growLifeSpring(elapsedSeconds: number): void {
    if (this.lifeSpring >= Player.LIFE_SPRING_MAX) return;
    const rate = Player.LIFE_SPRING_MAX / Player.LIFE_SPRING_REFILL_SECONDS;
    this.lifeSpring = Math.min(Player.LIFE_SPRING_MAX, this.lifeSpring + rate * elapsedSeconds);
  }

  useLifeSpring(): number {
    const missingHp = this.getMaxHealth() - this.health;
    if (missingHp <= 0 || this.lifeSpring <= 0) return 0;
    const healAmount = Math.min(missingHp, this.lifeSpring);
    this.lifeSpring -= healAmount;
    this.recoverHp(healAmount);
    return healAmount;
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

  clearCurrentMapData() {
    this.currentMapData.currentNodeId = null;
    this.currentMapData.goingToNodeId = null;
    this.currentMapData.visitedNodeIdList = [];
  }

  goToRegion(regionId: string) {
    if (!this.unlockedRegionIdList.includes(regionId)) {
      return;
    }
    this.clearCurrentMapData();
    this.currentMapData.currentRegionId = regionId;
  }

  goToNode(nodeId: string) {
    this.currentMapData.currentNodeId = nodeId;
    if (!this.currentMapData.visitedNodeIdList.includes(nodeId)) {
      this.currentMapData.visitedNodeIdList.push(nodeId);
    }
    this.currentMapData.goingToNodeId = null;
    if (!this.unlockedNodeIdList.includes(nodeId)) {
      this.unlockedNodeIdList.push(nodeId);
    }
  }
}
