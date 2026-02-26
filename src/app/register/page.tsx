"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { Droplets, Eye, EyeOff, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "DONOR",
        phone: "",
        bloodType: "O+",
        hospitalName: "",
    });

    useEffect(() => {
        const role = searchParams.get("role");
        if (role === "hospital") {
            setForm((f) => ({ ...f, role: "HOSPITAL" }));
        }
    }, [searchParams]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Registration failed");
                return;
            }

            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));

            if (data.user.role === "HOSPITAL") {
                router.push("/dashboard/hospital");
            } else {
                router.push("/dashboard/donor");
            }
        } catch {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="glass">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl">Create Account</CardTitle>
                <CardDescription>
                    {form.role === "HOSPITAL" ? "Register your hospital" : "Join as a blood donor"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    {/* Role toggle */}
                    <div className="flex gap-2 p-1 rounded-lg bg-muted">
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, role: "DONOR" })}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${form.role === "DONOR" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Donor
                        </button>
                        <button
                            type="button"
                            onClick={() => setForm({ ...form, role: "HOSPITAL" })}
                            className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${form.role === "HOSPITAL" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                            Hospital
                        </button>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name">{form.role === "HOSPITAL" ? "Contact Name" : "Full Name"}</Label>
                        <Input
                            id="name"
                            placeholder="John Doe"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            required
                        />
                    </div>

                    {form.role === "HOSPITAL" && (
                        <div className="space-y-2">
                            <Label htmlFor="hospitalName">Hospital Name</Label>
                            <Input
                                id="hospitalName"
                                placeholder="City General Hospital"
                                value={form.hospitalName}
                                onChange={(e) => setForm({ ...form, hospitalName: e.target.value })}
                                required
                            />
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="+1 (555) 123-4567"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                    </div>

                    {form.role === "DONOR" && (
                        <div className="space-y-2">
                            <Label>Blood Type</Label>
                            <Select
                                value={form.bloodType}
                                onValueChange={(value) => setForm({ ...form, bloodType: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {BLOOD_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>{type}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={form.password}
                                onChange={(e) => setForm({ ...form, password: e.target.value })}
                                required
                                minLength={6}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Creating account..." : "Create Account"}
                        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
                    </Button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    Already have an account?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Sign In
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden py-12">
            {/* Background effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/3 right-1/4 w-60 h-60 bg-secondary/15 rounded-full blur-[100px]" />
            </div>

            <motion.div
                className="relative z-10 w-full max-w-md px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div className="text-center mb-8">
                    <Link href="/" className="inline-flex items-center gap-2 mb-6">
                        <Droplets className="h-8 w-8 text-primary" />
                        <span className="text-2xl font-bold">Life<span className="text-primary">Flow</span></span>
                    </Link>
                </div>

                <Suspense fallback={<div>Loading...</div>}>
                    <RegisterForm />
                </Suspense>
            </motion.div>
        </div>
    );
}
