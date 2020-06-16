import Dashboard from "views/Dashboard/Dashboard.jsx";
import CustomerPage from "views/Pages/CustomerPage.jsx";
import CommandPage from "views/Pages/CommandPage.jsx";
import TransfertPage from "views/Pages/TransfertPage.jsx";
import ChauffeurPage from "views/Pages/ChauffeurPage.jsx";
import CalendarPage from "views/Pages/CalendarPage.jsx";
import UserPage from "views/Pages/UserPage.jsx";
import ProfilePage from "views/Pages/ProfilePage.jsx";

// import pagesRoutes from "./pages.jsx";

var dashRoutes = [
    {
        path: "/dashboard",
        name: "Dashboard",
        icon: "design_app",
        component: Dashboard,
        roles: ["ROLE_ADMIN", "ROLE_CUSTOMER", "ROLE_CHAUFFEUR", "ROLE_USER"]
    },
    {
        path: "/customer-page",       // The customer page info that we've inserted into this site.
        name: "Customer Page",
        mini: "CS",
        icon: "users_circle-08",
        component: CustomerPage,
        roles: ["ROLE_ADMIN", "ROLE_CUSTOMER"]
    },
    {
        path: "/command-page/customer/:id",        // The command page info that we've inserted into this site.
        name: "Command Page",
        mini: "CM",
        icon: "design_image",
        hidden: true,
        component: CommandPage,
        roles: ["ROLE_ADMIN", "ROLE_CUSTOMER"]
    },
    {
        path: "/command-page",        // The command page info that we've inserted into this site.
        name: "Command Page",
        mini: "CM",
        icon: "shopping_tag-content",
        component: CommandPage,
        roles: ["ROLE_ADMIN", "ROLE_CUSTOMER"]
    },
    {
        path: "/transfert-page/order/:id",      // The transfert page info that we've inserted into this site.
        name: "Transfert Page",
        mini: "TF",
        icon: "design_image",
        hidden: true,
        component: TransfertPage,
        roles: ["ROLE_ADMIN", "ROLE_CUSTOMER"]
    },
    {
        path: "/transfert-page",      // The transfert page info that we've inserted into this site.
        name: "Transfert Page",
        mini: "TF",
        icon: "sport_user-run",
        component: TransfertPage,
        roles: ["ROLE_ADMIN", "ROLE_CUSTOMER", "ROLE_CHAUFFEUR", "ROLE_USER"]
    },
    {
        path: "/chauffeur-page",      // The chauffeur page info that we've inserted into this site.
        name: "Chauffeur Page",
        mini: "CF",
        icon: "objects_spaceship",
        component: ChauffeurPage,
        roles: ["ROLE_ADMIN"]
    },
    {
        path: "/calendar-page/chauffeur/:chauf_id",      // The transfert page info that we've inserted into this site.
        name: "Transfert calendar",
        mini: "TC",
        icon: "ui-1_calendar-60",
        hidden: true,
        component: CalendarPage,
        roles: ["ROLE_ADMIN", "ROLE_CUSTOMER"]
    },
    {
        path: "/calendar-page/order/:order_id",      // The transfert page info that we've inserted into this site.
        name: "Transfert calendar",
        mini: "TC",
        icon: "ui-1_calendar-60",
        hidden: true,
        component: CalendarPage,
        roles: ["ROLE_ADMIN", "ROLE_CUSTOMER"]
    },
    {
        path: "/calendar-page",      // The chauffeur page info that we've inserted into this site.
        name: "Transfert calendar",
        mini: "TC",
        icon: "ui-1_calendar-60",
        component: CalendarPage,
        roles: ["ROLE_ADMIN", "ROLE_CUSTOMER", "ROLE_CHAUFFEUR", "ROLE_USER"]
    },
    {
        path: "/user-page",      // The chauffeur page info that we've inserted into this site.
        name: "User Page",
        mini: "UP",
        icon: "users_single-02",
        component: UserPage,
        roles: ["ROLE_ADMIN"]
    },
    {
        path: "/profile-page",      // The chauffeur page info that we've inserted into this site.
        name: "Profile Page",
        mini: "PP",
        icon: "users_single-02",
        component: ProfilePage,
        hidden: true,
        roles: ["ROLE_ADMIN", "ROLE_CUSTOMER", "ROLE_CHAUFFEUR", "ROLE_USER"]
    },
    {redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard"}
];
export default dashRoutes;
