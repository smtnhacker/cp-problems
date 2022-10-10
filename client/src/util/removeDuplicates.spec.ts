import removeDuplicates from "./removeDuplicates";

describe('removeDuplicates function', () => {
    it('should not crash', () => {
        expect(() => removeDuplicates([])).not.toThrow()
    });

    it('should remove duplicates', () => {
        const processed = removeDuplicates(['a', 'a', 'a', 'a']);
        expect(processed.length).toBe(1);
        expect(processed).toContain('a');
    });

    it('should not change the individual contens', () => {
        const processed = removeDuplicates(['a', 'a', 'A', 'A', 'aA', 'aA']);
        expect(processed).toContain('a');
        expect(processed).toContain('A');
        expect(processed).toContain('aA');
        expect(processed.length).toBe(3);
    });
})