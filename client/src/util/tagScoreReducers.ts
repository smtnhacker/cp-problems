import { EntryHeader } from "../features/types/list"
import normalizeList from "./normalizeList"

export interface TagScore {
    [key: string]: number
}

export interface TagDifficulty {
    tag: string,
    difficulty: number
}

interface DifficultyArray extends Array<number>{}

export interface TagDiffListType {
    [tag: string]: DifficultyArray
}

export const normalizeTags = (list: TagDiffListType): TagScore => {
    let res: TagScore = {}
    Object.keys(list).forEach(tag => {
        res[tag] = normalizeList(list[tag])
    })
    return res
}

export const getTagDifficultiesReducer = (total: TagDifficulty[], cur: EntryHeader): TagDifficulty[] => {
    if (!cur.tags || cur.tags[0] === "") {
        return total
    }
    const flattened: TagDifficulty[] = cur.tags.map((tag): TagDifficulty => (
        { tag: tag, difficulty: cur.difficulty}
    ))
    return total.concat(flattened)
}

export const getTagsByDifficultyReducer = (total: TagDiffListType, cur: TagDifficulty): TagDiffListType => {
    if (cur.tag in total) {
        return { 
            ...total, 
            [cur.tag]: [...total[cur.tag], cur.difficulty] 
        }
    } else {
        return { 
            ...total, 
            [cur.tag]: [cur.difficulty] 
        }
    }
}