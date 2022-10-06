import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";

interface authState {
    userID: string,
    loggedIn: boolean
}

const initialState = {
    userID: "",
    loggedIn: false
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        authLogin: (state: authState, action: PayloadAction<string>) => {
            state.loggedIn = true
            state.userID = action.payload
        },
        authLogout: (state: authState) => {
            state.loggedIn = false
            state.userID = ""
        }
    }
})

export const { authLogin, authLogout } = authSlice.actions

export const selectAuth = (state: RootState) => { 
    return {
        loggedIn: state.auth.loggedIn, 
        id: state.auth.userID || "" 
    }
}

export default authSlice.reducer