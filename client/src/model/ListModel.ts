import { set, get, ref, child, remove } from "firebase/database";

import { API_ENDPOINT, HAS_FIREBASE } from "../config"
import { db } from "../util/firebase";
import { EntryItem, EntryHeader } from "../features/types/list"

interface RawEntryHeader extends Omit<EntryHeader, 'difficulty'> {
    difficulty: string
}

interface RawEntryItem extends Omit<EntryItem, 'difficulty'> {
    difficulty: string
}

interface RawPage {
    [id: string]: RawEntryHeader
}

interface BaseObject<T> {
    [id: string]: T
}

interface BaseModelResponse {
    error: any,
    data: any
}

export interface ModelHeaderResponse extends Omit<BaseModelResponse, 'data'> {
    data: Array<EntryHeader>
}

export interface ModelPostReponse extends Omit<BaseModelResponse, 'data'> {
    data: EntryItem,
    errorCode?: number
}

class ListModel {
    private api: string;

    constructor(api: string) {
        this.api = api + '/list';
    }

    async fetchAllItems(amount: number): Promise<ModelHeaderResponse> {

        if (HAS_FIREBASE) {

            try {
                const data: EntryHeader[] = [];
                const pageDetailRef = ref(db, 'page_detail')
                const pagesRef = ref(db, 'pages')

                // get current page + 1
                let curPage: number = parseInt(
                    (await get(child(pageDetailRef, 'curPage'))).val() ?? "1"
                ) + 1;

                while (data.length < amount) {
                    // check if there is still next page
                    if (curPage === 1) {
                        break;
                    }

                    // if there is, get the data there
                    curPage -= 1;
                    const pageData: RawPage = (await get(child(pagesRef, curPage.toString()))).val() ?? {}
                    const flattenedPage: EntryHeader[] = Object.keys(pageData).map(key => {
                        const curHeader: RawEntryHeader = pageData[key];
                        return { ...curHeader, difficulty: parseInt(curHeader.difficulty) }
                    })
                    
                    // remove unnecessary data
                    const filteredData: EntryHeader[] = flattenedPage.filter(entry => {
                        if (entry.id === 'entry_id') {
                            return false;
                        }
                        return true;
                    })

                    // append data to data
                    data.push(...filteredData);
                }

                return {
                    error: null,
                    data: data.length < amount ? data : data.slice(0, amount)
                }
            } catch (err) {
                return { error: err, data: [] }
            }
        } else {
            return {
                error: "No supported database used",
                data: []
            }
        }

    }

    async fetchUserItems(authorID: string): Promise<ModelHeaderResponse> {
        type RawResponse = BaseObject<Omit<RawEntryHeader, 'lastModified' | 'authorID'>>

        if (HAS_FIREBASE) {
            try {
                const userRef = ref(db, 'user');
                const rawData: RawResponse = (await get(child(userRef, `${authorID}/posts`))).val() ?? {};
                const data: EntryHeader[] = Object.keys(rawData).map(key => {
                    return { ...rawData[key], difficulty: parseInt(rawData[key].difficulty), authorID: authorID}
                })

                return { error: null, data: data };
            } catch (err) {
                return { error: err, data: [] }
            }
        } else {
            return {
                error: "No supported database used",
                data: []
            }
        }

    }

    async fetchPost(id: string): Promise<ModelPostReponse> {

        if (HAS_FIREBASE) {
            try {
                const postsRef = ref(db, 'posts')
                const rawData: RawEntryItem | null = (await get(child(postsRef, id))).val()

                if (rawData === null) {
                    return { error: "Page not found", errorCode: 404, data: null }
                }

                const data: EntryItem = { ...rawData, difficulty: parseInt(rawData.difficulty) }
                return { error: null, data: data }

            } catch (err) {
                return { error: err, data: null }
            }
        } else {
            return {
                error: "No supported database used",
                data: null
            }
        }
    }

    async addHeaders(newHeaders: EntryHeader[], authorID: string) {
        if (HAS_FIREBASE) {
            // get current headers
            const userRef = ref(db, 'user');
            const rawData = (await get(child(userRef, `${authorID}/posts`))).val() ?? {};
            const newHeadersObj: { [id: string]: EntryHeader } = newHeaders.reduce((total, cur) => {
                return {...total, [cur.id]: cur }
            }, {})
            // updated the user db
            const updatedHeaders = {
                ...rawData,
                ...newHeadersObj
            }
            const userItemsRef = ref(db, `user/${authorID}/posts`);
            set(userItemsRef, updatedHeaders);
        }
    }

    async deleteDrafts(authorID: string) {
        if (HAS_FIREBASE) {
            // get current headers
            const userRef = ref(db, 'user');
            const rawData = (await get(child(userRef, `${authorID}/posts`))).val() ?? {};
            // filter
            const newHeaders = { }
            Object.keys(rawData).forEach(key => {
                if (rawData[key].status === 'draft') {
                    return;
                }
                newHeaders[key] = rawData[key]
            })
            // update
            const userItemsRef = ref(db, `user/${authorID}/posts`);
            set(userItemsRef, newHeaders);
        }
    }

    async addItem(newItem: EntryItem): Promise<BaseModelResponse> {

        if (HAS_FIREBASE) {
            const { authorID, id } = newItem;
            const dbRef = ref(db)

            // get the page number first
            const pageDetails = (await get(child(dbRef, 'page_detail'))).val() as { count: number, curPage: number }
            console.log(pageDetails)
            // update the page if necessary
            if (pageDetails.count === 100) {
                pageDetails.curPage += 1
                set(child(dbRef, "page_detail"), {
                    count: 0,
                    curPage: pageDetails.curPage
                })
            }

            console.log(pageDetails)

            // create a lightweight header file
            const entryHeader: EntryHeader = {
                difficulty: newItem.difficulty,
                id: newItem.id,
                slug: newItem.slug,
                title: newItem.title,
                tags: newItem.tags,
                authorID: newItem.authorID,
                ...(newItem.createdAt && { createdAt: newItem.createdAt }),
                ...(newItem.lastModified && { lastModified: newItem.lastModified })
            }

            // updated the user db
            const userItemRef = ref(db, `user/${authorID}/posts/${id}`);
            set(userItemRef, entryHeader);

            // update all post db
            const allpostRef = ref(db, `posts/${id}`)
            set(allpostRef, newItem)

            // update pages db
            console.log(`pages/${pageDetails.curPage}/${pageDetails.count}`)
            const pageRef = ref(db, `pages/${pageDetails.curPage}/${pageDetails.count}`)
            set(pageRef, entryHeader)

            // update page count
            set(child(dbRef, "page_detail"), {
                ...pageDetails,
                count: pageDetails.count + 1
            })

            return { error: null, data: newItem }
        } else {
            return {
                error: "No supported database",
                data: null
            }
        }
    }

    async deleteItem(entry: EntryItem): Promise<BaseModelResponse> {

        const { authorID, id } = entry

        if (HAS_FIREBASE) {

            try {
                // delete from user
                // do not delete sample
                const itemRef = ref(db, `user/${authorID}/posts/${id}`)
                if (id !== 'entry_id')
                    await remove(itemRef);

                // delete from all post
                // do not delete sample
                if (id !== 'entry_id')
                    await remove(ref(db, `posts/${id}`))

                return { error: null, data: entry }
            } catch (err) {
                console.log(err);
                return { error: err, data: "" }
            }
        }
    }
}

export default new ListModel(API_ENDPOINT)