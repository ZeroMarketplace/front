<script setup>

const showdialog = ref(false)

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
</script>

<template>
  <div class="d-flex">
      <categoryFilter class="filter-sidebar d-none d-sm-block " />
    <div class="flex-grow-1">

      <!-- Mobile Filter Button -->
      <v-container class="d-sm-none">
        <v-btn block color="primary" class="mb-4" @click="showdialog = true">
          فیلتر 
        </v-btn>
      </v-container>

      
      <v-container>
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

    
  <v-dialog v-model="showdialog" fullscreen class="d-sm-none">
    <v-card>
      <v-card-title class="d-flex justify-space-between align-center">
        فیلتر نتایج
        <v-btn icon @click="showdialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
        <categoryFilter />
    </v-card>
  </v-dialog>


</template>

<style scoped>
.filter-sidebar {
  min-width: 200px;
  height: 100%;
  background-color: white;
  box-shadow: 0px 8px 80px #0000000A;
}
</style>