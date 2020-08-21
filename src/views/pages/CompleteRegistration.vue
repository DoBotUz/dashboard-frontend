<template>
  <div
    class="h-screen flex w-full bg-img vx-row no-gutter items-center justify-center"
    id="page-login"
  >
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
      <vx-card>
        <div slot="no-body" class="full-page-bg-color">
          <div class="vx-row no-gutter justify-center items-center" style="padding: 60px;">
            <div class="vx-col sm:w-full md:w-full lg:w-1/3 cursor-pointer" style="height: 100px; float: left;">
              <logo class="" />
            </div>
            <div class="vx-col sm:w-full md:w-full lg:w-2/3 d-theme-dark-bg">
              <div class="p-8 login-tabs-container">
                <div>
                  <div v-if="activated">
                    <h3>Поздравляем! Ваш аккаунт активирован.</h3>
                    <br>
                    <p>Сейчас произойдет переход на страницу приложения.</p>
                  </div>
                  <div
                    v-else
                    id="loading-sound"
                    class="vs-con-loading__container">
                  </div>
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
import Logo from "@/layouts/components/Logo.vue";
import { mapActions } from 'vuex';

export default {
  components: {
    Logo,
  },
  data() {
    return {
      activated: false,
    };
  },
  methods: {
    ...mapActions(['activateAccount']),
    validateToken(){
      this.activateAccount(this.$router.currentRoute.query.token).then((res) => {
        if (res) {
          this.$vs.notify({
            title: 'Отлично',
            text: 'Активация прошла успешна',
            color: 'success',
            position: 'top-center'
          });
          this.activated = true;
          setTimeout(() => {
            this.$router.push('/');
          }, 2000);
        } else {
          this.$vs.notify({
            title: 'Ошибка',
            text: 'Произошла ошибка',
            color: 'warning',
            position: 'top-center'
          });
        }
      });
    },
  },

  mounted(){
    this.$vs.loading({
      container: '#loading-sound',
      type: 'sound',
      text: 'Выполняется проверка.',
    });
    this.validateToken();
  },
};
</script>

<style lang="scss">
  #loading-sound{
    height: 200px;
  }
  .activeLoading {
    opacity: 0 !important;
    transform: scale(.5);
  }
</style>
