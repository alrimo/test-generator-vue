import Vue from "vue";
import { BootstrapVue, BootstrapVueIcons } from "bootstrap-vue";
import App from "./App.vue";
import router from "./router";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import Vuelidate from "vuelidate";

Vue.use(BootstrapVue);
Vue.use(BootstrapVueIcons);
Vue.use(Vuelidate);
Vue.config.productionTip = false;

// Using vue instance as global variable
// so we don't have to use Vuex
let globalData = new Vue({
  data: {
    testData: [],
    questionBank: [],
    testName: "",
    userParams: {
      studentName: "",
      minPassing: 75,
      numRandQuestions: null,
      testId: null
    },
    debug: true
  }
});

// Global mixin so every component can
// access the global variable
Vue.mixin({
  data(){
    return {
      studentName: globalData.$data.userParams.studentName
    } 
  },
  computed: {
    $testData: {
      get() {
        return globalData.$data.testData;
      },
      set(newData) {
        globalData.$data.testData = newData;
      }
    },
    $testLength() {
      return globalData.$data.testData.length;
    },
    $questionBank: {
      get() {
        return globalData.$data.questionBank;
      },
      set(newData) {
        globalData.$data.questionBank = newData;
      }
    },
    $studentName: {
      get() {
        return globalData.$data.userParams.studentName;
      },
      set(newData) {
        globalData.$data.userParams.studentName = newData;
      }
    },
    $minPassing: {
      get() {
        return globalData.$data.userParams.minPassing;
      },
      set(newData) {
        globalData.$data.userParams.minPassing = newData;
      }
    },
    $numRandQuestions: {
      get() {
        return globalData.$data.userParams.numRandQuestions;
      },
      set(newData) {
        globalData.$data.userParams.numRandQuestions = newData;
      }
    },
    $testId: {
      get() {
        return globalData.$data.userParams.testId;
      },
      set(newData) {
        globalData.$data.userParams.testId = newData;
      }
    },
    $testName: {
      get() {
        return globalData.$data.testName;
      },
      set(newData) {
        globalData.$data.testName = newData;
      }
    },
    $debug() {
      return globalData.$data.debug;
    }
  }
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
