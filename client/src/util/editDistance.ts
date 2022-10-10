export default function editDistance(a: string, b: string): number {

    if (a.trim().toLocaleLowerCase() === b.trim().toLocaleLowerCase()) return 0;

    const memo: { [key: string]: number } = {}

    const editDistanceRecursive = (idxA: number, idxB: number, a: string, b: string): number => {
    
        if (`${idxA}-${idxB}` in memo) {
            return memo[`${idxA}-${idxB}`];
        }

        let res: number = 0;
        
        if (idxA === -1) res = idxB + 1;
        else if (idxB === -1) res = idxA + 1;
        else if (a[idxA].toLocaleLowerCase() === b[idxB].toLocaleLowerCase()) 
            res = editDistanceRecursive(idxA-1, idxB-1, a, b);
        else res = 1 + Math.min(
            editDistanceRecursive(idxA-1, idxB, a, b),
            editDistanceRecursive(idxA, idxB-1, a, b),
            editDistanceRecursive(idxA-1, idxB-1, a, b)
        )

        memo[`${idxA}-${idxB}`] = res;
        return res;
}

    return editDistanceRecursive(a.length-1, b.length-1, a, b);
}