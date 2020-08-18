<template>
    <div class="mailing__mailing-sidebar h-full">
        <div class="m-6 clearfix">
            <vs-button class="bg-primary-gradient w-full" icon-pack="feather" icon="icon-edit" @click="activePrompt = true">Новая рассылка</vs-button>
        </div>

        <!-- compose mailing -->
        <vs-popup
            class="mailing-compose"
            title="Новая рассылка"
            @cancel="clearFields"
            @close="clearFields"
            :is-valid="validateForm"
            :active.sync="activePrompt" fullscreen>
                <component :is="scrollbarTag" class="scroll-area p-4" :settings="settings">
                    <form @submit.prevent data-vv-scope="newMailing">
                        <vs-input
                          class="w-full mb-6"
                          label="Заголовок на русском"
                          v-model="form.ru_title"
                          name="ru_title"
                          v-validate="'required|max:255'"
                          data-vv-as="Заголовок на русском"
                          :color="!errors.has('newMailing.ru_title') ? 'success' : 'danger'"
                        />
                        <span class="text-danger text-sm"  v-show="errors.has('newMailing.ru_title')">{{ errors.first('newMailing.ru_title') }}</span>

                        <vs-textarea
                          class="w-full mb-3"
                          label="Описание на русском"
                          v-model="form.ru_description"
                          name="ru_description"
                          v-validate="'required'"
                          data-vv-as="Описание на русском"
                          :color="!errors.has('newMailing.ru_description') ? 'success' : 'danger'"
                        />
                        <span class="text-danger text-sm"  v-show="errors.has('newMailing.ru_description')">{{ errors.first('newMailing.ru_description') }}</span>

                        <vs-input
                          class="w-full mb-6"
                          label="Заголовок на английском"
                          v-model="form.en_title"
                          name="en_title"
                          v-validate="'required|max:255'"
                          data-vv-as="Заголовок на английском"
                          :color="!errors.has('newMailing.en_title') ? 'success' : 'danger'"
                        />
                        <span class="text-danger text-sm"  v-show="errors.has('newMailing.en_title')">{{ errors.first('newMailing.en_title') }}</span>

                        <vs-textarea
                          class="w-full mb-3"
                          label="Описание на английском"
                          v-model="form.en_description"
                          name="en_description"
                          v-validate="'required'"
                          data-vv-as="Описание на английском"
                          :color="!errors.has('newMailing.en_description') ? 'success' : 'danger'"
                        />
                        <span class="text-danger text-sm"  v-show="errors.has('newMailing.en_description')">{{ errors.first('newMailing.en_description') }}</span>

                        <vs-input
                          class="w-full mb-6"
                          label="Заголовок на узбекском"
                          v-model="form.uz_title"
                          name="uz_title"
                          v-validate="'required|max:255'"
                          data-vv-as="Заголовок на узбекском"
                          :color="!errors.has('newMailing.uz_title') ? 'success' : 'danger'"
                        />
                        <span class="text-danger text-sm"  v-show="errors.has('newMailing.uz_title')">{{ errors.first('newMailing.uz_title') }}</span>

                        <vs-textarea
                          class="w-full mb-3"
                          label="Описание на узбекском"
                          v-model="form.uz_description"
                          name="uz_description"
                          v-validate="'required'"
                          data-vv-as="Описание на узбекском"
                          :color="!errors.has('newMailing.uz_description') ? 'success' : 'danger'"
                        />
                        <span class="text-danger text-sm"  v-show="errors.has('newMailing.uz_description')">{{ errors.first('newMailing.uz_description') }}</span>

                        <div class="vx-col w-full">
                          <vs-upload
                            :limit="1"
                            :show-upload-button="false"
                            text="Заглавная картинка"
                            ref="mailingThumbnail"
                            accept="image/*"
                          />
                        </div>
                        <vs-collapse type="border">
                          <vs-collapse-item icon-arrow="attach_file">
                            <div slot="header">
                              Прикрепить файлы
                            </div>
                            Выберите файлы которые будут отправлены вместе с оповщением, это могут быть картинки / документы / видео
                            <vs-alert active="true">
                              Отправка прикрепленных файлов может занять долгое время.
                            </vs-alert>
                            <div></div>
                            <vs-upload multiple text="Прикрепить файлы" ref="mailingAttachments" :show-upload-button="false" class="compose-mailing-attachment" />
                          </vs-collapse-item>
                        </vs-collapse>

                        <vs-select
                          label="Категория"
                          v-model="form.category"
                        >
                          <vs-select-item v-for="(item, index) in mailingCats" :key="index" :value="item.value" :text="item.text"/>
                        </vs-select>
                        <div class="flex mt-5 mb-3 p-5 float-right">
                          <vs-button
                              class="mr-5"
                              @click="saveMailingToDrafts"
                              color="primary"
                              type="border"
                            >Сохранить в черновики</vs-button>
                          <vs-button
                              @click="sendMailing"
                              color="success"
                              icon="send"
                            >Отправить</vs-button>
                        </div>
                    </form>
                </component>
        </vs-popup>

        <component :is="scrollbarTag" class="mailing-filter-scroll-area" :settings="settings" :key="$vs.rtl">
            <div class="px-6 pb-2 flex flex-col">
                <!-- sent -->
                <router-link tag="span" :to="`${baseUrl}/sent`" class="flex items-center mt-4 mb-2 cursor-pointer" :class="{'text-primary': mailingFilter == 'sent'}">
                    <feather-icon icon="SendIcon" :svgClasses="[{'text-primary stroke-current': mailingFilter == 'sent'}, 'h-6 w-6']"></feather-icon>
                    <span class="text-lg ml-3">Доставлены</span>
                </router-link>

                <!-- sent -->
                <router-link tag="span" :to="`${baseUrl}/sending`" class="flex items-center mt-4 mb-2 cursor-pointer" :class="{'text-primary': mailingFilter == 'sending'}">
                    <feather-icon icon="PrinterIcon" :svgClasses="[{'text-primary stroke-current': mailingFilter == 'sending'}, 'h-6 w-6']"></feather-icon>
                    <span class="text-lg ml-3">Доставляются</span>
                </router-link>

                <!-- draft -->
                <router-link tag="span" :to="`${baseUrl}/drafts`" class="flex justify-between items-center mt-4 cursor-pointer" :class="{'text-primary': mailingFilter == 'drafts'}">
                    <div class="flex items-center mb-2">
                        <feather-icon icon="Edit2Icon" :svgClasses="[{'text-primary stroke-current': mailingFilter == 'drafts'}, 'h-6 w-6']"></feather-icon>
                        <span class="text-lg ml-3">Черновики</span>
                    </div>
                    <template v-if="mailingMeta.draftMails">
                      <vs-chip class="number" color="warning" v-if="mailingMeta.draftMails.length > 0">{{ mailingMeta.draftMails.length }}</vs-chip>
                    </template>
                </router-link>
            </div>
            <vs-divider></vs-divider>
            <div class="mailing__labels px-6 py-4">
                <h5 class="mb-8">Категории</h5>
                <div class="mailing__lables-list">
                    <router-link tag="span" class="mailing__label flex items-center mb-4 cursor-pointer" v-for="(tag, index) in mailingCats" :key="index" :to="`${baseUrl}/${tag.value}`">
                        <div class="ml-1 h-3 w-3 rounded-full mr-4" :class="'border-2 border-solid border-' + tag.color"></div>
                        <span class="text-lg" :class="{'text-primary': mailingFilter == tag.value}">{{ tag.text }}</span>
                    </router-link>
                </div>
            </div>
        </component>
    </div>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    mailingCats: {
      type: Array,
      required: true
    },
    mailingFilter: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      activePrompt: false,
      form: {
        ru_title: '',
        en_title: '',
        uz_title: '',
        ru_description: '',
        en_description: '',
        uz_description: '',
        category: 'news',
      },

      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.30
      }
    }
  },
  computed: {
    ...mapState(['organization']),
    ...mapState('mailing', ['meta']),
    validateForm () {
      return !this.errors.any() && this.mailingTo !== ''
    },
    baseUrl () {
      const path = this.$route.path
      return path.slice(0, path.lastIndexOf('/'))
    },
    mailingMeta () {
      return this.meta;
    },
    scrollbarTag () { return this.$store.getters.scrollbarTag }
  },
  methods: {
    ...mapActions('mailing', ['saveToDrafts']),
    clearFields () {
      this.$nextTick(() => {
        for(let key in this.form){
          this.form[key] = '';
        }
        this.form.category = 'news';
      })
    },

    async saveMailingToDrafts() {
      await this.$validator.validateAll('newMailing');
      if (this.errors.any()) {
        this.$vs.notify({
          title: "Неверный ввод",
          text: "Проверьте правильность заполненных данных",
          color: "warning",
          position: "top-center",
        });
        return;
      }

      const formData = new FormData();
      Object.keys(this.form).forEach((key) => {
        if (this.form[key] !== null && this.form[key] !== undefined && !(this.form[key] instanceof Object))
          formData.append(key, this.form[key]);
      });

      let file = this.$refs.mailingThumbnail.filesx[this.$refs.mailingThumbnail.filesx.length - 1];
      formData.append('thumbnail', file);
      for (let x = 0; x < this.$refs.mailingAttachments.filesx.length; x++) {
          formData.append("files[]", this.$refs.mailingThumbnail.filesx[x]);
      }
      formData.append('after_date_time', this.form.after_date_time ? this.form.after_date_time : new Date().toISOString());
      formData.append('organizationId', this.organization.id);
      return this.saveToDrafts(formData).then(() => {
        this.activePrompt = false;
        this.$vs.notify({
          title: "Отлично",
          text: "Шаблон создан",
          color: "success",
          position: "top-center",
        });
      });
    },

    sendMailing () {
      this.clearFields()
    }
  },
  components: {
    VuePerfectScrollbar
  }
}

</script>

