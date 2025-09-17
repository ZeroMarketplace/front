<template>
  <v-container fluid>
    <template v-if="pending">
      <v-row>
        <v-col cols="12">
          <v-skeleton-loader type="text" class="mb-4" />
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" md="8">
          <v-skeleton-loader type="image, article, actions" />
        </v-col>
        <v-col cols="12" md="4" class="product-gallery__column">
          <v-skeleton-loader type="image@3" />
        </v-col>
      </v-row>
      <v-row class="mt-8">
        <v-col cols="12">
          <v-skeleton-loader type="heading, paragraph@2" />
        </v-col>
      </v-row>
      <v-row class="mt-8">
        <v-col cols="12">
          <v-skeleton-loader type="card@3" />
        </v-col>
      </v-row>
    </template>

    <template v-else>
      <div>
        <Breadcrumbs :items="breadcrumbs" />
      </div>

      <v-row>
        <v-col cols="12" md="8">
          <template v-if="hasProduct">
            <product-detail-section
              :product="product"
              :category="category"
              @update:color="selectedColor = $event"
            />
          </template>
          <template v-else>
            <v-skeleton-loader type="image, article, actions" />
          </template>
        </v-col>
        <v-col cols="12" md="4" class="product-gallery__column">
          <template v-if="hasFiles">
            <product-detail-product-gallery-section
              :images="product.files"
              :selectedImage="selectedImage"
              @select-image="selectedImage = $event"
            />
          </template>
          <template v-else>
            <v-skeleton-loader type="image@3" />
          </template>
        </v-col>
      </v-row>

      <!-- Tabs Section -->
      <v-row class="mt-8">
        <v-col cols="12">
          <template v-if="hasProduct">
            <product-detail-product-tabs v-model="tab" :product="product" />
          </template>
          <template v-else>
            <v-skeleton-loader type="heading, paragraph@2" />
          </template>
        </v-col>
      </v-row>

      <v-row class="mt-8">
        <v-col cols="12">
          <product-detail-similar-products />
        </v-col>
      </v-row>
    </template>
  </v-container>
</template>

<script setup lang="ts">
const breadcrumbs = computed(() => {
  return [
    { title: "خانه", disabled: false, href: "/" },
    { title: category.value.title, disabled: false, href: "/" },
    {
      title: product.value.title,
      disabled: true,
      href: "/",
    },
  ];
});

const staticsUrl = ref("");
const runtimeConfig = useRuntimeConfig();
const selectedImage = ref();
const product = ref<any>({});
const selectedColor = ref<string | null>(null);
const selectedSize = ref<string | null>(null);
const route = useRoute();
const tab = ref("desc");
const category = ref<any>({});
const { data, pending } = await useAsyncData(
  `product-${route.params.id}`,
  () => useApiService.get("products/" + route.params.id),
  { default: () => [] }
);

if (data.value) {
  product.value = data.value;
  if (product.value?.files?.length) {
    selectedImage.value = product.value.files[0];
  }
}

const { data: categoryData, pending: categoryPending } = await useAsyncData(
  `category-${route.params.id}`,
  async () => {
    const categoryId = product.value?._categories?.[0];
    if (!categoryId) return null;
    try {
      return await useApiService.get("categories/" + categoryId);
    } catch (error) {
      console.log("Error fetching category:", error);
      return null;
    }
  },
  { default: () => null, server: true }
);

if (categoryData.value) {
  category.value = categoryData.value;
}

const hasProduct = computed(
  () => !!product.value && Object.keys(product.value).length > 0
);
const hasFiles = computed(
  () => Array.isArray(product.value?.files) && product.value.files.length > 0
);

// --- SEO: Head Meta (SSR-friendly) ---
const stripHtml = (html: string | undefined | null): string => {
  if (!html) return "";
  return html
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?>[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const url = useRequestURL();
const pageUrl = computed(() =>
  new URL(route.fullPath as string, url.origin).toString()
);
const ogImage = computed(
  () => runtimeConfig.public.STATICS_URL + product.value.files[0]
);
const metaTitle = computed(() => {
  return (
    (product.value && (product.value.seoTitle || product.value.title)) ||
    (category.value && category.value.title) ||
    "محصول"
  );
});
const metaDescription = computed(() => {
  const base = stripHtml(
    (product.value &&
      (product.value.seoDescription || product.value.description)) ||
      ""
  );
  return base.length > 160 ? base.slice(0, 157) + "..." : base;
});

const jsonLd = computed(() => {
  const images = hasFiles.value ? product.value.files : [ogImage.value];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: metaTitle.value,
    description: metaDescription.value,
    image: images,
    sku: product.value?.sku || String(route.params.id || ""),
    category: category.value?.title || undefined,
    url: pageUrl.value,
  };
});
useHead(() => ({
  title: metaTitle.value,
  meta: [
    { name: "description", content: metaDescription.value },
    { property: "og:type", content: "product" },
    { property: "og:title", content: metaTitle.value },
    { property: "og:description", content: metaDescription.value },
    { property: "og:url", content: pageUrl.value },
    { property: "og:image", content: ogImage.value },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: metaTitle.value },
    { name: "twitter:description", content: metaDescription.value },
    { name: "twitter:image", content: ogImage.value },
  ],
  link: [{ rel: "canonical", href: pageUrl.value }],
  script: [
    {
      type: "application/ld+json",
      innerHTML: JSON.stringify(jsonLd.value),
    },
  ],
  __dangerouslyDisableSanitizersByTagID: {},
}));

onBeforeMount(() => {
  staticsUrl.value = runtimeConfig.public.STATICS_URL;
});

onMounted(() => {});
</script>

<style scoped>
.product-tabs {
  background: #fff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.04);
  min-height: 56px;
}
.tab-title {
  font-size: 1.1rem;
  color: #222;
  min-width: 120px;
  letter-spacing: 0.5px;
}
.tab-title .v-icon {
  margin-left: 6px;
}
.tab-title.font-weight-bold {
  font-weight: bold;
}
.product-gallery__column {
  order: -1;
}

@media (min-width: 960px) {
  .product-gallery__column {
    order: 2;
  }
}
</style>
