// @ts-ignore
// These are custom functions used only in mocks
import { cleanModule, getDB } from "firebase/database" 
// @ts-ignore
import localStorageMock from "localstorage"

import { EntryHeader, EntryItem } from "../features/types/list"
import ListModel, { USER_HEADER_CACHE_KEY, USER_ITEM_CACHE_KEY } from "./ListModel"

jest.mock("js-sha512")
jest.mock("firebase/database")
jest.mock("../util/firebase")

global.localStorage  = new localStorageMock()
global.alert = jest.fn((val) => {})

const AUTHOR_ID_MOCK = "Sample"

const sampleItem: EntryItem = {
    id: "1",
    authorID: AUTHOR_ID_MOCK,
    title: "Sample",
    description: "sample description",
    difficulty: 0,
    url: "sample url",
    tags: ["sample tag"],
    slug: "sample slug",
    status: "public",
    createdAt: "now",
    lastModified: "now"
}

const sampleHeader: EntryHeader = {
    difficulty: sampleItem.difficulty,
    id: sampleItem.id,
    slug: sampleItem.slug,
    title: sampleItem.title,
    tags: sampleItem.tags,
    authorID: sampleItem.authorID,
    ...(sampleItem.createdAt && { createdAt: sampleItem.createdAt }),
    ...(sampleItem.lastModified && { lastModified: sampleItem.lastModified })
}

const initialDB = {
    "page_detail": {
        count: 0,
        curPage: 1
    },
    "pages": {
        "1": {

        }
    },
    "posts": {

    },
    "user": {
        "Sample": {
            "posts": {

            },
            "userDetail": {
                "cf": "tourist",
                "displayName": "tourist"
            }
        }
    }
}

describe("List Model", () => {

    beforeEach(() => {
        localStorage.clear()
    })

    afterEach(() => {
        cleanModule(initialDB)
    })

    it("does not crash", () => {
        expect(true).toBeTruthy()
    })

    it("add headers properly", async () => {
        expect.assertions(1)
        const newHeaders = [
            { id: "1" }, { id: "2" }
        ]
        // @ts-ignore
        // there is no need to use a full header here
        await ListModel.addHeaders(newHeaders, AUTHOR_ID_MOCK)
        expect(getDB().user.Sample.posts).toStrictEqual({
            1: { id: "1" },
            2: { id: "2" }
        })
    })

    it("returns new headers in an array form", async () => {
        expect.assertions(1)
        const newHeaders = [{ id: "1" }]
        // @ts-ignore
        const { data } = await ListModel.addHeaders(newHeaders, AUTHOR_ID_MOCK)
        expect(data).toStrictEqual([
            { id: "1", authorID: AUTHOR_ID_MOCK }
        ])
    })

    it("add headers to the right person", async () => {
        expect.assertions(1)
        const newHeaders = [{ id: "1" }]
        // @ts-ignore
        await ListModel.addHeaders(newHeaders, AUTHOR_ID_MOCK)
        expect(getDB()).toStrictEqual({
            ...initialDB,
            user: { Sample: { ...initialDB.user.Sample, posts: {
                1: { id: "1" }
            }}}
        })
    })

    it("add single headers properly", async () => {
        expect.assertions(1)
        const newHeader = { id: "1" }
        // @ts-ignore
        await ListModel.addHeader(newHeader, AUTHOR_ID_MOCK)
        expect(getDB()).toStrictEqual({
            ...initialDB,
            user: { Sample: { ...initialDB.user.Sample, posts: {
                1: { id: "1" }
            }}}
        })
    })

    it("mass deletes drafts properly", async () => {
        expect.assertions(3)
        const newHeaders = [
            { id: "1", status: "draft" },
            { id: "2", status: "draft" },
            { id: "3" }
        ]
        // @ts-ignore
        await ListModel.addHeaders(newHeaders, AUTHOR_ID_MOCK)
        expect(getDB().user.Sample.posts).toStrictEqual({
            1: { id: "1", status: "draft" },
            2: { id: "2", status: "draft" },
            3: { id: "3" }
        })
        await ListModel.deleteDrafts(AUTHOR_ID_MOCK)
        expect(getDB().user.Sample.posts).toStrictEqual({
            3: { id: "3" }
        })
        expect(getDB()).toStrictEqual({
            ...initialDB,
            user: { Sample: { ...initialDB.user.Sample, posts: {
                3: { id: "3" }
            }}}
        })
    })

    it("adds items properly", async () => {
        expect.assertions(1)
        await ListModel.addItem(sampleItem)
        expect(getDB()).toStrictEqual({
            "page_detail": {
                count: 1,
                curPage: 1
            },
            "pages": {
                "1": {
                    0: sampleHeader
                }
            },
            "posts": {
                "1": sampleItem
            },
            "user": {
                "Sample": {
                    "posts": {
                        "1": sampleHeader
                    },
                    "userDetail": {
                        "cf": "tourist",
                        "displayName": "tourist"
                    }
                }
            }
        })
    })

    it("deletes single items properly", async () => {
        expect.assertions(1)
        cleanModule({
            ...initialDB, 
            user: {
                [AUTHOR_ID_MOCK]: {
                    ...initialDB.user[AUTHOR_ID_MOCK],
                    posts: {
                        1: { id: "1" }    
                    } 
                }
            },
            posts: {
                1: { id: "1" }
            }
        })
        // @ts-ignore
        await ListModel.deleteItem({ id: "1", authorID: AUTHOR_ID_MOCK })
        expect(getDB()).toStrictEqual(initialDB)
    })

    it("deletes single headers properly", async () => {
        expect.assertions(1)
        cleanModule({
            ...initialDB,
            user: {
                [AUTHOR_ID_MOCK]: {
                    ...initialDB.user[AUTHOR_ID_MOCK],
                    posts: {
                        1: { id: "1" }
                    }
                }
            }
        })
        // @ts-ignore
        await ListModel.deleteHeader({ id: "1", authorID: AUTHOR_ID_MOCK })
        expect(getDB()).toStrictEqual(initialDB)
    })

    it("uses pagination properly", async () => {
        expect.assertions(1)
        cleanModule({...initialDB, page_detail: {
            count: 100,
            curPage: 1
        }})
        await ListModel.addItem(sampleItem)
        expect(getDB().page_detail).toStrictEqual({
            count: 1,
            curPage: 2
        })
    })

    describe("caching mechanism", () => {

        const sampleItemCache = {
            savedAt: (new Date()).toDateString(),
            key: AUTHOR_ID_MOCK,
            data: []
        }

        const sampleHeaderCache = {
            savedAt: (new Date()).toDateString(),
            left: 3
        }

        it("localStorage does not crash", () => {
            expect.assertions(1)
            localStorage.setItem("test", "nothing")
            localStorage.getItem("test")
            localStorage.removeItem("test")
            expect(localStorage.store).toStrictEqual({})
        })

        it("does not crash when adding a new item with missing cache", async () => {
            expect.assertions(1)
            await ListModel.addItem(sampleItem)
            expect(localStorage.store).toStrictEqual({})
        })

        it("adds new item in cache", async () => {
            expect.assertions(1)
            localStorage.setItem(USER_ITEM_CACHE_KEY, JSON.stringify(sampleItemCache))
            await ListModel.addItem(sampleItem)
            const cache = JSON.parse(localStorage.getItem(USER_ITEM_CACHE_KEY))
            expect(cache).toStrictEqual({
                ...sampleItemCache,
                data: [sampleHeader]
            })
        })

        it("does not modify invalid author", async () => {
            expect.assertions(1)
            localStorage.setItem(USER_ITEM_CACHE_KEY, JSON.stringify({
                ...sampleItemCache,
                key: "1"
            }))
            await ListModel.addItem(sampleItem)
            const cache = JSON.parse(localStorage.getItem(USER_ITEM_CACHE_KEY))
            expect(cache).toStrictEqual({
                ...sampleItemCache,
                key: "1"
            })
        })

        it("does not modify invalid date", async () => {
            expect.assertions(1)
            localStorage.setItem(USER_ITEM_CACHE_KEY, JSON.stringify({
                ...sampleItemCache,
                savedAt: "fake"
            }))
            await ListModel.addItem(sampleItem)
            const cache = JSON.parse(localStorage.getItem(USER_ITEM_CACHE_KEY))
            expect(cache).toStrictEqual({
                ...sampleItemCache,
                savedAt: "fake"
            })
        })

        it("deletes cache on mass delete draft", async () => {
            expect.assertions(1)
            localStorage.setItem(USER_ITEM_CACHE_KEY, JSON.stringify(sampleItemCache))
            await ListModel.deleteDrafts(AUTHOR_ID_MOCK)
            expect(localStorage.store).toStrictEqual({})
        })

        it("updates on mass header insertion", async () => {
            expect.assertions(1)
            localStorage.setItem(USER_HEADER_CACHE_KEY, JSON.stringify(sampleHeaderCache))
            localStorage.setItem(USER_ITEM_CACHE_KEY, JSON.stringify(sampleItemCache))
            await ListModel.addHeaders([sampleHeader], AUTHOR_ID_MOCK)
            expect(localStorage.store).toStrictEqual({
                [USER_HEADER_CACHE_KEY]: JSON.stringify({ ...sampleHeaderCache, left: 2 })
            })
        })

        it("does nothing on mass header insertion when out of tries", async () => {
            expect.assertions(1)
            localStorage.setItem(USER_HEADER_CACHE_KEY, JSON.stringify({
                ...sampleHeaderCache,
                left: 0
            }))
            localStorage.setItem(USER_ITEM_CACHE_KEY, JSON.stringify(sampleItemCache))
            await ListModel.addHeaders([sampleHeader], AUTHOR_ID_MOCK)
            expect(localStorage.store).toStrictEqual({
                [USER_HEADER_CACHE_KEY]: JSON.stringify({ ...sampleHeaderCache, left: 0 }),
                [USER_ITEM_CACHE_KEY]: JSON.stringify(sampleItemCache)
            })
        })

        it("deletes cache on item delete", async () => {
            expect.assertions(1)
            localStorage.setItem(USER_ITEM_CACHE_KEY, JSON.stringify({
                ...sampleItemCache,
                data: [sampleItem]
            }))
            await ListModel.deleteItem(sampleItem)
            expect(localStorage.store).toStrictEqual({
                [USER_ITEM_CACHE_KEY]: JSON.stringify(sampleItemCache)
            })
        })

        it("deletes cache on header delete", async () => {
            expect.assertions(1)
            localStorage.setItem(USER_ITEM_CACHE_KEY, JSON.stringify({
                ...sampleItemCache,
                data: [sampleHeader]
            }))
            await ListModel.deleteHeader(sampleHeader)
            expect(localStorage.store).toStrictEqual({
                [USER_ITEM_CACHE_KEY]: JSON.stringify(sampleItemCache)
            })
        })
    })
})