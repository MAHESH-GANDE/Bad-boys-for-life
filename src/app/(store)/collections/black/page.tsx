import { redirect } from "next/navigation";

export default function BlackCollectionRedirect() {
  redirect("/shop?colour=Black");
}
