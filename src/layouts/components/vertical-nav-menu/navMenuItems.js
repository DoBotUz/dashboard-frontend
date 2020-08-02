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
    name: "Каталог / Меню",
    slug: "page2",
    icon: "FileIcon",
  },
  {
    url: {
      name: 'DashBoardBotUsers'
    },
    name: "Пользователи",
    slug: "bot-users",
    icon: "UserIcon",
  },
  {
    url: "/page2",
    name: "Заказы",
    slug: "page2",
    icon: "FileIcon",
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
        url: "/page2",
        name: "Отзывы",
        tagColor: 'warning',
        tag: '2',
        slug: "page2",
        icon: "FileIcon",
      },
      {
        url: "/page2",
        name: "Чат",
        slug: "page2",
        icon: "FileIcon",
        tagColor: 'warning',
        tag: '2',
      },
      {
        url: "/page2",
        name: "Подписчики",
        slug: "page2",
        icon: "FileIcon",
      },
      {
        url: "/page2",
        name: "Рассылки",
        slug: "page2",
        icon: "FileIcon",
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
        icon: "FileIcon",
      },
      {
        url: "/page2",
        name: "Доставка",
        slug: "page2",
        icon: "FileIcon",
      },
      {
        url: "/page2",
        name: "Способы оплаты",
        slug: "page2",
        icon: "FileIcon",
      },
      {
        url: {
          name: 'DashboardSettings',
        },
        name: "Настройки",
        slug: "home",
        icon: "HomeIcon",
      },
    ]
  }
]
