import { challenge } from './beginner.js';

export const beginner0708Challenges = {
  'level-07-problem-1': challenge(
    'Evaluate a Quadratic Expression',
    'Read integers a, x, b, and c, then print the value of a*x*x + b*x + c.',
    'One line containing four integers a, x, b, and c, separated by spaces.',
    'Print the integer value of a*x*x + b*x + c.',
    ['-100 <= a, x, b, c <= 100.'],
    [
      ['1 2 3 4\n', '14', 'Substituting the values gives 1*2*2 + 3*2 + 4 = 14.'],
      ['-2 -3 4 5\n', '-25', 'The terms are -18, -12, and 5, which sum to -25.'],
      ['0 7 -8 3\n', '-53'],
      ['3 0 9 -4\n', '-4'],
      ['1 10 -2 1\n', '81'],
      ['-1 5 -3 2\n', '-38'],
      ['2 -4 1 -6\n', '22'],
      ['100 100 -100 100\n', '990100']
    ],
    [
      'There are four integers on the input line.',
      'Store the values in the order a, x, b, c.',
      'The first term uses x twice: a*x*x.',
      'Add b*x and c to the first term.',
      'Print only the resulting integer.'
    ],
    'a, x, b, c = map(int, input().split())\nprint(a * x * x + b * x + c)\n',
    'Read the four integers, evaluate each term of the expression, and print their sum.',
    'a, x, b, c = map(int, input().split())\n\n# Evaluate the expression and print the result.\n'
  ),
  'level-07-problem-2': challenge(
    'Distance on a Number Line',
    'Read two integers and print the distance between their positions on a number line.',
    'One line containing two integers a and b, separated by a space.',
    'Print the nonnegative distance |a - b|.',
    ['-1000000 <= a, b <= 1000000.'],
    [
      ['3 9\n', '6', 'The positions 3 and 9 are six units apart.'],
      ['-5 2\n', '7', 'The distance from -5 to 2 is 7, regardless of their order.'],
      ['0 0\n', '0'],
      ['-8 -3\n', '5'],
      ['10 -10\n', '20'],
      ['7 7\n', '0'],
      ['-1000000 1000000\n', '2000000'],
      ['1 -4\n', '5']
    ],
    [
      'Read both positions as integers.',
      'Subtract one position from the other.',
      'A distance cannot be negative.',
      'Python has a built-in function that gives the absolute value of a number.',
      'Print the distance without a label.'
    ],
    'a, b = map(int, input().split())\nprint(abs(a - b))\n',
    'The absolute value of the difference gives the distance in either input order.',
    'a, b = map(int, input().split())\n\n# Find and print the distance between the positions.\n'
  ),
  'level-07-problem-3': challenge(
    'Midpoint of Two Numbers',
    'Read two integers and print the number exactly halfway between them.',
    'One line containing two integers a and b, separated by a space.',
    'Print (a + b) / 2 with exactly one digit after the decimal point.',
    ['-1000 <= a, b <= 1000.'],
    [
      ['2 5\n', '3.5', 'The midpoint is (2 + 5) / 2 = 3.5.'],
      ['-4 1\n', '-1.5', 'The midpoint of -4 and 1 is -1.5.'],
      ['0 0\n', '0.0'],
      ['7 8\n', '7.5'],
      ['-10 -3\n', '-6.5'],
      ['1000 999\n', '999.5'],
      ['-1000 1000\n', '0.0'],
      ['-2 -1\n', '-1.5']
    ],
    [
      'The midpoint is the average of the two values.',
      'Add the two integers before dividing.',
      'Divide the sum by 2, not by the number of input digits.',
      'Format the result to exactly one decimal place.',
      'Keep the .0 when the midpoint is a whole number.'
    ],
    'a, b = map(int, input().split())\nprint(f"{(a + b) / 2:.1f}")\n',
    'Add the two integers, divide their sum by two, and format the result with one decimal place.',
    'a, b = map(int, input().split())\n\n# Find the midpoint and print it to one decimal place.\n'
  ),
  'level-07-problem-4': challenge(
    'Hypotenuse of a Right Triangle',
    'Read the two perpendicular side lengths of a right triangle and print its hypotenuse.',
    'One line containing two nonnegative integer side lengths a and b, separated by a space.',
    'Print sqrt(a*a + b*b) rounded and formatted to exactly two decimal places.',
    ['0 <= a, b <= 1000.', 'The input values are the perpendicular sides, not the hypotenuse.'],
    [
      ['3 4\n', '5.00', 'The square root of 3*3 + 4*4 is 5, formatted as 5.00.'],
      ['5 12\n', '13.00', 'The square root of 25 + 144 is 13.00.'],
      ['0 0\n', '0.00'],
      ['1 1\n', '1.41'],
      ['6 8\n', '10.00'],
      ['9 12\n', '15.00'],
      ['7 24\n', '25.00'],
      ['1000 1000\n', '1414.21']
    ],
    [
      'The hypotenuse is opposite the right angle.',
      'Square each perpendicular side.',
      'Add the two squares together.',
      'Take the square root of that sum.',
      'Format the answer with exactly two digits after the decimal point.'
    ],
    'import math\n\na, b = map(int, input().split())\nprint(f"{math.sqrt(a * a + b * b):.2f}")\n',
    'Use the Pythagorean theorem: the hypotenuse is the square root of the sum of the two side squares.',
    'a, b = map(int, input().split())\n\n# Calculate the hypotenuse and format it to two decimal places.\n'
  ),
  'level-07-problem-5': challenge(
    'Arithmetic Progression Term',
    'Read the first term, the common difference, and a one-based position. Print the term at that position.',
    'One line containing integers first, difference, and position, separated by spaces.',
    'Print first + (position - 1) * difference as an integer.',
    ['-1000000 <= first, difference <= 1000000.', '1 <= position <= 1000.'],
    [
      ['2 3 1\n', '2', 'Position 1 is the first term, so the result is 2.'],
      ['2 3 5\n', '14', 'Four steps of size 3 after 2 give 2 + 4*3 = 14.'],
      ['-4 2 4\n', '2'],
      ['10 -3 3\n', '4'],
      ['7 0 100\n', '7'],
      ['0 5 10\n', '45'],
      ['-1000000 -1000000 1000\n', '-1000000000'],
      ['1000000 1000000 1000\n', '1000000000']
    ],
    [
      'Position numbers start at 1, not 0.',
      'The first term is at position 1.',
      'Count position - 1 equal steps from the first term.',
      'Multiply that step count by the common difference.',
      'Add the result to the first term and print the integer.'
    ],
    'first, difference, position = map(int, input().split())\nprint(first + (position - 1) * difference)\n',
    'Move forward by position - 1 common differences from the first term.',
    'first, difference, position = map(int, input().split())\n\n# Find the requested term and print it.\n'
  ),
  'level-08-problem-1': challenge(
    'String Length',
    'Read one line of text and print how many characters it contains.',
    'One line of text, which may be empty. Count spaces and punctuation as characters.',
    'Print the number of characters in the input line.',
    ['The line contains at most 100 ASCII characters.'],
    [
      ['hello\n', '5', 'The word hello contains five characters.'],
      ['Python 3!\n', '9', 'Python 3! has six letters, one space, one digit, and one punctuation mark.'],
      ['\n', '0'],
      ['  \n', '2'],
      ['OpenAI\n', '6'],
      ['abc123\n', '6'],
      ['a\n', '1'],
      ['spaces matter \n', '14']
    ],
    [
      'Read the whole line as text, not as a number.',
      'Do not split the line into words.',
      'Spaces and punctuation count toward the length.',
      'Python provides a built-in function for finding a string length.',
      'Print only the length.'
    ],
    'text = input()\nprint(len(text))\n',
    'input() reads the line without its newline, and len() counts the remaining characters.',
    'text = input()\n\n# Find and print the number of characters.\n'
  ),
  'level-08-problem-2': challenge(
    'First Character',
    'Read a nonempty line of text and print its first character.',
    'One nonempty line of text. The line may begin with spaces.',
    'Print only the first character, including a space if it is first.',
    ['The line contains 1 to 100 ASCII characters.'],
    [
      ['Python\n', 'P', 'The first character in Python is P.'],
      [' hello\n', ' ', 'The first character is the leading space.'],
      ['Z\n', 'Z'],
      ['abc\n', 'a'],
      ['  leading\n', ' '],
      ['9 lives\n', '9'],
      ['!\n', '!'],
      ['zebra\n', 'z']
    ],
    [
      'Read the entire line as a string.',
      'String positions begin at index 0.',
      'The first character is at index 0.',
      'Do not remove leading spaces before selecting the character.',
      'Print the character without a label.'
    ],
    'text = input()\nprint(text[0])\n',
    'The character at string index 0 is the first character.',
    'text = input()\n\n# Select and print the first character.\n'
  ),
  'level-08-problem-3': challenge(
    'Interior of a String',
    'Read a line of text and print the part between its first and last characters.',
    'One line of text containing at least two characters.',
    'Print the text after removing exactly its first and last characters. The result may be empty.',
    ['The line contains 2 to 100 ASCII characters.'],
    [
      ['Python\n', 'ytho', 'Removing P and n from Python leaves ytho.'],
      ['hello\n', 'ell', 'Removing h and o from hello leaves ell.'],
      ['ab\n', ''],
      [' a \n', 'a'],
      ['abcde\n', 'bcd'],
      ['12345\n', '234'],
      ['a b\n', ' '],
      ['!abc!\n', 'abc']
    ],
    [
      'Read the line as text so spaces are preserved.',
      'String slicing can select a portion of a string.',
      'Start the slice just after index 0.',
      'Stop the slice before the last character.',
      'A two-character input has an empty interior.'
    ],
    'text = input()\nprint(text[1:-1])\n',
    'The slice from index 1 up to, but not including, index -1 keeps exactly the interior characters.',
    'text = input()\n\n# Select the characters between the first and last.\n'
  ),
  'level-08-problem-4': challenge(
    'Join Two Lines with a Space',
    'Read two lines of text and print them on one line with exactly one space between them.',
    'Two lines of text, one per line. Either line may be empty.',
    'Print the first line, one space, then the second line. Preserve all other spaces.',
    ['Each line contains at most 100 ASCII characters.'],
    [
      ['hello\nworld\n', 'hello world', 'The two words are joined with one space.'],
      ['two words\nhere too\n', 'two words here too', 'The original spaces remain, with one new space between the lines.'],
      ['\n\n', ' '],
      ['left\n\n', 'left '],
      ['\nright\n', ' right'],
      ['same\nsame\n', 'same same'],
      ['  leading\ntrailing  \n', '  leading trailing  '],
      ['a\nb\n', 'a b']
    ],
    [
      'Read each line separately with input().',
      'Do not split either line into words.',
      'The separator between the lines is one space.',
      'Keep any spaces already present in either line.',
      'Print the joined text without extra labels.'
    ],
    'first_line = input()\nsecond_line = input()\nprint(first_line + " " + second_line)\n',
    'Read both lines unchanged and concatenate them with exactly one additional space.',
    'first_line = input()\nsecond_line = input()\n\n# Join the lines with one space and print the result.\n'
  ),
  'level-08-problem-5': challenge(
    'Repeat a String N Times',
    'Read a line of text and a nonnegative integer n, then print the text repeated n times.',
    'The first line is a string s, which may contain spaces. The second line is an integer n.',
    'Print s repeated n times with no separators. If n is zero, print an empty line.',
    ['The string contains 1 to 100 ASCII characters.', '0 <= n <= 100.'],
    [
      ['ha\n3\n', 'hahaha', 'Repeating ha three times gives hahaha.'],
      ['Python\n2\n', 'PythonPython', 'The string is written twice with no separator.'],
      ['x\n0\n', ''],
      ['ab\n1\n', 'ab'],
      ['!\n5\n', '!!!!!'],
      ['two words\n2\n', 'two wordstwo words'],
      [' z \n3\n', ' z  z  z '],
      ['abc123\n10\n', 'abc123abc123abc123abc123abc123abc123abc123abc123abc123abc123']
    ],
    [
      'Read the text line separately from the count.',
      'Convert the second line to an integer.',
      'Python can repeat a string with the * operator.',
      'The count tells Python how many copies to make.',
      'Do not add separators between the copies.'
    ],
    'text = input()\ncount = int(input())\nprint(text * count)\n',
    'Multiplying a string by a nonnegative integer repeats it that many times.',
    'text = input()\ncount = int(input())\n\n# Repeat the text count times and print it.\n'
  )
};
