import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import AuthImage from "@/components/AuthImage";

const registerSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  name: z.string().min(3, "Name must be at least 3 characters long"),
});

const RegisterPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Destructure useForm as you prefer
  const { register, handleSubmit, control, formState, ...methods } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const { errors } = formState;

  const form = {
    register,
    handleSubmit,
    control,
    formState,
    ...methods,
  };

  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    try {
      setIsLoading(true);
      console.log(data);
      // Add your registration logic here
      // Example: await registerUser(data);
    } catch (error) {
      console.error("Registration failed:", error);
      // Handle error (show toast, etc.)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-600 mt-2">Sign up to get started</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your full name"
                        disabled={isLoading}
                        className={
                          errors.name
                            ? "border-red-500 focus:border-red-500"
                            : ""
                        }
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type="email"
                          placeholder="Enter your email address"
                          className={`pl-10 ${
                            errors.email
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          disabled={isLoading}
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          className={`pl-10 pr-10 ${
                            errors.password
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          disabled={isLoading}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                          disabled={isLoading}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-600 text-sm mt-1" />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* <div className="hidden lg:flex border-l-2 border-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center">
        <div className="text-center max-w-md px-8">
          <div className="bg-white rounded-full p-6 shadow-lg mb-6 inline-block">
            <Code className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Welcome to Our Platform
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Join thousands of developers building amazing applications with our
            tools and resources.
          </p>
        </div>
      </div> */}

      <AuthImage
        title="Welcome To Our Pla tform"
        description="Join thousands of developers building amazing applications with our
            tools and resources."
      />
    </div>
  );
};

export default RegisterPage;
