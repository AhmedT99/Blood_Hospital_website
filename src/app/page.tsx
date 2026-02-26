"use client";

import { motion } from "framer-motion";
import { Heart, Droplets, Building2, Users, ArrowRight, Shield, Clock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const stats = [
  { value: "10K+", label: "Lives Saved", icon: Heart },
  { value: "5K+", label: "Active Donors", icon: Users },
  { value: "200+", label: "Partner Hospitals", icon: Building2 },
  { value: "8", label: "Blood Types Tracked", icon: Droplets },
];

const features = [
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your health data is encrypted and protected with enterprise-grade security.",
  },
  {
    icon: Clock,
    title: "Real-Time Tracking",
    description: "Monitor blood inventory levels and appointment statuses in real time.",
  },
  {
    icon: Globe,
    title: "Connected Network",
    description: "Join a vast network of donors and hospitals working together to save lives.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Droplets className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold tracking-tight">
              Life<span className="text-primary">Flow</span>
            </span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Features</Link>
            <Link href="#stats" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Impact</Link>
            <Link href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button size="sm" className="bg-primary hover:bg-primary/90">
                Get Started <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20">
        {/* Background Glow Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] animate-float" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-secondary/20 rounded-full blur-[128px] animate-float" style={{ animationDelay: "-3s" }} />
        </div>

        <motion.div
          className="relative z-10 max-w-5xl mx-auto px-6 text-center"
          initial="initial"
          animate="animate"
          variants={staggerContainer}
        >
          <motion.div variants={fadeInUp}>
            <span className="inline-block px-4 py-1.5 mb-6 text-xs font-medium tracking-wider uppercase rounded-full bg-primary/10 text-primary border border-primary/20">
              🩸 Saving Lives Together
            </span>
          </motion.div>

          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight"
            variants={fadeInUp}
          >
            Every Drop{" "}
            <span className="text-primary">
              Counts
            </span>
            <br />
            <span className="text-muted-foreground text-3xl md:text-5xl font-light">
              Your donation saves lives
            </span>
          </motion.h1>

          <motion.p
            className="max-w-2xl mx-auto text-lg text-muted-foreground mb-10"
            variants={fadeInUp}
          >
            LifeFlow connects blood donors with hospitals and patients in need.
            Schedule donations, track your impact, and become a hero in your community.
          </motion.p>

          <motion.div className="flex flex-col sm:flex-row gap-4 justify-center" variants={fadeInUp}>
            <Link href="/register">
              <Button size="lg" className="text-base px-8 py-6 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25">
                Become a Donor <Heart className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/register?role=hospital">
              <Button size="lg" variant="outline" className="text-base px-8 py-6">
                Register Hospital <Building2 className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {stats.map((stat) => (
              <motion.div key={stat.label} variants={fadeInUp}>
                <Card className="glass text-center py-8 hover:border-primary/50 transition-all duration-300 hover:shadow-lg hover:shadow-primary/10">
                  <CardContent>
                    <stat.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                    <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Why Choose <span className="text-primary">LifeFlow</span>?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              A modern platform designed to make blood donation simple, safe, and impactful.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {features.map((feature) => (
              <motion.div key={feature.title} variants={fadeInUp}>
                <Card className="glass h-full hover:border-primary/50 transition-all duration-300 group hover:shadow-lg hover:shadow-primary/10">
                  <CardContent className="p-8">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* About / CTA Section */}
      <section id="about" className="py-24 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[200px]" />
        </div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Ready to Make a <span className="text-primary">Difference</span>?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Join thousands of donors and hospitals already using LifeFlow.
              Every donation matters — start today.
            </p>
            <Link href="/register">
              <Button size="lg" className="text-base px-10 py-6 bg-primary hover:bg-primary/90 shadow-xl shadow-primary/25">
                Join LifeFlow Today <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Droplets className="h-6 w-6 text-primary" />
              <span className="font-bold">LifeFlow</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 LifeFlow. All rights reserved. Saving lives, one drop at a time.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
