import { useState } from "react";
import RichBodyEditor from "../RichBodyEditor/RichBodyEditor";
import { EntryItem } from "../../features/types/list"
import Separator from "../Separator/Separator";

interface ProblemFormProps {
    entry: EntryItem,
    authorID: string,
    onSubmit: React.FormEventHandler<HTMLFormElement>
}

const ProblemForm = (props: ProblemFormProps) => {
    const [dif, setDif] = useState<number>(props.entry.difficulty);
    const [title, setTitle] = useState(props.entry.title)
    const [description, setDescription] = useState(props.entry.description)
    const [url, setUrl] = useState(props.entry.url)
    const [tags, setTags] = useState(props.entry.tags.reduce((total, cur) => total ? total + ", " + cur : cur, ""))

    return (
      <>
        <form onSubmit={props.onSubmit}>
          <input type="text" name="authorID" value={props.authorID} hidden readOnly />
          <div className="mb-3 input-group">
            <label className="input-group-text" htmlFor="title">
              Title
            </label>
            <input className="form-control" type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text" htmlFor="difficulty">
              Difficulty: {dif}
            </label>
            <input
              className="form-range"
              type="range"
              name="difficulty"
              value={dif}
              onChange={(e) => setDif(parseInt(e.target.value))}
              min={0}
              max={3500}
              step={100}
            />
          </div>
          <div className="mb-3 input-group">
            <label className="input-group-text" htmlFor="url">
              Problem Link
            </label>
            <input className="form-control" type="text" name="url" value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <div className="mb-3 input-group">
            <label className="input-group-text" htmlFor="tags">
              Tags
            </label>
            <input className="form-control" type="text" name="tags" value={tags} onChange={e => setTags(e.target.value)} />
          </div>
          <div className="input-group mb-3">
            <label className="input-group-text" hidden htmlFor="description">
              Description
            </label>
            <RichBodyEditor />
          </div>
          <input className="btn btn-primary" type="submit" value="Update" />
        </form>
      </>
    );
}

export default ProblemForm