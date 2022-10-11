import { Outlet, useLocation } from "react-router"
import { Link } from "react-router-dom"
import { useAppSelector } from "../app/hooks"
import { selectList } from "../features/list/listSlice"

const EditPage = () => {
    const loc = useLocation().pathname
    const list = useAppSelector(selectList)

    const currentProblem = loc.split('/').length > 2 ? loc.split('/')[2] : null;
    const currentEntry = list.filter(entry => entry.id === currentProblem)[0];

    return (
        <div className="container">
            <div className="row">
                <nav aria-label="breadcrumb">
                    <ol className="breadcrumb">
                        <li className="breadcrumb-item">
                            <Link to="/problems">Problems</Link>
                        </li>
                        { currentEntry && 
                            <li className="breadcrumb-item">{
                                currentEntry.title
                            }</li>
                        }
                    </ol>
                </nav>
            </div>
            <Outlet />
        </div>
    )
}

export default EditPage