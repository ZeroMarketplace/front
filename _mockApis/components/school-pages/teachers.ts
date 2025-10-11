import mock from '../../mockAdapter';
// import type { ContactType } from '@/types/apps/ContactType';

import user1 from '@/assets/images/profile/user1.jpg';
import user2 from '@/assets/images/profile/user2.jpg';
import user3 from '@/assets/images/profile/user3.jpg';
import user4 from '@/assets/images/profile/user4.jpg';
import user5 from '@/assets/images/profile/user5.jpg';
import user6 from '@/assets/images/profile/user6.jpg';
import user7 from '@/assets/images/profile/user1.jpg';
import user8 from '@/assets/images/profile/user2.jpg';
import user9 from '@/assets/images/profile/user3.jpg';
import user10 from '@/assets/images/profile/user4.jpg';


// types
export type KeyedObject = {
    [key: string]: string | number | KeyedObject | any;
};

const teachers: KeyedObject[] = [
    {   
        avatar: user1,
        userinfo: 'Budo Masuta',
        class:'6',
        sec:'A',
        subject:'Geography',
        bdate: '06/07/2007',
        phone: '+ 123 9988568',
        usermail: 'sparkdoe@gmail.com',
    },
    {   
        avatar: user2,
        userinfo: 'Garima Singh',
        class:'5',
        sec:'B',
        subject:'Science',
        bdate: '20/10/2007',
        phone: '+ 123 9988568',
        usermail: 'ronaldosingh007@gmail.com',
    },
    {   
        avatar: user3,
        userinfo: 'Inkyu Basu',
        class:'12',
        sec:'B',
        subject:'Maths',
        bdate: '12/12/2001',
        phone: '+ 123 9988568',
        usermail: 'davidzonar@gmail.com',
    },
    {   
        avatar: user4,
        userinfo: 'John Deo',
        class:'12',
        sec:'C',
        subject:'Geography',
        bdate: '02/10/2001',
        phone: '+ 123 9988568',
        usermail: 'patelaleis@gmail.com',
    },
    {   
        avatar: user5,
        userinfo: 'Juku Ren',
        class:'12',
        sec:'B',
        subject:'Maths',
        bdate: '12/12/2001',
        phone: '+ 123 9988568',
        usermail: 'davidzonar@gmail.com',
    },
    {   
        avatar: user6,
        userinfo: 'Kuu Dere',
        class:'5',
        sec:'B',
        subject:'Science',
        bdate: '20/10/2007',
        phone: '+ 123 9988568',
        usermail: 'ronaldosingh007@gmail.com',
    },
    {   
        avatar: user7,
        userinfo: 'Mai Waifu',
        class:'10',
        sec:'C',
        subject:'English',
        bdate: '26/01/2004',
        phone: '+ 123 9988568',
        usermail: 'markmaria223@gmail.com',
    },
    {   
        avatar: user8,
        userinfo: 'Mark J. Freeman',
        class:'2',
        sec:'A',
        subject:'English',
        bdate: '25/01/2004',
        phone: '+ 123 9988568',
        usermail: 'kazifahim93@gmail.com',
    },
    {   
        avatar: user9,
        userinfo: 'Mark Willy',
        class:'5',
        sec:'C',
        subject:'English',
        bdate: '26/01/2006',
        phone: '+ 123 9988568',
        usermail: 'jackdude224@gmail.com',
    },
    {   
        avatar: user10,
        userinfo: 'Mina Rai',
        class:'5',
        sec:'B',
        subject:'English',
        bdate: '20/10/2007',
        phone: '+ 123 9988568',
        usermail: 'ronaldosingh007@gmail.com',
    },
];

// ==============================|| MOCK SERVICES ||============================== //

mock.onGet('/api/contacts').reply(() => {
    return [200, teachers];
});


export default teachers;
