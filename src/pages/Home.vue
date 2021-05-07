<template>
  <q-page class="row items-start content-start constrain no-wrap">
    <!-- Main Image -->
    <div class="col-12 col-xs-12 col-md-8">
      <post-list />
    </div>

    <!-- Right Side Panel visible only on desktop -->
    <the-right-panel />
  </q-page>
</template>

<script>
import TheRightPanel from 'src/components/TheRightPanel.vue'
import PostList from 'src/components/PostList.vue'

export default {
  name: "PageHome",
  components: { TheRightPanel, PostList },
  data() {
    return {
    }
  }
}
</script>

<style lang="sass" scoped>
.btn-username:hover
  cursor: pointer

.q-icon.notranslate
  color: 'blue' !important

.more-info
  white-space: pre-line
</style>
