import "reflect-metadata";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./styles/custom.scss";
import "./styles/custom.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import App from "./App.vue";
import router from "./router";
import { initializeAllMapData } from "./maps/Region";

initializeAllMapData();

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
