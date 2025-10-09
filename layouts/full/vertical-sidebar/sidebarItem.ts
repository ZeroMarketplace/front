interface menu {
    header?: string;
    title?: string;
    icon?: any;
    to?: string;
    chip?: string;
    BgColor?: string;
    chipBgColor?: string;
    chipColor?: string;
    chipVariant?: string;
    chipIcon?: string;
    children?: menu[];
    disabled?: boolean;
    type?: string;
    subCaption?: string;
}

const sidebarItem: menu[] = [
    // Dashboard
    {
        title: 'داشبورد',
        icon: 'view-dashboard',
        to: '/admin-dashboard',
    },
    
    // Transactions (معامله)
    {
        title: 'معامله',
        icon: 'swap-horizontal',
        children: [
            {
                title: 'فاکتور فروش',
                icon: 'receipt',
                to: '/sales-invoices'
            },
            {
                title: 'فاکتور خرید',
                icon: 'receipt-text',
                to: '/purchase-invoices'
            },
            {
                title: 'برگشت از فروش',
                icon: 'keyboard-return',
                to: '/sales-returns'
            },
            {
                title: 'برگشت از خرید',
                icon: 'undo-variant',
                to: '/purchase-returns'
            },
            {
                title: 'سفارش',
                icon: 'cart-outline',
                to: '/orders'
            },
            {
                title: 'گزارش فروش‌ها',
                icon: 'chart-line',
                to: '/reports/sales'
            },
            {
                title: 'گزارش خریدها',
                icon: 'chart-bar',
                to: '/reports/purchases'
            },
            {
                title: 'گزارش برگشت از فروش',
                icon: 'file-chart',
                to: '/reports/sales-returns'
            },
            {
                title: 'گزارش برگشت از خرید',
                icon: 'file-chart-outline',
                to: '/reports/purchase-returns'
            },
            {
                title: 'گزارش سفارش',
                icon: 'clipboard-text',
                to: '/reports/orders'
            },
        ]
    },
    
    // People/Contacts (اشخاص)
    {
        title: 'اشخاص',
        icon: 'account-group',
        children: [
            {
                title: 'تعریف اشخاص',
                icon: 'account-plus',
                to: '/contacts'
            },
            {
                title: 'تسویه حساب اشخاص',
                icon: 'cash-check',
                to: '/contacts/settlements'
            },
            {
                title: 'گزارش لیست مشتریان',
                icon: 'format-list-bulleted',
                to: '/reports/customers'
            },
            {
                title: 'گزارش تفصیلی مشتری',
                icon: 'file-document-outline',
                to: '/reports/customer-details'
            },
        ]
    },
    
    // Products (کالا)
    {
        title: 'کالا',
        icon: 'package-variant',
        children: [
            {
                title: 'تعریف کالا',
                icon: 'plus-box',
                to: '/products'
            },
            {
                title: 'تعریف دسته‌بندی کالا',
                icon: 'file-tree',
                to: '/categories'
            },
            {
                title: 'گزارش موجودی کالا',
                icon: 'clipboard-list',
                to: '/inventories'
            },
            {
                title: 'گزارش کاردکس کالا',
                icon: 'book-open-variant',
                to: '/reports/product-ledger'
            },
            {
                title: 'گزارش ماهیانه کالا',
                icon: 'calendar-month',
                to: '/reports/monthly-products'
            },
            {
                title: 'گزارش لیست کالا',
                icon: 'format-list-checkbox',
                to: '/reports/products-list'
            },
        ]
    },

    // Warehouse (انبار)
    {
        title: 'انبار',
        icon: 'warehouse',
        children: [
            {
                title: 'تعریف انبار',
                icon: 'home-plus',
                to: '/warehouses'
            },
            {
                title: 'عملیات انبار',
                icon: 'cog',
                to: '/warehouse-operations'
            },
            {
                title: 'گزارش موجودی کالا',
                icon: 'clipboard-list-outline',
                to: '/reports/warehouse-inventory'
            },
            {
                title: 'گزارش ارزش ریالی کالا',
                icon: 'currency-usd',
                to: '/reports/inventory-value'
            },
            {
                title: 'گزارش کاردکس کالا',
                icon: 'book-open-page-variant',
                to: '/reports/warehouse-ledger'
            },
            {
                title: 'گزارش ماهیانه کالا',
                icon: 'calendar-range',
                to: '/reports/warehouse-monthly'
            },
        ]
    },

    // Settings (تنظیمات)
    {
        title: 'تنظیمات',
        icon: 'cog-outline',
        children: [
            {
                title: 'تعریف واحدها',
                icon: 'scale-balance',
                to: '/units'
            },
            {
                title: 'تعریف برند',
                icon: 'tag',
                to: '/brands'
            },
            {
                title: 'ویژگی‌ها',
                icon: 'format-list-bulleted-square',
                to: '/properties'
            },
        ]
    },
    
    // Bank/Cash (بانک / صندوق‌ها)
    {
        title: 'بانک / صندوق‌ها',
        icon: 'bank',
        children: [
            {
                title: 'تعریف بانک',
                icon: 'bank-plus',
                to: '/accounts'
            },
            {
                title: 'تعریف صندوق',
                icon: 'cash-register',
                to: '/cash-registers'
            },
            {
                title: 'واریز به بانک',
                icon: 'bank-transfer-in',
                to: '/bank-deposits'
            },
            {
                title: 'انتقال از صندوق به صندوق',
                icon: 'swap-horizontal-circle',
                to: '/cash-transfers'
            },
            {
                title: 'انتقال از بانک به صندوق',
                icon: 'bank-transfer-out',
                to: '/bank-to-cash'
            },
            {
                title: 'انتقال از بانک به بانک',
                icon: 'bank-transfer',
                to: '/bank-to-bank'
            },
            {
                title: 'گزارش موجودی بانک‌ها',
                icon: 'chart-box',
                to: '/reports/bank-balance'
            },
            {
                title: 'گزارش موجودی صندوق‌ها',
                icon: 'chart-box-outline',
                to: '/reports/cash-balance'
            },
            {
                title: 'گزارش تفصیلی صندوق',
                icon: 'file-document',
                to: '/reports/cash-details'
            },
            {
                title: 'گزارش تفصیلی بانک',
                icon: 'file-document-outline',
                to: '/reports/bank-details'
            }
        ]
    },
    
    // Expense/Income (هزینه / درآمد)
    {
        title: 'هزینه / درآمد',
        icon: 'cash-multiple',
        children: [
            {
                title: 'تعریف هزینه',
                icon: 'cash-minus',
                to: '/add-and-subtract'
            },
            {
                title: 'تعریف درآمد',
                icon: 'cash-plus',
                to: '/income-types'
            },
            {
                title: 'ثبت هزینه',
                icon: 'minus-circle',
                to: '/expenses'
            },
            {
                title: 'ثبت درآمد',
                icon: 'plus-circle',
                to: '/incomes'
            },
            {
                title: 'گزارش هزینه‌ها',
                icon: 'chart-line-variant',
                to: '/reports/expenses'
            },
            {
                title: 'گزارش درآمدها',
                icon: 'chart-areaspline',
                to: '/reports/incomes'
            },
        ]
    },
    
    // Accounting (حسابداری)
    {
        title: 'حسابداری',
        icon: 'calculator',
        children: [
            {
                title: 'گزارش تفصیلی سود و زیان',
                icon: 'file-chart',
                to: '/commodity-profits'
            },
            {
                title: 'گزارش سود گروه‌ها',
                icon: 'chart-pie',
                to: '/reports/group-profits'
            },
            {
                title: 'گزارش سود و زیان کالا',
                icon: 'chart-timeline-variant',
                to: '/reports/product-profits'
            },
            {
                title: 'گزارش آماری',
                icon: 'chart-bar-stacked',
                to: '/reports/statistics'
            },
        ]
    },
];

export default sidebarItem;
