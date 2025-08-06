"use client";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useSubscribeMutation } from "@/lib/rtk/subscribe";

import {
  useGetAutomationsQuery,
  useCreateAutomationMutation,
  useUpdateAutomationMutation,
  useDeleteAutomationMutation,
  AutomationRule,
} from "@/lib/slices/apiSlice";
import {
  automationRuleSchema,
  automationRuleInputSchema,
  AutomationRuleInput,
} from "@/lib/schemas/automationRuleSchema";
import { FormProvider } from "react-hook-form";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { z } from "zod";

export default function Home() {
  const session = useSession();

  const [subscribe] = useSubscribeMutation();

  // RTK Query hooks
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

  // Form state
  const [editing, setEditing] = useState<AutomationRule | null>(null);

  const form = useForm<z.infer<typeof automationRuleSchema>>({
    resolver: zodResolver(automationRuleSchema),
    defaultValues: {
      triggerType: "message",
      triggerWord: "",
      replyText: "",
      isActive: true,
    },
    mode: "onChange",
  });

  const onSubmit = async (values: AutomationRuleInput) => {
    if (editing) {
      await updateAutomation({ id: editing.id, data: values });
      setEditing(null);
    } else {
      await createAutomation(values);
    }
    form.reset();
    refetch();
  };

  const handleEdit = (rule: AutomationRule) => {
    setEditing(rule);
    form.reset({
      triggerType: rule.triggerType,
      triggerWord: rule.triggerWord,
      replyText: rule.replyText,
      isActive: rule.isActive,
    });
  };

  const handleDelete = async (id: string) => {
    await deleteAutomation(id);
    if (editing && editing.id === id) setEditing(null);
    refetch();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading automation rules...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">IA</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Insta-Automate
                </h1>
                <p className="text-sm text-slate-600">
                  Instagram Automation Platform
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden sm:flex items-center space-x-2 text-sm text-slate-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Welcome, {session?.data?.user?.name}</span>
              </div>
              <Button variant="outline" size="sm" onClick={() => subscribe()}>
                Subscribe
              </Button>
              <Button variant="ghost" size="sm" onClick={() => signOut()}>
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <Card className="shadow-xl border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {editing ? "✏️" : "➕"}
                    </span>
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold text-slate-800">
                      {editing ? "Edit Rule" : "Create Rule"}
                    </CardTitle>
                    <p className="text-sm text-slate-600 mt-1">
                      {editing
                        ? "Modify your automation"
                        : "Set up a new automation"}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <FormProvider {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="space-y-5">
                      <FormField<AutomationRuleInput>
                        control={form.control}
                        name="triggerType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Trigger Type
                            </FormLabel>
                            <FormControl>
                              <Select
                                id="triggerType"
                                value={(field.value as string) ?? "message"}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                              >
                                <option value="message">📱 Message</option>
                                <option value="comment">💬 Comment</option>
                              </Select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField<AutomationRuleInput>
                        control={form.control}
                        name="triggerWord"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Trigger Word
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="triggerWord"
                                placeholder="e.g., hello, help, info"
                                className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                                value={field.value as string}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField<AutomationRuleInput>
                        control={form.control}
                        name="replyText"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-medium text-slate-700">
                              Reply Message
                            </FormLabel>
                            <FormControl>
                              <Input
                                id="replyText"
                                placeholder="Your automated response"
                                className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                                {...field}
                                value={(field.value as string) || ""}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField<AutomationRuleInput>
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                              <div className="flex flex-col">
                                <FormLabel className="text-sm font-medium text-slate-700">
                                  Rule Status
                                </FormLabel>
                                <p className="text-xs text-slate-500 mt-1">
                                  {field.value
                                    ? "Rule is active and will trigger"
                                    : "Rule is paused"}
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  id="isActive"
                                  checked={
                                    typeof field.value === "boolean"
                                      ? field.value
                                      : false
                                  }
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                  name={field.name}
                                  onBlur={field.onBlur}
                                  ref={field.ref}
                                />
                              </FormControl>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isCreating || isUpdating}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        {editing
                          ? isUpdating
                            ? "Updating..."
                            : "Update Rule"
                          : isCreating
                          ? "Creating..."
                          : "Create Rule"}
                      </Button>
                      {editing && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditing(null);
                            form.reset();
                          }}
                          className="border-slate-300 hover:bg-slate-50"
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </FormProvider>
              </CardContent>
            </Card>
          </div>

          {/* Rules List Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    Automation Rules
                  </h2>
                  <p className="text-slate-600 mt-1">
                    {automations?.length}{" "}
                    {automations?.length === 1 ? "rule" : "rules"} configured
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>
                    {automations?.filter((rule) => rule.isActive).length} active
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600">
                      Loading automation rules...
                    </p>
                  </div>
                </div>
              ) : automations?.length === 0 ? (
                <Card className="border-dashed border-2 border-slate-200 bg-slate-50/50">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center mb-4">
                      <span className="text-2xl">🤖</span>
                    </div>
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      No automation rules yet
                    </h3>
                    <p className="text-slate-600 text-center max-w-md">
                      Create your first automation rule to start automatically
                      responding to messages and comments.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                automations.map((rule) => (
                  <Card
                    key={rule.id}
                    className="shadow-lg border-0 bg-white/70 backdrop-blur-sm hover:shadow-xl transition-all duration-200"
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div
                            className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                              rule.triggerType === "message"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-purple-100 text-purple-600"
                            }`}
                          >
                            <span className="text-lg">
                              {rule.triggerType === "message" ? "📱" : "💬"}
                            </span>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <CardTitle className="text-lg font-semibold text-slate-800">
                                {rule.triggerType === "message"
                                  ? "Message"
                                  : "Comment"}{" "}
                                Automation
                              </CardTitle>
                              <div
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  rule.isActive
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {rule.isActive ? "Active" : "Paused"}
                              </div>
                            </div>
                            <p className="text-sm text-slate-600">
                              Triggers when text contains:{" "}
                              <span className="font-semibold text-slate-800">
                                "{rule.triggerWord}"
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEdit(rule)}
                            className="border-slate-300 hover:bg-slate-50"
                          >
                            ✏️ Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(rule.id)}
                            disabled={isDeleting}
                            className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                          >
                            🗑️ Delete
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <div className="flex items-start space-x-2">
                          <span className="text-slate-500 text-sm font-medium mt-0.5">
                            Reply:
                          </span>
                          <p className="text-slate-800 text-sm flex-1 leading-relaxed">
                            "{rule.replyText}"
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
