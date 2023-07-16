<template>
  <v-form :readonly="loading"
          @submit.prevent="submit"
          ref="addProductForm">

    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات کلی</v-label>
    <v-row class="px-7 pt-5">

      <!--      Name      -->
      <v-col class="mt-md-0" cols="12" md="4">
        <v-text-field class="mt-3"
                      v-model="form.name"
                      label="نام کالا"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

      <!--      Category      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-autocomplete class="mt-3"
                        v-model="form.categories"
                        label="دسته بندی"
                        :readonly="loading"
                        :rules="rules.notEmptySelectableMultiple"
                        :items="list.categories"
                        item-title="title"
                        item-value="_id"
                        density="compact"
                        variant="outlined"
                        chips
                        multiple>
        </v-autocomplete>
      </v-col>

      <!--      Brand      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <v-select class="mt-3"
                  v-model="form.brand"
                  label="برند"
                  :readonly="loading"
                  :rules="rules.notEmptySelectable"
                  :items="list.brands"
                  item-title=".title"
                  item-value="_id"
                  density="compact"
                  variant="outlined">
        </v-select>
      </v-col>

      <!--      Unit      -->
      <v-col class="mt-n5 mt-md-n2" cols="12" md="4">
        <v-select class=""
                  v-model="form.unit"
                  label="واحد"
                  :readonly="loading"
                  :rules="rules.notEmptySelectable"
                  :items="list.units"
                  item-title="title"
                  item-value="_id"
                  density="compact"
                  variant="outlined">
        </v-select>
      </v-col>

      <!--      Barcode      -->
      <v-col class="mt-n5 mt-md-n5" cols="12" md="4">
        <v-text-field class="mt-3"
                      v-model="form.barcode"
                      label="بارکد"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">

          <template v-slot:append-inner>
            <v-btn class="px-2" variant="text">
              <v-icon class="mx-1">mdi-line-scan</v-icon>
              اسکن
            </v-btn>
          </template>

        </v-text-field>
      </v-col>

      <!--      Iran Code      -->
      <v-col class="mt-n5 mt-md-n5" cols="12" md="4">
        <v-text-field class="mt-3"
                      v-model="form.iranCode"
                      label="ایران کد"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

    </v-row>

    <v-divider class="my-10"></v-divider>

    <!--    Variants     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-tag-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">تنوع کالا</v-label>

    <!--  Add Variant   -->
    <v-btn class="border"
           @click="addVariant"
           size="30"
           variant="outlined"
           color="pink"
           icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!--   Variants List   -->
    <v-row class="px-7 mt-2">
      <v-col v-for="(variant, index) in form.variants"
             :key="index"
             cols="12"
             md="4"
             class="">
        <v-card class="border rounded-lg bg-grey-lighten-4" variant="flat">

          <v-card-title class="text-subtitle-2 mb-2">
            {{ variant.title }}

            <!--  Delete Variant   -->
            <v-btn class="border float-end"
                   @click="deleteVariant(index)"
                   size="30"
                   variant="outlined"
                   color="pink"
                   icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="px-0 pt-0 pb-8">

            <v-row class="px-7">

              <!--      Color     -->
              <v-col cols="12">
                <v-select class="bg-white"
                          v-model="variant.color"
                          label="رنگ‌"
                          :readonly="loading"
                          :rules="rules.notEmptySelectable"
                          :items="list.colors"
                          @update:modelValue="createVariantsTitles"
                          item-title="title"
                          item-value="._id"
                          density="compact"
                          variant="outlined"
                          hide-details>
                </v-select>
              </v-col>


              <!--      Size      -->
              <v-col class="mt-n5" cols="12">
                <v-select class="mt-3 bg-white"
                          v-model="variant.size"
                          label="سایز"
                          :readonly="loading"
                          :rules="rules.notEmptySelectable"
                          :items="list.sizes"
                          @update:modelValue="createVariantsTitles"
                          item-title="title"
                          item-value="_id"
                          density="compact"
                          variant="outlined"
                          hide-details>
                </v-select>
              </v-col>

            </v-row>

          </v-card-text>

        </v-card>
      </v-col>

      <div v-if="!form.variants.length" class="d-flex justify-center w-100 my-12">
        <v-label>تنوع ندارد</v-label>
      </div>

    </v-row>


    <v-divider class="my-10"></v-divider>

    <!--  Physical characteristics   -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-clipboard-text-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات فیزیکی</v-label>

    <!--  Photos   -->
    <v-row class="mt-2 mx-4">

      <!--   File Input    -->
      <v-col cols="12" md="3">
        <v-file-input v-model="form.files"
                      :rules="rules.filesIsValid"
                      validate-on="input lazy"
                      type="file"
                      class="d-none"
                      ref="filesInput"
                      accept="image/*"
                      multiple>
        </v-file-input>

        <v-card class="border border-dashed border-opacity-100 h-100 w-100"
                :class="form.filesError ? 'bg-red' : ''"
                @click="openFileDialog"
                variant="plain" link>
          <v-card-text>
            <v-row class="d-flex justify-center py-8">
              <v-icon class="w-100 my-2" size="90" color="grey-lighten-2">mdi-image</v-icon>
              افزودن تصویر
            </v-row>
          </v-card-text>
        </v-card>

      </v-col>

      <!--   Previews    -->
      <v-col v-for="filePreview in form.filesPreview"
             class=""
             cols="12"
             md="3">
        <v-img :src="filePreview" class="w-100 h-100"></v-img>
      </v-col>

    </v-row>

    <!-- Physical properties   -->
    <v-row class="mx-4">

      <!--   weight    -->
      <v-col cols="12" md="3">
        <v-text-field class="mt-3"
                      type="number"
                      v-model="form.properties.weight"
                      label="وزن"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
          <template v-slot:append-inner>
            <v-label class="text-grey-darken-4 text-subtitle-2">گرم</v-label>
          </template>
        </v-text-field>
      </v-col>

      <!--   Dimensions    -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="3">
        <DimensionsInput @onText="onTextDimensionInput"
                         class="mt-3 mx-0"
                         first-label="طول"
                         second-label="عرض"
                         operation="*"
                         unit="سانتی متر"
                         label="ابعاد"
                         :notEmpty="true"/>
      </v-col>

      <!--   Tags    -->
      <v-col cols="12" md="6">
        <v-text-field class="mt-3"
                      v-model="form.tags"
                      label="برچسب‌ها"
                      placeholder="با عبارت - از هم جدا کنید"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>
    </v-row>

    <v-divider class="my-10"></v-divider>

    <!--  Properties   -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-clipboard-text-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">ویژگی‌ها</v-label>

    <!--  Add Property   -->
    <v-btn class="border"
           @click="addProperty"
           size="30"
           variant="outlined"
           color="pink"
           icon>
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!--  Properties List  -->
    <v-row class="mt-5 mx-4 pb-12 d-flex justify-center">
      <v-table class="w-100" v-if="form.properties.length">
        <thead>
        <th>عنوان</th>
        <th>مقدار</th>
        <th>عملیات</th>
        </thead>
        <tbody>
        <tr v-for="(property, index) in form.properties" class="w-100 pa-0">

          <!--      Title      -->
          <td>
            <v-text-field class=""
                          v-model="property.title"
                          label="عنوان"
                          placeholder="وارد کنید"
                          :readonly="loading"
                          :rules="rules.notEmpty"
                          density="compact"
                          variant="outlined"
                          hide-details>
            </v-text-field>
          </td>

          <!--      Value      -->
          <td>
            <v-text-field class=""
                          v-model="property.value"
                          label="مقدار"
                          placeholder="وارد کنید"
                          :readonly="loading"
                          :rules="rules.notEmpty"
                          density="compact"
                          variant="outlined"
                          hide-details>
            </v-text-field>
          </td>

          <!--    Actions      -->
          <td class="text-center">
            <!--  Delete Property   -->
            <v-btn class="border"
                   @click="deleteProperty(index)"
                   size="30"
                   variant="outlined"
                   color="pink"
                   icon>
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </td>

        </tr>
        </tbody>
      </v-table>
      <v-label v-if="!form.properties.length" class="mt-5">ویژگی ندارد</v-label>
    </v-row>

    <v-divider class="my-10"></v-divider>


    <!--  Text Content   -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-text</v-icon>
    <v-label class="text-black font-weight-bold mx-3">محتوای متنی</v-label>

    <v-row class="mx-5">

      <!--   Title    -->
      <v-col cols="12" md="4">
        <v-text-field class="mt-3"
                      v-model="form.title"
                      label="عنوان کالا"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      :rules="rules.notEmpty"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

      <!--   Content    -->
      <v-col class="mt-n8 mt-n5" cols="12" md="12">
        <v-textarea class="mt-3"
                    v-model="form.content"
                    label="توضیحات"
                    placeholder="وارد کنید"
                    :readonly="loading"
                    :rules="rules.notEmpty"
                    density="compact"
                    variant="outlined">
        </v-textarea>
      </v-col>

    </v-row>


    <!--     Actions       -->
    <v-row class="mt-10 mx-1">
      <v-col cols="12">

        <!--       Submit       -->
        <v-btn class="border rounded-lg"
               :loading="form.loading"
               prepend-icon="mdi-check-circle-outline"
               height="40"
               width="100"
               variant="text"
               type="submit"
               density="compact">
          ثبت
        </v-btn>

        <!--       Reset       -->
        <v-btn class="border mx-2 rounded-lg"
               color="pink"
               prepend-icon="mdi-delete-outline"
               height="40"
               width="100"
               variant="text"
               @click="reset"
               density="compact">
          بازنگری
        </v-btn>

      </v-col>
    </v-row>

  </v-form>
</template>

<script>
import {useUserStore} from "~/store/user";

export default {
  data() {
    return {
      user   : {},
      loading: false,
      form   : {
        name        : '',
        categories  : [],
        brand       : null,
        unit        : null,
        barcode     : '',
        iranCode    : '',
        variants    : [
          {
            color: null,
            size : null,
            title: ''
          }
        ],
        files       : [],
        filesPreview: [],
        filesError  : false,
        dimensions  : {},
        tags        : '',
        properties  : [
          {
            title: '',
            value: ''
          }
        ],
        title       : '',
        content     : '',
        action      : 'insert',
        loading     : false
      },
      rules  : {
        notEmpty                  : [
          value => {
            if (value) return true;
            return 'پر کردن این فیلد اجباری است';
          }
        ],
        notEmptySelectable        : [
          value => {
            if (value) return true;
            return 'لطفا انتخاب کنید';
          }
        ],
        notEmptySelectableMultiple: [
          value => {
            if (value.length) return true;
            return 'لطفا انتخاب کنید';
          }
        ],
        filesIsValid              : [
          value => {
            let valid = true;
            value.forEach((file) => {
              // Allowing file type
              let allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

              // check format
              if (!allowedExtensions.exec(file.name)) {
                // show error
                const {$showMessage} = useNuxtApp();
                $showMessage('فرمت فایل انتخابی قابل قبول نیست', 'error');
                valid = false;
                return false;
              }

              // check size
              if ((file.size / 1024 / 1024).toFixed(2) > 0.5) {
                // show error
                const {$showMessage} = useNuxtApp();
                $showMessage('اندازه فایل بیش از حد مجاز است', 'error');
                valid = false;
                return false;
              }

            });

            if (valid) {
              this.createImagesPreview();
              this.form.filesError = false;
            } else {
              this.form.filesPreview = [];
              this.form.filesError   = true;
            }

            return valid;


          }
        ]
      },
      list   : {
        categories: [],
        brands    : [],
        colors    : [],
        sizes     : []
      },
    }
  },
  methods: {
    reset() {
      this.form = {
        name        : '',
        categories  : [],
        brand       : null,
        unit        : null,
        barcode     : '',
        iranCode    : '',
        variants    : [
          {
            color: null,
            size : null,
            title: ''
          }
        ],
        files       : [],
        filesPreview: [],
        filesError  : false,
        dimensions  : {},
        tags        : '',
        properties  : [
          {
            title: '',
            value: ''
          }
        ],
        title       : '',
        content     : '',
        action      : 'insert',
        loading     : false
      };
    },
    async insert() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'products', {
            method : 'post',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              name      : this.form.name,
              categories: this.form.categories,
              brand     : this.form.brand,
              unit      : this.form.unit,
              barcode   : this.form.barcode,
              iranCode  : this.form.iranCode,
              variants  : this.form.variants,
              dimensions: this.form.dimensions,
              tags      : this.form.tags,
              properties: this.form.properties,
              title     : this.form.title,
              content   : this.form.content
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          if (this.form.files.length) {
            response = await response.json();
            await this.uploadFiles(response._id)
          } else {
            $showMessage('عملیات با موفقت انجام شد', 'success');
          }
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async uploadFiles(_id) {
      // add files to form data
      let filesForm = new FormData();
      this.form.files.forEach((file) => {
        filesForm.append('files', file);
      });

      await fetch(
          this.runtimeConfig.public.apiUrl + 'products/' + _id + '/files', {
            method : 'post',
            headers: {
              'authorization': 'Bearer ' + this.user.token
            },
            body   : filesForm
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async edit() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'units', {
            method : 'put',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              title  : this.form.title,
              titleEn: this.form.titleEn,
              _id    : this.form._id
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // refresh list
          await this.getUnits();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async delete(_id) {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'units', {
            method : 'delete',
            headers: {
              'Content-Type' : 'application/json',
              'authorization': 'Bearer ' + this.user.token
            },
            body   : JSON.stringify({
              _id: _id
            })
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          $showMessage('عملیات با موفقت انجام شد', 'success');

          // refresh list
          await this.getUnits();
        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.addProductForm.isValid) {
        this.form.loading = true;

        if (this.form.action === 'insert') {
          await this.insert();
        } else if (this.form.action === 'edit') {
          // await this.edit();
        }

        this.form.loading = false;
      }
    },
    async getUnits() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'units', {
            method : 'get',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(async response => {
        response        = await response.json();
        this.list.units = response;
      });
    },
    async getBrands() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'brands', {
            method : 'get',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(async response => {
        response         = await response.json();
        this.list.brands = response;
      });
    },
    async getColors() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'colors', {
            method : 'get',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(async response => {
        response         = await response.json();
        this.list.colors = response;
      });
    },
    async getSizes() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'sizes', {
            method : 'get',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(async response => {
        response        = await response.json();
        this.list.sizes = response;
      });
    },
    async getCategories() {
      await fetch(
          this.runtimeConfig.public.apiUrl + 'categories', {
            method : 'get',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(async response => {
        response             = await response.json();
        this.list.categories = this.reFormatCategories(response);
      });
    },
    setEdit(data) {
      this.form = {
        title  : data.title,
        titleEn: data.titleEn,
        action : 'edit',
        _id    : data._id
      };
    },
    setDelete(data) {
      if (confirm('آیا مطمئن هستید؟')) {
        this.delete(data._id);
      }
    },
    setParent(data) {
      this.form._parent      = data._id;
      this.form._parentTitle = data.title;
    },
    reFormatCategories(list) {
      let result = [];
      let lastChildren;
      list.forEach((item) => {
        result.push(item);
        if (item.children) {
          item.children.forEach((childItem) => {

            childItem.title = item.title + " | " + childItem.title;

            result.push(childItem);

            if (childItem.children) {
              lastChildren = this.formatCategory(childItem.children);
              lastChildren.forEach((childItemJ) => {
                childItemJ.title = childItem.title + " | " + childItemJ.title;
                result.push(childItemJ);
              });
            }

          });
        }
      });
      return result;
    },
    addVariant() {
      this.form.variants.push({color: null, size: null, title: ''});
    },
    deleteVariant(index) {
      this.form.variants.splice(index, 1);
    },
    createVariantsTitles() {
      this.form.variants.forEach((variant) => {
        variant.title =
            this.form.name + ' ' +
            (variant.color ? this.list.colors.find(color => color._id === variant.color).title : '') +
            ' سایز ' +
            (variant.size ? this.list.sizes.find(size => size._id === variant.size).title : '');
      })
    },
    openFileDialog() {
      this.$refs.filesInput.click();
    },
    createImagesPreview() {
      this.form.filesPreview = [];
      this.form.files.forEach((file) => {
        this.form.filesPreview.push(URL.createObjectURL(file));
      });
    },
    onTextDimensionInput(data) {
      this.form.dimensions = {
        length: data.length,
        width : data.width
      };
    },
    addProperty() {
      this.form.properties.push({
        title: '',
        value: ''
      });
    },
    deleteProperty(index) {
      this.form.properties.splice(index, 1);
    },
  },
  watch  : {},
  mounted() {
    this.user = useUserStore();
    this.getUnits();
    this.getCategories();
    this.getBrands();
    this.getColors();
    this.getSizes();
  },
  computed: {
    runtimeConfig() {
      return useRuntimeConfig();
    }
  }
}
</script>

<style scoped>

</style>