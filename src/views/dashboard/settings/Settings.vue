<template>
  <div>
    <vx-card no-shadow>
      <vs-input class="w-full mb-8" label="Название заведения на русском" v-model="organizationObj.ru_title" />
      <vs-textarea label="Описание заведения на русском" v-model="organizationObj.ru_description" />
      <vs-input class="w-full mb-8" label="Название заведения на английском" v-model="organizationObj.en_title" />
      <vs-textarea label="Описание заведения на английском" v-model="organizationObj.en_description" />
      <vs-input class="w-full mb-8" label="Название заведения на узбекском" v-model="organizationObj.uz_title" />
      <vs-textarea label="Описание заведения на узбекском" v-model="organizationObj.uz_description" />
      <div v-if="organizationObj.thumbnail">
        <img :src="`${$url}/public/organizations/${organizationObj.thumbnail}`" alt="" width="64" height="64">
      </div>
      <div class="vx-col w-full">
        <vs-upload
          :limit="1"
          :show-upload-button="false"
          text="Загрузить изображение"
          ref="organzationThumbnail"
        />
      </div>
      <vs-input class="w-full mb-8" label="Токен" v-model="token"/>
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
  </div>
</template>
<script>
import { mapActions, mapGetters, mapState } from "vuex";

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
          value: 0
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
    ...mapActions('organizations', ['getOrganization', 'updateOrganization']),
    save() {
      const file = this.$refs.organzationThumbnail.filesx[this.$refs.organzationThumbnail.filesx.length - 1];
      const formData = new FormData();
      Object.keys(this.organizationObj).forEach((key) => {
        if (this.organizationObj[key] !== null && this.organizationObj[key] !== undefined && !(this.organizationObj[key] instanceof Object))
          formData.append(key, this.organizationObj[key]);
      });
      formData.append('thumbnail', file);
      formData.append('bot', JSON.stringify({
          id: this.organization,
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
  },
  computed: {
    ...mapState(['organization']),
    ...mapState('organizations', ['organizationObj']),
  },
  async mounted() {
    await this.getOrganization(this.organization);
    this.token = this.organizationObj.bot.token;
  }
};
</script>
<style lang="scss" scoped>
</style>
