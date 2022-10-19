import { useState, useEffect, useCallback } from "react"
import { useParams } from "react-router"
import { IoPencilSharp } from "react-icons/io5"

import { useAppDispatch, useAppSelector } from "../../app/hooks"
import { getPost, selectList, selectPosts, updateItem } from "../../features/list/listSlice"
import { selectAuth } from "../../features/auth/authSlice"
import ProblemForm from "./ProblemForm"
import RichBodyView from "../RichBody/RichBodyView/RichBodyView"
import EntryPage from "../EntryPage"
import { EntryHeader, EntryItem } from "../../features/types/list"

interface ProblemViewProps {
    readonly?: boolean
}

const ProblemView = (props: ProblemViewProps) => {
    const [loading, setLoading] = useState(true)
    const dispatch = useAppDispatch()
    const [mode, setMode] = useState<string>('view')
    const auth = useAppSelector(selectAuth)
    const authorID = auth.id
    const { problemID } = useParams()
    const [currentEntry, setCurrentEntry] = useState<EntryItem>()

    useEffect(() => {
        const getCurrent = async () => {
            try {
                const data = await getPost(problemID);
                console.log("Got entry item:", data)
                setCurrentEntry(data);
            } catch (err) {
                console.log(err)
            }
        }
        if (problemID) {
            getCurrent()
                .then(() => setLoading(false))
        } else {
            setLoading(false)
        }
    }, [])
    
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

    if (loading) {
        return <h1>Loading...</h1>
    } else if (!problemID) {
        return <h1>Missing Problem ID...</h1>
    } else if (!currentEntry && !props.readonly) {
        return <h1>Invalid Problem ID</h1>
    } 

    return (
        <div className="container px-4">
            {generateView(mode)}
        </div>
    )
}

export default ProblemView