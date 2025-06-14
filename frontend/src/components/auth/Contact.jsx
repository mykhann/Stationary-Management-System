import React from "react";

const staffContacts = [
  {
    name: "Ahmed Khan",
    role: "Customer Support Manager",
    email: "ahmed.khan@stationeryhub.pk",
    phone: "+92 300 1234567",
  },
  {
    name: "Fatima Ali",
    role: "Sales Manager",
    email: "fatima.ali@stationeryhub.pk",
    phone: "+92 301 7654321",
  },
  {
    name: "Zain Malik",
    role: "Product Specialist",
    email: "zain.malik@stationeryhub.pk",
    phone: "+92 302 2345678",
  },
  {
    name: "Sana Iqbal",
    role: "Technical Support",
    email: "sana.iqbal@stationeryhub.pk",
    phone: "+92 303 3456789",
  },
];

const Contact = () => {
  return (
    <section className="max-w-4xl mx-auto p-6 bg-white rounded-md shadow-md my-8">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">
        Contact Us
      </h2>

      <div className="mb-10 text-center text-gray-700 text-sm leading-tight">
        <p className="mb-1 font-medium">Stationery Hub Headquarters</p>
        <p>
          House #45, Street 12, Satellite Town,<br />
          Rawalpindi, Pakistan
        </p>
        <p className="mt-1">Phone: +92 51 1234567</p>
        <p>Email: support@stationeryhub.pk</p>
      </div>

      <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
        Our Team
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700 text-sm">
        {staffContacts.map(({ name, role, email, phone }, idx) => (
          <div
            key={idx}
            className="border rounded-md p-4 hover:shadow-lg transition flex flex-col space-y-1"
          >
            <h4 className="text-lg font-semibold text-indigo-600">{name}</h4>
            <p className="italic">{role}</p>
            <p>
              <strong>Email: </strong>
              <a href={`mailto:${email}`} className="text-indigo-600 hover:underline">
                {email}
              </a>
            </p>
            <p>
              <strong>Phone: </strong>
              <a href={`tel:${phone}`} className="text-indigo-600 hover:underline">
                {phone}
              </a>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Contact;
