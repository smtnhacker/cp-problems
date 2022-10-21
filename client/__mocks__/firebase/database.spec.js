import { set, getDB, child, ref, get, remove, smokeTest, cleanModule } from "firebase/database"

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

describe("firebase mock methods", () => {

    afterEach(() => {
        cleanModule(initialDB)
    })

    it("loads correctly", () => {
        expect(smokeTest()).toBe("Running...")
    })

    it("loads the database", () => {
        expect(getDB()).toStrictEqual(initialDB)
    })

    it("sets existing keys correctly", () => {
        set('posts', {
            sample: "sample"
        })
        expect(getDB()).toStrictEqual({
            ...initialDB,
            posts: {
                sample: "sample"
            }
        })
    })

    it("sets deep existing keys correctly", () => {
        set('user/Sample/userDetail/cf', "hackerman")
        expect(getDB().user.Sample.userDetail.cf).toBe("hackerman")
    })

    it("sets nested non-existing keys correctly", () => {
        set("posts/sample_post/id", "1")
        expect(getDB().posts).toStrictEqual({
            sample_post: {
                id: "1"
            }
        })
    })

    it("gets child path correctly", () => {
        expect(child("post", "1")).toBe("post/1")
        expect(child("post", "sub/path")).toBe("post/sub/path")
        expect(child("post/sub", "path/deep")).toBe("post/sub/path/deep")
    })

    it("gets existing keys", () => {
        expect(get("page_detail").val()).toStrictEqual({
            count: 0,
            curPage: 1
        })
        expect(get("posts").val()).toStrictEqual({})
    })

    it("gets existing deep keys", () => {
        expect(get("user/Sample/userDetail").val()).toStrictEqual({
            "cf": "tourist",
            "displayName": "tourist"
        })
    })

    it("uses get, ref, and child together correctly", () => {
        const dbRef = ref(getDB())
        expect(get(child(dbRef, "page_detail")).val()).toStrictEqual({
            count: 0,
            curPage: 1
        })
    })

    it("gets undefined at non-existing keys", () => {
        expect(get("nothing")).toBe(undefined)
        expect(get("user/no_one")).toBe(undefined)
    })

    it("removes existing keys", () => {
        remove("user")
        remove("page_detail")
        expect(getDB()).toStrictEqual({
            "pages": {
                "1": {
        
                }
            },
            "posts": {
        
            }
        })
    })

    it("does not crash on removal of non-existing keys", () => {
        expect.assertions(1)
        remove("nothing")
        expect(getDB()).toStrictEqual(initialDB)
    })
})