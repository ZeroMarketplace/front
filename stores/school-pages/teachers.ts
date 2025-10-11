import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';

export const useTeachersStore = defineStore('Teachers',{

    state: () => ({
        teachers: []
    }),

    getters: {},
    actions: {
        // Fetch followers from action
        async fetchTeachers() {
            try {
                const response = await axios.get('/api/contacts');
                this.teachers = response.data.teachers;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    }
});
