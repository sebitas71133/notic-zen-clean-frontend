import { useCallback, useState } from "react";
import { useRemirror, OnChangeHTML, ReactExtensions } from "@remirror/react";
import {
  BoldExtension,
  ItalicExtension,
  HeadingExtension,
  CodeExtension,
  BlockquoteExtension,
  BulletListExtension,
  OrderedListExtension,
  ListItemExtension,
  CodeBlockExtension,
  HardBreakExtension,
  MarkdownExtension,
  TrailingNodeExtension,
} from "remirror/extensions";

export function useMarkdownEditor(initial) {
  const [content, setContent] = useState(initial);

  const extensions = React.useCallback(
    () => [
      new BoldExtension(),
      new ItalicExtension(),
      new HeadingExtension(),
      new CodeExtension(),
      new BlockquoteExtension(),
      new BulletListExtension({ enableSpine: true }),
      new OrderedListExtension(),
      new ListItemExtension(),
      new CodeBlockExtension(),
      new HardBreakExtension(),
      new TrailingNodeExtension(),
      new MarkdownExtension({ copyAsMarkdown: false }),
    ],
    []
  );

  const { manager, state, onChange } = useRemirror({
    extensions,
    content: initial,
    stringHandler: "markdown",
    selection: "end",
  });

  const handleChange = useCallback(
    (params) => {
      setContent(params.helpers.getMarkdown(params.state));
      onChange(params);
    },
    [onChange]
  );

  return { manager, state, onChange: handleChange, content, setContent };
}
