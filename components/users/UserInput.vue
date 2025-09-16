<template>
  <v-autocomplete
    v-model="model"
    :items="items"
    :loading="true"
    :search-input.sync="searchQuery"
    :hide-no-data="true"
    auto-select-first="exact"
    item-value="_id"
    item-title="fullName"
    label="کاربر"
    density="compact"
    variant="outlined"
    @scroll:bottom="loadMoreItems"
    @update:search="handleSearchUpdate"
  >
    <!--  Loader   -->
    <template v-slot:loader>
      <v-progress-circular
        v-if="isFetchingMore"
        indeterminate
        color="primary"
        size="20"
      ></v-progress-circular>
    </template>

    <!--  Insert Dialog   -->
    <template v-slot:append-inner>
      <UserInsertDialog
        v-if="props.insertDialogIcon"
        v-model="insertDialog"
        @exit="insertDialog = false"
        @submitted="onUserSubmitted"
      />
      <v-icon
        class="cursor-pointer"
        v-if="props.insertDialogIcon"
        @click="insertDialog = true"
        icon
      >
        mdi-account-plus-outline
      </v-icon>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref, watch, onMounted, defineModel, reactive, nextTick } from "vue";
import { debounce } from "lodash";
import UserInsertDialog from "~/components/users/UserInsertDialog.vue";

const props = defineProps({
  insertDialogIcon: {
    type: Boolean,
  },
});

const model = defineModel();

const emit = defineEmits(["update:modelValue"]);

// insert dialog
const insertDialog = ref(false);

// State variables
const searchQuery = ref("");
const items = ref([]);
const searchResults = ref([]);
const isLoading = ref(false);
const isFetchingMore = ref(false);
const currentPage = ref(1);
const totalItems = ref(0);
const noMoreItems = ref(false);
const isUserTyping = ref(true);

const filter = () => {
  let search = new URLSearchParams();

  if (searchQuery.value) {
    const mobileRegex = /^(\+98|0)?9\d{9}$/;

    // check phone input
    if (mobileRegex.test(searchQuery.value)) {
      search.set("phone", searchQuery.value);
    } else {
      search.set("name", searchQuery.value);
    }

    search.set("perPage", 20);
  }

  return search;
};

// Fetch items from API
const fetchItems = async (query = "", page = 1) => {
  try {
    if (page === 1) {
      isLoading.value = true;
      noMoreItems.value = false;
    } else {
      isFetchingMore.value = true;
    }

    const data = await useApiService.get("users?" + filter());
    if (data) {
      if (page === 1) {
        searchResults.value = data.list || [];
      } else {
        searchResults.value = [...searchResults.value, ...(data.list || [])];
      }

      totalItems.value = data.total || 0;

      const mergedItems = [...items.value];
      searchResults.value.forEach((item) => {
        if (
          !mergedItems.some((existingItem) => existingItem._id === item._id)
        ) {
          mergedItems.push(item);
        }
      });
      items.value = mergedItems;

      if (searchResults.value.length >= totalItems.value) {
        noMoreItems.value = true;
      }
    }
  } catch (error) {
    console.error("Error fetching items:", error);
  } finally {
    isLoading.value = false;
    isFetchingMore.value = false;
  }
};

// Debounced fetch function
const debouncedFetchItems = debounce((query, page) => {
  fetchItems(query, page);
}, 800);

// Watch search query changes
watch(searchQuery, (newValue) => {
  if (!isUserTyping.value || !newValue) return;
  currentPage.value = 1;
  debouncedFetchItems(newValue, currentPage.value);
});

// Load more items on scroll
const loadMoreItems = () => {
  if (
    !noMoreItems.value &&
    searchResults.value.length < totalItems.value &&
    !isFetchingMore.value &&
    !isLoading.value
  ) {
    currentPage.value += 1;
    fetchItems(searchQuery.value, currentPage.value);
  }
};

const onUserSubmitted = async (item) => {
  // add the inserted item to list
  if (!items.value.some((existingItem) => existingItem._id === item._id)) {
    items.value.push(reactive(item));
  }

  // select the item
  model.value = item._id;
};

// Initialize component
onMounted(() => {
  nextTick(() => {
    fetchItems("", 1);
  });
});

// Handle search input updates
const handleSearchUpdate = (event) => {
  searchQuery.value = event;
};

// Handle item selection
const handleItemSelect = (selectedItem) => {
  isUserTyping.value = false;
  setTimeout(() => {
    isUserTyping.value = true;
  }, 500);
  searchQuery.value = "";
};
</script>
