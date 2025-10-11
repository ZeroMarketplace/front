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
    {
        title: 'داشبورد',
        icon: 'view-dashboard',
        to: '/admin-dashboard',
        BgColor: 'primary',
    },
    
    // Transactions (معامله)
    {
        title: 'معامله',
        icon: 'swap-horizontal',
        BgColor: 'pink',
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
        BgColor: 'warning',
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
        BgColor: 'success',
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
        BgColor: 'secondary',
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
        BgColor: 'secondary-darken-1',
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
        BgColor: 'info',
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
        BgColor: 'primary',
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
        BgColor: 'ping',
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
// const sidebarItem: menu[] = [
//   {
//     title: "Dashboard2",
//     icon: "screencast-2-linear",
//     BgColor: "primary",
//   },
//   {
//     title: "Dashboard 2",
//     icon: "chart-line-duotone",
//     BgColor: "success",
//   },
//   {
//     title: "Front Pages",
//     icon: "home-angle-linear",
//     BgColor: "warning",
//     children: [
//       {
//         title: "Homepage",
//       },
//       {
//         title: "About Us",
//       },
//       {
//         title: "Blog",
//       },
//       {
//         title: "Blog Details",
//       },
//       {
//         title: "Contact Us",
//       },
//       {
//         title: "Portfolio",
//       },
//       {
//         title: "Pricing",
//       },
//     ],
//   },

//   { header: "Apps" },
//   {
//     title: "Contact",
//     icon: "phone-line-duotone",
//     BgColor: "secondary",
//   },

//   {
//     title: "Blog",
//     icon: "align-vertical-spacing-line-duotone",
//     BgColor: "warning",
//     children: [
//       {
//         title: "Posts",
//       },
//       {
//         title: "Detail",
//       },
//     ],
//   },
//   {
//     title: "E-Commerce",
//     icon: "smart-speaker-minimalistic-line-duotone",
//     BgColor: "indigo",
//     children: [
//       {
//         title: "Shop One",
//       },
//       {
//         title: "Shop Two",
//       },
//       {
//         title: "Details One",
//       },
//       {
//         title: "Details Two",
//       },
//       {
//         title: "List",
//       },
//       {
//         title: "Checkout",
//       },
//       {
//         title: "Add Product",
//       },
//       {
//         title: "Edit Product",
//       },
//     ],
//   },
//   {
//     title: "Chats",
//     icon: "chat-round-unread-line-duotone",
//     BgColor: "primary",
//   },
//   {
//     title: "User Profile",
//     icon: "user-rounded-line-duotone",
//     BgColor: "error",
//     children: [
//       {
//         title: "Profile One",
//       },
//       {
//         title: "Profile Two",
//       },
//     ],
//   },
//   {
//     title: "Invoice",
//     icon: "bill-check-outline",
//     BgColor: "success",
//     children: [
//       {
//         title: "List",
//       },
//       {
//         title: "Details",
//       },
//       {
//         title: "Create",
//       },
//       {
//         title: "Edit",
//       },
//     ],
//   },
//   {
//     title: "Notes",
//     icon: "notification-unread-line-duotone",
//     BgColor: "secondary",
//   },
//   {
//     title: "Calendar",
//     icon: "calendar-line-duotone",
//     BgColor: "info",
//   },
//   {
//     title: "Email",
//     BgColor: "error",
//     icon: "letter-linear",
//   },
//   {
//     title: "Kanban",
//     icon: "widget-4-linear",
//     BgColor: "warning",
//   },
//   {
//     title: "Tickets",
//     icon: "ticker-star-outline",
//     BgColor: "primary",
//   },
//   { header: "Pages" },
//   {
//     title: "Pricing",
//     icon: "tag-price-line-duotone",
//     BgColor: "warning",
//   },
//   {
//     title: "FAQ",
//     icon: "question-circle-line-duotone",
//     BgColor: "error",
//   },
//   {
//     title: "Account Setting",
//     icon: "settings-minimalistic-line-duotone",
//     BgColor: "success",
//   },
//   {
//     title: "Landing Page",
//     icon: "layers-minimalistic-line-duotone",
//     BgColor: "info",
//   },
//   {
//     title: "Gallery Lightbox",
//     icon: "gallery-minimalistic-outline",
//     BgColor: "warning",
//   },
//   {
//     title: "Search Results",
//     icon: "calendar-search-line-duotone",
//     BgColor: "success",
//   },
//   {
//     title: "Social Contacts",
//     icon: "socket-outline",
//     BgColor: "primary",
//   },
//   {
//     title: "Treeview",
//     icon: "transmission-line-duotone",
//     BgColor: "error",
//   },

//   {
//     title: "Widget",
//     icon: "widget-add-line-duotone",
//     BgColor: "primary",
//     children: [
//       {
//         title: "Cards",
//       },
//       {
//         title: "Banners",
//       },
//       {
//         title: "Charts",
//       },
//     ],
//   },

//   { header: "School Pages" },
//   {
//     title: "Teachers",
//     icon: "square-academic-cap-linear",
//     BgColor: "success",
//     children: [
//       {
//         title: "All Teachers",
//       },
//       {
//         title: "Teachers Details",
//       },
//     ],
//   },
//   {
//     title: "Exam",
//     icon: "notebook-minimalistic-outline",
//     BgColor: "warning",
//     children: [
//       {
//         title: "Exam Schedule",
//       },
//       {
//         title: "Exam Result",
//       },
//       {
//         title: "Exam Result Details",
//       },
//     ],
//   },
//   {
//     title: "Students",
//     icon: "case-broken",
//     BgColor: "error",
//     children: [
//       {
//         title: "All Students",
//       },
//       {
//         title: "Students Details",
//       },
//     ],
//   },
//   {
//     title: "Classes",
//     icon: "smart-home-broken",
//     BgColor: "indigo",
//   },
//   {
//     title: "Attendance",
//     icon: "diploma-linear",
//     BgColor: "info",
//   },
//   { header: "UI" },
//   {
//     title: "Ui Elements",
//     icon: "code-scan-line-duotone",
//     BgColor: "primary",
//     children: [
//       {
//         title: "Alert",
//       },
//       {
//         title: "Accordion",
//       },
//       {
//         title: "Avatar",
//       },
//       {
//         title: "Chip",
//       },
//       {
//         title: "Dialog",
//       },
//       {
//         title: "List",
//       },
//       {
//         title: "Menus",
//       },
//       {
//         title: "Rating",
//       },
//       {
//         title: "Tabs",
//       },
//       {
//         title: "Tooltip",
//       },
//       {
//         title: "Typography",
//       },
//     ],
//   },

//   { header: "Forms" },
//   {
//     title: "Form Elements",
//     icon: "widget-3-line-duotone",
//     BgColor: "secondary",
//     children: [
//       {
//         title: "Autocomplete",
//       },
//       {
//         title: "Combobox",
//       },
//       {
//         title: "Button",
//       },
//       {
//         title: "Checkbox",
//       },
//       {
//         title: "Custom Inputs",
//       },
//       {
//         title: "File Inputs",
//       },
//       {
//         title: "Radio",
//       },
//       {
//         title: "Date Time",
//       },
//       {
//         title: "Select",
//       },
//       {
//         title: "Slider",
//       },
//       {
//         title: "Switch",
//       },
//       {
//         title: "Time Picker",
//       },
//       {
//         title: "Stepper",
//       },
//     ],
//   },

//   {
//     title: "Form Input",
//     icon: "book-minimalistic-outline",
//     BgColor: "success",
//     children: [
//       {
//         title: "Form Layout",
//       },
//       {
//         title: "Form Horizontal",
//       },
//       {
//         title: "Form Vertical",
//       },
//       {
//         title: "Form Custom",
//       },
//       {
//         title: "Form Validation",
//       },
//     ],
//   },
//   {
//     title: "Editor",
//     icon: "gallery-edit-line-duotone",
//     BgColor: "warning",
//   },

//   { header: "Tables" },
//   {
//     title: "Basic Table",
//     icon: "tablet-line-duotone",
//     BgColor: "info",
//   },
//   {
//     title: "Dark Table",
//     icon: "bedside-table-2-linear",
//     BgColor: "success",
//   },
//   {
//     title: "Density Table",
//     icon: "password-minimalistic-input-linear",
//     BgColor: "error",
//   },
//   {
//     title: "Fixed Header Table",
//     icon: "align-left-line-duotone",
//     BgColor: "indigo",
//   },
//   {
//     title: "Height Table",
//     icon: "bookmark-square-minimalistic-outline",
//     BgColor: "warning",
//   },
//   {
//     title: "Editable Table",
//     icon: "pen-new-square-broken",
//     BgColor: "success",
//   },

//   { header: "Data Tables" },
//   {
//     title: "Basic Table",
//     icon: "database-outline",
//     BgColor: "primary",
//   },
//   {
//     title: "Header Table",
//     icon: "clapperboard-text-broken",
//     BgColor: "secondary",
//   },
//   {
//     title: "Selection Table",
//     icon: "documents-minimalistic-linear",
//     BgColor: "success",
//   },
//   {
//     title: "Sorting Table",
//     icon: "sort-from-bottom-to-top-linear",
//     BgColor: "error",
//   },
//   {
//     title: "Pagination Table",
//     icon: "programming-linear",
//     BgColor: "warning",
//   },
//   {
//     title: "Filtering Table",
//     icon: "filter-outline",
//     BgColor: "indigo",
//   },
//   {
//     title: "Grouping Table",
//     icon: "users-group-rounded-line-duotone",
//     BgColor: "info",
//   },
//   {
//     title: "Table Slots",
//     icon: "server-line-duotone",
//     BgColor: "error",
//   },
//   {
//     title: "CRUD Table",
//     icon: "medal-star-square-outline",
//     BgColor: "success",
//   },

//   { header: "Charts" },
//   {
//     title: "Apex Charts",
//     icon: "pie-chart-2-linear",
//     BgColor: "primary",
//     children: [
//       {
//         title: "Line",
//       },
//       {
//         title: "Gredient",
//       },
//       {
//         title: "Area",
//       },
//       {
//         title: "Candlestick",
//       },
//       {
//         title: "Column",
//       },
//       {
//         title: "Doughnut & Pie",
//       },
//       {
//         title: "Radialbar & Radar",
//       },
//     ],
//   },

//   { header: "Authentication" },

//   {
//     title: "Login",
//     icon: "login-2-line-duotone",
//     BgColor: "warning",
//     children: [
//       {
//         title: "Side Login",
//       },
//       {
//         title: "Boxed Login",
//       },
//     ],
//   },
//   {
//     title: "Register",
//     icon: "user-plus-line-duotone",
//     BgColor: "error",
//     children: [
//       {
//         title: "Side Register",
//       },
//       {
//         title: "Boxed Register",
//       },
//     ],
//   },
//   {
//     title: "Forgot Password",
//     icon: "forbidden-line-duotone",
//     BgColor: "indigo",
//     children: [
//       {
//         title: "Side Forgot Password",
//       },
//       {
//         title: "Boxed Forgot Password",
//       },
//     ],
//   },
//   {
//     title: "Two Steps",
//     icon: "users-group-two-rounded-line-duotone",
//     BgColor: "info",
//     children: [
//       {
//         title: "Side Two Steps",
//       },
//       {
//         title: "Boxed Two Steps",
//       },
//     ],
//   },

//   {
//     title: "Error",
//     icon: "bug-line-duotone",
//     BgColor: "error",
//   },
//   {
//     title: "Maintenance",
//     icon: "settings-line-duotone",
//     BgColor: "primary",
//   },
//   { header: "Icons" },
//   {
//     title: "Tabler Icons",
//     BgColor: "success",
//     icon: "sticker-smile-circle-2-line-duotone",
//   },
//   {
//     title: "Solar Icons",
//     BgColor: "primary",
//     icon: "sticker-smile-circle-2-line-duotone",
//   },

//   { header: "Others" },
//   {
//     title: "Menu Level",
//     icon: "double-alt-arrow-down-bold-duotone",
//     BgColor: "secondary",
//     children: [
//       {
//         title: "Level 1",
//       },
//       {
//         title: "Level 1",
//         children: [
//           {
//             title: "Level 2",
//           },
//           {
//             title: "Level 2",
//             children: [
//               {
//                 title: "Level 3",
//               },
//               {
//                 title: "Level 3",
//               },
//             ],
//           },
//         ],
//       },
//     ],
//   },
//   {
//     title: "Disabled",
//     icon: "forbidden-circle-line-duotone",
//     BgColor: "success",
//     disabled: true,
//   },
//   {
//     title: "Sub Caption",
//     BgColor: "warning",
//     icon: "square-academic-cap-line-duotone",
//     subCaption: "This is the subtitle",
//   },
//   {
//     title: "Chip",
//     icon: "archive-check-line-duotone",
//     chip: "9",
//     BgColor: "error",
//     chipColor: "error",
//     chipBgColor: "error",
//     chipVariant: "flat",
//   },
//   {
//     title: "Outlined",
//     icon: "smile-circle-line-duotone",
//     chip: "outline",
//     chipColor: "indigo",
//     chipVariant: "outlined",
//     BgColor: "indigo",
//   },
//   {
//     title: "External Link",
//     icon: "link-bold-duotone",
//     BgColor: "info",
//     type: "external",
//   },
// ];

export default sidebarItem;
