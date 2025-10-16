<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const user = useCookie<any>('user');
const displayName = ref('کاربر');
const displayRole = ref('کاربر');

const updateUserInfo = async () => {
    // Try cookie first
    if (user.value && typeof user.value === 'object') {
        if (user.value.username) {
            displayName.value = user.value.username;
        } else if (user.value.phone) {
            displayName.value = user.value.phone;
        }
        
        if (user.value.role) {
            displayRole.value = user.value.role === 'admin' ? 'مدیر' : 'کاربر';
        }
    }
    
    // Try localStorage as fallback
    if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                if (userData.username) {
                    displayName.value = userData.username;
                } else if (userData.phone) {
                    displayName.value = userData.phone;
                }
                if (userData.role) {
                    displayRole.value = userData.role === 'admin' ? 'مدیر' : 'کاربر';
                }
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }
    
    // If still no data, try to fetch from API
    if (displayName.value === 'کاربر' && user.value?.token) {
        try {
            const config = useRuntimeConfig();
            const response = await fetch(`${config.public.API_BASE_URL}auth/me`, {
                headers: {
                    'Authorization': `Bearer ${user.value.token}`
                }
            });
            
            if (response.ok) {
                const userData = await response.json();
                if (userData.username) {
                    displayName.value = userData.username;
                } else if (userData.phone) {
                    displayName.value = userData.phone;
                }
                
                // Update cookie with new data
                user.value = {
                    ...user.value,
                    username: userData.username,
                    phone: userData.phone
                };
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }
};

onMounted(() => {
    updateUserInfo();
});

const logout = async () => {
    const userCookie = useCookie('user');
    const token = useCookie('token');
    
    userCookie.value = null;
    token.value = null;
    
    if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
    }
    
    // Force a full page reload to clear all state
    await navigateTo('/login', { external: true });
};
</script>

<template>
    <v-sheet rounded="md" color="lightprimary" class="pa-4  ExtraBox hide-menu">
        <div class="d-flex align-center justify-space-between">
            <v-avatar size="50">
                <img src="@/assets/images/profile/user6.jpg" width="50" :alt="displayName" />
            </v-avatar>
            <div>
                <h6 class="text-body-2 d-flex align-center font-weight-semibold">{{ displayName }}</h6>
                <span class="text-subtitle-2 font-weight-medium text-grey100">{{ displayRole }}</span>
            </div>
            <div>
                <v-btn icon class="bg-lightprimary" flat size="small" @click="logout">
                    <Icon icon="solar:logout-linear" class="text-primary" stroke-width="3" height="24" width="24" />
                </v-btn>
            </div>
        </div>
    </v-sheet>
</template>
<style lang="scss">
.ExtraBox {
    position: relative;
}

.line-height-none {
    line-height: normal;
}
</style>
