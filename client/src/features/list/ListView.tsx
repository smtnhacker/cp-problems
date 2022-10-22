import { Link } from "react-router-dom";
import { EntryHeader } from "../types/list";

interface ListViewProps {
  list: EntryHeader[],
  onDelete: Function,
  onClick?: Function,
  genLink: (id: string) => string
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
                <Link className="nav-link" to={props.genLink(entry.id)} onClick={(e) => props.onClick(entry)}>
                  <span><strong>{entry.slug}</strong> {entry.title}</span> <span className="text-muted">({entry.difficulty})</span>
                </Link>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ListView;
