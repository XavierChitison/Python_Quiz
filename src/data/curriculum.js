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
  'Printing values','Reading integer input','Reading string input','Addition','Subtraction','Multiplication','Division','Exponents','Modulo','Arithmetic review',
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
  const formats = level < 61 ? ['stdin'] : (level % 3 === 0 ? ['stdin', 'function'] : ['stdin']);
  const publicTestCases = level <= 10
    ? [{ input: `${n}\n`, output: String(n * (level === 1 ? 1 : level === 2 ? 1 : level === 3 ? 1 : level === 4 ? n + 3 : level === 5 ? n - 3 : level === 6 ? n * 3 : level === 7 ? Math.floor(n / 2) : level === 8 ? n * n : level === 9 ? n % 4 : n + n * 2)) }]
    : [{ input: `${n}\n`, output: String(n) }];
  return {
    id, title: `${topic} — Practice ${index}`, level, difficulty, topic,
    tags: [topic.toLowerCase().replaceAll(' ', '-')],
    learningObjectives: [`Practice ${topic.toLowerCase()} with a complete input/output solution.`],
    prerequisites: level === 1 ? [] : [`level-${String(level-1).padStart(2,'0')}`],
    description: `Solve a focused ${topic.toLowerCase()} exercise. Read the input, apply the concept for this level, and print the required result.`,
    inputFormat: 'One or more values are supplied on standard input.',
    outputFormat: 'Print exactly one result per input case.',
    constraints: ['Follow the output format exactly.', 'Do not print prompts or labels.'],
    examples: [{ input: publicTestCases[0].input.trim(), output: publicTestCases[0].output }],
    supportedFormats: formats,
    starterCode: { stdin: starter(level % 3 === 0 ? 'stdin' : 'stdin'), function: starter('function') },
    publicTestCases,
    hiddenTestCases: [
      { input: `${n + 1}\n`, output: String(n + 1) },
      { input: '1\n', output: '1' },
      { input: '0\n', output: '0' },
      { input: '12\n', output: '12' },
      { input: '100\n', output: '100' }
    ],
    hints: [
      'Read the input format before choosing an approach.',
      `Use the core Python concept associated with ${topic}.`,
      'Break the problem into input, processing, and output steps.',
      'Use a small example to test the partial implementation.',
      'Run several edge cases after completing the solution.'
    ],
    referenceSolution: 'import sys\n\nfor line in sys.stdin:\n    value = line.strip()\n    if value:\n        print(value)\n',
    alternativeSolutions: [],
    explanation: `The solution should preserve the expected behavior for ${topic.toLowerCase()}, while handling whitespace and edge cases consistently.`,
    commonMistakes: ['Printing extra text', 'Using the wrong input type', 'Missing edge cases'],
    complexity: { time: 'O(n)', space: 'O(1)' },
    xpReward: level <= 10 ? 10 : level <= 30 ? 15 : level <= 50 ? 25 : level <= 70 ? 40 : 60,
    estimatedMinutes: level <= 30 ? 5 : level <= 70 ? 10 : 15
  };
}

export const levels = Array.from({ length: 100 }, (_, i) => {
  const level = i + 1;
  const stageIndex = Math.floor(i / 10);
  return {
    number: level,
    title: levelTopics[i],
    stage: stageIndex + 1,
    stageTitle: stageNames[stageIndex][0],
    topic: levelTopics[i],
    description: stageNames[stageIndex][1],
    requiredSolved: 4,
    xpAvailable: 25 + level * 2,
    problems: Array.from({ length: 5 }, (_, j) => makeProblem(level, j + 1))
  };
});

export const problems = levels.flatMap(level => level.problems);
