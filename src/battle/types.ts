export enum BattleResult {
  Win = "Win",
  Lose = "Lose",
  Withdraw = "Withdraw",
  EnemyEscape = "EnemyEscape",
}

export enum PointComparisonResult {
  PlayerWin = "PlayerWin",
  EnemyWin = "EnemyWin",
  Draw = "Draw",
}

/** 一个回合的结构化战斗记录 */
export interface BattleRoundLog {
  roundNumber: number;
  playerActionName: string;
  enemyActionName: string;
  rolls: DiceRollData[];
}

/** 每次 hit 拼点的数据，用于掷骰动画 */
export interface DiceRollData {
  playerName: string;
  enemyName: string;
  playerHitIcon: string;
  enemyHitIcon: string;
  /** 玩家掷出的点数，-1 表示该 hit 无需掷骰 (如 None) */
  playerPower: number;
  /** 敌人掷出的点数，-1 表示该 hit 无需掷骰 */
  enemyPower: number;
  result: PointComparisonResult;
  /** 是否为"无事发生"（双方都没有有效交互） */
  isNothing: boolean;
  /** 拼点结果的叙事文字（来自 messageGenerator） */
  resultMessage: string;
  /** 造成的伤害值（0 表示无伤害） */
  damage: number;
  /** 谁受到了伤害 */
  damageTarget: "player" | "enemy" | "none";
  /** 本次 hit 结算后玩家的 HP */
  playerHpAfter: number;
  /** 本次 hit 结算后敌人的 HP */
  enemyHpAfter: number;
}
