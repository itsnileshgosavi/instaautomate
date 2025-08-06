import { z } from "zod";

// Schema for form validation - isActive is required
export const automationRuleSchema = z.object({
  triggerType: z.enum(["message", "comment"]),
  triggerWord: z.string().min(1, "Trigger word is required"),
  replyText: z.string().min(1, "Reply text is required"),
  isActive: z.boolean(),
});

// Input schema with optional isActive (for forms)
export const automationRuleInputSchema = z.object({
  triggerType: z.enum(["message", "comment"]),
  triggerWord: z.string().min(1, "Trigger word is required"),
  replyText: z.string().min(1, "Reply text is required"),
  isActive: z.boolean(),
});

export type AutomationRuleInput = z.infer<typeof automationRuleInputSchema>;
export type AutomationRule = z.infer<typeof automationRuleSchema>;
