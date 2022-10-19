import { Link } from "react-router-dom";
import { EntryHeader } from "../types/list";

interface ListViewProps {
  list: EntryHeader[];
  onDelete: Function;
}

const ListView = (props: ListViewProps) => {
  return (
    <ul className="list-group" style={{ margin: "12px" }}>
      {props.list.map((entry: EntryHeader) => (
        <li key={entry.id} className="list-group-item">
          <div className="row">
            <div className="col-auto">
              <button className="btn-close" onClick={() => props.onDelete(entry)}>
              </button>
            </div>
            <div className="col">
              <Link className="nav-link" to={`/problems/${entry.id || "404"}`}>
                <span>{entry.title}</span> <span className="text-muted">({entry.difficulty})</span>
              </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ListView;
