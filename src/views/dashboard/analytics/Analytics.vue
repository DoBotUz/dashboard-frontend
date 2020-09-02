<template>
  <div id="dashboard-analytics">
    <div class="vx-row">
      <div class="vx-col w-full">
        <vx-card title="Тип" class="mb-base">
          <ul class="flex">
            <li class="mr-6">
              <vs-radio v-model="periodType" vs-value="month" @input="periodTypeChanged">По месяц</vs-radio>
            </li>
            <li class="mr-6">
              <vs-radio v-model="periodType" vs-value="day" @input="periodTypeChanged">По дням</vs-radio>
            </li>
          </ul>
        </vx-card>
      </div>
      <div class="vx-col w-full">
        <vx-card title="Выберите период" class="mb-base">
          <div class="vx-row">
            <div class="vx-col md:w-1/2 w-full">
              <label for="">Начало: </label>
              <datepicker placeholder="Выберите начало" :minimumView="this.periodType" :format="dateFormat" :language="languages['ru']" v-model="startDate" @input="endDate = null" :disabled-dates="startDisabledDates"></datepicker>
            </div>
            <div class="vx-col md:w-1/2 w-full">
              <label for="">Конец: </label>
              <datepicker placeholder="Выберите конец" :minimumView="this.periodType" :format="dateFormat" :language="languages['ru']" v-model="endDate" :disabled="!startDate" @input="periodChanged" :disabled-dates="endDisabledDates"></datepicker>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
    <div id="charts-data" class="vx-row vs-con-loading__container">
      <div class="vx-col w-1/2 md:w-1/3">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="UserIcon"
          statisticTitle="Новых подписчиков"
          :statistic="$options.filters.k_formatter(Number(metaData.bot_users_num))"
          color="success" />
      </div>
      <div class="vx-col w-1/2 md:w-1/3">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="ShoppingBagIcon"
          :statistic="$options.filters.k_formatter(Number(metaData.orders_num))"
          statisticTitle="Заказов"
          color="success"
           />
      </div>
      <div class="vx-col w-1/2 md:w-1/3">
        <statistics-card-line
          hideChart
          class="mb-base"
          icon="SmileIcon"
          statisticTitle="Отзывов"
          :statistic="$options.filters.k_formatter(Number(metaData.feedbacks_num))"
          color="success" />
      </div>
      <div class="vx-col md:w-1/2 w-full">
          <vx-card title="Новые подписчики" class="mb-base">
              <vue-apex-charts type="line" height="350" :options="botUsersChartOptions" :series="botUsersData.series" v-if="botUsersData.series"></vue-apex-charts>
          </vx-card>
      </div>
      <div class="vx-col md:w-1/2 w-full">
          <vx-card title="Заказы" class="mb-base">
              <vue-apex-charts type="line" height="350" :options="ordersChartOptions" :series="ordersData.series" v-if="ordersData.series"></vue-apex-charts>
          </vx-card>
      </div>
      <div class="vx-col w-full">
        <vx-card title="Карта заказов" class="mb-base">
          <yandex-map :coords="mapCoords" :zoom="11" v-on:map-was-initialized="mapLoaded">
          </yandex-map>
        </vx-card>
      </div>
      <div class="vx-col md:w-1/2 w-full">
        <vx-card title="Заказы по категориям" class="mb-base">
          <vue-apex-charts type="pie" height="350" :options="categoryOrdersOptions" :series="categoryOrdersData.series" :labels="categoryOrdersData.labels" v-if="categoryOrdersData.series"></vue-apex-charts>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
import VueApexCharts from 'vue-apexcharts';
import Datepicker from 'vuejs-datepicker';
import * as lang from 'vuejs-datepicker/src/locale';
import { mapActions, mapState } from 'vuex';
import { loadYmap } from 'vue-yandex-maps';

import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'

export default {
  name: 'Analytics',
  components: {
    VueApexCharts,
    Datepicker,
    StatisticsCardLine
  },
  data() {
    return {
      mapCoords: [41.311151, 69.279737],
      startDate: null,
      endDate: null,
      languages: lang,
      periodType: 'month',
      heatmap: null,
    }
  },
  computed: {
    ...mapState(['organization']),
    ...mapState('analytics', ['ordersData', 'botUsersData','categoryOrdersData', 'metaData']),

    dateFormat() {
      if (this.periodType === 'month') {
        return 'MMMM yyyy';
      } else if(this.periodType === 'day') {
        return 'd MMMM yyyy';
      }
      return '';
    },

    startDisabledDates() {
      return {
        to: new Date(this.organization.created_at),
        from: new Date(),
      }
    },

    endDisabledDates() {
      return {
        to: this.startDate,
        from: new Date(),
      }
    },

    ordersChartOptions() {
      let that = this;
      if(this.ordersData.series) {
        return {
          colors: ['#7367F0', '#28C76F', '#EA5455', '#FF9F43', '#1E1E1E'],
          chart: {
            height: 350,
            zoom: {
              enabled: true
            }
          },
          stroke: {
              show: true,
              curve: 'stepline',
          },
          xaxis: {
            type: this.endDate ? 'datetime' : '',
            labels: {
              formatter(value) {
                if (that.endDate)
                  return new Date(value).toLocaleString('ru', { month: 'short', day: 'numeric' });
                return new Date(value).toLocaleString('ru', { month: 'short' })
              }
            }
          }
        }
      }
      return {};
    },

    botUsersChartOptions() {
      let that = this;
      if (this.botUsersData.series) {
        return {
          colors: ['#28C76F', '#7367F0', '#EA5455', '#FF9F43', '#1E1E1E'],
          chart: {
            type: 'line',
            height: 350,
            zoom: {
                enabled: true,
            },
          },
          stroke: {
              show: true,
          },

          xaxis: {
            type: this.endDate ? 'datetime' : '',
            labels: {
              formatter(value) {
                if (that.endDate)
                  return new Date(value).toLocaleString('ru', { month: 'short', day: 'numeric' });
                return new Date(value).toLocaleString('ru', { month: 'short' })
              }
            }
          }
        }
      }
      return {};
    },

    categoryOrdersOptions() {
      if (this.categoryOrdersData.series) {
        return {
          labels: this.categoryOrdersData.labels,
        }
      }
      return {};
    }
  },
  methods: {
    ...mapActions('analytics', ['fetchForPeriod', 'fetchGeoOrders']),

    async mapLoaded(map) {
      let heatmapScript = document.createElement('script')
      heatmapScript.setAttribute('src', 'https://yastatic.net/s3/mapsapi-jslibs/heatmap/0.0.1/heatmap.min.js')
      heatmapScript.onload = () => {
        ymaps.modules.require(['Heatmap'], async (Heatmap) => {
          const { data } = await this.fetchGeoOrders({
            start: new Date(this.startDate).toISOString(),
            end: new Date(this.endDate).toISOString(),
          });

          if (data) {
            const heatmap = new Heatmap(data);
            heatmap.setMap(map);
            this.heatmap = heatmap;
          }
        });
      }
      document.head.appendChild(heatmapScript);
    },

    async periodTypeChanged() {
      this.fetchData();
    },

    async periodChanged() {
      this.fetchData();
    },

    async fetchData() {
      this.$vs.loading({
        container: '#charts-data',
        scale: 0.6
      })

      await this.fetchForPeriod({
        start: new Date(this.startDate).toISOString(),
        end: this.getLastDate(),
        type: this.periodType
      });

      if (this.heatmap) {
        const { data } = await this.fetchGeoOrders({
          start: new Date(this.startDate).toISOString(),
          end: this.getLastDate(),
        });
        if(data)
          this.heatmap.setData(data);
      }

      this.$vs.loading.close('#charts-data > .con-vs-loading');
    },

    getLastDate() {
      if (this.periodType === 'day') {
        return new Date(this.endDate).toISOString();
      } else {
        const d = new Date(this.endDate);
        d.setMonth(d.getMonth()+1);
        d.setDate(0);
        return d;
      }
    },
  },

  async mounted() {
    this.startDate = new Date(this.organization.created_at);
    this.endDate = new Date();

    this.fetchData();
  },
}
</script>

<style lang="scss">
  .ymap-container{
    width: 100%;
    height: 450px;
  }
</style>
