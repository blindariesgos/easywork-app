"use client";

import React, {
  useEffect,
  useState,
  useRef,
  forwardRef,
  useImperativeHandle,
} from "react";
import DropdownVisibleUsers from "./DropdownVisibleUsers";
import useAppContext from "@/src/context/app";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";
// const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

const toolbar = [
  ["bold", "italic", "underline", "strike"], // toggled buttons
  ["blockquote"],
  ["link", "image", "video"],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ["clean"], // remove formatting button
];

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
  "header",
  "direction",
];

const TextEditor = forwardRef(
  (
    {
      value,
      onChange,
      className,
      onChangeSelection,
      setValue,
      disabled = false,
      handleKeyDown,
    },
    ref
  ) => {
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
      const text = editor?.getText();
      if (delta?.ops && delta.ops.length > 0) {
        delta.ops.forEach((obj) => {
          if (obj.insert === "@") {
            const atIndex = text?.indexOf("@");
            const range = editor?.getBounds(atIndex);
            setModalPosition({ x: range?.left, y: range?.bottom });
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

    const addUserSelected = (user) => {
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
          {
            insert: user.name,
            attributes: {
              color: "#86BEDF",
              underline: true,
              // link: `/sales/crm/contacts/contact/${user.id}?show=true&page=1`,
            },
          },
          { insert: " " },
        ]);
        setUserSelected(null);
      }
    };

    useEffect(() => {
      if (userSelected) {
        addUserSelected(userSelected.username);
      }
    }, [userSelected]);

    return (
      <div className="w-full relative">
        <ReactQuill
          ref={localQuillRef}
          value={value}
          onChange={onChange || handleChange}
          modules={{
            toolbar: disabled ? null : toolbar,
          }}
          formats={formats}
          theme="snow"
          className={className}
          onChangeSelection={onChangeSelection}
          readOnly={disabled}
          onKeyDown={handleKeyDown}
        />
        {arroba && (
          <DropdownVisibleUsers
            mentionButtonRef={null}
            prueba={ref}
            dataUsers={dataUsers}
            modalPosition={modalPosition}
            onChangeCustom={onChangeCustom}
            setUserSelected={addUserSelected}
            userSelected={userSelected}
            setDropdownVisible={setArroba}
          />
        )}
      </div>
    );
  }
);

TextEditor.displayName = "TextEditor";

export default TextEditor;
