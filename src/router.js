/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue';
import Router from 'vue-router';
import store from './store/store';


Vue.use(Router)

const defaultRole = 'isPublic';

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    scrollBehavior () {
        return { x: 0, y: 0 }
    },
    routes: [
        {
    // =============================================================================
    // MAIN LAYOUT ROUTES
    // =============================================================================
            path: '',
            component: () => import('@/layouts/main/Main.vue'),
            children: [
              {
                path: '/',
                name: 'organizations',
                component: () => import('./views/organizations/Organizations.vue'),
                meta: {
                  authRequired: true,
                  rule: 'isAdmin',
                },
              },
              {
                path: '/support',
                name: 'support',
                component: () => import('./views/support/Support.vue'),
                meta: {
                  authRequired: true,
                  rule: 'isAdmin',
                },
              },
              {
                path: '/profile',
                name: 'profile',
                component: () => import('./views/profile/Profile.vue'),
                meta: {
                  authRequired: true,
                  rule: 'isAdmin',
                },
              },
              {
                path: '/settings',
                name: 'settings',
                component: () => import('./views/settings/Settings.vue'),
                meta: {
                  authRequired: true,
                  rule: 'isAdmin',
                },
              },
            ],
        },
      // ==================================================================
      // SHOP DASHBOARD ROUTES
      // ===================================================================
        {
          path: '/shop/:id/',
          component: () => import('@/layouts/dashboard/Dashboard.vue'),
          props: (route) => ({
            id: Number(route.params.id)
          }),
          name: 'ShopHome',
          redirect: {
            name: 'DashboardAnalytics',
          },
          meta: {
            authRequired: true,
            rule: 'isManager',
          },
          children: [
            {
              path: 'profile',
              name: 'ProfileInShop',
              component: () => import('./views/profile/Profile.vue'),
              meta: {
                authRequired: true,
                rule: 'isOperator',
              },
            },
            {
              path: 'analytics',
              name: 'DashboardAnalytics',
              component: () => import('./views/dashboard/analytics/Analytics.vue'),
              meta: {
                breadcrumb: [
                  { title: 'Заведения', url: '/', slug: 'home' },
                  { title: '', slug: 'organization-name', active: true },
                ],
                authRequired: true,
                rule: 'isManager',
              },
            },
            {
              path: 'menu/:parent?',
              component: () => import('./views/dashboard/menu/Menu.vue'),
              name: 'DashboardMenu',
              meta: {
                breadcrumb: [
                  { title: 'Заведения', url: '/', slug: 'home' },
                  { title: '', slug: 'organization-name', active: true },
                ],
                parent: 'ShopHome',
                rule: 'isManager',
                pageTitle: 'Категории',
              },
              props: (route) => ({
                parent: Number(route.params.parent) || null
              })
            },
            {
              path: 'products',
              component: () => import('./views/dashboard/menu/Products.vue'),
              name: 'DashboardProducts',
              meta: {
                breadcrumb: [
                  { title: 'Заведения', url: '/', slug: 'home' },
                  { title: '', slug: 'organization-name', active: true },
                ],
                rule: 'isManager',
                pageTitle: 'Продукты',
              },
            },
            {
              path: 'bot-users',
              component: () => import('./views/dashboard/bot-users/BotUsers.vue'),
              name: 'DashBoardBotUsers',
              meta: {
                breadcrumb: [
                  { title: 'Заведения', url: '/', slug: 'home' },
                  { title: '', slug: 'organization-name', active: true },
                ],
                rule: 'isOperator',
                pageTitle: 'Подписчики',
              },
            },
            {
              path: 'mailing',
              redirect: 'mailing/drafts',
              name: 'DashBoardMailing',
              meta: {
                rule: 'isManager',
              },
            },
            {
              path: 'mailing/:filter',
              component: () => import('./views/dashboard/mailing/Mailing.vue'),
              name: 'DashBoardMailingList',
              meta: {
                breadcrumb: [
                  { title: 'Заведения', url: '/', slug: 'home' },
                  { title: '', slug: 'organization-name', active: true },
                ],
                parent: 'DashBoardMailing',
                no_scroll: true,
                rule: 'isManager',
                pageTitle: 'Рассылки',
              },
            },
            {
              path: 'branches',
              component: () => import('./views/dashboard/branches/Branches.vue'),
              name: 'DashboardBranches',
              meta: {
                breadcrumb: [
                  { title: 'Заведения', url: '/', slug: 'home' },
                  { title: '', slug: 'organization-name', active: true },
                ],
                rule: 'isManager',
                pageTitle: 'Филиалы',
              },
            },
            {
              path: 'settings',
              component: () => import('./views/dashboard/settings/Settings.vue'),
              name: 'DashboardSettings',
              meta: {
                breadcrumb: [
                  { title: 'Заведения', url: '/', slug: 'home' },
                  { title: '', slug: 'organization-name', active: true },
                ],
                rule: 'isOwner',
                pageTitle: 'Настройки',
              },
            },
            {
              path: 'orders',
              component: () => import('./views/dashboard/orders/Orders.vue'),
              name: 'DashboardOrders',
              meta: {
                breadcrumb: [
                  { title: 'Заведения', url: '/', slug: 'home' },
                  { title: '', slug: 'organization-name', active: true },
                ],
                rule: 'isOperator',
                pageTitle: 'Заказы'
              }
            },
            {
              path: 'order/:order_id',
              component: () => import('./views/dashboard/orders/Order.vue'),
              name: 'DashboardOrder',
              meta: {
                breadcrumb: [
                  { title: 'Заведения', url: '/', slug: 'home' },
                  { title: '', slug: 'organization-name', active: true },
                ],
                rule: 'isOperator',
              },
              props: (route) => ({
                order_id: Number(route.params.order_id) || null
              }),
            },
            {
              path: 'feedbacks',
              component: () => import('./views/dashboard/feedbacks/Feedbacks.vue'),
              name: 'DashboardFeedbacks',
              meta: {
                breadcrumb: [
                  { title: 'Заведения', url: '/', slug: 'home' },
                  { title: '', slug: 'organization-name', active: true },
                ],
                rule: 'isOperator',
                pageTitle: 'Отзывы'
              },
            },
            {
              path: 'chat',
              component: () => import('./views/dashboard/chat/Chat.vue'),
              name: 'DashboardChat',
              meta: {
                rule: 'isOperator',
              },
              pageTitle: 'Чат'
            },
            {
              path: 'employees',
              component: () => import('./views/dashboard/employees/Employees.vue'),
              name: 'DashboardEmployees',
              meta: {
                rule: defaultRole,
              },
              pageTitle: 'Сотрудники'
            },

          ],

        },
    // =============================================================================
    // FULL PAGE LAYOUTS
    // =============================================================================
        {
            path: '',
            component: () => import('@/layouts/full-page/FullPage.vue'),
            children: [
              {
                path: '/pages/login',
                name: 'page-login',
                component: () => import('@/views/pages/Login.vue'),
                meta: {
                  rule: defaultRole,
                },
              },
              {
                path: '/pages/error-404',
                name: 'page-error-404',
                component: () => import('@/views/pages/Error404.vue'),
                meta: {
                  rule: defaultRole,
                },
              },
              {
                path: '/pages/error-500',
                name: 'page-error-500',
                component: () => import('@/views/pages/Error500.vue'),
                meta: {
                  rule: defaultRole,
                },
              },
              {
                path: '/pages/complete-registration',
                name: 'page-complete-registration',
                component: () => import('@/views/pages/CompleteRegistration.vue'),
                meta: {
                  rule: defaultRole,
                },
              },
            ]
        },
        // Redirect to 404 page, if no match found
        {
            path: '*',
            redirect: '/pages/error-404'
        }
    ],
})

router.beforeEach((to, from, next) => {


  if(store.getters.isAuthenticated && (to.name === 'page-login' || to.name === 'page-complete-registration')){
    next('/');
  }

  if(to.path === '/') {
    if (store.getters.isAuthenticated) {
      const profile = store.getters.profile ? store.getters.profile : {};
      if (profile.role === 'operator') {
        return next({
          name: 'DashboardOrders',
          params: {
            id: profile.organizationId
          }
        });
      } else if(profile.role === 'manager' || profile.role === 'owner') {
        return next({
          name: 'DashboardAnalytics',
          params: {
            id: profile.organizationId
          }
        });
      }
    } else {
      return next('/pages/login');
    }
  }

  if (!to.meta.authRequired || (to.meta.authRequired && store.getters.isAuthenticated)) {
    if(store.getters.isAuthenticated){
      const profile = store.getters.profile ? store.getters.profile : {};
      if(to.name === 'DashboardMenu' && profile.role === 'operator'){
        return next({
          name: 'DashboardOrders',
          params: to.params
        });
      }
    }
    return next();
  }
  next('/pages/login');
});

router.afterEach(() => {
  // Remove initial loading
  const appLoading = document.getElementById('loading-bg')
    if (appLoading) {
        appLoading.style.display = "none";
    }
})

export default router
