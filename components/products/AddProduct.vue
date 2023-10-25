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
                        :items="categories"
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
        <v-autocomplete class="mt-3"
                        v-model="form.brand"
                        label="برند"
                        :readonly="loading"
                        :rules="rules.notEmptySelectable"
                        :items="brands"
                        item-title=".title"
                        item-value="_id"
                        density="compact"
                        variant="outlined">
        </v-autocomplete>
      </v-col>

      <!--      Unit      -->
      <v-col class="mt-n5 mt-md-n2" cols="12" md="4">
        <v-autocomplete class=""
                        v-model="form.unit"
                        label="واحد"
                        :readonly="loading"
                        :rules="rules.notEmptySelectable"
                        :items="units"
                        item-title="title"
                        item-value="_id"
                        density="compact"
                        variant="outlined">
        </v-autocomplete>
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
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

    </v-row>

    <v-divider class="my-5"></v-divider>

    <!--  Physical characteristics   -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-clipboard-text-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات فیزیکی</v-label>

    <!--  Photos   -->
    <v-row class="mt-2 mx-4">

      <!--   File Input    -->
      <v-col cols="12" md="3">
        <v-file-input v-model="form.files"
                      :rules="rules.filesIsValid"
                      validate-on="input"
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
      <v-col v-for="(filePreview, index) in form.filesPreview"
             class=""
             cols="12"
             md="3">
        <v-img :src="filePreview.src" class="w-100 h-100">
          <v-btn v-if="filePreview.uploaded"
                 class="mt-2 mr-2 border border-opacity-100"
                 size="25"
                 variant="elevated"
                 @click="deleteFile(filePreview.name, index)"
                 icon>
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </v-img>
      </v-col>

    </v-row>

    <!-- Physical properties   -->
    <v-row class="mx-4">

      <!--   weight    -->
      <v-col cols="12" md="3">
        <v-text-field class="mt-3"
                      type="number"
                      v-model="form.weight"
                      label="وزن"
                      placeholder="وارد کنید"
                      :readonly="loading"
                      density="compact"
                      variant="outlined">
          <template v-slot:append-inner>
            <v-label class="text-grey-darken-4 text-subtitle-2">گرم</v-label>
          </template>
        </v-text-field>
      </v-col>

      <!--   Dimensions    -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="3">
        <v-row class="border border-opacity-50 rounded overflow-hidden px-3 mt-3"
               no-gutters>

          <v-label class="position-absolute bg-white text-subtitle-2 mt-n3 px-3">ابعاد</v-label>

          <v-col cols="3">
            <v-text-field class="mt-n3 mx-2 centeredText"
                          placeholder="طول"
                          v-model="form.dimensions.length"
                          type="number"
                          variant="underlined"
                          hide-details>
            </v-text-field>
          </v-col>

          <v-col class="pt-3 text-center" cols="2">
            *
          </v-col>

          <v-col cols="3">
            <v-text-field class="mt-n3 mx-2 centeredText"
                          placeholder="عرض"
                          v-model="form.dimensions.width"
                          type="number"
                          variant="underlined"
                          hide-details>
            </v-text-field>
          </v-col>

          <v-col class="text-caption text-grey-darken-1 pt-3 text-end" cols="4">
            سانتی متر
          </v-col>

        </v-row>
      </v-col>

      <!--   Tags    -->
      <v-col cols="12" md="6">
        <v-text-field class="mt-3"
                      v-model="form.tags"
                      label="برچسب‌ها"
                      placeholder="با عبارت - از هم جدا کنید"
                      :readonly="loading"
                      density="compact"
                      variant="outlined">
        </v-text-field>
      </v-col>

    </v-row>

    <v-divider class="my-5"></v-divider>

    <!--    Variants     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-tag-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">تنوع کالا</v-label>

    <!--   Variants List   -->
    <div class="px-5 mt-2">

      <!--   Chip Input   -->
      <v-chip-group v-model="form.variantsValues"
                    class="overflow-hidden"
                    column
                    multiple>

        <v-row v-for="property in categoryProperties.filter(p => p.variant === true)"
               class="mt-2">
          <!--    Title    -->
          <v-col class="" cols="12" md="2">
            <v-label class="mx-2">{{ property.title }}</v-label>
          </v-col>

          <!--    Values    -->
          <v-col cols="12" md="10" class="pt-0">


            <v-chip v-for="(value) in property.values"
                    :key="value.code"
                    :value="value.code"
                    class="mx-2"
                    variant="outlined"
                    @click="togglePropertyVariant(property._id,value.code)"
                    filter>

              <template v-slot:prepend>
                <!--       Color         -->
                <v-icon class="mx-1"
                        v-if="/^#([0-9A-F]{3}){1,2}$/i.test(value.value)"
                        :color="value.value">
                  mdi-circle
                </v-icon>
              </template>

              {{ value.title }}

            </v-chip>

          </v-col>

        </v-row>

      </v-chip-group>

      <!--   List   -->
      <v-table v-if="form.variants.length" class="w-100 px-2 mt-8">

        <thead>
        <tr>
          <th v-for="props in form.variantsProps" class="text-center font-weight-bold">
            {{ getVariantProps(props._id).title ?? '' }}
          </th>
          <th class="text-center">
            <v-icon>mdi-cog</v-icon>
          </th>
        </tr>

        </thead>

        <tbody>

        <tr v-for="(variant,index) in form.variants" class="w-100 pa-1 text-center">

          <!--     Properties     -->
          <td v-for="props in  form.variantsProps" class="flex-grow-1">
            <v-label v-for="property in variant.properties">
              <span v-if="props._id === property.propertyId">
                {{ getPropertyValue(property.propertyId, property.value).title }}
              </span>
            </v-label>
          </td>

          <!--   Actions     -->
          <td class="text-center w-25">
            <!--  Delete Property   -->
            <v-btn class="border"
                   @click="deleteVariant(index)"
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

      <!--   Empty    -->
      <div v-if="!form.variants.length" class="d-flex justify-center w-100 my-12">
        <v-label>تنوع ندارد</v-label>
      </div>

    </div>


    <v-divider class="my-5 "></v-divider>

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

    <!--  Add Dynamic Properties  -->
    <v-row class="mt-5 pb-5 mx-4 d-flex justify-center"
           v-if="categoryProperties.filter(p => !p.variant).length">
      <v-chip-group v-model="form.dynamicProperties"
                    class="overflow-hidden"
                    column
                    multiple>

        <v-chip v-for="value in categoryProperties.filter(p => !p.variant)"
                :key="value._id"
                :value="value._id"
                class="mx-2"
                variant="outlined"
                @click="toggleDynamicProperty(value._id,value.title)"
                filter>

          {{ value.title }}

        </v-chip>

      </v-chip-group>
    </v-row>

    <!--  Properties List  -->
    <v-row class="mt-1 mx-12 pb-12 d-flex justify-center">
      <v-table class="w-100" v-if="form.properties.length">
        <thead>
        <tr>
          <th class="text-center">عنوان</th>
          <th class="text-center">مقدار</th>
          <th class="text-center">
            <v-icon>mdi-cog</v-icon>
          </th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(property, index) in form.properties" class="w-100 pa-0">

          <!--      Title      -->
          <td>
            <v-text-field class=""
                          v-model="property.title"
                          label="عنوان"
                          placeholder="وارد کنید"
                          :readonly="loading || property._id"
                          :rules="rules.notEmpty"
                          density="compact"
                          variant="outlined"
                          hide-details>
            </v-text-field>
          </td>

          <!--      Value      -->
          <td>
            <v-text-field
                v-if="!property._id || (property._id && !getPropertyValues(property._id).length)"
                class=""
                v-model="property.value"
                label="مقدار"
                placeholder="وارد کنید"
                :readonly="loading"
                :rules="rules.notEmpty"
                density="compact"
                variant="outlined"
                hide-details>
            </v-text-field>

            <v-autocomplete v-if="property._id && getPropertyValues(property._id).length"
                            class="mt-3"
                            v-model="property.value"
                            label="مقدار"
                            :readonly="loading"
                            :rules="rules.notEmptySelectable"
                            :items="getPropertyValues(property._id)"
                            item-title="title"
                            item-value="code"
                            density="compact"
                            variant="outlined"
                            hide-details>
            </v-autocomplete>
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

    <v-divider class="my-5"></v-divider>


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
               :loading="loading"
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
import {useCookie}    from "#app";

export default {
  data() {
    return {
      user              : {},
      form              : {
        name             : '',
        categories       : [],
        brand            : null,
        unit             : null,
        barcode          : '',
        iranCode         : '',
        variants         : [],
        variantsProps    : [],
        variantsValues   : [],
        files            : [],
        filesPreview     : [],
        filesError       : false,
        weight           : '',
        dimensions       : {
          length: '',
          width : ''
        },
        tags             : '',
        properties       : [],
        dynamicProperties: [],
        title            : '',
        content          : ''
      },
      rules             : {
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
              if ((file.size / 1024 / 1024).toFixed(2) > 4.7) {
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
      categories        : [],
      units             : [],
      brands            : [],
      categoryProperties: [],
      action            : 'add',
      loading           : false,
    }
  },
  methods: {
    reset() {
      this.$refs.addProductForm.reset();
      this.form.files             = [];
      this.form.variants          = [];
      this.form.variantsProps     = [];
      this.form.variantsValues    = [];
      this.form.filesPreview      = [];
      this.form.filesError        = false;
      this.form.properties        = [];
      this.form.dynamicProperties = [];
      this.categoryProperties     = [];
      this.action                 = 'add';
      this.loading                = false;
    },
    async add() {

      // exception remove dynamic properties titles
      this.form.properties.forEach((property) => {
        if (property._id)
          delete property['title'];
      });

      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'products', {
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
              weight    : Number(this.form.weight),
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
            this.reset();
            this.$emit('exit');
            this.$emit('refresh');
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
          this.runtimeConfig.public.API_BASE_URL + 'products/' + _id + '/files', {
            method : 'post',
            headers: {
              'authorization': 'Bearer ' + this.user.token
            },
            body   : filesForm
          }).then(async response => {
        const {$showMessage} = useNuxtApp();
        if (response.status === 200) {
          this.reset();
          this.$emit('exit');
          this.$emit('refresh');
          $showMessage('عملیات با موفقت انجام شد', 'success');
        } else {
          // show error
          $showMessage('مشکلی در بارگذاری فایل‌ها پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async deleteFile(fileName, index) {
      if (confirm('آیا مطمئن هستید؟')) {
        await fetch(
            this.runtimeConfig.public.API_BASE_URL + 'products/' + this.form._id + '/files/' + fileName, {
              method : 'delete',
              headers: {
                'authorization': 'Bearer ' + this.user.token
              }
            }).then(async response => {
          const {$showMessage} = useNuxtApp();
          if (response.status === 200) {
            // remove item from files preview
            this.form.filesPreview.splice(index, 1);

            $showMessage('عملیات با موفقت انجام شد', 'success');
          } else {
            // show error
            $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
          }
        });
      }
    },
    async edit() {
      // exception remove dynamic properties titles
      this.form.properties.forEach((property) => {
        if (property._id)
          delete property['title'];
      });

      await fetch(
          this.runtimeConfig.public.API_BASE_URL + 'products/' + this.form._id, {
            method : 'put',
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
              weight    : Number(this.form.weight),
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
            await this.uploadFiles(this.form._id);
          } else {
            this.reset();
            this.$emit('exit');
            this.$emit('refresh');
            $showMessage('عملیات با موفقت انجام شد', 'success');
          }

        } else {
          // show error
          $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
        }
      });
    },
    async submit() {
      if (this.$refs.addProductForm.isValid) {
        this.loading = true;

        if (this.action === 'add') {
          await this.add();
        } else if (this.action === 'edit') {
          await this.edit();
        }

        this.loading = false;
      }
    },
    getUnits() {
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'units', {
            method : 'get',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(async response => {
        response   = await response.json();
        this.units = response;
      });
    },
    getBrands() {
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'brands', {
            method : 'get',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(async response => {
        response    = await response.json();
        this.brands = response;
      });
    },
    getCategories() {
      fetch(
          this.runtimeConfig.public.API_BASE_URL + 'categories', {
            method: 'get',
          }).then(async response => {
        response        = await response.json();
        this.categories = this.reFormatCategories(response);
      });
    },
    setEdit(data) {

      this.reset();

      // set data
      this.form.name         = data.name;
      this.form.properties   = data.properties;
      this.form.brand        = data._brand;
      this.form.unit         = data._unit;
      this.form.barcode      = data.barcode;
      this.form.iranCode     = data.iranCode;
      this.form.variants     = data.variants;
      this.form.lastVariants = data.variants;
      this.form.weight       = data.weight;
      this.form.dimensions   = data.dimensions;
      this.form.tags         = data.tags;
      this.form.title        = data.title;
      this.form.content      = data.content;
      this.form._id          = data._id;
      this.form.categories   = data._categories;
      this.action            = 'edit';

      // set files
      if (data.files) {
        data.files.forEach((filePreview) => {
          this.form.filesPreview.push({
            uploaded: true,
            name    : filePreview,
            src     : this.runtimeConfig.public.STATICS_URL + 'products/files/' + filePreview
          });
        });
      }

      // set variants props
      data.variants.forEach((variant) => {
        variant.properties.forEach((property) => {
          let variantProp = this.form.variantsProps.find(prop => prop._id === property.propertyId);
          if (variantProp) {
            if (!variantProp.values.includes(property.value))
              variantProp.values.push(property.value);
          } else {
            this.form.variantsProps.push({
              _id   : property.propertyId,
              values: [property.value]
            });
          }

          // add to variants values
          if (!this.form.variantsValues.includes(property.value))
            this.form.variantsValues.push(property.value);
        });
      });

      // set dynamic properties
      data.properties.forEach((property) => {
        if (property._id) {
          this.form.dynamicProperties.push(property._id);
        }
      });

    },
    setCopy(data) {
      this.setEdit(data);

      // wait for load data
      setTimeout(() => {
        this.action            = 'add';
        this.form._id          = '';
        this.form.files        = [];
        this.form.filesPreview = [];
        this.form.filesError   = false;
      }, 1000);
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
              lastChildren = this.reFormatCategory(childItem.children);
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
    async getCategoryProperties(val) {
      if (this.form.categories.length) {
        await fetch(this.runtimeConfig.public.API_BASE_URL + 'categories/' + val[0] + '/properties', {method: 'get'})
            .then(async response => {
              response                = await response.json();
              this.categoryProperties = response;

              this.$forceUpdate();

              // set dynamic properties in edit mode
              response.filter(property => property.variant === false).forEach((property) => {
                if (this.action === 'edit') {
                  let propertyFind = this.form.properties.find(prop => prop._id === property._id);
                  if (propertyFind) propertyFind.title = property.title;
                }
              });

            });
      }
    },
    checkVariantExists(variantInput) {
      this.form.variants.forEach((variant) => {
        if (JSON.stringify(variant.properties) === JSON.stringify(variantInput.properties)) {
          return true;
        }
      });

      return false;
    },
    createPropertyVariants(variant, propsChecked) {

      // every other properties
      this.form.variantsProps.forEach((variantProp) => {
        if (!propsChecked.includes(variantProp._id)) {
          // add to checked
          propsChecked.push(variantProp._id);

          // every value of other properties
          variantProp.values.forEach((propValue) => {

            // create the value sample
            let propertyObject = {propertyId: variantProp._id, value: propValue};

            // add the value sample
            variant.properties.push(propertyObject);

            // check if not exists
            if (!this.checkVariantExists(variant)) {
              // add to variants
              this.form.variants.push(structuredClone(variant));
            }

            // create variants of this value
            this.createPropertyVariants(structuredClone(variant), structuredClone(propsChecked));

            variant.properties.splice(variant.properties.indexOf(propertyObject), 1);

          });
        }
      });

      return true;
    },
    togglePropertyVariant(propertyId, valueCode) {

      // create property array
      let variantProp = this.form.variantsProps.find(prop => prop._id === propertyId);
      if (!variantProp) {
        this.form.variantsProps.push({_id: propertyId, values: []});
        variantProp = this.form.variantsProps.find(prop => prop._id === propertyId);
      }

      // toggle value
      if (variantProp.values.includes(valueCode)) {
        variantProp.values.splice(variantProp.values.indexOf(valueCode), 1);
      } else {
        variantProp.values.push(valueCode);
      }


      // refresh variants list
      this.reCreateVariants();

    },
    reCreateVariants() {
      // remove if is not selected value
      this.form.variantsProps.forEach((prop, index) => {
        if (!prop.values.length) {
          this.form.variantsProps.splice(index, 1);
        }
      });

      // reCreate variants
      // every property
      if (this.form.variantsProps.length) {

        // get the first property
        let variantProp = this.form.variantsProps[0];

        this.form.variants = [];

        // every value of property
        variantProp.values.forEach((propValue) => {

          // create base variant
          let variant = {properties: []};

          // add base prop value
          variant.properties.push({propertyId: variantProp._id, value: propValue});

          // check exists other properties
          if (this.form.variantsProps.length > 1) {
            this.createPropertyVariants(structuredClone(variant), [variantProp._id]);
          } else {
            if (!this.checkVariantExists(variant)) {
              this.form.variants.push(variant);
            }
          }

        });

      } else {
        this.form.variants = [];
      }

      // set last variants code's
      if (this.action === 'edit') {
        this.form.variants.forEach((variant) => {
          this.form.lastVariants.forEach((lVariant) => {
            if (JSON.stringify(variant.properties) === JSON.stringify(lVariant.properties)) {
              variant.code = lVariant.code;
            }
          });
        });
      }

    },
    deleteVariant(index) {
      if (confirm('آیا مطمئن هستید؟'))
        this.form.variants.splice(index, 1);
    },
    getPropertyValue(propertyId, valueCode) {
      let property = this.categoryProperties.find(prop => prop._id === propertyId);
      if (property) {
        return property.values.find(value => value.code === valueCode);
      } else {
        return {};
      }
    },
    getPropertyValues(propertyId) {
      let property = this.categoryProperties.find(prop => prop._id === propertyId);
      if (property && property.values) {
        return property.values;
      } else {
        return [];
      }
    },
    getVariantProps(propertyId) {
      let property = this.categoryProperties.find(prop => prop._id === propertyId);
      if (property) {
        return property;
      } else {
        return {};
      }
    },
    openFileDialog() {
      this.$refs.filesInput.click();
    },
    createImagesPreview() {

      let previews           = this.form.filesPreview;
      this.form.filesPreview = [];
      previews.forEach((filePreview, index) => {
        if (filePreview.uploaded) {
          this.form.filesPreview.push(filePreview);
        }
      });

      this.form.files.forEach((file) => {
        let fileReader = new FileReader();
        fileReader.readAsDataURL(file);
        fileReader.onload = (e) => {
          this.form.filesPreview.push({src: e.target.result});
        };
      });

    },
    addProperty() {
      this.form.properties.push({
        title: '',
        value: ''
      });
    },
    toggleDynamicProperty(id, title) {
      // add property
      if (!this.form.properties.find(p => p._id === id)) {
        this.form.properties.push({
          title: title,
          value: '',
          _id  : id
        });
      } else {
        // remove property
        this.form.properties.splice(
            this.form.properties.indexOf(this.form.properties.find(p => p._id === id)),
            1
        );
      }
    },
    deleteProperty(index) {
      // remove from dynamic properties chip input
      if (this.form.properties[index]._id)
        this.form.dynamicProperties.splice(this.form.dynamicProperties.indexOf(this.form.properties[index]._id), 1);

      this.form.properties.splice(index, 1);
    }
  },
  watch  : {
    selectedCategories(val, oldVal) {
      // remove all variants
      if (oldVal && oldVal[0]) {
        if (val[0] !== oldVal[0]) {
          this.form.variants      = [];
          this.form.variantsProps = [];
        }
      }

      this.getCategoryProperties(val);
    }
  },
  mounted() {
    this.user = useCookie('user').value;
    this.runtimeConfig = useRuntimeConfig();
    if (!this.units.length) this.getUnits();
    if (!this.categories.length) this.getCategories();
    if (!this.brands.length) this.getBrands();
  },
  computed: {
    selectedCategories() {
      return this.form.categories;
    }
  }
}
</script>

<style scoped>

</style>