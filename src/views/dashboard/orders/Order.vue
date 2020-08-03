<template>
  <div>
    <vx-card>
      <vs-tabs alignment="fixed">
        <vs-tab label="Общее">
          <general-form :order="order" />
        </vs-tab>
        <vs-tab label="Продукты">
          <products-table :order_id="order_id" />
        </vs-tab>
        <vs-tab label="История заказов">
          <orders-history :client_id="1" />
        </vs-tab>
      </vs-tabs>
    </vx-card>
  </div>
</template>
<script>
const orders = require('./mock');
import GeneralForm from './components/general_form';
import ProductsTable from './components/products_table';

export default {
  components: {
    GeneralForm,
    ProductsTable,
  },
  beforeRouteEnter(to, from, next) {
    to.meta.breadcrumb = [
      { title: 'Заказы', url: { name: "DashboardOrders" }, slug: 'home' },
      { title: `Заказ #${to.params.order_id}`, active: true }
    ],
    to.meta.pageTitle = `Заказ #${to.params.order_id}`
    next();
  },
  props: {
    order_id: Number,
  },
  data() {
    return {}
  },
  computed: {
    order() {
      let order_id = this.order_id;
      return orders.find(order => order.id === order_id);
    }
  }
}
</script>
<style lang="scss" scoped>
</style>