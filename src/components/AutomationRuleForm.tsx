import { z } from "zod";
import {
  automationRuleSchema,
  AutomationRuleInput,
} from "@/lib/schemas/automationRuleSchema";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Select } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { FormProvider, UseFormReturn } from "react-hook-form";

interface AutomationRuleFormProps {
  form: UseFormReturn<z.infer<typeof automationRuleSchema>>;
  posts: any[];
  isSubmitting: boolean;
  editing: boolean;
  onCancel?: () => void;
  onSubmit: (values: z.infer<typeof automationRuleSchema>) => void;
  submitLabel?: string;
}

export default function AutomationRuleForm({
  form,
  posts,
  isSubmitting,
  editing,
  onCancel,
  onSubmit,
  submitLabel,
}: AutomationRuleFormProps) {
  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full max-w-xl mx-auto my-0"
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
                    <option value="comment">💬 Comment Reply</option>
                    <option value="pvtreply">🔒 Comment → DM</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Post selector conditionally rendered */}
          {form.watch("triggerType") !== "message" && (
            <FormField<AutomationRuleInput>
              control={form.control}
              name="postId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-slate-700">
                    Target Post{" "}
                    <span className="text-xs text-slate-500">(optional)</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      id="postId"
                      value={(field.value as string) || ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                      className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">🌐 Global (all posts)</option>
                      {posts.map((p: any) => (
                        <option key={p.id} value={p.id}>
                          {p.caption?.slice(0, 50) || p.id}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <p className="text-xs text-slate-500 mt-1">
                    Selecting a specific post will send a private reply to the
                    commenter. Choosing "Global" will send a public comment
                    reply.
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

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
                    placeholder="e.g., hello, help, info, link"
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    {...field}
                    value={field.value as string}
                  />
                </FormControl>
                <p className="text-xs text-slate-500 mt-1">
                  any comment/message which contains this word will trigger
                  reply
                </p>
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
                  Reply Text
                </FormLabel>
                <FormControl>
                  <Input
                    id="replyText"
                    placeholder="eg- Thanks for comment"
                    className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    {...field}
                    value={(field.value as string) || ""}
                  />
                </FormControl>
                <p className="text-xs text-slate-500 mt-1">
                  Text to send as reply
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("triggerType") !== "comment" && (
            <>
              <FormField<AutomationRuleInput>
                control={form.control}
                name="linkText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Link Text / Anchor Text
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="linkText"
                        placeholder="eg- Get Started, Learn More, Click Here"
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                        value={(field.value as string) || ""}
                      />
                    </FormControl>
                    <p className="text-xs text-slate-500 mt-1">
                      This is required if you want to add a link to the reply
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField<AutomationRuleInput>
                control={form.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-slate-700">
                      Link URL
                    </FormLabel>
                    <FormControl>
                      <Input
                        id="linkUrl"
                        placeholder="eg- https://example.com"
                        className="bg-white border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        {...field}
                        value={(field.value as string) || ""}
                      />
                    </FormControl>
                    <p className="text-xs text-slate-500 mt-1">
                      This is required if you want to add a link to the reply
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

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
                      checked={!!field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
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
            disabled={isSubmitting}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {submitLabel ||
              (editing
                ? isSubmitting
                  ? "Updating..."
                  : "Update Rule"
                : isSubmitting
                ? "Creating..."
                : "Create Rule")}
          </Button>
          {editing && onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="border-slate-300 hover:bg-slate-50"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
