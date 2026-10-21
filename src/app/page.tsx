import { redirect } from "next/navigation";

// The full portfolio lands here later; for now /motions is the only page.
export default function Home() {
  redirect("/motions");
}
