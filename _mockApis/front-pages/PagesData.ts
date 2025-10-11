import type { LeaderType, TemplateType, ThemeFeatures, PackageType, FooterType, Feature } from '@/types/components/front-pages/index';
import type { faqPageType } from '@/types/components/pages/faqData';

import review1 from '@/assets/images/profile/user-1.jpg';
import review2 from '@/assets/images/profile/user-2.jpg';
import review3 from '@/assets/images/profile/user-3.jpg';

const Features: Feature[] = [
    {
        icon: 'tabler:chart-bubble',
        title: 'Expert Advisor',
        subtitle: 'Suspendisse vestibulum eu erat ac scelerisque.',
        bgcolor: 'lighterror',
        color: 'error'
    },
    {
        icon: 'tabler:building-store',
        title: 'Effective Support',
        subtitle: 'Suspendisse vestibulum eu erat ac scelerisque.',
        bgcolor: 'lightprimary',
        color: 'primary'
    },
    {
        icon: 'material-symbols:category-outline',
        title: 'Low Fees',
        subtitle: 'Suspendisse vestibulum eu erat ac scelerisque.',
        bgcolor: 'lightsuccess',
        color: 'success'
    },
    {
        icon: 'material-symbols:earthquake',
        title: 'Loan Facility',
        subtitle: 'Suspendisse vestibulum eu erat ac scelerisque.',
        bgcolor: 'grey100',
        color: 'dark '
    }
];

const AboutFeatures: Feature[] = [
    {
        icon: 'tabler:building-store',
        title: 'Effective Support',
        subtitle: 'Suspendisse vestibulum eu erat ac scelerisque.',
        bgcolor: 'lightprimary',
        color: 'primary'
    },
    {
        icon: 'tabler:chart-bubble',
        title: 'Expert Advisor',
        subtitle: 'Suspendisse vestibulum eu erat ac scelerisque.',
        bgcolor: 'lighterror',
        color: 'error'
    },
    {
        icon: 'material-symbols:category-outline',
        title: 'Low Fees',
        subtitle: 'Suspendisse vestibulum eu erat ac scelerisque.',
        bgcolor: 'lightsuccess',
        color: 'success'
    },
    {
        icon: 'material-symbols:earthquake',
        title: 'Loan Facility',
        subtitle: 'Suspendisse vestibulum eu erat ac scelerisque.',
        bgcolor: 'bglight',
        color: 'bgdark '
    }
];

const QA1: faqPageType[] = [
    {
        question: 'Combine teammate schedules',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    },
    {
        question: 'Factor in outside colleagues',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    },
    {
        question: 'Round robin pooling',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    }
];
const QA2: faqPageType[] = [
    {
        question: 'Combine teammate schedules 2',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    },
    {
        question: 'Factor in outside colleagues',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    },
    {
        question: 'Round robin pooling',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    }
];
const QA3: faqPageType[] = [
    {
        question: 'Combine teammate schedules 3',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    },
    {
        question: 'Factor in outside colleagues',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    },
    {
        question: 'Round robin pooling',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    }
];

const QA4: faqPageType[] = [
    {
        question: 'Combine teammate schedules 4',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    },
    {
        question: 'Factor in outside colleagues',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    },
    {
        question: 'Round robin pooling',
        answer: 'Factor in availability for required attendees, and skip checking for conflicts for optional attendees.'
    }
];

// OurLeaders
import leader1 from '@/assets/images/front-pages/leaders/leader1.png';
import leader2 from '@/assets/images/front-pages/leaders/leader2.png';
import leader3 from '@/assets/images/front-pages/leaders/leader3.png';
import leader4 from '@/assets/images/front-pages/leaders/leader4.png';
import leader5 from '@/assets/images/front-pages/leaders/leader4.png';
import {
    IconWand as WandIcon,
    IconShieldLock as ShieldLockIcon,
    IconArchive as ArchiveIcon,
    IconAdjustments as AdjustmentsIcon,
    IconTag as TagIcon,
    IconDiamond as DiamondIcon,
    IconDatabase as DatabaseIcon,
    IconLanguageKatakana as LanguageKatakanaIcon,
    IconBuildingCarousel as BuildingCarouselIcon,
    IconArrowsShuffle as ArrowsShuffleIcon,
    IconChartPie as ChartPieIcon,
    IconLayersIntersect as LayersIntersectIcon,
    IconRefresh as RefreshIcon,
    IconBook as BookIcon,
    IconCalendar as CalendarIcon,
    IconMessage as MessageIcon,
    IconCircleCheck as CircleCheckIcon,
    IconCircleX as CircleXIcon
} from '@tabler/icons-vue';
import type { UserReviewTypes } from '@/types/landingpage/LandingpageTypes';
const OurLeaders: LeaderType[] = [
    {
        img: leader1,
        name: 'Alex Martinez',
        position: 'CEO & Co-Founder'
    },
    {
        img: leader2,
        name: 'Jordan Nguyen',
        position: 'CTO & Co-Founder'
    },
    {
        img: leader3,
        name: 'Taylor Roberts',
        position: 'Product Manager'
    },
    {
        img: leader4,
        name: 'Morgan Patel',
        position: 'Lead Developer'
    }
];

const templateText: TemplateType[] = [
    {
        title: 'High Customizability',
        subtitle:
            'Tailor the dashboard to your exact needs. Customize layouts, color schemes, and widgets effortlessly for a personalized user experience.'
    },
    {
        title: 'Powerful Data Analytics',
        subtitle:
            ' Unlock the true potential of your data with our advanced analytics tools. Gain valuable insights and make data-driven decisions with ease.'
    },
    {
        title: 'Interactive Graphs & Charts',
        subtitle:
            'Visualize complex data sets beautifully with our interactive graphs and charts. Quickly grasp trends and patterns for smarter analysis.'
    }
];

const ThemeFeature1: ThemeFeatures[] = [
    {
        icon: WandIcon,
        title: '6 Theme Colors',
        color: 'primary'
    },
    {
        icon: ShieldLockIcon,
        title: 'Authguard',
        color: 'secondary'
    },
    {
        icon: ArchiveIcon,
        title: '65+ Page Templates',
        color: 'error'
    },
    {
        icon: AdjustmentsIcon,
        title: '45+ UI Components',
        color: 'success'
    },
    {
        icon: TagIcon,
        title: 'Vuetify',
        color: 'info'
    },
    {
        icon: DiamondIcon,
        title: '3400+ Font Icons',
        color: 'warning'
    }
];
const ThemeFeature2: ThemeFeatures[] = [
    {
        icon: DatabaseIcon,
        title: 'Axios',
        color: 'success'
    },
    {
        icon: LanguageKatakanaIcon,
        title: 'i18n Vue',
        color: 'error'
    },
    {
        icon: BuildingCarouselIcon,
        title: 'Vue3 Carousel',
        color: 'warning'
    },
    {
        icon: ArrowsShuffleIcon,
        title: 'Easy to Customize',
        color: 'primary'
    }
];
const ThemeFeature3: ThemeFeatures[] = [
    {
        icon: ChartPieIcon,
        title: 'Lots of Chart Options',
        color: 'secondary'
    },
    {
        icon: LayersIntersectIcon,
        title: 'Lots of Table Examples',
        color: 'info'
    },
    {
        icon: RefreshIcon,
        title: 'Regular Updates',
        color: 'error'
    },
    {
        icon: BookIcon,
        title: 'Detailed Documentation',
        color: 'warning'
    },
    {
        icon: CalendarIcon,
        title: 'Calendar Design',
        color: 'success'
    },
    {
        icon: MessageIcon,
        title: 'Dedicated Support',
        color: 'info'
    }
];

const Packages: PackageType[] = [
    {
        tagtext: false,
        caption: 'Single Use',
        subtext: 'Use for single end product which end users can’t be charged for.',
        price: 49,
        period: 'one time pay',
        buttontext: 'Purchase Now',
        url: '/',
        list: [
            {
                listtitle: 'Full source code',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: 'Documentation',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: 'Use in SaaS app',
                status: true,
                icon: true,
                disable: true
            },
            {
                listtitle: '<b>One</b> Project',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: '<b>One Year</b> Technical Support',
                status: false,
                icon: true,
                disable: false
            }
        ]
    },

    {
        tagtext: false,
        caption: 'Multiple Use',
        subtext: 'Use for unlimited end products end users can’t be charged for.',
        price: 89,
        period: 'one time pay',
        buttontext: 'Purchase Now',
        url: '/',
        list: [
            {
                listtitle: 'Full source code',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: 'Documentation',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: 'Use in SaaS app',
                status: true,
                icon: true,
                disable: true
            },
            {
                listtitle: '<b>Unlimited</b> Project',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: '<b>One Year</b> Technical Support',
                status: false,
                icon: true,
                disable: false
            }
        ]
    },

    {
        tagtext: true,
        caption: 'Extended Use',
        subtext: 'Use for single end product which end users can be charged for.',
        price: 299,
        period: 'one time pay',
        buttontext: 'Purchase Now',
        url: '/',
        list: [
            {
                listtitle: 'Full source code',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: 'Documentation',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: 'Use in SaaS app',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: '<b>One</b> Project',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: '<b>One Year</b> Technical Support',
                status: false,
                icon: true,
                disable: false
            }
        ]
    },
    {
        tagtext: false,
        caption: 'Unlimited Use',
        subtext: 'Use in unlimited end products end users can be charged for.',
        price: 499,
        period: 'one time pay',
        buttontext: 'Purchase Now',
        url: '/',
        list: [
            {
                listtitle: 'Full source code',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: 'Documentation',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: 'Use in SaaS app',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: '<b>Unlimited</b> Project',
                status: false,
                icon: true,
                disable: false
            },
            {
                listtitle: '<b>One Year</b> Technical Support',
                status: false,
                icon: true,
                disable: false
            }
        ]
    }
];

const FAQData: TemplateType[] = [
    {
        title: 'What is included with my purchase?',
        subtitle:
            'Tailor the dashboard to your exact needs. Customize layouts, color schemes, and widgets effortlessly for a personalized user experience.'
    },
    {
        title: 'Are there any recurring fees?',
        subtitle:
            ' Unlock the true potential of your data with our advanced analytics tools. Gain valuable insights and make data-driven decisions with ease.'
    },
    {
        title: 'Can I use the template on multiple projects?',
        subtitle:
            'Visualize complex data sets beautifully with our interactive graphs and charts. Quickly grasp trends and patterns for smarter analysis.'
    },
    {
        title: 'Can I customize the admin dashboard template to match my brand?',
        subtitle:
            'Visualize complex data sets beautifully with our interactive graphs and charts. Quickly grasp trends and patterns for smarter analysis.'
    },
    {
        title: 'Are there any restrictions on using the template?',
        subtitle:
            'Visualize complex data sets beautifully with our interactive graphs and charts. Quickly grasp trends and patterns for smarter analysis.'
    },
    {
        title: 'How can I get support after purchase?',
        subtitle:
            'Visualize complex data sets beautifully with our interactive graphs and charts. Quickly grasp trends and patterns for smarter analysis.'
    }
];

// Footer Menu Links
const FooterMenu1: FooterType[] = [
    {
        menu: 'Cards',
        link: '/widgets/cards'
    },
    {
        menu: 'Pricing',
        link: '/pages/pricing'
    },
    {
        menu: 'Account Settings',
        link: '/pages/account-settings'
    },
    {
        menu: 'FAQ',
        link: '/pages/faq'
    },
    {
        menu: 'Search Results',
        link: '/pages/search-results'
    }
];
const FooterMenu2: FooterType[] = [
    {
        menu: 'Treeview',
        link: '/pages/treeview'
    },
    {
        menu: 'Banners',
        link: '/widgets/banners'
    },
    {
        menu: 'Charts',
        link: '/widgets/charts'
    },
    {
        menu: 'Gallery Lightbox',
        link: '/pages/gallery-lightbox'
    },
    {
        menu: 'Social Contacts',
        link: '/pages/social-media-contacts'
    }
];
const FooterMenu3: FooterType[] = [
    {
        menu: 'Form Layout',
        link: '/forms/form-layouts'
    },
    {
        menu: 'Tables',
        link: '/tables/basic'
    },
    {
        menu: 'Stepper',
        link: '/forms/form-elements/stepper'
    },
    {
        menu: 'Datatables',
        link: '/tables/datatables/basic'
    },
    {
        menu: 'Validation',
        link: '/forms/form-validation'
    }
];

const userReviewFrront: UserReviewTypes[] = [
    {
        img: review1,
        title: 'Jenny Wilson',
        subtitle: 'CEO & Head of Comp Inc.',
        review: 'This template is great, UI-rich and up-to-date. Although it is pretty much complete, I suggest to improve a bit of documentation. Thanks & Highly recommended!'
    },
    {
        img: review2,
        title: 'Josh Cui',
        subtitle: 'CEO & Head of Comp Inc.',
        review: 'This template is great, UI-rich and up-to-date. Although it is pretty much complete, I suggest to improve a bit of documentation. Thanks & Highly recommended!'
    },
    {
        img: review3,
        title: 'Eminson Mendoza',
        subtitle: 'CEO & Head of Comp Inc.',
        review: 'This template is great, UI-rich and up-to-date. Although it is pretty much complete, I suggest to improve a bit of documentation. Thanks & Highly recommended!'
    }
];
export {
    QA1,
    QA2,
    QA3,
    QA4,
    OurLeaders,
    templateText,
    ThemeFeature1,
    ThemeFeature2,
    ThemeFeature3,
    Packages,
    FAQData,
    FooterMenu1,
    FooterMenu2,
    FooterMenu3,
    Features,
    userReviewFrront,
    AboutFeatures
};
