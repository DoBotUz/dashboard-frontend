<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
    id="page-login"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center">
            <div class="vx-col sm:w-full md:w-full lg:w-1/2 d-theme-dark-bg">
              <div class="p-8 login-tabs-container">
                <div>
                  <vs-tabs v-model="activeTab">
                    <vs-tab label="Войти">
                      <vs-input
                        name="email"
                        icon-no-border
                        icon="icon icon-mail"
                        icon-pack="feather"
                        label="Email"
                        data-vv-as="Email"
                        v-model="email"
                        class="w-full mt-6"
                        v-validate="'required|email'"
                      />
                      <span class="text-danger text-sm">{{ errors.first('email') }}</span>

                      <vs-input
                        type="password"
                        name="password"
                        icon-no-border
                        icon="icon icon-lock"
                        icon-pack="feather"
                        label="Пароль"
                        data-vv-as="Пароль"
                        v-model="password"
                        class="w-full mt-6"
                        v-validate="'required|min:6'"
                        @keyup.enter.native="signIn"
                      />
                      <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                      <vs-button class="float-right mt-6" @click="signIn">Войти</vs-button>
                    </vs-tab>

                    <vs-tab label="Регистрация">
                      <vs-input
                        name="name"
                        icon-no-border
                        icon="icon icon-user"
                        icon-pack="feather"
                        label="Имя"
                        data-vv-as="Имя"
                        v-model="first_name"
                        class="w-full mt-6"
                        v-validate="'required|min:1'"
                      />
                      <span class="text-danger text-sm">{{ errors.first('name') }}</span>

                      <vs-input
                        name="last_name"
                        icon-no-border
                        icon="icon icon-user"
                        icon-pack="feather"
                        label="Фамилия"
                        data-vv-as="Фамилия"
                        v-model="last_name"
                        class="w-full mt-6"
                        v-validate="'required'"
                      />
                      <span class="text-danger text-sm">{{ errors.first('last_name') }}</span>

                      <vs-input
                        name="email"
                        icon-no-border
                        icon="icon icon-mail"
                        icon-pack="feather"
                        label="Email"
                        data-vv-as="Email"
                        v-model="email"
                        class="w-full mt-6"
                        v-validate="'required|email'"
                      />
                      <span class="text-danger text-sm">{{ errors.first('email') }}</span>

                      <vs-input
                        ref="password"
                        type="password"
                        name="password"
                        icon-no-border
                        icon="icon icon-lock"
                        icon-pack="feather"
                        label="Пароль"
                        data-vv-as="Пароль"
                        v-model="password"
                        class="w-full mt-6"
                        v-validate="'required|min:6'"
                      />
                      <span class="text-danger text-sm">{{ errors.first('password') }}</span>

                      <vs-input
                        type="password"
                        name="password_confirmation"
                        icon-no-border
                        icon="icon icon-lock"
                        icon-pack="feather"
                        label="Подтверждение пароля"
                        data-vv-as="Подтверждение пароля"
                        v-model="password_confirmation"
                        class="w-full mt-6"
                        v-validate="'required|confirmed:password'"
                        @keyup.enter.native="signUp"
                      />
                      <span class="text-danger text-sm">{{ errors.first('password_confirmation') }}</span>
                      <vs-button class="float-right mt-6" type="border" @click="signUp">Регистрация</vs-button>
                    </vs-tab>
                  </vs-tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activeTab: 0,
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      isTermsConditionAccepted: false,
      sign_up: false,
    };
  },
  computed: {
    validateForm () {
      return !this.sign_up ?
        this.email && this.password :
        this.errors.any();
    },
  },
  watch: {
    activeTab(val) {
      if (val === 1) {
        this.email = '';
        this.password = '';
      }
    },
  },
  methods: {
    async signIn() {
      await this.$validator.validateAll();
      if (!this.validateForm) {
        return;
      }
      this.$store.dispatch('login', {
        email: this.email,
        password: this.password
      })
        .then((res) => {
          console.log(res);
          this.$router.push('/');
        })
        .catch((err) => {
          console.log(err);
          this.$vs.notify({
            title: 'Ошибка',
            text: 'Неверный логин или пароль!',
            color: 'danger',
            position: 'top-center'
          });
        });
    },
    async signUp() {
      await this.$validator.validateAll();
      if (!this.validateForm) {
        return;
      }
      this.$store.dispatch('signUp', {
        last_name: this.last_name,
        first_name: this.first_name,
        email: this.email,
        password: this.password,
      })
      .then((res) => {
        console.log(res);
        this.$vs.notify({
          title: 'Отлично',
          text: 'Вы успешно зарегистрировались',
          color: 'success',
          position: 'top-center'
        });
        this.activeTab = 0;
      })
      .catch((err) => {
        console.log(err);
        this.$vs.notify({
          title: 'Ошибка',
          text: 'Этот email уже используется!',
          color: 'danger',
          position: 'top-center'
        });
      });
    },
  },
};
</script>

<style lang="scss">
#page-login {
  .social-login-buttons {
    .bg-facebook {
      background-color: #1551b1;
    }
    .bg-twitter {
      background-color: #00aaff;
    }
    .bg-google {
      background-color: #4285f4;
    }
    .bg-github {
      background-color: #333;
    }
  }
}
</style>
