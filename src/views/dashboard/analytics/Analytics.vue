<template>
  <div id="dashboard-analytics">
        <div class="vx-row">
            <div class="vx-col w-full mb-base">
                <vx-card title="Выберите период">
                  <div class="vx-row">
                    <div class="vx-col md:w-1/2 w-full mb-base">
                      <label for="">Начало: </label>
                      <datepicker placeholder="Выберите начало" :language="languages['ru']" v-model="startDate" @input="endDate = null" :disabled-dates="startDisabledDates"></datepicker>
                    </div>
                    <div class="vx-col md:w-1/2 w-full mb-base">
                      <label for="">Конец: </label>
                      <datepicker placeholder="Выберите конец" :language="languages['ru']" v-model="endDate" :disabled="!startDate" @input="periodChanged" :disabled-dates="endDisabledDates"></datepicker>
                    </div>
                  </div>
                </vx-card>
            </div>
            <div id="charts-data" class="vx-row vs-con-loading__container">
              <div class="vx-coll w-full mb-base">
                <vx-card title="Карта заказов">
                  <yandex-map :coords="mapCoords" :zoom="11" v-on:map-was-initialized="mapLoaded">
                  </yandex-map>
                </vx-card>
              </div>
              <div class="vx-col md:w-1/2 w-full mb-base">
                  <vx-card title="Новые подписчики">
                      <vue-apex-charts type="line" height="350" :options="botUsersChartOptions" :series="botUsersData.series" v-if="botUsersData.series"></vue-apex-charts>
                  </vx-card>
              </div>
              <div class="vx-col md:w-1/2 w-full mb-base">
                  <vx-card title="Заказы">
                      <vue-apex-charts type="line" height="350" :options="ordersChartOptions" :series="ordersData.series" v-if="ordersData.series"></vue-apex-charts>
                  </vx-card>
              </div>
              <div class="vx-col md:w-1/2 w-full mb-base">
                <vx-card title="Заказы по категориям">
                  <vue-apex-charts type="pie" height="350" :options="categoryOrdersOptions" :series="categoryOrdersData.series" :labels="categoryOrdersData.labels" v-if="categoryOrdersData.series"></vue-apex-charts>
                </vx-card>
              </div>
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


export default {
  name: 'Analytics',
  components: {
    VueApexCharts,
    Datepicker
  },
  data() {
    return {
      mapCoords: [41.311151, 69.279737],
      startDate: null,
      endDate: null,
      languages: lang,
    }
  },
  computed: {
    ...mapState(['organization']),
    ...mapState('analytics', ['ordersData', 'botUsersData','categoryOrdersData',]),

    startDisabledDates() {
      return {
        to: new Date(this.organization.created_at),
      }
    },

    endDisabledDates() {
      return {
        to: new Date(this.startDate),
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
    ...mapActions('analytics', ['fetchOrdersData', 'fetchBotUsersData', 'fetchCategoryOrdersData', 'fetchForPeriod', 'fetchGeoOrders']),

    async mapLoaded(map) {

      let heatmapScript = document.createElement('script')
      heatmapScript.setAttribute('src', 'https://yastatic.net/s3/mapsapi-jslibs/heatmap/0.0.1/heatmap.min.js')
      heatmapScript.onload = () => {
        ymaps.modules.require(['Heatmap'], async (Heatmap) => {
          const data = await this.fetchGeoOrders();
          const heatmap = new Heatmap(data);
          heatmap.setMap(map);
        });
      }
      document.head.appendChild(heatmapScript);




    },

    periodChanged(){
      this.$vs.loading({
        container: '#charts-data',
        scale: 0.6
      })

      this.fetchForPeriod({
        start: new Date(this.startDate).toISOString(),
        end: new Date(this.endDate).toISOString()
      }).then(() => {
        this.$vs.loading.close('#charts-data > .con-vs-loading');
      }).catch(() => {
        this.$vs.loading.close('#charts-data > .con-vs-loading');
      })

    }
  },
  async mounted() {
    this.fetchOrdersData();
    this.fetchBotUsersData();
    this.fetchCategoryOrdersData();
  },
}
</script>

<style lang="scss">
  .ymap-container{
    width: 100%;
    height: 450px;
  }
</style>
