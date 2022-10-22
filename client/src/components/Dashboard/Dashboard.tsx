import { useEffect, useState, useMemo } from 'react'
import { EntryHeader, Tag } from '../../features/types/list'
import CFModel, { Problem } from '../../model/CFModel'
import getBestSuggestionProbs from '../../util/getBestSuggestionProbs'
import getBestTag from '../../util/getBestTag'
import removeDuplicates from '../../util/removeDuplicates'
import ProgressBar from './ProgressBar'

interface DashboardProps {
    list: EntryHeader[]
}

interface TagDifficulty {
    tag: string,
    difficulty: number
}

interface DifficultyArray extends Array<number>{}

interface TagDiffListType {
    [tag: string]: DifficultyArray
}

interface TagScore {
    [key: string]: number
}

const normalizeList = (list: Array<number>): number => {

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

const normalizeTags = (list: TagDiffListType): TagScore => {
    let res: TagScore = {}
    Object.keys(list).forEach(tag => {
        res[tag] = normalizeList(list[tag])
    })
    return res
}

const Dashboard = (props: DashboardProps) => {
    const [loading, setLoading] = useState(false);
    const [tags, setTags] = useState<TagScore>({})
    const [suggests, setSuggests] = useState<Problem[]>([])
    const existingSlugs = useMemo<{[slug: string]: boolean}>(() => props.list.reduce((total, cur): {[slug: string]: boolean} => {
        return { ...total, [cur.slug]: true }
    }, {}), [props.list])

    useEffect(() => {
        setLoading(true);
        // console.log(props.list)
        const tagDiffList: TagDifficulty[] = props.list.reduce((total: TagDifficulty[], cur: EntryHeader) => {
            if (!cur.tags || cur.tags[0] === "") {
                return total
            }
            const flattened: TagDifficulty[] = cur.tags.map((tag): TagDifficulty => (
                { tag: tag, difficulty: cur.difficulty}
            ))
            return total.concat(flattened)
        }, [])
        const tagDiffSorted: TagDiffListType = tagDiffList.reduce((total: TagDiffListType, cur: TagDifficulty): TagDiffListType => {
            if (cur.tag in total) {
                return { ...total, [cur.tag]: [...total[cur.tag], cur.difficulty] }
            } else {
                return { ...total, [cur.tag]: [cur.difficulty] }
            }
        }, {})
        setTags(normalizeTags(tagDiffSorted))
        setLoading(false);
    }, [])

    const handleTagSubmit = async (e) => {
        e.preventDefault()
        const suggestTags: Tag[] = removeDuplicates(
                            e.target.suggest_tags.value.split(",")
                            .map((tag: string) => tag.trim())
                            .map((tag: string) => getBestTag(tag))
                            .filter((tag: string) => tag.length > 0)
                        )

        const { error, data } = await CFModel.fetchProblemsByTag(suggestTags)
        if (error) {
            console.error(error)
        } else {
            const ratingLevel: number = Object.keys(tags).reduce((total, cur) => {
                if (!suggestTags.includes(cur)) {
                    return total
                }
                return Math.max(total, tags[cur])
            }, 0)
            console.log("Score:", ratingLevel)
            const allSuggests = getBestSuggestionProbs(data, ratingLevel)
            const noDuplicates = allSuggests.filter(prob => !(prob.slug in existingSlugs))
            const sorted = noDuplicates.slice().sort((a, b) => b.solvedCount - a.solvedCount)
            // allSuggests.forEach(prob => {
            //     if (prob.slug in existingSlugs) {
            //         console.log("EXISTING:", prob.slug)
            //     }
            // })
            setSuggests(sorted)
        }
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
                    {suggests.slice(0,10).map(prob => (
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