// FILE: main.js
import axios from "axios";
import VueAxios from "vue-axios";
import { createApp } from "vue";
import { createPinia } from "pinia"; //pinia
import { Quasar, Notify, Dialog, BottomSheet, AddressbarColor } from "quasar";
import quasarLang from "quasar/lang/zh-CN";
import router from "./router";
// Import icon libraries

import "@quasar/extras/material-icons/material-icons.css";

// A few examples for animations from Animate.css:
// import @quasar/extras/animate/fadeIn.css
// import @quasar/extras/animate/fadeOut.css

// Import Quasar css
import "quasar/src/css/index.sass";

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "./App.vue";

const myApp = createApp(App);

myApp.use(Quasar, {
  plugins: { Notify, Dialog, BottomSheet, AddressbarColor }, // import Quasar plugins and add here
  lang: quasarLang,
  config: {
    // brand: {
    //   // primary: '#e46262',
    //   // ... or all other brand colors
    // },
    notify: {}, // default set of options for Notify Quasar plugin
    // loading: {...}, // default set of options for Loading Quasar plugin
    // loadingBar: { ... }, // settings for LoadingBar Quasar plugin
    // ..and many more (check Installation card on each Quasar component/directive/plugin)
  },
});
//axios 提供http请求，暂未通过inject用到
myApp.use(VueAxios, axios);
myApp.provide("axios", myApp.config.globalProperties.axios); // provide 'axios'
myApp.use(createPinia()); //暂时没用
myApp.use(router); //使用路由
// Assumes you have a <div id="app"></div> in your index.html
myApp.mount("#app");
