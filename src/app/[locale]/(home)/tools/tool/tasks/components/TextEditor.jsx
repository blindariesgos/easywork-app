"use client";
import React, { useEffect, useRef, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DropdownVisibleUsers from "./DropdownVisibleUsers";
import useAppContext from "../../../../../../../context/app";

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

const TextEditor = ({
  value,
  onChange,
  className,
  onChangeSelection,
  quillRef,
  setValue,
  disabled,
  handleKeyDown,
}) => {
  const { lists } = useAppContext();
  const [arroba, setArroba] = useState(false);
  const [dataUsers, setDataUsers] = useState();
  const [userSelected, setUserSelected] = useState(null);
  const [selectText, setSelectText] = useState("");
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const handleChange = (newValue, delta, source, editor) => {
    setArroba(false);
    const text = editor.getText();
    if (delta && delta.ops && delta.ops.length > 0) {
      delta.ops.forEach((obj) => {
        if (obj.insert === "@") {
          const atIndex = text.indexOf("@");
          const range = editor.getBounds(atIndex);
          setModalPosition({ x: range.left, y: range.bottom });
          return setArroba(true);
        }
      });
    }
    setValue(newValue);
  };

  const onChangeCustom = (event) => {
    const { value } = event.target;
    const filterData = lists.users.filter((user) => {
      return user.name.toLowerCase().includes(value.toLowerCase());
    });
    setDataUsers(filterData);
  };

  useEffect(() => {
    if (lists?.users) setDataUsers(lists.users);
  }, [lists]);

  useEffect(() => {
    const addUserSelected = (name) => {
      if (quillRef.current) {
        const quillEditor = quillRef.current.getEditor();
        const currentContents = quillEditor.getContents();
        let newContent = [];
        currentContents.ops.length > 0 &&
          currentContents.ops.map((op) => {
            newContent.push({
              insert: op.insert.replace(/\n$/, "").replace("@", ""),
              attributes: { ...op.attributes },
            });
          });

        quillEditor.setContents([
          ...newContent,
          { insert: name, attributes: { color: "#86BEDF", underline: true } },
          { insert: " " },
        ]);
        setUserSelected("");
      }
    };
    if (userSelected) addUserSelected(userSelected.username);
  }, [userSelected, quillRef]);
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
        ref={quillRef}
        value={value}
        onChange={onChange ? onChange : handleChange}
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
};

export default TextEditor;
