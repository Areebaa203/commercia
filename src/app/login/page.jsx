import { Suspense } from "react";
import LoginBrandPanel from "@/components/auth/LoginBrandPanel";
import LoginFormPanel from "@/components/auth/LoginFormPanel";

function FormFallback() {
  return (
    <div className="flex w-full flex-1 items-center justify-center bg-white p-8 lg:w-1/2">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-blue-600" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen w-full">
      <LoginBrandPanel />
      <Suspense fallback={<FormFallback />}>
        <LoginFormPanel />
      </Suspense>
    </div>
  );
}
