import { Chance } from 'chance';
import { random } from 'lodash';
import { sub } from 'date-fns';
import mock from '@/_mockApis/mockAdapter';
import classimg1 from '@/assets/images/backgrounds/bootstrap.png';
import classimg2 from '@/assets/images/backgrounds/python.png';
import classimg3 from '@/assets/images/backgrounds/vuejs.png';
import classimg4 from '@/assets/images/backgrounds/flutter.png';
import classimg5 from '@/assets/images/backgrounds/js.png';
import classimg6 from '@/assets/images/backgrounds/jquery.png';

import user1 from '@/assets/images/profile/user2.jpg';
import user2 from '@/assets/images/profile/user1.jpg';

import { uniqueId } from 'lodash';

import type { ClassesType } from '@/types/components/school-pages/classes';


const ClassesTypeData: ClassesType[] = [
    {
        id: 1,
        img: classimg1,
        chip: 'Hot',
        chipbg: 'error',
        caption: 'Bootstrap Classes',
        title: 'Flutter & Firebase: Build a Complete App for iOS',
        lesson: '8 lessons',
        hour: '18h 20m',
        profileimg: user1,
        name: 'Dr. Angela Burr',
    },
    {
        id: 2,
        img: classimg2,
        chip: 'Bestseller',
        chipbg: 'success',
        caption: 'Machine Learning',
        title: 'Python for Data Science and Machine Learning',
        lesson: '8 lessons',
        hour: '18h 20m',
        profileimg: user2,
        name: 'Mark Freeman',
    },
    {
        id: 3,
        img: classimg3,
        chip: '',
        chipbg: '',
        caption: 'AWS Certification',
        title: 'Ultimate AWS Certified Developer Hire',
        lesson: '8 lessons',
        hour: '18h 20m',
        profileimg: user1,
        name: 'Arya B. Rao',
    },
    {
        id: 4,
        img: classimg4,
        chip: '',
        chipbg: '',
        caption: 'Google Flutter',
        title: 'Flutter & Firebase: Build a Complete App for iOS',
        lesson: '8 lessons',
        hour: '18h 20m',
        profileimg: user1,
        name: 'Dr. Angela Burr',
    },
    {
        id: 5,
        img: classimg5,
        chip: '',
        chipbg: '',
        caption: 'Machine Learning',
        title: 'Python for Data Science and Machine Learning',
        lesson: '8 lessons',
        hour: '18h 20m',
        profileimg: user2,
        name: 'Mark Freeman',
    },
    {
        id: 6,
        img: classimg6,
        chip: '',
        chipbg: '',
        caption: 'AWS Certification',
        title: 'Ultimate AWS Certified Developer Hire',
        lesson: '8 lessons',
        hour: '18h 20m',
        profileimg: user2,
        name: 'Arya B. Rao',
    },

];

mock.onGet('/api/classes').reply(() => {
    return [200, ClassesTypeData];
});

// ----------------------------------------------------------------------
mock.onPost('/api/classes').reply((config: string | any) => {
    try {
        const { title } = JSON.parse(config.data);

        const paramCase = (t: string) =>
            t
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');

        const post = ClassesTypeData.find((_post: ClassesType | string | any) => paramCase(_post.title) === title);

        if (!post) {
            return [404, { message: 'Classes not found' }];
        }

        return [200, { post }];
    } catch (error) {
        console.error(error);
        return [500, { message: 'Internal server error' }];
    }
});


