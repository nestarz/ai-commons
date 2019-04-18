export default [
  {
    name: "conditions",
    path: "/conditions",
    component: () => import(/* webpackChunkName: "component--conditions" */ "/Users/elias/projects/ai-commons/src/pages/Conditions.vue"),
    meta: { isStatic: true }
  },
  {
    name: "about",
    path: "/about",
    component: () => import(/* webpackChunkName: "component--about" */ "/Users/elias/projects/ai-commons/src/pages/About.vue"),
    meta: { isStatic: true }
  },
  {
    name: "home",
    path: "/",
    component: () => import(/* webpackChunkName: "component--home" */ "/Users/elias/projects/ai-commons/src/pages/Index.vue"),
    meta: { isStatic: true }
  },
  {
    name: "disclamer",
    path: "/disclamer",
    component: () => import(/* webpackChunkName: "component--disclamer" */ "/Users/elias/projects/ai-commons/src/pages/Disclamer.vue"),
    meta: { isStatic: true }
  },
  {
    name: "404",
    path: "/404",
    component: () => import(/* webpackChunkName: "component--404" */ "/Users/elias/projects/ai-commons/node_modules/gridsome/app/pages/404.vue"),
    meta: { isStatic: true, isIndex: false }
  },
  {
    name: "*",
    path: "*",
    component: () => import(/* webpackChunkName: "component--404" */ "/Users/elias/projects/ai-commons/node_modules/gridsome/app/pages/404.vue"),
    meta: { isStatic: true, isIndex: false }
  }
]

