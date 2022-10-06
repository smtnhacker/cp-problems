import { EntryItem } from "../types/list";

interface ListViewProps {
  list: EntryItem[];
  onDelete: Function;
}

const ListView = (props: ListViewProps) => {
  return (
    <ul className="list-group">
      {props.list.map((entry: EntryItem) => (
        <li key={entry.id} className="list-group-item">
          <button className="btn" onClick={() => props.onDelete(entry.id)}>
            X
          </button>
          {entry.title}
        </li>
      ))}
    </ul>
  );
};

export default ListView;
