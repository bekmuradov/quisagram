<template>
  <div>
    <span v-for="(tag, index) in Object.keys(tags)" :key="index">
      <q-btn
        flat
        dense
        no-caps
        color="primary"
        padding="none"
        class="q-mr-xs"
        :label="postTags(tag)"
      />
  </span>
  </div>
</template>

<script>
export default {
  props: {
    tags: {
      type: Object,
      required: true
    }
  },
  methods: {
    postTags (tag) {
      return '#' + tag
    }
  }
}
</script>
