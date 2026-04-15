import { Player } from "./creatures/Player";
import { saveGame } from "./save";

let tickInterval = -1;
let saveInterval = -1;
let secondStatusInterval = -1;
let lastTickTime = 0;
let visibilityHandler: (() => void) | null = null;

function doTick(player: Player, onTick?: () => void) {
  const now = Date.now();
  const elapsed = (now - lastTickTime) / 1000;
  lastTickTime = now;

  if (elapsed <= 0) return;

  // 泉水始终增长，不受 isAtHome 限制
  player.growLifeSpring(elapsed);

  if (player.isAtHome) {
    // 宠物回血：每6秒恢复1%最大HP
    for (const pet of player.capturedMonster) {
      pet.recoverHp(pet.getMaxHealth() * 0.01 * (elapsed / 6));
      if (pet.isFainted && pet.health >= pet.getMaxHealth() * 0.3) {
        pet.isFainted = false;
      }
    }
    onTick?.();
  }
}

// player指向的对象发生改变（新建，加载或者remake）时，需要调用此函数
export function setIntervals(player: Player, onTick?: () => void) {
  if (tickInterval !== -1) {
    clearInterval(tickInterval);
  }
  if (saveInterval !== -1) {
    clearInterval(saveInterval);
  }
  if (secondStatusInterval !== -1) {
    clearInterval(secondStatusInterval);
  }
  if (visibilityHandler) {
    document.removeEventListener("visibilitychange", visibilityHandler);
  }

  lastTickTime = Date.now();

  tickInterval = setInterval(() => {
    doTick(player, onTick);
  }, 1000);

  saveInterval = setInterval(() => {
    if (player.isAtHome) {
      saveGame(player);
    }
  }, 10000);

  secondStatusInterval = setInterval(() => {
    if (player.isAtHome) {
      player.applySecondStatuses();
      onTick?.();
    }
  }, 1000);

  visibilityHandler = () => {
    if (document.visibilityState === "visible") {
      doTick(player, onTick);
      if (player.isAtHome) {
        saveGame(player);
      }
    }
  };
  document.addEventListener("visibilitychange", visibilityHandler);
}
