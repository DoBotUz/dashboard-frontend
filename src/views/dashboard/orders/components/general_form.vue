<template>
  <div class="py-10">
    <vs-row>
      <vs-col vs-w="4">
        <div class="fields">
          <field label="ID" :value="order.id" />
          <field label="Адрес доставки">
            <vs-input class="w-full" value="Открыть в Яндекс.карты" @focus="onMapOpen" />
          </field>
          <field label="Статус заказа">
            <vs-select class="w-full" placeholder="...">
              <vs-select-item :key="index" :value="item[0]" :text="item[1]" v-for="(item,index) in Object.entries(order_statuses)" />
            </vs-select>
          </field>
          <field label="Промокод">
            <vs-select class="w-full" placeholder="Нет">
            </vs-select>
          </field>
        </div>
      </vs-col>
      <vs-col vs-w="4" vs-offset="2">
        <div class="fields">
          <field label="Клиент">
            <vs-select class="w-full" placeholder="...">
            </vs-select>
          </field>
          <field label="Способ оплаты">
            <vs-select class="w-full" placeholder="...">
            </vs-select>
          </field>
          <field class="w-full" label="Сумма оплаты" :value="`${order.total_charge} сум`" />
          <field class="w-full" label="Дата создания" :value="order.created_at | date" />
        </div>
      </vs-col>
      <vs-col vs-w="6">
        <vs-button class="mt-5 mb-3" color="primary" type="filled">Сохранить</vs-button>
      </vs-col>
    </vs-row>
  </div>
</template>
<script>
import Field from './field.vue';

export default {
  components: {
    Field,
  },
  props: {
    order: Object,
  },
  data() {
    return {
      order_statuses: {
        10: 'Новый',
        11: 'Отменен',
        12: 'Закрыт',
        13: 'Готовится',
        14: 'В пути',
        15: 'Доставлен',
      }
    }
  },
  methods: {
    onMapOpen(e) {
      // todo blur
    }
  }
}
</script>
<style lang="scss" scoped>
.fields .field {
  margin-bottom: 20px;
}
</style>