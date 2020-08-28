<template>
  <div>
    <vx-card class="vs-con-loading__container">
      <vs-tabs alignment="fixed">
        <vs-tab label="Информация">
          <base-settings />
        </vs-tab>
        <vs-tab label="Доставка">
          <delivery-settings />
        </vs-tab>
        <vs-tab label="Способы оплаты">
          <payment-settings />
        </vs-tab>
        <vs-tab label="Функции бота">
          <functions-settings />
        </vs-tab>
        <vs-tab label="Уведомления">
          <notifications-settings />
        </vs-tab>
      </vs-tabs>
    </vx-card>
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from 'vuex';
import BaseSettings from './tabs/base-settings';
import DeliverySettings from './tabs/delivery';
import PaymentSettings from './tabs/payments';
import FunctionsSettings from './tabs/functions';
import NotificationsSettings from './tabs/notifications';

export default {
  components: {
    BaseSettings,
    DeliverySettings,
    PaymentSettings,
    FunctionsSettings,
    NotificationsSettings
  },
  data: () => ({
    token: null,
  }),
  computed: {
    ...mapState(['organization', 'organization_loading']),
    ...mapState('organizations', ['organizationObj']),
  },
  methods: {
    ...mapActions('organizations', ['getOrganization', 'updateOrganization']),
  },
}
</script>
<style lang="scss" scoped>

</style>