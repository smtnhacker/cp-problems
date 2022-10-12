import { IoAddCircleSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { EntryItem } from "../types/list";
import { deleteItem, selectList } from "./listSlice";

import ListView from './ListView';

function List() {
  const list = useAppSelector(selectList);
  const dispatch = useAppDispatch();
  

  return (
    <div className="container">
      <h2>My Problem List
        <button className="btn">
          <Link to="new">
            <IoAddCircleSharp  size="2em" />
          </Link>
        </button>
      </h2>
      <ListView 
        list={list} 
        onDelete={(entry: EntryItem) => dispatch(deleteItem(entry))}
      />
    </div>
  );
}

export default List;
