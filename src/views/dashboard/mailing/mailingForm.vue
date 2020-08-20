<template>
  <form @submit.prevent data-vv-scope="newMailing">
    <vs-input
      class="w-full mb-6"
      label="Заголовок на русском"
      v-model="form.ru_title"
      name="ru_title"
      v-validate="'required|min:3|max:255'"
      data-vv-as="Заголовок на русском"
      :color="!errors.has('newMailing.ru_title') ? 'success' : 'danger'"
    />
    <span
      class="text-danger text-sm"
      v-show="errors.has('newMailing.ru_title')"
    >{{ errors.first('newMailing.ru_title') }}</span>

    <vs-textarea
      class="w-full mb-3"
      label="Описание на русском"
      v-model="form.ru_description"
      name="ru_description"
      v-validate="'required'"
      data-vv-as="Описание на русском"
      :color="!errors.has('newMailing.ru_description') ? 'success' : 'danger'"
    />
    <span
      class="text-danger text-sm"
      v-show="errors.has('newMailing.ru_description')"
    >{{ errors.first('newMailing.ru_description') }}</span>

    <vs-input
      class="w-full mb-6"
      label="Заголовок на английском"
      v-model="form.en_title"
      name="en_title"
      v-validate="'required|min:3|max:255'"
      data-vv-as="Заголовок на английском"
      :color="!errors.has('newMailing.en_title') ? 'success' : 'danger'"
    />
    <span
      class="text-danger text-sm"
      v-show="errors.has('newMailing.en_title')"
    >{{ errors.first('newMailing.en_title') }}</span>

    <vs-textarea
      class="w-full mb-3"
      label="Описание на английском"
      v-model="form.en_description"
      name="en_description"
      v-validate="'required'"
      data-vv-as="Описание на английском"
      :color="!errors.has('newMailing.en_description') ? 'success' : 'danger'"
    />
    <span
      class="text-danger text-sm"
      v-show="errors.has('newMailing.en_description')"
    >{{ errors.first('newMailing.en_description') }}</span>

    <vs-input
      class="w-full mb-6"
      label="Заголовок на узбекском"
      v-model="form.uz_title"
      name="uz_title"
      v-validate="'required|min:3|max:255'"
      data-vv-as="Заголовок на узбекском"
      :color="!errors.has('newMailing.uz_title') ? 'success' : 'danger'"
    />
    <span
      class="text-danger text-sm"
      v-show="errors.has('newMailing.uz_title')"
    >{{ errors.first('newMailing.uz_title') }}</span>

    <vs-textarea
      class="w-full mb-3"
      label="Описание на узбекском"
      v-model="form.uz_description"
      name="uz_description"
      v-validate="'required'"
      data-vv-as="Описание на узбекском"
      :color="!errors.has('newMailing.uz_description') ? 'success' : 'danger'"
    />
    <span
      class="text-danger text-sm"
      v-show="errors.has('newMailing.uz_description')"
    >{{ errors.first('newMailing.uz_description') }}</span>

    <vs-row>
        <vs-col vs-w="3" v-if="form.thumbnail">
          <div class="img-container mb-4" style="margin-top: 25px;">
            <img :src="`${$url}/public/mailing-templates/${form.thumbnail}`" class="w-full" />
          </div>
        </vs-col>
        <vs-col vs-w="9">
          <vs-upload
            :limit="1"
            :show-upload-button="false"
            :text="form.thumbnail ? 'Заменить изображение' : 'Загрузить изображение'"
            ref="mailingThumbnail"
            accept="image/*"
          />
        </vs-col>
    </vs-row>

    <div class="vx-col w-full">

    </div>
    <!-- <vs-collapse type="border">
      <vs-collapse-item icon-arrow="attach_file">
        <div slot="header">Прикрепить файлы</div>Выберите файлы которые будут отправлены вместе с оповщением, это могут быть картинки / документы / видео
        <vs-alert active="true">Отправка прикрепленных файлов может занять долгое время.</vs-alert>
        <div></div>
        <vs-upload
          multiple
          text="Прикрепить файлы"
          ref="mailingAttachments"
          :show-upload-button="false"
          class="compose-mailing-attachment"
        />
      </vs-collapse-item>
    </vs-collapse> -->

    <vs-select label="Категория" v-model="form.category">
      <vs-select-item
        v-for="(item, index) in mailingCats"
        :key="index"
        :value="item.value"
        :text="item.text"
      />
    </vs-select>
    <h5 class="mb-2 mt-2">Дата начала рассылки</h5>
    <flat-pickr
      :config="configdateTimePicker"
      v-model="form.after_date_time"
      placeholder="Укажите дату начала рассылки"
      class="w-1/2 mr-auto"
    />
    <div class="flex mt-10 mb-3 p-5 float-right">
      <div v-if="formFields.id">
        <vs-button
          class="mr-5"
          @click="onSaveToDrafts"
          color="success"
        >Сохранить</vs-button>
      </div>
      <div class="flex" v-else>
        <vs-button
          class="mr-5"
          @click="onSaveToDrafts"
          color="primary"
          type="border"
        >Сохранить в черновики</vs-button>
        <vs-button @click="onMailingSend" color="success" icon="send">Начать рассылку</vs-button>
      </div>
    </div>
  </form>
</template>
<script>
import { mapState } from 'vuex';
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

const FORM_BASE = {
  id: null,
  thumbnail: null,
  ru_title: "",
  en_title: "",
  uz_title: "",
  ru_description: "",
  en_description: "",
  uz_description: "",
  after_date_time: null,
  category: "news",
}

export default {
  props: {
    mailingCats: {
      type: Array,
      required: true,
    },
    formFields: {
      type: Object,
      required: false,
      default: function () {
        return {};
      }
    },
  },
  components: {
    flatPickr,
  },
  data() {
    return {
      form: {},
      configdateTimePicker: {
        enableTime: true,
        dateFormat: "d-m-Y H:i",
        minDate: new Date(),
        time_24hr: true,
      },
    };
  },
  watch: {
    formFields: {
      handler(newForm){
        for (let key in FORM_BASE) {
          if(typeof newForm[key] !== 'undefined')
            this.form[key] = newForm[key];
        }
      },
      deep: true
    }
  },
  computed: {
    ...mapState(["organization"]),
    validateForm() {
      return !this.errors.any() && this.mailingTo !== "";
    },
  },
  methods: {
    clearForm() {
      if(!this.form.id) {
        for (let key in this.form) {
          this.form[key] = FORM_BASE[key];
        }
        this.errors.clear('newMailing');
        this.$nextTick(() => {
            this.$validator.reset();
        });
      }
      for(let i =0; i<this.$refs.mailingThumbnail.filesx.length; i++) {
        this.$refs.mailingThumbnail.removeFile(i);
      }
    },

    clearErrors() {
      this.errors.clear('newMailing');
      this.$nextTick(() => {
          this.$validator.reset();
      });
    },

    async isFormValid() {
      await this.$validator.validateAll("newMailing");
      if (this.errors.any()) {
        this.$vs.notify({
          title: "Неверный ввод",
          text: "Проверьте правильность заполненных данных",
          color: "warning",
          position: "top-center",
        });
        return false;
      }
      return true;
    },

    buildFormData() {
      const formData = new FormData();
      Object.keys(this.form).forEach((key) => {
        if (
          this.form[key] !== null &&
          this.form[key] !== undefined &&
          !(this.form[key] instanceof Object)
        )
          formData.append(key, this.form[key]);
      });

      let file = this.$refs.mailingThumbnail.filesx[
        this.$refs.mailingThumbnail.filesx.length - 1
      ];
      formData.append("thumbnail", file);
      // for (let x = 0; x < this.$refs.mailingAttachments.filesx.length; x++) {
      //   formData.append("files[]", this.$refs.mailingThumbnail.filesx[x]);
      // }
      formData.set(
        "after_date_time",
        this.form.after_date_time
          ? new Date().toISOString(this.form.after_date_time)
          : new Date().toISOString()
      );
      formData.append("organizationId", this.organization.id);
      return formData;
    },

    async onMailingSend() {
      if (!(await this.isFormValid())) {
        return;
      }

      this.$emit("on-mailing", this.buildFormData());
    },

    async onSaveToDrafts() {
      if (!(await this.isFormValid())) {
        return;
      }

      this.$emit("on-draft", this.buildFormData());
    },
  },

  created(){
    let newForm = Object.assign({}, FORM_BASE);
    for (let key in newForm) {
      if (typeof this.formFields[key] !== 'undefined') {
        newForm[key] = this.formFields[key];
      }
    }
    this.form = newForm;
  },
};
</script>
