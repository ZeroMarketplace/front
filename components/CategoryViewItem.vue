<template>
  <v-list-item class="border rounded-lg mr-5 ml-5 mt-2 mb-2 pa-2 bg-grey-darken-1" link>
    <v-list-item-title class="d-inline-block mt-1">

      <!--  Icon    -->
      <v-btn size="25"
             v-if="item.children.length"
             @click="activeChildren = !activeChildren"
             variant="text"
             icon>
        <v-icon size="20">mdi-{{ item.icon ?? (activeChildren ? 'menu-down' : 'menu-right') }}</v-icon>
      </v-btn>

      <!--  Title    -->
      {{ item.title }}

    </v-list-item-title>

    <!--   Actions    -->
    <!--  Delete   -->
    <v-btn class="float-left ml-3"
           color="red"
           size="30"
           icon>
      <v-icon size="15">mdi-minus</v-icon>
    </v-btn>

    <!--  Edit   -->
    <v-btn class="float-left ml-3"
           color="secondary"
           size="30"
           icon>
      <v-icon size="15">mdi-pencil</v-icon>
    </v-btn>

    <!--  Add   -->
    <v-btn class="float-left ml-3"
           color="secondary"
           size="30"
           icon>
      <v-icon size="15">mdi-plus</v-icon>
    </v-btn>

    <CategoryView v-if="activeChildren" :list="item.children" class="mt-2 pb-2"/>

  </v-list-item>
</template>

<script>
export default {
  props: ['item'],
  data() {
    return {
      activeChildren: false,
      activeMenu    : true,
    }
  },
}
</script>

<style scoped>

</style>