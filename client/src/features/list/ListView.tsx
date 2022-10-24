import React, { useState } from "react";
import { Link } from "react-router-dom";
import { EntryHeader } from "../types/list";

interface ListViewProps {
  list: EntryHeader[],
  onDelete: Function,
  onClick?: Function,
  genLink: (id: string) => string
}

const MAX_PER_PAGE = 10

const ListView = (props: ListViewProps) => {
  const [page, setPage] = useState(0)
  const [pageSearch, setPageSearch] = useState('1')
  const maxPage = Math.floor(props.list.length / MAX_PER_PAGE)

  const handleSetPage = (pageNumber) => {
    setPage(pageNumber)
    setPageSearch((pageNumber + 1).toString())
  }

  const handlePageEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter') {
      try {
        const newPage = parseInt(pageSearch) - 1
        if (newPage >= 0 && newPage <= maxPage) {
          setPage(newPage)
        } else if (newPage < 0) {
          setPage(0)
          setPageSearch('1')
        } else if (newPage > maxPage) {
          setPage(maxPage)
          setPageSearch(maxPage.toString())
        } else {
          setPageSearch((page + 1).toString())
        }
      } catch (err) {
        console.log(err)
        setPageSearch('')
      }
    }
  }

  return (
    <>
      <nav aria-label="Page navigation">
        <ul className="pagination">
           <li className="page-item">
            <button className="page-link" onClick={() => handleSetPage(0)}>First</button>
          </li>
          <li className="page-item">
            <button className="page-link" onClick={() => handleSetPage(Math.max(0, page-1))}>Previous</button>
          </li>
          <li className="page-item">
            <input 
              type="text" 
              className="page-link" 
              value={pageSearch} 
              onChange={e => setPageSearch(e.target.value)} 
              onKeyDown={handlePageEnter} 
            />
          </li>
          <li className="page-item">
            <button className="page-link" onClick={() => handleSetPage(Math.min(maxPage, page+1))}>Next</button>
          </li>
          <li className="page-item">
            <button className="page-link" onClick={() => handleSetPage(maxPage)}>Last</button>
          </li>
        </ul>
      </nav>
      <ul className="list-group" style={{ margin: "12px" }}>
        {props.list.slice(page * MAX_PER_PAGE, (page + 1) * MAX_PER_PAGE).map((entry: EntryHeader) => (
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
    </>
  );
};

export default ListView;
