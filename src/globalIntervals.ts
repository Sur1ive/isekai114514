import { Player } from "./creatures/Player";
import { saveGame } from "./save";

let recoverInterval = -1;
let saveInterval = -1;
let secondStatusInterval = -1;

// player指向的对象发生改变（新建，加载或者remake）时，需要调用此函数
export function setIntervals(player: Player, onTick?: () => void) {
  if (recoverInterval !== -1) {
    clearInterval(recoverInterval);
  }
  if (saveInterval !== -1) {
    clearInterval(saveInterval);
  }
  if (secondStatusInterval !== -1) {
    clearInterval(secondStatusInterval);
  }

  recoverInterval = setInterval(() => {
    if (player.isAtHome) {
      player.autoRecoverHpDot();
      // 宠物回血：每10分钟(600秒)恢复1%最大HP，每秒tick一次
      for (const pet of player.capturedMonster) {
        pet.recoverHp(pet.getMaxHealth() * 0.01 / 600);
        if (pet.isFainted && pet.health >= pet.getMaxHealth() * 0.3) {
          pet.isFainted = false;
        }
      }
      onTick?.();
    }
  }, 1000);

  saveInterval = setInterval(() => {
    if (player.isAtHome) {
      saveGame(player);
    }
  }, 10000);

  // 可能影响性能
  secondStatusInterval = setInterval(() => {
    if (player.isAtHome) {
      player.applySecondStatuses();
      onTick?.();
    }
  }, 1000);
}
