const db = {
    "page_detail": {
        count: 0,
        curPage: 1
    },
    "pages": {
        "1": {

        }
    },
    "posts": {

    },
    "user": {
        "Sample": {
            "posts": {

            },
            "userDetail": {
                "cf": "tourist",
                "displayName": "tourist"
            }
        }
    }
}

export const smokeTest = jest.fn(() => "Running...")

export const cleanModule = jest.fn((values) => {
    for(const key in db) {
        delete db[key]
    }
    Object.keys(values).forEach(key => db[key] = JSON.parse(JSON.stringify(values[key])))
})

export const getDB = () => db

export const set = jest.fn((ref, value) => {
    const keys = ref.split('/')
    let curLoc = db
    let parent = null
    let lastKey = null
    for(const key of keys) {
        parent = curLoc
        if (!(key in curLoc)) {
            curLoc[key] = {}
        }
        curLoc = curLoc[key]
        lastKey = key
    }
    if (parent === null) {
        throw Error("tried to override db!")
    }
    parent[lastKey] = value
    // console.log(db)
})

export const child = jest.fn((root, path) => {
    if (path.length && root.length) {
        return root + "/" + path
    } else if (path.length) {
        return path
    } else {
        return root
    }
})

export const ref = jest.fn((db, path = "") => {
    return path
})

export const get = jest.fn((path) => {
    const keys = path.split('/')
    let curLoc = db
    try {
        for(const key of keys) {
            curLoc = curLoc[key]
        }
        if (!curLoc) {
            return undefined
        }
        return {
            val: () => curLoc
        }
        
    } catch (err) {
        return undefined
    }
})

export const remove = jest.fn((path) => {
    try {
        const keys = path.split('/')
        let curLoc = db
        let parent = null
        let lastKey = null
        for(const key of keys) {
            parent = curLoc
            curLoc = curLoc[key]
            lastKey = key
        }
        if (parent === null) {
            throw Error("tried to override db!")
        }
        delete parent[lastKey]
    } catch (err) {

    }
})