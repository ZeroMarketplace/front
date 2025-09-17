<template>
  <v-card flat class="pa-6 rounded-xl">
    <div class="border-b pb-4 mb-4">
      <div class="d-flex align-center flex-wrap justify-space-between">
        <div class="d-flex align-center ml-4">
          <span class="text-h6 font-weight-bold">{{ product.title }}</span>
        </div>
        <div class="d-flex align-center">
          <span class="ml-1 mt-1 rate-value">4.6</span>
          <v-icon color="#FFAB00">mdi-star</v-icon>
        </div>
      </div>
      <div>
        <div class="d-flex align-center mt-4">
          <v-icon class="text-grey-darken-1">mdi-message-text-outline</v-icon>
          <span class="mr-1 text-grey-darken-1">3 دیدگاه</span>
        </div>
      </div>
    </div>

    <v-row>
      <v-col cols="12" md="6">
        <div class="mb-2">
          <div class="d-flex align-center">
            <v-icon class="text-black">mdi-clipboard-text-outline</v-icon>
            <span class="text-black mr-1 text-lg">مشخصات</span>
          </div>
          <div class="mt-5">
            <ul class="pr-6">
              <li
                class="mb-3"
                v-for="spec in product.properties"
                :key="spec.title"
              >
                <span class="font-weight-bold">{{ spec.title }}:</span>
                <span class="text-grey-darken-1 pr-2">{{ spec.value }}</span>
              </li>
            </ul>
          </div>
        </div>
      </v-col>
      <v-col cols="12" md="6">
        <div>
          <div class="d-flex align-center mb-3">
            <v-icon class="text-black">mdi-tag-outline</v-icon>
            <span class="text-black mr-1 text-lg">ویژگی ها</span>
          </div>
          <div
            class="mb-2 d-flex align-center"
            v-for="prop in variantProperties"
            :key="prop._id || prop.title"
          >
            <span class="font-weight-bold pl-2">{{ prop.title }}:</span>
            <product-detail-productVariantSelector
              :type="getRenderType(prop)"
              :options="prop.values || []"
              :model-value="getSelectedVariantValue(prop)"
              @update:modelValue="onVariantValueChange(prop, $event)"
            />
          </div>
        </div>
      </v-col>
    </v-row>
    <div
      class="d-flex justify-space-between flex-wrap align-center mt-4 p-price-section"
    >
      <div class="d-flex flex-column mt-4 mb-4 mb-md-auto">
        <span
          class="text-grey text-decoration-line-through mr-2"
          v-if="product.oldPrice"
          >{{ product.oldPrice?.toLocaleString() }}</span
        >
        <div v-if="displayPrice">
          <span class="text-h5 font-weight-bold text-pink-lighten-1"
            >{{ displayPrice?.toLocaleString() }} </span
          ><span class="pr-2 text-grey">تومان</span>
        </div>
      </div>
      <template v-if="selectedVariant && selectedVariant.price">
        <v-btn
          size="large"
          color="pink-lighten-1"
          class="rounded-base w-100 w-md-auto"
        >
          <v-icon right>mdi-cart</v-icon>
          <span class="pr-2 font-weight-regular"> افزودن به سبد خرید</span>
        </v-btn>
      </template>
      <template v-else>
        <v-btn
          size="large"
          color="gray"
          disabled
          class="rounded-base w-100 w-md-auto"
        >
          <v-icon right>mdi-alert</v-icon>
          <span class="pr-2 font-weight-regular">در انبار موجود نمی باشد</span>
        </v-btn>
      </template>
    </div>
  </v-card>
  <Teleport to="body">
    <div class="sticky-bottom-bar d-md-none">
      <div class="d-flex justify-space-between align-center w-100">
        <div class="d-flex flex-column mt-4 mb-4 mb-md-auto">
          <span
            class="text-grey text-decoration-line-through mr-2"
            v-if="product.oldPrice"
            >{{ product.oldPrice.toLocaleString() }}</span
          >
          <div class="d-flex align-center" v-if="displayPrice">
            <span class="font-weight-bold text-pink-lighten-1"
              >{{ displayPrice.toLocaleString() }}
            </span>
            <div class="pr-2 text-grey order-first">تومان</div>
          </div>
        </div>
        <v-btn size="large" color="pink-lighten-1 ml-2" class="rounded-base">
          <v-icon>mdi-cart</v-icon>
        </v-btn>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{
  product: any;
  category: any;
}>();
const emit = defineEmits(["update:color"]);
const categoryProperties = ref([]);
const selectedValuesByPropertyId = ref<Record<string, string | number>>({});

const variantProperties = computed(() =>
  (categoryProperties.value || []).filter((p) => p && p.variant)
);

const isHexColorString = (val) => {
  if (!val || typeof val !== "string") return false;
  const s = val.trim();
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(s);
};

const propertyIsColorLike = (prop) => {
  const values = prop?.values || [];
  if (!values.length) return false;
  return values.every((v) => isHexColorString(v?.value));
};

const getRenderType = (prop) => {
  return propertyIsColorLike(prop) ? "color" : "select";
};

const getSelectedVariantValue = (prop) => {
  const key = prop._id || prop.id || prop._property || "";
  if (key && key in selectedValuesByPropertyId.value) {
    return selectedValuesByPropertyId.value[key] as string | number | null;
  }
  return null;
};

const onVariantValueChange = (prop, value) => {
  const key = prop._id || prop.id || prop._property || "";
  if (!key) return;
  selectedValuesByPropertyId.value = {
    ...selectedValuesByPropertyId.value,
    [key]: value,
  };
  if (propertyIsColorLike(prop)) {
    emitUpdateColor(value);
  }
};

const selectedCodesByPropertyId = computed(() => {
  const map = {} as Record<string, number>;
  for (const prop of variantProperties.value) {
    const selectedValue = getSelectedVariantValue(prop);
    if (selectedValue == null) continue;
    const match = (prop.values || []).find((v) => v.value === selectedValue);
    if (!match || match.code == null) continue;
    const key = prop._id || prop.id || prop._property || "";
    if (!key) continue;
    map[key] = Number(match.code);
  }
  return map;
});

const selectedVariant = computed(() => {
  const variants = props.product?.variants || [];
  if (!variants.length) return null;
  const codesByProp = selectedCodesByPropertyId.value;
  const matchesSelection = (variant) => {
    if (!variant?.properties?.length) return false;
    // Only require match for properties that have a selected code
    for (const vp of variant.properties) {
      const key = vp._property;
      if (!(key in codesByProp)) continue; // ignore unselected properties
      const selectedCode = codesByProp[key];
      if (Number(vp.value) !== Number(selectedCode)) return false;
    }
    return true;
  };
  return variants.find(matchesSelection) || null;
});

const displayPrice = computed(() => {
  const v = selectedVariant.value;
  const variantPrice = v?.price?.consumer ?? v?.price?.store;
  return variantPrice ?? props.product?.price ?? null;
});

const selectDefaultVariantFromProduct = () => {
  const variants = props.product?.variants || [];
  if (!variants.length) return;
  const withPrice = variants.find(
    (v) => v?.price && (v.price.consumer || v.price.store)
  );
  const def = withPrice || variants[0];
  if (!def?.properties?.length) return;
  for (const vp of def.properties) {
    const propDetail = (categoryProperties.value || []).find(
      (p) => (p._id || p.id) === vp._property
    );
    if (!propDetail) continue;
    const isColor = propertyIsColorLike(propDetail);
    const opt = (propDetail.values || []).find(
      (o) => Number(o.code) === Number(vp.value)
    );
    if (!opt) continue;
    if (isColor) {
      emitUpdateColor(opt.value);
      const key = propDetail._id || propDetail.id || propDetail._property || "";
      if (key) {
        selectedValuesByPropertyId.value = {
          ...selectedValuesByPropertyId.value,
          [key]: opt.value,
        };
      }
    } else {
      const key = propDetail._id || propDetail.id || propDetail._property || "";
      if (!key) continue;
      selectedValuesByPropertyId.value = {
        ...selectedValuesByPropertyId.value,
        [key]: opt.value,
      };
    }
  }
};

const emitUpdateColor = (val) => emit("update:color", val);

const getCategoryProperties = async () => {
  if (props.category && props.category._properties) {
    const propertiesIds = props.category._properties.join(",");
    try {
      const response = await useApiService.get(
        "properties?perPage=50&ids=" + propertiesIds
      );
      if (response) {
        categoryProperties.value = response.list;
        nextTick(() => selectDefaultVariantFromProduct());
      }
    } catch (error) {
      console.log("Error fetching properties:", error);
    }
  }
};

onMounted(async () => {
  await getCategoryProperties();
});
</script>

<style scoped>
.product-discount-badge {
  background: #ec407a;
  width: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 24px;
  border-radius: 13px;
  text-align: center;
  color: #ffffff;
  font-size: 12px;
  font-weight: 400;
  flex-shrink: 0;
}
.rate-value {
  columns: #424242;
  font-weight: 400;
  font-size: 14px;
}
.p-price-section {
  border-top: 1px dashed rgba(0, 0, 0, 0.2);
}
.sticky-bottom-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100vw;
  background: #fff;
  box-shadow: 0 -2px 16px rgba(0, 0, 0, 0.07);
  padding: 16px 20px 12px 20px;
  z-index: 100;
  border-top-left-radius: 18px;
  border-top-right-radius: 18px;
}
@media (min-width: 960px) {
  .sticky-bottom-bar {
    display: none !important;
  }
}
</style>
