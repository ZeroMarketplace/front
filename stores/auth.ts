import { defineStore } from 'pinia';
import { fetchWrapper } from '@/utils/helpers/fetch-wrapper';

const baseUrl = `${import.meta.env.VITE_API_URL}/users`;

export const useAuthStore = defineStore('auth',{

    state: () => ({
        // initialize state from local storage to enable user to stay logged in
        // @ts-ignore
        user: typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null,
        returnUrl: null
    }),
    actions: {
        async login(username: string, password: string) {
            const router = useRouter();
            const user = await fetchWrapper.post(`${baseUrl}/authenticate`, { username, password });

            // update pinia state
            this.user = user;
            // store user details and jwt in local storage to keep user logged in between page refreshes
            localStorage.setItem('user', JSON.stringify(user));
            // redirect to previous url or default to home page
            router.push(this.returnUrl || '/dashboard1');
        },
        logout() {
            const router = useRouter();
            this.user = null;
            localStorage.removeItem('user');
            router.push('/');
        }
    }
});
