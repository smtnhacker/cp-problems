import { SyntheticEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router"
import { v4 as uuidv4 } from 'uuid'

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import ListForm from "../features/list/LisrForm";
import { addItem } from "../features/list/listSlice";
import { EntryHeader, EntryItem } from "../features/types/list";
import ListModel from "../model/ListModel";
import getBestTag from "../util/getBestTag";
import removeDuplicates from "../util/removeDuplicates";

interface NewProblemPageProps {
    useCache ?: boolean
}

const NewProblemPage = (props: NewProblemPageProps) => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector(selectAuth);
    const navigate = useNavigate();
    const [defaultValue, setDefaulValue] = useState<EntryHeader|null>()

    useEffect(() => {
        if (props.useCache) {
            try {
                const value = JSON.parse(localStorage.getItem('cp-problem-cache-header'))
                setDefaulValue(value);
            } catch (err) {
                console.log("No cache...")
            }
        }
    }, [])

    const handleSubmit = (e: SyntheticEvent): void => {
        e.preventDefault();

        if (auth.id.length === 0) {
            return alert("Please login first");
        }

        const target = e.target as any;
        const tags = removeDuplicates(
            target.tags.value.split(",")
                .map((tag: string) => tag.trim())
                .map((tag: string) => getBestTag(tag))
        )

        const newEntry: EntryItem = {
            id: uuidv4(),
            authorID: auth.id,
            title: target.title.value,
            description: "", //target.description.value,
            difficulty: target.difficulty.value,
            url: target.url.value,
            tags: tags || [],
            slug: target.slug.value,
            status: "public"
        };

        try {
            dispatch(addItem(newEntry));
            if (props.useCache) {
                ListModel.deleteHeader(defaultValue)
            }
            target.reset();
            navigate(`/problems/${newEntry.id}`)
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container">
            <ListForm onSubmit={handleSubmit} initialValues={defaultValue} />
        </div>
    )
}

export default NewProblemPage