export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', component: './User/Login' },
    ],
  },
  // app
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    authority: ['admin', 'user'],
    routes: [
      // home
      { path: '/', name: 'home', redirect: '/assets/dashboard' },
      // // auth
      // {
      //   path: '/auth',
      //   name: 'auth',
      //   component: '../layouts/AuthLayout',
      //   routes: [
      //     { path: '/auth', redirect: '/auth/login' },
      //     { path: '/auth/login', name: 'login', component: './Auth/Login/Login' },
      //   ],
      // },
      // assets
      {
        path: '/assets',
        name: 'assets',
        icon: 'money-collect',
        routes: [
          { path: '/assets', redirect: '/assets/dashboard' },
          {
            path: '/assets/dashboard',
            name: 'dashboard',
            component: './Assets/Dashboard/Dashboard'
          },
          {
            path: '/assets/daily_statistics',
            name: 'daily-statistics',
            component: './Assets/DailyStatistics/DailyStatistics',
          },
          {
            path: '/assets/repayment-amounts',
            name: 'repayment-amounts',
            component: './Assets/RepaymentAmounts/RepaymentAmounts',
          },
          {
            path: '/assets/repayments',
            name: 'repayments',
            component: './Assets/Repayments/Repayments',
          },
          {
            path: '/assets/bills',
            name: 'bills',
            component: './Assets/Bills/Bills',
          },
        ]
      },
      // rbac
      {
        path: '/rbac',
        name: 'rbac',
        icon: 'team',
        routes: [
          { path: '/rbac', redirect: '/rbac/users' },
          {
            path: '/rbac/users',
            name: 'users',
            component: './RBAC/Users/Users'
          },
        ]
      },
      // exception
      {
        path: '/exception',
        name: 'exception',
        routes: [
          { path: '/exception', redirect: '/exception/404' },
          {
            path: '/exception/403',
            name: '403',
            component: './Exception/403'
          },
          {
            path: '/exception/404',
            name: '404',
            component: './Exception/404'
          },
          {
            path: '/exception/500',
            name: '500',
            component: './Exception/500'
          },
        ]
      },
      // 404
      {
        component: '404',
      },
    ],
  },
];
