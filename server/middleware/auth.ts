import jwt from 'jsonwebtoken'

const pages = [
    '',
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
        'index',
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
        'index',
        'dashboard',
    ],

    guest: [
        'index'
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
                jwt.verify(user.token, process.env.TOKEN_SECRET, (err, userJWT) => {
                    // validate token
                    if (err) throw createError({
                        statusCode: 403,
                        message: 'Permission Denied. You have to login first'
                    });

                    // verified
                    if (!pagesPermissions[userJWT.data.role].includes(page)) {
                        if (err) throw createError({
                            statusCode: 403,
                            message: 'Permission Denied. You have to login first'
                        });
                    } else {
                        console.log(page, 'get accessed!');
                    }
                });
            } else {
                // guest
                if (!pagesPermissions.guest.includes(page)) {
                    throw createError({
                        statusCode: 403,
                        message: 'Permission Denied. You have to login first'
                    });
                }
            }
        } else {
            // guest
            if (!pagesPermissions.guest.includes(page)) {
                throw createError({
                    statusCode: 403,
                    message: 'Permission Denied. You have to login first'
                });
            }
        }
    }
})