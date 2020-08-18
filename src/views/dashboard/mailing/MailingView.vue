<template>
    <div>
        <vs-sidebar click-not-close parent="#mailing-app" :hidden-background="true" class="full-vs-sidebar mailing-view-sidebar items-no-padding" v-model="isSidebarActive" position-right>
            <div class="mail-sidebar-content px-0 sm:pb-6 h-full" v-if="currentMailing">
                <div class="flex flex-wrap items-center mailing-header justify-between md:px-8 px-6 sm:pb-2 sm: pt-6 d-theme-dark-bg">
                    <div class="flex mb-4">
                        <div class="flex items-center">
                            <feather-icon :icon="$vs.rtl ? 'ArrowRightIcon' : 'ArrowLeftIcon'" @click="$emit('close-sidebar')" class="cursor-pointer mr-4" svg-classes="w-6 h-6"></feather-icon>
                            <h4>{{ currentMailing.ru_title }}</h4>
                        </div>
                    </div>
                    <div class="ml-10 mb-4 mt-1">
                        <div class="mailing__actions--single flex items-baseline">

                            <!-- ADD LABEL DROPDOWN -->
                            <vs-dropdown vs-custom-content vs-trigger-click class="cursor-pointer">
                                <feather-icon icon="TagIcon" svg-classes="h-6 w-6" class="cursor-pointer ml-4"></feather-icon>
                                <vs-dropdown-menu style="z-index: 40001">
                                        <vs-dropdown-item v-for="(category, index) in mailingCats" :key="index" @click.stop>
                                            <vs-radio :vs-value="category.value" v-model="currentMailing.category" name="category">{{ category.text }}</vs-radio>
                                        </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>

                            <feather-icon icon="MailingIcon" svg-classes="h-6 w-6" class="cursor-pointer ml-4" @click="$emit('mark-unread')"></feather-icon>
                            <feather-icon v-if="currentMailing.mailFolder != 'trash'" icon="TrashIcon" svg-classes="h-6 w-6" class="cursor-pointer ml-4" @click="$emit('remove-mailing')"></feather-icon>
                            <feather-icon :icon="$vs.rtl ? 'ChevronsRightIcon' : 'ChevronsLeftIcon'" svg-classes="h-6 w-6" class="cursor-pointer ml-4 hidden sm:inline-flex" @click="$emit('previous-mailing')" />
                            <feather-icon :icon="$vs.rtl ? 'ChevronsLeftIcon' : 'ChevronsRightIcon'" svg-classes="h-6 w-6" class="cursor-pointer ml-4 hidden sm:inline-flex" @click="$emit('next-mailing')" />
                        </div>
                    </div>
                </div>

                <component :is="scrollbarTag" class="scroll-area-mail-content md:px-8 md:pb-8 pt-4 px-6 pb-6" :settings="settings" :key="$vs.rtl">
                <!-- LABEL ROW -->
                <div class="vx-row">
                    <div class="vx-col w-full">
                        <div class="mailing__labels--single flex ml-10 items-center mt-2">
                            <div class="open-mail-label flex items-center mr-4">
                                <div class="h-3 w-3 rounded-full mr-1" :class="'bg-' + categoryColor(currentMailing.category)"></div>
                                <span class="text-sm">{{ currentMailing.category | capitalize }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- /LABEL ROW -->
                <br>

                <div v-if="isSidebarActive">

                    <!-- LATEST MESSAGE -->
                    <div class="vx-row">
                        <div class="vx-col w-full">
                          <mailing-mail-card :mailContent="currentMailing" />
                        </div>
                    </div>

                    <div class="vx-row" style="margin-top: 2.2rem">
                        <div class="vx-col w-full">
                            <vx-card>
                                <div class="vx-row">
                                    <div class="vx-col w-full flex justify-between">
                                        <span class="text-lg">Click here to <span class="text-primary font-semibold cursor-pointer">Reply</span> or <span class="text-primary font-semibold cursor-pointer">Forward</span></span>
                                        <feather-icon icon="PaperclipIcon"></feather-icon>
                                    </div>
                                </div>
                            </vx-card>
                        </div>
                    </div>
                </div>
                </component>
            </div>
        </vs-sidebar>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import MailingCard from './MailingCard.vue'
import { mapActions, mapState } from 'vuex'

export default {
  props: {
    mailingCats: {
      type: Array,
      required: true
    },
    openMailingId: {
      required: true,
      validator: prop => typeof prop === 'number' || prop === null
    },
    isSidebarActive: {
      type: Boolean,
      required: true
    },
    mailingFilter: {
      type: String
    }
  },
  data () {
    return {
      showThread: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.50
      },
      currentMailing: null
    }
  },
  watch: {
    isSidebarActive (value) {
      if (!value) {
        this.$emit('closeSidebar')
        setTimeout(() => {
          this.showThread = false
        }, 500)
      }
    }
  },
  computed: {
    categoryColor () {
      return (category) => {
        if(this.mailingCats && this.mailingCats.length && category) {
          return this.mailingCats.find((cat) => {
            return cat.value === category
          }).color
        }
        return '';
      }
    },
    scrollbarTag () { return this.$store.getters.scrollbarTag }
  },
  methods: {
    ...mapActions('mailing', ['getMailing']),
    toggleIsStarred () {
      const payload = { mailId: this.openMailingId, value: !this.currentMailing.isStarred }
      this.$store.dispatch('mailing/toggleIsMailingStarred', payload)
    },
    moveTo (to) {
      this.$emit('closeSidebar')
      this.$emit('moveTo', to)
    }
  },
  components: {
    VuePerfectScrollbar,
    MailingCard
  },
  updated () {
    if (!this.currentMailing) return
    if (this.currentMailing.unread && this.isSidebarActive) this.$store.dispatch('mailing/setUnread', { mailingIds: [this.openMailingId], unread: false })
  },
  async mounted () {
    this.currentMailing = await this.getMailing(this.openMailingId);
  }
}

</script>

