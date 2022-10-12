import { SyntheticEvent } from "react";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { EntryItem } from "../types/list";
import { addItem, deleteItem, selectList } from "./listSlice";
import { selectAuth } from "../auth/authSlice";
import getBestTag from "../../util/getBestTag";
import removeDuplicates from "../../util/removeDuplicates";

import ListView from './ListView';
import ListForm from "./LisrForm";
import Separator from "../../components/Separator/Separator";

function List() {
  const list = useAppSelector(selectList);
  const dispatch = useAppDispatch();
  const auth = useAppSelector(selectAuth);
  const navigate = useNavigate()

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    if (auth.id.length === 0) {
      return alert("Please login first");
    }

    const target = e.target as any;
    const tags = removeDuplicates (
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
    };

    try {
      dispatch(addItem(newEntry));
      target.reset();
      navigate(newEntry.id)
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      {auth.loggedIn && <ListForm onSubmit={handleSubmit} />}
      <Separator />
      <h2>My Problem List</h2>
      <ListView 
        list={list} 
        onDelete={(entry: EntryItem) => dispatch(deleteItem(entry))}
      />
    </div>
  );
}

export default List;
