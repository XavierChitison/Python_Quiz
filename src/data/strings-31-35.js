import { challenge } from './beginner.js';

export const strings3135Challenges = {
  'level-31-problem-1': challenge(
    'Unicode Code Point', 'Print the Unicode code point of the single input character as a decimal integer.',
    'One line containing exactly one Unicode character.', 'Print its Unicode code point as a decimal integer.',
    ['The character is not a newline or a surrogate code point.'],
    [['A\n', '65', 'The code point of A is 65.'], ['é\n', '233', 'The code point of é is 233.'], [' \n', '32'], ['0\n', '48'], ['a\n', '97'], ['Ω\n', '937'], ['中\n', '20013'], ['😀\n', '128512']],
    ['Read the character without stripping spaces.', 'A Unicode character has a numeric code point.', 'Python provides ord() for one character.', 'Call ord() on the entire input line.', 'Print the resulting integer in decimal.'],
    'character = input()\nprint(ord(character))\n',
    'ord() returns the Unicode code point of the character.',
    'character = input()\n\n# Print its code point.\n'
  ),
  'level-31-problem-2': challenge(
    'Reverse a Text Line', 'Reverse the characters in a line, including spaces and punctuation.',
    'One ASCII text line, possibly empty.', 'Print the characters in reverse order.',
    ['The line has at most 100 ASCII characters, excluding the newline.'],
    [['cat\n', 'tac', 'The last character moves to the front.'], [' hi!\n', '!ih ', 'The leading space moves to the end.'], ['\n', ''], ['x\n', 'x'], ['abba\n', 'abba'], ['a b c\n', 'c b a'], ['12345\n', '54321'], ['  a \n', ' a  ']],
    ['Treat spaces as characters.', 'Read the entire line without strip().', 'A slice can traverse backwards.', 'Use a step of -1 with omitted endpoints.', 'Print the reversed line even when it is empty.'],
    'text = input()\nprint(text[::-1])\n',
    'A slice with step -1 visits all characters from last to first.',
    'text = input()\n\n# Reverse and print the line.\n'
  ),
  'level-31-problem-3': challenge(
    'Every Other Character', 'Print the characters at zero-based even indices in their original order.',
    'One ASCII text line, possibly empty.', 'Print indices 0, 2, 4, and so on, without separators.',
    ['The line has at most 100 ASCII characters.'],
    [['abcdef\n', 'ace', 'Indices 0, 2, and 4 contain a, c, and e.'], [' a b \n', '   ', 'The even indices all contain spaces.'], ['\n', ''], ['x\n', 'x'], ['ab\n', 'a'], ['12345\n', '135'], ['!?!?\n', '!!'], ['hello!\n', 'hlo']],
    ['Indices start at zero.', 'Include the character at index zero.', 'Advance by two positions each time.', 'A slice can specify a step of 2.', 'Print the slice without adding separators.'],
    'text = input()\nprint(text[::2])\n',
    'A step-two slice begins at index zero and selects every second character.',
    'text = input()\n\n# Select the even-indexed characters.\n'
  ),
  'level-31-problem-4': challenge(
    'Extract Bracketed Text', 'Print the text after the first [ and before the first ] following it; do not include the brackets.',
    'One ASCII line containing [ followed later by ].', 'Print the enclosed text, which may be empty.',
    ['The line has at most 100 ASCII characters.', 'Other brackets may appear; use the first opening bracket and the first closing bracket after it.'],
    [['x[cat]y\n', 'cat', 'The characters between the brackets are cat.'], ['][a[b]c]\n', 'a[b', 'The earlier ] is ignored; the next ] after the first [ closes the selection.'], ['[]\n', ''], ['[ ]\n', ' '], ['[a][b]\n', 'a'], ['x[[z]]\n', '[z'], ['abc[12]!\n', '12'], ['[[[]\n', '[[']],
    ['Locate the first opening bracket.', 'A closing bracket before it does not count.', 'Search for ] starting just after the opening bracket.', 'Slice from one position after [ up to but excluding ].', 'An immediate closing bracket gives an empty result.'],
    "text = input()\nstart = text.find('[')\nend = text.find(']', start + 1)\nprint(text[start + 1:end])\n",
    'Find the first opener and the next closer, then slice between their indices.',
    'text = input()\n\n# Locate the brackets and print their contents.\n'
  ),
  'level-31-problem-5': challenge(
    'Split Text at an Index', 'Split a line at the supplied zero-based index and print the prefix and suffix on separate lines.',
    'First line: ASCII text. Second line: integer k.', 'Print text before index k, then text from index k onward, each on its own line.',
    ['The text has at most 100 ASCII characters.', '0 <= k <= the length of the text.'],
    [['python\n2\n', 'py\nthon', 'The first two characters form the prefix.'], [' abc \n0\n', '\n abc ', 'At index zero the prefix is empty and the whole line is the suffix.'], ['\n0\n', '\n'], ['abc\n3\n', 'abc\n'], ['x\n1\n', 'x\n'], ['a b\n2\n', 'a \nb'], ['12345\n4\n', '1234\n5'], ['!!\n1\n', '!\n!']],
    ['The index marks a boundary between characters.', 'Read the text before reading k.', 'The prefix ends just before k.', 'The suffix begins at k.', 'Print both slices on separate lines, including empty slices.'],
    'text = input()\nk = int(input())\nprint(text[:k])\nprint(text[k:])\n',
    'The slices before and from k partition the line without losing any characters.',
    'text = input()\nk = int(input())\n\n# Print the two slices.\n'
  ),
  'level-32-problem-1': challenge(
    'Count Decimal Digit Runs', 'Count maximal contiguous runs of ASCII digits in a text line. A run ends at any non-digit.',
    'One ASCII text line, possibly empty.', 'Print the number of digit runs.',
    ['The line has at most 100 ASCII characters.', 'Digits are exactly 0 through 9.'],
    [['ab12c3\n', '2', '12 and 3 are two separate digit runs.'], ['007\n', '1', 'All three adjacent digits form one run.'], ['\n', '0'], ['abc\n', '0'], ['1a2b3\n', '3'], [' 0 00 \n', '2'], ['9\n', '1'], ['12-34.56\n', '3']],
    ['A run may contain several digits.', 'A digit starts a run only if the previous character was not a digit.', 'Track whether the previous character belonged to a run.', 'Increment the count when entering a run.', 'Reset the state when a non-digit appears.'],
    "text = input()\ncount = 0\ninside = False\nfor ch in text:\n    digit = '0' <= ch <= '9'\n    if digit and not inside:\n        count += 1\n    inside = digit\nprint(count)\n",
    'Count each transition into a digit run, including a digit at the beginning.',
    'text = input()\n\n# Count the beginnings of digit runs.\n'
  ),
  'level-32-problem-2': challenge(
    'Alternating Letter and Digit Classes', 'Decide whether each pair of adjacent characters switches between an ASCII letter and an ASCII digit.',
    'One nonempty ASCII alphanumeric string.', 'Print YES if all adjacent classes alternate; otherwise print NO.',
    ['The string contains 1 to 100 ASCII letters or digits.', 'A one-character string alternates vacuously.'],
    [['a1B2\n', 'YES', 'The classes are letter, digit, letter, digit.'], ['a12b\n', 'NO', 'The adjacent 1 and 2 are both digits.'], ['x\n', 'YES'], ['7\n', 'YES'], ['ab\n', 'NO'], ['1a2\n', 'YES'], ['9Zx\n', 'NO'], ['00\n', 'NO']],
    ['Only letters and digits occur.', 'Determine the class of each character.', 'Compare each class with the previous class.', 'A repeated adjacent class makes the answer NO.', 'With no adjacent pair, the answer is YES.'],
    "text = input()\nok = True\nfor i in range(1, len(text)):\n    if text[i].isdigit() == text[i - 1].isdigit():\n        ok = False\nprint('YES' if ok else 'NO')\n",
    'Adjacent characters alternate exactly when their digit classifications differ.',
    'text = input()\n\n# Check neighboring character classes.\n'
  ),
  'level-32-problem-3': challenge(
    'Count ASCII Vowels in Text', 'Count occurrences of a, e, i, o, and u in a line, ignoring ASCII letter case.',
    'One ASCII text line, possibly empty.', 'Print the number of vowels.',
    ['The line has at most 100 ASCII characters.', 'The letter y is not a vowel for this task.'],
    [['Hello World!\n', '3', 'The vowels are e, o, and o.'], ['AEiou\n', '5', 'Each vowel counts regardless of case.'], ['\n', '0'], ['rhythm\n', '0'], ['aAa\n', '3'], ['123!\n', '0'], ['U u\n', '2'], ['Beautiful\n', '5']],
    ['Only five English letters count.', 'Normalize letter case before comparing.', 'Visit each character, including punctuation.', 'Increment a counter when the character is in aeiou.', 'Print zero when no vowels occur.'],
    "text = input()\ncount = 0\nfor ch in text.lower():\n    if ch in 'aeiou':\n        count += 1\nprint(count)\n",
    'Lowercase the ASCII text and count characters belonging to the five-vowel set.',
    'text = input()\n\n# Count the vowels.\n'
  ),
  'level-32-problem-4': challenge(
    'Remove All Digits', 'Remove every ASCII digit from the text and preserve all other characters in order.',
    'One ASCII text line, possibly empty.', 'Print the filtered text.',
    ['The line has at most 100 ASCII characters.', 'ASCII digits are 0 through 9.'],
    [['a1 b2!\n', 'a b!', 'The two digits are removed but the space and punctuation remain.'], ['123\n', '', 'All characters are digits, so the result is empty.'], ['\n', ''], ['abc\n', 'abc'], ['0x0\n', 'x'], [' 9 \n', '  '], ['a1b2c3\n', 'abc'], ['!42?\n', '!?']],
    ['Inspect each character in order.', 'A digit lies between 0 and 9.', 'Keep characters that are not digits.', 'Build the output without reordering retained characters.', 'Print an empty line if nothing remains.'],
    "text = input()\nresult = ''\nfor ch in text:\n    if not ('0' <= ch <= '9'):\n        result += ch\nprint(result)\n",
    'Build a new string using only characters outside the ASCII digit range.',
    'text = input()\n\n# Keep the non-digit characters.\n'
  ),
  'level-32-problem-5': challenge(
    'Alternate Letter Case', 'Uppercase ASCII letters at even zero-based character indices and lowercase ASCII letters at odd indices; keep other characters unchanged.',
    'One ASCII text line, possibly empty.', 'Print the transformed line.',
    ['The line has at most 100 ASCII characters.', 'Spaces, digits, and punctuation occupy positions too.'],
    [['hello\n', 'HeLlO', 'Even positions become uppercase and odd positions lowercase.'], ['a-b c\n', 'A-B C', 'The hyphen and space still count when determining position parity.'], ['\n', ''], ['A\n', 'A'], ['ABCD\n', 'AbCd'], ['1a2B\n', '1a2b'], ['  abc\n', '  AbC'], ['!xY?\n', '!xY?']],
    ['Positions are zero-based.', 'Every character advances the position, even punctuation.', 'Use enumerate() to obtain index and character.', 'Use upper() at even indices and lower() at odd indices.', 'Concatenate the transformed characters in order.'],
    "text = input()\nresult = ''\nfor i, ch in enumerate(text):\n    result += ch.upper() if i % 2 == 0 else ch.lower()\nprint(result)\n",
    'Convert each character according to its index parity; ASCII nonletters stay unchanged.',
    'text = input()\n\n# Change case by position.\n'
  ),
  'level-33-problem-1': challenge(
    'Count Whitespace-Separated Words', 'Count the nonempty words separated by whitespace in a line.',
    'One ASCII text line, possibly empty; it may contain spaces and tabs.', 'Print the number of words.',
    ['The line has at most 100 characters.', 'Words are maximal sequences of non-whitespace characters.'],
    [['one two three\n', '3', 'There are three nonempty words.'], ['  a\t b  \n', '2', 'Runs of spaces and tabs separate a and b.'], ['\n', '0'], ['   \n', '0'], ['a\n', '1'], ['a-b\n', '1'], ['a\tb\tc\n', '3'], ['  x y \n', '2']],
    ['Whitespace can appear at the edges or in runs.', 'Do not count empty pieces between separators.', 'split() without an argument handles whitespace runs.', 'Count the resulting words.', 'An empty or whitespace-only line has zero words.'],
    'text = input()\nprint(len(text.split()))\n',
    'split() without arguments yields the nonempty whitespace-separated words.',
    'text = input()\n\n# Count the words.\n'
  ),
  'level-33-problem-2': challenge(
    'Reverse Word Order', 'Reverse the order of the whitespace-separated words without reversing characters inside each word.',
    'One ASCII text line, possibly empty; spaces and tabs may separate words.', 'Print the reversed words separated by single spaces, with no outer spaces.',
    ['The line has at most 100 characters.'],
    [['red blue green\n', 'green blue red', 'The words change order but each word stays intact.'], ['  a\t b  \n', 'b a', 'Whitespace is normalized to one separating space.'], ['\n', ''], [' \t \n', ''], ['one\n', 'one'], ['a a b\n', 'b a a'], ['Hi, there!\n', 'there! Hi,'], ['1 2\n', '2 1']],
    ['Split the line into words.', 'Whitespace runs should not become empty words.', 'Reverse the list of words, not the letters.', 'Join the words with one space.', 'Joining an empty list gives an empty line.'],
    "words = input().split()\nprint(' '.join(words[::-1]))\n",
    'Split on whitespace, reverse the word list, and join with single spaces.',
    'text = input()\n\n# Reverse the word order.\n'
  ),
  'level-33-problem-3': challenge(
    'Longest Word in a Line', 'Print the first longest whitespace-separated word, or an empty line if there are no words.',
    'One ASCII text line, possibly empty, with spaces or tabs between words.', 'Print the selected word unchanged.',
    ['The line has at most 100 characters.', 'Punctuation is part of a word; ties go to the first word.'],
    [['a tiger fox\n', 'tiger', 'tiger has the most characters.'], ['cat dog ox\n', 'cat', 'cat and dog tie, so the earlier word wins.'], ['\n', ''], [' \t \n', ''], ['x\n', 'x'], ['a !?! bc\n', '!?!'], ['aa aaa aaaa\n', 'aaaa'], ['long\tword\n', 'long']],
    ['Split the line on whitespace.', 'Start with an empty best word.', 'Compare word lengths, not alphabetical order.', 'Replace the best only for a strictly longer word.', 'If no words occur, print the empty best word.'],
    "words = input().split()\nbest = ''\nfor word in words:\n    if len(word) > len(best):\n        best = word\nprint(best)\n",
    'Keep the first word of each new maximum length; strict comparison preserves ties.',
    'text = input()\n\n# Find the first longest word.\n'
  ),
  'level-33-problem-4': challenge(
    'Capitalize Word Initials', 'Uppercase only the first character of each whitespace-separated word, leaving the rest unchanged.',
    'One ASCII text line, possibly empty, with spaces or tabs between words.', 'Print the transformed words joined by single spaces, without outer spaces.',
    ['The line has at most 100 characters.', 'A word may start with punctuation or a digit.'],
    [['hELLO world\n', 'HELLO World', 'Only h and w change; the remaining letters retain their original case.'], ['  1abc\t!hi  \n', '1abc !hi', 'A digit or punctuation initial remains unchanged.'], ['\n', ''], ['  \n', ''], ['x\n', 'X'], ['a b c\n', 'A B C'], ['UP down\n', 'UP Down'], ['a-b cD\n', 'A-b CD']],
    ['Split into nonempty words.', 'Do not lowercase the rest of a word.', 'Uppercase the first character of each word.', 'Append each unchanged suffix.', 'Join the transformed words with single spaces.'],
    "words = input().split()\nresult = []\nfor word in words:\n    result.append(word[0].upper() + word[1:])\nprint(' '.join(result))\n",
    'Transform the first character of each split word and retain its suffix unchanged.',
    'text = input()\n\n# Transform each word initial.\n'
  ),
  'level-33-problem-5': challenge(
    'Extract an Email Domain', 'Print the part of an email-like address after its single @ character.',
    'One address on a line.', 'Print the domain portion without @.',
    ['The address has 3 to 100 ASCII characters.', 'There is exactly one @, with at least one non-whitespace character on each side.', 'No whitespace occurs in the address.'],
    [['sam@example.org\n', 'example.org', 'The domain is the part after @.'], ['a@B\n', 'B', 'The domain retains its original case.'], ['x@y\n', 'y'], ['first.last@site.io\n', 'site.io'], ['a+b@sub.example\n', 'sub.example'], ['0@123\n', '123'], ['!@-\n', '-'], ['x@a.b.c\n', 'a.b.c']],
    ['The input has exactly one @.', 'The domain starts immediately after that character.', 'Find the position of @ or split on it.', 'Keep all characters after the separator.', 'Do not change the domain case.'],
    "address = input()\nseparator = address.find('@')\nprint(address[separator + 1:])\n",
    'The domain is the suffix after the guaranteed unique separator.',
    'address = input()\n\n# Extract the domain.\n'
  ),
  'level-34-problem-1': challenge(
    'Repeated Substring Pattern', 'Decide whether a nonempty string is made of at least two copies of a shorter nonempty string.',
    'One nonempty ASCII text line.', 'Print YES if such a repeating unit exists, otherwise NO.',
    ['The line contains 1 to 100 ASCII characters.', 'Spaces and case are significant.'],
    [['ababab\n', 'YES', 'Three copies of ab make ababab.'], ['aba\n', 'NO', 'No shorter unit repeated at least twice makes aba.'], ['a\n', 'NO'], ['aaaa\n', 'YES'], ['abcabc\n', 'YES'], ['ababa\n', 'NO'], ['  \n', 'YES'], ['aAaA\n', 'YES']],
    ['A unit must be shorter than the full string.', 'Its length must divide the string length.', 'Try each possible unit length.', 'Repeat the prefix the appropriate number of times.', 'Accept if any repeated prefix equals the entire input.'],
    "text = input()\nfound = False\nfor size in range(1, len(text)):\n    if len(text) % size == 0 and text[:size] * (len(text) // size) == text:\n        found = True\n        break\nprint('YES' if found else 'NO')\n",
    'Every possible unit must be a prefix whose length divides the full length.',
    'text = input()\n\n# Test shorter repeating units.\n'
  ),
  'level-34-problem-2': challenge(
    'Normalize Repeated Spaces', 'Replace each maximal run of literal spaces with one space; preserve all other characters, including tabs.',
    'One ASCII text line, possibly empty.', 'Print the normalized line, preserving one space for each leading or trailing space run.',
    ['The line has at most 100 characters.', 'Only the ordinary space character is collapsed.'],
    [['  a   b  \n', ' a b ', 'Each leading, middle, and trailing run becomes one space.'], ['a \t  b\n', 'a \t b', 'The tab is preserved and separates the two space runs.'], ['\n', ''], ['   \n', ' '], ['abc\n', 'abc'], ['a  b\n', 'a b'], [' a\n', ' a'], ['x \n', 'x ']],
    ['Only consecutive literal spaces collapse.', 'Tabs are not spaces for this task.', 'Track whether the previous input character was a space.', 'Skip a space only when it follows another space.', 'Keep one space even at either end of the line.'],
    "text = input()\nresult = ''\nprevious_space = False\nfor ch in text:\n    if ch != ' ' or not previous_space:\n        result += ch\n    previous_space = ch == ' '\nprint(result)\n",
    'Skip a space exactly when the preceding input character is also a space.',
    'text = input()\n\n# Collapse consecutive spaces.\n'
  ),
  'level-34-problem-3': challenge(
    'Remove a Prefix Once', 'Remove the supplied nonempty prefix from the beginning of the text if it appears there; otherwise leave the text unchanged.',
    'First line: ASCII text. Second line: nonempty ASCII prefix.', 'Print the resulting text.',
    ['The text has at most 100 characters; the prefix has 1 to 100 characters.', 'Matching is case-sensitive and includes spaces.', 'Remove at most one copy.'],
    [['unhappy\nun\n', 'happy', 'The starting un is removed.'], ['banana\nana\n', 'banana', 'ana occurs inside, not at the start.'], ['\na\n', ''], ['aaaa\naa\n', 'aa'], ['abc\nabc\n', ''], ['a\nab\n', 'a'], ['Hello\nh\n', 'Hello'], ['  hi\n \n', ' hi']],
    ['Compare the prefix with the start of the text.', 'An occurrence later in the text does not count.', 'Use startswith() for the check.', 'When it matches, slice from the prefix length onward.', 'Remove only one copy, even if another remains.'],
    "text = input()\nprefix = input()\nif text.startswith(prefix):\n    text = text[len(prefix):]\nprint(text)\n",
    'A startswith check followed by one slice removes only a matching initial prefix.',
    'text = input()\nprefix = input()\n\n# Remove one matching initial prefix.\n'
  ),
  'level-34-problem-4': challenge(
    'Replace First Substring', 'Replace only the first occurrence of a nonempty pattern with the supplied replacement; leave the text unchanged if absent.',
    'Three ASCII lines: text, nonempty pattern, replacement. Text and replacement may be empty.', 'Print the resulting line.',
    ['Each line has at most 100 characters.', 'Matching is case-sensitive; spaces are significant.'],
    [['banana\nana\nX\n', 'bXna', 'Only the first ana is replaced; the overlapping later match is not considered.'], ['hello\nz\n!\n', 'hello', 'z does not occur, so the text is unchanged.'], ['aaaa\naa\nb\n', 'baa'], ['abc\nb\n\n', 'ac'], ['\nx\nz\n', ''], ['abc\nabc\n!\n', '!'], ['A a\na\nX\n', 'A X'], ['a b\n \n_\n', 'a_b']],
    ['Find the first occurrence of the pattern.', 'A missing match should leave the text unchanged.', 'The part before the match is unchanged.', 'The part after the match starts after the whole pattern.', 'Join the prefix, replacement, and suffix once.'],
    "text = input()\npattern = input()\nreplacement = input()\nindex = text.find(pattern)\nif index != -1:\n    text = text[:index] + replacement + text[index + len(pattern):]\nprint(text)\n",
    'Find the first match and join the unchanged surrounding slices with the replacement.',
    'text = input()\npattern = input()\nreplacement = input()\n\n# Replace the first match if present.\n'
  ),
  'level-34-problem-5': challenge(
    'Count Overlapping Substrings', 'Count all starting positions where the pattern matches the text, including overlapping matches.',
    'First line: ASCII text. Second line: nonempty ASCII pattern.', 'Print the number of matching starting positions.',
    ['The text has at most 100 characters; the pattern has 1 to 100 characters.', 'Matching is case-sensitive and spaces are significant.'],
    [['aaaa\naa\n', '3', 'aa starts at indices 0, 1, and 2, including overlaps.'], ['banana\nana\n', '2', 'ana starts at indices 1 and 3.'], ['\na\n', '0'], ['abc\nabcd\n', '0'], ['abc\nabc\n', '1'], ['Abab\nab\n', '1'], ['     \n  \n', '4'], ['xyz\nq\n', '0']],
    ['Matches can overlap, so do not skip past a match.', 'Consider each possible starting index.', 'A full match must fit inside the text.', 'Compare a pattern-length slice with the pattern.', 'Increment the count for every matching start.'],
    "text = input()\npattern = input()\ncount = 0\nfor i in range(len(text) - len(pattern) + 1):\n    if text[i:i + len(pattern)] == pattern:\n        count += 1\nprint(count)\n",
    'Test every valid starting index independently, so overlapping matches are counted.',
    'text = input()\npattern = input()\n\n# Count matching starting positions.\n'
  ),
  'level-35-problem-1': challenge(
    'Character Frequency Table', 'Count each distinct character and print its ASCII code and frequency in increasing code order.',
    'One line containing zero or more printable ASCII characters, including spaces.', 'For each distinct character, print its decimal ASCII code and count separated by one space, one pair per line. Print an empty line for empty input.',
    ['The line has at most 100 characters.', 'Printable ASCII means code points 32 through 126.'],
    [['baba\n', '97 2\n98 2', 'a has code 97 and occurs twice; b has code 98 and occurs twice.'], [' ! \n', '32 2\n33 1', 'The space has code 32 and occurs twice before the exclamation mark.'], ['\n', ''], ['x\n', '120 1'], ['AAA\n', '65 3'], ['zA0\n', '48 1\n65 1\n122 1'], ['!!??!\n', '33 3\n63 2'], ['a A\n', '32 1\n65 1\n97 1']],
    ['Count every character, including spaces.', 'Store counts keyed by character.', 'Increment the corresponding count for each occurrence.', 'Sort distinct characters by their ASCII code.', 'Print ord(character) and its count on each line.'],
    "text = input()\ncounts = {}\nfor ch in text:\n    counts[ch] = counts.get(ch, 0) + 1\nif not counts:\n    print()\nfor ch in sorted(counts):\n    print(ord(ch), counts[ch])\n",
    'A frequency dictionary collects counts; sorting ASCII characters gives increasing code order.',
    'text = input()\n\n# Count and print the character frequencies.\n'
  ),
  'level-35-problem-2': challenge(
    'First Nonrepeating Character', 'Find the first character in the line that occurs exactly once.',
    'One line of printable ASCII text, possibly empty.', 'Print the character itself, or NONE if no character occurs exactly once.',
    ['The line has at most 100 characters.', 'Spaces count as characters; matching is case-sensitive.'],
    [['swiss\n', 'w', 's occurs three times, while w is the earliest character occurring once.'], ['aabb\n', 'NONE', 'Both characters occur twice.'], ['\n', 'NONE'], ['x\n', 'x'], ['a ab\n', ' ', 'The space occurs once and precedes b.'], ['aAb\n', 'a'], ['xxzyz\n', 'y'], ['!??!\n', 'NONE']],
    ['The first character is not necessarily unique.', 'Count all occurrences before selecting a character.', 'Scan the original text again from left to right.', 'Select the first character whose total count is one.', 'If no such character exists, print NONE.'],
    "text = input()\ncounts = {}\nfor ch in text:\n    counts[ch] = counts.get(ch, 0) + 1\nanswer = 'NONE'\nfor ch in text:\n    if counts[ch] == 1:\n        answer = ch\n        break\nprint(answer)\n",
    'Count the whole line, then scan in input order for the first frequency of one.',
    'text = input()\n\n# Find the first character with frequency one.\n'
  ),
  'level-35-problem-3': challenge(
    'Character Multiset Containment', 'Decide whether the target can be formed using characters from the source, using each source character at most once.',
    'Two printable ASCII lines: source, then target; either may be empty.', 'Print YES if the target can be formed, otherwise NO.',
    ['Each line has at most 100 characters.', 'Case and spaces are significant; character order is not.'],
    [['banana\nnaan\n', 'YES', 'banana supplies two a characters, one n, and another n.'], ['abc\naab\n', 'NO', 'The target needs two a characters but the source has only one.'], ['\n\n', 'YES'], ['a\n\n', 'YES'], ['\na\n', 'NO'], ['ab\nba\n', 'YES'], ['Aa\naa\n', 'NO'], ['a b\n b\n', 'YES']],
    ['Order does not matter, but multiplicity does.', 'Count how many of each character the source provides.', 'Walk through the target characters.', 'Reject a character when none of it remains available.', 'Consume one available copy for every target character.'],
    "source = input()\ntarget = input()\ncounts = {}\nfor ch in source:\n    counts[ch] = counts.get(ch, 0) + 1\nok = True\nfor ch in target:\n    if counts.get(ch, 0) == 0:\n        ok = False\n        break\n    counts[ch] -= 1\nprint('YES' if ok else 'NO')\n",
    'Consume one source copy per target character and reject as soon as a copy is unavailable.',
    'source = input()\ntarget = input()\n\n# Check character availability.\n'
  ),
  'level-35-problem-4': challenge(
    'Largest Equal-Character Gap', 'Find the largest difference between indices of two equal characters in the line.',
    'One printable ASCII text line, possibly empty.', 'Print the largest index difference, or -1 if no character appears twice.',
    ['The line has at most 100 characters.', 'Indices are zero-based; spaces and case are significant.'],
    [['abca\n', '3', 'The two a characters are at indices 0 and 3.'], ['abbacb\n', '4', 'The first and last b are at indices 1 and 5, farther apart than the two a characters.'], ['\n', '-1'], ['x\n', '-1'], ['abc\n', '-1'], ['aaa\n', '2'], ['a a \n', '2'], ['AaA\n', '2']],
    ['Only pairs of equal characters qualify.', 'Track the first index at which each character appeared.', 'For a repeated character, subtract its first index from the current index.', 'Keep the largest such difference across all characters.', 'If no repeated character appears, print -1.'],
    "text = input()\nfirst = {}\nbest = -1\nfor i, ch in enumerate(text):\n    if ch in first:\n        best = max(best, i - first[ch])\n    else:\n        first[ch] = i\nprint(best)\n",
    'Keeping each character’s earliest index gives its largest possible gap at each later occurrence.',
    'text = input()\n\n# Find the largest gap between equal characters.\n'
  ),
  'level-35-problem-5': challenge(
    'Isomorphic Strings', 'Decide whether one string can be transformed into the other by a consistent one-to-one mapping between characters.',
    'Two printable ASCII text lines; either may be empty.', 'Print YES if a one-to-one mapping exists, otherwise NO.',
    ['Each line has at most 100 characters.', 'Different source characters must map to different target characters.', 'Case and spaces are significant.'],
    [['moss\nfizz\n', 'YES', 'm maps to f, o to i, and both s characters map to z.'], ['deed\nwxyz\n', 'NO', 'The two e characters would have to map to both x and y.'], ['ab\naa\n', 'NO'], ['\n\n', 'YES'], ['a\n\n', 'NO'], ['sleet\ncrxxu\n', 'YES'], ['a a\nb b\n', 'YES'], ['abc\nxyzx\n', 'NO']],
    ['The strings must have equal lengths.', 'Each source character must always map to the same target character.', 'Two different source characters cannot share a target.', 'Track mappings in both directions.', 'Reject any inconsistent pair; otherwise print YES.'],
    "first = input()\nsecond = input()\nforward = {}\nbackward = {}\nok = len(first) == len(second)\nfor a, b in zip(first, second):\n    if (a in forward and forward[a] != b) or (b in backward and backward[b] != a):\n        ok = False\n        break\n    forward[a] = b\n    backward[b] = a\nprint('YES' if ok else 'NO')\n",
    'Equal lengths and consistent forward and reverse mappings enforce a one-to-one correspondence.',
    'first = input()\nsecond = input()\n\n# Check the mapping in both directions.\n'
  )
};
