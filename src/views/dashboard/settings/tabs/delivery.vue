<template>
  <div class="py-10 w-full">
    <vs-checkbox class="mb-4" v-model="free_delivery">Бесплатная доставка</vs-checkbox>
    <section class="free-delivery-settings mb-4">
      <div class="vx-row mb-6 px-5 items-center" v-show="free_delivery">
        <div class="vx-col sm:w-1/4 w-full">
          <span>Бесплатно для заказов на сумму свыше: </span>
        </div>
        <div class="vx-col">
          <vs-input class="w-full" v-model="free_delivery_min_price" type="number" />
        </div>
        <div class="vx-col sm:w-1/4 w-full">
          <span>Сум</span>
        </div>
      </div>
      <div class="vx-row mb-6 px-5 items-center" v-show="free_delivery">
        <div class="vx-col sm:w-1/4 w-full">
          <span>Бесплатно для заказов в радиусе: </span>
        </div>
        <div class="vx-col">
          <vs-input class="w-full" v-model="free_delivery_radius" type="number" />
        </div>
        <div class="vx-col sm:w-1/4 w-full">
          <span>километров</span>
        </div>
      </div>
    </section>

    <vs-checkbox class="mb-4" v-model="fixed_delivery" :disabled="calculator">Фиксированная стоимость</vs-checkbox>
    <section class="fixed-delivery-settings mb-4">
      <div class="vx-row mb-6 px-5 items-center" v-show="fixed_delivery">
        <div class="vx-col sm:w-1/4 w-full">
          <span>Фиксированная стоимость доставки: </span>
        </div>
        <div class="vx-col">
          <vs-input class="w-full" v-model="fixed_delivery_price" type="number" />
        </div>
        <div class="vx-col sm:w-1/4 w-full">
          <span>Сум</span>
        </div>
      </div>
    </section>
  
    <vs-checkbox class="mb-4" v-model="calculator" :disabled="fixed_delivery">Калькулятор</vs-checkbox>
    <section class="delivery-settings px-5" v-show="calculator">
      <div class="vx-row mb-6 items-center" v-for="(rule, index) in calculation_rules" :key="index">
        <div class="vx-col">
          <vs-input class="w-full" type="number" v-model="calculation_rules[index].sum" />
        </div>
        <div class="vx-col">
          <span>сум в радиусе от </span>
        </div>
        <div class="vx-col">
          <vs-input class="w-full" type="number" v-model="calculation_rules[index].from" />
        </div>
        <div class="vx-col">
          <span>до</span>
        </div>
        <div class="vx-col">
          <vs-input class="w-full" type="number" v-model="calculation_rules[index].to" />
        </div>
        <div class="vx-col">
          <span>километров</span>
        </div>
        <div class="vx-col ml-auto" v-if="index > 0">
          <vs-button color="danger" icon-pack="feather" icon="icon-x" @click="deleteCalculationRule(index)"></vs-button>
        </div>
      </div>
      <div class="delivery-settings__buttons mb-6">
        <vs-button color="success" icon-pack="feather" icon="icon-plus" @click="newCalculationRule">правило</vs-button>
      </div>
      <div class="vx-row mb-6 items-center">
        <div class="vx-col">
          <vs-input class="w-full" type="number" v-model="calculation_sum_per_km" />
        </div>
        <div class="vx-col">
          <span>сум за каждый последующий километр</span>
        </div>
      </div>
    </section>
    <div class="flex flex-wrap items-center">
      <vs-button class="mt-10" @click="save">Сохранить</vs-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      free_delivery: false,
      free_delivery_min_price: 0,
      free_delivery_radius: 0,

      fixed_delivery: false,
      fixed_delivery_price: 0,

      calculator: false,
      calculation_rules: [{
        sum: 0,
        from: 0,
        to: 0,
      }],
      calculation_sum_per_km: 0,
    };
  },
  methods: {
    newCalculationRule() {
      this.calculation_rules.push({
        sum: 0,
        from: 0,
        to: 0
      })
    },
    deleteCalculationRule(index) {
      this.calculation_rules.splice(index, 1);
    }
  },
};
</script>
<style lang="scss" scoped>
</style>