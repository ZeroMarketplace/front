<template>
  <v-card class="spike-card" elevation="10">
    <v-card-item>
      <h5 class="text-20 mb-7">ویرایش تسویه</h5>
      <p class="text-14 text-muted mb-4">
        برای ویرایش تسویه کامل، از کامپوننت موجود استفاده کنید
      </p>
      <div class="text-center py-10">
        <v-btn color="primary" size="large" rounded="pill" to="/settlements"
          >بازگشت به لیست</v-btn
        >
      </div>
    </v-card-item>
  </v-card>
</template>
<script setup>
definePageMeta({
  layout: "admin-spike",
  middleware: "auth",
  requiresAuth: true,
  requiresRole: "admin",
});
</script>
