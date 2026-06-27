import Image from "next/image";


export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <h1 className="text-2xl font-bold">BookEase</h1>

          <nav className="hidden gap-6 md:flex">
            <a href="#features" className="hover:text-blue-200">
              Features
            </a>
            <a href="#booking" className="hover:text-blue-200">
              Book
            </a>
            <a href="#contact" className="hover:text-blue-200">
              Contact
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-24 text-white">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="mb-6 text-5xl font-bold">
            Appointment Booking System
          </h2>

          <p className="mb-8 text-lg text-blue-100">
            Schedule appointments easily, manage reservations and receive
            instant confirmations.
          </p>

          <a
            href="#booking"
            className="rounded-lg bg-white px-6 py-3 font-semibold text-blue-600 transition hover:bg-blue-50"
          >
            Book Appointment
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20">
        <h3 className="mb-12 text-center text-3xl font-bold">
          Why Choose Us?
        </h3>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-6 shadow">
            <h4 className="mb-2 text-xl font-semibold">Easy Booking</h4>
            <p className="text-gray-600">
              Schedule appointments in just a few clicks.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h4 className="mb-2 text-xl font-semibold">
              Real-Time Availability
            </h4>
            <p className="text-gray-600">
              View available time slots instantly.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h4 className="mb-2 text-xl font-semibold">
              Instant Confirmation
            </h4>
            <p className="text-gray-600">
              Receive immediate booking confirmation.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <h4 className="mb-2 text-xl font-semibold">Secure Platform</h4>
            <p className="text-gray-600">
              Your appointments and information stay protected.
            </p>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section id="booking" className="bg-white py-20">
        <div className="mx-auto max-w-2xl px-6">
          <h3 className="mb-8 text-center text-3xl font-bold">
            Book an Appointment
          </h3>

          <form className="space-y-4 rounded-xl border bg-white p-8 shadow">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="email"
              placeholder="Email Address"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500">
              <option>Select Service</option>
              <option>Consultation</option>
              <option>Fitness Training</option>
              <option>Medical Checkup</option>
              <option>Business Meeting</option>
              <option>Haircut & Styling</option>
              <option>Photography Session</option>
              <option>Car Service</option>
            </select>

            <input
              type="date"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="time"
              className="w-full rounded-lg border p-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Confirm Booking
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="contact"
        className="bg-slate-900 py-8 text-center text-white"
      >
        <p>info@bookease.com</p>
        <p>+123 456 7890</p>
        <p className="mt-2 text-sm text-slate-400">
          © 2026 BookEase. All rights reserved.
        </p>
      </footer>
    </main>
  );
}


// export default function Home() {
//   return (
//     <main className="p-10">
//       <h1 className="text-4xl font-bold">
//         Appointment Booking System
//       </h1>

//       <p className="mt-4">
//         Welcome to our BookEase platform. Easily schedule, manage and track your appointments in just a few clicks. 
//         Select your preferred date and time to get started.
//       </p>
//     </main>
//   );
// }


// export default function Home() {
//   return (
//     <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
//       <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
//         <Image
//           className="dark:invert"
//           src="/next.svg"
//           alt="Next.js logo"
//           width={100}
//           height={20}
//           priority
//         />
//         <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
//           <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
//             To get started, edit the page.tsx file.
//           </h1>
//           <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
//             Looking for a starting point or more instructions? Head over to{" "}
//             <a
//               href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Templates
//             </a>{" "}
//             or the{" "}
//             <a
//               href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//               className="font-medium text-zinc-950 dark:text-zinc-50"
//             >
//               Learning
//             </a>{" "}
//             center.
//           </p>
//         </div>
//         <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
//           <a
//             className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
//             href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             <Image
//               className="dark:invert"
//               src="/vercel.svg"
//               alt="Vercel logomark"
//               width={16}
//               height={16}
//             />
//             Deploy Now
//           </a>
//           <a
//             className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
//             href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
//             target="_blank"
//             rel="noopener noreferrer"
//           >
//             Documentation
//           </a>
//         </div>
//       </main>
//     </div>
//   );
// }