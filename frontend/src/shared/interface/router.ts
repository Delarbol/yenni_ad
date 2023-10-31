/** Interface de configuración de Router para centralizar las rutas
 * en la aplicación de React en Typescript */

export interface Routing {
    path: string;
    component?: any;
    routes?: Array<Routing>;
    render?: any;
    exact: boolean;
    name?:string;
    private:boolean;
}
