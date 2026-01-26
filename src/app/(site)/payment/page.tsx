import { Suspense } from "react";
import PaymentClient from "./PaymentClient";

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen pt-28 pb-16 bg-gray-50 dark:bg-background">
          <div className="px-4 mx-auto max-w-7xl sm:px-6 xl:px-4">
            <div className="h-10 w-48 rounded-lg bg-background-hover" />
            <div className="mt-8 h-40 rounded-2xl bg-background-hover" />
          </div>
        </main>
      }
    >
      <PaymentClient />
    </Suspense>
  );
}
