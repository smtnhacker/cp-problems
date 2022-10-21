// @ts-ignore
// These are custom functions used only in mocks
import { cleanModule, getDB } from "firebase/database" 

import { EntryHeader, EntryItem } from "../features/types/list"
import ListModel from "./ListModel"

jest.mock("firebase/database")
jest.mock("../util/firebase")

const AUTHOR_ID_MOCK = "Sample"

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
        const newItem: EntryItem = {
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
        const newHeader: EntryHeader = {
            difficulty: newItem.difficulty,
            id: newItem.id,
            slug: newItem.slug,
            title: newItem.title,
            tags: newItem.tags,
            authorID: newItem.authorID,
            ...(newItem.createdAt && { createdAt: newItem.createdAt }),
            ...(newItem.lastModified && { lastModified: newItem.lastModified })
        }
        await ListModel.addItem(newItem)
        expect(getDB()).toStrictEqual({
            "page_detail": {
                count: 1,
                curPage: 1
            },
            "pages": {
                "1": {
                    0: newHeader
                }
            },
            "posts": {
                "1": newItem
            },
            "user": {
                "Sample": {
                    "posts": {
                        "1": newHeader
                    },
                    "userDetail": {
                        "cf": "tourist",
                        "displayName": "tourist"
                    }
                }
            }
        })
    })
})