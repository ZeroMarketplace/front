// project imports
import mock from './mockAdapter';

import type { notificationType, profileType, languageType, appsLinkType, quickLinksType,searchType,optionIcon } from '@/types/HeaderTypes'
import {IconCircle as CircleIcon, IconCreditCard as CreditCardIcon, IconShield as ShieldIcon, IconWallet as WalletIcon } from '@tabler/icons-vue';
// 
// Notification
// 


const notifications:notificationType[] = [
    {
        
        title: 'Roman Joined the Team!',
        subtitle: 'Congratulate him',
        time:'9.08 AM'
    },
    {
        
        title: 'New message received',
        subtitle: 'Salma sent you new message',
        time:'9.05 AM'
    },
    {
      
        title: 'New Payment received',
        subtitle: 'Check your earnings',
        time:'10.08 AM'
    },
    {
     
        title: 'Jolly completed tasks',
        subtitle: 'Assign her new tasks',
        time:'9.00 AM'
    },
    {
  
        title: 'New Payment received',
        subtitle: 'Check your earnings',
        time:'9.08 AM'
    },
    {
    
        title: 'Roman Joined the Team!',
        subtitle: 'Congratulate him',
        time:'9.15 AM'
    }
];

// 
// Profile 
// 

const profileDD: profileType[] = [
   

    {
        avatar: 'wallet-2-line-duotone',
        bgcolor:'info',
        title: 'My Profile',
        subtitle: 'Account settings',
        href: '/apps/user/profileone'
    },
    {
        avatar: 'shield-minimalistic-line-duotone',
        bgcolor:'success',
        title: 'My Notes',
        subtitle: 'My Daily Notes',
        href: '/apps/notes'
    },
    {
        avatar: 'card-2-line-duotone',
        bgcolor:'error',
        title: 'My Tasks',
        subtitle: 'To-do and Daily tasks',
        href: '/apps/kanban'
    }
];

// 
// Language
// 
import flag1 from '@/assets/images/flag/icon-flag-en.svg';
import flag2 from '@/assets/images/flag/icon-flag-fr.svg';
import flag3 from '@/assets/images/flag/icon-flag-ro.svg';
import flag4 from '@/assets/images/flag/icon-flag-zh.svg';
const languageDD: languageType[] = [
    { title: 'English', subtext: 'UK', value: 'en', avatar: flag1 },
    { title: 'français', subtext: 'French', value: 'fr', avatar: flag2 },
    { title: 'عربي', subtext: 'Arbic', value: 'ro', avatar: flag3 },
    { title: '中国人', subtext: 'Chinese', value: 'zh', avatar: flag4 }
];

// 
// AppsLink
// 

const appsLink: appsLinkType[] = [
    {

        title: 'Chat Application',
        subtext: 'New messages arrived',
    },
    {

        title: 'eCommerce App',
        subtext: 'learn more information',
    },
    {

        title: 'User Profile App',
        subtext: 'Get profile details',
    },
    {

        title: 'Calendar App',
        subtext: 'Get dates',
    },
    {

        title: 'Contact Application',
        subtext: '2 Unsaved Contacts',
    },
    {

        title: 'Account Setting App',
        subtext: 'Account settings',
    },
    {

        title: 'Kanban App',
        subtext: 'Add the task',
    },
    {

        title: 'Notes Application',
        subtext: 'To-do and Daily tasks',
    }
];

// 
// Quick Links
// 
const quickLink: quickLinksType[] = [
    {
        title: 'Pricing Page',
    },
    {
        title: 'Authentication Design',
    },
    {
        title: 'Register Now',
    },
    {
        title: '404 Error Page',
    },
    {
        title: 'Notes App',
    },
    {
        title: 'User Application',
    },
    {
        title: 'Blog Design',
    },
    {
        title: 'Shopping Cart',
    }
];

// 
// Search Data
// 
const searchSugg: searchType[] = [
    
    {
        title: 'Contacts',
    },
    {
        title: 'Shop',
    },
    {
        title: 'Checkout',
    },
    {
        title: 'Chats',
    },
    {
        title: 'Notes',
    },
    {
        title: 'Pricing',
    },
    {
        title: 'Account Setting',
    },
];

const optionIconData:optionIcon[] = [
    {
        title: 'Applications',
        iconcolor:'primary'
    },
    {
        title: 'Form Options',
        iconcolor:'error'
    },
    {
        title: 'Table Variations',
        iconcolor:'warning'
    },
    {
        title: 'Charts Selection',
        iconcolor:'success'
    },
    {
        title: 'Widget',
        iconcolor:'indigo'
    },
]

export { notifications, profileDD, languageDD, appsLink, quickLink, searchSugg,optionIconData };

