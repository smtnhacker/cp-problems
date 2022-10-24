import { sha512 } from "js-sha512";
import { useEffect } from "react";
import { Outlet } from "react-router"
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import { fetchItems, fetchUserItems, selectList, selectStatus, uploadTagScores } from "../features/list/listSlice";
import { getTagDifficultiesReducer, getTagsByDifficultyReducer, normalizeTags } from "../util/tagScoreReducers";


const DataWrapper = () => {
  const dispatch = useAppDispatch()
  const auth = useAppSelector(selectAuth)
  const status = useAppSelector(selectStatus)
  const list = useAppSelector(selectList)

  useEffect(() => {
    dispatch(fetchItems(12));    
  }, [])

  useEffect(() => {
    if (auth.loggedIn) {
      dispatch(fetchUserItems(auth.id));
    }
  }, [auth.loggedIn, auth.id, dispatch]);

  const getTagScores = () => {
    console.warn("recomputing tag scores...")
    const tagDiffList = list.reduce(getTagDifficultiesReducer, [])
    const tagDiffSorted = tagDiffList.reduce(getTagsByDifficultyReducer, {})
    const tagScore = normalizeTags(tagDiffSorted)
    dispatch(uploadTagScores(tagScore))
    localStorage.setItem('cp-fave-tag-score', JSON.stringify({
      key: sha512(auth.id),
      tagScore: tagScore
    }))
  }

  useEffect(() => {
    if (auth.loggedIn) {
      // check cache
      try {
        const cache = localStorage.getItem('cp-fave-tag-score')
        const data = JSON.parse(cache)
  
        if (data.key === sha512(auth.id)) {
          console.log("Got tagscore from cache")
          dispatch(uploadTagScores(data.tagScore))
        } else {
          getTagScores()        
        }
      } catch (err) {
        getTagScores()
      }
    }
  }, [auth.loggedIn, auth.id, dispatch])

  useEffect(() => {
    getTagScores()
  }, [list])

  if (status === 'loading') {
    return <div className="h1">Loading...</div>
  } else if (status === 'failed') {
    return <div className="h1">Error :(</div>
  }

  return (
    <Outlet />
  )
}

export default DataWrapper