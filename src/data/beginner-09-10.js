import { challenge } from './beginner.js';

export const beginner0910Challenges = {
  'level-09-problem-1': challenge(
    'Uppercase Text',
    'Read one line containing ASCII text and print its letters in uppercase. Preserve spaces, digits, and punctuation.',
    'One line of ASCII text, which may be empty and may contain spaces.',
    'Print the line with all ASCII letters converted to uppercase.',
    ['The line contains at most 100 ASCII characters.', 'Only ASCII text is used; spaces and punctuation stay unchanged.'],
    [
      ['hello\n', 'HELLO', 'Each lowercase letter becomes its uppercase counterpart.'],
      ['Python 3!\n', 'PYTHON 3!', 'Letters change case while the space, digit, and punctuation remain unchanged.'],
      ['\n', ''],
      ['mixed Case\n', 'MIXED CASE'],
      [' already upper \n', ' ALREADY UPPER '],
      ['a-z 09\n', 'A-Z 09'],
      ["don't stop\n", "DON'T STOP"],
      ['x\n', 'X']
    ],
    ['Read the whole line as text, not as a number.', 'Python strings have a method for uppercase conversion.', 'Call that method on the line you read.', 'Print the converted line without adding a label.', 'An empty line should produce an empty line of output.'],
    'text = input()\nprint(text.upper())\n',
    'The upper() string method converts ASCII lowercase letters to uppercase and leaves other characters unchanged.',
    'text = input()\n\n# Convert the text to uppercase and print it.\n'
  ),
  'level-09-problem-2': challenge(
    'Lowercase Text',
    'Read one line containing ASCII text and print its letters in lowercase. Preserve spaces, digits, and punctuation.',
    'One line of ASCII text, which may be empty and may contain spaces.',
    'Print the line with all ASCII letters converted to lowercase.',
    ['The line contains at most 100 ASCII characters.', 'Only ASCII text is used; spaces and punctuation stay unchanged.'],
    [
      ['HELLO\n', 'hello', 'Each uppercase letter becomes its lowercase counterpart.'],
      ['PyThOn 3!\n', 'python 3!', 'Letters change case while the space, digit, and punctuation remain unchanged.'],
      ['\n', ''],
      ['already lower\n', 'already lower'],
      [' MIXED CASE \n', ' mixed case '],
      ['A-Z 09\n', 'a-z 09'],
      ["DON'T STOP\n", "don't stop"],
      ['X\n', 'x']
    ],
    ['Read the entire line as a string.', 'Use the string operation that converts letters downward in case.', 'Keep the returned string in a variable if that helps.', 'Print only the converted line.', 'Digits and punctuation are not changed by case conversion.'],
    'text = input()\nprint(text.lower())\n',
    'The lower() string method converts ASCII uppercase letters to lowercase and leaves other characters unchanged.',
    'text = input()\n\n# Convert the text to lowercase and print it.\n'
  ),
  'level-09-problem-3': challenge(
    'Trim Outer Whitespace',
    'Read one line of ASCII text and remove ASCII spaces from its beginning and end, keeping any spaces between words.',
    'One line of ASCII text, which may be empty or contain only spaces.',
    'Print the text after removing only leading and trailing ASCII space characters.',
    ['The line contains at most 100 ASCII characters.', 'Whitespace to trim means the ordinary ASCII space character only.', 'Spaces between non-space characters must be preserved.'],
    [
      ['  hello  \n', 'hello', 'The two spaces at each end are removed.'],
      ['  keep these words  \n', 'keep these words', 'Outer spaces are removed, but the spaces between words remain.'],
      ['\n', ''],
      ['     \n', ''],
      [' \tkeep\t \n', '\tkeep\t'],
      ['left\n', 'left'],
      ['right  \n', 'right'],
      ['  A B C\n', 'A B C']
    ],
    ['The input is one whole line, including any spaces around it.', 'Do not split the line into words.', 'Use a string method that removes selected characters at both ends.', 'Select the ordinary space character so inner spaces remain.', 'An empty or all-space line becomes an empty string.'],
    'text = input()\nprint(text.strip(" "))\n',
    'strip(" ") removes ordinary space characters from both ends of a string without changing internal spaces.',
    'text = input()\n\n# Remove only the outer ASCII spaces and print the result.\n'
  ),
  'level-09-problem-4': challenge(
    'Replace Spaces with Hyphens',
    'Read one line of ASCII text and replace every ordinary space with a hyphen.',
    'One line of ASCII text, which may be empty and may contain spaces.',
    'Print the line with each ASCII space replaced by a hyphen.',
    ['The line contains at most 100 ASCII characters.', 'Only the ordinary ASCII space character is replaced.', 'Do not remove leading, trailing, or repeated spaces; replace each one.'],
    [
      ['hello world\n', 'hello-world', 'The space between the words becomes a hyphen.'],
      ['two words here\n', 'two-words-here', 'Each of the two spaces becomes a hyphen.'],
      ['\n', ''],
      ['     \n', '-----'],
      ['- already-hyphenated \n', '--already-hyphenated-'],
      ['a  b\n', 'a--b'],
      [' leading\n', '-leading'],
      ['trailing  \n', 'trailing--']
    ],
    ['Read the line as text so its spaces are available to process.', 'The replace() string method accepts an old and a new substring.', 'Replace a single ordinary space with a single hyphen.', 'Do not collapse repeated spaces into one hyphen.', 'Check leading and trailing spaces as well as spaces between words.'],
    "text = input()\nprint(text.replace(' ', '-'))\n",
    "replace(' ', '-') substitutes every ordinary space, including repeated and outer spaces, with a hyphen.",
    'text = input()\n\n# Replace each ordinary space with a hyphen and print the result.\n'
  ),
  'level-09-problem-5': {
    ...challenge(
      'Mask All But the Last Four Characters',
      'Read a line of ASCII text and replace every character except its last four with an asterisk. Leave lines of four or fewer characters unchanged.',
      'One line of ASCII text, which may be empty and may contain spaces.',
      'Print the masked line, preserving the final four characters exactly.',
      ['The line contains at most 100 ASCII characters.', 'Spaces count as characters.'],
      [
        ['abcdef\n', '**cdef', 'The first two characters are masked and the last four remain.'],
        ['Hi\n', 'Hi', 'The line has fewer than four characters, so nothing is masked.'],
        ['\n', ''],
        ['abcd\n', 'abcd'],
        ['12345\n', '*2345'],
        ['A B C\n', '* B C'],
        ['  xyz\n', '* xyz'],
        ['!1234567\n', '****4567']
      ],
      ['Read the entire line, including spaces.', 'Count how many characters occur before the final four.', 'The mask length cannot be negative.', 'Repeat an asterisk for each masked character.', 'Add the final four-character slice after the mask.'],
      'text = input()\nmask_length = max(0, len(text) - 4)\nprint("*" * mask_length + text[-4:])\n',
      'Replace the prefix with the same number of asterisks and append the unchanged final four characters.',
      'text = input()\n\n# Mask the characters before the last four.\n'
    ),
    contentRevision: 2
  },
  'level-10-problem-1': challenge(
    'Format Two Initials',
    'Read two ASCII names and print their first letters in uppercase, each followed by a dot.',
    'Two nonempty ASCII alphabetic names on one line, separated by one or more spaces.',
    'Print the uppercase first letter of each name, with a dot after each, for example A.L.',
    ['Each name contains 1 to 30 ASCII letters (A-Z or a-z).', 'There are exactly two names, separated by at least one space.'],
    [
      ['ada lovelace\n', 'A.L.', 'The first letters a and l become A and L, each followed by a dot.'],
      ['grace hopper\n', 'G.H.', 'The first letters of grace and hopper are formatted as G.H.'],
      ['a z\n', 'A.Z.'],
      ['alan turing\n', 'A.T.'],
      ['MARY shelley\n', 'M.S.'],
      ['katherine johnson\n', 'K.J.'],
      ['george boole\n', 'G.B.'],
      ['xylophone zebra\n', 'X.Z.']
    ],
    ['Split the input line into its two names.', 'Each name is a string, so select its first character.', 'Convert both selected characters to uppercase.', 'Add a dot after each initial.', 'Print the two formatted initials together with no spaces.'],
    "first, second = input().split()\nprint(first[0].upper() + '.' + second[0].upper() + '.')\n",
    'Split the line into two names, uppercase each first character, and append a dot to each initial.',
    'first, second = input().split()\n\n# Format and print the two initials.\n'
  ),
  'level-10-problem-2': challenge(
    'Weighted Average of Two Scores',
    'Read two integer scores and a percentage weight. The weight applies to the first score; the remaining percentage applies to the second.',
    'Three integers on one line: score1 score2 weight.',
    'Print (score1 * weight + score2 * (100 - weight)) / 100 with exactly two digits after the decimal point.',
    ['0 <= score1, score2 <= 1000.', '0 <= weight <= 100.', 'Scores and weight are integers, so the weighted result is an exact multiple of 0.01 and needs no rounding.'],
    [
      ['80 60 25\n', '65.00', 'One quarter of 80 plus three quarters of 60 is 65.00.'],
      ['100 0 50\n', '50.00', 'Equal weights give the mean of 100 and 0, which is 50.00.'],
      ['0 0 0\n', '0.00'],
      ['0 100 0\n', '100.00'],
      ['1000 0 100\n', '1000.00'],
      ['75 75 37\n', '75.00'],
      ['10 20 25\n', '17.50'],
      ['98 72 75\n', '91.50']
    ],
    ['The percentage weight belongs to score1.', 'The second score receives the percentage left over from 100.', 'Multiply each score by its percentage before adding.', 'Divide the weighted sum by 100.', 'Format the result with exactly two digits after the decimal point.'],
    'score1, score2, weight = map(int, input().split())\nweighted = score1 * weight + score2 * (100 - weight)\nprint(f"{weighted / 100:.2f}")\n',
    'The weighted sum uses weight percent of the first score and (100 - weight) percent of the second, then divides by 100.',
    'score1, score2, weight = map(int, input().split())\n\n# Calculate and print the weighted average to two decimal places.\n'
  ),
  'level-10-problem-3': challenge(
    'Update an Account Balance',
    'Read a starting balance, a deposit, and a withdrawal, then calculate the updated balance.',
    'Three nonnegative integers on one line: balance deposit withdrawal.',
    'Print balance + deposit - withdrawal as an integer.',
    ['0 <= balance, deposit, withdrawal <= 1000000.', 'withdrawal <= balance + deposit, so the updated balance is not negative.'],
    [
      ['100 20 30\n', '90', 'Adding 20 and then subtracting 30 changes 100 to 90.'],
      ['0 0 0\n', '0', 'With no money moved, the balance remains zero.'],
      ['100 0 100\n', '0'],
      ['25 40 10\n', '55'],
      ['500 125 25\n', '600'],
      ['1 1 2\n', '0'],
      ['250 0 1\n', '249'],
      ['80 35 35\n', '80']
    ],
    ['Read the three values in the order given.', 'A deposit increases the balance.', 'A withdrawal decreases the balance.', 'Add the deposit to the starting balance, then subtract the withdrawal.', 'Print the integer result without a currency label.'],
    'balance, deposit, withdrawal = map(int, input().split())\nprint(balance + deposit - withdrawal)\n',
    'The updated balance is the starting balance plus the deposit minus the withdrawal.',
    'balance, deposit, withdrawal = map(int, input().split())\n\n# Calculate and print the updated balance.\n'
  ),
  'level-10-problem-4': challenge(
    'Minutes Between Two Same-Day Clock Times',
    'Read two 24-hour clock times on the same day and print the elapsed minutes from the first time to the second.',
    'Two times on one line in HH:MM HH:MM format. The second time is not earlier than the first.',
    'Print the number of minutes from the first time to the second as an integer.',
    ['Each time is valid in 24-hour format: 00:00 through 23:59.', 'Both times are on the same day and the second time is at or after the first.'],
    [
      ['08:15 09:00\n', '45', 'From 8:15 to 9:00 is 45 minutes.'],
      ['09:30 09:30\n', '0', 'The two times are equal, so no minutes have elapsed.'],
      ['00:00 00:01\n', '1'],
      ['22:45 23:59\n', '74'],
      ['12:00 13:15\n', '75'],
      ['07:05 08:05\n', '60'],
      ['14:50 15:10\n', '20'],
      ['00:00 23:59\n', '1439']
    ],
    ['Split the line into the two clock-time strings.', 'For each time, split hours and minutes at the colon.', 'Convert a clock time to minutes since midnight: hours times 60 plus minutes.', 'Subtract the first total from the second total.', 'The same-day constraint means no midnight wraparound is needed.'],
    "start, end = input().split()\nstart_hour, start_minute = map(int, start.split(':'))\nend_hour, end_minute = map(int, end.split(':'))\nstart_total = start_hour * 60 + start_minute\nend_total = end_hour * 60 + end_minute\nprint(end_total - start_total)\n",
    'Convert each same-day clock time to minutes since midnight, then subtract the first total from the second.',
    "start, end = input().split()\n\n# Convert the times to minutes and print the elapsed time.\n"
  ),
  'level-10-problem-5': challenge(
    'Remove Last K Characters',
    'Read a line of ASCII text and a nonnegative integer k. Remove the last k characters from the line.',
    'The first line is ASCII text, which may be empty or contain spaces. The second line contains integer k.',
    'Print the text remaining after removing its last k characters.',
    ['The text contains at most 100 ASCII characters.', '0 <= k <= the number of characters in the text.', 'Spaces count as characters; k = 0 keeps the whole text and k equal to its length produces an empty string.'],
    [
      ['Python\n0\n', 'Python', 'Removing zero characters leaves the complete word unchanged.'],
      ['Python\n1\n', 'Pytho', 'Removing the final character n leaves Pytho.'],
      ['Hello!\n6\n', ''],
      ['\n0\n', ''],
      ['abc\n3\n', ''],
      ['spaces  \n2\n', 'spaces', 'The two trailing spaces are characters and are both removed.'],
      ['a b c\n4\n', 'a', 'The line has five characters, including spaces; removing the last four leaves a.'],
      ['keep\n0\n', 'keep']
    ],
    ['Read the text line separately from the integer k.', 'Do not strip the text: spaces count as characters.', 'A negative slice endpoint can omit characters from the end.', 'When k is zero, leave the original text unchanged.', 'If k equals the length, print an empty string.'],
    'text = input()\nk = int(input())\nprint(text[:-k] if k else text)\n',
    'The slice text[:-k] omits the final k characters; handling k == 0 separately keeps the full string.',
    'text = input()\nk = int(input())\n\n# Remove the last k characters and print the remaining text.\n'
  )
};
