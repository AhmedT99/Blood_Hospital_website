"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Droplets, Building2, LogOut, Plus, User, Package, AlertTriangle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface InventoryItem {
    id: string;
    bloodType: string;
    units: number;
    status: string;
}

interface BloodRequest {
    id: string;
    bloodType: string;
    units: number;
    urgency: string;
    status: string;
    reason?: string;
    createdAt: string;
}

const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const statusColors: Record<string, string> = {
    AVAILABLE: "bg-green-500/20 text-green-400 border-green-500/30",
    LOW: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
    EXPIRED: "bg-gray-500/20 text-gray-400 border-gray-500/30",
};

const urgencyColors: Record<string, string> = {
    LOW: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    NORMAL: "bg-green-500/20 text-green-400 border-green-500/30",
    HIGH: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    CRITICAL: "bg-red-500/20 text-red-400 border-red-500/30",
};

export default function HospitalDashboard() {
    const router = useRouter();
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [requests, setRequests] = useState<BloodRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [userName, setUserName] = useState("");
    const [showAddInventory, setShowAddInventory] = useState(false);
    const [showNewRequest, setShowNewRequest] = useState(false);
    const [invForm, setInvForm] = useState({ bloodType: "A+", units: "" });
    const [reqForm, setReqForm] = useState({ bloodType: "O+", units: "", urgency: "NORMAL", reason: "" });

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

    const fetchData = useCallback(async () => {
        if (!token) {
            router.push("/login");
            return;
        }

        try {
            const stored = localStorage.getItem("user");
            if (stored) {
                const parsed = JSON.parse(stored);
                setUserName(parsed.name || "");
            }

            const [invRes, reqRes] = await Promise.all([
                fetch("/api/inventory", { headers: { Authorization: `Bearer ${token}` } }),
                fetch("/api/requests", { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            if (!invRes.ok) {
                router.push("/login");
                return;
            }

            const invData = await invRes.json();
            const reqData = await reqRes.json();

            setInventory(Array.isArray(invData) ? invData : []);
            setRequests(Array.isArray(reqData) ? reqData : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [token, router]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAddInventory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            const res = await fetch("/api/inventory", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ bloodType: invForm.bloodType, units: parseInt(invForm.units) }),
            });
            if (res.ok) {
                setShowAddInventory(false);
                setInvForm({ bloodType: "A+", units: "" });
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleNewRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return;

        try {
            const res = await fetch("/api/requests", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...reqForm, units: parseInt(reqForm.units) }),
            });
            if (res.ok) {
                setShowNewRequest(false);
                setReqForm({ bloodType: "O+", units: "", urgency: "NORMAL", reason: "" });
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

    const totalUnits = inventory.reduce((sum, item) => sum + item.units, 0);
    const criticalTypes = inventory.filter((item) => item.status === "CRITICAL" || item.status === "LOW").length;

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <Building2 className="h-12 w-12 text-primary animate-bounce" />
                    <p className="text-muted-foreground">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 glass">
                <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2">
                        <Droplets className="h-7 w-7 text-primary" />
                        <span className="text-lg font-bold">Life<span className="text-primary">Flow</span></span>
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="text-sm font-medium hidden sm:inline">{userName}</span>
                            <Badge variant="outline" className="text-primary border-primary/30">Hospital</Badge>
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
                        Hospital <span className="text-primary">Dashboard</span>
                    </h1>
                    <p className="text-muted-foreground mb-8">Manage your blood inventory and requests.</p>

                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                        <Card className="glass hover:border-primary/50 transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-primary/10">
                                        <Package className="h-6 w-6 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{totalUnits}</p>
                                        <p className="text-sm text-muted-foreground">Total Units</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass hover:border-primary/50 transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-yellow-500/10">
                                        <AlertTriangle className="h-6 w-6 text-yellow-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{criticalTypes}</p>
                                        <p className="text-sm text-muted-foreground">Low/Critical Types</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                        <Card className="glass hover:border-primary/50 transition-all">
                            <CardContent className="pt-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 rounded-xl bg-green-500/10">
                                        <CheckCircle className="h-6 w-6 text-green-400" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{requests.length}</p>
                                        <p className="text-sm text-muted-foreground">Total Requests</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Tabs */}
                    <Tabs defaultValue="inventory" className="space-y-6">
                        <TabsList className="glass">
                            <TabsTrigger value="inventory" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Droplets className="h-4 w-4 mr-2" /> Inventory
                            </TabsTrigger>
                            <TabsTrigger value="requests" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                                <Package className="h-4 w-4 mr-2" /> Requests
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="inventory" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Blood Inventory</h2>
                                <Button onClick={() => setShowAddInventory(true)} size="sm">
                                    <Plus className="h-4 w-4 mr-2" /> Update Stock
                                </Button>
                            </div>

                            {showAddInventory && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                    <Card className="glass">
                                        <CardHeader>
                                            <CardTitle className="text-lg">Update Blood Stock</CardTitle>
                                            <CardDescription>Update the units for a specific blood type.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleAddInventory} className="flex gap-4 items-end flex-wrap">
                                                <div className="space-y-2">
                                                    <Label>Blood Type</Label>
                                                    <Select value={invForm.bloodType} onValueChange={(v) => setInvForm({ ...invForm, bloodType: v })}>
                                                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {BLOOD_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Units</Label>
                                                    <Input
                                                        type="number"
                                                        min="0"
                                                        placeholder="10"
                                                        value={invForm.units}
                                                        onChange={(e) => setInvForm({ ...invForm, units: e.target.value })}
                                                        className="w-32"
                                                        required
                                                    />
                                                </div>
                                                <Button type="submit">Save</Button>
                                                <Button type="button" variant="outline" onClick={() => setShowAddInventory(false)}>Cancel</Button>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {inventory.length === 0 ? (
                                <Card className="glass">
                                    <CardContent className="py-12 text-center">
                                        <Droplets className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No inventory data. Add your first blood stock entry.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                    {inventory.map((item) => (
                                        <Card key={item.id} className="glass hover:border-primary/30 transition-all">
                                            <CardContent className="pt-6 text-center">
                                                <p className="text-3xl font-bold text-primary mb-1">{item.bloodType}</p>
                                                <p className="text-2xl font-semibold">{item.units}</p>
                                                <p className="text-xs text-muted-foreground mb-2">units</p>
                                                <Badge className={statusColors[item.status]}>{item.status}</Badge>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="requests" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">Blood Requests</h2>
                                <Button onClick={() => setShowNewRequest(true)} size="sm">
                                    <Plus className="h-4 w-4 mr-2" /> New Request
                                </Button>
                            </div>

                            {showNewRequest && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}>
                                    <Card className="glass">
                                        <CardHeader>
                                            <CardTitle className="text-lg">New Blood Request</CardTitle>
                                            <CardDescription>Request blood units from the network.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <form onSubmit={handleNewRequest} className="grid gap-4 sm:grid-cols-2">
                                                <div className="space-y-2">
                                                    <Label>Blood Type</Label>
                                                    <Select value={reqForm.bloodType} onValueChange={(v) => setReqForm({ ...reqForm, bloodType: v })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            {BLOOD_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Units Needed</Label>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="5"
                                                        value={reqForm.units}
                                                        onChange={(e) => setReqForm({ ...reqForm, units: e.target.value })}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Urgency</Label>
                                                    <Select value={reqForm.urgency} onValueChange={(v) => setReqForm({ ...reqForm, urgency: v })}>
                                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="LOW">Low</SelectItem>
                                                            <SelectItem value="NORMAL">Normal</SelectItem>
                                                            <SelectItem value="HIGH">High</SelectItem>
                                                            <SelectItem value="CRITICAL">Critical</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label>Reason</Label>
                                                    <Input
                                                        placeholder="Surgery, emergency, etc."
                                                        value={reqForm.reason}
                                                        onChange={(e) => setReqForm({ ...reqForm, reason: e.target.value })}
                                                    />
                                                </div>
                                                <div className="sm:col-span-2 flex gap-3 justify-end">
                                                    <Button type="button" variant="outline" onClick={() => setShowNewRequest(false)}>Cancel</Button>
                                                    <Button type="submit">Submit Request</Button>
                                                </div>
                                            </form>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            )}

                            {requests.length === 0 ? (
                                <Card className="glass">
                                    <CardContent className="py-12 text-center">
                                        <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                        <p className="text-muted-foreground">No blood requests yet.</p>
                                    </CardContent>
                                </Card>
                            ) : (
                                <div className="space-y-3">
                                    {requests.map((req) => (
                                        <Card key={req.id} className="glass hover:border-primary/30 transition-all">
                                            <CardContent className="py-4 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="text-center">
                                                        <p className="text-lg font-bold text-primary">{req.bloodType}</p>
                                                        <p className="text-xs text-muted-foreground">{req.units} units</p>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{req.reason || "Blood Request"}</p>
                                                        <p className="text-sm text-muted-foreground">{new Date(req.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Badge className={urgencyColors[req.urgency]}>{req.urgency}</Badge>
                                                    <Badge variant="outline">{req.status}</Badge>
                                                </div>
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
