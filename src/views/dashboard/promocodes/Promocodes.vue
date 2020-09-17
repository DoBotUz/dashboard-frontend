<template>
  <div>
    <div class="flex flex-wrap-reverse items-center flex-grow justify-between">
      <div class="flex flex-wrap-reverse items-center">
        <div
          class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-success border border-solid border-success"
          @click="showAddPromocodePopup()"
        >
          <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
          <span class="ml-2 text-base text-success">Добавить промокод</span>
        </div>
      </div>
    </div>

    <data-grid :columnDefs="columnDefs" :fetchData="fetchCrudPromocodes" :showExportCSV="false"></data-grid>

    <vs-popup
      title="Новый промокод"
      @close="clearErrors"
      :active.sync="activePrompt"
      fullscreen
    >
      <component :is="scrollbarTag" class="scroll-area p-4" :settings="settings">
        <promocode-form
          ref="promocode-form"
        />
      </component>
    </vs-popup>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import VuePerfectScrollbar from "vue-perfect-scrollbar";
import DataGrid from '@/components/DataGrid/DataGrid.vue';
import PromocodeForm from './components/_form';

export default {
  components: {
    VuePerfectScrollbar,
    DataGrid,
    PromocodeForm
  },
  data() {
    return {
      activePrompt: false,
      settings: {
        maxScrollbarLength: 60,
        wheelSpeed: 0.3,
      },
    }
  },
  computed: {
    ...mapGetters('promocodes', {
      'promocode_statuses': 'promocode_statuses',
      'promocode_types': 'promocode_types',
      'statusOptions': 'statusOptions',
      'typeOptions': 'typeOptions'
    }),

    ...mapGetters(['scrollbarTag']),

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
          headerName: 'Промокод',
          field: 'slug',
          width: 250,
        },
        {
          headerName: 'Тип',
          field: 'type',
          noSearch: true,
          width: 250,
          valueFormatter: this.typeFormatter,
          filter: true,
          floatingFilterComponent: 'dropdownFilter',
          floatingFilterComponentParams: this.typeFilterParams
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
          headerName: 'Осталось',
          field: 'left',
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
          headerName: 'Действует с',
          field: 'start_datetime',
          noSearch: true,
          filter: 'agDateColumnFilter',
          width: 250,
          valueFormatter: this.$options.filters.DATA_GRID_datet,
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
          headerName: 'Действует с',
          field: 'end_datetime',
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

    statusFilterParams() {
      return {
        suppressFilterButton: true,
        optionsLabel: 'Выберите',
        options: this.statusOptions
      };
    },

    typeFilterParams() {
      return {
        suppressFilterButton: true,
        optionsLabel: 'Выберите',
        options: this.typeOptions
      };
    },

  },
  methods: {
    ...mapActions('promocodes', ['fetchCrudPromocodes']),

    clearErrors() {

    },

    showAddPromocodePopup(id = null) {
      this.activePrompt = true;
    },

    statusFormatter(params) {
      return this.promocode_statuses[params.value];
    },

    typeFormatter(params) {
      return this.promocode_types[params.value];
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
