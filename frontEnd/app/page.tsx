"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";


const FeatureCard = ({ feature }: { feature: { title: string; description: string; icon: string } }) => {
  return (
    <Card className="p-6 backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all duration-300 border-2">
      <div className="text-4xl mb-4">{feature.icon}</div>
      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
      <p className="text-muted-foreground">{feature.description}</p>
    </Card>
  );
};


const features = [
  {
    title: "AI Dream Analysis",
    description: "Advanced algorithms analyze your dreams for deeper psychological insights",
    icon: "💭",
  },
  {
    title: "Dream Patterns",
    description: "Discover recurring themes and symbols in your dream journal",
    icon: "🔍",
  },
  {
    title: "Visual Dreams",
    description: "Transform written dreams into stunning AI-generated artwork",
    icon: "🎨",
  },
  {
    title: "Dream Sharing",
    description: "Share your dreams with friends and family for collaborative analysis",
    icon: "💬",
  },
];

export default function Home() {
  const router = useRouter();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-violet-100 to-purple-100 dark:from-blue-950 dark:via-violet-950 dark:to-purple-950">
      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-24 pb-12 sm:pt-32 sm:pb-16">
        <div className="mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 mb-6">
              LucidLens
            </h1>
            <p className="text-xl leading-8 text-muted-foreground mb-10 max-w-2xl mx-auto">
              Experience the future of dream exploration with AI-powered analysis and stunning visual representations of your subconscious mind.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="text-lg px-8 py-6"
                onClick={() => router.push('/create')}
              >
                Start Your Journey <ArrowRight className="ml-2" />
              </Button>
              {/* <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                Watch Demo
              </Button> */}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-6 lg:px-8">
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mx-auto max-w-7xl"
        >
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <motion.div key={feature.title} variants={item}>
                <FeatureCard feature={feature} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-7xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">10+</div>
              <div className="text-muted-foreground">Dreams Analyzed</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">1+</div>
              <div className="text-muted-foreground">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">100%</div>
              <div className="text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/0</div>
              <div className="text-muted-foreground">Human Support</div>
            </div>
          </div>
        </motion.div>
      </section>


      {/* CTA Section */}
      <section className="py-16 px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-3xl text-center"
        >
          <Card className="p-12 backdrop-blur-sm bg-background/50 border-2">
            <h2 className="text-3xl font-bold mb-4">Begin Your Dream Journey Today</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of dreamers who have already discovered new dimensions of their subconscious mind.
            </p>
            <Button size="lg" className="text-lg px-8 py-6">
              Get Started Now <ArrowRight className="ml-2" />
            </Button>
          </Card>
        </motion.div>
      </section>
    </div>
  );
}