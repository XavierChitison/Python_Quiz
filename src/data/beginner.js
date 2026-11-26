const starter = 'import sys\n\n# Read the input and write your solution here.\n';
const singleIntegerStarter = 'number = int(input())\n\n# Calculate and print the result.\n';
const multipleIntegersStarter = 'numbers = list(map(int, input().split()))\n\n# Calculate and print the result.\n';

function challenge(title, description, inputFormat, outputFormat, constraints, cases, hints, referenceSolution, explanation, starterCode = starter) {
  const examples = cases.slice(0, 2).map(([input, output, explanation]) => ({ input, output, explanation }));
  const describeExample = (example, index) =>
    `Example ${index + 1}: Input ${JSON.stringify(example.input.replace(/\n$/, ''))}; output ${JSON.stringify(example.output)}. ${example.explanation}`;
  return {
    title,
    description: `${description} ${examples.map(describeExample).join(' ')}`,
    learningObjectives: [description],
    inputFormat,
    outputFormat,
    constraints,
    examples,
    starterCode: { stdin: starterCode },
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
  ),
  'level-03-problem-1': challenge(
    'Rectangle Area and Perimeter',
    'Read the length and width of a rectangle. Print both its area and its perimeter, in that order.',
    'Two nonnegative integers length and width on one line.',
    'Print area and perimeter separated by one space.',
    ['0 <= length, width <= 100.', 'Area is length times width; perimeter is twice their sum.'],
    [
      ['3 4\n', '12 14', 'A 3 by 4 rectangle has area 12 and perimeter 14.'],
      ['1 1\n', '1 4', 'A 1 by 1 rectangle has area 1 and perimeter 4.'],
      ['0 5\n', '0 10'], ['2 7\n', '14 18'], ['10 5\n', '50 30'], ['100 1\n', '100 202'], ['4 4\n', '16 16'], ['9 2\n', '18 22']
    ],
    ['Two results are required.', 'Read both dimensions as integers.', 'Multiply the dimensions for area.', 'Add the dimensions and multiply by two for perimeter.', 'Print the area before the perimeter.'],
    'length, width = map(int, input().split())\nprint(length * width, 2 * (length + width))\n',
    'Multiply length by width for the area and double their sum for the perimeter.'
  ),
  'level-03-problem-2': challenge(
    'Triangle Area',
    'Read a triangle base and height. Calculate half their product and print the area with exactly two decimal places.',
    'Two nonnegative integers base and height on one line.',
    'Print base times height divided by 2, with two digits after the decimal point.',
    ['0 <= base, height <= 200.'],
    [
      ['4 3\n', '6.00', 'Half of 4 times 3 is 6.00.'],
      ['5 3\n', '7.50', 'Half of 5 times 3 is 7.50.'],
      ['0 8\n', '0.00'], ['1 1\n', '0.50'], ['2 7\n', '7.00'], ['10 10\n', '50.00'], ['200 200\n', '20000.00'], ['9 5\n', '22.50']
    ],
    ['The area is half the product of base and height.', 'Read the two dimensions from one line.', 'Multiply them and divide by two.', 'Format the result to two decimal places.', 'Keep the trailing zero when the area is a whole number.'],
    'base, height = map(int, input().split())\nprint(f\"{base * height / 2:.2f}\")\n',
    'A triangle has half the area of a rectangle with the same base and height.'
  ),
  'level-03-problem-3': challenge(
    'Cube Volume',
    'Read the side length of a cube and print its volume. The volume is the side length multiplied by itself three times.',
    'One nonnegative integer side length.',
    'Print the integer volume.',
    ['0 <= side <= 100.'],
    [
      ['1\n', '1', 'A cube with side 1 has volume 1 times 1 times 1, or 1.'],
      ['3\n', '27', 'A cube with side 3 has volume 3 times 3 times 3, or 27.'],
      ['0\n', '0'], ['2\n', '8'], ['4\n', '64'], ['5\n', '125'], ['10\n', '1000'], ['100\n', '1000000']
    ],
    ['All three dimensions of a cube are equal.', 'Read the side length as an integer.', 'Multiply the side length three times.', 'You can also use the ** operator.', 'A zero-length side gives zero volume.'],
    'side = int(input())\nprint(side ** 3)\n',
    'The volume is side cubed, which Python computes with side ** 3.'
  ),
  'level-03-problem-4': challenge(
    'Cuboid Surface Area',
    'Read the length, width, and height of a rectangular box. Print its total surface area: twice the sum of length times width, length times height, and width times height.',
    'Three positive integers length, width, and height on one line.',
    'Print the surface area as an integer.',
    ['1 <= length, width, height <= 100.'],
    [
      ['2 3 4\n', '52', 'The three face areas are 6, 8, and 12; twice their sum is 52.'],
      ['1 1 1\n', '6', 'A unit cube has six faces of area 1, so its surface area is 6.'],
      ['1 2 3\n', '22'], ['4 4 4\n', '96'], ['1 1 2\n', '10'], ['10 10 1\n', '240'], ['2 5 8\n', '132'], ['100 1 1\n', '402']
    ],
    ['Opposite faces have equal area.', 'There are three different pairs of faces.', 'Multiply each pair of dimensions.', 'Add those products and double the sum.', 'Print one integer.'],
    'length, width, height = map(int, input().split())\nprint(2 * (length * width + length * height + width * height))\n',
    'Each of the three distinct face areas occurs twice, giving 2 * (length * width + length * height + width * height).'
  ),
  'level-03-problem-5': challenge(
    'Squared Distance Between Points',
    'Read the coordinates of two points. Print the squared distance between them: the square of the horizontal difference plus the square of the vertical difference. Do not take a square root.',
    'Four integers x1, y1, x2, y2 on one line.',
    'Print (x2 - x1) squared plus (y2 - y1) squared.',
    ['-100 <= each coordinate <= 100.'],
    [
      ['0 0 3 4\n', '25', 'The differences are 3 and 4; their squares add to 9 + 16 = 25.'],
      ['-2 5 -2 5\n', '0', 'The points are identical, so both differences are zero.'],
      ['1 1 2 3\n', '5'], ['-1 -1 1 2\n', '13'], ['5 0 0 0\n', '25'], ['0 0 0 7\n', '49'], ['100 -100 -100 100\n', '80000'], ['-3 4 0 0\n', '25']
    ],
    ['Consider horizontal and vertical differences separately.', 'Subtract x1 from x2 and y1 from y2.', 'Square each difference.', 'Add the two squares.', 'The problem asks for squared distance, so no square root is needed.'],
    'x1, y1, x2, y2 = map(int, input().split())\ndx = x2 - x1\ndy = y2 - y1\nprint(dx * dx + dy * dy)\n',
    'Compute the horizontal and vertical coordinate differences, square both, and add them.'
  ),
  'level-04-problem-1': challenge(
    'Hours and Minutes to Minutes',
    'Read a duration expressed as hours and additional minutes. Convert the complete duration to minutes and print the result.',
    'Two integers h and m on one line: hours followed by additional minutes.',
    'Print the total number of minutes.',
    ['0 <= h <= 100.', '0 <= m <= 59.', 'One hour equals 60 minutes.'],
    [
      ['2 30\n', '150', 'Two hours are 120 minutes; adding 30 gives 150.'],
      ['0 5\n', '5', 'With no hours, the total is the 5 additional minutes.'],
      ['0 0\n', '0'], ['1 0\n', '60'], ['0 59\n', '59'], ['100 59\n', '6059'], ['24 45\n', '1485'], ['13 12\n', '792']
    ],
    ['Both parts represent a single duration.', 'Read hours and minutes as two integers.', 'Convert hours to minutes before adding.', 'Multiply hours by 60, then add the minutes.', 'Print only the total, not the original parts.'],
    'hours, minutes = map(int, input().split())\nprint(hours * 60 + minutes)\n',
    'Each hour contributes 60 minutes, so the total is hours * 60 + minutes.',
    multipleIntegersStarter
  ),
  'level-04-problem-2': challenge(
    'Celsius to Fahrenheit',
    'Read an integer temperature in degrees Celsius. Convert it to Fahrenheit using Fahrenheit = Celsius * 9 / 5 + 32, and print one digit after the decimal point.',
    'One integer c, the temperature in Celsius.',
    'Print the Fahrenheit temperature with exactly one decimal place.',
    ['-100 <= c <= 1000.'],
    [
      ['0\n', '32.0', 'Zero Celsius converts to 0 * 9 / 5 + 32 = 32.0 Fahrenheit.'],
      ['100\n', '212.0', '100 Celsius converts to 100 * 9 / 5 + 32 = 212.0 Fahrenheit.'],
      ['-40\n', '-40.0'], ['-100\n', '-148.0'], ['37\n', '98.6'], ['1\n', '33.8'], ['-1\n', '30.2'], ['1000\n', '1832.0']
    ],
    ['Use the given conversion formula.', 'Read the Celsius temperature as an integer.', 'Multiply by nine, divide by five, then add 32.', 'Use decimal formatting to show one digit after the point.', 'Check a negative Celsius temperature.'],
    'celsius = int(input())\nfahrenheit = celsius * 9 / 5 + 32\nprint(f\"{fahrenheit:.1f}\")\n',
    'Apply the conversion formula and format the resulting temperature to one decimal place.',
    singleIntegerStarter
  ),
  'level-04-problem-3': challenge(
    'Break Seconds into Hours, Minutes, and Seconds',
    'Read a duration in seconds. Break it into whole hours, remaining whole minutes, and remaining seconds.',
    'One integer total, the duration in seconds.',
    'Print the three nonnegative integers hours, minutes, and seconds, separated by spaces.',
    ['0 <= total <= 359999.', 'Minutes and seconds must each be less than 60.'],
    [
      ['3661\n', '1 1 1', '3661 seconds contains one hour, one minute, and one second.'],
      ['59\n', '0 0 59', '59 seconds is less than a minute, so both hours and minutes are zero.'],
      ['0\n', '0 0 0'], ['3600\n', '1 0 0'], ['3599\n', '0 59 59'], ['86400\n', '24 0 0'], ['359999\n', '99 59 59'], ['60\n', '0 1 0']
    ],
    ['An hour contains 3600 seconds.', 'Use integer division to find complete hours.', 'Remove those hours before finding complete minutes.', 'Use division and remainder to separate the remaining minutes and seconds.', 'Print all three fields, including zeros.'],
    'total = int(input())\nhours = total // 3600\nremaining = total % 3600\nminutes = remaining // 60\nseconds = remaining % 60\nprint(hours, minutes, seconds)\n',
    'Divide by 3600 for hours, then split the remaining seconds into minutes and seconds.',
    singleIntegerStarter
  ),
  'level-04-problem-4': challenge(
    'Clock After an Elapsed Duration',
    'Given a time on a 24-hour clock and a nonnegative duration in minutes, print the resulting clock time. Wrap around midnight as many times as necessary.',
    'Three integers h, m, and elapsed on one line: starting hour, starting minute, and elapsed minutes.',
    'Print the resulting time as HH:MM, with two digits for each field.',
    ['0 <= h <= 23.', '0 <= m <= 59.', '0 <= elapsed <= 10000.', 'The day contains 1440 minutes.'],
    [
      ['0 0 0\n', '00:00', 'No minutes pass after midnight, so the clock remains 00:00.'],
      ['23 50 20\n', '00:10', 'Twenty minutes after 23:50 is 00:10 on the next day.'],
      ['12 30 90\n', '14:00'], ['0 0 1440\n', '00:00'], ['1 59 1\n', '02:00'], ['23 59 1\n', '00:00'], ['10 15 2880\n', '10:15'], ['0 0 10000\n', '22:40']
    ],
    ['Convert the starting clock time to minutes since midnight.', 'Add the elapsed minutes.', 'Use the remainder after division by 1440 to wrap into one day.', 'Split the result into hours and minutes.', 'Format each part with two digits.'],
    'hours, minutes, elapsed = map(int, input().split())\ntotal = (hours * 60 + minutes + elapsed) % 1440\nprint(f\"{total // 60:02d}:{total % 60:02d}\")\n',
    'Convert the start to minutes, add the elapsed duration, reduce modulo 1440, and format the hour and minute fields.',
    multipleIntegersStarter
  ),
  'level-04-problem-5': challenge(
    'Average Trip Speed',
    'Read a distance in kilometers and an elapsed time in hours. Print the average speed in kilometers per hour, rounded to two decimal places. If the exact value is halfway between two hundredths, round to the even hundredth.',
    'Two integers distance and hours on one line.',
    'Print distance divided by hours with exactly two decimal places.',
    ['0 <= distance <= 10000.', '1 <= hours <= 10.'],
    [
      ['120 2\n', '60.00', 'Traveling 120 kilometers in 2 hours gives 60.00 kilometers per hour.'],
      ['7 4\n', '1.75', 'Dividing 7 kilometers by 4 hours gives 1.75 kilometers per hour.'],
      ['0 1\n', '0.00'], ['1 8\n', '0.12'], ['3 8\n', '0.38'], ['10 3\n', '3.33'], ['10000 10\n', '1000.00'], ['5 2\n', '2.50']
    ],
    ['Average speed is total distance divided by elapsed time.', 'Both values are on the same line.', 'Divide distance by hours using /.', 'Format the result to two decimal places.', 'Keep both trailing zeros and use the specified halfway rule.'],
    'distance, hours = map(int, input().split())\nprint(f\"{distance / hours:.2f}\")\n',
    'Divide the distance by the positive duration and format the speed with two decimal places. Python rounds exact halfway cases to the even hundredth.',
    multipleIntegersStarter
  ),
  'level-05-problem-1': challenge(
    'Discounted Price in Cents',
    'A store applies a whole-number percentage discount to an item whose original price is a whole number of dollars. Calculate the discounted price in cents.',
    'Two integers price and discount on one line: the price in dollars and the discount percentage.',
    'Print the discounted price as an integer number of cents.',
    ['0 <= price <= 9999.', '0 <= discount <= 100.', 'One dollar equals 100 cents.'],
    [
      ['20 25\n', '1500', 'A 25% discount on 20 dollars saves 5 dollars, leaving 15 dollars, or 1500 cents.'],
      ['50 10\n', '4500', 'A 10% discount on 50 dollars saves 5 dollars, leaving 4500 cents.'],
      ['0 0\n', '0'], ['1 0\n', '100'], ['1 100\n', '0'], ['9999 100\n', '0'], ['100 1\n', '9900'], ['7 33\n', '469']
    ],
    ['Find the percentage of the original price that remains.', 'Subtract the discount percentage from 100.', 'Convert the original dollar price to cents.', 'Multiply by the remaining percentage and divide by 100.', 'Because the price is whole dollars, the answer is always a whole number of cents.'],
    'price, discount = map(int, input().split())\nprint(price * (100 - discount))\n',
    'The remaining percentage is 100 - discount. Multiplying it by the whole-dollar price gives the price in cents.',
    multipleIntegersStarter
  ),
  'level-05-problem-2': challenge(
    'Two-Item Shopping Total',
    'A customer buys two types of items. Given the price in cents and the quantity for each type, calculate the total cost in cents.',
    'Four integers price1, quantity1, price2, and quantity2 on one line.',
    'Print the total cost as an integer number of cents.',
    ['0 <= price1, price2 <= 10000.', '0 <= quantity1, quantity2 <= 100.'],
    [
      ['100 2 50 3\n', '350', 'Two items at 100 cents cost 200 cents, and three at 50 cents cost 150; the total is 350.'],
      ['500 1 199 2\n', '898', 'One item at 500 cents and two at 199 cents cost 500 + 398 = 898 cents.'],
      ['0 100 0 100\n', '0'], ['1000 0 100 0\n', '0'], ['1 1 1 1\n', '2'], ['10000 100 10000 100\n', '2000000'], ['7 3 2 4\n', '29'], ['99 0 123 3\n', '369']
    ],
    ['Calculate a subtotal for each item type.', 'Multiply each price by its own quantity.', 'Add the two subtotals.', 'A zero quantity contributes zero.', 'Print the result in cents without a currency symbol.'],
    'price1, quantity1, price2, quantity2 = map(int, input().split())\nprint(price1 * quantity1 + price2 * quantity2)\n',
    'Multiply each price by its quantity and add the two subtotals.',
    multipleIntegersStarter
  ),
  'level-05-problem-3': challenge(
    'Simple Interest in Cents',
    'Calculate the simple interest earned on a whole-dollar principal at a whole-number annual percentage rate for a whole number of years. Interest is not compounded; print the interest alone, not the principal.',
    'Three integers principal, rate, and years on one line: principal in dollars, annual rate as a percentage, and duration in years.',
    'Print the total interest as an integer number of cents.',
    ['0 <= principal <= 10000.', '0 <= rate <= 100.', '0 <= years <= 50.', 'Simple interest in dollars is principal * rate * years / 100.'],
    [
      ['1000 5 2\n', '10000', 'At 5% per year, 1000 dollars earns 50 dollars each year; two years earn 100 dollars, or 10000 cents.'],
      ['200 3 1\n', '600', 'Three percent of 200 dollars is 6 dollars, or 600 cents, for one year.'],
      ['0 50 10\n', '0'], ['100 0 20\n', '0'], ['100 10 0\n', '0'], ['1 1 1\n', '1'], ['10000 100 50\n', '50000000'], ['750 4 3\n', '9000']
    ],
    ['Use the simple-interest formula given in the constraints.', 'The rate is a percentage, so divide it by 100 when computing dollars.', 'Multiply by the number of years.', 'Convert the result from dollars to cents.', 'The division and multiplication by 100 cancel for whole-dollar principal.'],
    'principal, rate, years = map(int, input().split())\nprint(principal * rate * years)\n',
    'Compute principal * rate * years / 100 dollars, then multiply by 100 to express the interest in cents.',
    multipleIntegersStarter
  ),
  'level-05-problem-4': challenge(
    'Split a Bill and Tip',
    'Add a restaurant bill and a tip, both in cents. Split the total equally among the diners using whole cents. Report the amount per diner and the cents left over.',
    'Three integers bill, tip, and diners on one line.',
    'Print the whole-cent share per diner and the leftover cents, separated by a space.',
    ['0 <= bill, tip <= 10000.', '1 <= diners <= 100.', 'Leftover cents must be less than the number of diners.'],
    [
      ['1200 300 4\n', '375 0', 'The total is 1500 cents; dividing by 4 gives 375 cents each with none left over.'],
      ['1000 51 3\n', '350 1', 'The total is 1051 cents; three diners get a 350-cent share and 1 cent remains.'],
      ['0 0 1\n', '0 0'], ['1 0 2\n', '0 1'], ['10000 10000 1\n', '20000 0'], ['9999 1 100\n', '100 0'], ['1 1 3\n', '0 2'], ['17 5 5\n', '4 2']
    ],
    ['First add the bill and tip.', 'Integer division finds the whole-cent share.', 'The remainder gives the cents that cannot be split equally.', 'Both results come from the same total and number of diners.', 'Print the share first, then the remainder.'],
    'bill, tip, diners = map(int, input().split())\ntotal = bill + tip\nprint(total // diners, total % diners)\n',
    'Add the bill and tip, then use integer division and remainder to split the total into equal shares and leftover cents.',
    multipleIntegersStarter
  ),
  'level-05-problem-5': challenge(
    'Pizzas Needed for a Group',
    'Each person in a group wants the same number of pizza slices. Each pizza has the same number of slices. Find the smallest whole number of pizzas that provides enough slices.',
    'Three integers people, slices_per_person, and slices_per_pizza on one line.',
    'Print the minimum number of whole pizzas needed.',
    ['0 <= people <= 100.', '1 <= slices_per_person <= 10.', '1 <= slices_per_pizza <= 100.', 'A group of zero people needs zero pizzas.'],
    [
      ['5 2 8\n', '2', 'Five people need 10 slices. One 8-slice pizza is not enough, so two pizzas are needed.'],
      ['3 2 6\n', '1', 'Three people need exactly 6 slices, so one 6-slice pizza is enough.'],
      ['0 1 8\n', '0'], ['1 1 1\n', '1'], ['100 10 1\n', '1000'], ['7 3 4\n', '6'], ['10 1 10\n', '1'], ['1 1 10\n', '1']
    ],
    ['Multiply the number of people by slices per person.', 'Divide the required slices by the slices in one pizza.', 'A partial pizza is not enough: round up when there are leftover slices.', 'For nonnegative a and positive b, (a + b - 1) // b rounds a / b up.', 'Check both an exact division and a group of zero people.'],
    'people, slices_per_person, slices_per_pizza = map(int, input().split())\nslices = people * slices_per_person\nprint((slices + slices_per_pizza - 1) // slices_per_pizza)\n',
    'Calculate the required slices, then use ceiling integer division to count whole pizzas, including any partially needed pizza.',
    multipleIntegersStarter
  )
};
