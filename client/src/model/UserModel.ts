import { set, get, ref, child, remove } from "firebase/database";

import { API_ENDPOINT, HAS_FIREBASE } from "../config"
import { db } from "../util/firebase";
import { UserDetails } from "../features/types/user"

interface BaseModelResponse {
    error: any,
    data: any
}

interface ModelDetailsResponse extends Omit<BaseModelResponse, 'data'> {
    data: UserDetails
}

class UserModel {

    async fetchUserDetails(id: string): Promise<ModelDetailsResponse> {
        if (HAS_FIREBASE) {

            try {
                const userRef = ref(db, 'user')
                const rawData: UserDetails | null = (await get(child(userRef, `${id}/userDetail`))).val()

                if (rawData === null) {
                    return { error: "user not found or no details exists", data: null }
                } 

                const data = {
                    id: id,
                    ...rawData
                }

                return { error: null, data: data }

            } catch (err) {
                return { error: err, data: null }
            }

        } else {
            return {
                error: "no supported database used",
                data: null
            }
        }
    }

    async addUserDetails(id: string, details: Omit<UserDetails, 'id'>): Promise<ModelDetailsResponse> {
        if (HAS_FIREBASE) {

            try {
                const userDetailsRef = ref(db, `user/${id}/userDetail`)
                set(userDetailsRef, details)

                return { error: null, data: { id: id, ...details }}
                
            } catch (err) {
                return { error: err, data: null }
            }

        } else {
            return {
                error: "no supported database used",
                data: null
            }
        }
    }
}

export default new UserModel()