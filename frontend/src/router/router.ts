import Home from "../pages/Home";
import { Routing } from "../shared/interface/router";
/**
 * Constante que carga la configuración de cada path
 * de la plataforma para su renderizado dinamico en root
 * de la aplicación.
 */
const routeritems: Routing[] = [
  {
    path: "/",
    exact: true,
    component: Home,
    name: "Home",
    private: true,
  },
];

export default routeritems;
