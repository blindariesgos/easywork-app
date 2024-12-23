"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TextEditor from "../TextEditor";
import { deleteComment, postComment, putComment } from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { useSession } from "next-auth/react";
import {
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useTaskComments } from "@/src/lib/api/hooks/tasks";
import { LoadingSpinnerSmall } from "@/src/components/LoaderSpinner";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importa el locale español
import { useSWRConfig } from "swr";
import parse from "html-react-parser";
import Button from "@/src/components/form/Button";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { GoKebabHorizontal } from "react-icons/go";
import UploadDocumentsInComment from "../UploadDocumentsInComment";
import FilePreview from "../FilePreview";

export default function TabComment({ info }) {
  const { comments, isLoading, isError } = useTaskComments(info.id);
  const { t } = useTranslation();
  const quillRef = useRef(null);
  const { data: session } = useSession();
  const [value, setValueText] = useState("");
  const [disabled, setDisabled] = useState(false);
  const [openActions, setOpenActions] = useState({});
  const [editComment, setEditComment] = useState({});
  const { mutate } = useSWRConfig();
  const [isAddComment, setIsAddComment] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [showComments, setShowComments] = useState([]);
  const [upload, setUpload] = useState({});
  const [taggedUsers, setTaggedUsers] = useState([]);
  const handleComment = async (_, id) => {
    if (quillRef.current) {
      const body = {
        comment: value,
        isSummary: info.requireSummary,
        taskId: info.id,
        fileIds: upload?.fileIds ?? [],
      };

      if (taggedUsers.length > 0) {
        body.taggedUsers = taggedUsers;
      }
      console.log({ body });
      try {
        setDisabled(true);
        id
          ? await putComment(id, body, info.id)
          : await postComment(body, info.id);

        await mutate(`/tools/tasks/comments/task/${info.id}`);
        setDisabled(false);
        setEditComment({});
        setValueText("");
        setUpload({});
        setTaggedUsers([]);
      } catch (error) {
        handleApiError(error.message);
        setDisabled(false);
      }
      setIsAddComment(false);
    }
  };

  const formattedDate = (info) =>
    format(new Date(info?.createdAt), "MMMM d h:mm a", { locale: es });

  const getUserName = (user) => {
    if (!user) return "Usuario"; // Manejar el caso donde user es nulo o undefined

    const { profile } = user;

    return profile?.firstName // Usar optional chaining para verificar ambos nombres
      ? `${profile.firstName} ${profile.lastName}`
      : user.username || user.email || "Usuario"; // Devolver el username, email, o null si no hay ninguno
  };

  useEffect(() => {
    if (comments.length > 3 && !showMore) {
      return setShowComments(comments.slice(-3));
    }

    setShowComments(comments);
  }, [comments, showMore]);

  if (isLoading)
    return (
      <div className="flex flex-col h-screen relative w-full overflow-y-auto">
        <div
          className={`flex flex-col flex-1 bg-gray-600 opacity-100 shadow-xl text-black rounded-tl-[35px] rounded-bl-[35px] p-2 sm:p-4 h-full overflow-y-auto`}
        >
          <LoadingSpinnerSmall color={"primary"} />
        </div>
      </div>
    );
  if (isError) return <>Error al cargar la tarea</>;

  const getDeleteComment = async (id) => {
    try {
      setDisabled(true);
      await deleteComment(id, info.id);
      setDisabled(false);
    } catch (error) {
      handleApiError(error.message);
      setDisabled(false);
    }
  };

  const handleDeleteFile = (index) => {
    setUpload({
      fileIds: upload.fileIds.filter((_, i) => i != index),
      files: upload.files.filter((_, i) => i != index),
    });
  };

  return (
    <div className="w-full p-3">
      {Object.keys(editComment).length === 0 && (
        <div className="flex gap-2 mb-4 items-center w-full">
          <Image
            className="h-7 w-7 rounded-full object-cover"
            width={36}
            height={36}
            src={"/img/avatar.svg"}
            alt=""
          />
          {isAddComment ? (
            <div className="flex gap-2 flex-col">
              <div className="border rounded-md w-full">
                <TextEditor
                  ref={quillRef}
                  value={value}
                  className="w-full"
                  setValue={setValueText}
                  taggedUsers={taggedUsers}
                  setTaggedUsers={setTaggedUsers}
                />
                {upload && upload?.files && (
                  <div className="flex gap-1 flex-wrap p-1">
                    {upload?.files?.map((file, index) => (
                      <FilePreview
                        info={file}
                        key={index}
                        handleDeleteFile={() => handleDeleteFile(index)}
                      />
                    ))}
                  </div>
                )}
              </div>
              <div className="flex justify-start items-center gap-2">
                <Button
                  disabled={disabled}
                  buttonStyle="secondary"
                  label={t("common:buttons:cancel")}
                  className="px-3 py-2"
                  onclick={() => {
                    setIsAddComment(false);
                    // setValueText("");
                    setUpload({});
                  }}
                />
                <Button
                  type="button"
                  onclick={handleComment}
                  disabled={disabled}
                  label={t("tools:tasks:edit:comment:send")}
                  buttonStyle="primary"
                  className="px-3 py-2"
                />
                <Menu>
                  <MenuButton className="px-3 h-[36px] font-bold hover:bg-zinc-200 flex items-center rounded-md">
                    <GoKebabHorizontal className="text-gray-60" />
                  </MenuButton>
                  <MenuItems
                    anchor={{
                      to: "right end",
                      gap: "4px",
                    }}
                    className={
                      "rounded-md bg-white  border py-2 shadow-lg focus:outline-none"
                    }
                  >
                    <UploadDocumentsInComment
                      handleChangeFiles={(data) =>
                        setUpload({
                          fileIds: [...upload.fileIds, ...data.fileIds],
                          files: [...upload.files, ...data.files],
                        })
                      }
                    />
                  </MenuItems>
                </Menu>
              </div>
            </div>
          ) : (
            <div
              className="w-full border rounded-full px-4 py-2 text-gray-50 text-sm cursor-pointer"
              onClick={() => setIsAddComment(true)}
            >
              Agregar comentario
            </div>
          )}
        </div>
      )}

      {showComments?.length > 0 && (
        <div className="gap-4 flex flex-col-reverse w-full md:overflow-y-auto md:max-h-[300px]">
          {showComments?.map((dat, index) => (
            <div
              className="flex gap-2 items-center w-full"
              key={index}
              onMouseEnter={() =>
                setOpenActions({ ...openActions, [index]: true })
              }
              onMouseLeave={() =>
                setOpenActions({ ...openActions, [index]: false })
              }
            >
              {editComment[index] ? (
                <div className="flex gap-2 mt-4 items-center w-full">
                  <Image
                    className="h-7 w-7 rounded-full object-cover"
                    width={36}
                    height={36}
                    src={"/img/avatar.svg"}
                    alt=""
                  />
                  <div className="flex flex-col gap-2">
                    <div className="border rounded-md w-full">
                      <TextEditor
                        ref={quillRef}
                        value={value}
                        className="w-full max-h-[100px]"
                        setValue={setValueText}
                        disabled={disabled}
                        taggedUsers={taggedUsers}
                        setTaggedUsers={setTaggedUsers}
                      />
                      {upload && upload?.files && (
                        <div className="flex gap-1 flex-wrap p-1">
                          {upload?.files?.map((file, index) => (
                            <FilePreview
                              info={file}
                              key={index}
                              handleDeleteFile={() => handleDeleteFile(index)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-start items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleComment(null, dat.id)}
                        disabled={disabled}
                        className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {disabled ? (
                          <InlineSpinner />
                        ) : (
                          t("tools:tasks:edit:comment:send")
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditComment({});
                          setValueText("");
                          setUpload({});
                        }}
                        className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-indigo-100"
                      >
                        Cancelar
                      </button>
                      <Menu>
                        <MenuButton className="px-3 h-[36px] font-bold hover:bg-zinc-200 flex items-center rounded-md">
                          <GoKebabHorizontal className="text-gray-60" />
                        </MenuButton>
                        <MenuItems
                          anchor={{
                            to: "right end",
                            gap: "4px",
                          }}
                          className={
                            "rounded-md bg-white  border py-2 shadow-lg focus:outline-none"
                          }
                        >
                          <UploadDocumentsInComment
                            handleChangeFiles={(data) =>
                              setUpload({
                                fileIds: [...upload.fileIds, ...data.fileIds],
                                files: [...upload.files, ...data.files],
                              })
                            }
                          />
                        </MenuItems>
                      </Menu>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex w-full gap-2">
                  <Image
                    className="h-7 w-7 rounded-full object-cover"
                    width={36}
                    height={36}
                    src={dat?.createdBy?.avatar ?? "/img/avatar.svg"}
                    alt=""
                  />
                  <div className="bg-gray-200 rounded-md p-2 px-4 text-xs">
                    <div className="flex justify-between flex-col">
                      <div className="flex gap-2">
                        <span className="font-semibold">
                          {getUserName(dat?.createdBy)}
                        </span>
                        <span className="text-xs text-gray-800/50">
                          {formattedDate(dat)}
                        </span>
                      </div>
                      <div data-type="comment">{parse(dat.comment)}</div>
                    </div>
                    {dat?.attachedObjects && (
                      <div className="flex gap-1 flex-wrap p-1">
                        {dat?.attachedObjects?.map((file, index) => (
                          <div
                            className="p-2 bg-white shadow-lg text-xs rounded-full cursor-pointer flex gap-1 items-center"
                            title={file?.name}
                            key={index}
                          >
                            <p
                              onClick={() =>
                                window.open(
                                  file.url,
                                  "self",
                                  "status=yes,scrollbars=yes,toolbar=yes,resizable=yes,width=850,height=500"
                                )
                              }
                            >
                              {file?.name?.length > 16
                                ? `${file?.name?.slice(0, 7)}...${file?.name?.slice(-6)}`
                                : file?.name}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {openActions[index] && (
                    <div className="flex justify-end items-center gap-1">
                      <div
                        onClick={() => {
                          if (dat.createdBy.id !== session?.user?.id) return;
                          setEditComment({ [index]: !editComment[index] });
                          setValueText(dat.comment);
                          if (dat.attachedObjects) {
                            setUpload({
                              fileIds: dat.attachedObjects.map((x) => x.id),
                              files: dat.attachedObjects.map((x) => ({
                                attached: {
                                  name: x.name,
                                  url: x.url,
                                },
                              })),
                            });
                          }
                        }}
                        className="cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                      >
                        <PencilIcon className="h-3 w-3 text-blue-400" />
                      </div>
                      <div
                        onClick={() => {
                          if (dat.createdBy.id !== session?.user?.id) return;
                          getDeleteComment(dat.id);
                        }}
                        className="cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                      >
                        <TrashIcon className="h-3 w-3 text-red-500" />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {comments?.length > 3 && (
        <div
          className="cursor-pointer pt-4"
          onClick={() => setShowMore(!showMore)}
        >
          <p className="text-xs">
            {t(`tools:tasks:edit:${showMore ? "pings-hide" : "pings"}`, {
              qty: comments?.length - 3,
            })}
          </p>
        </div>
      )}
    </div>
  );
}

const InlineSpinner = () => (
  <div className="flex justify-center items-center">
    <div className="flex items-center justify-center h-full gap-2 cursor-progress">
      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white/60" />
      <p>Enviando...</p>
    </div>
  </div>
);
