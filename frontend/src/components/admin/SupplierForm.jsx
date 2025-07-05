import React from "react";
import { Check, X } from "lucide-react";

const SupplierForm = ({
  supplier,
  formData,
  onChange,
  onSave,
  onCancel,
  isEditing = false,
}) => {
  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="p-4">
        <input
          name="name"
          value={formData.name}
          onChange={onChange}
          className="border rounded p-2 w-full"
          placeholder="Name"
        />
      </td>
      <td className="p-4">
        <input
          name="contactPerson"
          value={formData.contactPerson}
          onChange={onChange}
          className="border rounded p-2 w-full"
          placeholder="Contact Person"
        />
      </td>
      <td className="p-4">
        <input
          name="email"
          value={formData.email}
          onChange={onChange}
          className="border rounded p-2 w-full"
          placeholder="Email"
        />
      </td>
      <td className="p-4">
        <input
          name="phone"
          value={formData.phone}
          onChange={onChange}
          className="border rounded p-2 w-full"
          placeholder="Phone"
        />
      </td>
      <td className="p-4">
        <input
          name="address"
          value={formData.address}
          onChange={onChange}
          className="border rounded p-2 w-full"
          placeholder="Address"
        />
      </td>
      <td className="p-4 flex items-center gap-2">
        <button
          onClick={onSave}
          className="flex items-center gap-1 text-green-600 hover:underline"
        >
          <Check size={16} /> Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 text-gray-500 hover:underline"
        >
          <X size={16} /> Cancel
        </button>
      </td>
    </tr>
  );
};

export default SupplierForm;
