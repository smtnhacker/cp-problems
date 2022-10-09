import { FormEventHandler, useState } from "react";

interface ListFormProps {
  onSubmit: FormEventHandler;
}

const ListForm = (props: ListFormProps) => {
  const [dif, setDif] = useState<number>(800);

  const authorID = "1";

  return (
    <div className="container">
      <form onSubmit={props.onSubmit}>
        <input type="text" name="authorID" value={authorID} hidden readOnly />
        <div className="mb-3 input-group">
          <label className="input-group-text" htmlFor="title">
            Title
          </label>
          <input className="form-control" type="text" name="title" />
        </div>
        <div className="input-group mb-3">
          <label className="input-group-text" htmlFor="description">
            Description
          </label>
          <textarea className="form-control" name="description"></textarea>
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
          <input className="form-control" type="text" name="tags" />
        </div>
        <input className="btn btn-primary" type="submit" value="submit" />
      </form>
    </div>
  );
};

export default ListForm;
