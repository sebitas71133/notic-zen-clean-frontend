import React from "react";
import {
  Remirror,
  ThemeProvider,
  useRemirror,
  EditorComponent,
} from "@remirror/react";
import { MarkdownExtension } from "remirror/extensions";

export const MarkdownEditor = ({ value = "", onChange }) => {
  const markdownExtension = new MarkdownExtension();

  const { manager, state } = useRemirror({
    extensions: () => [markdownExtension],
    content: value || "", // contenido inicial
    stringHandler: markdownExtension.stringHandler, // muy importante
  });

  const handleChange = ({ helpers }) => {
    const markdown = helpers.getMarkdown();
    onChange?.(markdown);
  };

  return (
    <ThemeProvider>
      <Remirror
        manager={manager}
        initialContent={state}
        onChange={handleChange}
      >
        <EditorComponent />
      </Remirror>
    </ThemeProvider>
  );
};
