import React from "react";
import DOMPurify from "dompurify";

export const HTMLText = props => {
  const cleanText = DOMPurify.sanitize(props.text);
  let Tag = props.ComponentTag || "div";
  return (
    <Tag
      className={props.extraClassName}
      style={{ whiteSpace: "pre-wrap" }}
      dangerouslySetInnerHTML={{ __html: cleanText }}
    />
  );
};
