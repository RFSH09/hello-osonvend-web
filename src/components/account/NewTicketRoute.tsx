"use client";

import { useSearchParams } from "next/navigation";
import { NewTicketView } from "./NewTicketView";

/** Reads ?purchase=P1024 on the client so the page can be statically exported. */
export function NewTicketRoute() {
  const purchase = useSearchParams().get("purchase") ?? undefined;
  return <NewTicketView purchaseId={purchase} />;
}
