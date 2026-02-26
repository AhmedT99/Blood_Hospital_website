"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Droplets, Heart, Calendar, Clock, LogOut, Plus, History, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface UserData {
    id: string;
    name: string;
    email: string;
    role: string;
    donorProfile?: {
        bloodType: string;
        totalDonations: number;
        isEligible: boolean;
        lastDonation: string | null;
    };
    appointments?: Appointment[];
}

interface Appointment {
    id: string;
    date: string;
    time: string;
    location: string;
    status: string;
    notes?: string;
    bloodType?: string;
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    CONFIRMED: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    COMPLETED: "bg-green-500/20 text-green-400 border-green-500/30",
    CANCELLED: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function DonorDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<UserData | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showNewAppt, setShowNewAppt] = useState(false);
    const [apptForm, setApptForm] = useState({
        date: "",
        time: "",
        location: "",
        notes: "",
        bloodType: "O+",
    });

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const fetchData = useCallback(async () => {
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const [userRes, apptRes] = await Promise.all([
                fetch("/api/user", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/appointments", { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (!userRes.ok) {
                router.push("/login");
                return;
            }

            const userData = await userRes.json();
            const apptData = await apptRes.json();

            setUser(userData);
            setAppointments(Array.isArray(apptData) ? apptData : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleNewAppointment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            const res = await fetch("/api/appointments", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(apptForm),
            });

            if (res.ok) {
                setShowNewAppt(false);
                setApptForm({ date: "", time: "", location: "", notes: "", bloodType: "O+" });
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <Droplets className="h-12 w-12 text-primary animate-bounce" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Sidebar / Header */}
            <nav className="fixed top-0 w-full z-50 glass">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Droplets className="h-7 w-7 text-primary" />
                        <span className="text-lg font-bold">Life<span className="text-primary">Flow</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium hidden sm:inline">{user?.name}</span>
                            {user?.donorProfile && (
                                <Badge variant="outline" className="text-primary border-primary/30">{user.donorProfile.bloodType}</Badge>
                            )}
                        </div>
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-24 pb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <h1 className="text-3xl font-bold mb-2">
                        Welcome back, <span className="text-primary">{user?.name?.split(" ")[0]}</span>
                    </h1>
                    <p className="text-muted-foreground mb-8">Here&apos;s your donation dashboard overview.</p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <Card className="glass hover:border-primary/50 transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-primary/10">
                                        <Heart className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{user?.donorProfile?.totalDonations || 0}</p>
                                        <p className="text-sm text-muted-foreground">Total Donations</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass hover:border-primary/50 transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-green-500/10">
                                        <Calendar className="h-6 w-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{appointments.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED").length}</p>
                                        <p className="text-sm text-muted-foreground">Upcoming</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass hover:border-primary/50 transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-blue-500/10">
                                        <Droplets className="h-6 w-6 text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{user?.donorProfile?.isEligible ? "Yes" : "No"}</p>
                                        <p className="text-sm text-muted-foreground">Eligible to Donate</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="appointments" className="space-y-6">
                        <TabsList className="glass">
                            <TabsTrigger value="appointments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Calendar className="h-4 w-4 mr-2" /> Appointments
                            </TabsTrigger>
                            <TabsTrigger value="history" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <History className="h-4 w-4 mr-2" /> History
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="appointments" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Your Appointments</h2>
                                <Button onClick={() => setShowNewAppt(true)} size="sm">
                                    <Plus className="h-4 w-4 mr-2" /> Schedule Donation
                                </Button>
                            </div>

                            {showNewAppt && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                    <Card className="glass">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Schedule New Donation</CardTitle>
                                            <CardDescription>Fill in the details for your next blood donation.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleNewAppointment} className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Date</Label>
                                                    <Input
                                                        type="date"
                                                        value={apptForm.date}
                                                        onChange={(e) => setApptForm({ ...apptForm, date: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Time</Label>
                                                    <Input
                                                        type="time"
                                                        value={apptForm.time}
                                                        onChange={(e) => setApptForm({ ...apptForm, time: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Location</Label>
                                                    <Input
                                                        placeholder="City Hospital, Room 101"
                                                        value={apptForm.location}
                                                        onChange={(e) => setApptForm({ ...apptForm, location: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Blood Type</Label>
                                                    <Select value={apptForm.bloodType} onValueChange={(v) => setApptForm({ ...apptForm, bloodType: v })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {BLOOD_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="sm:col-span-2 space-y-2">
                                                    <Label>Notes (optional)</Label>
                                                    <Textarea
                                                        placeholder="Any additional information..."
                                                        value={apptForm.notes}
                                                        onChange={(e) => setApptForm({ ...apptForm, notes: e.target.value })}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2 flex gap-3 justify-end">
                                                    <Button type="button" variant="outline" onClick={() => setShowNewAppt(false)}>Cancel</Button>
                                                    <Button type="submit">Schedule</Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {appointments.filter((a) => a.status === "PENDING" || a.status === "CONFIRMED").length === 0 ? (
                                <Card className="glass">
                                    <CardContent className="py-12 text-center">
                                        <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No upcoming appointments. Schedule one to get started!</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {appointments
                                        .filter((a) => a.status === "PENDING" || a.status === "CONFIRMED")
                                        .map((appt) => (
                                            <Card key={appt.id} className="glass hover:border-primary/30 transition-all">
                                                <CardContent className="py-4 flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="p-2 rounded-lg bg-primary/10">
                                                            <Clock className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <div>
                                                            <p className="font-medium">{appt.location}</p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {new Date(appt.date).toLocaleDateString()} at {appt.time}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Badge className={statusColors[appt.status]}>{appt.status}</Badge>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="history" className="space-y-4">
                            <h2 className="text-xl font-semibold">Donation History</h2>
                            <Separator />
                            {appointments.filter((a) => a.status === "COMPLETED" || a.status === "CANCELLED").length === 0 ? (
                                <Card className="glass">
                                    <CardContent className="py-12 text-center">
                                        <History className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No donation history yet. Complete your first donation!</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {appointments
                                        .filter((a) => a.status === "COMPLETED" || a.status === "CANCELLED")
                                        .map((appt) => (
                                            <Card key={appt.id} className="glass">
                                                <CardContent className="py-4 flex items-center justify-between">
                                                    <div>
                                                        <p className="font-medium">{appt.location}</p>
                                                        <p className="text-sm text-muted-foreground">{new Date(appt.date).toLocaleDateString()}</p>
                                                    </div>
                                                    <Badge className={statusColors[appt.status]}>{appt.status}</Badge>
                                                </CardContent>
                                            </Card>
                                        ))}
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </main>
        </div>
    );
}
