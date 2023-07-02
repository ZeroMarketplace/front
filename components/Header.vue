<template>

  <v-container>
    <v-row class="pt-4 pb-3">

      <!--  Name And Logo  -->
      <v-col class="mt-2">
        <v-label class="">فروشگاه زیرو</v-label>
      </v-col>

      <v-col class="pb-3">
        <v-text-field
            class="border rounded-xl px-4 pb-2"
            variant="plain"
            density="compact"
            label="جستجو"
            append-inner-icon="mdi-magnify"
            rounded
            hide-details></v-text-field>
      </v-col>

      <v-col class="pt-4">
        <v-btn append-icon="mdi-user-outline" variant="plain" large>
          پروفایل
        </v-btn>
      </v-col>

    </v-row>
    <v-divider></v-divider>
  </v-container>
</template>

<script setup lang="ts">

</script>

<style scoped>

</style>