import { IoAddCircleSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import ListModel from '../../model/ListModel';
import { EntryHeader, EntryItem } from "../types/list";
import { deleteItem, selectList } from "./listSlice";

import ListView from './ListView';

function List() {
  const list = useAppSelector(selectList);
  const listActual = list.filter(entry => !entry.tagOnly)
  const listDraft = list.filter(entry => entry.tagOnly)
                        .sort((a, b) => parseInt(a.id) < parseInt(b.id) ? 1 : -1)
  const dispatch = useAppDispatch();
  
  const handleDeleteHeader = async (entry: EntryHeader) => {
    await ListModel.deleteHeader(entry)
    alert('deleted!')
  }

  const handleCreateFromHeader = (entry: EntryHeader) => {
    localStorage.setItem('cp-problem-cache-header', JSON.stringify(entry))
  }

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
        list={listActual} 
        onDelete={(entry: EntryItem) => dispatch(deleteItem(entry))}
        genLink={(id) => `${id || "404"}`}
      />
      <h2>Drafts</h2>
      <ListView
        list={listDraft}
        onDelete={(entry: EntryHeader) => handleDeleteHeader(entry)}
        onClick={handleCreateFromHeader}
        genLink={(id) => `new/${id}`}
      />
    </div>
  );
}

export default List;
