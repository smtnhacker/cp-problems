import axios from "axios";
import { set, get, ref, onValue, child, remove } from "firebase/database";

import { API_ENDPOINT, HAS_FIREBASE } from "../config"
import { db } from "../util/firebase";
import { EntryItem } from "../features/types/list"

interface EntryItemResponse {
    data: {
        [key: string]: EntryItem
    }
}

class ListModel {
    private api: string;

    constructor(api: string) {
        this.api = api + '/list';
    }

    async fetchAllItems() {

        if (HAS_FIREBASE) {
            try {
                const listRef = ref(db);
                const data = (await get(child(listRef, 'user'))).val() ?? {};
                const flattenedData: { [key: string]: EntryItem } = {}
                Object.keys(data).forEach(authorID => {
                    Object.keys(data[authorID]).forEach(id => {
                        flattenedData[id] = data[authorID][id];
                    })
                })
                console.dir({ action: "fetchAll", data: data });    
                return { error: null, data: flattenedData };
            } catch (err) {
                return { error: err, data: {} }
            }
        }

        else {
            try {
                const response: EntryItemResponse = await axios.get(`${this.api}`);
                return { error: null, data: response.data };
            } catch (err) {
                console.log(err);
                return { error: err, data: {} }
            }
        }

    }

    async fetchUserItems(authorID: string) {

        if (HAS_FIREBASE) {
            try {
                const listRef = ref(db);
                const data = (await get(child(listRef, `user/${authorID}`))).val() ?? {};
                const flattenedData: { [key: string]: EntryItem } = {}
                Object.keys(data).forEach(id => {
                    flattenedData[id] = data[id];
                })
                console.dir({ action: "fetchUserAll", id: authorID, data: data });    
                return { error: null, data: data };
            } catch (err) {
                return { error: err, data: {} }
            }
        }

        else {
            return { error: "no firebase", data: { } }
        }

    }

    async addItem(newItem: EntryItem) {

        if (HAS_FIREBASE) {
            const { authorID, id } = newItem;
            const listRef = ref(db, `user/${authorID}/${id}`); 
            set(listRef, newItem);
            return { error: null, data: newItem }
        }

        try {
            const response: { data: EntryItem } = await axios.post(`${this.api}`, {
                    payload: newItem
                });
            return { error: null, data: response.data }
        } catch (err) {
            console.log(err);
            return { error: err, data: null }
        }
    }

    async deleteItem(entryID: string) {

        if (HAS_FIREBASE) {
            const itemRef = ref(db, `list/${entryID}`)
            try {
                await remove(itemRef);
                return { error: null, data: { id: entryID }}
            } catch (err) {
                console.log(err);
                return { error: err, data: "" }
            }
        }

        try {
            const response: { data: {id: string} } = await axios.delete(`${this.api}/${entryID}`);
            return { error: null, data: response.data };
        } catch (err) {
            console.log(err);
            return { error: err, data: "" }
        }
    }
}

export default new ListModel(API_ENDPOINT)