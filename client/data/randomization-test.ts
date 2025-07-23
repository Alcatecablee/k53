// Test file to verify that randomization works properly
// This is just for verification purposes and can be deleted after testing

import { generateRandomScenarioTest } from './k53Scenarios';
import { generateRandomTest } from './k53Questions';

// Test function to verify AI scenarios randomization
export const testScenarioRandomization = () => {
  console.log('Testing AI Scenarios Randomization...');
  
  // Generate 5 different test sets with 10 scenarios each
  const testSets = [];
  for (let i = 0; i < 5; i++) {
    const scenarios = generateRandomScenarioTest(10);
    testSets.push(scenarios.map(s => s.id));
  }
  
  // Check if all test sets are different
  const areAllDifferent = testSets.every((set, index) => {
    return testSets.slice(index + 1).every(otherSet => {
      return JSON.stringify(set) !== JSON.stringify(otherSet);
    });
  });
  
  console.log('Test sets generated:', testSets);
  console.log('All test sets are different:', areAllDifferent);
  
  return areAllDifferent;
};

// Test function to verify questions randomization
export const testQuestionRandomization = () => {
  console.log('Testing Questions Randomization...');
  
  // Generate 3 different practice tests
  const testSets = [];
  for (let i = 0; i < 3; i++) {
    const questions = generateRandomTest(2, 3, 3);
    testSets.push(questions.map(q => q.id));
  }
  
  // Check if all test sets are different
  const areAllDifferent = testSets.every((set, index) => {
    return testSets.slice(index + 1).every(otherSet => {
      return JSON.stringify(set) !== JSON.stringify(otherSet);
    });
  });
  
  console.log('Question test sets generated:', testSets);
  console.log('All question test sets are different:', areAllDifferent);
  
  return areAllDifferent;
};

// Run both tests
export const runRandomizationTests = () => {
  console.log('=== Running Randomization Tests ===');
  const scenarioResult = testScenarioRandomization();
  const questionResult = testQuestionRandomization();
  
  console.log('\n=== Results ===');
  console.log('AI Scenarios randomization working:', scenarioResult);
  console.log('Questions randomization working:', questionResult);
  
  return scenarioResult && questionResult;
};
