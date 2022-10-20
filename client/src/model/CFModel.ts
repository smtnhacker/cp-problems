import { EntryHeader } from "../features/types/list"
import getBestTag from "../util/getBestTag"

interface CFProblem {
    contestID?: number,
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

interface ModelSubmissionListResponse {
    error: any,
    data: Array<EntryHeader & { status: string }> 
}

class CFModel {
    async fetchUserSubmissions(cfHandle: string, authorID: string): Promise<ModelSubmissionListResponse> {
        console.log("Fetching...")
        try {
            const response: Response = await fetch(
                `https://codeforces.com/api/user.status?handle=${cfHandle}`)

            if (!response.ok) {
                return { error: response.statusText, data: null }
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
                    tags: submission.problem.tags.map(tag => tag),
                    title: submission.problem.name,
                    status: "draft"
                }

                data.push(newEntry)
            })
            console.table(data.slice(0,10))
            
            const noDuplicates: Array<EntryHeader & { status: string }> = []
            const sortedData = data.sort((a, b) => {
                return a.slug < b.slug ? -1 : 1
            })
            sortedData.forEach(cur => {
                if (noDuplicates.length === 0 || noDuplicates[noDuplicates.length-1].slug !== cur.slug) {
                    noDuplicates.push(cur)
                }
            })

            return { error: null, data: noDuplicates }
            

        } catch (err) {
            return { error: err, data: [] }
        }
    }
}

export default new CFModel()