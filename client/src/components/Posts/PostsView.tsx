import { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { selectPosts } from "../../features/list/listSlice"
import UserModel from '../../model/UserModel'

const convertToReadableDate = (date: string) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString()
}

const PostsView = () => {
    const posts = useAppSelector(selectPosts)
    const sortedPosts = posts.slice(0, 12).sort((a, b) => {
        const aDate = a.lastModified ?? a.createdAt
        const bDate = b.lastModified ?? b.createdAt
        return bDate < aDate ? -1 : 1
    })
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
            <h3>Recent Activities</h3>
            <ul className="list-group">
            {sortedPosts.map(entry => {
                return (
                <li className="list-group-item" key={entry.id}>
                    <Link className="nav-link" to={`/posts/${entry.id || '404'}`}>
                        {entry.title} by {authorCache[entry.authorID]}
                        <span className="text-muted"> {convertToReadableDate(entry.lastModified ?? entry.createdAt)}</span>
                    </Link>
                </li>
                )
            })}
            </ul>
       </> 
    )
}

export default PostsView