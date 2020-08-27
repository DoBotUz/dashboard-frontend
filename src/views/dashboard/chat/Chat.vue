<!-- =========================================================================================
    File Name: Chat.vue
    Description: Chat Application - Stay connected
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div
    id="chat-app"
    class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden"
  >
    <vs-sidebar
      class="items-no-padding"
      parent="#chat-app"
      :click-not-close="clickNotClose"
      :hidden-background="clickNotClose"
      v-model="isChatSidebarActive"
      id="chat-list-sidebar"
    >
      <!-- USER PROFILE SIDEBAR -->
      <user-profile
        :active="activeProfileSidebar"
        :userId="userProfileId"
        class="user-profile-container"
        :isLoggedInUser="isLoggedInUserProfileView"
        @closeProfileSidebar="closeProfileSidebar"
      ></user-profile>

      <div class="chat__profile-search flex p-4">
        <vs-input
          icon-no-border
          icon="icon-search"
          icon-pack="feather"
          class="w-full mx-5 input-rounded-full"
          placeholder="Search or start a new chat"
          v-model="searchQuery"
        />

        <feather-icon
          class="md:inline-flex lg:hidden -ml-3 cursor-pointer"
          icon="XIcon"
          @click="toggleChatSidebar(false)"
        />
      </div>

      <vs-divider class="d-theme-border-grey-light m-0" />
      <component
        :is="scrollbarTag"
        class="chat-scroll-area pt-4"
        :settings="settings"
        :key="$vs.rtl"
      >
        <!-- ACTIVE CHATS LIST -->
        <div class="chat__chats-list mb-8">
          <h3 class="text-primary mb-5 px-4">Новые сообщения</h3>
          <ul class="chat__active-chats bordered-items">
            <li
              class="cursor-pointer"
              v-for="(contact, index) in chatContacts"
              :key="index"
              @click="updateActiveChatUser(contact.id)"
            >
              <chat-contact
                showLastMsg
                :contact="contact"
                :lastMessaged="chatLastMessaged(contact.id).created_at"
                :unseenMsg="chatUnseenMessages(contact.id)"
                :isActiveChatUser="isActiveChatUser(contact.id)"
              ></chat-contact>
            </li>
          </ul>
        </div>

        <!-- CONTACTS LIST -->
        <div class="chat__contacts">
          <h3 class="text-primary mb-5 px-4">За три дня</h3>
          <ul class="chat__contacts bordered-items">
            <li
              class="cursor-pointer"
              v-for="contact in contacts"
              :key="contact.uid"
              @click="updateActiveChatUser(contact.uid)"
            >
              <chat-contact :contact="contact"></chat-contact>
            </li>
          </ul>
        </div>
      </component>
    </vs-sidebar>

    <!-- RIGHT COLUMN -->
    <div
      class="chat__bg no-scroll-content chat-content-area border border-solid d-theme-border-grey-light border-t-0 border-r-0 border-b-0"
      :class="{'sidebar-spacer--wide': clickNotClose, 'flex items-center justify-center': activeChatUser === null}"
    >
      <template v-if="activeChatUser">
        <div class="chat__navbar">
          <chat-navbar
            :isSidebarCollapsed="!clickNotClose"
            :user-id="activeChatUser"
            :isPinnedProp="isChatPinned"
            @openContactsSidebar="toggleChatSidebar(true)"
            @showProfileSidebar="showProfileSidebar"
            @toggleIsChatPinned="toggleIsChatPinned"
          ></chat-navbar>
        </div>
        <component
          :is="scrollbarTag"
          class="chat-content-scroll-area border border-solid d-theme-border-grey-light"
          :settings="settings"
          ref="chatLogPS"
          :key="$vs.rtl"
        >
          <div class="chat__log" ref="chatLog">
            <chat-log :userId="activeChatUser" v-if="activeChatUser"></chat-log>
          </div>
        </component>
        <div class="chat__input flex p-4 bg-white">
          <vs-input
            class="flex-1"
            placeholder="Type Your Message"
            v-model="typedMessage"
            @keyup.enter="sendMsg"
          />
          <vs-button class="bg-primary-gradient ml-4" type="filled" @click="sendMsg">Send</vs-button>
        </div>
      </template>
      <template v-else>
        <div class="flex flex-col items-center">
          <feather-icon
            icon="MessageSquareIcon"
            class="mb-4 bg-white p-8 shadow-md rounded-full"
            svgClasses="w-16 h-16"
          ></feather-icon>
          <h4
            class="py-2 px-4 bg-white shadow-md rounded-full cursor-pointer"
            @click.stop="toggleChatSidebar(true)"
          >Начните беседу нажав на чат</h4>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
import ChatContact from "./ChatContact.vue";
import ChatLog from "./ChatLog.vue";
import ChatNavbar from "./ChatNavbar.vue";
import UserProfile from "./UserProfile.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { mapActions, mapGetters } from 'vuex';
import clientSocket from '@/socket'; 

export default {
  data() {
    return {
      active: true,
      isHidden: false,
      searchContact: "",
      activeProfileSidebar: false,
      activeChatUser: null,
      userProfileId: -1,
      typedMessage: "",
      isChatPinned: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.7,
      },
      clickNotClose: true,
      isChatSidebarActive: true,
      isLoggedInUserProfileView: false,
    };
  },
  watch: {
    windowWidth() {
      this.setSidebarWidth();
    },
  },
  computed: {
    chatLastMessaged() {
      return (userId) => this.$store.getters["chat/chatLastMessaged"](userId);
    },
    chatUnseenMessages() {
      return (userId) => {
        const unseenMsg = this.$store.getters["chat/chatUnseenMessages"](
          userId
        );
        if (unseenMsg) return unseenMsg;
      };
    },
    activeUser() {
      return this.$store.state.AppActiveUser;
    },
    getStatusColor() {
      return (isActiveUser) => {
        const userStatus = this.getUserStatus(isActiveUser);

        if (userStatus === "online") {
          return "success";
        } else if (userStatus === "do not disturb") {
          return "danger";
        } else if (userStatus === "away") {
          return "warning";
        } else {
          return "grey";
        }
      };
    },
    chatContacts() {
      return this.$store.getters["chat/chats"];
    },
    contacts() {
      return this.$store.getters["chat/contacts"];
    },
    searchQuery: {
      get() {
        return this.$store.state.chat.chatSearchQuery;
      },
      set(val) {
        this.$store.dispatch("chat/setChatSearchQuery", val);
      },
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    isActiveChatUser() {
      return (userId) => userId === this.activeChatUser;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
  methods: {
    getUserStatus(isActiveUser) {
      // return "active"
      return isActiveUser
        ? this.$store.state.AppActiveUser.status
        : this.contacts[this.activeChatUser].status;
    },
    closeProfileSidebar(value) {
      this.activeProfileSidebar = value;
    },
    updateActiveChatUser(contactId) {
      this.activeChatUser = contactId;
      if (this.$store.getters["chat/chatUnseenMessages"](this.activeChatUser)) {
        this.$store.dispatch("chat/markSeenAllMessages", contactId);
      }
      this.toggleChatSidebar();
      this.typedMessage = "";
    },
    showProfileSidebar(userId, openOnLeft = false) {
      this.userProfileId = userId;
      this.isLoggedInUserProfileView = openOnLeft;
      this.activeProfileSidebar = !this.activeProfileSidebar;
    },
    sendMsg() {
      if (!this.typedMessage) return;
      const payload = {
        text: this.typedMessage,
        type: 0,
        sent_by_operator: true,
        recipient: this.activeChatUser
      };
      this.$store.dispatch("chat/sendChatMessage", payload);
      this.typedMessage = "";

      const scroll_el = this.$refs.chatLogPS.$el || this.$refs.chatLogPS;
      scroll_el.scrollTop = this.$refs.chatLog.scrollHeight;
    },
    toggleIsChatPinned(value) {
      this.isChatPinned = value;
    },
    setSidebarWidth() {
      if (this.windowWidth < 1200) {
        this.isChatSidebarActive = this.clickNotClose = false;
      } else {
        this.isChatSidebarActive = this.clickNotClose = true;
      }
    },
    toggleChatSidebar(value = false) {
      if (!value && this.clickNotClose) return;
      this.isChatSidebarActive = value;
    },
  },
  components: {
    VuePerfectScrollbar,
    ChatContact,
    UserProfile,
    ChatNavbar,
    ChatLog,
  },
  created() {
    this.$store.dispatch('chat/fetchChats');
    this.setSidebarWidth();
  },
  mounted() {
    // this.$store.dispatch("chat/setChatSearchQuery", "");
    clientSocket(this.$store.state.organization.id).on('newChatMessage', (data) => {
      let message = JSON.parse(data);
      if (message.author == this.activeChatUser || message.recipient == this.activeChatUser) {
        this.$store.dispatch('chat/addNewMessage', {
          botUserId: this.activeChatUser,
          message
        });
      } else {
        this.$store.dispatch('chat/fetchChats');
      }
    });
  },
};
</script>


<style lang="scss">
@import "@/assets/scss/vuexy/apps/chat.scss";
</style>
