import { RequestHandler } from "express";
import { db } from "../db";
import { questions, scenarios } from "../../shared/schema";
import { eq } from "drizzle-orm";

// Fisher-Yates shuffle function
const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp!;
  }
  return shuffled;
};

// Get question bank from database
export const getQuestionBank: RequestHandler = async (req, res) => {
  try {
    const { category, difficulty, limit = 50 } = req.query;

    let query = db.select().from(questions);
    const conditions = [];

    if (category && questions.category) {
      conditions.push(eq(questions.category, category as string));
    }

    if (difficulty && questions.difficulty) {
      conditions.push(eq(questions.difficulty, difficulty as string));
    }

    const questionList = await query.limit(Number(limit));
    
    // Get total counts for stats
    const allQuestions = await db.select({
      category: questions.category,
      difficulty: questions.difficulty
    }).from(questions);
    
    const totalQuestions = allQuestions.length;
    const categories = [...new Set(allQuestions.map(q => q.category))];
    const difficulties = [...new Set(allQuestions.map(q => q.difficulty))];

    const stats = {
      total: totalQuestions,
      categories,
      difficulties,
      filtered: questionList.length,
    };

    res.json({
      questions: questionList,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get question bank error:", error);
    res.status(500).json({ 
      error: "Failed to get question bank",
      questions: [],
      stats: {
        total: 0,
        categories: [],
        difficulties: [],
        filtered: 0
      }
    });
  }
};

// Export questions as CSV
export const exportQuestions: RequestHandler = async (req, res) => {
  try {
    const { format = "csv" } = req.query;

    const questionList = await db.select().from(questions);

    if (format === "csv") {
      const headers = [
        "ID",
        "Question",
        "Option 1",
        "Option 2",
        "Option 3",
        "Option 4",
        "Correct",
        "Category",
        "Explanation",
      ];
      const rows = questionList.map((q: any) => [
        q.id,
        `"${q.question}"`,
        `"${q.options[0]}"`,
        `"${q.options[1]}"`,
        `"${q.options[2]}"`,
        `"${q.options[3]}"`,
        q.correct + 1,
        q.category,
        `"${q.explanation}"`,
      ]);

      const csv = [headers.join(","), ...rows.map((row: any) => row.join(","))].join("\n");

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="questions_${new Date().toISOString().split("T")[0]}.csv"`,
      );
      res.send(csv);
    } else {
      res.json({
        questions: questionList,
        exported: questionList.length,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error("Export questions error:", error);
    res.status(500).json({ error: "Failed to export questions" });
  }
};

// Import questions from CSV
export const importQuestions: RequestHandler = async (req, res) => {
  try {
    const { csvData } = req.body;

    if (!csvData) {
      return res.status(400).json({ error: "CSV data is required" });
    }

    const lines = csvData.split("\n").filter((line: string) => line.trim());

    const imported = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",");
        const question = {
          id: values[0] || '',
          question: values[1]?.replace(/"/g, "") || '',
          options: [
            values[2]?.replace(/"/g, "") || '',
            values[3]?.replace(/"/g, "") || '',
            values[4]?.replace(/"/g, "") || '',
            values[5]?.replace(/"/g, "") || '',
          ],
          correct: parseInt(values[6]) - 1,
          category: values[7] || '',
          explanation: values[8]?.replace(/"/g, "") || '',
        };

        const result = await db.insert(questions).values(question).returning();
        imported.push(result[0]);
      } catch (error) {
        errors.push({ row: i + 1, error: "Invalid data format" });
      }
    }

    res.json({
      imported: imported.length,
      errors: errors.length,
      details: {
        imported,
        errors,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Import questions error:", error);
    res.status(500).json({ error: "Failed to import questions" });
  }
};

// Get scenarios from database
export const getScenarios: RequestHandler = async (req, res) => {
  try {
    const { limit = 50 } = req.query;

    const scenarioList = await db.select().from(scenarios).limit(Number(limit));
    
    // Get total counts for stats
    const allScenarios = await db.select({
      difficulty: scenarios.difficulty,
      location: scenarios.location,
    }).from(scenarios);
    
    const difficulties = [...new Set(allScenarios.map(s => s.difficulty))];
    const locations = [...new Set(allScenarios.map(s => s.location).filter(Boolean))];

    // Shuffle scenarios for better variety
    const shuffledScenarios = shuffleArray(scenarioList);

    const stats = {
      total: allScenarios.length,
      difficulties,
      locations,
      filtered: shuffledScenarios.length,
    };

    res.json({
      scenarios: shuffledScenarios,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Get scenarios error:", error);
    res.status(500).json({ 
      error: "Failed to get scenarios",
      scenarios: [],
      stats: {
        total: 0,
        difficulties: [],
        locations: [],
        filtered: 0
      }
    });
  }
};

// Create new scenario
export const createScenario: RequestHandler = async (req, res) => {
  try {
    const scenarioData = req.body;

    const result = await db.insert(scenarios).values(scenarioData).returning();

    res.json({
      scenario: result[0],
      message: "Scenario created successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Create scenario error:", error);
    res.status(500).json({ error: "Failed to create scenario" });
  }
};

// Update scenario
export const updateScenario: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const result = await db.update(scenarios)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(scenarios.id, id as string))
      .returning();

    if (!result || result.length === 0) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    res.json({
      scenario: result[0],
      message: "Scenario updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Update scenario error:", error);
    res.status(500).json({ error: "Failed to update scenario" });
  }
};

// Delete scenario
export const deleteScenario: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    await db.delete(scenarios).where(eq(scenarios.id, id as string));

    res.json({
      message: "Scenario deleted successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Delete scenario error:", error);
    res.status(500).json({ error: "Failed to delete scenario" });
  }
};

// Get content statistics
export const getContentStats: RequestHandler = async (_req, res) => {
  try {
    const questionList = await db.select({
      category: questions.category,
      difficulty: questions.difficulty
    }).from(questions);
    
    const scenarioList = await db.select({
      difficulty: scenarios.difficulty,
      location: scenarios.location,
    }).from(scenarios);

    const totalQuestions = questionList.length;
    const categories = [...new Set(questionList.map(q => q.category))];

    const totalScenarios = scenarioList.length;
    const locations = [...new Set(scenarioList.map(s => s.location).filter(Boolean))];

    const stats = {
      questions: {
        total: totalQuestions,
        categories: categories.length,
        difficulties: {
          basic: questionList.filter(q => q.difficulty === "basic").length,
          intermediate: questionList.filter(q => q.difficulty === "intermediate").length,
          advanced: questionList.filter(q => q.difficulty === "advanced").length,
        },
      },
      scenarios: {
        total: totalScenarios,
        locations: locations.length,
      },
      languages: ["en", "af", "zu"],
      lastUpdated: new Date().toISOString(),
    };

    res.json(stats);
  } catch (error) {
    console.error("Get content stats error:", error);
    res.status(500).json({ error: "Failed to get content statistics" });
  }
};
