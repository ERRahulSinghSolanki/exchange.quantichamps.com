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

import EarlyLoginNotifications from "layouts/admin";
import EarlyLoginManagerNotifications from "layouts/managernotifications";
import EarlyLoginTeamLeaderNotifications from "layouts/teamleadernotifications";
import LeaveApprovalTable from "layouts/leave/approve";
import LeaveApplyForm from "layouts/leave/apply";
import LeaveHistory from "layouts/leave/history";
import MyBreaks from "layouts/breaks/my";
import AllBreaks from "layouts/breaks/all";
import MyAttendance from "layouts/attendance/my";
import AllAttendance from "layouts/attendance/all";

import AddUser from "layouts/users/add";
import UserList from "layouts/users/list";
import EditUser from "layouts/users/edit";

import RolesList   from "layouts/roles/list";
import AddRole from "layouts/roles/add";
import RolePermissions from "layouts/roles/view";

import AddBranch from "layouts/branch/add";
import BranchList from "layouts/branch/list";
import TrashedBranchList from "layouts/branch/trashed";
import EditBranch from "layouts/branch/edit";

import AddShift from "layouts/shifts/add";
import ShiftList from "layouts/shifts/list";
import TrashedShiftList from "layouts/shifts/trashed";
import EditShift from "layouts/shifts/edit";

import IdleLogs from "layouts/idel-log";

import { Navigate } from "react-router-dom";
import Document from "examples/Icons/Document";

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
  name: "Notifications",
  key: "notifications-admin",
  icon: <NotificationBadgeIcon />,
  route: "/admin",
  component: <EarlyLoginNotifications />,
  noCollapse: true,
  permissions: ["viewAdminNotifications"],
},
{
  type: "collapse",
  name: "Notifications",
  key: "notifications-manager",
  icon: <NotificationManagerBadgeIcon />,
  route: "/managernotifications",
  component: <EarlyLoginManagerNotifications />,
  noCollapse: true,
  permissions: ["viewManagerNotifications"],
},
{
  type: "collapse",
  name: "Notifications",
  key: "notifications-teamleader",
  icon: <NotificationTeamLeaderBadgeIcon />,
  route: "/teamleadernotifications",
  component: <EarlyLoginTeamLeaderNotifications />,
  noCollapse: true,
  permissions: ["viewTeamLeaderNotifications"],
},
{
  type: "collapse",
  name: "Leave",
  key: "leave-approvals",
  icon: <NotificationLeaveBadgeIcon />,
  route: "/leave/approvals",
  component: <LeaveApprovalTable />,
  noCollapse: true,
  permissions: ["ApproveLeave"],
},
{
  type: "collapse",
  name: "Apply Leave",
  key: "apply-leave",
  icon: <Document size="12px" />,
  route: "/leave/apply",
  component: <LeaveApplyForm />,
  noCollapse: true,
  permissions: ["ApplyLeave"],
},
{
  type: "collapse",
  name: "My Leave History",
  key: "leave-history",
  icon: <Document size="12px" />,
  route: "/leave/history",
  component: <LeaveHistory />,
  noCollapse: true,
  permissions: ["viewLeaveHistory"],
},
{
  type: "collapse",
  name: "My Breaks",
  key: "my-breaks",
  icon: <Document size="12px" />,
  route: "/breaks/my",
  component: <MyBreaks />,
  noCollapse: true,
  permissions: ["viewMyBreaks"],
},
{
  type: "collapse",
  name: "All Breaks",
  key: "all-breaks",
  icon: <Document size="12px" />,
  route: "/breaks/all",
  component: <AllBreaks />,
  noCollapse: true,
  permissions: ["viewAllBreaks"],
},
{
  type: "collapse",
  name: "My Attendance",
  key: "my-attendance",
  icon: <Document size="12px" />,
  route: "/attendance/my",
  component: <MyAttendance />,
  noCollapse: true,
  permissions: ["viewMyAttendance"],
},
{
  type: "collapse",
  name: "All Attendance",
  key: "all-attendance",
  icon: <Document size="12px" />,
  route: "/attendance/all",
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
      route: "/users/add",
      component: <AddUser />,
      permissions: ["AddUser"],
    },
    {
      name: "List",
      key: "user-list",
      route: "/users/list",
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
  route: "/users/edit/:id",
  component: <EditUser />,
  permissions: ["EditUser"],
},
{
  type: "collapse",
  name: "Roles",
  key: "roles",
  icon: <Document size="12px" />,
  collapse: [
    {
      name: "New",
      key: "add-roles",
      route: "/roles/add",
      component: <AddRole />,
      permissions: ["AddRoles"],
    },
    {
      name: "List",
      key: "roles-list",
      route: "/roles/list",
      component: <RolesList />,
      permissions: ["viewRoles"],
    },
  ],
  permissions: ["Roles"],
  },
  {
        name: "View Permissions",
        key: "view-permissions",
        route: "/roles/view/:id",
        component: <RolePermissions />,
        permissions: ["viewPermissionByRole"],
  },
{
  type: "collapse",
  name: "Branch",
  key: "branches",
  icon: <Document size="12px" />,
  collapse: [
    {
      name: "New",
      key: "add-branch",
      route: "/branches/add",
      component: <AddBranch />,
      permissions: ["AddBranch"],
    },
    {
      name: "List",
      key: "branch-list",
      route: "/branches",
      component: <BranchList />,
      permissions: ["viewBranch"],
    },
    {
      name: "Trashed List",
      key: "trashed-branch-list",
      route: "/branches/trashed",
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
  route: "/branches/edit/:id",
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
      route: "/shifts/add",
      component: <AddShift />,
      permissions: ["AddShift"],
    },
    {
      name: "List",
      key: "shift-list",
      route: "/shifts",
      component: <ShiftList />,
      permissions: ["viewShift"],
    },
    {
      name: "Trashed List",
      key: "trashed-shift-list",
      route: "/shifts/trashed",
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
  route: "/shifts/edit/:id",
  component: <EditShift />,
  permissions: ["EditShift"],
},
{
  type: "collapse",
  name: "Idle Logs",
  key: "idel-logs",
  route: "/idel-log",
  icon: <Document size="12px" />,
  component: <IdleLogs />,
  noCollapse: true,
  permissions: ["viewIdleLogs"],
},

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
