"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import ReceiptDetail from "../control/portafolio/receipts/components/ReceiptDetails";
import { useSearchParams } from "next/navigation";

const CRMDetailsModals = () => {
  const searchParams = useSearchParams();
  const params = useMemo(() => {
    return new URLSearchParams(searchParams);
  }, [searchParams]);
  const [receipt, setReceipt] = useState();

  useEffect(() => {
    if (params.get("receipt")) {
      setReceipt(params.get("receipt"));
    } else {
      setReceipt(null);
    }
  }, [params]);

  return <Fragment>{receipt && <ReceiptDetail id={receipt} />}</Fragment>;
};

export default CRMDetailsModals;
