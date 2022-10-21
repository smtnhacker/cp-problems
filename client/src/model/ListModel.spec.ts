// @ts-ignore
// These are custom functions used only in mocks
import { cleanModule, getDB } from "firebase/database" 

import { EntryHeader, EntryItem } from "../features/types/list"
import ListModel from "./ListModel"

jest.mock("firebase/database")
jest.mock("../util/firebase")

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

    it("deletes drafts properly", async () => {
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
})