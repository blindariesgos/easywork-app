"use client";
import { Fragment, useEffect, useMemo, useState } from "react";
import ReceiptDetail from "../control/portafolio/receipts/components/ReceiptDetails";
import PolicyDetails from "../operations/policies/components/PolicyDetailsSlider";
import { useSearchParams } from "next/navigation";

const CRMDetailsModals = () => {
  const searchParams = useSearchParams();
  const params = useMemo(() => {
    return new URLSearchParams(searchParams);
  }, [searchParams]);
  const [receipt, setReceipt] = useState();
  const [policy, setPolicy] = useState();
  const [editPolicy, setEditPolicy] = useState();

  useEffect(() => {
    if (params.get("receipt")) {
      setReceipt(params.get("receipt"));
    } else {
      setReceipt(null);
    }

    if (params.get("policy")) {
      setPolicy(params.get("policy"));
    } else {
      setPolicy(null);
    }

    if (params.get("editPolicy")) {
      setEditPolicy(params.get("editPolicy"));
    } else {
      setEditPolicy(null);
    }
  }, [params]);

  return (
    <Fragment>
      {receipt && <ReceiptDetail id={receipt} />}
      {policy && <PolicyDetails id={policy} remove="policy" />}
      {editPolicy && (
        <PolicyDetails id={editPolicy} remove="editPolicy" edit={true} />
      )}
    </Fragment>
  );
};

export default CRMDetailsModals;
