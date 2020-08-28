<template>
  <div class="py-10">
    <vs-table :data="payment_types">
      <template slot="thead">
        <vs-th>Название</vs-th>
        <vs-th>Токен</vs-th>
        <vs-th>Статус</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              {{tr.label}}
            </vs-td>

            <vs-td>
              <div v-if="tr.hasToken">
                <vs-input class="w-3/4" v-model="tr.token" placeholder="Токен" />
              </div>
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
      payment_types: [
        {
          key: "cash",
          label: "Наличные",
          hasToken: false,
          active: true,
          token: '',
        },
        {
          key: "terminal",
          label: "Терминал",
          hasToken: false,
          active: true,
          token: '',
        },
        {
          key: "payme",
          label: "Payme",
          hasToken: true,
          active: true,
          token: '',
        },
        {
          key: "click",
          label: "Click",
          hasToken: true,
          active: true,
          token: '',
        },
      ],
    };
  },
};
</script>
<style lang="scss" scoped>
</style>