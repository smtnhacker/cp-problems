import { useState, useEffect } from 'react';
import { IoAddCircleSharp, IoReloadCircle } from 'react-icons/io5'
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { getSlugs } from '../../components/Dashboard/Dashboard';
import CFModel from '../../model/CFModel';
import ListModel from '../../model/ListModel';
import UserModel from '../../model/UserModel';
import { selectAuth } from '../auth/authSlice';
import { EntryHeader, EntryItem } from "../types/list";
import { addHeader, deleteItem, selectList } from "./listSlice";

import ListView from './ListView';

function List() {
  const { id: authorID } = useAppSelector(selectAuth)
  const list = useAppSelector(selectList);
  const listActual = list.filter(entry => !entry.tagOnly)
  const listDraft = list.filter(entry => entry.tagOnly)
                        .sort((a, b) => parseInt(a.id) < parseInt(b.id) ? 1 : -1)
  const dispatch = useAppDispatch();
  const [cf, setCF] = useState('')
  const [existingSlugs, setSlugs] = useState({})

  useEffect(() => {
    getSlugs(list)
      .then(res => setSlugs(res))
  }, [list])
 
  useEffect(() => {
    const getDetails = async () => {
      const { error, data } = await UserModel.fetchUserDetails(authorID);
      if (error) {
        console.log(error)
        throw error
      } else {
        return data
      }
    }
    getDetails()
      .then(res => {
        setCF(res.cf || "")
      })
    }, [])

  const handleDeleteHeader = async (entry: EntryHeader) => {
    await ListModel.deleteHeader(entry)
    alert('deleted!')
  }

  const handleCreateFromHeader = (entry: EntryHeader) => {
    localStorage.setItem('cp-problem-cache-header', JSON.stringify(entry))
  }

  const handleSubmissionRefresh = async () => {
    if (!cf) {
      return alert("You have no cf handle configured")
    } 
    const { error, data } = await CFModel.fetchRecentSubmissions(cf, authorID);

    if (error) {
      return alert(error)
    }

    if (data.length === 0) {
      return alert("You have no recent submissions")
    }

    const noDuplicates = data.filter(entry => {
      return !(entry.slug in existingSlugs)
    })

    console.log(noDuplicates)
    noDuplicates.forEach(async (entry) => {
      // await ListModel.addHeader(entry, authorID)
      dispatch(addHeader({ newHeader: entry, authorID: authorID }))
    })
    alert('Done!')
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
      <h2>Drafts
        <button className="btn" onClick={handleSubmissionRefresh}>
          <IoReloadCircle size="2em" />
        </button>
      </h2>
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
