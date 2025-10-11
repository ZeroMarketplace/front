const profile1 = '/images/profile/user1.jpg';
const profile2 = '/images/profile/user2.jpg';
const profile3 = '/images/profile/user3.jpg';
const profile4 = '/images/profile/user4.jpg';
const profile5 = '/images/profile/user5.jpg';

const profileImages = [
    { img: profile1 },
    { img: profile2 },
    { img: profile3 },
    { img: profile4 }
];

//Products Table
const product1 = '/images/products/product-5.png';
const product2 = '/images/products/product-6.png';
const product3 = '/images/products/product-7.png';
const product4 = '/images/products/product-9.png';
const product5 = '/images/products/product-8.png';
const product6 = '/images/products/product-9.png';


const ProductTableData = [
    {
        img: product1,
        name: 'iPhone 13 pro max-Pacific Blue-128GB storage',
        payment: '$180',
        paymentstatus: 'Partially paid',
        process: 45,
        processcolor: 'warning',
        statuscolor: 'indigo',
        statustext: 'Confirmed',
    },
    {
        img: product2,
        name: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
        payment: '$120',
        paymentstatus: 'Full paid',
        process: 100,
        processcolor: 'success',
        statuscolor: 'success',
        statustext: 'Confirmed',
    },
    {
        img: product3,
        name: 'PlayStation 5 DualSense Wireless Controller',
        payment: '$120',
        paymentstatus: 'Cancelled',
        process: 100,
        processcolor: 'error',
        statuscolor: 'error',
        statustext: 'Cancelled',
    },
    {
        img: product5,
        name: 'Amazon Basics Mesh, Mid-Back, Swivel Office',
        payment: '$120',
        paymentstatus: 'Partially paid',
        process: 45,
        processcolor: 'warning',
        statuscolor: 'indigo',
        statustext: 'Confirmed',
    },
    {
        img: product4,
        name: 'Sony X85J 75 Inch Sony 4K Ultra HD LED Smart',
        payment: '$120',
        paymentstatus: 'Full paid',
        process: 100,
        processcolor: 'success',
        statuscolor: 'success',
        statustext: 'Confirmed',
    },

]

/*Table Action*/
const tableActionData = [
    {
        listtitle: 'Add'
    },
    {
        listtitle: 'Edit'
    },
    {
        listtitle: 'Delete'
    }
]



const LatestReviewData = [
    {
        img: product1,
        name: 'iPhone 13 pro max-Pacific Blue-128GB storage',
        profile: profile1,
        customername: 'Arlene McCoy',
        customeremail: 'macoy@arlene.com',
        review: 3.5,
        reviewtext:'This theme is great. Clean and easy to understand. Perfect for those who don t havetime to',
        statuscolor: 'success',
        statustext: 'Confirmed',
        time: 'Nov 8'
    },
    {
        img: product2,
        name: 'Apple MacBook Pro 13 inch-M1-8/256GB-space',
        profile: profile2,
        customername: 'Jerome Bell',
        customeremail: 'belljerome@yahoo.com',
        review:4,
        reviewtext:'It is a Mac, after all. Once you have gone Mac,there s no going back. My first Maclastedover nine years',
        statuscolor: 'warning',
        statustext: 'Pending',
        time: 'Nov 8'
    },
    {
        img: product3,
        name: 'PlayStation 5 DualSense Wireless Controller',
        profile: profile3,
        customername: 'Jacob Jones',
        customeremail: 'jones009@hotmail.com',
        review:3.5,
        reviewtext:' The best experience we could hope for.Customer service team is amazing and thequality of their products',
        statuscolor: 'warning',
        statustext: 'Pending',
        time: 'Nov 8'
    },
    {
        img: product5,
        name: 'Amazon Basics Mesh, Mid-Back, Swivel Office',
        profile: profile4,
        customername: 'Annette Black',
        customeremail: 'blackanne@yahoo.com',
        review:3.5,
        reviewtext:' The controller is quite comfy for me. Despiteits increased size, the controller still fits well',
        statuscolor: 'success',
        statustext: 'Confirmed',
        time: 'Nov 8'
    },
    {
        img: product4,
        name: 'Sony X85J 75 Inch Sony 4K Ultra HD LED Smart',
        profile: profile5,
        customername: 'Albert Flores',
        customeremail: 'albertflo9@gmail.com',
        review:3.5,
        reviewtext:'This theme is great. Perfect for those whodon want have time to start everything from',
        statuscolor: 'warning',
        statustext: 'Pending',
        time: 'Nov 8'
    }
]



export { profileImages, ProductTableData, tableActionData, LatestReviewData }