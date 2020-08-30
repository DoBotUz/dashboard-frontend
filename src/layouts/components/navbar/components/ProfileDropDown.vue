<template>
  <div class="the-navbar__user-meta flex items-center" v-if="activeUserInfo.first_name">

    <div class="text-right leading-tight hidden sm:block">
      <p class="font-semibold">{{ activeUserInfo.first_name + ' ' + activeUserInfo.last_name }}</p>
    </div>

    <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">

      <div class="con-img ml-3">
        <img key="onlineImg" :src="activeUserInfo.avatar ? `${$url}/public/users/${activeUserInfo.avatar}` : '/eye.png'" alt="user-img" width="40" height="40" class="rounded-full shadow-md cursor-pointer block" />
      </div>

      <vs-dropdown-menu class="vx-navbar-dropdown">
        <ul style="min-width: 12rem">

          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="UserIcon" svgClasses="w-4 h-4" />
            <span class="ml-2" @click="goToProfile">Мой профиль</span>
          </li>
          <li class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white">
            <feather-icon icon="HomeIcon" svgClasses="w-4 h-4" />
            <span class="ml-2" @click="$router.push('/')">Заведения</span>
          </li>

          <vs-divider class="m-1" />

          <li
            class="flex py-2 px-4 cursor-pointer hover:bg-primary hover:text-white"
            @click="logout">
            <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
            <span class="ml-2">Выход</span>
          </li>
        </ul>
      </vs-dropdown-menu>
    </vs-dropdown>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters(['profile']),
    activeUserInfo() {
      return this.$store.state.AppActiveUser
    }
  },
  head: {
    title() {
      return {
        inner: 'Заведения',
      }
    },
  },
  methods: {
    logout() {
      this.$store.dispatch('logout').then(() => { this.$router.push('/pages/login'); });
    },
    goToProfile() {
      if(this.profile && this.profile.id){
        if (this.profile.role === 'admin') {
          this.$router.push({ name: 'profile' }).catch((e) => {});
        } else {
          this.$router.push({ name: 'ProfileInShop', params: { id: this.profile.organizationId } }).catch((e) => {});
        }
      }
    },
  }
}
</script>
