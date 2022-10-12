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

interface RawEntryItem extends Omit<EntryItem, 'difficulty'> {
    difficulty: string
}

class ListModel {
    private api: string;

    constructor(api: string) {
        this.api = api + '/list';
    }

    async fetchAllItems(page: number) {

        if (HAS_FIREBASE) {
            try {
                const postsRef = ref(db, 'posts');
                const data = (await get(child(postsRef, page.toString()))).val() ?? {};
                const flattenedData: { [key: string]: RawEntryItem } = {}
                Object.keys(data).forEach(id => {

                    // skip placeholder
                    if (id === 'entry_id') {
                        return;
                    }

                    const temp: any = data[id];
                    temp.difficulty = parseInt(temp.difficulty)
                    flattenedData[id] = temp;
                })
                console.dir({ action: "fetchAll", data: flattenedData });    
                return { error: null, data: flattenedData };
            } catch (err) {
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
                    flattenedData[id] = { ...data[id], difficulty: parseInt(data[id].difficulty) };
                })
                console.dir({ action: "fetchUserAll", id: authorID, data: flattenedData });    
                return { error: null, data: flattenedData };
            } catch (err) {
                return { error: err, data: {} }
            }
        }

    }

    async addItem(newItem: EntryItem) {

        if (HAS_FIREBASE) {
            const { authorID, id } = newItem;

            const dbRef = ref(db)
            
            // get the page number first
            const pageDetails = (await get(child(dbRef, 'page_detail'))).val() as { count: number, cur_page: number }
            // update the page if necessary
            if (pageDetails.count === 1000) {
                pageDetails.cur_page += 1
                set(child(dbRef, "page_detail"), {
                    count: 0,
                    cur_page: pageDetails.cur_page
                })
            }
            
            console.log(pageDetails)
            const withPageNumber: EntryItem = {
                ...newItem,
                page: pageDetails.cur_page.toString()
            }

            console.dir(withPageNumber)

            // updated the user db
            const userItemRef = ref(db, `user/${authorID}/${id}`); 
            set(userItemRef, withPageNumber);

            // update all post db
            const allpostRef = ref(db, `posts/${pageDetails.cur_page}`)
            set(child(allpostRef, id), withPageNumber)

            // update page count
            set(child(dbRef, "page_detail"), {
                ...pageDetails,
                count: pageDetails.count + 1
            })
            return { error: null, data: withPageNumber }
        }
    }

    async deleteItem(entry: EntryItem) {

        const { authorID, id, page } = entry

        if (HAS_FIREBASE) {

            try {
                // delete from user
                const itemRef = ref(db, `user/${authorID}/${id}`)
                await remove(itemRef);

                // delete from all post
                await remove(ref(db, `posts/${page}/${id}`))

                return { error: null, data: entry }
            } catch (err) {
                console.log(err);
                return { error: err, data: "" }
            }
        }
    }
}

export default new ListModel(API_ENDPOINT)