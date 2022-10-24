export type authFunction = (data: any) => boolean

export function saveToCache(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function retrieveFromCache(key: string, isValid: authFunction) {
    try {
        const cache = localStorage.getItem(key)
        const data = JSON.parse(cache)
        if (isValid(data)) {
            return data
        } else {
            return null
        }
    } catch (err) {
        return null
    }
}