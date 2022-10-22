export default function normalizeList(list: Array<number>): number {

    const WEIGHTS = [1, 0.95, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5, 0.45, 0.4, 0.35, 0.3, 0.25, 0.2, 0.15, 0.1, 0.5]
    const NEEDED = 7;
    const TOTAL_WEIGHT = WEIGHTS.slice(0, NEEDED).reduce((total, cur) => total + cur, 0)

    const sortedList = Array.from(list)
    sortedList.sort((a, b) => b - a)
    return sortedList.slice(0, NEEDED)
            .reduce((total, cur, index) => {
                return total + WEIGHTS[index] * cur / TOTAL_WEIGHT;
            }, 0)
}