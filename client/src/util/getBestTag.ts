import { CF } from '../config';
import editDistance from "./editDistance";

export default function getBestTag(tag: string): string {

    // Don't try to change nothing
    if (tag.length === 0) {
        return tag
    }

    const lowerTag = tag.toLocaleLowerCase();

    // For special cases
    if (lowerTag.includes("dynamic programming")) {
        return "DP";
    } else if (lowerTag.includes("mathematics")) {
        return "Math"
    } else if (["other", "others", "misc", "special"].includes(lowerTag)) {
        return "Ad-hoc"
    }

    // For general cases, just find the tag with smallest edit distance
    const vtags = CF.VALID_TAGS.sort((a, b) => {
        return editDistance(tag, a) - editDistance(tag, b);
    });
    return vtags[0];
}