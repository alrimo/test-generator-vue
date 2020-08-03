import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/views/Home.vue";
import TestOptions from "@/views/TestOpts.vue";
import Test from "@/views/Test.vue";
import Results from "@/views/TestResults.vue";
import StudentName from "@/views/StudentName.vue";
import TestName from "@/views/TestName.vue";
import CreateTest from "@/views/CreateTest.vue";

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
  },
  {
    path: "/test",
    name: "test",
    component: Test
  },
  {
    path: "/results",
    name: "results",
    component: Results
  },
  {
    path: "/studentName",
    name: "studentName",
    component: StudentName
  },
  {
    path: "/testName",
    name: "testName",
    component: TestName
  },
  {
    path: "/create",
    name: "create",
    component: CreateTest
  }
];

const router = new VueRouter({
  routes
});

export default router;
