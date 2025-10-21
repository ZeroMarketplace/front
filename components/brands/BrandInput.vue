<template>
  <v-autocomplete
    :items="items"
    :loading="true"
    :search-input="searchQuery"
    :hide-no-data="true"
    item-value="_id"
    item-title="title"
    label="برند"
    variant="outlined"
    @scroll:bottom="loadMoreItems"
    @update:model-value="handleItemSelect"
    @update:search="handleSearchUpdate"
  >
    <template v-slot:loader>
      <v-progress-circular
        v-if="isFetchingMore"
        indeterminate
        color="primary"
        size="20"
      ></v-progress-circular>
    </template>
  </v-autocomplete>
</template>

<script setup>
import { ref, watch, onMounted, nextTick } from "vue";
import _ from "lodash";

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

// Fetch items from API
const fetchItems = async (query = "", page = 1) => {
  try {
    if (page === 1) {
      isLoading.value = true;
      noMoreItems.value = false;
    } else {
      isFetchingMore.value = true;
    }

    const data = await useApiService.get(
      `brands?title=${query}&page=${page}&perPage=20`
    );
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
const debouncedFetchItems = _.debounce((query, page) => {
  fetchItems(query, page);
}, 300);

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
