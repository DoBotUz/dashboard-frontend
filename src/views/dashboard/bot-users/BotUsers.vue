<template>
  <div class="bot-users">
    <vs-table ref="table" v-model="selected" search :data="botUsers" :max-items="15" pagination>
      <template slot="thead">
        <vs-th sort-key="id">ID</vs-th>
        <vs-th>Аватар</vs-th>
        <vs-th sort-key="tg_id">Telegram ID</vs-th>
        <vs-th sort-key="first_name">Имя</vs-th>
        <vs-th sort-key="last_name">Фамилия</vs-th>
        <vs-th sort-key="bio">Введенное имя</vs-th>
        <vs-th sort-key="phone_number">Телефон</vs-th>
        <vs-th sort-key="username">@username</vs-th>
        <vs-th sort-key="created_at">Дата регистрации</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="font-medium">{{ tr.id }}</p>
            </vs-td>
            <vs-td>
              <vs-avatar color="primary" :text="getInitials(tr.first_name, tr.last_name)" size="45px" />
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.tg_id }}</p>
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.first_name }}</p>
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.last_name }}</p>
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.bio }}</p>
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.phone_number }}</p>
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.username }}</p>
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.created_at | date }}</p>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>
<script>
import { mapActions, mapState } from 'vuex';
export default {
  name: 'DashboardBotUsers',
  data() {
    return {
      selected: [],
    }
  },
  computed: {
    ...mapState('botUsers', ['botUsers']),
  },
  methods: {
    ...mapActions('botUsers', ['fetchBotUsers', 'banBotUser']),
    getInitials(firstName, lastName) {
      let out = firstName[0];
      if (lastName) {
        out += lastName[0];
      }
      return out.toUpperCase();
    },

    banBotUserAction(botUser){
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Подтвердите действие`,
        text: `Вы действительно хотите забанить ${botUser.firstName} ${botUser.lastName}?`,
        accept: () => {
          this.banBotUser(botUser.id).then(() => {
              this.$vs.notify({
                title: "Отлично",
                text: "Пользователь забанен",
                color: "danger",
                position: "top-center",
              });
          });
        },
      });
    },
  },

  mounted(){
    this.fetchBotUsers();
  }
}
</script>

<style lang="scss" scoped>
.avatar-wrap{
  img{
    display: block;
    height: 64px;
    width: 64px;
    border-radius: 100%;
  }
  span.initials-wrap{
    background-color: #516fad;
    width: 64px;
    height: 64px;
    display: block;
    border-radius: 100%;
    position: relative;
    span{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 20px;
      color: #fff;
    }
  }
}
</style>
