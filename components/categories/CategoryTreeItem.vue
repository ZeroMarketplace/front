<template>
  <div class="category-tree-item">
    <div class="category-item bg-bglight rounded-lg pa-4 mb-2 d-flex align-center">
      <!-- Expand/Collapse Button -->
      <v-btn v-if="item.children && item.children.length" icon size="small" variant="text" @click="expanded = !expanded"
        class="me-2">
        <Icon :icon="expanded ? 'solar:alt-arrow-down-linear' : 'solar:alt-arrow-right-linear'" height="20" />
      </v-btn>
      <div v-else class="me-2" style="width: 40px"></div>

      <!-- Category Title -->
      <div class="flex-grow-1">
        <span class="text-14 font-weight-semibold">{{ item.title }}</span>
        <v-chip v-if="item.profitPercent" size="x-small" class="ms-2" color="info" variant="flat">
          سود: {{ item.profitPercent }}%
        </v-chip>
      </div>

      <!-- Status Chip -->
      <v-chip rounded="pill" :color="item.status === 1 ? 'success' : 'error'" variant="flat" size="small" label
        class="me-3">
        {{ item.status === 1 ? 'فعال' : 'غیرفعال' }}
      </v-chip>

      <!-- Action Buttons -->
      <div class="d-flex ga-2">
        <!-- Add Child -->
        <RouterLink to="" @click.stop="$emit('add-child', item._id, item.title)">
          <v-avatar color="lightprimary" size="32">
            <Icon icon="solar:add-circle-linear" class="text-primary" height="18" />
          </v-avatar>
          <v-tooltip activator="parent" location="bottom">افزودن زیردسته</v-tooltip>
        </RouterLink>

        <!-- Three-dots menu -->
        <v-menu>
          <template v-slot:activator="{ props }">
            <v-btn icon variant="text" v-bind="props" size="small">
              <Icon icon="solar:menu-dots-bold" height="20" />
            </v-btn>
          </template>
          <v-list density="compact" min-width="200">
            <v-list-item @click="$router.push(`/categories/edit/${item._id}`)">
              <template v-slot:prepend>
                <Icon icon="solar:pen-linear" height="18" class="text-success me-3" />
              </template>
              <v-list-item-title>ویرایش</v-list-item-title>
            </v-list-item>

            <v-list-item @click="$emit('toggle-status', item)">
              <template v-slot:prepend>
                <Icon :icon="item.status === 1 ? 'solar:eye-closed-linear' : 'solar:eye-linear'" height="18"
                  :class="item.status === 1 ? 'text-warning me-3' : 'text-info me-3'" />
              </template>
              <v-list-item-title>
                {{ item.status === 1 ? 'غیرفعال کردن' : 'فعال کردن' }}
              </v-list-item-title>
            </v-list-item>

            <v-divider />

            <v-list-item @click="$emit('delete', item._id)" class="text-error">
              <template v-slot:prepend>
                <Icon icon="solar:trash-bin-minimalistic-linear" height="18" class="text-error me-3" />
              </template>
              <v-list-item-title>حذف</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </div>
    </div>

    <!-- Children (Recursive) -->
    <div v-if="expanded && item.children && item.children.length" class="children-container ms-8">
      <CategoryTreeItem v-for="child in item.children" :key="child._id" :item="child"
        @toggle-status="$emit('toggle-status', $event)" @delete="$emit('delete', $event)"
        @add-child="$emit('add-child', $event)" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Icon } from '@iconify/vue';

defineProps({
  item: {
    type: Object,
    required: true
  }
});

defineEmits(['toggle-status', 'delete', 'add-child']);

const expanded = ref(false);
</script>

<style scoped>
.category-tree-item {
  margin-bottom: 8px;
}

.category-item {
  transition: all 0.2s ease;
}

.category-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.children-container {
  margin-top: 8px;
  padding-left: 16px;
  border-left: 2px solid #e0e0e0;
}
</style>
