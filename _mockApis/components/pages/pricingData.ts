/*import tabler icons*/
import { IconCheck as CheckIcon, IconX as XIcon, } from '@tabler/icons-vue';
import type { pricingType } from '@/types/components/pages/pricingData';
/*-- Pricing Page --*/
import img1 from '@/assets/images/backgrounds/silver-pot.svg';
import img2 from '@/assets/images/backgrounds/bronze-pot.svg';
import img3 from '@/assets/images/backgrounds/gold-pot.svg';
const pricing: pricingType[] = [
    {
        tagtext: false,
        caption: 'Silver',
        image: img1,
        free: true,
        price: 10.99,
        yearlyprice: 10.99 * 12,
        buttontext: 'Choose Silver',
        list: [
            {
                icon: CheckIcon,
                iconcolor: 'primary',
                listtitle: '3 Members',
                status:false,
            },
            {
                icon: CheckIcon,
                iconcolor: 'primary',
                listtitle: 'Single Device',
                status:false,
            },
            {
                icon: XIcon,
                iconcolor: 'inputBorder',
                listtitle: '50GB Storage',
                status:true,
            },
            {
                icon: XIcon,
                iconcolor: 'inputBorder',
                listtitle: 'Monthly Backups',
                status:true,
            },
            {
                icon: XIcon,
                iconcolor: 'inputBorder',
                listtitle: 'Permissions & workflows',
                status:true,
            }
        ]
    },
    {
        tagtext: true,
        caption: 'bronze',
        image: img2,
        free: false,
        price: 4.99,
        yearlyprice: 4.99 * 12,
        buttontext: 'Choose Bronze',
        list: [
            {
                icon: CheckIcon,
                iconcolor: 'primary',
                listtitle: '5 Members',
                status:false,
            },
            {
                icon: CheckIcon,
                iconcolor: 'primary',
                listtitle: 'Multiple Device',
                status:false,
            },
            {
                icon: CheckIcon,
                iconcolor: 'primary',
                listtitle: '80GB Storage',
                status:false,
            },
            {
                icon: XIcon,
                iconcolor: 'inputBorder',
                listtitle: 'Monthly Backups',
                status:true,
            },
            {
                icon: XIcon,
                iconcolor: 'inputBorder',
                listtitle: 'Permissions & workflows',
                status:true,
            }
        ]
    },
    {
        tagtext: false,
        caption: 'gold',
        image: img3,
        free: false,
        price: 9.99,
        yearlyprice: 9.99 * 12,
        buttontext: 'Choose Gold',
        list: [
            {
                icon: CheckIcon,
                iconcolor: 'primary',
                listtitle: '5 Members',
                status:false,
            },
            {
                icon: CheckIcon,
                iconcolor: 'primary',
                listtitle: 'Single Device',
                status:false,
            },
            {
                icon: CheckIcon,
                iconcolor: 'primary',
                listtitle: '120GB Storage',
                status:false,
            },
            {
                icon: CheckIcon,
                iconcolor: 'primary',
                listtitle: 'Monthly Backups',
                status:false,
            },
            {
                icon: CheckIcon,
                iconcolor: 'primary',
                listtitle: 'Permissions & workflows',
                status:false,
            }
        ]
    }

];
export { pricing};