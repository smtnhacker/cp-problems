export type Tag = string

export interface EntryItem {
    id?: string,
    authorID?: string,
    title: string,
    description: string,
    difficulty: number,
    url: string, 
    tags: Tag[]
}

export interface ListState {
    value: EntryItem[],
    status: 'idle' | 'loading' | 'failed'
}