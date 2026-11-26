import { beginnerChallenges } from './beginner.js';
import { beginner0708Challenges } from './beginner-07-08.js';
import { beginner0910Challenges } from './beginner-09-10.js';

export const stageNames = [
  ['Python Fundamentals', 'Printing, input, arithmetic, and expressions'],
  ['Conditions', 'Comparisons and conditional problem-solving'],
  ['Loops', 'Range, counting, accumulation, and iteration'],
  ['Strings', 'Character operations, slicing, and text analysis'],
  ['Lists', 'Array fundamentals and sequence algorithms'],
  ['Dictionaries and Sets', 'Keyed data, frequencies, and groups'],
  ['Functions', 'Reusable code and intermediate algorithms'],
  ['Interview Patterns', 'Two pointers, windows, sums, and search'],
  ['Data Structures', 'Stacks, queues, linked lists, and trees'],
  ['Advanced Algorithms', 'Graphs, recursion, greedy, and dynamic programming']
];

export const levelTopics = [
  'Printing values','Reading integer input','Geometry calculations','Unit conversions','Everyday calculations','Working with digits','Mathematical expressions','Basic string operations','String transformations','Combining fundamentals',
  'Equality comparisons','Greater-than comparisons','Less-than comparisons','Even and odd','Positive and negative','Larger of two','Smaller of two','Multiple conditions','Boolean operators','Conditions review',
  'For loops','range()','Counting iterations','Summing numbers','Counting evens','Counting odds','Multiplication tables','While loops','Break and continue','Loops review',
  'String length','Character indexing','String slicing','Uppercase and lowercase','Counting characters','Counting vowels','Counting consonants','Reversing strings','Palindromes','String review',
  'Creating lists','List indexing','Summing lists','List averages','Finding maximum','Finding minimum','Searching targets','Counting occurrences','Second largest','List review',
  'Dictionary basics','Dictionary values','Updating dictionaries','Character frequency','Word frequency','Repeated elements','Set basics','Set intersections','Grouping data','Hash review',
  'Defining functions','Parameters','Return values','Multiple functions','Nested loops','Matrices','Basic sorting','Custom sorting','Algorithm design','Complexity',
  'Two-pointer basics','Two-sum','Sorted arrays','Sliding windows','Fixed windows','Variable windows','Prefix sums','Binary search','Intervals','Interview review',
  'Stacks','Stack problems','Queues','Linked list basics','Linked list traversal','Linked list manipulation','Recursion basics','Recursive problems','Binary trees','Tree traversal',
  'Graphs','Breadth-first search','Depth-first search','Backtracking','Combinations','Greedy algorithms','Dynamic programming','One-dimensional DP','Advanced DP','Final assessment'
];

const starter = (kind = 'stdin') => kind === 'function'
  ? 'class Solution:\n    def solve(self, value):\n        # Write your solution here\n        pass\n'
  : 'import sys\n\nfor line in sys.stdin:\n    # Write your code here\n    pass\n';

function makeProblem(level, index) {
  const topic = levelTopics[level - 1];
  const difficulty = level <= 10 ? 'Very Easy' : level <= 30 ? 'Beginner' : level <= 50 ? 'Easy' : level <= 70 ? 'Intermediate' : level <= 85 ? 'Challenging' : 'Hard';
  const id = `level-${String(level).padStart(2,'0')}-problem-${index}`;
  const seed = level * 100 + index;
  const n = 5 + ((seed * 7) % 20);
  const stdinNumbers = [n, n + 3, n + 11];
  const publicTestCases = level <= 10
    ? stdinNumbers.map(value => {
        let output;
        if (level === 1 || level === 2) output = value;
        else if (level === 3) output = value;
        else if (level === 4) output = value + 3;
        else if (level === 5) output = value - 3;
        else if (level === 6) output = value * 3;
        else if (level === 7) output = Math.floor(value / 2);
        else if (level === 8) output = value * value;
        else if (level === 9) output = value % 4;
        else output = value + value * 2;
        return {input:`${value}\n`, output:String(output)};
      })
    : stdinNumbers.map(value => ({input:`${value}\n`, output:String(value)}));
  let referenceSolution = 'import sys\n\nfor line in sys.stdin:\n    value = line.strip()\n    if value:\n        print(value)\n';
  if (level === 4) referenceSolution = 'import sys\n\nfor line in sys.stdin:\n    value = int(line)\n    print(value + 3)\n';
  if (level === 5) referenceSolution = 'import sys\n\nfor line in sys.stdin:\n    value = int(line)\n    print(value - 3)\n';
  if (level === 6) referenceSolution = 'import sys\n\nfor line in sys.stdin:\n    value = int(line)\n    print(value * 3)\n';
  if (level === 7) referenceSolution = 'import sys\n\nfor line in sys.stdin:\n    value = int(line)\n    print(value // 2)\n';
  if (level === 8) referenceSolution = 'import sys\n\nfor line in sys.stdin:\n    value = int(line)\n    print(value ** 2)\n';
  if (level === 9) referenceSolution = 'import sys\n\nfor line in sys.stdin:\n    value = int(line)\n    print(value % 4)\n';
  if (level === 10) referenceSolution = 'import sys\n\nfor line in sys.stdin:\n    value = int(line)\n    print(value + value * 2)\n';
  const problem = {
    id, title: `${topic} — Practice ${index}`, level, difficulty, topic,
    tags: [topic.toLowerCase().replaceAll(' ', '-')],
    learningObjectives: [`Practice ${topic.toLowerCase()} with a complete input/output solution.`],
    prerequisites: level === 1 ? [] : [`level-${String(level-1).padStart(2,'0')}`],
    description: `Solve a focused ${topic.toLowerCase()} exercise. Read the input, apply the concept for this level, and print the required result.`,
    inputFormat: 'One or more values are supplied on standard input.',
    outputFormat: 'Print exactly one result per input case.',
    constraints: ['Follow the output format exactly.', 'Do not print prompts or labels.'],
    examples: [{ input: publicTestCases[0].input.trim(), output: publicTestCases[0].output }],
    supportedFormats: ['stdin'],
    starterCode: { stdin: starter(level % 3 === 0 ? 'stdin' : 'stdin'), function: starter('function') },
    publicTestCases,
    hiddenTestCases: [n - 1, 0, 1, 12, 100].map(value => {
      let output = value;
      if (level === 4) output = value + 3;
      else if (level === 5) output = value - 3;
      else if (level === 6) output = value * 3;
      else if (level === 7) output = Math.floor(value / 2);
      else if (level === 8) output = value * value;
      else if (level === 9) output = value % 4;
      else if (level === 10) output = value + value * 2;
      return {input:`${value}\n`, output:String(output)};
    }),
    hints: [
      'Read the input format before choosing an approach.',
      `Use the core Python concept associated with ${topic}.`,
      'Break the problem into input, processing, and output steps.',
      'Use a small example to test the partial implementation.',
      'Run several edge cases after completing the solution.'
    ],
    referenceSolution,
    alternativeSolutions: [],
    explanation: `The solution should preserve the expected behavior for ${topic.toLowerCase()}, while handling whitespace and edge cases consistently.`,
    commonMistakes: ['Printing extra text', 'Using the wrong input type', 'Missing edge cases'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    xpReward: level <= 10 ? 10 : level <= 30 ? 15 : level <= 50 ? 25 : level <= 70 ? 40 : 60,
    estimatedMinutes: level <= 30 ? 5 : level <= 70 ? 10 : 15
  };
  const replacement = beginnerChallenges[id] || beginner0708Challenges[id] || beginner0910Challenges[id];
  if (replacement) Object.assign(problem, replacement);
  return problem;
}

export const levels = Array.from({ length: 100 }, (_, i) => {
  const level = i + 1;
  const stageIndex = Math.floor(i / 10);
  return {
    id: `level-${String(level).padStart(2,'0')}`,
    number: level,
    title: levelTopics[i],
    stage: stageIndex + 1,
    stageTitle: stageNames[stageIndex][0],
    topic: levelTopics[i],
    description: stageNames[stageIndex][1],
    learningObjectives: [`Apply ${levelTopics[i].toLowerCase()} in a standard input/output Python program.`],
    difficulty: level <= 10 ? 'Absolute beginner' : level <= 20 ? 'Beginner' : level <= 60 ? 'Beginner to intermediate' : level <= 80 ? 'Intermediate' : 'Advanced',
    requiredSolved: 4,
    xpAvailable: 25 + level * 2,
    problems: Array.from({ length: 5 }, (_, j) => makeProblem(level, j + 1))
  };
});

export const problems = levels.flatMap(level => level.problems);
