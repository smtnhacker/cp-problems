import { normalizeTags, TagDiffListType } from "./tagScoreReducers"

describe("normalize tags function", () => {
    it("does not crash", () => {
        expect.assertions(1)
        expect(normalizeTags({})).toBeDefined()
    })

    it("returns an object of numbers", () => {
        const list = {
            "a": [0, 10, 20],
            "b": [20, 30, 40]
        } as TagDiffListType
        const res = normalizeTags(list)
        Object.keys(res).forEach(key => {
            expect(typeof res[key]).toBe("number")
        })
    })
})