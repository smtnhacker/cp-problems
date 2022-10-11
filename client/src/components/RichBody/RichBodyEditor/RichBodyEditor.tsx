import React, { useCallback, useEffect, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Descendant,
  Element as SlateElement,
} from 'slate'
import { withHistory } from 'slate-history'
import {
  MdFormatBold,
  MdFormatItalic,
  MdFormatUnderlined,
  MdCode,
  MdLooksOne,
  MdLooksTwo,
  MdFormatQuote,
  MdFormatListNumbered,
  MdFormatListBulleted,
  MdFormatAlignLeft,
  MdFormatAlignCenter,
  MdFormatAlignRight,
  MdFormatAlignJustify
} from 'react-icons/md'

import { Button, Icon, Toolbar, Leaf, Element } from '../components'

interface RichBodyEditorProps {
  initialValue: any[],
  onChange: Function
}

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const RichBodyEditor = (props: RichBodyEditorProps) => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const defaultValue = [
    {
      type: "paragraph",
      children: [{ text: "How was the problem?" }],
    },
  ];
  
  const initialValue = useMemo(() => {
    if (!Array.isArray(props.initialValue)) {
      return defaultValue;
    }
    return props.initialValue;
  }, [])

  return (
    <div className="container p-2 bg-light border" style={{ minHeight: "300px" }}>

      <Slate 
        editor={editor} 
        value={initialValue}
        onChange={value => {
          const isAstChange = editor.operations.some(
            op => 'set_selection' !== op.type
          )
          if (isAstChange) {
            props.onChange(JSON.stringify(value))
          }
        }}
      >
        <Toolbar>
          <MarkButton format="bold" icon={<MdFormatBold />} />
          <MarkButton format="italic" icon={<MdFormatItalic />} />
          <MarkButton format="underline" icon={<MdFormatUnderlined />} />
          <MarkButton format="code" icon={<MdCode />} />
          <BlockButton format="heading-one" icon={<MdLooksOne />} />
          <BlockButton format="heading-two" icon={<MdLooksTwo />} />
          <BlockButton format="block-quote" icon={<MdFormatQuote />} />
          <BlockButton format="numbered-list" icon={<MdFormatListNumbered />} />
          <BlockButton format="bulleted-list" icon={<MdFormatListBulleted />} />
          <BlockButton format="left" icon={<MdFormatAlignLeft />} />
          <BlockButton format="center" icon={<MdFormatAlignCenter />} />
          <BlockButton format="right" icon={<MdFormatAlignRight />} />
          <BlockButton format="justify" icon={<MdFormatAlignJustify />} />
        </Toolbar>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck={false}
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault()
                const mark = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
            if (event.key === "Tab") {
              event.preventDefault()
              editor.insertText('\t')
            }
          }}
        />
      </Slate>
    </div>
  )
}

const toggleBlock = (editor, format) => {
  const isActive = isBlockActive(
    editor,
    format,
    TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
  )
  const isList = LIST_TYPES.includes(format)

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      LIST_TYPES.includes((n as any).type) &&
      !TEXT_ALIGN_TYPES.includes(format),
    split: true,
  })
  let newProperties: Partial<SlateElement> & { align? : string | undefined, type? : string }
  if (TEXT_ALIGN_TYPES.includes(format)) {
    newProperties = {
      align: isActive ? undefined : format,
    }
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    }
  }
  Transforms.setNodes<SlateElement>(editor, newProperties)

  if (!isActive && isList) {
    const block = { type: format, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor, format) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (editor, format, blockType = 'type') => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: n =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor, format) => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const BlockButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const MarkButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}


export default RichBodyEditor