import type { textCards, profileImg,projectTable } from '@/types/components/dashboards/dashboard';
import shape1 from '@/assets/images/svgs/warning-shap.svg';
import shape2 from '@/assets/images/svgs/danger-shap.svg';
import shape3 from '@/assets/images/svgs/info-shap.svg';


import profile1 from '@/assets/images/profile/user1.jpg';
import profile2 from '@/assets/images/profile/user2.jpg';
import profile3 from '@/assets/images/profile/user3.jpg';
import profile4 from '@/assets/images/profile/user4.jpg';
import profile5 from '@/assets/images/profile/user5.jpg';


/*--Blog Cards--*/
const textCardsData: textCards[] = [
  {
    icon: 'ruble-linear',
    num: '2358',
    percent: '+23%',
    title: "Sales",
    shape: shape1,
  },
  {
    icon: 'archive-down-minimlistic-line-duotone',
    num: '356',
    percent: '+8%',
    title: "Refunds",
    shape: shape2,
  },
  {
    icon: 'dollar-linear',
    num: '$23.8K',
    percent: '-3%',
    title: "Earnings",
    shape: shape3,
  },
  {
    icon: 'ruble-linear',
    num: '2358',
    percent: '+23%',
    title: "Sales",
    shape: shape1,
  },
];

const profileImgData: profileImg[] = [
  {
    img: profile4
  },
  {
    img: profile5
  },
  {
    img: profile3
  },
  {
    img: profile2
  }
];

const projectTableData: projectTable[] = [
  {
    img: profile1,
    activestate: "",
    leadname: "Mark J. Freeman",
    leademail: "Developer",
    projectname: "$80/hour",
    statuscolor: "success",
    statustext: "Available",
    skill: "HTML",
  },
  {
    img: profile4,
    activestate: "active",
    leadname: "Nina R. Oldman",
    leademail: "Designer",
    projectname: "$70/hour",
    statuscolor: "primary",
    statustext: "On Holiday",
    skill: "JavaScript",
  },
  {
    img: profile3,
    activestate: "",
    leadname: "Arya H. Shah",
    leademail: "Developer",
    projectname: "$40/hour",
    statuscolor: "error",
    statustext: "Absent",
    skill: "React",
  },
  {
    img: profile5,
    activestate: "",
    leadname: "June R. Smith",
    leademail: "Designer",
    projectname: "$20/hour",
    statuscolor: "warning",
    statustext: "On Leave",
    skill: "Vuejs",
  },
  {
    img: profile2,
    activestate: "",
    leadname: "Mark J. Freeman",
    leademail: "Developer",
    projectname: "$65/hour",
    statuscolor: "indigo",
    statustext: "Available",
    skill: "Angular",
  },
];
export { textCardsData, profileImgData,projectTableData }