<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import { mapActions } from 'vuex'
export default {
  name: 'App',
  beforeMount() {
    this.authAction
  },
  methods: {
    ...mapActions({ authAction: 'pwrup/authAction' }),
  }
}
</script>
