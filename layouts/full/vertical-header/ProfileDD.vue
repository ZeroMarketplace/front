<script setup lang="ts">
import { IconCircleX as CircleXIcon, IconMail as MailIcon } from '@tabler/icons-vue';
import { profileDD } from '@/_mockApis/headerData';
import { useAuthStore } from '@/stores/auth';
import { Icon } from '@iconify/vue';
import { computed } from 'vue';

const authStore = useAuthStore();
const user = useCookie('user');

const userName = computed(() => {
    if (user.value && user.value.username) {
        return user.value.username;
    } else if (user.value && user.value.phone) {
        return user.value.phone;
    }
    return 'کاربر';
});

const userRole = computed(() => {
    if (user.value && user.value.role) {
        return user.value.role === 'admin' ? 'مدیر' : 'کاربر';
    }
    return 'کاربر';
});
</script>

<template>
    <!-- ---------------------------------------------- -->
    <!-- notifications DD -->
    <!-- ---------------------------------------------- -->
    <v-menu :close-on-content-click="true" class="profile_popup">
        <template v-slot:activator="{ props }">
            <div class=" text-left px-4 cursor-pointer" variant="text" v-bind="props">
                <div class="d-flex align-center">
                    <v-avatar size="50">
                        <img src="@/assets/images/profile/user6.jpg" width="50" :alt="userName" />
                    </v-avatar>
                    <div class="ml-md-4 d-md-block d-none">
                        <h6 class="text-body-2 d-flex align-center text-black font-weight-semibold">{{ userName }}</h6>
                        <span class="text-subtitle-2 font-weight-medium text-grey100">{{ userRole }}</span>
                    </div>
                </div>
            </div>
        </template>
    </v-menu>
</template>
