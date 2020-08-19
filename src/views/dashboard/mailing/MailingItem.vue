<template>
    <div class="mailing__mailing-item sm:px-4 px-2 py-6">
        <div class="vx-col w-full ml-auto flex justify-between">
          <div class="mailing__labels mb-2 ml-2">
            <vs-chip>
              <div class="h-2 w-2 rounded-full mr-2" :class="'bg-' + categoryColor(mailing.category)"></div>
              <span>{{ categoryLabel(mailing.category) | capitalize }}</span>
            </vs-chip>
          </div>
          <span>Дата создания: {{ mailing.created_at | date }}</span>
        </div>
        <!-- MAIL ROW 1 : META -->
        <div class="flex w-full">
            <div class="vx-col">
              <img class="sender__avatar flex-shrink-0 mr-3 border-2 border-solid border-white" :src="mailing.thumbnail ? `${$url}/public/mailing-templates/${mailing.thumbnail}` : 'https://via.placeholder.com/150'" width="80px" height="80px" />
            </div>
            <div class="vx-col w-full sm:w-8/12 flex sm:flex-col">
                <div class="mailing__details flex items-center">
                    <h5 class="mb-1 font-semibold">{{ mailing.ru_title }}</h5>
                </div>
                <div class="mailing__message truncate">
                    <span>{{ mailing.ru_description | filter_tags }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  props: {
    mailing: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isSelectedMailing: this.isSelected
    }
  },
  watch: {
    isSelected (value) {
      this.isSelectedMailing = value
    },
    isSelectedMailing (val) {
      val ? this.$emit('addToSelected', this.mailing.id) : this.$emit('removeSelected', this.mailing.id)
    }
  },
  computed: {
    ...mapState('mailing', ['mailingCats']),
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
  methods: {
    toggleIsStarred () {
      const payload = { mailingId: this.mailing.id, value: !this.mailing.isStarred }
      this.$store.dispatch('emailing/toggleIsMailingStarred', payload)
    }
  }
}

</script>

