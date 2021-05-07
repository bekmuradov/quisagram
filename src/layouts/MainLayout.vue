<template>
  <q-layout view="hHh lpR fFf" >

    <!-- Header -->
    <q-header
      v-if="!$route.meta.hideHeader"
      bordered
      class="bg-white text-black"
      height-hint="98"
    >
      <q-toolbar class="constrain">
        <q-toolbar-title v-if="!isMobile()" class="text-weight-bold">
          <q-icon name="ion-logo-instagram" size="md" class="q-py-md lt-sm" />
          <span class="gt-xs text-cookie text-h4 text-grey-10">Quisagram</span>
        </q-toolbar-title>
        <q-toolbar-title v-else class="text-weight-bold">
          <span class="text-cookie text-h4">Quisagram</span>
        </q-toolbar-title>

        <q-space class="desktop-only gt-sm"/>
        <!-- For later implementation
            to be able to search posts by hashtags -->
        <!-- <q-input text dense outlined placeholder="Search" class="gt-sm" >
          <template v-slot:prepend>
            <q-icon name="search" size="16px" />
          </template>
        </q-input> -->

        <q-space />

        <q-tabs v-if="user" align="right" indicator-color="transparent">
          <q-route-tab class="q-px-xs desktop-only" to="/">
            <q-icon name="eva-home-outline" size="23px" />
          </q-route-tab>
          <q-route-tab class="q-px-xs desktop-only" to="/inbox">
            <q-icon name="eva-paper-plane-outline" size="23px" />
          </q-route-tab>
          <q-route-tab class="q-px-xs desktop-only" to="/explore">
            <q-icon name="eva-compass-outline" size="23px" />
          </q-route-tab>
          <q-route-tab class="q-px-xs desktop-only" to="/activity">
            <q-icon name="eva-heart-outline" size="23px" />
          </q-route-tab>

          <q-bar class="bg-white">
            <div class="q-ml-md cursor-pointer non-selectable">
              <q-avatar size="23px">
                <img :src="user.avatar" />
              </q-avatar>
              <q-menu auto-close>
                <q-list dense style="width: 200px">
                  <q-item clickable class="q-mb-sm q-mt-sm" :to="{ name: 'Profile' }" exact>
                    <q-icon name="las la-user-circle" size="23px" />
                    <q-item-section class="q-pl-sm">Profile</q-item-section>
                  </q-item>

                  <q-item clickable class="q-mb-sm" exact>
                    <q-icon name="las la-bookmark" size="23px" />
                    <q-item-section class="q-pl-sm">Saved</q-item-section>
                  </q-item>

                  <q-item clickable class="q-mb-sm" exact>
                    <q-icon name="las la-cog" size="23px" />
                    <q-item-section class="q-pl-sm">Settings</q-item-section>
                  </q-item>

                  <q-separator />

                  <q-item clickable class="q-my-xs" exact @click="logout()">
                    <q-item-section class="text-subtitle1"
                      >Log Out</q-item-section
                    >
                  </q-item>
                </q-list>
              </q-menu>
            </div>
          </q-bar>
        </q-tabs>

        <q-tabs v-else align="right" indicator-color="transparent">
          <q-btn :to="{ name: 'Login' }" label="Log In"/>
          <q-btn :to="{ name: 'SignUp' }" label="Sign Up"/>
        </q-tabs>
      </q-toolbar>
    </q-header>

    <!-- Footer -->
    <q-footer
      v-if="!$route.meta.hideFooter"
      bordered
      class="bg-white text-primary z-top"
    >
      <q-tabs
        no-caps
        active-color="primary"
        indicator-color="transparent"
        class="text-grey"
      >
        <q-route-tab class="q-px-xs" :to="{ name: 'Home' }">
          <q-icon name="eva-home-outline" size="sm" />
        </q-route-tab>
        <q-route-tab class="q-px-xs" :to="{ name: 'Explore' }">
          <q-icon name="eva-search-outline" size="sm" />
        </q-route-tab>
        <q-route-tab class="q-px-xs" :to="{ name: 'PostImage' }">
          <q-icon name="eva-plus-square-outline" size="sm" />
        </q-route-tab>
        <q-route-tab class="q-px-xs" :to="{ name: 'Inbox' }">
          <q-icon name="eva-paper-plane-outline" size="sm" />
        </q-route-tab>
        <q-route-tab class="q-px-xs" :to="{ name: 'Activity' }">
          <q-icon name="eva-heart-outline" size="sm" />
        </q-route-tab>

        <!-- <q-btn-dropdown auto-close flat stretch>
          <q-list>
            <q-item clickable @click="tab = 'profile'">
              <q-item-section>Profile</q-item-section>
            </q-item>

            <q-item clickable @click="tab = 'saved'">
              <q-item-section>Saved</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown> -->
      </q-tabs>
    </q-footer>

    <!-- Page Container -->
    <q-page-container class="fullWidth bg-grey-1">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: "Header",
  computed: {
    ...mapGetters({ user:'pwrup/authUser' })
  },
  methods: {
    isMobile() {
      if (
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        )
      ) {
        return true;
      } else {
        return false;
      }
    },
    logout () {
      this.$store.dispatch('pwrup/signOutAction')
    }
  }
};
</script>

<style lang="sass" scoped>
.btn-username:hover
  cursor: pointer

.q-drawer
  position: relative

aside.q-drawer
  &--right
    right: 180px !important

.fullWidth
  @media (max-width: $breakpoint-md-min)
    padding-right: 0 !important
</style>
