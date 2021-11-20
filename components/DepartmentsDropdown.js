import React, { useState,useEffect } from "react";

function DepartmentsDropdown({ value, onChange, className }) {
  const departments = [
    "Select a Department",
    "B.CA",
    "B.Tech",
    "B.Eng",
    "M.CA",
    "M.Tech",
    "M.Eng",
  ];

  const [selectedOptionClass, setSelectedOptionClass] =
    useState("text-gray-400");

    useEffect(() => {
      if (value == "Select a Department") {
        setSelectedOptionClass("text-gray-400");
      }
    },[value])

  return (
    <label className={className}>
      Department:
      <select
        placeholder="Select a department"
        value={value}
        className={selectedOptionClass}
        onChange={(e) => {
          onChange(e);
          if (e.target.options.selectedIndex == 0) {
            setSelectedOptionClass("text-gray-400");
          } else {
            setSelectedOptionClass("");
          }
        }}
      >
        {departments.map((department) => (
          <option key={department} value={department}>
            {department}
          </option>
        ))}
      </select>
    </label>
  );
}

export default DepartmentsDropdown;
