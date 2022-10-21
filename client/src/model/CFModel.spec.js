import CFModel from "./CFModel";

const CF_HANDLE_MOCK = 'Fefer_Ivan'
const AUTHOD_ID_MOCK = 'Sample'

const passedTest = {
    "id": 1,
    "contestId": 1,
    "problem": {
        "contestId": 1,
        "index": "A",
        "name": "Sample Problem",
        "rating": 1600,
        "tags": [
            "brute force",
            "data structures",
            "dp"
        ]
    },
    "verdict": "OK",
}

const passedHeader = {
    id: "1",
    authorID: AUTHOD_ID_MOCK,
    difficulty: 1600,
    slug: "CF1A",
    tags: ["Brute Force", "Data Structures", "DP"],
    title: "Sample Problem",
    status: "draft",
    tagOnly: true
}

const failedTest = {
    "id": 2,
    "contestId": 1,
    "problem": {
        "contestId": 1,
        "index": "B",
        "name": "Sample Fail",
        "rating": 1600,
        "tags": [
            "brute force",
            "data structures",
            "dp"
        ]
    },
    "verdict": "WRONG_ANSWER",
}

const baseResults = [
    passedTest
]

const baseFetchResponse = {
    ok: true,
    json: () => Promise.resolve({
        status: "OK",
        result: baseResults
    })
}

global.fetch = jest.fn(() => {
    return Promise.resolve(baseFetchResponse)
})

const genResult = (result) => 
    () => Promise.resolve({
        status: "OK",
        result: result
    })

describe('CF Model user submission fetching', () => {

    beforeEach(() => {
        fetch.mockClear();
    })

    it('does not crash', async () => {
        expect.assertions(1)
        const { error } = await CFModel.fetchUserSubmissions(CF_HANDLE_MOCK, AUTHOD_ID_MOCK)
        expect(error).toBeNull()
    })

    it('formats the data into EntryHeader[]', async () => {
        expect.assertions(1)
        const { data } = await CFModel.fetchUserSubmissions(CF_HANDLE_MOCK, AUTHOD_ID_MOCK)
        expect(data).toStrictEqual([passedHeader])
    })

    it('removes duplicate submissions', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ...baseFetchResponse,
            json: genResult([passedTest, passedTest])
        }))
        expect.assertions(1)
        const { data } = await CFModel.fetchUserSubmissions(CF_HANDLE_MOCK, AUTHOD_ID_MOCK)
        expect(data).toStrictEqual([passedHeader])
    })

    it('removes failed submissions', async () => {
        fetch.mockImplementationOnce(() => Promise.resolve({
            ...baseFetchResponse,
            json: genResult([passedTest, failedTest])
        }))
        expect.assertions(1)
        const { data } = await CFModel.fetchUserSubmissions(CF_HANDLE_MOCK, AUTHOD_ID_MOCK)
        expect(data).toStrictEqual([passedHeader])
    })

    it('does not crash on bad handle', async () => {
        fetch.mockImplementationOnce(() => Promise.reject("handle: User with handle Fefer_Iva not found"))
        expect.assertions(1)
        const { error } = await CFModel.fetchUserSubmissions(CF_HANDLE_MOCK, AUTHOD_ID_MOCK)
        expect(error).not.toBeNull()
    })
})