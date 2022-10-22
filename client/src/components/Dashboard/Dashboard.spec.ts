import { EntryHeader } from "../../features/types/list"
import {
    getSlugs,
    ratingNormalization,
    normalizeTags,
    TagDiffListType,
    getTagDifficultiesReducer
} from "./Dashboard"

describe("get slugs function", () => {
    it("does not crash", () => {
        expect.assertions(2)
        expect(getSlugs([])).toBeDefined()
        // @ts-ignore
        expect(getSlugs([{ slug: "waw" }])).toBeDefined()
    })

    it("extracts the slugs properly", () => {
        const list = [
            { slug: "1" },
            { slug: "2" },
            { slug: "3" },
            { slug: "four" }
        ] as EntryHeader[]
        expect(getSlugs(list)).toStrictEqual({
            "1": true, "2": true, "3": true, "four": true
        })
    })
})

describe("rating normalization function", () => {
    it("does not crash", () => {
        expect.assertions(1)
        expect(ratingNormalization([], {})).toBeDefined()
    })

    it("returns a number", () => {
        expect(ratingNormalization([], {})).toBe(0)
        expect(typeof ratingNormalization(["a"], { a: 100 })).toBe("number")
    })

    it("ignores invalid tag scores", () => {
        expect(ratingNormalization([], { a: 3500 })).toBe(0)
    })

    it("produces a number at least the minimum of valid tags", () => {
        expect(ratingNormalization(["a", "b", "c"], {
            a: 100, b: 200, c: 300, d: 400
        })).toBeGreaterThanOrEqual(100)
    })

    it("produces a number not greater than the maximum valid tag", () => {
        expect(ratingNormalization(["a", "b", "c"], {
            a: 100, b: 200, c: 300, d: 0
        })).toBeLessThanOrEqual(300)
    })
})

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