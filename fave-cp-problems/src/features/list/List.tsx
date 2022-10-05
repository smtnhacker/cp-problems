import { SyntheticEvent, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { EntryItem } from "../types/list";
import { addItem, deleteItem, selectList, fetchItems } from "./listSlice";

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

    const newEntry: EntryItem = {
      id: uuidv4(),
      authorID: authorID,
      title: target.title.value,
      description: target.description.value,
      difficulty: target.difficulty.value,
      url: target.url.value,
      tags: target.tags.value,
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
      <ul className="list-group">
        {list.map((entry) => (
          <li key={entry.id} className="list-group-item">
            <button
              className="btn"
              onClick={() => dispatch(deleteItem(entry.id as string))}
              >
              X
            </button>
            {entry.title}
          </li>
        ))}
      </ul>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <input type="text" name="authorID" value={authorID} hidden />
          <div className="mb-3">
            <label className="form-label" htmlFor="title">
              Title
            </label>
            <input className="form-control" type="text" name="title" />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <textarea className="form-control" name="description"></textarea>
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="difficulty">
              Difficulty
            </label>
            <input
              className="form-range"
              type="range"
              name="difficulty"
              min={0}
              max={10}
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="url">
              Problem Link
            </label>
            <input className="form-control" type="text" name="url" />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="tags">
              Tags
            </label>
            <input className="form-control" type="text" name="tags" />
          </div>
          <input className="btn btn-primary" type="submit" value="submit" />
        </form>
      </div>
    </div>
  );
}

export default List;
