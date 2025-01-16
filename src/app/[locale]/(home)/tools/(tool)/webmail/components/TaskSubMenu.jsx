"use client";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import useAppContext from "../../../../../../../context/app";

export default function TaskSubMenu({
  selectedFolder,
  totalUnreadByPage,
  setDMails,
  getAxiosMails,
}) {
  const { t } = useTranslation();
  const session = useSession();
  const { selectOauth, selectedEmails, setSelectedEmails } = useAppContext();

  async function changeSelectLabelId(label) {
    const array = selectedEmails.map((element) => element.email.googleId);
    await updateLabelId(array, label);
  }

  async function updateLabelId(array, label) {
    setSelectedEmails([]);
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/gmail/updatelabel/${label}/${session.data.user.sub}/${selectOauth?.id}`,
      { data: array }
    );

    const updatedMails = await getAxiosMails(selectedFolder);
    setDMails((prevMails) =>
      prevMails.map(
        (mail) =>
          updatedMails.find(
            (updatedMail) => updatedMail.email.googleId === mail.email.googleId
          ) || mail
      )
    );

    setDMails((prevMails) =>
      prevMails.map((mail) => {
        console.log(array.includes(mail.email.googleId));
        if (array.includes(mail.email.googleId)) {
          if (label === "unread") {
            return {
              ...mail,
              email: {
                ...mail.email,
                folder: mail.email.folder.filter((f) => f !== "UNREAD"),
              },
            };
          } else if (label === "read") {
            return {
              ...mail,
              email: {
                ...mail.email,
                folder: [...mail.email.folder, "UNREAD"],
              },
            };
          }
        }
        return mail;
      })
    );
  }

  return (
    <div className="flex gap-6 text-sm text-easywork-main ml-9">
      <div>
        <p>
          {" "}
          <span className="bg-white rounded-full p-1">
            {totalUnreadByPage()}
          </span>{" "}
          Correos electrónicos
        </p>
      </div>
      <div>
        <p
          className="cursor-pointer"
          onClick={() => {
            changeSelectLabelId("read");
          }}
        >
          <span className="bg-white rounded-full p-1">
            {selectedEmails.length}
          </span>{" "}
          Marcar como no leídos
        </p>
      </div>
      <div>
        <p
          className="cursor-pointer"
          onClick={() => {
            changeSelectLabelId("unread");
          }}
        >
          Marcar como leídos
        </p>
      </div>
    </div>
  );
}
