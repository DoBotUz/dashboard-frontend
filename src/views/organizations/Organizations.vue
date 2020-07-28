<template>
  <div>
    <div class="knowledge-base-jumbotron">
      <div class="knowledge-base-jumbotron-content sm:p-16 p-8 rounded-lg mb-base">
        <h1>Ваши заведения</h1>
      </div>
    </div>
    <div class="organizations">
      <organization
				v-for="organization in organizations"
				:key="organization.id"
				:id="organization.id"
				:title="organization.ru_title"
				:description="organization.ru_description"
			/>
      <vx-card class="cursor-pointer organizations__add" @click="addPopup = true">
        <h1 class="organizations__add__plus mb-5">➕</h1>
				<h4>Добавить заведение</h4>
      </vx-card>
    </div>
		<vs-popup title="Добавить новое заведение" :active.sync="addPopup">
      <vs-input class="w-full mb-3" label="Название заведения" v-model="organization_name" />
			<vs-textarea class="w-full mb-3" label="Описание заведения" v-model="organization_description" />
			<vs-input class="w-full mb-3" label="Токен бота" v-model="organization_token" />
      <vs-button class="mb-3" @click="tokenPopup=true" color="primary" type="line">Как получить токен бота?</vs-button>
      <vs-button class="w-full" @click="addOrganization" color="primary">Добавить</vs-button>

      <vs-popup title="Как получить токен от бота?" :active.sync="tokenPopup">
        <p>Заходите в @botfather и без задней мысли получаете токен</p>
      </vs-popup>
    </vs-popup>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import Organization from "./components/Organization";

export default {
  components: {
    Organization,
	},
	data() {
		return {
			organization_name: '',
			organization_description: '',
			organization_token: '',
			addPopup: false,
			tokenPopup: false,
		}
	},
	methods: {
		...mapActions('organizations', ['fetchOrganizations']),
		addOrganization() {
			this.$store.dispatch('organizations/addOrganization', {
				name: this.organization_name,
				description: this.organization_description,
				token: this.organization_token
			}).then(res => {
				this.$vs.notify({
          title: 'Отлично',
          text: 'Вы успешно создали магазин',
          color: 'success',
          position: 'top-center'
        });
			})
		}
	},
	mounted() {
		this.fetchOrganizations();
	},
	computed: {
		...mapGetters({
			'organizations': 'organizations/organizations',
		}),
	}
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