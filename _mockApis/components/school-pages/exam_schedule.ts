import mock from '../../mockAdapter';
// types
export type KeyedObject = {
    [key: string]: string | number | KeyedObject | any;
};

const schedule: KeyedObject[] = [
    {   
        class:'9',
        sec:'A',
        time:'10:00 To 13:00',
        date: '06/07/2007',
        location: 'Acero Schools',
        blockno:'5',
        sub1:'Maths (M32)',
        sub2:'Science (S54)',
        sub3:'English (E10)',
        sub4:'Biology (B62)',
        sub5:'Physics (P74)',
        sub6:'Chemistry (C96)',
    },
    {   
        class:'8',
        sec:'A',
        time:'10:00 To 13:00',
        date: '22/07/2007',
        location: 'Admiral Farragut Academy',
        blockno:'7',
        sub1:'Maths (M32)',
        sub2:'Science (S54)',
        sub3:'English (E10)',
        sub4:'Biology (B62)',
        sub5:'Physics (P74)',
        sub6:'Chemistry (C96)',
    },
    {   
        class:'7',
        sec:'F',
        time:'10:00 To 13:00',
        date: '15/09/2022',
        location: 'Abington Friends School',
        blockno:'10',
        sub1:'Maths (M32)',
        sub2:'Science (S54)',
        sub3:'English (E10)',
        sub4:'Biology (B62)',
        sub5:'Physics (P74)',
        sub6:'Chemistry (C98)',
    },
    {   
        class:'12',
        sec:'A',
        time:'10:00 To 13:00',
        date: '25/06/2022',
        location: 'Oxford Academy',
        blockno:'12',
        sub1:'Maths (M32)',
        sub2:'Science (S54)',
        sub3:'English (E10)',
        sub4:'Biology (B62)',
        sub5:'Physics (P74)',
        sub6:'Chemistry (C96)',
    },
    {   
        class:'11',
        sec:'B',
        time:'10:00 To 13:00',
        date: '12/07/2022',
        location: 'Abington Friends School',
        blockno:'15',
        sub1:'Maths (M32)',
        sub2:'Science (S54)',
        sub3:'English (E10)',
        sub4:'Biology (B62)',
        sub5:'Physics (P74)',
        sub6:'Chemistry (C99)',
    },
    {   
        class:'10',
        sec:'B',
        time:'10:00 To 13:00',
        date: '28/07/2022',
        location: 'Academy of Holy Angels',
        blockno:'20',
        sub1:'Maths (M32)',
        sub2:'Science (S54)',
        sub3:'English (E10)',
        sub4:'Biology (B62)',
        sub5:'Physics (P74)',
        sub6:'Chemistry (C96)',
         
    },
   
];

// ==============================|| MOCK SERVICES ||============================== //

mock.onGet('/api/contacts').reply(() => {
    return [200, schedule];
});


export default schedule;
