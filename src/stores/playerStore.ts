import { defineStore } from "pinia";
import { shallowRef, triggerRef } from "vue";
import { Player } from "@/creatures/Player";
import { loadPlayer, saveGame } from "@/save";
import { setIntervals } from "@/globalIntervals";
import { CreatureType } from "@/creatures/creatureConfigs";

function exposeDebug(getPlayer: () => Player | null, triggerFn: () => void, saveFn: () => void) {
  const w = window as any;
  Object.defineProperty(w, "大鹅牛逼", {
    get: getPlayer,
    configurable: true,
  });
  w._save = saveFn;
  w._triggerUpdate = triggerFn;
}

export const usePlayerStore = defineStore("player", () => {
  const player = shallowRef<Player | null>(null);

  function initPlayer(): Player | null {
    const loaded = loadPlayer();
    if (loaded) {
      player.value = loaded;
      setIntervals(loaded, () => triggerRef(player));
    }
    exposeDebug(() => player.value, () => triggerRef(player), () => save());
    return loaded;
  }

  function createPlayer(name: string, type: CreatureType): Player {
    const newPlayer = new Player(name, type);
    player.value = newPlayer;
    setIntervals(newPlayer, () => triggerRef(player));
    exposeDebug(() => player.value, () => triggerRef(player), () => save());
    return newPlayer;
  }

  function setPlayerValue(p: Player) {
    player.value = p;
    setIntervals(p, () => triggerRef(player));
  }

  function save() {
    if (player.value) {
      saveGame(player.value);
    }
  }

  function reset() {
    localStorage.clear();
    player.value = null;
  }

  function triggerUpdate() {
    triggerRef(player);
  }

  function updateTitle() {
    if (player.value) {
      const titleElement = document.getElementById("game-title");
      if (titleElement) {
        if (
          player.value.type === CreatureType.Player ||
          player.value.type === CreatureType.Player114514
        ) {
          titleElement.textContent = "异世界" + player.value.name;
        }
      }
    }
  }

  return {
    player,
    initPlayer,
    createPlayer,
    setPlayerValue,
    save,
    reset,
    triggerUpdate,
    updateTitle,
  };
});
