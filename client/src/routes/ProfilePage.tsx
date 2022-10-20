import React, { useEffect, useState } from "react"
import { useAppSelector } from "../app/hooks"
import { selectAuth } from "../features/auth/authSlice"
import userModel from "../model/UserModel"

const ProfilePage = () => {
    const { id: authorID } = useAppSelector(selectAuth)
    const [dName, setDName] = useState<string>('')
    const [cf, setCF] = useState<string>('')

    useEffect(() => {
        const getDetails = async () => {
            const { error, data } = await userModel.fetchUserDetails(authorID);
            if (error) {
                console.log(error)
                throw error
            } else {
                return data
            }
        }
        getDetails()
            .then(res => {
                setDName(res.displayName || "")
                setCF(res.cf || "")
            })
    }, [])

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const data = {
            cf: cf,
            displayName: dName
        }
        userModel.addUserDetails(authorID, data)
            .then(() => alert('done!'))
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="displayName">Display Name:</label>
                <input type="text" name="displayName" className="form-control" value={dName} onChange={e => setDName(e.target.value)} />
                <div className="form-text">This is what others will see</div>
            </div>
            <div className="mb-3">
                <label htmlFor="cf">CodeForces Username:</label>
                <input type="text" name="cf" className="form-control" value={cf} onChange={e => setCF(e.target.value)} />
                <div className="form-text">Make sure to use your actual username!</div>
            </div>
            <div className="mb-3">
                <button className="btn btn-outline-secondary" >Sync Codeforces Submissions</button>
            </div>
            <input type="submit" className="btn btn-primary" value="Update Profile" />
        </form>
    )
}

export default ProfilePage