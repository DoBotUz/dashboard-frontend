<template lang="html">
  <div>
    <vs-table :data="products">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
          <!-- ADD NEW -->
          <div
            class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="addProduct"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Добавить продукт</span>
          </div>
        </div>
      </div>
      <template slot="thead">
        <vs-th>
          Название продукта
        </vs-th>
        <vs-th>
          Стоимость
        </vs-th>
        <vs-th>
          Количество
        </vs-th>
        <vs-th>
          Итого
        </vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td :data="tr.name">
            {{tr.name}}
            <div slot="edit">
              <vs-select
                placeholder="Название продукта"
                autocomplete
              >
              </vs-select>
            </div>
          </vs-td>

          <vs-td>{{tr.price}}</vs-td>

          <vs-td :data="tr.amount">
            {{tr.amount}}
            <div slot="edit">
              <vs-input-number v-model="tr.amount" />
            </div>
          </vs-td>

          <vs-td>
            {{tr.price * tr.amount}} сум
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
  </div>
</template>

<script>
export default {
  data: () => ({
    products: [
      {
        id: 1,
        name: "Бургер",
        price: "10000",
        amount: 2,
      },
      {
        id: 2,
        name: "Пицца",
        price: "10000",
        amount: 2,
      },
      {
        id: 3,
        name: "Кола",
        price: "10000",
        amount: 2,
      },
      {
        id: 4,
        name: "Стаканы",
        price: "10000",
        amount: 2,
      }
    ],
  }),
  methods: {
    addProduct() {
      return false;
    }
  }
};
</script>
