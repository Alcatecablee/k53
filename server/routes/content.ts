import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

// Database client
let supabase: any = null;

const getDatabase = () => {
  if (!supabase) {
    const supabaseUrl =
      process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};

// Get question bank from database
export const getQuestionBank: RequestHandler = async (req, res) => {
  try {
    const { category, difficulty, limit = 50 } = req.query;
    const db = getDatabase();

    if (!db) {
      return res.status(503).json({ 
        error: "Database not available",
        questions: [],
        stats: {
          total: 0,
          categories: [],
          difficulties: [],
          filtered: 0
        }
      });
    }

    let query = db.from("questions").select("*");

    if (category) {
      query = query.eq("category", category);
    }

    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    const { data: questions, error } = await query.limit(Number(limit));

    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ 
        error: "Failed to fetch questions",
        questions: [],
        stats: {
          total: 0,
          categories: [],
          difficulties: [],
          filtered: 0
        }
      });
    }

    // Get total counts for stats
    const { data: allQuestions } = await db.from("questions").select("category, difficulty");
    
    const totalQuestions = allQuestions?.length || 0;
    const categories = [...new Set(allQuestions?.map(q => q.category) || [])];
    const difficulties = [...new Set(allQuestions?.map(q => q.difficulty) || [])];

    const stats = {
      total: totalQuestions,
      categories,
      difficulties,
      filtered: questions?.length || 0,
    };

    res.json({
      questions: questions || [],
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
    const db = getDatabase();

    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { data: questions, error } = await db.from("questions").select("*");

    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ error: "Failed to fetch questions" });
    }

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
        "Difficulty",
      ];
      const rows = (questions || []).map((q) => [
        q.id,
        `"${q.question_text || q.question}"`,
        `"${q.options[0]}"`,
        `"${q.options[1]}"`,
        `"${q.options[2]}"`,
        `"${q.options[3]}"`,
        q.correct_answer + 1, // Convert to 1-based index
        q.category,
        q.difficulty,
      ]);

      const csv = [headers.join(","), ...rows.map((row) => row.join(","))].join(
        "\n",
      );

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="questions_${new Date().toISOString().split("T")[0]}.csv"`,
      );
      res.send(csv);
    } else {
      res.json({
        questions: questions || [],
        exported: questions?.length || 0,
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
    const db = getDatabase();

    if (!csvData) {
      return res.status(400).json({ error: "CSV data is required" });
    }

    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const lines = csvData.split("\n").filter((line: string) => line.trim());
    const headers = lines[0].split(",");

    const imported = [];
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(",");
        const question = {
          question_text: values[1]?.replace(/"/g, ""),
          options: [
            values[2]?.replace(/"/g, ""),
            values[3]?.replace(/"/g, ""),
            values[4]?.replace(/"/g, ""),
            values[5]?.replace(/"/g, ""),
          ],
          correct_answer: parseInt(values[6]) - 1, // Convert from 1-based to 0-based
          category: values[7],
          difficulty: values[8],
        };

        const { data, error: insertError } = await db
          .from("questions")
          .insert(question)
          .select();

        if (insertError) {
          errors.push({ row: i + 1, error: insertError.message });
        } else {
          imported.push(data[0]);
        }
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
    const { difficulty, location, type, limit = 50 } = req.query;
    const db = getDatabase();

    if (!db) {
      return res.status(503).json({ 
        error: "Database not available",
        scenarios: [],
        stats: {
          total: 0,
          difficulties: [],
          locations: [],
          types: [],
          filtered: 0
        }
      });
    }

    let query = db.from("scenarios").select("*");

    if (difficulty) {
      query = query.eq("difficulty", difficulty);
    }

    if (location) {
      query = query.eq("location", location);
    }

    if (type) {
      query = query.eq("type", type);
    }

    const { data: scenarios, error } = await query.limit(Number(limit));

    if (error) {
      console.error("Database query error:", error);
      return res.status(500).json({ 
        error: "Failed to fetch scenarios",
        scenarios: [],
        stats: {
          total: 0,
          difficulties: [],
          locations: [],
          types: [],
          filtered: 0
        }
      });
    }

    // Get total counts for stats
    const { data: allScenarios } = await db.from("scenarios").select("difficulty, location, type");
    
    const totalScenarios = allScenarios?.length || 0;
    const difficulties = [...new Set(allScenarios?.map(s => s.difficulty) || [])];
    const locations = [...new Set(allScenarios?.map(s => s.location) || [])];
    const types = [...new Set(allScenarios?.map(s => s.type) || [])];

    const stats = {
      total: totalScenarios,
      difficulties,
      locations,
      types,
      filtered: scenarios?.length || 0,
    };

    res.json({
      scenarios: scenarios || [],
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
        types: [],
        filtered: 0
      }
    });
  }
};

// Create new scenario
export const createScenario: RequestHandler = async (req, res) => {
  try {
    const { title, description, difficulty, location, type, active = true } = req.body;
    const db = getDatabase();

    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    if (!title || !description || !difficulty || !location || !type) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const { data, error } = await db
      .from("scenarios")
      .insert({
        title,
        description,
        difficulty,
        location,
        type,
        active,
      })
      .select();

    if (error) {
      console.error("Database insert error:", error);
      return res.status(500).json({ error: "Failed to create scenario" });
    }

    res.json({
      scenario: data[0],
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
    const db = getDatabase();

    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { data, error } = await db
      .from("scenarios")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) {
      console.error("Database update error:", error);
      return res.status(500).json({ error: "Failed to update scenario" });
    }

    if (!data || data.length === 0) {
      return res.status(404).json({ error: "Scenario not found" });
    }

    res.json({
      scenario: data[0],
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
    const db = getDatabase();

    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { error } = await db.from("scenarios").delete().eq("id", id);

    if (error) {
      console.error("Database delete error:", error);
      return res.status(500).json({ error: "Failed to delete scenario" });
    }

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
export const getContentStats: RequestHandler = async (req, res) => {
  try {
    const db = getDatabase();

    if (!db) {
      return res.status(503).json({ error: "Database not available" });
    }

    const { data: questions, error: questionsError } = await db.from("questions").select("category, difficulty");
    const { data: scenarios, error: scenariosError } = await db.from("scenarios").select("difficulty, location, type");

    const totalQuestions = questions?.length || 0;
    const categories = [...new Set(questions?.map(q => q.category) || [])];
    const difficulties = [...new Set(questions?.map(q => q.difficulty) || [])];

    const totalScenarios = scenarios?.length || 0;
    const difficultiesScenarios = [...new Set(scenarios?.map(s => s.difficulty) || [])];
    const locations = [...new Set(scenarios?.map(s => s.location) || [])];
    const types = [...new Set(scenarios?.map(s => s.type) || [])];

    const stats = {
      questions: {
        total: totalQuestions,
        categories: categories.length,
        difficulties: {
          easy: questions?.filter(q => q.difficulty === "easy").length || 0,
          medium: questions?.filter(q => q.difficulty === "medium").length || 0,
          hard: questions?.filter(q => q.difficulty === "hard").length || 0,
        },
      },
      scenarios: {
        total: totalScenarios,
        active: scenarios?.filter(s => s.active === true).length || 0,
        locations: locations.length,
        types: types.length,
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
