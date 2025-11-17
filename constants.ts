
import { Role } from "./types";

export const navLinks = {
    [Role.STUDENT]: [
        { name: 'Dashboard', path: '/student/dashboard' },
        { name: 'Homework', path: '/student/homework' },
        { name: 'Worksheets', path: '/student/worksheets' },
        { name: 'Doubt Solver', path: '/student/doubts' },
    ],
    [Role.TEACHER]: [
        { name: 'Dashboard', path: '/teacher/dashboard' },
        { name: 'Assignments', path: '/teacher/assignments' },
    ],
    [Role.ADMIN]: [
        { name: 'Dashboard', path: '/admin/dashboard' },
        { name: 'Manage Teachers', path: '/admin/teachers' },
        { name: 'Manage Students', path: '/admin/students' },
    ],
};
