import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';

export const useScheduleStore = defineStore('Schedule',{

    state: () => ({
        schedule: []
    }),
    getters: {},
    actions: {
        // Fetch followers from action
        async fetchSchedule() {
            try {
                const response = await axios.get('/api/contacts');
                this.schedule = response.data.schedule;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    }
});
