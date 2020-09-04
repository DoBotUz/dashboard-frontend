<template>
  <div>
    <data-grid :columnDefs="columnDefs" :fetchData="fetchCrudOrders"></data-grid>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import DataGrid from '@/components/DataGrid/DataGrid.vue';

export default {
  components: {
    DataGrid
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters('orders', {
      'orders': 'orders',
      'order_statuses': 'order_statuses',
      'payment_types': 'payment_types',
      'loading': 'loading',
    }),

    columnDefs() {
      let that = this;
      return [
        {
            field: '-', // Hack for using search at top of page!
            noSearch: true, // attribute for not including in search
            hide: true,
            lockVisible: true,
            filter: "agTextColumnFilter",
            filterParams: {
              newRowsAction: "keep"
            }
        },
        {
          headerName: 'ID',
          field: 'id',
        },
        {
          headerName: 'Филиал',
          field: 'branch.ru_title',
          width: 250,
        },
        {
          headerName: 'Статус',
          field: 'status',
          noSearch: true,
          width: 200,
          valueFormatter: this.statusFormatter,
          filter: true,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: this.statusFilterParams
        },
        {
          headerName: 'Номер телефона',
          field: 'phone',
          filter: true,
        },
        {
          headerName: 'Способ оплаты',
          field: 'payment_type',
          noSearch: true,
          valueFormatter: this.paymentTypeFormatter,
          filter: true,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: this.paymentFilterParams
        },
        {
          headerName: 'Сумма',
          field: 'total_charge',
          noSearch: true,
          filter: 'agNumberColumnFilter',
          floatingFilterComponentParams: {
            suppressFilterButton: false,
          },
          filterParams: {
            filterOptions: ['equals', 'lessThan', 'greaterThanOrEqual', 'inRange'],
            suppressAndOrCondition: true,
            debounceMs: 500,
          },
        },
        {
          headerName: 'Оплачено',
          field: 'is_paid',
          noSearch: true,
          filter: true,
          valueFormatter: (params) => {
            return params.value ? 'Да' : 'Нет';
          },
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: this.isPaidFilterParams
        },
        {
          headerName: 'Ко времени',
          field: 'for_datetime',
          noSearch: true,
          filter: 'agDateColumnFilter',
          width: 250,
          valueFormatter: this.$options.filters.DATA_GRID_date,
          floatingFilterComponentParams: {
            suppressFilterButton: false,
          },
          filterParams: {
            filterOptions: ['inRange'],
            suppressAndOrCondition: true,
            debounceMs: 500,
          },
        },
        {
          headerName: 'Дата создания',
          field: 'created_at',
          noSearch: true,
          filter: 'agDateColumnFilter',
          width: 250,
          valueFormatter: this.$options.filters.DATA_GRID_date,
          floatingFilterComponentParams: {
            suppressFilterButton: false,
          },
          filterParams: {
            filterOptions: ['inRange'],
            suppressAndOrCondition: true,
            debounceMs: 500,
          },
        },
        {
          headerName: "Действия",
          field: "Действия",
          pinned: 'right',
          width: 120,
          filter: false,
          sortable: false,
          cellRenderer: 'actionsRenderer',
          cellRendererParams: {
            showEdit: true,
            clicked(id) {
              that.$router.push({
                name: "DashboardOrder",
                params: {
                  order_id: id,
                },
              });
            }
          },
        }
      ];
    },

    isPaidFilterParams() {
      return {
        suppressFilterButton: true,
        optionsLabel: 'Выберите',
        options: [
          {
            value: 1,
            label: 'Да'
          },
          {
            value: 0,
            label: 'Нет'
          }
        ]
      };
    },

    statusFilterParams() {
      return {
        suppressFilterButton: true,
        optionsLabel: 'Выберите',
        options: this.statusesOptions
      };
    },

    statusesOptions(){
      let out = [];

      for(let key in this.order_statuses){
        out.push({
          value: key,
          label: this.order_statuses[key]
        })
      }
      return out;
    },

    paymentFilterParams() {
      return {
        suppressFilterButton: true,
        optionsLabel: 'Выберите',
        options: this.paymentTypeOptions
      };
    },

    paymentTypeOptions() {
      let out = [];
      for(let key in this.payment_types){
        out.push({
          value: key,
          label: this.payment_types[key]
        })
      }
      return out;
    },

  },
  methods: {
    ...mapActions('orders', ['fetchOrders', 'fetchCrudOrders']),

    statusFormatter(params) {
      return this.order_statuses[params.value];
    },

    paymentTypeFormatter(params) {
      return this.payment_types[params.value];
    },

    addOrder() {

    },

    onSelected(tr) {
      this.$router.push({
        name: "DashboardOrder",
        params: {
          order_id: tr.id,
        },
      });
    },
  },


  mounted() {

  }
};
</script>
<style lang="scss" scoped>
</style>
