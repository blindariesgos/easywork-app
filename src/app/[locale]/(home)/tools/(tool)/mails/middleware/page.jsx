"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getAllOauth } from "../../../../../../../lib/apis";

export default function IngresarEmail() {
  const session = useSession();
  const router = useRouter();

  getAllOauth(session.data.user.id).then((response) => {
    if (response.length > 0) {
      router.push("/tools/webmail?page=1");
    } else {
        router.push("/tools/mails");
    }
  })


}
