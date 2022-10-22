import { useEffect, useState, useMemo } from "react";
import RichBodyEditor from "../RichBody/RichBodyEditor/RichBodyEditor";
import { EntryItem } from "../../features/types/list"
import removeDuplicates from "../../util/removeDuplicates";
import getBestTag from "../../util/getBestTag";

interface ProblemFormProps {
    entry: EntryItem,
    authorID: string,
    onSubmit: Function
}

const ProblemForm = (props: ProblemFormProps) => {
    const [dif, setDif] = useState<number>(props.entry.difficulty);
    const [title, setTitle] = useState(props.entry.title)
    const [description, setDescription] = useState("")
    const [url, setUrl] = useState(props.entry.url)
    const [slug, setSlug] = useState(props.entry.slug)
    const [tags, setTags] = useState(props.entry.tags.reduce((total, cur) => total ? total + ", " + cur : cur, ""))

    const initialDescription: any[] | null = useMemo(() => {
      try {
        const descCache = JSON.parse(localStorage.getItem('problem-cache-content'))
        if (descCache.id === props.entry.id) {
          console.log("Found cache", descCache.content)
          setDescription(descCache.content)
          return JSON.parse(descCache.content)
        } else {
          setDescription(props.entry.description)
          return props.entry.description
        }
      } catch (err) {
        setDescription(props.entry.description)
        return props.entry.description
      }
    }, [])

    const handleDescriptionChange = (newContent: string) => {
      const descCache = JSON.stringify({ id: props.entry.id, content: newContent });
      setDescription(newContent)
      localStorage.setItem('problem-cache-content', descCache)
    }

    const handleSubmit = (e) => {
      e.preventDefault()

      const newTags = removeDuplicates (
        tags.split(",")
        .map((tag: string) => tag.trim())
        .map((tag: string) => getBestTag(tag))
      )

      const newEntry: EntryItem = {
        id: props.entry.id,
        authorID: props.authorID,
        title: title,
        description: description,
        difficulty: dif,
        url: url,
        tags: newTags,
        slug: slug,
        status: "public"
      };

      console.log(newEntry)

      props.onSubmit(newEntry)
    }

    return (
      <>
        <form onSubmit={handleSubmit}>
          <input type="text" name="authorID" value={props.authorID} hidden readOnly />
          <div className="mb-3 row g-1">
            <div className="col-2">
              <div className="input-group">
                <label className="input-group-text" htmlFor="slug">
                  Slug
                </label>
                <input 
                  className="form-control" 
                  type="text" 
                  name="slug" value={slug} 
                  maxLength={14}
                  onChange={e => setSlug(e.target.value)} 
                />
              </div>
            </div>
            <div className="col">
              <div className="input-group">
                <label className="input-group-text" htmlFor="title">
                  Title
                </label>
                <input 
                  className="form-control" 
                  type="text" 
                  name="title" value={title} 
                  onChange={e => setTitle(e.target.value)} 
                />
              </div>
            </div>
            <div className="form-text">For example: CF104A</div>
          </div>
          <div className="input-group mb-3">
            <label className="form-group" htmlFor="difficulty">
              Difficulty: {dif}
            </label>
            <input
              className="form-range"
              type="range"
              name="difficulty"
              value={dif}
              onChange={e => setDif(parseInt(e.target.value))}
              min={0}
              max={3500}
              step={100}
            />
            <div className="form-text">Use CodeForces standards</div>
          </div>
          <div className="mb-3 input-group">
            <label className="input-group-text" htmlFor="url">
              Problem Link
            </label>
            <input className="form-control" type="text" name="url" value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <div className="mb-3">
            <div className="input-group">
              <label className="input-group-text" htmlFor="tags">
                Tags
              </label>
              <input 
                className="form-control" 
                type="text" 
                name="tags" value={tags}
                onChange={e => setTags(e.target.value)} 
              />
            </div>
            <div className="form-text">This will be compared to CodeForces standard tags and modified accordingly</div>
          </div> 
          <div className="input-group mb-3">
            <label className="input-group-text" hidden htmlFor="description">
              Description
            </label>
            <RichBodyEditor initialValue={initialDescription} onChange={handleDescriptionChange} />
          </div>
          <input className="btn btn-primary" type="submit" value="Update" />
        </form>
      </>
    );
}

export default ProblemForm