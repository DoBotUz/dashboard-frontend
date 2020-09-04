import Vue from 'vue';

export default Vue.extend({
  template: `
    <div class="whitespace-no-wrap">
      <feather-icon
        icon="EditIcon"
        svgClasses="w-5 h-5 hover:text-primary stroke-current"
        @click.stop="editItemClicked"
        v-if="showEdit"
      />
      <feather-icon
        icon="TrashIcon"
        svgClasses="w-5 h-5 hover:text-danger stroke-current"
        class="ml-2"
        @click.stop="deleteItem(tr)"
        v-if="showDelete"
      />
    </div>
    `,
  data() {
    return {
      showEdit: false,
      showDelete: false,
      showView: false,
    };
  },

  beforeMount() {
    this.showEdit = this.params.showEdit ? this.params.showEdit : false;
    this.showDelete = this.params.showDelete ? this.params.showDelete : false;
    this.showView = this.params.showView ? this.params.showView : false;
  },

  methods: {
    editItemClicked() {
      this.params.clicked(this.params.data.id);
    },

    deleteItemClicked() {
      // this.params.clicked(this.params.value);
    }
  },
});
