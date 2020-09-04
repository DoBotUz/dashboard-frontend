import Vue from 'vue';

export default Vue.extend({
  template: `
  <vs-select autocomplete class="mb-4 mt-4" style="width: 100%" :value="selectedOption" @input="valueChanged($event)">
    <vs-select-item
      :key="index"
      :value="el.value"
      :text="el.label"
      v-for="(el, index) in options"
    />
  </vs-select>
    `,
  data: function() {
    return {
      options: [],
      selectedOption: '',
      optionsLable: '',
    };
  },
  beforeMount() {
    this.options = this.params.options;
    this.optionsLabel = this.params.optionsLabel;
  },
  mounted() {},
  methods: {
    valueChanged(value) {
      this.selectedOption = value;
      this.params.parentFilterInstance(function(instance) {
        instance.onFloatingFilterChanged('equals', value);
      });
    },
  },
});
