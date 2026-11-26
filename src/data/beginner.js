const starter = 'import sys\n\n# Read the input and write your solution here.\n';

function challenge(title, description, inputFormat, outputFormat, constraints, cases, hints, referenceSolution, explanation) {
  const examples = cases.slice(0, 2).map(([input, output, explanation]) => ({ input, output, explanation }));
  return {
    title,
    description: `${description} Example 1: ${examples[0].explanation} Example 2: ${examples[1].explanation}`,
    learningObjectives: [description],
    inputFormat,
    outputFormat,
    constraints,
    examples,
    starterCode: { stdin: starter },
    publicTestCases: cases.slice(0, 3).map(([input, output]) => ({ input, output })),
    hiddenTestCases: cases.slice(3).map(([input, output]) => ({ input, output })),
    hints,
    referenceSolution,
    explanation,
    contentRevision: 1
  };
}

export const beginnerChallenges = {
  'level-01-problem-2': challenge(
    'Echo a Line',
    'Read one line of text and print the same text without adding a label. Preserve spaces and punctuation.',
    'One line of text, which may be empty.',
    'Print the input line unchanged.',
    ['The line contains at most 100 characters.', 'Do not remove leading or trailing spaces.'],
    [
      ['Hello!\n', 'Hello!', 'Hello! is printed unchanged.'],
      ['  hi  \n', '  hi  ', 'The spaces around hi are kept.'],
      ['\n', '', 'An empty line stays empty.'],
      ['A\n', 'A'], ['123\n', '123'], ['a b\n', 'a b'], ['!\n', '!'], ['end  \n', 'end  ']
    ],
    ['The task is to copy text, not convert it to a number.', 'Read a whole line with input().', 'Keep the characters returned by input unchanged.', 'Pass the line to print().', 'Avoid strip(), which removes useful spaces.'],
    'line = input()\nprint(line)\n',
    'input() reads the line without its newline and print() writes the same text followed by a newline.'
  ),
  'level-01-problem-3': challenge(
    'Double an Integer',
    'Read one integer and print twice its value.',
    'One integer n.',
    'Print 2 times n as an integer.',
    ['-10000 <= n <= 10000.'],
    [
      ['5\n', '10', 'Doubling 5 gives 10.'],
      ['-4\n', '-8', 'Doubling -4 gives -8.'],
      ['0\n', '0'], ['1\n', '2'], ['-1\n', '-2'], ['37\n', '74'], ['10000\n', '20000'], ['-10000\n', '-20000']
    ],
    ['The output is twice the input.', 'Convert the input text to an integer.', 'Multiply the integer by two.', 'Store the product or print it directly.', 'Check zero and a negative value.'],
    'number = int(input())\nprint(number * 2)\n',
    'Convert the input to an integer and multiply it by 2.'
  ),
  'level-01-problem-4': challenge(
    'Square an Integer',
    'Read one integer and print its square: the integer multiplied by itself.',
    'One integer n.',
    'Print n squared as an integer.',
    ['-10000 <= n <= 10000.'],
    [
      ['4\n', '16', '4 multiplied by 4 equals 16.'],
      ['-3\n', '9', 'Multiplying -3 by itself gives 9.'],
      ['0\n', '0'], ['1\n', '1'], ['-1\n', '1'], ['12\n', '144'], ['10000\n', '100000000'], ['-8\n', '64']
    ],
    ['A square uses the same integer twice.', 'Read the input as an integer.', 'Multiply the value by itself.', 'Python also supports the ** exponent operator.', 'A negative input has a nonnegative square.'],
    'number = int(input())\nprint(number * number)\n',
    'Multiplying the integer by itself produces its square.'
  ),
  'level-01-problem-5': challenge(
    'Add Two Integers',
    'Read two integers and print their sum.',
    'Two integers a and b on one line, separated by whitespace.',
    'Print the integer a + b.',
    ['-10000 <= a, b <= 10000.'],
    [
      ['3 5\n', '8', '3 plus 5 equals 8.'],
      ['-7 2\n', '-5', 'Adding 2 to -7 gives -5.'],
      ['0 0\n', '0'], ['-3 -4\n', '-7'], ['1 -1\n', '0'], ['10000 10000\n', '20000'], ['-10000 2\n', '-9998'], ['42 8\n', '50']
    ],
    ['Both values are on the same line.', 'Split the input line into two pieces.', 'Convert both pieces to integers.', 'Add the two integers.', 'Check inputs with different signs.'],
    'a, b = map(int, input().split())\nprint(a + b)\n',
    'Split the line, convert both values to integers, and print their sum.'
  ),
  'level-02-problem-1': challenge(
    'Subtract Two Integers',
    'Read two integers and subtract the second from the first.',
    'Two integers a and b on one line, separated by whitespace.',
    'Print a - b.',
    ['-10000 <= a, b <= 10000.'],
    [
      ['9 4\n', '5', 'Subtracting 4 from 9 gives 5.'],
      ['2 7\n', '-5', 'Subtracting 7 from 2 gives -5.'],
      ['0 0\n', '0'], ['-3 2\n', '-5'], ['5 -2\n', '7'], ['-3 -4\n', '1'], ['10000 -10000\n', '20000'], ['-10000 10000\n', '-20000']
    ],
    ['The order of subtraction matters.', 'Read two integers from one line.', 'Subtract the second value from the first.', 'Print the difference without labels.', 'Try a case whose result is negative.'],
    'a, b = map(int, input().split())\nprint(a - b)\n',
    'Read the two integers in order and print the first minus the second.'
  ),
  'level-02-problem-2': challenge(
    'Multiply Two Integers',
    'Read two integers and print their product.',
    'Two integers a and b on one line, separated by whitespace.',
    'Print a multiplied by b.',
    ['-10000 <= a, b <= 10000.'],
    [
      ['3 4\n', '12', '3 times 4 is 12.'],
      ['-5 2\n', '-10', '-5 times 2 is -10.'],
      ['0 8\n', '0'], ['-2 -3\n', '6'], ['1 -1\n', '-1'], ['10000 10000\n', '100000000'], ['-10000 1\n', '-10000'], ['7 9\n', '63']
    ],
    ['A product is the result of multiplication.', 'Parse both values as integers.', 'Use the * operator.', 'Print their product.', 'A zero factor always gives zero.'],
    'a, b = map(int, input().split())\nprint(a * b)\n',
    'Convert both inputs to integers and multiply them.'
  ),
  'level-02-problem-3': challenge(
    'Integer Quotient',
    'Divide the first integer by the second and print the quotient rounded down toward negative infinity.',
    'Two integers a and b on one line; b is not zero.',
    'Print the floor quotient a // b.',
    ['-10000 <= a, b <= 10000.', 'b is nonzero.'],
    [
      ['17 5\n', '3', '17 divided by 5 is 3.4, which rounds down to 3.'],
      ['-7 3\n', '-3', '-7 divided by 3 rounds down to -3, not -2.'],
      ['0 4\n', '0'], ['12 3\n', '4'], ['7 -3\n', '-3'], ['-8 -3\n', '2'], ['1 10000\n', '0'], ['-10000 1\n', '-10000']
    ],
    ['The answer is an integer rounded down.', 'Read both integers in their given order.', 'Python uses // for floor division.', 'Do not use / and then truncate the result.', 'Check a negative dividend.'],
    'a, b = map(int, input().split())\nprint(a // b)\n',
    'Python floor division // rounds the quotient toward negative infinity.'
  ),
  'level-02-problem-4': challenge(
    'Remainder After Division',
    'Read two nonnegative integers and print the remainder after dividing the first by the second.',
    'Two integers a and b on one line.',
    'Print the remainder a % b.',
    ['0 <= a <= 10000.', '1 <= b <= 10000.'],
    [
      ['17 5\n', '2', '17 is three groups of 5 with 2 left over.'],
      ['12 3\n', '0', '12 divides exactly into groups of 3, leaving 0.'],
      ['0 1\n', '0'], ['1 2\n', '1'], ['10000 3\n', '1'], ['42 1\n', '0'], ['9 10\n', '9'], ['9999 100\n', '99']
    ],
    ['A remainder is what remains after making full groups.', 'The second integer is the divisor.', 'Python uses % for the remainder.', 'Apply % to the first and second integers in order.', 'An exact division leaves zero.'],
    'a, b = map(int, input().split())\nprint(a % b)\n',
    'The % operator gives the remainder of dividing a by the positive divisor b.'
  ),
  'level-02-problem-5': challenge(
    'Average of Three Integers',
    'Read three integers and print their arithmetic mean, rounded to exactly two digits after the decimal point.',
    'Three integers a, b and c on one line, separated by whitespace.',
    'Print (a + b + c) / 3 using exactly two decimal places.',
    ['-1000 <= a, b, c <= 1000.'],
    [
      ['3 6 9\n', '6.00', 'The sum is 18, and 18 divided by 3 is 6.00.'],
      ['1 2 2\n', '1.67', 'The mean is 5/3, which rounds to 1.67.'],
      ['0 0 0\n', '0.00'], ['-3 0 0\n', '-1.00'], ['-1 -2 -2\n', '-1.67'], ['1000 1000 1000\n', '1000.00'], ['3 0 0\n', '1.00'], ['4 4 3\n', '3.67']
    ],
    ['The mean is the sum divided by the number of values.', 'Read three integers from the line.', 'Add them and divide by three.', 'Format the result with two decimal places.', 'Keep trailing zeroes in the output.'],
    'a, b, c = map(int, input().split())\nprint(f\"{(a + b + c) / 3:.2f}\")\n',
    'Add the three integers, divide by three, and format the result to two decimal places.'
  )
};
