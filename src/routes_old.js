// ✅ FINAL FILTERED routes.js FILE

import Default from "layouts/dashboards/default";
import NotificationBadgeIcon from "components/Sidebar/NotificationBadgeIcon";
import NotificationManagerBadgeIcon from "components/Sidebar/NotificationManagerBadgeIcon";
import NotificationTeamLeaderBadgeIcon from "components/Sidebar/NotificationTeamLeaderBadgeIcon";
import NotificationLeaveBadgeIcon from "components/Sidebar/NotificationLeaveBadgeIcon";

import ProjectsList from "layouts/projects/projects-list";
import ProjectsView from "layouts/projects/view";
import Studies from "layouts/projects/studies";

import EarlyLoginNotifications from "layouts/projects/admin";
import EarlyLoginManagerNotifications from "layouts/projects/managernotifications";
import EarlyLoginTeamLeaderNotifications from "layouts/projects/teamleadernotifications";
import LeaveApplyForm from "layouts/projects/leave/apply";
import LeaveHistory from "layouts/projects/leave/history";
import LeaveApprovalTable from "layouts/projects/leave/approve";
import MyAttendance from "layouts/projects/attendance/my";
import AllAttendance from "layouts/projects/attendance/all";
import MyBreaks from "layouts/projects/breaks/my";
import AllBreaks from "layouts/projects/breaks/all";

import UserList from "layouts/projects/users/list";
import AddUser from "layouts/projects/users/add";
import EditUser from "layouts/projects/users/edit";

import TeamLeaderList from "layouts/projects/teamleader/list";
import AddTeamLeader from "layouts/projects/teamleader/add";
import EditTeamLeader from "layouts/projects/teamleader/edit";

import ManagerList from "layouts/projects/manager/list";
import AddManager from "layouts/projects/manager/add";
import EditManager from "layouts/projects/manager/edit";

import PermissionsList from "layouts/projects/permissions/list";
import AddPermission from "layouts/projects/permissions/add";
import EditPermission from "layouts/projects/permissions/edit";

import BranchList from "layouts/projects/branch/list";
import TrashedBranchList from "layouts/projects/branch/trashed";
import AddBranch from "layouts/projects/branch/add";
import EditBranch from "layouts/projects/branch/edit";

import ShiftList from "layouts/projects/shifts/list";
import TrashedShiftList from "layouts/projects/shifts/trashed";
import AddShift from "layouts/projects/shifts/add";
import EditShift from "layouts/projects/shifts/edit";

import IdleLogs from "layouts/projects/idel-log";

import Logout from "layouts/projects/logout";

import SignInIllustration from "layouts/authentication/sign-in/illustration";
import SignUpIllustration from "layouts/authentication/sign-up/illustration";
import ResetIllustration from "layouts/authentication/reset-password/illustration";
import Error404 from "layouts/authentication/error/404";

import { Navigate } from "react-router-dom";
import Document from "examples/Icons/Document";

const routesArray = [
  {
    type: "route",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in/illustration",
    component: <SignInIllustration />,
    roles: [],
  },
  {
    type: "route",
    name: "Sign Up",
    key: "sign-up",
    route: "/authentication/sign-up/illustration",
    component: <SignUpIllustration />,
    roles: [],
  },
  {
    type: "route",
    name: "Reset Password",
    key: "reset-password",
    route: "/authentication/reset-password/illustration",
    component: <ResetIllustration />,
    roles: [],
  },
  {
    type: "route",
    name: "404",
    key: "error-404",
    route: "*",
    component: <Error404 />,
    roles: [],
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
        roles: ["Admin", "Manager", "Team Leader", "User"],
      },
    ],
    roles: ["Admin", "Manager", "Team Leader", "User"],
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
        roles: ["Admin", "Manager", "Team Leader", "User"],
      },
      {
        name: "View Project",
        key: "view-projects",
        route: "/projects/view/:id",
        component: <ProjectsView />,
        roles: ["Admin", "Manager", "Team Leader", "User"],
      },
    ],
    roles: ["Admin", "Manager", "Team Leader", "User"],
  },
  {
    type: "collapse",
    name: "Studies",
    key: "studies",
    icon: <Document size="12px" />,
    route: "/studies/:id?",
    component: <Studies />,
    noCollapse: true,
    roles: ["Admin", "Manager", "Team Leader", "User"],
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <NotificationBadgeIcon />,
    route: "/projects/admin",
    component: <EarlyLoginNotifications />,
    noCollapse: true,
    roles: ["Admin"],
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <NotificationManagerBadgeIcon />,
    route: "/projects/managernotifications",
    component: <EarlyLoginManagerNotifications />,
    noCollapse: true,
    roles: ["Manager"],
  },
  {
    type: "collapse",
    name: "Notifications",
    key: "notifications",
    icon: <NotificationTeamLeaderBadgeIcon />,
    route: "/projects/teamleadernotifications",
    component: <EarlyLoginTeamLeaderNotifications />,
    noCollapse: true,
    roles: ["Team Leader"],
  },
  {
    type: "collapse",
    name: "Leave",
    key: "leave-approvals",
    icon: <NotificationLeaveBadgeIcon />, // 🔔 Real-time leave icon
    route: "projects/leave/approvals",
    component: <LeaveApprovalTable />,
    noCollapse: true,
    roles: ["Admin", "Manager"],
  },
  {
    type: "collapse",
    name: "Apply Leave",
    key: "apply-leave",
    icon: <i className="ni ni-single-copy-04" />,
    route: "projects/leave/apply",
    component: <LeaveApplyForm />,
    noCollapse: true,
    roles: ["User", "Team Leader", "Manager"],
  },
  {
    type: "collapse",
    name: "My Leave History",
    key: "leave-history",
    icon: <i className="ni ni-single-copy-04" />,
    route: "projects/leave/history",
    component: <LeaveHistory/>,
    noCollapse: true,
    roles: ["User", "Team Leader", "Manager"],
  },
  {
    type: "collapse",
    name: "My Breaks",
    key: "my-breaks",
    icon: <i className="ni ni-single-copy-04" />,
    route: "projects/breaks/my",
    component: <MyBreaks />,
    noCollapse: true,
    roles: ["User", "Team Leader", "Manager"],
  },
  {
    type: "collapse",
    name: "All Breaks",
    key: "all-breaks",
    icon: <i className="ni ni-single-copy-04" />,
    route: "projects/breaks/all",
    component: <AllBreaks />,
    noCollapse: true,
    roles: ["Team Leader", "Manager", "Admin"],
  },
  {
    type: "collapse",
    name: "My Attendance",
    key: "my-attendance",
    icon: <i className="ni ni-single-copy-04" />,
    route: "projects/attendance/my",
    component: <MyAttendance />,
    noCollapse: true,
    roles: ["User", "Team Leader", "Manager"],
  },
  {
    type: "collapse",
    name: "All Attendance",
    key: "all-attendance",
    icon: <i className="ni ni-single-copy-04" />,
    route: "projects/attendance/all",
    component: <AllAttendance />,
    noCollapse: true,
    roles: ["Team Leader", "Manager", "Admin"],
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
        roles: ["Admin", "Manager"],
      },
      {
        name: "List",
        key: "user-list",
        route: "/projects/users/list",
        component: <UserList />,
        roles: ["Admin", "Manager"],
      },
    ],
    roles: ["Admin", "Manager"],
  },
  {
    type: "route",
    name: "Edit User",
    key: "edit-user",
    route: "/projects/users/edit/:id",
    component: <EditUser />,
    roles: ["Admin", "Manager"],
  },
  {
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
        roles: ["Admin", "Manager"],
      },
      {
        name: "List",
        key: "teamleader-list",
        route: "/projects/teamleader/list",
        component: <TeamLeaderList />,
        roles: ["Admin", "Manager"],
      },
    ],
    roles: ["Admin", "Manager"],
  },
  {
    type: "route",
    name: "Edit Team Leader",
    key: "edit-teamleader",
    route: "/projects/teamleader/edit/:id",
    component: <EditTeamLeader />,
    roles: ["Admin", "Manager"],
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
        roles: ["Admin"],
      },
      {
        name: "List",
        key: "manager-list",
        route: "/projects/manager/list",
        component: <ManagerList />,
        roles: ["Admin"],
      },
    ],
    roles: ["Admin"],
  },
  {
    type: "route",
    name: "Edit Manager",
    key: "edit-manager",
    route: "/projects/manager/edit/:id",
    component: <EditManager />,
    roles: ["Admin"],
  },
  {
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
        roles: ["Admin"],
      },
      {
        name: "List",
        key: "permission-list",
        route: "/projects/permissions/list",
        component: <PermissionsList />,
        roles: ["Admin"],
      },
    ],
    roles: ["Admin"],
  },
  {
    type: "route",
    name: "Edit Permission",
    key: "edit-permission",
    route: "/projects/permissions/edit/:id",
    component: <EditPermission />,
    roles: ["Admin"],
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
        route: "/projects/branches/add",
        component: <AddBranch />,
        roles: ["Admin"],
      },
      {
        name: "List",
        key: "branch-list",
        route: "/projects/branches",
        component: <BranchList />,
        roles: ["Admin"],
      },
      {
        name: "Trashed List",
        key: "trashed-branch-list",
        route: "/projects/branches/trashed",
        component: <TrashedBranchList />,
        roles: ["Admin"],
      },
    ],
    roles: ["Admin"],
  },
  {
    type: "route",
    name: "Edit Branch",
    key: "edit-branch",
    route: "/projects/branches/edit/:id",
    component: <EditBranch />,
    roles: ["Admin"],
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
        roles: ["Admin"],
      },
      {
        name: "List",
        key: "shift-list",
        route: "/projects/shifts",
        component: <ShiftList />,
        roles: ["Admin"],
      },
      {
        name: "Trashed List",
        key: "trashed-shift-list",
        route: "/projects/shifts/trashed",
        component: <TrashedShiftList />,
        roles: ["Admin"],
      },
    ],
    roles: ["Admin"],
  },
  {
    type: "route",
    name: "Edit Shift",
    key: "edit-shift",
    route: "/projects/shifts/edit/:id",
    component: <EditShift />,
    roles: ["Admin"],
  },
  {
    type: "collapse",
    name: "Idel Logs",
    key: "idel-logs",
    route: "/projects/idel-log",
    component: <IdleLogs />,
    noCollapse: true,
    roles: ["Admin", "Manager"],
  },
  {
    type: "collapse",
    name: "Logout",
    key: "logout",
    route: "/projects/logout",
    component: <Logout />,
    noCollapse: true,
    roles: ["Admin", "Manager"],
  },
];

export const routes = routesArray;

export function getRoutes(userRoles = []) {
  const checkRoleMatch = (routeRoles, userRoles) =>
    routeRoles?.some((role) => userRoles.includes(role));

  const isPublicAuthRoute = (route) =>
    route.route?.startsWith("/authentication") || route.route === "*";

  const filterRoutes = (routesList) =>
    routesList
      .filter((route) => {
        if (route.hidden) return false;
        if (isPublicAuthRoute(route)) return true;
        return !route.roles || checkRoleMatch(route.roles, userRoles);
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
