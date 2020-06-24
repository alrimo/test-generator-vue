import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import TestOptions from "@/views/TestOpts.vue";


Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home
  },
  {
  	// question mark makes param optional
  	path: "/options/:testId?",   
  	name: "TestOptions",
  	component: TestOptions
  }
];

const router = new VueRouter({
  routes
});

export default router;
