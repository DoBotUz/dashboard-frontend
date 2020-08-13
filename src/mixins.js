import Vue from 'vue'

// loader mixin
export const loaderMixin = {
  watch: {
    loading(value) {
      if (value) {
        this.$vs.loading({
          background: this.backgroundLoading,
          color: this.colorLoading,
          container: '.vs-con-loading__container',
          scale: 0.45
        });
      } else {
        this.$vs.loading.close('.vs-con-loading__container > .con-vs-loading')
      }
    }
  }
}