<template>
  <div>
    <vx-card no-shadow>
      <vs-input class="w-full mb-8" label="Название заведения" v-model="title" />
      <vs-textarea label="Описание заведения" v-model="description" />
      <vs-input class="w-full mb-8" label="Токен" v-model="token" disabled />
      <div class="flex flex-wrap items-center justify-end">
        <vs-button class="ml-auto mt-2" @click="updateOrganization">Сохранить</vs-button>
      </div>
    </vx-card>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data() {
    return {
      title: "",
      description: "",
      token: '',
    };
  },
  methods: {
    ...mapActions('organizations', ['fetchOrganizations']),
    updateOrganization() {
      this.$store
        .dispatch("organizations/updateOrganization", {
          id: this.$store.state.organization,
          ru_title: this.title,
          ru_description: this.description,
          bot: {
            token: this.token,
          },
        })
        .then(() => {
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
    ...mapGetters({
      organization: "organizations/organization",
    }),
  },
  mounted() {
    this.fetchOrganizations()
      .then(() => {
        this.title = this.organization.ru_title;
        this.description = this.organization.ru_description;
        this.token = this.organization.bot.token;
      });
  }
};
</script>
<style lang="scss" scoped>
</style>