import { challenge } from './beginner.js';

export const loops2125Challenges = {
  'level-21-problem-1': challenge(
    'Count from One to N', 'Print the integers from 1 through n in increasing order.',
    'One integer n.', 'Print the numbers on one line separated by spaces. Print an empty line if n is zero.',
    ['0 <= n <= 20.'],
    [['4\n', '1 2 3 4', 'The integers from 1 through 4 are printed in order.'], ['0\n', '', 'There are no integers in this range.'], ['1\n', '1'], ['2\n', '1 2'], ['3\n', '1 2 3'], ['5\n', '1 2 3 4 5'], ['6\n', '1 2 3 4 5 6'], ['10\n', '1 2 3 4 5 6 7 8 9 10']],
    ['The first number is 1.', 'The sequence ends at n, unless n is zero.', 'range(1, n + 1) includes n.', 'Convert each visited number to text and collect it.', 'Join the collected strings with spaces; an empty collection gives an empty line.'],
    'n = int(input())\nvalues = []\nfor i in range(1, n + 1):\n    values.append(str(i))\nprint(" ".join(values))\n',
    'The range visits each required integer once; joining an empty list prints an empty line.',
    'n = int(input())\n\n# Build and print the counting sequence.\n'
  ),
  'level-21-problem-2': challenge(
    'Count Nonempty Input Lines', 'Count how many of the next n whole input lines contain at least one character. A line containing only spaces or tabs is nonempty.',
    'First line: integer n. The next n lines are text, and may be empty or contain spaces and tabs.', 'Print the count of nonempty text lines.',
    ['0 <= n <= 20.', 'Each text line contains at most 100 characters.', 'The newline terminating a line is not a character of its text.'],
    [['4\nhello\n\n  \nworld\n', '3', 'hello, the spaces-only line and world are nonempty; the blank line is empty.'], ['0\n', '0', 'There are no text lines to count.'], ['1\n\n', '0'], ['1\n \n', '1'], ['3\n\n\n\n', '0'], ['3\na\nb\nc\n', '3'], ['4\n\t\nx\n\n \t \n', '3'], ['2\n\nlast\n', '1']],
    ['Start the count at zero, including when n is zero.', 'Repeat exactly n times, reading one whole line per iteration.', 'input() removes the newline but preserves spaces and tabs.', 'Compare the line with the empty string without stripping whitespace.', 'Add one only when the line contains at least one character.'],
    'n = int(input())\ncount = 0\nfor _ in range(n):\n    line = input()\n    if line != "":\n        count += 1\nprint(count)\n',
    'Read each line without stripping spaces, and count it if its text contains any characters.',
    'n = int(input())\n\n# Read n whole lines and count those that are not empty.\n'
  ),
  'level-21-problem-3': challenge(
    'Sum the First N Integers', 'Add all integers from 1 through n.',
    'One integer n.', 'Print the sum; print 0 for an empty range.',
    ['0 <= n <= 100.'],
    [['4\n', '10', '1 + 2 + 3 + 4 equals 10.'], ['0\n', '0', 'No numbers are added, so the sum stays zero.'], ['1\n', '1'], ['2\n', '3'], ['5\n', '15'], ['10\n', '55'], ['20\n', '210'], ['100\n', '5050']],
    ['Start a total at zero.', 'Visit each integer from 1 to n.', 'range(1, n + 1) includes the endpoint.', 'Add each visited value to the total.', 'When n is zero the loop adds nothing, leaving zero.'],
    'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i\nprint(total)\n',
    'The accumulator starts at zero and receives each value in the inclusive range.',
    'n = int(input())\n\n# Accumulate the sum and print it.\n'
  ),
  'level-21-problem-4': challenge(
    'Factorial by Iteration', 'Calculate n factorial, the product of integers from 1 through n.',
    'One integer n.', 'Print n factorial. By definition, 0 factorial is 1.',
    ['0 <= n <= 12.'],
    [['4\n', '24', '1 times 2 times 3 times 4 is 24.'], ['0\n', '1', 'The empty product is defined as 1.'], ['1\n', '1'], ['2\n', '2'], ['3\n', '6'], ['5\n', '120'], ['8\n', '40320'], ['12\n', '479001600']],
    ['Factorial multiplies the integers from 1 through n.', 'Start the product at 1, not 0.', 'Visit integers from 1 through n.', 'Multiply the running product by each integer.', 'For n = 0 the loop is empty and the product stays 1.'],
    'n = int(input())\nproduct = 1\nfor i in range(1, n + 1):\n    product *= i\nprint(product)\n',
    'Starting with the multiplicative identity also handles the empty product for zero.',
    'n = int(input())\n\n# Multiply the factors and print the result.\n'
  ),
  'level-21-problem-5': challenge(
    'Multiplication Table Row', 'Print the first n multiples of a: a times 1 through a times n.',
    'Two integers a and n on one line.', 'Print the multiples in order on one line separated by spaces; print an empty line when n is zero.',
    ['-100 <= a <= 100.', '0 <= n <= 20.'],
    [['3 4\n', '3 6 9 12', 'Multiplying 3 by 1, 2, 3 and 4 gives these values.'], ['-2 3\n', '-2 -4 -6', 'The multipliers are positive even when a is negative.'], ['5 0\n', ''], ['0 3\n', '0 0 0'], ['1 1\n', '1'], ['10 2\n', '10 20'], ['-1 4\n', '-1 -2 -3 -4'], ['100 3\n', '100 200 300']],
    ['The multipliers start at 1.', 'Loop through n inclusive.', 'Multiply a by each multiplier.', 'Convert each product to text and collect it in order.', 'Join the results with spaces; zero terms produce an empty line.'],
    'a, n = map(int, input().split())\nvalues = []\nfor i in range(1, n + 1):\n    values.append(str(a * i))\nprint(" ".join(values))\n',
    'Each multiplier from 1 through n contributes one value.',
    'a, n = map(int, input().split())\n\n# Print the multiples in order.\n'
  ),
  'level-22-problem-1': challenge(
    'Sum Even Integers in a Range', 'Add the even integers in the inclusive interval from a to b.',
    'Two integers a and b on one line.', 'Print the sum, or 0 if the interval contains no even integers.',
    ['-100 <= a <= b <= 100.'],
    [['1 6\n', '12', 'The even values are 2, 4 and 6, totaling 12.'], ['-3 1\n', '-2', 'The even values -2 and 0 sum to -2.'], ['1 1\n', '0'], ['2 2\n', '2'], ['-4 -2\n', '-6'], ['0 0\n', '0'], ['3 5\n', '4'], ['-2 2\n', '0']],
    ['Include both endpoints.', 'Initialize the total to zero.', 'Visit each integer with range(a, b + 1).', 'An even number has remainder zero modulo 2, even if negative.', 'Add only matching values to the total.'],
    'a, b = map(int, input().split())\ntotal = 0\nfor i in range(a, b + 1):\n    if i % 2 == 0:\n        total += i\nprint(total)\n',
    'The loop checks parity for each integer in the interval before adding it.',
    'a, b = map(int, input().split())\n\n# Sum the even values in the inclusive interval.\n'
  ),
  'level-22-problem-2': challenge(
    'Count Multiples in a Range', 'Count integers divisible by d in the inclusive interval from a to b. Zero is divisible by every allowed d.',
    'Three integers a b d on one line.', 'Print the count.',
    ['-100 <= a <= b <= 100.', '1 <= d <= 100.'],
    [['1 10 3\n', '3', '3, 6 and 9 are the three multiples.'], ['-2 2 2\n', '3', '-2, 0 and 2 are divisible by 2.'], ['1 1 2\n', '0'], ['0 0 5\n', '1'], ['-6 -3 3\n', '2'], ['5 5 5\n', '1'], ['1 5 1\n', '5'], ['-1 1 100\n', '1']],
    ['Start a counter at zero.', 'Loop over both endpoints.', 'Test divisibility with remainder modulo d.', 'Increase the counter for every zero remainder, including zero itself.', 'If no number matches, the counter remains zero.'],
    'a, b, d = map(int, input().split())\ncount = 0\nfor i in range(a, b + 1):\n    if i % d == 0:\n        count += 1\nprint(count)\n',
    'Count exactly those interval values whose remainder after division by d is zero.',
    'a, b, d = map(int, input().split())\n\n# Count the multiples in the interval.\n'
  ),
  'level-22-problem-3': challenge(
    'Sum Squares Through N', 'Add the squares of all integers from 1 through n.',
    'One integer n.', 'Print the sum, or 0 when n is zero.',
    ['0 <= n <= 100.'],
    [['3\n', '14', '1 squared + 2 squared + 3 squared is 1 + 4 + 9 = 14.'], ['0\n', '0', 'The empty range contributes no squares.'], ['1\n', '1'], ['2\n', '5'], ['4\n', '30'], ['5\n', '55'], ['10\n', '385'], ['100\n', '338350']],
    ['Begin the sum at zero.', 'Visit each integer from 1 to n.', 'Use i * i or i ** 2 for the square of i.', 'Add each square, not the integer itself.', 'For n = 0 there are no squares to add.'],
    'n = int(input())\ntotal = 0\nfor i in range(1, n + 1):\n    total += i * i\nprint(total)\n',
    'Each iteration squares its number and adds that square to the accumulator.',
    'n = int(input())\n\n# Add the squares and print their sum.\n'
  ),
  'level-22-problem-4': challenge(
    'Alternating Harmonic Prefix', 'Calculate the sum of the first n terms of 1 - 1/2 + 1/3 - 1/4 + ... .',
    'One integer n.', 'Print the sum rounded to exactly six digits after the decimal point.',
    ['0 <= n <= 20.', 'For n = 0 the sum is zero.'],
    [['3\n', '0.833333', '1 - 1/2 + 1/3 is approximately 0.833333.'], ['2\n', '0.500000', 'The first two terms total 1 - 1/2 = 0.5.'], ['0\n', '0.000000'], ['1\n', '1.000000'], ['4\n', '0.583333'], ['5\n', '0.783333'], ['6\n', '0.616667'], ['10\n', '0.645635']],
    ['Start the running sum at zero.', 'Term k has magnitude 1/k.', 'Odd-numbered terms are positive and even-numbered terms are negative.', 'Use k % 2 to decide whether to add or subtract each reciprocal.', 'Format the final total with six decimal places.'],
    'n = int(input())\ntotal = 0.0\nfor k in range(1, n + 1):\n    if k % 2 == 1:\n        total += 1 / k\n    else:\n        total -= 1 / k\nprint(f"{total:.6f}")\n',
    'Add the reciprocal of each odd index and subtract the reciprocal of each even index.',
    'n = int(input())\n\n# Sum the alternating reciprocals and print six decimal places.\n'
  ),
  'level-22-problem-5': challenge(
    'Product of a Geometric Sequence', 'Multiply the first n terms starting at a, where each next term is the previous term times r.',
    'Three integers a r n on one line.', 'Print the product. For zero terms, print 1.',
    ['-5 <= a, r <= 5.', '0 <= n <= 6.'],
    [['2 3 3\n', '216', 'The terms 2, 6 and 18 have product 216.'], ['4 -1 3\n', '-64', 'The terms 4, -4 and 4 have product -64.'], ['5 1 0\n', '1'], ['0 3 4\n', '0'], ['3 0 1\n', '3'], ['3 0 2\n', '0'], ['-2 2 3\n', '-64'], ['1 2 4\n', '64']],
    ['Keep a current term starting at a.', 'Start the product at 1.', 'Repeat once for each of the n terms.', 'Multiply by the current term, then update that term by r.', 'With no terms, the product stays 1.'],
    'a, r, n = map(int, input().split())\nproduct = 1\nterm = a\nfor _ in range(n):\n    product *= term\n    term *= r\nprint(product)\n',
    'Multiply each current term into the product before advancing to the next term.',
    'a, r, n = map(int, input().split())\n\n# Track the current term and its product.\n'
  ),
  'level-23-problem-1': challenge(
    'Count Decimal Digits', 'Count the decimal digits of a nonnegative integer. The number zero has one digit.',
    'One nonnegative integer n, written without leading zeros except for zero itself.', 'Print the number of digits.',
    ['0 <= n <= 1000000000.'],
    [['705\n', '3', '705 has three decimal digits.'], ['0\n', '1', 'Zero is represented by the single digit 0.'], ['9\n', '1'], ['10\n', '2'], ['99\n', '2'], ['1000\n', '4'], ['12345\n', '5'], ['1000000000\n', '10']],
    ['Zero needs a special case: it has one digit.', 'For a positive number, initialize the count to zero.', 'Floor division by 10 removes the last digit.', 'Count each removal while the remaining number is positive.', 'The count of removals is the number of digits.'],
    'n = int(input())\nif n == 0:\n    count = 1\nelse:\n    count = 0\n    while n > 0:\n        count += 1\n        n //= 10\nprint(count)\n',
    'Repeatedly remove the final digit, counting removals; handle zero as one digit.',
    'n = int(input())\n\n# Count decimal digits, including the zero case.\n'
  ),
  'level-23-problem-2': challenge(
    'Alternating Digit Sum', 'Starting at the least-significant decimal digit, add the first digit, subtract the next, then continue alternating addition and subtraction.',
    'One nonnegative integer n, written without leading zeros except for zero itself.', 'Print the alternating sum as an integer. The result for n = 0 is 0.',
    ['0 <= n <= 1000000000.'],
    [['1234\n', '2', 'Starting from the right, 4 - 3 + 2 - 1 equals 2.'], ['120\n', '-1', 'Starting from the right, 0 - 2 + 1 equals -1.'], ['0\n', '0'], ['7\n', '7'], ['10\n', '-1'], ['1111\n', '0'], ['90909\n', '27'], ['1000000000\n', '-1']],
    ['Start the total at zero; zero itself has sum zero.', 'Extract the rightmost digit with n % 10.', 'Start with a positive sign and add sign times the digit.', 'Flip the sign after each digit.', 'Remove the processed digit with n //= 10 and continue while n is positive.'],
    'n = int(input())\ntotal = 0\nsign = 1\nwhile n > 0:\n    total += sign * (n % 10)\n    sign = -sign\n    n //= 10\nprint(total)\n',
    'Extract digits from right to left, alternating the sign after each one; the initial total handles zero.',
    'n = int(input())\n\n# Alternate addition and subtraction from the rightmost digit.\n'
  ),
  'level-23-problem-3': challenge(
    'Count Adjacent Equal Digit Pairs', 'Count adjacent pairs of equal digits in the normal decimal representation of n. Pairs may overlap.',
    'One nonnegative integer n, written without leading zeros except for zero itself.', 'Print the number of adjacent equal digit pairs.',
    ['0 <= n <= 1000000000.', 'Zero has the one-digit representation 0, with no adjacent pairs.'],
    [['1111\n', '3', 'Each of the three adjacent pairs is 11, including overlapping pairs.'], ['1223\n', '1', 'Only the middle adjacent pair, 22, is equal.'], ['0\n', '0'], ['7\n', '0'], ['12345\n', '0'], ['1000\n', '2'], ['112233\n', '3'], ['1000000000\n', '8']],
    ['A single-digit number has no adjacent pair.', 'Extract digits from right to left using % 10 and // 10.', 'Remember the previously extracted digit and compare it with the next digit.', 'Increment a counter when the two digits match.', 'Update the remembered digit every time so overlapping pairs are checked.'],
    'n = int(input())\nprevious = n % 10\nn //= 10\ncount = 0\nwhile n > 0:\n    digit = n % 10\n    if digit == previous:\n        count += 1\n    previous = digit\n    n //= 10\nprint(count)\n',
    'Compare each extracted digit with its neighbor to the right; every adjacent pair is checked once.',
    'n = int(input())\n\n# Compare each neighboring pair of decimal digits.\n'
  ),
  'level-23-problem-4': challenge(
    'Largest Decimal Digit', 'Find the largest decimal digit of a nonnegative integer.',
    'One nonnegative integer n.', 'Print the largest digit.',
    ['0 <= n <= 1000000000.'],
    [['3048\n', '8', 'Among 3, 0, 4 and 8, the largest digit is 8.'], ['0\n', '0', 'The only digit is zero.'], ['1\n', '1'], ['99\n', '9'], ['1000\n', '1'], ['765432\n', '7'], ['90909\n', '9'], ['123456789\n', '9']],
    ['Keep a largest digit seen so far, starting at zero.', 'Extract the last digit using % 10.', 'Compare it with the current largest and replace the largest if needed.', 'Remove the last digit using // 10 and repeat.', 'The initial maximum also handles the number zero.'],
    'n = int(input())\nlargest = 0\nwhile n > 0:\n    digit = n % 10\n    if digit > largest:\n        largest = digit\n    n //= 10\nprint(largest)\n',
    'Track the maximum as digits are extracted; zero also correctly produces zero.',
    'n = int(input())\n\n# Track the largest extracted digit.\n'
  ),
  'level-23-problem-5': challenge(
    'Count Occurrences of a Digit', 'Count occurrences of digit d in the usual decimal representation of n. Zero is represented by one digit 0.',
    'Two integers n and d on one line.', 'Print the occurrence count.',
    ['0 <= n <= 1000000000.', '0 <= d <= 9.'],
    [['10010 0\n', '3', 'The representation 10010 contains three zeros.'], ['0 0\n', '1', 'The representation of zero contains one zero.'], ['0 2\n', '0'], ['1111 1\n', '4'], ['12345 6\n', '0'], ['90909 9\n', '3'], ['7 7\n', '1'], ['1000000000 0\n', '9']],
    ['Treat n = 0 as a single digit.', 'If n is zero, its count is one only when d is zero.', 'For a positive n, extract its last digit with % 10.', 'Increment the count when that digit equals d.', 'Remove the extracted digit with // 10 and repeat.'],
    'n, d = map(int, input().split())\ncount = 0\nif n == 0:\n    if d == 0:\n        count = 1\nwhile n > 0:\n    if n % 10 == d:\n        count += 1\n    n //= 10\nprint(count)\n',
    'Check each extracted digit, with a special case for the single-digit representation of zero.',
    'n, d = map(int, input().split())\n\n# Count matches, including the representation of zero.\n'
  ),
  'level-24-problem-1': challenge(
    'Sum Until Sentinel', 'Sum the integers before the first zero sentinel; ignore any values after it.',
    'One line of space-separated integers containing at least one zero.', 'Print the sum before the first zero.',
    ['There are 1 to 30 integers, each from -100 to 100.'],
    [['4 -2 5 0 9\n', '7', '4 - 2 + 5 = 7; 9 follows the sentinel and is ignored.'], ['0 5\n', '0', 'The first value is the sentinel, so the sum is empty.'], ['1 0\n', '1'], ['-4 0\n', '-4'], ['2 -2 0\n', '0'], ['3 3 3 0\n', '9'], ['-5 -6 0 0\n', '-11'], ['100 -100 1 0\n', '1']],
    ['Start the sum at zero.', 'Inspect the values in their given order.', 'A zero is the sentinel, not an ordinary value to continue past.', 'Stop immediately at the first zero instead of adding later values.', 'Add each nonzero value encountered before the stop.'],
    'values = map(int, input().split())\ntotal = 0\nfor value in values:\n    if value == 0:\n        break\n    total += value\nprint(total)\n',
    'A break ends the scan at the sentinel, leaving subsequent values out of the total.',
    'values = list(map(int, input().split()))\n\n# Sum only the values before the first zero.\n'
  ),
  'level-24-problem-2': challenge(
    'First Power Above a Bound', 'Find the smallest nonnegative exponent e such that 2 raised to e is strictly greater than bound.',
    'One integer bound.', 'Print e.',
    ['0 <= bound <= 1000000.'],
    [['8\n', '4', '2 to the power 3 equals 8, so the first strictly greater power is 16 at exponent 4.'], ['0\n', '0', '2 to the power 0 is 1, already greater than zero.'], ['1\n', '1'], ['2\n', '2'], ['3\n', '2'], ['7\n', '3'], ['16\n', '5'], ['1000000\n', '20']],
    ['Start at exponent 0 and power 1.', 'Compare the current power with the bound.', 'While the power is not greater than the bound, double it.', 'Increase the exponent each time you double.', 'Equality is not enough: continue until the power is strictly greater.'],
    'bound = int(input())\npower = 1\nexponent = 0\nwhile power <= bound:\n    power *= 2\n    exponent += 1\nprint(exponent)\n',
    'The current power and exponent advance together until the power first exceeds the bound.',
    'bound = int(input())\n\n# Find the first exponent whose power exceeds the bound.\n'
  ),
  'level-24-problem-3': challenge(
    'Sum Halving Heights', 'A bouncing ball starts at height n. Each bounce reaches half the previous height, rounded down. Sum the starting height and each bounce height until the first height at or below limit, including that final height.',
    'Two integers n and limit on one line.', 'Print the sum of the included heights.',
    ['1 <= n <= 1000000.', '0 <= limit <= n.'],
    [['8 2\n', '14', 'The included heights are 8, 4 and 2, totaling 14.'], ['5 0\n', '8', 'The heights 5, 2, 1 and 0 sum to 8.'], ['1 1\n', '1'], ['1 0\n', '1'], ['10 5\n', '15'], ['9 4\n', '13'], ['15 1\n', '26'], ['100 20\n', '187']],
    ['Include the initial height in the total.', 'If it is already at the limit, no bounce is needed.', 'While the current height is above the limit, halve it using // 2.', 'Add the new height even when it first reaches or falls below the limit.', 'Stop checking for further bounces once that height is at or below the limit.'],
    'n, limit = map(int, input().split())\ntotal = n\nwhile n > limit:\n    n //= 2\n    total += n\nprint(total)\n',
    'Add the starting height, then each rounded-down bounce until the limit condition is met.',
    'n, limit = map(int, input().split())\n\n# Add the starting and bounce heights through the stopping height.\n'
  ),
  'level-24-problem-4': challenge(
    'First Running Sum at Threshold', 'Find the earliest nonempty prefix of the list whose sum is at least target.',
    'First line: n and target. Second line: n nonnegative integers.', 'Print the one-based length of that prefix, or -1 if none reaches target.',
    ['1 <= n <= 20.', '0 <= target <= 1000.', 'Each list value is between 0 and 100.'],
    [['5 7\n2 3 4 1 0\n', '3', 'The first two sum to 5; the first three sum to 9 and reach 7.'], ['3 0\n0 2 1\n', '1', 'The first nonempty prefix already reaches zero.'], ['3 9\n1 2 3\n', '-1'], ['1 5\n5\n', '1'], ['1 6\n5\n', '-1'], ['4 4\n0 0 4 4\n', '3'], ['3 6\n1 2 3\n', '3'], ['4 3\n3 0 0 0\n', '1']],
    ['Start a running sum at zero.', 'Visit the values in their input order.', 'Add each value before checking the threshold, since the prefix must be nonempty.', 'Stop at the first qualifying prefix and convert its index to a one-based length.', 'Use -1 if no prefix reaches the threshold.'],
    'n, target = map(int, input().split())\nvalues = list(map(int, input().split()))\ntotal = 0\nanswer = -1\nfor i in range(n):\n    total += values[i]\n    if total >= target:\n        answer = i + 1\n        break\nprint(answer)\n',
    'Check each nonempty prefix in order and stop at the first sum meeting the target.',
    'n, target = map(int, input().split())\nvalues = list(map(int, input().split()))\n\n# Find the first qualifying nonempty prefix.\n'
  ),
  'level-24-problem-5': challenge(
    'Collatz Steps to One', 'Starting from n, repeatedly replace an even value by half and an odd value by 3 times the value plus 1. Count transitions until reaching 1.',
    'One positive integer n.', 'Print the number of transitions; starting at 1 takes zero transitions.',
    ['1 <= n <= 100.', 'Inputs are restricted to values whose sequence reaches 1.'],
    [['6\n', '8', '6 goes through 3, 10, 5, 16, 8, 4, 2 and 1 in eight transitions.'], ['1\n', '0', 'The starting value is already 1.'], ['2\n', '1'], ['3\n', '7'], ['4\n', '2'], ['5\n', '5'], ['8\n', '3'], ['10\n', '6']],
    ['Continue until the current value is 1.', 'Use % 2 to select the even or odd rule.', 'For an even value, use integer division by 2.', 'For an odd value, replace it with 3 times itself plus 1.', 'Count each replacement as one transition; starting at 1 takes none.'],
    'n = int(input())\nsteps = 0\nwhile n != 1:\n    if n % 2 == 0:\n        n //= 2\n    else:\n        n = 3 * n + 1\n    steps += 1\nprint(steps)\n',
    'Apply the parity rule once per iteration and count each transition to a new value.',
    'n = int(input())\n\n# Follow the parity rules and count transitions to 1.\n'
  ),
  'level-25-problem-1': challenge(
    'Fibonacci Sequence Prefix', 'Print the first n Fibonacci numbers, starting 0, 1; each later number is the sum of the previous two.',
    'One integer n.', 'Print the numbers on one line separated by spaces; print an empty line for zero terms.',
    ['0 <= n <= 20.'],
    [['6\n', '0 1 1 2 3 5', 'Starting at 0 and 1, each next value adds the previous two.'], ['1\n', '0', 'The first term alone is 0.'], ['0\n', ''], ['2\n', '0 1'], ['3\n', '0 1 1'], ['4\n', '0 1 1 2'], ['5\n', '0 1 1 2 3'], ['8\n', '0 1 1 2 3 5 8 13']],
    ['Track the current and next Fibonacci numbers.', 'Initialize them to 0 and 1.', 'Record the current number once per term.', 'Advance both values together to next and current + next.', 'Join the recorded terms with spaces, or print an empty line for zero terms.'],
    'n = int(input())\na, b = 0, 1\nvalues = []\nfor _ in range(n):\n    values.append(str(a))\n    a, b = b, a + b\nprint(" ".join(values))\n',
    'The pair stores consecutive Fibonacci numbers and advances after each output term.',
    'n = int(input())\n\n# Generate and print the Fibonacci prefix.\n'
  ),
  'level-25-problem-2': challenge(
    'Greatest Common Divisor', 'Find the nonnegative greatest common divisor of two integers. Define gcd(0, 0) as 0.',
    'Two integers a and b on one line.', 'Print their nonnegative greatest common divisor.',
    ['-100000 <= a, b <= 100000.'],
    [['48 18\n', '6', 'The largest positive integer dividing both 48 and 18 is 6.'], ['0 0\n', '0', 'The stated convention gives gcd(0, 0) = 0.'], ['0 -12\n', '12'], ['-24 18\n', '6'], ['7 13\n', '1'], ['9 9\n', '9'], ['100 25\n', '25'], ['-1 -1\n', '1']],
    ['Work with the absolute values.', 'The gcd of a and b equals the gcd of b and the remainder a % b.', 'While b is nonzero, calculate a % b.', 'Replace the pair (a, b) with (b, a % b).', 'When b becomes zero, a is the answer, including when both inputs are zero.'],
    'a, b = map(int, input().split())\na, b = abs(a), abs(b)\nwhile b != 0:\n    a, b = b, a % b\nprint(a)\n',
    'Euclid’s remainder step preserves the gcd until the second value becomes zero.',
    'a, b = map(int, input().split())\n\n# Use remainders to find the nonnegative gcd.\n'
  ),
  'level-25-problem-3': challenge(
    'List Positive Divisors', 'List all positive integers that divide n exactly, in increasing order.',
    'One positive integer n.', 'Print the divisors on one line separated by spaces.',
    ['1 <= n <= 1000.'],
    [['12\n', '1 2 3 4 6 12', 'Each listed integer divides 12 without a remainder.'], ['1\n', '1', 'The only positive divisor of 1 is 1.'], ['2\n', '1 2'], ['9\n', '1 3 9'], ['13\n', '1 13'], ['16\n', '1 2 4 8 16'], ['20\n', '1 2 4 5 10 20'], ['25\n', '1 5 25']],
    ['Every positive divisor lies between 1 and n.', 'Visit these candidates in increasing order.', 'Test each candidate with n % candidate.', 'Collect candidates whose remainder is zero.', 'Join the collected divisors with spaces.'],
    'n = int(input())\ndivisors = []\nfor candidate in range(1, n + 1):\n    if n % candidate == 0:\n        divisors.append(str(candidate))\nprint(" ".join(divisors))\n',
    'Testing candidates in increasing order automatically orders the divisors.',
    'n = int(input())\n\n# Find and print all positive divisors.\n'
  ),
  'level-25-problem-4': challenge(
    'Primality by Trial Division', 'Decide whether n is prime: it must be greater than 1 and have no positive divisors other than 1 and itself.',
    'One integer n.', 'Print YES if n is prime; otherwise print NO.',
    ['-100 <= n <= 100000.'],
    [['29\n', 'YES', '29 has no divisor from 2 through its square root.'], ['49\n', 'NO', '7 divides 49, so 49 is composite.'], ['1\n', 'NO'], ['0\n', 'NO'], ['-7\n', 'NO'], ['2\n', 'YES'], ['9\n', 'NO'], ['97\n', 'YES']],
    ['Numbers at most 1 are not prime.', 'For larger numbers, look for a divisor other than 1 and itself.', 'Try divisors starting at 2 while divisor * divisor <= n.', 'A zero remainder proves the number is composite.', 'Stop at the first divisor; if none is found, the number is prime.'],
    'n = int(input())\nis_prime = n > 1\ndivisor = 2\nwhile divisor * divisor <= n:\n    if n % divisor == 0:\n        is_prime = False\n        break\n    divisor += 1\nprint("YES" if is_prime else "NO")\n',
    'A composite number has a divisor no greater than its square root, so trial division up to that point suffices.',
    'n = int(input())\n\n# Check primality using trial divisors.\n'
  ),
  'level-25-problem-5': challenge(
    'Prime Factors with Multiplicity', 'Decompose n into prime factors, repeating each factor as often as it divides the number.',
    'One positive integer n.', 'Print the prime factors in nondecreasing order separated by spaces. For n = 1 print an empty line.',
    ['1 <= n <= 100000.'],
    [['72\n', '2 2 2 3 3', '72 = 2 times 2 times 2 times 3 times 3.'], ['1\n', '', '1 has no prime factors.'], ['2\n', '2'], ['13\n', '13'], ['16\n', '2 2 2 2'], ['45\n', '3 3 5'], ['77\n', '7 11'], ['1000\n', '2 2 2 5 5 5']],
    ['Try possible factors in increasing order from 2.', 'While the current factor divides n, record it and divide n by it.', 'Repeat division by the same factor to keep multiplicities.', 'Try factors while their square is at most the remaining n.', 'Any remaining value greater than 1 is prime; 1 has no factors to print.'],
    'n = int(input())\nfactors = []\ndivisor = 2\nwhile divisor * divisor <= n:\n    while n % divisor == 0:\n        factors.append(str(divisor))\n        n //= divisor\n    divisor += 1\nif n > 1:\n    factors.append(str(n))\nprint(" ".join(factors))\n',
    'Repeated division records every occurrence; after trial division the remaining value, if any, is prime.',
    'n = int(input())\n\n# Extract repeated prime factors in increasing order.\n'
  )
};
