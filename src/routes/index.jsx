import Pages from "layouts/Pages/Pages.jsx";
import Dashboard from "layouts/Dashboard/Dashboard.jsx";

var indexRoutes = [
  { path: "/pages", name: "Pages", component: Pages, needAuth: false },
  { path: "/", name: "Home", component: Dashboard , needAuth: true},  
];

export default indexRoutes;
