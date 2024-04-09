<template>
  <div>
    <v-combobox class="w-100"
                v-model="title"
                label="عنوان یا کد حساب"
                :readonly="loading"
                :loading="loading"
                :items="items"
                item-title="title.fa"
                item-value="_id"
                density="compact"
                variant="outlined"
                @input="searchAccount"
                clearable>
    </v-combobox>
  </div>
</template>

<script>
import {useCookie} from "#app";

export default {
  props: ['inputId'],
  data() {
    return {
      title  : '',
      items  : [],
      loading: false,
      rules  : {
        notEmptySelectable: [
          value => {
            if (value) return true;
            return 'لطفا انتخاب کنید';
          }
        ]
      }
    }
  },
  methods : {
    searchAccount() {
      clearInterval(this.timer);

      this.timer = setTimeout(() => {

        let search = new URLSearchParams();

        // code or title
        if (typeof this.title === 'number') {
          search.set('code', this.title);
        } else {
          search.set('title', this.title);
        }

        // search request
        this.loading = true;
        fetch(
            this.runtimeConfig.public.API_BASE_URL + 'accounts?' + search, {
              method: 'get',
            }).then(
            async (response) => {
              response     = await response.json();
              this.items   = response.list;
              this.loading = false;
            });

      }, 800);
    },
    getAccount() {
      this.loading = true;
      fetch(this.runtimeConfig.public.API_BASE_URL + 'accounts/' + this.inputId, {
        method : 'get',
        headers: {
          'Content-Type' : 'application/json',
          'authorization': 'Bearer ' + this.user.token
        }
      }).then(async (response) => {
        response = await response.json();
        this.items.push(response);
        this.title   = response;
        this.loading = false;
      });
    },
  },
  computed: {},
  watch   : {
    title(val, oldVal) {
      if (val && typeof val === 'object') {
        this.$emit('selected', val);
      }
    },
  },
  mounted() {
    this.user          = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    if (this.inputId) {
      this.getAccount();
    }
  }
}
</script>

<style scoped>

</style>