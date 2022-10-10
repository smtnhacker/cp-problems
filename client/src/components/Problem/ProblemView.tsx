import { useParams } from "react-router"
import { useAppSelector } from "../../app/hooks"
import { selectList } from "../../features/list/listSlice"

const ProblemView = () => {
    const { problemID } = useParams()
    const list = useAppSelector(selectList);
    const currentEntry = list.filter(entry => entry.id === problemID)[0];

    if (!problemID) {
        return <div>Missing Problem ID...</div>
    }

    return (
        <div className="container px-4">
            <div className="row text-center">
                <h2>{currentEntry.title}</h2>
                <div className="row">
                    <small className="text-muted">
                        <a href={currentEntry.url} target="_blank" rel="noreferrer" className="nav-link">
                            {currentEntry.url}
                        </a>
                    </small>
                </div>
                <div className="row">
                    <small className="text-muted">
                        Rating: {currentEntry.difficulty}
                    </small>
                </div>
            </div>
            <div className="row p-3">
                {currentEntry.description}
            </div>
            <div className="row">
                <div className="col-auto">Tags</div>
                <div className="col">
                    {currentEntry.tags.map(tag => {
                        return <div key={tag} className="badge rounded-pill text-bg-light m-1">{tag}</div>
                    })}
                </div>
            </div>
        </div>
    )
}

export default ProblemView