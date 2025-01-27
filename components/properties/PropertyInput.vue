<template>
  <v-autocomplete
      :items="items"
      :loading="true"
      :search-input.sync="searchQuery"
      :hide-no-data="true"
      :hide-details="true"
      item-value="_id"
      item-title="title"
      label="ویژگی‌ها"
      density="compact"
      variant="outlined"
      @scroll:bottom="loadMoreItems"
      @update:search="handleSearchUpdate">
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
import { ref, onMounted, nextTick, watch } from 'vue'
import { useAPI } from '~/composables/useAPI'
import { debounce } from 'lodash'

// Variables
const searchQuery = ref('')
const items = ref([]) // Holds all loaded items (including selected ones)
const searchResults = ref([]) // Holds only the search results
const isLoading = ref(false)
const isFetchingMore = ref(false)
const currentPage = ref(1)
const totalItems = ref(0)
const noMoreItems = ref(false)

// Functions
const fetchItems = async (query = '', page = 1) => {
  try {

    // Set loading states
    if (page === 1) {
      isLoading.value = true
      noMoreItems.value = false // Reset noMoreItems flag for new searches
    } else {
      isFetchingMore.value = true
    }

    // Fetch data from API
    await useAPI(`properties?title=${query}&page=${page}&perPage=20`, {
      method: 'get',
      onResponse: ({ response }) => {
        const data = response._data

        // Update search results
        if (page === 1) {
          searchResults.value = data.list || [] // Reset search results for the first page
        } else {
          searchResults.value = [...searchResults.value, ...(data.list || [])] // Append new search results
        }

        // Update total items count
        totalItems.value = data.total || 0

        // Merge search results with existing items
        const mergedItems = [...items.value]
        searchResults.value.forEach((item) => {
          if (!mergedItems.some((existingItem) => existingItem._id === item._id)) {
            mergedItems.push(item)
          }
        })
        items.value = mergedItems

        // Check if all items are loaded
        if (searchResults.value.length >= totalItems.value) {
          noMoreItems.value = true
        }
      },
    })
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    // Reset loading states
    isLoading.value = false
    isFetchingMore.value = false
  }
}

// Debounce fetchItems to avoid excessive API calls while typing
const debouncedFetchItems = debounce((query, page) => {
  fetchItems(query, page)
}, 300)

// Watch for changes in searchQuery
watch(searchQuery, (newValue) => {
  currentPage.value = 1 // Reset to the first page for new searches
  debouncedFetchItems(newValue, currentPage.value)
})

// Load more items when scrolling to the bottom
const loadMoreItems = () => {
  if (
      !noMoreItems.value && // Check if there are more items to load
      searchResults.value.length < totalItems.value && // Ensure not all search results are loaded
      !isFetchingMore.value && // Ensure no ongoing fetch
      !isLoading.value // Ensure no initial loading
  ) {
    currentPage.value += 1 // Increment page number
    fetchItems(searchQuery.value, currentPage.value)
  }
}

// Initialize component
onMounted(() => {
  nextTick(() => {
    fetchItems('', 1) // Fetch initial items
  });
})

// Handle search input updates
const handleSearchUpdate = (event) => {
  searchQuery.value = event
}
</script>