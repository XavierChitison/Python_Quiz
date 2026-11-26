import { challenge } from './beginner.js';

const listIn = 'One line of space-separated integers; an empty line represents an empty list.';
const listOut = 'Print the result as space-separated integers on one line; print an empty line for an empty list.';
const groupsOut = 'Print the number of groups on the first line. Then print one line per group: its length followed by its elements, separated by spaces. An empty group is printed as 0.';
const pairsOut = 'Print the number of pairs on the first line, followed by one pair of space-separated integers per line. Print only 0 when there are no pairs.';
const rowIn = 'First line: the number of rows. Each subsequent line is one row of space-separated integers; an empty line is an empty row.';
const limits = ['Each input list or row has at most 50 elements unless otherwise stated.', 'Input integer values have absolute value at most 1000 unless otherwise stated.'];
const listStarter = "a = list(map(int, input().split()))\n\n# Compute and print the result.\n";
const scalarStarter = "a = list(map(int, input().split()))\nk = int(input())\n\n# Compute and print the result.\n";
const rowStarter = "n = int(input())\nrows = [list(map(int, input().split())) for _ in range(n)]\n\n# Compute and print the result.\n";
const make = (title, description, input, output, extra, cases, hints, solution, explanation, starter = listStarter) =>
  challenge(title, description, input, output, [...limits, ...extra], cases, hints, solution, explanation, starter);

export const lists4650Challenges = {
  'level-46-problem-1': make(
    'Prefix Sums of a List', 'Print the cumulative sum through each position of the list.', listIn, listOut, [],
    [['2 -1 3\n','2 1 4','The running totals are 2, 1, and 4.'],['0 0\n','0 0','Both cumulative sums are zero.'],['\n',''],['-5\n','-5'],['1 2 3 4\n','1 3 6 10'],['-2 -3 7\n','-2 -5 2'],['1000 -1000\n','1000 0'],['5 -5 5\n','5 0 5']],
    ['Start with a total of zero.', 'Visit the numbers in order.', 'Add each number to the running total.', 'Append the new total after each addition.', 'An empty input produces an empty result.'],
    `a = list(map(int, input().split()))
total = 0
out = []
for x in a:
    total += x
    out.append(total)
print(*out)
`, 'Accumulate each value and record the updated total.'
  ),
  'level-46-problem-2': make(
    'Adjacent Differences', 'Print each element minus its immediate predecessor, starting at index 1.', listIn, listOut, [],
    [['3 8 2\n','5 -6','8 - 3 is 5 and 2 - 8 is -6.'],['4 4 4\n','0 0','Equal neighbors have difference zero.'],['\n',''],['7\n',''],['-2 3\n','5'],['3 -2\n','-5'],['1 2 4 8\n','1 2 4'],['1000 -1000 0\n','-2000 1000']],
    ['The first element has no predecessor.', 'Start at index 1.', 'For each index find the previous element.', 'Subtract the previous value from the current one.', 'Collect the differences in order.'],
    `a = list(map(int, input().split()))
out = [a[i] - a[i-1] for i in range(1, len(a))]
print(*out)
`, 'Subtract each previous element from the current element.'
  ),
  'level-46-problem-3': make(
    'Fixed-Width Window Sums', 'Print the sum of each contiguous window of width k in order.', `${listIn} The second line contains k.`, listOut, ['1 <= k <= list length.'],
    [['1 2 3 4\n2\n','3 5 7','The pairs sum to 3, 5, and 7.'],['-2 5 -1\n3\n','2','The only full-width window sums to 2.'],['9\n1\n','9'],['1 0 -1\n1\n','1 0 -1'],['0 0 0\n2\n','0 0'],['5 -5 5 -5\n2\n','0 0 0'],['-4 -3 -2\n2\n','-7 -5'],['1000 1000 -1000\n2\n','2000 0']],
    ['A window contains k consecutive entries.', 'Sum the first k entries.', 'Move the window one position to the right.', 'Subtract the leaving value and add the entering value.', 'Record every full window, including the first.'],
    `a = list(map(int, input().split()))
k = int(input())
total = sum(a[:k])
out = [total]
for i in range(k, len(a)):
    total += a[i] - a[i-k]
    out.append(total)
print(*out)
`, 'Maintain the window sum by removing the old left value and adding the new right value.', scalarStarter
  ),
  'level-46-problem-4': make(
    'Count Subarrays with Bounded Product', 'Count nonempty contiguous subarrays whose product is strictly less than k.', `${listIn} The second line contains k.`, 'Print the count as an integer.', ['Each list element is between 1 and 1000.', '1 <= k <= 1000000.'],
    [['3 2 4 1\n9\n','8','All four singletons, all three pairs, and the triple [2,4,1] have products below 9.'],['1 1 1\n2\n','6','Every one of the six nonempty subarrays has product 1.'],['\n4\n','0'],['1 2\n1\n','0'],['2\n2\n','0'],['2\n3\n','1'],['2 3 4\n7\n','4'],['1000 1 1000\n1001\n','5']],
    ['All elements are positive, so extending a window cannot decrease its product.', 'A threshold of 1 admits no product.', 'Expand a window by multiplying its new right value.', 'While the product is too large, divide out values from the left.', 'Every remaining start through the right endpoint forms one valid subarray.'],
    `a = list(map(int, input().split()))
k = int(input())
left = 0
product = 1
count = 0
if k > 1:
    for right, x in enumerate(a):
        product *= x
        while product >= k:
            product //= a[left]
            left += 1
        count += right - left + 1
print(count)
`, 'Shrink the positive-product window until valid, then count its valid suffixes.', scalarStarter
  ),
  'level-46-problem-5': make(
    'Equilibrium Index', 'Find the first zero-based index whose strictly left and right sums are equal, or -1 if none.', listIn, 'Print the index or -1.', [],
    [['4 -2 7 3 -1\n','2','At index 2 both sides sum to 2.'],['0 0\n','0','Both indices work, so choose the first.'],['\n','-1'],['7\n','0'],['1 2\n','-1'],['-1 0 1\n','-1'],['1 -1 0\n','2'],['2 1 -1\n','0']],
    ['Compute the total sum first.', 'Keep the sum strictly to the left.', 'Subtract the left sum and current value from the total for the right sum.', 'Check indices from left to right.', 'Stop immediately on a match, otherwise print -1.'],
    `a = list(map(int, input().split()))
total = sum(a)
left = 0
answer = -1
for i, x in enumerate(a):
    if left == total - left - x:
        answer = i
        break
    left += x
print(answer)
`, 'Compare the running left sum with the total excluding that sum and the current value.'
  ),
  'level-47-problem-1': make(
    'Ragged Column Sums', 'Sum existing entries in each column of a ragged list of rows, from left to right.', rowIn, listOut, ['0 <= number of rows <= 50.', 'Rows may have different lengths.'],
    [['3\n1 2\n3\n4 5 6\n','8 7 6','The column sums are 1+3+4, 2+5, and 6.'],['2\n\n-1 2\n','-1 2','The empty row contributes nothing.'],['0\n',''],['2\n\n\n',''],['1\n3\n','3'],['2\n1 -1\n2 1\n','3 0'],['3\n0 0 0\n\n5\n','5 0 0'],['3\n-2\n2 4\n-1 -4\n','-1 0']],
    ['Different rows can have different lengths.', 'Prepare one total for each existing column.', 'Visit each row and its indexed values.', 'Add each value to its column total.', 'Print totals in increasing column order.'],
    `n = int(input())
totals = []
for _ in range(n):
    row = list(map(int, input().split()))
    for i, x in enumerate(row):
        if i == len(totals):
            totals.append(0)
        totals[i] += x
print(*totals)
`, 'Extend the totals as needed while adding each cell to its column.', rowStarter
  ),
  'level-47-problem-2': make(
    'Chunk a List', 'Split a list into consecutive chunks of at most k elements.', `${listIn} The second line contains k.`, groupsOut, ['1 <= k <= 100.'],
    [['1 2 3 4 5\n2\n','3\n2 1 2\n2 3 4\n1 5','The final chunk contains the one remaining value.'],['1 2\n5\n','1\n2 1 2','A chunk can be shorter than k.'],['\n3\n','0'],['1\n1\n','1\n1 1'],['1 2 3\n1\n','3\n1 1\n1 2\n1 3'],['1 2 3 4\n2\n','2\n2 1 2\n2 3 4'],['0 0 0\n3\n','1\n3 0 0 0'],['-1 2 -3 4 5 6 7\n3\n','3\n3 -1 2 -3\n3 4 5 6\n1 7']],
    ['Each chunk starts k positions after the previous one.', 'Use a range with step k.', 'Slice from each start up to start plus k.', 'A slice past the end naturally stops at the end.', 'Print the number of chunks and each chunk with its length.'],
    `a = list(map(int, input().split()))
k = int(input())
chunks = [a[i:i+k] for i in range(0, len(a), k)]
print(len(chunks))
for chunk in chunks:
    print(len(chunk), *chunk)
`, 'Slice at starts separated by k, letting the final slice be short.', scalarStarter
  ),
  'level-47-problem-3': make(
    'Split a List at Zeroes', 'Split a list at every zero, discarding separators but retaining empty groups.', listIn, groupsOut, [],
    [['1 0 2 0 0 3\n','4\n1 1\n1 2\n0\n1 3','Adjacent separators create an empty group.'],['0 5 0\n','3\n0\n1 5\n0','Leading and trailing separators create empty groups.'],['\n','1\n0'],['0\n','2\n0\n0'],['1 2\n','1\n2 1 2'],['0 0\n','3\n0\n0\n0'],['-1 0 -2\n','2\n1 -1\n1 -2'],['3 3 0 3\n','2\n2 3 3\n1 3']],
    ['Start with one empty group.', 'Read values from left to right.', 'A zero ends the current group.', 'On zero, start another empty group even if the current one is empty.', 'Append nonzero values to the current group, then print all group lengths and values.'],
    `a = list(map(int, input().split()))
groups = [[]]
for x in a:
    if x == 0:
        groups.append([])
    else:
        groups[-1].append(x)
print(len(groups))
for group in groups:
    print(len(group), *group)
`, 'Start a fresh group on each separator, preserving empty groups at all boundaries.'
  ),
  'level-47-problem-4': make(
    'List Cartesian Product', 'Print all ordered pairs taking one element from the first list and one from the second, in first-list-major input order.',
    `${listIn} The second line contains the second list in the same format.`, pairsOut, ['Duplicate values produce duplicate pairs.'],
    [['1 2\n3 4\n','4\n1 3\n1 4\n2 3\n2 4','Pair 1 with both second-list values, then pair 2 with both.'],['7 7\n0\n','2\n7 0\n7 0','Both occurrences produce a pair.'],['\n1\n','0'],['1\n\n','0'],['-1\n2\n','1\n-1 2'],['1\n2 3 4\n','3\n1 2\n1 3\n1 4'],['1 2\n0 0\n','4\n1 0\n1 0\n2 0\n2 0'],['\n\n','0']],
    ['Each occurrence in the first list is paired with every occurrence in the second.', 'Use a loop over the first list as the outer loop.', 'Inside it loop over the second list in order.', 'Collect a pair for each combination.', 'Print the pair count followed by the pairs.'],
    `a = list(map(int, input().split()))
b = list(map(int, input().split()))
pairs = []
for x in a:
    for y in b:
        pairs.append((x, y))
print(len(pairs))
for x, y in pairs:
    print(x, y)
`, 'Nested iteration generates every pair in the required order.', "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\n\n# Compute and print the pairs.\n"
  ),
  'level-47-problem-5': make(
    'Ragged Diagonal Groups', 'Group existing row entries by row index plus column index, in increasing sum order; within each group use increasing row index. Omit empty diagonals.',
    rowIn, groupsOut, ['0 <= number of rows <= 50.', 'Rows may have different lengths.'],
    [['3\n1 2 3\n4 5\n6\n','3\n1 1\n2 2 4\n3 3 5 6','Entries on each diagonal have the same row-plus-column index.'],['3\n\n\n9 8\n','2\n1 9\n1 8','The first two diagonal indices are empty and omitted.'],['0\n','0'],['2\n\n\n','0'],['1\n1 2 3\n','3\n1 1\n1 2\n1 3'],['3\n1\n2\n3\n','3\n1 1\n1 2\n1 3'],['3\n0 1\n\n2 3\n','4\n1 0\n1 1\n1 2\n1 3'],['2\n1 2 3\n4 5 6\n','4\n1 1\n2 2 4\n2 3 5\n1 6']],
    ['A cell at row r and column c belongs to diagonal r+c.', 'Visit the rows from top to bottom.', 'Collect each cell under its diagonal index.', 'A ragged input may leave some diagonals empty.', 'Print only nonempty groups ordered by diagonal index.'],
    `n = int(input())
groups = [[] for _ in range(100)]
for r in range(n):
    row = list(map(int, input().split()))
    for c, x in enumerate(row):
        groups[r+c].append(x)
groups = [group for group in groups if group]
print(len(groups))
for group in groups:
    print(len(group), *group)
`, 'Bucket cells by the sum of their coordinates, then emit nonempty buckets in order.', rowStarter
  ),
  'level-48-problem-1': make(
    'Apply List Update Commands', 'Apply list update commands in order and print the final list.',
    `${listIn} The second line contains command count q. Each of the next q lines is "append value", "insert index value", or "delete index".`, listOut,
    ['0 <= q <= 50.', 'Insertion indices are from 0 through the current length; deletion indices are valid.'],
    [['1 2\n3\nappend 3\ninsert 1 9\ndelete 0\n','9 2 3','Append 3, insert 9, then remove the first value.'],['\n2\nappend 5\ndelete 0\n','','The appended value is subsequently deleted.'],['\n0\n',''],['1\n1\ninsert 0 2\n','2 1'],['1\n1\ninsert 1 2\n','1 2'],['1 2\n1\ndelete 1\n','1'],['0\n2\nappend 0\nappend -1\n','0 0 -1'],['2 3 4\n2\ndelete 1\ninsert 1 7\n','2 7 4']],
    ['Work with the current list after every command.', 'Inspect the command name.', 'Append adds a value at the end.', 'Insert uses an index and value; delete removes the indexed element.', 'Print the list only after all commands are processed.'],
    `a = list(map(int, input().split()))
q = int(input())
for _ in range(q):
    command = input().split()
    if command[0] == 'append':
        a.append(int(command[1]))
    elif command[0] == 'insert':
        a.insert(int(command[1]), int(command[2]))
    else:
        del a[int(command[1])]
print(*a)
`, 'Dispatch each command to the matching list operation in sequence.',
    "a = list(map(int, input().split()))\nq = int(input())\ncommands = [input().split() for _ in range(q)]\n\n# Apply the commands and print the list.\n"
  ),
  'level-48-problem-2': make(
    'Distance to the Nearest Zero', 'For each list position print its smallest index distance to a zero, or -1 at every position if no zero exists.', listIn, listOut, [],
    [['5 0 7 8 0 3\n','1 0 1 1 0 1','Each distance is measured to the closer zero.'],['1 2 3\n','-1 -1 -1','No zero exists anywhere in the list.'],['\n',''],['0\n','0'],['0 0\n','0 0'],['1 1 0\n','2 1 0'],['0 1 1 1\n','0 1 2 3'],['0 1 1 0\n','0 1 1 0']],
    ['Distance is the absolute difference between two indices.', 'A zero has distance zero.', 'Scan left to right to find distances to previous zeroes.', 'Scan right to left to consider later zeroes too.', 'Use -1 only when no zero was found on either side.'],
    `a = list(map(int, input().split()))
n = len(a)
out = [n+1] * n
last = -n-1
for i, x in enumerate(a):
    if x == 0:
        last = i
    out[i] = i-last
last = 2*n+1
for i in range(n-1, -1, -1):
    if a[i] == 0:
        last = i
    out[i] = min(out[i], last-i)
print(*(x if x <= n else -1 for x in out))
`, 'Two directional scans find the nearest zero on each side.'
  ),
  'level-48-problem-3': make(
    'Circular Neighbor Sums', 'Print the sum of the left and right circular neighbors of each element.', listIn, listOut,
    ['For a singleton both neighbors are the same element; for two elements both neighbors are the other element.'],
    [['1 2 3 4\n','6 4 6 4','For index 0 the circular neighbors are 4 and 2.'],['7\n','14','Both neighbors are the sole element, so it is counted twice.'],['\n',''],['2 5\n','10 4'],['0 0 0\n','0 0 0'],['-1 2 4\n','6 3 1'],['1 1 1 1\n','2 2 2 2'],['1000 -1000\n','-2000 2000']],
    ['The list wraps around at both ends.', 'Use the list length for modular indices.', 'The left index is (i-1) modulo the length.', 'The right index is (i+1) modulo the length.', 'For an empty list print an empty line without taking modulo zero.'],
    `a = list(map(int, input().split()))
n = len(a)
out = [a[(i-1) % n] + a[(i+1) % n] for i in range(n)]
print(*out)
`, 'Modulo finds both circular neighbor indices, including repeated neighbors in short lists.'
  ),
  'level-48-problem-4': make(
    'List Histogram by Bins', 'Count input values in each consecutive half-open bin [edge[i], edge[i+1]); ignore values outside all bins.',
    `${listIn} The second line contains space-separated bin edges.`, listOut, ['2 <= number of edges <= 51; edges are strictly increasing.'],
    [['-1 0 2 3 6\n0 2 5\n','1 2','0 is in the first bin; 2 and 3 are in the second; -1 and 6 are outside.'],['1 1 2\n1 2 3\n','2 1','The boundary 2 belongs only to the second bin.'],['\n0 1\n','0'],['0 1\n0 1\n','1'],['-5 -2 0\n-5 -2 0\n','1 1'],['10\n0 5 10\n','0 0'],['2 2 2\n1 3\n','3'],['-1 5 0\n0 1 2 3\n','1 0 0']],
    ['Each adjacent pair of edges defines a bin.', 'The lower edge is included.', 'The upper edge is excluded.', 'Count all list values meeting both comparisons for each bin.', 'Values outside the overall edge range contribute nowhere.'],
    `a = list(map(int, input().split()))
edges = list(map(int, input().split()))
counts = []
for i in range(len(edges)-1):
    count = 0
    for x in a:
        if edges[i] <= x < edges[i+1]:
            count += 1
    counts.append(count)
print(*counts)
`, 'Count the values satisfying each bin’s inclusive lower and exclusive upper bound.',
    "a = list(map(int, input().split()))\nedges = list(map(int, input().split()))\n\n# Count and print each bin.\n"
  ),
  'level-48-problem-5': make(
    'Product Except Current Element', 'For every position print the product of all other elements without using division.', listIn, listOut, ['The product of an empty collection is 1.'],
    [['1 2 3 4\n','24 12 8 6','Excluding each position leaves products 24, 12, 8, and 6.'],['0 2 3\n','6 0 0','Only the product excluding the zero is nonzero.'],['\n',''],['5\n','1'],['0 0 2\n','0 0 0'],['-1 2 -3\n','-6 3 -2'],['1 1 1\n','1 1 1'],['-2 0\n','0 -2']],
    ['Division cannot handle zeroes reliably here.', 'For each position first record the product strictly to its left.', 'Walk left to right while updating a prefix product.', 'Walk right to left maintaining a suffix product.', 'Multiply each saved prefix by its suffix.'],
    `a = list(map(int, input().split()))
out = []
prefix = 1
for x in a:
    out.append(prefix)
    prefix *= x
suffix = 1
for i in range(len(a)-1, -1, -1):
    out[i] *= suffix
    suffix *= a[i]
print(*out)
`, 'Combine the products strictly before and after each position.'
  ),
  'level-49-problem-1': make(
    'Remove All Copies of a Value', 'Print the elements unequal to target in their original order.', `${listIn} The second line contains target.`, listOut, [],
    [['2 1 2 3\n2\n','1 3','Both copies of 2 are removed.'],['1 2\n9\n','1 2','No element equals 9.'],['\n0\n',''],['0\n0\n',''],['1 1 1\n1\n',''],['-1 0 -1\n-1\n','0'],['3 2 3 2\n2\n','3 3'],['1000 -1000\n1000\n','-1000']],
    ['Examine every element in order.', 'Compare it with target.', 'Keep it only when it is different.', 'Preserve repeated non-target values.', 'Print an empty line if no values remain.'],
    `a = list(map(int, input().split()))
target = int(input())
out = [x for x in a if x != target]
print(*out)
`, 'Filter out every equal value without changing the order of the rest.',
    "a = list(map(int, input().split()))\ntarget = int(input())\n\n# Filter and print the list.\n"
  ),
  'level-49-problem-2': make(
    'Find Missing Permutation Value', 'Find the one missing number from 0 through n when the other n distinct numbers are supplied.', listIn, 'Print the missing integer.',
    ['n is the list length; its values are distinct and in 0 through n inclusive.'],
    [['3 0 1\n','2','The numbers 0, 1, and 3 are present, leaving 2.'],['\n','0','With n=0, zero is the only possible missing value.'],['1\n','0'],['0\n','1'],['0 1 2\n','3'],['1 2 3\n','0'],['4 2 0 1\n','3'],['2 0 4 3 5\n','1']],
    ['There are n+1 possible values but only n entries.', 'Compute the sum of 0 through n.', 'The expected sum is n*(n+1)//2.', 'Subtract the actual list sum.', 'The difference is the missing value.'],
    `a = list(map(int, input().split()))
n = len(a)
print(n*(n+1)//2 - sum(a))
`, 'Subtract the actual sum from the sum of the complete range.'
  ),
  'level-49-problem-3': make(
    'Majority Element Candidate', 'Find the integer appearing strictly more than half the time, or report none.', listIn, 'Print the integer, or NONE if no majority exists.', [],
    [['2 1 2 2\n','2','2 appears three times, more than half of four.'],['1 1 2 2\n','NONE','Neither value exceeds half the list.'],['\n','NONE'],['-1\n','-1'],['1 2 3\n','NONE'],['0 1 1\n','1'],['2 2 1 1 1\n','1'],['0 0 0 1 2 3\n','NONE']],
    ['A majority must occur strictly more than n/2 times.', 'Cancel pairs of different values while tracking a candidate and balance.', 'When the balance is zero choose the next value as candidate.', 'Increase balance on a match and decrease it otherwise.', 'Count the candidate afterward, because cancellation alone does not prove a majority.'],
    `a = list(map(int, input().split()))
candidate = None
balance = 0
for x in a:
    if balance == 0:
        candidate = x
    balance += 1 if x == candidate else -1
if candidate is not None and a.count(candidate) > len(a)//2:
    print(candidate)
else:
    print('NONE')
`, 'Cancel unlike pairs to select a candidate, then verify its frequency.'
  ),
  'level-49-problem-4': make(
    'Maximum Subarray Sum', 'Find the largest sum of any nonempty contiguous subarray.', listIn, 'Print the maximum sum.', ['The list is nonempty.'],
    [['3 -4 5 -2 6 -8 2\n','9','The best subarray [5,-2,6] sums to 9.'],['-5 -2 -7\n','-2','A nonempty subarray is required, so the best is [-2].'],['0\n','0'],['5\n','5'],['1 2 3\n','6'],['-1 0 -1\n','0'],['3 -4 5\n','5'],['2 -1 2\n','3']],
    ['Every candidate subarray must contain at least one element.', 'Track the best sum ending at the current position.', 'Either start at the current element or extend the previous ending sum.', 'Keep the larger of those two options.', 'Track the maximum ending sum seen across all positions.'],
    `a = list(map(int, input().split()))
ending = best = a[0]
for x in a[1:]:
    ending = max(x, ending+x)
    best = max(best, ending)
print(best)
`, 'Kadane’s recurrence chooses between starting anew and extending the previous subarray.'
  ),
  'level-49-problem-5': make(
    'Minimum Length Subarray at Least Target', 'Find the shortest length of a nonempty contiguous subarray with sum at least target, or 0 if none.',
    `${listIn} The second line contains target.`, 'Print the minimum length, or 0 if no subarray qualifies.', ['Each list element is between 1 and 1000.', '1 <= target <= 50000.'],
    [['1 4 2 1 6 2\n9\n','3','The subarray [2,1,6] reaches 9, and no pair reaches 9.'],['1 1 1\n5\n','0','Even the whole list sums to less than 5.'],['\n1\n','0'],['5\n5\n','1'],['6 1\n5\n','1'],['1 2 3\n6\n','3'],['1 1 1 1\n2\n','2'],['2 1 5 2 3\n6\n','2']],
    ['Positive values make window sums grow when extending right.', 'Add the next element to a running window sum.', 'While the sum reaches target, record the window length.', 'Remove the leftmost value to try a shorter window.', 'If no window reached target, print 0.'],
    `a = list(map(int, input().split()))
target = int(input())
left = total = 0
best = len(a)+1
for right, x in enumerate(a):
    total += x
    while total >= target:
        best = min(best, right-left+1)
        total -= a[left]
        left += 1
print(best if best <= len(a) else 0)
`, 'Expand a positive window and shrink it whenever it meets the target.',
    "a = list(map(int, input().split()))\ntarget = int(input())\n\n# Find and print the minimum length.\n"
  ),
  'level-50-problem-1': make(
    'Next Permutation', 'Print the lexicographically next permutation of the list, or its smallest permutation when already greatest.', listIn, listOut, ['Repeated values are allowed.'],
    [['2 4 3 4\n','2 4 4 3','The smallest larger ordering swaps the last two values.'],['8 3 3\n','3 3 8','The greatest ordering wraps to the smallest.'],['\n',''],['1\n','1'],['1 1 2\n','1 2 1'],['1 2 1\n','2 1 1'],['2 2 1\n','1 2 2'],['-1 3 2 2\n','2 -1 2 3']],
    ['Scan from the right for the first ascent a[i] < a[i+1].', 'If none exists, reverse the whole list.', 'Otherwise find the rightmost suffix element greater than the pivot.', 'Swap that value with the pivot.', 'Reverse the suffix to make it as small as possible.'],
    `a = list(map(int, input().split()))
i = len(a)-2
while i >= 0 and a[i] >= a[i+1]:
    i -= 1
if i >= 0:
    j = len(a)-1
    while a[j] <= a[i]:
        j -= 1
    a[i], a[j] = a[j], a[i]
a[i+1:] = reversed(a[i+1:])
print(*a)
`, 'Swap the rightmost ascent pivot with its successor and reverse the descending suffix.'
  ),
  'level-50-problem-2': make(
    'Merge Overlapping Intervals', 'Merge closed intervals that overlap or touch, printing maximal intervals in increasing order.',
    'First line: interval count n. Each of the next n lines contains start and end.', pairsOut, ['0 <= n <= 50.', 'Each interval has start <= end.'],
    [['3\n1 3\n2 4\n6 7\n','2\n1 4\n6 7','The first two overlap; the third is separate.'],['2\n3 5\n1 3\n','1\n1 5','Closed intervals sharing endpoint 3 merge.'],['0\n','0'],['1\n2 2\n','1\n2 2'],['3\n1 10\n2 3\n4 5\n','1\n1 10'],['2\n4 5\n1 2\n','2\n1 2\n4 5'],['3\n1 2\n2 3\n3 4\n','1\n1 4'],['3\n-3 -1\n-2 0\n0 0\n','1\n-3 0']],
    ['Sort intervals by their start.', 'Keep a current merged interval.', 'A new interval overlaps when its start is at most the current end.', 'Extend the end to the larger endpoint on overlap.', 'Otherwise finish the old interval and begin a new one.'],
    `n = int(input())
intervals = [list(map(int, input().split())) for _ in range(n)]
out = []
for start, end in sorted(intervals):
    if out and start <= out[-1][1]:
        out[-1][1] = max(out[-1][1], end)
    else:
        out.append([start, end])
print(len(out))
for start, end in out:
    print(start, end)
`, 'Sort by start and combine each interval with the last result when their closed ranges touch.',
    "n = int(input())\nintervals = [list(map(int, input().split())) for _ in range(n)]\n\n# Merge and print the intervals.\n"
  ),
  'level-50-problem-3': make(
    'Trapped Rainwater', 'Compute total water trapped above unit-width bars between enclosing nonnegative elevations.', listIn, 'Print the total water units.', ['0 <= each height <= 1000.'],
    [['3 1 2 0 4\n','6','The three interior bars hold 2, 1, and 3 units.'],['4 1 0 4\n','7','The two interior bars hold 3 and 4 units.'],['\n','0'],['2\n','0'],['3 2 1\n','0'],['1 2 3\n','0'],['2 0 2 0 2\n','4'],['5 1 3 1 4 0 2\n','9']],
    ['Water above a position is bounded by the tallest bars on both sides.', 'Only the smaller of those two bounds determines the water level.', 'Use two ends and track the highest bar seen from each end.', 'Advance the side with the smaller known maximum.', 'Add the difference between that maximum and the current height.'],
    `a = list(map(int, input().split()))
left, right = 0, len(a)-1
lm = rm = water = 0
while left <= right:
    if lm <= rm:
        lm = max(lm, a[left])
        water += lm-a[left]
        left += 1
    else:
        rm = max(rm, a[right])
        water += rm-a[right]
        right -= 1
print(water)
`, 'The smaller boundary maximum fixes the water level on the side being processed.'
  ),
  'level-50-problem-4': make(
    'Spiral Traversal of a Grid', 'Print entries of a rectangular grid in clockwise spiral order starting at the top left.', rowIn, listOut,
    ['0 <= number of rows <= 50.', 'Rows all have equal length; zero rows or zero columns are allowed.'],
    [['4\n8 3 1\n4 6 2\n9 0 5\n7 10 11\n','8 3 1 2 5 11 10 7 9 4 6 0','The outer ring ends with 9 and 4; the remaining inner column is 6 then 0.'],['2\n5 -1 8 3\n2 7 0 4\n','5 -1 8 3 4 0 7 2','The top row is followed by the right and bottom edges.'],['0\n',''],['2\n\n\n',''],['1\n1\n','1'],['1\n1 2 3\n','1 2 3'],['3\n1\n2\n3\n','1 2 3'],['3\n1 2\n3 4\n5 6\n','1 2 4 6 5 3']],
    ['Track top, bottom, left, and right boundaries.', 'Traverse the top edge and then the right edge.', 'Shrink each boundary after traversing its edge.', 'Traverse bottom and left only if their boundaries still exist.', 'Repeat until no cells remain.'],
    `n = int(input())
grid = [list(map(int, input().split())) for _ in range(n)]
top, bottom = 0, n-1
left, right = 0, len(grid[0])-1 if grid else -1
out = []
while top <= bottom and left <= right:
    for c in range(left, right+1):
        out.append(grid[top][c])
    top += 1
    for r in range(top, bottom+1):
        out.append(grid[r][right])
    right -= 1
    if top <= bottom:
        for c in range(right, left-1, -1):
            out.append(grid[bottom][c])
        bottom -= 1
    if left <= right:
        for r in range(bottom, top-1, -1):
            out.append(grid[r][left])
        left += 1
print(*out)
`, 'Traverse and shrink four boundaries, checking for a remaining row or column before revisiting edges.', rowStarter
  ),
  'level-50-problem-5': make(
    'Group Circular Ones with Swaps', 'Find the minimum number of swaps of any two positions needed to make all ones consecutive in a circular binary list.', listIn, 'Print the minimum swap count.',
    ['Each element is 0 or 1.', 'Consecutive positions may wrap from the last position to the first.'],
    [['1 0 1 0 1\n','1','A circular block of three positions can contain two ones; swap in the third.'],['1 0 0 1\n','0','The ones are already adjacent across the circular boundary.'],['\n','0'],['0 0\n','0'],['1 1 1\n','0'],['1 0 1 0\n','1'],['1 0 0 1 0 1 0 0\n','1'],['0 1 0 0 1 0 0 1 0\n','2']],
    ['A finished block must have length equal to the total number of ones.', 'Each zero inside that block needs one swap with a one outside.', 'Consider every circular window of that length.', 'Use modulo indices to slide through windows crossing the end.', 'Print the fewest zeroes in any such window.'],
    `a = list(map(int, input().split()))
n = len(a)
ones = sum(a)
best = 0
if ones:
    zeros = ones - sum(a[:ones])
    best = zeros
    for start in range(1, n):
        zeros -= 1-a[start-1]
        zeros += 1-a[(start+ones-1) % n]
        best = min(best, zeros)
print(best)
`, 'A block of all ones needs one swap for each zero in its best circular window.'
  )
};
