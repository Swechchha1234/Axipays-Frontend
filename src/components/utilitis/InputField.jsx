import React from "react";

const InputField = ({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  onBlur, 
  required, 
  errorMessage,placeholder 
}) => {
  return (
    <div className="form__group field">
      <input
        type={type}
        className={`form__field ${errorMessage ? "invalid" : ""}`}
        placeholder={placeholder}
        name={name}
        id={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
      />
      <label htmlFor={name} className="form__label">
        {label}
      </label>
      <p className="error-message">{errorMessage}</p>
    </div>
  );
};

// export const SelectField = ({
//   label,
//   id,
//   options = [],
//   value,
//   onChange,
//   onBlur,
//   required = false,
//   errorMessage,
// }) => {
//   return (
//     <div className="form__group field">
//       <select
//         id={id}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         onBlur={onBlur}
//         className={`form__field ${errorMessage ? "invalid" : ""}`}
//         required={required}
//       >
//         <option value="">Select {label}</option>
//         {options.map((option) => (
//           <option key={option} value={option}>
//             {option}
//           </option>
//         ))}
//       </select>
//       <label htmlFor={id} className="form__label">
//         {label}
//       </label>
//       <p className="error-message">{errorMessage}</p>
//     </div>
//   );
// };

export default InputField;
