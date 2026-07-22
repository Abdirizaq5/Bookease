"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <main className="mx-auto max-w-md p-10 text-center">
      <h1 className="mb-3 text-2xl font-bold">
        Something went wrong
      </h1>

      <p className="mb-6 text-gray-600">
        Please try again.
      </p>

      <button
        onClick={() => reset()}
        className="rounded bg-blue-600 px-4 py-2 font-semibold text-white"
      >
        Try again
      </button>
    </main>
  );
}
