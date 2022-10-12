import { Link } from "react-router-dom"
import { useAppSelector } from "../../app/hooks"
import { selectPosts } from "../../features/list/listSlice"

const PostsView = () => {
    const posts = useAppSelector(selectPosts)

    return (
       <>
            <h3>Recent Submissions</h3>
            <ul className="list-group">
            {posts.map(entry => {
                return (
                <li className="list-group-item" key={entry.id}>
                    <Link className="nav-link" to={`/posts/${entry.id || '404'}`}>
                        {entry.title}
                    </Link>
                </li>
                )
            })}
            </ul>
       </> 
    )
}

export default PostsView