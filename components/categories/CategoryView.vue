<template>
  <v-list-item class="border-b rounded pa-2 mr-5 ml-5 mt-2 mb-2 pa-2 bg-grey-lighten-3" link>
    <v-list-item-title class="d-inline-block mt-1">

      <!--  Icon    -->
      <v-btn size="25"
             v-if="item.children && item.children.length"
             @click="activeChildren = !activeChildren"
             variant="text"
             icon>
        <v-icon size="20">mdi-{{ (activeChildren ? 'menu-down' : 'menu-right') }}</v-icon>
      </v-btn>

      <!--  Title    -->
      {{ item.title }}

      <!--      <a class="text-yellow">{{ ' #' + item.code }}</a>-->

    </v-list-item-title>

    <!--   Actions    -->
    <template v-slot:append>

      <!--  Add  (Set Parent)  -->
      <v-btn class="mx-2"
             color="secondary"
             size="30"
             @click="setParent(item)"
             icon>
        <v-icon size="15">mdi-plus</v-icon>
      </v-btn>

      <!--  Edit   -->
      <v-btn class="mx-2"
             color="secondary"
             size="30"
             @click="setEdit(item)"
             icon>
        <v-icon size="15">mdi-pencil</v-icon>
      </v-btn>

      <!--  Delete   -->
      <v-btn class="mx-2"
             color="red"
             size="30"
             @click="setDelete(item)"
             icon>
        <v-icon size="15">mdi-delete-outline</v-icon>
      </v-btn>

    </template>

    <!--  Children   -->
    <v-list v-if="activeChildren" class="w-100 mt-2 pb-2">
      <categories-category-view v-for="itemChild in item.children"
                                @setEdit="setEdit"
                                @setParent="setParent"
                                @setDelete="setDelete"
                                :item="itemChild"/>
    </v-list>

  </v-list-item>
</template>

<script setup>
const props = defineProps({
  item: Object
});
const emit = defineEmits(['setParent', 'setDelete', 'setEdit']);
const activeChildren = ref(false);
const activeMenu = ref(true);

const setParent = (item) => {
  emit('setParent', item);
}

const setEdit = (item) => {
  emit('setEdit', item);
}

const setDelete = (item) => {
  emit('setDelete', item);
}

</script>

<style scoped>

</style>