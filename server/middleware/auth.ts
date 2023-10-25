import jwt from 'jsonwebtoken'
const runTimeConfiguration = useRuntimeConfig();

const pages = [
    'accounts',
    'admin-dashboard',
    'brands',
    'categories',
    'products',
    'properties',
    'purchase-invoices',
    'units',
    'warehouses',
    'dashboard',
];

const pagesPermissions = {
    admin: [
        '',
        'accounts',
        'admin-dashboard',
        'brands',
        'categories',
        'products',
        'properties',
        'purchase-invoices',
        'units',
        'warehouses'
    ],

    user: [
        '',
        'dashboard',
    ],

    guest: [
        ''
    ]
};

export default defineEventHandler(async (event) => {
    // remove tags and get page name
    let urlSections = getRequestURL(event).pathname.split('/');
    let page = urlSections[urlSections.length - 1];


    // requested a page
    if (pages.includes(page)) {

        // parse Cookies
        let cookies = parseCookies(event);

        // user has token
        if (cookies.user) {

            // get user cookie object
            let user = JSON.parse(cookies.user);

            if (user.token) {
                jwt.verify(user.token, runTimeConfiguration.TOKEN_SECRET, (err, userJWT) => {
                    // validate token
                    if (err) {
                        throw createError({
                            statusCode: 401
                        });
                    }

                    // verified
                    // @ts-ignore
                    if (!pagesPermissions[userJWT.data.role].includes(page)) {
                        throw createError({
                            statusCode: 403,
                            message: 'Permission Denied'
                        });
                    }
                });
            } else {
                // guest
                if (!pagesPermissions.guest.includes(page)) {
                    throw createError({
                        statusCode: 403,
                        message: 'Permission Denied'
                    });
                }
            }
        } else {
            // guest
            if (!pagesPermissions.guest.includes(page)) {
                throw createError({
                    statusCode: 403,
                    message: 'Permission Denied'
                });
            }
        }
    }
})