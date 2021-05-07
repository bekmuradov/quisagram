<template>
  <div class="fullscreen bg-blue text-white text-center q-pa-md flex flex-center">
    <div>

      <div style="font-size: 20vh">
        {{ pathName }}
      </div>

      <div class="text-h2" style="opacity:.4">
        Oops. Nothing here...
      </div>

      <q-btn
        class="q-mt-xl"
        color="white"
        text-color="blue"
        unelevated
        :to="{ name: 'Home' }"
        label="See some cool posts"
        no-caps
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error404',
  props: {
    pathName: {
      type: String,
      required: false,
      default () {
        return "Path not found"
      }
    }
  }
}
</script>
