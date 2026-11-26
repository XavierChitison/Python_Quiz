import { challenge } from './beginner.js';

const lineStarter = 'line = input()\n\n# Compute and print the answer.\n';
const coinsStarter = 'amount = int(input())\ncoins = list(map(int, input().split()))\n\n# Compute and print the answer.\n';
const numbersStarter = 'numbers = list(map(int, input().split()))\n\n# Compute and print the answer.\n';

export const advanced96100Challenges = {
  'level-96-problem-1': challenge(
    'N-Queens Solutions',
    'List every placement of n queens, one per row, with no shared column or diagonal.',
    'One integer n.',
    'Print each placement on its own line as n space-separated zero-based column numbers in row order, sorted lexicographically. If no placement exists print NONE. For n=0 print EMPTY for the one empty placement.',
    ['0 <= n <= 8.'],
    [['4\n', '1 3 0 2\n2 0 3 1', 'There are two valid placements, shown in lexicographic order.'], ['2\n', 'NONE', 'Both possible placements put the queens on a shared diagonal.'], ['0\n', 'EMPTY'], ['1\n', '0'], ['3\n', 'NONE'], ['5\n', '0 2 4 1 3\n0 3 1 4 2\n1 3 0 2 4\n1 4 2 0 3\n2 0 3 1 4\n2 4 1 3 0\n3 0 2 4 1\n3 1 4 2 0\n4 1 3 0 2\n4 2 0 3 1'], ['6\n', '1 3 5 0 2 4\n2 5 1 4 0 3\n3 0 4 1 5 2\n4 2 0 5 3 1'], ['7\n', '0 2 4 6 1 3 5\n0 3 6 2 5 1 4\n0 4 1 5 2 6 3\n0 5 3 1 6 4 2\n1 3 0 6 4 2 5\n1 3 5 0 2 4 6\n1 4 0 3 6 2 5\n1 4 2 0 6 3 5\n1 4 6 3 0 2 5\n1 5 2 6 3 0 4\n1 6 4 2 0 5 3\n2 0 5 1 4 6 3\n2 0 5 3 1 6 4\n2 4 6 1 3 5 0\n2 5 1 4 0 3 6\n2 6 1 3 5 0 4\n2 6 3 0 4 1 5\n3 0 2 5 1 6 4\n3 0 4 1 5 2 6\n3 1 6 4 2 0 5\n3 5 0 2 4 6 1\n3 6 2 5 1 4 0\n3 6 4 1 5 0 2\n4 0 3 6 2 5 1\n4 0 5 3 1 6 2\n4 1 5 2 6 3 0\n4 2 0 5 3 1 6\n4 6 1 3 5 0 2\n4 6 1 5 2 0 3\n5 0 2 4 6 1 3\n5 1 4 0 3 6 2\n5 2 0 3 6 4 1\n5 2 4 6 0 3 1\n5 2 6 3 0 4 1\n5 3 1 6 4 2 0\n5 3 6 0 2 4 1\n6 1 3 5 0 2 4\n6 2 5 1 4 0 3\n6 3 0 4 1 5 2\n6 4 2 0 5 3 1']],
    ['Place one queen in each successive row.', 'Try columns in ascending order.', 'Reject a column already used.', 'Reject either diagonal identified by row minus column or row plus column.', 'Undo each placement after exploring its continuations.'],
    `n = int(input())
solutions = []
def search(path, columns, down, up):
    row = len(path)
    if row == n:
        solutions.append(' '.join(map(str, path)) if path else 'EMPTY')
        return
    for col in range(n):
        if col not in columns and row - col not in down and row + col not in up:
            search(path + [col], columns | {col}, down | {row - col}, up | {row + col})
search([], set(), set(), set())
print('\\n'.join(solutions) if solutions else 'NONE')
`, 'Row-by-row backtracking checks used columns and diagonals, emitting ascending choices in lexicographic order.', 'n = int(input())\n\n# Enumerate and print placements.\n'
  ),
  'level-96-problem-2': challenge(
    'Solve a Sudoku Grid',
    'Complete the 9-by-9 Sudoku grid. Every row, column and 3-by-3 box must contain digits 1 through 9 exactly once. Preserve all nonzero clues. If multiple solutions exist, choose the lexicographically smallest sequence of rows.',
    'Nine lines of nine digits each; 0 represents an empty cell.',
    'Print nine lines of nine digits for the selected solution, or NONE if the clues cannot be completed, including conflicting clues.',
    ['Each input row has exactly nine ASCII digits.', 'At most 18 cells are zero.'],
    [
      ['034678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179\n', '534678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179', 'The missing digit in the first row is 5, which also fits its column and box.'],
      ['134678902\n672195348\n098342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179\n', 'NONE', 'The first row needs 5 in its only blank, but its column already contains 5.'],
      ['561847923\n379521684\n428963175\n613789542\n794652318\n852134796\n935478261\n146295837\n287316459\n', '561847923\n379521684\n428963175\n613789542\n794652318\n852134796\n935478261\n146295837\n287316459'],
      ['554678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179\n', 'NONE'],
      ['000000000\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179\n', '534678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179'],
      ['534008912\n672195348\n198342567\n859001423\n426853791\n713924856\n961537284\n287419635\n345286179\n', '534678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179'],
      ['000000000\n000000000\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179\n', '534678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179'],
      ['435678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179\n', 'NONE']
    ],
    ['Reject conflicting clues before filling cells.', 'Visit empty cells in row-major order.', 'Try digits 1 through 9 in ascending order.', 'A candidate must be absent from its row, column and 3-by-3 box.', 'Undo a candidate when its continuation fails; the first complete grid is lexicographically smallest.'],
    `grid = [list(input()) for _ in range(9)]
def allowed(r, c, value):
    return all(grid[r][j] != value for j in range(9)) and all(grid[i][c] != value for i in range(9)) and all(grid[i][j] != value for i in range(r // 3 * 3, r // 3 * 3 + 3) for j in range(c // 3 * 3, c // 3 * 3 + 3))
valid = True
for r in range(9):
    for c in range(9):
        value = grid[r][c]
        if value != '0':
            grid[r][c] = '0'
            if not allowed(r, c, value):
                valid = False
            grid[r][c] = value
empty = [(r, c) for r in range(9) for c in range(9) if grid[r][c] == '0']
def solve(i):
    if i == len(empty):
        return True
    r, c = empty[i]
    for digit in '123456789':
        if allowed(r, c, digit):
            grid[r][c] = digit
            if solve(i + 1):
                return True
            grid[r][c] = '0'
    return False
if valid and solve(0):
    print('\\n'.join(''.join(row) for row in grid))
else:
    print('NONE')
`, 'Validate clues, then backtrack over blanks in row-major order with ascending digits to obtain the smallest solution.', 'grid = [input() for _ in range(9)]\n\n# Complete and print the grid, or print NONE.\n'
  ),
  'level-96-problem-3': challenge(
    'Word Search in a Grid',
    'Decide whether the word can be traced through orthogonally adjacent cells without using any cell more than once. The empty word is always traceable.',
    'First line: rows columns. Then rows lines each contain columns lowercase letters. The final line is the word, possibly empty.',
    'Print YES if the word can be traced; otherwise print NO.',
    ['1 <= rows, columns <= 5.', 'The word contains at most 12 lowercase letters.'],
    [['2 3\nabc\ndef\nabe\n', 'YES', 'The path a to b to e uses adjacent cells once each.'], ['2 2\nab\ncd\naba\n', 'NO', 'Returning to the first a would reuse its cell.'], ['1 1\na\n\n', 'YES'], ['1 1\na\na\n', 'YES'], ['1 1\na\nb\n', 'NO'], ['2 2\nab\ncd\nad\n', 'NO'], ['2 2\naa\naa\naaaa\n', 'YES'], ['1 3\nabc\ncba\n', 'YES']],
    ['Try each cell as a starting position.', 'The current cell must match the next needed character.', 'Explore only its four orthogonal neighbors.', 'Mark a cell used while exploring its continuation, then undo the mark.', 'An empty word is a successful path without visiting a cell.'],
    `r, c = map(int, input().split())
grid = [input() for _ in range(r)]
word = input()
def visit(i, j, k, used):
    if k == len(word):
        return True
    if not (0 <= i < r and 0 <= j < c) or (i, j) in used or grid[i][j] != word[k]:
        return False
    used.add((i, j))
    result = any(visit(i + di, j + dj, k + 1, used) for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)))
    used.remove((i, j))
    return result
print('YES' if not word or any(visit(i, j, 0, set()) for i in range(r) for j in range(c)) else 'NO')
`, 'Backtracking follows matching neighbors while maintaining exactly the cells on the current path.', 'r, c = map(int, input().split())\ngrid = [input() for _ in range(r)]\nword = input()\n\n# Decide and print the answer.\n'
  ),
  'level-96-problem-4': challenge(
    'Graph Coloring with K Colors',
    'Find a proper coloring of the undirected graph with colors 1 through k. Adjacent vertices must have different colors. Among valid assignments choose the lexicographically smallest color sequence in vertex order.',
    'First line: n m k. Then m lines of distinct undirected edges u v. Vertices are numbered 0 through n-1.',
    'Print the colors in vertex order separated by spaces, or NONE if impossible. For zero vertices print EMPTY.',
    ['0 <= n <= 10; 0 <= k <= 4.', 'The graph is simple: no loops or repeated edges.'],
    [['3 3 3\n0 1\n1 2\n0 2\n', '1 2 3', 'A triangle needs three colors, and 1 2 3 is the smallest valid sequence.'], ['3 3 2\n0 1\n1 2\n0 2\n', 'NONE', 'Three mutually adjacent vertices cannot use just two colors.'], ['0 0 0\n', 'EMPTY'], ['1 0 0\n', 'NONE'], ['1 0 2\n', '1'], ['3 0 2\n', '1 1 1'], ['4 3 2\n0 1\n1 2\n2 3\n', '1 2 1 2'], ['4 2 3\n0 2\n1 3\n', '1 1 2 2']],
    ['Assign colors in vertex order.', 'Try available colors in ascending order.', 'A candidate must differ from each already colored neighbor.', 'Backtrack when a vertex has no valid color.', 'The first complete assignment is lexicographically smallest.'],
    `n, m, k = map(int, input().split())
adj = [set() for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].add(v)
    adj[v].add(u)
colors = [0] * n
def assign(v):
    if v == n:
        return True
    for color in range(1, k + 1):
        if all(colors[u] != color for u in adj[v]):
            colors[v] = color
            if assign(v + 1):
                return True
            colors[v] = 0
    return False
if assign(0):
    print(' '.join(map(str, colors)) if n else 'EMPTY')
else:
    print('NONE')
`, 'Ascending depth-first assignments make the first complete proper coloring lexicographically smallest.', 'n, m, k = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Find and print the coloring.\n'
  ),
  'level-96-problem-5': challenge(
    'Partition into Equal-Sum Subsets',
    'Decide whether all values can be partitioned into k nonempty subsets with equal sums. Each input position must belong to exactly one subset.',
    'First line: k. Second line: positive integers separated by spaces, or an empty line.',
    'Print YES if such a partition exists, otherwise NO.',
    ['1 <= k <= 8.', 'There are at most 12 values, each from 1 to 30.'],
    [['4\n4 3 2 3 5 2 1\n', 'YES', 'The subsets 5, 4+1, 3+2 and 3+2 all sum to 5.'], ['3\n1 2 3 5\n', 'NO', 'The total 11 cannot be divided equally among three subsets.'], ['1\n\n', 'NO'], ['1\n1 2 3\n', 'YES'], ['3\n1 1\n', 'NO'], ['2\n1 1\n', 'YES'], ['2\n1 2 5\n', 'NO'], ['3\n2 2 2 2 2 2\n', 'YES']],
    ['First check whether the total is divisible by k.', 'Each subset must reach the same target sum.', 'Assign the largest remaining values first.', 'Reject any assignment exceeding the target.', 'Skip equivalent buckets with identical current sums to avoid duplicate work.'],
    `k = int(input())
values = list(map(int, input().split()))
total = sum(values)
def solve():
    if len(values) < k or total % k:
        return False
    target = total // k
    values.sort(reverse=True)
    buckets = [0] * k
    def assign(i):
        if i == len(values):
            return True
        tried = set()
        for b in range(k):
            if buckets[b] in tried or buckets[b] + values[i] > target:
                continue
            tried.add(buckets[b])
            buckets[b] += values[i]
            if assign(i + 1):
                return True
            buckets[b] -= values[i]
        return False
    return assign(0)
print('YES' if solve() else 'NO')
`, 'Backtracking fills equal-capacity buckets; positive values and the total ensure full buckets are nonempty.', 'k = int(input())\nvalues = list(map(int, input().split()))\n\n# Decide and print the answer.\n'
  ),
  'level-97-problem-1': challenge(
    'Count Digit String Decodings',
    'Count ways to split a digit string into codes 1 through 26, with no leading zero in any code. The empty string has one empty decoding.',
    'One line of ASCII digits, possibly empty.',
    'Print the exact number of decodings.',
    ['The line contains at most 100 digits.'],
    [['12\n', '2', 'The splits 1|2 and 12 are both valid.'], ['101\n', '1', 'Only 10|1 is valid; a code cannot begin with zero.'], ['\n', '1'], ['0\n', '0'], ['06\n', '0'], ['27\n', '1'], ['1111\n', '5'], ['100\n', '0']],
    ['Think about the last code in a decoding.', 'A nonzero final digit can form a one-digit code.', 'A final pair is usable only from 10 through 26.', 'Add the counts for the valid shorter prefixes.', 'Initialize the empty prefix to one and do not accept a leading zero.'],
    `s = input()
dp = [0] * (len(s) + 1)
dp[0] = 1
for i in range(1, len(s) + 1):
    if s[i - 1] != '0':
        dp[i] += dp[i - 1]
    if i >= 2 and '10' <= s[i - 2:i] <= '26':
        dp[i] += dp[i - 2]
print(dp[-1])
`, 'Each decoding ends in a valid one- or two-digit code; the corresponding disjoint prefix counts add.', lineStarter
  ),
  'level-97-problem-2': challenge(
    'Minimum Coin Count',
    'Find the minimum number of coins needed to make the amount, using any denomination any number of times.',
    'First line: amount. Second line: distinct denominations separated by spaces, or an empty line.',
    'Print the minimum count, or -1 if impossible. Amount zero needs zero coins.',
    ['0 <= amount <= 1000.', 'There are at most 30 distinct denominations, each from 1 to 1000.'],
    [['6\n1 3 4\n', '2', 'Two 3-value coins make 6, and no single coin does.'], ['7\n2 4\n', '-1', 'Even denominations cannot sum to the odd amount 7.'], ['0\n\n', '0'], ['5\n\n', '-1'], ['1\n1\n', '1'], ['8\n3 5\n', '2'], ['11\n1 5 7\n', '3'], ['4\n5 6\n', '-1']],
    ['Consider the last coin used.', 'The empty amount requires zero coins.', 'For each amount, try every denomination not exceeding it.', 'Add one to a reachable predecessor count and keep the minimum.', 'Use a sentinel for unreachable amounts and convert it to -1.'],
    `amount = int(input())
coins = list(map(int, input().split()))
dp = [amount + 1] * (amount + 1)
dp[0] = 0
for value in range(1, amount + 1):
    for coin in coins:
        if coin <= value:
            dp[value] = min(dp[value], dp[value - coin] + 1)
print(dp[amount] if dp[amount] <= amount else -1)
`, 'Every nonempty solution ends with a coin; minimizing over its reachable predecessor yields the optimum.', coinsStarter
  ),
  'level-97-problem-3': challenge(
    'Count Coin Change Combinations',
    'Count unordered combinations of coins totaling the amount, with unlimited copies of each denomination. Order does not distinguish combinations.',
    'First line: amount. Second line: distinct denominations separated by spaces, or an empty line.',
    'Print the exact count. Amount zero has one empty combination.',
    ['0 <= amount <= 200.', 'There are at most 20 distinct denominations, each from 1 to 200.'],
    [['5\n1 2 5\n', '4', 'The combinations are 1+1+1+1+1, 1+1+1+2, 1+2+2, and 5.'], ['6\n2 3\n', '2', 'Either three 2s or two 3s total 6.'], ['0\n\n', '1'], ['4\n\n', '0'], ['3\n2\n', '0'], ['4\n1 2\n', '3'], ['10\n10\n', '1'], ['7\n5 2 1\n', '6']],
    ['Treat a combination as counts of each denomination.', 'The empty combination makes zero in one way.', 'Process denominations one at a time, outside the amount loop.', 'Scan amounts upward to allow repeated copies of the current coin.', 'Add the count for the amount remaining after one such coin.'],
    `amount = int(input())
coins = list(map(int, input().split()))
dp = [0] * (amount + 1)
dp[0] = 1
for coin in coins:
    for value in range(coin, amount + 1):
        dp[value] += dp[value - coin]
print(dp[amount])
`, 'Processing one denomination at a time counts each multiset once; upward updates allow unlimited copies.', coinsStarter
  ),
  'level-97-problem-4': challenge(
    'Maximum Nonadjacent Sum',
    'Choose elements with no two adjacent indices to maximize their sum. Choosing nothing is allowed.',
    'One line of space-separated integers, or an empty line.',
    'Print the maximum sum, which is zero for an empty list.',
    ['At most 1000 integers, each from -1000 to 1000.'],
    [['2 7 9 3 1\n', '12', 'Choose indices 0, 2 and 4 for 2+9+1.'], ['-4 -1 -3\n', '0', 'The empty selection beats every nonempty selection.'], ['\n', '0'], ['5\n', '5'], ['5 6\n', '6'], ['0 0 0\n', '0'], ['4 -1 4\n', '8'], ['3 2 5 10 7\n', '15']],
    ['At each index choose to take or skip its value.', 'Taking the value forbids taking its immediate predecessor.', 'Compare skipping with adding the value to the best sum two positions back.', 'The best sum for an empty prefix is zero.', 'Keep only the previous two prefix results.'],
    `numbers = list(map(int, input().split()))
older = previous = 0
for value in numbers:
    older, previous = previous, max(previous, older + value)
print(previous)
`, 'The best prefix either skips its last element or takes it and combines with the best prefix ending two positions earlier.', numbersStarter
  ),
  'level-97-problem-5': challenge(
    'Domino and Tromino Tilings',
    'Count tilings of a 2-by-n board using 1-by-2 dominoes and L-shaped trominoes, with rotations allowed. Tiles cover cells exactly once and do not extend outside the board.',
    'One integer n.',
    'Print the exact count. The empty board has one empty tiling.',
    ['0 <= n <= 100.'],
    [['2\n', '2', 'Two vertical dominoes or two horizontal dominoes cover the board.'], ['3\n', '5', 'Three domino-only tilings and two tilings with a pair of L trominoes cover the board.'], ['0\n', '1'], ['1\n', '1'], ['4\n', '11'], ['5\n', '24'], ['6\n', '53'], ['7\n', '117']],
    ['Consider what happens along the right edge of a partial tiling.', 'Track full boards and boards with one cell missing at the right edge.', 'There are two symmetric ways to orient such a gap.', 'Combining the full and gap recurrences gives f(n) = 2*f(n-1) + f(n-3) for n at least 3.', 'Use f(0)=1, f(1)=1 and f(2)=2 as base cases.'],
    `n = int(input())
f = [1, 1, 2]
for i in range(3, n + 1):
    f.append(2 * f[i - 1] + f[i - 3])
print(f[n])
`, 'Full-board and one-cell-gap tiling counts combine to the stated recurrence, with three small base cases.', 'n = int(input())\n\n# Count and print the tilings.\n'
  ),
  'level-98-problem-1': challenge(
    'Zero-One Knapsack',
    'Maximize the sum of item values within the capacity. Each listed item can be selected at most once.',
    'First line: n capacity. Then n lines each contain weight value.',
    'Print the maximum value. The empty selection has value zero.',
    ['0 <= n <= 100; 0 <= capacity <= 1000.', 'Each weight is from 1 to 1000 and each value from 0 to 1000.'],
    [['3 5\n2 3\n3 4\n4 5\n', '7', 'The first two items fit exactly and have total value 7.'], ['2 3\n4 9\n2 5\n', '5', 'Only the second item fits.'], ['0 5\n', '0'], ['1 0\n1 10\n', '0'], ['1 6\n2 3\n', '3'], ['3 4\n2 4\n2 4\n3 9\n', '9'], ['2 2\n1 0\n2 0\n', '0'], ['3 6\n1 2\n2 4\n3 7\n', '13']],
    ['An item is either selected once or skipped.', 'Track the best value for each capacity.', 'For an item compare skipping it with taking it after a smaller capacity.', 'Update capacities in descending order so the item cannot be reused.', 'Start all capacities at zero to allow choosing nothing.'],
    `n, capacity = map(int, input().split())
dp = [0] * (capacity + 1)
for _ in range(n):
    weight, value = map(int, input().split())
    for c in range(capacity, weight - 1, -1):
        dp[c] = max(dp[c], dp[c - weight] + value)
print(dp[capacity])
`, 'Descending capacity updates ensure the predecessor still represents solutions before the current item.', 'n, capacity = map(int, input().split())\nitems = [tuple(map(int, input().split())) for _ in range(n)]\n\n# Compute and print the answer.\n'
  ),
  'level-98-problem-2': challenge(
    'Longest Arithmetic Subsequence Length',
    'Find the maximum length of a subsequence whose consecutive differences are equal. A subsequence keeps order but may skip elements; lengths zero, one and two are valid.',
    'One line of space-separated integers, or an empty line.',
    'Print the maximum length; print zero for an empty list.',
    ['At most 300 integers, each from -1000 to 1000.'],
    [['3 6 9 12\n', '4', 'All four values have successive difference 3.'], ['9 4 7 2 10\n', '3', 'The subsequence 4, 7, 10 has difference 3; no longer one exists.'], ['\n', '0'], ['5\n', '1'], ['4 4 4\n', '3'], ['1 3\n', '2'], ['5 4 3 2 1\n', '5'], ['1 7 10 13 14 19\n', '4']],
    ['A pair fixes the common difference.', 'Track best lengths ending at each position for each difference.', 'For each earlier position calculate the difference to the current value.', 'Extend that earlier difference state, or start a length-two pair.', 'Handle lists shorter than two separately.'],
    `a = list(map(int, input().split()))
dp = [{} for _ in a]
best = min(len(a), 1)
for i in range(len(a)):
    for j in range(i):
        d = a[i] - a[j]
        dp[i][d] = max(dp[i].get(d, 0), dp[j].get(d, 1) + 1)
        best = max(best, dp[i][d])
print(best)
`, 'Every arithmetic subsequence of length at least two extends a previous ending position at the same difference.', numbersStarter
  ),
  'level-98-problem-3': challenge(
    'Longest Increasing Subsequence Length',
    'Find the maximum length of a strictly increasing subsequence, preserving order but allowing gaps.',
    'One line of space-separated integers, or an empty line.',
    'Print the maximum length; print zero for an empty list.',
    ['At most 10000 integers, each from -1000000 to 1000000.'],
    [['10 9 2 5 3 7 101 18\n', '4', 'One longest subsequence is 2, 3, 7, 18.'], ['3 3 3\n', '1', 'Equal values cannot follow each other in a strictly increasing subsequence.'], ['\n', '0'], ['-1\n', '1'], ['1 2 3 4\n', '4'], ['4 3 2 1\n', '1'], ['0 -1 0 -1 0\n', '2'], ['1 3 2 4\n', '3']],
    ['Keep the smallest possible tail for each subsequence length.', 'A smaller tail leaves at least as many future extension choices.', 'Find the first tail greater than or equal to each new value.', 'Replace that tail, or append if no such tail exists.', 'The number of tails is the answer; binary search keeps the method efficient.'],
    `from bisect import bisect_left
a = list(map(int, input().split()))
tails = []
for value in a:
    i = bisect_left(tails, value)
    if i == len(tails):
        tails.append(value)
    else:
        tails[i] = value
print(len(tails))
`, 'Minimal tails summarize extension possibilities; lower-bound replacement enforces strict increase.', numbersStarter
  ),
  'level-98-problem-4': challenge(
    'Longest Common Subsequence Length',
    'Find the length of the longest subsequence common to both strings. A subsequence preserves order and may skip characters.',
    'Two lines of lowercase ASCII letters; either line may be empty.',
    'Print the maximum length.',
    ['Each line contains at most 300 letters.'],
    [['abcde\nace\n', '3', 'The entire second string ace occurs in order in abcde.'], ['abc\nbac\n', '2', 'Both ac and bc are common subsequences of length 2, but the strings differ in order.'], ['\n\n', '0'], ['abc\n\n', '0'], ['a\na\n', '1'], ['abc\ndef\n', '0'], ['aaaa\naa\n', '2'], ['abc\nabc\n', '3']],
    ['Compare prefixes of the two strings.', 'An empty prefix has common subsequence length zero.', 'Matching final characters can extend the answer for both shorter prefixes.', 'Otherwise skip one final character and keep the better result.', 'A table or rolling rows avoids repeated work.'],
    `a = input()
b = input()
previous = [0] * (len(b) + 1)
for x in a:
    current = [0] * (len(b) + 1)
    for j, y in enumerate(b, 1):
        if x == y:
            current[j] = previous[j - 1] + 1
        else:
            current[j] = max(previous[j], current[j - 1])
    previous = current
print(previous[-1])
`, 'A matching pair extends the shorter prefixes; otherwise at least one final character can be skipped.', 'a = input()\nb = input()\n\n# Compute and print the answer.\n'
  ),
  'level-98-problem-5': challenge(
    'Edit Distance',
    'Find the fewest single-character insertions, deletions and substitutions needed to transform the first string into the second.',
    'Two lines of lowercase ASCII letters; either line may be empty.',
    'Print the minimum number of operations.',
    ['Each line contains at most 300 letters.'],
    [['kitten\nsitting\n', '3', 'Substitute k to s and e to i, then insert g.'], ['abc\nac\n', '1', 'Deleting b transforms abc into ac.'], ['\n\n', '0'], ['\nabc\n', '3'], ['abc\n\n', '3'], ['a\nb\n', '1'], ['abc\nabc\n', '0'], ['ab\nba\n', '2']],
    ['Consider transformations of prefixes.', 'Turning an empty prefix into a length-k prefix takes k insertions.', 'Try deleting, inserting, or aligning the two final characters.', 'Alignment costs zero for equal characters and one otherwise.', 'Take the minimum and reuse results for shorter prefixes.'],
    `a = input()
b = input()
previous = list(range(len(b) + 1))
for i, x in enumerate(a, 1):
    current = [i] + [0] * len(b)
    for j, y in enumerate(b, 1):
        current[j] = min(previous[j] + 1, current[j - 1] + 1, previous[j - 1] + (x != y))
    previous = current
print(previous[-1])
`, 'The final operation is a deletion, insertion or alignment, and every option reduces to shorter prefixes.', 'a = input()\nb = input()\n\n# Compute and print the answer.\n'
  ),
  'level-99-problem-1': challenge(
    'Count All-One Squares',
    'Count all square submatrices whose cells are all 1. Squares at different positions or of different sizes count separately.',
    'First line: rows columns. Then rows lines of columns characters, each 0 or 1.',
    'Print the number of all-one squares.',
    ['1 <= rows, columns <= 50.'],
    [['2 2\n11\n11\n', '5', 'The four individual cells and the whole 2-by-2 square all count.'], ['2 3\n101\n111\n', '5', 'There are five one-cell squares and no larger all-one square.'], ['1 1\n0\n', '0'], ['1 1\n1\n', '1'], ['1 3\n111\n', '3'], ['3 3\n111\n111\n111\n', '14'], ['2 2\n10\n01\n', '2'], ['3 2\n11\n11\n11\n', '8']],
    ['Count squares by their bottom-right cell.', 'A zero cell ends no all-one square.', 'A one cell ends at least a one-cell square.', 'Its largest square size is one plus the minimum of the sizes above, left and diagonally above-left.', 'Add each cell’s largest size because it ends one square of every smaller size.'],
    `r, c = map(int, input().split())
grid = [input() for _ in range(r)]
dp = [[0] * (c + 1) for _ in range(r + 1)]
total = 0
for i in range(1, r + 1):
    for j in range(1, c + 1):
        if grid[i - 1][j - 1] == '1':
            dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])
            total += dp[i][j]
print(total)
`, 'The three neighboring square sizes bound the largest square ending at each one cell, and every smaller size also contributes.', 'r, c = map(int, input().split())\ngrid = [input() for _ in range(r)]\n\n# Compute and print the answer.\n'
  ),
  'level-99-problem-2': challenge(
    'Interleave Two Strings',
    'Determine whether the target can be formed by interleaving all characters of the two source strings, preserving the order within each source.',
    'Three lines of lowercase ASCII letters: first source, second source, then target. Any line may be empty.',
    'Print YES if the target is an interleaving, otherwise NO.',
    ['Each line contains at most 200 letters.'],
    [['ab\ncd\nacbd\n', 'YES', 'Taking a, c, b, d preserves ab and cd in their respective orders.'], ['ab\ncd\nadbc\n', 'NO', 'd cannot occur before c, and neither source can supply it earlier.'], ['\n\n\n', 'YES'], ['a\n\nab\n', 'NO'], ['\nabc\nabc\n', 'YES'], ['aa\na\naaa\n', 'YES'], ['ab\ncd\nabcd\n', 'YES'], ['ab\ncd\nabdc\n', 'NO']],
    ['A prefix of the target uses prefixes of both sources.', 'The total number of consumed source characters determines the target position.', 'The next character may come from either source if it matches.', 'Record whether each pair of source-prefix lengths is reachable.', 'Reject targets whose length differs from the sum of source lengths.'],
    `a = input()
b = input()
target = input()
if len(target) != len(a) + len(b):
    print('NO')
else:
    dp = [[False] * (len(b) + 1) for _ in range(len(a) + 1)]
    dp[0][0] = True
    for i in range(len(a) + 1):
        for j in range(len(b) + 1):
            if i and a[i - 1] == target[i + j - 1] and dp[i - 1][j]:
                dp[i][j] = True
            if j and b[j - 1] == target[i + j - 1] and dp[i][j - 1]:
                dp[i][j] = True
    print('YES' if dp[-1][-1] else 'NO')
`, 'Each reachable prefix pair extends by the next matching character from either source.', 'a = input()\nb = input()\ntarget = input()\n\n# Decide and print the answer.\n'
  ),
  'level-99-problem-3': challenge(
    'Longest Palindromic Subsequence Length',
    'Find the maximum length of a subsequence that reads the same forwards and backwards. A subsequence may skip characters.',
    'One line of lowercase ASCII letters, possibly empty.',
    'Print the maximum length, or zero for an empty string.',
    ['The line contains at most 300 letters.'],
    [['bbbab\n', '4', 'The four b characters form a palindromic subsequence.'], ['cbbd\n', '2', 'The two adjacent b characters form the longest palindrome.'], ['\n', '0'], ['a\n', '1'], ['abc\n', '1'], ['racecar\n', '7'], ['agbdba\n', '5'], ['aaaa\n', '4']],
    ['Consider a substring interval as a subproblem.', 'A single character has answer one; an empty interval has answer zero.', 'Equal endpoints can surround an inner palindromic subsequence.', 'For unequal endpoints skip either endpoint and keep the better result.', 'Process shorter intervals before longer intervals.'],
    `s = input()
n = len(s)
dp = [[0] * n for _ in range(n)]
for i in range(n - 1, -1, -1):
    dp[i][i] = 1
    for j in range(i + 1, n):
        if s[i] == s[j]:
            dp[i][j] = 2 + (dp[i + 1][j - 1] if j > i + 1 else 0)
        else:
            dp[i][j] = max(dp[i + 1][j], dp[i][j - 1])
print(dp[0][-1] if n else 0)
`, 'Matching endpoints can surround an optimal inner palindrome; otherwise at least one endpoint must be skipped.', lineStarter
  ),
  'level-99-problem-4': challenge(
    'Matrix Chain Multiplication Cost',
    'Find the minimum scalar multiplication count for multiplying a chain of compatible matrices. A p by q matrix times a q by r matrix costs p*q*r scalar multiplications.',
    'One line of space-separated positive dimensions d0 through dn. Matrix i has dimensions d(i-1) by di.',
    'Print the minimum cost; zero or one matrix requires no multiplications.',
    ['There are 1 to 51 dimensions, each from 1 to 1000.'],
    [['10 30 5 60\n', '4500', 'Multiply the first two matrices for 1500, then the result by the last for 3000.'], ['5 10 3\n', '150', 'There is one multiplication, costing 5*10*3.'], ['7\n', '0'], ['3 4\n', '0'], ['1 1 1 1\n', '2'], ['2 3 4 5\n', '64'], ['10 20 30 40\n', '18000'], ['3 2 4 2\n', '28']],
    ['Each parenthesization has a final split between two subchains.', 'A chain with at most one matrix costs zero.', 'Try each possible split for every interval of matrices.', 'Add both subchain costs and the final multiplication cost.', 'Compute shorter intervals before longer ones.'],
    `d = list(map(int, input().split()))
n = len(d) - 1
dp = [[0] * n for _ in range(n)]
for length in range(2, n + 1):
    for i in range(n - length + 1):
        j = i + length - 1
        dp[i][j] = min(dp[i][k] + dp[k + 1][j] + d[i] * d[k + 1] * d[j + 1] for k in range(i, j))
print(dp[0][n - 1] if n else 0)
`, 'Try each final split, combining optimal subchain costs with the cost of the final multiplication.', numbersStarter
  ),
  'level-99-problem-5': challenge(
    'Weighted Interval Scheduling',
    'Select nonoverlapping half-open intervals to maximize their total weight. Intervals that touch at an endpoint do not overlap; selecting none is allowed.',
    'First line: n. Then n lines each contain start end weight.',
    'Print the maximum total weight; print zero when no intervals are selected.',
    ['0 <= n <= 1000.', '-10000 <= start < end <= 10000; -1000 <= weight <= 1000.'],
    [['3\n1 3 5\n3 5 6\n1 5 10\n', '11', 'The first two touch but do not overlap and together weigh 11.'], ['2\n0 3 -2\n1 2 -1\n', '0', 'Choosing no intervals is better than either negative-weight interval.'], ['0\n', '0'], ['1\n0 1 8\n', '8'], ['2\n0 2 5\n1 3 9\n', '9'], ['3\n0 2 2\n0 2 5\n2 3 3\n', '8'], ['3\n-3 -1 4\n-1 0 2\n0 2 1\n', '7'], ['3\n1 4 6\n2 3 5\n3 5 5\n', '10']],
    ['Sort intervals by their end time.', 'For each interval find the last earlier interval ending no later than its start.', 'Binary search the sorted end times for that compatible prefix.', 'Compare skipping this interval with taking its weight plus the compatible prefix optimum.', 'Initialize the empty prefix to zero, so negative weights are optional.'],
    `from bisect import bisect_right
n = int(input())
intervals = [tuple(map(int, input().split())) for _ in range(n)]
intervals.sort(key=lambda item: item[1])
ends = [item[1] for item in intervals]
dp = [0]
for i, (start, end, weight) in enumerate(intervals):
    compatible = bisect_right(ends, start, 0, i)
    dp.append(max(dp[-1], weight + dp[compatible]))
print(dp[-1])
`, 'Sorting by end time makes compatible predecessors a prefix; each optimum takes or skips the current interval.', 'n = int(input())\nintervals = [tuple(map(int, input().split())) for _ in range(n)]\n\n# Compute and print the answer.\n'
  ),
  'level-100-problem-1': challenge(
    'Traveling Salesperson Tour',
    'Find the least total cost of a directed tour starting at vertex 0, visiting each other vertex exactly once and returning to 0. A missing edge cannot be used.',
    'First line: n. Then n lines of n integers: -1 means no edge, otherwise the nonnegative edge cost. Diagonal entries are -1.',
    'Print the minimum cost, or -1 if no tour exists. For n=1 the empty tour has cost zero.',
    ['1 <= n <= 12.', 'Every edge cost is between 0 and 1000 or is -1.'],
    [['3\n-1 2 9\n1 -1 3\n4 5 -1\n', '9', 'The tour 0 to 1 to 2 to 0 costs 2+3+4.'], ['2\n-1 1\n-1 -1\n', '-1', 'There is no edge back to the start.'], ['1\n-1\n', '0'], ['2\n-1 0\n0 -1\n', '0'], ['2\n-1 2\n3 -1\n', '5'], ['3\n-1 1 -1\n-1 -1 1\n1 -1 -1\n', '3'], ['3\n-1 1 1\n1 -1 -1\n1 -1 -1\n', '-1'], ['3\n-1 4 1\n2 -1 7\n3 2 -1\n', '5']],
    ['A state needs the visited vertices and the last vertex.', 'Start with only vertex 0 visited and cost zero.', 'Extend a state along an existing edge to an unvisited vertex.', 'For each state retain only the cheapest route.', 'Once every vertex is visited, add an existing return edge to 0.'],
    `n = int(input())
cost = [list(map(int, input().split())) for _ in range(n)]
if n == 1:
    print(0)
else:
    inf = float('inf')
    dp = [[inf] * n for _ in range(1 << n)]
    dp[1][0] = 0
    for mask in range(1 << n):
        for u in range(n):
            if dp[mask][u] == inf:
                continue
            for v in range(1, n):
                if not mask & (1 << v) and cost[u][v] >= 0:
                    nxt = mask | (1 << v)
                    dp[nxt][v] = min(dp[nxt][v], dp[mask][u] + cost[u][v])
    answer = min((dp[-1][u] + cost[u][0] for u in range(1, n) if cost[u][0] >= 0), default=inf)
    print(-1 if answer == inf else answer)
`, 'Bitmask states capture every visited set and endpoint; closing a full route yields the best tour.', 'n = int(input())\ncost = [list(map(int, input().split())) for _ in range(n)]\n\n# Compute and print the answer.\n'
  ),
  'level-100-problem-2': challenge(
    'Maximum Flow in a Network',
    'Compute the maximum flow from vertex 0 to vertex n-1 in a directed network. Parallel and antiparallel edges are allowed.',
    'First line: n m. Then m lines of u v capacity. Vertices are numbered 0 through n-1.',
    'Print the maximum integer flow; if no path exists print zero.',
    ['2 <= n <= 30; 0 <= m <= 200.', 'Edges have distinct endpoints and capacities from 0 to 1000.'],
    [['4 5\n0 1 3\n0 2 2\n1 2 1\n1 3 2\n2 3 3\n', '5', 'Two units use 0-1-3, two use 0-2-3, and one uses 0-1-2-3.'], ['3 1\n0 1 5\n', '0', 'The sink has no incoming route from the source.'], ['2 0\n', '0'], ['2 1\n0 1 7\n', '7'], ['2 2\n0 1 2\n0 1 3\n', '5'], ['3 2\n0 1 0\n1 2 8\n', '0'], ['3 3\n0 1 5\n1 0 7\n1 2 3\n', '3'], ['6 7\n0 1 1\n0 2 1\n1 3 1\n1 4 1\n2 3 1\n3 5 1\n4 5 1\n', '2']],
    ['A residual edge records how much more flow can be sent.', 'Reverse residual edges allow earlier flow choices to be undone.', 'Find a source-to-sink path using positive residual capacity.', 'Augment by the smallest residual capacity on that path.', 'Repeat until no augmenting path remains.'],
    `from collections import deque
n, m = map(int, input().split())
residual = [[0] * n for _ in range(n)]
for _ in range(m):
    u, v, capacity = map(int, input().split())
    residual[u][v] += capacity
flow = 0
while True:
    parent = [-1] * n
    parent[0] = 0
    queue = deque([0])
    while queue and parent[n - 1] == -1:
        u = queue.popleft()
        for v in range(n):
            if parent[v] == -1 and residual[u][v] > 0:
                parent[v] = u
                queue.append(v)
    if parent[n - 1] == -1:
        break
    amount = float('inf')
    v = n - 1
    while v:
        u = parent[v]
        amount = min(amount, residual[u][v])
        v = u
    v = n - 1
    while v:
        u = parent[v]
        residual[u][v] -= amount
        residual[v][u] += amount
        v = u
    flow += amount
print(flow)
`, 'Augmenting paths increase flow until a residual cut separates source from sink, proving optimality.', 'n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Compute and print the flow.\n'
  ),
  'level-100-problem-3': challenge(
    'Articulation Points',
    'Find vertices whose removal, together with incident edges, increases the number of connected components of the undirected graph.',
    'First line: n m. Then m lines of edges u v. Vertices are numbered 0 through n-1.',
    'Print the articulation vertices in increasing order separated by spaces, or NONE if there are none.',
    ['0 <= n <= 200; 0 <= m <= 1000.', 'The graph is simple: no loops or repeated edges.'],
    [['4 3\n0 1\n1 2\n2 3\n', '1 2', 'Removing either interior vertex splits the path into two components.'], ['3 3\n0 1\n1 2\n0 2\n', 'NONE', 'Removing any triangle vertex leaves the other two connected.'], ['0 0\n', 'NONE'], ['1 0\n', 'NONE'], ['2 1\n0 1\n', 'NONE'], ['4 3\n0 1\n0 2\n0 3\n', '0'], ['5 2\n0 1\n1 2\n', '1'], ['5 5\n0 1\n1 2\n2 0\n2 3\n3 4\n', '2 3']],
    ['Run depth-first search in every component.', 'Record each vertex discovery time and its lowest reachable ancestor time.', 'A non-root separates a child subtree if the child cannot reach an earlier ancestor.', 'A DFS root separates its component only if it has at least two DFS children.', 'Sort the marked vertices before printing.'],
    `n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
time = 0
seen = [-1] * n
low = [0] * n
points = set()
def dfs(u, parent):
    global time
    seen[u] = low[u] = time
    time += 1
    children = 0
    for v in adj[u]:
        if v == parent:
            continue
        if seen[v] == -1:
            children += 1
            dfs(v, u)
            low[u] = min(low[u], low[v])
            if parent != -1 and low[v] >= seen[u]:
                points.add(u)
        else:
            low[u] = min(low[u], seen[v])
    if parent == -1 and children > 1:
        points.add(u)
for u in range(n):
    if seen[u] == -1:
        dfs(u, -1)
print(' '.join(map(str, sorted(points))) if points else 'NONE')
`, 'Low-link values identify child subtrees unable to reconnect above their parent; root handling counts DFS branches.', 'n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Find and print the articulation points.\n'
  ),
  'level-100-problem-4': challenge(
    'Minimum Word Segmentation',
    'Find the fewest dictionary words whose concatenation equals the input text. Words may be reused.',
    'First line: lowercase text, possibly empty. Second line: n. Then n nonempty lowercase dictionary words, one per line.',
    'Print the fewest words, or -1 if impossible. Empty text uses zero words.',
    ['Text has at most 200 letters.', '0 <= n <= 100; each word has 1 to 30 letters and dictionary words are distinct.'],
    [['applepie\n3\napple\npie\napp\n', '2', 'apple followed by pie uses two dictionary words.'], ['aaaa\n2\na\naa\n', '2', 'Two copies of aa cover the text.'], ['\n0\n', '0'], ['a\n0\n', '-1'], ['cat\n1\ncat\n', '1'], ['cats\n2\ncat\nat\n', '-1'], ['abc\n3\na\nb\nc\n', '3'], ['abab\n3\nab\naba\nb\n', '2']],
    ['Consider prefixes of the text.', 'The empty prefix needs zero words.', 'To end at a position, try a dictionary word that ends there.', 'Add one to the best count for the preceding prefix.', 'Use an unreachable sentinel and print -1 if the full text remains unreachable.'],
    `text = input()
n = int(input())
words = [input() for _ in range(n)]
dp = [len(text) + 1] * (len(text) + 1)
dp[0] = 0
for end in range(1, len(text) + 1):
    for word in words:
        start = end - len(word)
        if start >= 0 and text[start:end] == word:
            dp[end] = min(dp[end], dp[start] + 1)
print(dp[-1] if dp[-1] <= len(text) else -1)
`, 'Every segmentation has a final dictionary word; minimizing over its matching preceding prefix gives the answer.', 'text = input()\nn = int(input())\nwords = [input() for _ in range(n)]\n\n# Compute and print the answer.\n'
  ),
  'level-100-problem-5': challenge(
    'Longest Increasing Path in a Matrix',
    'Find the longest path of orthogonally adjacent cells whose values strictly increase at every move. A path may start and end anywhere.',
    'First line: rows columns. Then rows lines of columns space-separated integers.',
    'Print the maximum number of cells in such a path.',
    ['1 <= rows, columns <= 40.', 'Cell values are from -1000 to 1000.'],
    [['2 3\n1 2 3\n6 5 4\n', '6', 'All six cells form an increasing path around the two rows.'], ['2 2\n7 7\n7 7\n', '1', 'Equal neighbors cannot extend a strictly increasing path.'], ['1 1\n-2\n', '1'], ['1 4\n4 3 2 1\n', '4'], ['2 2\n1 2\n2 3\n', '3'], ['2 3\n1 1 1\n2 2 2\n', '2'], ['3 1\n1\n3\n2\n', '2'], ['2 2\n-3 -2\n0 -1\n', '4']],
    ['Strictly increasing moves cannot form a cycle.', 'Think of the best path starting at each cell.', 'A cell by itself gives a path of length one.', 'Extend to each larger orthogonal neighbor and take the best.', 'Compute cells from largest value downward so larger neighbors are ready.'],
    `r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
dp = [[1] * c for _ in range(r)]
cells = sorted(((grid[i][j], i, j) for i in range(r) for j in range(c)), reverse=True)
for value, i, j in cells:
    for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        x, y = i + di, j + dj
        if 0 <= x < r and 0 <= y < c and grid[x][y] > value:
            dp[i][j] = max(dp[i][j], 1 + dp[x][y])
print(max(map(max, dp)))
`, 'Processing cells in decreasing value order makes every strictly larger neighbor available before its predecessor.', 'r, c = map(int, input().split())\ngrid = [list(map(int, input().split())) for _ in range(r)]\n\n# Compute and print the answer.\n'
  )
};
