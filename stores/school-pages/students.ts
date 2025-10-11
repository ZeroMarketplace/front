import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';

export const useStudentsStore = defineStore('Students',{

    state: () => ({
        students: []
    }),
    getters: {},
    actions: {
        // Fetch followers from action
        async fetchStudents() {
            try {
                const response = await axios.get('/api/contacts');
                this.students = response.data.students;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    }
});
