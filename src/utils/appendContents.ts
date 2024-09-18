/**
 * Forked from expo-camera
 *
 * Sourcecode: https://github.com/expo/expo/blob/253619d08eff5a8674405fe6608ead2ab086f3d5/packages/expo-camera/plugin/src/appendCode.ts
 * LICENSE: https://github.com/expo/expo/blob/253619d08eff5a8674405fe6608ead2ab086f3d5/LICENSE
 */
import {
  createGeneratedComment,
  removeGeneratedContents,
} from './generateCode';

type AppendResults = {
  contents: string;
  didClear: boolean;
  didAppend: boolean;
};

/**
 * Append a new item to the bottom of the original file and add a generated header.
 *
 * @param src contents of the original file
 * @param newSrc new content to append into the original file
 * @param tag used to update and remove merges
 * @param comment comment style `//` or `#`
 */
export function appendContents({
  src,
  tag,
  comment,
  newSrc,
}: {
  src: string;
  tag: string;
  comment: string;
  newSrc: string;
}): AppendResults {
  const generatedComment = createGeneratedComment(newSrc, tag, comment);
  if (!src.includes(generatedComment.start)) {
    // Ensure the old generated contents are removed.
    const sanitizedTarget = removeGeneratedContents(src, tag);
    const contentsToAdd = [
      generatedComment.start, // @begin
      newSrc, // contents
      generatedComment.end, // @end
    ].join('\n');

    return {
      contents: sanitizedTarget ?? src + contentsToAdd,
      didAppend: true,
      didClear: !!sanitizedTarget,
    };
  }
  return { contents: src, didClear: false, didAppend: false };
}
