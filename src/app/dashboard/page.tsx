"use client";

import AutomationRuleForm from "@/components/AutomationRuleForm";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  AutomationRule,
  useCreateAutomationMutation,
  useDeleteAutomationMutation,
  useGetAutomationsQuery,
  useGetPostsQuery,
  useUpdateAutomationMutation,
} from "@/lib/slices/apiSlice";
import {
  AutomationRuleInput,
  automationRuleSchema,
} from "@/lib/schemas/automationRuleSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BadgeCheck,
  Bot,
  ExternalLink,
  Globe2,
  Loader2,
  LockKeyhole,
  LogOut,
  MessageCircle,
  MessageSquare,
  Pencil,
  Plus,
  Radio,
  Trash2,
  Zap,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const defaultRuleValues: z.infer<typeof automationRuleSchema> = {
  triggerType: "message",
  triggerWord: "",
  replyText: "",
  isActive: true,
  postId: null,
  linkText: "",
  linkUrl: "",
};

export default function DashboardPage() {
  const session = useSession();
  const { data: posts = [] } = useGetPostsQuery();
  const {
    data: automations = [],
    isLoading,
    refetch,
  } = useGetAutomationsQuery();
  const [createAutomation, { isLoading: isCreating }] =
    useCreateAutomationMutation();
  const [updateAutomation, { isLoading: isUpdating }] =
    useUpdateAutomationMutation();
  const [deleteAutomation, { isLoading: isDeleting }] =
    useDeleteAutomationMutation();

  const [editing, setEditing] = useState<AutomationRule | null>(null);
  const [isRuleSheetOpen, setIsRuleSheetOpen] = useState(false);

  const form = useForm<z.infer<typeof automationRuleSchema>>({
    resolver: zodResolver(automationRuleSchema),
    defaultValues: defaultRuleValues,
    mode: "onChange",
  });

  const activeCount = automations.filter((rule) => rule.isActive).length;
  const messageCount = automations.filter(
    (rule) => rule.triggerType === "message",
  ).length;

  const onSubmit = async (values: AutomationRuleInput) => {
    const payload = {
      ...values,
      linkText: values.linkText?.trim() ? values.linkText : undefined,
      linkUrl: values.linkUrl?.trim() ? values.linkUrl : undefined,
    } as AutomationRuleInput;

    if (editing) {
      await updateAutomation({ id: editing.id, data: payload });
    } else {
      toast.loading("Creating automation rule...");
      await createAutomation(payload);
    }

    setEditing(null);
    setIsRuleSheetOpen(false);
    form.reset(defaultRuleValues);
    refetch();
    toast.success("Automation rule saved successfully");
  };

  const handleCreate = () => {
    setEditing(null);
    form.reset(defaultRuleValues);
    setIsRuleSheetOpen(true);
  };

  const handleEdit = (rule: AutomationRule) => {
    setEditing(rule);
    form.reset({
      triggerType: rule.triggerType,
      triggerWord: rule.triggerWord,
      replyText: rule.replyText,
      isActive: rule.isActive,
      postId: rule.postId ?? null,
      linkText: rule.linkText ?? "",
      linkUrl: rule.linkUrl ?? "",
    });
    setIsRuleSheetOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteAutomation(id);
    if (editing?.id === id) {
      setEditing(null);
    }
    refetch();
  };

  const handleSheetOpenChange = (open: boolean) => {
    setIsRuleSheetOpen(open);
    if (!open) {
      setEditing(null);
      form.reset(defaultRuleValues);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6">
        <div className="text-center">
          <Loader2 className="mx-auto mb-4 size-8 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Loading automation rules...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <Avatar className="size-11 rounded-lg border">
                <AvatarImage
                  src={session?.data?.user?.image || ""}
                  alt={session?.data?.user?.name || ""}
                />
                <AvatarFallback className="rounded-lg bg-muted text-sm font-semibold">
                  {session?.data?.user?.name?.charAt(0) || "I"}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
                  InstaAutomate
                </h1>
                <p className="truncate text-sm text-muted-foreground">
                  {session?.data?.user?.name
                    ? `Signed in as ${session.data.user.name}`
                    : "Instagram automation dashboard"}
                </p>
              </div>
            </div>
            <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
              <Button
                size="sm"
                onClick={handleCreate}
                className="flex-1 sm:flex-none"
              >
                <Plus className="size-4" />
                Create Rule
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => signOut()}
                aria-label="Sign out"
              >
                <LogOut className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <section className="mb-6 grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-1 text-xs font-medium text-muted-foreground">
              <Radio className="size-3.5 text-primary" />
              Live automation workspace
            </div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Rules that reply while you keep moving.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
              Build message, comment, and Private Reply (Comment to DM)
              automations from a single responsive control room.
            </p>
          </div>
          <Button onClick={handleCreate} size="lg" className="w-full md:w-auto">
            <Plus className="size-4" />
            Create Rule
          </Button>
        </section>

        <section className="mb-8 grid gap-3 sm:grid-cols-3">
          <Card className="rounded-lg py-4">
            <CardContent className="flex items-center justify-between gap-4 px-4">
              <div>
                <p className="text-sm text-muted-foreground">Total rules</p>
                <p className="text-2xl font-semibold">{automations.length}</p>
              </div>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <Bot className="size-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-lg py-4">
            <CardContent className="flex items-center justify-between gap-4 px-4">
              <div>
                <p className="text-sm text-muted-foreground">Active now</p>
                <p className="text-2xl font-semibold">{activeCount}</p>
              </div>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <BadgeCheck className="size-5" />
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-lg py-4">
            <CardContent className="flex items-center justify-between gap-4 px-4">
              <div>
                <p className="text-sm text-muted-foreground">DM triggers</p>
                <p className="text-2xl font-semibold">{messageCount}</p>
              </div>
              <div className="rounded-md bg-primary/10 p-2 text-primary">
                <MessageSquare className="size-5" />
              </div>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">
                Automation Rules
              </h3>
              <p className="text-sm text-muted-foreground">
                {automations.length}{" "}
                {automations.length === 1 ? "rule" : "rules"} configured across
                your Instagram inbox and posts.
              </p>
            </div>
            <div className="inline-flex w-fit items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-muted-foreground">
              <span className="size-2 rounded-full bg-primary" />
              {activeCount} active
            </div>
          </div>

          {automations.length === 0 ? (
            <Card className="rounded-lg border-dashed">
              <CardContent className="flex flex-col items-center justify-center px-6 py-16 text-center">
                <div className="mb-4 rounded-md bg-muted p-3 text-muted-foreground">
                  <Bot className="size-8" />
                </div>
                <h4 className="text-lg font-semibold">No rules yet</h4>
                <p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">
                  Create your first rule to respond automatically when people
                  message you or comment on posts.
                </p>
                <Button onClick={handleCreate} className="mt-6">
                  <Plus className="size-4" />
                  Create Rule
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {automations.map((rule) => {
                const isMessage = rule.triggerType === "message";
                const isComment = rule.triggerType === "comment";
                const Icon = isMessage
                  ? MessageSquare
                  : isComment
                    ? MessageCircle
                    : LockKeyhole;
                const title = isMessage
                  ? "Message Automation (dm to dm)"
                  : isComment
                    ? "Comment Automation (comment to comment)"
                    : "Private Reply (Comment to DM)";

                return (
                  <Card
                    key={rule.id}
                    className="rounded-lg transition-shadow hover:shadow-md"
                  >
                    <CardHeader className="gap-4 px-4 sm:px-5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-start gap-3">
                          <div className="rounded-md bg-muted p-2 text-muted-foreground">
                            <Icon className="size-5" />
                          </div>
                          <div className="min-w-0">
                            <CardTitle className="truncate text-base">
                              {title}
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {rule.triggerWord?.trim() ? (
                                <>
                                  Trigger contains{" "}
                                  <span className="font-medium text-foreground">
                                    &quot;{rule.triggerWord}&quot;
                                  </span>
                                </>
                              ) : (
                                <span className="inline-flex items-center gap-1 font-medium text-amber-600 dark:text-amber-400">
                                  ⚡ Matches any{" "}
                                  {rule.triggerType === "message"
                                    ? "DM"
                                    : "comment"}
                                </span>
                              )}
                            </CardDescription>
                          </div>
                        </div>
                        <span
                          className={`shrink-0 rounded-md border px-2 py-1 text-xs font-medium ${
                            rule.isActive
                              ? "border-primary/20 bg-primary/10 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {rule.isActive ? "Active" : "Paused"}
                        </span>
                      </div>
                    </CardHeader>
                    <CardContent className="grid gap-4 px-4 sm:px-5">
                      <div className="rounded-md border bg-muted/35 p-3">
                        <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                          Reply
                        </p>
                        <p className="line-clamp-4 text-sm leading-6">
                          {rule.replyText}
                        </p>
                        {rule.linkText && rule.linkUrl && (
                          <div className="mt-3 inline-flex max-w-full items-center gap-1 rounded-md bg-background px-2 py-1 text-xs text-muted-foreground">
                            <ExternalLink className="size-3.5 shrink-0" />
                            <span className="truncate">{rule.linkText}</span>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                        <div className="inline-flex min-w-0 items-center gap-2">
                          {rule.postId ? (
                            <>
                              <Zap className="size-3.5 shrink-0" />
                              <span className="truncate">
                                Post {rule.postId}
                              </span>
                            </>
                          ) : (
                            <>
                              <Globe2 className="size-3.5 shrink-0" />
                              <span>Global rule</span>
                            </>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(rule)}
                          >
                            <Pencil className="size-4" />
                            Edit
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleDelete(rule.id)}
                            disabled={isDeleting}
                            aria-label="Delete rule"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <Sheet
        modal={true}
        open={isRuleSheetOpen}
        onOpenChange={handleSheetOpenChange}
      >
        <SheetContent
          side="bottom"
          className="max-h-[92vh] rounded-t-lg border-x bg-background p-0 sm:left-1/2 sm:max-w-2xl sm:-translate-x-1/2"
        >
          <SheetHeader className="border-b px-5 py-4 text-left">
            <SheetTitle className="flex items-center gap-2">
              {editing ? (
                <Pencil className="size-4" />
              ) : (
                <Plus className="size-4" />
              )}
              {editing ? "Edit Rule" : "Create Rule"}
            </SheetTitle>
            <SheetDescription>
              {editing
                ? "Update the trigger, reply, and status for this automation."
                : "Create a responsive automation rule for comments or messages."}
            </SheetDescription>
          </SheetHeader>

          <div className="overflow-y-auto px-5 py-5">
            <AutomationRuleForm
              form={form}
              posts={posts}
              isSubmitting={isCreating || isUpdating}
              editing={editing !== null}
              onCancel={() => handleSheetOpenChange(false)}
              onSubmit={onSubmit}
              submitLabel={editing ? "Save Rule" : "Create Rule"}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
