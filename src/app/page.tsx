"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  ChartNoAxesColumnIncreasing,
  Globe2,
  MessageCircle,
  MessageSquare,
  Radio,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "DM keyword replies",
    description:
      "Trigger instant message responses when followers ask for links, pricing, or support.",
    icon: MessageSquare,
  },
  {
    title: "Comment automation",
    description:
      "Reply to comments publicly or turn high-intent comments into private conversations.",
    icon: MessageCircle,
  },
  {
    title: "Post-specific rules",
    description:
      "Attach automations to individual Instagram posts or keep them global across your account.",
    icon: Globe2,
  },
  {
    title: "Link delivery",
    description:
      "Send anchor text and URLs with replies so campaigns stay measurable and easy to act on.",
    icon: Zap,
  },
  {
    title: "Simple rule control",
    description:
      "Pause, edit, and manage automations from a responsive dashboard built for quick changes.",
    icon: ShieldCheck,
  },
  {
    title: "Creator-ready workflow",
    description:
      "Keep launches, lead magnets, and support replies moving without babysitting every thread.",
    icon: ChartNoAxesColumnIncreasing,
  },
];

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();
  const isAuthenticated = status === "authenticated";

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push("/dashboard");
      return;
    }

    signIn("instagram", { callbackUrl: "/dashboard" });
  };

  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg border bg-card">
              <Image
                src="/insta.svg"
                alt="Instagram"
                width={26}
                height={26}
                className="size-6"
              />
            </div>
            <span className="truncate text-lg font-semibold tracking-tight">
              InstaAutomate
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleGetStarted}>
            {isAuthenticated ? "Dashboard" : "Get Started"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </header>

      <section className="border-b">
        <div className="mx-auto grid min-h-[calc(100vh-73px)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)] lg:px-8 lg:py-16">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Radio className="size-3.5 text-primary" />
              Instagram automation for creators and teams
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
              Turn comments and DMs into automatic conversations.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Build lightweight Instagram rules that answer keywords, share
              links, and route followers from comments into DMs without leaving
              your dashboard.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={handleGetStarted}>
                <Image
                  src="/insta.svg"
                  alt=""
                  width={22}
                  height={22}
                  className="size-5"
                />
                {isAuthenticated
                  ? "Open Dashboard"
                  : "Get Started with Instagram"}
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  document
                    .getElementById("features")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                View Features
              </Button>
            </div>
            <div className="mt-8 grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" />
                No-code rules
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" />
                DM and comments
              </div>
              <div className="flex items-center gap-2">
                <BadgeCheck className="size-4 text-primary" />
                Mobile-ready
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="rounded-lg border bg-card p-4 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3 border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Bot className="size-5" />
                  </div>
                  <div>
                    <p className="font-medium">Automation rule</p>
                    <p className="text-xs text-muted-foreground">
                      Trigger: "send link"
                    </p>
                  </div>
                </div>
                <span className="rounded-md border border-primary/20 bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                  Active
                </span>
              </div>
              <div className="grid gap-3">
                <div className="rounded-md border bg-muted/35 p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Incoming comment
                  </p>
                  <p className="mt-2 text-sm">
                    Can you send the product link?
                  </p>
                </div>
                <div className="rounded-md border bg-background p-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Automatic reply
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    Absolutely. Check your DMs for the link and details.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-md border bg-muted/35 p-3">
                    <p className="text-xs text-muted-foreground">Rules</p>
                    <p className="mt-1 text-2xl font-semibold">24</p>
                  </div>
                  <div className="rounded-md border bg-muted/35 p-3">
                    <p className="text-xs text-muted-foreground">Active</p>
                    <p className="mt-1 text-2xl font-semibold">21</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-8 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            Built for everyday Instagram workflows
          </div>
          <h2 className="text-3xl font-semibold tracking-tight">
            Everything you need to automate first responses.
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted-foreground sm:text-base">
            Start with simple trigger words, then refine your automations as
            your posts, offers, and audience grow.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <Card key={feature.title} className="rounded-lg">
                <CardHeader className="gap-3">
                  <div className="w-fit rounded-md bg-primary/10 p-2 text-primary">
                    <Icon className="size-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{feature.title}</CardTitle>
                    <CardDescription className="mt-2 leading-6">
                      {feature.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="border-t">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-start justify-between gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center lg:px-8">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              Ready to automate your next reply?
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Connect Instagram and start building rules from your dashboard.
            </p>
          </div>
          <Button size="lg" onClick={handleGetStarted} className="w-full md:w-auto">
            <Image
              src="/insta.svg"
              alt=""
              width={22}
              height={22}
              className="size-5"
            />
            {isAuthenticated ? "Open Dashboard" : "Get Started with Instagram"}
          </Button>
        </div>
      </section>
    </main>
  );
}
