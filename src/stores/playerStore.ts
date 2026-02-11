import { defineStore } from "pinia";
import { shallowRef, triggerRef } from "vue";
import { Player } from "@/creatures/Player";
import { loadPlayer, saveGame } from "@/save";
import { setIntervals } from "@/globalIntervals";
import { CreatureType } from "@/creatures/creatureConfigs";

export const usePlayerStore = defineStore("player", () => {
  const player = shallowRef<Player | null>(null);

  function initPlayer(): Player | null {
    const loaded = loadPlayer();
    if (loaded) {
      player.value = loaded;
      setIntervals(loaded, () => triggerRef(player));
    }
    return loaded;
  }

  function createPlayer(name: string, type: CreatureType): Player {
    const newPlayer = new Player(name, type);
    player.value = newPlayer;
    setIntervals(newPlayer, () => triggerRef(player));
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
