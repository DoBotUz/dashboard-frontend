<template>
  <div class="mailing__mailing-sidebar h-full">
    <div class="m-6 clearfix">
      <vs-button
        class="bg-primary-gradient w-full"
        icon-pack="feather"
        icon="icon-edit"
        @click="activePrompt = true"
      >Новая рассылка</vs-button>
    </div>

    <!-- compose mailing -->
    <vs-popup
      class="mailing-compose"
      title="Новая рассылка"
      @cancel="clearFields"
      @close="clearFields"
      :active.sync="activePrompt"
      fullscreen
    >
      <component :is="scrollbarTag" class="scroll-area p-4" :settings="settings">
        <mailing-form
          :mailingCats="mailingCats"
          @on-send="sendMailing"
          @on-draft="saveMailingToDrafts"
          :formFields="formFields"
          ref="mailingFormSidebars"
        />
      </component>
    </vs-popup>

    <component
      :is="scrollbarTag"
      class="mailing-filter-scroll-area"
      :settings="settings"
      :key="$vs.rtl"
    >
      <div class="px-6 pb-2 flex flex-col">
        <!-- sent -->
        <router-link
          tag="span"
          :to="`${baseUrl}/sent`"
          class="flex items-center mt-4 mb-2 cursor-pointer"
          :class="{'text-primary': mailingFilter == 'sent'}"
        >
          <feather-icon
            icon="SendIcon"
            :svgClasses="[{'text-primary stroke-current': mailingFilter == 'sent'}, 'h-6 w-6']"
          ></feather-icon>
          <span class="text-lg ml-3">Доставлены</span>
        </router-link>

        <!-- sent -->
        <router-link
          tag="span"
          :to="`${baseUrl}/sending`"
          class="flex items-center mt-4 mb-2 cursor-pointer"
          :class="{'text-primary': mailingFilter == 'sending'}"
        >
          <feather-icon
            icon="PrinterIcon"
            :svgClasses="[{'text-primary stroke-current': mailingFilter == 'sending'}, 'h-6 w-6']"
          ></feather-icon>
          <span class="text-lg ml-3">Доставляются</span>
        </router-link>

        <!-- draft -->
        <router-link
          tag="span"
          :to="`${baseUrl}/drafts`"
          class="flex justify-between items-center mt-4 cursor-pointer"
          :class="{'text-primary': mailingFilter == 'drafts'}"
        >
          <div class="flex items-center mb-2">
            <feather-icon
              icon="Edit2Icon"
              :svgClasses="[{'text-primary stroke-current': mailingFilter == 'drafts'}, 'h-6 w-6']"
            ></feather-icon>
            <span class="text-lg ml-3">Черновики</span>
          </div>
          <template v-if="mailingMeta.draftMails">
            <vs-chip
              class="number"
              color="warning"
              v-if="mailingMeta.draftMails.length > 0"
            >{{ mailingMeta.draftMails.length }}</vs-chip>
          </template>
        </router-link>
      </div>
      <vs-divider></vs-divider>
      <div class="mailing__labels px-6 py-4">
        <h5 class="mb-8">Категории</h5>
        <div class="mailing__lables-list">
          <router-link
            tag="span"
            class="mailing__label flex items-center mb-4 cursor-pointer"
            v-for="(tag, index) in mailingCats"
            :key="index"
            :to="`${baseUrl}/${tag.value}`"
          >
            <div
              class="ml-1 h-3 w-3 rounded-full mr-4"
              :class="'border-2 border-solid border-' + tag.color"
            ></div>
            <span
              class="text-lg"
              :class="{'text-primary': mailingFilter == tag.value}"
            >{{ tag.text }}</span>
          </router-link>
        </div>
      </div>
    </component>
  </div>
</template>

<script>
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import MailingForm from './mailingForm.vue';
import { mapState, mapActions } from "vuex";

export default {
  props: {
    mailingCats: {
      type: Array,
      required: true,
    },
    mailingFilter: {
      type: String,
      required: true,
    },
    isSidebarPopupOpen: {
      type: Boolean,
      required: true,
    },
    currentMailingId: {
      type: Number,
      required: false,
    },
  },
  data() {
    return {
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
      formFields: {
        category: "news"
      },
    };
  },
  computed: {
    ...mapState(["organization"]),
    ...mapState("mailing", ["meta"]),

    baseUrl() {
      const path = this.$route.path;
      return path.slice(0, path.lastIndexOf("/"));
    },
    mailingMeta() {
      return this.meta;
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
    activePrompt: {
      get() {
        return this.isSidebarPopupOpen;
      },
      set(val) {
        this.$emit('on-popup-change', val);
      }
    }
  },
  methods: {
    ...mapActions("mailing", ["saveToDrafts"]),
    clearFields() {
      this.$nextTick(() => {
        this.formFields.category = "news";
      });
    },
    async saveMailingToDrafts(formData) {
      return this.saveToDrafts(formData).then(() => {
        this.activePrompt = false;
        this.$vs.notify({
          title: "Отлично",
          text: "Шаблон создан",
          color: "success",
          position: "top-center",
        });
        this.$refs.mailingFormSidebars.clearForm();
      });
    },
    sendMailing() {
      this.clearFields();
    },
  },
  components: {
    VuePerfectScrollbar,
    MailingForm
  },
};
</script>

