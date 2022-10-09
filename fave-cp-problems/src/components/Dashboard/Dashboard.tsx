import { useEffect, useState } from 'react'
import { EntryItem } from '../../features/types/list'
import ProgressBar from './ProgressBar'

interface DashboardProps {
    list: EntryItem[]
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

    useEffect(() => {
        setLoading(true);
        console.log(props.list)
        const tagDiffList: TagDifficulty[] = props.list.reduce((total: TagDifficulty[], cur: EntryItem) => {
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

    return (
        <div>
            <h2>Skill Set</h2>
            <ul className="list-group">
                {loading ? 
                <p>Loading...</p>
                :
                Object.keys(tags).map(tag => (
                    <li key={tag} className="list-group-item">
                        <div className="row">
                            <div className="col-1">{tag}</div>
                            <div className="col-11">
                                <ProgressBar min={0} max={4000} width={tags[tag] * 100 / 4000} text={tags[tag].toFixed()} />
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Dashboard