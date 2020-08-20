<template>
  <!-- NOTIFICATIONS -->
  <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer transform hover:-translate-y-1 hover:scale-110 transition duration-100">
    <feather-icon icon="BellIcon" class="cursor-pointer mt-1 sm:mr-6 mr-2" :badge="unreadNotifications.length" />

    <vs-dropdown-menu class="notification-dropdown dropdown-custom vx-navbar-dropdown">

      <div class="notification-top text-center p-5 bg-primary text-white">
        <h3 class="text-white">{{ unreadNotifications.length }}</h3>
        <p class="opacity-75">Новых уведомлений</p>
      </div>

      <component :is="scrollbarTag" ref="mainSidebarPs" class="scroll-area--nofications-dropdown p-0 mb-10" :settings="settings" :key="$vs.rtl">
        <ul class="bordered-items">
          <li
            v-for="ntf in unreadNotifications"
            :key="ntf.index"
            class="flex justify-between px-4 py-4 notification cursor-pointer"
            @click="onClickOnNotification(ntf)"
          >
            <div class="flex items-start">
              <feather-icon :icon="ntf.icon" :svgClasses="[`text-${ntf.category}`, 'stroke-current mr-1 h-6 w-6']"></feather-icon>
              <div class="mx-2">
                <span class="font-medium block notification-title" :class="[`text-${ntf.category}`]">{{ ntf.title }}</span>
                <small>{{ ntf.msg }}</small>
              </div>
            </div>
            <small class="mt-1 whitespace-no-wrap">{{ elapsedTime(ntf.time) }}</small>
          </li>
        </ul>
      </component>

      <div class="
        checkout-footer
        fixed
        bottom-0
        rounded-b-lg
        text-primary
        w-full
        p-2
        font-semibold
        text-center
        border
        border-b-0
        border-l-0
        border-r-0
        border-solid
        d-theme-border-grey-light
        cursor-pointer">
        <span>Отменить все как прочитанное</span>
      </div>
    </vs-dropdown-menu>
  </vs-dropdown>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { mapGetters } from 'vuex';
import { KEYS, TYPES } from '@/store/modules/notifications';

export default {
  components: {
    VuePerfectScrollbar
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: .60,
      },
    }
  },
  computed: {
    scrollbarTag() { return this.$store.getters.scrollbarTag },
    unreadNotifications() {
      return this.$store.getters.notifications.map(notification => {
        let unread_notification = {
          index: notification.id,
          time: new Date(notification.created_at),
          title: '',
          category: 'primary',
          key: notification.key,
          key_id: notification.key_id,
        };
        if (unread_notification.key === KEYS.NEW_FEEDBACK) {
          unread_notification.msg = 'Новый отзыв';
          unread_notification.icon = 'StarIcon';
        } else if (unread_notification.key === KEYS.NEW_ORDER) {
          unread_notification.msg = 'Новый заказ';
          unread_notification.icon = 'ShoppingBagIcon';
        }
        return unread_notification;
      })
    }
  },
  methods: {
    onClickOnNotification(ntf) {
      if (ntf.key === KEYS.NEW_FEEDBACK) {
        return this.$router.push({
          name: 'DashboardFeedbacks'
        })
      }
      if (ntf.keys === KEYS.NEW_ORDER) {
        return this.$router.push({
          name: 'DashboardOrders'
        })
      }
    },
    elapsedTime(startTime) {
      let x        = new Date(startTime)
      let now      = new Date()
      var timeDiff = now - x
      timeDiff    /= 1000

      var seconds = Math.round(timeDiff)
      timeDiff    = Math.floor(timeDiff / 60)

      var minutes = Math.round(timeDiff % 60)
      timeDiff    = Math.floor(timeDiff / 60)

      var hours   = Math.round(timeDiff % 24)
      timeDiff    = Math.floor(timeDiff / 24)

      var days    = Math.round(timeDiff % 365)
      timeDiff    = Math.floor(timeDiff / 365)

      var years   = timeDiff

      if (years > 0) {
        return years + (years > 1 ? ' лет ' : ' год ') + 'назад'
      } else if (days > 0) {
        return days + (days > 1 ? ' дней ' : ' день ') + 'назад'
      } else if (hours > 0) {
        return hours + (hours > 1 ? ' час. ' : ' час. ') + 'назад'
      } else if (minutes > 0) {
        return minutes + (minutes > 1 ? ' мин. ' : ' мин. ') + 'назад'
      } else if (seconds > 0) {
        return seconds + (seconds > 1 ? ' сек. назад' : 'только что')
      }

      return 'только что'
    },
    randomDate({ hr, min, sec }) {
      let date = new Date()

      if (hr) date.setHours(date.getHours() - hr)
      if (min) date.setMinutes(date.getMinutes() - min)
      if (sec) date.setSeconds(date.getSeconds() - sec)

      return date
    }
  }
}

</script>

