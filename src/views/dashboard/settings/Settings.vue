<template>
  <div>
    <vx-card>
      <vs-input class="w-full mb-8" label="Название заведения на русском" v-model="organizationObj.title" />
      <vs-textarea label="Описание заведения на русском" v-model="organizationObj.ru_description" />
      <vs-textarea label="Описание заведения на английском" v-model="organizationObj.en_description" />
      <vs-textarea label="Описание заведения на узбекском" v-model="organizationObj.uz_description" />
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
            />
          </vs-col>
      </vs-row>
      <vs-input class="w-full mb-8" label="Токен" v-model="token"/>
      <vs-alert title="Предупреждение" active="true" color="warning">
        Изменение статуса влиет на работу телеграм бота.
      </vs-alert>
      <div class="con-select-example">
        <vs-select
        class="selectExample"
        label="Статус"
        v-model="organizationObj.status"
        >
          <vs-select-item v-for="(item, index) in statuses" :key="index" :value="item.value" :text="item.text" />
        </vs-select>
      </div>
      <div class="flex flex-wrap items-center justify-end">
        <vs-button class="ml-auto mt-2" @click="save">Сохранить</vs-button>
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
import { mapActions, mapGetters, mapState } from "vuex";
import telegramApi from '@/api/telegram';

export default {
  data() {
    return {
      token: '',
      statuses: [
        {
          text: 'Активен',
          value: 10
        },
        {
          text: 'Не активен',
          value: 11
        },
      ]
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
  methods: {
    ...mapActions('organizations', ['getOrganization', 'updateOrganization', 'deleteOrganization']),
    async save() {
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
          return false;
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
  computed: {
    ...mapState(['organization']),
    ...mapState('organizations', ['organizationObj']),
  },
  async mounted() {
    await this.getOrganization(this.organization.id);
    this.token = this.organization.bot.token;
  }
};
</script>
<style lang="scss" scoped>
</style>
