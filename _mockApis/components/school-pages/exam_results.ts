import mock from '../../mockAdapter';
// import type { ContactType } from '@/types/apps/ContactType';

import user1 from '@/assets/images/profile/user1.jpg';
import user2 from '@/assets/images/profile/user2.jpg';
import user3 from '@/assets/images/profile/user3.jpg';
import user4 from '@/assets/images/profile/user4.jpg';
import user5 from '@/assets/images/profile/user5.jpg';
import user6 from '@/assets/images/profile/user6.jpg';


// types
export type KeyedObject = {
    [key: string]: string | number | KeyedObject | any;
};

const results: KeyedObject[] = [
    {   
        avatar: user2,
        userinfo: 'Mark J. Freeman',
        class:'10',
        sec:'C',
        Internalm:'10',
        externalm: '20',
        total: '30',
        remarks: 'Fail',
        color:'error'
    },
    {   
        avatar: user1,
        userinfo: 'Mark Maria',
        class:'6',
        sec:'D',
        Internalm:'25',
        externalm: '45',
        total: '70',
        remarks: 'Pass',
        color:'success'
    },
    {   
        avatar: user3,
        userinfo: 'Midori Gurin',
        class:'10',
        sec:'E',
        Internalm:'10',
        externalm: '20',
        total: '30',
        remarks: 'Fail',
        color:'error'
    },
    {   
        avatar: user4,
        userinfo: 'Nirav Joshi',
        class:'7',
        sec:'F',
        Internalm:'20',
        externalm: '70',
        total: '90',
        remarks: 'Pass',
        color:'success'
    },
    {   
        avatar: user5,
        userinfo: 'Ryuto Ippongo',
        class:'12',
        sec:'A',
        Internalm:'28',
        externalm: '58',
        total: '80',
        remarks: 'Pass',
        color:'success'
    },
    {   
        avatar: user6,
        userinfo: 'Sakyu Basu',
        class:'7',
        sec:'F',
        Internalm:'30',
        externalm: '70',
        total: '100',
        remarks: 'Pass',
        color:'success'
    },
   
];

// ==============================|| MOCK SERVICES ||============================== //

mock.onGet('/api/contacts').reply(() => {
    return [200, results];
});


export default results;
