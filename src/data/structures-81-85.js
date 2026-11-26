import { challenge } from './beginner.js';

const lineStarter = 'text = input()\n\n# Compute and print the answer.\n';
const twoLinesStarter = 'first = input()\nsecond = input()\n\n# Compute and print the answer.\n';
const commandsStarter = 'n = int(input())\ncommands = [input() for _ in range(n)]\n\n# Process the commands and print the requested results.\n';
const nestedFormat = 'One line containing a Python-style list of integers and nested lists, such as [1, [], [-2, 3]].';
const nestedLimits = ['The outer value is a list; leaves are integers from -1000 to 1000.', 'There are at most 100 integer leaves and at most 30 nested list levels, counting the outer list.'];

export const structures8185Challenges = {
  'level-81-problem-1': challenge(
    'Recursive Digit Position Matches',
    'Count digits equal to their zero-based position from the right, using recursion. Zero has one digit.',
    'One nonnegative integer n, without leading zeros except for zero itself.',
    'Print the number of matching digits.',
    ['0 <= n <= 999999999999999999.'],
    [['120\n', '1', 'From the right, digits 0, 2, 1 occupy positions 0, 1, 2; only 0 matches.'], ['210\n', '3', 'Digits 0, 1 and 2 match positions 0, 1 and 2.'], ['0\n', '1'], ['7\n', '0'], ['10\n', '2'], ['1010\n', '2'], ['3210\n', '4'], ['999999999999999999\n', '1']],
    ['Look at the rightmost digit first.', 'Pass its position as a recursive argument.', 'Compare n % 10 with that position.', 'Remove the digit with integer division by 10.', 'Handle a one-digit number as a base case, including zero.'],
    `n = int(input())
def count(value, position):
    match = int(value % 10 == position)
    if value < 10:
        return match
    return match + count(value // 10, position + 1)
print(count(n, 0))
`, 'Each recursive call processes one digit and advances the position.', lineStarter
  ),
  'level-81-problem-2': challenge(
    'Recursive Geometric Series Sum',
    'Sum n terms starting with a, multiplying each term by r to get the next. Use recursion.',
    'One line: integers a r n.',
    'Print the integer sum; the empty sum is zero.',
    ['-10 <= a, r <= 10.', '0 <= n <= 20.'],
    [['2 3 4\n', '80', 'The four terms are 2, 6, 18 and 54.'], ['5 -2 3\n', '15', 'The terms 5, -10 and 20 sum to 15.'], ['3 4 0\n', '0'], ['1 10 20\n', '11111111111111111111'], ['7 0 4\n', '7'], ['-2 1 4\n', '-8'], ['1 -1 4\n', '0'], ['3 2 1\n', '3']],
    ['The current term is included once.', 'When no terms remain, return zero.', 'Pass the next term as current times r.', 'Decrease the remaining term count on each call.', 'Add the current term to the recursive sum.'],
    `a, r, n = map(int, input().split())
def total(term, remaining):
    if remaining == 0:
        return 0
    return term + total(term * r, remaining - 1)
print(total(a, n))
`, 'The base case is the empty series; each call adds its first term.', lineStarter
  ),
  'level-81-problem-3': challenge(
    'Recursive Subsequence Check',
    'Decide whether the first string is a subsequence of the second, preserving order but allowing gaps. Use recursion.',
    'Two lines: candidate then text. Each may be empty; characters are lowercase ASCII letters.',
    'Print YES or NO.',
    ['Each line has at most 100 characters.'],
    [['pnt\npainted\n', 'YES', 'p, n and t occur in that order in painted.'], ['pna\npainted\n', 'NO', 'There is no a after the matched n.'], ['\nabc\n', 'YES'], ['a\n\n', 'NO'], ['\n\n', 'YES'], ['aa\na\n', 'NO'], ['aaa\nabaca\n', 'YES'], ['x\nxyz\n', 'YES']],
    ['Track a position in each string.', 'An exhausted candidate has matched completely.', 'An exhausted text cannot match a remaining candidate.', 'When characters agree, advance both positions.', 'Otherwise skip the current text character.'],
    `candidate = input()
text = input()
def matches(i, j):
    if i == len(candidate):
        return True
    if j == len(text):
        return False
    if candidate[i] == text[j]:
        return matches(i + 1, j + 1)
    return matches(i, j + 1)
print('YES' if matches(0, 0) else 'NO')
`, 'Match each needed character at its earliest occurrence; skipped text cannot help an earlier match.', twoLinesStarter
  ),
  'level-81-problem-4': challenge(
    'Recursively Group Decimal Digits',
    'Insert commas into the input digit string in groups of three from the right. Preserve every digit, including leading zeros. Use recursion.',
    'One line containing a nonempty ASCII decimal digit string.',
    'Print the grouped string.',
    ['The string contains 1 to 90 digits.'],
    [['8765432\n', '8,765,432', 'The rightmost groups are 432 and 765, leaving 8.'], ['008076\n', '008,076', 'Leading zeros remain part of the first group.'], ['0\n', '0'], ['123\n', '123'], ['1234\n', '1,234'], ['0000\n', '0,000'], ['123456\n', '123,456'], ['123456789012\n', '123,456,789,012']],
    ['Keep the input as text to preserve zeros.', 'A string of at most three digits needs no separator.', 'Separate the last three digits from the prefix.', 'Recursively format the prefix.', 'Join the formatted prefix and final group with a comma.'],
    `digits = input()
def group(s):
    if len(s) <= 3:
        return s
    return group(s[:-3]) + ',' + s[-3:]
print(group(digits))
`, 'The recursive prefix contains all complete groups before the final three digits.', lineStarter
  ),
  'level-81-problem-5': challenge(
    'Count Recursive Reduction Paths',
    'Count operation sequences that reduce n to zero. At each positive value subtract 1, or if even halve it. Count the choices separately even when they lead to the same value.',
    'One integer n.',
    'Print the number of operation sequences; zero has one empty sequence.',
    ['0 <= n <= 100.'],
    [['2\n', '2', 'Subtracting and halving both reach 1, but are different choices.'], ['4\n', '4', 'Subtracting leads to 3 with two paths; halving leads to 2 with two.'], ['0\n', '1'], ['1\n', '1'], ['3\n', '2'], ['5\n', '4'], ['6\n', '6'], ['8\n', '10']],
    ['Count complete paths rather than distinct intermediate values.', 'At zero there is one completed empty continuation.', 'Subtracting one is always allowed when positive.', 'At an even value add the count from halving as well.', 'Memoize counts so repeated subproblems are not recomputed.'],
    `from functools import lru_cache
n = int(input())
@lru_cache(None)
def paths(x):
    if x == 0:
        return 1
    return paths(x - 1) + (paths(x // 2) if x % 2 == 0 else 0)
print(paths(n))
`, 'Each possible first operation contributes its own count of continuations.', lineStarter
  ),
  'level-82-problem-1': challenge(
    'Recursive Sum of Nested Lists', 'Sum all integer leaves of the nested list recursively.',
    nestedFormat, 'Print the sum; a list without integer leaves sums to zero.', nestedLimits,
    [['[1, [2, -3], 4]\n', '4', 'The integer leaves sum to 1 + 2 - 3 + 4.'], ['[[], [5, [6]]]\n', '11', 'Empty lists contribute zero; 5 and 6 contribute 11.'], ['[]\n', '0'], ['[0]\n', '0'], ['[-4, 4]\n', '0'], ['[[[[7]]]]\n', '7'], ['[1, 2, 3]\n', '6'], ['[[], [[]]]\n', '0']],
    ['An integer contributes its own value.', 'A list contributes the sums of its children.', 'Use isinstance to distinguish lists from integers.', 'Recursively visit each child.', 'Use zero as the sum of an empty list.'],
    `from ast import literal_eval
data = literal_eval(input())
def total(item):
    if isinstance(item, int):
        return item
    return sum(total(child) for child in item)
print(total(data))
`, 'Recursively add leaf values; empty lists contribute nothing.', lineStarter
  ),
  'level-82-problem-2': challenge(
    'Prune Empty Nested Lists', 'Recursively remove every empty child list while retaining all integers and their order. Remove a child list that becomes empty after its own children are pruned. Always retain the outermost list.',
    nestedFormat, 'Print the resulting list as compact JSON, with no spaces between elements or brackets.',
    nestedLimits,
    [['[1, [], [2, [[]]], [[3], []]]\n', '[1,[2],[[3]]]', 'The empty child and the recursively emptied branch disappear, while the branches containing 2 and 3 remain.'], ['[[[]], [], -2, [[], 0]]\n', '[-2,[0]]', 'Both empty branches vanish; -2 and 0 remain, so the list containing 0 stays.'], ['[]\n', '[]'], ['[[], [[]], [[[]]]]\n', '[]'], ['[0, -1, [2]]\n', '[0,-1,[2]]'], ['[[[4]], [[[]], 5], []]\n', '[[[4]],[5]]'], ['[[], 0, [], 0]\n', '[0,0]'], ['[[[], [[], []]], [[1, []], 2]]\n', '[[[1],2]]']],
    ['Inspect each child of a list in order.', 'Keep integer children, including zero.', 'Recursively prune each child list before deciding whether to keep it.', 'Discard a pruned child list only if it is empty.', 'Keep the outermost list even if all its children disappear, and print compact JSON.'],
    `from ast import literal_eval
import json
data = literal_eval(input())
def prune(items):
    result = []
    for item in items:
        if isinstance(item, list):
            item = prune(item)
            if not item:
                continue
        result.append(item)
    return result
print(json.dumps(prune(data), separators=(',', ':')))
`, 'Prune children bottom-up, retaining a child list only when it still contains something.', lineStarter
  ),
  'level-82-problem-3': challenge(
    'Recursive Flattening', 'List all integer leaves from the nested list in left-to-right order, using recursion.',
    nestedFormat, 'Print the integers separated by spaces, or an empty line if there are no leaves.', nestedLimits,
    [['[[8, -2], 7, [3, [0]]]\n', '8 -2 7 3 0', 'Visit each child in order and expand nested lists in place.'], ['[[], [-6, [], [9]]]\n', '-6 9', 'Empty lists produce no values, while -6 precedes 9.'], ['[]\n', ''], ['[0]\n', '0'], ['[-4, 4]\n', '-4 4'], ['[[[[7]]]]\n', '7'], ['[1, 2, 3]\n', '1 2 3'], ['[[], [[]]]\n', '']],
    ['An integer becomes a one-element result.', 'An empty list contributes no elements.', 'Process list children from left to right.', 'Recursively flatten each child.', 'Extend the result with each child result.'],
    `from ast import literal_eval
data = literal_eval(input())
def flatten(item):
    if isinstance(item, int):
        return [item]
    result = []
    for child in item:
        result.extend(flatten(child))
    return result
print(*flatten(data))
`, 'Replace each nested child by its recursively flattened leaves in order.', lineStarter
  ),
  'level-82-problem-4': challenge(
    'Tower of Hanoi Moves', 'Move n disks between the specified pegs, using the remaining peg as spare. Initially smaller disks are above larger disks; move one disk at a time and never put a larger disk on a smaller one. Use the standard minimum-move recursive procedure.',
    'One line: n, source peg and destination peg, separated by spaces. Pegs are distinct letters A, B or C.', 'Print each move as source and destination peg letters separated by a space, one move per line. For n = 0 print nothing.',
    ['0 <= n <= 8.'],
    [['1 A C\n', 'A C', 'The single disk moves directly from A to C.'], ['2 A C\n', 'A B\nA C\nB C', 'Move the small disk aside, move the large one, then move the small disk onto it.'], ['0 A C\n', ''], ['3 A C\n', 'A C\nA B\nC B\nA C\nB A\nB C\nA C'], ['2 B A\n', 'B C\nB A\nC A'], ['4 A C\n', 'A B\nA C\nB C\nA B\nC A\nC B\nA B\nA C\nB C\nB A\nC A\nB C\nA B\nA C\nB C'], ['2 C B\n', 'C A\nC B\nA B'], ['3 B C\n', 'B C\nB A\nC A\nB C\nA B\nA C\nB C']],
    ['Move the top n - 1 disks to the spare peg first.', 'Then move the largest disk to the destination.', 'Finally move the smaller stack onto the largest disk.', 'Swap the roles of source, destination and spare in recursive calls.', 'Zero disks require no moves.'],
    `parts = input().split()
n, source, target = int(parts[0]), parts[1], parts[2]
spare = next(peg for peg in 'ABC' if peg not in (source, target))
def move(n, source, target, spare):
    if n == 0:
        return
    move(n - 1, source, spare, target)
    print(source, target)
    move(n - 1, spare, target, source)
move(n, source, target, spare)
`, 'The two recursive transfers expose the largest disk and then restore the smaller disks.', lineStarter
  ),
  'level-82-problem-5': challenge(
    'Count Separated Binary Ones', 'Count length-n binary strings containing exactly k ones, with no two ones adjacent. Use recursion.',
    'One line containing integers n and k.', 'Print the count, including the empty string when n and k are zero.',
    ['0 <= n <= 50.', '0 <= k <= n.'],
    [['4 2\n', '3', 'The valid strings are 0101, 1001 and 1010.'], ['5 2\n', '6', 'The pairs of positions for the ones must have at least one zero between them.'], ['0 0\n', '1'], ['1 1\n', '1'], ['3 2\n', '1'], ['2 2\n', '0'], ['5 0\n', '1'], ['10 3\n', '56']],
    ['Track both remaining positions and remaining ones.', 'If no ones remain, the all-zero suffix is the only choice.', 'A leading zero leaves the number of required ones unchanged.', 'A leading one uses a position and forces the next position to zero if present.', 'Add the two recursive counts and memoize them.'],
    `from functools import lru_cache
n, k = map(int, input().split())
@lru_cache(None)
def count(length, ones):
    if ones == 0:
        return 1
    if length <= 0 or ones > length:
        return 0
    if length == 1:
        return int(ones == 1)
    return count(length - 1, ones) + count(length - 2, ones - 1)
print(count(n, k))
`, 'Choose a leading zero or a leading one followed by a forced zero, tracking the remaining ones.', lineStarter
  ),
  'level-83-problem-1': challenge(
    'Stack Command Processor', 'Start with an empty stack. Process push x, pop and peek; pop removes and reports the top, while peek reports it without removing it.',
    'First line n; then n command lines. x is an integer.', 'For each pop or peek print its value, or EMPTY if the stack is empty, on its own line. Push prints nothing.',
    ['0 <= n <= 100.', '-1000 <= x <= 1000.'],
    [['5\npush 4\npush 7\npeek\npop\npop\n', '7\n7\n4', 'Peek leaves 7 on top; the two pops remove 7 then 4.'], ['3\npop\npush -1\npeek\n', 'EMPTY\n-1', 'The first pop finds an empty stack.'], ['0\n', ''], ['1\npeek\n', 'EMPTY'], ['1\npush 0\n', ''], ['4\npush 1\npop\npop\npeek\n', '1\nEMPTY\nEMPTY'], ['4\npush 2\npush 2\npop\npeek\n', '2\n2'], ['3\npush -5\npeek\npeek\n', '-5\n-5']],
    ['Use a list to store stack entries.', 'Push appends to the end of the list.', 'The end of the list is the top.', 'Check whether the list is empty before pop or peek.', 'Peek reads the top without removing it.'],
    `n = int(input())
stack = []
for _ in range(n):
    parts = input().split()
    if parts[0] == 'push':
        stack.append(int(parts[1]))
    elif not stack:
        print('EMPTY')
    elif parts[0] == 'pop':
        print(stack.pop())
    else:
        print(stack[-1])
`, 'The list end is the stack top, with empty checks before reads and removals.', commandsStarter
  ),
  'level-83-problem-2': challenge(
    'Match Multiple Bracket Types', 'Determine whether all brackets are properly nested and matched; ignore all non-bracket characters.',
    'One line of ASCII text, possibly empty.', 'Print YES if brackets are properly matched, otherwise NO.',
    ['The line contains at most 200 characters.'],
    [['run{[x(y)]}\n', 'YES', 'Each closer matches the most recent opener.'], ['a{(b]}\n', 'NO', 'The square bracket arrives while a parenthesis is open.'], ['\n', 'YES'], ['abc\n', 'YES'], [']\n', 'NO'], ['((\n', 'NO'], ['{}[]()\n', 'YES'], ['{[}]\n', 'NO']],
    ['Ignore characters other than the six brackets.', 'Push every opening bracket.', 'A closer must match the most recent unmatched opener.', 'Reject a closer when the stack is empty or its top differs.', 'At the end, reject any remaining opener.'],
    `text = input()
stack = []
opening = '([{'
partners = {')': '(', ']': '[', '}': '{'}
valid = True
for c in text:
    if c in opening:
        stack.append(c)
    elif c in partners:
        if not stack or stack.pop() != partners[c]:
            valid = False
            break
print('YES' if valid and not stack else 'NO')
`, 'A stack enforces both bracket type and nesting order.', lineStarter
  ),
  'level-83-problem-3': challenge(
    'Evaluate Postfix Arithmetic', 'Evaluate a valid postfix expression with integer operands and binary +, -, * and // operators. Division is floor division.',
    'One line of space-separated tokens; negative integers are written with a leading minus.', 'Print the integer result.',
    ['There are 1 to 100 tokens.', 'Every intermediate result has absolute value at most 10^12; divisors are nonzero.', 'The expression is valid and leaves exactly one value.'],
    [['8 5 - 4 *\n', '12', 'Subtract 5 from 8, then multiply by 4.'], ['-11 4 //\n', '-3', 'Floor division rounds -11/4 down to -3.'], ['5\n', '5'], ['8 3 -\n', '5'], ['2 9 -\n', '-7'], ['4 2 // 3 +\n', '5'], ['-2 -3 * 1 +\n', '7'], ['9 2 3 + *\n', '45']],
    ['Push each integer operand.', 'Each operator consumes two operands.', 'Pop the right operand before the left operand.', 'Apply the operator in the correct order and push its result.', 'The last remaining stack value is the answer.'],
    `tokens = input().split()
stack = []
for token in tokens:
    if token not in ('+', '-', '*', '//'):
        stack.append(int(token))
    else:
        right, left = stack.pop(), stack.pop()
        if token == '+':
            stack.append(left + right)
        elif token == '-':
            stack.append(left - right)
        elif token == '*':
            stack.append(left * right)
        else:
            stack.append(left // right)
print(stack[0])
`, 'Operators replace their two most recent operands with the calculated result.', lineStarter
  ),
  'level-83-problem-4': challenge(
    'Undo Text Append Operations', 'Start with empty text. Append words without separators or undo the most recent append not yet undone. Ignore undo on empty history.',
    'First line n; then n lines, each either append WORD or undo. WORD contains 1 to 20 lowercase letters.', 'Print the final text, or an empty line if it is empty.',
    ['0 <= n <= 100.'],
    [['4\nappend cat\nappend dog\nundo\nappend s\n', 'cats', 'Undo removes dog; s is then appended to cat.'], ['3\nundo\nappend a\nundo\n', '', 'Undo on empty history does nothing, and the later undo removes a.'], ['0\n', ''], ['1\nappend hi\n', 'hi'], ['2\nappend a\nappend b\n', 'ab'], ['3\nappend a\nundo\nundo\n', ''], ['5\nappend x\nappend y\nundo\nappend z\nundo\n', 'x'], ['4\nappend ab\nappend cd\nundo\nundo\n', '']],
    ['Each append adds one whole word.', 'Keep appended pieces in a stack.', 'Undo removes the latest remaining piece.', 'Ignore undo if the stack is empty.', 'Join the remaining pieces without separators.'],
    `n = int(input())
pieces = []
for _ in range(n):
    parts = input().split()
    if parts[0] == 'append':
        pieces.append(parts[1])
    elif pieces:
        pieces.pop()
print(''.join(pieces))
`, 'Each undo discards the most recently retained appended piece.', commandsStarter
  ),
  'level-83-problem-5': challenge(
    'Simplify an Absolute File Path', 'Normalize an absolute slash-separated path: ignore empty components and dots, and let .. remove the preceding component unless already at root.',
    'One absolute path beginning with /; ordinary components contain lowercase letters or consist of three or more dots.', 'Print the normalized absolute path, with no trailing slash except for root.',
    ['The input has at most 200 characters.', 'Each component has at most 20 characters.'],
    [['/elm//oak/../ash/.\n', '/elm/ash', 'Repeated slashes and dot are ignored; .. removes oak.'], ['/../harbor/../../dock\n', '/dock', 'Parent components cannot move above root, and one removes harbor.'], ['/\n', '/'], ['/a/..\n', '/'], ['/a/b\n', '/a/b'], ['/a/../b/..\n', '/'], ['/.../a\n', '/.../a'], ['/a//b///\n', '/a/b']],
    ['Split the path on slashes.', 'Ignore empty components and single dots.', 'Use a stack for ordinary components.', 'For .. pop only if a component is present.', 'Join the components with slashes and prepend root /.'],
    `path = input()
parts = []
for component in path.split('/'):
    if component in ('', '.'):
        continue
    if component == '..':
        if parts:
            parts.pop()
    else:
        parts.append(component)
print('/' + '/'.join(parts))
`, 'The stack contains the path components remaining after each parent step.', lineStarter
  ),
  'level-84-problem-1': challenge(
    'Next Greater Element to the Right', 'For each integer, find the first strictly greater integer to its right.',
    'One line of space-separated integers; an empty line means an empty list.', 'Print the answers separated by spaces, using NONE where no greater value exists; print an empty line for an empty list.',
    ['At most 1000 integers, each from -1000 to 1000.'],
    [['2 1 4 3\n', '4 4 NONE NONE', '4 is the first greater value for both 2 and 1.'], ['2 2 3\n', '3 3 NONE', 'Equal values do not qualify.'], ['\n', ''], ['1\n', 'NONE'], ['3 2 1\n', 'NONE NONE NONE'], ['1 2 3\n', '2 3 NONE'], ['-2 -1 -2\n', '-1 NONE NONE'], ['4 1 2 5 3\n', '5 2 5 NONE NONE']],
    ['Keep indices whose answer is still unknown.', 'Read values from left to right.', 'A new value resolves pending smaller values at the stack top.', 'Equal values remain unresolved.', 'Indices left on the stack have no answer.'],
    `a = list(map(int, input().split()))
answers = ['NONE'] * len(a)
pending = []
for i, value in enumerate(a):
    while pending and a[pending[-1]] < value:
        answers[pending.pop()] = str(value)
    pending.append(i)
print(*answers)
`, 'A decreasing stack resolves each waiting index at its first greater value.', lineStarter
  ),
  'level-84-problem-2': challenge(
    'Decode Nested Repetition', 'Expand a valid encoded expression. A positive integer followed by [expression] repeats that expression; adjacent pieces concatenate.',
    'One line of lowercase letters, decimal counts and brackets; the expression may be empty.', 'Print the expanded text, possibly empty.',
    ['Counts are 1 to 20 and are written without leading zeros.', 'Nesting depth is at most 20; expanded output has at most 10000 characters.', 'Every count is followed by brackets; all brackets are matched.'],
    [['3[ab2[c]d]e\n', 'abccdabccdabccde', 'The inner group becomes cc; the outer group repeats abccd three times, followed by e.'], ['11[cat]\n', 'catcatcatcatcatcatcatcatcatcatcat', 'The two-digit count repeats cat eleven times.'], ['\n', ''], ['abc\n', 'abc'], ['1[]\n', ''], ['2[a]3[b]\n', 'aabbb'], ['2[xy]z\n', 'xyxyz'], ['2[2[a]b]\n', 'aabaab']],
    ['Build the current decoded section.', 'Accumulate all digits of a count before its opening bracket.', 'At [ save the current prefix and count.', 'At ] repeat the section and append it to the saved prefix.', 'A stack handles nested groups in last-opened order.'],
    `text = input()
stack = []
current = ''
number = 0
for c in text:
    if c.isdigit():
        number = number * 10 + int(c)
    elif c == '[':
        stack.append((current, number))
        current, number = '', 0
    elif c == ']':
        prefix, count = stack.pop()
        current = prefix + current * count
    else:
        current += c
print(current)
`, 'Saved prefixes and counts restore the enclosing context after each nested section.', lineStarter
  ),
  'level-84-problem-3': challenge(
    'Stock Span', 'For each price, count consecutive days ending today whose prices are at most today’s price.',
    'One line of space-separated nonnegative integer prices; an empty line means no days.', 'Print the spans separated by spaces, or an empty line for no days.',
    ['At most 1000 prices, each from 0 to 10000.'],
    [['5 3 4 4 6\n', '1 1 2 3 5', 'The second 4 spans both earlier 3 and 4, and 6 spans all days.'], ['3 2 1\n', '1 1 1', 'Every previous price exceeds today’s.'], ['\n', ''], ['5\n', '1'], ['1 2 3\n', '1 2 3'], ['2 2 2\n', '1 2 3'], ['0 3 0 3\n', '1 2 1 4'], ['5 1 2 1 3\n', '1 1 2 1 4']],
    ['The current day always contributes one.', 'Earlier prices strictly greater than today stop the span.', 'Keep previous prices and their spans on a stack.', 'Pop prices at most today and add their spans.', 'Push today’s price and its completed span.'],
    `prices = list(map(int, input().split()))
stack = []
answer = []
for price in prices:
    span = 1
    while stack and stack[-1][0] <= price:
        span += stack.pop()[1]
    stack.append((price, span))
    answer.append(span)
print(*answer)
`, 'Popped entries represent consecutive earlier days absorbed into today’s span.', lineStarter
  ),
  'level-84-problem-4': challenge(
    'Largest Histogram Rectangle', 'Find the largest rectangular area under adjacent unit-width bars with nonnegative integer heights.',
    'One line of space-separated heights; an empty line means no bars.', 'Print the maximum area, or 0 for no bars.',
    ['At most 1000 bars; each height is between 0 and 10000.'],
    [['4 2 6 5 1 3\n', '10', 'The two adjacent bars 6 and 5 support a rectangle of height 5 and width 2.'], ['3 3 1 4\n', '6', 'The first two bars support height 3 across width 2.'], ['\n', '0'], ['0\n', '0'], ['4\n', '4'], ['1 2 3\n', '4'], ['3 2 1\n', '4'], ['2 0 2\n', '2']],
    ['A rectangle uses consecutive bars.', 'A shorter bar ends rectangles of greater height.', 'Keep starting indices and increasing heights in a stack.', 'When popping, compute height times the width ending before the current bar.', 'Flush remaining bars after the final position.'],
    `heights = list(map(int, input().split()))
stack = []
best = 0
for i, height in enumerate(heights + [0]):
    start = i
    while stack and stack[-1][1] > height:
        start, old = stack.pop()
        best = max(best, old * (i - start))
    stack.append((start, height))
print(best)
`, 'A lower bar closes each taller rectangle at its right boundary.', lineStarter
  ),
  'level-84-problem-5': challenge(
    'Remove K Digits for Minimum', 'Remove exactly k digits from the decimal string without changing the order of the remaining digits, minimizing the resulting nonnegative integer.',
    'First line: a nonempty ASCII digit string. Second line: integer k.', 'Print the minimum number without leading zeros; print 0 if all digits are removed or the remainder consists only of zeros.',
    ['The digit string has at most 1000 digits.', '0 <= k <= its length.', 'The input may contain leading zeros.'],
    [['462531\n2\n', '2531', 'Removing 4 and 6 leaves 2531, the smallest four-digit result.'], ['70032\n1\n', '32', 'Removing 7 leaves 0032, printed as 32.'], ['10\n2\n', '0'], ['000\n0\n', '0'], ['1234\n2\n', '12'], ['4321\n2\n', '21'], ['112\n1\n', '11'], ['10\n0\n', '10']],
    ['A larger earlier digit is costly when followed by a smaller one.', 'Keep chosen digits in a stack.', 'While removals remain, pop larger top digits before adding a smaller digit.', 'If removals remain after the scan, remove digits from the end.', 'Strip leading zeros and replace an empty result with 0.'],
    `digits = input()
k = int(input())
stack = []
for digit in digits:
    while k and stack and stack[-1] > digit:
        stack.pop()
        k -= 1
    stack.append(digit)
if k:
    del stack[-k:]
print(''.join(stack).lstrip('0') or '0')
`, 'Removing a larger preceding digit improves the earliest position; leftover removals come from the end.', twoLinesStarter
  ),
  'level-85-problem-1': challenge(
    'Queue Command Processor', 'Start with an empty queue. Process enqueue x, dequeue and front; dequeue removes and reports the oldest entry, while front reports it without removing it.',
    'First line n; then n command lines. x is an integer.', 'For each dequeue or front print its value, or EMPTY if the queue is empty, on its own line. Enqueue prints nothing.',
    ['0 <= n <= 100.', '-1000 <= x <= 1000.'],
    [['5\nenqueue 4\nenqueue 7\nfront\ndequeue\ndequeue\n', '4\n4\n7', 'Front leaves 4 in place; dequeues remove 4 then 7.'], ['3\ndequeue\nenqueue -1\nfront\n', 'EMPTY\n-1', 'The first dequeue finds an empty queue.'], ['0\n', ''], ['1\nfront\n', 'EMPTY'], ['1\nenqueue 0\n', ''], ['4\nenqueue 1\ndequeue\ndequeue\nfront\n', '1\nEMPTY\nEMPTY'], ['4\nenqueue 2\nenqueue 2\ndequeue\nfront\n', '2\n2'], ['3\nenqueue -5\nfront\nfront\n', '-5\n-5']],
    ['Use a deque to represent the queue.', 'Enqueue appends at the back.', 'Dequeue removes from the front.', 'Check whether the queue is empty before reading or removing.', 'Front reads without removing.'],
    `from collections import deque
n = int(input())
queue = deque()
for _ in range(n):
    parts = input().split()
    if parts[0] == 'enqueue':
        queue.append(int(parts[1]))
    elif not queue:
        print('EMPTY')
    elif parts[0] == 'dequeue':
        print(queue.popleft())
    else:
        print(queue[0])
`, 'The oldest item is at the front; empty queries are reported explicitly.', commandsStarter
  ),
  'level-85-problem-2': challenge(
    'Round Robin Completion Times', 'All jobs arrive at time zero in input order. Repeatedly take the front job, run it for one time unit, and put it at the back if it still needs work. Find each job’s completion time.',
    'One line of space-separated positive integer work amounts; an empty line means no jobs.', 'Print completion times in the original job order, separated by spaces; print an empty line for no jobs.',
    ['At most 100 jobs; each work amount is between 1 and 100.'],
    [['2 1 3\n', '4 2 6', 'Jobs run in order 1, 2, 3, 1, 3, 3; they finish at times 4, 2 and 6.'], ['1 1 1\n', '1 2 3', 'Every job finishes on its first turn.'], ['\n', ''], ['4\n', '4'], ['2 2\n', '3 4'], ['1 3 1\n', '1 5 3'], ['3 1\n', '4 2'], ['2 3 2\n', '4 7 6']],
    ['Store each job’s original index and remaining work.', 'All jobs start in a FIFO queue in input order.', 'Each turn consumes one unit of time and one unit of work.', 'Record the current time when a job reaches zero.', 'Otherwise append that job to the back of the queue.'],
    `from collections import deque
work = list(map(int, input().split()))
queue = deque(enumerate(work))
times = [0] * len(work)
clock = 0
while queue:
    i, remaining = queue.popleft()
    clock += 1
    remaining -= 1
    if remaining:
        queue.append((i, remaining))
    else:
        times[i] = clock
print(*times)
`, 'FIFO rotation gives each unfinished job one unit per turn; record its final turn.', lineStarter
  ),
  'level-85-problem-3': challenge(
    'Reverse First K Queue Items', 'Reverse the first k queue items and leave the remaining items in their original order.',
    'First line: space-separated integers in front-to-back order, possibly empty. Second line: k.', 'Print the resulting queue front to back, separated by spaces; print an empty line if empty.',
    ['At most 100 integers, each from -1000 to 1000.', '0 <= k <= the number of items.'],
    [['8 -2 6 3 9\n3\n', '6 -2 8 3 9', 'The prefix 8, -2, 6 reverses while 3, 9 stay in order.'], ['4 5\n0\n', '4 5', 'A zero-length prefix changes nothing.'], ['\n0\n', ''], ['8\n1\n', '8'], ['1 2 3\n3\n', '3 2 1'], ['1 2 3\n1\n', '1 2 3'], ['-1 0 -1 2\n2\n', '0 -1 -1 2'], ['5 4 3 2\n2\n', '4 5 3 2']],
    ['Remove the first k entries into a stack.', 'Pop them into the back of the queue.', 'The original suffix is now in front of the reversed prefix.', 'Rotate the suffix from front to back.', 'When k is zero or the whole length, the same method works.'],
    `from collections import deque
queue = deque(map(int, input().split()))
k = int(input())
suffix = len(queue) - k
stack = [queue.popleft() for _ in range(k)]
while stack:
    queue.append(stack.pop())
for _ in range(suffix):
    queue.append(queue.popleft())
print(*queue)
`, 'Reverse the removed prefix with a stack, then rotate the untouched suffix behind it.', twoLinesStarter
  ),
  'level-85-problem-4': challenge(
    'Circular Elimination Survivor', 'People numbered 1 through n stand in a circle. Starting at 1, remove every kth remaining person, continuing from the next person until one survives.',
    'One line: n and k.', 'Print the survivor’s number.',
    ['1 <= n <= 100.', '1 <= k <= 1000.'],
    [['6 3\n', '1', 'The removals are 3, 6, 4, 2, 5, leaving 1.'], ['4 1\n', '4', 'Removing each current person in order leaves 4.'], ['1 9\n', '1'], ['2 2\n', '1'], ['3 2\n', '3'], ['5 3\n', '4'], ['6 4\n', '5'], ['7 1\n', '7']],
    ['Put the people in a queue in circle order.', 'The front is the next person to count.', 'Move the first k - 1 people to the back.', 'Remove the next person and resume counting at the front.', 'Repeat until exactly one person remains.'],
    `from collections import deque
n, k = map(int, input().split())
people = deque(range(1, n + 1))
while len(people) > 1:
    people.rotate(-((k - 1) % len(people)))
    people.popleft()
print(people[0])
`, 'Rotating brings the kth person to the front for removal.', lineStarter
  ),
  'level-85-problem-5': challenge(
    'First Unique Character in a Stream', 'After each character arrives, find the earliest character that has appeared exactly once so far.',
    'One line of lowercase ASCII letters, possibly empty.', 'Print one answer per arrival, separated by spaces; use # when no unique character exists. For an empty stream print an empty line.',
    ['The stream has at most 1000 characters.'],
    [['momox\n', 'm m o # x', 'The second m leaves o first; the second o leaves none until x arrives.'], ['kiteki\n', 'k k k k i t', 'After k repeats, i is first unique; after i repeats, t is first.'], ['\n', ''], ['z\n', 'z'], ['aaaa\n', 'a # # #'], ['abc\n', 'a a a'], ['abbac\n', 'a a a # c'], ['abcbad\n', 'a a a a c c']],
    ['Count how often each character has appeared.', 'Queue each newly seen character in arrival order.', 'A candidate whose count exceeds one can never be unique again.', 'Discard nonunique candidates from the queue front.', 'After each arrival, report the front or # if none remains.'],
    `from collections import Counter, deque
text = input()
counts = Counter()
queue = deque()
answer = []
for c in text:
    counts[c] += 1
    if counts[c] == 1:
        queue.append(c)
    while queue and counts[queue[0]] > 1:
        queue.popleft()
    answer.append(queue[0] if queue else '#')
print(*answer)
`, 'The queue keeps candidates in arrival order while counts invalidate duplicates.', lineStarter
  )
};
