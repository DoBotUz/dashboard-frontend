<template>
  <div>
    <div class="knowledge-base-jumbotron">
      <div class="knowledge-base-jumbotron-content sm:p-16 p-8 rounded-lg mb-base">
        <h1>Ваши заведения</h1>
      </div>
    </div>
    <div class="organizations" id="organizations-div">
      <organization
        v-for="organization in organizations"
        :key="organization.id"
        :id="organization.id"
        :title="organization.title"
        :description="organization.ru_description"
        :thumbnail="organization.thumbnail"
      />
      <vx-card class="cursor-pointer organizations__add" @click="addPopup = true" style="min-height: 286px;">
        <h1 class="organizations__add__plus mb-5">➕</h1>
        <h4>Добавить заведение</h4>
      </vx-card>
    </div>
    <vs-popup title="Добавить новое заведение" :active.sync="addPopup">
      <vs-input
        class="w-full mb-3"
        label="Название заведения"
        v-model="organization_title"
        name="organization_title"
        data-vv-as="Название заведения"
        v-validate="'required'"
      />
      <span class="text-danger text-sm">{{ errors.first('organization_title') }}</span>
      <vs-textarea
        class="w-full mb-3"
        label="Описание заведения"
        v-model="organization_description"
        name="organization_description"
        data-vv-as="Описание заведения"
        v-validate="'required'"
      />
      <span class="text-danger text-sm">{{ errors.first('organization_description') }}</span>
      <vs-input
        class="w-full mb-3"
        label="Токен бота"
        v-model="token"
        name="token"
        data-vv-as="Токен бота"
        v-validate="'required'"
      />
      <span class="text-danger text-sm">{{ errors.first('token') }}</span>
      <div></div>
      <vs-button class="mb-3" @click="tokenPopup=true" color="primary" type="line">Как получить токен бота?</vs-button>
      <vs-button class="w-full" @click="addNewOrg" color="primary" :disabled="!validateForm" >Добавить</vs-button>

      <vs-popup title="Как получить токен от бота?" :active.sync="tokenPopup">
        <p>Заходите в @botfather и без задней мысли получаете токен</p>
      </vs-popup>
    </vs-popup>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import telegramApi from '@/api/telegram';
import Organization from "./components/Organization";

export default {
  components: {
    Organization,
  },
  data() {
    return {
      organization_title: '',
      organization_description: '',
      token: '',
      addPopup: false,
      tokenPopup: false,
    }
  },
  head: {
    title() {
      return {
        inner: 'Ваши заведения',
      }
    },
  },
  computed: {
    ...mapGetters({
      'organizations': 'organizations/organizations',
    }),

    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    ...mapActions('organizations', ['fetchOrganizations', 'addOrganization']),
    async addNewOrg() {
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

      const is_valid_token = await this.isValidToken();
      if (!is_valid_token) {
        return this.$vs.notify({
          title: 'Ошибка',
          text: 'Неверный токен',
          color: 'danger',
          position: 'bottom-right',
        });
      }

      this.addOrganization({
        name: this.organization_title,
        description: this.organization_description,
        token: this.token
      }).then(() => {
          this.addPopup = false;
          this.$vs.notify({
            title: 'Отлично',
            text: 'Вы успешно создали магазин',
            color: 'success',
            position: 'top-center'
          });
      });
    },
    isValidToken() {
      return new Promise((resolve) => {
        telegramApi.getMe(this.token).then(res => {
          resolve(res.data.ok);
        })
        .catch(() => {
          resolve(false);
        })
      });
    }
  },
  mounted() {
    this.$vs.loading({
      container: '#organizations-div',
      scale: 0.6
    });
    this.fetchOrganizations().then(() => {
       this.$vs.loading.close('#organizations-div > .con-vs-loading')
    });
  },
};
</script>
<style lang="scss" scoped>
.knowledge-base-jumbotron-content {
  background-image: url("../../assets/images/pages/vuexy-login-bg.jpg");
  background-size: cover;
}
.organizations {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 30px;
  &__add {
    font-size: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  }
}
</style>
