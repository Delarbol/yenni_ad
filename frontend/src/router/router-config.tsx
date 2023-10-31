import { PropsWithRef } from 'react'
import { Route } from 'react-router-dom'
import { Routing } from '../shared/interface/router'

/**
 * Componente que genera dinamicamente el Route del
 * React router y la validación de path exacto en el contenido
 * @param route es el array para maneja la cantidad de item del
 * switch a cargar en la aplicación.
 * @returns contenido JSX con el renderizado de la vista
 */
const RouterConfig = (route: Routing) => {
    return(
        <Route
            path={route.path}
            exact={route.exact}
            render={ (props: PropsWithRef<any>)  => (
                // pass the sub-routes down to keep nesting
                <route.component {...props} routes={route.routes} />

            )}
        />
    )
}

export default RouterConfig
