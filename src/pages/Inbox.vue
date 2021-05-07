<template>
  <div class="q-pa-md" style="max-width: 350px">
    <q-toolbar class="bg-primary text-white shadow-2">
      <q-toolbar-title>Contacts</q-toolbar-title>
    </q-toolbar>

    <q-list bordered>
      <q-item
        v-for="contact in contacts"
        :key="contact.id"
        v-ripple
        class="q-my-sm"
        clickable
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="`https://cdn.quasar.dev/img/${contact.avatar}`" />
          </q-avatar>
          <q-badge floating color="positive" class="user-online" />
        </q-item-section>

        <q-item-section>
          <q-item-label caption lines="2">
            <span class="text-weight-bold text-black">{{ contact.name }}</span>
            {{ contact.letter }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label caption>{{ contact.sendTime }}</q-item-label>
          <q-icon size="23px" name="chat_bubble" color="positive" class="q-pt-sm"/>
        </q-item-section>

      </q-item>

      <q-separator />
      <q-item-label header>Offline</q-item-label>

      <q-item
        v-for="contact in offline"
        :key="contact.id"
        v-ripple
        class="q-mb-sm"
        clickable
      >
        <q-item-section avatar>
          <q-avatar>
            <img :src="`https://cdn.quasar.dev/img/${contact.avatar}`" />
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label caption lines="2">
            <span class="text-weight-bold text-black">{{ contact.name }}</span>
            {{ contact.letter }}
          </q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-item-label caption>{{ contact.sendTime }}</q-item-label>
          <q-icon size="23px" name="chat_bubble" color="grey" class="q-pt-sm"/>
        </q-item-section>

      </q-item>
    </q-list>


  </div>

</template>

<script>
export default {
  name: "PageInbox",
  data() {
    return {
      contacts: [
        {
          name: "Janet",
          avatar: `avatar2.jpg`,
          letter:
            "I'll be in your neighborhood doing errands this weekend. Do you want to grab brunch?",
          sendTime: "5 min ago"
        },
        {
          name: "John",
          avatar: `avatar4.jpg`,
          letter: "Can we schedule a call for tomorrow?",
          sendTime: "yesterday"
        }
      ],
      offline: [
        {
          name: "Winfield",
          avatar: `avatar6.jpg`,
          letter: "Can we schedule a call for tomorrow?",
          sendTime: "2w"
        }
      ]
    };
  }
};
</script>

<style lang="sass" scoped>
.user-online
  width: 15px
  height: 15px
  border-radius: 50px
  border: 2px solid white
  position: absolute
  top: 35px
  left: 40px
</style>
