import Image from "next/image";
import AuthForm from "./components/AuthForm";

export default function Home() {
  return (
    <div className="flex items-center min-h-screen bg-gray-100">
      <div className="mx-auto w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <Image
            alt="Logo"
            height={90}
            width={90}
            className="block mx-auto"
            src="/images/logo.svg"
          />
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <AuthForm />
      </div>
    </div>
  );
}
