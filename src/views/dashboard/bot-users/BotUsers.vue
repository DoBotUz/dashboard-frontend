<template>
  <div class="bot-users">
    <vs-table ref="table" v-model="selected" search :data="botUsers">
      <template slot="thead">
        <vs-th sort-key="avatar">Аватар</vs-th>
        <vs-th sort-key="tg_id">Telegram ID</vs-th>
        <vs-th sort-key="firstName">Имя</vs-th>
        <vs-th sort-key="lastName">Фамилия</vs-th>
        <vs-th sort-key="phoneNumber">Телефон</vs-th>
        <vs-th sort-key="userName">@username</vs-th>
        <vs-th sort-key="lastSeen">Последний визит</vs-th>
        <vs-th>Действия</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="font-medium">
                <span class="avatar-wrap">
                  <img v-if="tr.avatar" :src="`${$url}/public/bot-users/${tr.avatar}`" alt="">
                  <span v-else class="initials-wrap">
                    <span>{{ getInitials(tr.first_name, tr.last_name) }}</span>
                  </span>
                </span>
              </p>
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
              <p class="font-medium">{{ tr.phone_number }}</p>
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.username }}</p>
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.last_seen | date }}</p>
            </vs-td>
            <vs-td class="whitespace-no-wrap">
              <feather-icon
                icon="TrashIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="banBotUserAction(tr)"
              />
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
      top: 17px;
      left: 20px;
      font-size: 20px;
      color: #fff;
    }
  }
}

</style>
