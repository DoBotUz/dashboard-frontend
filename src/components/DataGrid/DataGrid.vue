<template>
  <div>
    <div class="flex flex-wrap justify-between items-center">

      <!-- ITEMS PER PAGE -->
      <div class="mb-4 md:mb-0 mr-4 ag-grid-table-actions-left">
        <vs-dropdown vs-trigger-click class="cursor-pointer">
          <div class="p-4 border border-solid d-theme-border-grey-light rounded-full d-theme-dark-bg cursor-pointer flex items-center justify-between font-medium">
            <span class="mr-2">{{ currentPage * paginationPageSize - (paginationPageSize - 1) }} - {{ totalCount - currentPage * paginationPageSize > 0 ? currentPage * paginationPageSize : totalCount }} of {{ totalCount }}</span>
            <feather-icon icon="ChevronDownIcon" svgClasses="h-4 w-4" />
          </div>
          <!-- <vs-button class="btn-drop" type="line" color="primary" icon-pack="feather" icon="icon-chevron-down"></vs-button> -->
          <vs-dropdown-menu>

            <vs-dropdown-item @click="pageSizeChanged(20)">
              <span>20</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="pageSizeChanged(50)">
              <span>50</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="pageSizeChanged(100)">
              <span>100</span>
            </vs-dropdown-item>
            <vs-dropdown-item @click="pageSizeChanged(150)">
              <span>150</span>
            </vs-dropdown-item>
          </vs-dropdown-menu>
        </vs-dropdown>
      </div>

      <!-- TABLE ACTION COL-2: SEARCH & EXPORT AS CSV -->
      <div class="flex flex-wrap items-center justify-between ag-grid-table-actions-right">
        <vs-input class="mb-4 md:mb-0 mr-4" v-model="searchQuery" @input="updateSearchQuery" placeholder="Поиск..." />
        <vs-button class="mb-4 md:mb-0" @click="gridApi.exportDataAsCsv()">Экспорт в CSV</vs-button>
      </div>
    </div>
    <ag-grid-vue
      ref="ordersGridTable"
      :gridOptions="gridOptions"
      class="ag-theme-material w-100 my-4 ag-grid-table vs-con-loading__container"
      :columnDefs="columnDefs"
      :defaultColDef="defaultColDef"
      colResizeDefault="shift"
      :animateRows="true"
      :floatingFilter="true"
      :pagination="true"
      :paginationPageSize="paginationPageSize"
      :cacheBlockSize="paginationPageSize"
      :frameworkComponents="frameworkComponents"
      :infiniteInitialRowCount="1"
      :maxBlocksInCache="2"
      :suppressPaginationPanel="true"
      id="overlayLoadingCon"
      >
    </ag-grid-vue>
    <vs-pagination
      :total="totalPages"
      v-model="currentPage" />
  </div>
</template>

<script>
import { AgGridVue } from 'ag-grid-vue';
import { AllCommunityModules } from '@ag-grid-community/all-modules';
import '@/assets/scss/vuexy/extraComponents/agGridStyleOverride.scss';
import { RequestQueryBuilder, CondOperator } from "@nestjsx/crud-request";
import DropdownFilter from './DropdownFilter.js';
import ActionsRenderer from './ActionsRenderer.js';
import { loaderMixin } from '@/mixins';
import Locale from './locale';

export default {
  props: {
    columnDefs: {
      type: Array,
      requred: true,
    },
    fetchData: {
      type: Function,
      requred: true,
    },
  },
  components: {
    AgGridVue
  },
  data(){
    return{
      totalPages: 0,
      totalCount: 0,
      searchQuery: '',
      frameworkComponents: null,
      modules: AllCommunityModules,
      gridOptions: {
        rowModelType: 'infinite',
        suppressPropertyNamesCheck: true,
        overlayNoRowsTemplate: '<span>Нет данных по данному запросу.</span>',
        suppressCellSelection: true,
      },

      gridApi: null,
      defaultColDef: {
        sortable: true,
        resizable: true,
        suppressMenu: true,
        filter: 'agTextColumnFilter',
        floatingFilterComponentParams: {
          suppressFilterButton: true,
        },
        filterParams: {
          filterOptions: ['contains'],
          suppressAndOrCondition: true,
          debounceMs: 500,
        },
      },
    }
  },

  computed: {
    paginationPageSize () {
      if (this.gridApi) return this.gridApi.paginationGetPageSize()
      else return 50
    },
    currentPage: {
      get () {
        if (this.gridApi) return this.gridApi.paginationGetCurrentPage() + 1
        else return 1
      },

      set (val) {
        this.gridApi.paginationGoToPage(val - 1)
      }
    },
  },

  methods: {
    comparator(_, value, filterText) {
      let status = this.order_statuses[value];
      status = status.toLowerCase();
      return status && status.indexOf(filterText) >= 0;
    },

    updateSearchQuery (val) {
      this.gridApi.setFilterModel({"-":{filter: val}});
    },

    pageSizeChanged(pageSize) {
      this.gridOptions.api.gridOptionsWrapper.setProperty('cacheBlockSize', pageSize);
      this.gridOptions.api.infinitePageRowModel.resetCache();

      // After that, update the pageSize through the api
      this.gridOptions.api.paginationSetPageSize(pageSize);
    }
  },

  beforeMount() {
    this.frameworkComponents = {
      dropdownFilter: DropdownFilter,
      actionsRenderer: ActionsRenderer,
    };
  },

  mounted() {
    let that = this;
    this.gridOptions.localeText = Locale;
    this.gridOptions.api.setDatasource(new function() {
       this.applyFilters = async (qb, filters) => {
         if (filters.hasOwnProperty('-')) {
           const searchOr = [];
           for (let j = 0; j < that.columnDefs.length; j++) {
             if(that.columnDefs[j].noSearch)
              continue;
             searchOr.push({
               [that.columnDefs[j].field]: {
                 [CondOperator.CONTAINS]: filters['-'].filter
               }
             })
           }
           qb.search({
             $or: searchOr
           });
         }

         for(let key in filters){
           if(key === '-')
            continue;

            if (filters[key].filterType === 'date') {
              if (filters[key].type === 'inRange') {
                qb.setFilter({ field: key, operator: CondOperator.BETWEEN, value: [filters[key].dateFrom, filters[key].dateTo] })
              } else {
                qb.setFilter({ field: key, operator: CondOperator.CONTAINS, value: filters[key].dateFrom })
              }

            } else if(filters[key].filterType === 'number') {
              if (filters[key].type === 'inRange') {
                qb.setFilter({ field: key, operator: CondOperator.BETWEEN, value: [filters[key].filter, filters[key].filterTo] })
              } else if(filters[key].type === 'equals') {
                qb.setFilter({ field: key, operator: CondOperator.EQUALS, value: filters[key].filter })
              } else if(filters[key].type === 'lessThan') {
                qb.setFilter({ field: key, operator: CondOperator.LOWER_THAN, value: filters[key].filter })
              } else if(filters[key].type === 'greaterThanOrEqual'){
                qb.setFilter({ field: key, operator: CondOperator.GREATER_THAN_EQUALS, value: filters[key].filter })
              } else {
                qb.setFilter({ field: key, operator: CondOperator.CONTAINS, value: filters[key].filter })
              }
            }else {
              qb.setFilter({ field: key, operator: CondOperator.CONTAINS, value: filters[key].filter })
            }


         }
       };

      this.applySortings = async (qb, sortings) => {
        for(let i =0; i< sortings.length; i++){
          qb.sortBy({ field: sortings[i].colId, order: String(sortings[i].sort).toUpperCase() })
        }
      };

      // Callback the grid calls that you implement to fetch rows from the server. See below for params.
       this.getRows = async (params) => {
          const qb = RequestQueryBuilder.create({
            page: that.currentPage,
            limit: that.paginationPageSize,
            resetCache: true,
          });

          console.log(params);
          this.applyFilters(qb, params.filterModel);
          this.applySortings(qb, params.sortModel);

          const queryString = qb.query();
          console.log(queryString);
          that.$vs.loading({
            container: `#overlayLoadingCon`,
            type: 'default',
            text: 'Загрузка'
          });
          const data = await that.fetchData(queryString);
          that.$vs.loading.close('#overlayLoadingCon > .con-vs-loading');
          that.totalPages = data.pageCount;
          let lastRow = data.total;
          that.totalCount = data.total;

          if(that.totalCount === 0){
            that.gridOptions.api.showNoRowsOverlay();
          } else {
            that.gridOptions.api.hideOverlay();
          }
          // call the success callback
          params.successCallback(data.data, lastRow);
        }
    });

    this.gridApi = this.gridOptions.api;
  },
}
</script>

<style lang="scss">
  .ag-root-wrapper-body{
    user-select: all !important;
  }
</style>
