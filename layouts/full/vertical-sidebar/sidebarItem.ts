export interface menu {
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
  color?: string;
}

const sidebarItem: menu[] = [
    // Dashboard
    { header: 'داشبورد' },
    {
        title: 'داشبورد',
        icon: 'tabler:layout-dashboard-filled',
        to: '/admin-dashboard',
        BgColor: 'primary',
    },
    
    // Transactions (معامله)
    {
        title: 'معامله',
        icon: 'tabler:chart-line',
        BgColor: 'error',
        children: [
            {
                title: 'فاکتور فروش',
                icon: 'tabler:receipt',
                to: '/sales-invoices'
            },
            {
                title: 'فاکتور خرید',
                icon: 'tabler:receipt-2',
                to: '/purchase-invoices'
            },
            {
                title: 'برگشت از فروش',
                icon: 'tabler:arrow-back-up',
                to: '/sales-returns'
            },
            {
                title: 'برگشت از خرید',
                icon: 'tabler:arrow-forward-up',
                to: '/purchase-returns'
            },
            {
                title: 'سفارش',
                icon: 'tabler:shopping-cart',
                to: '/orders'
            },
            {
                title: 'گزارش فروش‌ها',
                icon: 'tabler:chart-line',
                to: '/reports/sales'
            },
            {
                title: 'گزارش خریدها',
                icon: 'tabler:chart-bar',
                to: '/reports/purchases'
            },
            {
                title: 'گزارش برگشت از فروش',
                icon: 'tabler:file-chart',
                to: '/reports/sales-returns'
            },
            {
                title: 'گزارش برگشت از خرید',
                icon: 'tabler:file-analytics',
                to: '/reports/purchase-returns'
            },
            {
                title: 'گزارش سفارش',
                icon: 'tabler:clipboard-text',
                to: '/reports/orders'
            },
        ]
    },
    
    // People/Contacts (اشخاص)
    {
        title: 'اشخاص',
        icon: 'tabler:users',
        BgColor: 'success',
        children: [
            {
                title: 'تعریف اشخاص',
                icon: 'tabler:user-plus',
                to: '/contacts'
            },
            // {
            //     title: 'تسویه حساب اشخاص',
            //     icon: 'tabler:cash',
            //     to: '/contacts/settlements'
            // },
            {
                title: 'گزارش لیست مشتریان',
                icon: 'tabler:list',
                to: '/reports/customers'
            },
            {
                title: 'گزارش تفصیلی مشتری',
                icon: 'tabler:file-text',
                to: '/reports/customer-details'
            },
        ]
    },
    
    // Products (کالا)
    { header: 'کالا' },
    {
        title: 'کالا',
        icon: 'tabler:package',
        BgColor: 'info',
        children: [
            {
                title: 'تعریف کالا',
                icon: 'tabler:square-plus',
                to: '/products'
            },
            {
                title: 'تعریف دسته‌بندی کالا',
                icon: 'tabler:category',
                to: '/categories'
            },
            {
                title: 'گزارش موجودی کالا',
                icon: 'tabler:clipboard-list',
                to: '/inventories'
            },
            {
                title: 'گزارش کاردکس کالا',
                icon: 'tabler:book',
                to: '/reports/product-ledger'
            },
            {
                title: 'گزارش ماهیانه کالا',
                icon: 'tabler:calendar-month',
                to: '/reports/monthly-products'
            },
            {
                title: 'گزارش لیست کالا',
                icon: 'tabler:list-check',
                to: '/reports/products-list'
            },
        ]
    },

    // Warehouse (انبار)
    {
        title: 'انبار',
        icon: 'tabler:building-warehouse',
        BgColor: 'secondary',
        children: [
            {
                title: 'تعریف انبار',
                icon: 'tabler:home-plus',
                to: '/warehouses'
            },
            {
                title: 'عملیات انبار',
                icon: 'tabler:settings',
                to: '/warehouse-operations'
            },
            {
                title: 'گزارش موجودی کالا',
                icon: 'tabler:clipboard-list',
                to: '/reports/warehouse-inventory'
            },
            {
                title: 'گزارش ارزش ریالی کالا',
                icon: 'tabler:currency-dollar',
                to: '/reports/inventory-value'
            },
            {
                title: 'گزارش کاردکس کالا',
                icon: 'tabler:book-2',
                to: '/reports/warehouse-ledger'
            },
            {
                title: 'گزارش ماهیانه کالا',
                icon: 'tabler:calendar',
                to: '/reports/warehouse-monthly'
            },
        ]
    },

    // Settings (تنظیمات)
    { header: 'تنظیمات' },
    {
        title: 'تنظیمات',
        icon: 'tabler:settings',
        BgColor: 'info',
        children: [
            {
                title: 'تعریف واحدها',
                icon: 'tabler:scale',
                to: '/units'
            },
            {
                title: 'تعریف برند',
                icon: 'tabler:tag',
                to: '/brands'
            },
            {
                title: 'ویژگی‌ها',
                icon: 'tabler:list-details',
                to: '/properties'
            },
        ]
    },
    
    // Bank/Cash (بانک / صندوق‌ها)
    {
        title: 'بانک / صندوق‌ها',
        icon: 'tabler:building-bank',
        BgColor: 'primary',
        children: [
            {
                title: 'تعریف بانک',
                icon: 'tabler:building-bank',
                to: '/accounts'
            },
            {
                title: 'تعریف صندوق',
                icon: 'tabler:cash-register',
                to: '/cash-registers'
            },
            {
                title: 'واریز به بانک',
                icon: 'tabler:arrow-down-circle',
                to: '/bank-deposits'
            },
            {
                title: 'انتقال از صندوق به صندوق',
                icon: 'tabler:arrows-exchange',
                to: '/cash-transfers'
            },
            {
                title: 'انتقال از بانک به صندوق',
                icon: 'tabler:arrow-right-circle',
                to: '/bank-to-cash'
            },
            {
                title: 'انتقال از بانک به بانک',
                icon: 'tabler:transfer',
                to: '/bank-to-bank'
            },
            {
                title: 'گزارش موجودی بانک‌ها',
                icon: 'tabler:chart-dots',
                to: '/reports/bank-balance'
            },
            {
                title: 'گزارش موجودی صندوق‌ها',
                icon: 'tabler:chart-area',
                to: '/reports/cash-balance'
            },
            {
                title: 'گزارش تفصیلی صندوق',
                icon: 'tabler:file-description',
                to: '/reports/cash-details'
            },
            {
                title: 'گزارش تفصیلی بانک',
                icon: 'tabler:file-invoice',
                to: '/reports/bank-details'
            }
        ]
    },
    
    // Expense/Income (هزینه / درآمد)
    {
        title: 'هزینه / درآمد',
        icon: 'tabler:coin',
        BgColor: 'error',
        children: [
            {
                title: 'اضافات و کسورات',
                icon: 'tabler:cash-off',
                to: '/add-and-subtract'
            },
            {
                title: 'تعریف درآمد',
                icon: 'tabler:cash',
                to: '/income-types'
            },
            {
                title: 'ثبت هزینه',
                icon: 'tabler:circle-minus',
                to: '/expenses'
            },
            {
                title: 'ثبت درآمد',
                icon: 'tabler:circle-plus',
                to: '/incomes'
            },
            {
                title: 'گزارش هزینه‌ها',
                icon: 'tabler:trending-down',
                to: '/reports/expenses'
            },
            {
                title: 'گزارش درآمدها',
                icon: 'tabler:trending-up',
                to: '/reports/incomes'
            },
        ]
    },
    
    // Accounting (حسابداری)
    { header: 'حسابداری' },
    {
        title: 'حسابداری',
        icon: 'tabler:calculator',
        BgColor: 'success',
        children: [
            {
                title: 'گزارش تفصیلی سود و زیان',
                icon: 'tabler:file-chart',
                to: '/commodity-profits'
            },
            {
                title: 'گزارش سود گروه‌ها',
                icon: 'tabler:chart-pie',
                to: '/reports/group-profits'
            },
            {
                title: 'گزارش سود و زیان کالا',
                icon: 'tabler:chart-line',
                to: '/reports/product-profits'
            },
            {
                title: 'گزارش آماری',
                icon: 'tabler:chart-bar',
                to: '/reports/statistics'
            },
            {
                title: 'اسناد حسابداری ',
                icon: 'tabler:chart-bar',
                to: '/accounting-documents'
            },
        ]
    },
];

export default sidebarItem;
