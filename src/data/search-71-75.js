import { challenge } from './beginner.js';

const listInput = 'First line: space-separated integers (an empty line means an empty list).';
const limits = ['Each list has at most 1000 elements.', 'All input integers are between -10000 and 10000 unless otherwise stated.'];
const listStarter = "a = list(map(int, input().split()))\n\n# Compute and print the answer.\n";
const paramStarter = "a = list(map(int, input().split()))\nk = int(input())\n\n# Compute and print the answer.\n";
const make = (title, description, input, output, extra, cases, hints, solution, explanation, starter = listStarter) =>
  challenge(title, description, input, output, [...limits, ...extra], cases, hints, solution, explanation, starter);

export const search7175Challenges = {
  'level-71-problem-1': make(
    'First Fixed Point in a Sorted List', 'Find the smallest zero-based index i such that a[i] equals i, or -1 if none. Use binary search.',
    listInput, 'Print the index or -1.', ['The list is strictly increasing.'],
    [['-3 0 2 3 6\n','2','Indices 2 and 3 are fixed points; the first is 2.'],['-2 -1 1 4\n','-1','No value equals its index.'],['\n','-1'],['0\n','0'],['1\n','-1'],['-1 0 1 3\n','3'],['0 1 2\n','0'],['-10 -5 0 1 4\n','4']],
    ['Compare each value with its index.', 'For a strictly increasing integer list, a[i] - i never decreases.', 'Binary-search the first index where that difference is nonnegative.', 'Check whether the difference there is actually zero.', 'If the search reaches the end or the difference is positive, print -1.'],
    `a = list(map(int, input().split()))
lo, hi = 0, len(a)
while lo < hi:
    mid = (lo + hi) // 2
    if a[mid] < mid:
        lo = mid + 1
    else:
        hi = mid
print(lo if lo < len(a) and a[lo] == lo else -1)
`, 'The nondecreasing difference allows a lower-bound search for zero.'
  ),
  'level-71-problem-2': make(
    'First Factorial with K Trailing Zeroes', 'Find the smallest nonnegative n such that n! has at least k trailing decimal zeroes. Count factors of five inside a binary search; do not construct the factorial.',
    'One line containing the integer k.', 'Print the smallest qualifying n.', ['0 <= k <= 10000.', 'By convention 0! is 1.'],
    [['1\n','5','5! is 120, and no smaller factorial has a trailing zero.'],['5\n','25','24! has four trailing zeroes, while 25! has six because 25 supplies two factors of five.'],['0\n','0'],['10000\n','40010'],['4\n','20'],['6\n','25'],['10\n','45'],['100\n','405']],
    ['Each trailing zero requires one factor of 5 paired with a factor of 2.', 'Factorials contain at least as many factors of 2 as factors of 5.', 'Count factors of 5 in n! by summing n // 5, n // 25, and so on.', 'This count never decreases as n grows, so binary-search the first n reaching k.', 'The range from 0 through 5*k contains a solution, including k = 0.'],
    `k = int(input())
lo, hi = 0, 5 * k
while lo < hi:
    mid = (lo + hi) // 2
    value = mid
    zeros = 0
    while value:
        value //= 5
        zeros += value
    if zeros >= k:
        hi = mid
    else:
        lo = mid + 1
print(lo)
`, 'The factor-of-five count is monotone, so its first qualifying input can be binary-searched.', "k = int(input())\n\n# Find and print the smallest qualifying n.\n"
  ),
  'level-71-problem-3': make(
    'Lower Bound Index', 'Find the first zero-based position where the value is at least the target, or the list length if no value qualifies. Use binary search.',
    `${listInput} The list is nondecreasing; the second line contains the target.`, 'Print the insertion index.', [],
    [['1 2 2 4\n2\n','1','The first value at least 2 is at index 1.'],['1 3 5\n4\n','2','4 belongs before 5 at index 2.'],['\n0\n','0'],['2\n1\n','0'],['2\n3\n','1'],['1 1 1\n1\n','0'],['-4 -1 0\n-2\n','1'],['0 2 4\n5\n','3']],
    ['Use a half-open search interval from zero to the list length.', 'Examine its middle index.', 'Values below the target cannot be the answer.', 'For a qualifying value, retain that index and search to its left.', 'The converged boundary is the insertion position, including at the end.'],
    `a = list(map(int, input().split()))
target = int(input())
lo, hi = 0, len(a)
while lo < hi:
    mid = (lo + hi) // 2
    if a[mid] < target:
        lo = mid + 1
    else:
        hi = mid
print(lo)
`, 'Discard values below the target to converge on the first qualifying index.', paramStarter
  ),
  'level-71-problem-4': make(
    'Maximum Saw Height for Wood', 'Cut every tree horizontally at the same nonnegative integer height; each tree taller than the cut contributes the part above it. Find the greatest cut height yielding at least the requested wood, or -1 if impossible. Use binary search.',
    `${listInput} The second line contains the required wood amount.`, 'Print the greatest cut height, or -1 if impossible.', ['The list contains 1 to 1000 tree heights, each from 0 to 10000.', 'The required amount is between 0 and 10000.', 'The cut height cannot exceed the tallest tree.'],
    [['20 15 10 17\n7\n','15','At height 15, the first and fourth trees contribute 5 and 2; height 16 yields only 5.'],['4 4\n3\n','2','Height 2 yields 4 units, while height 3 yields only 2.'],['5 1\n0\n','5'],['1 2\n4\n','-1'],['0 0\n0\n','0'],['0 0\n1\n','-1'],['5\n5\n','0'],['3 8 8\n7\n','4']],
    ['A tree of height h contributes max(0, h - cut).', 'Add the contributions from all trees for a proposed cut.', 'The amount of wood never increases as the cut height increases.', 'If cutting at zero is insufficient, no permitted cut works.', 'Otherwise binary-search the highest feasible cut, using an upper midpoint to make progress.'],
    `a = list(map(int, input().split()))
required = int(input())
if sum(a) < required:
    print(-1)
else:
    lo, hi = 0, max(a)
    while lo < hi:
        mid = (lo + hi + 1) // 2
        wood = sum(max(0, height - mid) for height in a)
        if wood >= required:
            lo = mid
        else:
            hi = mid - 1
    print(lo)
`, 'Summed cut contributions form a nonincreasing feasibility predicate; search its last true height.', paramStarter
  ),
  'level-71-problem-5': make(
    'Digit in the Concatenated Counting Sequence', 'Concatenate the decimal representations of all positive integers in order: 123456789101112.... Find the digit at one-based position k without building the sequence; use binary search.',
    'One line containing k.', 'Print the digit at position k.', ['1 <= k <= 10000.'],
    [['1\n','1','The first digit is 1.'],['11\n','0','Positions 10 and 11 are the two digits of 10.'],['9\n','9'],['10\n','1'],['189\n','9'],['190\n','1'],['192\n','0'],['10000\n','7']],
    ['Count how many digits are used by the integers from 1 through a chosen n.', 'For each power of ten p <= n, add n - p + 1: every integer from p onward has a digit in that place.', 'Binary-search the smallest n whose cumulative digit count reaches k.', 'Subtract the cumulative count through n - 1 to find the one-based offset within n.', 'Select that digit from the decimal text of n.'],
    `def digits_through(n):
    total = 0
    power = 1
    while power <= n:
        total += n - power + 1
        power *= 10
    return total
k = int(input())
lo, hi = 1, k
while lo < hi:
    mid = (lo + hi) // 2
    if digits_through(mid) >= k:
        hi = mid
    else:
        lo = mid + 1
offset = k - digits_through(lo - 1) - 1
print(str(lo)[offset])
`, 'Binary-search the containing integer using cumulative place counts, then select its digit.', "k = int(input())\n\n# Find and print the digit at position k.\n"
  ),
  'level-72-problem-1': make(
    'Minimum Swaps to Sort Distinct Values', 'Find the fewest arbitrary pair swaps needed to sort the distinct values in ascending order.',
    listInput, 'Print the minimum number of swaps.', ['All values are distinct.'],
    [['4 3 2 1\n','2','Swap the two outer values and then the two middle values.'],['2 3 1\n','2','The three-cycle requires two swaps.'],['\n','0'],['5\n','0'],['1 2 3\n','0'],['2 1\n','1'],['-1 3 0 2\n','2'],['5 4 3 2 1\n','2']],
    ['Determine each value’s index in sorted order.', 'These indices form a permutation.', 'Follow unvisited indices to identify its cycles.', 'A cycle of length m requires m - 1 swaps.', 'Add this contribution for every cycle, including singleton cycles.'],
    `a = list(map(int, input().split()))
positions = {x: i for i, x in enumerate(sorted(a))}
perm = [positions[x] for x in a]
seen = set()
answer = 0
for start in range(len(a)):
    if start not in seen:
        i, size = start, 0
        while i not in seen:
            seen.add(i)
            size += 1
            i = perm[i]
        answer += size - 1
print(answer)
`, 'Sorting defines a permutation whose disjoint cycles each cost one less than their length.'
  ),
  'level-72-problem-2': make(
    'Shortest Unsorted Subarray', 'Find inclusive zero-based endpoints of the shortest contiguous subarray whose sorting makes the entire list nondecreasing. If already sorted, print -1 -1.',
    listInput, 'Print the two endpoints separated by a space.', [],
    [['2 6 4 8 10 9 15\n','1 5','Sorting indices 1 through 5 fixes both inversions.'],['1 3 2 2 4\n','1 3','Both 2s must move before 3.'],['\n','-1 -1'],['1\n','-1 -1'],['1 2 2\n','-1 -1'],['2 1\n','0 1'],['3 2 1\n','0 2'],['1 5 3 4 2 6\n','1 4']],
    ['Scan for the first adjacent decrease and the last adjacent decrease.', 'If no decrease exists, the list is already sorted.', 'Find the minimum and maximum inside the initial region.', 'Extend the left edge while earlier values exceed that minimum.', 'Extend the right edge while later values are below that maximum.'],
    `a = list(map(int, input().split()))
left = 0
while left + 1 < len(a) and a[left] <= a[left + 1]:
    left += 1
if left + 1 >= len(a):
    print(-1, -1)
else:
    right = len(a) - 1
    while a[right - 1] <= a[right]:
        right -= 1
    low, high = min(a[left:right+1]), max(a[left:right+1])
    while left > 0 and a[left-1] > low:
        left -= 1
    while right + 1 < len(a) and a[right+1] < high:
        right += 1
    print(left, right)
`, 'Expand the initially disordered region to include values displaced by its extrema.'
  ),
  'level-72-problem-3': make(
    'Competition Ranks with Ties', 'For each value in input order, print one plus the number of input values strictly greater than it.',
    listInput, 'Print the ranks separated by spaces, or an empty line for an empty list.', [],
    [['20 10 20 5\n','1 3 1 4','Both 20s rank first; two values beat 10.'],['3 3 3\n','1 1 1','No value is strictly greater than another.'],['\n',''],['7\n','1'],['1 2 3\n','3 2 1'],['3 2 1\n','1 2 3'],['-1 -2 -1\n','1 3 1'],['0 5 0 5 1\n','4 1 4 1 3']],
    ['Ranks count occurrences, not just distinct values.', 'Sort a copy in descending order.', 'The first position of a value gives its rank after adding one.', 'Store one rank for each distinct value.', 'Look up each original value to preserve input order.'],
    `a = list(map(int, input().split()))
ranks = {}
for i, x in enumerate(sorted(a, reverse=True)):
    if x not in ranks:
        ranks[x] = i + 1
print(*(ranks[x] for x in a))
`, 'The first position in descending order counts all strictly greater occurrences.'
  ),
  'level-72-problem-4': make(
    'Stable Sort by String Length', 'Order words by increasing length while preserving their input order among words of equal length.',
    'One line of space-separated words; an empty line means no words.', 'Print the ordered words separated by spaces, or an empty line.', ['There are at most 1000 words, each 1 to 30 ASCII letters.'],
    [['pear a fig bee\n','a fig bee pear','fig and bee have equal length and retain their order.'],['bb aa c\n','c bb aa','The equal-length words stay in input order.'],['\n',''],['x\n','x'],['a b c\n','a b c'],['abcd abc ab a\n','a ab abc abcd'],['cat a dog b\n','a b cat dog'],['Z a zz\n','Z a zz']],
    ['Each word’s key is its length.', 'Python can sort using a key function.', 'The built-in sort is stable.', 'Do not add alphabetical order as a tie-breaker.', 'Print the resulting words separated by spaces.'],
    `words = input().split()
words.sort(key=len)
print(*words)
`, 'A stable length-key sort preserves the relative order of equal-length words.', "words = input().split()\n\n# Sort and print the words.\n"
  ),
  'level-72-problem-5': make(
    'Count Inversions', 'Count index pairs i < j where a[i] is greater than a[j], using merge-based counting.',
    listInput, 'Print the inversion count.', [],
    [['2 4 1 3\n','3','The inversions are (2,1), (4,1), and (4,3).'],['3 2 1\n','3','Each of the three index pairs is inverted.'],['\n','0'],['1\n','0'],['1 2 3\n','0'],['2 2 1\n','2'],['-1 -2 -3\n','3'],['1 3 2 3 1\n','4']],
    ['Split the list and count inversions in each half.', 'Recursively sort both halves.', 'Merge the sorted halves from their fronts.', 'When a right value is smaller than the left front, it forms inversions with every remaining left value.', 'Equal values are not inversions, so take the left value first on a tie.'],
    `def count_sort(a):
    if len(a) < 2:
        return a, 0
    m = len(a) // 2
    left, x = count_sort(a[:m])
    right, y = count_sort(a[m:])
    i = j = 0
    merged = []
    count = x + y
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            merged.append(left[i])
            i += 1
        else:
            merged.append(right[j])
            j += 1
            count += len(left) - i
    return merged + left[i:] + right[j:], count
a = list(map(int, input().split()))
print(count_sort(a)[1])
`, 'During merging, every smaller right value precedes all remaining left values.'
  ),
  'level-73-problem-1': make(
    'Align a Rotated Sorted List', 'Find the number of left shifts that turns the first list into the second, or -1 if impossible. Find the candidate using binary search on the rotated sorted first list, then verify every element.',
    `${listInput} The second line is another list of the same length.`, 'Print the shift count, or -1 if no rotation matches. For two empty lists print 0.', ['The first list is a rotation of a strictly increasing list.', 'The second list contains distinct integers.'],
    [['4 5 1 2 3\n1 2 3 4 5\n','2','Two left shifts put 1 first and align every element.'],['3 4 1 2\n1 3 4 2\n','-1','Starting at 1 cannot match the rest of the second list.'],['\n\n','0'],['7\n7\n','0'],['7\n2\n','-1'],['1 2 3\n1 2 3\n','0'],['2 3 4 1\n1 2 3 4\n','3'],['-1 0 -3 -2\n-2 -1 0 -3\n','3']],
    ['If both lists are empty, no shifts are needed.', 'The first element of the second list determines the only possible shift because values are distinct.', 'Binary-search for that element in the rotated sorted first list.', 'At each midpoint, one half of the remaining interval is sorted.', 'If the candidate exists, compare all positions modulo the length before accepting it.'],
    `a = list(map(int, input().split()))
b = list(map(int, input().split()))
n = len(a)
if not n:
    print(0)
else:
    lo, hi = 0, n - 1
    found = -1
    while lo <= hi:
        mid = (lo + hi) // 2
        if a[mid] == b[0]:
            found = mid
            break
        if a[lo] <= a[mid]:
            if a[lo] <= b[0] < a[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        elif a[mid] < b[0] <= a[hi]:
            lo = mid + 1
        else:
            hi = mid - 1
    if found != -1 and all(a[(found + i) % n] == b[i] for i in range(n)):
        print(found)
    else:
        print(-1)
`, 'Search for the sole possible alignment, then verify the entire cyclic sequence.', "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\n\n# Find and print the left-shift count.\n"
  ),
  'level-73-problem-2': make(
    'Find a Rotation Minimum', 'Find the minimum value in a rotated strictly increasing nonempty list using binary search.',
    listInput, 'Print the minimum value.', ['The list is nonempty and all values are distinct.'],
    [['4 5 1 2 3\n','1','The rotation starts at 4, but the minimum is 1.'],['1 2 3\n','1','An unrotated list starts with its minimum.'],['7\n','7'],['2 1\n','1'],['3 1 2\n','1'],['2 3 1\n','1'],['-1 0 -3 -2\n','-3'],['0 100 -100\n','-100']],
    ['The minimum lies in one of the two halves.', 'Compare the midpoint value with the rightmost candidate.', 'If the midpoint exceeds the right value, the minimum lies strictly right.', 'Otherwise the midpoint can still be the minimum.', 'Continue until one candidate remains.'],
    `a = list(map(int, input().split()))
lo, hi = 0, len(a) - 1
while lo < hi:
    mid = (lo + hi) // 2
    if a[mid] > a[hi]:
        lo = mid + 1
    else:
        hi = mid
print(a[lo])
`, 'The right endpoint identifies the half containing the rotation minimum.'
  ),
  'level-73-problem-3': make(
    'Peak Index in a Mountain Array', 'Find the zero-based index of the peak in a list that strictly rises and then strictly falls. Use binary search.',
    listInput, 'Print the peak index.', ['The list has at least three elements and both slopes are nonempty.'],
    [['1 4 7 3 0\n','2','7 is the peak at index 2.'],['0 5 2\n','1','The only interior value is the peak.'],['1 2 3 2\n','2'],['1 3 2 0\n','1'],['-5 -2 -1 -4\n','2'],['0 9 8 7 6\n','1'],['-3 -2 -1 0 -5\n','3'],['1 10 -1\n','1']],
    ['The peak lies on the rising side or at the boundary between slopes.', 'Compare a midpoint with its right neighbor.', 'If the midpoint is smaller, the peak lies to the right.', 'Otherwise the midpoint itself may be the peak.', 'Stop when the candidate interval contains one index.'],
    `a = list(map(int, input().split()))
lo, hi = 0, len(a) - 1
while lo < hi:
    mid = (lo + hi) // 2
    if a[mid] < a[mid + 1]:
        lo = mid + 1
    else:
        hi = mid
print(lo)
`, 'Follow the slope toward the peak until the interval converges.'
  ),
  'level-73-problem-4': make(
    'Search a Row-Column Sorted Matrix', 'Decide whether a target appears in a rectangular matrix whose rows and columns are nondecreasing. Eliminate a row or column at each step.',
    'First line: rows and columns. Next come that many rows of space-separated integers. Last line: target.', 'Print YES if present, otherwise NO.', ['1 <= rows, columns <= 50.'],
    [['3 3\n1 4 7\n2 5 8\n3 6 9\n5\n','YES','5 is in the center.'],['2 3\n1 3 5\n2 4 6\n7\n','NO','7 appears nowhere.'],['1 1\n0\n0\n','YES'],['1 1\n0\n-1\n','NO'],['1 4\n1 2 2 3\n2\n','YES'],['3 1\n-3\n0\n4\n-2\n','NO'],['2 2\n1 1\n1 1\n1\n','YES'],['2 3\n-5 -2 0\n-3 1 4\n-3\n','YES']],
    ['Begin at the top-right cell.', 'All values left of it are no larger; all values below it are no smaller.', 'If it is too large, discard its column by moving left.', 'If it is too small, discard its row by moving down.', 'Stop on a match or after leaving the matrix.'],
    `rows, cols = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(rows)]
target = int(input())
r, c = 0, cols - 1
found = False
while r < rows and c >= 0:
    if grid[r][c] == target:
        found = True
        break
    if grid[r][c] > target:
        c -= 1
    else:
        r += 1
print('YES' if found else 'NO')
`, 'Each comparison eliminates one entire remaining row or column.', "rows, cols = map(int, input().split())\ngrid = [list(map(int, input().split())) for _ in range(rows)]\ntarget = int(input())\n\n# Search and print YES or NO.\n"
  ),
  'level-73-problem-5': make(
    'Kth Missing Positive Integer', 'Find the one-based kth positive integer absent from a strictly increasing list of positive integers. Use binary search.',
    `${listInput} The second line contains k.`, 'Print the missing integer.', ['1 <= k <= 10000.', 'All list elements are positive.'],
    [['2 3 4 7 11\n5\n','9','The missing positives start 1, 5, 6, 8, 9.'],['1 2 3 4\n2\n','6','The missing positives start 5, 6.'],['\n3\n','3'],['2\n1\n','1'],['1\n1\n','2'],['5 6\n3\n','3'],['2 4 6\n4\n','7'],['1 3 5 7\n3\n','6']],
    ['At index i, a[i] - i - 1 positive values are missing before a[i].', 'These missing counts never decrease.', 'Binary-search the first index with at least k missing values before it.', 'The answer is k plus the number of present values before it.', 'The same formula works if the answer is after the whole list.'],
    `a = list(map(int, input().split()))
k = int(input())
lo, hi = 0, len(a)
while lo < hi:
    mid = (lo + hi) // 2
    if a[mid] - mid - 1 < k:
        lo = mid + 1
    else:
        hi = mid
print(k + lo)
`, 'The boundary counts how many present values occur before the kth missing value.', paramStarter
  ),
  'level-74-problem-1': make(
    'Merge Sort Implementation', 'Sort the integers in nondecreasing order by recursively sorting halves and merging them.',
    listInput, 'Print the sorted values separated by spaces, or an empty line.', [],
    [['3 1 4 1\n','1 1 3 4','Both copies of 1 remain.'],['-2 0 -3\n','-3 -2 0','Negative values are ordered normally.'],['\n',''],['5\n','5'],['1 2 3\n','1 2 3'],['3 2 1\n','1 2 3'],['0 0 0\n','0 0 0'],['10000 -10000 0\n','-10000 0 10000']],
    ['A list of length zero or one is already sorted.', 'Split larger lists into two halves.', 'Recursively sort both halves.', 'Merge by repeatedly taking the smaller front value.', 'Append whichever tail remains after one half is exhausted.'],
    `def merge_sort(a):
    if len(a) < 2:
        return a
    mid = len(a) // 2
    left = merge_sort(a[:mid])
    right = merge_sort(a[mid:])
    i = j = 0
    out = []
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            out.append(left[i])
            i += 1
        else:
            out.append(right[j])
            j += 1
    return out + left[i:] + right[j:]
a = list(map(int, input().split()))
print(*merge_sort(a))
`, 'Divide until trivial, then merge sorted halves in order.'
  ),
  'level-74-problem-2': make(
    'Largest Number by Concatenation', 'Arrange all supplied nonnegative integer tokens to form the largest possible decimal number by concatenation. Use every token exactly once.',
    'One line containing space-separated nonnegative integers.', 'Print the largest concatenation as decimal digits; if every token is zero print a single 0.', ['There are 1 to 1000 tokens, each between 0 and 10000.', 'Each token has no leading zero except the token 0.'],
    [['3 30 34 5 9\n','9534330','The best order is 9, 5, 34, 3, 30.'],['10 2\n','210','Putting 2 before 10 gives 210, larger than 102.'],['0 0\n','0'],['12 121\n','12121'],['9\n','9'],['830 83\n','83830'],['1 10 100\n','110100'],['0 0 1\n','100']],
    ['Compare two tokens as text rather than as numbers.', 'For tokens x and y, compare the concatenations x+y and y+x.', 'Put x first when x+y is larger.', 'Use this comparison to sort all tokens before joining them.', 'When every token is zero, collapse the joined zeros to a single 0.'],
    `from functools import cmp_to_key
tokens = input().split()
def compare(x, y):
    if x + y > y + x:
        return -1
    if x + y < y + x:
        return 1
    return 0
tokens.sort(key=cmp_to_key(compare))
result = ''.join(tokens)
print('0' if result[0] == '0' else result)
`, 'Ordering each pair by its better concatenation yields the largest combined number.', "tokens = input().split()\n\n# Arrange and print the largest concatenated number.\n"
  ),
  'level-74-problem-3': make(
    'Maximum Consecutive Sorted Gap', 'Find the largest difference between adjacent values after sorting. Return zero for fewer than two values.',
    listInput, 'Print the maximum gap.', [],
    [['3 6 9 1\n','3','Sorted values are 1, 3, 6, 9; the largest gap is 3.'],['5 5 5\n','0','All adjacent differences are zero.'],['\n','0'],['7\n','0'],['1 2\n','1'],['-5 5\n','10'],['4 1 3 2\n','1'],['-10 -9 0 1\n','9']],
    ['Sort the values first.', 'A gap compares adjacent sorted values, not adjacent original values.', 'Subtract the earlier value from the later value.', 'Track the maximum of these differences.', 'Initialize the maximum to zero for short or equal-valued lists.'],
    `a = sorted(map(int, input().split()))
best = 0
for i in range(1, len(a)):
    best = max(best, a[i] - a[i-1])
print(best)
`, 'Sorting exposes adjacent gaps; a zero initial maximum handles short lists.'
  ),
  'level-74-problem-4': make(
    'Citation H-Index', 'Find the greatest h such that at least h citation counts are each at least h. Use frequency buckets.',
    listInput, 'Print the h-index.', ['Citation counts are nonnegative.'],
    [['3 0 6 1 5\n','3','Three papers have at least three citations, but only two have at least four.'],['1 1 1\n','1','Three papers reach 1, but none reaches 2.'],['\n','0'],['0\n','0'],['100\n','1'],['0 0 0\n','0'],['4 4 4 4\n','4'],['0 2 2 2 10\n','2']],
    ['The h-index cannot exceed the number of papers n.', 'Count citations in buckets 0 through n, placing larger counts in bucket n.', 'Scan possible h values from n down to zero.', 'Accumulate the number of papers with at least the current h citations.', 'The first h whose accumulated count reaches h is the answer.'],
    `a = list(map(int, input().split()))
n = len(a)
buckets = [0] * (n + 1)
for x in a:
    buckets[min(n, x)] += 1
count = 0
for h in range(n, -1, -1):
    count += buckets[h]
    if count >= h:
        print(h)
        break
`, 'Bucket counts above n together and scan descending thresholds.'
  ),
  'level-74-problem-5': make(
    'Smallest Range Covering K Lists', 'Find an inclusive integer range containing at least one value from every list. Minimize upper minus lower, breaking ties by the smaller lower endpoint.',
    'First line: k. The next k lines each contain one nonempty nondecreasing list of space-separated integers.', 'Print the lower and upper endpoints separated by a space.', ['1 <= k <= 50.', 'Each of the k lists is nonempty.'],
    [['3\n4 10 15 24 26\n0 9 12 20\n5 18 22 30\n','20 24','20, 22, and 24 cover all three lists in width 4.'],['2\n1 5\n2 6\n','1 2','Both 1..2 and 5..6 have width 1; the smaller lower endpoint wins.'],['1\n7 9\n','7 7'],['2\n2\n2\n','2 2'],['2\n-5 -1\n0 4\n','-1 0'],['3\n1 2\n2 3\n2 4\n','2 2'],['2\n1 10\n4\n','1 4'],['3\n-4 -1\n-3 3\n-2 2\n','-4 -2']],
    ['Keep one current value from each list in a min-heap.', 'Track the maximum among those current values.', 'The heap minimum and current maximum define a covering range.', 'Compare ranges by width and then by lower endpoint.', 'Advance the list supplying the minimum; stop when that list runs out.'],
    `import heapq
k = int(input())
lists = [list(map(int, input().split())) for _ in range(k)]
heap = [(row[0], i, 0) for i, row in enumerate(lists)]
heapq.heapify(heap)
high = max(row[0] for row in lists)
best = (high - heap[0][0], heap[0][0], high)
while True:
    low, i, j = heapq.heappop(heap)
    candidate = (high - low, low, high)
    best = min(best, candidate)
    j += 1
    if j == len(lists[i]):
        break
    value = lists[i][j]
    high = max(high, value)
    heapq.heappush(heap, (value, i, j))
print(best[1], best[2])
`, 'Advance the smallest current member until one list is exhausted, retaining the best range.', "k = int(input())\nlists = [list(map(int, input().split())) for _ in range(k)]\n\n# Find and print the endpoints.\n"
  ),
  'level-75-problem-1': make(
    'Kth Smallest by Quickselect', 'Find the one-based kth smallest value, counting duplicates separately. Use partition selection rather than sorting the whole list.',
    `${listInput} The second line contains k.`, 'Print the kth smallest value.', ['1 <= k <= list length.'],
    [['7 2 4 2\n3\n','4','The sorted order is 2, 2, 4, 7, so rank 3 is 4.'],['9 -3 9\n2\n','9','Duplicates occupy separate ranks.'],['5\n1\n','5'],['3 2 1\n1\n','1'],['3 2 1\n3\n','3'],['0 0 0\n2\n','0'],['-5 -2 -8 4\n2\n','-5'],['4 1 4 1 4\n4\n','4']],
    ['Convert k to a zero-based rank.', 'Choose a pivot from the remaining candidates.', 'Partition the candidates into values smaller than, equal to, and greater than the pivot.', 'Keep the partition containing the desired rank and adjust the rank when skipping values.', 'If the rank falls within the equal partition, the pivot is the answer.'],
    `a = list(map(int, input().split()))
k = int(input()) - 1
while True:
    pivot = a[len(a) // 2]
    low = [x for x in a if x < pivot]
    equal = [x for x in a if x == pivot]
    high = [x for x in a if x > pivot]
    if k < len(low):
        a = low
    elif k < len(low) + len(equal):
        print(pivot)
        break
    else:
        k -= len(low) + len(equal)
        a = high
`, 'Discard partitions outside the desired rank until it falls in the equal partition.', paramStarter
  ),
  'level-75-problem-2': make(
    'K Closest Values in Sorted Data', 'Select k values closest to target t, counting duplicates and breaking distance ties toward smaller values. Print the selected values in nondecreasing order.',
    `${listInput} The list is nondecreasing. The second line contains k and t.`, 'Print the chosen values separated by spaces, or an empty line if k is zero.', ['0 <= k <= list length.'],
    [['1 2 3 4 5\n4 3\n','1 2 3 4','The tie between 1 and 5 favors 1.'],['-4 -1 2 8\n2 0\n','-1 2','The two smallest distances are 1 and 2.'],['\n0 4\n',''],['3\n1 -2\n','3'],['1 1 1 2\n2 1\n','1 1'],['-5 0 5\n2 100\n','0 5'],['-5 0 5\n3 -100\n','-5 0 5'],['-2 -1 1 2\n2 0\n','-1 1']],
    ['Locate where the target would be inserted in the sorted list.', 'Use one pointer on either side of that insertion point.', 'Compare distances at the two pointers, choosing the left value on a tie.', 'Move the pointer you chose outward and repeat k times.', 'The selected values occupy a contiguous slice, which is already sorted.'],
    `from bisect import bisect_left
a = list(map(int, input().split()))
k, t = map(int, input().split())
right = bisect_left(a, t)
left = right - 1
for _ in range(k):
    if right == len(a) or (left >= 0 and t - a[left] <= a[right] - t):
        left -= 1
    else:
        right += 1
print(*a[left + 1:right])
`, 'Expand from the insertion point, preferring the left side on equal distances.', "a = list(map(int, input().split()))\nk, t = map(int, input().split())\n\n# Select and print the values.\n"
  ),
  'level-75-problem-3': make(
    'Median of Two Sorted Lists', 'Find the median of the combined sorted lists without merging all elements. For an even total, average the two middle values.',
    `${listInput} The second line is another list in the same format. Both are nondecreasing.`, 'Print the median with exactly one digit after the decimal point.', ['At least one list is nonempty.'],
    [['1 3\n2\n','2.0','The combined middle value is 2.'],['1 2\n3 4\n','2.5','The two middle values 2 and 3 average to 2.5.'],['\n5\n','5.0'],['-4 -2\n\n','-3.0'],['1 1\n1 1\n','1.0'],['-5 -1\n0 10 20\n','0.0'],['1 2 3 4\n10\n','3.0'],['-3\n-2 -2 9\n','-2.0']],
    ['Binary-search the partition of the shorter list.', 'Choose the partition of the other list so the left side contains half the combined values, rounded up.', 'Check that each left boundary is no greater than the opposite right boundary.', 'Move the shorter-list partition left or right when a boundary is out of order.', 'The left maximum is the odd median; average it with the right minimum for an even total.'],
    `a = list(map(int, input().split()))
b = list(map(int, input().split()))
if len(a) > len(b):
    a, b = b, a
lo, hi = 0, len(a)
half = (len(a) + len(b) + 1) // 2
while lo <= hi:
    i = (lo + hi) // 2
    j = half - i
    al = a[i-1] if i else float('-inf')
    ar = a[i] if i < len(a) else float('inf')
    bl = b[j-1] if j else float('-inf')
    br = b[j] if j < len(b) else float('inf')
    if al > br:
        hi = i - 1
    elif bl > ar:
        lo = i + 1
    else:
        value = max(al, bl)
        if (len(a) + len(b)) % 2 == 0:
            value = (value + min(ar, br)) / 2
        print(f'{value:.1f}')
        break
`, 'A valid partition places all left values before all right values.', "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\n\n# Find and print the median.\n"
  ),
  'level-75-problem-4': make(
    'Top K Largest Stream Values', 'After each stream value arrives, report the k largest values seen so far, counting duplicates. If fewer than k values have arrived, report all of them. Maintain a bounded min-heap.',
    `${listInput} The second line contains k.`, 'For each arrival print one line containing the retained values in nonincreasing order. Print nothing for an empty stream.', ['1 <= k <= 1000.'],
    [['4 1 7 3\n2\n','4\n4 1\n7 4\n7 4','After 7 arrives, 1 is removed; 3 is too small to enter.'],['2 2 3\n2\n','2\n2 2\n3 2','Both copies count until 3 replaces one.'],['\n1\n',''],['-2\n5\n','-2'],['1 2 3\n1\n','1\n2\n3'],['3 2 1\n2\n','3\n3 2\n3 2'],['0 -1 0\n3\n','0\n0 -1\n0 0 -1'],['-5 -2 -4 -1\n2\n','-5\n-2 -5\n-2 -4\n-1 -2']],
    ['Keep at most k values in a min-heap.', 'The heap root is the smallest retained value.', 'Push new values until the heap contains k entries.', 'Once full, replace the root only when the new value is larger.', 'Sort a copy descending for each output line, without disturbing the heap.'],
    `import heapq
a = list(map(int, input().split()))
k = int(input())
heap = []
for x in a:
    if len(heap) < k:
        heapq.heappush(heap, x)
    elif x > heap[0]:
        heapq.heapreplace(heap, x)
    print(*sorted(heap, reverse=True))
`, 'A bounded min-heap retains the largest k arrivals; sorting a copy provides the requested display.', paramStarter
  ),
  'level-75-problem-5': make(
    'Running Median of a Stream', 'Print the median after each integer arrives. For an even number of arrivals, average the middle two. Maintain two balanced heaps.',
    listInput, 'Print one median per line, each with exactly one digit after the decimal point. Print nothing for an empty stream.', [],
    [['2 1 5 7\n','2.0\n1.5\n2.0\n3.5','The sorted prefixes have middle values 2, then 1 and 2, then 2, then 2 and 5.'],['-2 -4 -4\n','-2.0\n-3.0\n-4.0','The second median is the average of -4 and -2.'],['\n',''],['0\n','0.0'],['1 1 1\n','1.0\n1.0\n1.0'],['5 4 3 2 1\n','5.0\n4.5\n4.0\n3.5\n3.0'],['-1 0\n','-1.0\n-0.5'],['10000 -10000 0 0\n','10000.0\n0.0\n0.0\n0.0']],
    ['Keep the lower half in a max-heap and the upper half in a min-heap.', 'Negate values to implement the max-heap with heapq.', 'Insert into the appropriate half according to the lower maximum.', 'Rebalance so the lower half has the same size or one extra value.', 'Read the lower root for odd counts and average both roots for even counts.'],
    `import heapq
a = list(map(int, input().split()))
lower, upper = [], []
for x in a:
    if not lower or x <= -lower[0]:
        heapq.heappush(lower, -x)
    else:
        heapq.heappush(upper, x)
    if len(lower) > len(upper) + 1:
        heapq.heappush(upper, -heapq.heappop(lower))
    elif len(upper) > len(lower):
        heapq.heappush(lower, -heapq.heappop(upper))
    median = -lower[0] if len(lower) > len(upper) else (-lower[0] + upper[0]) / 2
    print(f'{median:.1f}')
`, 'Balance two heaps so their roots give the middle value or values.'
  )
};
