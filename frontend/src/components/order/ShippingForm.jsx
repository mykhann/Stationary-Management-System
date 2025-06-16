import React from 'react';

const ShippingForm = ({ shipping, setShipping }) => {
  const handleChange = (e) =>
    setShipping((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
      {['fullName', 'address', 'city', 'country', 'postalCode'].map((field) => (
        <div key={field}>
          <label className="text-sm font-medium text-gray-700 capitalize">
            {field.replace(/([A-Z])/g, ' $1')}
          </label>
          <input
            type="text"
            name={field}
            value={shipping[field]}
            onChange={handleChange}
            className="mt-1 p-2 border rounded-md w-full"
          />
        </div>
      ))}
    </div>
  );
};

export default ShippingForm;
