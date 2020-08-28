<template>
  <div class="py-10">
    <vs-table :data="functions" class="w-1/2">
      <template slot="thead">
        <vs-th>Название</vs-th>
        <vs-th>Статус</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              {{tr.label}}
            </vs-td>
            
            <vs-td>
              <vs-checkbox v-model="tr.active" style="width: fit-content;">
                Активен
              </vs-checkbox>
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
    <div class="flex flex-wrap items-center">
      <vs-button class="mt-10" @click="save">Сохранить</vs-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      functions: [
        {
          key: 'chat',
          label: 'Онлайн-чат',
          active: true,
        },
        {
          key: 'feedbacks',
          label: 'Отзывы',
          active: true,
        },
        {
          key: 'promocodes',
          label: 'Промокоды',
          active: true,
        },
        {
          key: 'self-service',
          label: 'Самовывоз',
          active: true,
        },
        {
          key: 'delivery',
          label: 'Доставка',
          active: true,
        },
        {
          key: 'ru_lang',
          label: 'Русский язык',
          active: true,
        },
        {
          key: 'uz_lang',
          label: 'Узбекский язык',
          active: true,
        },
        {
          key: 'en_lang',
          label: 'Английский язык',
          active: true,
        },
      ]
    }
  }  
}
</script>
<style lang="scss" scoped>

</style>