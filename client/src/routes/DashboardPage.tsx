import { useAppSelector } from "../app/hooks"
import { selectList, selectTagScores } from "../features/list/listSlice"
import Dashboard from "../components/Dashboard/Dashboard"

const DashboardPage = () => {
    const list = useAppSelector(selectList)
    const tagScore = useAppSelector(selectTagScores)

    return (
        <div className="container">
            <Dashboard list={list} tagScore={tagScore} />
        </div>
    )
}

export default DashboardPage