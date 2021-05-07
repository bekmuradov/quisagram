<template>
  <q-card-section v-if="post.comments.length" class="q-py-none">
    <div>
      <div class="text-grey-8 q-pl-none q-py-none">
        <span class="q-pr-xs">{{ post.comments.length }}</span>
        <span v-if="post.comments.length <= 1">comment</span>
        <span v-else>comments</span>
      </div>
      <!-- Comments Scroll Area -->
      <q-scroll-area
        :thumb-style="{
          right: '0',
          borderRadius: '5px',
          background: 'rgb(2, 123, 127)',
          width: '3px',
          opacity: 0.175
        }"
        :bar-style="{
          right: '0',
          borderRadius: '9px',
          background: 'rgb(2, 123, 127)',
          width: '3px',
          opacity: 0.1
        }"
        style="height: 80px; max-width: 100%;"
      >
        <transition-group
          appear
          enter-active-class="animated fadeIn slow"
          leave-active-class="animated fadeOut slow"
        >
          <div v-for="comment in comments" :key="comment.id">
            <div class="row items-center">
              <q-card-section
                class="col-8 col-xs-9 q-pa-none"
                style="line-height: 0.1;"
              >
                <span class="text-subtitle2 q-mr-sm">{{ userById(comment).username }}</span>
                <span class="text-body2 text-weight-light">{{
                  comment.text
                }}</span>
              </q-card-section>
              <q-card-actions
                class="col no-wrap row justify-end items-center content-start q-mr-xs q-py-none"
              >
                <!-- Comment date posted -->
                <app-date :timestamp="comment.publishedAt"/>

                <!-- Comment likes -->
                <span class="q-pl-xs">
                  <q-chip
                    class="q-pa-none q-ma-none text-grey-5"
                    size="sm"
                    color="white"
                  >
                    {{ comment.reactions.likesCount }} likes
                  </q-chip>
                </span>
                <!-- Delete button -->
                <q-btn
                  v-if="comment.userId === user.userId"
                  class="q-ml-xs"
                  icon="eva-trash-outline"
                  size="xs"
                  color="grey-5"
                  dense
                  flat
                  round
                  @click="deleteComment(comment)"
                />
                <!-- Reply functionality will be included later-->
                <!-- <q-btn
                  icon="eva-repeat-outline"
                  size="xs"
                  color="grey-5"
                  dense
                  flat
                  round
                  @click="replyToComment(comment, post.id)"
                /> -->
                <!-- Like button -->
                <q-btn
                  :color="
                    comment.reactions.likes.hasOwnProperty(user.userId)
                      ? 'pink-6'
                      : 'grey-5'
                  "
                  flat
                  round
                  dense
                  size="xs"
                  :icon="
                    comment.reactions.likes.hasOwnProperty(user.userId)
                      ? 'eva-heart'
                      : 'eva-heart-outline'
                    "
                  @click="toggleCommentLike(comment)"
                />
              </q-card-actions>
            </div>
          </div>
        </transition-group>
      </q-scroll-area>
    </div>
  </q-card-section>
</template>

<script>
import { mapGetters } from 'vuex'
import AppDate from './AppDate.vue'
export default {
  components: { AppDate },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
    }
  },
  computed: {
    comments () {
      return this.$store.state.comments.filter(comment => comment.postId === this.post.id)
    },
    ...mapGetters ({ user: 'pwrup/authUser' })
  },
  methods: {
    userById (comment) {
      return this.$store.state.pwrup.users.find(user => user.id === comment.userId)
    },
    toggleCommentLike (comment) {
      const authId = this.$store.getters['pwrup/authUser'].userId

      if (comment.reactions.likes.hasOwnProperty(authId)) {
        this.$store.dispatch('pwrup/unLikeComment', comment)
      } else {
        this.$store.dispatch('pwrup/likeComment', comment)
      }
    },
    deleteComment (comment) {
      this.$store.dispatch('pwrup/deleteComment', { comment })
    }
  }
}
</script>

<style></style>
