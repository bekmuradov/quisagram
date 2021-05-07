<template>
  <span :title="humanFriendlyDate()">
    <q-chip :class='dateClass' :size='dateSize' :color='bgColor'>
    {{ relativeDate(timestamp) }}
  </q-chip>
  </span>
</template>

<script>
import { format, formatDistanceStrict, fromUnixTime } from 'date-fns'
export default {
  name: 'AppDate',
  props: {
    timestamp: {
      required: true,
      type: Number
    },
    dateClass: {
      type: String,
      default: 'q-pa-none q-ma-none text-grey-5'
    },
    dateSize: {
      type: String,
      default: 'sm'
    },
    bgColor: {
      type: String,
      default: 'transparent'
    }
  },
  methods: {
    relativeDate (val) {
      return this.timestamp > 0 ? formatDistanceStrict(fromUnixTime(val), new Date(), { addSuffix: true }) : 'date not found'
    },
    humanFriendlyDate () {
      return this.timestamp > 0 ? format(fromUnixTime(this.timestamp), 'eee, LLL d, y h:mm a') : 'no date'
    }
  }
};
</script>

<style></style>
