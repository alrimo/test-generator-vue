import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import App from "./App.vue";
import router from "./router";
//import papa from "@/assets/js/parseCsv.mjs";
//import Papa from "papaparse";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import csvFile from "./assets/data/c-130.csv";

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

new Vue({
  router,
  mounted() {
  	console.log(csvFile);

 
  },
  render: h => h(App)
}).$mount("#app");


