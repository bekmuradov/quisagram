<template>

    <q-item>
      <q-btn round size="xs">
        <q-avatar size="40px" class="shadow-3">
          <img :src="friend.avatar" />
        </q-avatar>
      </q-btn>
      <q-item-section clickable class="q-pl-md">
        <div class="row" style="width: 8rem;">
          <q-item-label class="col-8 text-weight-bold btn-username">
            {{ friend.username }}
          </q-item-label>
          <q-item-label class="col-12" caption>
            {{ friend.following.hasOwnProperty(user.userId) ? friend.firstName + ' ' + friend.lastName : 'Suggested for you' }}
          </q-item-label>
        </div>
      </q-item-section>
      <q-btn
        flat
        no-caps
        color="primary"
        :label="user.following.hasOwnProperty(friend.userId) ? 'Unfollow' : 'Follow' "
        @click="toggleFollow(friend)"
      />
    </q-item>

</template>

<script>
import { mapGetters } from 'vuex'
export default {
  props: {
    friend: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapGetters ({ user: 'pwrup/authUser' })
  },
  methods: {
    toggleFollow (friend) {
      if (this.user.following.hasOwnProperty(friend.userId)) {
        this.$store.dispatch('pwrup/unFollowFriend', friend)
      } else {
        this.$store.dispatch('pwrup/followFriend', friend)
      }
    }
  }
}
</script>

<style></style>
