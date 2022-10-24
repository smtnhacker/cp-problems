import { set, get, ref, child, remove } from "firebase/database";

import { API_ENDPOINT, HAS_FIREBASE } from "../config"
import { db } from "../util/firebase";
import { EntryItem, EntryHeader } from "../features/types/list"
import { sha512 } from "js-sha512";
import { retrieveFromCache, saveToCache } from "../util/cache";

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

export const genIsValidIdDate = (authorID: string) => (data: any): boolean => (
    sha512(authorID) === data.key && (new Date()).toDateString() === data.savedAt
)

export const genIsValidDate = () => (data: any): boolean => (
    (new Date()).toDateString() === data.savedAt
)

export const convertHeadersToArray = (headers: BaseObject<EntryHeader>, authorID: string): Array<EntryHeader> => {
    return Object.keys(headers).map(key => {
                    return { ...headers[key], authorID: authorID}
                })
}

export const USER_ITEM_CACHE_KEY = 'cp-fave-user-items'
export const USER_HEADER_CACHE_KEY = 'cp-fave-item-new-headers'

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

        // Check cache first to save bandwidth!
        const cacheData = retrieveFromCache(USER_ITEM_CACHE_KEY, genIsValidIdDate(authorID))
        if (cacheData) {
            return { error: null, data: cacheData.data }
        }

        if (HAS_FIREBASE) {
            try {
                const userRef = ref(db, 'user');
                const rawData: RawResponse = (await get(child(userRef, `${authorID}/posts`))).val() ?? {};
                const data: EntryHeader[] = Object.keys(rawData).map(key => {
                    return { ...rawData[key], difficulty: parseInt(rawData[key].difficulty), authorID: authorID}
                })

                // save to cache!
                const toCache = {
                    savedAt: (new Date()).toDateString(),
                    key: sha512(authorID),
                    data: data
                }
                saveToCache(USER_ITEM_CACHE_KEY, toCache)

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

    async addHeader(newHeader: EntryHeader, authorID: string): Promise<BaseModelResponse> {
        if (HAS_FIREBASE) {
            // updated the user db
            const userItemsRef = ref(db, `user/${authorID}/posts/${newHeader.id}`);
            set(userItemsRef, newHeader);

            // update cache
            const cacheData = retrieveFromCache(USER_ITEM_CACHE_KEY, genIsValidIdDate(authorID))
            if (cacheData) {
                try {
                    cacheData.data.push(newHeader)
                    saveToCache(USER_ITEM_CACHE_KEY, cacheData)
                } catch (err) {
                    console.error("Invalid cache. Deleting...")
                    localStorage.removeItem(USER_ITEM_CACHE_KEY)
                }
            } else {
                console.warn("Do not delete cache")
            }

            return { error: null, data: null }
        }
    }

    async addHeaders(newHeaders: EntryHeader[], authorID: string): Promise<ModelHeaderResponse> {

        // ensure that the sync is used sparingly, use cache to enforce
        // hacker people, if you can read this, please don't delete the cache

        const cache = localStorage.getItem(USER_HEADER_CACHE_KEY)
        if (cache) {
            try {
                const data = JSON.parse(cache)
                if ((new Date()).toDateString() === data.savedAt && data.left <= 0) {
                    alert("No more syncing for today...")
                    return { error: "too much syncing", data: null }
                }
            } catch (err) { }
        }

        if (HAS_FIREBASE) {
            // get current headers
            const userRef = ref(db, 'user');
            const rawData: BaseObject<EntryHeader> = (await get(child(userRef, `${authorID}/posts`))).val() ?? {};
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

            // update the cache limit
            let syncLeft: number;
            const cacheData = retrieveFromCache(USER_HEADER_CACHE_KEY, genIsValidDate())
            if (cacheData) {
                syncLeft = cacheData.left - 1;
            } else {
                syncLeft = 2;
            }

            alert(`You have ${syncLeft} syncs left for today`)
            saveToCache(USER_HEADER_CACHE_KEY, {
                savedAt: (new Date()).toDateString(),
                left: syncLeft
            })
            
            // delete the user-items cache
            localStorage.removeItem(USER_ITEM_CACHE_KEY)

            return { error: null, data: convertHeadersToArray(updatedHeaders, authorID) } 
        }
    }

    async deleteDrafts(authorID: string) {

        // delete cache
        localStorage.removeItem(USER_ITEM_CACHE_KEY)

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
            // update the page if necessary
            if (pageDetails.count === 100) {
                pageDetails.curPage += 1
                pageDetails.count = 0
                set(child(dbRef, "page_detail"), {
                    count: 0,
                    curPage: pageDetails.curPage
                })
            }

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
            const pageRef = ref(db, `pages/${pageDetails.curPage}/${pageDetails.count}`)
            set(pageRef, entryHeader)

            // update page count
            set(child(dbRef, "page_detail"), {
                ...pageDetails,
                count: pageDetails.count + 1
            })

            // save to cache!
            const cacheData = retrieveFromCache(USER_ITEM_CACHE_KEY, genIsValidIdDate(authorID))
            if (cacheData) {
                try {
                    cacheData.data.push(entryHeader)
                    saveToCache(USER_ITEM_CACHE_KEY, cacheData)
                } catch (err) {
                    console.error("Invalid cache. Deleting...")
                    localStorage.removeItem(USER_ITEM_CACHE_KEY)
                }
            } else {
                console.warn("Do not delete cache")
            }

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
                
                // delete from cache
                const cacheData = retrieveFromCache(USER_ITEM_CACHE_KEY, genIsValidIdDate(authorID))
                if (cacheData) {
                    try {
                        cacheData.data = cacheData.data.filter(entry => entry.id !== id)
                        saveToCache(USER_ITEM_CACHE_KEY, cacheData)
                    } catch (err) {
                        console.error("Invalid cache. Deleting...")
                        localStorage.removeItem(USER_ITEM_CACHE_KEY)
                    }
                } else {
                    console.warn("Do not delete the cache")
                }

                return { error: null, data: entry }
            } catch (err) {
                console.log(err);
                return { error: err, data: "" }
            }
        }
    }

    async deleteHeader(entry: EntryHeader): Promise<BaseModelResponse> {
        const { authorID, id } = entry;

        if (HAS_FIREBASE) {
            try {
                // delete from user post
                const itemRef = ref(db, `user/${authorID}/posts/${id}`)
                await remove(itemRef)

                // delete from cache
                const cacheData = retrieveFromCache(USER_ITEM_CACHE_KEY, genIsValidIdDate(authorID))
                if (cacheData) {
                    try {
                        cacheData.data = cacheData.data.filter(entry => entry.id !== id)
                        saveToCache(USER_ITEM_CACHE_KEY, cacheData)
                    } catch (err) {
                        console.error("Invalid cache. Deleting...")
                        localStorage.removeItem(USER_ITEM_CACHE_KEY)
                    }
                } else {
                    console.warn("Do not delete the cache")
                }

                return { error: null, data: entry }
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

export default new ListModel(API_ENDPOINT)