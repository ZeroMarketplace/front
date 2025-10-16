import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';

export const useAttendenceStore = defineStore('Attendence',{

    state: () => ({
        attendence: []
    }),
    getters: {},
    actions: {
        // Fetch followers from action
        async fetchAttendence() {
            try {
                const response = await axios.get('/api/contacts');
                this.attendence = response.data.attendence;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    }
});
