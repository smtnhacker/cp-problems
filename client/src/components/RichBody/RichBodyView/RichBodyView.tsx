import React, { useCallback, useEffect, useMemo } from 'react'
import { Editable, withReact, Slate } from 'slate-react'
import {
  createEditor,
} from 'slate'
import { withHistory } from 'slate-history'

import { Element, Leaf } from '../components'
import { EntryItem } from '../../../features/types/list'

interface RichBodyEditorProps {
  entry: EntryItem
}

const RichBodyView = (props: RichBodyEditorProps) => {  
  const renderElement = useCallback(props => <Element {...props} viewOnly />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} viewOnly />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const getDescription = (raw: string) => {
    try {
      const content = JSON.parse(raw)
      console.dir(content)
      return content
    } catch (err) {
      return [
        {
          type: "paragraph",
          children: [{ text: "How was the problem?" }],
        }
      ]
    }
  }

  const content = getDescription(props.entry.description)

  return (
    <div className="container p-2 " >
      <Slate 
        key={props.entry.description}
        editor={editor} 
        value={content}
      >
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          readOnly
        />
      </Slate>
    </div>
  )
}

export default RichBodyView 