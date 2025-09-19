"use client";

import { Form, Formik } from "formik";
import { EmailInput, PasswordInput, TextInput } from "../ui/InputFields";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import { CiWarning } from "react-icons/ci";

export default function SignUp() {
  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Required"),
  });

  return (
    <Formik
      initialValues={{ email: "", password: "", confirmPassword: "" }}
      onSubmit={async (values, actions) => {
        let headersList = {
          Accept: "*/*",
          "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        };

        let response = await fetch("/api/new_customer", {
          method: "POST",
          headers: headersList,
          body: JSON.stringify({
            email: values.email,
            password: values.password,
          }),
        });

        let data = await response.json();
        if (response.status === 200) {
          toast.success(
            "Account created successfully. Free 5 hours of usage from us! 😊"
          );
          actions.resetForm();
        } else {
          toast.error(data);
        }
      }}
      validationSchema={validationSchema}
      validateOnChange={true}
      className="flex gap-4 flex-wrap justify-center sm:justify-start"
    >
      {({ touched, errors, values, handleChange, handleSubmit, resetForm }) => (
        <>
          <ToastContainer />
          <Form className="flex gap-4 flex-col sm:flex-wrap justify-center sm:justify-center">
            <EmailInput
              values={values.email}
              label="Email"
              name="email"
              placeholder="Email"
              errors={errors.email}
              touched={touched.email}
              handleChange={handleChange}
              type="email"
            />
            <div className="flex items-center gap-2">
              <CiWarning className="  top-11 text-2xl text-orange-500" />
              <span className="text-orange-500">
                Use different password than personal accounts.
              </span>
            </div>
            <PasswordInput
              values={values.password}
              label="Password"
              name="password"
              placeholder="Password"
              errors={errors.password}
              touched={touched.password}
              handleChange={handleChange}
            />
            <PasswordInput
              values={values.confirmPassword}
              label="Confirm Password"
              name="confirmPassword"
              placeholder="Confirm Password"
              errors={errors.confirmPassword}
              touched={touched.confirmPassword}
              handleChange={handleChange}
            />
            <button type="submit" className="btn btn-primary w-full">
              Sign Up
            </button>
          </Form>
        </>
      )}
    </Formik>
  );
}
