"use client";
import SlideOver from "@/src/components/SlideOver";
import React, { Fragment, useEffect, useState } from "react";
import MeetView from "../../../meet/MeetView";
import LoaderSpinner from "@/src/components/LoaderSpinner";
import { useMeet } from "@/src/lib/api/hooks/meetings";

const MeetPage = ({ id }) => {
  const { data, isLoading, isError } = useMeet(id);

  return (
    <Fragment>
      {isLoading && <LoaderSpinner />}
      {data && (
        <SlideOver colorTag="bg-primary">
          <MeetView meet={data} id={id} />
        </SlideOver>
      )}
    </Fragment>
  );
};

export default MeetPage;
