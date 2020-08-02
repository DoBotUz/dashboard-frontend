<template>
  <div
    class="organization"
    @click="$router.push(`/shop/${id}/`)"
  >
      <vx-card class="text-center cursor-pointer">
        <img src="/maps-and-flags.png" alt="graphic" width="180" class="mx-auto mb-4" />
        <h4 class="mb-2">{{ title }}</h4>
        <small>{{ description }}</small>
      </vx-card>
  </div>
</template>
<script>
export default {
  props: {
    id: Number,
    title: String,
    description: String,
  },
  head: {
    title() {
      return {
        inner: this.title
      }
    },
  },
};
</script>
<style lang="scss" scoped>
</style>
