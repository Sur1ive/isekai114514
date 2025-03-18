import { Creature } from "./Creature";
import { CreatureType } from "./creatureConfigs";
import type { Monster } from "./Monster";

export class Player extends Creature {
  log: string[] = [];
  tempLog: string[] = [];
  capturedMonster: Monster[] = [];
  isAtHome: boolean = true;
  exp: number = 0;
  isPlayer: boolean = true;

  constructor(name: string, type: CreatureType) {
    // 为了使用class-transformer保存，设定默认值，默认值并没有意义
    name = name || "吴田所";
    type = type || CreatureType.Player;

    super(name, type, 0, 1);
  }

  /**
   * 根据当前等级计算下一次升级所需经验
   * 1-10级：固定经验（100）
   * 10-20级：线性增长，100 + (level - 10) * 40
   * 20级以上：指数增长，500 * 1.2^(level - 20)
   */
  getNextLevelExp(): number {
    if (this.level <= 10) {
      return 100;
    } else if (this.level <= 20) {
      return 100 + (this.level - 10) * 40;
    } else {
      return 500 * Math.pow(1.2, this.level - 20);
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

  getHealthDisplay(): string {
    const percent = Math.min(100, (this.health / this.maxHealth) * 100);
    const regen = ((this.ability.con / 5) * this.maxHealth) / 900;
    return `
    <div class="progress" style="height: 20px; position: relative; background-color: #444;">
      <div class="progress-bar progress-bar-striped progress-bar-animated bg-danger" role="progressbar" style="width: ${percent}%;"
           aria-valuenow="${this.health}" aria-valuemin="0" aria-valuemax="${this.maxHealth}">
      </div>
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
        <div style="text-align: center; line-height: 20px; font-size: 0.9rem; font-weight: bold; color: #fff;">
          hp: ${this.health.toFixed(1)} / ${this.maxHealth.toFixed(1)}
        </div>
        <div style="position: absolute; top: 0; right: 5px; height: 100%; display: flex; align-items: center; font-size: 0.9rem; font-weight: bold; color: #fff;">
          +${regen.toFixed(2)}
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

  autoRecoverHpDot(num: number = 1): void {
    const amount = ((this.ability.con / 5) * this.maxHealth) / 900 * num;
    this.recoverHp(amount);
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
