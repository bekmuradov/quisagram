<template>
  <q-list padding class="q-pt-xl">
    <q-item v-for="post in posts" :key="post.id" class="q-px-none">
      <image-card :post="post" />
    </q-item>
  </q-list>
</template>

<script>
import ImageCard from './ImageCard.vue'
import { mapState } from 'vuex'
export default {
  components: { ImageCard },
  computed: {
    ...mapState([ 'posts' ])
  }
}
</script>

<style></style>
