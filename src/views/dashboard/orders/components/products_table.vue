<template lang="html">
  <div class="mt-5">
    <vs-table :data="order_items">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center data-list-btn-container">
          <div
            class="btn-add-new p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-center text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="onAddProduct"
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
        <vs-th>
          Действия
        </vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            {{tr.item.ru_title}}
          </vs-td>

          <vs-td>{{tr.item.price}}</vs-td>

          <vs-td>
            {{tr.amount}}
          </vs-td>

          <vs-td>{{tr.item.price * tr.amount}} сум</vs-td>
          <vs-td>
            <feather-icon
                icon="EditIcon"
                svgClasses="w-5 h-5 hover:text-primary stroke-current"
                @click.stop="editProduct(tr)"
              />
            <feather-icon
              icon="TrashIcon"
              svgClasses="w-5 h-5 hover:text-danger stroke-current"
              class="ml-2"
              @click.stop="deleteItem(tr)"
            />
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <vs-button class="mt-5 mb-3" color="primary" type="filled" @click="onSave">Сохранить</vs-button>
    <vs-popup title="Добавить/изменить продукт" :active.sync="addOrEditPopup" class="add-popup">
      <field label="Продукт" class="mb-10">
        <v-select
          :options="products.map((product) => ({
            label: product.ru_title,
            value: product.id
          }))"
          :reduce="status => status.value"
          :clearable="false"
          v-model="new_item.id"
        />
      </field>
      <field label="Стоимость" v-if="new_item.id" class="mb-10">
        {{ selectedProduct.price }} сум
      </field>
      <field class="mb-10">
        <vs-input-number v-model="new_item.amount" label="Количество: " :min="0" />
      </field>
      <field label="Итого" v-if="new_item.id" class="mb-10">
        {{ selectedProduct.price * new_item.amount }} сум
      </field>
      <vs-button class="mt-5 mb-3" color="primary" type="filled" @click="saveProduct">Добавить</vs-button>
    </vs-popup>
  </div>
</template>
<script>
import Field from './field.vue';
import { mapActions, mapGetters } from "vuex";

export default {
  components: {
    Field,
  },
  props: {
    order: Object,
  },
  data() {
    return {
      editable_items: [],
      addOrEditPopup: false,
      new_item: {
        id: null,
        amount: 1
      },
    }
  },
  methods: {
    ...mapActions("menu", {
      fetchProducts: "fetchProducts",
    }),
    addProduct() {
      return false;
    },
    editProduct(product) {
      this.new_item = {
        id: product.item.id,
        amount: product.amount
      };
      this.addOrEditPopup = true;
    },
    deleteItem(product) {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Подтвердите действие`,
        text: `Вы действительно хотите удалить эту позицию?`,
        accept: () => {
          this.order_items = this.order_items.filter(item => item.item.id !== product.item.id);
          this.$vs.notify({
            title: "Окей",
            text: "Позиция удалена",
            color: "success",
            position: "top-center",
          });
        },
      });
    },
    onSave() {
      this.$emit("save", {
        order_items: this.order_items
      });
    },
    onChangeAmount(id, amount) {
      this.order_items = this.order_items.map(item => {
        if (item.id === id) {
          item.amount = amount;
        }
        return item;
      });
    },
    onAddProduct() {
      this.addOrEditPopup = true;
    },
    saveProduct() {
      let index = this.order_items.findIndex(product => product.item.id === this.new_item.id)
      if (index > -1) {
        this.order_items[index].amount = this.new_item.amount;
      } else {
        this.order_items.push({
          order_id: this.order.id,
          amount: this.new_item.amount,
          item_id: this.new_item.id,
          item: this.selectedProduct,
        });
      }
      this.addOrEditPopup = false;
      this.new_item = {
        id: null,
        amount: 1
      }
    }
  },
  computed: {
    ...mapGetters("menu", {
      products: "products",
    }),
    order_items: {
      get: function() {
        if (!this.editable_items.length && this.order) {
          this.editable_items = this.order.order_items;
        }
        return this.editable_items;
      },
      set: function(value) {
        this.editable_items = value;
      }
    },
    selectedProduct() {
      return this.products.find(prod => prod.id === this.new_item.id);
    }
  },
  mounted() {
    this.fetchProducts();
  },
};
</script>
<style lang="scss" scoped>
.add-popup {
  /deep/ .vs-popup {
    height: 600px;
    &--content {
      height: 100%;
    }
  }
}
</style>
