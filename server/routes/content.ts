import { RequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";

// Database client
let supabase: any = null;

const getDatabase = () => {
  if (!supabase) {
    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return null;
    }

    supabase = createClient(supabaseUrl, supabaseKey);
  }
  return supabase;
};

// Mock question bank for demo
const questionBank = [
  {
    id: 1,
    question: "What is the speed limit in a residential area?",
    options: ["40 km/h", "50 km/h", "60 km/h", "70 km/h"],
    correct: 1,
    category: "speed_limits",
    difficulty: "easy",
  },
  {
    id: 2,
    question: "When must you use your headlights?",
    options: ["Only at night", "During rain", "30 minutes after sunset", "All of the above"],
    correct: 3,
    category: "lighting",
    difficulty: "medium",
  },
  {
    id: 3,
    question: "What does a red traffic light mean?",
    options: ["Slow down", "Stop", "Yield", "Caution"],
    correct: 1,
    category: "traffic_signals",
    difficulty: "easy",
  },
];

const scenarios = [
  {
    id: 1,
    title: "City Intersection Navigation",
    description: "Navigate through a busy 4-way intersection with traffic lights",
    difficulty: "medium",
    location: "cape_town",
    type: "intersection",
    active: true,
  },
  {
    id: 2,
    title: "Highway Merging",
    description: "Safely merge onto a highway during rush hour traffic",
    difficulty: "hard",
    location: "johannesburg",
    type: "highway",
    active: true,
  },
  {
    id: 3,
    title: "Parallel Parking",
    description: "Park between two cars in a busy shopping center",
    difficulty: "hard",
    location: "durban",
    type: "parking",
    active: false,
  },
];

// Get question bank
export const getQuestionBank: RequestHandler = async (req, res) => {
  try {
    const { category, difficulty, limit = 50 } = req.query;
    
    let filteredQuestions = [...questionBank];
    
    if (category) {
      filteredQuestions = filteredQuestions.filter(q => q.category === category);
    }
    
    if (difficulty) {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === difficulty);
    }
    
    const questions = filteredQuestions.slice(0, Number(limit));
    
    const stats = {
      total: questionBank.length,
      categories: [...new Set(questionBank.map(q => q.category))],
      difficulties: [...new Set(questionBank.map(q => q.difficulty))],
      filtered: questions.length,
    };

    res.json({
      questions,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get question bank error:', error);
    res.status(500).json({ error: 'Failed to get question bank' });
  }
};

// Export questions as CSV
export const exportQuestions: RequestHandler = async (req, res) => {
  try {
    const { format = 'csv' } = req.query;
    
    if (format === 'csv') {
      const headers = ['ID', 'Question', 'Option 1', 'Option 2', 'Option 3', 'Option 4', 'Correct', 'Category', 'Difficulty'];
      const rows = questionBank.map(q => [
        q.id,
        `"${q.question}"`,
        `"${q.options[0]}"`,
        `"${q.options[1]}"`,
        `"${q.options[2]}"`,
        `"${q.options[3]}"`,
        q.correct + 1, // Convert to 1-based index
        q.category,
        q.difficulty,
      ]);
      
      const csv = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="questions_${new Date().toISOString().split('T')[0]}.csv"`);
      res.send(csv);
    } else {
      res.json({
        questions: questionBank,
        exported: questionBank.length,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Export questions error:', error);
    res.status(500).json({ error: 'Failed to export questions' });
  }
};

// Import questions from CSV
export const importQuestions: RequestHandler = async (req, res) => {
  try {
    const { csvData } = req.body;
    
    if (!csvData) {
      return res.status(400).json({ error: 'CSV data is required' });
    }
    
    const lines = csvData.split('\n').filter((line: string) => line.trim());
    const headers = lines[0].split(',');
    
    const imported = [];
    const errors = [];
    
    for (let i = 1; i < lines.length; i++) {
      try {
        const values = lines[i].split(',');
        const question = {
          id: questionBank.length + imported.length + 1,
          question: values[1]?.replace(/"/g, ''),
          options: [
            values[2]?.replace(/"/g, ''),
            values[3]?.replace(/"/g, ''),
            values[4]?.replace(/"/g, ''),
            values[5]?.replace(/"/g, ''),
          ],
          correct: parseInt(values[6]) - 1, // Convert to 0-based index
          category: values[7] || 'general',
          difficulty: values[8] || 'medium',
        };
        
        if (question.question && question.options.every(opt => opt)) {
          imported.push(question);
          questionBank.push(question);
        } else {
          errors.push(`Line ${i + 1}: Invalid question format`);
        }
      } catch (err) {
        errors.push(`Line ${i + 1}: ${err}`);
      }
    }
    
    res.json({
      success: true,
      imported: imported.length,
      errors: errors.length,
      errorDetails: errors,
      total: questionBank.length,
    });
  } catch (error) {
    console.error('Import questions error:', error);
    res.status(500).json({ error: 'Failed to import questions' });
  }
};

// Get scenarios
export const getScenarios: RequestHandler = async (req, res) => {
  try {
    const { location, type, active } = req.query;
    
    let filteredScenarios = [...scenarios];
    
    if (location) {
      filteredScenarios = filteredScenarios.filter(s => s.location === location);
    }
    
    if (type) {
      filteredScenarios = filteredScenarios.filter(s => s.type === type);
    }
    
    if (active !== undefined) {
      filteredScenarios = filteredScenarios.filter(s => s.active === (active === 'true'));
    }
    
    const stats = {
      total: scenarios.length,
      active: scenarios.filter(s => s.active).length,
      locations: [...new Set(scenarios.map(s => s.location))],
      types: [...new Set(scenarios.map(s => s.type))],
      difficulties: [...new Set(scenarios.map(s => s.difficulty))],
    };

    res.json({
      scenarios: filteredScenarios,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Get scenarios error:', error);
    res.status(500).json({ error: 'Failed to get scenarios' });
  }
};

// Add new scenario
export const addScenario: RequestHandler = async (req, res) => {
  try {
    const { title, description, difficulty, location, type } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }
    
    const newScenario = {
      id: scenarios.length + 1,
      title,
      description,
      difficulty: difficulty || 'medium',
      location: location || 'general',
      type: type || 'general',
      active: true,
    };
    
    scenarios.push(newScenario);
    
    res.json({
      success: true,
      scenario: newScenario,
      message: 'Scenario added successfully',
    });
  } catch (error) {
    console.error('Add scenario error:', error);
    res.status(500).json({ error: 'Failed to add scenario' });
  }
};

// Update scenario
export const updateScenario: RequestHandler = async (req, res) => {
  try {
    const { scenarioId } = req.params;
    const updates = req.body;
    
    const scenarioIndex = scenarios.findIndex(s => s.id === parseInt(scenarioId));
    
    if (scenarioIndex === -1) {
      return res.status(404).json({ error: 'Scenario not found' });
    }
    
    scenarios[scenarioIndex] = { ...scenarios[scenarioIndex], ...updates };
    
    res.json({
      success: true,
      scenario: scenarios[scenarioIndex],
      message: 'Scenario updated successfully',
    });
  } catch (error) {
    console.error('Update scenario error:', error);
    res.status(500).json({ error: 'Failed to update scenario' });
  }
};

// Get content statistics
export const getContentStats: RequestHandler = async (req, res) => {
  try {
    const stats = {
      questions: {
        total: questionBank.length,
        categories: [...new Set(questionBank.map(q => q.category))].length,
        difficulties: {
          easy: questionBank.filter(q => q.difficulty === 'easy').length,
          medium: questionBank.filter(q => q.difficulty === 'medium').length,
          hard: questionBank.filter(q => q.difficulty === 'hard').length,
        },
      },
      scenarios: {
        total: scenarios.length,
        active: scenarios.filter(s => s.active).length,
        locations: [...new Set(scenarios.map(s => s.location))].length,
        types: [...new Set(scenarios.map(s => s.type))].length,
      },
      languages: ['en', 'af', 'zu'],
      lastUpdated: new Date().toISOString(),
    };

    res.json(stats);
  } catch (error) {
    console.error('Get content stats error:', error);
    res.status(500).json({ error: 'Failed to get content statistics' });
  }
};
