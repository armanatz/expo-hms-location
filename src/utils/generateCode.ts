/**
 * Forked from @expo/config-plugins, because its not exposed as public API or through a correct dependency chain
 *
 * Sourcecode: https://github.com/expo/expo/blob/59ece3cb1d5a7aaea42f4c7fe9d1f4f825b338f8/packages/@expo/config-plugins/src/utils/generateCode.ts
 * LICENSE: https://github.com/expo/expo/blob/082815dcf3e2de29c76f7628844ae50a987263a6/packages/%40expo/config-plugins/LICENSE
 */

/**
 * Get line indexes for the generated section of a file.
 *
 * @param src
 */
import crypto from 'crypto';

type CodeCommentLocation = {
  /** All lines of code of the (generated) comment */
  contents: string[];
  /** The line number where the (generated) comment starts */
  start: number;
  /** The line number where the (generated) comment ends */
  end: number;
};

function getGeneratedSectionIndexes(
  src: string,
  tag: string,
): CodeCommentLocation {
  const contents = src.split('\n');
  const start = contents.findIndex(line =>
    new RegExp(`@generated begin ${tag} -`).test(line),
  );
  const end = contents.findIndex(line =>
    new RegExp(`@generated end ${tag}$`).test(line),
  );

  return { contents, start, end };
}

export type MergeResults = {
  contents: string;
  didClear: boolean;
  didMerge: boolean;
};

/**
 * Merge the contents of two files together and add a generated header.
 *
 * @param src contents of the original file
 * @param newSrc new contents to merge into the original file
 * @param identifier used to update and remove merges
 * @param anchor regex to where the merge should begin
 * @param offset line offset to start merging at (<1 for behind the anchor)
 * @param comment comment style `//` or `#`
 */
export function mergeContents({
  src,
  newSrc,
  tag,
  anchor,
  offset,
  comment,
}: {
  src: string;
  newSrc: string;
  tag: string;
  anchor: string | RegExp;
  offset: number;
  comment: string;
}): MergeResults {
  const generatedComment = createGeneratedComment(newSrc, tag, comment);
  if (!src.includes(generatedComment.start)) {
    // Ensure the old generated contents are removed.
    const sanitizedTarget = removeGeneratedContents(src, tag);
    return {
      contents: addLines(sanitizedTarget ?? src, anchor, offset, [
        generatedComment.start,
        ...newSrc.split('\n'),
        generatedComment.end,
      ]),
      didMerge: true,
      didClear: !!sanitizedTarget,
    };
  }
  return { contents: src, didClear: false, didMerge: false };
}

export function removeContents({
  src,
  tag,
}: {
  src: string;
  tag: string;
}): MergeResults {
  // Ensure the old generated contents are removed.
  const sanitizedTarget = removeGeneratedContents(src, tag);
  return {
    contents: sanitizedTarget ?? src,
    didMerge: false,
    didClear: !!sanitizedTarget,
  };
}

function addLines(
  content: string,
  find: string | RegExp,
  offset: number,
  toAdd: string[],
) {
  const lines = content.split('\n');

  let lineIndex = lines.findIndex(line => line.match(find));
  if (lineIndex < 0) {
    const error = new Error(
      `Failed to match "${find}" in contents:\n${content}`,
    );
    // @ts-ignore
    error.code = 'ERR_NO_MATCH';
    throw error;
  }
  for (const newLine of toAdd) {
    lines.splice(lineIndex + offset, 0, newLine);
    lineIndex++;
  }

  return lines.join('\n');
}

/**
 * Removes the generated section from a file, returns null when nothing can be removed.
 * This sways heavily towards not removing lines unless it's certain that modifications were not made manually.
 *
 * @param src
 */
export function removeGeneratedContents(
  src: string,
  tag: string,
): string | null {
  const { contents, start, end } = getGeneratedSectionIndexes(src, tag);
  if (start > -1 && end > -1 && start < end) {
    contents.splice(start, end - start + 1);
    // TODO: We could in theory check that the contents we're removing match the hash used in the header,
    // this would ensure that we don't accidentally remove lines that someone added or removed from the generated section.
    return contents.join('\n');
  }
  return null;
}

export function createGeneratedComment(
  contents: string,
  tag: string,
  comment: string,
) {
  const hashKey = createHash(contents);

  return {
    // Everything after the `${tag} ` is unversioned and can be freely modified without breaking changes.
    start: `${comment} @generated begin ${tag} - expo prebuild (DO NOT MODIFY) ${hashKey}`,
    // Nothing after the `${tag}` is allowed to be modified.
    end: `${comment} @generated end ${tag}`,
  };
}

export function createHash(src: string): string {
  // this doesn't need to be secure, the shorter the better.
  const hash = crypto.createHash('sha1').update(src).digest('hex');
  return `sync-${hash}`;
}
