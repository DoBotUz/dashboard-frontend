<template>
  <div class="menu vs-con-loading__container">
    <vs-table search :data="tableData" @selected="onSelected">
      <div slot="header" class="flex flex-wrap-reverse items-center flex-grow justify-between">
        <div class="flex flex-wrap-reverse items-center">
          <!-- ADD NEW -->
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-primary border border-solid border-primary"
            @click="showAddCategoryPopup()"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-primary">Добавить категорию</span>
          </div>
          <div
            class="p-3 mb-4 mr-4 rounded-lg cursor-pointer flex items-center justify-between text-lg font-medium text-base text-success border border-solid border-success"
            @click="showAddProductPopup()"
          >
            <feather-icon icon="PlusIcon" svgClasses="h-4 w-4" />
            <span class="ml-2 text-base text-success">Добавить продукт</span>
          </div>
        </div>
      </div>

      <template slot="thead">
        <vs-th>Картинка</vs-th>
        <vs-th sort-key="name">Название</vs-th>
        <vs-th sort-key="parentCategoryId">Категория</vs-th>
        <vs-th sort-key="status">Статус</vs-th>
        <vs-th>Действия</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td class="img-container">
              <img src="https://via.placeholder.com/150" class="product-img" v-if="!tr.thumbnail"/>
              <img :src="isProduct(tr) ? `${$url}/public/items/${tr.thumbnail}` : `${$url}/public/categories/${tr.thumbnail}`" class="product-img" v-else />
            </vs-td>

            <vs-td>
              <p class="product-name font-medium">{{ tr.ru_title }}</p>
            </vs-td>

            <vs-td>
              <p
                class="product-category"
              >{{ tr.parent_category ? tr.parent_category.ru_title : 'Нет' }}</p>
            </vs-td>

            <vs-td>{{ statuses[tr.status] }}</vs-td>

            <vs-td class="whitespace-no-wrap">
              <feather-icon
                icon="EditIcon"
                svgClasses="w-5 h-5 hover:text-primary stroke-current"
                @click.stop="isProduct(tr) ? editProduct(tr) : editCategory(tr)"
              />
              <feather-icon
                icon="TrashIcon"
                svgClasses="w-5 h-5 hover:text-danger stroke-current"
                class="ml-2"
                @click.stop="deleteItem(tr)"
              />
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
    <vs-popup title="Добавить новую категорию" :active.sync="addCategoryPopup" class="vs-con-loading__container">
      <vs-input
        class="w-full mb-4"
        label="Название категории"
        v-model="ru_title"
        @blur="fillCategoryTitle"
      />
      <vs-input class="w-full mb-4" label="Название категории на узбекском" v-model="uz_title" />
      <vs-input class="w-full mb-4" label="Название категории на английском" v-model="en_title" />
      <vs-select autocomplete class="mb-4" label="Родительская категория" v-model="parentCategory">
        <vs-select-item
          :key="index"
          :value="item.id"
          :text="item.ru_title"
          v-for="(item,index) in categories"
        />
      </vs-select>
      <div class="vx-col w-full">
        <vs-upload
          :limit="1"
          :show-upload-button="false"
          text="Загрузить файл"
          ref="categoryFile"
        />
      </div>

      <div class="con-select-example" v-if="selectedCategory">
        <vs-select
        class="selectExample"
        label="Статус"
        v-model="status"
        >
          <vs-select-item v-for="(item, index) in statusesList" :key="index" :value="item.value" :text="item.text" />
        </vs-select>
      </div>

      <vs-button
        class="mt-5 mb-3 float-right"
        @click="addOrUpdateCategory"
        color="primary"
      >{{ selectedCategory ? 'Изменить' : 'Добавить' }}</vs-button>
    </vs-popup>
    <vs-popup title="Добавить продукт" :active.sync="addProductPopup">
      <vs-input
        class="w-full mb-4"
        label="Название продукта"
        v-model="product_ru_title"
        @blur="fillProductTitle"
      />
      <vs-textarea
        class="w-full mb-4"
        label="Описании продукта"
        v-model="product_ru_description"
        @blur="fillProductDescription"
      ></vs-textarea>

      <vs-input
        class="w-full mb-4"
        label="Название продукта на узбекском"
        v-model="product_uz_title"
      />
      <vs-textarea
        class="w-full mb-4"
        label="Описании продукта на узбекском"
        v-model="product_uz_description"
      ></vs-textarea>

      <vs-input
        class="w-full mb-4"
        label="Название продукта на английском"
        v-model="product_en_title"
      />
      <vs-textarea
        class="w-full mb-4"
        label="Описании продукта на английском"
        v-model="product_en_description"
      ></vs-textarea>

      <vs-input type="number" class="w-full mb-4" label="Цена продукта" v-model="product_price" />

      <vs-select
        autocomplete
        class="mb-4"
        label="Родительская категория"
        v-model="product_parent_category"
      >
        <vs-select-item
          :key="index"
          :value="item.id"
          :text="item.ru_title"
          v-for="(item,index) in childlessCategories"
        />
      </vs-select>

      <div class="vx-col w-full">
        <vs-upload
          :limit="1"
          :show-upload-button="false"
          text="Загрузить файл"
          ref="productFile"
        />
      </div>

      <div class="con-select-example" v-if="selectedProduct">
        <vs-select
        class="selectExample"
        label="Статус"
        v-model="status"
        >
          <vs-select-item v-for="(item, index) in statusesList" :key="index" :value="item.value" :text="item.text" />
        </vs-select>
      </div>


      <vs-button
        class="mt-5 mb-3 float-right"
        @click="addOrUpdateProduct"
        color="primary"
      >{{ selectedProduct ? 'Изменить' : 'Добавить' }}</vs-button>
    </vs-popup>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { loaderMixin } from '@/mixins';

export default {
  mixins: [loaderMixin],
  beforeRouteUpdate(to, from, next) {
    const parentId = to.params.parent;
    if (parentId === undefined) {
      to.meta.breadcrumb = [
        { title: "Заведения", url: '/', slug: "home" },
        { title: '', slug: 'organization-name', active: true },
      ];
      return next();
    }
    const currentCategory = this.categories.find(
      (cat) => cat.id === Number(parentId)
    );
    const categoriesTree = [];
    for (
      let category = currentCategory.parent_category;
      category;
      category = category.parent_category
    ) {
      categoriesTree.push({
        title: category.ru_title,
        url: {
          name: "DashboardMenu",
          params: {
            parent: category.id,
          },
        },
      });
    }
    to.meta.breadcrumb = [
      { title: "Заведения", url: '/', slug: "home" },
      { title: '', slug: 'organization-name', },
      { title: "Меню", url: { name: "DashboardMenu" } },
      ...categoriesTree,
      { title: currentCategory.ru_title, active: true },
    ];
    next();
  },
  props: {
    parent: Number,
  },
  data() {
    return {
      ru_title: "",
      en_title: "",
      uz_title: "",
      parentCategory: null,

      product_ru_title: "",
      product_en_title: "",
      product_uz_title: "",
      product_ru_description: "",
      product_en_description: "",
      product_uz_description: "",
      product_price: 0,
      product_parent_category: null,

      status: 10,

      addCategoryPopup: false,
      selectedCategory: null,
      addProductPopup: false,
      selectedProduct: null,
    };
  },
  head: {
    title() {
      return {
        inner: 'Продукты и Категории',
        complement: 'DoBot'
      }
    },
  },
  computed: {
    ...mapGetters('menu', {
      categories: "categories",
      categoriesByParentId: "categoriesByParentId",
      childlessCategories: "childlessCategories",
      productsByParentId: "productsByParentId",
      statuses: "statuses",
      loading: "loading",
    }),

    statusesList() {
      if (this.statuses) {
        let out = [];
        for(let status in this.statuses){
          out.push({
            text: this.statuses[status],
            value: status
          })
        }
        return out;
      }
      return [];
    },

    tableData() {
      if (this.categoriesByParentId(this.parent).length) {
        return this.categoriesByParentId(this.parent);
      }
      return this.productsByParentId(this.parent);
    },
  },
  methods: {
    ...mapActions("menu", ["fetchCategories", "fetchProducts"]),
    fillCategoryTitle() {
      if (this.uz_title === "") this.uz_title = this.ru_title;
      if (this.en_title === "") this.en_title = this.ru_title;
    },
    fillProductTitle() {
      if (this.product_uz_title === "")
        this.product_uz_title = this.product_ru_title;
      if (this.product_en_title === "")
        this.product_en_title = this.product_ru_title;
    },
    fillProductDescription() {
      if (this.product_uz_description === "")
        this.product_uz_description = this.product_ru_description;
      if (this.product_en_description === "")
        this.product_en_description = this.product_ru_description;
    },
    addOrUpdateCategory() {
      let file = this.$refs.categoryFile.filesx[this.$refs.categoryFile.filesx.length - 1];
      let payload = {
        organizationId: this.$store.state.organization.id,
        id: this.selectedCategory,
        thumbnail: file,
        ru_title: this.ru_title,
        uz_title: this.uz_title,
        en_title: this.en_title,
        parentCategoryId: this.parentCategory,
        ru_description: "placeholder",
        uz_description: "placeholder",
        en_description: "placeholder",
      };
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== null && payload[key] !== undefined)
          formData.append(key, payload[key]);
      });
      if (!this.selectedCategory) {
        return this.$store.dispatch("menu/createCategory", formData).then(() => {
          this.addCategoryPopup = false;
          this.$vs.notify({
            title: "Отлично",
            text: "Категория создана",
            color: "success",
            position: "top-center",
          });
        });
      }
      formData.append('status', this.status);
      return this.$store
        .dispatch("menu/updateCategory", formData)
        .then(() => {
          this.addCategoryPopup = false;
          this.$vs.notify({
            title: "Отлично",
            text: "Категория изменена",
            color: "success",
            position: "top-center",
          });
        });
    },
    onSelected(tr) {
      if (this.isProduct(tr)) {
        return;
      }
      this.$router.push({
        name: "DashboardMenu",
        params: {
          parent: tr.id,
        },
      });
    },
    addOrUpdateProduct() {
      let file = this.$refs.productFile.filesx[this.$refs.productFile.filesx.length - 1];
      let payload = {
        organizationId: this.$store.state.organization.id,
        id: this.selectedProduct,
        thumbnail: file,
        ru_title: this.product_ru_title,
        en_title: this.product_en_title,
        uz_title: this.product_uz_title,
        ru_description: this.product_ru_description,
        en_description: this.product_en_description,
        uz_description: this.product_uz_description,
        price: Number(this.product_price),
        categoryId: this.product_parent_category,
        amount: 1,
      };
      const formData = new FormData();
      Object.keys(payload).forEach((key) => {
        if (payload[key] !== null && payload[key] !== undefined)
          formData.append(key, payload[key]);
      });
      if (!this.selectedProduct) {
        return this.$store.dispatch("menu/createProduct", formData).then(() => {
          this.addProductPopup = false;
          this.$vs.notify({
            title: "Отлично",
            text: "Продукт создан",
            color: "success",
            position: "top-center",
          });
        });
      }
      formData.append('status', this.status);
      return this.$store
        .dispatch("menu/updateProduct", formData)
        .then(() => {
          this.addProductPopup = false;
          this.$vs.notify({
            title: "Отлично",
            text: "Продукт изменен",
            color: "success",
            position: "top-center",
          });
        });
    },
    isProduct(obj) {
      return obj.hasOwnProperty("price");
    },
    showAddProductPopup() {
      this.selectedProduct = null;
      this.product_ru_title = this.product_en_title = this.product_uz_title = this.product_ru_description = this.product_en_description = this.product_uz_description =
        "";
      this.product_price = 0;
      this.product_parent_category = null;
      if (this.childlessCategories.find((cat) => cat.id === this.parent)) {
        this.product_parent_category = this.parent;
      }
      this.addProductPopup = true;
    },
    showAddCategoryPopup() {
      this.selectedCategory = null;
      this.ru_title = this.uz_title = this.en_title = "";
      this.parentCategory = this.parent || null;
      this.addCategoryPopup = true;
    },
    editProduct(tr) {
      this.selectedProduct = tr.id;
      this.product_ru_title = tr.ru_title;
      this.product_en_title = tr.en_title;
      this.product_uz_title = tr.uz_title;
      this.product_ru_description = tr.ru_description;
      this.product_en_description = tr.en_description;
      this.product_uz_description = tr.uz_description;
      this.product_price = tr.price;
      this.product_parent_category = null;
      this.status = tr.status;
      if (this.childlessCategories.find((cat) => cat.id === tr.categoryId)) {
        this.product_parent_category = tr.categoryId;
      }
      this.addProductPopup = true;
    },
    editCategory(tr) {
      this.selectedCategory = tr.id;
      this.ru_title = tr.ru_title;
      this.uz_title = tr.uz_title;
      this.en_title = tr.en_title;
      this.parentCategory = tr.parentCategoryId;
      this.status = tr.status;
      this.addCategoryPopup = true;
    },
    deleteItem(tr) {
      this.$vs.dialog({
        type: "confirm",
        color: "danger",
        title: `Подтвердите действие`,
        acceptText: 'Удалить',
        cancelText: 'Отмена',
        text: `Вы действительно хотите удалить ${tr.ru_title}?`,
        accept: () => {
          this.$store
            .dispatch(
              this.isProduct(tr) ? "menu/deleteProduct" : "menu/deleteCategory",
              {
                id: tr.id,
              }
            )
            .then(() => {
              this.$vs.notify({
                title: "Отлично",
                text: "Позиция удалена",
                color: "sucess",
                position: "top-center",
              });
              this.$router.push({ name: 'DashboardMenu' });
            });
        },
      });
    },
  },
  mounted() {
    this.fetchCategories().then(() => {
      this.$router.replace({ query: { temp: undefined } });
    });
    this.fetchProducts();
  }
};
</script>
<style lang="scss" scoped>
.product-img {
  max-width: 150px;
}
</style>
