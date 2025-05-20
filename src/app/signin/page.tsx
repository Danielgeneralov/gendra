import { Suspense } from "react";
import SignInForm from "./SignInForm";

export const dynamic = "force-dynamic";

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="text-white p-8">Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
} 