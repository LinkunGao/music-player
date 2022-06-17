import {
  createRouter,
  createWebHashHistory,
  RouteRecordRaw,
  createWebHistory,
} from "vue-router";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "index",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "index" */ "../pages/index.vue"),
  },
];
const router = createRouter({
  //根目录
  history: createWebHistory("/"),
  routes,
});
// const router = createRouter({
//   history: createWebHashHistory(),
//   routes,
// });

export default router;
