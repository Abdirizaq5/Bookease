//import Image from "next/image";


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

          <div className="text-center">
            <a
              href="/book"
              className="inline-block rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Book an Appointment
            </a>
          </div>  
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

