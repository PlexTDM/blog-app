"use client";

import { useEffect, useState } from "react";
import { Container, Typography, TextField, Button, Box } from "@mui/material";
import { toast } from "react-toastify";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import GoogleSignInButton from "@/components/googleSignup";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(true);

  const router = useRouter();

  useEffect(() => {
    setTimeout(() => {
      setDisabled(false);
    }, 100);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        callbackUrl: "/",
        redirect: false,
      });
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Logged in successfully");
        router.push("/");
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "login error hhe");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <Box
          component="form"
          autoComplete="on"
          onSubmit={handleSubmit}
          sx={{ mt: 3 }}
        >
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
            value={email}
            disabled={disabled}
            onChange={(e) => setEmail(e.target.value)}
          />
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
          <Typography variant="body2" align="center">
            Don&apos;t have an account?{" "}
            <Link href="/register" passHref>
              <Button variant="text">Register</Button>
            </Link>
          </Typography>
        </Box>
        <div className="relative w-full flex justify-center items-center text-sm">
          <div className="w-full border-t border-gray-600" />
          <span className="px-2 text-nowrap">Or continue with</span>
          <div className="w-full border-t border-gray-600" />
        </div>

        <div className="mt-6">
          <GoogleSignInButton />
        </div>
      </Box>
    </Container>
  );
}
