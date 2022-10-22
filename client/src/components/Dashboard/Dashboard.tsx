import { useEffect, useState, useMemo } from 'react'

import { EntryHeader, EntryItem, Tag } from '../../features/types/list'
import CFModel, { Problem } from '../../model/CFModel'
import getBestSuggestionProbs from '../../util/getBestSuggestionProbs'
import getBestTag from '../../util/getBestTag'
import normalizeList from '../../util/normalizeList'
import parseTags from '../../util/parseTags'
import removeDuplicates from '../../util/removeDuplicates'
import ProgressBar from './ProgressBar'

interface DashboardProps {
    list: EntryHeader[]
}

export interface TagDifficulty {
    tag: string,
    difficulty: number
}

interface DifficultyArray extends Array<number>{}

export interface TagDiffListType {
    [tag: string]: DifficultyArray
}

export interface TagScore {
    [key: string]: number
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

export const ratingNormalization = (validTags: Tag[], ratings: TagScore): number => {
    return Object.keys(ratings).reduce((total, cur) => {
        if (!validTags.includes(cur)) {
            return total
        }
        return Math.max(total, ratings[cur])
    }, 0)
}

export const getSlugs = (list: EntryHeader[] | EntryItem[]): { [slug: string]: boolean } => {
    return Array.from(list).reduce((total, cur): {[slug: string]: boolean} => {
        return { ...total, [cur.slug]: true }
    }, {})
}

const Dashboard = (props: DashboardProps) => {
    const [loading, setLoading] = useState(false);
    const [suggests, setSuggests] = useState<Problem[]>([])
    const [tags, setTags] = useState<TagScore>({})
    const existingSlugs = useMemo<{[slug: string]: boolean}>(() => getSlugs(props.list), [props.list])

    useEffect(() => {
        setLoading(true);

        const tagDiffList: TagDifficulty[] = props.list.reduce(getTagDifficultiesReducer, [])
        const tagDiffSorted: TagDiffListType = tagDiffList.reduce(getTagsByDifficultyReducer, {})
        setTags(normalizeTags(tagDiffSorted))
        
        setLoading(false);
    }, [props.list])

    const handleTagSubmit = async (e) => {
        e.preventDefault()

        const suggestTags: Tag[] = parseTags(e.target.suggest_tags.value)
        const { error, data } = await CFModel.fetchProblemsByTag(suggestTags)

        if (error) {
            return console.error(error)
        } 

        const ratingLevel = ratingNormalization(suggestTags, tags)
        const allSuggests = getBestSuggestionProbs(data, ratingLevel)

        const shownSuggestions = allSuggests
                                    .filter(prob => !(prob.slug in existingSlugs))
                                    .sort((a, b) => b.solvedCount - a.solvedCount)
                                    .slice(0, 10)

        setSuggests(shownSuggestions)
    }

    return (
        <div className='row'>
            <div className="col-7">
                <h2>Skill Set</h2>
                <ul className="list-group">
                    {loading ? 
                    <p>Loading...</p>
                    :
                    Object.keys(tags).sort((a, b) => tags[b] - tags[a]).map(tag => (
                        <li key={tag} className="list-group-item">
                            <div className="row">
                                <div className="col-2">{tag}</div>
                                <div className="col-10">
                                    <ProgressBar min={0} max={4000} width={tags[tag] * 100 / 4000} text={tags[tag].toFixed()} />
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <div className="col-5">
                <h2>Suggested Problems</h2>
                <form onSubmit={handleTagSubmit}>
                    <div className="input-group m-3">
                        <label htmlFor="suggest_tags" className="input-group-text">Tags</label>
                        <input type="text" name="suggest_tags" className="form-control" />
                        <input type="submit" value="Give me problems" className="btn btn-primary" />
                    </div>
                </form>
                <ul className='list-group'>
                    {suggests.map(prob => (
                        <li key={prob.slug} className="list-group-item">
                            <a href={prob.url ?? "#"} target="_blank" rel="noreferrer noopener" className="nav-link">
                                <strong>{prob.slug}</strong> {prob.name} <span className='text-muted'>({prob.rating} / {prob.solvedCount})</span>
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Dashboard