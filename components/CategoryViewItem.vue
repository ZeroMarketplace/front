<template>
  <v-list-item class="border rounded-lg mr-5 ml-5 mt-2 mb-2 pa-2 bg-grey-darken-1" link>
    <v-list-item-title class="d-inline-block mt-1">

      <!--  Icon    -->
      <v-btn size="25"
             v-if="item.children && item.children.length"
             @click="activeChildren = !activeChildren"
             variant="text"
             icon>
        <v-icon size="20">mdi-{{ item.icon ?? (activeChildren ? 'menu-down' : 'menu-right') }}</v-icon>
      </v-btn>

      <!--  Title    -->
      {{ item.title }}

      <!--      <a class="text-yellow">{{ ' #' + item.code }}</a>-->

    </v-list-item-title>

    <!--   Actions    -->
    <!--  Delete   -->
    <v-btn class="float-left ml-3"
           color="red"
           size="30"
           @click="setDelete({_id: item._id})"
           icon>
      <v-icon size="15">mdi-delete-outline</v-icon>
    </v-btn>

    <!--  Edit   -->
    <v-btn class="float-left ml-3"
           color="secondary"
           size="30"
           @click="setEdit(item)"
           icon>
      <v-icon size="15">mdi-pencil</v-icon>
    </v-btn>

    <!--  Add  (Set Parent)  -->
    <v-btn class="float-left ml-3"
           color="secondary"
           size="30"
           @click="setParent({_id: item._id, title: item.title})"
           icon>
      <v-icon size="15">mdi-plus</v-icon>
    </v-btn>

    <!--  Children   -->
    <CategoryView v-if="activeChildren"
                  :list="item.children"
                  @setParent="setParent"
                  @setEdit="setEdit"
                  @setDelete="setDelete"
                  class="mt-2 pb-2"/>

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
  methods: {
    setParent(data) {
      this.$emit('setParent', {_id: data._id, title: data.title});
    },
    setEdit(data) {
      this.$emit('setEdit', data);
    },
    setDelete(data) {
      this.$emit('setDelete', data);
    }
  }
}
</script>

<style scoped>

</style>