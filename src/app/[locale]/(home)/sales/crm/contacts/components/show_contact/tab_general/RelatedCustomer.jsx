import Button from "@/src/components/form/Button";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdModeComment } from "react-icons/md";
import { MdEmail } from "react-icons/md";
import { TbPhoneFilled } from "react-icons/tb";

const RelatedCustomer = ({ client, type }) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [showAddress, setShowAddress] = useState(false);
  const handleClick = () => {
    router.push(`/sales/crm/contacts/contact/${client.id}?show=true`);
  };

  return (
    <div
      className="rounded-xl p-2.5 grid gap-8"
      style={{
        background:
          "linear-gradient(290.91deg, #FFFFFF 67.75%, #635EA5 206.17%)",
      }}
    >
      <div className="flex justify-between">
        <p className="text-md">{t(`contacts:related:${type}`)}</p>
        <div className="flex gap-2 items-center">
          <div className="w-6 h-6 rounded-full bg-primary  flex justify-center items-center">
            <MdEmail className="w-4 h-4 text-white" />
          </div>
          <div className="w-6 h-6 rounded-full bg-primary flex justify-center items-center">
            <MdModeComment className="w-4 h-4 text-white" />
          </div>
          <div className="w-6 h-6 rounded-full bg-primary flex justify-center items-center">
            <TbPhoneFilled className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
      <div>
        <p className="text-xl font-semibold">{client.fullName}</p>
        <div className="flex gap-8">
          {client?.phones?.[0]?.phone?.number && (
            <p className="text-sm">+{client?.phones?.[0]?.phone?.number}</p>
          )}
          {client?.emails?.[0]?.email?.email && (
            <p className="text-sm">{client?.emails?.[0]?.email?.email}</p>
          )}
        </div>
        {client?.address && (
          <Fragment>
            <p
              className="text-sm cursor-pointer hover:underline hover:text-primary"
              onClick={() => setShowAddress(!showAddress)}
            >
              {showAddress
                ? t("contacts:related:hidden-address")
                : t("contacts:related:show-address")}
            </p>
            {showAddress && <p className="text-sm">{client?.address}</p>}
          </Fragment>
        )}
      </div>
      <div className="flex justify-start">
        <Button
          buttonStyle="primary"
          label={t("contacts:related:show")}
          className="py-2 px-4"
          onclick={handleClick}
          type="button"
        />
      </div>
    </div>
  );
};

export default RelatedCustomer;
