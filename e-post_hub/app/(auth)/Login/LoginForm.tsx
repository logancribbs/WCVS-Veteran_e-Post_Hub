// e-post_hub/app/(auth)/Login/LoginForm.tsx
"use client";

import { loginSchema, LoginSchema } from "../../../lib/schemas/loginSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Card, CardBody, CardHeader, Input } from "@nextui-org/react";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { GiPadlock } from "react-icons/gi";

export default function LoginForm() {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    mode: "onTouched",
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();

        // Save token + role for the homepage to read
        if (result?.token) localStorage.setItem("token", result.token);
        if (result?.role) localStorage.setItem("role", result.role);

        // ✅ Always go to the homepage so the new banner renders
        window.location.href = "/";
        return;
      }

      const errorResponse = await response.json().catch(() => null);
      setErrorMessage(
        `Login failed${errorResponse?.message ? `: ${errorResponse.message}` : ""}`
      );
      console.log("Error response:", errorResponse?.message);
    } catch (error) {
      console.error("An error occurred during login:", error);
      setErrorMessage("An error occurred during login. Please try again later.");
    }
  };

  return (
    <div className="w-full px-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="flex flex-col items-center justify-center">
          <div className="flex flex-col gap-2 items-center text-orange-500">
            <div className="flex flex-row items-center gap-3">
              <GiPadlock size={30} />
              <h1 className="text-3xl font-semibold">Login</h1>
            </div>
            <p className="text-neutral-500">
              Welcome back to the Veteran e-Post Hub
            </p>
          </div>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {errorMessage && (
                <p role="alert" className="text-red-500">
                  {errorMessage}
                </p>
              )}
              <Input
                isRequired
                defaultValue=""
                label="Email"
                variant="bordered"
                {...register("email")}
                isInvalid={!!errors.email}
                errorMessage={errors.email?.message as string}
              />
              <Input
                isRequired
                defaultValue=""
                label="Password"
                variant="bordered"
                type="password"
                {...register("password")}
                isInvalid={!!errors.password}
                errorMessage={errors.password?.message as string}
              />
              <Button
                isDisabled={!isValid}
                fullWidth
                className="bg-gradient-to-r from-[#f7960d] to-[#f95d09] border border-black"
                type="submit"
              >
                Login
              </Button>
            </div>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
