"use client";

import { GoogleSignInButton } from "@/components/googleSignup";
import { Box, Button, TextField, Typography } from "@mui/material";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function RegisterPage() {
  const [disabled, setDisabled] = useState(true);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setDisabled(false);
    }, 1000);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { email, password } = formData;
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.data) {
        const res = await signIn("credentials", {
          email: email,
          password: password,
          redirect: false,
        });
        if (res?.error) {
          toast.error(res.error);
        }

        toast.success("Registration successful");
        router.push("/");
      }
    } catch (err) {
      console.log("register front error", err);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-4 rounded-lg p-8 shadow-md">
        <div className="text-center">
          <h1 className="text-2xl">Create an account</h1>
          <p className="mt-2 text-sm">Get started with your free account</p>
        </div>

        <Box
          component="form"
          autoComplete="on"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
          <Box component="div" className="flex gap-4">
            <TextField
              margin="normal"
              color={"secondary"}
              required
              fullWidth
              label="First Name"
              name="firstName"
              autoComplete="firstName"
              value={formData.firstName}
              disabled={disabled}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              color={"secondary"}
              fullWidth
              label="Last Name"
              name="lastName"
              autoComplete="lastName"
              value={formData.lastName}
              disabled={disabled}
              onChange={handleChange}
            />
          </Box>
          <TextField
            margin="normal"
            color={"secondary"}
            type="email"
            required
            autoFocus={false}
            fullWidth
            label="Email Address"
            name="email"
            autoComplete="email"
            value={formData.email}
            disabled={disabled}
            onChange={handleChange}
          />
          <Box component="div" className="flex gap-4">
            <TextField
              margin="normal"
              color={"secondary"}
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              autoComplete="current-password"
              disabled={disabled}
              value={formData.password}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              color={"secondary"}
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type="password"
              autoComplete="current-password"
              disabled={disabled}
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </Box>
          <Button type="submit" fullWidth variant="contained" sx={{ my: 2 }}>
            Login
          </Button>
          <Typography variant="body2" align="center">
            Already have an account?{" "}
            <Link href="/login">
              <Button variant="text">Login</Button>
            </Link>
          </Typography>
        </Box>

        <div className="relative flex justify-center items-center text-sm">
          <div className="w-full border-t border-gray-600" />
          <span className="px-2 text-nowrap">Or continue with</span>
          <div className="w-full border-t border-gray-600" />
        </div>

        <div className="mt-6">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  );
}
