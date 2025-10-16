import {
  IconArchive as ArchiveIcon,
  IconBook2 as Book2Icon,
  IconBorderAll as BorderAllIcon,
  IconCircle as CircleIcon,
  IconFileDescription as FileDescriptionIcon,
  IconHome as HomeIcon,
  IconBrandAirtable as BrandAirtableIcon,
} from "@tabler/icons-vue";

export interface menu {
  header?: string;
  title?: string;
  icon?: any;
  to?: string;
  divider?: boolean;
  chip?: string;
  chipColor?: string;
  chipVariant?: string;
  chipIcon?: string;
  children?: menu[];
  disabled?: boolean;
  subCaption?: string;
  class?: string;
  extraclass?: string;
  type?: string;
  BgColor?: string;
}

const horizontalItems: menu[] = [
  {
    title: "Dashboard",
    icon: "screencast-2-linear",
    BgColor: "primary",

    children: [
      {
        title: "Dashboard",
      },
      {
        title: "Dashboard 2",
      },
    ],
  },
  {
    title: "Front Pages",
    icon: "home-angle-linear",

    children: [
      {
        title: "Homepage",
      },
      {
        title: "About Us",
      },
      {
        title: "Blog",
      },
      {
        title: "Blog Details",
      },
      {
        title: "Contact Us",
      },
      {
        title: "Portfolio",
      },
      {
        title: "Pricing",
      },
    ],
  },

  {
    title: "Apps",
    icon: "clapperboard-text-line-duotone",
    BgColor: "indigo",

    children: [
      {
        title: "Chats",
        icon: CircleIcon,
      },
      {
        title: "Blog",
        icon: CircleIcon,

        children: [
          {
            title: "Posts",
            icon: CircleIcon,
          },
          {
            title: "Detail",
            icon: CircleIcon,
          },
        ],
      },
      {
        title: "E-Commerce",
        icon: CircleIcon,

        children: [
          {
            title: "Shop One",
            icon: CircleIcon,
          },
          {
            title: "Shop Two",
            icon: CircleIcon,
          },
          {
            title: "Details One",
            icon: CircleIcon,
          },
          {
            title: "Details Two",
            icon: CircleIcon,
          },
          {
            title: "List",
            icon: CircleIcon,
          },
          {
            title: "Checkout",
            icon: CircleIcon,
          },
          {
            title: "Add Product",
            icon: CircleIcon,
          },
          {
            title: "Edit Product",
            icon: CircleIcon,
          },
        ],
      },
      {
        title: "User Profile",
        icon: CircleIcon,
        children: [
          {
            title: "Profile One",
            icon: CircleIcon,
          },
          {
            title: "Profile Two",
            icon: CircleIcon,
          },
        ],
      },
      {
        title: "Invoice",
        icon: CircleIcon,

        children: [
          {
            title: "List",
          },
          {
            title: "Details",
          },
          {
            title: "Create",
          },
          {
            title: "Edit",
          },
        ],
      },
      {
        title: "Email",
        icon: CircleIcon,
      },
      {
        title: "Notes",
        icon: CircleIcon,
      },
      {
        title: "Calendar",
        icon: CircleIcon,
      },
      {
        title: "Kanban",
        icon: CircleIcon,
      },
      {
        title: "Tickets",
        icon: CircleIcon,
      },
    ],
  },

  {
    title: "Pages",
    icon: "folder-with-files-line-duotone",
    BgColor: "error",
    children: [
      {
        title: "Pricing",
        icon: CircleIcon,
      },
      {
        title: "Account Setting",
        icon: CircleIcon,
      },
      {
        title: "FAQ",
        icon: CircleIcon,
      },
      {
        title: "Gallery Lightbox",
        icon: CircleIcon,
      },
      {
        title: "Search Results",
        icon: CircleIcon,
      },
      {
        title: "Social Contacts",
        icon: CircleIcon,
      },
      {
        title: "Treeview",
        icon: CircleIcon,
      },
      {
        title: "Widget",
        icon: CircleIcon,
        children: [
          {
            title: "Cards",
            icon: CircleIcon,
          },
          {
            title: "Banners",
            icon: CircleIcon,
          },
          {
            title: "Charts",
            icon: CircleIcon,
          },
        ],
      },
      {
        title: "UI",
        icon: CircleIcon,

        children: [
          {
            title: "Alert",
            icon: CircleIcon,
          },
          {
            title: "Accordion",
            icon: CircleIcon,
          },
          {
            title: "Avatar",
            icon: CircleIcon,
          },
          {
            title: "Chip",
            icon: CircleIcon,
          },
          {
            title: "Dialog",
            icon: CircleIcon,
          },
          {
            title: "List",
            icon: CircleIcon,
          },
          {
            title: "Menus",
            icon: CircleIcon,
          },
          {
            title: "Rating",
            icon: CircleIcon,
          },
          {
            title: "Tabs",
            icon: CircleIcon,
          },
          {
            title: "Tooltip",
            icon: CircleIcon,
          },
          {
            title: "Typography",
            icon: CircleIcon,
          },
        ],
      },
      {
        title: "Charts",
        icon: CircleIcon,

        children: [
          {
            title: "Line",
            icon: CircleIcon,
          },
          {
            title: "Gredient",
            icon: CircleIcon,
          },
          {
            title: "Area",
            icon: CircleIcon,
          },
          {
            title: "Candlestick",
            icon: CircleIcon,
          },
          {
            title: "Column",
            icon: CircleIcon,
          },
          {
            title: "Doughnut & Pie",
            icon: CircleIcon,
          },
          {
            title: "Radialbar & Radar",
            icon: CircleIcon,
          },
        ],
      },
      {
        title: "Auth",
        icon: CircleIcon,

        children: [
          {
            title: "Error",
            icon: CircleIcon,
          },
          {
            title: "Maintenance",
            icon: CircleIcon,
          },
          {
            title: "Login",
            icon: CircleIcon,

            children: [
              {
                title: "Side Login",
                icon: CircleIcon,
              },
              {
                title: "Boxed Login",
                icon: CircleIcon,
              },
            ],
          },
          {
            title: "Register",
            icon: CircleIcon,

            children: [
              {
                title: "Side Register",
                icon: CircleIcon,
              },
              {
                title: "Boxed Register",
                icon: CircleIcon,
              },
            ],
          },
          {
            title: "Forgot Password",
            icon: CircleIcon,

            children: [
              {
                title: "Side Forgot Password",
                icon: CircleIcon,
              },
              {
                title: "Boxed Forgot Password",
                icon: CircleIcon,
              },
            ],
          },
          {
            title: "Two Steps",
            icon: CircleIcon,

            children: [
              {
                title: "Side Two Steps",
                icon: CircleIcon,
              },
              {
                title: "Boxed Two Steps",
                icon: CircleIcon,
              },
            ],
          },
        ],
      },
      {
        title: "Teachers",
        icon: CircleIcon,

        children: [
          {
            title: "All Teachers",
            icon: CircleIcon,
          },
          {
            title: "Teachers Details",
            icon: CircleIcon,
          },
        ],
      },
      {
        title: "Exam",
        icon: CircleIcon,

        children: [
          {
            title: "Exam Schedule",
            icon: CircleIcon,
          },
          {
            title: "Exam Result",
            icon: CircleIcon,
          },
          {
            title: "Exam Result Details",
            icon: CircleIcon,
          },
        ],
      },
      {
        title: "Students",
        icon: CircleIcon,

        children: [
          {
            title: "All Students",
            icon: CircleIcon,
          },
          {
            title: "Students Details",
            icon: CircleIcon,
          },
        ],
      },
      {
        title: "Classes",
        icon: CircleIcon,
      },
      {
        title: "Attendance",
        icon: CircleIcon,
      },
    ],
  },
  {
    title: "Forms",
    icon: "file-line-duotone",
    BgColor: "success",

    children: [
      {
        title: "Form Elements",
        icon: CircleIcon,

        children: [
          {
            title: "Autocomplete",
            icon: CircleIcon,
          },
          {
            title: "Combobox",
            icon: CircleIcon,
          },
          {
            title: "Button",
            icon: CircleIcon,
          },
          {
            title: "Checkbox",
            icon: CircleIcon,
          },
          {
            title: "Custom Inputs",
            icon: CircleIcon,
          },
          {
            title: "File Inputs",
            icon: CircleIcon,
          },
          {
            title: "Radio",
            icon: CircleIcon,
          },
          {
            title: "Select",
            icon: CircleIcon,
          },
          {
            title: "Date Time",
            icon: CircleIcon,
          },
          {
            title: "Slider",
            icon: CircleIcon,
          },
          {
            title: "Switch",
            icon: CircleIcon,
          },
          {
            title: "Time Picker",
            icon: CircleIcon,
          },
          {
            title: "Stepper",
            icon: CircleIcon,
          },
        ],
      },
      {
        title: "Form Layout",
        icon: CircleIcon,
      },
      {
        title: "Form Horizontal",
        icon: CircleIcon,
      },
      {
        title: "Form Vertical",
        icon: CircleIcon,
      },
      {
        title: "Form Custom",
        icon: CircleIcon,
      },
      {
        title: "Form Validation",
        icon: CircleIcon,
      },
    ],
  },
  {
    title: "Tables",
    icon: "layers-minimalistic-line-duotone",
    BgColor: "warning",

    children: [
      {
        title: "Basic Table",
        icon: CircleIcon,
      },
      {
        title: "Dark Table",
        icon: CircleIcon,
      },
      {
        title: "Density Table",
        icon: CircleIcon,
      },
      {
        title: "Fixed Header Table",
        icon: CircleIcon,
      },
      {
        title: "Height Table",
        icon: CircleIcon,
      },
      {
        title: "Editable Table",
        icon: CircleIcon,
      },
    ],
  },
  {
    title: "Data Tables",
    BgColor: "secondary",
    icon: "database-outline",

    children: [
      {
        title: "Basic Table",
        icon: CircleIcon,
      },
      {
        title: "Header Table",
        icon: CircleIcon,
      },
      {
        title: "Selection Table",
        icon: CircleIcon,
      },
      {
        title: "Sorting Table",
        icon: CircleIcon,
      },
      {
        title: "Pagination Table",
        icon: CircleIcon,
      },
      {
        title: "Filtering Table",
        icon: CircleIcon,
      },
      {
        title: "Grouping Table",
        icon: CircleIcon,
      },
      {
        title: "Table Slots",
        icon: CircleIcon,
      },
      {
        title: "CRUD Table",
        icon: CircleIcon,
      },
    ],
  },
];

export default horizontalItems;
