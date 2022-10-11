import { useState } from "react"
import { useParams } from "react-router"
import { IoPencilSharp } from "react-icons/io5"

import { useAppSelector } from "../../app/hooks"
import { selectList } from "../../features/list/listSlice"
import { selectAuth } from "../../features/auth/authSlice"
import ProblemForm from "./ProblemForm"

const ProblemView = () => {
    const [mode, setMode] = useState<string>('view')
    const auth = useAppSelector(selectAuth)
    const authorID = auth.id
    const { problemID } = useParams()
    const list = useAppSelector(selectList);
    const currentEntry = list.filter(entry => entry.id === problemID)[0];

    if (!problemID) {
        return <h1>Missing Problem ID...</h1>
    } else if (!currentEntry) {
        return <h1>Invalid Problem ID</h1>
    }

    const changeView = () => {
        setMode(prev => {
            switch(prev) {
                case "view":
                    return "edit"
                case "edit":
                    return "view"
                default:
                    return "invalid state"
            }
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        changeView()
    }

    const generateView = (mode: string) => {
        switch(mode) {
            case 'view':
                return (
                    <>
                        <div className="row text-center">
                            <h2>
                                {currentEntry.title} 
                                <button className="btn" onClick={changeView}>
                                    <IoPencilSharp />
                                </button>
                            </h2>
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
                    </>
                )
            case "edit":
                return (
                  <ProblemForm entry={currentEntry} authorID={authorID} onSubmit={handleSubmit} />
                );
        }
    }

    return (
        <div className="container px-4">
            {generateView(mode)}
        </div>
    )
}

export default ProblemView