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

  useEffect(() => {
    const tagDiffList = list.reduce(getTagDifficultiesReducer, [])
    const tagDiffSorted = tagDiffList.reduce(getTagsByDifficultyReducer, {})
    const tagScore = normalizeTags(tagDiffSorted)
    dispatch(uploadTagScores(tagScore))
  }, [list, dispatch])

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