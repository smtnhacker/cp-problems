export type Tag = string

export interface EntryItem {
    id: string,
    authorID: string,
    title: string,
    description: string,
    difficulty: number,
    url: string, 
    tags: Tag[],
    createdAt?: string,
    lastModified?: string,
    slug: string,
    status: "public" | "private" | "draft"
}

export interface EntryHeader {
    authorID: string,
    difficulty: number,
    id: string,
    lastModified?: string,
    createdAt?: string,
    slug: string,
    tags: Tag[],
    title: string,
    tagOnly?: boolean
}

export interface ListState {
    value: EntryHeader[],
    all: EntryHeader[],
    status: 'idle' | 'loading' | 'failed'
}