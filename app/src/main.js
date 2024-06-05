import { createApp } from 'vue';
import { version } from '../package.json';
import App from './App.vue'
import router from './router'
import './app.css';
import ScrcpyPlusBridge from "./plugins/scrcpy-plus-bridge.js";

const app = createApp(App);
app.use(router);
app.use(ScrcpyPlusBridge);
app.mount('#app');
app.config.globalProperties.$version = version;
