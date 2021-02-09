import React from "react";
import DOMPurify from "dompurify";

export const HTMLText = props => {
  let { componentTag, safe, className, text } = props;

  let cleanText = "";
  if (safe) {
    cleanText = text;
  } else {
    cleanText = DOMPurify.sanitize(text);
  }

  let Tag = componentTag || "div";
  return (
    <Tag className={className} style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: cleanText }} />
  );
};
