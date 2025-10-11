import type { ProgressReport ,TeacherSkill,StudentProgressReport} from '@/types/components/school-pages/detail_tables';
const ProgressReportData: ProgressReport[] = [
    {
        code: 'M103',
        sub: 'Mathematics',
        marks: '90%',
        grad: 'A',
        remarks: 'Pass',
        statuscolor: 'success',
        remarkcolor: 'success',
    },
    {
        code: 'S221',
        sub: 'Science',
        marks: '70%',
        grad: 'B',
        remarks: 'Pass',
        statuscolor: 'warning',
        remarkcolor: 'success',
    },
    {
        code: 'E452',
        sub: 'English',
        marks: '50%',
        grad: 'C',
        remarks: 'Pass',
        statuscolor: 'error',
        remarkcolor:'success',
    },
    {
        code: 'B541',
        sub: 'Biology',
        marks: '25%',
        grad: 'E',
        remarks: 'Fail',
        statuscolor: 'primary',
        remarkcolor:'error',
    }
];

const TeacherSkillData: TeacherSkill[] = [
    {
        code: 'M103',
        sub: 'Mathematics',
        marks: '90%',
        grad: 'A',
        statuscolor: 'success',
    },
    {
        code: 'S221',
        sub: 'Science',
        marks: '70%',
        grad: 'B',
        statuscolor: 'warning',
    },
    {
        code: 'E452',
        sub: 'English',
        marks: '50%',
        grad: 'C',
        statuscolor: 'error',

    },
    {
        code: 'B541',
        sub: 'Biology',
        marks: '25%',
        grad: 'E',
        statuscolor: 'primary',
    }
];



const StudentProgressReportData: StudentProgressReport[] = [
    {
        code: 'M103',
        sub: 'Mathematics',
        marks: '90%',
        grad: 'A',
        remarks: 'Pass',
        statuscolor: 'success',
        remarkcolor: 'success',
    },
    {
        code: 'S221',
        sub: 'Science',
        marks: '70%',
        grad: 'B',
        remarks: 'Pass',
        statuscolor: 'warning',
        remarkcolor: 'success',
    },
    {
        code: 'E452',
        sub: 'English',
        marks: '50%',
        grad: 'C',
        remarks: 'Pass',
        statuscolor: 'error',
        remarkcolor:'success',
    },
    {
        code: 'B541',
        sub: 'Biology',
        marks: '25%',
        grad: 'E',
        remarks: 'Fail',
        statuscolor: 'primary',
        remarkcolor:'error',
    }
];
export { ProgressReportData,TeacherSkillData,StudentProgressReportData};
