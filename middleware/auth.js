import {defineNuxtRouteMiddleware, useCookie} from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
    const user = useCookie('user');

    if (to.meta.requiresAuth && !user.value) {
        return navigateTo('/login');
    }

    if (to.meta.requiresRole && to.meta.requiresRole !== user.value.role) {
        return navigateTo('/403');
    }

    // set layout
    to.meta.layout = 'default';
    switch (user.value.role) {
        case 'admin':
            to.meta.layout = 'admin';
            break;
    }

});
