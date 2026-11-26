import { challenge } from './beginner.js';

const listStarter = "a = list(map(int, input().split()))\n\n# Compute and print the answer.\n";
const targetStarter = "a = list(map(int, input().split()))\ntarget = int(input())\n\n# Compute and print the answer.\n";

export const algorithms7680Challenges = {
  'level-76-problem-1': challenge(
    'Intersect Two Interval Lists',
    'Output every nonempty intersection between an interval from each list. Intervals are closed, so touching at an endpoint produces a singleton intersection.',
    'First line: n m. Next n lines: start end for the first list. Next m lines: start end for the second list.',
    'Print the number of intersections, followed by one start end pair per line in increasing order.',
    ['0 <= n, m <= 1000.', '-10000 <= start <= end <= 10000.', 'Each list is sorted by start and its intervals are pairwise disjoint, including endpoints.'],
    [
      ['2 2\n1 3\n6 8\n2 6\n8 9\n', '3\n2 3\n6 6\n8 8', 'The intersections are [2,3], the shared endpoint 6, and the shared endpoint 8.'],
      ['1 1\n1 2\n3 4\n', '0', 'The intervals are disjoint, so there are no intersections.'],
      ['0 0\n', '0'], ['1 1\n2 2\n2 2\n', '1\n2 2'], ['1 2\n0 10\n1 2\n4 5\n', '2\n1 2\n4 5'],
      ['2 1\n-5 -3\n-1 1\n-4 0\n', '2\n-4 -3\n-1 0'], ['0 1\n1 2\n', '0'], ['2 2\n1 2\n4 5\n1 2\n4 5\n', '2\n1 2\n4 5']
    ],
    ['Keep one current interval from each list.', 'Their overlap starts at the larger start and ends at the smaller end.', 'Record the overlap when its start is no greater than its end.', 'Advance the interval ending first; advance both when their ends match.', 'Stop when either list is exhausted and print the count before the pairs.'],
    `n, m = map(int, input().split())
a = [tuple(map(int, input().split())) for _ in range(n)]
b = [tuple(map(int, input().split())) for _ in range(m)]
i = j = 0
result = []
while i < n and j < m:
    start = max(a[i][0], b[j][0])
    end = min(a[i][1], b[j][1])
    if start <= end:
        result.append((start, end))
    if a[i][1] < b[j][1]:
        i += 1
    elif a[i][1] > b[j][1]:
        j += 1
    else:
        i += 1
        j += 1
print(len(result))
for start, end in result:
    print(start, end)
`,
    'The interval ending first cannot intersect any later interval in the opposite list.',
    "n, m = map(int, input().split())\na = [tuple(map(int, input().split())) for _ in range(n)]\nb = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Find and print the intersections.\n"
  ),
  'level-76-problem-2': challenge(
    'Three Values Summing to Zero',
    'Find every distinct nondecreasing triple of values from three distinct positions whose sum is zero. Equal values are allowed only when enough copies occur in the input.',
    'One line of space-separated integers; an empty line represents an empty list.',
    'Print the number of triples, then each triple on its own line in lexicographic order.',
    ['The list contains at most 500 integers.', 'Every integer is between -10000 and 10000.'],
    [
      ['-1 0 1 2 -1 -4\n', '2\n-1 -1 2\n-1 0 1', 'The two distinct zero-sum triples are -1,-1,2 and -1,0,1.'],
      ['0 0 0 0\n', '1\n0 0 0', 'Four zeroes yield only one distinct value triple.'],
      ['\n', '0'], ['1 2 3\n', '0'], ['-2 0 2\n', '1\n-2 0 2'], ['-2 1 1 1\n', '1\n-2 1 1'],
      ['-3 -2 0 2 3\n', '2\n-3 0 3\n-2 0 2'], ['-4 -1 -1 0 1 2 3\n', '3\n-4 1 3\n-1 -1 2\n-1 0 1']
    ],
    ['Sort the values first.', 'Fix the first position of a triple and scan the suffix with two pointers.', 'A sum below zero needs a larger left value; a sum above zero needs a smaller right value.', 'After a match, skip equal values at both pointers.', 'Skip repeated first values so each value triple appears once.'],
    `a = sorted(map(int, input().split()))
triples = []
for i in range(len(a) - 2):
    if i and a[i] == a[i - 1]:
        continue
    left, right = i + 1, len(a) - 1
    while left < right:
        total = a[i] + a[left] + a[right]
        if total < 0:
            left += 1
        elif total > 0:
            right -= 1
        else:
            triples.append((a[i], a[left], a[right]))
            x, y = a[left], a[right]
            while left < right and a[left] == x:
                left += 1
            while left < right and a[right] == y:
                right -= 1
print(len(triples))
for triple in triples:
    print(*triple)
`,
    'Sorting and skipping duplicates makes each zero-sum value triple appear exactly once.',
    listStarter
  ),
  'level-76-problem-3': challenge(
    'Closest Pair Sum to Target',
    'Choose two distinct positions whose values have a sum closest to the target. If several sums are equally close, choose the smaller sum.',
    'First line: space-separated integers. Second line: integer target.',
    'Print the chosen pair sum.',
    ['The list contains 2 to 1000 integers.', 'All integers, including the target, are between -10000 and 10000.'],
    [
      ['-4 -1 2 7\n3\n', '3', 'The sum -4+7 equals the target.'],
      ['1 3 5\n5\n', '4', 'Sums 4 and 6 are equally close; 4 is smaller.'],
      ['2 2\n9\n', '4'], ['-5 -3 -1\n-10\n', '-8'], ['0 0 0\n0\n', '0'],
      ['-10 5 8\n-2\n', '-2'], ['1 2 10\n100\n', '12'], ['-5 -2 4 9\n0\n', '-1']
    ],
    ['Sort the input values.', 'Start one pointer at each end.', 'Compare each candidate by distance from the target, then by its sum.', 'If the sum is below the target, move the left pointer right.', 'Otherwise move the right pointer left; stop when the pointers meet.'],
    `a = sorted(map(int, input().split()))
target = int(input())
left, right = 0, len(a) - 1
best = a[left] + a[right]
while left < right:
    total = a[left] + a[right]
    if (abs(total - target), total) < (abs(best - target), best):
        best = total
    if total < target:
        left += 1
    else:
        right -= 1
print(best)
`,
    'Moving the endpoint that can improve the sum explores all potentially better candidates.',
    targetStarter
  ),
  'level-76-problem-4': challenge(
    'Container with Most Water',
    'Two vertical lines at different list indices contain an area equal to their index distance times the smaller height. Find the maximum such area.',
    'One line of space-separated nonnegative heights; an empty line means no heights.',
    'Print the maximum area, or 0 if fewer than two heights are given.',
    ['The list has at most 1000 heights.', 'Each height is between 0 and 10000.'],
    [
      ['1 8 6 2 5 4 8 3 7\n', '49', 'Indices 1 and 8 give width 7 and height 7, for area 49.'],
      ['4 1 4\n', '8', 'The outer lines have width 2 and height 4.'],
      ['\n', '0'], ['3\n', '0'], ['0 0\n', '0'], ['1 1\n', '1'],
      ['1 2 3 4\n', '4'], ['5 1 1 5 1\n', '15']
    ],
    ['A pair contributes width times the shorter height.', 'Start with the widest possible pair.', 'Record its area.', 'Move the shorter line inward: keeping it cannot improve area with a smaller width.', 'Continue until the pointers meet, retaining the largest area.'],
    `a = list(map(int, input().split()))
left, right = 0, len(a) - 1
best = 0
while left < right:
    best = max(best, (right - left) * min(a[left], a[right]))
    if a[left] <= a[right]:
        left += 1
    else:
        right -= 1
print(best)
`,
    'Moving the shorter boundary discards only pairs no better than the one just evaluated.',
    listStarter
  ),
  'level-76-problem-5': challenge(
    'Count Pairs with Bounded Difference',
    'Count pairs of distinct indices i < j whose values differ by at most k. Repeated values at different indices count separately.',
    'First line: a nondecreasing list of space-separated integers, possibly empty. Second line: nonnegative integer k.',
    'Print the number of qualifying index pairs.',
    ['The list has at most 1000 integers.', '-10000 <= each value <= 10000.', '0 <= k <= 20000.'],
    [
      ['1 2 3 5\n2\n', '4', 'The qualifying pairs are (1,2), (1,3), (2,3), and (3,5).'],
      ['2 2 2\n0\n', '3', 'All three index pairs have difference zero.'],
      ['\n1\n', '0'], ['7\n0\n', '0'], ['1 4\n2\n', '0'], ['1 4\n3\n', '1'],
      ['-5 -3 0 4\n3\n', '2'], ['-1 0 0 1\n1\n', '5']
    ],
    ['Scan the right endpoint from left to right.', 'Keep the earliest left endpoint still within k of the right value.', 'Advance that left endpoint while the difference is too large.', 'Every index from left through right-1 then forms a valid pair with right.', 'Add right-left for each right endpoint.'],
    `a = list(map(int, input().split()))
k = int(input())
left = 0
count = 0
for right in range(len(a)):
    while a[right] - a[left] > k:
        left += 1
    count += right - left
print(count)
`,
    'Sorted values make valid earlier indices a contiguous suffix for each right endpoint.',
    targetStarter
  ),
  'level-77-problem-1': challenge(
    'Count Square-Free Integers',
    'Count the positive square-free integers from 1 through n inclusive. An integer is square-free if no square of an integer greater than 1 divides it; 1 is square-free.',
    'One integer n.',
    'Print the count.',
    ['0 <= n <= 100000.', 'Use a sieve that marks multiples of squares.'],
    [['10\n','7','The square-free values are 1, 2, 3, 5, 6, 7 and 10; 4, 8 and 9 are excluded.'], ['30\n','19','There are 30 positive values, of which 11 are divisible by a square greater than 1.'], ['0\n','0'], ['1\n','1'], ['4\n','3'], ['8\n','6'], ['25\n','16'], ['1000\n','608']],
    ['Start with the positive integers through n as candidates.', 'Any multiple of a square d*d with d greater than 1 is not square-free.', 'Only consider d with d*d <= n.', 'Mark every multiple of each such square; overlapping marks still exclude a value only once.', 'Count the unmarked positive values, including 1 when present.'],
    `from math import isqrt
n = int(input())
square_free = [True] * (n + 1)
for d in range(2, isqrt(n) + 1):
    square = d * d
    for multiple in range(square, n + 1, square):
        square_free[multiple] = False
print(sum(square_free[1:]))
`, 'Marking multiples of every square excludes exactly the non-square-free positive integers.',
    "n = int(input())\n\n# Count the square-free positive integers.\n"
  ),
  'level-77-problem-2': challenge(
    'Modular Exponentiation',
    'Compute base raised to exponent modulo modulus using repeated squaring. The zeroth power is 1, including when base is zero.',
    'One line: base exponent modulus.',
    'Print the least nonnegative remainder.',
    ['-1000000 <= base <= 1000000.', '0 <= exponent <= 1000000000.', '1 <= modulus <= 1000000.'],
    [['2 10 1000\n','24','1024 leaves remainder 24 modulo 1000.'], ['-2 3 5\n','2','-8 has least nonnegative remainder 2 modulo 5.'], ['0 0 7\n','1'], ['3 0 1\n','0'], ['0 5 8\n','0'], ['5 1 7\n','5'], ['2 20 17\n','16'], ['2 1000000000 1000\n','376']],
    ['Keep an accumulated result and a current power of the base.', 'Initialize the result to 1 modulo the modulus.', 'When the current exponent is odd, multiply the result by the current power.', 'Square the current power modulo the modulus and halve the exponent.', 'Stop when the exponent reaches zero.'],
    `base, exponent, modulus = map(int, input().split())
result = 1 % modulus
base %= modulus
while exponent:
    if exponent % 2:
        result = result * base % modulus
    base = base * base % modulus
    exponent //= 2
print(result)
`, 'Binary exponent digits select powers obtained by repeated modular squaring.',
    "base, exponent, modulus = map(int, input().split())\n\n# Compute the modular power.\n"
  ),
  'level-77-problem-3': challenge(
    'Canonical Extended Euclidean Coefficients',
    'Find g = gcd(a,b) and coefficients x,y with a*x+b*y=g. When b is nonzero, choose the unique x with 0 <= x < |b|/g. When b is zero, choose x as the sign of a and y=0.',
    'One line: integers a b, not both zero.',
    'Print g x y separated by spaces.',
    ['-1000000 <= a, b <= 1000000.', 'At least one input is nonzero.'],
    [['30 12\n','6 1 -2','30*1 + 12*(-2) = 6 and x is in [0,2).'], ['-7 5\n','1 2 3','-7*2 + 5*3 = 1, and 2 is the canonical x.'], ['0 -5\n','5 0 -1'], ['-6 0\n','6 -1 0'], ['1 1\n','1 0 1'], ['12 18\n','6 2 -1'], ['7 -5\n','1 3 4'], ['9 6\n','3 1 -1']],
    ['Euclid repeatedly replaces two nonnegative remainders by the second and their remainder.', 'Track each remainder as a linear combination of the absolute input values.', 'Apply the same quotient update to the coefficients, then restore the sign of a.', 'Reduce the resulting x modulo |b|/g when b is nonzero.', 'Recalculate y from (g-a*x)//b; handle b=0 separately.'],
    `a, b = map(int, input().split())
old_r, r = abs(a), abs(b)
old_x, x = 1, 0
while r:
    q = old_r // r
    old_r, r = r, old_r - q * r
    old_x, x = x, old_x - q * x
g = old_r
if b:
    x = (old_x * (-1 if a < 0 else 1)) % (abs(b) // g)
    y = (g - a * x) // b
else:
    x, y = (1 if a > 0 else -1), 0
print(g, x, y)
`, 'Euclid tracks a coefficient for each remainder; reducing x selects one canonical solution.',
    "a, b = map(int, input().split())\n\n# Print the gcd and canonical coefficients.\n"
  ),
  'level-77-problem-4': challenge(
    'Count Reciprocal Equation Solutions',
    'Count pairs of positive integers x <= y satisfying 1/x + 1/y = 1/n exactly. Count each pair once, not again in reverse order.',
    'One positive integer n.',
    'Print the number of pairs.',
    ['1 <= n <= 1000000000.', 'Use exact integer arithmetic.'],
    [['2\n','2','The pairs are (3,6) and (4,4).'], ['6\n','5','The pairs are (7,42), (8,24), (9,18), (10,15) and (12,12).'], ['1\n','1'], ['4\n','3'], ['12\n','8'], ['100000\n','61'], ['36\n','13'], ['9973\n','2']],
    ['Multiply the equation by n*x*y and rearrange it.', 'The rearranged equation is (x-n)*(y-n) = n*n.', 'Each positive factor pair of n*n gives a solution, with the smaller factor corresponding to x.', 'Factor n: if a prime has exponent e in n, it has exponent 2*e in n*n.', 'Multiply the values 2*e+1 to count divisors of n*n; since n*n is a square, the number of unordered factor pairs is (divisor count+1)//2.'],
    `n = int(input())
remaining = n
divisors = 1
p = 2
while p * p <= remaining:
    if remaining % p == 0:
        exponent = 0
        while remaining % p == 0:
            remaining //= p
            exponent += 1
        divisors *= 2 * exponent + 1
    p += 1
if remaining > 1:
    divisors *= 3
print((divisors + 1) // 2)
`, 'The equation gives factor pairs of n squared; its prime exponents count all divisors, and the central pair is counted once.',
    "n = int(input())\n\n# Count the reciprocal equation pairs.\n"
  ),
  'level-77-problem-5': challenge(
    'Largest Adjacent Prime Gap in an Interval',
    'Among consecutive primes within the inclusive interval, find the largest difference. Break ties by choosing the pair with the smaller first prime.',
    'One line: integers low high.',
    'Print the two primes and their difference, separated by spaces, or NONE if fewer than two primes occur.',
    ['0 <= low <= high <= 1000000.', 'high - low <= 10000.', 'Use a segmented sieve.'],
    [['2 20\n','7 11 4','The largest gap is 4, first occurring between 7 and 11.'], ['14 16\n','NONE','The interval has no primes.'], ['2 3\n','2 3 1'], ['0 2\n','NONE'], ['2 5\n','3 5 2'], ['20 30\n','23 29 6'], ['90 100\n','NONE'], ['3 13\n','7 11 4']],
    ['First sieve primes up to the square root of high.', 'Create a Boolean flag for each integer in the requested interval.', 'For each small prime, mark interval multiples starting no earlier than its square.', 'Exclude 0 and 1, then scan the remaining primes in order.', 'Update the best pair only for a strictly larger gap, preserving the earliest tie.'],
    `from math import isqrt
low, high = map(int, input().split())
limit = isqrt(high)
small = [True] * (limit + 1)
for p in range(2, isqrt(limit) + 1):
    if small[p]:
        for v in range(p * p, limit + 1, p):
            small[v] = False
prime = [True] * (high - low + 1)
for p in range(2, limit + 1):
    if small[p]:
        start = max(p * p, ((low + p - 1) // p) * p)
        for v in range(start, high + 1, p):
            prime[v - low] = False
previous = None
best = None
for v in range(max(2, low), high + 1):
    if prime[v - low]:
        if previous is not None and (best is None or v - previous > best[2]):
            best = (previous, v, v - previous)
        previous = v
if best is None:
    print('NONE')
else:
    print(*best)
`, 'Mark composites using base primes, then retain the first largest gap during an ordered scan.',
    "low, high = map(int, input().split())\n\n# Find the largest adjacent-prime gap.\n"
  ),
  'level-78-problem-1': challenge(
    'Schedule Activities in K Rooms',
    'Choose the maximum number of activities that can be assigned to k rooms, with at most one activity per room at any time. Activities are half-open, so a room can be reused when an activity ends.',
    'First line: n k. Next n lines: start end.',
    'Print the maximum number of activities that can be scheduled.',
    ['0 <= n <= 1000.', '0 <= k <= 1000.', '-1000 <= start < end <= 1000.'],
    [['4 2\n0 5\n0 3\n1 2\n2 4\n','3','Discard [0,5); the other three fit in two rooms.'], ['3 1\n0 3\n1 2\n2 4\n','2','With one room, choose [1,2) and [2,4).'], ['0 0\n','0'], ['1 0\n-1 0\n','0'], ['3 1\n0 1\n1 2\n2 3\n','3'], ['3 2\n0 4\n0 4\n0 4\n','2'], ['3 3\n-5 -3\n-4 0\n-3 -1\n','3'], ['4 1\n0 10\n1 2\n2 3\n3 4\n','3']],
    ['Process activities by start time.', 'Keep the end times of selected activities that are still active.', 'Remove finished activities before considering a new start.', 'If more than k activities are active, discard one with the latest end.', 'Count selected activities across the entire schedule, not just those still active.'],
    `import heapq
n, k = map(int, input().split())
activities = sorted(tuple(map(int, input().split())) for _ in range(n))
active = []
selected = 0
for start, end in activities:
    active = [e for e in active if -e > start]
    heapq.heapify(active)
    heapq.heappush(active, -end)
    selected += 1
    if len(active) > k:
        heapq.heappop(active)
        selected -= 1
print(selected)
`, 'When capacity is exceeded, discarding the latest-ending active activity leaves maximum room for future activities.',
    "n, k = map(int, input().split())\nactivities = [tuple(map(int, input().split())) for _ in range(n)]\n\n# Find the maximum number of scheduled activities.\n"
  ),
  'level-78-problem-2': challenge(
    'Minimum Meeting Rooms',
    'Find the fewest rooms needed for all meetings, with one meeting per room at a time. Meetings are half-open: a room freed at time t can be reused at t.',
    'First line: n. Next n lines: start end.',
    'Print the minimum number of rooms.',
    ['0 <= n <= 1000.', '-1000 <= start < end <= 1000.'],
    [['3\n0 5\n1 3\n3 6\n','2','At most two meetings overlap; the room freed at 3 is reused.'], ['2\n1 2\n2 4\n','1','The meetings touch but do not overlap.'], ['0\n','0'], ['1\n0 1\n','1'], ['3\n1 5\n1 5\n1 5\n','3'], ['3\n0 10\n2 3\n4 5\n','2'], ['3\n-3 -1\n-2 2\n0 1\n','2'], ['4\n0 4\n1 3\n2 5\n4 6\n','3']],
    ['Each room can be reused as soon as its meeting ends.', 'Sort meetings by start time.', 'Maintain a min-heap of end times for active meetings.', 'Remove all end times at or before the next start before adding that meeting.', 'The largest heap size is the number of rooms required.'],
    `import heapq
n = int(input())
meetings = sorted(tuple(map(int, input().split())) for _ in range(n))
ends = []
best = 0
for start, end in meetings:
    while ends and ends[0] <= start:
        heapq.heappop(ends)
    heapq.heappush(ends, end)
    best = max(best, len(ends))
print(best)
`, 'The peak simultaneous meeting count is both necessary and sufficient for room allocation.',
    "n = int(input())\nmeetings = [tuple(map(int, input().split())) for _ in range(n)]\n\n# Find the number of rooms.\n"
  ),
  'level-78-problem-3': challenge(
    'Time with At Least K Active Intervals',
    'Compute the total duration covered by at least k of the given half-open intervals. Overlapping copies count separately.',
    'First line: n k. Next n lines: start end.',
    'Print the total duration as an integer.',
    ['0 <= n <= 1000.', '1 <= k <= 1000.', '-1000 <= start < end <= 1000.'],
    [['3 2\n0 4\n2 6\n3 5\n','3','At least two intervals are active from 2 through 5, a duration of 3.'], ['2 2\n0 1\n1 2\n','0','The intervals only touch, so they have no positive-duration overlap.'], ['0 1\n','0'], ['1 1\n-3 2\n','5'], ['2 1\n0 2\n4 7\n','5'], ['2 2\n0 5\n0 5\n','5'], ['3 4\n0 3\n1 2\n1 4\n','0'], ['3 2\n0 2\n1 3\n2 4\n','2']],
    ['Represent each start by +1 and each end by -1.', 'Combine all changes at the same time.', 'Process event times in increasing order.', 'Before applying changes at a time, add the preceding gap if its active count is at least k.', 'Shared endpoints contribute no duration by themselves.'],
    `n, k = map(int, input().split())
events = {}
for _ in range(n):
    start, end = map(int, input().split())
    events[start] = events.get(start, 0) + 1
    events[end] = events.get(end, 0) - 1
count = total = 0
previous = None
for time in sorted(events):
    if previous is not None and count >= k:
        total += time - previous
    count += events[time]
    previous = time
print(total)
`, 'The active count is constant between consecutive aggregated event times.',
    "n, k = map(int, input().split())\nintervals = [tuple(map(int, input().split())) for _ in range(n)]\n\n# Measure the time with at least k active intervals.\n"
  ),
  'level-78-problem-4': challenge(
    'Cover a Line Segment',
    'Find the fewest supplied closed intervals whose union covers every point of the closed target segment. Intervals may extend beyond the target and may touch.',
    'First line: n left right. Next n lines: start end.',
    'Print the minimum number, or -1 if covering the segment is impossible.',
    ['0 <= n <= 100.', '-1000 <= left < right <= 1000.', '-1000 <= start <= end <= 1000.'],
    [['3 0 5\n0 2\n2 5\n1 4\n','2','Intervals [0,2] and [2,5] cover the target with two.'], ['2 0 5\n0 2\n3 5\n','-1','The gap between 2 and 3 cannot be covered.'], ['0 0 1\n','-1'], ['1 0 4\n-1 5\n','1'], ['2 0 4\n0 0\n0 4\n','1'], ['3 -3 2\n-4 -1\n-1 0\n0 2\n','3'], ['2 0 5\n0 4\n1 3\n','-1'], ['3 0 6\n0 2\n0 4\n4 6\n','2']],
    ['Sort the intervals by start.', 'Keep the rightmost point covered so far, starting at left.', 'Among intervals starting at or before that point, choose the furthest end.', 'If none extends coverage, the target cannot be covered.', 'Repeat until reaching right and count the chosen intervals.'],
    `n, left, right = map(int, input().split())
intervals = sorted(tuple(map(int, input().split())) for _ in range(n))
covered = left
i = count = 0
while covered < right:
    furthest = covered
    while i < n and intervals[i][0] <= covered:
        furthest = max(furthest, intervals[i][1])
        i += 1
    if furthest == covered:
        count = -1
        break
    covered = furthest
    count += 1
print(count)
`, 'Choosing the furthest reachable end never uses more intervals than a shorter extension.',
    "n, left, right = map(int, input().split())\nintervals = [tuple(map(int, input().split())) for _ in range(n)]\n\n# Cover the target segment.\n"
  ),
  'level-78-problem-5': challenge(
    'Fractional Knapsack',
    'Maximize total value in a knapsack of the given capacity when any fraction of an item may be taken. An item taken fractionally contributes the same fraction of its value.',
    'First line: n capacity. Next n lines: weight value.',
    'Print the exact maximum as reduced numerator and positive denominator, separated by a space.',
    ['0 <= n <= 100.', '0 <= capacity <= 1000.', '1 <= weight <= 1000 and 0 <= value <= 1000.'],
    [['2 3\n2 6\n2 4\n','8 1','Take the first item fully and half of the second, for value 8.'], ['1 1\n3 5\n','5 3','One third of the item contributes 5/3.'], ['0 5\n','0 1'], ['1 0\n2 3\n','0 1'], ['1 9\n2 3\n','3 1'], ['2 1\n2 1\n3 2\n','2 3'], ['2 2\n1 0\n2 4\n','4 1'], ['3 5\n2 4\n3 6\n5 10\n','10 1']],
    ['Compare items by value divided by weight.', 'Take the highest-value-density item before a lower-density item.', 'Take an item fully when it fits, otherwise take only the remaining-capacity fraction.', 'Use exact rational arithmetic rather than rounding.', 'Reduce the fraction and print both numerator and denominator.'],
    `from fractions import Fraction
n, capacity = map(int, input().split())
items = [tuple(map(int, input().split())) for _ in range(n)]
items.sort(key=lambda item: Fraction(item[1], item[0]), reverse=True)
value = Fraction(0)
for weight, worth in items:
    taken = min(capacity, weight)
    value += Fraction(taken * worth, weight)
    capacity -= taken
    if capacity == 0:
        break
print(value.numerator, value.denominator)
`, 'Taking higher value density first maximizes the value contributed by each unit of capacity.',
    "n, capacity = map(int, input().split())\nitems = [tuple(map(int, input().split())) for _ in range(n)]\n\n# Find the exact optimal value.\n"
  ),
  'level-79-problem-1': challenge(
    'Longest Uniform Window After Replacements',
    'Find the maximum length of a contiguous substring that can be made entirely one character by replacing at most k characters.',
    'First line: a string of uppercase ASCII letters, possibly empty. Second line: integer k.',
    'Print the maximum length.',
    ['The string contains at most 1000 characters.', '0 <= k <= 1000.'],
    [['AABABBA\n1\n','4','AABA can become AAAA by replacing its B.'], ['ABCD\n0\n','1','Without replacements, each uniform substring has length at most one.'], ['\n3\n','0'], ['AAAA\n0\n','4'], ['ABCD\n3\n','4'], ['ABAB\n1\n','3'], ['BAAAAB\n1\n','5'], ['ABCABC\n2\n','4']],
    ['For a window, retain the most frequent letter and replace the others.', 'The required replacements equal the window length minus that frequency.', 'Extend the right edge and count letters.', 'Shrink the left edge while the window needs more than k replacements.', 'Track the greatest valid window length.'],
    `s = input()
k = int(input())
counts = {}
left = best = 0
for right, char in enumerate(s):
    counts[char] = counts.get(char, 0) + 1
    while right - left + 1 - max(counts.values()) > k:
        counts[s[left]] -= 1
        left += 1
    best = max(best, right - left + 1)
print(best)
`, 'The frequency of the most common character minimizes replacements within each window.',
    "s = input()\nk = int(input())\n\n# Find the longest window.\n"
  ),
  'level-79-problem-2': challenge(
    'Count Subarrays with At Most K Distinct Values',
    'Count nonempty contiguous subarrays containing at most k distinct values. Different index ranges count separately.',
    'First line: space-separated integers, possibly empty. Second line: integer k.',
    'Print the count.',
    ['The list contains at most 1000 integers.', '-10000 <= each value <= 10000.', '0 <= k <= 1000.'],
    [['1 2 1\n2\n','6','All six nonempty subarrays contain at most two values.'], ['1 2 1\n1\n','3','Only the three singleton subarrays qualify.'], ['\n1\n','0'], ['1 1 1\n0\n','0'], ['2 2 2\n1\n','6'], ['1 2 3\n2\n','5'], ['1 2 1 3\n2\n','8'], ['-1 0 -1 0\n3\n','10']],
    ['Scan the right endpoint and maintain frequencies in the current window.', 'Remove leftmost values while there are more than k distinct values.', 'Delete a frequency entry when it drops to zero.', 'Every suffix of the remaining window ending at right is valid.', 'Add the window length to the answer for each right endpoint.'],
    `a = list(map(int, input().split()))
k = int(input())
counts = {}
left = total = 0
for right, value in enumerate(a):
    counts[value] = counts.get(value, 0) + 1
    while len(counts) > k:
        old = a[left]
        counts[old] -= 1
        if counts[old] == 0:
            del counts[old]
        left += 1
    total += right - left + 1
print(total)
`, 'After shrinking, all and only suffixes beginning at or after left satisfy the distinct-value bound.',
    targetStarter
  ),
  'level-79-problem-3': challenge(
    'Maximum Width Ramp',
    'Find the maximum j-i over indices i < j where a[i] <= a[j]. Return zero when no such pair exists.',
    'One line of space-separated integers; an empty line is an empty list.',
    'Print the maximum width.',
    ['The list has at most 1000 integers.', '-10000 <= each value <= 10000.'],
    [['6 0 8 2 1 5\n','4','Indices 1 and 5 form a ramp of width 4.'], ['5 4 3\n','0','No earlier value is at most a later value.'], ['\n','0'], ['1\n','0'], ['2 2\n','1'], ['1 2 3\n','2'], ['9 1 2 0 1\n','3'], ['3 1 4 1 5 9\n','5']],
    ['A later index with a value no smaller than an earlier candidate cannot improve that candidate.', 'Build a stack of indices whose values strictly decrease.', 'Scan possible right endpoints from right to left.', 'While the top candidate value is at most the right value, record the width and pop it.', 'The first qualifying right endpoint for a candidate is its furthest one.'],
    `a = list(map(int, input().split()))
stack = []
for i, value in enumerate(a):
    if not stack or value < a[stack[-1]]:
        stack.append(i)
best = 0
for j in range(len(a) - 1, -1, -1):
    while stack and a[stack[-1]] <= a[j]:
        i = stack.pop()
        best = max(best, j - i)
print(best)
`, 'The decreasing stack keeps only potentially optimal left endpoints; reverse scanning finds their furthest valid ends.',
    listStarter
  ),
  'level-79-problem-4': challenge(
    'Sliding Window Maximum',
    'Find the maximum value of every contiguous window of width k, in left-to-right order.',
    'First line: space-separated integers. Second line: window width k.',
    'Print the maxima separated by spaces.',
    ['The list contains 1 to 1000 integers.', '-10000 <= each value <= 10000.', '1 <= k <= the list length.', 'Use a linear-time monotonic deque.'],
    [['1 3 -1 -3 5 3 6 7\n3\n','3 3 5 5 6 7','The six width-three maxima are 3, 3, 5, 5, 6 and 7.'], ['4 2 4\n2\n','4 4','Both windows contain a 4.'], ['5\n1\n','5'], ['1 2 3\n1\n','1 2 3'], ['1 2 3\n3\n','3'], ['3 2 1\n2\n','3 2'], ['-3 -1 -2\n2\n','-1 -1'], ['2 2 2 2\n3\n','2 2']],
    ['Keep indices of candidate maxima in a deque.', 'Remove indices that have left the current window from its front.', 'Remove smaller or equal values from its back when a new value arrives.', 'Append the new index; the front now holds the maximum.', 'Output a maximum once the first full window has formed.'],
    `from collections import deque
a = list(map(int, input().split()))
k = int(input())
q = deque()
result = []
for i, value in enumerate(a):
    while q and q[0] <= i - k:
        q.popleft()
    while q and a[q[-1]] <= value:
        q.pop()
    q.append(i)
    if i >= k - 1:
        result.append(a[q[0]])
print(*result)
`, 'The deque retains only unexpired indices that could become a window maximum.',
    targetStarter
  ),
  'level-79-problem-5': challenge(
    'Longest Subarray Within a Value Range',
    'Find the longest contiguous subarray whose maximum minus minimum is at most the given nonnegative limit.',
    'First line: space-separated integers, possibly empty. Second line: integer limit.',
    'Print the maximum length, or 0 for an empty list.',
    ['The list has at most 1000 integers.', '-10000 <= each value <= 10000.', '0 <= limit <= 20000.'],
    [['8 2 4 7\n4\n','2','The valid windows [2,4] and [4,7] have length two; no longer window qualifies.'], ['1 1 2 2\n0\n','2','The longest constant runs have length two.'], ['\n0\n','0'], ['5\n0\n','1'], ['1 2 3\n2\n','3'], ['1 10 1\n1\n','1'], ['-3 -2 0 -1\n2\n','3'], ['4 4 4\n0\n','3']],
    ['Keep one deque of candidate minimum indices and one of maximum indices.', 'Remove dominated values at the back when adding a new index.', 'Compare the two front values to test the current range.', 'Move the left edge and remove expired fronts until the range fits.', 'Track the largest remaining window length.'],
    `from collections import deque
a = list(map(int, input().split()))
limit = int(input())
mins, maxs = deque(), deque()
left = best = 0
for right, value in enumerate(a):
    while mins and a[mins[-1]] >= value:
        mins.pop()
    while maxs and a[maxs[-1]] <= value:
        maxs.pop()
    mins.append(right)
    maxs.append(right)
    while a[maxs[0]] - a[mins[0]] > limit:
        if mins[0] == left:
            mins.popleft()
        if maxs[0] == left:
            maxs.popleft()
        left += 1
    best = max(best, right - left + 1)
print(best)
`, 'Monotonic deques expose the current minimum and maximum while each index enters and leaves at most once.',
    targetStarter
  ),
  'level-80-problem-1': challenge(
    'Minimum Capacity for Ordered Loads',
    'Ship all weights in their given order within at most d days. Each day takes a contiguous group of whole weights whose sum is at most the capacity. Find the smallest integer capacity.',
    'First line: space-separated positive weights. Second line: positive integer d.',
    'Print the minimum capacity.',
    ['The list contains 1 to 1000 weights.', '1 <= each weight <= 10000.', '1 <= d <= 1000.'],
    [['1 2 3 4 5\n3\n','6','Capacity 6 ships [1,2,3], [4], and [5] in three days.'], ['3 2 2 4 1 4\n3\n','6','Capacity 6 ships [3,2], [2,4], and [1,4].'], ['5\n1\n','5'], ['1 1 1\n1\n','3'], ['2 3 4\n5\n','4'], ['5 5 5 5\n2\n','10'], ['1 2 3 4\n2\n','6'], ['10 1 1 10\n2\n','11']],
    ['The capacity must be at least the largest weight and at most the total weight.', 'For a candidate capacity, load consecutive weights greedily until the next would exceed it.', 'Start a new day whenever the next weight does not fit.', 'A capacity is feasible when the resulting day count is at most d.', 'Binary-search the first feasible capacity.'],
    `weights = list(map(int, input().split()))
d = int(input())
lo, hi = max(weights), sum(weights)
while lo < hi:
    cap = (lo + hi) // 2
    days, load = 1, 0
    for weight in weights:
        if load + weight > cap:
            days += 1
            load = 0
        load += weight
    if days <= d:
        hi = cap
    else:
        lo = cap + 1
print(lo)
`, 'Greedy loading minimizes days for a capacity, and feasibility is monotone as capacity increases.',
    "weights = list(map(int, input().split()))\nd = int(input())\n\n# Find the minimum capacity.\n"
  ),
  'level-80-problem-2': challenge(
    'Minimum Eating Rate',
    'Find the smallest positive integer rate that finishes all piles within h hours. In each hour work on only one pile, eating at most rate units; unused time in that hour cannot be used on another pile.',
    'First line: space-separated positive pile sizes. Second line: integer h.',
    'Print the minimum rate.',
    ['The list contains 1 to 1000 piles.', '1 <= each pile <= 10000.', 'The number of piles <= h <= 10000000.'],
    [['3 6 7 11\n8\n','4','At rate 4 the piles take 1, 2, 2 and 3 hours.'], ['5 5\n2\n','5','Each pile must be finished in one hour.'], ['1\n1\n','1'], ['9\n3\n','3'], ['2 3\n10\n','1'], ['30 11 23 4 20\n5\n','30'], ['30 11 23 4 20\n6\n','23'], ['1 2 3\n4\n','2']],
    ['A pile of size p takes ceil(p/rate) whole hours.', 'Sum these hours for a candidate rate.', 'Rate 1 is the smallest possible; the largest pile always finishes each pile in one hour.', 'Feasibility is monotone: a faster rate cannot take more hours.', 'Binary-search for the first feasible rate.'],
    `piles = list(map(int, input().split()))
h = int(input())
lo, hi = 1, max(piles)
while lo < hi:
    rate = (lo + hi) // 2
    hours = sum((p + rate - 1) // rate for p in piles)
    if hours <= h:
        hi = rate
    else:
        lo = rate + 1
print(lo)
`, 'Ceiling division gives the hours at a rate, and binary search locates the first feasible rate.',
    "piles = list(map(int, input().split()))\nh = int(input())\n\n# Find the minimum rate.\n"
  ),
  'level-80-problem-3': challenge(
    'Maximum Minimum Placement Distance',
    'Choose k distinct positions for k items to maximize the smallest distance between any two chosen positions.',
    'First line: space-separated distinct integer positions. Second line: integer k.',
    'Print the maximum possible minimum distance.',
    ['There are 2 to 1000 distinct positions.', '-10000 <= each position <= 10000.', '2 <= k <= the number of positions.'],
    [['1 2 4 8 9\n3\n','3','Choosing 1, 4 and 8 gives minimum distance 3.'], ['0 10 5\n2\n','10','The two extreme positions are distance 10 apart.'], ['1 2\n2\n','1'], ['-5 0 5\n3\n','5'], ['1 2 3 4\n4\n','1'], ['1 2 10 11\n3\n','1'], ['-10 -1 0 9\n2\n','19'], ['0 3 6 10\n3\n','4']],
    ['Sort the positions.', 'For a candidate distance, place the first item at the first position.', 'Greedily place each next item at the earliest position far enough away.', 'The distance is feasible if at least k items can be placed.', 'Binary-search the greatest feasible distance.'],
    `positions = sorted(map(int, input().split()))
k = int(input())
lo, hi = 0, positions[-1] - positions[0] + 1
while lo + 1 < hi:
    distance = (lo + hi) // 2
    count, last = 1, positions[0]
    for position in positions[1:]:
        if position - last >= distance:
            count += 1
            last = position
    if count >= k:
        lo = distance
    else:
        hi = distance
print(lo)
`, 'Earliest feasible placements leave the most room for later items, making the feasibility test monotone.',
    "positions = list(map(int, input().split()))\nk = int(input())\n\n# Find the greatest minimum distance.\n"
  ),
  'level-80-problem-4': challenge(
    'Vertices on Functional Graph Cycles',
    'Each index i has one directed edge to a[i]. Find every vertex that belongs to a directed cycle, including self-loops, across all components. Vertices merely leading into a cycle do not belong to it.',
    'One line of space-separated integers a; an empty line is an empty graph.',
    'Print the cycle vertices in increasing order, separated by spaces. Print an empty line when there are none.',
    ['The list has n elements, where 0 <= n <= 1000.', 'Each value a[i] is an integer from 0 through n-1.'],
    [['1 2 1 4 3\n','1 2 3 4','Vertices 1 and 2 form one cycle, and 3 and 4 another; 0 only leads into a cycle.'], ['1 2 3 3\n','3','Only vertex 3 lies on a cycle; it has a self-loop.'], ['\n',''], ['0\n','0'], ['1 0\n','0 1'], ['0 0 0\n','0'], ['1 2 0 4 3\n','0 1 2 3 4'], ['1 2 3 1 2 4\n','1 2 3']],
    ['Count the incoming edges of every vertex.', 'Vertices with no incoming edges cannot lie on a cycle.', 'Queue these vertices and remove their outgoing edges one by one.', 'When a neighbor loses its last incoming edge, queue it as well.', 'Exactly the vertices left after this pruning lie on cycles; print them in order.'],
    `from collections import deque
a = list(map(int, input().split()))
indegree = [0] * len(a)
for next_vertex in a:
    indegree[next_vertex] += 1
queue = deque(i for i, degree in enumerate(indegree) if degree == 0)
while queue:
    vertex = queue.popleft()
    neighbor = a[vertex]
    indegree[neighbor] -= 1
    if indegree[neighbor] == 0:
        queue.append(neighbor)
print(*(i for i, degree in enumerate(indegree) if degree > 0))
`, 'Pruning zero-indegree vertices removes all incoming trees and leaves precisely the directed cycles.',
    listStarter
  ),
  'level-80-problem-5': challenge(
    'Lexicographic Rank of a Permutation',
    'Find the one-based lexicographic rank of the given ordering among all permutations of its distinct values. The empty ordering has rank 1.',
    'One line of space-separated distinct integers; an empty line is the empty ordering.',
    'Print the rank as an integer.',
    ['The list has at most 12 values.', '-10000 <= each value <= 10000.', 'All values are distinct.'],
    [['2 1 3\n','3','The sorted permutations begin 1 2 3, 1 3 2, then 2 1 3.'], ['3 2 1\n','6','The descending ordering is last among six permutations.'], ['\n','1'], ['9\n','1'], ['1 2 3\n','1'], ['1 3 2\n','2'], ['2 3 1\n','4'], ['-1 -3 0 2\n','7']],
    ['Sort the values to know the available choices at each position.', 'Count unused values smaller than the current value.', 'Each such smaller choice starts a block of factorial(remaining positions) permutations.', 'Add those block sizes to a rank initialized to one.', 'Remove the current value before considering the next position.'],
    `from math import factorial
a = list(map(int, input().split()))
remaining = sorted(a)
rank = 1
for i, value in enumerate(a):
    smaller = remaining.index(value)
    rank += smaller * factorial(len(a) - i - 1)
    remaining.pop(smaller)
print(rank)
`, 'Each smaller unused value fixes a preceding lexicographic block of factorial-sized suffixes.',
    listStarter
  )
};
