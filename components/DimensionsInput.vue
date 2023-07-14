<template>
<v-row class="border rounded-lg overflow-hidden px-0 pt-3 dimensionInput" no-gutters>

  <v-col cols="3">
    <v-text-field class="mt-n5"
                  label="طول"
                  variant="outlined">
    </v-text-field>
  </v-col>

  <v-col cols="1">
    *
  </v-col>

  <v-col cols="3">
    <v-text-field class="mt-n5"
                  label="عرض"
                  variant="outlined">
    </v-text-field>
  </v-col>

  <v-col cols="2">
    سانتی متر
  </v-col>

</v-row>
</template>

<script>
export default {
  props: ['firstLabel', 'secondLabel', 'operation', 'unit'],
  data() {
    return {
      text   : '',
      textOne: '',
      textTwo: ''
    }
  },
  watch: {}
}
</script>


<style scoped>
.dimensionInput {
  max-height: 50px;
}
</style>