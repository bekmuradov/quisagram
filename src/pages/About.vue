<template>
  <q-layout view="lHh lpR lFf">
    <q-header reveal class="bg-white text-black q-pa-md">
      <q-toolbar>
        <div v-if="menuIcon === `las la-grip-lines`">
          <q-btn
            dense
            flat
            round
            :icon="menuIcon"
            size="lg"
            class="q-ma-md"
            @click="changeIcon"
          />
        </div>
        <div v-else>
          <q-btn
            dense
            flat
            round
            :icon="menuIcon"
            size="lg"
            class="q-ma-md"
            color="white"
            @click="changeIcon"
          />
        </div>

        <q-toolbar-title class="text-center">
          <q-avatar>
            <q-icon name="ion-logo-instagram" size="lg" />
          </q-avatar>
        </q-toolbar-title>

        <q-btn
          to="/"
          flat
          dense
          no-caps
          indicator-color="transparent"
          size="18px"
          class="text-weight-regular gt-xs text-grey-10"
          :label="user.username"
        />
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="left"
      side="left"
      class="z-top"
      :width="1980"
      overlay
      content-class="text-black"
      style="border: none; opacity: 0.88; width: 75vw;"
    >
      <!-- drawer content -->
      <div class="animation q-pa-lg">
        <div v-if="menuIcon === `las la-times`">
          <q-btn
            dense
            flat
            round
            :icon="menuIcon"
            class="q-ma-md"
            size="lg"
            color="$white"
            @click="changeIcon"
          />
        </div>
        <q-list class="q-py-xl text-weight-light text-h2">
          <q-item clickable class="q-mb-sm q-mt-sm" to="/" exact>
            <q-item-section class="q-pl-sm">Home</q-item-section>
          </q-item>
          <q-item clickable class="q-mb-sm q-mt-sm" to="/about-us" exact>
            <q-item-section class="q-pl-sm">About us</q-item-section>
          </q-item>
          <q-item clickable class="q-mb-sm q-mt-sm" to="/blog" exact>
            <q-item-section class="q-pl-sm">Blog</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
      <div class="about-content">
        <q-img
          :src="url"
          spinner-color="white"
          class="gt-xs to-the-top"
        />
        <q-item class="row items-start justify-between q-px-none">
          <q-item-section class="text-h3 col-5">
            Bringing you closer to the people and things you love
          </q-item-section>
          <q-item-section class="col-5">
            <q-img :src="url" class="to-the-right" />
          </q-item-section>
        </q-item>
      </div>
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "PageAbout",
  data() {
    return {
      left: false,
      url: "https://source.unsplash.com/random/400*200",
      menuIcon: "las la-grip-lines",
    }
  },
  computed: {
    ...mapGetters({ user: 'pwrup/authUser' })
  },
  methods: {
    changeIcon() {
      (this.menuIcon =
        this.menuIcon === "las la-times"
          ? "las la-grip-lines"
          : "las la-times"),
        (this.left = !this.left);
    }
  }
};
</script>

<style lang="sass" scoped>
div.about-content
  width: 80vw !important

a.q-btn
  font-weight: 300
  font-size: 23px

div.q-drawer-container
  position: relative
  opacity: 1
  transform: none
  transition: opacity 500ms cubic-bezier(0, 0.61, 0.28, 0.92)

div.q-page-container
  position: absolute
  left: 14vw

div.q-img
  position: relative
  top: -230px !important
  z-index: 2001

div.q-img.to-the-top
  height: 300px
  max-width: 290px
  top: -115px !important

div.q-img.to-the-right
  height: 609px
  max-width: 487px
  left: 25px

q.page-container.constrain
  max-width: 100% !important

</style>

<!-- Animation CSS style -->
<style scoped>
@keyframes breathe {
  0% {
    background-color: #8a3ab9;
  }
  50% {
    background-color: #bc2a8d;
  }
  100% {
    background-color: #4c68d7;
  }
}

.animation {
  border: none;
  color: white;
  width: 80vw;
  height: 100vh;
  position: relative;
  animation: breathe 8s infinite;
  animation-delay: 0s;
  opacity: 1;
  top: 0;
  left: 0;
  mask-image: linear-gradient(
    to left,
    rgba(255, 255, 255, 0),
    rgba(255, 255, 255, 0.85) 21vw,
    rgba(255, 255, 255, 1) 35.714vw
  );
}
</style>
