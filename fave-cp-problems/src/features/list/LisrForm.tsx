import { FormEventHandler } from "react";

interface ListFormProps {
  onSubmit: FormEventHandler;
}

const ListForm = (props: ListFormProps) => {
  const authorID = "1";

  return (
    <div className="container">
      <form onSubmit={props.onSubmit}>
        <input type="text" name="authorID" value={authorID} hidden readOnly />
        <div className="mb-3">
          <label className="form-label" htmlFor="title">
            Title
          </label>
          <input className="form-control" type="text" name="title" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="description">
            Description
          </label>
          <textarea className="form-control" name="description"></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="difficulty">
            Difficulty
          </label>
          <input
            className="form-range"
            type="range"
            name="difficulty"
            min={0}
            max={10}
          />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="url">
            Problem Link
          </label>
          <input className="form-control" type="text" name="url" />
        </div>
        <div className="mb-3">
          <label className="form-label" htmlFor="tags">
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
