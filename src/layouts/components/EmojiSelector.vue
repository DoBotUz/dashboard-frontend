<template>
  <div id="emoji-selector">

    <!-- Open Customizer Button -->
    <vs-button
      @click.stop="active=!active"
      color="primary"
      type="filled"
      class="emoji-selector-btn"
      icon="insert_emoticon" />

    <!-- Customizer Content -->
    <vs-sidebar
      click-not-close
      hidden-background
      position-right
      v-model="active"
      class="items-no-padding">
      <div class="h-full">
        <div class="customizer-header mt-6 flex items-center justify-between px-6 mb-6">
          <div>
            <h4>Выберите Эмоджи</h4>
            <small>При выборе он копируется в буфер обмена, и вы можете вставить его куда вам нужно</small>
          </div>
          <feather-icon icon="XIcon" @click.stop="active = false" class="cursor-pointer"></feather-icon>
        </div>
        <keep-alive>
          <picker set="messenger" :showPreview="false" :emojiTooltip="true" :showSearch="false" :i18n="getEmojiI18N()" style="width: 100%;" :infiniteScroll="false" @select="addEmojiToClipboard"/>
        </keep-alive>
      </div>
    </vs-sidebar>
  </div>
</template>


<script>
import { Picker } from 'emoji-mart-vue';

export default {
  data() {
    return {
      active: false,
    }
  },

  methods: {
    addEmojiToClipboard(emoji) {
      this.$clipboard(emoji.native);
      this.$vs.notify({
          title: `${emoji.native} Успех`,
          text: 'Эмоджи успешно скопирован',
          color: 'success',
          iconPack: 'feather',
          position: 'top-center',
          icon: 'icon-check-circle'
      });
      this.active = false;
    },
  },
  components: {
    Picker,
  }
}

</script>


<style lang="scss">
#emoji-selector {
  .vs-sidebar {
    position: fixed;
    z-index: 53002;
    width: 400px;
    max-width: 90vw;
    // @apply shadow-lg;
    box-shadow: 0 15px 30px 0 rgba(0,0,0,0.11), 0 5px 15px 0 rgba(0,0,0,0.08);
  }
}

.emoji-selector-btn {
  position: fixed;
  top: 50%;
  right: 0;
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  z-index: 53001;
  i{
    font-size: 30px;
  }
}

.scroll-area--customizer {
  height: calc(100% - 5rem);

  &:not(.ps) {
    overflow-y: auto;
  }
}
</style>

