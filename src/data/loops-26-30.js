import { challenge } from './beginner.js';

export const loops2630Challenges = {
  'level-26-problem-1': challenge(
    'Filled Character Rectangle', 'Print a filled rectangle using the given character.',
    'One line: height width character.', 'Print height rows of width characters, with no spaces between characters.',
    ['1 <= height, width <= 10.', 'The character is one visible non-whitespace ASCII character.'],
    [['2 3 #\n', '###\n###', 'Each of the two rows contains three hashes.'], ['3 1 *\n', '*\n*\n*', 'Each row contains one star.'], ['1 1 X\n', 'X'], ['1 4 a\n', 'aaaa'], ['4 2 +\n', '++\n++\n++\n++'], ['2 5 0\n', '00000\n00000'], ['3 3 @\n', '@@@\n@@@\n@@@'], ['5 1 !\n', '!\n!\n!\n!\n!']],
    ['Read the dimensions and character separately.', 'Convert the dimensions to integers.', 'Repeat once for each row.', 'Make each row contain exactly width copies of the character.', 'Print each completed row.'],
    "h, w, ch = input().split()\nh, w = int(h), int(w)\nfor row in range(h):\n    line = ''\n    for col in range(w):\n        line += ch\n    print(line)\n",
    'Build each row with an inner loop, then print it in the outer loop.',
    "h, w, ch = input().split()\nh, w = int(h), int(w)\n\n# Build and print the rectangle.\n"
  ),
  'level-26-problem-2': challenge(
    'Left-Aligned Staircase', 'Print a staircase whose rows grow by one character.',
    'One line: n character.', 'Print n rows; row i has i copies of the character, for i from 1 through n.',
    ['1 <= n <= 10.', 'The character is one visible non-whitespace ASCII character.'],
    [['3 *\n', '*\n**\n***', 'The three rows contain one, two, then three stars.'], ['2 #\n', '#\n##', 'The second row adds one hash.'], ['1 X\n', 'X'], ['4 +\n', '+\n++\n+++\n++++'], ['5 a\n', 'a\naa\naaa\naaaa\naaaaa'], ['2 0\n', '0\n00'], ['3 !\n', '!\n!!\n!!!'], ['1 @\n', '@']],
    ['Read n and the character.', 'Count rows from one, not zero.', 'Each row needs as many characters as its row number.', 'Build a row in an inner loop or by repetition.', 'Print the row before moving to the next.'],
    "n, ch = input().split()\nfor row in range(1, int(n) + 1):\n    line = ''\n    for col in range(row):\n        line += ch\n    print(line)\n",
    'The row number is also the number of characters to print.',
    "n, ch = input().split()\nn = int(n)\n\n# Print the growing rows.\n"
  ),
  'level-26-problem-3': challenge(
    'Hollow Rectangle Border', 'Print a character rectangle with spaces in its interior.',
    'One line: height width character.', 'Print height rows of exactly width characters. Boundary positions use the character; interior positions use spaces.',
    ['1 <= height, width <= 10.', 'The character is one visible non-whitespace ASCII character.', 'When height or width is at most 2, every position is on the boundary.'],
    [['3 4 #\n', '####\n#  #\n####', 'Only the two middle positions of the middle row are interior.'], ['2 3 *\n', '***\n***', 'Both rows are boundary rows.'], ['1 1 X\n', 'X'], ['4 1 +\n', '+\n+\n+\n+'], ['1 4 a\n', 'aaaa'], ['3 2 !\n', '!!\n!!\n!!'], ['4 3 @\n', '@@@\n@ @\n@ @\n@@@'], ['3 3 0\n', '000\n0 0\n000']],
    ['Visit each row and column.', 'The first and last rows are entirely boundary.', 'The first and last columns are also boundary.', 'Use a space only when none of those tests holds.', 'Print each row without stripping its spaces.'],
    "h, w, ch = input().split()\nh, w = int(h), int(w)\nfor row in range(h):\n    line = ''\n    for col in range(w):\n        if row == 0 or row == h - 1 or col == 0 or col == w - 1:\n            line += ch\n        else:\n            line += ' '\n    print(line)\n",
    'A cell is on the border if its row or column is an outermost one.',
    "h, w, ch = input().split()\nh, w = int(h), int(w)\n\n# Build each border or interior cell.\n"
  ),
  'level-26-problem-4': challenge(
    'Multiplication Grid', 'Print a grid of products of one-based row and column numbers.',
    'One line: height width.', 'Print height rows of width integers, with one space between entries and no trailing spaces.',
    ['1 <= height, width <= 10.'],
    [['2 3\n', '1 2 3\n2 4 6', 'The second row multiplies 2 by each column number.'], ['3 1\n', '1\n2\n3', 'The only column multiplies each row number by 1.'], ['1 1\n', '1'], ['1 4\n', '1 2 3 4'], ['3 2\n', '1 2\n2 4\n3 6'], ['2 2\n', '1 2\n2 4'], ['1 5\n', '1 2 3 4 5'], ['4 3\n', '1 2 3\n2 4 6\n3 6 9\n4 8 12']],
    ['Number rows and columns starting at one.', 'Use one loop for rows and another for columns.', 'Multiply the current row and column numbers.', 'Collect the products for one row.', 'Print the row with single spaces between products.'],
    "h, w = map(int, input().split())\nfor row in range(1, h + 1):\n    values = []\n    for col in range(1, w + 1):\n        values.append(row * col)\n    print(*values)\n",
    'Each cell is row times column; print one completed row at a time.',
    "h, w = map(int, input().split())\n\n# Print the products row by row.\n"
  ),
  'level-26-problem-5': challenge(
    'Centered Character Pyramid', 'Print a centered pyramid of odd-width character rows.',
    'One line: n character.', 'Print n rows. Row i has n-i leading spaces followed by 2*i-1 characters; do not print trailing spaces.',
    ['1 <= n <= 10.', 'The character is one visible non-whitespace ASCII character.'],
    [['3 *\n', '  *\n ***\n*****', 'The rows have 2, 1, 0 leading spaces and 1, 3, 5 stars.'], ['2 #\n', ' #\n###', 'One leading space centers the top hash over the bottom row.'], ['1 X\n', 'X'], ['4 +\n', '   +\n  +++\n +++++\n+++++++'], ['2 a\n', ' a\naaa'], ['3 0\n', '  0\n 000\n00000'], ['1 !\n', '!'], ['2 @\n', ' @\n@@@']],
    ['Count rows from 1 through n.', 'The leading space count decreases by one per row.', 'The character count starts at one and increases by two.', 'For row i use n-i spaces and 2*i-1 characters.', 'Concatenate the spaces and characters before printing.'],
    "n, ch = input().split()\nn = int(n)\nfor row in range(1, n + 1):\n    print(' ' * (n - row) + ch * (2 * row - 1))\n",
    'Leading spaces align the center while the odd character count expands by two per row.',
    "n, ch = input().split()\nn = int(n)\n\n# Print the centered rows.\n"
  ),
  'level-27-problem-1': challenge(
    'Count Record Highs', 'Count values that are strictly larger than every preceding value in the sequence. The first value is always a record high; ties are not records.',
    'First line n; second line n space-separated integers.', 'Print the number of record highs.',
    ['1 <= n <= 100.', 'Each integer is between -1000 and 1000 inclusive.'],
    [['5\n3 1 4 4 5\n', '3', 'The record highs are 3, 4, and 5; the second 4 only ties the previous maximum.'], ['5\n-5 -3 -4 0 -3\n', '3', 'The first value, -3, and 0 set records, even though the first two are negative.'], ['1\n-1000\n', '1'], ['4\n0 0 0 0\n', '1'], ['4\n1 2 3 4\n', '4'], ['4\n4 3 2 1\n', '1'], ['5\n-2 0 -1 0 1\n', '3'], ['7\n2 5 5 4 6 6 7\n', '4']],
    ['The first value is a record without any earlier values to compare.', 'Initialize the running maximum from that first value, not zero.', 'Start the record count at one.', 'For each later value, compare it with the maximum of all earlier values.', 'Only a strictly larger value is a new record; count it and update the maximum.'],
    "n = int(input())\nvalues = list(map(int, input().split()))\nbest = values[0]\ncount = 1\nfor value in values[1:]:\n    if value > best:\n        count += 1\n        best = value\nprint(count)\n",
    'Start with the first record and track the maximum so far; a larger value increases the record count and becomes the new maximum.',
    "n = int(input())\nvalues = list(map(int, input().split()))\n\n# Count values that set a new record high.\n"
  ),
  'level-27-problem-2': challenge(
    'Count Sign Changes', 'Count adjacent pairs whose two values are nonzero and have opposite signs. Zero breaks adjacency; do not skip it.',
    'First line n; second line n space-separated integers.', 'Print the count of qualifying adjacent pairs.',
    ['1 <= n <= 100.', 'Each integer is between -1000 and 1000 inclusive.'],
    [['5\n1 -2 -3 4 -5\n', '3', 'The pairs 1,-2; -3,4; and 4,-5 have opposite signs.'], ['4\n1 0 -2 3\n', '1', 'Zero prevents a comparison across it; only -2,3 qualifies.'], ['1\n-1\n', '0'], ['3\n0 0 0\n', '0'], ['2\n-1 1\n', '1'], ['4\n-1 -2 -3 -4\n', '0'], ['3\n-1 0 1\n', '0'], ['5\n1 -1 1 -1 1\n', '4']],
    ['Consider only neighboring positions.', 'A zero must not be paired as either sign.', 'Compare each value with its immediate predecessor.', 'Opposite signs have a negative product.', 'Count qualifying pairs and print the count.'],
    "n = int(input())\nvalues = list(map(int, input().split()))\ncount = 0\nfor i in range(1, n):\n    if values[i - 1] * values[i] < 0:\n        count += 1\nprint(count)\n",
    'A negative product identifies exactly an adjacent pair of opposite nonzero signs.',
    "n = int(input())\nvalues = list(map(int, input().split()))\n\n# Count adjacent opposite-sign pairs.\n"
  ),
  'level-27-problem-3': challenge(
    'Longest Equal-Value Run', 'Find the length of the longest contiguous run of equal values.',
    'First line n; second line n space-separated integers.', 'Print the longest run length.',
    ['1 <= n <= 100.', 'Each integer is between -1000 and 1000 inclusive.'],
    [['6\n2 2 3 3 3 2\n', '3', 'The three consecutive 3s form the longest run.'], ['4\n7 7 7 7\n', '4', 'All four values belong to one run.'], ['1\n0\n', '1'], ['4\n1 2 1 2\n', '1'], ['5\n-1 -1 0 -1 -1\n', '2'], ['5\n1 2 2 3 3\n', '2'], ['5\n9 8 8 8 8\n', '4'], ['3\n0 0 1\n', '2']],
    ['A run must occupy consecutive positions.', 'Start the current and best lengths at one.', 'Extend the current run when consecutive values match.', 'Otherwise reset the current length to one.', 'Update the best length after each comparison.'],
    "n = int(input())\nvalues = list(map(int, input().split()))\ncurrent = best = 1\nfor i in range(1, n):\n    if values[i] == values[i - 1]:\n        current += 1\n    else:\n        current = 1\n    best = max(best, current)\nprint(best)\n",
    'Track the length ending at each position and the largest length seen.',
    "n = int(input())\nvalues = list(map(int, input().split()))\n\n# Find the longest equal run.\n"
  ),
  'level-27-problem-4': challenge(
    'First Strict Decrease', 'Find the first value strictly smaller than its immediate predecessor.',
    'First line n; second line n space-separated integers.', 'Print its zero-based index, or -1 if no such value exists.',
    ['1 <= n <= 100.', 'Each integer is between -1000 and 1000 inclusive.', 'Equal neighbors are not a decrease.'],
    [['5\n1 3 3 2 0\n', '3', 'The first decrease is from index 2 to index 3.'], ['3\n4 4 5\n', '-1', 'Equal or increasing neighbors are not decreases.'], ['1\n9\n', '-1'], ['2\n5 4\n', '1'], ['4\n4 3 2 1\n', '1'], ['4\n-3 -2 -1 -2\n', '3'], ['3\n1 1 0\n', '2'], ['2\n-1 0\n', '-1']],
    ['There is no predecessor for index zero.', 'Start comparing at index one.', 'Compare each value to the previous value.', 'Stop at the first strictly smaller value.', 'Use -1 if the loop finds none.'],
    "n = int(input())\nvalues = list(map(int, input().split()))\nanswer = -1\nfor i in range(1, n):\n    if values[i] < values[i - 1]:\n        answer = i\n        break\nprint(answer)\n",
    'Scanning from left to right makes the first smaller neighbor the required index.',
    "n = int(input())\nvalues = list(map(int, input().split()))\n\n# Find the first decreasing index.\n"
  ),
  'level-27-problem-5': challenge(
    'Running Minimum Sequence', 'Report the smallest value seen so far at every position.',
    'First line n; second line n space-separated integers.', 'Print n running minima on one line separated by single spaces.',
    ['1 <= n <= 100.', 'Each integer is between -1000 and 1000 inclusive.'],
    [['5\n4 2 3 -1 0\n', '4 2 2 -1 -1', 'The minimum changes at 2 and again at -1.'], ['3\n-2 -2 -5\n', '-2 -2 -5', 'A tie keeps the minimum; -5 lowers it.'], ['1\n7\n', '7'], ['4\n1 2 3 4\n', '1 1 1 1'], ['4\n4 3 2 1\n', '4 3 2 1'], ['3\n0 0 0\n', '0 0 0'], ['3\n-1 0 -2\n', '-1 -1 -2'], ['2\n1000 -1000\n', '1000 -1000']],
    ['Initialize the minimum with the first value.', 'Visit values from left to right.', 'Update the minimum when the current value is smaller.', 'Record the minimum after every value, including the first.', 'Print the recorded values separated by spaces.'],
    "n = int(input())\nvalues = list(map(int, input().split()))\nbest = values[0]\nresult = []\nfor value in values:\n    best = min(best, value)\n    result.append(best)\nprint(*result)\n",
    'The running minimum after each input is the smaller of the previous minimum and that input.',
    "n = int(input())\nvalues = list(map(int, input().split()))\n\n# Build the running minimum sequence.\n"
  ),
  'level-28-problem-1': challenge(
    'Approximate Square Root by Bisection', 'Approximate the nonnegative square root using the specified bisection procedure. Start with low = 0 and high = max(1, n). While high - low is greater than tolerance, set mid to their average; if mid squared is at most n, set low to mid, otherwise set high to mid. Return the final midpoint.',
    'One line: integer n and decimal tolerance.', 'Print the final midpoint rounded to exactly six digits after the decimal point.',
    ['0 <= n <= 100.', '0.001 <= tolerance <= 1.', 'Use Python float arithmetic for the interval and tolerance, and format the final midpoint with Python .6f (including its tie rounding).', 'Use the specified bounds and stopping rule, even when a midpoint is an exact root.'],
    [['4 1\n', '2.500000', 'The intervals are [0,4], [2,4], then [2,3]; their final midpoint is 2.5.'], ['1 0.5\n', '0.750000', 'The interval narrows from [0,1] to [0.5,1], whose midpoint is 0.75.'], ['0 0.015625\n', '0.007812'], ['9 1\n', '3.093750'], ['0 1\n', '0.500000'], ['2 0.125\n', '1.437500'], ['4 0.5\n', '2.250000'], ['16 1\n', '4.500000']],
    ['The root lies between low and high.', 'Start high at max(1, n), including when n is zero.', 'Compare the midpoint squared with n.', 'Keep the half containing the root until the interval is narrow enough.', 'Print the midpoint of the final interval to six decimal places.'],
    "n, tolerance = input().split()\nn = int(n)\ntolerance = float(tolerance)\nlow, high = 0.0, float(max(1, n))\nwhile high - low > tolerance:\n    mid = (low + high) / 2\n    if mid * mid <= n:\n        low = mid\n    else:\n        high = mid\nprint(f'{(low + high) / 2:.6f}')\n",
    'Each step keeps the square root inside the interval; the final midpoint is within half the final width of it.',
    "n, tolerance = input().split()\nn, tolerance = int(n), float(tolerance)\n\n# Bisect the interval and print its final midpoint.\n"
  ),
  'level-28-problem-2': challenge(
    'Count Decimal Trailing Zeros', 'Count the consecutive zeros at the end of a positive integer in decimal notation.',
    'One positive integer n.', 'Print the number of trailing zeros.',
    ['1 <= n <= 1000000000.'],
    [['12000\n', '3', '12000 ends in three zeros.'], ['4050\n', '1', 'Only the last zero is trailing; the other zero is internal.'], ['1\n', '0'], ['10\n', '1'], ['1000000000\n', '9'], ['101\n', '0'], ['1001\n', '0'], ['100\n', '2']],
    ['Look at the last decimal digit using modulo 10.', 'Only count a zero while it is at the end.', 'Remove a counted zero using integer division by 10.', 'Stop when the last digit is nonzero.', 'Print the number removed.'],
    "n = int(input())\ncount = 0\nwhile n % 10 == 0:\n    count += 1\n    n //= 10\nprint(count)\n",
    'Each division by ten removes one trailing zero; a positive n eventually ends with a nonzero digit.',
    "n = int(input())\n\n# Count and remove trailing zeros.\n"
  ),
  'level-28-problem-3': challenge(
    'Convert Decimal to Binary', 'Convert a nonnegative integer to its base-two representation without leading zeros.',
    'One integer n in decimal.', 'Print its binary digits; print 0 for zero.',
    ['0 <= n <= 1024.'],
    [['13\n', '1101', '13 is 8 + 4 + 1, giving binary 1101.'], ['8\n', '1000', '8 is one followed by three binary zeros.'], ['0\n', '0'], ['1\n', '1'], ['2\n', '10'], ['3\n', '11'], ['10\n', '1010'], ['1024\n', '10000000000']],
    ['The remainder on division by two is the last binary digit.', 'Repeatedly divide the number by two using integer division.', 'Collect the remainders in reverse order.', 'Reverse the collected digits before printing.', 'Handle zero separately.'],
    "n = int(input())\nif n == 0:\n    print('0')\nelse:\n    digits = ''\n    while n > 0:\n        digits = str(n % 2) + digits\n        n //= 2\n    print(digits)\n",
    'Each remainder is the next digit from right to left, so prepend it to the result.',
    "n = int(input())\n\n# Convert n using repeated division by two.\n"
  ),
  'level-28-problem-4': challenge(
    'Convert Binary to Decimal', 'Evaluate a binary digit string as a base-two integer.',
    'One nonempty string of binary digits on a line.', 'Print the corresponding decimal integer.',
    ['The string contains 1 to 10 digits, each 0 or 1.', 'Leading zeros are permitted.'],
    [['1101\n', '13', 'The place values 8, 4, and 1 add to 13.'], ['0010\n', '2', 'Leading zeros do not change the value of binary 10.'], ['0\n', '0'], ['1\n', '1'], ['10\n', '2'], ['111\n', '7'], ['1000000000\n', '512'], ['101010\n', '42']],
    ['Process digits from left to right.', 'Keep the value of the prefix seen so far.', 'Each new binary place doubles that prefix value.', 'Add the new digit after doubling.', 'Convert each character to an integer.'],
    "bits = input()\nvalue = 0\nfor bit in bits:\n    value = value * 2 + int(bit)\nprint(value)\n",
    'Appending a binary digit doubles the preceding value and adds the new digit.',
    "bits = input()\n\n# Accumulate the base-two value.\n"
  ),
  'level-28-problem-5': challenge(
    'Digital Root by Repeated Sums', 'Repeatedly replace a nonnegative integer with the sum of its decimal digits until one digit remains.',
    'One nonnegative integer n.', 'Print the final single digit.',
    ['0 <= n <= 1000000000.'],
    [['9875\n', '2', '9+8+7+5 = 29, then 2+9 = 11, then 1+1 = 2.'], ['10\n', '1', '1+0 is already a single digit.'], ['0\n', '0'], ['9\n', '9'], ['99\n', '9'], ['1000000000\n', '1'], ['12345\n', '6'], ['999\n', '9']],
    ['Stop when the number has only one digit.', 'For each pass start a fresh digit sum.', 'Extract the last digit with modulo 10.', 'Remove that digit with integer division by 10.', 'Replace the number by the sum and repeat if needed.'],
    "n = int(input())\nwhile n >= 10:\n    total = 0\n    while n > 0:\n        total += n % 10\n        n //= 10\n    n = total\nprint(n)\n",
    'The inner loop sums one number’s digits; the outer loop repeats until a single digit remains.',
    "n = int(input())\n\n# Repeat digit summation until one digit remains.\n"
  ),
  'level-29-problem-1': challenge(
    'Count Primes in an Interval', 'Count prime integers in an inclusive interval. A prime is greater than one and has no positive divisors except one and itself.',
    'One line: integers low high.', 'Print the number of primes between low and high inclusive.',
    ['-10 <= low <= high <= 100.'],
    [['1 10\n', '4', 'The primes are 2, 3, 5, and 7.'], ['14 16\n', '0', 'Each number in this interval is composite.'], ['-5 2\n', '1'], ['2 2\n', '1'], ['1 1\n', '0'], ['17 17\n', '1'], ['20 30\n', '2'], ['90 100\n', '1']],
    ['Examine every integer in the inclusive interval.', 'Values below two are not prime.', 'Try possible divisors starting at two.', 'A found divisor makes the candidate composite.', 'Count candidates with no divisor.'],
    "low, high = map(int, input().split())\ncount = 0\nfor number in range(max(2, low), high + 1):\n    prime = True\n    for divisor in range(2, number):\n        if number % divisor == 0:\n            prime = False\n            break\n    if prime:\n        count += 1\nprint(count)\n",
    'For every candidate at least two, trial division detects a factor and the outer loop counts the survivors.',
    "low, high = map(int, input().split())\n\n# Count primes in the inclusive interval.\n"
  ),
  'level-29-problem-2': challenge(
    'Perfect Number Test', 'Determine whether a positive integer equals the sum of its proper positive divisors, excluding the number itself.',
    'One positive integer n.', 'Print YES if n is perfect, otherwise NO.',
    ['1 <= n <= 1000.'],
    [['6\n', 'YES', 'Its proper divisors 1, 2, and 3 sum to 6.'], ['12\n', 'NO', 'Its proper divisors sum to 1+2+3+4+6 = 16.'], ['1\n', 'NO'], ['2\n', 'NO'], ['28\n', 'YES'], ['496\n', 'YES'], ['10\n', 'NO'], ['1000\n', 'NO']],
    ['Proper divisors are positive and smaller than n.', 'Test candidates from 1 through n-1.', 'A divisor leaves remainder zero.', 'Add each proper divisor to an accumulator.', 'Compare the final sum with n.'],
    "n = int(input())\ntotal = 0\nfor divisor in range(1, n):\n    if n % divisor == 0:\n        total += divisor\nprint('YES' if total == n else 'NO')\n",
    'Summing only smaller positive divisors yields the proper-divisor sum, including an empty sum for 1.',
    "n = int(input())\n\n# Sum proper divisors and compare with n.\n"
  ),
  'level-29-problem-3': challenge(
    'Least Common Multiple', 'Find the nonnegative least common multiple of two integers. Define the result as zero if either input is zero.',
    'One line: integers a b.', 'Print their nonnegative least common multiple.',
    ['-1000 <= a, b <= 1000.'],
    [['12 18\n', '36', '36 is the smallest positive multiple shared by 12 and 18.'], ['-4 6\n', '12', 'Signs do not change the nonnegative common multiple.'], ['0 5\n', '0'], ['0 0\n', '0'], ['1 9\n', '9'], ['7 7\n', '7'], ['8 9\n', '72'], ['-12 -15\n', '60']],
    ['If either input is zero, the answer is zero.', 'Otherwise find the GCD of their absolute values.', 'Euclid’s algorithm repeatedly replaces a pair with divisor and remainder.', 'Divide one magnitude by the GCD before multiplying.', 'The LCM is always nonnegative.'],
    "a, b = map(int, input().split())\nx, y = abs(a), abs(b)\nwhile y:\n    x, y = y, x % y\nif x == 0:\n    print(0)\nelse:\n    print(abs(a) // x * abs(b))\n",
    'Euclid’s loop finds the GCD; dividing the product of magnitudes by it gives the LCM, including one-zero cases.',
    "a, b = map(int, input().split())\n\n# Find the GCD and use it to print the LCM.\n"
  ),
  'level-29-problem-4': challenge(
    'Integer Palindrome Test', 'Determine whether the decimal representation of a nonnegative integer reads the same in both directions.',
    'One nonnegative integer n.', 'Print YES if its decimal representation is a palindrome, otherwise NO.',
    ['0 <= n <= 1000000000.', 'The input has no leading zeros except for 0 itself.'],
    [['1221\n', 'YES', 'Reversing 1221 gives 1221.'], ['120\n', 'NO', 'Reversing its digits gives 021, not the original representation.'], ['0\n', 'YES'], ['7\n', 'YES'], ['11\n', 'YES'], ['12321\n', 'YES'], ['1001\n', 'YES'], ['123\n', 'NO']],
    ['Keep the original number for comparison.', 'Extract digits from right to left with modulo 10.', 'Build the reversed integer by multiplying it by 10 and adding a digit.', 'Remove the extracted digit using integer division.', 'Compare the reversed number to the original.'],
    "n = int(input())\nremaining = n\nreverse = 0\nwhile remaining > 0:\n    reverse = reverse * 10 + remaining % 10\n    remaining //= 10\nprint('YES' if reverse == n else 'NO')\n",
    'Reversing the extracted digits builds an integer equal to the original exactly for palindromes.',
    "n = int(input())\n\n# Reverse the digits and compare with the original.\n"
  ),
  'level-29-problem-5': challenge(
    'Count Coprime Integers', 'Count integers from 1 through n whose greatest common divisor with n is 1.',
    'One positive integer n.', 'Print the number of integers in the inclusive range that are coprime to n.',
    ['1 <= n <= 100.', 'The greatest common divisor of 1 and 1 is 1.'],
    [['6\n', '2', 'Only 1 and 5 are coprime to 6.'], ['7\n', '6', 'For prime 7, each of 1 through 6 has GCD 1 with 7.'], ['1\n', '1'], ['2\n', '1'], ['4\n', '2'], ['8\n', '4'], ['12\n', '4'], ['30\n', '8']],
    ['Try each candidate from 1 through n.', 'For each candidate compute its GCD with n.', 'Use a fresh pair of values for each GCD computation.', 'Euclid’s remainder loop stops when the second value reaches zero.', 'Count the candidates whose GCD is one.'],
    "n = int(input())\ncount = 0\nfor candidate in range(1, n + 1):\n    a, b = candidate, n\n    while b:\n        a, b = b, a % b\n    if a == 1:\n        count += 1\nprint(count)\n",
    'Compute a fresh GCD for each candidate and count precisely those with GCD 1.',
    "n = int(input())\n\n# Count candidates with GCD 1.\n"
  ),
  'level-30-problem-1': challenge(
    'Simulate Compound Growth', 'Apply a percentage growth rate repeatedly to an initial amount, once per period. Do not round between periods.',
    'One line: initial amount, integer percentage rate, and integer number of periods.', 'Print the final amount to exactly two digits after the decimal point.',
    ['0 <= initial amount <= 1000, given with at most two decimal places.', '0 <= rate <= 100.', '0 <= periods <= 10.', 'Convert amount to a Python float and update it each period as amount * (1 + rate / 100).', 'Format only the final result with Python .2f; ties use Python’s rounding of the represented float.'],
    [['100 10 2\n', '121.00', '100 grows to 110 and then to 121.'], ['50 20 1\n', '60.00', 'A single 20% increase adds 10.'], ['5 10 0\n', '5.00'], ['0 100 5\n', '0.00'], ['1.25 30 1\n', '1.62'], ['10 50 3\n', '33.75'], ['0.01 10 5\n', '0.02'], ['2.50 20 2\n', '3.60']],
    ['Convert the percentage to a multiplier of 1 + rate/100.', 'Start with the initial amount.', 'Apply the multiplier once per period.', 'Do not round inside the loop.', 'Format the final amount with two decimal places.'],
    "amount, rate, periods = input().split()\namount, rate, periods = float(amount), int(rate), int(periods)\nfor _ in range(periods):\n    amount *= 1 + rate / 100\nprint(f'{amount:.2f}')\n",
    'The loop applies each period’s growth to the amount resulting from the previous period.',
    "amount, rate, periods = input().split()\namount, rate, periods = float(amount), int(rate), int(periods)\n\n# Apply growth once per period and print the amount.\n"
  ),
  'level-30-problem-2': challenge(
    'Longest Exact-Sum Segment', 'Find the maximum length of a nonempty contiguous segment whose values sum exactly to the target.',
    'First line: n target. Second line: n space-separated integers.', 'Print the longest matching segment length, or 0 if no nonempty segment matches.',
    ['1 <= n <= 50.', '-100 <= each value and target <= 100.', 'A segment uses consecutive positions; negative values and zero are allowed.'],
    [['5 3\n5 -3 2 -4 3\n', '5', 'The whole sequence sums to 3, even though its first value already exceeds the target.'], ['5 4\n9 2 2 1 8\n', '2', 'The consecutive values 2 and 2 sum to 4, and no longer segment does.'], ['3 4\n1 9 3\n', '0'], ['1 5\n5\n', '1'], ['1 0\n0\n', '1'], ['4 0\n0 0 0 0\n', '4'], ['4 -3\n-1 -2 5 -3\n', '2'], ['6 3\n9 1 -1 2 -2 3\n', '5']],
    ['Choose each possible segment start with an outer loop.', 'Reset a running sum to zero for each new start.', 'Extend the segment one element at a time with an inner loop.', 'Whenever the sum equals the target, compare its length with the best so far.', 'Do not stop when the sum exceeds the target: later negative values can reduce it.'],
    "n, target = map(int, input().split())\nvalues = list(map(int, input().split()))\nbest = 0\nfor start in range(n):\n    total = 0\n    for end in range(start, n):\n        total += values[end]\n        if total == target:\n            best = max(best, end - start + 1)\nprint(best)\n",
    'For each starting position, extend the segment and accumulate its sum; retain the greatest length among exact matches.',
    "n, target = map(int, input().split())\nvalues = list(map(int, input().split()))\n\n# Try contiguous segments and print the longest exact-sum length.\n"
  ),
  'level-30-problem-3': challenge(
    'Count Nested Pairs Below a Sum', 'Count pairs of distinct positions i < j whose values sum to less than a threshold. Equal values at different positions form distinct pairs.',
    'First line n threshold; second line n space-separated integers.', 'Print the number of qualifying index pairs.',
    ['1 <= n <= 50.', '-100 <= each value, threshold <= 100.'],
    [['4 5\n1 2 3 4\n', '2', 'Only index pairs holding 1+2 and 1+3 have sums below 5.'], ['3 1\n0 0 0\n', '3', 'All three distinct pairs sum to 0, below 1.'], ['1 5\n1\n', '0'], ['2 3\n1 2\n', '0'], ['3 0\n-2 1 2\n', '1'], ['4 10\n1 2 3 4\n', '6'], ['3 -2\n-3 -2 2\n', '1'], ['4 0\n-1 1 -1 1\n', '1']],
    ['Choose the first index with an outer loop.', 'Start the second index after the first.', 'This visits each pair exactly once.', 'Use a strict less-than comparison for the sum.', 'Increment a counter for every qualifying pair.'],
    "n, threshold = map(int, input().split())\nvalues = list(map(int, input().split()))\ncount = 0\nfor i in range(n):\n    for j in range(i + 1, n):\n        if values[i] + values[j] < threshold:\n            count += 1\nprint(count)\n",
    'The nested loops examine each ordered index pair i < j exactly once.',
    "n, threshold = map(int, input().split())\nvalues = list(map(int, input().split()))\n\n# Count qualifying index pairs.\n"
  ),
  'level-30-problem-4': challenge(
    'Consecutive Purchase Budget', 'Items cost 1, 2, 3, and so on. Buy them in this order while the next item fits the remaining budget. Find how many items can be bought.',
    'One nonnegative integer budget.', 'Print the maximum number of consecutive items purchased starting with item 1.',
    ['0 <= budget <= 10000.', 'You cannot skip an item.', 'A purchase that exactly uses the remaining budget is allowed.'],
    [['10\n', '4', 'The first four items cost 1+2+3+4 = 10.'], ['8\n', '3', 'The first three cost 6; the fourth costs 4 and exceeds the remaining 2.'], ['0\n', '0'], ['1\n', '1'], ['2\n', '1'], ['3\n', '2'], ['6\n', '3'], ['15\n', '5']],
    ['Start with item 1 and the full remaining budget.', 'Check whether the next item costs at most the remaining budget.', 'Subtract its cost and count it if affordable.', 'Increase the next item cost by one.', 'Stop when the next item no longer fits.'],
    "budget = int(input())\nnext_cost = 1\ncount = 0\nwhile next_cost <= budget:\n    budget -= next_cost\n    count += 1\n    next_cost += 1\nprint(count)\n",
    'Each successful iteration buys the next item and reduces the remaining budget; the first unaffordable item ends the process.',
    "budget = int(input())\n\n# Buy consecutive items while the next one fits.\n"
  ),
  'level-30-problem-5': challenge(
    'First Repeated Decimal Digit', 'Scan a digit string from left to right and find the earliest position whose digit has already appeared.',
    'One nonempty string of decimal digits on a line, possibly beginning with zeros.', 'Print the 1-based position of the first repeated digit, or -1 if every digit is different.',
    ['The string contains 1 to 100 ASCII digits, 0 through 9.', 'Leading zeros are digits and must not be discarded.'],
    [['12031\n', '5', 'The final 1 has appeared at position 1, and no earlier digit repeats.'], ['0012\n', '2', 'The second 0 repeats the leading 0.'], ['7\n', '-1'], ['0123456789\n', '-1'], ['98765432109\n', '11'], ['112233\n', '2'], ['12321\n', '4'], ['909\n', '3']],
    ['Read the input as a string to keep leading zeros.', 'Keep a string containing the digits already seen.', 'Visit digits from left to right, tracking their 1-based positions.', 'Check whether a digit is in the seen string before adding it.', 'Stop at the first repeat, or print -1 if no repeat occurs.'],
    "digits = input()\nseen = ''\nanswer = -1\nfor position, digit in enumerate(digits, 1):\n    if digit in seen:\n        answer = position\n        break\n    seen += digit\nprint(answer)\n",
    'Checking each digit against earlier digits before appending it identifies the first repeated position.',
    "digits = input()\n\n# Find the first 1-based position whose digit appeared earlier.\n"
  )
};
