import { createRouter, createWebHashHistory } from "vue-router";
import { usePlayerStore } from "@/stores/playerStore";
import { useBattleStore } from "@/stores/battleStore";

const router = createRouter({
  history: createWebHashHistory("/isekai114514/"),
  routes: [
    {
      path: "/",
      name: "start",
      component: () => import("@/views/StartPage.vue"),
    },
    {
      path: "/main-menu",
      name: "main-menu",
      component: () => import("@/views/MainMenu.vue"),
    },
    {
      path: "/map",
      name: "map",
      component: () => import("@/views/MapPage.vue"),
    },
    {
      path: "/map-list",
      name: "map-list",
      component: () => import("@/views/MapListPage.vue"),
    },
    {
      path: "/battle",
      name: "battle",
      component: () => import("@/views/BattlePage.vue"),
    },
    {
      path: "/status",
      name: "status",
      component: () => import("@/views/StatusPage.vue"),
    },
  ],
});

let initialized = false;

router.beforeEach((to) => {
  if (!initialized) {
    initialized = true;
    const playerStore = usePlayerStore();
    const player = playerStore.initPlayer();

    if (!player) {
      if (to.name !== "start") {
        return { name: "start" };
      }
    } else {
      if (to.name === "start" && !to.query.afterBattle) {
        if (player.currentMapData.currentNodeId) {
          return { name: "map" };
        }
        return { name: "main-menu" };
      }
    }
  }

  if (to.name === "battle") {
    const battleStore = useBattleStore();
    if (!battleStore.enemy) {
      const playerStore = usePlayerStore();
      if (playerStore.player) {
        return { name: "main-menu" };
      }
      return { name: "start" };
    }
  }
});

export default router;
