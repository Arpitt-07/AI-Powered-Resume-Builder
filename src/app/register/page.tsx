"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterInput } from "@/lib/zod-schemas";
import { useRegister } from "@/services/auth.service";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { FormProvider } from "react-hook-form";
import GuestGuard from "@/components/shared/guest-guard";

export default function RegisterPage() {
  const router = useRouter();
  const { mutate: register, isPending } = useRegister();

  const methods = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      mobile: "",
    },
  });

  const onSubmit = (data: RegisterInput) => {
    register(data, {
      onSuccess: () => {
        router.push("/dashboard");
      },
      onError: (error: Error) => {
        alert(error.message || "An error occurred during registration");
      },
    });
  };

  return (
    <GuestGuard>
      <div className="min-h-[100dvh] grid grid-cols-1 lg:grid-cols-2">
        <div className="hidden lg:flex flex-col justify-center p-12 bg-zinc-50 border-r border-zinc-200">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold tracking-tighter text-zinc-900 leading-none mb-6">
              Start your <span className="text-zinc-500">career journey.</span>
            </h1>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Join thousands of professionals who use AI to craft perfectly tailored resumes that beat the ATS.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8">
          <div className="w-full max-w-sm space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Create account</h2>
              <p className="text-zinc-500">Fill in the details to get started.</p>
            </div>

            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-6">
                <Input
                  name="name"
                  label="Full Name"
                  placeholder="Jane Doe"
                  error={methods.formState.errors.name?.message}
                />
                <Input
                  name="email"
                  label="Email address"
                  type="email"
                  placeholder="name@company.com"
                  error={methods.formState.errors.email?.message}
                />
                <Input
                  name="mobile"
                  label="Mobile Number"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  error={methods.formState.errors.mobile?.message}
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
                  Create Account
                </Button>
              </form>
            </FormProvider>

            <p className="text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <a href="/login" className="text-zinc-900 font-semibold hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </GuestGuard>
  );
}
