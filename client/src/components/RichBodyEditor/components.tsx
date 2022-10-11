import React, { Ref, PropsWithChildren } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

interface BaseProps {
    className?: string,
    [key: string]: unknown
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