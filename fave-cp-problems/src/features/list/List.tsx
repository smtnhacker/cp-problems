import { SyntheticEvent, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { EntryItem } from "../types/list";
import { addItem, deleteItem, selectList, fetchItems } from "./listSlice";

import ListView from './ListView';
import ListForm from "./LisrForm";

function List() {
  const list = useAppSelector(selectList);
  const dispatch = useAppDispatch();
  const authorID = "1";

  useEffect(() => {
    dispatch(fetchItems());
  }, []);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    const target = e.target as any;

    const tags = target.tags.value.split(",").map((tag: string) => tag.trim())

    const newEntry: EntryItem = {
      id: uuidv4(),
      authorID: authorID,
      title: target.title.value,
      description: target.description.value,
      difficulty: target.difficulty.value,
      url: target.url.value,
      tags: tags || [],
    };

    try {
      dispatch(addItem(newEntry));
      target.reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <ListView 
        list={list} 
        onDelete={(id: string) => dispatch(deleteItem(id))}
      />
      <ListForm onSubmit={handleSubmit} />
    </div>
  );
}

export default List;
