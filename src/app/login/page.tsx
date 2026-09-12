"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginInput } from "@/lib/zod-schemas";
import { useLogin } from "@/services/auth.service";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import GuestGuard from "@/components/shared/guest-guard";

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LoginInput) => {
    login(data, {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: (error: Error) => {
        alert(error.message || "An error occurred during login");
      },
    });
  };

  return (
    <GuestGuard>
      <div className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center p-12 bg-zinc-50 border-r border-zinc-200">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold tracking-tighter text-zinc-900 leading-none mb-6">
              Elevate your professional <span className="text-zinc-500">presence.</span>
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed">
              The AI-powered resume builder that helps you land your dream job with ATS-optimized content and precision engineering.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Welcome back</h2>
              <p className="text-zinc-500">Enter your credentials to access your resume.</p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  name="email"
                  label="Email address"
                  type="email"
                  placeholder="name@company.com"
                  error={methods.formState.errors.email?.message}
                />
                <Input
                  name="password"
                  label="Password"
                  type="password"
                  placeholder="••••••••"
                  error={methods.formState.errors.password?.message}
                />
                <Button
                  type="submit"
                  className="w-full"
                  isLoading={isPending}
                >
                  Sign in
                </Button>
              </form>
            </FormProvider>

            <p className="text-center text-sm text-zinc-500">
              Don't have an account?{" "}
              <a href="/register" className="text-zinc-900 font-semibold hover:underline">
                Create one for free
              </a>
            </p>
          </div>
        </div>
      </div>
    </GuestGuard>
  );
}
