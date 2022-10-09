import React from 'react'
import { Outlet, Navigate } from "react-router-dom"

interface ProtectedRouteProps {
    isAllowed: boolean,
    redirectPath: string,
    children?: React.ReactNode
}

const ProtectedRoute = (props: ProtectedRouteProps): JSX.Element => {

    if (!props.isAllowed) {
        return <Navigate to={props.redirectPath} replace />
    }

    return (
        props.children ? <>props.children</> : <Outlet />        
    )
}

export default ProtectedRoute