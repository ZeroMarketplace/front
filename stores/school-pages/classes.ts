import { defineStore } from 'pinia';
// project imports
import axios from '@/utils/axios';
import type { ClassesType } from '@/types/components/school-pages/classes';

interface classesType {
    classinfo: ClassesType[];
}

export const useClassesStore = defineStore('Classes',{


    state: (): classesType => ({
        classinfo: [],
    }),
    getters: {
        // Get Post from Getters
        getPosts(state) {
            return state.classinfo;
        }
    },
    actions: {
        // Fetch Blog from action
        async fetchPosts() {
            try {
                const data = await axios.get('/api/classes');
                this.classinfo = data.data;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        },
        async fetchPost(title: string) {
            try {
                const response = await axios.post('/api/classes/details', { title });
                this.classinfo = response.data.post;
            } catch (error) {
                alert(error);
                console.log(error);
            }
        }
    }
});
