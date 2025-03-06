<template>
  <v-list-item class="border-b rounded pa-2 mr-5 ml-5 mt-2 mb-2 pa-2 bg-grey-lighten-3" link>
    <v-list-item-title class="d-inline-block mt-1">

      <!--  Icon    -->
      <v-btn size="25"
             v-if="item.children && item.children.length"
             @click="activeChildren = !activeChildren"
             variant="text"
             icon>
        <!--    Icons     -->
        <v-icon size="20">mdi-{{ (activeChildren ? 'menu-down' : 'menu-right') }}</v-icon>

        <!--       Description       -->
        <v-tooltip
            activator="parent"
            location="top">
          <span v-if="!activeChildren">گستردن</span>
          <span v-else>بستن</span>
        </v-tooltip>

      </v-btn>

      <!--  Status   -->
      <v-btn class="mx-1"
             :color="item.status === 1 ? 'green' : 'red'"
             size="30"
             :loading="item.setStatusLoading"
             @click="setStatus(item)">
        <!--       Icons       -->
        <v-icon v-if="item.status === 1" size="15">mdi-check-outline</v-icon>
        <v-icon v-if="item.status === 2" size="15">mdi-close-outline</v-icon>

        <!--       Description       -->
        <v-tooltip
            activator="parent"
            location="top">
          <span v-if="item.status === 1">غیر فعال کردن</span>
          <span v-if="item.status === 2">فعال کردن</span>
        </v-tooltip>
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
        <!--    Icon     -->
        <v-icon size="15">mdi-plus</v-icon>

        <!--       Description       -->
        <v-tooltip
            activator="parent"
            location="top">
          افزودن زیر دسته
        </v-tooltip>
      </v-btn>

      <!--  Edit   -->
      <v-btn class="mx-2"
             color="secondary"
             size="30"
             @click="setEdit(item)"
             icon>
        <!--    Icon    -->
        <v-icon size="15">mdi-pencil</v-icon>

        <!--       Description       -->
        <v-tooltip
            activator="parent"
            location="top">
          ویرایش
        </v-tooltip>
      </v-btn>

      <!--  Delete   -->
      <v-btn class="mx-2"
             color="red"
             size="30"
             :loading="item.deleteLoading"
             @click="setDelete(item)"
             icon>
        <!--    Icon    -->
        <v-icon size="15">mdi-delete-outline</v-icon>

        <!--       Description       -->
        <v-tooltip
            activator="parent"
            location="top">
          حذف
        </v-tooltip>
      </v-btn>

    </template>

    <!--  Children   -->
    <v-list v-if="activeChildren" class="w-100 mt-2 pb-2">
      <categories-category-view v-for="itemChild in item.children"
                                @setEdit="setEdit"
                                @setParent="setParent"
                                @setDelete="setDelete"
                                @setStatus="setStatus"
                                :item="itemChild"/>
    </v-list>

  </v-list-item>
</template>

<script setup>
const props          = defineProps({
  item: Object
});
const emit           = defineEmits(['setParent', 'setDelete', 'setEdit']);
const activeChildren = ref(false);

const setStatus = (item) => {
  emit('setStatus', item);
}

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