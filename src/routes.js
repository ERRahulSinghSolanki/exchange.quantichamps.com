// ✅ FINAL PERMISSION-BASED routes.js FILE (PART 1 of 3)

import Default from "layouts/dashboards/default";
import NotificationBadgeIcon from "components/Sidebar/NotificationBadgeIcon";
import NotificationManagerBadgeIcon from "components/Sidebar/NotificationManagerBadgeIcon";
import NotificationTeamLeaderBadgeIcon from "components/Sidebar/NotificationTeamLeaderBadgeIcon";
import NotificationLeaveBadgeIcon from "components/Sidebar/NotificationLeaveBadgeIcon";

import ProjectsList from "layouts/projects/projects-list";
import ProjectsView from "layouts/projects/view";
import Studies from "layouts/projects/studies";

import SignInIllustration from "layouts/authentication/sign-in/illustration";
import SignUpIllustration from "layouts/authentication/sign-up/illustration";
import ResetIllustration from "layouts/authentication/reset-password/illustration";
import Error404 from "layouts/authentication/error/404";

import EarlyLoginNotifications from "layouts/projects/admin";
import EarlyLoginManagerNotifications from "layouts/projects/managernotifications";
import EarlyLoginTeamLeaderNotifications from "layouts/projects/teamleadernotifications";
import LeaveApprovalTable from "layouts/projects/leave/approve";
import LeaveApplyForm from "layouts/projects/leave/apply";
import LeaveHistory from "layouts/projects/leave/history";
import MyBreaks from "layouts/projects/breaks/my";
import AllBreaks from "layouts/projects/breaks/all";
import MyAttendance from "layouts/projects/attendance/my";
import AllAttendance from "layouts/projects/attendance/all";
import AttendanceSummary from "./layouts/attendance/component/attendancesummary";

import AddUser from "layouts/projects/users/add";
import UserList from "layouts/projects/users/list";
import EditUser from "layouts/projects/users/edit";
/* 
import AddTeamLeader from "layouts/projects/teamleader/add";
import TeamLeaderList from "layouts/projects/teamleader/list";
import EditTeamLeader from "layouts/projects/teamleader/edit";

import AddManager from "layouts/projects/manager/add";
import ManagerList from "layouts/projects/manager/list";
import EditManager from "layouts/projects/manager/edit"; */

import RolesList   from "layouts/projects/roles/list";
import AddRole from "layouts/projects/roles/add";
import RolePermissions from "layouts/projects/roles/view";

import AddPermission from "layouts/projects/permissions/add";
import PermissionsList from "layouts/projects/permissions/list";
import EditPermission from "layouts/projects/permissions/edit";

import AddBranch from "layouts/projects/branch/add";
import BranchList from "layouts/projects/branch/list";
import TrashedBranchList from "layouts/projects/branch/trashed";
import EditBranch from "layouts/projects/branch/edit";

import AddShift from "layouts/projects/shifts/add";
import ShiftList from "layouts/projects/shifts/list";
import TrashedShiftList from "layouts/projects/shifts/trashed";
import EditShift from "layouts/projects/shifts/edit";

import IdleLogs from "layouts/projects/idel-log";
import Logout from "layouts/projects/logout";

import { Navigate } from "react-router-dom";
import Document from "examples/Icons/Document";

//Imports by Monika
import LeaveSummary from "layouts/leavetracker/components/leavesummary";
import InterviewEvaluationForm from "layouts/forms/interviewevaluationform";
import JobApplicationForm from "layouts/forms/jobapplicationform";

const routesArray = [
  {
    type: "route",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in/illustration",
    component: <SignInIllustration />,
  },
  {
    type: "route",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up/illustration",
    component: <SignUpIllustration />,
  },
  {
    type: "route",
    name: "Reset Password",
    key: "reset-password",
    route: "/authentication/reset-password/illustration",
    component: <ResetIllustration />,
  },
  {
    type: "route",
    name: "404",
    key: "error-404",
    route: "*",
    component: <Error404 />,
  },
  {
    type: "collapse",
    name: "Dashboards",
    key: "dashboards",
    icon: <Document size="12px" />,
    collapse: [
      {
        name: "Default",
        key: "default",
        route: "/dashboards/default",
        component: <Default />,
        permissions: ["viewDashboard"],
      },
    ],
    permissions: ["Dashboard"],
  },
  {
    type: "collapse",
    name: "Projects",
    key: "projects",
    icon: <Document size="12px" />,
    collapse: [
      {
        name: "All Projects",
        key: "all-projects",
        route: "/projects/list",
        component: <ProjectsList />,
        permissions: ["viewProjects"],
      },
    ],
  permissions: ["Projects"],
  },
      {
        name: "View Project",
        key: "view-projects",
        route: "/projects/view/:id",
        component: <ProjectsView />,
        permissions: ["viewProjectsById"],
      },
    
  
  {
    type: "collapse",
    name: "Studies",
    key: "studies",
    icon: <Document size="12px" />,
    route: "/studies/:id?",
    component: <Studies />,
    noCollapse: true,
    permissions: ["viewStudies"],
  },
   {
    type: "collapse",
    name: "Attendance",
    key: "attendance",
    route:"/attendance/component/attendancesummary",
    icon: <Document size="12px" />,
    component: <AttendanceSummary />,
    noCollapse: true,
  },
  {
  type: "collapse",
  name: "Notifications",
  key: "notifications-admin",
  icon: <NotificationBadgeIcon />,
  route: "/projects/admin",
  component: <EarlyLoginNotifications />,
  noCollapse: true,
  permissions: ["viewAdminNotifications"],
},
{
  type: "collapse",
  name: "Notifications",
  key: "notifications-manager",
  icon: <NotificationManagerBadgeIcon />,
  route: "/projects/managernotifications",
  component: <EarlyLoginManagerNotifications />,
  noCollapse: true,
  permissions: ["viewManagerNotifications"],
},
{
  type: "collapse",
  name: "Notifications",
  key: "notifications-teamleader",
  icon: <NotificationTeamLeaderBadgeIcon />,
  route: "/projects/teamleadernotifications",
  component: <EarlyLoginTeamLeaderNotifications />,
  noCollapse: true,
  permissions: ["viewTeamLeaderNotifications"],
},
{
  type: "collapse",
  name: "Leave",
  key: "leave-approvals",
  icon: <NotificationLeaveBadgeIcon />,
  route: "/projects/leave/approvals",
  component: <LeaveApprovalTable />,
  noCollapse: true,
  permissions: ["ApproveLeave"],
},
{
  type: "collapse",
  name: "Apply Leave",
  key: "apply-leave",
  icon: <Document size="12px" />,
  route: "/projects/leave/apply",
  component: <LeaveApplyForm />,
  noCollapse: true,
  permissions: ["ApplyLeave"],
},
{
  type: "collapse",
  name: "My Leave History",
  key: "leave-history",
  icon: <Document size="12px" />,
  route: "/projects/leave/history",
  component: <LeaveHistory />,
  noCollapse: true,
  permissions: ["viewLeaveHistory"],
},
{
  type: "collapse",
  name: "My Breaks",
  key: "my-breaks",
  icon: <Document size="12px" />,
  route: "/projects/breaks/my",
  component: <MyBreaks />,
  noCollapse: true,
  permissions: ["viewMyBreaks"],
},
{
  type: "collapse",
  name: "All Breaks",
  key: "all-breaks",
  icon: <Document size="12px" />,
  route: "/projects/breaks/all",
  component: <AllBreaks />,
  noCollapse: true,
  permissions: ["viewAllBreaks"],
},
{
  type: "collapse",
  name: "My Attendance",
  key: "my-attendance",
  icon: <Document size="12px" />,
  route: "/projects/attendance/my",
  component: <MyAttendance />,
  noCollapse: true,
  permissions: ["viewMyAttendance"],
},
{
  type: "collapse",
  name: "All Attendance",
  key: "all-attendance",
  icon: <Document size="12px" />,
  route: "/projects/attendance/all",
  component: <AllAttendance />,
  noCollapse: true,
  permissions: ["viewAllAttendance"],
},
{
  type: "collapse",
  name: "User",
  key: "users",
  icon: <Document size="12px" />,
  collapse: [
    {
      name: "New",
      key: "add-user",
      route: "/projects/users/add",
      component: <AddUser />,
      permissions: ["AddUser"],
    },
    {
      name: "List",
      key: "user-list",
      route: "/projects/users/list",
      component: <UserList />,
      permissions: ["viewUser"],
    },
  ],
  permissions: ["User"],
},
{
  type: "route",
  name: "Edit User",
  key: "edit-user",
  route: "/projects/users/edit/:id",
  component: <EditUser />,
  permissions: ["EditUser"],
},
/* {
  type: "collapse",
  name: "Team Leader",
  key: "teamleaders",
  icon: <Document size="12px" />,
  collapse: [
    {
      name: "New",
      key: "add-teamleader",
      route: "/projects/teamleader/add",
      component: <AddTeamLeader />,
      permissions: ["AddTeamLeader"],
    },
    {
      name: "List",
      key: "teamleader-list",
      route: "/projects/teamleader/list",
      component: <TeamLeaderList />,
      permissions: ["viewTeamLeader"],
    },
  ],
  permissions: ["TeamLeader"],
},
{
  type: "route",
  name: "Edit Team Leader",
  key: "edit-teamleader",
  route: "/projects/teamleader/edit/:id",
  component: <EditTeamLeader />,
  permissions: ["EditTeamLeader"],
},
{
  type: "collapse",
  name: "Manager",
  key: "manager",
  icon: <Document size="12px" />,
  collapse: [
    {
      name: "New",
      key: "add-manager",
      route: "/projects/manager/add",
      component: <AddManager />,
      permissions: ["AddManager"],
    },
    {
      name: "List",
      key: "manager-list",
      route: "/projects/manager/list",
      component: <ManagerList />,
      permissions: ["viewManager"],
    },
  ],
  permissions: ["Manager"],
},
{
  type: "route",
  name: "Edit Manager",
  key: "edit-manager",
  route: "/projects/manager/edit/:id",
  component: <EditManager />,
  permissions: ["EditManager"],
}, */
{
  type: "collapse",
  name: "Roles",
  key: "roles",
  icon: <Document size="12px" />,
  collapse: [
    {
      name: "New",
      key: "add-roles",
      route: "/projects/roles/add",
      component: <AddRole />,
      permissions: ["AddRoles"],
    },
    {
      name: "List",
      key: "roles-list",
      route: "/projects/roles/list",
      component: <RolesList />,
      permissions: ["viewRoles"],
    },
  ],
  permissions: ["Roles"],
  },
  {
        name: "View Permissions",
        key: "view-permissions",
        route: "/projects/roles/view/:id",
        component: <RolePermissions />,
        permissions: ["viewPermissionByRole"],
  },

/* {
  type: "collapse",
  name: "Permissions",
  key: "permissions",
  icon: <Document size="12px" />,
  collapse: [
    {
      name: "New",
      key: "add-permission",
      route: "/projects/permissions/add",
      component: <AddPermission />,
      permissions: ["AddPermission"],
    },
    {
      name: "List",
      key: "permission-list",
      route: "/projects/permissions/list",
      component: <PermissionsList />,
      permissions: ["viewPermission"],
    },
  ],
  permissions: ["Permission"],
},
{
  type: "route",
  name: "Edit Permission",
  key: "edit-permission",
  route: "/projects/permissions/edit/:id",
  component: <EditPermission />,
  permissions: ["EditPermission"],
}, */
{
  type: "collapse",
  name: "Branch",
  key: "branches",
  icon: <Document size="12px" />,
  collapse: [
    {
      name: "New",
      key: "add-branch",
      route: "/projects/branches/add",
      component: <AddBranch />,
      permissions: ["AddBranch"],
    },
    {
      name: "List",
      key: "branch-list",
      route: "/projects/branches",
      component: <BranchList />,
      permissions: ["viewBranch"],
    },
    {
      name: "Trashed List",
      key: "trashed-branch-list",
      route: "/projects/branches/trashed",
      component: <TrashedBranchList />,
      permissions: ["viewTrashedBranch"],
    },
  ],
  permissions: ["Branch"],
},
{
  type: "route",
  name: "Edit Branch",
  key: "edit-branch",
  route: "/projects/branches/edit/:id",
  component: <EditBranch />,
  permissions: ["EditBranch"],
},
{
  type: "collapse",
  name: "Shift",
  key: "shifts",
  icon: <Document size="12px" />,
  collapse: [
    {
      name: "New",
      key: "add-shift",
      route: "/projects/shifts/add",
      component: <AddShift />,
      permissions: ["AddShift"],
    },
    {
      name: "List",
      key: "shift-list",
      route: "/projects/shifts",
      component: <ShiftList />,
      permissions: ["viewShift"],
    },
    {
      name: "Trashed List",
      key: "trashed-shift-list",
      route: "/projects/shifts/trashed",
      component: <TrashedShiftList />,
      permissions: ["viewTrashedShift"],
    },
  ],
  permissions: ["Shift"],
},
{
  type: "route",
  name: "Edit Shift",
  key: "edit-shift",
  route: "/projects/shifts/edit/:id",
  component: <EditShift />,
  permissions: ["EditShift"],
},
{
  type: "collapse",
  name: "Idle Logs",
  key: "idel-logs",
  route: "/projects/idel-log",
  icon: <Document size="12px" />,
  component: <IdleLogs />,
  noCollapse: true,
  permissions: ["viewIdleLogs"],
},
{
        type: "collapse",
        name: "LeaveTracker",
        key: "leave-tracker",
        icon: <Document size="12px" />,
         route: "/leavetracker/components/leavesummary",
         component: <LeaveSummary />,
         noCollapse: true,
      },
{
        type: "collapse",
        name: "Forms",
        key: "forms",
        icon: <Document size="12px" />,
        collapse: [
          {
            name: "Interview Evaluation Form",
            key: "interview-evaluation-form",
            route: "/forms/interviewevaluationform",
            component: <InterviewEvaluationForm />,
          },
          {
            name: "Job Application Form",
            key: "job-application-form",
            route: "/forms/jobapplicationform",
            component: <JobApplicationForm />,
          },
        ],
      },
/* {
  type: "collapse",
  name: "Logout",
  key: "logout",
  route: "/projects/logout",
  component: <Logout />,
  noCollapse: true,
  permissions: [], // Always visible when logged in
}, */

];

export const routes = routesArray;

export function getRoutes(userPermissions = []) {
  const isPublicAuthRoute = (route) =>
    route.route?.startsWith("/authentication") || route.route === "*";

  const hasPermission = (required, userPerms) => {
    if (!required) return true;
    if (Array.isArray(required)) {
      return required.some((perm) => userPerms.includes(perm));
    }
    return userPerms.includes(required);
  };

  const filterRoutes = (routesList) =>
    routesList
      .filter((route) => {
        if (route.hidden) return false;
        if (isPublicAuthRoute(route)) return true;
        return hasPermission(route.permissions, userPermissions);
      })
      .map((route) => {
        const newRoute = { ...route };
        if (route.collapse) {
          newRoute.collapse = filterRoutes(route.collapse);
        }
        return newRoute;
      });

  return filterRoutes(routesArray);
}
