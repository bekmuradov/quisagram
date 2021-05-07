<template>
  <q-card class="my-card">
    <!-- Header / Name of the image owner -->
    <q-item>
      <q-item-section avatar>
        <q-avatar>
          <img
            :src="userById(post).avatar"
            :alt="`${userById(post).lastName} profile picture`"
          />
        </q-avatar>
      </q-item-section>

      <q-item-section>
        <q-item-label class="text-subtitle2">{{
          userById(post).username
        }}</q-item-label>
        <span v-if="post.location" class="text-grey-8 text-caption">
          {{ post.location | capitalize }}
        </span>
      </q-item-section>
    </q-item>

    <!-- Image -->
    <img
      :src="`${post.imgUrl}`"
      :alt="`${post.caption}`"

      loading="lazy"
      style="width: 614px; height: auto"
    />

    <!-- Icons after image card (heart, comment, share, bookmark) -->
    <div class="row items-center">
      <q-card-actions class="col-auto q-py-xs">
        <q-btn
          :class="[
            isPostLikedByUser(post) ? 'text-pink-6' : 'text-grey-10'
          ]"
          flat
          round
          dense
          size="md"
          :icon="isPostLikedByUser(post) ? 'eva-heart' : 'eva-heart-outline'"
          @click="toggleLikeImage(post)"
        />
        <!-- this functionality will be added later -->
        <!-- <q-btn
          color="grey-10"
          flat
          round
          dense
          size="md"
          icon="eva-message-circle-outline"
        />
        <q-btn
          color="grey-10"
          flat
          round
          dense
          size="md"
          icon="eva-paper-plane-outline"
        /> -->
      </q-card-actions>
      <!-- Likes -->
      <q-card-section class="col q-pa-none">
        <div class="text-subtitle2">{{ post.reactions.likesCount }} likes</div>
      </q-card-section>
      <q-card-section class="col row justify-end q-py-xs">
        <q-btn
          v-if="post.userId === this.$store.getters['pwrup/authUser'].userId"
          color="grey-10"
          flat
          round
          dense
          size="md"
          icon="eva-trash-outline"
          @click="deletePost(post)"
        />
      </q-card-section>
    </div>

    <!-- Image Caption -->
    <q-expansion-item dense dense-toggle expand-separator class="q-py-none">
      <template v-slot:header>
        <q-item-section>
          <div>
            <span class="text-subtitle2 q-mr-sm" style="height: 20px;">{{
              userById(post).username
            }}</span>
            <span
              class="text-body2 text-weight-light q-pr-md"
              >{{ post.caption }}
              </span
            >
          </div>
        </q-item-section>
      </template>
      <q-card>
        <q-card-section class="more-info">
          {{ post.description || '' }}
          <image-tag v-if="post.tags" :tags="post.tags"/>
        </q-card-section>
      </q-card>
    </q-expansion-item>

    <!-- Comments Read/View section-->
    <comment-list :post="post" />
    <!-- Date Posted -->
    <q-card-section class="q-py-none">
      <app-date
        :timestamp="post.publishedAt"
        date-class="q-ma-none q-pa-none text-grey-7 text-uppercase"
      />
    </q-card-section>

    <!-- Post Comment Section -->
    <comment-save @save-comment="addComment"/>
  </q-card>
</template>

<script>
import * as fb from 'src/boot/firebase'
import AppDate from './AppDate.vue'
import CommentList from './CommentList.vue'
import ImageTag from './ImageTag.vue'
import CommentSave from './CommentSave'
export default {
  components: { AppDate, ImageTag, CommentList, CommentSave },
  filters: {
    capitalize (str) {
      return str.trim().toLowerCase().replace(/\w\S*/g, (w) => (w.replace(/^\w/, (c) => c.toUpperCase())))
    }
  },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  methods: {
    userById (post) {
      return this.$store.state.pwrup.users.find(user => user.userId === post.userId)
    },
    isPostLikedByUser (post) {
      const authId = this.$store.getters['pwrup/authUser'].userId
      return post.reactions.likes.hasOwnProperty(authId) ? true : false
    },
    toggleLikeImage (post) {
      const authId = this.$store.getters['pwrup/authUser'].userId

      if (post.reactions.likes.hasOwnProperty(authId)) {
        this.$store.dispatch('pwrup/unLikePost', post)
      } else {
        this.$store.dispatch('pwrup/likePost', post)
      }
    },
    addComment (eventData) {
      const comment = {
        ...eventData.comment,
        postId: this.post.id
      }

      this.$store.dispatch('pwrup/addComment', { comment } )
    },
    deletePost (post) {
      // show progress to the user
      const notif = this.$q.notify({
        group: false, // required to be updatable
        timeout: 0, // we want to be in control when it gets dismissed
        spinner: true,
        message: 'Deleting file...',
        caption: '0%'
      })
      // delete all likes from likes collection related to this post
      fb.likesCollection.where('postId', '==', post.id).get()
        .then((querySnapshot) => {
          let batch = fb.db.batch()

          querySnapshot.forEach((doc) => {
            batch.delete(doc.ref)
          })

        return batch.commit()
      })
      .catch((error) => commit('setError', error))
      // delete all commments from comments collection related to post
      fb.commentsCollection.where('postId', '==', post.id).get()
        .then((querySnapshot) => {
        let batch = fb.db.batch()

        querySnapshot.forEach((doc) => {
          batch.delete(doc.ref)
        })

        return batch.commit()
      })
      .catch((error) => commit('setError', error))
      // delete image from firebase storage
      fb.storage.ref().child(post.imgName).delete()
        .then(
          notif({
            icon: 'done', // we add an icon
            spinner: false, // we reset the spinner setting so the icon can be displayed
            caption: '100%',
            message: 'Post deleted!',
            timeout: 2500 // we will timeout it in 2.5s
          })
        )
        .catch((error) => commit('setError', error))
      // then find and delete post in posts collection
      fb.postsCollection.doc(post.id).delete()
      // this.$store.dispatch('pwrup/deletePost', { post })
    }
  }
}
</script>

<style></style>
