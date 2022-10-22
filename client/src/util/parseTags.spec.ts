import parseTags from "./parseTags";

describe("parse tags function", () => {
    it("does not crash", () => {
        expect.assertions(1)
        parseTags("")
        expect(true).toBeTruthy()
    })

    it("parses single valid tags", () => {
        expect(parseTags("dp")).toStrictEqual(["DP"])
        expect(parseTags("string")).toStrictEqual(["Strings"])
        expect(parseTags("Brute Force")).toStrictEqual(["Brute Force"])
    })

    it("deals with leading and trailing spaces", () => {
        expect(parseTags("     DP      ")).toStrictEqual(["DP"])
        expect(parseTags("           Graphs")).toStrictEqual(["Graphs"])
        expect(parseTags("DSU           ")).toStrictEqual(["DSU"])
    })

    it("handles properly spaced, comma-separated tags", () => {
        expect(parseTags("DP, DSU, Graphs")).toStrictEqual(["DP", "DSU", "Graphs"])
        expect(parseTags("Graphs, Greedy")).toStrictEqual(["Graphs", "Greedy"])
    })

    it("handles poorly formatted comma-separated tags", () => {
        expect(parseTags("  DP,   DSU   , Greedy    ")).toStrictEqual(["DP", "DSU", "Greedy"])
    })

    it("removes empty tags", () => {
        expect(parseTags("")).toStrictEqual([])
        expect(parseTags(",,,,,")).toStrictEqual([])
        expect(parseTags(",, ,,, , ,,, ,,, ,,,, ,")).toStrictEqual([])
        expect(parseTags(",, ,     ,, ,,, ,,,,    ,, Sorting,   ,  ,,,, ")).toStrictEqual(["Sorting"])
    })

    it("sorts the tags", () => {
        expect(parseTags("Sorting, Games, Ad-hoc")).toStrictEqual(["Ad-hoc", "Games", "Sorting"])
    })
})