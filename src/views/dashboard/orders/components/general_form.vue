<template>
  <div class="py-10">
    <vs-row>
      <vs-col vs-w="4" class="pr-10">
        <div class="fields">
          <field label="ID" :value="order.id" />
          <field label="Адрес доставки">
            <vs-input class="w-full" value="Открыть в Яндекс.карты" @focus="onClickEditAddress" />
            <vs-popup title="Нажмите на точку на карте, чтобы изменить локацию" :active.sync="editLocationPopup" fullscreen>
              <yandex-map :coords="orderLocation" :zoom="10" @click="onClickOnMap">
                <ymap-marker
                  marker-id="2"
                  :coords="orderLocation"
                  :balloon="{header: 'Доставить сюда'}"
                />
              </yandex-map>
            </vs-popup>
          </field>
          <field label="Статус заказа">
            <v-select
              :value="order_statuses[updated_order.status || order.status]"
              :options="Object.entries(order_statuses).map((status) => ({
                label: status[1],
                value: Number(status[0])
              }))"
              :reduce="status => status.value"
              :clearable="false"
              @input="onOrderStatusChange"
            />
          </field>
          <field label="Промокод">
            <vs-select class="w-full" placeholder="Нет" disabled></vs-select>
          </field>
        </div>
      </vs-col>
      <vs-col vs-w="4" class="pr-10">
        <div class="fields">
          <field label="Клиент">
            <vs-select class="w-full" :value="order.phone" disabled :placeholder="order.phone"></vs-select>
          </field>
          <field label="Способ оплаты">
            <vs-select class="w-full" :value="payment_types[order.payment_type]" disabled :placeholder="payment_types[order.payment_type]"></vs-select>
          </field>
          <field class="w-full" label="Сумма оплаты" :value="`${order.total_charge} сум`" />
          <field class="w-full" label="Дата создания" :value="order.created_at | date" />
        </div>
      </vs-col>
      <vs-col vs-w="4">
        <field class="w-full" label="Комментарий">
          <vs-textarea
            v-model="orderComment"
            height="200px"
          />
        </field>
      </vs-col>
      <vs-col vs-w="6">
        <vs-button class="mt-5 mb-3" color="primary" type="filled" @click="onSave">Сохранить</vs-button>
      </vs-col>
    </vs-row>
  </div>
</template>
<script>
import Field from "./field.vue";
import { mapGetters } from 'vuex';

export default {
  components: {
    Field,
  },
  props: {
    order: Object,
  },
  data() {
    return {
      updated_order: {},
      editLocationPopup: false,
    };
  },
  methods: {
    onClickEditAddress(e) {
      if (this.order.lat && this.order.lng && !this.order.address) {
        e.preventDefault();
        this.editLocationPopup = true;
        return false;
      }
    },
    onClickOnMap(e) {
      this.editLocationPopup = false;
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Подтвердите действие`,
        text: `Вы действительно хотите изменить адрес доставки?`,
        accept: () => {
          this.orderLocation = e.get("coords");
          this.$vs.notify({
            title: "Отлично",
            text: "Локация изменена",
            color: "success",
            position: "top-center",
          });
        },
        cancel: () => {
          this.editLocationPopup = true;
        }
      });
    },
    onSave() {
      this.$emit("save", this.updated_order);
    },
    onOrderStatusChange(value) {
      this.$set(this.updated_order, 'status', value);
    }
  },
  computed: {
    ...mapGetters('orders', {
      order_statuses: 'order_statuses',
      payment_types: 'payment_types',
    }),
    orderLocation: {
      get: function() {
        if (this.updated_order.lat) {
          return [this.updated_order.lat, this.updated_order.lng];
        }
        return [this.order.lat, this.order.lng];
      },
      set: function(val) {
        this.$set(this.updated_order, 'lat', val[0])
        this.$set(this.updated_order, 'lng', val[1])
      },
    },
    orderComment: {
      get: function() {
        return this.updated_order.comment ? this.updated_order.comment : this.order.comment;
      },
      set: function(val) {
        this.$set(this.updated_order, 'comment', val)
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.fields .field {
  margin-bottom: 20px;
}
</style>