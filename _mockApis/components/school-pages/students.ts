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

const students: KeyedObject[] = [
    {   
        avatar: user1,
        userinfo: 'Garima Singh',
        class:'5',
        sec:'B',
        parents:'Ronaldo Singh',
        bdate: '20/10/2007',
        phone: '+ 123 9988568',
        usermail: 'r93@gmail.com',
    },
    {   
        avatar: user2,
        userinfo: 'Haruto Yuto',
        class:'12',
        sec:'B',
        parents:'Joshi David',
        bdate: '12/12/2001',
        phone: '+ 123 9988568',
        usermail: 'd93@gmail.com',
    },
    {   
        avatar: user3,
        userinfo: 'Hayato Haruki',
        class:'5',
        sec:'C',
        parents:'Jack Sparrow',
        bdate: '26/01/2006',
        phone: '+ 123 9988568',
        usermail: 'd93@gmail.com',
    },
    {   
        avatar: user4,
        userinfo: 'John Deo',
        class:'12',
        sec:'C',
        parents:'John Deo',
        bdate: '02/10/2001',
        phone: '+ 123 9988568',
        usermail: 'p93@gmail.com',
    },

    {   
        avatar: user5,
        userinfo: 'Koharu Hinata',
        class:'5',
        sec:'B',
        parents:'Ronaldo Singh',
        bdate: '20/10/2007',
        phone: '+ 123 9988568',
        usermail: 'r93@gmail.com',
    },
    {   
        avatar: user6,
        userinfo: 'Kokona Haruka',
        class:'2',
        sec:'A',
        parents:'Jack Sparrow',
        bdate: '25/05/2012',
        phone: '+ 123 9988568',
        usermail: 'k93@gmail.com',
    },
    {   
        avatar: user1,
        userinfo: 'Mark J. Freeman',
        class:'2',
        sec:'A',
        parents:'Jack Sparrow',
        bdate: '25/05/2012',
        phone: '+ 123 9988568',
        usermail: 'k93@gmail.com',
    },
    {   
        avatar: user2,
        userinfo: 'Mark J. Freeman',
        class:'2',
        sec:'A',
        parents:'Jack Sparrow',
        bdate: '25/05/2012',
        phone: '+ 123 9988568',
        usermail: 'k93@gmail.com',
    },
    {   
        avatar: user3,
        userinfo: 'Mark Willy',
        class:'5',
        sec:'C',
        parents:'Jack Sparrow',
        bdate: '26/01/2006',
        phone: '+ 123 9988568',
        usermail: 'j93@gmail.com',
    },
    {   
        avatar: user4,
        userinfo: 'Mei Mio',
        class:'10',
        sec:'C',
        parents:'Jack Sparrow',
        bdate: '26/01/2006',
        phone: '+ 123 9988568',
        usermail: 'j93@gmail.com',
    },
    {   
        avatar: user5,
        userinfo: 'Midori Gurin',
        class:'6',
        sec:'A',
        parents:'John Doe',
        bdate: '06/07/2007',
        phone: '+ 123 9988568',
        usermail: 's93@gmail.com',
    },
];

// ==============================|| MOCK SERVICES ||============================== //

mock.onGet('/api/contacts').reply(() => {
    return [200, students];
});


export default students;
