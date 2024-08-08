export default defineNuxtPlugin((nuxtApp) => {
    // const { session } = useUserSession()
    const config = useRuntimeConfig();
    const token = useCookie('token');
    const api = $fetch.create({
        baseURL: config.public.API_BASE_URL,
        onRequest({ request, options, error }) {
            if (token.value) {
                const headers = options.headers ||= {}
                if (Array.isArray(headers)) {
                    headers.push(['Authorization', `Bearer ${token.value}`])
                } else if (headers instanceof Headers) {
                    headers.set('Authorization', `Bearer ${token.value}`)
                } else {
                    headers.Authorization = `Bearer ${token.value}`
                }
            }
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
