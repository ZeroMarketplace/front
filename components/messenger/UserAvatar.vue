<template>
  <v-badge :color="props.online ? 'green' : 'grey'"
           class=""
           location="bottom first"
           dot>

    <!--  no avatar   -->
    <v-avatar class="" v-if="!props.avatars.length" :size="props.size" :color="props.color">
      {{ props.firstName.substr(0,1) + lastName.substr(0,1) }}
    </v-avatar>

    <!--  has avatar  -->
    <v-avatar v-else :image="avatars[0]"></v-avatar>

  </v-badge>
</template>

<script setup>

const props = defineProps({
  firstName: {
    type   : String,
    default: "A"
  },
  lastName : {
    type   : String,
    default: "A"
  },
  avatars  : {
    type   : Array,
    default: []
  },
  color    : {
    type   : String,
    default: "blue"
  },
  online   : {
    type   : Boolean,
    default: false
  },
  size     : {
    type   : Number,
    default: 60
  }
})

</script>

<style scoped>

</style>
