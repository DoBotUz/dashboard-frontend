<template>
  <div>
    <form @submit.prevent data-vv-scope="promocodeForm">
      <vs-input
        class="w-full mb-6"
        label="Заголовок на русском"
        v-model="form.ru_title"
        name="ru_title"
        v-validate="'required|min:3|max:255'"
        data-vv-as="Заголовок на русском"
        :color="!errors.has('promocodeForm.ru_title') ? 'success' : 'danger'"
      />
      <span
        class="text-danger text-sm"
        v-show="errors.has('promocodeForm.ru_title')"
      >{{ errors.first('promocodeForm.ru_title') }}</span>


      <div class="flex mt-10 mb-3 p-5 float-right">
        <vs-button
          class="mt-5 mb-3"
          @click="addOrUpdatPromocode"
          color="primary"
          :disabled="!validateForm"
        >Сохранить</vs-button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapState } from 'vuex';

const FORM_BASE = {
  id: null,
  ru_title: "",
}

export default {
  name: 'PromocodeForm',

  props: {
    formFields: {
      type: Object,
      required: false,
      default: function () {
        return {};
      }
    },
  },

  data() {
    return {
      form: {},
    }
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
      return !this.errors.any();
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
      this.errors.clear('promocodeForm');
      this.$nextTick(() => {
          this.$validator.reset();
      });
    },

    async isFormValid() {
      await this.$validator.validateAll("promocodeForm");
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
      formData.append("organizationId", this.organization.id);
      return formData;
    },

    async addOrUpdatPromocode() {
      if (!(await this.isFormValid())) {
        return;
      }

      this.$emit("on-mailing", this.buildFormData());
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
}
</script>
