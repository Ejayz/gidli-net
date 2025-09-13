"use client";

import { Form, Formik } from "formik";
import { PasswordInput, TextInput } from "@/components/ui/InputFields";
import { useEffect, useState } from "react";
import { getCookie } from "cookies-next";
import * as yup from "yup";

export default function LoginDashboard() {
  const [wallpaper, setWallpaper] = useState<string | null>(null);

  const validationSchema = yup.object().shape({
    username: yup.string().required("Username is required"),
    password: yup.string().required("Password is required"),
  });

  useEffect(() => {
    const saved = getCookie("wallpaper");
    if (saved && typeof saved === "string") {
      setWallpaper(saved);
    } else {
      setWallpaper("/wallpapers/wallpaper1.png");
    }
  }, []);

  const [loading, setLoading] = useState(false);

  return (
    <div
      className="font-sans grid grid-rows-[20px_1fr_20px] items-center min-h-screen p-8 pb-20 gap-16 sm:p-20"
      style={wallpaper ? { backgroundImage: `url(${wallpaper})` } : {}}
    >
      <main className="flex flex-col gap-[32px] w-1/4 row-start-2 justify-items-center items-center sm:items-start bg-gray-900 rounded-lg p-8 shadow-lg">
        <div className="flex flex-col w-full gap-2 items-center sm:items-start">
          <h1 className="text-2xl font-bold">Network Inventory</h1>
          <p className="text-sm text-gray-600 inline-block">
            Please log in to access your network inventory dashboard.
          </p>
        </div>

        <Formik
          initialValues={{ username: "", password: "" }}
          validationSchema={validationSchema}
          onSubmit={async (values) => {
            setLoading(true);
         try{
             let headersList = {
              Accept: "*/*",
              "User-Agent": "Thunder Client (https://www.thunderclient.com)",
              "Content-Type": "application/json",
            };

            let bodyContent = JSON.stringify({
              username: values.username,
              password: values.password,
            });

            let response = await fetch("http://localhost:3000/api/login", {
              method: "POST",
              body: bodyContent,
              headers: headersList,
            });
            let data = await response.json();
            if (data.code === 200) {
              setLoading(false);
              window.location.href = "/dashboard";
            } else {
              setLoading(false);
              alert(data.message);
            }
         }catch(error){
          setLoading(false);
          console.log(error);
          alert("An error occurred. Please try again.");
         }

          }}
        >
          {({ handleSubmit, handleChange, values, errors, touched }) => (
            <Form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
              <TextInput
                values={values.username}
                handleChange={handleChange}
                name="username"
                label="Username"
                placeholder="Username"
                errors={errors.username}
                touched={touched.username}
              />

              <PasswordInput
                values={values.password}
                handleChange={handleChange}
                name="password"
                label="Password"
                placeholder="Password"
                errors={errors.password}
                touched={touched.password}
              />
              <p className="text-sm text-gray-600">
                No account? Contact your administrator.
              </p>
              <button
                type="submit"
                className={`btn btn-primary w-full ${
                  loading ? "btn-disabled" : ""
                }`}
              >
                {loading ? (
                  <>
                    <span className="loading loading-infinity loading-xl"></span>
                    <span className="">Logging in...</span>
                  </>
                ) : (
                  "Log In"
                )}
              </button>
            </Form>
          )}
        </Formik>

        <select
          onChange={(e) => {
            setWallpaper(e.target.value);
            document.cookie = `wallpaper=${e.target.value}; path=/; max-age=31536000`;
          }}
          className="select w-full"
          value={wallpaper ?? ""}
        >
          <option value="/wallpapers/wallpaper1.png">Wallpaper 1</option>
          <option value="/wallpapers/wallpaper2.png">Wallpaper 2</option>
          <option value="/wallpapers/wallpaper3.png">Wallpaper 3</option>
          <option value="/wallpapers/wallpaper4.png">Wallpaper 4</option>
        </select>
      </main>
    </div>
  );
}
