import { z } from "zod";

// Schema for form validation - isActive is required
export const automationRuleSchema = z.object({
  triggerType: z.enum(["message", "comment", "pvtreply"]),
  triggerWord: z.string().min(1, "Trigger word is required"),
  replyText: z.string().min(1, "Reply text is required"),
  isActive: z.boolean(),
  postId: z.string().nullable().optional(),
  linkText: z.string().optional(),
  linkUrl: z.union([z.url(), z.literal("")]).optional().nullable(),
});

// Input schema with optional isActive (for forms)
export const automationRuleInputSchema = z.object({
  triggerType: z.enum(["message", "comment", "pvtreply"]),
  triggerWord: z.string().min(1, "Trigger word is required"),
  replyText: z.string().min(1, "Reply text is required"),
  isActive: z.boolean(),
  postId: z.string().nullable().optional(),
  linkText: z.string().optional(),
  linkUrl: z.union([z.url(), z.literal("")]).optional().nullable(),
});

export type AutomationRuleInput = z.infer<typeof automationRuleInputSchema>;
export type AutomationRule = z.infer<typeof automationRuleSchema>;
