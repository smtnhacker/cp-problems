import { EntryItem } from "../types/list";

interface ListViewProps {
  list: EntryItem[];
  onDelete: Function;
}

const ListView = (props: ListViewProps) => {
  return (
    <ul className="list-group" style={{ margin: "12px" }}>
      {props.list.map((entry: EntryItem) => (
        <li key={entry.id} className="list-group-item">
          <div className="row">
            <div className="col-auto">
              <button className="btn-close" onClick={() => props.onDelete(entry.id)}>
              </button>
            </div>
            <div className="col">
              <a className="nav-link" href={entry.url}>
                <span>{entry.title}</span> <span className="text-muted">({entry.difficulty})</span>
              </a>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default ListView;
