
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import StudentHomework from './pages/student/StudentHomework';
import StudentWorksheet from './pages/student/StudentWorksheet';
import DoubtChat from './pages/student/DoubtChat';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import ManageAssignments from './pages/teacher/ManageAssignments';
import ViewSubmissions from './pages/teacher/ViewSubmissions';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageStudents from './pages/admin/ManageStudents';
import ManageTeachers from './pages/admin/ManageTeachers';
import StudentLayout from './components/layout/StudentLayout';
import TeacherLayout from './components/layout/TeacherLayout';
import AdminLayout from './components/layout/AdminLayout';
import { Role } from './types';
import AssignmentView from './pages/student/AssignmentView';
import WorksheetView from './pages/student/WorksheetView';

const PrivateRoute: React.FC<{ children: React.ReactElement; roles: Role[] }> = ({ children, roles }) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" />;
    }
    if (!roles.includes(user.role)) {
        return <Navigate to="/login" />;
    }
    return children;
};

const AppRoutes: React.FC = () => {
    const { user } = useAuth();

    return (
        <Routes>
            <Route path="/login" element={<Login />} />

            {/* Student Routes */}
            <Route path="/student" element={<PrivateRoute roles={[Role.STUDENT]}><StudentLayout /></PrivateRoute>}>
                <Route path="dashboard" element={<StudentDashboard />} />
                <Route path="homework" element={<StudentHomework />} />
                <Route path="homework/:id" element={<AssignmentView type="homework" />} />
                <Route path="worksheets" element={<StudentWorksheet />} />
                <Route path="worksheets/:id" element={<WorksheetView />} />
                <Route path="doubts" element={<DoubtChat />} />
                <Route index element={<Navigate to="dashboard" />} />
            </Route>

            {/* Teacher Routes */}
            <Route path="/teacher" element={<PrivateRoute roles={[Role.TEACHER]}><TeacherLayout /></PrivateRoute>}>
                <Route path="dashboard" element={<TeacherDashboard />} />
                <Route path="assignments" element={<ManageAssignments />} />
                <Route path="submissions/:assignmentId" element={<ViewSubmissions />} />
                <Route index element={<Navigate to="dashboard" />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute roles={[Role.ADMIN]}><AdminLayout /></PrivateRoute>}>
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="students" element={<ManageStudents />} />
                <Route path="teachers" element={<ManageTeachers />} />
                <Route index element={<Navigate to="dashboard" />} />
            </Route>

            <Route path="*" element={<Navigate to={user ? `/${user.role}/dashboard` : "/login"} />} />
        </Routes>
    );
};

const App: React.FC = () => {
    return (
        <AuthProvider>
            <HashRouter>
                <AppRoutes />
            </HashRouter>
        </AuthProvider>
    );
};

export default App;
