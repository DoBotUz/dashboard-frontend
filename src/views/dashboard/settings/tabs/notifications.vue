<template>
  <div class="py-10">
    <vs-table :data="notifications">
      <template slot="thead">
        <vs-th>Название</vs-th>
        <vs-th>Сообщение</vs-th>
        <vs-th>Статус</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :key="indextr" v-for="(tr, indextr) in data" :data="tr">
            <vs-td>{{tr.label}}</vs-td>

            <vs-td>
              <p class="truncate description">
                {{ tr.ru_description }}
              </p>
            </vs-td>

            <vs-td>
              <vs-checkbox v-model="tr.active" style="width: fit-content;">Активен</vs-checkbox>
            </vs-td>

            <template class="w-full" slot="expand">
              <div class="flex flex-col w-1/2">
                <vs-textarea class="mb-2 w-full" v-model="tr.ru_description" label="Сообщение на русском" />
                <vs-textarea class="mb-2 w-full" v-model="tr.uz_description" label="Сообщение на узбекском" />
                <vs-textarea class="mb-2 w-full" v-model="tr.en_description" label="Сообщение на английском" />
              </div>
            </template>
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
      notifications: [
        {
          key: "ACCEPTED",
          label: "Принят",
          ru_description: "Ваш заказ принят ✔",
          uz_description: "Ваш заказ принят ✔",
          en_description: "Ваш заказ принят ✔",
          active: true,
        },
        {
          key: "READY",
          label: "Готов",
          ru_description: "Ваш заказ готов и ожидает отправки 🚚",
          uz_description: "Ваш заказ готов и ожидает отправки 🚚",
          en_description: "Ваш заказ готов и ожидает отправки 🚚",
          active: true,
        },
        {
          key: "DELIVERED",
          label: "Доставлен",
          ru_description: "Ваш заказ доставлен. Приятного аппетита 😋",
          uz_description: "Ваш заказ доставлен. Приятного аппетита 😋",
          en_description: "Ваш заказ доставлен. Приятного аппетита 😋",
          active: true,
        },
        {
          key: "CANCELLED",
          label: "Отменен",
          ru_description:
            "Ваш заказ отменен. Пожалуйста, свяжитесь с нами через онлайн-чат, либо но номеру +998911234567, если заказ был отменен по ошибке.",
          uz_description:
            "Ваш заказ отменен. Пожалуйста, свяжитесь с нами через онлайн-чат, либо но номеру +998911234567, если заказ был отменен по ошибке.",
          en_description:
            "Ваш заказ отменен. Пожалуйста, свяжитесь с нами через онлайн-чат, либо но номеру +998911234567, если заказ был отменен по ошибке.",
          active: true,
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
.description {
  max-width: 400px;
}
</style>