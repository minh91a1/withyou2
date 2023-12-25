"use client";

import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";

export type ContentEditableHandle = {
  getContent: () => string;
};

interface Props {
  disabled: boolean;
  value: string;
  className: string;
}

export const ContentEditable = forwardRef<ContentEditableHandle, Props>(
  ({ disabled, value, className }: Props, ref) => {
    const textareaEl = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      getContent: () => {
        return textareaEl.current?.textContent ?? "";
      },
    }));

    useEffect(() => {
      if (textareaEl.current) {
        textareaEl.current.textContent = value;
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div
        spellCheck={false}
        data-placeholder="Title..."
        ref={textareaEl}
        style={{ minWidth: 60, paddingRight: 10 }}
        contentEditable={!disabled}
        suppressContentEditableWarning={true}
        className={className}
      />
    );
  }
);

ContentEditable.displayName = "ContentEditable";
