import { challenge } from './beginner.js';

const matrixInput = 'First line: R C. Next R lines: C space-separated integers per row.';
const matrixLimits = ['1 <= R, C <= 20.', 'Matrix entries are integers from -100 to 100.'];
const matrixStarter = 'r, c = map(int, input().split())\nmatrix = [list(map(int, input().split())) for _ in range(r)]\n\n# Compute and print the result.\n';
const squareInput = 'First line: n. Next n lines: n space-separated integers per row.';
const squareLimits = ['1 <= n <= 20.', 'Matrix entries are integers from -100 to 100.'];
const squareStarter = 'n = int(input())\nmatrix = [list(map(int, input().split())) for _ in range(n)]\n\n# Compute and print the result.\n';
const matrixOutput = 'Print the result as rows of space-separated integers, one row per line.';

export const functions6165Challenges = {
  'level-61-problem-1': challenge(
    'Day of the Gregorian Year',
    'Define a function that returns the one-based day number of a valid Gregorian date within its year.',
    'One line containing year month day as three space-separated integers.',
    'Print the day number, counting January 1 as day 1.',
    ['1 <= year <= 9999.', 'The input is a valid Gregorian date.'],
    [
      ['2000 3 1\n', '61', 'The leap year 2000 has 31 days in January and 29 in February, so March 1 is day 61.'],
      ['1900 3 1\n', '60', 'The century year 1900 is not a leap year, so March 1 is day 60.'],
      ['2024 12 31\n', '366'], ['2023 12 31\n', '365'], ['2021 1 1\n', '1'], ['2024 2 29\n', '60'], ['2023 7 4\n', '185'], ['1 1 31\n', '31']
    ],
    ['The day number includes all days in preceding months.', 'February has 29 days in a Gregorian leap year.', 'A leap year is divisible by 4, except centuries unless divisible by 400.', 'Add the lengths of the months before the given month.', 'Add the day within the current month and return the total.'],
    `def day_of_year(year, month, day):
    leap = year % 4 == 0 and (year % 100 != 0 or year % 400 == 0)
    lengths = [31, 29 if leap else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    return sum(lengths[:month - 1]) + day

year, month, day = map(int, input().split())
print(day_of_year(year, month, day))
`,
    'Add the current day to the lengths of earlier months, using the Gregorian leap-year rule for February.',
    'year, month, day = map(int, input().split())\n\n# Define the function and print its result.\n'
  ),
  'level-61-problem-2': challenge(
    'Classify a Compass Turn',
    'Define a function that classifies the turn from one compass direction to another as STRAIGHT, RIGHT, BACK, or LEFT. The clockwise order is N, E, S, W.',
    'Two direction letters on one line: starting direction followed by ending direction.',
    'Print STRAIGHT for no turn, RIGHT for a clockwise quarter-turn, BACK for a half-turn, or LEFT for a counterclockwise quarter-turn.',
    ['Both directions are one of N, E, S, W.'],
    [
      ['N E\n', 'RIGHT', 'From north, east is one clockwise quarter-turn away.'],
      ['E N\n', 'LEFT', 'From east, north is one counterclockwise quarter-turn away.'],
      ['N N\n', 'STRAIGHT'], ['N S\n', 'BACK'], ['E W\n', 'BACK'], ['S W\n', 'RIGHT'], ['W S\n', 'LEFT'], ['W N\n', 'RIGHT']
    ],
    ['Arrange the four directions in clockwise order.', 'Find the starting and ending positions in that order.', 'Subtract the starting position from the ending position.', 'Use modulo 4 to handle the wrap from W back to N.', 'Map offsets 0, 1, 2 and 3 to STRAIGHT, RIGHT, BACK and LEFT.'],
    `def classify_turn(start, end):
    directions = 'NESW'
    offset = (directions.index(end) - directions.index(start)) % 4
    return ('STRAIGHT', 'RIGHT', 'BACK', 'LEFT')[offset]

start, end = input().split()
print(classify_turn(start, end))
`,
    'The clockwise index difference modulo four identifies which of the four turns is needed.',
    'start, end = input().split()\n\n# Define the function and print its result.\n'
  ),
  'level-61-problem-3': challenge(
    'Normalize a Rational Number',
    'Define a function that reduces a numerator and nonzero denominator to lowest terms with a positive denominator.',
    'Two integers numerator and denominator on one line.',
    'Print the reduced numerator and positive denominator separated by one space.',
    ['-10000 <= numerator, denominator <= 10000.', 'The denominator is nonzero.'],
    [
      ['18 -24\n', '-3 4', 'Divide both values by 6 and move the negative sign to the numerator.'],
      ['0 -8\n', '0 1', 'Zero reduces to 0/1 regardless of the denominator sign.'],
      ['7 3\n', '7 3'], ['-12 -18\n', '2 3'], ['-6 9\n', '-2 3'], ['5 -1\n', '-5 1'], ['10000 10000\n', '1 1'], ['1 -10000\n', '-1 10000']
    ],
    ['Common factors can be removed from numerator and denominator.', 'Use their greatest common divisor, including when the numerator is zero.', 'Divide both integers by that divisor.', 'If the denominator is negative, negate both values.', 'Return both results together.'],
    `from math import gcd

def normalize(numerator, denominator):
    factor = gcd(numerator, denominator)
    numerator //= factor
    denominator //= factor
    if denominator < 0:
        numerator = -numerator
        denominator = -denominator
    return numerator, denominator

a, b = map(int, input().split())
print(*normalize(a, b))
`,
    'Divide by the nonnegative GCD and move any denominator sign to the numerator.',
    'a, b = map(int, input().split())\n\n# Define the function and print its result.\n'
  ),
  'level-61-problem-4': challenge(
    'Default Greeting Formatter',
    'Define a function that combines a greeting and a name as greeting, comma, space, name, exclamation mark. Its default greeting is Hello.',
    'First line: a name. Second line: a greeting, or an empty line to use the default.',
    'Print the formatted greeting on one line.',
    ['The name and nonempty greeting contain 1 to 30 ASCII letters each.', 'The second line may be empty.'],
    [
      ['Mira\n\n', 'Hello, Mira!', 'The empty second line selects the default Hello.'],
      ['Kai\nWelcome\n', 'Welcome, Kai!', 'The supplied Welcome replaces the default.'],
      ['A\nHi\n', 'Hi, A!'], ['Sam\n\n', 'Hello, Sam!'], ['Zoe\nGreetings\n', 'Greetings, Zoe!'], ['abc\nhello\n', 'hello, abc!'], ['X\nHello\n', 'Hello, X!'], ['Lee\nBye\n', 'Bye, Lee!']
    ],
    ['Give the formatting function a default greeting parameter.', 'Read both input lines, allowing the second to be empty.', 'When it is empty call the function without the greeting argument.', 'Otherwise pass the supplied greeting.', 'Insert the comma, space and exclamation mark exactly.'],
    `def greet(name, greeting='Hello'):
    return greeting + ', ' + name + '!'

name = input()
greeting = input()
if greeting:
    print(greet(name, greeting))
else:
    print(greet(name))
`,
    'The optional argument overrides the default only when a greeting is supplied.',
    'name = input()\ngreeting = input()\n\n# Define the formatter and print the greeting.\n'
  ),
  'level-61-problem-5': challenge(
    'Compose Two Arithmetic Functions',
    'Define increment and square functions. Apply increment then square, and square then increment, to the same input.',
    'One integer n.',
    'Print the increment-then-square result followed by the square-then-increment result, separated by a space.',
    ['-1000 <= n <= 1000.'],
    [
      ['3\n', '16 10', 'Incrementing first gives 4 squared = 16; squaring first gives 9 plus 1 = 10.'],
      ['-2\n', '1 5', 'Incrementing first gives (-1) squared = 1; squaring first gives 4 plus 1 = 5.'],
      ['0\n', '1 1'], ['-1\n', '0 2'], ['1\n', '4 2'], ['2\n', '9 5'], ['-3\n', '4 10'], ['1000\n', '1002001 1000001']
    ],
    ['Write one function that adds one.', 'Write another that squares its argument.', 'For the first result pass the increment result to the square function.', 'For the second pass the square result to the increment function.', 'Print the results in that order.'],
    `def increment(x):
    return x + 1

def square(x):
    return x * x

n = int(input())
print(square(increment(n)), increment(square(n)))
`,
    'Nested calls apply the inner function first, so reversing the nesting changes the composition.',
    'n = int(input())\n\n# Define the functions and print both compositions.\n'
  ),
  'level-62-problem-1': challenge(
    'Sum Pairwise Absolute Differences',
    'Define a function accepting any number of integer positional arguments and returning the sum of absolute differences over all pairs of distinct argument positions. Count each pair once.',
    'One line containing zero or more space-separated integers; an empty line means no arguments.',
    'Print the pairwise difference sum.',
    ['At most 30 integers.', 'Each integer is between -1000 and 1000 inclusive.'],
    [
      ['1 4 7\n', '12', 'The three differences are 3, 6 and 3, totaling 12.'],
      ['-2 -2 3\n', '10', 'Equal positions contribute 0, and the other two pairs contribute 5 each.'],
      ['\n', '0'], ['5\n', '0'], ['1 1\n', '0'], ['-4 4\n', '8'], ['0 1 2 3\n', '10'], ['-1000 1000 0\n', '4000']
    ],
    ['Collect positional arguments using *args.', 'Pairs are based on positions, even when values match.', 'For each position i, consider positions j greater than i.', 'Add abs(args[i] - args[j]) for each pair.', 'Fewer than two arguments produce an empty sum of zero.'],
    `def pairwise(*args):
    total = 0
    for i in range(len(args)):
        for j in range(i + 1, len(args)):
            total += abs(args[i] - args[j])
    return total

values = list(map(int, input().split()))
print(pairwise(*values))
`,
    'Visit each ordered index pair i < j once and accumulate its absolute difference.',
    'values = list(map(int, input().split()))\n\n# Define the variadic function and print its result.\n'
  ),
  'level-62-problem-2': challenge(
    'Count Adjacent Predicate Pairs',
    'Define a function that counts adjacent pairs whose two values both pass a supplied predicate. Pairs may overlap. Select the predicate from positive, even, or negative according to the input.',
    'First line: positive, even, or negative. Second line: zero or more space-separated integers.',
    'Print the number of qualifying adjacent pairs. Zero is even but neither positive nor negative.',
    ['At most 50 integers.', 'Each integer is between -1000 and 1000 inclusive.'],
    [
      ['positive\n-2 0 3 4\n', '1', 'Only the adjacent pair 3 and 4 is entirely positive.'],
      ['even\n-2 0 2 3\n', '2', 'Both -2, 0 and 0, 2 qualify, sharing the middle value.'],
      ['negative\n-2 -1 3 -1\n', '1'], ['positive\n\n', '0'], ['even\n1 3 5\n', '0'], ['negative\n0 1\n', '0'], ['positive\n1 1 1\n', '2'], ['even\n-3 -4\n', '0']
    ],
    ['A predicate is a function returning true or false.', 'Create one predicate for each named rule.', 'Choose the predicate matching the first input line.', 'Visit each adjacent pair, including overlapping pairs.', 'Count a pair only when the predicate accepts both values.'],
    `def count_adjacent(values, predicate):
    count = 0
    for i in range(len(values) - 1):
        if predicate(values[i]) and predicate(values[i + 1]):
            count += 1
    return count

predicates = {'positive': lambda x: x > 0, 'even': lambda x: x % 2 == 0, 'negative': lambda x: x < 0}
name = input()
values = list(map(int, input().split()))
print(count_adjacent(values, predicates[name]))
`,
    'Select a predicate and count each adjacent pair for which it accepts both values.',
    'name = input()\nvalues = list(map(int, input().split()))\n\n# Define predicates and a counting function.\n'
  ),
  'level-62-problem-3': challenge(
    'Apply a Function to Each Value',
    'Define a function that applies a supplied callback to each value and returns a new list. The chosen callback is double, negate, or square.',
    'First line: double, negate, or square. Second line: zero or more space-separated integers.',
    'Print transformed values in their original order, separated by spaces. Print an empty line for an empty list.',
    ['At most 50 integers.', 'Each integer is between -1000 and 1000 inclusive.'],
    [
      ['double\n2 -3 0\n', '4 -6 0', 'Each value is multiplied by two.'],
      ['square\n-2 3 -2\n', '4 9 4', 'Each occurrence is squared without changing order.'],
      ['negate\n1 -2 0\n', '-1 2 0'], ['double\n\n', ''], ['square\n0\n', '0'], ['negate\n-1 -1\n', '1 1'], ['double\n1000\n', '2000'], ['square\n1 -1\n', '1 1']
    ],
    ['A callback is a function passed as an argument.', 'Define the three transformations.', 'Choose the callback using the first line.', 'Build a new list by calling it on each input value.', 'Print the new list with spaces between values.'],
    `def apply_each(values, callback):
    return [callback(value) for value in values]

operations = {'double': lambda x: 2 * x, 'negate': lambda x: -x, 'square': lambda x: x * x}
name = input()
values = list(map(int, input().split()))
print(*apply_each(values, operations[name]))
`,
    'Select the callback, then call it independently for each input value.',
    'name = input()\nvalues = list(map(int, input().split()))\n\n# Define callbacks and apply one to the list.\n'
  ),
  'level-62-problem-4': challenge(
    'Longest Increasing Callback Run',
    'Define a function that takes a list and a callback and returns the length of the longest contiguous run whose callback results strictly increase. Select identity, absolute value, square, or negation from the input.',
    'First line: identity, abs, square, or neg. Second line: zero or more space-separated integers.',
    'Print the longest run length, or 0 for an empty list. Equal callback results break a strictly increasing run.',
    ['At most 50 integers.', 'Each integer is between -1000 and 1000 inclusive.'],
    [
      ['identity\n1 3 2 4 5\n', '3', 'The longest increasing contiguous run is 2, 4, 5.'],
      ['abs\n-4 -2 -1 0 2 3\n', '3', 'Absolute values are 4, 2, 1, 0, 2, 3; the final run 0, 2, 3 has length 3.'],
      ['square\n-2 -1 1 2\n', '2'], ['neg\n4 3 2 1\n', '4'], ['identity\n\n', '0'], ['identity\n7 7 7\n', '1'], ['abs\n0 -1 2 -3 4\n', '5'], ['square\n-2\n', '1']
    ],
    ['Choose the callback named on the first line.', 'Compare callback results at adjacent positions, not the original values.', 'Extend the current run only when the new result is strictly larger.', 'Otherwise start a new run at the current position.', 'Track the longest length, returning zero when there are no values.'],
    `def longest_run(values, callback):
    best = current = 0
    previous = None
    for value in values:
        transformed = callback(value)
        if previous is not None and transformed > previous:
            current += 1
        else:
            current = 1
        best = max(best, current)
        previous = transformed
    return best

operations = {'identity': lambda x: x, 'abs': abs, 'square': lambda x: x * x, 'neg': lambda x: -x}
name = input()
values = list(map(int, input().split()))
print(longest_run(values, operations[name]))
`,
    'Track the current and longest runs while comparing successive callback results.',
    'name = input()\nvalues = list(map(int, input().split()))\n\n# Define the callbacks and find the longest run.\n'
  ),
  'level-62-problem-5': challenge(
    'Compose a Function Pipeline',
    'Define a function that applies a sequence of unary functions to an initial integer in order. Operations are inc (add one), double, and neg (change sign).',
    'First line: initial integer. Second line: zero or more operation names separated by spaces.',
    'Print the final integer. An empty pipeline leaves the initial value unchanged.',
    ['-100 <= initial value <= 100.', 'At most 10 operations.', 'Each operation is inc, double, or neg.'],
    [
      ['2\ninc double neg\n', '-6', '2 becomes 3, then 6, then -6.'],
      ['2\ndouble inc\n', '5', 'Doubling first gives 4 and then incrementing gives 5.'],
      ['7\n\n', '7'], ['0\nneg\n', '0'], ['-3\ninc inc\n', '-1'], ['1\nneg neg\n', '1'], ['-2\ndouble double\n', '-8'], ['0\ninc double inc\n', '3']
    ],
    ['Represent each named operation as a unary function.', 'Turn the operation names into a sequence of callbacks.', 'Start with the input value.', 'Replace the current value by each callback result in order.', 'With no callbacks return the original value.'],
    `def pipeline(value, functions):
    for function in functions:
        value = function(value)
    return value

operations = {'inc': lambda x: x + 1, 'double': lambda x: x * 2, 'neg': lambda x: -x}
value = int(input())
names = input().split()
print(pipeline(value, [operations[name] for name in names]))
`,
    'Feed each function the previous result, preserving the specified operation order.',
    'value = int(input())\nnames = input().split()\n\n# Define the operations and pipeline.\n'
  ),
  'level-63-problem-1': challenge(
    'Remove Every Kth Occurrence',
    'Define a function that removes every kth occurrence of each distinct value from a list. Count occurrences separately for each value, starting at one, and preserve the order of the remaining entries.',
    'First line: positive integer k. Second line: zero or more space-separated integers.',
    'Print the remaining integers separated by spaces, or an empty line if none remain.',
    ['1 <= k <= 50.', 'At most 50 list elements.', 'Each list element is between -1000 and 1000 inclusive.'],
    [
      ['2\n4 5 4 4 5 4\n', '4 5 4', 'Remove the second and fourth 4 and the second 5; the counters are independent.'],
      ['3\n7 8 7 7 8 8 7\n', '7 8 7 8 7', 'The third occurrence of each value is removed.'],
      ['2\n\n', ''], ['1\n1 2 1\n', ''], ['5\n1 1 1\n', '1 1 1'], ['2\n-1 0 -1 0 -1\n', '-1 0 -1'], ['3\n2 2 2 2 2 2\n', '2 2 2 2'], ['2\n0 0 0 0 0\n', '0 0 0']
    ],
    ['Occurrences are counted separately for each distinct value.', 'Store how many times each value has appeared so far.', 'Increase its count before deciding whether to keep it.', 'Remove the value when its count is divisible by k.', 'Append all other occurrences to a new list in input order.'],
    `def remove_kth(values, k):
    counts = {}
    result = []
    for value in values:
        counts[value] = counts.get(value, 0) + 1
        if counts[value] % k != 0:
            result.append(value)
    return result

k = int(input())
values = list(map(int, input().split()))
print(*remove_kth(values, k))
`,
    'Count occurrences by value and keep exactly those whose one-based occurrence number is not divisible by k.',
    'k = int(input())\nvalues = list(map(int, input().split()))\n\n# Define the function and print the remaining values.\n'
  ),
  'level-63-problem-2': challenge(
    'Validate and Parse Integer Tokens',
    'Define a function separating valid signed decimal integer tokens from invalid tokens, preserving order within each group. A valid token is an optional single + or - followed by one or more ASCII digits.',
    'One line containing zero or more whitespace-separated tokens.',
    'Print parsed integers separated by spaces on the first line and invalid tokens separated by spaces on the second. Print an empty line for an empty group.',
    ['At most 30 tokens, each at most 12 ASCII characters long.', 'Tokens contain no whitespace.'],
    [
      ['+03 no -4 --2\n', '3 -4\nno --2', '+03 and -4 parse; no and --2 have invalid syntax.'],
      ['0 + - x1\n', '0\n+ - x1', 'A sign by itself and a token containing a letter are invalid.'],
      ['\n', '\n'], ['1 -2 +3\n', '1 -2 3\n'], ['a b\n', '\na b'], ['-0 +0 00\n', '0 0 0\n'], ['1_0 2.0\n', '\n1_0 2.0'], ['42 z 42\n', '42 42\nz']
    ],
    ['A sign may appear only at the beginning.', 'After removing one optional sign, at least one ASCII digit must remain.', 'Reject underscores and decimal points even though some conversions accept them.', 'Convert valid tokens with int and collect invalid tokens separately.', 'Preserve the order and duplicates in both groups.'],
    `def parse_tokens(tokens):
    values, invalid = [], []
    for token in tokens:
        digits = token[1:] if token[0] in '+-' else token
        if digits and all('0' <= ch <= '9' for ch in digits):
            values.append(int(token))
        else:
            invalid.append(token)
    return values, invalid

values, invalid = parse_tokens(input().split())
print(*values)
print(*invalid)
`,
    'Validate the exact ASCII grammar before converting, and keep each group stable.',
    'tokens = input().split()\n\n# Define the parser and print both groups.\n'
  ),
  'level-63-problem-3': challenge(
    'Independent Default Accumulator',
    'Define an append function whose optional list defaults to None and creates a new list when omitted. Call it twice without a list, once for each input value, and once with a supplied initial list and the second value.',
    'First line: two integers a and b. Second line: zero or more initial list integers.',
    'Print the two independent single-item lists and the extended supplied list, one list per line with spaces between values.',
    ['At most 30 initial list values.', 'All values are integers between -1000 and 1000 inclusive.'],
    [
      ['2 3\n8 9\n', '2\n3\n8 9 3', 'The omitted lists are independent; only the supplied list starts with 8 and 9.'],
      ['-1 0\n\n', '-1\n0\n0', 'The supplied empty list gains the second value.'],
      ['1 1\n1\n', '1\n1\n1 1'], ['0 0\n0 0\n', '0\n0\n0 0 0'], ['5 -5\n4\n', '5\n-5\n4 -5'], ['1000 -1000\n\n', '1000\n-1000\n-1000'], ['7 8\n-1 0\n', '7\n8\n-1 0 8'], ['-2 -3\n6 6\n', '-2\n-3\n6 6 -3']
    ],
    ['A mutable list should not be used as the default argument.', 'Use None to signal that no list was supplied.', 'Create a fresh list only when the argument is None.', 'Append the value and return the list.', 'Call twice without a list and once with the supplied list.'],
    `def append_value(value, items=None):
    if items is None:
        items = []
    items.append(value)
    return items

a, b = map(int, input().split())
items = list(map(int, input().split()))
first = append_value(a)
second = append_value(b)
third = append_value(b, items)
print(*first)
print(*second)
print(*third)
`,
    'A None default creates a separate list for each omitted argument while retaining a supplied list.',
    'a, b = map(int, input().split())\nitems = list(map(int, input().split()))\n\n# Define the accumulator and print the three results.\n'
  ),
  'level-63-problem-4': challenge(
    'ISBN-10 Check Digit',
    'Define a function that computes the check character for a nine-digit ISBN-10 prefix. Multiply the nine digits from left to right by weights 10 through 2, then choose a value from 0 through 10 so the weighted sum plus that value is divisible by 11. Represent value 10 as X.',
    'One line containing exactly nine ASCII decimal digits; leading zeroes are significant.',
    'Print the check character: a digit 0 through 9 or uppercase X.',
    ['The prefix contains exactly nine ASCII digits.'],
    [
      ['000000001\n', '9', 'The weighted sum is 2; adding 9 makes 11.'],
      ['000000006\n', 'X', 'The weighted sum is 12; adding 10 makes 22, so the check character is X.'],
      ['000000000\n', '0'], ['000000005\n', '1'], ['100000000\n', '1'], ['010000000\n', '2'], ['123456789\n', 'X'], ['100000006\n', '0']
    ],
    ['Keep the prefix as text so leading zeroes are retained.', 'Multiply each digit by its descending weight from 10 to 2.', 'Add the nine weighted values.', 'Find the value from 0 to 10 that makes the total divisible by 11.', 'Return X for 10 and the decimal digit for all other values.'],
    `def check_digit(prefix):
    total = sum(int(digit) * (10 - i) for i, digit in enumerate(prefix))
    check = (-total) % 11
    return 'X' if check == 10 else str(check)

prefix = input()
print(check_digit(prefix))
`,
    'The additive inverse of the weighted sum modulo 11 gives the check value.',
    'prefix = input()\n\n# Define the check-digit function and print its result.\n'
  ),
  'level-63-problem-5': challenge(
    'Return Statistics as Named Fields',
    'Define a function returning a dictionary with count, sum and mean for a nonempty integer list.',
    'One line of space-separated integers.',
    'Print count, sum and mean on one line separated by spaces. Format the mean with exactly two decimal places using Python float formatting.',
    ['1 to 50 integers.', 'Each integer is between -1000 and 1000 inclusive.'],
    [
      ['1 2 6\n', '3 9 3.00', 'There are three numbers totaling 9, with mean 3.00.'],
      ['-4 1\n', '2 -3 -1.50', 'The two numbers total -3 and average -1.50.'],
      ['0\n', '1 0 0.00'], ['1 2 2\n', '3 5 1.67'], ['-1 -2 -2\n', '3 -5 -1.67'], ['7 7 7\n', '3 21 7.00'], ['1000 -1000\n', '2 0 0.00'], ['8\n', '1 8 8.00']
    ],
    ['Count the elements and sum their values.', 'Divide the sum by the count for the mean.', 'Return the three values under descriptive dictionary keys.', 'Retrieve the fields when printing.', 'Format the mean with two digits after the decimal point.'],
    `def statistics(values):
    total = sum(values)
    return {'count': len(values), 'sum': total, 'mean': total / len(values)}

stats = statistics(list(map(int, input().split())))
print(stats['count'], stats['sum'], f"{stats['mean']:.2f}")
`,
    'Compute the three statistics and return them under named dictionary keys.',
    'values = list(map(int, input().split()))\n\n# Define the statistics function and print its fields.\n'
  ),
  'level-64-problem-1': challenge(
    'Matrix Row Sums', 'Compute the sum of each row of a rectangular integer matrix.',
    matrixInput, 'Print the row sums in row order, separated by spaces.', matrixLimits,
    [
      ['2 3\n1 2 3\n-1 0 2\n', '6 1', 'The two row sums are 6 and 1.'],
      ['3 1\n4\n-4\n0\n', '4 -4 0', 'Each single-cell row has that cell as its sum.'],
      ['1 1\n0\n', '0'], ['1 3\n-1 -2 -3\n', '-6'], ['2 2\n1 -1\n2 -2\n', '0 0'], ['2 1\n100\n100\n', '100 100'], ['1 4\n1 2 3 4\n', '10'], ['3 2\n0 1\n0 2\n0 3\n', '1 2 3']
    ],
    ['Rows are given in order.', 'Start a fresh total for each row.', 'Add every entry in that row.', 'Save each completed row total.', 'Print the totals in the same row order.'],
    `r, c = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(r)]
print(*(sum(row) for row in matrix))
`, 'Sum each row independently.', matrixStarter
  ),
  'level-64-problem-2': challenge(
    'Count Nonzero Matrix Entries', 'Count all nonzero entries in a rectangular integer matrix.',
    matrixInput, 'Print the number of entries not equal to zero.', matrixLimits,
    [
      ['2 3\n0 -1 0\n2 3 0\n', '3', 'The nonzero entries are -1, 2 and 3.'],
      ['1 3\n0 0 0\n', '0', 'All three entries are zero.'],
      ['1 1\n7\n', '1'], ['1 1\n0\n', '0'], ['2 2\n1 1\n1 1\n', '4'], ['3 1\n-1\n0\n-2\n', '2'], ['2 2\n0 4\n0 -4\n', '2'], ['1 4\n-1 -2 -3 -4\n', '4']
    ],
    ['Keep one counter for the whole matrix.', 'Visit each row.', 'Visit every value in that row.', 'Increase the counter when the value is not zero.', 'Negative entries count too.'],
    `r, c = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(r)]
count = 0
for row in matrix:
    for value in row:
        if value != 0:
            count += 1
print(count)
`, 'Count every cell whose value differs from zero.', matrixStarter
  ),
  'level-64-problem-3': challenge(
    'Matrix Transpose', 'Exchange the rows and columns of a rectangular integer matrix.',
    matrixInput, matrixOutput, matrixLimits,
    [
      ['2 3\n1 2 3\n4 5 6\n', '1 4\n2 5\n3 6', 'The three original columns become three rows.'],
      ['3 1\n-2\n4\n1\n', '-2 4 1', 'A single column becomes a single row.'],
      ['1 1\n7\n', '7'], ['1 2\n3 3\n', '3\n3'], ['2 1\n2\n-5\n', '2 -5'], ['2 2\n1 2\n3 4\n', '1 3\n2 4'], ['3 2\n0 1\n2 3\n4 5\n', '0 2 4\n1 3 5'], ['2 2\n-1 -1\n-1 1\n', '-1 -1\n-1 1']
    ],
    ['The result has C rows and R columns.', 'Each output row comes from one input column.', 'Read each column from top to bottom.', 'Output cell (i, j) is input cell (j, i).', 'Print each transposed row on its own line.'],
    `r, c = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(r)]
for j in range(c):
    print(*(matrix[i][j] for i in range(r)))
`, 'Each original column becomes one result row.', matrixStarter
  ),
  'level-64-problem-4': challenge(
    'Count Mixed-Sign Matrix Rows', 'Count rows containing at least one positive and at least one negative entry. Zero is neither positive nor negative.',
    matrixInput, 'Print the number of mixed-sign rows.', matrixLimits,
    [
      ['3 3\n1 -2 0\n-1 -2 0\n2 -3 4\n', '2', 'The first and third rows each contain both signs.'],
      ['1 3\n-1 0 0\n', '0', 'Zero does not count as a positive entry.'],
      ['1 1\n0\n', '0'], ['2 1\n1\n-1\n', '0'], ['1 2\n100 -100\n', '1'], ['2 2\n1 -1\n2 -2\n', '2'], ['1 3\n0 0 0\n', '0'], ['2 2\n1 0\n0 -1\n', '0']
    ],
    ['Consider each row independently.', 'Look for at least one value greater than zero.', 'Also look for at least one value less than zero.', 'Count the row only when both exist.', 'Do not treat zero as either sign.'],
    `r, c = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(r)]
count = 0
for row in matrix:
    if any(x > 0 for x in row) and any(x < 0 for x in row):
        count += 1
print(count)
`, 'Count rows that contain both a positive and a negative value.', matrixStarter
  ),
  'level-64-problem-5': challenge(
    'Main Diagonal Sum', 'Sum the entries on the main diagonal of a square matrix.',
    squareInput, 'Print the main diagonal sum.', squareLimits,
    [
      ['3\n1 2 3\n4 5 6\n7 8 9\n', '15', 'The main diagonal contains 1, 5 and 9.'],
      ['2\n-4 8\n3 -2\n', '-6', 'Only -4 and -2 have equal row and column indices.'],
      ['1\n7\n', '7'], ['1\n0\n', '0'], ['2\n0 1\n1 0\n', '0'], ['2\n1 9\n9 1\n', '2'], ['3\n-1 0 0\n0 0 0\n0 0 1\n', '0'], ['3\n5 5 5\n5 5 5\n5 5 5\n', '15']
    ],
    ['The main diagonal starts at the top left.', 'A diagonal cell has equal row and column indices.', 'Loop over indices from zero to n-1.', 'Add matrix[i][i] for each index.', 'A 1 by 1 matrix has one diagonal cell.'],
    `n = int(input())
matrix = [list(map(int, input().split())) for _ in range(n)]
print(sum(matrix[i][i] for i in range(n)))
`, 'Sum cells whose row and column indices match.', squareStarter
  ),
  'level-65-problem-1': challenge(
    'Check Upper Triangular Matrix', 'Determine whether every entry strictly below the main diagonal of a square matrix is zero.',
    squareInput, 'Print YES if the matrix is upper triangular, otherwise NO.', squareLimits,
    [
      ['3\n1 2 3\n0 4 5\n0 0 6\n', 'YES', 'All three entries below the main diagonal are zero.'],
      ['2\n1 0\n-2 1\n', 'NO', 'The -2 below the main diagonal is nonzero.'],
      ['1\n-4\n', 'YES'], ['2\n0 3\n0 0\n', 'YES'], ['2\n0 0\n1 0\n', 'NO'], ['3\n0 0 0\n0 0 0\n1 0 0\n', 'NO'], ['3\n1 0 0\n0 1 0\n0 2 1\n', 'NO'], ['2\n0 -1\n0 0\n', 'YES']
    ],
    ['Only cells below the main diagonal matter.', 'Such cells have row index greater than column index.', 'Inspect each of those cells.', 'A single nonzero cell makes the answer NO.', 'Diagonal and upper entries may have any value.'],
    `n = int(input())
matrix = [list(map(int, input().split())) for _ in range(n)]
valid = True
for i in range(n):
    for j in range(i):
        if matrix[i][j] != 0:
            valid = False
print('YES' if valid else 'NO')
`, 'Inspect precisely the cells with row index greater than column index.', squareStarter
  ),
  'level-65-problem-2': challenge(
    'Identity Matrix Construction', 'Construct an n by n identity matrix, with one on the main diagonal and zero everywhere else.',
    'One integer n.', matrixOutput, ['1 <= n <= 20.'],
    [
      ['2\n', '1 0\n0 1', 'Only the cells with equal row and column indices are one.'],
      ['1\n', '1', 'The sole cell is on the main diagonal.'],
      ['3\n', '1 0 0\n0 1 0\n0 0 1'], ['4\n', '1 0 0 0\n0 1 0 0\n0 0 1 0\n0 0 0 1'], ['5\n', '1 0 0 0 0\n0 1 0 0 0\n0 0 1 0 0\n0 0 0 1 0\n0 0 0 0 1'], ['6\n', '1 0 0 0 0 0\n0 1 0 0 0 0\n0 0 1 0 0 0\n0 0 0 1 0 0\n0 0 0 0 1 0\n0 0 0 0 0 1'], ['7\n', '1 0 0 0 0 0 0\n0 1 0 0 0 0 0\n0 0 1 0 0 0 0\n0 0 0 1 0 0 0\n0 0 0 0 1 0 0\n0 0 0 0 0 1 0\n0 0 0 0 0 0 1'], ['8\n', '1 0 0 0 0 0 0 0\n0 1 0 0 0 0 0 0\n0 0 1 0 0 0 0 0\n0 0 0 1 0 0 0 0\n0 0 0 0 1 0 0 0\n0 0 0 0 0 1 0 0\n0 0 0 0 0 0 1 0\n0 0 0 0 0 0 0 1']
    ],
    ['The result has n rows and n columns.', 'Each row contains exactly one 1.', 'The 1 has the same column index as its row index.', 'All other entries are 0.', 'Print one row at a time with spaces between entries.'],
    `n = int(input())
for i in range(n):
    print(*(1 if i == j else 0 for j in range(n)))
`, 'Print 1 when row and column indices agree, and 0 otherwise.', 'n = int(input())\n\n# Construct and print the identity matrix.\n'
  ),
  'level-65-problem-3': challenge(
    'Check Matrix Symmetry', 'Determine whether a square matrix equals its transpose.',
    squareInput, 'Print YES if the matrix is symmetric, otherwise NO.', squareLimits,
    [
      ['3\n1 2 3\n2 4 5\n3 5 6\n', 'YES', 'Every entry matches the one reflected across the main diagonal.'],
      ['2\n0 2\n3 0\n', 'NO', 'The reflected entries 2 and 3 differ.'],
      ['1\n-3\n', 'YES'], ['2\n0 0\n0 0\n', 'YES'], ['2\n1 -2\n-2 5\n', 'YES'], ['2\n1 0\n1 1\n', 'NO'], ['3\n1 2 3\n2 4 5\n4 5 6\n', 'NO'], ['3\n0 1 2\n1 0 3\n2 3 0\n', 'YES']
    ],
    ['Reflect a position by swapping its row and column.', 'A symmetric matrix has equal values at reflected positions.', 'Compare matrix[i][j] with matrix[j][i].', 'A mismatch anywhere makes the answer NO.', 'Diagonal cells automatically match themselves.'],
    `n = int(input())
matrix = [list(map(int, input().split())) for _ in range(n)]
valid = all(matrix[i][j] == matrix[j][i] for i in range(n) for j in range(n))
print('YES' if valid else 'NO')
`, 'Compare each cell to its reflection across the diagonal.', squareStarter
  ),
  'level-65-problem-4': challenge(
    'Rotate Square Matrix Clockwise', 'Rotate a square matrix 90 degrees clockwise.',
    squareInput, matrixOutput, squareLimits,
    [
      ['2\n1 2\n3 4\n', '3 1\n4 2', 'The left column becomes the top row in bottom-to-top order.'],
      ['3\n1 2 3\n4 5 6\n7 8 9\n', '7 4 1\n8 5 2\n9 6 3', 'The original columns become rows, read from bottom to top.'],
      ['1\n-1\n', '-1'], ['2\n0 0\n0 0\n', '0 0\n0 0'], ['2\n-1 2\n3 -4\n', '3 -1\n-4 2'], ['2\n1 0\n0 0\n', '0 1\n0 0'], ['3\n0 0 1\n0 0 0\n0 0 0\n', '0 0 0\n0 0 0\n0 0 1'], ['3\n1 1 1\n2 2 2\n3 3 3\n', '3 2 1\n3 2 1\n3 2 1']
    ],
    ['The output retains the same dimensions.', 'Each original column becomes an output row.', 'Read each original column from bottom to top.', 'Output cell (i, j) comes from input (n-1-j, i).', 'Print output rows in order.'],
    `n = int(input())
matrix = [list(map(int, input().split())) for _ in range(n)]
for i in range(n):
    print(*(matrix[n - 1 - j][i] for j in range(n)))
`, 'Each output row reads the corresponding input column from bottom to top.', squareStarter
  ),
  'level-65-problem-5': challenge(
    'Matrix Multiplication', 'Multiply an R by K integer matrix by a K by C integer matrix.',
    'First line: R K C. Next R lines contain K integers each for the first matrix. Next K lines contain C integers each for the second matrix.',
    matrixOutput, ['1 <= R, K, C <= 10.', 'Matrix entries are integers from -100 to 100.'],
    [
      ['2 2 1\n1 2\n3 4\n5\n6\n', '17\n39', 'The row-column dot products are 1*5+2*6 and 3*5+4*6.'],
      ['1 2 2\n2 -1\n3 4\n5 6\n', '1 2', 'The output entries are 2*3-5=1 and 2*4-6=2.'],
      ['1 1 1\n0\n9\n', '0'], ['1 1 1\n-3\n4\n', '-12'], ['1 2 1\n1 1\n2\n-2\n', '0'], ['2 1 2\n2\n3\n4 5\n', '8 10\n12 15'], ['2 2 2\n1 0\n0 1\n7 8\n9 10\n', '7 8\n9 10'], ['1 3 1\n-1 0 2\n2\n3\n4\n', '6']
    ],
    ['The result has R rows and C columns.', 'Choose one row from the first matrix and one column from the second.', 'Multiply corresponding entries across their shared K positions.', 'Sum those products for the output cell.', 'Repeat for all output rows and columns.'],
    `r, k, c = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(r)]
b = [list(map(int, input().split())) for _ in range(k)]
for i in range(r):
    print(*(sum(a[i][t] * b[t][j] for t in range(k)) for j in range(c)))
`, 'Each output cell is the dot product of an input row and column.',
    'r, k, c = map(int, input().split())\na = [list(map(int, input().split())) for _ in range(r)]\nb = [list(map(int, input().split())) for _ in range(k)]\n\n# Multiply and print the matrices.\n'
  ),
};
