// loader mixin
const types = [
  'default',
  'point',
  'radius',
  'corners',
  'border',
  'sound',
  'material',
];

export const loaderMixin = {
  data: () => ({
    mounted: false,
  }),
  watch: {
    loading(value) {
      if (value) {
        const allElements = document.querySelectorAll('.vs-con-loading__container');
        const filtered = Array.from(allElements)
          .filter(el => el.style.display !== 'none')
          .reduce((acc, curr, i, arr) => {
            if (window.getComputedStyle(curr).zIndex > 0) {
              arr.splice(1);
              return [curr];
            }
            return [...acc, curr];
          }, []);

        filtered.forEach(el => {
          this.$vs.loading({
            container: el,
            scale: 0.45,
            type: types[Math.round(Math.random() * types.length - 1)]
          });
        })
      } else {
        this.$vs.loading.close('.vs-con-loading__container > .con-vs-loading')
      }
    }
  }
}
