import { useState, useMemo, useEffect } from 'react'

import { EntryHeader, EntryItem, Tag } from '../../features/types/list'
import CFModel, { Problem } from '../../model/CFModel'
import getBestSuggestionProbs from '../../util/getBestSuggestionProbs'
import parseTags from '../../util/parseTags'
import { TagScore } from "../../util/tagScoreReducers";
import ProgressBar from './ProgressBar'

interface DashboardProps {
    list: EntryHeader[],
    tagScore: TagScore
}

export const ratingNormalization = (validTags: Tag[], ratings: TagScore): number => {
    return Object.keys(ratings).reduce((total, cur) => {
        if (!validTags.includes(cur)) {
            return total
        }
        return Math.max(total, ratings[cur])
    }, 0)
}

export const getSlugs = async (list: EntryHeader[] | EntryItem[]): Promise<{ [slug: string]: boolean }> => {
    const res: { [slug: string]: boolean } = {}
    Array.from(list).forEach(cur => {
        res[cur.slug] = true
    })
    return Promise.resolve(res)
}

const Dashboard = (props: DashboardProps) => {
    const [suggests, setSuggests] = useState<Problem[]>([])
    const [suggestNotif, setSuggestNotif] = useState("")
    const [existingSlugs, setSlugs] = useState({})

    useEffect(() => {
        console.time("slugs")
        getSlugs(props.list)
            .then(res => {
                setSlugs(res)
                console.timeEnd("slugs")
            })
    }, [props.list])

    const handleTagSubmit = async (e) => {
        e.preventDefault()

        setSuggestNotif("loading...")
        const suggestTags: Tag[] = parseTags(e.target.suggest_tags.value)
        const { error, data } = await CFModel.fetchProblemsByTag(suggestTags)

        if (error) {
            if (typeof error === "string") {
                setSuggestNotif(error)
            } else {
                setSuggestNotif(error.message)
            }
            return console.error(error)
        } 

        const ratingLevel = ratingNormalization(suggestTags, props.tagScore)
        const allSuggests = getBestSuggestionProbs(data, ratingLevel)

        const shownSuggestions = allSuggests
                                    .filter(prob => !(prob.slug in existingSlugs))
                                    .sort((a, b) => b.solvedCount - a.solvedCount)
                                    .slice(0, 10)

        if (shownSuggestions.length) {
            setSuggests(shownSuggestions)
            setSuggestNotif("")
        } else {
            setSuggestNotif("These tags might be too hard (or too easy) for your current level!")
            setSuggests([])
        }
    }

    return (
        <div className='row'>
            <div className="col-7">
                <h2>Skill Set</h2>
                {Object.keys(props.tagScore).length === 0 &&
                <span className="text-muted">Start solving and upload your progress to see your skill set!</span>
                }
                <ul className="list-group">
                    {Object.keys(props.tagScore).sort((a, b) => props.tagScore[b] - props.tagScore[a]).map(tag => (
                        <li key={tag} className="list-group-item">
                            <div className="row">
                                <div className="col-2">{tag}</div>
                                <div className="col-10">
                                    <ProgressBar min={0} max={4000} width={props.tagScore[tag] * 100 / 4000} text={props.tagScore[tag].toFixed()} />
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
                        <div className="form-text">This will be compared to CodeForces standard tags and modified accordingly</div>
                    </div>
                </form>
                <ul className='list-group'>
                    {suggestNotif && 
                    <span className="text-muted">{suggestNotif}</span>
                    }
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