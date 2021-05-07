<template>
  <div class="col-4 gt-sm desktop-only q-ml-md">
    <div class="fixed" style="min-width: 310px;">
      <!-- Main User Section -->
      <q-item v-ripple class="q-mt-xl">
        <q-btn round>
          <q-item-section>
            <q-avatar size="56px">
              <img :src="user.avatar" />
            </q-avatar>
          </q-item-section>
        </q-btn>

        <q-item-section class="q-pl-md">
          <q-item-label class="text-weight-bold btn-username"
            >{{ user.username }}</q-item-label
          >
          <q-item-label class="text-body2 text-grey-7"
            >{{ user.firstName + ' ' + user.lastName }}</q-item-label
          >
        </q-item-section>
      </q-item>

      <q-space />

      <!-- Click to See All Suggestions Section -->
      <q-item>
        <q-item-section>
          <q-item-label class="text-weight-bold text-grey-7"
            >Suggestions For You</q-item-label
          >
          <!-- <discover-people /> -->
        </q-item-section>
        <q-btn flat no-caps color="accent" label="See All" @click="fetchFriendsToFollow"/>
      </q-item>

      <q-dialog v-model="followModal" transition-show="rotate" transition-hide="rotate">
        <q-card>
          <q-card-section v-if="friends.length" style="max-height: 50vh" class="scroll">
            <!-- Display few Suggested Friends Section -->
            <q-item v-for="friend in friends" v-show="friends" :key="friend.id">
              <friends-suggestion :friend="friend"/>
            </q-item>
          </q-card-section>
          <q-card-section v-else>
            <q-item-label>
              No friends to follow!
            </q-item-label>
          </q-card-section>
        </q-card>
      </q-dialog>

      <!-- Display few Suggested Friends Section -->
      <q-item v-for="friend in friends" v-show="friends" :key="friend.id">
        <friends-suggestion :friend="friend"/>
      </q-item>

      <q-separator inset color="$grey-1" class="q-mt-md" />

      <!-- External Links / About / Section -->
      <q-item>
        <q-btn dense no-caps flat size="xs" to="/about" exact>
          <q-item-label class="text-grey-8 text-weight-light text-overline"
            >About</q-item-label
          >
        </q-btn>
        <q-btn dense no-caps flat size="xs" to="/test" exact>
          <q-item-label class="text-grey-8 text-weight-light text-overline"
            >Test</q-item-label
          >
        </q-btn>
      </q-item>
    </div>
  </div>
</template>

<script>
import FriendsSuggestion from "./FriendsSuggestion.vue"
import { mapGetters } from 'vuex'
export default {
  components: { FriendsSuggestion },
  data () {
    return {
      followModal: false,
      friendsToFollow: [],
      friends: []
    }
  },
  computed: {
    ...mapGetters ({ user: 'pwrup/authUser' })
  },
  watch: {
    user () {
      if (this.user) {
        this.fetchFriends()
      }
    }
  },
  methods: {
    fetchFriendsToFollow () {
      this.friendsToFollow = this.friends
      this.followModal = true
    },
    fetchFriends () {
      this.friends = this.$store.state.pwrup.users.filter(user => {
        return user.userId !== this.user.userId && !this.user.following.hasOwnProperty(user.userId)
      })
    }
  }
}
</script>

<style></style>
