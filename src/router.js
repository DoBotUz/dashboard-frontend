/*=========================================================================================
  File Name: router.js
  Description: Routes for vue-router. Lazy loading is enabled.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


import Vue from 'vue'
import Router from 'vue-router'
import store from './store/store'

Vue.use(Router)

const defaultRole = 'editor';

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
                  rule: defaultRole,
                },
              },
              {
                path: '/settings',
                name: 'settings',
                component: () => import('./views/profile-settings/ProfileSettings.vue'),
                meta: {
                  authRequired: true,
                  rule: defaultRole,
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
          redirect: {
            name: 'DashboardMenu',
          },
          children: [
            {
              path: 'menu/:parent?',
              component: () => import('./views/dashboard/menu/Menu.vue'),
              name: 'DashboardMenu',
              meta: {
                rule: defaultRole,
                pageTitle: 'Меню',
              },
              props: (route) => ({
                parent: Number(route.params.parent) || null
              })
            },
            {
              path: 'bot-users',
              component: () => import('./views/dashboard/bot-users/BotUsers.vue'),
              name: 'DashBoardBotUsers',
              meta: {
                rule: defaultRole,
                pageTitle: 'Пользователи',
              },
            },
            {
              path: 'branches',
              component: () => import('./views/dashboard/branches/Branches.vue'),
              name: 'DashboardBranches',
              meta: {
                rule: defaultRole,
                pageTitle: 'Филиалы',
              },
            },
            {
              path: 'settings',
              component: () => import('./views/dashboard/settings/Settings.vue'),
              name: 'DashboardSettings',
              meta: {
                rule: defaultRole,
                pageTitle: 'Настройки',
              },
            },
          ],
          meta: {
            authRequired: true,
            rule: defaultRole,
          },
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
  if (!to.meta.authRequired || (to.meta.authRequired && store.getters.isAuthenticated)) {
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
