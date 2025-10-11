import type { cardsType, followCard, musicCards, productsCards, socialiconCards, profileCard, upcommingLists, userCard, paymentGateway, recentTrans, backIcon,imgCard,topCards } from '@/types/components/widget/card';
/*import tabler icons*/
import {
    IconBrandFacebook as BrandFacebookIcon,
    IconBrandGithub as BrandGithubIcon,
    IconBrandInstagram as BrandInstagramIcon,
    IconBrandTwitter as BrandTwitterIcon,
    IconMapPin as MapPinIcon,
    IconDatabase as DatabaseIcon,
    IconPhone as PhoneIcon,
    IconScreenShare as ScreenShareIcon,
    IconMail as MailIcon,
    IconLayoutGrid as LayoutGridIcon,
    IconArchive as ArchiveIcon,
    IconUser as UserIcon,
    IconGift as GiftIcon,
    IconGitBranch as GitBranchIcon,
    IconCardboards as CardboardsIcon
} from '@tabler/icons-vue';

import user1 from '@/assets/images/profile/user-1.jpg';
import user2 from '@/assets/images/profile/user-2.jpg';
import user3 from '@/assets/images/profile/user-3.jpg';
import user4 from '@/assets/images/profile/user-4.jpg';
import img1 from '@/assets/images/blog/blog-img1.jpg';
import img2 from '@/assets/images/blog/blog-img2.jpg';
import img3 from '@/assets/images/blog/blog-img3.jpg';
/*--Products Cards Images--*/
import proimg1 from '@/assets/images/products/s4.jpg';
import proimg2 from '@/assets/images/products/s5.jpg';
import proimg3 from '@/assets/images/products/s4.jpg';
import proimg4 from '@/assets/images/products/s11.jpg';
/*--Payment gateways--*/
import icon1 from "@/assets/images/svgs/paypal2.svg";
import icon2 from "@/assets/images/svgs/wallet.svg";
import icon3 from "@/assets/images/svgs/credit-card.svg";
import icon4 from "@/assets/images/svgs/bank-transfer.svg";
import icon5 from "@/assets/images/svgs/refund.svg";
/*--Top cards--*/
import card_icon1 from "@/assets/images/svgs/icon-user-male.svg"
import card_icon2 from "@/assets/images/svgs/icon-briefcase.svg"
import card_icon3 from "@/assets/images/svgs/icon-mailbox.svg"
import card_icon4 from "@/assets/images/svgs/icon-favorites.svg"
import card_icon5 from "@/assets/images/svgs/icon-speech-bubble.svg"
import card_icon6 from "@/assets/images/svgs/icon-connect.svg"

/*--Blog Cards--*/
const blogCard: cardsType[] = [
    {
        avatar: user1,
        coveravatar: img1,
        read: '2 min Read',
        title: 'As yen tumbles, gadget-loving Japan goes for secondhand iPhones',
        link: '/',
        category: 'Social',
        name: 'Georgeanna Ramero',
        view: '9,125',
        comments: '3',
        time: 'Mon, Dec 19'
    },
    {
        avatar: user2,
        coveravatar: img2,
        read: '2 min Read',
        title: 'Intel loses bid to revive antitrust case against patent foe Fortress',
        link: '/',
        category: 'Gadget',
        name: 'Georgeanna Ramero',
        view: '4,150',
        comments: '38',
        time: 'Sun, Dec 18'
    },
    {
        avatar: user3,
        coveravatar: img3,
        read: '2 min Read',
        title: 'COVID outbreak deepens as more lockdowns loom in China',
        link: '/',
        category: 'Health',
        name: 'Georgeanna Ramero',
        view: '9,480',
        comments: '12',
        time: 'Sat, Dec 17'
    }
];

/*--Follow Cards--*/
const followerCard: followCard[] = [
    {
        title: 'Andrew Grant',
        location: 'El Salvador',
        avatar: user1
    },
    {
        title: 'Leo Pratt',
        location: 'Bulgaria',
        avatar: user2
    },
    {
        title: 'Charles Nunez',
        location: 'Nepal',
        avatar: user3
    }
];

/*--Music Cards--*/
const musicCard: musicCards[] = [
    {
        title: 'Uptown',
        subheader: 'Jon Bon Jovi',
        img: img1
    },
    {
        title: 'Blank',
        subheader: 'Madonna',
        img: img2
    },
    {
        title: 'Lean On',
        subheader: 'Jennifer',
        img: img3
    }
];

/*--Products Cards--*/
const productsCard: productsCards[] = [
    {
        title: 'Boat Headphone',
        link: '/',
        photo: proimg1,
        salesPrice: 375,
        price: 285,
        rating: 4
    },
    {
        title: 'MacBook Air Pro',
        link: '/',
        photo: proimg2,
        salesPrice: 650,
        price: 900,
        rating: 5
    },
    {
        title: 'Red Valvet Dress',
        link: '/',
        photo: proimg3,
        salesPrice: 150,
        price: 200,
        rating: 3
    },
    {
        title: 'Cute Soft Teddybear',
        link: '/',
        photo: proimg4,
        salesPrice: 285,
        price: 345,
        rating: 2
    }
];

/*--Social Cards--*/
const socialiconCard: socialiconCards[] = [
    {
        name: 'facebook',
        icon: BrandFacebookIcon,
        color: 'primary'
    },
    {
        name: 'instagram',
        icon: BrandInstagramIcon,
        color: 'error'
    },
    {
        name: 'github',
        icon: BrandGithubIcon,
        color: 'info'
    },
    {
        name: 'twitter',
        icon: BrandTwitterIcon,
        color: 'secondary'
    }
];

/*--Profile Cards--*/
const profileCards: profileCard[] = [
    {
        title: 'Andrew Grant',
        subtitle: 'Technology Director',
        avatar: user1
    },
    {
        title: 'Leo Pratt',
        subtitle: 'Telecom Analyst',
        avatar: user2
    },
    {
        title: 'Charles Nunez',
        subtitle: 'Environmental Specialist',
        avatar: user3
    }
];

/*--Upcomming Activity Cards--*/
const upcommingCards: upcommingLists[] = [
    {
        icon: MapPinIcon,
        title: 'Trip to singapore',
        subtitle: 'working on',
        rank: '5 mins',
        bgcolor: 'primary'
    },
    {
        icon: DatabaseIcon,
        title: 'Archived Data',
        subtitle: 'working on',
        rank: '10 mins',
        bgcolor: 'info'
    },
    {
        icon: PhoneIcon,
        title: 'Meeting with client',
        subtitle: 'pending',
        rank: '15 mins',
        bgcolor: 'warning'
    },
    {
        icon: ScreenShareIcon,
        title: 'Screening Task Team',
        subtitle: 'working on',
        rank: '20 mins',
        bgcolor: 'error'
    },
    {
        icon: MailIcon,
        title: 'Send envelope to John',
        subtitle: 'done',
        rank: '20 mins',
        bgcolor: 'success'
    }
];

/*--User Cards--*/
const userCards: userCard[] = [
    {
        title: 'Andrew Grant',
        subtitle: '3 mutual friends',
        avatar: user1,
        userGroup: [
            {
                icon: user1
            },
            {
                icon: user2
            },
            {
                icon: user3
            }
        ],
    },
    {
        title: 'Leo Pratt',
        subtitle: '3 mutual friends',
        avatar: user2,
        userGroup: [
            {
                icon: user1
            },
            {
                icon: user2
            },
            {
                icon: user3
            }
        ],
    },
    {
        title: 'Charles Nunez',
        subtitle: '3 mutual friends',
        avatar: user3,
        userGroup: [
            {
                icon: user1
            },
            {
                icon: user2
            },
            {
                icon: user3
            }
        ],
    },
    {
        title: 'Lora Powers',
        subtitle: '3 mutual friends',
        avatar: user4,
        userGroup: [
            {
                icon: user1
            },
            {
                icon: user2
            },
            {
                icon: user3
            }
        ],
    },
]

/*--Payment gateways--*/
const paymentGateways: paymentGateway[] = [
    {
        img: icon1,
        title: 'Paypal',
        subtitle: 'Big Brands',
        rank: '+$6,235',
        disable: '',
        bgcolor: "primary",
    },
    {
        img: icon2,
        title: 'Wallet',
        subtitle: 'Bill payment',
        rank: '+$345',
        disable: '',
        bgcolor: "error",
    },
    {
        img: icon3,
        title: 'Credit Card',
        subtitle: 'Money reversed',
        rank: '+$2,235',
        disable: '',
        bgcolor: "indigo",
    },
    {
        img: icon4,
        title: 'Bank Transfer',
        subtitle: 'Money added',
        rank: '-$320',
        disable: '',
        bgcolor: "success",
    },
    {
        img: icon5,
        title: 'Refund',
        subtitle: 'Bill Payment',
        rank: '-$32',
        disable: '',
        bgcolor: "warning",
    },
];

/*--Recent Transaction--*/
const recentTransaction: recentTrans[] = [
    {
        title: '09:30',
        subtitle: 'Payment received from John Doe of $385.90',
        textcolor: 'primary',
        boldtext: false,
        line: true,
        link: '',
        url: ''
    },
    {
        title: '10:00 am',
        subtitle: 'New sale recorded',
        textcolor: 'info',
        boldtext: true,
        line: true,
        link: '#ML-3467',
        url: ''
    },
    {
        title: '12:00 am',
        subtitle: 'Payment was made of $64.95 to Michael',
        textcolor: 'success',
        boldtext: false,
        line: true,
        link: '',
        url: ''
    },
    {
        title: '09:30 am',
        subtitle: 'New sale recorded',
        textcolor: 'warning',
        boldtext: true,
        line: true,
        link: '#ML-3467',
        url: ''
    },
    {
        title: '09:30 am',
        subtitle: 'New arrival recorded',
        textcolor: 'error',
        boldtext: true,
        line: true,
        link: '#ML-3467',
        url: ''
    },
    {
        title: '12:00 am',
        subtitle: 'Payment Done',
        textcolor: 'success',
        boldtext: false,
        line: false,
        link: '',
        url: ''
    },
]

const backIconData: backIcon[] = [
    {
        color: "bg-secondary",
        icon: LayoutGridIcon,
        title: "460",
        subtitle: "New Products",
    },
    {
        color: "bg-error",
        icon: ArchiveIcon,
        title: "50",
        subtitle: "Pending Apps",
    },
    {
        color: "bg-primary",
        icon: UserIcon,
        title: "80",
        subtitle: "Customers",
    },
    {
        color: "bg-success",
        icon: GiftIcon,
        title: "15",
        subtitle: "Birthday Gifts",
    },
    {
        color: "bg-warning",
        icon: CardboardsIcon,
        title: "1800",
        subtitle: "Total Budgets",
    },
    {
        color: "bg-info",
        icon: GitBranchIcon,
        title: "90",
        subtitle: "Best Designers",
    },
]

const imgCardData: imgCard[] = [
    {
        image: proimg1,
        color: "secondary",
      },
      {
        image: proimg2,
        color: "error",
      },
      {
        image: proimg4,
        color: "primary",
      },
]

/*--Top Cards --*/
const topCardsData: topCards[] = [
    {
        link: "/apps/user/profileone",
        img: card_icon1,
        title: "profile",
        number: "3,685",
        bgcolor: "lightprimary",
        textcolor: "primary"
    },
    {
        link: "/apps/blog/posts",
        img: card_icon2,
        title: "Blog",
        number: "256",
        bgcolor: "lightwarning",
        textcolor: "warning"
    },
    {
        link: "/apps/calendar",
        img: card_icon3,
        title: "Calender",
        number: "932",
        bgcolor: "lightinfo",
        textcolor: "info"
    },
    {
        link: "/apps/email",
        img: card_icon4,
        title: "Email",
        number: "$348K",
        bgcolor: "lighterror",
        textcolor: "error"
    },
    {
        link: "/apps/chats",
        img: card_icon5,
        title: "Chats",
        number: "96",
        bgcolor: "lightsuccess",
        textcolor: "success"
    },
    {
        link: "/apps/contacts",
        img: card_icon6,
        title: "Contacts",
        number: "48",
        bgcolor: "lightinfo",
        textcolor: "info"
    }
]

export { blogCard, followerCard, musicCard, productsCard, socialiconCard, profileCards, upcommingCards, userCards, paymentGateways, recentTransaction, backIconData,imgCardData,topCardsData }