import Vue from "vue";
import Router from "vue-router";
import personal from "./modules/personal";
import departments from "./modules/departments";
import setting from "./modules/setting";
import staff from "./modules/staff";
import permission from "./modules/permission";
import approval from "./modules/approval";
import statistic from "./modules/statistic";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: "/login",
    component: () => import("@/views/login/index"),
    hidden: true,
  },
  {
    path: "/register",
    component: () => import("@/views/register/index"),
    hidden: true,
  },
  {
    path: "/404",
    component: () => import("@/views/404"),
    hidden: true,
  },

  {
    path: "/",
    component: Layout,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: () => import("@/views/dashboard/index"),
        meta: {
          title: "??????",
          icon: "dashboard",
        },
      },
    ],
  },
  {
    path: "/leave",
    component: Layout,
    children: [
      {
        path: "",
        name: "leave",
        component: () => import("@/views/leave/index"),
        meta: {
          title: "????????????",
          icon: "form",
        },
      },
    ],
  },
  {
    path: "/attendance",
    component: Layout,
    children: [
      {
        path: "",
        name: "attendance",
        component: () => import("@/views/attendance/index"),
        meta: {
          title: "????????????",
          icon: "clipboard",
        },
      },
    ],
  },
  {
    path: "/study",
    component: Layout,
    children: [
      {
        path: "",
        name: "study",
        component: () => import("@/views/study/index"),
        meta: {
          title: "????????????",
          icon: "education",
        },
      },
    ],
  },
];
//??????????????????
export const asyncRoutes = [
  staff,
  approval,
  departments,
  personal,
  permission,
  statistic,
  setting,
];
const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: [...constantRoutes],
  });

const router = createRouter();

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // ??????????????????
}

export default router;
