<template>
  <q-page class="constrain">
    <div
      class="q-ma-lg row content-start"
    >
      <div class="col-12 row items-center">
        <img class="avatar" :src="user.avatar" />
        <div class="text-h4 q-pl-lg">
          {{ user.username }}
        </div>
      </div>
      <div class="col-12 q-mt-md q-pl-md">
        <div class="text-subtitle2">
          {{ user.firstName + " " + user.lastName }}
        </div>
        <div v-if="user.bio" class="text-body">
          {{ user.bio }}
        </div>
      </div>
      <div class="col-12 row justify-evenly content-start q-mr-md">
          <q-btn no-caps flat dense class="col-sm-2">{{ user.postsCount }} posts</q-btn>
          <q-btn no-caps flat dense class="col-sm-2">{{ user.likesCount }} likes</q-btn>
          <q-btn no-caps flat dense class="col-sm-4" @click="toggleFollowModal('followers')">{{ user.followersArr.length }} followers</q-btn>
          <q-btn no-caps flat dense class="col-sm-4" @click="toggleFollowModal('following')">{{ user.followingArr.length }} following</q-btn>
        </div>
    </div>

    <q-dialog v-model="followModal" transition-show="slide-up" transition-hide="slide-down">
      <q-card>
        <q-card-section>
          <q-tabs
            v-model="tabFollowers"
            dense
            align="justify"
            class="bg-white text-dark"
            :breakpoint="0"
          >
            <q-tab name="followers" @click="fetchFriends('followers')" >{{ user.followersArr.length }} followers</q-tab>
            <q-tab name="following" @click="fetchFriends('following')" >{{ user.followingArr.length }} following</q-tab>
          </q-tabs>
        </q-card-section>
        <q-card-section class="column align-center items-center content-center">
          <div v-if="tabFollowers === 'following' && !user.followingArr.length">
            <q-icon
              style="margin: auto; width: 100%;"
              size="xl"
              color="$dark"
              name="eva-person-add-outline"
            />
            <div class="text-h6 text-center">People You Follow</div>
            <div class="text-body2 text-light">Once you follow people, you'll see them here.</div>
          </div>
          <div v-else-if="tabFollowers === 'followers' &&!user.followersArr.length">
            <q-icon
              style="margin: auto; width: 100%;"
              size="xl"
              color="$dark"
              name="eva-person-add-outline"
            />
            <div class="text-h6 text-center">Followers</div>
            <div class="text-body2 text-light">You'll see all the people who follow you here.</div>
          </div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <!-- Display few Suggested Friends Section -->
          <q-item v-for="friend in friends" :key="friend.id">
            <friends-suggestion :friend="friend"/>
          </q-item>
        </q-card-section>

        <q-card-actions align="left">
          <q-btn flat no-caps color="accent" label="See All Suggestions" @click="followModalTwo = true"/>
        </q-card-actions>
        <q-dialog v-model="followModalTwo" transition-show="rotate" transition-hide="rotate">
        <q-card>
          <q-card-section v-if="friendsToFollow.length" style="max-height: 50vh" class="scroll">
            <!-- Display few Suggested Friends Section -->
            <q-item v-for="friend in friendsToFollow" :key="friend.id">
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
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script>
import { mapGetters } from 'vuex'
import { usersCollection } from 'src/boot/firebase'
import FriendsSuggestion from '../components/FriendsSuggestion'
export default {
  name: "PageProfile",
  components: { FriendsSuggestion },
  data () {
    return {
      text: '',
      followModal: false,
      followModalTwo: false,
      tabFollowers: '',
      friends: []
    }
  },
  computed: {
    ...mapGetters({ user:'pwrup/authUser' }),
    friendsToFollow () {
      return this.$store.state.pwrup.users.filter(user => {
        return user.userId !== this.user.userId && !this.user.following.hasOwnProperty(user.userId)
      })
    }
  },
  methods: {
    setUserBio () {
      usersCollection.doc(this.user.userId).update({
        bio: this.text
      })
    },
    toggleFollowModal (tabMode) {
      this.tabFollowers = tabMode
      tabMode === 'following' ? this.fetchFriends('following') : this.fetchFriends('followers')
      this.followModal = true
    },
    fetchFriends (tabMode) {
      if (tabMode === 'following') {
        let followingFriends = []
        for (const friendId of Object.keys(this.user.following)) {
          followingFriends.push(this.$store.state.pwrup.users.find(user => user.userId === friendId))
        }
        if (!followingFriends.length) {
          followingFriends = this.$store.state.pwrup.users.filter(user => {
            return user.userId !== this.user.userId && !user.following.hasOwnProperty(this.user.userId)
          })
        }
        this.friends = followingFriends
      } else {
        let followerFriends = []
        for (const friendId of Object.keys(this.user.followers)) {
          followerFriends.push(this.$store.state.pwrup.users.find(user => user.userId === friendId))
        }
        if (!followerFriends.length) {
          followerFriends = this.$store.state.pwrup.users.filter(user => {
            return user.userId !== this.user.userId && !this.user.following.hasOwnProperty(user.userId)
          })
        }
        this.friends = followerFriends
      }
    }
  }
}
</script>

<style lang="sass" scoped>
.avatar
  vertical-align: middle
  width: 6rem
  height: 6rem
  border-radius: 50%
  @media (min-width: $breakpoint-md-min)
    width: 8rem
    height: 8rem
    margin-left: 80px
</style>
