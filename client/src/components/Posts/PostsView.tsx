import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { selectPosts } from "../../features/list/listSlice"
import UserModel from '../../model/UserModel'

const PostsView = () => {
    const posts = useAppSelector(selectPosts)
    const sortedPosts = posts.slice().sort((a, b) => a.lastModified < b.lastModified ? -1 : 1)
    const [authorCache, setAuthorCache] = useState({})

    const getAuthorHandle = (authorID: string) => {
        if (authorID in authorCache) {
            return;
        }
        UserModel.fetchUserDetails(authorID)
            .then(res => {
                if (res.error) {
                    console.log(res.error)
                } else {
                    setAuthorCache(prev => ({...prev, [authorID]: res.data.displayName}))
                }
            })
    }

    useEffect(() => {
        posts.forEach(entry => getAuthorHandle(entry.authorID))
    }, [])

    return (
       <>
            <h3>Recent Submissions</h3>
            <ul className="list-group">
            {sortedPosts.map(entry => {
                return (
                <li className="list-group-item" key={entry.id}>
                    <Link className="nav-link" to={`/posts/${entry.id || '404'}`}>
                        {entry.title} by {authorCache[entry.authorID]}
                    </Link>
                </li>
                )
            })}
            </ul>
       </> 
    )
}

export default PostsView