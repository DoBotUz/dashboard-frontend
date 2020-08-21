<template>
  <div>
    <vx-card>
      <vs-input
        class="w-full mt-8"
        label="Название заведения на русском"
        v-model="organizationObj.title" name="organization_title"
        data-vv-as="Название заведения"
        v-validate="'required|max:255'"
      />
      <span class="text-danger text-sm">{{ errors.first('organization_title') }}</span>

    <vs-textarea
      class="w-full mt-8"
      label="Описание заведения на русском"
      v-model="organizationObj.ru_description"
      name="ru_description"
      data-vv-as="Описание на русском"
      v-validate="'required'"
    />
    <span class="text-danger text-sm">{{ errors.first('ru_description') }}</span>

    <vs-textarea class="w-full mt-8" label="Описание заведения на английском"
      v-model="organizationObj.en_description"
      name="en_description"
      data-vv-as="Описание на английском"
      v-validate="'required'"
    />
    <span class="text-danger text-sm">{{ errors.first('en_description') }}</span>

    <vs-textarea
      class="w-full mt-8"
      label="Описание заведения на узбекском"
      v-model="organizationObj.uz_description"
      name="uz_description"
      data-vv-as="Описание на узбекском"
      v-validate="'required'"
    />
    <span class="text-danger text-sm">{{ errors.first('uz_description') }}</span>

      <vs-row>
          <vs-col vs-w="3" id="avatar-col" v-if="organizationObj.thumbnail">
            <div class="img-container mb-4" style="margin-top: 25px;">
              <img :src="`${$url}/public/organizations/${organizationObj.thumbnail}`" class="rounded w-full" />
            </div>
          </vs-col>
          <vs-col vs-w="9">
            <vs-upload
              :limit="1"
              :show-upload-button="false"
              :text="organizationObj.thumbnail ? 'Заменить изображение' : 'Загрузить изображение'"
              ref="organzationThumbnail"
              accept="image/*"
            />
          </vs-col>
      </vs-row>
      <vs-alert title="Предупреждение" active="true" color="warning">
        Изменение токена, статуса влиет на работу телеграм бота.
      </vs-alert>
      <vs-input class="w-full mt-8 mb-3" label="Токен" v-model="token"/>
      <div class="con-select-example">
        <label class="mb-1 block">Статус</label>
        <vs-switch color="success" v-model="isOrganizationActive" :disabled="organization_loading">
          <span slot="on">Активен</span>
          <span slot="off">Выключен</span>
        </vs-switch>
        <!-- <vs-select
        class="selectExample"
        label="Статус"
        v-model="organizationObj.status"
        >
          <vs-select-item v-for="(item, index) in statuses" :key="index" :value="item.value" :text="item.text" />
        </vs-select> -->
      </div>
      <div class="flex flex-wrap items-center justify-end">
        <vs-button class="ml-auto mt-2" @click="save" :disabled="!validateForm">Сохранить</vs-button>
      </div>
    </vx-card>
    <vx-card style="margin-top: 20px;">
      <vs-alert title="Опасно" active="true" color="danger" style="margin-bottom: 10px;">
        Удаление приведет к удалению всех данных о заведении!
      </vs-alert>
      <vs-button color="danger" type="border" @click="openDeleteSureDialog">Удалить заведение</vs-button>
    </vx-card>
  </div>
</template>
<script>
import { mapActions, mapState } from "vuex";
import telegramApi from '@/api/telegram';

export default {
  data() {
    return {
      token: '',
    };
  },

  head: {
    title() {
      return {
        inner: 'Настройки',
        complement: 'DoBot'
      }
    },
  },

  computed: {
    ...mapState(['organization', 'organization_loading']),
    ...mapState('organizations', ['organizationObj']),

    validateForm () {
      return !this.errors.any()
    },
    isOrganizationActive: {
      get() {
        return this.organization.bot.status === 10
      },
      set (val) {
        let status = val ? 10 : 11;
        return this.switchOrganizationStatus({
          id: this.organization.id,
          status
        });
      }
    }
  },

  methods: {
    ...mapActions('organizations', ['getOrganization', 'updateOrganization', 'deleteOrganization']),
    ...mapActions(['switchOrganizationStatus']),
    async save() {
      await this.$validator.validateAll();
      if (this.errors.any()) {
        this.$vs.notify({
          title: "Неверный ввод",
          text: "Проверьте правильность заполненных данных",
          color: "warning",
          position: "top-center",
        });
        return;
      }

      let is_valid_token = await this.isValidToken();
      if (!is_valid_token) {
        return this.$vs.notify({
          title: "Ошибка",
          text: "Неверный токен",
          color: "danger",
          position: "bottom-right",
        });
      }
      const file = this.$refs.organzationThumbnail.filesx[this.$refs.organzationThumbnail.filesx.length - 1];
      const formData = new FormData();
      Object.keys(this.organizationObj).forEach((key) => {
        if (this.organizationObj[key] !== null && this.organizationObj[key] !== undefined && !(this.organizationObj[key] instanceof Object))
          formData.append(key, this.organizationObj[key]);
      });
      formData.append('thumbnail', file);
      formData.set('bot', JSON.stringify({
          id: this.organization.id,
          token: this.token,
      }));
      this.updateOrganization(formData).then(() => {
        this.$vs.notify({
          title: "Отлично",
          text: "Изменения внесены",
          color: "success",
          position: "top-center",
        });
      });
    },
    isValidToken() {
      return new Promise((resolve, reject) => {
        telegramApi.getMe(this.token).then(res => {
          resolve(res.data.ok);
        })
        .catch(res => {
          resolve(false);
        })
      });
    },
    openDeleteSureDialog() {
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Удалить заведение`,
        acceptText: 'Удалить',
        cancelText: 'Отмена',
        text: `Вы уверены в том что хотите удалить ${this.organizationObj.title} ?`,
        accept: this.acceptDelete
      })
    },
    acceptDelete(){
      this.deleteOrganization(this.organizationObj.id).then(() => {
        this.$vs.notify({
          title: "Отлично",
          text: "Заведение было успешно удалено",
          color: "success",
          position: "top-center",
        });
        this.$router.push('/');
      })
    },
  },

  async mounted() {
    await this.getOrganization(this.organization.id);
    this.token = this.organization.bot.token;
  }
};
</script>
<style lang="scss" scoped>
</style>
