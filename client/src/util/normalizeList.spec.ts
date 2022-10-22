import normalizeList from "./normalizeList";

describe("normalize list function", () => {
    it("does not crash", () => {
        expect.assertions(1)
        const list = [0, 0, 0, 0, 0, 0, 0, 0, 0]
        expect(normalizeList(list)).toBe(0)
    })

    it("gives priority to higher numbers", () => {
        const list = [0, 0, 0, 0, 100, 100, 100, 100, 100, 100, 100, 0, 0, 0]
        expect(normalizeList(list)).toBeGreaterThan(90)
    })

    it("converges to the maximum, but does not exceed it", () => {
        const list = [1000, 1000, 1000, 1000, 999, 999, 999, 999, 999]
        expect(normalizeList(list)).toBeLessThanOrEqual(1000)
    })
})