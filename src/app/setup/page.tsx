import { Suspense } from "react";
import SetupForm from "@/components/setup/SetupForm";

export default function SetupPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-20 text-center"><div className="text-gray-400">加载中...</div></div>}>
      <SetupForm />
    </Suspense>
  );
}
