import { challenge } from './beginner.js';

const integers = 'One line of space-separated integers; an empty line is an empty list.';
const twoLists = `Two lines, each a space-separated integer list; an empty line is an empty list.`;
const integerLimits = ['Each list has at most 50 integers, each between -100 and 100.'];
const listOutput = 'Print the result as space-separated integers on one line, or an empty line if there are none.';
const countOutput = 'Print one integer.';
const listStarter = "a = list(map(int, input().split()))\n\n# Compute and print the answer.\n";
const twoStarter = "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\n\n# Compute and print the answer.\n";
const targetStarter = "a = list(map(int, input().split()))\ntarget = int(input())\n\n# Compute and print the answer.\n";
const withTarget = `${integers} The second line contains an integer target.`;
const targetLimits = [...integerLimits, '-1000 <= target <= 1000.'];

export const collections5660Challenges = {
  'level-56-problem-1': challenge(
    'Check Multiset Equality', 'Decide whether two lists have exactly the same values with the same multiplicities.',
    twoLists, 'Print YES if the multisets are equal, otherwise NO.', integerLimits,
    [['1 2 1\n2 1 1\n','YES','Both lists contain two 1s and one 2.'],['1 1 2\n1 2 2\n','NO','The counts of 1 and 2 differ.'],['\n\n','YES'],['1\n\n','NO'],['-2 0 -2\n0 -2 -2\n','YES'],['1 2\n2 1 1\n','NO'],['4 4 4\n4 4 4\n','YES'],['-100 100\n100 -100\n','YES']],
    ['Order does not matter here.', 'Repeated values still count separately.', 'Count occurrences of each value in each list.', 'Compare the two count maps.', 'Two empty lists have equal counts.'],
    `from collections import Counter
a = list(map(int, input().split()))
b = list(map(int, input().split()))
print('YES' if Counter(a) == Counter(b) else 'NO')
`, 'Compare occurrence counts rather than element positions.', twoStarter
  ),
  'level-56-problem-2': challenge(
    'Multiset Difference', 'Remove from the first list one occurrence for each occurrence in the second list. Remove earliest matching occurrences and keep all other first-list values in their original order.',
    twoLists, listOutput, integerLimits,
    [['3 1 3 2 3\n3 2\n','1 3 3','Remove the first 3 and the 2.'],['1 2 1\n1 1 1\n','2','Only the two available 1s are removed.'],['\n1\n',''],['1 2\n\n','1 2'],['2 2 2\n2 2\n','2'],['-1 0 -1\n0 -1\n','-1'],['1 2 3\n4\n','1 2 3'],['3 2 3 2\n2 3\n','3 2']],
    ['Each second-list occurrence removes at most one value.', 'Count how many removals remain for each value.', 'Scan the first list from left to right.', 'If its value has a remaining removal, consume one; otherwise keep it.', 'Print kept values in their original order.'],
    `from collections import Counter
a = list(map(int, input().split()))
remaining = Counter(map(int, input().split()))
out = []
for x in a:
    if remaining[x] > 0:
        remaining[x] -= 1
    else:
        out.append(x)
print(*out)
`, 'Consume available removal counts while scanning the first list.', twoStarter
  ),
  'level-56-problem-3': challenge(
    'Build a Word-to-Document Index', 'For each word, list the zero-based indices of documents containing it. Repetitions within one document count only once.',
    'First line n; next n lines are documents containing space-separated lowercase words, possibly empty.',
    'Print the number of distinct words, then one line per word in alphabetical order: word followed by its document indices in increasing order.',
    ['0 <= n <= 50.', 'Each document has at most 50 lowercase ASCII words of length 1 through 20.'],
    [['3\ncat dog cat\ndog\ncat bird\n','3\nbird 2\ncat 0 2\ndog 0 1','cat occurs in documents 0 and 2, despite its repetition in 0.'],['2\n\nsun sun\n','1\nsun 1','The empty document contributes no words.'],['0\n','0'],['1\n\n','0'],['1\na b a\n','2\na 0\nb 0'],['2\nz a\nz a\n','2\na 0 1\nz 0 1'],['3\nx\nx\nx\n','1\nx 0 1 2'],['2\nbb aa\ncc\n','3\naa 0\nbb 0\ncc 1']],
    ['Number the documents starting at zero.', 'Split each document into words.', 'Use a set to discard repetitions inside that document.', 'Append the document index under each word.', 'Print words alphabetically and indices in scan order.'],
    `n = int(input())
index = {}
for i in range(n):
    for word in set(input().split()):
        index.setdefault(word, []).append(i)
print(len(index))
for word in sorted(index):
    print(word, *index[word])
`, 'Deduplicate each document before adding its index to each word.', "n = int(input())\ndocuments = [input().split() for _ in range(n)]\n\n# Build and print the index.\n"
  ),
  'level-56-problem-4': challenge(
    'Group Anagram Words', 'Group words with the same letters and multiplicities. Keep words in input order within each group and order groups by their first appearance.',
    'One line of space-separated lowercase ASCII words; an empty line means no words.',
    'Print the number of groups, then one group per line with its words separated by spaces.',
    ['At most 50 words, each 1 to 20 letters long.'],
    [['lamp maze palm plum zema\n','3\nlamp palm\nmaze zema\nplum','lamp and palm share letters; maze and zema share letters; plum stands alone.'],['a b a\n','2\na a\nb','Repeated words remain repeated in their first group.'],['\n','0'],['x\n','1\nx'],['ab ba abc\n','2\nab ba\nabc'],['a aa aaa\n','3\na\naa\naaa'],['abc cba bac cab\n','1\nabc cba bac cab'],['z y x\n','3\nz\ny\nx']],
    ['Anagrams have the same count of every letter.', 'Sorting the letters gives a shared key for anagrams.', 'Map each key to a list of words.', 'Append each word as it arrives.', 'Dictionary insertion order keeps groups in first-appearance order.'],
    `groups = {}
for word in input().split():
    key = ''.join(sorted(word))
    groups.setdefault(key, []).append(word)
print(len(groups))
for group in groups.values():
    print(*group)
`, 'Sorted letters identify each group, and insertion order preserves group order.', "words = input().split()\n\n# Group and print the words.\n"
  ),
  'level-56-problem-5': challenge(
    'Two-Sum Indices', 'Find the lexicographically smallest pair of zero-based indices i < j whose values sum to the target. Lexicographic order compares i first, then j.',
    withTarget, 'Print i and j separated by a space, or -1 if no pair exists.', targetLimits,
    [['3 2 4 3\n6\n','0 3','Pairs (0,3) and (1,2) work; (0,3) is lexicographically smaller.'],['1 1 1\n2\n','0 1','Every pair works, and (0,1) is smallest.'],['\n0\n','-1'],['5\n10\n','-1'],['1 2 3\n10\n','-1'],['-3 5 2 -1\n2\n','0 1'],['0 0\n0\n','0 1'],['2 7 2 7\n9\n','0 1']],
    ['A pair must use two different indices.', 'For each value, look for the target minus that value.', 'Store the earliest index of every previously seen value.', 'Compare candidate pairs by their first index and then their second.', 'Report -1 if no candidate was found.'],
    `a = list(map(int, input().split()))
target = int(input())
first = {}
best = None
for j, x in enumerate(a):
    if target - x in first:
        pair = (first[target - x], j)
        if best is None or pair < best:
            best = pair
    if x not in first:
        first[x] = j
print(*best) if best is not None else print(-1)
`, 'Keep earliest complement indices and compare all candidate pairs.', targetStarter
  ),
  'level-57-problem-1': challenge(
    'Count Pair Sums', 'Count index pairs i < j whose values sum to the target. Equal values at different indices are separate choices.',
    withTarget, countOutput, targetLimits,
    [['1 2 1 2\n3\n','4','Each of the two 1s pairs with each of the two 2s.'],['0 0 0\n0\n','3','Three distinct index pairs sum to zero.'],['\n0\n','0'],['5\n10\n','0'],['1 2 3\n8\n','0'],['-2 3 0 5\n3\n','2'],['2 2 2 2\n4\n','6'],['-1 -1 1 1\n0\n','4']],
    ['Consider pairs of positions, not just distinct values.', 'For each value, find the complementary value.', 'Keep counts of values already visited.', 'Add the previous complement count before recording the current value.', 'This counts each pair once, at its later index.'],
    `a = list(map(int, input().split()))
target = int(input())
counts = {}
answer = 0
for x in a:
    answer += counts.get(target - x, 0)
    counts[x] = counts.get(x, 0) + 1
print(answer)
`, 'Each current element completes one pair per previously seen complement.', targetStarter
  ),
  'level-57-problem-2': challenge(
    'Subarray Sum Frequency', 'Count nonempty contiguous subarrays whose sum equals the target. Negative values and zero are allowed.',
    withTarget, countOutput, targetLimits,
    [['1 -1 1\n1\n','3','The two single 1s and the full list sum to 1.'],['0 0 0\n0\n','6','All six nonempty contiguous subarrays sum to zero.'],['\n0\n','0'],['4\n4\n','1'],['1 2 3\n7\n','0'],['-1 -1 1\n-1\n','3'],['2 -2 2 -2\n0\n','4'],['1 2 3\n3\n','2']],
    ['A subarray uses consecutive positions.', 'A subarray sum is the difference of two prefix sums.', 'Count earlier prefix sums, starting with the empty prefix sum zero.', 'For each new prefix, add the count of prefix minus target.', 'Then record the new prefix for later endpoints.'],
    `a = list(map(int, input().split()))
target = int(input())
counts = {0: 1}
prefix = 0
answer = 0
for x in a:
    prefix += x
    answer += counts.get(prefix - target, 0)
    counts[prefix] = counts.get(prefix, 0) + 1
print(answer)
`, 'Count prior prefix sums that differ from the current prefix by the target.', targetStarter
  ),
  'level-57-problem-3': challenge(
    'Longest Consecutive Value Sequence', 'Find the length of the longest run of consecutive integer values present anywhere in the list. Repetitions do not extend a run.',
    integers, countOutput, integerLimits,
    [['-8 21 -10 -6 -9 -8 -7\n','5','The values -10 through -6 form a run of five, even though -8 repeats.'],['-2 0 -1 5\n','3','The run -2, -1, 0 has length three.'],['\n','0'],['7\n','1'],['2 2 2\n','1'],['1 3 5\n','1'],['5 4 3 2 1\n','5'],['-100 100\n','1']],
    ['A run is about values, not adjacent list positions.', 'Use a set to ignore duplicates and check membership.', 'Only begin a run at a value whose predecessor is absent.', 'Count successive values while they are present.', 'Track the greatest length, starting at zero.'],
    `a = set(map(int, input().split()))
best = 0
for x in a:
    if x - 1 not in a:
        end = x
        while end in a:
            end += 1
        best = max(best, end - x)
print(best)
`, 'Start only at the beginning of each consecutive run.', listStarter
  ),
  'level-57-problem-4': challenge(
    'Minimum Deletions for Unique Frequencies', 'Delete as few list entries as possible so that no two remaining distinct values have the same positive occurrence count. A value may be deleted entirely.',
    integers, 'Print the minimum number of deletions.', integerLimits,
    [['8 8 8 5 5 5 2 2 1\n','3','Counts 3, 3, 2, 1 can become 3, 2, 1, 0 with three deletions.'],['7 7 9\n','0','Counts 2 and 1 are already different.'],['\n','0'],['4 4 4\n','0'],['1 1 2 2\n','1'],['1 2 3 4\n','3'],['3 3 3 3 5 5 5 7 7\n','0'],['3 3 3 4 4 4 5 5 5\n','3']],
    ['Count how often each value occurs.', 'Two values may not keep the same positive frequency.', 'Process frequencies from largest to smallest.', 'For each, keep the largest available frequency not exceeding its original count.', 'Count the removed entries; zero may be reused because that value disappears.'],
    `a = list(map(int, input().split()))
counts = {}
for x in a:
    counts[x] = counts.get(x, 0) + 1
used = set()
deleted = 0
for frequency in sorted(counts.values(), reverse=True):
    keep = frequency
    while keep > 0 and keep in used:
        keep -= 1
    deleted += frequency - keep
    if keep:
        used.add(keep)
print(deleted)
`, 'Assign each frequency its largest unused positive size, or zero, and count removed entries.', listStarter
  ),
  'level-57-problem-5': challenge(
    'Count Distinct Values per Window', 'For every contiguous window of width k, count its distinct values, in left-to-right order.',
    `${integers} The second line contains k.`, listOutput,
    [...integerLimits, '1 <= k <= list length.'],
    [['1 2 1 3\n3\n','2 3','The windows 1 2 1 and 2 1 3 contain two and three distinct values.'],['4 4 4\n2\n','1 1','Both windows contain only 4.'],['5\n1\n','1'],['1 2 3\n1\n','1 1 1'],['1 2 1\n3\n','2'],['-1 0 -1 0\n2\n','2 2 2'],['1 2 3 4\n2\n','2 2 2'],['0 0 1 1 0\n3\n','2 2 2']],
    ['A window contains k consecutive entries.', 'Count occurrences of each value in the first window.', 'The number of keys with positive counts is the distinct count.', 'When sliding, decrement the outgoing value and remove a zero count.', 'Increment the incoming value and record the next count.'],
    `a = list(map(int, input().split()))
k = int(input())
counts = {}
out = []
for i, x in enumerate(a):
    counts[x] = counts.get(x, 0) + 1
    if i >= k:
        old = a[i-k]
        counts[old] -= 1
        if counts[old] == 0:
            del counts[old]
    if i >= k-1:
        out.append(len(counts))
print(*out)
`, 'Maintain positive frequencies for each full window.', targetStarter
  ),
  'level-58-problem-1': challenge(
    'Sparse Vector Dot Product', 'Compute the dot product of two sparse vectors. Unlisted indices have value zero.',
    'First line n; next n lines contain index value for the first vector. Then line m and m index value lines for the second.',
    countOutput, ['0 <= n, m <= 30.', 'Indices are distinct within each vector and lie between 0 and 100.', 'Values are integers from -10 to 10.'],
    [['2\n0 3\n4 2\n2\n4 5\n7 9\n','10','Only index 4 is shared, contributing 2 times 5.'],['1\n1 -2\n1\n1 3\n','-6','The shared entries multiply to -6.'],['0\n0\n','0'],['1\n0 9\n0\n','0'],['1\n1 5\n1\n2 5\n','0'],['2\n1 2\n2 -3\n2\n1 -2\n2 4\n','-16'],['1\n0 0\n1\n0 8\n','0'],['2\n100 10\n0 -10\n1\n100 -10\n','-100']],
    ['An unlisted entry is zero.', 'Store one vector by index in a dictionary.', 'Read each entry of the other vector.', 'Multiply it by the first value at that index, defaulting to zero.', 'Add all products and print the total.'],
    `n = int(input())
a = dict(tuple(map(int, input().split())) for _ in range(n))
m = int(input())
total = 0
for _ in range(m):
    i, value = map(int, input().split())
    total += a.get(i, 0) * value
print(total)
`, 'Only matching indices contribute to the dot product.', "n = int(input())\na = [tuple(map(int, input().split())) for _ in range(n)]\nm = int(input())\nb = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Compute the dot product.\n"
  ),
  'level-58-problem-2': challenge(
    'Differentiate a Sparse Polynomial', 'Differentiate a polynomial represented by exponent-coefficient pairs, omitting zero coefficients from the result.',
    'First line n; next n lines contain exponent coefficient.',
    'Print the number of nonzero derivative terms, then exponent coefficient on separate lines in increasing exponent order.',
    ['0 <= n <= 30.', 'Exponents are distinct integers from 0 to 10; coefficients are integers from -10 to 10.'],
    [['3\n0 7\n2 3\n1 -2\n','2\n0 -2\n1 6','The derivative of 7 + 3x² - 2x is 6x - 2.'],['2\n0 4\n3 0\n','0','A constant differentiates to zero, and zero terms are omitted.'],['0\n','0'],['1\n1 1\n','1\n0 1'],['1\n10 -2\n','1\n9 -20'],['2\n2 2\n4 -1\n','2\n1 4\n3 -4'],['1\n0 -3\n','0'],['3\n3 1\n1 2\n2 3\n','3\n0 2\n1 6\n2 3']],
    ['The derivative of c times x to the e is c*e times x to the e-1.', 'Constant terms contribute nothing.', 'Multiply each coefficient by its exponent.', 'Discard zero resulting coefficients.', 'Sort remaining exponents before printing.'],
    `n = int(input())
terms = {}
for _ in range(n):
    exponent, coefficient = map(int, input().split())
    if exponent > 0 and coefficient != 0:
        terms[exponent - 1] = exponent * coefficient
print(len(terms))
for exponent in sorted(terms):
    print(exponent, terms[exponent])
`, 'Apply the power rule to each nonconstant nonzero term.', "n = int(input())\nterms = [tuple(map(int, input().split())) for _ in range(n)]\n\n# Differentiate and print the terms.\n"
  ),
  'level-58-problem-3': challenge(
    'Count Candidate Polynomial Roots', 'Count how many candidate integers make the given polynomial equal zero. Repeated candidates count separately.',
    'First line n; next n lines contain exponent coefficient. The final line contains space-separated candidate integers and may be empty.',
    countOutput, ['0 <= n <= 30.', 'Exponents are distinct integers from 0 to 8; coefficients and candidates are integers from -10 to 10.', 'There are at most 50 candidates.'],
    [['2\n2 1\n0 -1\n-1 0 1 2\n','2','x² - 1 is zero at -1 and 1.'],['1\n1 2\n0 0 3\n','2','Both occurrences of zero are roots of 2x.'],['0\n1 2 3\n','3'],['0\n\n','0'],['1\n0 5\n0 1\n','0'],['1\n1 1\n-1 0 1\n','1'],['2\n1 1\n0 -2\n2 2 3\n','2'],['2\n2 1\n0 1\n-1 0 1\n','0']],
    ['Test each candidate separately.', 'For a term e c, calculate c multiplied by candidate to the power e.', 'Add all term values for that candidate.', 'Count it if the sum equals zero.', 'The empty polynomial is zero for every candidate.'],
    `n = int(input())
terms = dict(tuple(map(int, input().split())) for _ in range(n))
candidates = list(map(int, input().split()))
count = 0
for x in candidates:
    value = sum(c * x ** e for e, c in terms.items())
    if value == 0:
        count += 1
print(count)
`, 'Evaluate for each candidate and count zero results.', "n = int(input())\nterms = [tuple(map(int, input().split())) for _ in range(n)]\ncandidates = list(map(int, input().split()))\n\n# Count candidate roots.\n"
  ),
  'level-58-problem-4': challenge(
    'Sparse Vector Cosine Similarity', 'Compute cosine similarity: dot product divided by the product of Euclidean norms. Unlisted indices have value zero.',
    'First line n; next n lines contain index value for the first vector. Then line m and m index value lines for the second.',
    'Print the similarity using Python fixed-point formatting with exactly six digits after the decimal point. Print 0.000000 when the dot product is zero.',
    ['1 <= n, m <= 30.', 'Indices are distinct within a vector and lie between 0 and 100.', 'Values are integers from -10 to 10; each vector has at least one nonzero entry.'],
    [['2\n0 3\n1 4\n2\n0 3\n1 4\n','1.000000','Identical nonzero vectors have similarity 1.'],['1\n0 1\n1\n0 -2\n','-1.000000','Opposite directions have similarity -1.'],['1\n0 1\n1\n1 1\n','0.000000'],['2\n0 3\n1 4\n1\n0 1\n','0.600000'],['2\n0 3\n1 4\n1\n1 -1\n','-0.800000'],['1\n2 5\n1\n2 7\n','1.000000'],['2\n0 1\n1 1\n1\n0 1\n','0.707107'],['2\n0 1\n1 1\n2\n0 1\n1 -1\n','0.000000']],
    ['The dot product uses matching indices.', 'Each squared norm is the sum of squares of all values in that vector.', 'Take the square root of each squared norm.', 'Divide the dot product by the product of the norms.', 'Format with .6f; handle a zero dot product as positive zero.'],
    `import math
n = int(input())
a = dict(tuple(map(int, input().split())) for _ in range(n))
m = int(input())
b = dict(tuple(map(int, input().split())) for _ in range(m))
dot = sum(value * b.get(i, 0) for i, value in a.items())
norm = math.sqrt(sum(x*x for x in a.values())) * math.sqrt(sum(x*x for x in b.values()))
print(f'{dot / norm:.6f}' if dot else '0.000000')
`, 'Divide the shared-index dot product by both nonzero vector norms.', "n = int(input())\na = [tuple(map(int, input().split())) for _ in range(n)]\nm = int(input())\nb = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Compute the similarity.\n"
  ),
  'level-58-problem-5': challenge(
    'Sparse Polynomial Multiplication', 'Multiply two sparse polynomials and combine like exponents; omit zero coefficients.',
    'First line n; next n lines contain exponent coefficient for the first polynomial. Then line m and m pairs for the second.',
    'Print the number of nonzero terms, then exponent coefficient on separate lines in increasing exponent order.',
    ['0 <= n, m <= 20.', 'Exponents are distinct within each polynomial and lie between 0 and 10.', 'Coefficients are integers from -10 to 10.'],
    [['2\n0 2\n1 3\n2\n0 -3\n1 2\n','3\n0 -6\n1 -5\n2 6','(2 + 3x)(-3 + 2x) gives -6 - 5x + 6x² after combining the x terms.'],['1\n2 3\n1\n1 2\n','1\n3 6','3x² times 2x is 6x³.'],['0\n0\n','0'],['1\n0 0\n1\n1 3\n','0'],['1\n0 2\n1\n0 -3\n','1\n0 -6'],['2\n0 1\n1 1\n1\n0 2\n','2\n0 2\n1 2'],['1\n10 1\n1\n10 1\n','1\n20 1'],['2\n1 -1\n0 1\n2\n1 1\n0 1\n','2\n0 1\n2 -1']],
    ['Multiply every term of the first polynomial by every term of the second.', 'Add exponents and multiply coefficients for each term pair.', 'Accumulate coefficients under the resulting exponent.', 'Remove exponents whose combined coefficient is zero.', 'Print remaining terms in increasing exponent order.'],
    `n = int(input())
a = [tuple(map(int, input().split())) for _ in range(n)]
m = int(input())
b = [tuple(map(int, input().split())) for _ in range(m)]
terms = {}
for e, c in a:
    for f, d in b:
        terms[e+f] = terms.get(e+f, 0) + c*d
terms = {e: c for e, c in terms.items() if c}
print(len(terms))
for e in sorted(terms):
    print(e, terms[e])
`, 'Multiply all term pairs and collect coefficients by exponent.', "n = int(input())\na = [tuple(map(int, input().split())) for _ in range(n)]\nm = int(input())\nb = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Multiply and print the terms.\n"
  ),
  'level-59-problem-1': challenge(
    'Build an Undirected Adjacency Map', 'List the neighbors of every vertex of a simple undirected graph, including isolated vertices.',
    'First line n m; next m lines contain endpoints u v. Vertices are integers 0 through n-1.',
    'Print one line per vertex in increasing order: the vertex followed by its neighbors in increasing order. Print no lines when n is zero.',
    ['0 <= n <= 30.', 'Edges have distinct endpoints, are not repeated, and use valid vertices.'],
    [['4 2\n0 2\n2 1\n','0 2\n1 2\n2 0 1\n3','Vertex 2 has neighbors 0 and 1; vertex 3 is isolated.'],['2 0\n','0\n1','Both vertices have no neighbors.'],['0 0\n',''],['1 0\n','0'],['2 1\n1 0\n','0 1\n1 0'],['3 3\n0 1\n1 2\n2 0\n','0 1 2\n1 0 2\n2 0 1'],['3 1\n2 0\n','0 2\n1\n2 0'],['4 2\n3 2\n1 0\n','0 1\n1 0\n2 3\n3 2']],
    ['Create an empty neighbor set for every vertex.', 'Each undirected edge contributes in both directions.', 'Add v to u’s set and u to v’s set.', 'Visit vertices in numeric order.', 'Sort each neighbor set before printing.'],
    `n, m = map(int, input().split())
neighbors = {v: set() for v in range(n)}
for _ in range(m):
    u, v = map(int, input().split())
    neighbors[u].add(v)
    neighbors[v].add(u)
for v in range(n):
    print(v, *sorted(neighbors[v]))
`, 'Add both directions of each edge to initially empty neighbor sets.', "n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Build and print the adjacency map.\n"
  ),
  'level-59-problem-2': challenge(
    'Count Undirected Vertex Degrees', 'Count the degree of every vertex in a simple undirected graph. A degree is the number of incident edges.',
    'First line n m; next m lines contain endpoints u v. Vertices are integers 0 through n-1.',
    'Print degrees in vertex order on one line separated by spaces; print an empty line if n is zero.',
    ['0 <= n <= 30.', 'Edges have distinct endpoints, are not repeated, and use valid vertices.'],
    [['4 2\n0 2\n2 1\n','1 1 2 0','Vertex 2 touches both edges, while vertex 3 touches none.'],['3 3\n0 1\n1 2\n2 0\n','2 2 2','Every vertex in this triangle touches two edges.'],['0 0\n',''],['1 0\n','0'],['2 1\n0 1\n','1 1'],['3 0\n','0 0 0'],['4 3\n0 1\n0 2\n0 3\n','3 1 1 1'],['4 2\n2 3\n1 3\n','0 1 1 2']],
    ['Start every vertex degree at zero.', 'An edge touches both endpoints.', 'Increment the degree of each endpoint once per edge.', 'Isolated vertices retain zero.', 'Print degrees from vertex 0 onward.'],
    `n, m = map(int, input().split())
degree = [0] * n
for _ in range(m):
    u, v = map(int, input().split())
    degree[u] += 1
    degree[v] += 1
print(*degree)
`, 'Increment both endpoint counts for every edge.', "n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Count and print degrees.\n"
  ),
  'level-59-problem-3': challenge(
    'Detect Duplicate Edges', 'Decide whether an undirected edge appears more than once, treating reversed endpoints as the same edge.',
    'First line n m; next m lines contain endpoints u v. Vertices are integers 0 through n-1.',
    'Print YES if an edge repeats, otherwise NO.',
    ['0 <= n <= 30; 0 <= m <= 100.', 'Endpoints are valid and distinct; repeated edges are allowed.'],
    [['3 3\n0 1\n1 2\n1 0\n','YES','The last edge repeats 0 1 in reverse.'],['3 2\n0 1\n1 2\n','NO','The two edges connect different pairs.'],['0 0\n','NO'],['1 0\n','NO'],['2 2\n0 1\n0 1\n','YES'],['3 3\n0 1\n0 2\n1 2\n','NO'],['4 3\n1 3\n2 0\n3 1\n','YES'],['4 4\n0 1\n1 2\n2 3\n0 3\n','NO']],
    ['Direction does not distinguish an undirected edge.', 'Represent each edge with the smaller endpoint first.', 'Keep a set of canonical endpoint pairs already seen.', 'A pair already in the set is a duplicate.', 'An empty edge list has no duplicate.'],
    `n, m = map(int, input().split())
seen = set()
duplicate = False
for _ in range(m):
    u, v = map(int, input().split())
    edge = (min(u, v), max(u, v))
    if edge in seen:
        duplicate = True
    seen.add(edge)
print('YES' if duplicate else 'NO')
`, 'Canonicalize each endpoint pair before checking whether it appeared earlier.', "n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Detect repeated undirected edges.\n"
  ),
  'level-59-problem-4': challenge(
    'Validate a Supplied Graph Walk', 'Decide whether each consecutive pair in a supplied vertex sequence is connected by an edge. Vertices and edges may be revisited; an empty or single-vertex sequence is valid.',
    'First line n m; next m lines contain endpoints u v. The final line contains a space-separated sequence of vertices and may be empty. Vertices are integers 0 through n-1.',
    'Print YES if the sequence is a valid walk, otherwise NO.', ['0 <= n <= 30.', 'Edges have distinct endpoints, are not repeated, and use valid vertices.', 'The sequence has at most 50 valid vertex labels.'],
    [['4 3\n0 2\n2 3\n1 3\n0 2 3 1 3\n','YES','Each step follows an edge; the edge 1-3 is used twice.'],['3 2\n0 1\n1 2\n0 2\n','NO','The proposed step from 0 to 2 has no edge.'],['0 0\n\n','YES'],['1 0\n0\n','YES'],['1 0\n0 0\n','NO'],['2 1\n0 1\n1 0 1\n','YES'],['3 0\n0 1\n','NO'],['4 2\n0 1\n2 3\n0 1 2 3\n','NO']],
    ['A walk is supplied explicitly; you do not need to search for one.', 'Store both directions of every undirected edge.', 'Read the sequence of vertex labels.', 'Check every consecutive pair against the stored edges.', 'Repeated vertices are allowed, but a step must still be an edge.'],
    `n, m = map(int, input().split())
neighbors = [set() for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    neighbors[u].add(v)
    neighbors[v].add(u)
walk = list(map(int, input().split()))
valid = all(v in neighbors[u] for u, v in zip(walk, walk[1:]))
print('YES' if valid else 'NO')
`, 'Check each consecutive step against the graph’s neighbor sets.', "n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\nwalk = list(map(int, input().split()))\n\n# Check the supplied walk.\n"
  ),
  'level-59-problem-5': challenge(
    'Count Triangles in a Simple Graph', 'Count distinct triples of vertices where every pair is joined by an undirected edge.',
    'First line n m; next m lines contain endpoints u v. Vertices are integers 0 through n-1.',
    countOutput, ['0 <= n <= 30.', 'Edges have distinct endpoints, are not repeated, and use valid vertices.'],
    [['4 5\n0 1\n1 2\n0 2\n0 3\n1 3\n','2','The triangles are 0-1-2 and 0-1-3.'],['3 2\n0 1\n1 2\n','0','The edge from 0 to 2 is missing.'],['0 0\n','0'],['1 0\n','0'],['3 3\n0 1\n1 2\n2 0\n','1'],['4 6\n0 1\n0 2\n0 3\n1 2\n1 3\n2 3\n','4'],['4 0\n','0'],['5 3\n1 2\n2 3\n3 1\n','1']],
    ['A triangle has three distinct vertices and three edges.', 'Store neighbors for each vertex.', 'Consider triples in strictly increasing vertex order.', 'Check all three required edges.', 'Increasing order counts each triangle only once.'],
    `n, m = map(int, input().split())
neighbors = [set() for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    neighbors[u].add(v)
    neighbors[v].add(u)
count = 0
for a in range(n):
    for b in range(a+1, n):
        for c in range(b+1, n):
            if b in neighbors[a] and c in neighbors[a] and c in neighbors[b]:
                count += 1
print(count)
`, 'Check each increasing triple for its three edges.', "n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Count triangles.\n"
  ),
  'level-60-problem-1': challenge(
    'Fulfill Inventory Orders', 'Process orders in input order. Accept an order only if the entire requested quantity is in stock, subtracting it when accepted. Rejected orders leave stock unchanged. An unlisted item has zero stock.',
    'First line n; next n lines contain item and starting quantity. Then line m; next m lines contain item and requested quantity.',
    'Print the zero-based indices of accepted orders in increasing order, separated by spaces. Print an empty line if none are accepted.',
    ['0 <= n, m <= 50.', 'Item names are lowercase ASCII words of 1 to 20 letters; stock item names are distinct.', 'Starting quantities are integers from 0 to 100; requested quantities are integers from 1 to 100.'],
    [['2\nink 5\npaper 2\n4\nink 3\npaper 3\nink 2\nink 1\n','0 2','Order 0 leaves two ink units; order 1 is rejected; order 2 uses the remaining ink.'],['1\nbolt 4\n3\nbolt 5\nbolt 4\nbolt 1\n','1','The rejected first order leaves all four bolts for order 1.'],['0\n0\n',''],['0\n1\npen 1\n',''],['1\na 0\n1\na 1\n',''],['1\na 3\n2\na 1\na 2\n','0 1'],['2\na 1\nb 2\n2\nb 1\na 1\n','0 1'],['1\nx 2\n3\ny 1\nx 1\nx 2\n','1']],
    ['Store available quantities by item name.', 'Read and process the orders in their given order.', 'A missing item has zero available units.', 'Only subtract the requested quantity when enough stock remains.', 'Record the zero-based index of every accepted order.'],
    `n = int(input())
stock = {}
for _ in range(n):
    name, quantity = input().split()
    stock[name] = int(quantity)
m = int(input())
accepted = []
for i in range(m):
    name, quantity = input().split()
    quantity = int(quantity)
    if stock.get(name, 0) >= quantity:
        stock[name] -= quantity
        accepted.append(i)
print(*accepted)
`, 'Check each request against current stock, decrementing only when it can be filled.', "n = int(input())\nstock = [input().split() for _ in range(n)]\nm = int(input())\norders = [input().split() for _ in range(m)]\n\n# Process the orders.\n"
  ),
  'level-60-problem-2': challenge(
    'Check a Functional Dependency', 'Check whether every key in the records is always associated with the same value.',
    'First line n; next n lines each contain a key and value separated by a space. Keys and values are lowercase ASCII words.',
    'Print YES if each key has a consistent value, otherwise NO.',
    ['0 <= n <= 50.', 'Each key and value has 1 to 20 letters.'],
    [['3\na red\nb blue\na red\n','YES','Both records for a have value red.'],['2\na red\na blue\n','NO','Key a has two different values.'],['0\n','YES'],['1\nx y\n','YES'],['2\na x\nb x\n','YES'],['3\na x\nb y\na z\n','NO'],['3\na x\na x\na x\n','YES'],['4\nb x\na y\nb x\na z\n','NO']],
    ['Different keys may share a value.', 'Remember the first value observed for each key.', 'For an existing key, compare its stored value to the new value.', 'Any mismatch violates the dependency.', 'An empty record list is consistent.'],
    `n = int(input())
values = {}
valid = True
for _ in range(n):
    key, value = input().split()
    if key in values and values[key] != value:
        valid = False
    else:
        values[key] = value
print('YES' if valid else 'NO')
`, 'Keep the first value for each key and detect any conflicting record.', "n = int(input())\nrecords = [input().split() for _ in range(n)]\n\n# Check consistency.\n"
  ),
  'level-60-problem-3': challenge(
    'Group Shift-Equivalent Strings', 'Group lowercase words when shifting every letter of one by the same amount modulo 26 produces the other. Keep words in input order within groups and groups in order of first appearance.',
    'One line of space-separated nonempty lowercase ASCII words; an empty line means no words.',
    'Print the number of groups, then one group per line with its words separated by spaces.',
    ['At most 50 words, each 1 to 20 letters long.'],
    [['mop npq dfe egf zbc\n','2\nmop npq zbc\ndfe egf','mop shifts to npq or zbc; dfe shifts to egf.'],['a z aa bb\n','2\na z\naa bb','All single letters group together; aa and bb form another group.'],['\n','0'],['a\n','1\na'],['ab ac\n','2\nab\nac'],['az ba\n','1\naz ba'],['abc abc\n','1\nabc abc'],['ab ba yz zy\n','2\nab yz\nba zy']],
    ['All words in a group must have the same length.', 'Measure each letter’s offset from the first letter modulo 26.', 'Words with the same offset tuple share a shift pattern.', 'Append words under that tuple in input order.', 'Print groups in the order their keys first appeared.'],
    `groups = {}
for word in input().split():
    key = tuple((ord(c) - ord(word[0])) % 26 for c in word)
    groups.setdefault(key, []).append(word)
print(len(groups))
for group in groups.values():
    print(*group)
`, 'A tuple of cyclic offsets from the first letter identifies the shift class.', "words = input().split()\n\n# Group and print the words.\n"
  ),
  'level-60-problem-4': challenge(
    'Longest Balanced Binary Subarray', 'Find the maximum length of a contiguous subarray containing equally many zeros and ones.',
    'One line of space-separated binary integers; an empty line is an empty list.',
    countOutput, ['The list contains at most 50 integers, each 0 or 1.'],
    [['0 1 0 1 1\n','4','The first four entries contain two zeros and two ones.'],['1 1 0\n','2','The last two entries are balanced.'],['\n','0'],['0\n','0'],['0 0 0\n','0'],['1 0\n','2'],['1 1 0 0\n','4'],['0 1 1 1 0 0\n','6']],
    ['Treat each 1 as +1 and each 0 as -1.', 'A balanced subarray has total zero.', 'Equal prefix balances delimit a zero-total subarray.', 'Store the earliest index of each balance, with balance zero at index -1.', 'For every repeated balance, compare the distance to the best length.'],
    `a = list(map(int, input().split()))
first = {0: -1}
balance = 0
best = 0
for i, x in enumerate(a):
    balance += 1 if x == 1 else -1
    if balance in first:
        best = max(best, i - first[balance])
    else:
        first[balance] = i
print(best)
`, 'The earliest occurrence of each prefix balance yields the longest interval ending at each index.', listStarter
  ),
  'level-60-problem-5': challenge(
    'Count Distinct Fixed-Width Sublists', 'Count distinct contiguous sublists of width k. Two windows are the same only if every value is equal at the corresponding position.',
    `${integers} The second line contains k.`, countOutput,
    [...integerLimits, '1 <= k <= 50; k may exceed the list length.'],
    [['1 2 1 2 1\n2\n','2','The windows alternate between 1 2 and 2 1.'],['2 2 2\n1\n','1','Every width-one window is the same.'],['\n1\n','0'],['1 2\n3\n','0'],['1 2 3\n3\n','1'],['1 2 3\n2\n','2'],['-1 0 -1 0\n2\n','2'],['1 2 1 3\n2\n','3']],
    ['A window consists of k consecutive values.', 'If k is too large, there are no windows.', 'Turn each window into an immutable tuple.', 'Add every tuple to a set.', 'The set size is the number of distinct windows.'],
    `a = list(map(int, input().split()))
k = int(input())
windows = set()
for i in range(len(a) - k + 1):
    windows.add(tuple(a[i:i+k]))
print(len(windows))
`, 'Insert each full window as a tuple into a set and count the tuples.', targetStarter
  )
};
