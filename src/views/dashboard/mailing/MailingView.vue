<template>
  <div>
    <vs-sidebar
      click-not-close
      parent="#mailing-app"
      :hidden-background="true"
      class="full-vs-sidebar mailing-view-sidebar items-no-padding"
      v-model="isSidebarActive"
      position-right
    >
      <div class="mail-sidebar-content px-0 sm:pb-6 h-full" v-if="currentMailing">
        <vs-popup
          class="mailing-compose"
          title="Редактировать рассылку"
          :active.sync="editPopup"
          fullscreen
        >
          <component :is="scrollbarTag" class="scroll-area p-4" :settings="settings">
            <mailing-form
              :mailingCats="mailingCats"
              :formFields="currentMailing"
              @on-draft="saveMailingToDrafts"
              ref="mailingFormViews"
            />
          </component>
        </vs-popup>
        <div
          class="flex flex-wrap items-center mailing-header justify-between md:px-8 px-6 sm:pb-2 sm: pt-6 d-theme-dark-bg"
        >
          <div class="flex mb-4">
            <div class="flex items-center">
              <feather-icon
                icon="ArrowLeftIcon"
                @click="$emit('close-sidebar')"
                class="cursor-pointer mr-4 transform hover:-translate-x-1 transition duration-100"
                svg-classes="w-6 h-6"
              ></feather-icon>
              <h4>{{ currentMailing.ru_title }}</h4>
            </div>
          </div>
          <div class="ml-10 mb-4 mt-1">
            <div class="mailing__actions--single flex items-baseline">
              <feather-icon
                icon="Edit2Icon"
                svg-classes="h-6 w-6"
                class="cursor-pointer ml-4 transform hover:-translate-y-1 hover:scale-110 transition duration-100"
                v-if="currentMailing.status === 10"
                @click="editMailing"
              ></feather-icon>
              <feather-icon
                icon="TrashIcon"
                svg-classes="h-6 w-6"
                class="cursor-pointer ml-4 transform hover:-translate-y-1 hover:scale-110 transition duration-100"
                @click="openDeleteSureDialog"
              ></feather-icon>
            </div>
          </div>
        </div>

        <component
          :is="scrollbarTag"
          class="scroll-area-mail-content md:px-8 md:pb-8 pt-4 px-6 pb-6"
          :settings="settings"
          :key="$vs.rtl"
        >
          <div v-if="isSidebarActive">
            <!-- LATEST MESSAGE -->
            <div class="vx-row">
              <div class="vx-col w-full">
                <MailingCard :mailingContent="currentMailing" />
              </div>
            </div>

            <div class="vx-row" style="margin-top: 2.2rem">
              <div class="vx-col w-full">
                <vx-card>
                  <h5 class="mb-5">Действия</h5>
                  <div class="mailing-view__actions">
                    <vs-button
                      class="mr-5"
                      @click="duplicateAction"
                      color="primary"
                      type="border"
                      v-if="currentMailing.status != 10"
                    >Дублировать в черновики</vs-button>

                    <vs-button class="mb-4" color="success" icon="send" @click="startMailingOpenSure" v-else>Начать рассылку</vs-button>
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
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import MailingCard from "./MailingCard.vue";
import MailingForm from './mailingForm.vue';

import { mapActions, mapState } from "vuex";

export default {
  props: {
    mailingCats: {
      type: Array,
      required: true,
    },
    openMailingId: {
      required: true,
      validator: (prop) => typeof prop === "number" || prop === null,
    },
    isSidebarActive: {
      type: Boolean,
      required: true,
    },
    mailingFilter: {
      type: String,
    },
  },
  data() {
    return {
      showThread: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.5,
      },
      currentMailing: null,
      editPopup: false,
    };
  },
  watch: {
    isSidebarActive(value) {
      if (!value) {
        this.$emit("close-sidebar");
        setTimeout(() => {
          this.showThread = false;
        }, 500);
      }
    },
  },
  computed: {
    categoryColor() {
      return (category) => {
        if (this.mailingCats && this.mailingCats.length && category) {
          return this.mailingCats.find((cat) => {
            return cat.value === category;
          }).color;
        }
        return "";
      };
    },
    scrollbarTag() {
      return this.$store.getters.scrollbarTag;
    },
  },
  methods: {
    ...mapActions("mailing", ["getMailing", 'saveToDrafts', 'deleteOne', 'startDraft', 'duplicateToDrafts']),
    moveTo(to) {
      this.$emit("close-sidebar");
      this.$emit("moveTo", to);
    },
    editMailing() {
      this.editPopup = true;
    },

    duplicateAction() {
      return this.duplicateToDrafts(this.currentMailing.id).then((res) => {
        this.$vs.notify({
          title: "Отлично",
          text: "Шаблон сохранен",
          color: "success",
          position: "top-center",
        });
      });
    },

    async saveMailingToDrafts(formData) {
      return this.saveToDrafts(formData).then((res) => {
        this.editPopup = false;
        this.$vs.notify({
          title: "Отлично",
          text: "Шаблон сохранен",
          color: "success",
          position: "top-center",
        });
        this.currentMailing = res;
        this.$refs.mailingFormViews.clearForm();
      });
    },

    openDeleteSureDialog() {
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Удалить рассылку`,
        acceptText: 'Удалить',
        cancelText: 'Отмена',
        text: `Вы уверены в том что хотите удалить ${this.currentMailing.ru_title} ?`,
        accept: this.deleteMailing
      })
    },

    deleteMailing() {
      return this.deleteOne(this.currentMailing.id).then((res) => {
        this.$vs.notify({
          title: "Отлично",
          text: "Рассылка удалена",
          color: "success",
          position: "top-center",
        });
        this.$emit("close-sidebar");
      });
    },

    startMailingOpenSure() {
      this.$vs.dialog({
        type:'confirm',
        color: 'success',
        title: `Начать рассылку`,
        acceptText: 'Начать',
        cancelText: 'Отмена',
        text: `Вы уверены в том что хотите начать рассылку ${this.currentMailing.ru_title} ?`,
        accept: this.startMailingAction
      })
    },

    startMailingAction() {
      return this.startDraft(this.currentMailing).then((res) => {
        this.$vs.notify({
          title: "Отлично",
          text: "Рассылка отправлена в очередь",
          color: "success",
          position: "top-center",
        });
        this.$emit("close-sidebar");
      });
    },
  },
  components: {
    VuePerfectScrollbar,
    MailingCard,
    MailingForm,
  },
  async mounted() {
    this.currentMailing = await this.getMailing(this.openMailingId);
  },
};
</script>
<style lang="scss" scoped>
.mailing-view__actions {
  display: flex;
  align-items: flex-start;
  flex-direction: column;
}
</style>
