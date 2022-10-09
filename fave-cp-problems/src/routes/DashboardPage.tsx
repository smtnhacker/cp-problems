import { useAppSelector } from "../app/hooks"
import { selectList } from "../features/list/listSlice"
import Dashboard from "../components/Dashboard/Dashboard"

const DashboardPage = () => {
    const list = useAppSelector(selectList)

    return (
        <div className="container">
            <Dashboard list={list} />
        </div>
    )
}

export default DashboardPage