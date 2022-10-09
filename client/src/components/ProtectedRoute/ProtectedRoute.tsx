import React, { useEffect, useState } from 'react'
import { Outlet, Navigate } from "react-router-dom"

interface ProtectedRouteProps {
    getAuthentication: Function,
    redirectPath: string,
    children?: React.ReactNode
}

const ProtectedRoute = (props: ProtectedRouteProps): JSX.Element => {
    const [loading, setLoading] = useState(true)
    const [isAllowed, setIsAllowed] = useState(false);

    useEffect(() => {
        const retrieveCredentials = async () => {
            const res = await props.getAuthentication()
            setIsAllowed(res);
        }
        retrieveCredentials()
            .then(() => setLoading(false));
    }, [])

    if (loading) {
        return <div>Loading...</div>
    }

    if (!isAllowed) {
        return <Navigate to={props.redirectPath} replace />
    }

    return (
        props.children ? <>props.children</> : <Outlet />        
    )
}

export default ProtectedRoute