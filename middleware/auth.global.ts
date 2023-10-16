import {useCookie, useFetch} from "#app";

const pagesPermissions = {
    admin: [
        'index',
        'accounts',
        'admin-dashboard',
        'brands',
        'categories',
        'products',
        'properties',
        'purchase-invoices',
        'units',
        'warehouses',
    ],

    user: [
        'index',
        'dashboard',
    ],

    guest: [
        'index'
    ]
};

export default defineNuxtRouteMiddleware(async (to, from) => {

    const user = useCookie('user');
    // set not authenticated
    if (!user.value) {
        user.value = {};
        user.value.token = null;
        user.value.authenticated = false;
        user.value.role = 'guest';
    }

    // if token doesn't exist redirect to log in
    // @ts-ignore
    if (!user.value.authenticated) {
        // @ts-ignore
        if (!pagesPermissions.guest.includes(to?.name)) {
            abortNavigation();
            return navigateTo('/?login=true');
        }
    } else {
        const runTimeConfiguration = useRuntimeConfig();
        const checkUser = await useFetch(runTimeConfiguration.public.apiUrl + 'auth/me');
    }
});