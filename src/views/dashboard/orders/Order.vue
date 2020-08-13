<template>
  <div>
    <vx-card class="vs-con-loading__container">
      <vs-tabs alignment="fixed">
        <vs-tab label="Общее">
          <general-form :order="order" @save="updateGeneralInfo" />
        </vs-tab>
        <vs-tab label="Продукты">
          <products-table :order="order" @save="updateGeneralInfo" />
        </vs-tab>
        <vs-tab label="История заказов">
          <orders-history :client_id="1" />
        </vs-tab>
      </vs-tabs>
    </vx-card>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import GeneralForm from "./components/general_form";
import ProductsTable from "./components/products_table";
import { loaderMixin } from '@/mixins';

export default {
  mixins: [loaderMixin],
  components: {
    GeneralForm,
    ProductsTable,
  },
  beforeRouteEnter(to, from, next) {
    (to.meta.breadcrumb = [
      { title: "Заказы", url: { name: "DashboardOrders" }, slug: "home" },
      { title: `Заказ #${to.params.order_id}`, active: true },
    ]),
      (to.meta.pageTitle = `Заказ #${to.params.order_id}`);
    next();
  },
  props: {
    order_id: Number,
  },
  computed: {
    ...mapGetters("orders", {
      order: "order",
      loading: 'loading',
    }),
  },
  methods: {
    ...mapActions("orders", ["fetchOrder", "updateOrder"]),
    updateGeneralInfo(updated_order) {
      this.updateOrder(
        Object.assign({ for_datetime: null }, this.order, updated_order)
      ).then(() => {
        this.$vs.notify({
          title: "Отлично",
          text: "Изменения сохранены",
          color: "success",
          position: "top-center",
        });
      });
    },
  },
  mounted() {
    this.fetchOrder(this.order_id);
  },
};
</script>
<style lang="scss" scoped>
</style>