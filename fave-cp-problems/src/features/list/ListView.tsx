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
          <button className="btn-close" onClick={() => props.onDelete(entry.id)}>
          </button>
          <span>{entry.title}</span>
        </li>
      ))}
    </ul>
  );
};

export default ListView;
