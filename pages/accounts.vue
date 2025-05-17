<template>
  <v-row class="bg-white mr-4 mr-md-1 ml-4 rounded-lg pb-16">

    <!--    Title And Action    -->
    <v-col cols="12">
      <v-row>
        <!--      Title      -->
        <v-col class="mt-2" cols="9">
          <v-icon v-if="action === 'list'" class="mt-1 mr-2" color="grey">
            mdi-wallet-bifold-outline
          </v-icon>

          <v-icon v-if="action === 'add'" class="mt-1 mr-2" color="green">
            mdi-wallet-plus-outline
          </v-icon>

          <v-icon v-if="action === 'edit'" class="mt-1 mr-2" color="warning">
            mdi-wallet-bifold-outline
          </v-icon>

          <v-label class="font-weight-bold mr-2">
            <span v-if="action === 'list'">حساب‌ها</span>
            <span v-if="action === 'add'">افزودن حساب</span>
            <span v-if="action === 'edit'">ویرایش حساب</span>
          </v-label>
        </v-col>

        <!--     Action       -->
        <v-col class="text-end" cols="3">
          <v-btn class="bg-secondary"
                 size="small"
                 @click="toggleAction"
                 icon>
            <v-icon v-if="action === 'list'">mdi-wallet-plus-outline</v-icon>
            <v-icon v-if="action === 'edit'">mdi-wallet-plus-outline</v-icon>
            <v-icon v-if="action === 'add'">mdi-wallet-bifold-outline</v-icon>
          </v-btn>
        </v-col>
      </v-row>
      <v-divider class="mt-3"></v-divider>
    </v-col>

    <!--    Add Account   -->
    <v-col v-show="(action === 'add' || action === 'edit')"
           cols="12"
           class="px-8 pt-5">
      <accounts-add-account ref="addAccount" @exit="toggleAction" @refresh="getAccounts"/>
    </v-col>

    <!--    Accounts List   -->
    <v-col v-show="action === 'list'" cols="12" class="pb-16 py-7">

      <!--    loading      -->
      <Loading :loading="loading"/>

      <!--    List      -->
      <v-dialog-transition>
        <v-row class="mx-4 mt-2" v-show="list.length">
          <v-col v-for="item in list" cols="12" md="4">
            <v-card elevation="2">
              <!--        Title and Icon     -->
              <v-card-title class="border-b">
                {{ item.title ? item.title : 'USER' }}

                <!--         Icon         -->
                <v-icon v-if="item.type === 'bank'"
                        size="20"
                        class="float-left mt-1"
                        color="secondary">
                  mdi-bank
                </v-icon>

                <v-icon v-if="item.type === 'cash'"
                        size="20"
                        class="float-left mt-1"
                        color="secondary">
                  mdi-inbox
                </v-icon>

                <v-icon v-if="item.type === 'expense'"
                        size="20"
                        class="float-left mt-1"
                        color="red">
                  mdi-cash-minus
                </v-icon>

                <v-icon v-if="item.type === 'income'"
                        size="20"
                        class="float-left mt-1"
                        color="green">
                  mdi-cash-plus
                </v-icon>

                <v-icon v-if="item.type === 'system'"
                        size="20"
                        class="float-left mt-1"
                        color="secondary">
                  mdi-database-cog-outline
                </v-icon>

              </v-card-title>

              <!--        Content        -->
              <v-card-text class="pa-5">
                <v-label>
                  موجودی:
                  <span class="mx-2 font-weight-bold">
                      {{ formatters.price(item.balance) }}
                  </span>

                  تومان
                </v-label>
              </v-card-text>

              <!--        Actions        -->
              <v-card-actions class="float-left">
                <!--  Delete   -->
                <v-btn class="mx-2 bg-red"
                       v-if="item.type !== 'system'"
                       size="30"
                       @click="setDelete({_id: item._id})"
                       icon>
                  <v-icon size="15">mdi-delete-outline</v-icon>
                </v-btn>

                <!--  Edit   -->
                <v-btn class="mx-2 bg-secondary"
                       v-if="item.type !== 'system'"
                       size="30"
                       @click="setEdit(item)"
                       icon>
                  <v-icon size="15">mdi-pencil</v-icon>
                </v-btn>

                <!--  Set Default   -->
                <v-btn class="mx-2"
                       :class="item.defaultFor ? 'bg-secondary' : 'bg-white border'"
                       v-if="item.type !== 'system'"
                       size="30"
                       @click="setDefault(item)"
                       icon>
                  <v-icon size="15">mdi-star-outline</v-icon>
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-dialog-transition>

      <!--   Pagination    -->
      <v-pagination v-if="pageCount > 1"
                    class="mt-5"
                    active-color="secondary"
                    v-model="page"
                    :length="pageCount"
                    rounded="circle">
      </v-pagination>

      <!--    Empty List Alert      -->
      <EmptyList :list="list" :loading="loading"/>

    </v-col>

  </v-row>
</template>

<script setup>
import {ref, onMounted, nextTick} from 'vue';
import {useNuxtApp}               from '#app';
import {useAPI}                   from '~/composables/useAPI'

definePageMeta({
  layout      : 'admin',
  middleware  : 'auth',
  requiresAuth: true,
  requiresRole: 'admin',
});

const loading    = ref(true);
const action     = ref('list');
const list       = ref([]);
const addAccount = ref(null);
const {$notify}  = useNuxtApp();
const page          = ref(1);
const perPage       = ref(10);
const pageCount     = ref(1);
const sortColumn    = ref('');
const sortDirection = ref(1);

// filter the table
const filter = () => {
  let search = new URLSearchParams();

  // pagination
  search.set('perPage', perPage.value);
  search.set('page', page.value);

  // sort
  search.set('sortColumn', sortColumn.value);
  search.set('sortDirection', sortDirection.value);

  return search;
};

// Fetch the list of accounts
const getAccounts = async () => {
  loading.value = true;
  await useAPI('accounts?' + filter(), {
    method    : 'get',
    onResponse: ({response}) => {
      // set the list and stop loading
      list.value    = response._data.list;
      loading.value = false;

      // set page count from list total
      pageCount.value = Math.ceil((response._data.total / perPage.value));
    }
  });
};

// Delete an account
const deleteAccount = async (_id) => {
  await useAPI('accounts/' + _id, {
    method    : 'delete',
    onResponse: async ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقیت انجام شد', 'success');
        await getAccounts();
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }
    }
  })
};

// Set an account as default
const setDefault = async (data) => {
  await useAPI('accounts/default/' + data._id, {
    method    : 'put',
    onResponse: async ({response}) => {
      if (response.status === 200) {
        $notify('عملیات با موفقیت انجام شد', 'success');
        await getAccounts();
      } else {
        $notify('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
      }
    }
  });
};

// Set edit mode for an account
const setEdit = (data, addAccountRef) => {
  addAccount.value?.setEdit(data);
  action.value = 'edit';
};

// Confirm and delete an account
const setDelete = (data) => {
  if (confirm('آیا مطمئن هستید؟')) {
    deleteAccount(data._id);
  }
};

// Toggle between actions
const toggleAction = (addAccountRef) => {
  if (action.value === 'add' || action.value === 'edit') {
    action.value = 'list';
  } else {
    action.value = addAccount.value?.action;
  }
};

// watch page change for get units
watch(page, (newValue) => {
  getAccounts();
});

onMounted(() => {
  nextTick(() => {
    getAccounts();
  });
});
</script>


<style scoped>

</style>
