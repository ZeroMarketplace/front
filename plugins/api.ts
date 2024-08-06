export default defineNuxtPlugin((nuxtApp) => {
    // const { session } = useUserSession()
    const config = useRuntimeConfig()
    const api = $fetch.create({
        baseURL: config.public.API_BASE_URL,
        onRequest({ request, options, error }) {
            // if (session.value?.token) {
            //     const headers = options.headers ||= {}
            //     if (Array.isArray(headers)) {
            //         headers.push(['Authorization', `Bearer ${session.value?.token}`])
            //     } else if (headers instanceof Headers) {
            //         headers.set('Authorization', `Bearer ${session.value?.token}`)
            //     } else {
            //         headers.Authorization = `Bearer ${session.value?.token}`
            //     }
            // }
        },
        onResponse({response}){
            const {$showMessage} = useNuxtApp();
            if (response.status >= 400 && response.status < 500) {
                $showMessage('مشکلی در عملیات پیش آمد؛ لطفا دوباره تلاش کنید', 'error');
            } else if (response.status >= 500) {
                $showMessage('مشکلی در پردازش در سرور پیش آمد', 'error');
            }
        },
        async onResponseError({ response }) {

            // if (response.status === 401) {
            //     await nuxtApp.runWithContext(() => navigateTo('/login'))
            // }
        }
    })

    // Expose to useNuxtApp().$api
    return {
        provide: {
            api
        }
    }
})
