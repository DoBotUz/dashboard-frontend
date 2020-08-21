<template>
  <div>
    <vs-table ref="table" search :data="orders" @selected="onSelected" class="vs-con-loading__container">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
          <!-- ADD NEW -->
          <div
            class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="addOrder"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Создать заказ</span>
          </div>
        </div>
      </div>

      <template slot="thead">
        <vs-th sort-key="id">ID</vs-th>
        <vs-th sort-key="branch_id">Филиал</vs-th>
        <vs-th sort-key="status">Статус</vs-th>
        <vs-th sort-key="phone">Клиент</vs-th>
        <vs-th sort-key="payment_type">Способ оплаты</vs-th>
        <vs-th sort-key="id">Промокод</vs-th>
        <vs-th sort-key="total_charge">Сумма</vs-th>
        <vs-th sort-key="total_charge">Оплачен</vs-th>
        <vs-th sort-key="created_at">Дата</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p>{{ tr.id }}</p>
            </vs-td>
            <vs-td>
              <p>{{ tr.branch.ru_title }}</p>
            </vs-td>
            <vs-td>
              <p>{{ order_statuses[tr.status] }}</p>
            </vs-td>
            <vs-td>
              <p>{{ tr.phone }}</p>
            </vs-td>
            <vs-td>
              <p>{{ payment_types[tr.payment_type] }}</p>
            </vs-td>
            <vs-td>
              <p>----</p>
            </vs-td>
            <vs-td>
              <p>{{ tr.total_charge }}</p>
            </vs-td>
            <vs-td>
              <p>{{ tr.is_paid ? 'Да' : 'Нет' }}</p>
            </vs-td>
            <vs-td>
              <p>{{ tr.created_at | date }}</p>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
const orders = require('./mock');
import { loaderMixin } from '@/mixins';

export default {
  mixins: [loaderMixin],
  data() {
    return {}
  },
  computed: {
    ...mapGetters('orders', {
      'orders': 'orders',
      'order_statuses': 'order_statuses',
      'payment_types': 'payment_types',
      'loading': 'loading',
    }),
  },
  methods: {
    ...mapActions('orders', ['fetchOrders']),
    addOrder() {
      
    },
    onSelected(tr) {
      this.$router.push({
        name: "DashboardOrder",
        params: {
          order_id: tr.id,
        },
      });
    }
  },
  mounted() {
    this.fetchOrders()
  }
};
</script>
<style lang="scss" scoped>
</style>