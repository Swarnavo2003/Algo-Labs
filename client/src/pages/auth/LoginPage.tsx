import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock, Mail } from "lucide-react";
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
import { useAuthStore } from "@/store/useAuthStore";
import { loginSchema, type LoginSchemaTypes } from "@/types";

// const loginSchema = z.object({
//   email: z.string().email("Enter a valid email"),
//   password: z.string().min(6, "Password must be at least 6 characters long"),
// });

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const { isLoggingIn, loginUser } = useAuthStore();
  const navigate = useNavigate();

  // Destructure useForm as you prefer
  const { register, handleSubmit, control, formState, ...methods } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { errors } = formState;

  const form = {
    register,
    handleSubmit,
    control,
    formState, // This should be the complete formState object
    ...methods,
  };

  const onSubmit = async (data: LoginSchemaTypes) => {
    try {
      loginUser(data);
      navigate("/");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* <div className="hidden lg:flex border-l-2 border-gray-50 bg-gradient-to-br from-blue-50 to-indigo-100 items-center justify-center">
        <div className="text-center max-w-md px-8">
          <div className="bg-white rounded-full p-6 shadow-lg mb-6 inline-block">
            <Code className="h-12 w-12 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            Welcome back Our Platform
          </h2>
          <p className="text-gray-600 leading-relaxed">
            Join thousands of developers building amazing applications with our
            tools and resources.
          </p>
        </div>
      </div> */}
      <AuthImage
        title="Welcome Back"
        description="Join thousands of developers building amazing applications with our
            tools and resources."
      />

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold tracking-tight">
              Welcome Back Coder
            </h1>
            <p className="text-gray-600 mt-2">Sign in to get started</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          disabled={isLoggingIn}
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
                          placeholder="Enter your password"
                          className={`pl-10 pr-10 ${
                            errors.password
                              ? "border-red-500 focus:border-red-500"
                              : ""
                          }`}
                          disabled={isLoggingIn}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                          disabled={isLoggingIn}
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

              <Button type="submit" className="w-full" disabled={isLoggingIn}>
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Please Wait...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
