import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';

export const useResultsStore = defineStore('Results',{

    state: () => ({
        results: []
    }),
    getters: {},
    actions: {
        // Fetch followers from action
        async fetchResults() {
            try {
                const response = await axios.get('/api/contacts');
                this.results = response.data.results;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    }
});
