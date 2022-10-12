import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router"
import { IoPencilSharp } from "react-icons/io5"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { selectList, selectPosts, updateItem } from "../../features/list/listSlice"
import { selectAuth } from "../../features/auth/authSlice"
import ProblemForm from "./ProblemForm"
import RichBodyView from "../RichBody/RichBodyView/RichBodyView"
import EntryPage from "../EntryPage"

interface ProblemViewProps {
    readonly?: boolean
}

const ProblemView = (props: ProblemViewProps) => {
    const dispatch = useAppDispatch()
    const [mode, setMode] = useState<string>('view')
    const auth = useAppSelector(selectAuth)
    const authorID = auth.id
    const { problemID } = useParams()
    const list = useAppSelector(selectList);
    const currentEntry = list.filter(entry => entry.id === problemID)[0];
    const allPost = useAppSelector(selectPosts);
    const currentPost = allPost.filter(entry => entry.id === problemID)[0];
    
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

    const handleSubmit = (newEntry) => {
        dispatch(updateItem(newEntry))
        changeView()
    }

    const generateView = (mode: string) => {
        switch(mode) {
            case 'view':
                return (
                    <EntryPage entry={currentEntry} onChangeView={changeView} />
                )
            case "edit":
                return (
                  <ProblemForm entry={currentEntry} authorID={authorID} onSubmit={handleSubmit} />
                );
        }
    }

    if (!problemID) {
        return <h1>Missing Problem ID...</h1>
    } else if (!currentEntry && !props.readonly) {
        return <h1>Invalid Problem ID</h1>
    } else if (!currentEntry && currentPost) {
        console.log(currentPost)
        return <EntryPage entry={currentPost} />
    }

    return (
        <div className="container px-4">
            {generateView(mode)}
        </div>
    )
}

export default ProblemView