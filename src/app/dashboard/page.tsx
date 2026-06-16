export default function Dashboard() {
  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-3 gap-4 mt-6">

        <div className="border p-4">
          Today's Appointments
        </div>

        <div className="border p-4">
          Customers
        </div>

        <div className="border p-4">
          Revenue
        </div>

      </div>
    </div>
  );
}
