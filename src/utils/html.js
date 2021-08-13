import React from "react";
import DOMPurify from "dompurify";

export const HTMLText = (props) => {
  let { componentTag, safe, className, text, style } = props;

  let cleanText = "";
  if (safe) {
    cleanText = text;
  } else {
    cleanText = DOMPurify.sanitize(text);
  }

  let Tag = componentTag || "div";
  let _style = style || { whiteSpace: "pre-wrap" };
  return <Tag className={className} style={_style} dangerouslySetInnerHTML={{ __html: cleanText }} />;
};
