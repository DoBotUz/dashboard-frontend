<template>
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
      v-validate="'required|max:255'"
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
      v-validate="'required|max:255'"
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
    </vs-collapse>

    <vs-select label="Категория" v-model="form.category">
      <vs-select-item
        v-for="(item, index) in mailingCats"
        :key="index"
        :value="item.value"
        :text="item.text"
      />
    </vs-select>
    <div class="flex mt-5 mb-3 p-5 float-right">
      <vs-button
        class="mr-5"
        @click="onSaveToDrafts"
        color="primary"
        type="border"
      >Сохранить в черновики</vs-button>
      <vs-button @click="onMailingSend" color="success" icon="send">Отправить</vs-button>
    </div>
  </form>
</template>
<script>
import { mapState } from 'vuex';

export default {
  props: {
    mailingCats: {
      type: Array,
      required: true,
    },
    formFields: {
      type: Object,
      required: false,
      default: {},
    },
  },
  data() {
    let form = {
      ru_title: "",
      en_title: "",
      uz_title: "",
      ru_description: "",
      en_description: "",
      uz_description: "",
      category: "news",
    }
    for (let key in form) {
      if (this.formFields[key]) {
        form[key] = this.formFields[key];
      }
    }
    return {
      form,
    };
  },
  computed: {
    ...mapState(["organization"]),
    validateForm() {
      return !this.errors.any() && this.mailingTo !== "";
    },
  },
  methods: {
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
      for (let x = 0; x < this.$refs.mailingAttachments.filesx.length; x++) {
        formData.append("files[]", this.$refs.mailingThumbnail.filesx[x]);
      }
      formData.append(
        "after_date_time",
        this.form.after_date_time
          ? this.form.after_date_time
          : new Date().toISOString()
      );
      formData.append("organizationId", this.organization.id);
    },
    async onMailingSend() {
      if (!(await this.isFormValid())) {
        return;
      }
      this.$emit("on-send");
    },
    async onSaveToDrafts() {
      if (!(await this.isFormValid())) {
        return;
      }

      this.$emit("on-draft", this.buildFormData());
    },
  },
};
</script>