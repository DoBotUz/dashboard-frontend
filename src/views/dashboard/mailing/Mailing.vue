<template>
  <div
    id="mailing-app"
    class="border border-solid d-theme-border-grey-light rounded relative overflow-hidden vs-con-loading__container"
  >
    <vs-sidebar
      class="items-no-padding"
      parent="#mailing-app"
      :click-not-close="clickNotClose"
      :hidden-background="clickNotClose"
      v-model="isMailingSidebarActive"
    >
      <mailing-sidebar
        :mailingCats="mailingCats"
        @close-sidebar="toggleMailingSidebar"
        :mailingFilter="mailingFilter"
        :isSidebarPopupOpen="isSidebarPopupOpen"
        @on-popup-change="val => isSidebarPopupOpen = val"
        :currentMailingId="openMailingId"
      />
    </vs-sidebar>

    <div
      :class="{'sidebar-spacer': clickNotClose}"
      class="no-scroll-content border border-solid d-theme-border-grey-light border-r-0 border-t-0 border-b-0"
    >
      <!-- SEARCH BAR -->
      <div class="flex border d-theme-dark-bg items-center search-bar-wrap">
        <feather-icon
          class="md:inline-flex lg:hidden ml-4 mr-4 cursor-pointer"
          icon="MenuIcon"
          @click.stop="toggleMailingSidebar(true)"
        />
        <vs-input
          icon-no-border
          icon="icon-search"
          size="large"
          icon-pack="feather"
          placeholder="Поиск рассылки"
          v-model="searchQuery"
          class="vs-input-no-border vs-input-no-shdow-focus w-full"
        />
      </div>

      <!-- EMAILS LIST -->
      <component
        :is="scrollbarTag"
        class="mailing-content-scroll-area"
        :settings="settings"
        ref="mailListPS"
      >
        <div>
          <transition-group
            name="list"
            class="mailing__mailings "
            tag="ul"
            appear
            v-if="mailings && mailings.length"
          >
            <li
              class="cursor-pointer wmailing__mailing-item"
              v-for="(mailing, index) in mailings"
              :key="String(mailingFilter) + String(mailing.id)"
              @click="updateOpenMailing(mailing.id)"
              :style="{transitionDelay: (index * 0.1) + 's'}"
            >
              <mailing-item
                :mailing="mailing"
                :isSelected="isMailSelected(mailing.id)"
                @addToSelected="addToSelectedMails"
                @removeSelected="removeSelectedMail"
              />
            </li>
          </transition-group>
          <div v-else>
            <vx-card
              style="text-align: center; margin-top: 20px;"
            >Таких рассылок нет!, Нажмите Создать рассылку в левом углу.</vx-card>
          </div>
        </div>
      </component>
    </div>

    <!-- EMAIL VIEW SIDEBAR -->
    <mailing-view
      v-if="openMailingId"
      :mailingCats="mailingCats"
      :openMailingId="openMailingId"
      :isSidebarActive="isSidebarActive"
      :mailingFilter="mailingFilter"
      @removeMailing="removeOpenMailing"
      @previousMailing="previousMailing"
      @nextMailing="nextMailing"
      @close-sidebar="closeMailingViewSidebar"
    ></mailing-view>
  </div>
</template>

<script>
import MailingSidebar from "./MailingSidebar.vue";
import MailingItem from "./MailingItem.vue";
import MailingView from "./MailingView.vue";
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import { mapState, mapActions, mapMutations, mapGetters } from "vuex";
import { loaderMixin } from '@/mixins';

export default {
  mixins: [loaderMixin],
  data() {
    return {
      openMailingId: null,
      selectedMails: [],
      isSidebarActive: false,
      showThread: false,
      clickNotClose: true,
      isMailingSidebarActive: true,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.7,
      },
      isSidebarPopupOpen: false,
    };
  },
  watch: {
    isSidebarActive(value) {
      if (!value) this.showThread = false;
    },
    mailingFilter() {
      this.selectedMails = [];

      const scroll_el = this.$refs.mailListPS.$el || this.$refs.mailListPS;
      scroll_el.scrollTop = 0;

      this.UPDATE_MAILING_FILTER(this.$route.params.filter);
      let filter = ``;
      if(!this.getStatusValue(this.$route.params.filter)){
        filter = `category||$eq||${this.$route.params.filter}`;
      } else {
        if(this.$route.params.filter === 'sent'){
          filter = `status||$ne||${this.getStatusValue('drafts')}`;
        } else {
          filter = `status||$eq||${this.getStatusValue(this.$route.params.filter)}`;
        }
      }

      this.fetchMailings({
        filter,
      }); // Fetch Mailings
      this.toggleMailingSidebar();
    },
    windowWidth() {
      this.setSidebarWidth();
    },
  },
  computed: {
    ...mapState("mailing", ["mailingCats", "mailingSearchQuery", "mailings", "loading"]),
    ...mapGetters("mailing", ["getStatusValue"]),

    mailingFilter() {
      return this.$route.params.filter;
    },
    searchQuery: {
      get() {
        return this.mailingSearchQuery;
      },
      set(val) {
        this.setMailingSearchQuery(val);
      },
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },

    isMailSelected() {
      return (mailId) => this.selectedMails.indexOf(mailId) !== -1;
    },

    windowWidth() {
      return this.$store.state.windowWidth;
    },
  },
  methods: {
    ...mapMutations("mailing", ["UPDATE_MAILING_FILTER"]),
    ...mapActions("mailing", [
      "setMailingSearchQuery",
      "fetchMailingCats",
      "fetchMailings",
    ]),

    updateOpenMailing(mailId) {
      this.openMailingId = mailId;
      this.isSidebarActive = true;
    },

    addToSelectedMails(mailId) {
      if (this.selectedMails.indexOf(mailId) === -1)
        this.selectedMails.push(mailId);
    },

    removeSelectedMail(mailId) {
      const mailIndex = this.selectedMails.indexOf(mailId);
      if (mailIndex !== -1) this.selectedMails.splice(mailIndex, 1);
    },

    removeOpenMailing() {
      this.selectedMails = [this.openMailId];
      this.moveTo("trashed");
      this.isSidebarActive = false;
    },

    nextMailing() {
      const currentMailIndex = this.mails.findIndex(
        (mail) => mail.id === this.openMailId
      );
      if (this.mails[currentMailIndex + 1])
        this.openMailId = this.mails[currentMailIndex + 1].id;
    },

    previousMailing() {
      const currentMailIndex = this.mails.findIndex(
        (mail) => mail.id === this.openMailId
      );
      if (this.mails[currentMailIndex - 1])
        this.openMailId = this.mails[currentMailIndex - 1].id;
    },

    updateLabels(label) {
      this.$store.dispatch("mailing/updateLabels", {
        mails: this.selectedMails,
        label,
      });
      this.selectedMails = [];
    },

    closeMailingViewSidebar() {
      this.isSidebarActive = false;
      setTimeout(() => {
        this.openMailingId = null;
      }, 500);
    },

    setSidebarWidth() {
      if (this.windowWidth < 992) {
        this.isMailingSidebarActive = this.clickNotClose = false;
      } else {
        this.isMailingSidebarActive = this.clickNotClose = true;
      }
    },

    toggleMailingSidebar(value = false) {
      if (!value) {
        this.closeMailingViewSidebar();
        if (this.clickNotClose) {
          return;
        }
      }
      this.isMailingSidebarActive = value;
    },
  },
  components: {
    MailingItem,
    MailingSidebar,
    MailingView,
    VuePerfectScrollbar,
  },
  async created() {
    this.setSidebarWidth();

    this.UPDATE_MAILING_FILTER(this.$route.params.filter); // Update Mail Filter
    await this.fetchMailingCats(); // Fetch Mail Tags

    let filter = ``;
    if(!this.getStatusValue(this.$route.params.filter)){
      filter = `category||$eq||${this.$route.params.filter}`;
    } else {
      if(this.$route.params.filter === 'sent'){
        filter = `status||$ne||${this.getStatusValue('drafts')}`;
      } else {
        filter = `status||$eq||${this.getStatusValue(this.$route.params.filter)}`;
      }
    }

    this.fetchMailings({
      filter,
    }); // Fetch Mailings


  },
  mounted() {
    this.setMailingSearchQuery("");
  },
};
</script>


<style lang="scss">
@import "@/assets/scss/vuexy/apps/mailing.scss";

#mailing-app .mailing-filter-scroll-area {
  position: relative;
  width: 100%;
  height: calc(100% - 75px);
  margin: auto;
}
</style>
