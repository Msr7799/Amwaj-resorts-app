import { redirect } from "next/navigation";

export default function SuccessAliasPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sessionIdRaw = searchParams.session_id;
  const sessionId = Array.isArray(sessionIdRaw) ? sessionIdRaw[0] : sessionIdRaw;

  if (sessionId) {
    redirect(`/payment/success?session_id=${encodeURIComponent(sessionId)}`);
  }

  redirect("/payment/success");
}
