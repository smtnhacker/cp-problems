import { Problem } from "../model/CFModel";
import getBestSuggestionProbs from "./getBestSuggestionProbs";

const problems = [
    { rating: 0 },
    { rating: 100 },
    { rating: 1000 },
    { rating: 1200 },
    { rating: 1300 },
    { rating: 2000 },
    { rating: 2200 },
    { rating: 3000 },
    { rating: 3400 },
    { rating: 3500 }
] as Problem[]

describe("get best suggestion function", () => {
    it("does not crash when entry has a rating", () => {
        expect.assertions(1)
        const list = [{ rating: 0 }] as Problem[]
        expect(getBestSuggestionProbs(list, 100)).toBeDefined()
    })

    it("returns a problem even if the rating is 0", () => {
        expect(getBestSuggestionProbs(problems, 0).length).toBeTruthy()
        expect(getBestSuggestionProbs(problems, 100).length).toBeTruthy()
        expect(getBestSuggestionProbs(problems, 700).length).toBeTruthy()
    })

    it("returns problem near the given rating", () => {
        expect(getBestSuggestionProbs(problems, 1000)).toStrictEqual([{ rating: 1000 }, { rating: 1200 }])
        expect(getBestSuggestionProbs(problems, 1300)).toStrictEqual([{ rating: 1200 }, { rating: 1300 }])
        expect(getBestSuggestionProbs(problems, 2100)).toStrictEqual([{ rating: 2000 }, { rating: 2200 }])
        expect(getBestSuggestionProbs(problems, 3500)).toStrictEqual([{ rating: 3400 }, { rating: 3500 }])
    })
})