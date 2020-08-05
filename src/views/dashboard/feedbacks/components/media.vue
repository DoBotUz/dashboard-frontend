<template>
  <div class="media">
    <img :src="url" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    url: String,
    type: String
  },
  data() {
    return {
    };
  },
  methods: {
  },
  computed: {
    ...mapGetters('feedbacks', {
      feedbackTypes: 'feedback_types',
    }),
  },
  mounted() {
  }
}
</script>
<style lang="scss" scoped>

</style>
