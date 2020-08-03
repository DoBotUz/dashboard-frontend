<template>
  <div class="branches">
    <vs-table ref="table" v-model="selected" search :data="massNotifs">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
          <!-- ADD NEW -->
          <div
            class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="createMassNotif"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Новая Рассылка</span>
          </div>
        </div>
      </div>

      <template slot="thead">
        <vs-th sort-key="id">ID</vs-th>
        <vs-th sort-key="created_at">Создано в</vs-th>
        <vs-th sort-key="afterDateTime">Начало отправки</vs-th>
        <vs-th sort-key="title">Заголовок</vs-th>
        <vs-th sort-key="thumbnail">Картинка</vs-th>
        <vs-th>Действия</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="font-medium">{{ tr.id }}</p>
            </vs-td>
            <vs-td>
              <p>{{ tr.created_at | date }}</p>
            </vs-td>
            <vs-td>
              <p v-if="tr.after_date_time">{{ tr.after_date_time | date }}</p>
              <p v-else>Сразу</p>
            </vs-td>
            <vs-td>
              <p>{{ tr.template.ru_title }}</p>
            </vs-td>
            <vs-td>
              <p class="template-image-wrap">
                <img v-if="tr.template.thumbnail" :src="`${$url}/public/bot-notifications/${tr.template.thumbnail}`" alt="">
                <img v-else src="/no-image.png" alt="">
              </p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <feather-icon
                icon="EyeIcon"
                svgClasses="w-5 h-5 hover:text-primary stroke-current"
                @click.stop="viewMassNotif(tr)"
              />
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
    <mass-notif-form></mass-notif-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import MassNotifForm from './components/_Form';

export default {
  name: 'DashboardMassNotifs',
  data(){
    return {
      selected: [],
      selectedMassNotif: null,
    }
  },
  components: {
    MassNotifForm,
  },
  computed: {
    ...mapState('massNotifs', ['massNotifs', 'addPopup']),
  },
  methods: {
    ...mapActions('massNotifs', ['fetchMassNotifs', 'resetFormFields']),
    ...mapMutations('massNotifs', ['SET_ADD_POPUP']),
    createMassNotif(){
      this.selectedMassNotif = null;
      this.resetFormFields();
      this.SET_ADD_POPUP(true);
    },
  },
  mounted(){
    this.fetchMassNotifs();
  }
}
</script>

<style lang="scss">
.template-image-wrap{
  img{
    display: block;
    height: 64px;
    width: 64px;
  }
}
</style>
