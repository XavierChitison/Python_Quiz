import { challenge } from './beginner.js';

export const strings3640Challenges = {
  'level-36-problem-1': challenge(
    'Caesar Shift of Lowercase Letters', 'Shift each lowercase ASCII letter forward by k places cyclically; preserve all other characters.',
    'First line: ASCII text. Second line: integer k.', 'Print the transformed text, preserving spaces.',
    ['Text has 0 to 100 characters.', '0 <= k <= 1000.'],
    [['xyz!\n3\n', 'abc!', 'Each letter wraps past z; punctuation stays.'], ['a Z\n27\n', 'b Z', 'A shift of 27 equals one, and uppercase Z is unchanged.'], ['\n0\n', ''], ['abc\n0\n', 'abc'], ['z\n26\n', 'z'], ['z a\n1\n', 'a b'], ['A1!\n999\n', 'A1!'], ['hello\n52\n', 'hello']],
    ['Consider lowercase letters separately from other characters.', 'Convert a lowercase letter to an offset from a.', 'Add k to that offset.', 'Use modulo 26 to wrap back to a.', 'Convert the offset back to a character and preserve everything else.'],
    "text = input()\nk = int(input())\nresult = ''\nfor ch in text:\n    if 'a' <= ch <= 'z':\n        result += chr(ord('a') + (ord(ch) - ord('a') + k) % 26)\n    else:\n        result += ch\nprint(result)\n",
    'Shift lowercase offsets modulo 26 and copy other characters.',
    "text = input()\nk = int(input())\n\n# Shift lowercase letters and print the result.\n"
  ),
  'level-36-problem-2': challenge(
    'Decode Run-Length Pairs', 'Expand each character and count pair in order.',
    'First line: n. Next n lines: one visible ASCII non-digit character, a space, then a positive count.', 'Print all characters repeated by their counts as one line.',
    ['1 <= n <= 20.', '1 <= each count <= 20.', 'Characters are non-whitespace and not digits.'],
    [['2\na 3\nb 2\n', 'aaabb', 'Three a characters followed by two b characters are produced.'], ['3\n! 1\nX 2\n! 1\n', '!XX!', 'Separate pairs are expanded in input order.'], ['1\nz 1\n', 'z'], ['1\n# 5\n', '#####'], ['2\na 1\na 2\n', 'aaa'], ['2\nA 2\na 2\n', 'AAaa'], ['3\nx 1\ny 1\nz 1\n', 'xyz'], ['2\n* 3\n- 1\n', '***-']],
    ['Read the number of pairs first.', 'Read each character and count from its own line.', 'Convert the count to an integer.', 'Repeat each character by its count.', 'Concatenate the expanded pieces in order.'],
    "n = int(input())\nresult = ''\nfor _ in range(n):\n    ch, count = input().split()\n    result += ch * int(count)\nprint(result)\n",
    'Repeat each supplied character and append the repetitions in pair order.',
    "n = int(input())\n\n# Read and expand the n pairs.\n"
  ),
  'level-36-problem-3': challenge(
    'Encode Consecutive Character Runs', 'Encode each maximal consecutive run as its character followed by its decimal length.',
    'One nonempty string of ASCII letters.', 'Print the encodings consecutively without separators.',
    ['1 <= length <= 100.', 'Letters are case-sensitive.'],
    [['aaabbc\n', 'a3b2c1', 'The runs have lengths 3, 2, and 1.'], ['aAa\n', 'a1A1a1', 'Case changes split the runs.'], ['x\n', 'x1'], ['aaaa\n', 'a4'], ['abc\n', 'a1b1c1'], ['aabbaa\n', 'a2b2a2'], ['ZZzz\n', 'Z2z2'], ['aaaaaaaaaaa\n', 'a11']],
    ['A run ends when the next character differs.', 'Track the current character and its run length.', 'Increase the length while characters match.', 'On a change append the old character and count, then reset.', 'After the loop append the final run too.'],
    "text = input()\nresult = ''\ncurrent = text[0]\ncount = 0\nfor ch in text:\n    if ch != current:\n        result += current + str(count)\n        current, count = ch, 0\n    count += 1\nresult += current + str(count)\nprint(result)\n",
    'Accumulate a count per maximal run and flush it on changes and at the end.',
    "text = input()\n\n# Encode each consecutive run.\n"
  ),
  'level-36-problem-4': challenge(
    'Reverse Only ASCII Letters', 'Reverse the order of ASCII letters while leaving every nonletter at its original index.',
    'One line of ASCII text.', 'Print the transformed line, retaining all nonletters in place.',
    ['The line has 0 to 100 characters.', 'Letters are A-Z and a-z.'],
    [['a-bC!\n', 'C-ba!', 'The letters a, b, C reverse to C, b, a while hyphen and exclamation stay put.'], ['1Ab 2\n', '1bA 2', 'Only A and b exchange positions; digits and spaces stay.'], ['\n', ''], ['123!\n', '123!'], ['x\n', 'x'], ['a!b?c\n', 'c!b?a'], ['ABcd\n', 'dcBA'], [' x \n', ' x ']],
    ['Identify letters using the two ASCII letter ranges.', 'Collect the letters in their original order.', 'Traverse the original positions again.', 'At a letter position take the last remaining collected letter.', 'Copy nonletters without moving them.'],
    "text = input()\nletters = [ch for ch in text if 'a' <= ch <= 'z' or 'A' <= ch <= 'Z']\nresult = ''\nfor ch in text:\n    if 'a' <= ch <= 'z' or 'A' <= ch <= 'Z':\n        result += letters.pop()\n    else:\n        result += ch\nprint(result)\n",
    'A stack of letters supplies them in reverse while original nonletter positions are copied.',
    "text = input()\n\n# Reverse only the letters.\n"
  ),
  'level-36-problem-5': challenge(
    'Toggle ASCII Letter Case', 'Exchange the case of each ASCII letter, leaving all other characters unchanged.',
    'One line of ASCII text.', 'Print the case-toggled line.',
    ['The line has 0 to 100 characters.'],
    [['Py3!\n', 'pY3!', 'P becomes p and y becomes Y; 3 and ! stay.'], ['a Z\n', 'A z', 'Both cases change and the space remains.'], ['\n', ''], ['123\n', '123'], ['ABC\n', 'abc'], ['abc\n', 'ABC'], ['zZ\n', 'Zz'], [' ! \n', ' ! ']],
    ['Inspect each character independently.', 'Lowercase and uppercase ASCII letters occupy separate ranges.', 'Convert lowercase letters to uppercase.', 'Convert uppercase letters to lowercase.', 'Copy nonletters unchanged and print the combined text.'],
    "text = input()\nresult = ''\nfor ch in text:\n    if 'a' <= ch <= 'z':\n        result += ch.upper()\n    elif 'A' <= ch <= 'Z':\n        result += ch.lower()\n    else:\n        result += ch\nprint(result)\n",
    'Transform letters according to their original case and preserve the rest.',
    "text = input()\n\n# Toggle each ASCII letter.\n"
  ),
  'level-37-problem-1': challenge(
    'Balanced Parentheses Depth', 'Check whether parentheses are balanced and report the maximum nesting depth if they are.',
    'One line containing only parentheses; it may be empty.', 'Print the maximum depth as an integer, or -1 if invalid.',
    ['Length is at most 100.', 'A valid string never closes an unopened pair and ends at depth zero.'],
    [['(()())\n', '2', 'The deepest point is inside two open pairs.'], [')(\n', '-1', 'The first closing parenthesis has no matching opener.'], ['\n', '0'], ['()\n', '1'], ['((()))\n', '3'], ['()()\n', '1'], ['(()\n', '-1'], ['())(\n', '-1']],
    ['Track how many pairs are currently open.', 'An opening parenthesis raises the depth.', 'A closing parenthesis lowers it.', 'Any negative depth makes the sequence invalid even if it later returns to zero.', 'Also require final depth zero; otherwise print the largest depth seen.'],
    "text = input()\ndepth = best = 0\nvalid = True\nfor ch in text:\n    depth += 1 if ch == '(' else -1\n    if depth < 0:\n        valid = False\n    best = max(best, depth)\nprint(best if valid and depth == 0 else -1)\n",
    'Track depth and its maximum, rejecting a negative prefix or a nonzero final depth.',
    "text = input()\n\n# Check balance and find maximum depth.\n"
  ),
  'level-37-problem-2': challenge(
    'Remove Outer Parentheses', 'Remove the outermost pair from each primitive component of a valid parentheses string and concatenate the results.',
    'One valid parentheses string on one line, possibly empty.', 'Print the remaining parentheses on one line.',
    ['Length is at most 100.', 'A primitive component is a nonempty balanced section that cannot be split into two nonempty balanced sections.'],
    [['(()())(())\n', '()()()', 'Removing the outer pair of each component leaves ()() and ().'], ['()(()())\n', '()()', 'The first component becomes empty and the second becomes ()().'], ['\n', ''], ['()\n', ''], ['()()\n', ''], ['((()))\n', '(())'], ['(())()\n', '()'], ['(()(()))\n', '()(())']],
    ['A primitive component starts whenever depth is zero.', 'Track the number of open parentheses.', 'An opening parenthesis at depth zero is an outer opener.', 'A closing parenthesis returning depth to zero is an outer closer.', 'Copy all other parentheses in order.'],
    "text = input()\ndepth = 0\nresult = ''\nfor ch in text:\n    if ch == '(':\n        if depth > 0:\n            result += ch\n        depth += 1\n    else:\n        depth -= 1\n        if depth > 0:\n            result += ch\nprint(result)\n",
    'Copy openings already inside a component and closings that leave the depth positive.',
    "text = input()\n\n# Remove each primitive outer pair.\n"
  ),
  'level-37-problem-3': challenge(
    'Common Prefix of Words', 'Find the longest prefix shared by every word.',
    'First line n; next n lines each contain one nonempty lowercase ASCII word.', 'Print the common prefix, or an empty line if there is none.',
    ['1 <= n <= 20.', 'Each word has 1 to 50 letters.'],
    [['3\nflower\nflow\nflight\n', 'fl', 'All three begin with fl, but their next letters differ.'], ['2\ncat\ndog\n', '', 'The first letters differ, so no nonempty prefix is common.'], ['1\nsolo\n', 'solo'], ['2\na\na\n', 'a'], ['2\nabc\nab\n', 'ab'], ['3\nsame\nsame\nsame\n', 'same'], ['2\nab\nba\n', ''], ['3\nabc\nabd\nabz\n', 'ab']],
    ['Start with the first word as a candidate prefix.', 'Every later word must start with the candidate.', 'Shorten the candidate from its end until it matches.', 'An empty candidate is valid when first letters differ.', 'Print what remains after considering all words.'],
    "n = int(input())\nprefix = input()\nfor _ in range(n - 1):\n    word = input()\n    while not word.startswith(prefix):\n        prefix = prefix[:-1]\nprint(prefix)\n",
    'Shorten the candidate until each word starts with it; it stays the longest shared prefix.',
    "n = int(input())\nwords = [input() for _ in range(n)]\n\n# Find their shared prefix.\n"
  ),
  'level-37-problem-4': challenge(
    'Compare Version Components', 'Compare two dot-separated versions component by component as integers, treating missing trailing components as zero.',
    'Two version strings on separate lines.', 'Print -1, 0, or 1 when the first version is respectively smaller, equal, or larger.',
    ['Each version has 1 to 10 nonempty decimal components.', 'Each component has 1 to 4 digits; leading zeroes are allowed.'],
    [['1.02\n1.2.0\n', '0', '02 and 2 are equal and the missing last component is zero.'], ['2.0\n1.99\n', '1', 'The first components 2 and 1 decide the comparison.'], ['0\n0.0\n', '0'], ['1.2\n1.10\n', '-1'], ['1.0.1\n1\n', '1'], ['1\n1.0.2\n', '-1'], ['01\n1\n', '0'], ['0.9\n0.8.99\n', '1']],
    ['Split each version at dots.', 'Convert components to integers so leading zeroes do not matter.', 'Compare corresponding components from left to right.', 'Use zero when one version runs out of components.', 'Stop at the first difference; otherwise the versions are equal.'],
    "a = list(map(int, input().split('.')))\nb = list(map(int, input().split('.')))\nanswer = 0\nfor i in range(max(len(a), len(b))):\n    x = a[i] if i < len(a) else 0\n    y = b[i] if i < len(b) else 0\n    if x != y:\n        answer = 1 if x > y else -1\n        break\nprint(answer)\n",
    'Compare integer components in order, filling missing components with zero.',
    "first = input()\nsecond = input()\n\n# Compare version components.\n"
  ),
  'level-37-problem-5': challenge(
    'Validate Simple Identifier', 'Check an ASCII identifier: its first character must be a letter or underscore and subsequent characters may also be digits.',
    'One line of ASCII text, possibly empty.', 'Print YES if valid, otherwise NO.',
    ['Length is at most 100.', 'Keywords are not treated specially.', 'Only A-Z, a-z, 0-9, and underscore are allowed.'],
    [['_x2\n', 'YES', 'Underscore may start and a digit may follow.'], ['2x\n', 'NO', 'A digit cannot be the first character.'], ['\n', 'NO'], ['a\n', 'YES'], ['_\n', 'YES'], ['a-b\n', 'NO'], ['a b\n', 'NO'], ['Z09_\n', 'YES']],
    ['An empty identifier is invalid.', 'Check the first character separately.', 'A letter belongs to one of the two ASCII letter ranges.', 'Later positions also allow digits and underscore.', 'Reject as soon as any character violates its position rule.'],
    "text = input()\ndef letter(ch):\n    return 'a' <= ch <= 'z' or 'A' <= ch <= 'Z'\nvalid = bool(text) and (letter(text[0]) or text[0] == '_')\nfor ch in text[1:]:\n    if not (letter(ch) or '0' <= ch <= '9' or ch == '_'):\n        valid = False\nprint('YES' if valid else 'NO')\n",
    'Check the first character and then check the larger allowed set for later positions.',
    "text = input()\n\n# Validate the identifier.\n"
  ),
  'level-38-problem-1': challenge(
    'Reverse Characters Within Words', 'Reverse each whitespace-delimited word, retaining word order.',
    'One ASCII line with words separated by spaces or tabs, possibly empty.', 'Print the reversed words joined by single spaces, with no outer spaces.',
    ['Length is at most 100.', 'Words contain visible ASCII characters.'],
    [['ab cd!\n', 'ba !dc', 'Each word is reversed separately, without swapping their order.'], ['  one\tTwo  \n', 'eno owT', 'Whitespace separates words and is normalized.'], ['\n', ''], ['   \n', ''], ['x\n', 'x'], ['abc\n', 'cba'], ['a b c\n', 'a b c'], ['12 !?\n', '21 ?!']],
    ['Split the line into words using whitespace.', 'Process words in their original order.', 'Reverse the characters within each word.', 'Collect the reversed words.', 'Join them with one space.'],
    "words = input().split()\nresult = []\nfor word in words:\n    result.append(word[::-1])\nprint(' '.join(result))\n",
    'Reverse each split word and join the results without changing word order.',
    "text = input()\n\n# Reverse each word and join the results.\n"
  ),
  'level-38-problem-2': challenge(
    'Find Palindromic Words', 'Select whitespace-delimited words that are palindromes, retaining their original order and case.',
    'One ASCII line with words separated by spaces or tabs, possibly empty.', 'Print selected words separated by single spaces, or an empty line if none qualify.',
    ['Length is at most 100.', 'Comparison is case-sensitive and includes punctuation.'],
    [['level cat aba\n', 'level aba', 'level and aba read the same in both directions.'], ['Aa a!\n', '', 'Both words differ from their reversals, including case and punctuation.'], ['\n', ''], ['x\n', 'x'], ['aa aa b\n', 'aa aa b'], ['abc def\n', ''], ['  A\tA  \n', 'A A'], ['!a! ab\n', '!a!']],
    ['Split the input into words.', 'A palindrome equals its reverse.', 'Compare characters exactly, including case.', 'Keep qualifying words in their original order, including duplicates.', 'Join selected words with one space.'],
    "words = input().split()\nselected = []\nfor word in words:\n    if word == word[::-1]:\n        selected.append(word)\nprint(' '.join(selected))\n",
    'Filter the words by equality with their reversal and preserve order.',
    "text = input()\n\n# Select the palindromic words.\n"
  ),
  'level-38-problem-3': challenge(
    'Count Whole-Word Occurrences', 'Count exact case-sensitive occurrences of a target word among whitespace-delimited words.',
    'First line: ASCII text. Second line: nonempty target word.', 'Print the number of equal whole words.',
    ['Text has at most 100 characters.', 'Whitespace consists of spaces or tabs; the target contains no whitespace.'],
    [['cat cats cat\ncat\n', '2', 'Only the two complete cat words match, not cats.'], ['A a A!\nA\n', '1', 'Case and punctuation matter, so only A matches.'], ['\nx\n', '0'], ['x\nx\n', '1'], ['x x x\nx\n', '3'], [' xx x \nx\n', '1'], ['a\tb\na\n', '1'], ['abc\nbc\n', '0']],
    ['Split the text on whitespace.', 'Compare each complete word with the target.', 'Use case-sensitive equality.', 'Count repeated matches separately.', 'Do not count substrings inside a longer word.'],
    "text = input()\ntarget = input()\ncount = 0\nfor word in text.split():\n    if word == target:\n        count += 1\nprint(count)\n",
    'Count split words that equal the target exactly.',
    "text = input()\ntarget = input()\n\n# Count exact whole-word matches.\n"
  ),
  'level-38-problem-4': challenge(
    'First Word With All Vowels', 'Find the first word containing every English vowel a, e, i, o, and u, ignoring case.',
    'One line of ASCII letter words separated by spaces or tabs, possibly empty.', 'Print the first qualifying word in its original case, or an empty line if none qualifies.',
    ['Length is at most 100.', 'Words consist only of ASCII letters.', 'Vowels may appear in any order and may repeat; y is not a vowel.'],
    [['hello education audio\n', 'education', 'hello lacks several vowels, while education contains all five.'], ['  AEIOU\tfacetious\n', 'AEIOU', 'Both words qualify but the first is returned with its case preserved.'], ['\n', ''], ['sky fly\n', ''], ['aeio\n', ''], ['uoiEA\n', 'uoiEA'], ['aaaeeeiiiooouuu\n', 'aaaeeeiiiooouuu'], ['audio queue\n', '']],
    ['Split the line into words in input order.', 'For each word, normalize case for comparison only.', 'Check whether every character in aeiou occurs in the normalized word.', 'Stop at the first qualifying word.', 'Print the original word, or an empty line if none qualifies.'],
    "words = input().split()\nanswer = ''\nfor word in words:\n    lower = word.lower()\n    if all(vowel in lower for vowel in 'aeiou'):\n        answer = word\n        break\nprint(answer)\n",
    'Test all five vowels against each lowercased word and preserve the first matching original.',
    "text = input()\n\n# Find the first word containing all five vowels.\n"
  ),
  'level-38-problem-5': challenge(
    'Wrap Words to a Width', 'Greedily pack words into lines: add the next word to the current line if it fits with one separating space, otherwise start a new line.',
    'First line: positive width. Second line: ASCII words separated by spaces or tabs.', 'Print the packed lines with single spaces between words; print one empty line if there are no words.',
    ['1 <= width <= 30.', 'Text has at most 100 characters.', 'Each word is at most width characters long.'],
    [['6\none two three\n', 'one\ntwo\nthree', 'one two would exceed six, and two three would too.'], ['7\na bb ccc d\n', 'a bb\nccc d', 'The first three words need eight positions; ccc and d fit together.'], ['3\n\n', ''], ['1\na b c\n', 'a\nb\nc'], ['5\nhello\n', 'hello'], ['5\na b c\n', 'a b c'], ['4\nab cd e\n', 'ab\ncd e'], ['8\n  a\tbb  \n', 'a bb']],
    ['Split the text into words first.', 'Keep the words of the current output line.', 'A nonempty line needs one extra space before the next word.', 'If adding it would exceed the width, finish the current line first.', 'Print the final line, including an empty result when there are no words.'],
    "width = int(input())\nwords = input().split()\nlines = []\nline = ''\nfor word in words:\n    if line and len(line) + 1 + len(word) > width:\n        lines.append(line)\n        line = ''\n    line = line + ' ' + word if line else word\nif line:\n    lines.append(line)\nprint('\\n'.join(lines))\n",
    'Append each word when it fits; otherwise finish the line and start another.',
    "width = int(input())\nwords = input().split()\n\n# Greedily pack the words into lines.\n"
  ),
  'level-39-problem-1': challenge(
    'Longest Repeated Prefix', 'Find the longest nonempty proper prefix that also occurs starting at some nonzero index; occurrences may overlap.',
    'One line of ASCII text.', 'Print the longest qualifying prefix, or an empty line if none exists.',
    ['The text has 0 to 100 characters.', 'Matching is case-sensitive and includes spaces.'],
    [['ababa\n', 'aba', 'aba starts at indices 0 and 2, and the occurrences overlap.'], ['abcabx\n', 'ab', 'ab reappears at index 3, but abc does not.'], ['\n', ''], ['a\n', ''], ['aaaa\n', 'aaa'], ['abc\n', ''], ['ababab\n', 'abab'], [' A A\n', ' A']],
    ['The prefix must be shorter than the entire text.', 'A second occurrence must begin after index zero.', 'Occurrences are allowed to overlap.', 'Try prefix lengths from longest to shortest.', 'Print the first repeated prefix found, or an empty string.'],
    "text = input()\nanswer = ''\nfor size in range(len(text) - 1, 0, -1):\n    prefix = text[:size]\n    if text.find(prefix, 1) != -1:\n        answer = prefix\n        break\nprint(answer)\n",
    'Check proper prefixes from longest down and search for another occurrence starting after zero.',
    "text = input()\n\n# Find the longest prefix repeated later.\n"
  ),
  'level-39-problem-2': challenge(
    'Rotate Text by K Positions', 'Rotate the text left by k character positions.',
    'First line: ASCII text, possibly empty. Second line: nonnegative integer k.', 'Print the rotated text, preserving all characters.',
    ['Text has at most 100 characters.', '0 <= k <= 10000.', 'The rotation of empty text is empty.'],
    [['abcdef\n2\n', 'cdefab', 'The first two characters move to the end in order.'], ['abc\n5\n', 'cab', 'Five positions reduce to two modulo three.'], ['\n9\n', ''], ['x\n100\n', 'x'], ['abc\n0\n', 'abc'], ['abc\n3\n', 'abc'], [' a b\n1\n', 'a b '], ['abcd\n7\n', 'dabc']],
    ['A left rotation moves a leading section to the end.', 'Empty text has no positions to rotate.', 'For nonempty text reduce k modulo the text length.', 'Slice the suffix starting at the reduced position.', 'Append the prefix before that position.'],
    "text = input()\nk = int(input())\nif text:\n    k %= len(text)\n    text = text[k:] + text[:k]\nprint(text)\n",
    'Reduce the rotation modulo the nonzero length and exchange the two slices.',
    "text = input()\nk = int(input())\n\n# Rotate the text left.\n"
  ),
  'level-39-problem-3': challenge(
    'One-Character Edit Check', 'Decide whether exactly one insertion, deletion, or substitution converts the first string to the second.',
    'Two ASCII text lines, either possibly empty.', 'Print YES if exactly one edit suffices, otherwise NO.',
    ['Each line has at most 100 characters.', 'A substitution changes one character to a different character.', 'Comparison is case-sensitive.'],
    [['cat\ncut\n', 'YES', 'Replacing a with u gives cut.'], ['abc\nabxc\n', 'YES', 'Inserting x before c gives abxc.'], ['same\nsame\n', 'NO'], ['\na\n', 'YES'], ['a\n\n', 'YES'], ['abc\naxy\n', 'NO'], ['a\nabc\n', 'NO'], ['ab\nba\n', 'NO']],
    ['If lengths differ by more than one, a single edit cannot suffice.', 'Scan matching characters from the start.', 'On the first mismatch consider the relative lengths.', 'Skip one character in the longer string, or one in each for substitution.', 'Require exactly one edit and matching remaining characters.'],
    "a = input()\nb = input()\nif len(a) > len(b):\n    a, b = b, a\nif len(b) - len(a) > 1:\n    print('NO')\nelse:\n    i = j = edits = 0\n    while i < len(a) and j < len(b):\n        if a[i] == b[j]:\n            i += 1\n            j += 1\n        else:\n            edits += 1\n            j += 1\n            if len(a) == len(b):\n                i += 1\n    edits += len(b) - j\n    print('YES' if edits == 1 else 'NO')\n",
    'Scan both strings, spending one edit on a mismatch or a remaining final character.',
    "first = input()\nsecond = input()\n\n# Check whether exactly one edit suffices.\n"
  ),
  'level-39-problem-4': challenge(
    'Longest Substring Without Repeats', 'Find the maximum length of a contiguous substring containing no repeated characters.',
    'One line of ASCII text, possibly empty.', 'Print the maximum length as an integer.',
    ['Length is at most 200.', 'Characters including spaces are case-sensitive.'],
    [['abcabcbb\n', '3', 'abc is a longest contiguous section without repeated characters.'], ['abba\n', '2', 'ab and ba have length two; no longer section has all distinct characters.'], ['\n', '0'], ['aaaa\n', '1'], ['abcdef\n', '6'], ['aA a\n', '3'], ['dvdf\n', '3'], ['pwwkew\n', '3']],
    ['A substring occupies consecutive positions.', 'Maintain a window with no duplicate characters.', 'When adding a repeated character, advance the left edge past its previous copy.', 'Track the longest valid window after each addition.', 'An empty input has maximum length zero.'],
    "text = input()\nleft = best = 0\nlast = {}\nfor right, ch in enumerate(text):\n    if ch in last and last[ch] >= left:\n        left = last[ch] + 1\n    last[ch] = right\n    best = max(best, right - left + 1)\nprint(best)\n",
    'Use last-seen positions to move the window start beyond any duplicate.',
    "text = input()\n\n# Find the longest window without repeated characters.\n"
  ),
  'level-39-problem-5': challenge(
    'Closest Pattern Occurrence', 'Find the start index of an exact pattern occurrence closest to the target index, breaking ties toward the smaller start index. Overlapping occurrences count.',
    'First line: ASCII text. Second line: nonempty ASCII pattern. Third line: target index.', 'Print the zero-based start index, or -1 if the pattern does not occur.',
    ['Text has 0 to 100 characters; pattern has 1 to 30 characters.', '0 <= target index <= length of text.', 'Matching is case-sensitive and includes spaces.'],
    [['ababa\naba\n3\n', '2', 'The overlapping matches start at 0 and 2; 2 is closer to target 3.'], ['ababa\naba\n1\n', '0', 'Both starts are one position away, so the smaller start 0 wins.'], ['abc\nabcd\n2\n', '-1'], ['\na\n0\n', '-1'], ['a\na\n0\n', '0'], ['aaaa\naa\n2\n', '2'], [' a a \n a\n5\n', '2'], ['ABCabc\nabc\n0\n', '3']],
    ['Consider every possible start index in the text.', 'Compare the slice at each start with the whole pattern.', 'Advance starts one position at a time so overlaps are included.', 'Measure each match using the absolute difference from the target index.', 'Keep the earlier start on equal distances and print -1 if there is no match.'],
    "text = input()\npattern = input()\ntarget = int(input())\nbest = -1\nfor start in range(len(text) - len(pattern) + 1):\n    if text[start:start + len(pattern)] == pattern:\n        if best == -1 or abs(start - target) < abs(best - target):\n            best = start\nprint(best)\n",
    'Scan starts in order and update the best only for a strictly smaller distance, preserving earlier ties.',
    "text = input()\npattern = input()\ntarget = int(input())\n\n# Find the closest matching start.\n"
  ),
  'level-40-problem-1': challenge(
    'Parse Signed Decimal Integer', 'Convert an optionally signed decimal string to an integer without calling int on the entire string.',
    'One valid decimal string: optional + or - followed by one or more digits.', 'Print its integer value in canonical decimal form, without a plus sign or leading zeroes.',
    ['The input has at most 100 digits.', 'An all-zero input prints 0, including negative zero.'],
    [['-0012\n', '-12', 'The sign is negative and leading zeroes do not change the value.'], ['+42\n', '42', 'The plus sign indicates a positive value.'], ['0\n', '0'], ['-0\n', '0'], ['0007\n', '7'], ['9\n', '9'], ['-100\n', '-100'], ['+000\n', '0']],
    ['Separate any leading sign from the digit sequence.', 'Start the accumulated value at zero.', 'Each next digit shifts the accumulated value one decimal place left.', 'Convert a digit using its code point relative to 0.', 'Apply the sign after processing every digit.'],
    "text = input()\nsign = 1\nif text[0] in '+-':\n    if text[0] == '-':\n        sign = -1\n    text = text[1:]\nvalue = 0\nfor ch in text:\n    value = value * 10 + ord(ch) - ord('0')\nprint(sign * value)\n",
    'Accumulate base-ten digits and apply the optional sign at the end.',
    "text = input()\n\n# Parse the digits and print the signed integer.\n"
  ),
  'level-40-problem-2': challenge(
    'Add Nonnegative Decimal Strings', 'Add two nonnegative decimal strings using column arithmetic, without converting either whole string to an integer.',
    'Two nonempty decimal digit strings on separate lines.', 'Print their sum in canonical decimal form, with no leading zeroes except for zero itself.',
    ['Each string has 1 to 100 digits.', 'Leading zeroes may occur.'],
    [['999\n1\n', '1000', 'The carry propagates through all three nines.'], ['0012\n008\n', '20', 'Leading zeroes do not change 12 plus 8.'], ['0\n0\n', '0'], ['5\n4\n', '9'], ['99\n99\n', '198'], ['1000\n9\n', '1009'], ['12345678901234567890\n10\n', '12345678901234567900'], ['000\n00\n', '0']],
    ['Process digit positions from right to left.', 'At each position add both digits and the carry.', 'Use zero for a position beyond either input.', 'Save the ones digit and carry the rest to the next position.', 'Reverse the result and remove leading zeroes, retaining one zero if needed.'],
    "a = input()\nb = input()\ni, j, carry = len(a) - 1, len(b) - 1, 0\ndigits = []\nwhile i >= 0 or j >= 0 or carry:\n    total = carry\n    if i >= 0:\n        total += ord(a[i]) - ord('0')\n        i -= 1\n    if j >= 0:\n        total += ord(b[j]) - ord('0')\n        j -= 1\n    digits.append(str(total % 10))\n    carry = total // 10\nprint(''.join(reversed(digits)).lstrip('0') or '0')\n",
    'Add aligned digits with carry, then reverse and normalize the resulting digits.',
    "first = input()\nsecond = input()\n\n# Add the decimal strings digit by digit.\n"
  ),
  'level-40-problem-3': challenge(
    'Roman Numeral Value', 'Evaluate a canonical uppercase Roman numeral using additive and subtractive notation.',
    'One canonical Roman numeral representing an integer from 1 through 3999.', 'Print its decimal integer value.',
    ['Only I, V, X, L, C, D, and M occur.', 'Input follows standard canonical Roman notation.'],
    [['XIV\n', '14', 'X adds 10 and IV contributes 4.'], ['MCMXCIV\n', '1994', 'M + CM + XC + IV is 1000 + 900 + 90 + 4.'], ['I\n', '1'], ['III\n', '3'], ['IV\n', '4'], ['IX\n', '9'], ['LVIII\n', '58'], ['MMMCMXCIX\n', '3999']],
    ['Associate each Roman symbol with its value.', 'Compare each symbol with the next one.', 'A smaller value before a larger value is subtracted.', 'Otherwise add the current value.', 'Add the final symbol because there is no next one.'],
    "text = input()\nvalues = {'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000}\ntotal = 0\nfor i, ch in enumerate(text):\n    value = values[ch]\n    if i + 1 < len(text) and value < values[text[i + 1]]:\n        total -= value\n    else:\n        total += value\nprint(total)\n",
    'Subtract a symbol before a larger next symbol; add every other symbol.',
    "text = input()\n\n# Evaluate the Roman numeral.\n"
  ),
  'level-40-problem-4': challenge(
    'Simple CSV Field Parser', 'Parse a single CSV record into fields, interpreting quoted fields and doubled quotes inside quoted fields.',
    'One valid single-line CSV record.', 'Print a compact JSON array of decoded field strings, with no spaces between array elements.',
    ['The record has at most 100 printable ASCII characters.', 'A field is either unquoted without commas or quotes, or enclosed in double quotes; within quoted fields a quote is escaped as two double quotes.', 'Empty fields, including a final empty field, are allowed; embedded newlines are not.'],
    [['a,"b,c",d\n', '["a","b,c","d"]', 'The quoted comma belongs to the second field.'], ['"a""b",\n', '["a\\"b",""]', 'The doubled quote becomes one quote, and the final comma creates an empty field.'], ['\n', '[""]'], [',,\n', '["","",""]'], ['""\n', '[""]'], ['a,"c:\\dir",z\n', '["a","c:\\\\dir","z"]'], ['"x,y","z"\n', '["x,y","z"]'], ['a,"",b\n', '["a","","b"]']],
    ['Commas outside quotes separate fields.', 'Track whether the scan is inside a quoted field.', 'Inside quotes, two consecutive quotes represent one literal quote.', 'At a separator, save the current field, including an empty field.', 'Save the last field and serialize the list as compact JSON.'],
    "import json\nrecord = input()\nfields = []\nfield = ''\nquoted = False\ni = 0\nwhile i < len(record):\n    ch = record[i]\n    if ch == '\"':\n        if quoted and i + 1 < len(record) and record[i + 1] == '\"':\n            field += '\"'\n            i += 1\n        else:\n            quoted = not quoted\n    elif ch == ',' and not quoted:\n        fields.append(field)\n        field = ''\n    else:\n        field += ch\n    i += 1\nfields.append(field)\nprint(json.dumps(fields, separators=(',', ':')))\n",
    'A quote-aware scan separates only unquoted commas and decodes doubled quotes.',
    "record = input()\n\n# Parse the fields and print them as compact JSON.\n"
  ),
  'level-40-problem-5': challenge(
    'Longest Palindromic Substring', 'Find the longest contiguous substring that reads identically forwards and backwards; break ties by earliest start.',
    'One line of ASCII text, possibly empty.', 'Print the selected substring, or an empty line for empty input.',
    ['Length is at most 200.', 'Characters, including spaces, are case-sensitive.'],
    [['xyabaqcdc\n', 'aba', 'aba and cdc have equal maximum length, so the earlier aba wins.'], ['pqqr\n', 'qq', 'The longest palindrome has even length and is qq.'], ['\n', ''], ['a\n', 'a'], ['abc\n', 'a'], ['aaaa\n', 'aaaa'], ['racecarx\n', 'racecar'], ['a A a\n', 'a A a']],
    ['A palindrome mirrors around a center.', 'Centers can be a character or a gap between characters.', 'Expand while the two edge characters match.', 'Record the longest expanded palindrome.', 'On equal lengths keep the one with the smaller starting index.'],
    "text = input()\nbest_start = best_length = 0\nfor center in range(len(text)):\n    for left, right in ((center, center), (center, center + 1)):\n        while left >= 0 and right < len(text) and text[left] == text[right]:\n            length = right - left + 1\n            if length > best_length or (length == best_length and left < best_start):\n                best_start, best_length = left, length\n            left -= 1\n            right += 1\nprint(text[best_start:best_start + best_length])\n",
    'Expand around both odd and even centers and choose the longest, earliest palindrome.',
    "text = input()\n\n# Find the earliest longest palindromic substring.\n"
  )
};
