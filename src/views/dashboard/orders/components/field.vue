<template>
  <div class="field">
    <span class="field__label">{{ label }}</span>
    <slot>
      <span class="field__value">{{ value }}</span>
    </slot>
  </div>
</template>
<script>
export default {
  props: {
    label: String,
    value: {
      validator: v => true
    },
  }
}
</script>
<style lang="scss" scoped>
.field {
  display: flex;
  flex-direction: column;
  &__label {
    margin-bottom: 10px;
    font-size: .9em;
    font-weight: 500;
  }
  &__value {
    font-weight: bold;
  }
}
</style>