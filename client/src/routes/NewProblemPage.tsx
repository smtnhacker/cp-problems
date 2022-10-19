import { SyntheticEvent } from "react";
import { useNavigate } from "react-router"
import { v4 as uuidv4 } from 'uuid'

import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import ListForm from "../features/list/LisrForm";
import { addItem } from "../features/list/listSlice";
import { EntryItem } from "../features/types/list";
import getBestTag from "../util/getBestTag";
import removeDuplicates from "../util/removeDuplicates";


const NewProblemPage = () => {
    const dispatch = useAppDispatch();
    const auth = useAppSelector(selectAuth);
    const navigate = useNavigate();

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
            target.reset();
            navigate(`/problems/${newEntry.id}`)
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="container">
            <ListForm onSubmit={handleSubmit} />
        </div>
    )
}

export default NewProblemPage