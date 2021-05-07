<template>
  <q-card-section style="border-top: 1px #eee solid;" class="q-py-none">
    <q-input
      v-model="newCommentText"
      clearable
      autogrow
      borderless
      placeholder="Add a comment"
      color="grey-8"
      @input="isInputEmpty()"
    >
      <template v-slot:before>
        <q-icon name="sentiment_satisfied_alt" />
      </template>

      <template v-slot:after>
        <q-btn
          round
          dense
          flat
          unelevated
          :disable="!newCommentText"
          text-color="primary"
          label="Post"
          type="submit"
          @click="saveCommentData()"
        />
      </template>
    </q-input>
  </q-card-section>
</template>

<script>
import { mapGetters } from 'vuex'
import { uid } from 'quasar'
export default {
  data () {
    return {
      newCommentText: ''
    }
  },
  computed: {
    ...mapGetters({ user: 'pwrup/authUser' })
  },
  methods: {
    isInputEmpty() {
      // Prevents users to submit empty string
      // by not allowing first character to be empty space
      if (this.newCommentText.match(/^\s*$/)) {
        this.newCommentText = ""
      }
    },
    saveCommentData () {
      const comment = {
        id: uid(),
        text: this.newCommentText,
        publishedAt: Math.floor(Date.now() / 1000), // to get timestamp in milliseconds
        userId: this.user.userId,
        reactions: {
          replies: {},
          likes: {},
          likesCount: 0
        }
      }

      this.$emit('save-comment', { comment }) // access under eventData.comment

      this.newCommentText = ''
    }
  }
};
</script>

<style></style>
