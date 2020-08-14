<template>
  <div class="media">
    <img :src="url" v-if=" types[type]=='photo' " class="media__photo" @click="isPopupOpen = true"/>
    <div class="media__audio" v-if="isAudio" @click="sound.playing() ? sound.stop() : sound.play()">
      <vs-icon icon="play_arrow" size="50px" v-if="!sound.playing()" />
      <vs-icon icon="stop" size="50px" v-if="sound.playing()" />
    </div>
    <a href="#" @click="isPopupOpen = true" v-if="types[type] == 'video'">Открыть видео</a>
    <vs-popup :active.sync="isPopupOpen" title="Отзыв">
      <img class="popup-media" :src="url" v-if=" types[type]=='photo' "/>
      <video class="popup-media" controls v-if="types[type] == 'video'">
        <source :src="url" type="video/mp4">
      </video>
    </vs-popup>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {Howl, Howler} from 'howler';

export default {
  props: {
    url: String,
    type: Number,
  },
  data() {
    return {
      types: {
        1: "text",
        2: "photo",
        3: "video",
        4: "audio",
        5: "voice",
      },
      sound: null,
      isPopupOpen: false,
    };
  },
  methods: {
  },
  computed: {
    ...mapGetters("feedbacks", {
      feedbackTypes: "feedback_types",
    }),
    isAudio() {
      return this.types[this.type] == 'voice' ||
            this.types[this.type] == 'audio';
    }
  },
  mounted() {
    if (this.isAudio) { 
      this.sound = new Howl({
        src: [this.url]
      })
    }
  },
};
</script>
<style lang="scss" scoped>
.media__photo {
  width: 150px;
  display: block;
  img {
    max-width: 100%;
  }
}
.media__audio {
  padding: 15px;
  border-radius: 50%;
  border: 1px solid black;
  width: 75px;
  height: 75px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.con-vs-popup .vs-popup {
  .popup-media {
    max-width: 100%;
  }
}
</style>
