import React, { Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { BlockMath, InlineMath } from 'react-katex'
import 'katex/dist/katex.min.css'


interface BaseProps {
    className?: string,
    [key: string]: unknown
}

export const Element = ({ attributes, children, element, viewOnly }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'math-block':
      return (
        <>
          <span hidden={viewOnly}>
            $$
            {children}
            $$
          </span>
          <BlockMath>{element.children[0].text}</BlockMath>
        </>
      )
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

export const Leaf = ({ attributes, children, leaf, viewOnly }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

export const Button = (props: PropsWithChildren<{ active: boolean, reversed?: boolean } & BaseProps>) => {
    return (
        <span {...props} className={props.className} style={{
            cursor: "pointer",
            color: props.active ? 'black' : '#ccc'
        }} />
    )
}

export const Icon = (props: PropsWithChildren<BaseProps>) => {
    return (
        <span {...props} className={props.className} style={{
            fontSize: "18px",
            verticalAlign: "text-bottom"
        }} />
    )
}

const Wrapper = styled.div`
    & > * {
        display: inline-block
    }
    & > * + * {
        margin-left: 15px;
    }
`

export const Menu = (props: PropsWithChildren<BaseProps>) => {
    return (
        <Wrapper {...props} className={props.className}  />
    )
}

export const Toolbar = (props: PropsWithChildren<BaseProps>) => {
    return (
        <Menu {...props} className={props.className} style={{
            position: "relative",
            padding: "1px 18px 17px",
            margin: "0 -20px",
            borderBottom: "2px solid #eee",
            marginBottom: "20px"
        }} />
    )
}