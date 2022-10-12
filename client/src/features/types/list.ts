export type Tag = string

export interface EntryItem {
    id?: string,
    authorID?: string,
    title: string,
    description: string,
    difficulty: number,
    url: string, 
    tags: Tag[],
    createdAt?: string,
    lastModified?: string,
    page?: string
}

export interface ListState {
    value: EntryItem[],
    all: EntryItem[],
    status: 'idle' | 'loading' | 'failed'
}