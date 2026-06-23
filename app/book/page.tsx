export default function BookPage() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold">Book an Appointment</h1>

      <form className="mt-6 space-y-4">
        <input
          className="border p-2 w-full"
          placeholder="First Name"
        />

        <input
          className="border p-2 w-full"
          placeholder="Last Name"
        />

        <input
          type="email"
          className="border p-2 w-full"
          placeholder="Email"
        />

        <input
          type="datetime-local"
          className="border p-2 w-full"
        />

        <button className="bg-blue-600 text-white px-4 py-2 rounded">
          Book Appointment
        </button>
      </form>
    </main>
  );
}
