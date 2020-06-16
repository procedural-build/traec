import React from "react";
import DOMPurify from "dompurify";

export const HTMLText = props => {
  const cleanText = DOMPurify.sanitize(props.text);
  return <div style={{ whiteSpace: "pre-wrap" }} dangerouslySetInnerHTML={{ __html: cleanText }} />;
};
