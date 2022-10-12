import { Outlet } from "react-router"

const PublicPage = () => {

    return (
        <div className="container">
            <Outlet />
        </div>
    )
}

export default PublicPage