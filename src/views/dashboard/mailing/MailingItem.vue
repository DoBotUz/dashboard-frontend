<template>
    <div class="mailing__mailing-item sm:px-4 px-2 py-6">

        <!-- MAIL ROW 1 : META -->
        <div class="flex w-full">
            <img class="sender__avatar flex-shrink-0 mr-3 border-2 border-solid border-white" :src="mailing.thumbnail ? `${$url}/public/mailing-templates/${mailing.thumbnail}` : '/eye.png'" width="40px" />

            <div class="flex w-full justify-between items-start">
                <div class="mailing__details">
                    <h5 class="mb-1 font-semibold">{{ mailing.ru_title }}</h5>
                </div>

                <div class="mailing-item__meta flex items-center">
                    <div class="mailing__labels hidden sm:flex items-center">
                        <div class="h-2 w-2 rounded-full mr-2" :class="'bg-' + categoryColor(mailing.category)"></div>
                    </div>
                    <span>{{ mailing.after_date_time | date }}</span>
                </div>
            </div>

        </div>
        <div class="flex w-full">
            <div class="flex items-center ml-10">
              <div class="mailing__message truncate ml-3">
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

