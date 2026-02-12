import { pgTable, text, timestamp, uuid, integer } from "drizzle-orm/pg-core";

export const interviews = pgTable("interviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id").notNull(),
  position: text("position").notNull(),
  description: text("description").notNull(),
  duration: text("duration").notNull(),
  interviewTypes: text("interview_types").notNull(),
  questions: text("questions").notNull(),
  vapiAssistantId: text("vapi_assistant_id"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const candidateInterviewResults = pgTable("candidate_interview_results", {
  id: uuid("id").defaultRandom().primaryKey(),
  interviewId: uuid("interview_id").references(() => interviews.id).notNull(),
  candidateName: text("candidate_name").notNull(),
  candidateEmail: text("candidate_email").notNull(),
  transcript: text("transcript"),
  feedback: text("feedback"), // Summary text
  technicalSkills: integer("technical_skills"), // Score out of 10
  communication: integer("communication"), // Score out of 10
  problemSolving: integer("problem_solving"), // Score out of 10
  experience: integer("experience"), // Score out of 10
  recommendation: text("recommendation"), // Recommendation message
  score: integer("score"),
  duration: text("duration"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
