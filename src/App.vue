<!-- =========================================================================================
	File Name: App.vue
	Description: Main vue file - APP
	----------------------------------------------------------------------------------------
	Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
	Author: Pixinvent
	Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->


<template>
  <div id="app" :class="vueAppClasses">
    <router-view @setAppClasses="setAppClasses" />
  </div>
</template>

<script>
import themeConfig from "@/../themeConfig.js";
import axios from "./axios";
import io from 'socket.io-client';


export default {
  data() {
    return {
      vueAppClasses: [],
    };
  },
  watch: {
    "$store.state.theme"(val) {
      this.toggleClassInBody(val);
    },
    "$vs.rtl"(val) {
      document.documentElement.setAttribute("dir", val ? "rtl" : "ltr");
    },
  },
  methods: {
    toggleClassInBody(className) {
      if (className == "dark") {
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
        document.body.classList.add("theme-dark");
      } else if (className == "semi-dark") {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-semi-dark");
      } else {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
      }
    },
    setAppClasses(classesStr) {
      this.vueAppClasses.push(classesStr);
    },
    handleWindowResize() {
      this.$store.commit("UPDATE_WINDOW_WIDTH", window.innerWidth);

      // Set --vh property
      document.documentElement.style.setProperty(
        "--vh",
        `${window.innerHeight * 0.01}px`
      );
    },
    handleScroll() {
      this.$store.commit("UPDATE_WINDOW_SCROLL_Y", window.scrollY);
    },
  },
  mounted() {
    // const clientSocket = io('http://localhost:3000/frontend', {
    //   query: {
    //     authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImFzZEBtYWlsLmNvbSIsInN1YiI6MSwiaWF0IjoxNTk3NDg2ODIyLCJleHAiOjE1OTgwOTE2MjJ9.StDUDbpLUponWx5tk6V0TQaCFpxyrly8RLfR-FK5Gn0',
    //   },
    // });
    // clientSocket.on('connect', function() {
    //   console.log('Connected');
    //   clientSocket.emit('events', { test: 123 });
    // });

    // clientSocket.on('newNotification', data => {
    //   console.log(data);
    // });

    this.toggleClassInBody(themeConfig.theme);
    this.$store.commit("UPDATE_WINDOW_WIDTH", window.innerWidth);

    let vh = window.innerHeight * 0.01;
    // Then we set the value in the --vh custom property to the root of the document
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  },
  async created() {
    let dir = this.$vs.rtl ? "rtl" : "ltr";
    document.documentElement.setAttribute("dir", dir);

    window.addEventListener("resize", this.handleWindowResize);
    window.addEventListener("scroll", this.handleScroll);

    let that = this;
    axios.interceptors.response.use(undefined, function (err) {
      return new Promise(function (resolve, reject) {
        if (err.response.status === 401) {
          that.$store.dispatch('logout')
            .then(_ => { that.$router.push('/pages/login'); })
        }
        throw err;
      });
    });
    this.$store.dispatch('setAuthHeaders');
  },
  destroyed() {
    window.removeEventListener("resize", this.handleWindowResize);
    window.removeEventListener("scroll", this.handleScroll);
  },
};
</script>
