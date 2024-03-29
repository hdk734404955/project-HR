import Layout from "@/layout";

export default {
  path: "/statistic",
  // name: 'setting',
  component: Layout,
  //   // 配置二级路的路由表
  children: [
    {
      path: "",
      name: "statistic", // 这里当二级路由的path什么都不写的时候 表示该路由为当前二级路由的默认路由
      component: () => import("@/views/statistic/index"),
      // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
      meta: {
        title: "数据日志", // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
        icon: "chart",
      },
    },
  ],
};
