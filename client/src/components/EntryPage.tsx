import { IoPencilSharp } from "react-icons/io5";
import { useAppSelector } from "../app/hooks";
import { selectAuth } from "../features/auth/authSlice";
import { EntryItem } from "../features/types/list";
import RichBodyView from "./RichBody/RichBodyView/RichBodyView";

interface EntryPageProps {
    onChangeView?: React.MouseEventHandler,
    entry: EntryItem
}

const EntryPage = (props: EntryPageProps) => {
    const currentEntry = props.entry
    const auth = useAppSelector(selectAuth)
    const authorID = auth.id
    
    return (
      <>
        <div className="row text-center">
          <h2>
            {currentEntry.title}
            {
                (authorID === currentEntry.authorID) &&
                <button className="btn" onClick={props.onChangeView}>
                    <IoPencilSharp />
                </button>
            }
          </h2>
          <div className="row">
            <small className="text-muted">
              <a
                href={currentEntry.url}
                target="_blank"
                rel="noreferrer"
                className="nav-link"
              >
                {currentEntry.url}
              </a>
            </small>
          </div>
          <div className="row">
            <small className="text-muted">
              Rating: {currentEntry.difficulty}
            </small>
          </div>
        </div>
        <div className="row p-3">
          <RichBodyView entry={currentEntry} />
        </div>
        <div className="row">
          <div className="col-auto">Tags</div>
          <div className="col">
            {currentEntry.tags.map((tag) => {
              return (
                <div key={tag} className="badge rounded-pill text-bg-light m-1">
                  {tag}
                </div>
              );
            })}
          </div>
        </div>
      </>
    );
}

export default EntryPage