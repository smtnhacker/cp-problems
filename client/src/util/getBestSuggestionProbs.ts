import { Problem } from "../model/CFModel";

export default function getBestSuggestionProbs(problems: Problem[], rating: number): Problem[] {
    if (rating < 800) {
        return problems
                .filter(prob => prob.rating <= 1300)
    }
    const nearRating = problems.filter(prob => prob.rating <= rating + 200 && prob.rating >= rating - 100)
    return nearRating
}