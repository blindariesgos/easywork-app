"use client";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useSession } from "next-auth/react";
import useAppContext from "../../../../../../../context/app";

export default function TaskSubMenu({ fetchData, totalUnreadByPage }) {
  const { t } = useTranslation();
  const session = useSession();
  const { selectOauth, selectedEmails, setSelectedEmails } = useAppContext();

  async function changeSelectLabelId(label) {
    const array = [];
    selectedEmails.forEach((element) => {
      array.push(element.email.googleId);
    });
    updateLabelId(array, label);
  }

  async function updateLabelId(array, label) {
    console.log(label, array, selectOauth?.id);
    await axios.post(
      `${process.env.NEXT_PUBLIC_API_THIRDPARTY}/google/updatelabel/${label}/${session.data.user.id}/${selectOauth?.id}`,
      {
        data: array,
      }
    );
    await fetchData();
    setSelectedEmails([]);
  }

  return (
    <div className="flex gap-6 text-sm text-easywork-main ml-9">
      <div>
        <p>
          {" "}
          <span className="bg-white rounded-full p-1">{totalUnreadByPage()}</span> Correos
          electrónicos
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
