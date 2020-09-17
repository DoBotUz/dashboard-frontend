<template>
  <div>
    <form @submit.prevent data-vv-scope="promocodeForm">
      <div class="vx-row">
        <div class="mb-4 vx-col w-full">
          <label for="" class="mb-5">Тип промокода</label>
          <ul class="flex mt-2 mb-2">
            <li v-for="type in typeOptions" :key="type.value" class="mr-6">
              <vs-radio v-model="form.type" :vs-value="Number(type.value)">{{ type.label }}</vs-radio>
            </li>
          </ul>
        </div>
        <div class="mb-4 vx-col w-full types-discount">
            <div v-if="form.type === 10">
               <!-- % discrount type -->
                <vs-input
                  class="w-full mb-6"
                  label="% скидки (от 1 до 100)"
                  v-model="form.discount"
                  name="discount"
                  v-validate="'required|integer|between:0,100'"
                  data-vv-as="% скидки"
                  :color="!errors.has('promocodeForm.discount') ? 'success' : 'danger'"
                  placeholder="10"
                />
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('promocodeForm.discount')"
                >{{ errors.first('promocodeForm.discount') }}</span>
            </div>
            <div v-else-if="form.type === 11">
               <!-- Amount money discrount type -->
                <vs-input
                  class="w-full mb-6"
                  label="Сумма скидки (сум)"
                  v-model="form.discount"
                  name="discount"
                  v-validate="'required|numeric|min_value:0'"
                  data-vv-as="Сумма скидки"
                  :color="!errors.has('promocodeForm.discount') ? 'success' : 'danger'"
                  placeholder="10 000 сум"
                />
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('promocodeForm.discount')"
                >{{ errors.first('promocodeForm.discount') }}</span>
            </div>
            <div v-else-if="form.type === 12">
               <!-- Free shipment -->
                <vs-input
                  class="w-full mb-6"
                  label="Максимальное растояние км."
                  v-model="form.discount"
                  name="discount"
                  v-validate="'required|numeric|min_value:1'"
                  data-vv-as="Максимальное растояние км."
                  :color="!errors.has('promocodeForm.discount') ? 'success' : 'danger'"
                  placeholder="3"
                />
                <span
                  class="text-danger text-sm"
                  v-show="errors.has('promocodeForm.discount')"
                >{{ errors.first('promocodeForm.discount') }}</span>
            </div>
            <div v-else-if="form.type === 13">
               <!-- Free items -->
                <v-select multiple :closeOnSelect="false" v-model="form.items" :options="itemOptions" /><br>
                <div v-for="(item, index) in form.items" :key="index" classs="vx-col md:w-1/2">
                  <vs-input
                    class="w-full mb-4"
                    :label="`${item.label} - Кол-во`"
                    v-model="item.amount"
                    :name="`item-amount-${index}`"
                    v-validate="'required|integer|min_value:1'"
                    :data-vv-as="`${item.label} - Кол-во`"
                    :color="!errors.has(`promocodeForm.item-amount-${index}`) ? 'success' : 'danger'"
                    placeholder="1"
                  />
                  <span
                    class="text-danger text-sm"
                    v-show="errors.has(`promocodeForm.item-amount-${index}`)"
                  >{{ errors.first(`promocodeForm.item-amount-${index}`) }}</span>
                </div>
            </div>
            <div v-else-if="form.type === 14">
               <!-- Other -->
              <vs-textarea
                class="w-full mb-3"
                label="Комментарий"
                v-model="form.comment"
                name="comment"
                v-validate="'required|max:2048'"
                data-vv-as="Комментарий"
                :color="!errors.has('promocodeForm.comment') ? 'success' : 'danger'"
              />
              <span
                class="text-danger text-sm"
                v-show="errors.has('promocodeForm.comment')"
              >{{ errors.first('promocodeForm.comment') }}</span>
            </div>
        </div>
        <div class="mb-4 vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mb-6"
            label="Промокод"
            v-model="form.slug"
            name="slug"
            v-validate="'required|min:3|max:255'"
            data-vv-as="Промокод"
            :color="!errors.has('promocodeForm.slug') ? 'success' : 'danger'"
            placeholder="DOBOT2020"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('promocodeForm.slug')"
          >{{ errors.first('promocodeForm.slug') }}</span>
        </div>
        <div class="mb-4 vx-col md:w-1/2 w-full">
          <vs-input
            class="w-full mb-6"
            label="Доступное кол-во (0 если неограничено)"
            v-model="form.left"
            name="left"
            v-validate="'required|integer|min_value:0'"
            data-vv-as="Доступное кол-во"
            :color="!errors.has('promocodeForm.left') ? 'success' : 'danger'"
            placeholder="99999"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('promocodeForm.left')"
          >{{ errors.first('promocodeForm.left') }}</span>
        </div>

        <div class="mb-4 vx-col md:w-1/2 w-full">
          <h5 class="">Начало действия промокода</h5>
          <flat-pickr
            :config="configdateTimePicker"
            v-model="form.start_datetime"
            placeholder="Укажите начало действия промокода"
            class="w-full mr-auto"
            name="start_datetime"
            v-validate="'required'"
            data-vv-as="Начало действия промокода"
            :color="!errors.has('promocodeForm.start_datetime') ? 'success' : 'danger'"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('promocodeForm.start_datetime')"
          >{{ errors.first('promocodeForm.start_datetime') }}</span>
        </div>
        <div class="mb-4 vx-col md:w-1/2 w-full">
          <h5 class="">Конец действия промокода</h5>
          <flat-pickr
            :config="configdateTimePicker"
            v-model="form.end_datetime"
            placeholder="Укажите конец действия промокода"
            class="w-full mr-auto"
          />
          <span
            class="text-danger text-sm"
            v-show="errors.has('promocodeForm.end_datetime')"
          >{{ errors.first('promocodeForm.end_datetime') }}</span>
        </div>
        <div class="mb-4 vx-col md:w-1/2 w-full">
          <vs-select label="Статус" v-model="form.status">
            <vs-select-item
              v-for="(item, index) in statusOptions"
              :key="index"
              :value="item.value"
              :text="item.label"
            />
          </vs-select>
        </div>
      </div>
        <div class="flex mt-5 mb-3 p-5 float-right">
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
import { mapState, mapGetters, mapActions } from 'vuex';
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";

const FORM_BASE = {
  id: null,
  type: 10,
  status: 10,
  slug: '',
  left: 1,
  start_datetime: null,
  end_datetime: null,
  items: [],
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

  components: {
    flatPickr,
  },

  data() {
    return {
      form: {},
      products: null,
      configdateTimePicker: {
        dateFormat: "d-m-Y H:i",
        time_24hr: true,
      },
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
    },
    'form.type': {
      handler(newType){
        //Clear old discount items.
        this.form.discount = '';
        this.form.items = [];
      },
    }
  },

  computed: {
    ...mapState(["organization"]),
    ...mapGetters('promocodes', {
      'statuseOptions': 'statuseOptions',
      'typeOptions': 'typeOptions',
      'statusOptions': 'statusOptions',
    }),

    validateForm() {
      return !this.errors.any();
    },

    itemOptions() {
      let out = [];

      if (this.products) {
        for(let i =0;i<this.products.length; i++){
          out.push({
            label: this.products[i].ru_title,
            value: this.products[i].id,
            amount: 1
          })
        }
      }

      return out;
    },
  },

  methods: {
    ...mapActions('menu', ['fetchProducts']),
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

    this.fetchProducts().then((res) => {
      this.products = res.data;
    })
  },
}
</script>
