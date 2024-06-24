"use client";

import React, { useEffect, useState, useCallback, useRef, forwardRef, useImperativeHandle } from "react";
import dynamic from "next/dynamic";
import DropdownVisibleUsers from "./DropdownVisibleUsers";
import useAppContext from "@/src/context/app";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const modules = {
  toolbar: [
    ["bold", "italic", "underline", "strike"],
    ["clean"],
    [{ color: [] }],
    [{ font: [] }],
    [{ size: ["small", false, "large", "huge"] }],
    ["code-block", "blockquote"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ indent: "-1" }, { indent: "+1" }],
    [{ align: [] }],
    ["link", "image", "video"],
  ],
};

const formats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "indent",
  "link",
  "image",
  "video",
  "size",
  "font",
  "color",
  "background",
  "align",
  "script",
  "header",
  "direction",
];

const TextEditor = forwardRef(({
  value,
  onChange,
  className,
  onChangeSelection,
  setValue,
  disabled = false,
  handleKeyDown,
}, ref) => {
  const { lists } = useAppContext();
  const localQuillRef = useRef(null); // Local ref to manage dynamic component ref
  const [arroba, setArroba] = useState(false);
  const [dataUsers, setDataUsers] = useState([]);
  const [userSelected, setUserSelected] = useState(null);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  useImperativeHandle(ref, () => ({
    getEditor: () => localQuillRef.current?.getEditor(),
  }));

  const handleChange = (newValue, delta, source, editor) => {
    setArroba(false);
    const text = editor.getText();
    if (delta && delta.ops && delta.ops.length > 0) {
      delta.ops.forEach((obj) => {
        if (obj.insert === "@") {
          const atIndex = text.indexOf("@");
          const range = editor.getBounds(atIndex);
          setModalPosition({ x: range.left, y: range.bottom });
          setArroba(true);
        }
      });
    }
    setValue(newValue);
  };

  const onChangeCustom = (event) => {
    const { value } = event.target;
    const filteredData = lists.users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setDataUsers(filteredData);
  };

  useEffect(() => {
    if (lists?.users) {
      setDataUsers(lists.users);
    }
  }, [lists]);

  useEffect(() => {
    const addUserSelected = (name) => {
      const editor = localQuillRef.current?.getEditor();
      if (editor) {
        const quillEditor = editor;
        const currentContents = quillEditor.getContents();
        const newContent = currentContents.ops.map((op) => ({
          insert: op.insert.replace(/\n$/, "").replace("@", ""),
          attributes: { ...op.attributes },
        }));

        quillEditor.setContents([
          ...newContent,
          { insert: name, attributes: { color: "#86BEDF", underline: true } },
          { insert: " " },
        ]);
        setUserSelected(null);
      }
    };

    if (userSelected) {
      addUserSelected(userSelected.username);
    }
  }, [userSelected]);

  const dropdownUsers = () => (
    <DropdownVisibleUsers
      mentionButtonRef={null}
      dataUsers={dataUsers}
      modalPosition={modalPosition}
      onChangeCustom={onChangeCustom}
      setUserSelected={setUserSelected}
      userSelected={userSelected}
      setDropdownVisible={setArroba}
    />
  );

  return (
    <div className="w-full relative">
      <ReactQuill
        ref={localQuillRef}
        value={value}
        onChange={onChange || handleChange}
        modules={modules}
        formats={formats}
        theme="snow"
        className={className}
        onChangeSelection={onChangeSelection}
        readOnly={disabled}
        onKeyDown={handleKeyDown}
      />
      {arroba && dropdownUsers()}
    </div>
  );
});

TextEditor.displayName = "TextEditor";

export default TextEditor;
