<template>
  <div v-if="step === 'choose'">
    <h1>你是谁？</h1>
    <div class="row mb-4">
      <div class="col-6">
        <div class="card bg-primary text-white" style="cursor: pointer" @click="chooseNormal">
          <div class="card-body text-center">
            <h5 class="card-title" style="font-weight: bold">普通人</h5>
            <p class="card-text fst-italic">"我不抽烟，酒仅浅尝辄止。晚上11点睡，保证睡足8小时。睡前喝一杯温牛奶，然后做20分钟的舒缓运动再睡觉，一觉熟睡到天亮，绝不把疲劳和压力留到第二天。医生都说我很正常。"</p>
            <p class="card-text" style="font-weight: bold">(适合不了解野兽先辈的玩家)</p>
          </div>
        </div>
      </div>
      <div class="col-6">
        <div class="card bg-info text-white" style="cursor: pointer" @click="chooseBeast">
          <div class="card-body text-center">
            <h5 class="card-title" style="font-weight: bold">野兽仙贝</h5>
            <p class="card-text fst-italic">"伟大的古希腊哲学家，野兽学派的大先辈田所曾这样警醒后人：逸一时，误一世。(如果一时放纵自己，贪图安逸，就可能误了一生的前程) 现在，你将扮演这位伟大的贤人。好时代，来临罢！"</p>
            <p class="card-text" style="font-weight: bold">(适合拥有野兽之心的玩家)</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else-if="step === 'truck'">
    <h1>躲避大卡车</h1>
    <p>一辆卡车正在向你快速驶来，请选择躲避方向</p>
    <!-- eslint-disable-next-line vue/no-v-html -->
    <div v-html="truckRepresentation"></div>
    <button @click="truckDodge">向左躲避</button>
    <button @click="truckDodge">向右躲避</button>
  </div>

  <div v-else-if="step === 'truck-fail'">
    <h1>躲避大卡车</h1>
    <p>躲避失败，你嗝屁了</p>
    <button @click="step = 'name-input'">继续</button>
  </div>

  <div v-else-if="step === 'beast-win'">
    <h1>野兽宅</h1>
    <p>距离击败远野已不知过去了多久，但一切都还历历在目。</p>
    <p>你感到痛心疾首，为什么事情会变成这样，为什么亲密无间的两人会反目成仇。</p>
    <p>你不再沉沦，高呼道：伊已逝，吾亦逝。忆旧已久罢忆灵！(你逝去了，而我的心也逝去了，空留肉体如行尸走肉般存活。我已经缅怀故人多时，罢了罢了，是时候随你而去了！)</p>
    <p>你闭上了眼睛。</p>
    <button @click="step = 'name-input'">继续</button>
  </div>

  <div v-else-if="step === 'beast-lose'">
    <h1>野兽宅</h1>
    <p>你被远野击败了。</p>
    <p>你感到痛心疾首，为什么事情会变成这样，为什么亲密无间的两人会反目成仇。</p>
    <p>你愤怒地将手指向远野，不甘心地嘶吼：你是一个一个一个一个，呐，哼哼，啊啊啊啊啊啊啊！！！</p>
    <img :src="angryImage" alt="1919" />
    <p>但是意识逐渐模糊，你最终还是倒下了。</p>
    <button @click="step = 'name-input'">继续</button>
  </div>

  <div v-else-if="step === 'name-input'">
    <h1>???</h1>
    <p>请输入你的名字</p>
    <input v-model="playerName" type="text" :placeholder="defaultName" />
    <button @click="confirmName">继续</button>
  </div>

  <div v-else-if="step === 'intro'">
    <h1>???</h1>
    <p>你睁开了眼睛，看到了陌生的天花板。</p>
    <p>这里似乎是什么遗迹？周围的墙上刻着壁画和奇怪的文字，而你正躺在房间正中心的石棺中。你虽然看不懂那些文字，但它们的意思却飞入脑中：</p>
    <p class="fst-italic">
      一百年前，一位叫<span style="font-weight: bold">远野</span>的异界来客统领着野兽大军从极北之地<span style="font-weight: bold">"下北泽"</span>南下，在毁灭了诸多城市后，远野在下北泽建立了魔王城，在那里指挥大军继续南下侵略。
      为了阻止远野，人类根据预言中的指引从异世界召唤了勇者。但被召唤的勇者一直没有苏醒，人类最终难挡野兽大军的攻势，不得不退守大陆的最南端。
    </p>
    <p v-if="playerStore.player?.type === CreatureType.Player114514">
      看起来，你正是故事中被召唤的勇者。而这位远野，正是前世你最爱却又背叛你的那个人！你握紧了拳头，暗暗发誓一定要报仇雪恨！
    </p>
    <p v-else>
      看起来，你正是故事中被召唤的勇者。责任感和使命感让你决定挺身而出，阻止远野的侵略。
    </p>
    <p>你站起身来，准备向北进发。</p>
    <button @click="startGame">继续</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { usePlayerStore } from "@/stores/playerStore";
import { useBattleStore, BattleContext } from "@/stores/battleStore";
import { CreatureType } from "@/creatures/creatureConfigs";
import { Monster } from "@/creatures/Monster";
import { Consumable } from "@/items/Consumable";
import { ConsumableType } from "@/items/consumableConfigs";
import angryImage from "@/assets/1919.gif";

const route = useRoute();
const router = useRouter();
const playerStore = usePlayerStore();
const battleStore = useBattleStore();

type Step = "choose" | "truck" | "truck-fail" | "beast-win" | "beast-lose" | "name-input" | "intro";
const step = ref<Step>("choose");
const truckDirection = ref(0);
const playerName = ref("");
const defaultName = ref("吴田所");
const isBeastPath = ref(false);

const truckRepresentation = computed(() => {
  switch (truckDirection.value) {
    case 0:
      return "<p>车 →→→ 你</p>";
    case 1:
      return "<p>你 ←←← 车</p>";
    case 2:
      return `<p style="text-align: center;">  车</p><p style="text-align: center;">  ↓</p><p style="text-align: center;">  你</p>`;
    case 3:
      return `<p style="text-align: center;">  你</p><p style="text-align: center;">  ↑</p><p style="text-align: center;">  车</p>`;
    default:
      return "";
  }
});

onMounted(() => {
  const afterBattle = route.query.afterBattle as string | undefined;
  if (afterBattle) {
    isBeastPath.value = true;
    defaultName.value = "田所";
    if (afterBattle === "win") {
      step.value = "beast-win";
    } else {
      step.value = "beast-lose";
    }
  }
});

function chooseNormal() {
  isBeastPath.value = false;
  defaultName.value = "吴田所";
  playerStore.createPlayer("吴田所", CreatureType.Player);
  truckDirection.value = Math.floor(Math.random() * 4);
  step.value = "truck";
}

function chooseBeast() {
  isBeastPath.value = true;
  defaultName.value = "田所";
  const player = playerStore.createPlayer("田所", CreatureType.FullPowerPlayer114514);
  const monster = new Monster(CreatureType.Toono, 1, 1, "远野");
  player.isAtHome = false;
  battleStore.startBattle(monster, BattleContext.StartPage);
  router.push({ name: "battle" });
}

function truckDodge() {
  if (Math.random() > 0.3) {
    truckDirection.value = Math.floor(Math.random() * 4);
  } else {
    step.value = "truck-fail";
  }
}

function confirmName() {
  const name = playerName.value.trim();
  if (!name) {
    alert("请输入你的名字！");
    return;
  }

  const player = playerStore.player;
  if (!player) return;

  if (isBeastPath.value && player.type === CreatureType.FullPowerPlayer114514) {
    const pack = player.pack;
    const newPlayer = playerStore.createPlayer(name, CreatureType.Player114514);
    newPlayer.pack = pack;
  } else {
    player.name = name;
  }

  step.value = "intro";
}

function startGame() {
  const player = playerStore.player;
  if (!player) return;

  player.pack.push(new Consumable(ConsumableType.GiftboxAndLetter));
  playerStore.save();
  router.push({ name: "main-menu" });
}
</script>
