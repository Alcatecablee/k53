import { createClient } from "@supabase/supabase-js";
import { k53ScenarioBank } from "../client/data/k53Scenarios";
import { k53QuestionBank } from "../client/data/k53Questions";
import * as dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Use service role key for admin operations
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function migrateScenarios() {
  console.log("Starting scenarios migration...");

  try {
    // Clear existing scenarios
    const { error: deleteError } = await supabase
      .from("scenarios")
      .delete()
      .neq("id", "");

    if (deleteError) {
      console.error("Error clearing scenarios:", deleteError);
      return;
    }

    console.log("Cleared existing scenarios");

    // Insert new scenarios in batches
    const batchSize = 50;
    for (let i = 0; i < k53ScenarioBank.length; i += batchSize) {
      const batch = k53ScenarioBank.slice(i, i + batchSize);

      const { error: insertError } = await supabase.from("scenarios").insert(
        batch.map((scenario) => ({
          id: scenario.id,
          category: scenario.category,
          title: scenario.title,
          scenario: scenario.scenario,
          question: scenario.question,
          options: scenario.options,
          correct: scenario.correct,
          explanation: scenario.explanation,
          difficulty: scenario.difficulty,
          context: scenario.context,
          time_of_day: scenario.timeOfDay,
          weather: scenario.weather,
          language: scenario.language,
          location: scenario.location || null,
        })),
      );

      if (insertError) {
        console.error(
          `Error inserting scenarios batch ${i / batchSize + 1}:`,
          insertError,
        );
        return;
      }

      console.log(
        `Inserted scenarios batch ${i / batchSize + 1}/${Math.ceil(k53ScenarioBank.length / batchSize)}`,
      );
    }

    console.log(`Successfully migrated ${k53ScenarioBank.length} scenarios!`);
  } catch (error) {
    console.error("Migration error:", error);
  }
}

async function migrateQuestions() {
  console.log("Starting questions migration...");

  try {
    // Clear existing questions
    const { error: deleteError } = await supabase
      .from("questions")
      .delete()
      .neq("id", "");

    if (deleteError) {
      console.error("Error clearing questions:", deleteError);
      return;
    }

    console.log("Cleared existing questions");

    // Insert new questions in batches
    const batchSize = 50;
    for (let i = 0; i < k53QuestionBank.length; i += batchSize) {
      const batch = k53QuestionBank.slice(i, i + batchSize);

      const { error: insertError } = await supabase.from("questions").insert(
        batch.map((question) => ({
          id: question.id,
          category: question.category,
          question: question.question,
          options: question.options,
          correct: question.correct,
          explanation: question.explanation,
        })),
      );

      if (insertError) {
        console.error(
          `Error inserting questions batch ${i / batchSize + 1}:`,
          insertError,
        );
        return;
      }

      console.log(
        `Inserted questions batch ${i / batchSize + 1}/${Math.ceil(k53QuestionBank.length / batchSize)}`,
      );
    }

    console.log(`Successfully migrated ${k53QuestionBank.length} questions!`);
  } catch (error) {
    console.error("Migration error:", error);
  }
}

async function main() {
  await migrateScenarios();
  await migrateQuestions();
  console.log("Migration completed!");
  process.exit(0);
}

// Run if this is the main module
main();

export { migrateScenarios, migrateQuestions };
