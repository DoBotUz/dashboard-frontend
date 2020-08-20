<template>
  <vx-card class="px-4">

    <div class="w-full mb-10">
      <vs-chip :color="getStatusColor(mailingContent.status)" class="mr-2">
        {{ getStatusLabel(mailingContent.status) }}
      </vs-chip>
      <vs-chip>
        <div class="h-2 w-2 rounded-full mr-2" :class="'bg-' + categoryColor(mailingContent.category)"></div>
        <span>{{ categoryLabel(mailingContent.category) | capitalize }}</span>
      </vs-chip>
    </div>
    <div class="mailing-card__image mb-5 clear-left">
        <img :src="mailingContent.thumbnail ? `${$url}/public/mailing-templates/${mailingContent.thumbnail}` : 'https://via.placeholder.com/150'" alt="content-img" width="150px" height="150px">
    </div>
    <div class="mailing-card__property">
      <h5 class="mb-2">Заголовок на русском</h5>
      <p>{{ mailingContent.ru_title }}</p>
    </div>
    <div class="mailing-card__property">
      <h5 class="mb-2">Заголовок на узбекском</h5>
      <p>{{ mailingContent.uz_title }}</p>
    </div>
    <div class="mailing-card__property">
      <h5 class="mb-2">Заголовок на английском</h5>
      <p>{{ mailingContent.en_title }}</p>
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
      <h5 class="mb-2">Дата начала отправки</h5>
      <p>{{ mailingContent.after_date_time | date }}</p>
    </div>
    <div class="mailing-card__property">
      <h5 class="mb-2">Файлы</h5>
      <!-- todo -->
    </div>
    <vs-list>
      <vs-list-header title="Мета"></vs-list-header>
      <vs-list-item title="Дата создания" :subtitle="mailingContent.created_at | date"></vs-list-item>
      <vs-list-item title="Дата редактирования" :subtitle="mailingContent.updated_at | date"></vs-list-item>
    </vs-list>
  </vx-card>
</template>

<script>
import { mapState, mapGetters } from 'vuex';
export default {
  props: {
    mailingContent: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapState('mailing', ['mailingCats']),
    ...mapGetters("mailing", ['getStatusColor', 'getStatusLabel']),
    categoryColor () {
      return (category) => {
        if(this.mailingCats && this.mailingCats.length) {
          return this.mailingCats.find((cat) => {
            return cat.value === category
          }).color
        }
        return '';
      }
    },
    categoryLabel () {
      return (category) => {
        if(this.mailingCats && this.mailingCats.length) {
          return this.mailingCats.find((cat) => {
            return cat.value === category
          }).text
        }
        return '';
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.mailing-card {
  &__property {
    margin-bottom: 20px;
  }
}
</style>
