<template>
  <v-row class="border border-opacity-50 rounded overflow-hidden px-3 dimensionInput"
         no-gutters>

    <v-label class="position-absolute bg-white text-subtitle-2 mt-n3 px-3">{{ label }}</v-label>

    <v-col cols="4">
      <v-text-field class="mt-n3 mx-2 centeredText"
                    :placeholder="firstLabel"
                    :rules="rules.notEmpty"
                    v-model="length"
                    type="number"
                    variant="underlined"
                    hide-details>
      </v-text-field>
    </v-col>

    <v-col class="pt-3 text-center" cols="1">
      {{ operation }}
    </v-col>

    <v-col cols="4">
      <v-text-field class="mt-n3 mx-2 centeredText"
                    :placeholder="secondLabel"
                    :rules="rules.notEmpty"
                    v-model="width"
                    type="number"
                    variant="underlined"
                    hide-details>
      </v-text-field>
    </v-col>

    <v-col class="text-caption text-grey-darken-1 pt-3 text-end" cols="3">
      {{ unit }}
    </v-col>

  </v-row>
</template>

<script>
export default {
  props: ['firstLabel', 'secondLabel', 'operation', 'unit', 'label', 'notEmpty', 'firstValue', 'secondValue'],
  data() {
    return {
      length: '',
      width : '',
      rules : {
        notEmpty: [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ]
      }
    }
  },
  methods: {
    setData() {
      this.$emit('input', {
        length: this.length,
        width : this.width
      });
    }
  },
  watch  : {
    length(val) {
      this.setData();
    },
    width(val) {
      this.setData();
    }
  },
}
</script>


<style scoped>
.dimensionInput {
  height: 45px;
  max-height: 45px;
}

.centeredText > > input {
  text-align: center !important;
}
</style>