/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/


export default [
  {
    url: {
      name: 'DashboardMenu'
    },
    name: "Категории",
    slug: "page2",
    icon: "PackageIcon",
  },
  {
    url: {
      name: 'DashboardProducts'
    },
    name: "Продукты",
    slug: "page2",
    icon: "TagIcon",
  },
  {
    url: {
      name: 'DashboardOrders',
    },
    name: "Заказы",
    slug: "page2",
    icon: "ShoppingBagIcon",
  },
  {
    url: "/page2",
    name: "Промокоды",
    slug: "page2",
    icon: "FileIcon",
  },
  {
    // url: null,
    header: 'Клиенты',
    items: [
      {
        url: {
          name: 'DashboardFeedbacks'
        },
        name: "Отзывы",
        tagColor: 'primary',
        tagGetter: 'feedbackNotificationsCount',
        slug: "page2",
        icon: "SmileIcon",
      },
      {
        url: "/page2",
        name: "Чат",
        slug: "page2",
        icon: "MessageSquareIcon",
        tagColor: 'warning',
        tag: '2',
      },
      {
        url: {
          name: 'DashBoardBotUsers'
        },
        name: "Подписчики",
        slug: "bot-users",
        icon: "UserIcon",
      },
      {
        url: {
          name: 'DashBoardMassNotifs'
        },
        name: "Рассылки",
        slug: "mass-notifs",
        icon: "SendIcon",
      },
    ]
  },
  {
    header: 'Настройки',
    items: [
      {
        url: {
          name: 'DashboardBranches'
        },
        name: "Филиалы",
        slug: "page2",
        icon: "HomeIcon",
      },
      // {
      //   url: {
      //     name: 'DashboardDelivery',
      //   },
      //   name: "Доставка",
      //   slug: "page2",
      //   icon: "TruckIcon",
      // },
      // {
      //   url: {
      //     name: 'DashboardPaymentTypes',
      //   },
      //   name: "Способы оплаты",
      //   slug: "page2",
      //   icon: "CreditCardIcon",
      // },
      {
        url: {
          name: 'DashboardSettings',
        },
        name: "Настройки",
        slug: "home",
        icon: "SettingsIcon",
      },
    ]
  }
]
