<script setup>
const route = useRoute()

const showdialog = ref(false)
const productRef = ref(null)

function handleCardClick(e) {
  if (!productRef.value?.contains(e.target)) {
    showdialog.value = false
  }
}

const products = [
  { id: 1 },
  { id: 2 },
  { id: 3 },
  { id: 4 },
  { id: 5 },
  { id: 6 },
  { id: 7 },
  { id: 8 },
  { id: 9 },
  { id: 10 },
]

 const items = [
    {
      title: 'خانه',
      disabled: false,
      href: '/',
    },
    {
      title: 'لوازم دیجیتال',
      disabled: false,
      href: 'product',
    },
  ]
</script>

<template>
  <div class="d-flex">
      <productFilter class="filter-sidebar d-none d-sm-block " />
    <div class="flex-grow-1">

      <!-- Mobile Filter Button -->
      <v-container class="d-sm-none">
        <v-btn block color="primary" class="mb-4" @click="showdialog = true">
          فیلتر 
        </v-btn>
      </v-container>

      
      <v-container>
        <v-breadcrumbs :items="items">
          <template v-slot:title="{ item }">
            <p :class="{ activeUrl: route.name === item.href }" class="text-body-2">
              {{ item.title }}
            </p>
          </template>
        </v-breadcrumbs>
        <v-row>
          <v-col
            v-for="product in products"
            :key="product.id"
            cols="12"
            sm="6"
            md="4"
            lg="3"
          >
            <homeProductsProductItem :product="product" />
          </v-col>
        </v-row>
      </v-container>
    </div>
  </div>

    
  <v-dialog
    v-model="showdialog"
    fullscreen
    class="d-sm-none blur-dialog"
    scrim="transparent"
  >
    <v-card 
      class="align-center no-click-effect" 
      @click="handleCardClick" 
      ripple="false"
      >
      <div  ref="productRef">
        <productFilter />
      </div>
    </v-card>
  </v-dialog>


</template>

<style scoped>

.activeUrl {
  color: #EC407A;
}

.filter-sidebar {
  min-width: 200px;
  height: 100%;
  background-color: white;
  box-shadow: 0px 8px 80px #0000000A;
}


:deep(.v-card--variant-elevated) {
  backdrop-filter: blur(4px);
  background-color: rgba(255, 255, 255, 0.058);
}
/* Disable ripple and click highlight */
.no-click-effect {
  --v-theme-overlay-multiplier: 0 !important;
  user-select: none;
}
.no-click-effect:active {
  background-color: transparent !important;
}

</style>