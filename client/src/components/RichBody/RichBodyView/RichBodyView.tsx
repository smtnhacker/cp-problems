import React, { useCallback, useMemo } from 'react'
import { Editable, withReact, Slate } from 'slate-react'
import {
  createEditor,
} from 'slate'
import { withHistory } from 'slate-history'

import { Element, Leaf } from '../components'

interface RichBodyEditorProps {
  content: any[]
}

const RichBodyView = (props: RichBodyEditorProps) => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <div className="container p-2 " >

      <Slate 
        editor={editor} 
        value={props.content}
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