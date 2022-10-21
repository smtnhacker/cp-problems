import React, { useEffect, useState } from "react"
import { useAppSelector } from "../app/hooks"
import { selectAuth } from "../features/auth/authSlice"
import userModel from "../model/UserModel"
import CFModel from "../model/CFModel"
import ListModel from "../model/ListModel"
import { EntryHeader } from "../features/types/list"

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

    const handleSyncData = async () => {
        const data = await CFModel.fetchUserSubmissions(cf, authorID);
        console.log(data)
        await ListModel.addHeaders(data.data, authorID)
        alert('Done! Please refresh the page to see changes in the dashboard')
    }

    const handleDeleteDrafts = async () => {
        await ListModel.deleteDrafts(authorID)
        alert('Done! Please refresh the page to see changes in the dashboard')
    }

    return (
        <>
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
                <input type="submit" className="btn btn-primary" value="Update Profile" />
            </form>
            <div className="mb-3">
                <button className="btn btn-outline-secondary" onClick={() => handleSyncData()} >Sync Codeforces Submissions</button>
                <button className="btn btn-outline-secondary" onClick={() => handleDeleteDrafts()} >Delete Drafts</button>
            </div>
        </>
    )
}

export default ProfilePage