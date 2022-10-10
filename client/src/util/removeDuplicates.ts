export default function removeDuplicates(list: any[]): any[] {
    const sorted = list.sort()
    const res: any[] = [];

    sorted.forEach(item => {
        if (res.length === 0 || res[res.length-1] !== item) {
            res.push(item)
        }
    })

    return res;
}