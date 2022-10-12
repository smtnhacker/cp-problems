import getBestTag from "./getBestTag";

describe('getBestTag function', () => {
    it('should not crash', () => {
        expect(() => getBestTag('sample')).not.toThrow();
    });

    it('should treat lowercasea and uppercase as the same', () => {
        const lower = getBestTag("TEST");
        const upper = getBestTag("TEST");
        expect(lower).toMatch(upper);
    });

    it('should handle common dp aliases', () => {
        expect(getBestTag('dp')).toMatch('DP');
        expect(getBestTag('dynamic programming')).toMatch('DP');
    });

    it('should handle common ad-hoc aliases', () => {
        expect(getBestTag('adhoc')).toMatch('Ad-hoc');
        expect(getBestTag('other')).toMatch('Ad-hoc');
        expect(getBestTag('others')).toMatch('Ad-hoc');
    });

    it('should handle lowercase with no type', () => {
        expect(getBestTag('dp')).toMatch('DP');
        expect(getBestTag('dFs')).toMatch('DFS');
        expect(getBestTag('TREES')).toMatch('Trees');
    });

    it('should let an empty string remain empty', () => {
        expect(getBestTag("")).toMatch("");
    })
})