import { defineStore } from "pinia";
import { shallowRef, triggerRef } from "vue";
import { Player } from "@/creatures/Player";
import { loadPlayer, saveGame, exportSave, importSave } from "@/save";
import { setIntervals } from "@/globalIntervals";
import { CreatureType } from "@/creatures/creatureConfigs";

function exposeDebug(getPlayer: () => Player | null) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  Object.defineProperty(w, "大鹅牛逼", {
    get() {
      console.log(
        "%c可用函数：\n" +
        "  _exportSave()\n" +
        "  _importSave(code: string)",
      );
      return getPlayer();
    },
    configurable: true,
  });
  w._exportSave = () => {
    const code = exportSave();
    if (code) {
      try { navigator.clipboard.writeText(code); } catch { /* noop */ }
      console.log("%c存档已导出（已复制到剪贴板）：", "color: #2ecc71; font-weight: bold;");
      console.log(code);
    } else {
      console.log("没有存档可导出");
    }
    return code;
  };
  w._importSave = (code: string) => {
    if (!code) { console.log("用法: _importSave('ISK1:...')"); return; }
    if (importSave(code)) {
      console.log("%c存档导入成功，刷新页面生效", "color: #2ecc71; font-weight: bold;");
      location.reload();
    } else {
      console.error("存档导入失败，请检查备份码是否正确");
    }
  };
}

export const usePlayerStore = defineStore("player", () => {
  const player = shallowRef<Player | null>(null);

  function initPlayer(): Player | null {
    const loaded = loadPlayer();
    if (loaded) {
      player.value = loaded;
      setIntervals(loaded, () => triggerRef(player));
    }
    exposeDebug(() => player.value);
    return loaded;
  }

  function createPlayer(name: string, type: CreatureType): Player {
    const newPlayer = new Player(name, type);
    player.value = newPlayer;
    setIntervals(newPlayer, () => triggerRef(player));
    exposeDebug(() => player.value);
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
