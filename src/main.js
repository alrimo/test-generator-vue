import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";

Vue.use(BootstrapVue);
Vue.config.productionTip = false;

// Using vue instance as global variable
// so we don't have to use Vuex
let globalData = new Vue({
  data: {
    $testData: []
  }  
});

// Global mixin so every component can
// access the global variable
Vue.mixin({
  computed: {
    $testData: {
      get() { return globalData.$data.$testData},
      set(newData) { globalData.$data.$testData = newData}
    },
    $testLength() {
      return globalData.$data.$testData.length;
    }
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
