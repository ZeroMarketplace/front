import axios from 'axios'
import type { AxiosInstance } from 'axios'
import {defineNuxtPlugin} from '#app'

export default defineNuxtPlugin((nuxtApp) => {
    // Access the token from cookies
    const token = useCookie('token').value;
    // Access the config from runtime config
    const config = useRuntimeConfig();

    // Create axios instance
    const api: AxiosInstance = axios.create({
        baseURL: config.public.API_BASE_URL,
    })

    // Add Authorization header if token exists
    if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    // Provide axios globally
    nuxtApp.provide('axios', api)
})
