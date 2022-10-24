import { EntryHeader, Tag } from "../features/types/list"
import getBestTag from "../util/getBestTag"

interface CFProblem {
    contestId?: number,
    problemsetName?: string,
    index: string,
    name: string,
    type: "PROGRAMMING" | "QUESTION",
    points?: number,
    rating?: number,
    tags: string[]
}

interface Member {
    handle: string,
    name: string
}

interface CFParty {
    contestId?: number,
    members: Member[],
    participantType: "CONTESTANT" | "PRACTICE" | "VIRTUAL" | "MANAGER" | "OUT_OF_COMPETITION",
    teamId?: number,
    teamName?: string,
    ghost: boolean,
    room?: number,
    startTimeSeconds?: number
}

interface CFSubmission {
    id: number,
    contestId?: number,
    creationTimeSeconds: number,
    relativeTimeSeconds: number,
    problem: CFProblem,
    author: CFParty,
    programmingLanguage: string,
    verdict?: "OK" | string,
    testset: any,
    passedTestCount: number,
    timeConsumedMillis: number,
    memoryConsumedBytes: number,
    points?: number
}

interface CFProblemStat {
    contestId: number,
    index: string,
    solvedCount: number
}

export interface Problem extends CFProblem {
    solvedCount: number,
    slug: string,
    url: string
}

interface ModelSubmissionListResponse {
    error: any,
    data: Array<EntryHeader & { status: string }> 
}

interface ModelProblemListResponse {
    error: any,
    data: Problem[]
}

class CFModel {
    async fetchUserSubmissions(cfHandle: string, authorID: string): Promise<ModelSubmissionListResponse> {
        const tagCache: { [tag: string]: Tag } = {}

        try {
            const response: Response = await fetch(
                `https://codeforces.com/api/user.status?handle=${cfHandle}`)
                
            if (!response.ok) {
                const { comment } = await response.json()
                return { error: comment, data: null }
            }
            
            const rawData: { status: string, result: CFSubmission[] } = await response.json()
            if (rawData.status !== "OK") {
                return { error: "something went wrong", data: null }
            }
            
            const data: Array<EntryHeader & { status: string }>  = []
            rawData.result.forEach(submission => {
                
                if (submission.verdict !== "OK") {
                    return;
                }
                
                const newEntry: EntryHeader & { status: string } = {
                    id: submission.id.toString(),
                    authorID: authorID,
                    difficulty: submission.problem.rating || 1900,
                    slug: `CF${submission.contestId}${submission.problem.index}`,
                    tags: submission.problem.tags.map(tag => {
                        if (tag in tagCache) {
                            return tagCache[tag]
                        }
                        const newTag = getBestTag(tag)
                        tagCache[tag] = newTag
                        return newTag
                    }),
                    title: submission.problem.name,
                    status: "draft",
                    tagOnly: true
                }

                data.push(newEntry)
            })
            
            const noDuplicates: Array<EntryHeader & { status: string }> = []
            const sortedData = data.sort((a, b) => {
                return a.slug < b.slug ? -1 : 1
            })
            sortedData.forEach(cur => {
                if (noDuplicates.length === 0 || noDuplicates[noDuplicates.length-1].slug !== cur.slug) {
                    noDuplicates.push(cur)
                }
            })
            
            console.table(noDuplicates.slice(0,10))
            return { error: null, data: noDuplicates }
            

        } catch (err) {
            return { error: err, data: [] }
        }
    }

    async fetchRecentSubmissions(cfHandle: string, authorID: string): Promise<ModelSubmissionListResponse> {
        const tagCache: { [tag: string]: Tag } = {}

        try {
            const response: Response = await fetch(
                `https://codeforces.com/api/problemset.recentStatus?count=1000`)
                
            if (!response.ok) {
                const { comment } = await response.json()
                return { error: comment, data: null }
            }
            
            const rawData: { status: string, result: CFSubmission[] } = await response.json()
            if (rawData.status !== "OK") {
                return { error: "something went wrong", data: null }
            }
            
            const data: Array<EntryHeader & { status: string }>  = []
            rawData.result.forEach(submission => {
                
                if (submission.author.members[0].handle !== cfHandle || submission.verdict !== "OK") {
                    return;
                }
                
                const newEntry: EntryHeader & { status: string } = {
                    id: submission.id.toString(),
                    authorID: authorID,
                    difficulty: submission.problem.rating || 1900,
                    slug: `CF${submission.contestId}${submission.problem.index}`,
                    tags: submission.problem.tags.map(tag => {
                        if (tag in tagCache) {
                            return tagCache[tag]
                        }
                        const newTag = getBestTag(tag)
                        tagCache[tag] = newTag
                        return newTag
                    }),
                    title: submission.problem.name,
                    status: "draft",
                    tagOnly: true
                }

                data.push(newEntry)
            })
            
            const noDuplicates: Array<EntryHeader & { status: string }> = []
            const sortedData = data.sort((a, b) => {
                return a.slug < b.slug ? -1 : 1
            })
            sortedData.forEach(cur => {
                if (noDuplicates.length === 0 || noDuplicates[noDuplicates.length-1].slug !== cur.slug) {
                    noDuplicates.push(cur)
                }
            })
            
            console.table(noDuplicates.slice(0,10))
            return { error: null, data: noDuplicates }
            

        } catch (err) {
            return { error: err, data: [] }
        }
    }

    async fetchProblemsByTag(tags: Tag[]): Promise<ModelProblemListResponse> {
        const convertToCF = (tag: Tag): string => {
            if (tag === 'DFS') {
                return 'dfs and similar'
            } else if (tag === 'DP') {
                return 'dp'
            } else if (tag === 'DSU') {
                return 'dsu'
            } else if (tag === '2-SAT') {
                return '2-sat'
            } else if (tag === 'Meet-In-The-Middle') {
                return 'meet-in-the-middle'
            } else {
                return tag.toLocaleLowerCase()
            }
        }

        const tagParam = tags
                        .filter(tag => tag.length > 0)
                        .map(tag => convertToCF(tag))
                        .reduce((total, cur) => {
                            return total.length ? total + ";" + cur : cur
                        }, "")
        const param = tagParam.length ? `?tags=${tagParam}` : "";

        try {
            const response: Response = await fetch(
                `https://codeforces.com/api/problemset.problems${param}`
            )

            if (!response.ok) {
                const { comment } = await response.json()
                return { error: comment, data: null }
            }
            
            const rawData: { status: string, result } = await response.json()
            if (rawData.status !== "OK") {
                return { error: "something went wrong", data: null }
            }

            const data: Problem[] = []
            const { problems, problemStatistics } = rawData.result

            for(const index in problems) {
                const prob: CFProblem = problems[index]
                const stat: CFProblemStat = problemStatistics[index]
                
                if (prob.contestId !== stat.contestId && prob.index !== stat.index) {
                    throw Error("statistics don't match with the problems")
                }

                data.push({
                    ...prob, 
                    ...stat, 
                    slug: `CF${prob.contestId}${prob.index}`,
                    url: `https://codeforces.com/contest/${prob.contestId}/problem/${prob.index}`
                })
            }

            // console.table(data.slice(0, 15))
            return { error: null, data: data }

        } catch (err) {
            return { error: err, data: [] }
        }
    }
}

export default new CFModel()