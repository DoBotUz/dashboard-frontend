<template>
  <vx-card class="px-4">
    <div class="mailing-card__image">
        <img :src="`${$url}/public/mailing-templates/${mailingContent.thumbnail}`" alt="content-img" class="responsive">
    </div>
    <div class="mailing-card__property">
      <h5 class="mb-2">Описание на русском</h5>
      <p>{{ mailingContent.ru_description }}</p>
    </div>
    <div class="mailing-card__property">
      <h5 class="mb-2">Описание на узбекском</h5>
      <p>{{ mailingContent.uz_description }}</p>
    </div>
    <div class="mailing-card__property">
      <h5 class="mb-2">Описание на английском</h5>
      <p>{{ mailingContent.en_description }}</p>
    </div>
    <div class="mailing-card__property">
      <h5 class="mb-2">Файлы</h5>
      <!-- todo -->
    </div>
  </vx-card>
</template>

<script>
export default {
  props: {
    mailingContent: {
      type: Object,
      required: true,
    },
  },
};
</script>
<style lang="scss" scoped>
.mailing-card {
  &__image {
    max-width: 500px;
    margin: 20px auto;
  }
  &__property {
    margin-bottom: 20px;
  }
}
</style>