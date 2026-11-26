import { challenge } from './beginner.js';

const mapInput = 'First line: n. Next n lines: a key and an integer value, separated by a space.';
const mapOutput = 'Print the number of entries, then one key and value per line in alphabetical key order. Print only 0 for an empty mapping.';
const listInput = 'One line of space-separated integers; an empty line represents an empty list.';
const listOutput = 'Print space-separated integers on one line in the requested order; print an empty line for an empty result.';
const common = ['Each collection has at most 50 records or items; n is between 0 and 50.', 'Keys and words are nonempty lowercase ASCII letters, at most 10 characters long.', 'Input integers have absolute value at most 1000 unless otherwise stated.'];
const mapStarter = "n = int(input())\nentries = [input().split() for _ in range(n)]\n\n# Compute and print the answer.\n";
const listStarter = "items = list(map(int, input().split()))\n\n# Compute and print the answer.\n";
const twoListsStarter = "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\n\n# Compute and print the answer.\n";
const make = (title, description, input, output, constraints, cases, hints, solution, explanation, starter = mapStarter) =>
  challenge(title, description, input, output, [...common, ...constraints], cases, hints, solution, explanation, starter);

export const collections5155Challenges = {
  'level-51-problem-1': make(
    'Dictionary Lookup with Default', 'Look up a key and print its integer value, or the supplied default if it is absent.',
    `${mapInput} Last line: the query key and integer default.`, 'Print one integer.', ['Record keys are unique.'],
    [['2\na 4\nb 0\na 9\n','4','Key a stores 4, so the default is ignored.'],['1\ncat -2\ndog 7\n','7','dog is absent, so the default 7 is used.'],['0\nx -1\n','-1'],['1\na 0\na 8\n','0'],['1\na -5\na 0\n','-5'],['2\nz 2\na 3\nz -9\n','2'],['2\na 1\nb 2\nc 0\n','0'],['1\nabc 1000\nabc -1000\n','1000']],
    ['Store each key with its integer value.', 'Read the query after all records.', 'A key with value 0 is still present.', 'Use dict.get(key, default) for the lookup.', 'Print the returned integer without a label.'],
    `n = int(input())
data = {}
for _ in range(n):
    key, value = input().split()
    data[key] = int(value)
key, default = input().split()
print(data.get(key, int(default)))
`, 'Build the dictionary and retrieve the key with the supplied fallback.'
  ),
  'level-51-problem-2': make(
    'Update Dictionary Entries', 'Apply the assignments in order; a later assignment replaces the earlier value for that key.',
    mapInput, mapOutput, ['Keys may repeat.'],
    [['3\nb 1\na 2\nb 5\n','2\na 2\nb 5','b is updated from 1 to 5; keys are sorted.'],['2\nx -1\nx 0\n','1\nx 0','The last assignment to x wins.'],['0\n','0'],['1\nz 8\n','1\nz 8'],['3\nc 1\nb 2\na 3\n','3\na 3\nb 2\nc 1'],['3\na 1\na 1\na -1\n','1\na -1'],['2\nz 0\naa -3\n','2\naa -3\nz 0'],['4\na 1\nb 2\na 3\nb 4\n','2\na 3\nb 4']],
    ['Start with an empty dictionary.', 'Read assignments in their input order.', 'Assign each parsed integer to its key.', 'Assignment to an existing key replaces its value.', 'Sort the final keys before printing the count and entries.'],
    `n = int(input())
data = {}
for _ in range(n):
    key, value = input().split()
    data[key] = int(value)
print(len(data))
for key in sorted(data):
    print(key, data[key])
`, 'Dictionary assignment naturally replaces earlier values for the same key.'
  ),
  'level-51-problem-3': make(
    'Remove a Dictionary Key', 'Remove the requested key if it exists and print the remaining mapping.',
    `${mapInput} Last line: the key to remove.`, mapOutput, ['Record keys are unique.'],
    [['2\nb 3\na 1\nb\n','1\na 1','Removing b leaves only a.'],['1\nx 0\ny\n','1\nx 0','y is absent, so x remains.'],['0\nx\n','0'],['1\na 2\na\n','0'],['2\nb 1\na 2\na\n','1\nb 1'],['3\nc -1\na 0\nb 4\nz\n','3\na 0\nb 4\nc -1'],['2\na 1\naa 2\na\n','1\naa 2'],['2\nx -1\ny -1\nx\n','1\ny -1']],
    ['Read the records into a dictionary.', 'Read the removal key after the records.', 'A missing key must not cause an error.', 'Use pop(key, None) or check membership first.', 'Print the remaining count and sorted entries.'],
    `n = int(input())
data = {}
for _ in range(n):
    key, value = input().split()
    data[key] = int(value)
data.pop(input(), None)
print(len(data))
for key in sorted(data):
    print(key, data[key])
`, 'Remove the key safely, then print the remaining entries in key order.'
  ),
  'level-51-problem-4': make(
    'Swap Dictionary Values', 'Swap the values stored at two requested keys. If either key is missing, leave the entire mapping unchanged.',
    `${mapInput} Last line: two keys to swap.`, mapOutput, ['Record keys are unique; the requested keys may be equal.'],
    [['2\na 1\nb 4\na b\n','2\na 4\nb 1','Both keys exist, so their values exchange places.'],['1\na -3\na z\n','1\na -3','z is missing, so nothing changes.'],['0\na b\n','0'],['1\na 0\na a\n','1\na 0'],['2\nb -2\na 0\nb a\n','2\na -2\nb 0'],['2\na 1\nb 2\nx y\n','2\na 1\nb 2'],['3\nc 1\na 1\nb -1\na c\n','3\na 1\nb -1\nc 1'],['2\na 1000\nz -1000\nz a\n','2\na -1000\nz 1000']],
    ['Build the mapping before reading the requested keys.', 'Check that both keys belong to the dictionary.', 'If either is missing, do not change either entry.', 'Otherwise exchange the two stored values simultaneously.', 'Print the count and entries in alphabetical key order.'],
    `n = int(input())
data = {}
for _ in range(n):
    key, value = input().split()
    data[key] = int(value)
a, b = input().split()
if a in data and b in data:
    data[a], data[b] = data[b], data[a]
print(len(data))
for key in sorted(data):
    print(key, data[key])
`, 'Check membership for both keys before exchanging their stored values.'
  ),
  'level-51-problem-5': make(
    'Distinguish Missing and Null Values', 'For each query, print ABSENT if its key is missing, NULL if its value is null, otherwise VALUE.',
    'First line: n. Next n lines: key and value, where value is an integer or the literal null. Next line: q. Next q lines: one query key each.',
    'Print one classification per query, in query order; print nothing when q is zero.', ['Keys are unique.', '0 <= n, q <= 50.'],
    [['2\na null\nb 0\n3\na\nb\nc\n','NULL\nVALUE\nABSENT','a is null, b stores zero, and c is missing.'],['1\nx -1\n2\nx\nx\n','VALUE\nVALUE','Repeated queries both see the stored integer.'],['0\n1\na\n','ABSENT'],['1\na null\n1\nb\n','ABSENT'],['1\na null\n1\na\n','NULL'],['1\na 0\n1\na\n','VALUE'],['2\na 1\nb null\n0\n',''],['3\nx null\ny -2\nz null\n3\nz\ny\nx\n','NULL\nVALUE\nNULL']],
    ['Read null as a special value such as None.', 'Store integer values separately from the null marker.', 'For each query check membership first.', 'Only a present key can be classified as NULL.', 'Print VALUE for any integer, including zero.'],
    `n = int(input())
data = {}
for _ in range(n):
    key, value = input().split()
    data[key] = None if value == 'null' else int(value)
q = int(input())
for _ in range(q):
    key = input()
    if key not in data:
        print('ABSENT')
    elif data[key] is None:
        print('NULL')
    else:
        print('VALUE')
`, 'Test membership before inspecting the value, so missing and null remain distinct.'
  ),
  'level-52-problem-1': make(
    'Index Word Positions', 'List each distinct word with its zero-based positions in the input line.',
    'One line of space-separated words; an empty line contains no words.',
    'Print the number of distinct words, then one line per word in alphabetical order: word followed by its positions separated by spaces.', [],
    [['red blue red\n','2\nblue 1\nred 0 2','red occurs at positions 0 and 2, and blue at 1.'],['a a a\n','1\na 0 1 2','All three positions belong to a.'],['\n','0'],['z\n','1\nz 0'],['b a\n','2\na 1\nb 0'],['a b a b\n','2\na 0 2\nb 1 3'],['aa a aa\n','2\na 1\naa 0 2'],['c b a c\n','3\na 2\nb 1\nc 0 3']],
    ['Split the line into words.', 'Use enumerate to obtain zero-based positions.', 'Give each distinct word a list of positions.', 'Append each position as it is encountered.', 'Sort the words, not the positions, for output.'],
    `words = input().split()
positions = {}
for i, word in enumerate(words):
    positions.setdefault(word, []).append(i)
print(len(positions))
for word in sorted(positions):
    print(word, *positions[word])
`, 'Append each index to its word’s list, then output words in alphabetical order.',
    "words = input().split()\n\n# Compute and print the answer.\n"
  ),
  'level-52-problem-2': make(
    'Nearby Duplicate Within K', 'Decide whether two equal list values have distinct indices at distance at most k.',
    `${listInput} Second line: nonnegative integer k.`, 'Print YES or NO.', ['0 <= k <= 50.'],
    [['1 2 1\n2\n','YES','The two 1s are at indices 0 and 2, distance 2.'],['1 2 1\n1\n','NO','The equal values are farther apart than 1.'],['\n3\n','NO'],['5\n0\n','NO'],['1 1\n0\n','NO'],['1 1\n1\n','YES'],['1 2 3 1\n9\n','YES'],['-1 0 -1 0\n1\n','NO']],
    ['Two indices must be different.', 'Remember values from at most the preceding k positions.', 'Before checking a new value, evict values farther than k away.', 'A value already in the window proves a match.', 'With k = 0 the window is always empty.'],
    `items = list(map(int, input().split()))
k = int(input())
window = set()
found = False
for i, value in enumerate(items):
    if i > k:
        window.remove(items[i - k - 1])
    if value in window:
        found = True
        break
    window.add(value)
print('YES' if found else 'NO')
`, 'Maintain the last k values and detect a repeated value before inserting it.',
    "items = list(map(int, input().split()))\nk = int(input())\n\n# Compute and print the answer.\n"
  ),
  'level-52-problem-3': make(
    'Count Distinct Values', 'Count how many different integers occur in the list.',
    listInput, 'Print one integer.', [],
    [['2 1 2 3\n','3','The distinct values are 1, 2, and 3.'],['7 7 7\n','1','Every entry has the same value.'],['\n','0'],['0\n','1'],['-1 0 -1\n','2'],['1 2 3 4\n','4'],['-1000 1000 -1000\n','2'],['0 0 -1 -1 1\n','3']],
    ['Repeated occurrences count only once.', 'Convert the input tokens to integers.', 'A set keeps each different value once.', 'Find the size of the set.', 'The empty list has zero distinct values.'],
    `items = list(map(int, input().split()))
print(len(set(items)))
`, 'A set contains exactly the distinct input values.', listStarter
  ),
  'level-52-problem-4': make(
    'Equalize Frequencies by Deleting', 'Find the fewest list elements to delete so that every value remaining occurs the same number of times. Deleting all copies of a value is allowed; an empty list needs no deletions.',
    listInput, 'Print the minimum number of deletions.', [],
    [['1 1 1 2 2 3\n','2','Keep two copies each of 1 and 2, deleting one 1 and the only 3.'],['4 4 4 4 7\n','1','Delete 7 entirely and keep all four copies of 4.'],['\n','0'],['9\n','0'],['1 2 3\n','0'],['1 1 2 2 3 3\n','0'],['1 1 1 2 2 2 3 3 3 4 4\n','2'],['-1 -1 -1 0 0\n','1']],
    ['Count how often each distinct value occurs.', 'Choose a positive target frequency for every value kept.', 'A count smaller than the target must be deleted completely.', 'A larger count can be reduced to the target by deleting its excess.', 'Try each target from 1 through the largest count and choose the least cost; handle an empty list separately.'],
    `items = list(map(int, input().split()))
counts = {}
for value in items:
    counts[value] = counts.get(value, 0) + 1
best = len(items)
for target in range(1, max(counts.values(), default=0) + 1):
    cost = sum(count if count < target else count - target for count in counts.values())
    best = min(best, cost)
print(best)
`, 'Try each possible positive remaining frequency, either dropping each value or trimming it to that frequency.', listStarter
  ),
  'level-52-problem-5': make(
    'Mode of an Integer List', 'Find the most frequent integer; if several tie, choose the smallest integer.',
    listInput, 'Print the chosen integer.', ['The list is nonempty.'],
    [['4 2 4 2 3\n','2','2 and 4 both occur twice, and 2 is smaller.'],['-1 -1 2\n','-1','-1 occurs twice, more often than 2.'],['0\n','0'],['3 2 1\n','1'],['5 5 5\n','5'],['-2 -1 -1 -2\n','-2'],['0 1 0 1 1\n','1'],['1000 -1000\n','-1000']],
    ['Count how often each integer occurs.', 'The greatest frequency identifies the mode candidates.', 'Several values can share that frequency.', 'Among tied candidates choose the smallest value.', 'The nonempty input always has a mode.'],
    `items = list(map(int, input().split()))
counts = {}
for value in items:
    counts[value] = counts.get(value, 0) + 1
print(min(counts, key=lambda value: (-counts[value], value)))
`, 'Choose by descending frequency and then ascending value.', listStarter
  ),
  'level-53-problem-1': make(
    'Set Union of Two Collections', 'Print every distinct integer present in either list, in increasing order.',
    `Two lines, each a list. ${listInput}`, listOutput, [],
    [['3 1 3\n2 3\n','1 2 3','The union contains 1, 2, and 3 once each.'],['\n4 4\n','4','Only 4 appears in either list.'],['\n\n',''],['1\n1\n','1'],['-2 0\n-1 0\n','-2 -1 0'],['3 2 1\n\n','1 2 3'],['-1000\n1000\n','-1000 1000'],['0 0\n0 0\n','0']],
    ['Convert each list to a set.', 'A union contains values from either set.', 'Repeated values appear only once.', 'Sort the resulting integers numerically.', 'Print nothing on the line if both lists are empty.'],
    `a = set(map(int, input().split()))
b = set(map(int, input().split()))
print(*sorted(a | b))
`, 'Union the sets, then sort their unique values.', twoListsStarter
  ),
  'level-53-problem-2': make(
    'First Complete Collection Prefix', 'Find the smallest prefix length of the second list containing every distinct value from the first list. Extra values and repetitions are allowed.',
    `Two lines: required values, then the stream. ${listInput}`,
    'Print the prefix length, 0 if no values are required, or -1 if the whole stream is insufficient.', [],
    [['2 1 2\n9 2 2 1 8\n','4','The first four stream values include both required values 1 and 2.'],['3 4\n3 9\n','-1','4 never appears, so the collection cannot be completed.'],['\n1 2\n','0'],['\n\n','0'],['1\n\n','-1'],['5\n5 5\n','1'],['-1 0\n0 -1\n','2'],['1 2 3\n3 2 1\n','3'],['2 2 1\n2 1\n','2']],
    ['Treat the first list as the set of values still required.', 'Repeated required values do not need extra copies.', 'The empty requirement is complete before reading any stream values.', 'Scan the stream in order and discard each seen value from the missing set.', 'Stop at the first empty missing set; otherwise report -1.'],
    `required = set(map(int, input().split()))
stream = list(map(int, input().split()))
answer = 0 if not required else -1
for i, value in enumerate(stream):
    if answer == 0:
        break
    required.discard(value)
    if not required:
        answer = i + 1
        break
print(answer)
`, 'Remove requirements as they appear and stop at the first complete prefix.', twoListsStarter
  ),
  'level-53-problem-3': make(
    'Count Distinct Midpoints', 'On a number line, consider every pair of different input coordinates and count their distinct midpoints. Repeated coordinates represent the same point and cannot form a pair with themselves.',
    listInput, 'Print the number of distinct midpoints.', [],
    [['0 2 4\n','3','The pairs have midpoints 1, 2, and 3.'],['0 1 2 3\n','5','The six pairs yield only five midpoints because 0 and 3 share a midpoint with 1 and 2.'],['\n','0'],['5\n','0'],['2 2 2\n','0'],['-1 0 1\n','3'],['0 1\n','1'],['-1000 1000 0 0\n','3']],
    ['Deduplicate the positions first.', 'Choose each pair of different positions once.', 'Twice a midpoint is the sum of its endpoints.', 'Put these integer sums in a set to avoid floating-point rounding.', 'The size of the set is the number of distinct midpoints.'],
    `points = sorted(set(map(int, input().split())))
twice_midpoints = set()
for i in range(len(points)):
    for j in range(i + 1, len(points)):
        twice_midpoints.add(points[i] + points[j])
print(len(twice_midpoints))
`, 'Each distinct endpoint sum represents one distinct midpoint.', listStarter
  ),
  'level-53-problem-4': make(
    'Values Seen in Enough Groups', 'Print the distinct integers that appear in at least k different groups. Repetitions within one group count only once.',
    'First line: n and k. The next n lines each contain a group of space-separated integers; an empty line is an empty group.',
    'Print the selected integers in numeric ascending order, separated by spaces on one line; print an empty line if none qualify.', ['1 <= n <= 50 and 1 <= k <= n.'],
    [['3 2\n1 1 2\n2 3\n1 2\n','1 2','1 appears in two groups and 2 in three; 3 appears in only one.'],['2 2\n5 5\n\n','','Repeating 5 in one group does not make it appear in both groups.'],['1 1\n\n',''],['1 1\n3 3 -1\n','-1 3'],['3 3\n1 2\n1\n1 2\n','1'],['3 1\n2\n-1\n2 -1\n','-1 2'],['2 2\n-1000 1000\n1000 -1000\n','-1000 1000'],['3 2\n0 0\n0\n1 1\n','0']],
    ['Read each group as a set to remove repeated entries within it.', 'Keep a dictionary counting how many groups contain each integer.', 'Increase a value’s count once for each group containing it.', 'Select values whose group count is at least k.', 'Sort the selected integers before printing.'],
    `n, k = map(int, input().split())
counts = {}
for _ in range(n):
    group = set(map(int, input().split()))
    for value in group:
        counts[value] = counts.get(value, 0) + 1
print(*sorted(value for value, count in counts.items() if count >= k))
`, 'Deduplicate each group, count group memberships, and retain counts at least k.',
    "n, k = map(int, input().split())\ngroups = [list(map(int, input().split())) for _ in range(n)]\n\n# Compute and print the answer.\n"
  ),
  'level-53-problem-5': make(
    'Prefix and Cycle of a Modular Sequence', 'Starting with x, repeatedly replace the current value by (a times current value plus b) modulo m. Report how many values occur before the repeating cycle starts, and the number of values in that cycle.',
    'One line: x a b m, four integers.', 'Print the prefix length and cycle length separated by one space.',
    ['1 <= m <= 50, 0 <= x < m, and 0 <= a, b <= 1000.'],
    [['0 2 1 5\n','0 4','The sequence 0, 1, 3, 2, 0 repeats from the start, with a cycle of length 4.'],['1 2 0 8\n','3 1','The sequence 1, 2, 4, 0, 0 has three values before the length-one cycle at 0.'],['0 0 0 1\n','0 1'],['2 1 0 5\n','0 1'],['0 1 1 3\n','0 3'],['3 0 2 5\n','1 1'],['0 2 0 7\n','0 1'],['0 2 1 6\n','1 2']],
    ['Keep a set of values already seen and a list recording their order.', 'Begin with x at step 0.', 'Continue applying the modular update until a value is already in the set.', 'The index of that repeated value in the list is the prefix length.', 'Subtract that index from the list length to obtain the cycle length.'],
    `x, a, b, m = map(int, input().split())
seen = set()
order = []
while x not in seen:
    seen.add(x)
    order.append(x)
    x = (a * x + b) % m
start = order.index(x)
print(start, len(order) - start)
`, 'Track seen values and their order; the repeated value identifies the cycle start and length.',
    "x, a, b, m = map(int, input().split())\n\n# Compute and print the answer.\n"
  ),
  'level-54-problem-1': make(
    'Rotate a Set of Points About a Pivot', 'Rotate every distinct point 90 degrees counterclockwise about the supplied pivot.',
    'First line: n. Next n lines: x y coordinates of a point. Last line: px py coordinates of the pivot.',
    'Print the number of distinct rotated points, then one x y pair per line sorted by x and then y.', ['Points may repeat.'],
    [['3\n2 1\n1 2\n2 1\n1 1\n','2\n0 1\n1 2','The two distinct points rotate to (1, 2) and (0, 1).'],['1\n0 0\n2 1\n','1\n3 -1','The offset (-2, -1) rotates to (1, -2), then is added to the pivot.'],['0\n0 0\n','0'],['1\n1 2\n0 0\n','1\n-2 1'],['1\n-2 -3\n0 0\n','1\n3 -2'],['1\n4 5\n4 5\n','1\n4 5'],['2\n0 2\n0 0\n0 1\n','2\n-1 1\n1 1'],['1\n1000 -1000\n-1000 1000\n','1\n1000 3000']],
    ['Store input points as coordinate tuples in a set.', 'Find each point’s offset from the pivot.', 'A counterclockwise quarter-turn maps (dx, dy) to (-dy, dx).', 'Add the pivot coordinates back to each rotated offset.', 'Sort the rotated tuples by x then y and print them.'],
    `n = int(input())
points = set()
for _ in range(n):
    points.add(tuple(map(int, input().split())))
px, py = map(int, input().split())
rotated = set()
for x, y in points:
    dx, dy = x - px, y - py
    rotated.add((px - dy, py + dx))
print(len(rotated))
for x, y in sorted(rotated):
    print(x, y)
`, 'Rotate the offset of every distinct point and sort the resulting coordinate tuples.'
  ),
  'level-54-problem-2': make(
    'Sort Records by Two Fields', 'Sort name-score records by decreasing score, breaking score ties by increasing name.',
    'First line: n. Next n lines: a name and integer score.', 'Print n lines of name and score in sorted order; print nothing when n is zero.',
    ['Names follow the key rules and are unique.'],
    [['3\namy 4\nbob 7\nzoe 4\n','bob 7\namy 4\nzoe 4','bob has the highest score; amy precedes zoe on the tie.'],['2\nz -1\na -1\n','a -1\nz -1','Equal scores are ordered by name.'],['0\n',''],['1\na 0\n','a 0'],['2\na -2\nb -1\n','b -1\na -2'],['3\nc 3\nb 2\na 1\n','c 3\nb 2\na 1'],['3\nz 0\na 1\nb 1\n','a 1\nb 1\nz 0'],['2\na 1000\nb -1000\n','a 1000\nb -1000']],
    ['Read each name and convert its score to an integer.', 'Sort the records rather than just the scores.', 'A negative score in the sort key makes larger scores come first.', 'Use the name as the second sort key.', 'Print every record in the resulting order.'],
    `n = int(input())
records = []
for _ in range(n):
    name, score = input().split()
    records.append((name, int(score)))
for name, score in sorted(records, key=lambda record: (-record[1], record[0])):
    print(name, score)
`, 'A tuple key of negative score and name gives the required ordering.'
  ),
  'level-54-problem-3': make(
    'Group Values by Key', 'Group integer values under their keys, preserving input order within each group.',
    'First line: n. Next n lines: a key and an integer value; keys may repeat.',
    'Print the number of keys, then one line per key in alphabetical order: key followed by its values separated by spaces.', [],
    [['4\nb 1\na 2\nb 3\na 4\n','2\na 2 4\nb 1 3','Each key retains its values in input order.'],['2\nx 0\nx 0\n','1\nx 0 0','Repeated values are retained.'],['0\n','0'],['1\nz -1\n','1\nz -1'],['2\nb 1\na 1\n','2\na 1\nb 1'],['3\na 3\na 2\na 1\n','1\na 3 2 1'],['3\nc -1\nb 0\nc -1\n','2\nb 0\nc -1 -1'],['2\naa 1000\na -1000\n','2\na -1000\naa 1000']],
    ['Use a dictionary mapping each key to a list.', 'Create an empty list when a key first appears.', 'Append each integer value to its key’s list.', 'Do not sort the values inside a group.', 'Sort the keys when printing.'],
    `n = int(input())
groups = {}
for _ in range(n):
    key, value = input().split()
    groups.setdefault(key, []).append(int(value))
print(len(groups))
for key in sorted(groups):
    print(key, *groups[key])
`, 'Append each value to its key’s list, and print groups in key order.'
  ),
  'level-54-problem-4': make(
    'Count Isolated Points', 'Count distinct points with no other input point immediately above, below, left, or right. Diagonal points are not neighbors.',
    'First line: n. Next n lines: x y coordinates of a point.', 'Print the number of isolated distinct points.', ['Points may repeat.'],
    [['4\n0 0\n1 0\n4 4\n4 4\n','1','The first two points touch; the distinct point (4, 4) is isolated.'],['2\n0 0\n1 1\n','2','Diagonal points are not orthogonal neighbors.'],['0\n','0'],['1\n0 0\n','1'],['2\n-1 0\n0 0\n','0'],['3\n0 0\n0 1\n0 2\n','0'],['3\n1 1\n1 1\n1 1\n','1'],['3\n-1000 1000\n1000 -1000\n0 0\n','3']],
    ['Store points as coordinate tuples in a set.', 'Repeated coordinates represent only one point.', 'For each point consider offsets (1, 0), (-1, 0), (0, 1), and (0, -1).', 'Check whether any resulting tuple is in the set.', 'Count a point only when all four neighbors are absent.'],
    `n = int(input())
points = set()
for _ in range(n):
    points.add(tuple(map(int, input().split())))
count = 0
for x, y in points:
    if all((x + dx, y + dy) not in points for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]):
        count += 1
print(count)
`, 'Deduplicate coordinate tuples and count points without an orthogonal neighbor.'
  ),
  'level-54-problem-5': make(
    'Matching Mapping Entries', 'Find keys present in both mappings whose associated integer values are equal.',
    'First line: n. Next n lines: key and integer value. Next line: m. Next m lines: key and integer value.',
    'Print matching keys in alphabetical order, separated by spaces; print an empty line if none match.', ['Keys are unique within each mapping.', '0 <= n, m <= 50.'],
    [['2\na 1\nb 2\n2\na 1\nb 3\n','a','a has the same value in both maps, but b does not.'],['1\nx 0\n1\ny 0\n','','Equal values under different keys are not matches.'],['0\n0\n',''],['1\na -1\n1\na -1\n','a'],['1\na 0\n1\na 1\n',''],['2\nb 2\na 1\n2\nb 2\na 1\n','a b'],['2\na 0\nb 3\n1\nb 3\n','b'],['1\nz -1000\n2\nz -1000\na 2\n','z']],
    ['Build a dictionary for each mapping.', 'A matching key must exist in both dictionaries.', 'Compare the two values only for shared keys.', 'Do not match equal values under different keys.', 'Sort the selected keys before printing.'],
    `n = int(input())
first = {}
for _ in range(n):
    key, value = input().split()
    first[key] = int(value)
m = int(input())
second = {}
for _ in range(m):
    key, value = input().split()
    second[key] = int(value)
print(*(key for key in sorted(first) if key in second and first[key] == second[key]))
`, 'Select common keys only when the two stored values agree.'
  ),
  'level-55-problem-1': make(
    'Merge Numeric Dictionaries', 'Combine two mappings by adding values at shared keys and keeping values at unshared keys.',
    'First line: n. Next n lines: key and integer value. Next line: m. Next m lines: key and integer value.',
    mapOutput, ['Keys are unique within each mapping.', '0 <= n, m <= 50.'],
    [['2\na 3\nb 2\n2\na -1\nc 4\n','3\na 2\nb 2\nc 4','The shared a values sum to 2; b and c remain.'],['1\nx 2\n1\nx -2\n','1\nx 0','A zero sum still keeps key x.'],['0\n0\n','0'],['0\n1\na 1\n','1\na 1'],['1\nz -1\n0\n','1\nz -1'],['1\na 0\n1\nb 0\n','2\na 0\nb 0'],['2\nb 4\na -3\n1\nb -5\n','2\na -3\nb -1'],['1\nx 1000\n1\nx 1000\n','1\nx 2000']],
    ['Start with the first mapping.', 'Read each entry of the second mapping.', 'For a shared key add the new value to the stored value.', 'For a missing key use zero as the starting value.', 'Keep even keys whose resulting sum is zero.'],
    `n = int(input())
result = {}
for _ in range(n):
    key, value = input().split()
    result[key] = int(value)
m = int(input())
for _ in range(m):
    key, value = input().split()
    result[key] = result.get(key, 0) + int(value)
print(len(result))
for key in sorted(result):
    print(key, result[key])
`, 'Accumulate the second map into the first, using zero for absent keys.'
  ),
  'level-55-problem-2': make(
    'Dictionary Key with Maximum Value', 'Find the key with the greatest integer value; break ties by choosing the alphabetically smallest key.',
    mapInput, 'Print the chosen key.', ['1 <= n <= 50; record keys are unique.'],
    [['3\nb 8\na 8\nc 1\n','a','a and b tie at 8, and a is alphabetically first.'],['2\nx -5\ny -2\n','y','-2 is greater than -5.'],['1\nz 0\n','z'],['2\nz 1\na 2\n','a'],['2\na 0\nb 0\n','a'],['3\nc -1\nb -2\na -1\n','a'],['2\na 1000\nz -1000\n','a'],['2\naa 4\na 4\n','a']],
    ['Each key has one integer value.', 'Find the greatest stored value.', 'More than one key may share that value.', 'Among tied keys use alphabetical order.', 'The mapping is nonempty, so a key always exists.'],
    `n = int(input())
data = {}
for _ in range(n):
    key, value = input().split()
    data[key] = int(value)
print(min(data, key=lambda key: (-data[key], key)))
`, 'Sort conceptually by descending value and then ascending key.'
  ),
  'level-55-problem-3': make(
    'Filter a Mapping by Value', 'Keep only entries whose integer value is at least the supplied threshold.',
    `${mapInput} Last line: the integer threshold.`, mapOutput, ['Record keys are unique.'],
    [['3\nb 2\na 3\nc -1\n2\n','2\na 3\nb 2','Both 3 and the boundary value 2 meet the threshold.'],['1\nx -3\n0\n','0','-3 is below zero, so the result is empty.'],['0\n0\n','0'],['1\na 0\n0\n','1\na 0'],['2\nb -1\na -2\n-2\n','2\na -2\nb -1'],['2\na 1\nb 2\n3\n','0'],['3\nc 5\nb 5\na 4\n5\n','2\nb 5\nc 5'],['1\nz 1000\n-1000\n','1\nz 1000']],
    ['Read all entries and the threshold.', 'Compare each stored value with the threshold.', 'Use >= because the threshold itself is included.', 'Build a mapping of the qualifying entries.', 'Print its count and sorted entries.'],
    `n = int(input())
data = {}
for _ in range(n):
    key, value = input().split()
    data[key] = int(value)
threshold = int(input())
kept = {key: value for key, value in data.items() if value >= threshold}
print(len(kept))
for key in sorted(kept):
    print(key, kept[key])
`, 'Filter the dictionary using an inclusive value comparison.'
  ),
  'level-55-problem-4': make(
    'Join Records by Identifier', 'Inner-join two record collections by identifier, retaining the integer value from each side.',
    'First line: n. Next n lines: identifier and integer value. Next line: m. Next m lines: identifier and integer value.',
    'Print the number of matches, then identifier first-value second-value on one line per match in alphabetical identifier order.',
    ['Identifiers follow the key rules and are unique within each collection.', '0 <= n, m <= 50.'],
    [['2\nb 2\na 1\n2\nb 9\nc 8\n','1\nb 2 9','Only b occurs in both collections; its two values are retained.'],['1\nx 0\n1\nx -1\n','1\nx 0 -1','The shared identifier x joins even though its values differ.'],['0\n0\n','0'],['1\na 1\n0\n','0'],['0\n1\na 1\n','0'],['1\na 2\n1\nb 2\n','0'],['2\nb -1\na 3\n2\nb 0\na 4\n','2\na 3 4\nb -1 0'],['2\na 0\nz 1\n1\nz -1\n','1\nz 1 -1']],
    ['Index the first collection by identifier.', 'Read the second collection into another mapping.', 'Only identifiers present on both sides are joined.', 'Retain the first and second values in that order.', 'Sort matching identifiers before printing.'],
    `n = int(input())
first = {}
for _ in range(n):
    key, value = input().split()
    first[key] = int(value)
m = int(input())
second = {}
for _ in range(m):
    key, value = input().split()
    second[key] = int(value)
keys = sorted(first.keys() & second.keys())
print(len(keys))
for key in keys:
    print(key, first[key], second[key])
`, 'Find shared identifiers and print the corresponding value from each mapping.'
  ),
  'level-55-problem-5': make(
    'Lookup a Nested Mapping Path', 'Follow the query path through the nested mapping. Print the integer at a leaf, MAP at an existing internal mapping, or MISSING if the path cannot be followed.',
    'First line: n. Next n lines: a slash-separated leaf path and integer value. Last line: one slash-separated query path.',
    'Print one integer, MAP, or MISSING.', ['0 <= n <= 50; paths have 1 to 5 nonempty lowercase key segments.', 'Leaf paths are distinct, and no leaf path is a prefix of another leaf path.', 'The query has 1 to 6 segments.'],
    [['2\nhome/desk 4\nhome/lamp 0\nhome/desk\n','4','Following home then desk reaches integer 4.'],['1\na/b -2\na\n','MAP','a exists as an internal mapping rather than a leaf.'],['0\na\n','MISSING'],['1\na 0\na\n','0'],['1\na 1\na/b\n','MISSING'],['2\na/b 2\na/c 3\na/d\n','MISSING'],['2\nx/y/z -4\nx/q 5\nx/y\n','MAP'],['2\nab 1\na/b 2\na/b\n','2']],
    ['Split each leaf path on slash characters.', 'Build nested dictionaries for intermediate path segments.', 'Store the integer at the final segment.', 'While following the query, stop if the current value is not a dictionary or a key is missing.', 'After a successful traversal distinguish an internal dictionary from an integer.'],
    `n = int(input())
root = {}
for _ in range(n):
    path, value = input().split()
    parts = path.split('/')
    current = root
    for part in parts[:-1]:
        current = current.setdefault(part, {})
    current[parts[-1]] = int(value)
current = root
missing = False
for part in input().split('/'):
    if not isinstance(current, dict) or part not in current:
        missing = True
        break
    current = current[part]
if missing:
    print('MISSING')
elif isinstance(current, dict):
    print('MAP')
else:
    print(current)
`, 'Construct the tree and check each query segment before descending.'
  ),
};
