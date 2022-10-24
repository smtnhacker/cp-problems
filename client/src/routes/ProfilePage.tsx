import React, { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "../app/hooks"
import { selectAuth } from "../features/auth/authSlice"
import userModel from "../model/UserModel"
import CFModel from "../model/CFModel"
import ListModel from "../model/ListModel"
import { addHeaders, deleteDrafts, selectList } from "../features/list/listSlice"
import { getSlugs } from "../components/Dashboard/Dashboard"

const ProfilePage = () => {
    const { id: authorID } = useAppSelector(selectAuth)
    const [dName, setDName] = useState<string>('')
    const [cf, setCF] = useState<string>('')
    const list = useAppSelector(selectList)
    const existingSlugs = useMemo(async () => await getSlugs(list), [list])
    const dispatch = useAppDispatch()

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
        const { error, data } = await CFModel.fetchUserSubmissions(cf, authorID);
        
        if (error) {
            return alert(error)
        }

        const noDuplicates = data.filter(entry => {
            return !(entry.slug in existingSlugs)
        })

        // await ListModel.addHeaders(noDuplicates, authorID)
        dispatch(addHeaders({newHeaders: noDuplicates, authorID: authorID}))
    }

    const handleDeleteDrafts = async () => {
        // await ListModel.deleteDrafts(authorID)
        dispatch(deleteDrafts(authorID))
        alert('Done!')
    }

    return (
        <>
            <form className="p-4" onSubmit={handleSubmit}>
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
            <div className="m-4">
                <div className="row mb-2">
                    <button className="btn btn-outline-dark" onClick={() => handleSyncData()} >Sync Codeforces Submissions</button>
                </div>
                <div className="row mb-2">
                    <button className="btn btn-outline-danger" onClick={() => handleDeleteDrafts()} >Delete Drafts</button>
                </div>
            </div>
        </>
    )
}

export default ProfilePage