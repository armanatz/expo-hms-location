import {
  createGeneratedComment,
  removeGeneratedContents,
} from './generateCode';

export type InsertOrReplaceResults = {
  contents: string;
  didClear: boolean;
  didInsertOrReplace: boolean;
};

/**
 * Insert or replace content inside of a code block located in a file and add a generated header.
 *
 * @param mode Choose between `insert` or `replace`
 * @param src Contents of the original file
 * @param newSrc New content to insert or replace
 * @param anchor If `mode` is `insert`, the line to insert the new content after.
 *  If `mode` is `replace`, the line to replace the content with.
 * @param tag Used to update and remove merges
 * @param comment Comment style `//` or `#`
 */
export function insertOrReplaceContentInBlock(params: {
  mode: 'replace' | 'insert';
  src: string;
  blockName: string;
  newSrc: string;
  anchor: string;
  tag: string;
  comment: string;
}): InsertOrReplaceResults {
  const { src, newSrc, anchor, tag, comment, blockName, mode } = params;
  const generatedComment = createGeneratedComment(newSrc, tag, comment);

  if (!src.includes(generatedComment.start)) {
    // Ensure the old generated contents are removed.
    const sanitizedTarget = removeGeneratedContents(src, tag);

    const lines = src.split('\n');
    const blockStart = lines.indexOf(`${blockName} {`);
    const blockEnd = lines.indexOf('}', blockStart) + 1;
    const linesWithoutBlock = lines.slice(blockEnd);
    let blockArr = lines.slice(blockStart, blockEnd);

    const blockTrimmed = lines
      .slice(blockStart, blockEnd)
      .map(line => line.trim());

    const anchorPos = blockTrimmed.indexOf(anchor);

    const firstHalfOfBlock = blockArr.slice(
      0,
      mode === 'insert' ? anchorPos + 1 : anchorPos,
    );

    const secondHalfOfBlock = blockArr.slice(anchorPos + 1);
    firstHalfOfBlock.push(generatedComment.start, newSrc, generatedComment.end);
    blockArr = firstHalfOfBlock.concat(secondHalfOfBlock);
    const block = blockArr.concat(linesWithoutBlock).join('\n');

    return {
      contents: sanitizedTarget ?? block,
      didInsertOrReplace: true,
      didClear: !!sanitizedTarget,
    };
  }

  return { contents: src, didClear: false, didInsertOrReplace: false };
}
