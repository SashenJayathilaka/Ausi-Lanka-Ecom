import { HydrateClient, trpc } from "@/trpc/server";
import React from "react";
import Navbar from "../navbar";

const SessionIn = () => {
  void trpc.getUsers.getUserType.prefetchInfinite();

  return (
    <HydrateClient>
      <Navbar />
    </HydrateClient>
  );
};

export default SessionIn;
