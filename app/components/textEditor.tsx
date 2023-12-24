"use client";

import React, { forwardRef, useImperativeHandle, useRef } from "react";

import { Editor } from "@tinymce/tinymce-react";
import { Editor as TinyMCEEditor } from "tinymce";

export type TextEditorHandle = {
  getContent: () => { content: string; shortContent: string };
};

export type Props = { text: string; disabled?: boolean };

export const TextEditor = forwardRef<TextEditorHandle, Props>((props, ref) => {
  const { text, disabled } = props;
  const editorRef = useRef<TinyMCEEditor | null>(null);
  const toolbar = disabled
    ? ""
    : "undo redo | casechange blocks | bold italic backcolor | " +
      "alignleft aligncenter alignright alignjustify | " +
      "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help";

  useImperativeHandle(ref, () => ({
    getContent: () => {
      return getContent();
    },
  }));

  const getContent = () => {
    if (!editorRef.current) {
      return { content: "", shortContent: "" };
    }

    var content = editorRef.current.getContent(); //! contain tag <p>, etc.
    let plainText = editorRef.current.getContent({ format: "text" }); //! contain only text

    return {
      content: content,
      shortContent: plainText.substring(0, 250),
    };
  };

  return (
    <div className="w-full">
      <Editor
        disabled={disabled ?? false}
        apiKey="qquo11hnj7kfwwjjusbrxt69wlxe0l24c3dyehw7a57j0vpm"
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          height: 500,
          menubar: !disabled,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "searchreplace",
            "visualblocks",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "wordcount",
          ],
          editor_encoding: "raw",
          toolbar: toolbar,
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
        initialValue={text}
      />
    </div>
  );
});

TextEditor.displayName = "TextEditor";
