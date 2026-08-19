import { Navigate, Route, Routes } from 'react'
import Layout from '../component/layout'
import Login from '../pages/Login'
import Register from '../pages/Register'
import Profile from '../pages/Profile'
import ProtectedRoute from './ProtectedRoute'
import RoleRoute from './RoleRoute'
import { useAuth } from '../app/store'

import AdminDashboard from '../pages/admin/AdminDashboard'
import Users from '../pages/admin/Users'
import Students from '../pages/admin/Students'
import Teachers from '../pages/admin/Teachers'
import Classes from '../pages/admin/Classes'
import Subjects from '../pages/admin/Subjects'
import ClassSubjects from '../pages/admin/ClassSubjects'
import Attendance from '../pages/admin/Attendance'

import TeacherDashboard from '../pages/teacher/TeacherDashboard'
import MyClasses from '../pages/teacher/MyClasses'
import TeacherSubjects from '../pages/teacher/TeacherSubjects'
import AttendanceSessions from '../pages/teacher/AttendanceSessions'
import CreateAttendanceSession from '../pages/teacher/CreateAttendanceSession'
import MarkAttendance from '../pages/teacher/MarkAttendance'
import TeacherAttendanceHistory from '../pages/teacher/AttendanceHistory'
import TeacherReports from '../pages/teacher/TeacherReports'

import StudentDashboard from '../pages/student/StudentDashboard'
import StudentAttendanceHistory from '../pages/student/AttendanceHistory'
import AttendanceSummary from '../pages/student/AttendanceSummary'
import StudentClasses from '../pages/student/StudentClasses'

import HeadTeacherDashboard from '../pages/head-teacher/HeadTeacherDashboard'
import AttendanceMonitoring from '../pages/head-teacher/AttendanceMonitoring'
import HeadTeacherClasses from '../pages/head-teacher/HeadTeacherClasses'
import HeadTeacherStudents from '../pages/head-teacher/HeadTeacherStudents'
import HeadTeacherTeachers from '../pages/head-teacher/HeadTeacherTeachers'
import HeadTeacherReports from '../pages/head-teacher/HeadTeacherReports'

function IndexRedirect() {
  const { user } = useAuth()
  const role = (user?.role || '').toLowerCase().replace('-', '_')

  if (role === 'admin') return <Navigate to="/dashboard" replace />
  if (role === 'head_teacher') return <Navigate to="/head-teacher/dashboard" replace />
  if (role === 'teacher') return <Navigate to="/teacher/dashboard" replace />
  return <Navigate to="/student/dashboard" replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route index element={<IndexRedirect />} />

          <Route element={<RoleRoute allowedRoles={['admin']} />}>
            <Route path="/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/students" element={<Students />} />
            <Route path="/admin/teachers" element={<Teachers />} />
            <Route path="/admin/classes" element={<Classes />} />
            <Route path="/admin/subjects" element={<Subjects />} />
            <Route path="/admin/class-subjects" element={<ClassSubjects />} />
            <Route path="/admin/attendance" element={<Attendance />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['head_teacher', 'head-teacher']} />}>
            <Route path="/head-teacher/dashboard" element={<HeadTeacherDashboard />} />
            <Route path="/head-teacher/attendance" element={<AttendanceMonitoring />} />
            <Route path="/head-teacher/monitoring" element={<AttendanceMonitoring />} />
            <Route path="/head-teacher/classes" element={<HeadTeacherClasses />} />
            <Route path="/head-teacher/students" element={<HeadTeacherStudents />} />
            <Route path="/head-teacher/teachers" element={<HeadTeacherTeachers />} />
            <Route path="/head-teacher/reports" element={<HeadTeacherReports />} />
            <Route path="/head-teacher/profile" element={<Profile />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['teacher']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/classes" element={<MyClasses />} />
            <Route path="/teacher/subjects" element={<TeacherSubjects />} />
            <Route path="/teacher/sessions" element={<AttendanceSessions />} />
            <Route path="/teacher/sessions/create" element={<CreateAttendanceSession />} />
            <Route path="/teacher/attendance" element={<MarkAttendance />} />
            <Route path="/teacher/attendance/history" element={<TeacherAttendanceHistory />} />
            <Route path="/teacher/reports" element={<TeacherReports />} />
            <Route path="/teacher/profile" element={<Profile />} />
          </Route>

          <Route element={<RoleRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/classes" element={<StudentClasses />} />
            <Route path="/student/subjects" element={<StudentClasses />} />
            <Route path="/student/attendance" element={<StudentAttendanceHistory />} />
            <Route path="/student/attendance/history" element={<StudentAttendanceHistory />} />
            <Route path="/student/attendance/summary" element={<AttendanceSummary />} />
            <Route path="/student/profile" element={<Profile />} />
          </Route>

          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRoutes
