<template>
  <vs-popup title="Создать новую рассылку" :active.sync="addPopup" fullscreen>
    <div>
      <vs-input
        class="w-full mb-4"
        label="Заголовок на русском"
        v-model="form.ru_title"
      />
      <vs-textarea class="w-full mb-3" label="Описание на русском" v-model="form.ru_description" />
      <vs-input
        class="w-full mb-4"
        label="Заголовок на английском"
        v-model="form.en_title"
      />
      <vs-textarea class="w-full mb-3" label="Описание на английском" v-model="form.en_description" />
      <vs-input
        class="w-full mb-4"
        label="Заголовок на узбекском"
        v-model="form.uz_title"
      />
      <vs-textarea class="w-full mb-3" label="Описание на узбекском" v-model="form.uz_description" />
      <div class="vx-col w-full">
        <vs-upload
          :limit="1"
          :show-upload-button="false"
          text="Загрузить файл"
          ref="massNotifFile"
        />
      </div>
      <vs-button
          class="mt-5 mb-3 float-right"
          @click="addMassSend"
          color="primary"
        >Создать</vs-button>
    </div>
  </vs-popup>
</template>
<script>
import { mapState, mapMutations, mapActions } from 'vuex'
export default {
  name: 'DashboardMassNotifForm',
  props: {
    isUpdate: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    ...mapState(['organization']),
    ...mapState('massNotifs', ['form', 'addPopup']),
  },
  methods: {
    ...mapActions('massNotifs', ['createMassSend']),
    ...mapMutations('massNotifs', ['SET_ADD_POPUP']),
    addMassSend(){
      let file = this.$refs.massNotifFile.filesx[this.$refs.massNotifFile.filesx.length - 1];
      const formData = new FormData();
      const template = this.form;
      template.bot_id = this.organization;
      formData.append('thumbnail', file);
      formData.append('template', JSON.stringify(template));
      formData.append('after_date_time', this.form.after_date_time ? this.form.after_date_time : new Date().toISOString());
      formData.append('bot_id', this.organization);
      return this.createMassSend(formData).then(() => {
        this.SET_ADD_POPUP(false);
        this.$vs.notify({
          title: "Отлично",
          text: "Рассылка создана",
          color: "success",
          position: "top-center",
        });
      });
    },
  },
}
</script>
