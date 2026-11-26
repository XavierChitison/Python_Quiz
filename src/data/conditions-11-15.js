import { challenge } from './beginner.js';

export const conditions1115Challenges = {
  'level-11-problem-1': challenge(
    "Classify an Integer's Sign",
    'Read an integer and report whether it is negative, zero, or positive.',
    'One integer n.',
    'Print Negative, Zero, or Positive.',
    ['-100000 <= n <= 100000.'],
    [
      ['-8\n', 'Negative', 'Since -8 is below zero, its sign is negative.'],
      ['0\n', 'Zero', 'Zero is neither positive nor negative, so report Zero.'],
      ['7\n', 'Positive'], ['-1\n', 'Negative'], ['1\n', 'Positive'],
      ['-100000\n', 'Negative'], ['100000\n', 'Positive'], ['42\n', 'Positive']
    ],
    ['Read the value as an integer.', 'Compare it with zero first.', 'Use a separate branch for values below zero.', 'Zero needs its own result.', 'The remaining values are positive.'],
    "n = int(input())\nif n < 0:\n    print('Negative')\nelif n == 0:\n    print('Zero')\nelse:\n    print('Positive')\n",
    'The three branches separate integers below zero, equal to zero, and above zero.',
    'n = int(input())\n\n# Compare n with zero and print its sign category.\n'
  ),
  'level-11-problem-2': challenge(
    'Test Integer Parity',
    'Read an integer and decide whether it is even or odd.',
    'One integer n.',
    'Print Even if n is divisible by 2; otherwise print Odd.',
    ['-100000 <= n <= 100000.'],
    [
      ['14\n', 'Even', '14 leaves remainder 0 when divided by 2, so it is even.'],
      ['-5\n', 'Odd', '-5 is not divisible by 2, so it is odd.'],
      ['0\n', 'Even'], ['1\n', 'Odd'], ['-2\n', 'Even'],
      ['99999\n', 'Odd'], ['-100000\n', 'Even'], ['38\n', 'Even']
    ],
    ['The remainder operator is written %.','An even integer has remainder zero after division by 2.','Check n % 2, not n / 2.','Negative integers can also be even or odd.','Print one of the two exact words in the output format.'],
    "n = int(input())\nif n % 2 == 0:\n    print('Even')\nelse:\n    print('Odd')\n",
    'An integer is even exactly when its remainder after division by 2 is zero.',
    'n = int(input())\n\n# Use the remainder to decide whether n is even or odd.\n'
  ),
  'level-11-problem-3': challenge(
    'Compare Two Numbers',
    'Compare two integers and describe how the first relates to the second.',
    'Two integers a and b on one line.',
    'Print Less, Equal, or Greater according to the comparison a versus b.',
    ['-100000 <= a, b <= 100000.'],
    [
      ['3 9\n', 'Less', '3 is smaller than 9, so the first number is Less.'],
      ['6 6\n', 'Equal', 'Both values are 6, so they are Equal.'],
      ['10 -2\n', 'Greater'], ['-4 0\n', 'Less'], ['0 0\n', 'Equal'],
      ['-7 -9\n', 'Greater'], ['100000 99999\n', 'Greater'], ['8 12\n', 'Less']
    ],
    ['Read both integers in order.', 'Compare a with b using < first.', 'Use == to detect equal values.', 'If neither is less nor equal, a must be greater.','Print the category, not either input number.'],
    "a, b = map(int, input().split())\nif a < b:\n    print('Less')\nelif a == b:\n    print('Equal')\nelse:\n    print('Greater')\n",
    'The ordered branches distinguish less-than, equality, and the remaining greater-than case.',
    'a, b = map(int, input().split())\n\n# Compare the two values and print the correct relation.\n'
  ),
  'level-11-problem-4': challenge(
    'Larger of Two Values',
    'Read two integers and print the larger one. If they are equal, print that shared value.',
    'Two integers a and b on one line.',
    'Print the greater of a and b, or their common value when equal.',
    ['-100000 <= a, b <= 100000.'],
    [
      ['4 11\n', '11', '11 is greater than 4, so it is the larger value.'],
      ['-3 -3\n', '-3', 'The values are equal, and the shared value -3 is printed.'],
      ['8 2\n', '8'], ['-9 0\n', '0'], ['0 -1\n', '0'],
      ['100000 -100000\n', '100000'], ['5 5\n', '5'], ['-6 -2\n', '-2']
    ],
    ['Read the two values as integers.','Compare the first value with the second.','Choose a when a is greater than b.','Otherwise b is at least as large as a.','Printing either value works when the two are equal.'],
    'a, b = map(int, input().split())\nif a > b:\n    print(a)\nelse:\n    print(b)\n',
    'Print a only when it is strictly larger; otherwise b is the larger value or is tied with a.',
    'a, b = map(int, input().split())\n\n# Print the larger value, including the shared value for a tie.\n'
  ),
  'level-11-problem-5': challenge(
    'Clamp to an Interval',
    'Limit an integer to a supplied closed interval: values below the interval become its lower bound, values above it become its upper bound, and values inside stay unchanged.',
    'Three integers x, low, and high on one line.',
    'Print x limited to the inclusive interval from low to high.',
    ['-100000 <= low <= high <= 100000.','-100000 <= x <= 100000.'],
    [
      ['3 5 12\n', '5', '3 is below the interval, so it is raised to the lower bound 5.'],
      ['9 5 12\n', '9', '9 already lies between 5 and 12, so it stays unchanged.'],
      ['20 5 12\n', '12'], ['5 5 12\n', '5'], ['12 5 12\n', '12'],
      ['-8 -10 -2\n', '-8'], ['-20 -10 -2\n', '-10'], ['20 -10 -2\n', '-2']
    ],
    ['Read x and the two bounds.', 'The bounds are guaranteed to be in increasing order.','If x is below low, use low.','Otherwise, if x is above high, use high.','If neither comparison is true, keep x.'],
    'x, low, high = map(int, input().split())\nif x < low:\n    x = low\nelif x > high:\n    x = high\nprint(x)\n',
    'The two boundary checks replace only values outside the interval; an in-range value is preserved.',
    'x, low, high = map(int, input().split())\n\n# Replace an out-of-range value with the nearest endpoint.\n'
  ),
  'level-12-problem-1': challenge(
    'Closed Interval Membership',
    'Determine whether an integer lies within an interval whose endpoints are included.',
    'Three integers x, low, and high on one line.',
    'Print True if low <= x <= high; otherwise print False.',
    ['-100000 <= low <= high <= 100000.','-100000 <= x <= 100000.'],
    [
      ['7 3 10\n', 'True', '7 is between 3 and 10, including both endpoints.'],
      ['3 3 10\n', 'True', 'A closed interval includes its lower endpoint, so 3 is inside.'],
      ['10 3 10\n', 'True'], ['2 3 10\n', 'False'], ['11 3 10\n', 'False'],
      ['0 0 0\n', 'True'], ['-5 -8 -2\n', 'True'], ['-9 -8 -2\n', 'False']
    ],
    ['Compare the value with both endpoints.','The lower comparison must allow equality.','The upper comparison must also allow equality.','Combine the two conditions with and.','Print Python-style True or False with capital first letters.'],
    'x, low, high = map(int, input().split())\nprint(low <= x <= high)\n',
    'A value belongs to the closed interval only when it is no smaller than low and no greater than high.',
    'x, low, high = map(int, input().split())\n\n# Check both inclusive bounds and print the Boolean result.\n'
  ),
  'level-12-problem-2': challenge(
    'Divisible by Both Divisors',
    'Check whether an integer is divisible by each of two nonzero divisors.',
    'Three integers n, a, and b on one line.',
    'Print True only when both n % a and n % b equal zero; otherwise print False.',
    ['-100000 <= n <= 100000.','-100 <= a, b <= 100.','a and b are nonzero.'],
    [
      ['30 5 3\n', 'True', '30 has remainder zero with both 5 and 3.'],
      ['18 3 5\n', 'False', '18 is divisible by 3 but not by 5, so both conditions are not true.'],
      ['0 7 -2\n', 'True'], ['24 6 4\n', 'True'], ['14 7 3\n', 'False'],
      ['-30 5 3\n', 'True'], ['-16 -4 8\n', 'True'], ['25 5 2\n', 'False']
    ],
    ['Use % to find each remainder.','A zero remainder means divisible.','The input divisors are nonzero.','Both divisibility checks must succeed, so use and.','Negative multiples still have remainder zero.'],
    'n, a, b = map(int, input().split())\nprint(n % a == 0 and n % b == 0)\n',
    'The result is true only if both remainder checks are zero.',
    'n, a, b = map(int, input().split())\n\n# Test divisibility by each divisor and combine the results.\n'
  ),
  'level-12-problem-3': challenge(
    'Exactly One Switch On',
    'Two switches are represented by nonnegative integer states: zero means off and any positive value means on. Decide whether exactly one switch is on.',
    'Two nonnegative integers first and second on one line, representing the states of two switches.',
    'Print Yes when exactly one value is positive, and No otherwise.',
    ['0 <= first, second <= 100.','A state of 0 means off; a positive state means on.'],
    [
      ['1 0\n', 'Yes', 'The first switch is on and the second is off, so exactly one is on.'],
      ['1 1\n', 'No', 'Both switches are on, so it is not true that exactly one is on.'],
      ['0 0\n', 'No'], ['0 7\n', 'Yes'], ['12 0\n', 'Yes'],
      ['4 9\n', 'No'], ['0 100\n', 'Yes'], ['100 100\n', 'No']
    ],
    ['A zero state means off, while any positive state means on.','Convert each state to a Boolean condition by comparing it with zero.','Exactly one state must be positive.','The two positive states may have different numeric values but are both on.','Print Yes or No according to whether the on/off states differ.'],
    "first, second = map(int, input().split())\nif (first > 0) != (second > 0):\n    print('Yes')\nelse:\n    print('No')\n",
    'Exactly one switch is on precisely when one state is positive and the other is zero.',
    'first, second = map(int, input().split())\n\n# Check whether one switch is on and the other is off.\n'
  ),
  'level-12-problem-4': challenge(
    'Three Distinct Values',
    'Determine whether three supplied integers are pairwise different.',
    'Three integers a, b, and c on one line.',
    'Print Yes if no two values are equal; otherwise print No.',
    ['-100000 <= a, b, c <= 100000.'],
    [
      ['2 5 9\n', 'Yes', '2, 5, and 9 are all different from one another.'],
      ['2 5 2\n', 'No', 'The first and third values are both 2, so they are not all distinct.'],
      ['1 1 1\n', 'No'], ['-1 0 1\n', 'Yes'], ['4 4 7\n', 'No'],
      ['7 4 4\n', 'No'], ['0 -3 8\n', 'Yes'], ['100 99 98\n', 'Yes']
    ],
    ['There are three pairs to compare.','Check that a differs from b.','Also check that a differs from c.','Finally check that b differs from c.','All three comparisons must be true.'],
    "a, b, c = map(int, input().split())\nif a != b and a != c and b != c:\n    print('Yes')\nelse:\n    print('No')\n",
    'Three values are pairwise distinct when each of the three possible pairs is unequal.',
    'a, b, c = map(int, input().split())\n\n# Check that each pair of values is unequal.\n'
  ),
  'level-12-problem-5': challenge(
    'Leap Year Test',
    'Apply the Gregorian leap-year rules: years divisible by 400 are leap years; other years divisible by 100 are not; all other years divisible by 4 are leap years.',
    'One positive integer year.',
    'Print Leap year or Common year.',
    ['1 <= year <= 9999.'],
    [
      ['2024\n', 'Leap year', '2024 is divisible by 4 but not by 100, so it is a leap year.'],
      ['1900\n', 'Common year', '1900 is divisible by 100 but not 400, so the century exception makes it common.'],
      ['2000\n', 'Leap year'], ['2023\n', 'Common year'], ['1996\n', 'Leap year'],
      ['2100\n', 'Common year'], ['2400\n', 'Leap year'], ['4\n', 'Leap year']
    ],
    ['Use % to check divisibility.','First check the special case of divisibility by 400.','A year divisible by 100 but not 400 is common.','For other years, divisibility by 4 determines the result.','Combine the conditions carefully with and and or.'],
    "year = int(input())\nif year % 400 == 0 or (year % 4 == 0 and year % 100 != 0):\n    print('Leap year')\nelse:\n    print('Common year')\n",
    'A year is leap when it is divisible by 400, or when it is divisible by 4 but not by 100.',
    'year = int(input())\n\n# Apply the Gregorian leap-year rules.\n'
  ),
  'level-13-problem-1': challenge(
    'Median of Three Numbers',
    'Find the middle value among three integers. The median is one of the supplied values, and duplicates are allowed.',
    'Three integers a, b, and c on one line.',
    'Print the median value.',
    ['-100000 <= a, b, c <= 100000.'],
    [
      ['8 2 5\n', '5', 'In sorted order the values are 2, 5, 8, so the middle value is 5.'],
      ['4 4 9\n', '4', 'In sorted order the values are 4, 4, 9; the middle value is 4.'],
      ['1 2 3\n', '2'], ['9 2 5\n', '5'], ['-4 -1 -7\n', '-4'],
      ['6 6 6\n', '6'], ['0 10 5\n', '5'], ['100 -100 0\n', '0']
    ],
    ['The median has at least one value no larger and one no smaller.','You can find the smallest and largest values first.','Subtracting both the smallest and largest from the total leaves the middle value.','This also works when some values are equal.','Print the remaining supplied integer.'],
    'a, b, c = map(int, input().split())\nprint(a + b + c - min(a, b, c) - max(a, b, c))\n',
    'For three values, their sum minus the minimum and maximum leaves the median, including when values repeat.',
    'a, b, c = map(int, input().split())\n\n# Print the value between the minimum and maximum.\n'
  ),
  'level-13-problem-2': challenge(
    'Order Three Numbers',
    'Print three integers in nondecreasing order, allowing equal values.',
    'Three integers a, b, and c on one line.',
    'Print the values from smallest to largest, separated by one space.',
    ['-100000 <= a, b, c <= 100000.'],
    [
      ['8 2 5\n', '2 5 8', 'Putting 8, 2, and 5 in order gives 2 5 8.'],
      ['4 4 1\n', '1 4 4', 'The two equal 4s both remain, after the smaller value 1.'],
      ['1 2 3\n', '1 2 3'], ['9 2 5\n', '2 5 9'], ['-4 -1 -7\n', '-7 -4 -1'],
      ['6 6 6\n', '6 6 6'], ['0 10 5\n', '0 5 10'], ['100 -100 0\n', '-100 0 100']
    ],
    ['Read all three integers.','Compare pairs to determine which values come first.','Keep duplicate values; do not remove them.','Python can sort a list of integers with sorted().','Print the three sorted values separated by spaces.'],
    'numbers = list(map(int, input().split()))\nprint(*sorted(numbers))\n',
    'Sorting the three input values in ascending order gives nondecreasing order while retaining duplicates.',
    'numbers = list(map(int, input().split()))\n\n# Put the values in nondecreasing order and print them.\n'
  ),
  'level-13-problem-3': challenge(
    'Triangle Side Validity',
    'Decide whether three positive lengths can form a triangle. Each pair of sides must have a sum strictly greater than the remaining side.',
    'Three integer lengths a, b, and c on one line.',
    'Print Valid if they can form a triangle; otherwise print Invalid.',
    ['1 <= a, b, c <= 100000.'],
    [
      ['3 4 5\n', 'Valid', 'Each pair of these lengths has a sum greater than the remaining length.'],
      ['1 2 3\n', 'Invalid', '1 + 2 equals 3, but a triangle requires a strictly greater sum.'],
      ['2 2 3\n', 'Valid'], ['1 1 3\n', 'Invalid'], ['5 10 6\n', 'Valid'],
      ['4 7 12\n', 'Invalid'], ['8 8 8\n', 'Valid'], ['2 3 4\n', 'Valid']
    ],
    ['All three lengths are already positive.','Check a + b > c.','Also check a + c > b and b + c > a.','Equality is not enough for a triangle.','All three strict inequalities must hold.'],
    "a, b, c = map(int, input().split())\nif a + b > c and a + c > b and b + c > a:\n    print('Valid')\nelse:\n    print('Invalid')\n",
    'A triangle is possible exactly when the sum of every pair of positive sides is strictly larger than the third side.',
    'a, b, c = map(int, input().split())\n\n# Check all three strict triangle inequalities.\n'
  ),
  'level-13-problem-4': challenge(
    'Triangle Side Classification',
    'Given three valid triangle side lengths, classify the triangle by its sides.',
    'Three positive integer side lengths a, b, and c that form a valid triangle.',
    'Print Equilateral if all sides match, Isosceles if exactly two match, or Scalene if all differ.',
    ['1 <= a, b, c <= 100000.','The three lengths satisfy all triangle inequalities.'],
    [
      ['5 5 5\n', 'Equilateral', 'All three sides are 5, so the triangle is equilateral.'],
      ['5 5 8\n', 'Isosceles', 'Two sides are equal and the third differs, so it is isosceles.'],
      ['3 4 5\n', 'Scalene'], ['7 4 7\n', 'Isosceles'], ['6 8 8\n', 'Isosceles'],
      ['9 9 9\n', 'Equilateral'], ['2 3 4\n', 'Scalene'], ['10 12 15\n', 'Scalene']
    ],
    ['Compare the three side lengths.','If all three are equal, report Equilateral.','Otherwise check whether any pair is equal.','A triangle with exactly one matching pair is Isosceles.','If there are no equal pairs, report Scalene.'],
    "a, b, c = map(int, input().split())\nif a == b == c:\n    print('Equilateral')\nelif a == b or a == c or b == c:\n    print('Isosceles')\nelse:\n    print('Scalene')\n",
    'Check the all-equal case before the any-pair-equal case; remaining valid triangles have all different sides.',
    'a, b, c = map(int, input().split())\n\n# Compare the sides and print the matching triangle type.\n'
  ),
  'level-13-problem-5': challenge(
    'Triangle Angle Classification',
    'Classify a valid triangle as acute, right, or obtuse using its side lengths.',
    'Three positive integer side lengths a, b, and c on one line; they form a valid triangle.',
    'Print Acute, Right, or Obtuse.',
    ['1 <= a, b, c <= 10000.','The three lengths form a valid triangle.'],
    [
      ['3 4 5\n', 'Right', 'The longest side is 5 and 3 squared plus 4 squared equals 5 squared.'],
      ['4 5 6\n', 'Acute', 'With longest side 6, 4 squared plus 5 squared is greater than 6 squared.'],
      ['2 3 4\n', 'Obtuse'], ['5 5 6\n', 'Acute'], ['5 5 8\n', 'Obtuse'],
      ['7 24 25\n', 'Right'], ['8 8 8\n', 'Acute'], ['9 12 15\n', 'Right']
    ],
    ['Sort the side lengths so the longest side is last.','Call the sorted sides x, y, and z.','Compare x squared plus y squared with z squared.','Equality means right; a larger sum means acute.','A smaller sum means obtuse.'],
    "a, b, c = sorted(map(int, input().split()))\nif a * a + b * b == c * c:\n    print('Right')\nelif a * a + b * b > c * c:\n    print('Acute')\nelse:\n    print('Obtuse')\n",
    'For a valid triangle, comparing the sum of the squares of the two shorter sides with the square of the longest side distinguishes right, acute, and obtuse angles.',
    'a, b, c = map(int, input().split())\n\n# Compare the squared shorter sides with the squared longest side.\n'
  ),
  'level-14-problem-1': challenge(
    'Letter Grade from Score',
    'Convert a whole-number score into a letter grade using inclusive lower thresholds.',
    'One integer score.',
    'Print A for 90-100, B for 80-89, C for 70-79, D for 60-69, or F for 0-59.',
    ['0 <= score <= 100.'],
    [
      ['92\n', 'A', '92 is at least 90, so the score earns grade A.'],
      ['80\n', 'B', '80 reaches the B threshold but is below the A threshold.'],
      ['100\n', 'A'], ['90\n', 'A'], ['89\n', 'B'], ['70\n', 'C'], ['60\n', 'D'], ['0\n', 'F']
    ],
    ['Start by checking the highest threshold.','Use elif so a score matches only one band.','The thresholds are 90, 80, 70, and 60.','Because the score is bounded, the final else case is F.','Pay attention to scores exactly on a threshold.'],
    "score = int(input())\nif score >= 90:\n    print('A')\nelif score >= 80:\n    print('B')\nelif score >= 70:\n    print('C')\nelif score >= 60:\n    print('D')\nelse:\n    print('F')\n",
    'Checking lower thresholds from highest to lowest assigns each bounded score to exactly one grade band.',
    'score = int(input())\n\n# Check the score bands from highest to lowest.\n'
  ),
  'level-14-problem-2': challenge(
    'Piecewise Linear Fee',
    'Calculate a service fee with a base charge of 5 units, plus 2 units for each whole unit beyond the first 10.',
    'One nonnegative integer representing the number of service units used.',
    'Print the total fee: 5 when usage is at most 10, otherwise 5 plus 2 times the amount over 10.',
    ['0 <= usage <= 100000.'],
    [
      ['8\n', '5', 'Using 8 units does not pass the included 10, so only the base fee of 5 applies.'],
      ['13\n', '11', '13 uses 3 units beyond 10, adding 2 * 3 to the base 5.'],
      ['0\n', '5'], ['10\n', '5'], ['11\n', '7'], ['20\n', '25'], ['100\n', '185'], ['15\n', '15']
    ],
    ['The first 10 units are covered by the base fee.','Usage exactly 10 has no extra charge.','Above 10, find the excess as usage - 10.','Each excess unit costs 2.','Add the extra cost to the base fee.'],
    'usage = int(input())\nif usage <= 10:\n    fee = 5\nelse:\n    fee = 5 + 2 * (usage - 10)\nprint(fee)\n',
    'Charge the base amount for up to 10 units, then add 2 for each unit above 10.',
    'usage = int(input())\n\n# Calculate the base fee and any charge beyond 10 units.\n'
  ),
  'level-14-problem-3': challenge(
    'Progressive Tax on Two Bands',
    'Calculate tax on a nonnegative income: charge 10% on the first 10000 units and 20% only on any income above 10000.',
    'One nonnegative integer income.',
    'Print the tax amount with exactly two digits after the decimal point.',
    ['0 <= income <= 1000000.','The first band is capped at 10000 units.'],
    [
      ['8000\n', '800.00', 'All 8000 units are in the first band, so tax is 10% of 8000.'],
      ['12000\n', '1400.00', 'The first 10000 contributes 1000 tax; the remaining 2000 contributes 400.'],
      ['0\n', '0.00'], ['10000\n', '1000.00'], ['10001\n', '1000.20'],
      ['20000\n', '3000.00'], ['50000\n', '9000.00'], ['9999\n', '999.90']
    ],
    ['Do not apply the higher rate to all income.','At most 10000 units receive the 10% rate.','Use the income above 10000 as the second band.','Add the tax from both bands.','Format the result to two decimal places.'],
    'income = int(input())\nfirst_band = min(income, 10000)\nextra = max(0, income - 10000)\ntax = first_band * 0.10 + extra * 0.20\nprint(f\"{tax:.2f}\")\n',
    'The tax is 10% of the portion up to 10000 plus 20% of only the remaining income.',
    "income = int(input())\n\n# Calculate each band's tax separately and print two decimal places.\n"
  ),
  'level-14-problem-4': challenge(
    'Safe Integer Division',
    'Divide one integer by another using floor division, but handle a zero divisor instead of attempting the division.',
    'Two integers dividend and divisor on one line.',
    'Print Error if divisor is zero; otherwise print dividend // divisor.',
    ['-100000 <= dividend <= 100000.','-1000 <= divisor <= 1000.'],
    [
      ['17 5\n', '3', '17 // 5 is 3, so print the floor quotient.'],
      ['8 0\n', 'Error', 'The divisor is zero, so report Error rather than dividing.'],
      ['-7 3\n', '-3'], ['7 -3\n', '-3'], ['-8 -3\n', '2'],
      ['12 3\n', '4'], ['0 9\n', '0'], ['1 1000\n', '0']
    ],
    ['Check the divisor before using //.', 'Compare it with zero.','When the divisor is zero, print the exact word Error.','Otherwise use Python floor division //, not /.','Floor division rounds toward negative infinity for negative quotients.'],
    "dividend, divisor = map(int, input().split())\nif divisor == 0:\n    print('Error')\nelse:\n    print(dividend // divisor)\n",
    'The zero check prevents invalid division; every nonzero divisor uses floor division.',
    'dividend, divisor = map(int, input().split())\n\n# Guard against a zero divisor before calculating the quotient.\n'
  ),
  'level-14-problem-5': challenge(
    'Solve a Linear Equation',
    'Classify the solutions of the equation a*x + b = 0 for integer coefficients a and b.',
    'Two integers a and b on one line.',
    'Print Infinitely many solutions when a and b are both zero; No solution when only a is zero; 0.00 when a is nonzero and b is zero; otherwise print -b / a using Python float formatting with .2f.',
    ['-1000 <= a, b <= 1000.'],
    [
      ['2 4\n', '-2.00', 'Solving 2*x + 4 = 0 gives the unique value x = -2.'],
      ['0 5\n', 'No solution', 'When a is zero and b is nonzero, the equation cannot equal zero.'],
      ['0 0\n', 'Infinitely many solutions'], ['-2 0\n', '0.00'], ['-2 3\n', '1.50'],
      ['4 -6\n', '1.50'], ['-1 -5\n', '-5.00'], ['3 1\n', '-0.33']
    ],
    ['First check whether the coefficient of x is zero.','If a is zero, then the equation is just b = 0.','When a and b are both zero, every x works.','When a is nonzero, isolate x by dividing -b by a.','Format the unique value with two decimal places.'],
    "a, b = map(int, input().split())\nif a == 0 and b == 0:\n    print('Infinitely many solutions')\nelif a == 0:\n    print('No solution')\nelif b == 0:\n    print('0.00')\nelse:\n    print(f\"{-b / a:.2f}\")\n",
    'A zero coefficient either leaves an identity or an impossible statement; with nonzero a, a zero b gives exactly 0.00, while other solutions use Python .2f formatting.',
    'a, b = map(int, input().split())\n\n# Handle zero coefficients, then solve for x when possible.\n'
  ),
  'level-15-problem-1': challenge(
    'Character Kind',
    'Classify one ASCII character as an uppercase letter, lowercase letter, digit, or other character.',
    'One ASCII character.',
    'Print Uppercase letter, Lowercase letter, Digit, or Other.',
    ['The input contains exactly one ASCII character.'],
    [
      ['Q\n', 'Uppercase letter', 'Q is an uppercase ASCII letter.'],
      ['m\n', 'Lowercase letter', 'm is a lowercase ASCII letter.'],
      ['7\n', 'Digit'], ['!\n', 'Other'], ['Z\n', 'Uppercase letter'],
      ['a\n', 'Lowercase letter'], ['0\n', 'Digit'], [' \n', 'Other']
    ],
    ['Read the input as a one-character string.','Compare letters using the ranges A through Z and a through z.','Digits have characters from 0 through 9.','Use elif to select only the first matching category.','Any character outside those ranges is Other.'],
    "character = input()\nif 'A' <= character <= 'Z':\n    print('Uppercase letter')\nelif 'a' <= character <= 'z':\n    print('Lowercase letter')\nelif '0' <= character <= '9':\n    print('Digit')\nelse:\n    print('Other')\n",
    'ASCII characters have ordered ranges for uppercase letters, lowercase letters, and digits; all other characters use the final branch.',
    'character = input()\n\n# Compare this character with the ASCII category ranges.\n'
  ),
  'level-15-problem-2': challenge(
    'ASCII Vowel Check',
    'Determine whether one English letter is a vowel, ignoring whether it is uppercase or lowercase.',
    'One ASCII English letter.',
    'Print Vowel for a, e, i, o, or u in either case; otherwise print Consonant.',
    ['The input contains exactly one ASCII English letter (A-Z or a-z).'],
    [
      ['a\n', 'Vowel', 'a is one of the five English vowels.'],
      ['E\n', 'Vowel', 'E becomes e when lowercased, and e is a vowel.'],
      ['b\n', 'Consonant'], ['U\n', 'Vowel'], ['z\n', 'Consonant'],
      ['I\n', 'Vowel'], ['Y\n', 'Consonant'], ['o\n', 'Vowel']
    ],
    ['The five vowels are a, e, i, o, and u.','Convert the input letter to lowercase first.','Use in to test membership in the string of vowels.','Y is not included in the requested vowel set.','Print Vowel or Consonant exactly as specified.'],
    "letter = input().lower()\nif letter in 'aeiou':\n    print('Vowel')\nelse:\n    print('Consonant')\n",
    'Lowercasing makes one membership test work for both letter cases.',
    "letter = input()\n\n# Normalize the letter's case, then check whether it is a vowel.\n"
  ),
  'level-15-problem-3': challenge(
    'Case-Insensitive Word Equality',
    'Compare two whole ASCII words without considering uppercase versus lowercase differences. Do not remove or trim characters.',
    'Two nonempty ASCII alphabetic words on one line separated by one space.',
    'Print Equal if the words match after lowercasing; otherwise print Different.',
    ['Each word contains 1 to 30 ASCII letters.','The input line contains exactly two words separated by one space.'],
    [
      ['Python python\n', 'Equal', 'After lowercasing, both words are python.'],
      ['Code coder\n', 'Different', 'The lowercased words code and coder are not equal.'],
      ['HELLO hello\n', 'Equal'], ['A b\n', 'Different'], ['Quiz QUIZ\n', 'Equal'],
      ['Same same\n', 'Equal'], ['Cat bat\n', 'Different'], ['AbC aBc\n', 'Equal']
    ],
    ['Split the input line into two words.','Convert each word to lowercase.','Compare the complete resulting strings with ==.','Do not compare only the first letters.','Print Equal or Different based on the comparison.'],
    "first, second = input().split()\nif first.lower() == second.lower():\n    print('Equal')\nelse:\n    print('Different')\n",
    'Lowercase both whole words before testing equality; no whitespace trimming or partial matching is needed.',
    'first, second = input().split()\n\n# Compare the two complete words without case differences.\n'
  ),
  'level-15-problem-4': challenge(
    'Lexicographically Earlier String',
    'Choose the lexicographically smaller of two ASCII words using Python string ordering, which compares characters by their code-point values.',
    'Two nonempty ASCII strings on separate lines; each may contain letters or digits and no spaces.',
    'Print the string that comes first under Python string comparison. If they are equal, print that string.',
    ['Each string has 1 to 30 ASCII letters or digits.','Comparison is case-sensitive and uses Python ordering.'],
    [
      ['apple\nbanana\n', 'apple', 'At the first differing character, a comes before b, so apple is earlier.'],
      ['cat\ncar\n', 'car', 'The shared prefix is ca, and r comes before t, so car is earlier.'],
      ['same\nsame\n', 'same'], ['Zoo\napple\n', 'Zoo'], ['a\nab\n', 'a'],
      ['9\nA\n', '9'], ['blue\nblack\n', 'black'], ['dog\ncat\n', 'cat']
    ],
    ['Read the strings on separate lines so they remain whole.','Python compares strings lexicographically from left to right.','The first differing character decides the ordering.','String comparison is case-sensitive; uppercase and lowercase differ.','Print the smaller string, or either one when they are equal.'],
    "first = input()\nsecond = input()\nif first <= second:\n    print(first)\nelse:\n    print(second)\n",
    'Python relational comparison on strings follows lexicographic code-point ordering and uses the prefix rule for unequal lengths.',
    "first = input()\nsecond = input()\n\n# Compare the strings in Python's normal case-sensitive order.\n"
  ),
  'level-15-problem-5': challenge(
    'File Extension Check',
    'Check whether a filename ends with a requested extension, ignoring uppercase and lowercase differences.',
    'The first line is a filename and the second is an extension beginning with a dot.',
    'Print Yes if the filename ends in that extension ignoring case; otherwise print No.',
    ['The filename contains 1 to 100 ASCII letters, digits, dots, or underscores.','The extension contains a dot followed by 1 to 10 ASCII letters or digits.'],
    [
      ['report.PDF\n.pdf\n', 'Yes', 'The filename ends in .PDF, which matches .pdf when case is ignored.'],
      ['photo.png\n.jpg\n', 'No', 'The filename ends in .png, not .jpg.'],
      ['archive.tar.gz\n.gz\n', 'Yes'], ['README\n.md\n', 'No'], ['notes.txt\n.TXT\n', 'Yes'],
      ['file.jpeg\n.jpeg\n', 'Yes'], ['report.pdf.bak\n.pdf\n', 'No'], ['image.PNG\n.png\n', 'Yes']
    ],
    ['Read the filename and extension on separate lines.','Convert both strings to the same case.','Use endswith() to check the end of the filename.','Do not test whether the extension appears anywhere in the name.','Print Yes or No exactly as specified.'],
    "filename = input().lower()\nextension = input().lower()\nif filename.endswith(extension):\n    print('Yes')\nelse:\n    print('No')\n",
    'Lowercasing both strings allows endswith() to compare the requested extension without case sensitivity.',
    'filename = input()\nextension = input()\n\n# Check whether the filename has this extension, ignoring case.\n'
  )
};
