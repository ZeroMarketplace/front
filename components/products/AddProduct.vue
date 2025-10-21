<template>
  <v-form :readonly="loading" @submit.prevent="submit" ref="addProductForm" validate-on="submit lazy">
    <!--    Information     -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-information-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">مشخصات کلی</v-label>
    <v-row class="px-7 pt-5">
      <!--      Name      -->
      <v-col class="mt-md-0" cols="12" md="4">
        <v-text-field
          class="mt-3"
          v-model="form.name"
          label="نام کالا"
          placeholder="وارد کنید"
          :readonly="loading"
          :rules="[rules.required]"
          density="compact"
          variant="outlined"
        >
        </v-text-field>
      </v-col>

      <!--      Category      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <CategoryInput
          class="mt-3"
          v-model="form._categories"
          :rules="[rules.requiredMultipleSelect]"
          :readonly="loading"
          multiple
          chips
        />
      </v-col>

      <!--      Brand      -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="4">
        <BrandInput
          class="mt-3"
          v-model="form._brand"
          :rules="[rules.requiredSelect]"
          :readonly="loading"
        />
      </v-col>

      <!--      Unit      -->
      <v-col class="mt-n5 mt-md-n2" cols="12" md="4">
        <UnitInput
          class=""
          v-model="form._unit"
          :rules="[rules.requiredSelect]"
          :readonly="loading"
        />
      </v-col>

      <!--      Barcode      -->
      <v-col class="mt-n5 mt-md-n5" cols="12" md="4">
        <v-text-field
          class="mt-3"
          v-model="form.barcode"
          label="بارکد"
          placeholder="وارد کنید"
          :readonly="loading"
          :rules="[rules.required]"
          density="compact"
          variant="outlined"
        >
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
        <v-text-field
          class="mt-3"
          v-model="form.iranCode"
          label="ایران کد"
          placeholder="وارد کنید"
          :readonly="loading"
          density="compact"
          variant="outlined"
        >
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
        <v-file-input
          v-model="form.files"
          :rules="[filesIsValid]"
          validate-on="input"
          type="file"
          class="d-none"
          ref="filesInput"
          accept="image/*"
          multiple
        >
        </v-file-input>

        <v-card
          class="border border-dashed border-opacity-100 h-100 w-100"
          :class="form.filesError ? 'bg-red' : ''"
          @click="openFileDialog"
          variant="plain"
          link
        >
          <v-card-text>
            <v-row class="d-flex justify-center py-8">
              <v-icon class="w-100 my-2" size="90" color="grey-lighten-2"
                >mdi-image</v-icon
              >
              افزودن تصویر
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>

      <!--   Previews    -->
      <v-col
        v-for="(filePreview, index) in form.filesPreview"
        class=""
        cols="12"
        md="3"
      >
        <v-img :src="filePreview.src" class="w-100 h-100">
          <v-btn
            v-if="filePreview.uploaded"
            class="mt-2 mr-2 border border-opacity-100"
            size="25"
            variant="elevated"
            @click="deleteFile(filePreview.name, index)"
            icon
          >
            <v-icon color="red">mdi-delete</v-icon>
          </v-btn>
        </v-img>
      </v-col>
    </v-row>

    <!-- Physical properties   -->
    <v-row class="mx-4">
      <!--   weight    -->
      <v-col cols="12" md="3">
        <v-text-field
          class="mt-3"
          type="number"
          v-model="form.weight"
          label="وزن"
          placeholder="وارد کنید"
          :readonly="loading"
          density="compact"
          variant="outlined"
        >
          <template v-slot:append-inner>
            <v-label class="text-grey-darken-4 text-subtitle-2">گرم</v-label>
          </template>
        </v-text-field>
      </v-col>

      <!--   Dimensions    -->
      <v-col class="mt-n5 mt-md-0" cols="12" md="3">
        <v-row
          class="border border-opacity-50 rounded overflow-hidden px-3 mt-3"
          no-gutters
        >
          <v-label class="position-absolute bg-white text-subtitle-2 mt-n3 px-3"
            >ابعاد</v-label
          >

          <v-col cols="3">
            <v-text-field
              class="mt-n3 mx-2 centeredText"
              placeholder="طول"
              v-model="form.dimensions.length"
              type="number"
              variant="underlined"
              hide-details
            >
            </v-text-field>
          </v-col>

          <v-col class="pt-3 text-center" cols="2"> * </v-col>

          <v-col cols="3">
            <v-text-field
              class="mt-n3 mx-2 centeredText"
              placeholder="عرض"
              v-model="form.dimensions.width"
              type="number"
              variant="underlined"
              hide-details
            >
            </v-text-field>
          </v-col>

          <v-col class="text-caption text-grey-darken-1 pt-3 text-end" cols="4">
            سانتی متر
          </v-col>
        </v-row>
      </v-col>

      <!--   Tags    -->
      <v-col cols="12" md="6">
        <v-text-field
          class="mt-3"
          v-model="form.tags"
          label="برچسب‌ها"
          placeholder="با عبارت - از هم جدا کنید"
          :readonly="loading"
          density="compact"
          variant="outlined"
        >
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
      <v-chip-group
        v-model="form.variantsValues"
        class="overflow-hidden"
        column
        multiple
      >
        <v-row
          v-for="property in categoryProperties.filter(
            (p) => p.variant === true
          )"
          class="mt-2"
        >
          <!--    Title    -->
          <v-col class="" cols="12" md="2">
            <v-label class="mx-2">{{ property.title }}</v-label>
          </v-col>

          <!--    Values    -->
          <v-col cols="12" md="10" class="pt-0">
            <v-chip
              v-for="value in property.values"
              :key="value.code"
              :value="value.code"
              class="mx-2"
              variant="outlined"
              @click="togglePropertyVariant(property._id, value.code)"
              filter
            >
              <template v-slot:prepend>
                <!--       Color         -->
                <v-icon
                  class="mx-1"
                  v-if="/^#([0-9A-F]{3}){1,2}$/i.test(value.value)"
                  :color="value.value"
                >
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
            <th
              v-for="props in form.variantsProps"
              class="text-center font-weight-bold"
            >
              {{ getProperty(props._id).title }}
            </th>
            <th class="text-center">
              <v-icon>mdi-cog</v-icon>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(variant, index) in form.variants"
            class="w-100 pa-1 text-center"
          >
            <!--     Properties     -->
            <td v-for="props in form.variantsProps" class="flex-grow-1">
              <v-label v-for="property in variant.properties">
                <span v-if="props._id === property._property">
                  {{
                    getPropertyValue(property._property, property.value).title
                  }}
                </span>
              </v-label>
            </td>

            <!--   Actions     -->
            <td class="text-center w-25">
              <!--  Delete Property   -->
              <v-btn
                class="border"
                :loading="variant.deleteLoading"
                size="30"
                variant="outlined"
                color="pink"
                @click="deleteVariant(index)"
                icon
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>

      <!--   Empty    -->
      <div
        v-if="!form.variants.length"
        class="d-flex justify-center w-100 my-12"
      >
        <v-label>تنوع ندارد</v-label>
      </div>
    </div>

    <v-divider class="my-5"></v-divider>

    <!--  Properties   -->
    <v-icon class="mt-1 mr-2" color="grey">mdi-clipboard-text-outline</v-icon>
    <v-label class="text-black font-weight-bold mx-3">ویژگی‌ها</v-label>

    <!--  Add Property   -->
    <v-btn
      class="border"
      @click="addProperty"
      size="30"
      variant="outlined"
      color="pink"
      icon
    >
      <v-icon>mdi-plus</v-icon>
    </v-btn>

    <!--  Add Dynamic Properties  -->
    <v-row
      class="mt-5 pb-5 mx-4 d-flex justify-center"
      v-if="categoryProperties.filter((p) => !p.variant).length"
    >
      <v-chip-group
        v-model="form.dynamicProperties"
        class="overflow-hidden"
        column
        multiple
      >
        <v-chip
          v-for="value in categoryProperties.filter((p) => !p.variant)"
          :key="value._id"
          :value="value._id"
          class="mx-2"
          variant="outlined"
          @click="toggleDynamicProperty(value._id, value.title)"
          filter
        >
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
              <v-text-field
                class=""
                v-model="property.title"
                label="عنوان"
                placeholder="وارد کنید"
                :readonly="loading || property._id"
                :rules="[rules.required]"
                density="compact"
                variant="outlined"
                hide-details
              >
              </v-text-field>
            </td>

            <!--      Value      -->
            <td>
              <v-text-field
                v-if="
                  !property._id ||
                  (property._id && !getPropertyValues(property._id).length)
                "
                class=""
                v-model="property.value"
                label="مقدار"
                placeholder="وارد کنید"
                :readonly="loading"
                :rules="[rules.required]"
                density="compact"
                variant="outlined"
                hide-details
              >
              </v-text-field>

              <v-autocomplete
                v-if="property._id && getPropertyValues(property._id).length"
                class=""
                v-model="property.value"
                label="مقدار"
                :readonly="loading"
                :rules="[rules.requiredSelect]"
                :items="getPropertyValues(property._id)"
                item-title="title"
                item-value="code"
                density="compact"
                variant="outlined"
                hide-details
              >
              </v-autocomplete>
            </td>

            <!--    Actions      -->
            <td class="text-center">
              <!--  Delete Property   -->
              <v-btn
                class="border"
                @click="deleteProperty(index)"
                size="30"
                variant="outlined"
                color="pink"
                icon
              >
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
        <v-text-field
          class="mt-3"
          v-model="form.title"
          label="عنوان کالا"
          placeholder="وارد کنید"
          :readonly="loading"
          :rules="[rules.required]"
          density="compact"
          variant="outlined"
        >
        </v-text-field>
      </v-col>

      <!--   Content    -->
      <v-col class="mt-n8 mt-n5" cols="12" md="12">
        <v-textarea
          class="mt-3"
          v-model="form.content"
          label="توضیحات"
          placeholder="وارد کنید"
          :readonly="loading"
          density="compact"
          variant="outlined"
        >
        </v-textarea>
      </v-col>
    </v-row>

    <!--     Actions       -->
    <v-row class="mt-10 mx-1">
      <v-col cols="12">
        <!--       Submit       -->
        <v-btn
          class="border rounded-lg"
          :loading="loading"
          prepend-icon="mdi-check-circle-outline"
          height="40"
          width="100"
          variant="text"
          type="submit"
          density="compact"
        >
          ثبت
        </v-btn>

        <!--       Reset       -->
        <v-btn
          class="border mx-2 rounded-lg"
          color="pink"
          prepend-icon="mdi-delete-outline"
          height="40"
          width="100"
          variant="text"
          @click="reset"
          density="compact"
        >
          بازنگری
        </v-btn>

        <!--    Upload progress    -->
        <v-label v-if="showUploadProgress" class="text-pink mx-5">
          در حال بارگذاری ...
          {{ "%" + uploadProgress }}
        </v-label>
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { ref, watch, nextTick } from "vue";
import { useNuxtApp, useRuntimeConfig } from "#app";
import CategoryInput from "~/components/categories/CategoryInput.vue";
import BrandInput from "~/components/brands/BrandInput.vue";
import UnitInput from "~/components/units/UnitInput.vue";
import { rules } from "~/utils/validationRules";

// Reactive variables using ref
const { $notify, $axios } = useNuxtApp();
const runTimeConfig = useRuntimeConfig();
const action = ref("add");
const loading = ref(false);
const uploadProgress = ref(0);
const showUploadProgress = ref(false);
const addProductForm = ref(null);
const filesInput = ref(null);
const emit = defineEmits(["exit", "refresh"]);

const form = ref({
  name: "",
  _categories: [],
  _brand: undefined,
  _unit: undefined,
  barcode: "",
  iranCode: "",
  variants: [],
  variantsProps: [],
  variantsValues: [],
  lastVariants: [],
  files: [],
  filesPreview: [],
  filesError: false,
  weight: "",
  dimensions: {
    length: "",
    width: "",
  },
  tags: "",
  properties: [],
  dynamicProperties: [],
  title: "",
  content: "",
});

// init for first category information
const category = ref({});
const categoryProperties = ref([]);

// Methods
const filesIsValid = (value) => {
  let valid = true;
  value.forEach((file) => {
    const allowedExtensions = /(\.jpg|\.jpeg|\.png|\.gif)$/i;

    if (!allowedExtensions.exec(file.name)) {
      $notify("فرمت فایل انتخابی قابل قبول نیست", "error");
      valid = false;
      return false;
    }

    if ((file.size / 1024 / 1024).toFixed(2) > 4.7) {
      $notify("اندازه فایل بیش از حد مجاز است", "error");
      valid = false;
      return false;
    }
  });

  if (valid) {
    createImagesPreview();
    form.value.filesError = false;
  } else {
    form.value.filesPreview = [];
    form.value.filesError = true;
  }
  return valid;
};

const reset = () => {
  form.value = {
    name: "",
    _categories: [],
    _brand: undefined,
    _unit: undefined,
    barcode: "",
    iranCode: "",
    variants: [],
    variantsProps: [],
    variantsValues: [],
    lastVariants: [],
    files: [],
    filesPreview: [],
    filesError: false,
    weight: "",
    dimensions: {
      length: "",
      width: "",
    },
    tags: "",
    properties: [],
    dynamicProperties: [],
    title: "",
    content: "",
  };
  categoryProperties.value = [];
  action.value = "add";
  loading.value = false;
};

const add = async () => {
  try {
    const data = await useApiService.post("products", {
      name: form.value.name,
      _categories: form.value._categories,
      _brand: form.value._brand,
      _unit: form.value._unit,
      barcode: form.value.barcode,
      iranCode: form.value.iranCode,
      variants: form.value.variants,
      weight: Number(form.value.weight),
      dimensions: form.value.dimensions,
      tags: form.value.tags,
      properties: form.value.properties,
      title: form.value.title,
      content: form.value.content,
    });
    if (data) {
      if (form.value.files.length) {
        $notify("عملیات با موفقت انجام شد", "success");
        $notify("در حال بارگذاری فایل‌ها...", "warning");
        await uploadFiles(data._id);
      } else {
        reset();
        emit("exit");
        emit("refresh");
        $notify("عملیات با موفقت انجام شد", "success");
      }
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const edit = async () => {
  try {
    const data = await useApiService.put("products/" + form.value._id, {
      name: form.value.name,
      _categories: form.value._categories,
      _brand: form.value._brand,
      _unit: form.value._unit,
      barcode: form.value.barcode,
      iranCode: form.value.iranCode,
      variants: form.value.variants,
      weight: Number(form.value.weight),
      dimensions: form.value.dimensions,
      tags: form.value.tags,
      properties: form.value.properties,
      title: form.value.title,
      content: form.value.content,
    });
    if (data) {
      if (form.value.files.length) {
        $notify("عملیات با موفقت انجام شد", "success");
        $notify("در حال بارگذاری فایل‌ها...", "warning");
        await uploadFiles(form.value._id);
      } else {
        $notify("عملیات با موفقت انجام شد", "success");
        reset();
        emit("exit");
        emit("refresh");
      }
    }
  } catch (error) {
    $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
  }
};

const submit = async () => {
  addProductForm.value?.validate();
  if (addProductForm.value?.isValid) {
    loading.value = true;
    if (action.value === "add") {
      await add();
    } else if (action.value === "edit") {
      await edit();
    }
    loading.value = false;
  }
};

const uploadFiles = async (_id) => {
  const filesForm = new FormData();
  form.value.files.forEach((file) => filesForm.append("files", file));

  // enable upload progress show
  showUploadProgress.value = true;

  // upload with axios
  const response = await $axios.post("products/" + _id + "/files", filesForm, {
    onUploadProgress: (progressEvent) => {
      // fill upload progress
      uploadProgress.value = Math.round(
        (progressEvent.loaded / progressEvent.total) * 100
      );
    },
  });
  // disable upload progress show
  showUploadProgress.value = false;

  if (response.status === 200) {
    $notify("بارگذاری فایل‌ها با موفقت انجام شد", "success");
    reset();
    emit("exit");
    emit("refresh");
  } else {
    $notify(
      "مشکلی در بارگذاری فایل‌ها پیش آمد؛ لطفا دوباره تلاش کنید",
      "error"
    );
  }
};

const deleteFile = async (fileName, index) => {
  if (confirm("آیا مطمئن هستید؟")) {
    try {
      const data = await useApiService.remove(
        `products/${form.value._id}/files${fileName}`
      );
      if (data) {
        form.value.filesPreview.splice(index, 1);
        $notify("عملیات با موفقت انجام شد", "success");
      }
    } catch (error) {
      $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
    }
  }
};

const setEdit = async (data) => {
  // get product data
  try {
    const response = await useApiService.get("products/" + data._id);
    if (response) {
      reset();
      action.value = "edit";

      // set the data of product into form
      form.value._categories = response._categories;
      form.value.name = response.name;
      form.value.properties = response.properties;
      form.value._brand = response._brand;
      form.value._unit = response._unit;
      form.value.barcode = response.barcode;
      form.value.iranCode = response.iranCode;
      form.value.variants = response.variants;
      form.value.lastVariants = response.variants;
      form.value.weight = response.weight;
      form.value.dimensions = response.dimensions;
      form.value.tags = response.tags;
      form.value.title = response.title;
      form.value.content = response.content;
      form.value._id = response._id;

      // get category properties
      await getCategoryProperties(data._categories);

      // set files
      if (response.files) {
        const newFiles = response.files.map((fileName) => ({
          uploaded: true,
          name: fileName,
          src: runTimeConfig.public.STATICS_URL + fileName,
        }));

        form.value.filesPreview = [...form.value.filesPreview, ...newFiles];
      }

      // set variants props
      response.variants.forEach((variant) => {
        // set delete Loading field
        variant.deleteLoading = false;

        variant.properties.forEach((property) => {
          let variantProp = form.value.variantsProps.find(
            (prop) => prop._id === property._property
          );
          if (variantProp) {
            if (!variantProp.values.includes(property.value))
              variantProp.values.push(property.value);
          } else {
            form.value.variantsProps.push({
              _id: property._property,
              values: [property.value],
            });
          }

          // add to variants values
          if (!form.value.variantsValues.includes(property.value))
            form.value.variantsValues.push(property.value);
        });
      });

      // set dynamic properties
      response.properties.forEach((property) => {
        if (property._id) {
          form.value.dynamicProperties.push(property._id);
        }
      });
    }
  } catch (error) {
    console.log("Error fetching product:", error);
  }
};

const setCopy = async (data) => {
  await setEdit(data);
  await nextTick(() => {
    action.value = "add";
    form.value._id = "";
    form.value.files = [];
    form.value.filesPreview = [];
    form.value.filesError = false;
  });
};

const getCategory = async () => {
  let categoryId = form.value._categories[0];
  if (categoryId) {
    try {
      const response = await useApiService.get("categories/" + categoryId);
      if (response) {
        // set the category detail
        category.value = response;
        nextTick(async () => {
          await getCategoryProperties();
        });
      }
    } catch (error) {
      console.log("Error fetching category:", error);
    }
  } else {
    return false;
  }
};

const getCategoryProperties = async (val) => {
  if (category.value && category.value._properties) {
    const propertiesIds = category.value._properties.join(",");
    try {
      const response = await useApiService.get(
        "properties?perPage=50&ids=" + propertiesIds
      );
      if (response) {
        // set category properties list
        categoryProperties.value = response.list;
      }
    } catch (error) {
      console.log("Error fetching properties:", error);
    }
  }
};

const checkVariantExists = (variantInput) => {
  form.value.variants.forEach((variant) => {
    if (
      JSON.stringify(variant.properties) ===
      JSON.stringify(variantInput.properties)
    ) {
      return true;
    }
  });
  return false;
};

const createPropertyVariants = (variant, propsChecked) => {
  // every other properties
  form.value.variantsProps.forEach((variantProp) => {
    if (!propsChecked.includes(variantProp._id)) {
      // add to checked
      propsChecked.push(variantProp._id);

      // every value of other properties
      variantProp.values.forEach((propValue) => {
        // create the value sample
        let propertyObject = { _property: variantProp._id, value: propValue };

        // add the value sample
        variant.properties.push(propertyObject);

        // check if not exists
        if (!checkVariantExists(variant)) {
          // add to variants
          form.value.variants.push(structuredClone(variant));
        }

        // create variants of this value
        createPropertyVariants(
          structuredClone(variant),
          structuredClone(propsChecked)
        );

        variant.properties.splice(
          variant.properties.indexOf(propertyObject),
          1
        );
      });
    }
  });

  return true;
};

const togglePropertyVariant = (_property, valueCode) => {
  // create property array
  let variantProp = form.value.variantsProps.find(
    (prop) => prop._id === _property
  );
  if (!variantProp) {
    form.value.variantsProps.push({ _id: _property, values: [] });
    variantProp = form.value.variantsProps.find(
      (prop) => prop._id === _property
    );
  }

  // toggle value
  if (variantProp.values.includes(valueCode)) {
    variantProp.values.splice(variantProp.values.indexOf(valueCode), 1);
  } else {
    variantProp.values.push(valueCode);
  }

  // refresh variants list
  reCreateVariants();
};

const reCreateVariants = () => {
  // remove if is not selected value
  form.value.variantsProps.forEach((prop, index) => {
    if (!prop.values.length) {
      form.value.variantsProps.splice(index, 1);
    }
  });

  // reCreate variants
  // every property
  if (form.value.variantsProps.length) {
    // get the first property
    let variantProp = form.value.variantsProps[0];

    form.value.variants = [];

    // every value of property
    variantProp.values.forEach((propValue) => {
      // create base variant
      let variant = { properties: [], deleteLoading: false };

      // add base prop value
      variant.properties.push({ _property: variantProp._id, value: propValue });

      // check exists other properties
      if (form.value.variantsProps.length > 1) {
        createPropertyVariants(structuredClone(variant), [variantProp._id]);
      } else {
        if (!checkVariantExists(variant)) {
          form.value.variants.push(variant);
        }
      }
    });
  } else {
    form.value.variants = [];
  }

  // set last variants code's
  if (action.value === "edit") {
    form.value.variants.forEach((variant) => {
      form.value.lastVariants.forEach((lVariant) => {
        if (
          JSON.stringify(variant.properties) ===
          JSON.stringify(lVariant.properties)
        ) {
          variant.code = lVariant.code;
          variant._id = lVariant._id;
        }
      });
    });
  }
};

const deleteVariant = async (index) => {
  if (confirm("آیا مطمئن هستید؟")) {
    if (form.value.variants[index]._id) {
      form.value.variants[index].deleteLoading = true;

      // request to delete variant
      try {
        const data = await useApiService.remove(
          `products/${form.value._id}/variants/${form.value.variants[index]._id}`
        );
        if (data) {
          // remove item from files preview
          form.value.variants.splice(index, 1);

          $notify("عملیات با موفقت انجام شد", "success");
        }
      } catch (error) {
        const status = error?.response?.status;
        if (status === 400) {
          $notify(
            "این تنوع در فاکتور خریدی استفاده شده است و قابل حذف نیست",
            "error"
          );
        } else {
          // show error
          $notify("مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید", "error");
        }
      }

      this.form.variants[index].deleteLoading = false;
    } else {
      this.form.variants.splice(index, 1);
    }
  }
};

const getPropertyValue = (_property, valueCode) => {
  let property = categoryProperties.value.find(
    (prop) => prop._id === _property
  );
  if (property) {
    return property.values.find((value) => value.code === valueCode);
  } else {
    return {};
  }
};

const getPropertyValues = (_property) => {
  let property = categoryProperties.value.find(
    (prop) => prop._id === _property
  );
  if (property && property.values) {
    return property.values;
  } else {
    return [];
  }
};

const getProperty = (_id) => {
  let property = categoryProperties.value.find((prop) => prop._id === _id);
  if (property) {
    return property;
  } else {
    return {
      title: "",
    };
  }
};

const openFileDialog = () => {
  filesInput.value?.click();
};

const addProperty = () => {
  form.value.properties.push({
    title: "",
    value: "",
  });
};

const toggleDynamicProperty = (_id, title) => {
  // add property
  if (!form.value.properties.find((p) => p._id === _id)) {
    form.value.properties.push({
      title: title,
      value: "",
      _id: _id,
    });
  } else {
    // remove property
    form.value.properties.splice(
      form.value.properties.indexOf(
        form.value.properties.find((p) => p._id === _id)
      ),
      1
    );
  }
};

const deleteProperty = (index) => {
  // remove from dynamic properties chip input
  if (form.value.properties[index]._id)
    form.value.dynamicProperties.splice(
      form.value.dynamicProperties.indexOf(form.value.properties[index]._id),
      1
    );

  form.value.properties.splice(index, 1);
};

const createImagesPreview = () => {
  let previews = form.value.filesPreview;
  form.value.filesPreview = [];
  // delete the candidate for upload
  previews.forEach((filePreview, index) => {
    if (filePreview.uploaded) {
      form.value.filesPreview.push(filePreview);
    }
  });

  // add new file to preview (candidate for upload)
  form.value.files.forEach((file) => {
    let fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = (e) => {
      form.value.filesPreview.push({ src: e.target.result });
    };
  });
};

// Watchers
watch(
  () => form.value._categories,
  async (val, oldVal) => {
    if (oldVal && oldVal[0] && val[0] !== oldVal[0]) {
      form.value.variants = [];
      form.value.variantsProps = [];
    }
    await getCategory();
  }
);

// Lifecycle hooks
onMounted(() => {});

// Expose
defineExpose({
  action,
  setEdit,
  setCopy,
});
</script>

<style scoped></style>
