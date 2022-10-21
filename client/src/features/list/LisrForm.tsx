import { FormEventHandler, useState } from "react";
import { EntryHeader } from "../types/list";

interface ListFormProps {
  onSubmit: FormEventHandler,
  initialValues?: EntryHeader
}

const ListForm = (props: ListFormProps) => {
  const [dif, setDif] = useState<number>(800);
  const defaults = props.initialValues ? props.initialValues : {
    slug: "",
    title: "",
    difficulty: 800,
    tags: []
  }

  return (
    <div className="container">
      <form onSubmit={props.onSubmit}>
        <div className="mb-3 input-group">
          <label className="input-group-text" htmlFor="slug">
            Slug
          </label>
          <input className="form-control" type="text" name="slug" defaultValue={defaults.slug} />
          <label className="input-group-text" htmlFor="title">
            Title
          </label>
          <input className="form-control" type="text" name="title" defaultValue={defaults.title} />
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
            defaultValue={defaults.difficulty}
            onChange={e => setDif(parseInt(e.target.value))}
            min={0}
            max={3500}
            step={100}
          />
        </div>
        <div className="mb-3 input-group">
          <label className="input-group-text" htmlFor="url">
            Problem Link
          </label>
          <input className="form-control" type="text" name="url" />
        </div>
        <div className="mb-3 input-group">
          <label className="input-group-text" htmlFor="tags">
            Tags
          </label>
          <input 
            className="form-control" 
            type="text" 
            name="tags" 
            defaultValue={defaults.tags.reduce((total, cur) => {
              return total + ", " + cur
            }, "")} 
          />
        </div>
        <input className="btn btn-primary" type="submit" value="submit" />
      </form>
    </div>
  );
};

export default ListForm;
