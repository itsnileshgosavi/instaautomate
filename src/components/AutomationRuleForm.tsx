import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  AutomationRuleInput,
  automationRuleSchema,
} from "@/lib/schemas/automationRuleSchema";
import { FormProvider, UseFormReturn } from "react-hook-form";
import { z } from "zod";

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
        className="mx-auto w-full max-w-xl space-y-5"
      >
        <div className="grid gap-5">
          <FormField<AutomationRuleInput>
            control={form.control}
            name="triggerType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Trigger Type</FormLabel>
                <FormControl>
                  <Select
                    id="triggerType"
                    value={(field.value as string) ?? "message"}
                    onChange={(event) => field.onChange(event.target.value)}
                  >
                    <option value="message">Message to Message reply</option>
                    <option value="comment">Comment to Comment reply</option>
                    <option value="pvtreply">Comment to DM reply</option>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.watch("triggerType") !== "message" && (
            <FormField<AutomationRuleInput>
              control={form.control}
              name="postId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Target Post{" "}
                    <span className="text-xs text-muted-foreground">
                      (optional)
                    </span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      id="postId"
                      value={(field.value as string) || ""}
                      onChange={(event) =>
                        field.onChange(event.target.value || null)
                      }
                    >
                      <option value="">Global (all posts)</option>
                      {posts.map((post: any) => (
                        <option key={post.id} value={post.id}>
                          {post.caption?.slice(0, 50) || post.id}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormDescription className="text-xs leading-5">
                    Selecting a specific post sends a private reply to the
                    commenter. Global sends a public comment reply.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField<AutomationRuleInput>
            control={form.control}
            name="triggerWord"
            render={({ field }) => {
              const isEmpty = !(field.value as string)?.trim();
              return (
                <FormItem>
                  <div className="flex items-center justify-between gap-2">
                    <FormLabel>
                      Trigger Word{" "}
                      <span className="text-xs font-normal text-muted-foreground">
                        (optional)
                      </span>
                    </FormLabel>
                    {isEmpty && (
                      <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-600 dark:text-amber-400">
                        ⚡ Matches everything
                      </span>
                    )}
                  </div>
                  <FormControl>
                    <Input
                      id="triggerWord"
                      placeholder="Leave empty to reply to any message or comment"
                      {...field}
                      value={(field.value as string) ?? ""}
                    />
                  </FormControl>
                  <FormDescription className="text-xs leading-5">
                    {isEmpty ? (
                      <span className="font-medium text-amber-600 dark:text-amber-400">
                        No trigger word set — this rule will fire on{" "}
                        <strong>every</strong>{" "}
                        {form.watch("triggerType") === "message"
                          ? "incoming DM"
                          : "comment"}
                        .
                      </span>
                    ) : (
                      <>
                        Only fires when a message or comment{" "}
                        <strong>contains</strong> this word (case-insensitive).
                      </>
                    )}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              );
            }}
          />

          <FormField<AutomationRuleInput>
            control={form.control}
            name="replyText"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Reply Text</FormLabel>
                <FormControl>
                  <Input
                    id="replyText"
                    placeholder="e.g., Thanks for your comment"
                    {...field}
                    value={(field.value as string) || ""}
                  />
                </FormControl>
                <FormDescription className="text-xs leading-5">
                  Text to send as the automatic reply.
                </FormDescription>
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
                    <FormLabel>Link Text</FormLabel>
                    <FormControl>
                      <Input
                        id="linkText"
                        placeholder="e.g., Get Started, Learn More"
                        {...field}
                        value={(field.value as string) || ""}
                      />
                    </FormControl>
                    <FormDescription className="text-xs leading-5">
                      Required only when adding a link to the reply.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField<AutomationRuleInput>
                control={form.control}
                name="linkUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link URL</FormLabel>
                    <FormControl>
                      <Input
                        id="linkUrl"
                        placeholder="e.g., https://example.com"
                        {...field}
                        value={(field.value as string) || ""}
                      />
                    </FormControl>
                    <FormDescription className="text-xs leading-5">
                      Required only when adding a link to the reply.
                    </FormDescription>
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
                <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/40 p-4">
                  <div className="flex flex-col">
                    <FormLabel>Rule Status</FormLabel>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {field.value
                        ? "Rule is active and will trigger"
                        : "Rule is paused"}
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      id="isActive"
                      checked={!!field.value}
                      onChange={(event) => field.onChange(event.target.checked)}
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

        <div className="grid gap-3 pt-2 sm:grid-cols-[1fr_auto]">
          <Button type="submit" disabled={isSubmitting} className="w-full">
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
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
          )}
        </div>
      </form>
    </FormProvider>
  );
}
