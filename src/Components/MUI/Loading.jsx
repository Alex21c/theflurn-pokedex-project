import * as React from "react";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export default function Loading() {
  return (
    <div className="absolute  w-[100%] h-[100%] top-0 left-0 z-[100]">
      <div className="bg-gradient-to-br from-stone-50 to-stone-200  w-[100%] h-[100%] z-[10] opacity-[.9]">
        {" "}
      </div>
      <div className="sticky flex flex-col gap-[.5rem] items-center  bottom-[15rem] left-[50%] z-[100]">
        <CircularProgress />
        <h3 className="italic  text-[1.3rem]">Loading...</h3>
      </div>
    </div>
  );
}
