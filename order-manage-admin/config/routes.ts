export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
    ],
  },
  // {
  //   path: '/welcome',
  //   name: 'welcome',
  //   icon: 'team',
  //   component: './Welcome',
  // },
  {
    path: '/order',
    name: '订单管理',
    icon: 'Profile',
    access: 'canAdmin',
    component: './order',
  },
  {
    access: 'canAdmin',
    path: '/order/:id',
    name: '订单详情',
    component: './order/detail',
    hideInMenu: true,
  },
  {
    name: '产品管理',
    icon: 'Shop',
    path: '/products',
    access: 'canAdmin',
    component: './ProductList',
  },
  {
    name: '用户管理',
    icon: 'user',
    path: '/users',
    access: 'canAdmin',
    component: './UserList',
  },
  {
    name: '客户管理',
    icon: 'team',
    path: '/customers',
    access: 'canAdmin',
    component: './CustomerList',
  },
  {
    path: '/',
    redirect: '/order',
  },
  {
    component: './404',
  },
];
