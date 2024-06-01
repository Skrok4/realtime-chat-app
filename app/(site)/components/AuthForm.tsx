"use client";
import axios from "axios";
import { useCallback, useState, useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import {
  FieldErrors,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import Input from "@/app/components/Inputs/Input";
import Button from "@/app/components/Button";
import AuthSocialButton from "./AuthSocialButton";
import { BsGithub, BsGoogle } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

type Variant = "LOGIN" | "REGISTER";

const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = useState<Variant>("LOGIN");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/conversations");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      axios
        .post("/api/register", data)
        .then(() => {
          toast.success("Registration successful!");
          signIn("credentials", data);
        })
        .catch(() => toast.error("Something went wrong!"))
        .finally(() => setIsLoading(false));
    }

    if (variant === "LOGIN") {
      signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Invalid credentials");
          }

          if (callback?.ok && !callback?.error) {
            toast.success("Logged in!");
            router.push("/users");
          }
        })
        .catch(() => toast.error("Login failed!"))
        .finally(() => setIsLoading(false));
    }
  };

  const socialAction = (action: string) => {
    setIsLoading(true);

    signIn(action, { redirect: false })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid Credentials");
        }

        if (callback?.ok && !callback?.error) {
          toast.success("Logged in!");
        }
      })
      .catch(() => toast.error("Social login failed!"))
      .finally(() => setIsLoading(false));
  };

  // const onSubmit: SubmitHandler<FieldValues> = (data) => {
  //   setIsLoading(true);

  //   if (variant === "REGISTER") {
  //     axios
  //       .post("/api/register", data)
  //       .then(() =>
  //         signIn("credentials", {
  //           data,
  //         })
  //       )
  //       .then((callback) => {
  //         if (callback?.error) {
  //           toast.error("Invalid credentials!");
  //         }

  //         if (callback?.ok) {
  //           router.push("/conversations");
  //         }
  //       })
  //       .catch(() => toast.error("Something went wrong!"))
  //       .finally(() => setIsLoading(false));
  //   }

  //   if (variant === "LOGIN") {
  //     signIn("credentials", {
  //       ...data,
  //       redirect: false,
  //     })
  //       .then((callback) => {
  //         if (callback?.error) {
  //           toast.error("Invalid credentials!");
  //         }

  //         if (callback?.ok) {
  //           toast.success("Logged in!");
  //           router.push("/conversations");
  //         }
  //       })
  //       .finally(() => setIsLoading(false));
  //   }
  // };

  // const socialAction = (action: string) => {
  //   setIsLoading(true);

  //   signIn(action, { redirect: false })
  //     .then((callback) => {
  //       if (callback?.error) {
  //         toast.error("Invalid credentials!");
  //       }

  //       if (callback?.ok && !callback?.error) {
  //         toast.success("Logged in");
  //         router.push("/conversations");
  //       }
  //     })
  //     .finally(() => setIsLoading(false));
  // };

  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              disabled={isLoading}
              register={register}
              errors={errors}
              required
              id="name"
              label="Name"
            />
          )}
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="email"
            label="Email address"
            type="email"
          />
          <Input
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            id="password"
            label="Password"
            type="password"
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
      </div>

      <div className="mt-6">
        <div className="relative flex justify-center items-center">
          <div className="mt-[-50px] border-gray-300 w-full flex flex-col items-center">
            <div className="relative flex justify-center text-sm mt-4">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
            <div className="mt-6 flex gap-2">
              <AuthSocialButton
                icon={BsGithub}
                onClick={() => socialAction("github")}
              />
              <AuthSocialButton
                icon={BsGoogle}
                onClick={() => socialAction("google")}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-2 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "New to Messenger?"
              : "Already have an account"}
          </div>

          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Login"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
