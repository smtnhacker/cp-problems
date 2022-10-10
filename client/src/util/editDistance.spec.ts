import editDistance from "./editDistance";

describe('editDistance function', () => {
    it('should handle empty strings', () => {
        const a: string = "";
        const b: string = "";
        expect(editDistance(a, b)).toEqual(0)
    });

    it('should handle a single empty string', () => {
        const a: string = "";
        const b: string = "test";
        expect(editDistance(a, b)).toEqual(4);
        expect(editDistance(b, a)).toEqual(4);
    });

    it('should handle equal strings', () => {
        const a: string = "hello there!";
        const b: string = "hello there!";
        expect(editDistance(a, b)).toEqual(0);
    });

    it('should treat uppercase and lowercase to be the same', () => {
        const a: string = "TEST";
        const b: string = "test";
        expect(editDistance(a, b)).toEqual(0);
    });

    it('should trim on checking initial equality', () => {
        const a: string = "   test 123      ";
        const b: string = " test 123 ";
        expect(editDistance(a, b)).toEqual(0);
    });

    it('should handle dashes', () => {
        const a: string = "ad-hoc";
        const b: string = "adhoc";
        expect(editDistance(a, b)).toEqual(1);
    });
})