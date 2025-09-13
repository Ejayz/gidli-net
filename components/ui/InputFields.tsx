import { useState } from "react";
import { IoWarningOutline } from "react-icons/io5";
import { LiaEyeSlashSolid, LiaEyeSolid } from "react-icons/lia";
import { MdAlternateEmail } from "react-icons/md";

export function TextInput({
  values,
  handleChange,
  name,
  label,
  placeholder,
  errors,
  touched,
}: {
  values: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  placeholder?: string;
  errors?: any;
  touched?: any;
}) {
  return (
    <div className="form-control">
      <label className={`label ${values ? "block" : "hidden"}`}>
        <span className="label-text">{label}</span>
      </label>
      <input
        type="text"
        name={name}
        value={values}
        onChange={handleChange}
        className={`input input-bordered  indent-5 w-full ${
          errors && touched ? "input-warning placeholder:text-warning" : ""
        } `}
        placeholder={placeholder}
      />
      {errors && touched && (
        <div className="flex flex-row items-center mt-1">
          <IoWarningOutline className="text-warning text-base mr-1" />
          <p className="text-sm text-warning mt-1">{errors}</p>
        </div>
      )}
    </div>
  );
}

export function PasswordInput({
  values,
  handleChange,
  name,
  label,
  placeholder,
  errors,
  touched,
}: {
  values: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  placeholder?: string;
  errors?: any;
  touched?: any;
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="form-control">
      <label className={`label ${values ? "block" : "hidden"}`}>
        <span className="label-text">{label}</span>
      </label>
      <div
        className={`input input-bordered indent-5 w-auto p-0 items-center flex flex-row ${
          errors && touched ? "input-warning" : ""
        }`}
      >
        <input
          type={showPassword ? "text" : "password"}
          name={name}
          value={values}
          onChange={handleChange}
          className={`my-auto px-2 w-3/4 indent-4 ${
            errors && touched ? "placeholder:text-warning" : ""
          }`}
          placeholder={placeholder}
        />
        <button
          type="button"
          className="btn btn-ghost w-1/4"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <LiaEyeSolid
              className={`text-xl ${errors && touched ? "text-warning" : ""}`}
            />
          ) : (
            <LiaEyeSlashSolid
              className={`text-xl ${errors && touched ? "text-warning" : ""}`}
            />
          )}
        </button>
      </div>
      {errors && touched && (
        <div className="flex flex-row items-center mt-1">
          <IoWarningOutline className="text-warning text-base mr-1" />
          <p className="text-sm text-warning mt-1">{errors}</p>
        </div>
      )}
    </div>
  );
}
export function EmailInput({
  values,
  handleChange,
  name,
  label,
  placeholder,
  errors,
  touched,
  type,
}: {
  values: any;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
  label: string;
  placeholder?: string;
  errors?: any;
  touched?: any;
  type?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  
  return (
    <div className="form-control">
      <label className={`label ${values ? "block" : "hidden"}`}>
        <span className="label-text">{label}</span>
      </label>
      <div
        className={`input input-bordered  w-auto p-0 items-center flex flex-row ${
          errors && touched ? "input-warning" : ""
        }`}
      >
        <div
          className="p-4 btn-ghost w-1/12"
          onClick={() => setShowPassword(!showPassword)}
        >
          <MdAlternateEmail
            className={`text-xl ${errors && touched ? "text-warning" : ""}`}
          />
        </div>
        <input
          type={type}
          name={name}
          value={values}
          onChange={handleChange}
          className={`my-auto px-2 w-3/4 indent-4 ${
            errors && touched ? "placeholder:text-warning" : ""
          }`}
          placeholder={placeholder}
        />
      </div>
      {errors && touched && (
        <div className="flex flex-row items-center mt-1">
          <IoWarningOutline className="text-warning text-base mr-1" />
          <p className="text-sm text-warning mt-1">{errors}</p>
        </div>
      )}
    </div>
  );
}
