<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-order-bool-descending-variant
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-order-bool-descending-variant
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-order-bool-descending-variant
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">ویژگی‌ها</span>
            <span v-if="action === 'add'">افزودن ویژگی</span>
            <span v-if="action === 'edit'">ویرایش ویژگی</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary"
                 size="small"
                 @click="toggleAction"
                 icon>
            <v-icon v-if="action === 'list'">mdi-plus</v-icon>
            <v-icon v-if="action === 'edit'">mdi-order-bool-descending-variant</v-icon>
            <v-icon v-if="action === 'add'">mdi-order-bool-descending-variant</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Property   -->
    <v-col v-show="(action === 'add' || action === 'edit')" cols="12">
      <properties-add-property ref="addProperty" @exit="toggleAction" @refresh="getProperties"/>
    </v-col>

    <!--    Properties List   -->
    <v-col v-show="action === 'list'" cols="12" class="pb-16">
      <!--    loading      -->
      <Loading :loading="loading"/>

      <!--    List      -->
      <v-list class="mx-5">
        <v-list-item v-for="item in list" class="rounded border-b pa-2" link>

          <!--      Title        -->
          <v-list-item-title>{{ item.title }}</v-list-item-title>

          <!--      Actions        -->
          <template v-slot:append>
            <!--  Delete   -->
            <v-btn class="mx-2"
                   color="red"
                   size="30"
                   @click="setDelete({_id: item._id})"
                   icon>
              <v-icon size="15">mdi-delete-outline</v-icon>
            </v-btn>

            <!--  Edit   -->
            <v-btn class="mx-2"
                   color="secondary"
                   size="30"
                   @click="setEdit(item)"
                   icon>
              <v-icon size="15">mdi-pencil</v-icon>
            </v-btn>

          </template>

        </v-list-item>
      </v-list>

      <!--    Empty List Alert      -->
      <EmptyList :list="list" :loading="loading"/>

    </v-col>

  </v-row>
</template>

<script setup>
import {ref, onMounted}        from 'vue';
import {useCookie, useNuxtApp} from '#app';
import {useAPI}                from '~/composables/useAPI';

definePageMeta({
  layout      : 'admin',
  middleware  : 'auth',
  requiresAuth: true,
  requiresRole: 'admin'
});

const {$notify}   = useNuxtApp();
const user        = ref({});
const list        = ref([]);
const action      = ref('list');
const loading     = ref(true);
const addProperty = ref(null);

// get All properties from API
const getProperties = async () => {
  loading.value = true;
  // Request
  await useAPI('properties', {
    method    : 'get',
    onResponse: ({response}) => {
      // fill the list and stop loading
      list.value    = response._data.list;
      loading.value = false;
    }
  });
};

const deleteProperty = async (_id) => {
  await useAPI('properties/' + _id, {
    method    : 'delete',
    onResponse: async ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقت انجام شد', 'success');
        await getProperties();
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }
    }
  });
};

const setEdit = (data) => {
  addProperty.value.setEdit(data);
  action.value = 'edit';
};

const setDelete = (data) => {
  if (confirm('آیا مطمئن هستید؟')) {
    deleteProperty(data._id);
  }
};

const toggleAction = () => {
  if (action.value === 'add' || action.value === 'edit') {
    action.value = 'list';
  } else {
    action.value = addProperty.value.action;
  }
};

onMounted(async () => {
  user.value = useCookie('user').value;
  // set delay for sync mounted and getProperties
  setTimeout(async () => {
    await getProperties();
  }, 10);
});
</script>


<style scoped>

</style>
