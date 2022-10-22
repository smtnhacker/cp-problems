import { Tag } from "../features/types/list";
import getBestTag from "./getBestTag";
import removeDuplicates from "./removeDuplicates";

export default function parseTags(tagString: string): Tag[] {
    return removeDuplicates(
        tagString.split(",")
            .map((tag: string) => tag.trim())
            .map((tag: string) => getBestTag(tag))
            .filter((tag: string) => tag.length > 0)
    )
}