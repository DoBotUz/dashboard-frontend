<!-- =========================================================================================
    File Name: UserProfile.vue
    Description: user profile sidebar
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
  <div id="parentx-demo-2">
    <vs-sidebar
      parent="#chat-app"
      :position-right="!isLoggedInUser"
      :hidden-background="false"
      v-model="activeLocal"
      id="chat-profile-sidebar"
      class="items-no-padding"
    >
      <div class="header-sidebar relative flex flex-col p-0" slot="header">
        <feather-icon
          icon="XIcon"
          svgClasses="m-2 cursor-pointer absolute top-0 right-0"
          @click="$emit('closeProfileSidebar', false)"
        ></feather-icon>

        <div class="relative inline-flex mx-auto mb-5 mt-6">
          <vs-avatar
            class="m-0 border-white border-2 border-solid shadow-md"
            :text="chatUser.bio"
            size="70px"
          />
          <div
            class="h-5 w-5 border-white border-2 border-solid rounded-full absolute right-0 bottom-0"
            :class="'bg-' + statusColor"
          ></div>
        </div>

        <h4 class="mr-2 self-center">{{ chatUser.bio }}</h4>
      </div>

      <component :is="scrollbarTag" class="scroll-area" :settings="settings" :key="$vs.rtl">
        <div class="p-8">
          <h6 class="mb-2" :class="{'ml-4': isLoggedInUser}">Имя</h6>
          <p class="mb-4">{{ chatUser.bio }}</p>
          <h6 class="mb-2" :class="{'ml-4': isLoggedInUser}">Номер телефона</h6>
          <p class="mb-4">{{ chatUser.phone_number }}</p>
          <h6 class="mb-2" :class="{'ml-4': isLoggedInUser}">Язык</h6>
          <p class="mb-4">{{ chatUser.language == 'uz' ? 'Узбекский' : chatUser.language == 'en' ? 'Английский' : 'Узбекский' }}</p>
          <h6 class="mb-2" :class="{'ml-4': isLoggedInUser}">Username</h6>
          <p class="mb-4">@{{ chatUser.username }}</p>
          <h6 class="mb-2" :class="{'ml-4': isLoggedInUser}">Дата регистрации</h6>
          <p class="mb-4">{{ chatUser.created_at }}</p>
        </div>
      </component>
    </vs-sidebar>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";

export default {
  props: {
    userId: {
      type: Number,
      required: true,
    },
    active: {
      type: Boolean,
      required: true,
    },
    isLoggedInUser: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      counterDanger: false,
      settings: {
        // perfectscrollbar settings
        maxScrollbarLength: 60,
        wheelSpeed: 0.6,
      },
    };
  },
  computed: {
    chatUser() {
      return this.$store.getters["chat/chatUser"](this.userId);
    },
    activeLocal: {
      get() {
        return this.active;
      },
      set(value) {
        this.$emit("closeProfileSidebar", value);
      },
    },
    about: {
      get() {
        return this.chatUser.about;
      },
      set(value) {
        this.$store.dispatch("updateUserInfo", { about: value });
      },
    },
    status: {
      get() {
        return this.chatUser.status;
      },
      set(value) {
        this.$store.dispatch("updateUserInfo", { status: value });
      },
    },
    statusColor() {
      const userStatus = this.chatUser.status;

      if (userStatus === "online") {
        return "success";
      } else if (userStatus === "do not disturb") {
        return "danger";
      } else if (userStatus === "away") {
        return "warning";
      } else {
        return "grey";
      }
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
  },
  components: {
    VuePerfectScrollbar,
  },
};
</script>

