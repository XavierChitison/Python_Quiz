import { challenge } from './beginner.js';

const matrixInput = 'First line: rows R and columns C. Next R lines: C space-separated integers each.';
const matrixLimits = ['1 <= R, C <= 20.', 'Every matrix entry is an integer from -100 to 100.'];
const binaryLimits = ['1 <= R, C <= 20.', 'Every entry is 0 or 1.'];
const matrixStarter = 'r, c = map(int, input().split())\ngrid = [list(map(int, input().split())) for _ in range(r)]\n\n# Compute and print the answer.\n';
const matrixOutput = 'Print the result as rows of space-separated integers, one row per line.';

export const matrices6670Challenges = {
  'level-66-problem-1': challenge(
    'Sum Matrix Border', 'Sum all border cells of a rectangular matrix, counting every cell once.',
    matrixInput, 'Print the border sum as an integer.', matrixLimits,
    [['3 3\n1 2 3\n4 5 6\n7 8 9\n','40','Only the center 5 is excluded from the total 45.'],['1 4\n2 -1 3 4\n','8','A one-row matrix consists entirely of border cells.'],['1 1\n-7\n','-7'],['2 2\n1 2\n3 4\n','10'],['3 1\n1\n-2\n5\n','4'],['3 4\n1 1 1 1\n1 9 9 1\n1 1 1 1\n','10'],['2 3\n-1 0 1\n2 -3 4\n','3'],['4 3\n0 0 0\n0 8 0\n0 9 0\n0 0 0\n','0']],
    ['A border cell touches at least one outer edge.', 'Use its row and column indices to test all four edges.', 'Add each qualifying cell only once.', 'A single row or column has no interior cells.', 'Try a matrix whose interior values are nonzero.'],
    `r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
total = 0
for i in range(r):
    for j in range(c):
        if i == 0 or i == r - 1 or j == 0 or j == c - 1:
            total += grid[i][j]
print(total)
`, 'Check each cell once against the four boundaries.', matrixStarter
  ),
  'level-66-problem-2': challenge(
    'Locate Matrix Maximum', 'Find the first maximum in row-major order and report its zero-based row and column.',
    matrixInput, 'Print the row and column separated by a space.', matrixLimits,
    [['2 3\n1 9 2\n9 0 3\n','0 1','The first 9 appears in row 0, column 1.'],['2 2\n-8 -3\n-2 -5\n','1 0','The greatest negative value is -2.'],['1 1\n0\n','0 0'],['1 3\n4 4 4\n','0 0'],['3 1\n1\n3\n2\n','1 0'],['2 2\n5 0\n0 5\n','0 0'],['2 3\n0 1 2\n3 4 5\n','1 2'],['3 2\n-1 -2\n-3 -4\n-5 -6\n','0 0']],
    ['Visit rows from top to bottom and columns left to right.', 'Keep the location of the best value seen.', 'Initialize the best location to the first cell.', 'Replace it only for a strictly larger value.', 'Equal maxima must not replace the earlier location.'],
    `r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
best = (0, 0)
for i in range(r):
    for j in range(c):
        if grid[i][j] > grid[best[0]][best[1]]:
            best = (i, j)
print(*best)
`, 'Strict improvements preserve the earliest maximum.', matrixStarter
  ),
  'level-66-problem-3': challenge(
    'Check a Toeplitz Matrix', 'Determine whether every diagonal running from top left to bottom right contains equal values.',
    matrixInput, 'Print YES if every such diagonal is constant, otherwise print NO.', matrixLimits,
    [['3 4\n1 2 3 4\n5 1 2 3\n6 5 1 2\n','YES','Every diagonal is constant: for example, the main diagonal is 1, 1, 1.'],['3 3\n1 2 3\n4 1 2\n5 4 9\n','NO','The main diagonal contains 1, 1, and 9.'],['1 1\n0\n','YES'],['1 4\n1 2 3 4\n','YES'],['3 1\n3\n1\n2\n','YES'],['2 2\n1 7\n8 2\n','NO'],['3 2\n3 4\n2 3\n7 9\n','NO'],['3 2\n-1 0\n-2 -1\n-3 -2\n','YES']],
    ['Cells on the same downward-right diagonal have the same row minus column.', 'Every cell except those in the first row or first column has an upper-left neighbor.', 'Compare each such cell with that upper-left neighbor.', 'One mismatch makes the answer NO.', 'In a single row or column every diagonal has just one cell.'],
    `r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
valid = True
for i in range(1, r):
    for j in range(1, c):
        if grid[i][j] != grid[i - 1][j - 1]:
            valid = False
print('YES' if valid else 'NO')
`, 'Adjacent cells along each downward-right diagonal must agree.', matrixStarter
  ),
  'level-66-problem-4': challenge(
    'Zero Matrix Crosses', 'For each zero in the original matrix, replace every cell in its row and column with zero. Apply all replacements simultaneously; newly created zeroes do not cause further replacements.',
    matrixInput, matrixOutput, matrixLimits,
    [['3 4\n1 2 3 4\n5 0 7 8\n9 10 11 12\n','1 0 3 4\n0 0 0 0\n9 0 11 12','The original zero clears its entire row and column, but the other cells remain.'],['2 3\n0 2 3\n4 5 0\n','0 0 0\n0 0 0','Both rows contain an original zero, so both become zero.'],['1 1\n5\n','5'],['1 1\n0\n','0'],['1 4\n1 2 0 4\n','0 0 0 0'],['3 1\n1\n2\n3\n','1\n2\n3'],['3 4\n1 0 3 4\n5 6 7 8\n9 10 0 12\n','0 0 0 0\n5 0 0 8\n0 0 0 0'],['2 3\n1 0 -3\n4 5 -6\n','0 0 0\n4 0 -6']],
    ['Only zeroes present in the input trigger a cross.', 'First record which rows contain an original zero.', 'Also record which columns contain an original zero.', 'A cell becomes zero if its row or column is recorded.', 'Otherwise retain the original value; do not let new zeroes spread.'],
    `r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
zero_rows = set()
zero_columns = set()
for i in range(r):
    for j in range(c):
        if grid[i][j] == 0:
            zero_rows.add(i)
            zero_columns.add(j)
for i in range(r):
    print(*(0 if i in zero_rows or j in zero_columns else grid[i][j] for j in range(c)))
`, 'Record rows and columns containing original zeroes before constructing the output.', matrixStarter
  ),
  'level-66-problem-5': challenge(
    'Matrix Row with Largest Sum', 'Find the zero-based index of the first row with the largest sum.',
    matrixInput, 'Print the row index.', matrixLimits,
    [['3 2\n1 2\n4 0\n3 1\n','1','Rows 1 and 2 sum to 4, so row 1 wins the tie.'],['2 2\n-5 -4\n-3 -2\n','1','The row sums are -9 and -5.'],['1 1\n0\n','0'],['2 1\n5\n5\n','0'],['3 1\n-1\n0\n2\n','2'],['2 3\n1 2 3\n3 2 1\n','0'],['3 2\n9 -9\n1 -2\n2 -1\n','2'],['2 2\n100 100\n-100 -100\n','0']],
    ['Compute one total for each row.', 'Track the best total and its row index.', 'Start with the first row rather than zero.', 'Update only when a later total is strictly larger.', 'This leaves the earliest row in a tie.'],
    `r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
best = 0
for i in range(1, r):
    if sum(grid[i]) > sum(grid[best]):
        best = i
print(best)
`, 'Compare row totals and keep the first on ties.', matrixStarter
  ),
  'level-67-problem-1': challenge(
    'Grid Neighbor Coordinates', 'List the valid orthogonal neighbors of a cell in row-major order.',
    'One line: R C r c, where r and c are zero-based.', 'Print the number of neighbors, then each row and column on its own line in increasing row, then column order.',
    ['1 <= R, C <= 20.', '0 <= r < R and 0 <= c < C.'],
    [['3 3 1 1\n','4\n0 1\n1 0\n1 2\n2 1','The center has four neighbors in row-major order.'],['2 3 0 0\n','2\n0 1\n1 0','Only right and down stay inside the grid.'],['1 1 0 0\n','0'],['1 4 0 2\n','2\n0 1\n0 3'],['4 1 2 0\n','2\n1 0\n3 0'],['2 2 1 1\n','2\n0 1\n1 0'],['3 4 1 0\n','3\n0 0\n1 1\n2 0'],['3 3 0 1\n','3\n0 0\n0 2\n1 1']],
    ['Use the four orthogonal direction offsets.', 'Add each offset to the given coordinates.', 'Discard coordinates outside the grid.', 'Sort remaining pairs by row then column.', 'Print the count before the coordinates.'],
    `R, C, r, c = map(int, input().split())
neighbors = []
for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
    x, y = r + dr, c + dc
    if 0 <= x < R and 0 <= y < C:
        neighbors.append((x, y))
neighbors.sort()
print(len(neighbors))
for pair in neighbors:
    print(*pair)
`, 'Filter the four offset coordinates by bounds, then sort them.', 'R, C, r, c = map(int, input().split())\n\n# Find and print the neighbors.\n'
  ),
  'level-67-problem-2': challenge(
    'Count Mines Around Each Cell', 'For every cell count the mines in the eight surrounding positions; the cell itself is never counted.',
    `${matrixInput} A 1 marks a mine and a 0 marks an empty cell.`, matrixOutput, binaryLimits,
    [['2 2\n1 0\n0 1\n','1 2\n2 1','Each mine sees the other, while each empty cell sees both mines.'],['1 3\n1 1 0\n','1 1 1','Only adjacent positions in the single row count.'],['1 1\n1\n','0'],['1 1\n0\n','0'],['2 2\n0 0\n0 0\n','0 0\n0 0'],['2 2\n1 1\n1 1\n','3 3\n3 3'],['3 1\n1\n0\n1\n','0\n2\n0'],['3 3\n0 0 0\n0 1 0\n0 0 0\n','1 1 1\n1 0 1\n1 1 1']],
    ['There are eight direction offsets around a cell.', 'Exclude the zero offset for the cell itself.', 'Check the grid bounds for each offset.', 'Add the value of every valid neighboring cell.', 'Print a count even at a mine cell.'],
    `r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
for i in range(r):
    row = []
    for j in range(c):
        count = 0
        for di in (-1, 0, 1):
            for dj in (-1, 0, 1):
                x, y = i + di, j + dj
                if (di or dj) and 0 <= x < r and 0 <= y < c:
                    count += grid[x][y]
        row.append(count)
    print(*row)
`, 'Sum the valid eight neighboring binary cells.', matrixStarter
  ),
  'level-67-problem-3': challenge(
    "One Step of Conway's Life", 'Compute one simultaneous Life generation: a live cell survives with 2 or 3 live neighbors; a dead cell becomes live with exactly 3. Outside the grid is dead.',
    `${matrixInput} Entries 1 and 0 represent live and dead cells.`, matrixOutput, binaryLimits,
    [['3 3\n0 0 0\n1 1 1\n0 0 0\n','0 1 0\n0 1 0\n0 1 0','The horizontal line becomes vertical.'],['2 2\n1 1\n1 1\n','1 1\n1 1','Each live cell has three neighbors and survives.'],['1 1\n1\n','0'],['1 1\n0\n','0'],['1 3\n1 1 1\n','0 1 0'],['2 2\n1 0\n0 0\n','0 0\n0 0'],['2 2\n1 1\n1 0\n','1 1\n1 1'],['3 3\n1 0 1\n0 1 0\n1 0 1\n','0 1 0\n1 0 1\n0 1 0']],
    ['Count the eight live neighbors in the original grid.', 'Cells outside the grid are dead.', 'A live cell survives only with two or three neighbors.', 'A dead cell is born only with three neighbors.', 'Store the next generation separately so updates are simultaneous.'],
    `r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
result = [[0] * c for _ in range(r)]
for i in range(r):
    for j in range(c):
        count = sum(grid[x][y] for x in range(max(0, i - 1), min(r, i + 2))
                    for y in range(max(0, j - 1), min(c, j + 2)) if (x, y) != (i, j))
        result[i][j] = int(count == 3 or (grid[i][j] == 1 and count == 2))
for row in result:
    print(*row)
`, 'Count neighbors from the unchanged input before printing the new grid.', matrixStarter
  ),
  'level-67-problem-4': challenge(
    'Check a Latin Square', 'Check whether every row and column contains each integer from 1 through n exactly once.',
    'First line n; next n lines each contain n integers.', 'Print YES if the square is Latin, otherwise NO.',
    ['1 <= n <= 10.', 'Entries are integers from -100 to 100.'],
    [['3\n1 2 3\n2 3 1\n3 1 2\n','YES','Every row and column is a permutation of 1, 2, 3.'],['2\n1 2\n1 2\n','NO','Each column repeats a value.'],['1\n1\n','YES'],['1\n0\n','NO'],['2\n1 1\n2 2\n','NO'],['2\n2 1\n1 2\n','YES'],['3\n1 2 4\n2 3 1\n3 1 2\n','NO'],['3\n1 2 3\n2 1 3\n3 3 1\n','NO']],
    ['The required values are 1 through n.', 'Check every row against that set.', 'Build each column from its entries across rows.', 'Check every column against the same set.', 'Out-of-range entries and duplicates must both fail.'],
    `n = int(input())
grid = [list(map(int, input().split())) for _ in range(n)]
required = set(range(1, n + 1))
valid = all(set(row) == required for row in grid)
valid = valid and all({grid[i][j] for i in range(n)} == required for j in range(n))
print('YES' if valid else 'NO')
`, 'Compare each complete row and column with the required set.', 'n = int(input())\ngrid = [list(map(int, input().split())) for _ in range(n)]\n\n# Check and print the result.\n'
  ),
  'level-67-problem-5': challenge(
    'Check a Magic Square', 'Check that 1 through n squared occur exactly once and every row, column, and both diagonals have the same sum.',
    'First line n; next n lines each contain n integers.', 'Print YES if the square is magic, otherwise NO.',
    ['1 <= n <= 10.', 'Entries are integers from -100 to 100.'],
    [['3\n8 1 6\n3 5 7\n4 9 2\n','YES','Every required line sums to 15 and the values 1 through 9 occur once.'],['2\n1 2\n3 4\n','NO','The row sums differ.'],['1\n1\n','YES'],['1\n2\n','NO'],['2\n1 1\n1 1\n','NO'],['3\n2 7 6\n9 5 1\n4 3 8\n','YES'],['3\n1 2 3\n4 5 6\n7 8 9\n','NO'],['3\n8 1 6\n4 9 2\n3 5 7\n','NO']],
    ['A normal magic square uses each value 1 through n squared once.', 'Take the first row sum as the target.', 'Compare every row and column with that target.', 'Also check the main and opposite diagonals.', 'Equal sums alone do not guarantee the required distinct values.'],
    `n = int(input())
grid = [list(map(int, input().split())) for _ in range(n)]
target = sum(grid[0])
lines = [sum(row) for row in grid]
lines += [sum(grid[i][j] for i in range(n)) for j in range(n)]
lines += [sum(grid[i][i] for i in range(n)), sum(grid[i][n - 1 - i] for i in range(n))]
valid = sorted(x for row in grid for x in row) == list(range(1, n * n + 1))
print('YES' if valid and all(x == target for x in lines) else 'NO')
`, 'Verify the value set and all required line sums independently.', 'n = int(input())\ngrid = [list(map(int, input().split())) for _ in range(n)]\n\n# Check and print the result.\n'
  ),
  'level-68-problem-1': challenge(
    'Sort Matrix Diagonals', 'Define a function that sorts each top-left-to-bottom-right diagonal independently into nondecreasing order. Values stay within their original diagonal and the matrix dimensions do not change.',
    matrixInput, matrixOutput, matrixLimits,
    [['3 4\n8 4 9 2\n3 7 6 1\n5 0 2 3\n','2 3 1 2\n0 7 4 9\n5 3 8 6','The main diagonal 8, 7, 2 becomes 2, 7, 8; every other diagonal is sorted separately.'],['2 3\n-1 4 -3\n5 -2 0\n','-2 0 -3\n5 -1 4','The main diagonal becomes -2, -1, while the 4, 0 diagonal becomes 0, 4.'],['1 1\n7\n','7'],['1 4\n4 3 2 1\n','4 3 2 1'],['4 1\n3\n2\n1\n0\n','3\n2\n1\n0'],['2 2\n2 1\n3 2\n','2 1\n3 2'],['3 3\n9 1 8\n7 0 1\n5 2 -3\n','-3 1 8\n2 0 1\n5 7 9'],['2 3\n0 0 0\n0 0 0\n','0 0 0\n0 0 0']],
    ['Each diagonal proceeds one row down and one column right.', 'Every diagonal begins in the top row or the leftmost column.', 'Collect the values along one diagonal and sort them.', 'Write the sorted values back along that same diagonal from top to bottom.', 'Repeat for every starting position without processing the top-left diagonal twice.'],
    `def sort_diagonals(matrix):
    r, c = len(matrix), len(matrix[0])
    result = [row[:] for row in matrix]
    starts = [(0, j) for j in range(c)] + [(i, 0) for i in range(1, r)]
    for row, col in starts:
        positions = []
        while row < r and col < c:
            positions.append((row, col))
            row += 1
            col += 1
        values = sorted(matrix[i][j] for i, j in positions)
        for (i, j), value in zip(positions, values):
            result[i][j] = value
    return result

r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
for row in sort_diagonals(grid):
    print(*row)
`, 'Collect and sort each diagonal separately, then place its values back in order.', matrixStarter
  ),
  'level-68-problem-2': challenge(
'Matrix Power by Repeated Multiplication', 'Raise a square matrix to a nonnegative integer power. Power zero is the identity matrix.',
'First line n p; next n lines contain n integers each.', matrixOutput,
['1 <= n <= 4 and 0 <= p <= 6.', 'Entries are integers from -5 to 5.'],
[['2 2\n1 2\n3 4\n','7 10\n15 22','Multiplying the matrix by itself gives these row-column products.'],['2 0\n0 2\n3 1\n','1 0\n0 1','Every square matrix to power zero is the identity.'],['1 3\n-2\n','-8'],['1 0\n0\n','1'],['2 1\n1 2\n0 1\n','1 2\n0 1'],['2 3\n1 1\n0 1\n','1 3\n0 1'],['2 2\n0 1\n1 0\n','1 0\n0 1'],['2 2\n0 0\n0 0\n','0 0\n0 0']],
['Start the accumulated power as the identity.', 'Define matrix multiplication using row-column dot products.', 'Multiply the accumulator by the input once per power step.', 'For exponent zero, perform no multiplications.', 'Print each resulting row.'],
`def multiply(a, b):
    n = len(a)
    return [[sum(a[i][k] * b[k][j] for k in range(n)) for j in range(n)] for i in range(n)]

n, p = map(int, input().split())
matrix = [list(map(int, input().split())) for _ in range(n)]
result = [[int(i == j) for j in range(n)] for i in range(n)]
for _ in range(p):
    result = multiply(result, matrix)
for row in result:
    print(*row)
`, 'Repeatedly multiply the identity by the input matrix.', 'n, p = map(int, input().split())\nmatrix = [list(map(int, input().split())) for _ in range(n)]\n\n# Compute and print the power.\n'
  ),
  'level-68-problem-3': challenge(
'Two-Dimensional Rectangle Sums', 'Answer inclusive rectangular sum queries on a matrix using zero-based indices.',
`${matrixInput} Next line: q. Next q lines: r1 c1 r2 c2.`, 'Print one sum per query, each on its own line; print nothing when q is zero.',
[...matrixLimits, '0 <= q <= 100.', 'Each query satisfies 0 <= r1 <= r2 < R and 0 <= c1 <= c2 < C.'],
[['2 3\n1 2 3\n4 5 6\n2\n0 1 1 2\n1 0 1 0\n','16\n4','The first rectangle contains 2, 3, 5, and 6; the second contains only 4.'],['1 2\n-3 5\n1\n0 0 0 1\n','2','The full row sums to 2.'],['1 1\n7\n0\n',''],['1 1\n-5\n1\n0 0 0 0\n','-5'],['2 2\n1 2\n3 4\n1\n0 0 1 1\n','10'],['2 2\n1 2\n3 4\n2\n0 0 0 1\n0 1 1 1\n','3\n6'],['3 1\n1\n-2\n3\n1\n1 0 2 0\n','1'],['3 3\n1 1 1\n1 1 1\n1 1 1\n1\n1 1 2 2\n','4']],
['A prefix sum covers all cells above and left of an endpoint.', 'Use an extra zero row and column to handle edges.', 'Add top and left prefixes, subtract their overlap, then add the current cell.', 'For a query subtract the regions above and left, adding their overlap back.', 'Convert inclusive endpoints to the padded prefix indices.'],
`r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
prefix = [[0] * (c + 1) for _ in range(r + 1)]
for i in range(r):
    for j in range(c):
        prefix[i + 1][j + 1] = grid[i][j] + prefix[i][j + 1] + prefix[i + 1][j] - prefix[i][j]
q = int(input())
for _ in range(q):
    a, b, d, e = map(int, input().split())
    print(prefix[d + 1][e + 1] - prefix[a][e + 1] - prefix[d + 1][b] + prefix[a][b])
`, 'A padded prefix table answers each rectangle by inclusion-exclusion.', matrixStarter + 'q = int(input())\nqueries = [tuple(map(int, input().split())) for _ in range(q)]\n'
  ),
  'level-68-problem-4': challenge(
'Rotate a Matrix Layer', 'Move the outer ring one position clockwise, leaving interior cells unchanged. For one row move values one position right cyclically; for one column move them one position down cyclically.',
matrixInput, matrixOutput, matrixLimits,
[['3 3\n1 2 3\n4 5 6\n7 8 9\n','4 1 2\n7 5 3\n8 9 6','The outer values move clockwise and the center remains 5.'],['1 4\n1 2 3 4\n','4 1 2 3','The thin row rotates right.'],['1 1\n5\n','5'],['3 1\n1\n2\n3\n','3\n1\n2'],['2 2\n1 2\n3 4\n','3 1\n4 2'],['2 3\n1 2 3\n4 5 6\n','4 1 2\n5 6 3'],['3 2\n1 2\n3 4\n5 6\n','3 1\n5 2\n6 4'],['2 2\n0 0\n0 0\n','0 0\n0 0']],
['List the boundary coordinates in movement order.', 'For a normal rectangle go across the top, down the right, left along the bottom, and up the left.', 'Avoid listing corners twice.', 'For a thin row or column use its natural increasing index order.', 'Move each saved value to the next coordinate, wrapping at the end.'],
`r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
if r == 1:
    ring = [(0, j) for j in range(c)]
elif c == 1:
    ring = [(i, 0) for i in range(r)]
else:
    ring = ([(0, j) for j in range(c)] + [(i, c - 1) for i in range(1, r)]
            + [(r - 1, j) for j in range(c - 2, -1, -1)] + [(i, 0) for i in range(r - 2, 0, -1)])
values = [grid[i][j] for i, j in ring]
for k, (i, j) in enumerate(ring):
    grid[i][j] = values[k - 1]
for row in grid:
    print(*row)
`, 'Rotate the saved boundary values along a non-repeating coordinate list.', matrixStarter
  ),
  'level-68-problem-5': challenge(
'Matrix Saddle Points', 'Find every cell that is a minimum in its row and a maximum in its column; ties qualify.',
matrixInput, 'Print the number of cells, then each zero-based row and column on its own line in row-major order.', matrixLimits,
[['2 3\n3 1 2\n4 2 5\n','1\n1 1','The 2 in row 1 is its row minimum and column 1 maximum.'],['2 2\n1 1\n1 1\n','4\n0 0\n0 1\n1 0\n1 1','All cells tie for both required extrema.'],['1 1\n-1\n','1\n0 0'],['1 3\n3 1 2\n','1\n0 1'],['3 1\n1\n5\n3\n','1\n1 0'],['2 2\n1 2\n2 1\n','0'],['2 3\n0 2 0\n1 3 1\n','2\n1 0\n1 2'],['2 2\n-3 -2\n-1 0\n','1\n1 0']],
['Find the minimum of each row.', 'Find the maximum of each column.', 'A cell must equal both of its corresponding extrema.', 'Equality means ties can produce several saddle points.', 'Collect qualifying coordinates in row-major order.'],
`r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
row_min = [min(row) for row in grid]
col_max = [max(grid[i][j] for i in range(r)) for j in range(c)]
points = [(i, j) for i in range(r) for j in range(c) if grid[i][j] == row_min[i] == col_max[j]]
print(len(points))
for point in points:
    print(*point)
`, 'Compare each cell with its row minimum and column maximum.', matrixStarter
  ),
  'level-69-problem-1': challenge(
    'Evaluate a Polynomial and Its Derivative', 'Given coefficients in descending degree order, evaluate both the polynomial and its derivative at integer x using a function.',
    'First line: one or more space-separated integer coefficients, highest degree first. Second line: integer x.', 'Print the polynomial value and derivative value separated by a space.',
    ['There are 1 to 12 coefficients, each between -10 and 10.', '-10 <= x <= 10.'],
    [['2 3 4\n2\n','18 11','For 2x²+3x+4, the value is 18 and the derivative 4x+3 is 11.'],['5 -2\n-3\n','-17 5','For 5x-2, the value is -17 and the derivative is 5.'],['7\n4\n','7 0'],['0 0\n3\n','0 0'],['1 0 0\n0\n','0 0'],['1 0 0\n-2\n','4 -4'],['1 -3 2\n1\n','0 -1'],['0 2 0 1\n3\n','19 12']],
    ['A constant polynomial has derivative zero.', 'Horner evaluation folds coefficients from left to right.', 'Maintain both the value and the derivative of the prefix polynomial.', 'Before updating the value, update derivative as derivative*x + old value.', 'Print both final accumulators.'],
    `def value_and_derivative(coefficients, x):
    value = derivative = 0
    for coefficient in coefficients:
        derivative = derivative * x + value
        value = value * x + coefficient
    return value, derivative

coefficients = list(map(int, input().split()))
x = int(input())
print(*value_and_derivative(coefficients, x))
`, 'Differentiate each Horner step while accumulating the value.', 'coefficients = list(map(int, input().split()))\nx = int(input())\n\n# Compute and print both results.\n'
  ),
  'level-69-problem-2': challenge(
    'Normalize a Numeric Vector', 'Return the unit vector in the same direction as a nonzero vector using its Euclidean norm.',
    'One line of space-separated integer vector components.', 'Print the normalized components separated by spaces, each to exactly six digits after the decimal point using Python float formatting.',
    ['The vector has 1 to 20 components between -100 and 100.', 'At least one component is nonzero.'],
    [['3 4\n','0.600000 0.800000','The norm is 5, so the components are 3/5 and 4/5.'],['0 -5\n','0.000000 -1.000000','The norm is 5 and the negative direction is preserved.'],['1\n','1.000000'],['-1\n','-1.000000'],['1 1\n','0.707107 0.707107'],['2 0 0\n','1.000000 0.000000 0.000000'],['-3 4\n','-0.600000 0.800000'],['2 3 6\n','0.285714 0.428571 0.857143']],
    ['The Euclidean norm is the square root of the sum of squares.', 'Define a function accepting the vector.', 'Square and add all components.', 'Divide each original component by the positive norm.', 'Format each returned number with six decimal places.'],
    `from math import sqrt

def normalize(vector):
    norm = sqrt(sum(x * x for x in vector))
    return [x / norm for x in vector]

vector = list(map(int, input().split()))
print(*(f'{x:.6f}' for x in normalize(vector)))
`, 'Divide every component by the vector norm.', 'vector = list(map(int, input().split()))\n\n# Normalize and print the vector.\n'
  ),
  'level-69-problem-3': challenge(
    'Apply and Invert an Affine Transform', 'For f(t)=a*t+b, compute f(x) and independently invert a supplied output y. Express the inverse as a reduced fraction with positive denominator.',
    'One line: integers a b x y.', 'Print f(x), then the numerator and denominator of f inverse(y), separated by spaces.',
    ['-100 <= a, b, x, y <= 100.', 'a is nonzero.'],
    [['2 1 3 9\n','7 4 1','f(3)=7, while the inverse of 9 is (9-1)/2=4.'],['-2 3 2 4\n','-1 -1 2','f(2)=-1 and the inverse of 4 is -1/2.'],['1 0 0 0\n','0 0 1'],['3 0 1 1\n','3 1 3'],['-1 -2 -3 -5\n','1 3 1'],['4 2 -1 -2\n','-2 -1 1'],['6 1 0 5\n','1 2 3'],['-4 0 2 2\n','-8 -1 2']],
    ['Apply the formula directly to x.', 'To invert y, subtract b and divide by a.', 'Keep the inverse exact as numerator and denominator.', 'Divide both by their greatest common divisor.', 'If the denominator is negative, negate both parts.'],
    `from math import gcd

def apply(a, b, x):
    return a * x + b

def inverse(a, b, y):
    numerator, denominator = y - b, a
    if denominator < 0:
        numerator, denominator = -numerator, -denominator
    divisor = gcd(numerator, denominator)
    return numerator // divisor, denominator // divisor

a, b, x, y = map(int, input().split())
print(apply(a, b, x), *inverse(a, b, y))
`, 'Apply the forward transform and reduce the exact inverse fraction.', 'a, b, x, y = map(int, input().split())\n\n# Apply and invert the transform.\n'
  ),
  'level-69-problem-4': challenge(
    'Memoized Unary Function Wrapper', 'Wrap the function f(x)=x*x+1 in a memoizing closure. Evaluate the given arguments in order and count actual calls to f; repeated arguments use the cache.',
    'One line of space-separated integer arguments; an empty line gives no arguments.', 'First print the result values separated by spaces on one line (empty if none). Then print the number of actual calls to f.',
    ['There are at most 50 arguments, each between -100 and 100.'],
    [['2 3 2\n','5 10 5\n2','The second 2 reuses its cached result, so f runs twice.'],['-1 1 -1\n','2 2 2\n2','Different arguments are separate keys even when their outputs match.'],['\n','\n0'],['0\n','1\n1'],['4 4 4\n','17 17 17\n1'],['1 2 3\n','2 5 10\n3'],['0 -2 0 -2\n','1 5 1 5\n2'],['-3 3 0\n','10 10 1\n3']],
    ['A closure can retain a dictionary between calls.', 'Use the argument itself as the cache key.', 'Only call the underlying function when the key is absent.', 'Record how many times the underlying function actually runs.', 'Print results in the original argument order, including repeats.'],
    `def memoize(function):
    cache = {}
    def wrapped(x):
        if x not in cache:
            cache[x] = function(x)
        return cache[x]
    return wrapped

calls = 0
def f(x):
    global calls
    calls += 1
    return x * x + 1

arguments = list(map(int, input().split()))
cached = memoize(f)
print(*(cached(x) for x in arguments))
print(calls)
`, 'The closure stores results by argument and calls the underlying function on misses.', 'arguments = list(map(int, input().split()))\n\n# Memoize, evaluate, and print results and call count.\n'
  ),
  'level-69-problem-5': challenge(
    'Numerical Integration by Trapezoids', 'Approximate the integral of f(x)=a*x*x+b*x+c from left to right using n equal trapezoids.',
    'One line: integers a b c left right n.', 'Round the exact trapezoid sum to six decimal places, with ties to even. Print exactly six digits after the decimal point and print zero as 0.000000, never -0.000000.',
    ['-10 <= a, b, c, left, right <= 10.', 'left <= right and 1 <= n <= 20.'],
    [['1 0 0 0 2 2\n','3.000000','Widths are 1 and heights are 0, 1, 4, giving areas 0.5 and 2.5.'],['0 2 1 0 2 1\n','6.000000','One trapezoid has endpoint heights 1 and 5 and width 2.'],['0 -3 6 -5 9 3\n','0.000000'],['1 0 0 0 1 8\n','0.335938'],['3 0 0 0 1 8\n','1.007812'],['-3 0 0 0 1 8\n','-1.007812'],['-1 0 0 -1 1 2\n','-1.000000'],['1 2 3 4 4 5\n','0.000000']],
    ['The width of each interval is (right-left)/n.', 'Evaluate the function at both ends of each interval.', 'Each trapezoid area is width times the average endpoint height.', 'Use exact fractions to sum all n areas before rounding.', 'Round the absolute scaled fraction using quotient and remainder; on an exact tie choose an even last digit, and omit the sign when the rounded result is zero.'],
    `from fractions import Fraction

def integrate(function, left, right, n):
    width = Fraction(right - left, n)
    return sum(width * (function(left + i * width) + function(left + (i + 1) * width)) / 2 for i in range(n))

def format_exact(value):
    scaled, remainder = divmod(abs(value.numerator) * 1000000, value.denominator)
    if 2 * remainder > value.denominator or (2 * remainder == value.denominator and scaled % 2):
        scaled += 1
    sign = '-' if value < 0 and scaled else ''
    return f'{sign}{scaled // 1000000}.{scaled % 1000000:06d}'

a, b, c, left, right, n = map(int, input().split())
def f(x):
    return a * x * x + b * x + c
print(format_exact(integrate(f, left, right, n)))
`, 'Sum exact rational trapezoid areas, then round the scaled fraction to even and normalize zero.', 'a, b, c, left, right, n = map(int, input().split())\n\n# Approximate and print the integral.\n'
  ),
  'level-70-problem-1': challenge(
    'Convolve a Grid with a Kernel', 'For each valid kernel-sized window, sum products of corresponding grid and kernel cells without reversing the kernel or padding.',
    'First line R C H W. Next R lines contain C grid integers; next H lines contain W kernel integers.', matrixOutput,
    ['1 <= H <= R <= 10 and 1 <= W <= C <= 10.', 'All entries are integers from -10 to 10.'],
    [['2 3 2 2\n1 2 3\n4 5 6\n1 0\n0 -1\n','-4 -4','The two windows give 1-5 and 2-6.'],['1 3 1 2\n2 3 4\n1 2\n','8 11','Each window uses the kernel in the given order.'],['1 1 1 1\n5\n-2\n','-10'],['2 2 1 1\n1 2\n3 4\n0\n','0 0\n0 0'],['2 2 2 2\n1 2\n3 4\n1 1\n1 1\n','10'],['3 1 2 1\n1\n2\n3\n-1\n1\n','1\n1'],['2 3 1 2\n1 0 1\n0 1 0\n1 -1\n','1 -1\n-1 1'],['2 2 2 1\n-1 2\n3 -4\n2\n1\n','1 0']],
    ['Place the kernel only where it fits completely.', 'Each output cell corresponds to one window origin.', 'Multiply each kernel value by the aligned grid value.', 'Sum these products for each origin.', 'Do not reverse the kernel and do not pad the grid.'],
    `R, C, H, W = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(R)]
kernel = [list(map(int, input().split())) for _ in range(H)]
for i in range(R - H + 1):
    row = []
    for j in range(C - W + 1):
        row.append(sum(grid[i + x][j + y] * kernel[x][y] for x in range(H) for y in range(W)))
    print(*row)
`, 'Compute a dot product for each valid window.', 'R, C, H, W = map(int, input().split())\ngrid = [list(map(int, input().split())) for _ in range(R)]\nkernel = [list(map(int, input().split())) for _ in range(H)]\n\n# Compute and print the output grid.\n'
  ),
  'level-70-problem-2': challenge(
    'Solve Two Linear Equations', 'Classify two equations in x and y as having one solution, no solution, or infinitely many solutions.',
    'Two lines, each containing a b c for the equation a*x + b*y = c.', 'Print NONE, INFINITE, or UNIQUE followed by x and y as reduced fractions; print integers without /1 and use positive denominators.',
    ['All six coefficients are integers from -20 to 20.'],
    [['1 1 3\n1 -1 1\n','UNIQUE 2 1','Adding the equations gives x=2, then y=1.'],['2 2 2\n1 1 3\n','NONE','The left sides are proportional but the right sides disagree.'],['1 1 2\n2 2 4\n','INFINITE'],['0 0 0\n0 0 0\n','INFINITE'],['0 0 1\n0 0 0\n','NONE'],['0 2 1\n3 0 1\n','UNIQUE 1/3 1/2'],['1 0 -2\n0 -2 1\n','UNIQUE -2 -1/2'],['0 0 0\n2 3 4\n','INFINITE']],
    ['Compute the determinant of the coefficient matrix.', 'A nonzero determinant gives a unique solution.', 'Use exact fractions to avoid floating-point rounding.', 'For a zero determinant, detect impossible zero-coefficient equations.', 'Otherwise compare the augmented rows for consistency.'],
    `from fractions import Fraction

def classify(a, b, c, d, e, f):
    determinant = a * e - b * d
    if determinant:
        return 'UNIQUE', Fraction(c * e - b * f, determinant), Fraction(a * f - c * d, determinant)
    if (a == b == 0 and c != 0) or (d == e == 0 and f != 0):
        return ('NONE',)
    if a * f != d * c or b * f != e * c:
        return ('NONE',)
    return ('INFINITE',)

a, b, c = map(int, input().split())
d, e, f = map(int, input().split())
print(*classify(a, b, c, d, e, f))
`, 'Use the determinant for unique solutions and check degenerate equations for consistency.', 'a, b, c = map(int, input().split())\nd, e, f = map(int, input().split())\n\n# Classify and print the system.\n'
  ),
  'level-70-problem-3': challenge(
    'Deterministic Row-Echelon Form', 'Transform a matrix to row-echelon form: scan columns left to right, choose the first nonzero row at or below the next pivot row, swap it into place, divide the pivot row by its pivot, and eliminate that column below it. Use exact arithmetic.',
    matrixInput, 'Print the resulting matrix as space-separated reduced fractions, one row per line. Print integers without /1 and use positive denominators.',
    ['1 <= R, C <= 4.', 'Entries are integers from -10 to 10.'],
    [['2 2\n0 2\n1 3\n','1 3\n0 1','Swap the rows, then normalize both pivots.'],['2 2\n2 1\n1 2\n','1 1/2\n0 1','Normalize the first row and eliminate below it before normalizing the second.'],['1 1\n0\n','0'],['1 2\n0 -2\n','0 1'],['2 2\n1 2\n2 4\n','1 2\n0 0'],['2 3\n1 2 3\n0 0 0\n','1 2 3\n0 0 0'],['3 2\n0 1\n0 2\n1 0\n','1 0\n0 1\n0 0'],['2 3\n2 0 1\n0 3 1\n','1 0 1/2\n0 1 1/3']],
    ['Keep a separate index for the next pivot row.', 'Search downward for the first nonzero entry in each column.', 'Swap it into the pivot row and divide the entire row by the pivot.', 'Subtract multiples of that normalized row from rows below.', 'Use fractions and skip columns without a pivot.'],
    `from fractions import Fraction
r, c = map(int, input().split())
grid = [[Fraction(x) for x in input().split()] for _ in range(r)]
pivot_row = 0
for col in range(c):
    pivot = next((i for i in range(pivot_row, r) if grid[i][col]), None)
    if pivot is None:
        continue
    grid[pivot_row], grid[pivot] = grid[pivot], grid[pivot_row]
    divisor = grid[pivot_row][col]
    grid[pivot_row] = [x / divisor for x in grid[pivot_row]]
    for i in range(pivot_row + 1, r):
        factor = grid[i][col]
        grid[i] = [x - factor * y for x, y in zip(grid[i], grid[pivot_row])]
    pivot_row += 1
    if pivot_row == r:
        break
for row in grid:
    print(*row)
`, 'Use exact fractions with the specified pivot and elimination order.', matrixStarter
  ),
  'level-70-problem-4': challenge(
    'Matrix Determinant by Elimination', 'Compute the determinant of an integer square matrix using elimination.',
    'First line n; next n lines contain n integers each.', 'Print the determinant as an integer.',
    ['1 <= n <= 5.', 'Entries are integers from -10 to 10.'],
    [['2\n1 2\n3 4\n','-2','The determinant is 1*4-2*3.'],['2\n0 1\n2 3\n','-2','Swapping the rows changes the determinant sign.'],['1\n0\n','0'],['1\n-5\n','-5'],['2\n1 2\n2 4\n','0'],['3\n1 0 0\n0 2 0\n0 0 3\n','6'],['3\n0 1 0\n0 0 1\n1 0 0\n','1'],['3\n2 1 3\n1 0 2\n4 1 8\n','-1']],
    ['Find a nonzero pivot in each column, swapping rows when needed.', 'Each row swap reverses the determinant sign.', 'Eliminate entries below each pivot without scaling rows.', 'The product of triangular diagonal entries gives the determinant.', 'Use exact fractions so intermediate division cannot round.'],
    `from fractions import Fraction
n = int(input())
grid = [[Fraction(x) for x in input().split()] for _ in range(n)]
det = Fraction(1)
for col in range(n):
    pivot = next((i for i in range(col, n) if grid[i][col]), None)
    if pivot is None:
        det = 0
        break
    if pivot != col:
        grid[col], grid[pivot] = grid[pivot], grid[col]
        det = -det
    value = grid[col][col]
    det *= value
    for i in range(col + 1, n):
        factor = grid[i][col] / value
        for j in range(col, n):
            grid[i][j] -= factor * grid[col][j]
print(det)
`, 'Triangularize exactly while tracking pivot products and row-swap signs.', 'n = int(input())\ngrid = [list(map(int, input().split())) for _ in range(n)]\n\n# Compute and print the determinant.\n'
  ),
  'level-70-problem-5': challenge(
    'Identify Zero Rows and Columns', 'Identify all rows and columns containing only zeroes.',
    matrixInput, 'Print two lines: first the count and zero-based indices of all-zero rows, then the count and indices of all-zero columns. Indices must increase.', matrixLimits,
    [['3 3\n0 0 0\n1 0 2\n0 0 0\n','2 0 2\n1 1','Rows 0 and 2 and column 1 contain only zeroes.'],['2 2\n1 2\n3 4\n','0\n0','No row or column is all zero.'],['1 1\n0\n','1 0\n1 0'],['1 1\n5\n','0\n0'],['1 3\n0 1 0\n','0\n2 0 2'],['3 1\n0\n1\n0\n','2 0 2\n0'],['2 2\n0 0\n0 0\n','2 0 1\n2 0 1'],['2 3\n-1 0 0\n0 0 2\n','0\n1 1']],
    ['Check every entry of each row for zero.', 'For a column, inspect that index across all rows.', 'Collect the zero-based indices in increasing order.', 'A fully zero matrix includes every row and every column.', 'Print each count before its indices.'],
    `r, c = map(int, input().split())
grid = [list(map(int, input().split())) for _ in range(r)]
rows = [i for i in range(r) if all(x == 0 for x in grid[i])]
columns = [j for j in range(c) if all(grid[i][j] == 0 for i in range(r))]
print(len(rows), *rows)
print(len(columns), *columns)
`, 'Test all entries of each row and each column independently.', matrixStarter
  )
};
