<template>
  <div class="branches vs-con-loading__container">
    <vs-table ref="table" v-model="selected" search :data="branches">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
          <!-- ADD NEW -->
          <div
            class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="addBranch"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Добавить филиал</span>
          </div>
        </div>
      </div>

      <template slot="thead">
        <vs-th sort-key="title">Название</vs-th>
        <vs-th sort-key="status">Статус</vs-th>
        <vs-th sort-key="status">Время работы</vs-th>
        <vs-th>Действия</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="product-name font-medium">{{ tr.ru_title }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ branchStatuses[tr.status] }}</p>
            </vs-td>

            <vs-td>
              <p class="product-category">{{ tr.timetable.from }} - {{ tr.timetable.to }}</p>
            </vs-td>

            <vs-td class="whitespace-no-wrap">
              <feather-icon
                icon="EditIcon"
                svgClasses="w-5 h-5 hover:text-primary stroke-current"
                @click.stop="editBranch(tr)"
              />
              <feather-icon
                icon="TrashIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="deleteBranch(tr)"
              />
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
    <vs-popup title="Добавить новый филиал" :active.sync="addPopup" fullscreen class="vs-con-loading__container">
      <vs-input class="w-full mb-4" label="Название филиала на русском" v-model="ru_title" v-validate="'required'" name="ru_title"  data-vv-as="Название на русском" @blur="fillBranchTitle"/>
      <span class="text-danger text-sm"  v-show="errors.has('ru_title')">{{ errors.first('ru_title') }}</span>

      <vs-input class="w-full mb-4" label="Название филиала на английском" v-model="en_title" v-validate="'required'" name="en_title"  data-vv-as="Название на английском" />
      <span class="text-danger text-sm"  v-show="errors.has('en_title')">{{ errors.first('en_title') }}</span>

      <vs-input class="w-full mb-4" label="Название филиала на узбекском" v-model="uz_title"  v-validate="'required'" name="uz_title"  data-vv-as="Название на узбекском"/>
      <span class="text-danger text-sm"  v-show="errors.has('uz_title')">{{ errors.first('uz_title') }}</span>

      <vs-select autocomplete class="mb-4" label="Статус филиала" v-model="branchStatus">
        <vs-select-item
          :key="index"
          :value="item"
          :text="branchStatuses[item]"
          v-for="(item,index) in Object.keys(branchStatuses)"
        />
      </vs-select>

      <div class="branch-timetable mb-4">
        <div class="sm:w-1/3 w-full mb-2">
          <span>Время работы филиала</span>
        </div>
        <flat-pickr
          :config="configdateTimePicker"
          v-model="timetableFrom"
          placeholder="Время открытия"
          class="mr-4"
        />
        <flat-pickr
          :config="configdateTimePicker"
          v-model="timetableTo"
          placeholder="Время закрытия"
        />
      </div>
      <div class="branch-map">
        <div class="sm:w-1/3 w-full mb-2">
          <span>Локация филиала</span>
        </div>
        <yandex-map :coords="mapCoords" :zoom="10" @click="onClickOnMap">
          <ymap-marker
            marker-id="2"
            :coords="branchCoords"
            :balloon="{header: this.ru_title.length ? this.ru_title : 'Филиал'}"
          />
        </yandex-map>
      </div>
      <vs-button
        class="mt-5 mb-3 float-right"
        @click="addOrUpdateBranch"
        color="primary"
        :disabled="!validateForm"
      >{{ selectedBranch ? 'Изменить' : 'Добавить' }}</vs-button>
    </vs-popup>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import { loaderMixin } from '@/mixins';

export default {
  mixins: [loaderMixin],
  components: {
    flatPickr,
  },
  data() {
    return {
      ru_title: "",
      en_title: "",
      uz_title: "",
      is_all_day: false,
      status: null,
      timetableFrom: null,
      timetableTo: null,
      branchStatus: 10,
      branchCoords: ["41.311151", "69.279737"],

      selected: [],
      addPopup: false,
      selectedBranch: null,
      mapCoords: ["41.311151", "69.279737"],
      configdateTimePicker: {
        enableTime: true,
        enableSeconds: false,
        noCalendar: true,
        time_24hr: true,
      },
    };
  },
  head: {
    title() {
      return {
        inner: 'Филиалы',
      }
    },
  },

  computed: {
    ...mapGetters({
      branches: "branches/branches",
      branchStatuses: "branches/statuses",
      loading: "branches/loading"
    }),

    validateForm () {
      return !this.errors.any()
    }
  },
  methods: {
    ...mapActions("branches", ["fetchBranches"]),
    fillBranchTitle() {
      if (this.en_title === "")
        this.en_title = this.ru_title;
      if (this.uz_title === "")
        this.uz_title = this.ru_title;
    },

    addBranch() {
      this.selectedBranch = null;
      this.resetFields();
      this.addPopup = true;
    },
    resetFields() {
      this.ru_title = "";
      this.en_title = "";
      this.uz_title = "";
      this.is_all_day = false;
      this.timetableFrom = this.timetableTo = null;
      this.branchStatus = 10;
      this.branchCoords = this.mapCoords;
    },
    editBranch(branch) {
      this.selectedBranch = branch.id;
      this.ru_title = branch.ru_title;
      this.en_title = branch.en_title;
      this.uz_title = branch.uz_title;
      this.is_all_day = branch.is_all_day;
      this.timetableFrom = branch.timetable.from;
      this.timetableTo = branch.timetable.to;
      this.branchStatus = branch.status;
      this.branchCoords = [branch.lat, branch.lng];
      this.addPopup = true;
    },
    onClickOnMap(e) {
      this.branchCoords = e.get("coords");
    },
    deleteBranch(branch) {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Подтвердите действие`,
        acceptText: 'Удалить',
        cancelText: 'Отмена',
        text: `Вы действительно хотите удалить филиал ${branch.ru_title}?`,
        accept: () => {
          this.$store
            .dispatch("branches/deleteBranch", {
              id: branch.id,
            })
            .then(() => {
              this.$vs.notify({
                title: "Отлично",
                text: "Филиал удален",
                color: "success",
                position: "top-center",
              });
            });
        },
      });
    },
    async addOrUpdateBranch() {
      await this.$validator.validateAll();

      if (this.errors.any()) {
        return;
      }

      const payload = {
        organizationId: this.$store.state.organization.id,
        ru_title: this.ru_title,
        en_title: this.en_title,
        uz_title: this.uz_title,
        lat: Number(this.branchCoords[0]),
        lng: Number(this.branchCoords[1]),
        is_all_day: Boolean(this.is_all_day),
        timetable: JSON.stringify({
          from: this.timetableFrom,
          to: this.timetableTo,
        }),
        status: this.branchStatus,
      };
      if (this.selectedBranch !== null) {
        this.$store
          .dispatch("branches/updateBranch", {
            id: this.selectedBranch,
            ...payload,
          })
          .then((res) => {
            this.addPopup = false;
            this.$vs.notify({
              title: "Отлично",
              text: "Филиал изменен",
              color: "success",
              position: "top-center",
            });
          });
      } else {
        this.$store
          .dispatch("branches/addBranch", {
            ...payload,
          })
          .then((res) => {
            this.addPopup = false;
            this.$vs.notify({
              title: "Отлично",
              text: "Филиал создан.",
              color: "success",
              position: "top-center",
            });
          });
      }
    },
  },
  mounted() {
    this.fetchBranches();
  }
};
</script>
<style>

</style>
