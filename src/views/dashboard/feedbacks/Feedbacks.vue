<template>
  <div class="feedbacks">
    <vs-table ref="table" search :data="feedbacks" :max-items="15" pagination>
      <template slot="thead">
        <vs-th sort-key="created_at">Дата</vs-th>
        <vs-th sort-key="rate">Оценка</vs-th>
        <vs-th sort-key="bot_user_id">Автор</vs-th>
        <vs-th>Комментарий</vs-th>
        <vs-th>Медиа</vs-th>
      </template>

      <template slot-scope="{data}">
        <tbody>
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <p class="font-medium">{{ tr.created_at | date }}</p>
            </vs-td>
            <vs-td>
              <p class="font-medium">
                <star-rating
                 :rating="tr.rating"
                 :inline="true"
                 :star-size="20"
                 :read-only="true"
                 :show-rating="false" 
                ></star-rating>
              </p>
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.bot_user.phone_number }}</p>
            </vs-td>
            <vs-td>
              <p class="font-medium">{{ tr.comment }}</p>
            </vs-td>
            <vs-td>
              <feedback-media :type="tr.type" :url="tr.file" />
            </vs-td>
          </vs-tr>
        </tbody>
      </template>
    </vs-table>
  </div>
</template>
<script>
import { mapActions, mapGetters } from 'vuex';
import StarRating from 'vue-star-rating';
import FeedbackMedia from './components/media.vue';

export default {
  components: {
    StarRating,
    FeedbackMedia,
  },
  data() {
    return {

    }
  },
  computed: {
    ...mapGetters('feedbacks', {
      feedbacks: 'feedbacks'
    }),
  },
  methods: {
    ...mapActions('feedbacks', ['fetchFeedbacks']),
  },
  mounted() {
    this.fetchFeedbacks();
  }
}
</script>
<style lang="scss" scoped>
</style>
