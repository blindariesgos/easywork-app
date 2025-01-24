"use client";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import TextEditor from "../TextEditor";
import {
  deleteComment,
  postComment,
  putComment,
  deleteTaskCommentAttach,
  putMeetComment,
  postMeetComment,
  deleteMeetComment,
  deleteMeetCommentAttach,
} from "@/src/lib/apis";
import { handleApiError } from "@/src/utils/api/errors";
import { useSession } from "next-auth/react";
import {
  ChevronRightIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { useComments, useTaskComments } from "@/src/lib/api/hooks/tasks";
import LoaderSpinner, {
  LoadingSpinnerSmall,
} from "@/src/components/LoaderSpinner";
import { format } from "date-fns";
import { es } from "date-fns/locale"; // Importa el locale español
import { useSWRConfig } from "swr";
import parse from "html-react-parser";
import Button from "@/src/components/form/Button";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { GoKebabHorizontal } from "react-icons/go";
import UploadDocumentsInComment from "../UploadDocumentsInComment";
import FilePreview from "../FilePreview";
import { AtSymbolIcon, PaperClipIcon } from "@heroicons/react/20/solid";
import clsx from "clsx";
import { toast } from "react-toastify";

const urls = {
  put: {
    meet: (commentId, body, meetId) => putMeetComment(commentId, body, meetId),
    task: (commentId, body, taskId) => putComment(commentId, body, taskId),
  },
  post: {
    meet: (body) => postMeetComment(body),
    task: (body) => postComment(body),
  },
  get: {
    meet: "/tools/tasks/comments/task/",
    task: "/agent-management/meetings/comments/meet/",
  },
  delete: {
    meet: (commentId) => deleteMeetComment(commentId),
    task: (commentId) => deleteComment(commentId),
  },
  deleteAttach: {
    meet: (commentId, body) => deleteMeetCommentAttach(commentId, body),
    task: (commentId, body) => deleteTaskCommentAttach(commentId, body),
  },
};

const types = {
  meet: "meetingId",
  task: "taskId",
};

export default function TabComment({ info, type = "task" }) {
  const { comments, isLoading, isError } = useComments(urls.get[type], info.id);
  const [loading, setLoading] = useState(false);
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
  const [upload, setUpload] = useState({
    fileIds: [],
    files: [],
  });
  const [openFiles, setOpenFiles] = useState(false);
  const options = [
    {
      id: 1,
      name: t("tools:tasks:new:file"),
      icon: PaperClipIcon,
      onclick: () => setOpenFiles(!openFiles),
    },
  ];
  const [taggedUsers, setTaggedUsers] = useState([]);

  const handleComment = async (id) => {
    if (quillRef.current) {
      const body = {
        comment: value,
        [types[type]]: info.id,
        fileIds: upload?.fileIds ?? [],
      };

      if (taggedUsers.length > 0) {
        body.taggedUsers = taggedUsers;
      }
      console.log({ body });
      try {
        setDisabled(true);
        if (id) {
          const responseUpdate = await urls.put[type](id, body, info.id).catch(
            (error) => ({ hasError: true, ...error })
          );
          if (responseUpdate?.hasError) {
            toast.error(
              "Se ha producido un error al actualizar el comentario, inténtelo de nuevo más tarde."
            );
            setDisabled(false);
            return;
          }
        } else {
          const responsePost = await urls.post[type](body, info.id);
          if (responsePost.hasError) {
            toast.error(
              "Se ha producido un error al crear el comentario, inténtelo de nuevo más tarde."
            );
            setDisabled(false);
            return;
          }
        }

        await mutate(`${urls.get[type]}${info.id}`);
        setDisabled(false);
        setEditComment({});
        setValueText("");
        setUpload({
          fileIds: [],
          files: [],
        });
        setOpenFiles(false);
        setTaggedUsers([]);
      } catch (error) {
        console.log({ error });
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

  const getDeleteComment = async (id) => {
    try {
      setDisabled(true);
      await urls.delete[type](id);
      setDisabled(false);
    } catch (error) {
      handleApiError(error.message);
      setDisabled(false);
    }
  };

  const handleDeleteFile = async (fileId, commentId) => {
    setLoading(true);
    const body = {
      attachmentIds: [fileId],
    };
    const response = await urls.deleteAttach[type](commentId, body);
    if (response.hasError) {
      toast.error("Ocurrio un error al eliminar el archivo adjunto");
      setLoading(false);
      return;
    }

    mutate(`${urls.get[type]}${info.id}`);
    setLoading(false);
    toast.success("Adjunto eliminado con exito");
  };

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

  return (
    <div className="w-full p-3">
      {loading && <LoaderSpinner />}
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
              <div className="flex justify-start gap-3 relative flex-wrap">
                {options.map((opt) => (
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
              </div>
              {openFiles && (
                <UploadDocumentsInComment
                  handleChangeFiles={(data) => {
                    setUpload({
                      fileIds: [...upload.fileIds, ...data.fileIds],
                      files: [...upload.files, ...data.files],
                    });
                  }}
                />
              )}
              <div className="flex justify-start items-center gap-2">
                <Button
                  disabled={disabled}
                  buttonStyle="secondary"
                  label={t("common:buttons:cancel")}
                  className="px-3 py-2"
                  onclick={() => {
                    setIsAddComment(false);
                    setUpload({
                      fileIds: [],
                      files: [],
                    });
                  }}
                />
                <Button
                  type="button"
                  onclick={() => handleComment()}
                  disabled={disabled || value.length == 0}
                  label={t("tools:tasks:edit:comment:send")}
                  buttonStyle="primary"
                  className="px-3 py-2"
                />
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
          {showComments?.map((comment, index) => (
            <div
              className="flex gap-2 items-center w-full group"
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
                    src={session?.user?.picture || "/img/avatar.svg"}
                    alt=""
                  />
                  <div className="flex flex-col gap-2">
                    <div className="border rounded-md w-full">
                      <TextEditor
                        ref={quillRef}
                        value={value}
                        className="w-full max-h-[100px]"
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
                              handleDeleteFile={() =>
                                handleDeleteFile(file.id, comment.id)
                              }
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-start gap-3 relative flex-wrap">
                      {options.map((opt) => (
                        <div
                          key={opt.id}
                          className="flex gap-1 items-center cursor-pointer"
                          onClick={opt.onclick}
                        >
                          <button
                            className="flex gap-2 items-center focus:ring-0"
                            disabled={opt.disabled}
                          >
                            {opt.icon && (
                              <opt.icon className="h-4 w-4 text-black" />
                            )}
                            <p className="text-sm">{opt.name}</p>
                          </button>
                        </div>
                      ))}
                    </div>
                    {openFiles && (
                      <UploadDocumentsInComment
                        handleChangeFiles={(data) => {
                          console.log({ upload });
                          setUpload({
                            fileIds: [...upload.fileIds, ...data.fileIds],
                            files: [...upload.files, ...data.files],
                          });
                        }}
                      />
                    )}
                    <div className="flex justify-start items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setEditComment({});
                          setValueText("");
                          setUpload({
                            fileIds: [],
                            files: [],
                          });
                        }}
                        className="rounded-md bg-indigo-50 px-3 py-2 text-sm font-semibold text-primary shadow-sm hover:bg-indigo-100"
                      >
                        Cancelar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleComment(comment.id)}
                        disabled={disabled || value.length == 0}
                        className="rounded-md bg-primary px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        {disabled ? (
                          <InlineSpinner />
                        ) : (
                          t("tools:tasks:edit:comment:send")
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex w-full gap-2">
                  <Image
                    className="h-7 w-7 rounded-full object-cover"
                    width={36}
                    height={36}
                    src={comment?.createdBy?.avatar ?? "/img/avatar.svg"}
                    alt=""
                  />
                  <div className="bg-gray-200 rounded-md p-2 px-4 text-xs">
                    <div className="flex justify-between flex-col">
                      <div className="flex gap-2">
                        <span className="font-semibold">
                          {getUserName(comment?.createdBy)}
                        </span>
                        <span className="text-xs text-gray-800/50">
                          {formattedDate(comment)}
                        </span>
                      </div>
                      <div data-type="comment">{parse(comment.comment)}</div>
                    </div>
                    {comment?.attachedObjects && (
                      <div className="flex gap-1 flex-wrap p-1">
                        {comment?.attachedObjects?.map((file, index) => (
                          <div
                            className="p-2 bg-white shadow-lg text-xs rounded-full cursor-pointer flex gap-1 items-center group/delete"
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
                            <p
                              className="text-xs hidden group-hover/delete:block"
                              onClick={() =>
                                handleDeleteFile(file.id, comment.id)
                              }
                            >
                              x
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* {openActions[index] && ( */}
                  <div
                    className={clsx(" justify-end items-center gap-1 hidden", {
                      "group-hover:flex":
                        comment.createdBy.id === session?.user?.sub,
                    })}
                  >
                    <div
                      onClick={() => {
                        setEditComment({ [index]: !editComment[index] });
                        setValueText(comment.comment);
                        if (comment.attachedObjects) {
                          setUpload({
                            fileIds: [],
                            files: [],
                          });
                        }
                      }}
                      className="cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                    >
                      <PencilIcon className="h-3 w-3 text-blue-400" />
                    </div>
                    <div
                      onClick={() => {
                        getDeleteComment(comment.id);
                      }}
                      className="cursor-pointer hover:bg-gray-200 p-1 rounded-full"
                    >
                      <TrashIcon className="h-3 w-3 text-red-500" />
                    </div>
                  </div>
                  {/* )} */}
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
