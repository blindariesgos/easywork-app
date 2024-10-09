"use client";
import React, { useEffect, useRef, useState } from "react";
import TextEditor from "./TextEditor";
import UploadDocuments from "./UploadDocuments";
import CheckList from "./CheckList";
import DropdownVisibleUsers from "./DropdownVisibleUsers";
import { useTranslation } from "react-i18next";
import { AtSymbolIcon, PaperClipIcon } from "@heroicons/react/20/solid";
import { DocumentTextIcon } from "@heroicons/react/24/outline";
import { useFieldArray, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import useAppContext from "@/src/context/app";

const OptionsTask = ({
  edit,
  copy,
  value,
  setValueText,
  disabled,
  setListField,
}) => {
  const { t } = useTranslation();
  const { lists } = useAppContext();
  const quillRef = useRef(null);
  const mentionButtonRef = useRef(null);
  const [arroba, setArroba] = useState(false);
  const [files, setFiles] = useState([]);
  const [dataUsers, setDataUsers] = useState();
  const [userSelected, setUserSelected] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectText, setSelectText] = useState();
  const [openList, setOpenList] = useState(edit ?? copy ? true : false);
  const [openFiles, setOpenFiles] = useState(false);
  const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });

  const options = [
    {
      id: 1,
      name: t("tools:tasks:new:file"),
      icon: PaperClipIcon,
      onclick: () => setOpenFiles(!openFiles),
    },
    {
      id: 2,
      name: t("tools:tasks:new:document"),
      icon: DocumentTextIcon,
    },
    {
      id: 3,
      name: t("tools:tasks:new:mention"),
      icon: AtSymbolIcon,
      onclick: () => setDropdownVisible(!dropdownVisible),
      disabled: arroba || disabled,
    },
    {
      id: 5,
      name: t("tools:tasks:new:verification-list"),
      onclick: () => {
        if (fields.length === 0) {
          append({
            name: `${t("tools:tasks:new:verification-list")} #${fields.length + 1}`,
            subItems: [{ name: "", value: false, empty: true }],
          });
        }
        setOpenList(!openList);
      },
    },
    // {
    //   id: 6,
    //   name: t("tools:tasks:new:add-list"),
    //   onclick: () => { },
    //   menu: true,
    // },
  ];

  const schema = yup.object().shape({
    items: yup.array().of(
      yup.object().shape({
        name: yup.string().required(),
        subItems: yup.array().of(
          yup.object().shape({
            name: yup.string().required(),
          })
        ),
      })
    ),
  });

  const { register, handleSubmit, control, getValues, setValue, watch } =
    useForm({
      defaultValues: {},
      resolver: yupResolver(schema),
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  useEffect(() => {
    setListField && setListField(watch("items"));
  }, [watch, setListField]);

  useEffect(() => {
    if (edit?.listField?.length > 0) {
      const outputArray = edit.listField.map((item) => ({
        name: item.text,
        subItems: item.child.map((subItem) => ({
          name: subItem.text,
          value: subItem.completed,
          empty: false,
        })),
      }));
      setValue("items", outputArray);
    }
  }, [edit, setValue]);

  useEffect(() => {
    if (copy?.listField?.length > 0) {
      const outputArray = copy.listField.map((item) => ({
        name: item.text,
        subItems: item.child.map((subItem) => ({
          name: subItem.text,
          value: subItem.completed,
          empty: false,
        })),
      }));
      setValue("items", outputArray);
    }
  }, [copy, setValue]);

  const handleTextSelection = (selection, source, editor) => {
    if (selection) {
      setSelectText(editor.getText(selection.index, selection.length));
    }
  };

  useEffect(() => {
    if (lists?.users) {
      setDataUsers(lists.users);
    }
  }, [lists]);

  useEffect(() => {
    if (userSelected) {
      addUserSelected(userSelected.name);
    }
  }, [userSelected]);

  const addUserSelected = (name) => {
    if (quillRef.current) {
      const quillEditor = quillRef.current.getEditor();
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

  const onChangeCustom = (event) => {
    const { value } = event.target;
    const filterData = lists?.users.filter((user) =>
      user.name.toLowerCase().includes(value.toLowerCase())
    );
    setDataUsers(filterData);
  };

  const dropdownUsers = (editor) => (
    <DropdownVisibleUsers
      mentionButtonRef={editor ? null : mentionButtonRef}
      modalPosition={modalPosition}
      dataUsers={dataUsers}
      onChangeCustom={onChangeCustom}
      setUserSelected={setUserSelected}
      userSelected={userSelected}
      setDropdownVisible={editor ? setArroba : setDropdownVisible}
    />
  );

  const deleteFiles = (indexToDelete) => {
    const documents = files.filter((_, index) => index !== indexToDelete);
    setFiles(documents);
  };

  return (
    <div>
      <div className="bg-white w-full rounded-lg mt-2 sm:h-48 h-60 relative">
        <TextEditor
          ref={quillRef}
          value={value}
          className="sm:h-36 h-52 w-full"
          onChangeSelection={handleTextSelection}
          setValue={setValueText}
          disabled={disabled}
        />
      </div>
      <div className="flex justify-start mt-4 gap-3 relative flex-wrap">
        {options
          .filter((opt) => !opt.disabled)
          .map((opt) => (
            <div
              key={opt.id}
              className="flex gap-1 items-center cursor-pointer"
              onClick={opt.onclick}
              ref={opt.id === 3 ? mentionButtonRef : null}
            >
              <button
                className="flex gap-2 items-center focus:ring-0"
                disabled={opt.disabled}
              >
                {opt.icon && <opt.icon className="h-4 w-4 text-black" />}
                <p className="text-sm">{opt.name}</p>
              </button>
            </div>
          ))}
        {dropdownVisible && mentionButtonRef.current && dropdownUsers()}
      </div>
      {openFiles && (
        <UploadDocuments
          files={files}
          deleteFiles={deleteFiles}
          setFiles={setFiles}
        />
      )}
      {openList && (
        <div className="mt-2">
          <CheckList
            handleSubmit={handleSubmit}
            fields={fields}
            append={append}
            remove={remove}
            setValue={setValue}
            watch={watch}
            getValues={getValues}
            control={control}
            register={register}
            task={edit}
            setListField={setListField}
          />
        </div>
      )}
    </div>
  );
};

export default OptionsTask;
