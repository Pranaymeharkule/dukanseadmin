import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./CustomQuillEditor.css"; // custom styles

const CustomQuillEditor = ({ value, onChange, className = " " }) => {
  const modules = {
    toolbar: [
      // Line 1
      [{ font: [] }, { size: [] }, { header: [1, 2, 3, 4, false] }, { align: [] }],
      ["bold", "italic", "underline", "strike"],
      [{ color: [] }, { background: [] }],
      // Line 2
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      [{ script: "sub" }, { script: "super" }],
      ["blockquote", "code-block"],
      ["link", "image", "video"],
      ["clean"],
    ],
  };

  const formats = [
    "font", "size", "header", "align",
    "bold", "italic", "underline", "strike",
    "color", "background",
    "list", "bullet", "indent",
    "script",
    "blockquote", "code-block",
    "link", "image", "video",
    "clean",
  ];

  return (
    <div className={`custom-quill-wrapper ${className}`}>
      <ReactQuill
        value={value}
        onChange={onChange}
        modules={modules}
        formats={formats}
        theme="snow"
      />
    </div>
  );
};

export default CustomQuillEditor;
