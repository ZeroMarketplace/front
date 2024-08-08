import {defineNuxtRouteMiddleware, useCookie} from "#app";

export default defineNuxtRouteMiddleware((to, from) => {
    const user  = useCookie('user');

    if (to.meta.requiresAuth && !user.value) {
        return navigateTo('/login');
    }

    if (to.meta.requiresRole && to.meta.requiresRole !== user.value.role) {
        return navigateTo('/403');
    }

});
