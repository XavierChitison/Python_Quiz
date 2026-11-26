import { challenge } from './beginner.js';

const listInput = 'One line of space-separated integers; an empty line represents an empty list.';
const listOutput = 'Print the result as space-separated integers on one line; print an empty line for an empty result.';
const limits = ['Each list has at most 100 integers.', 'Every list value and supplied integer is between -1000 and 1000 unless otherwise stated.'];
const starter = "values = list(map(int, input().split()))\n\n# Compute and print the answer.\n";
const make = (title, description, input, output, extra, cases, hints, solution, explanation, code = starter) =>
  challenge(title, description, input, output, [...limits, ...extra], cases, hints, solution, explanation, code);

export const lists4145Challenges = {
  'level-41-problem-1': make(
    'Sum List Elements', 'Sum all integers in the list, including repeated values.',
    listInput, 'Print the integer sum; the sum of an empty list is 0.', [],
    [['3 -1 3\n','5','The three values add to 5.'], ['\n','0','There are no values to add.'], ['0\n','0'], ['-5 -2\n','-7'], ['1 2 3 4\n','10'], ['1000 -1000\n','0'], ['7\n','7'], ['-1 0 1 1\n','1']],
    ['Start with a total of zero.', 'Visit each list value.', 'Add each value to the running total.', 'Repeated values are added separately.', 'Print zero when the list is empty.'],
    "values = list(map(int, input().split()))\ntotal = 0\nfor value in values:\n    total += value\nprint(total)\n",
    'Accumulate each list element, starting at zero.'
  ),
  'level-41-problem-2': make(
    'List Maximum and Minimum', 'Find the maximum and minimum of a nonempty integer list.',
    listInput, 'Print the maximum followed by the minimum, separated by a space.', ['The list is nonempty.'],
    [['4 -2 9 4\n','9 -2','9 is largest and -2 is smallest.'], ['5\n','5 5','The only value is both extrema.'], ['-3 -8 -1\n','-1 -8'], ['0 0\n','0 0'], ['1 2 3\n','3 1'], ['3 2 1\n','3 1'], ['-1000 1000\n','1000 -1000'], ['8 8 2 2\n','8 2']],
    ['The list always has a first value.', 'Initialize both extrema from that value.', 'Compare each later value with the current maximum.', 'Also compare it with the current minimum.', 'Print maximum first, then minimum.'],
    "values = list(map(int, input().split()))\nmaximum = minimum = values[0]\nfor value in values[1:]:\n    if value > maximum:\n        maximum = value\n    if value < minimum:\n        minimum = value\nprint(maximum, minimum)\n",
    'Track both extrema in a single traversal.'
  ),
  'level-41-problem-3': make(
    'Middle List Elements', 'Return the central element of an odd-length list, or the two central elements of an even-length list, in order.',
    listInput, listOutput, ['An empty list has no middle elements.'],
    [['1 2 3 4 5\n','3','The middle of five values is 3.'], ['1 2 3 4\n','2 3','The two central values are 2 and 3.'], ['\n',''], ['7\n','7'], ['8 9\n','8 9'], ['-1 0 -1\n','0'], ['1 1 1 1 1 1\n','1 1'], ['10 20 30 40 50 60\n','30 40']],
    ['Use the list length to locate the center.', 'An odd length has one central index.', 'An even length has two central indices.', 'A slice can return one or two values.', 'Handle an empty list without indexing it.'],
    "values = list(map(int, input().split()))\nn = len(values)\nif n == 0:\n    middle = []\nelif n % 2:\n    middle = values[n // 2:n // 2 + 1]\nelse:\n    middle = values[n // 2 - 1:n // 2 + 1]\nprint(*middle)\n",
    'Use length parity to select the central slice.'
  ),
  'level-41-problem-4': make(
    'Count Values Above a Threshold', 'Count list elements strictly greater than a supplied threshold.',
    `${listInput} The second line contains the threshold.`, 'Print the count as an integer.', [],
    [['1 5 5 8\n5\n','1','Only 8 is strictly above 5.'], ['-3 0 2\n-1\n','2','0 and 2 exceed -1.'], ['\n0\n','0'], ['4\n4\n','0'], ['4\n3\n','1'], ['-2 -2 -1\n-3\n','3'], ['1000 -1000\n0\n','1'], ['0 0 0\n1\n','0']],
    ['Read the threshold after the list.', 'Initialize a count to zero.', 'Compare each element with the threshold.', 'Increment only for a strict greater-than comparison.', 'Print the count, including zero if none qualify.'],
    "values = list(map(int, input().split()))\nthreshold = int(input())\ncount = 0\nfor value in values:\n    if value > threshold:\n        count += 1\nprint(count)\n",
    'Count each value that exceeds the threshold.'
  ),
  'level-41-problem-5': make(
    'Extract a List Slice', 'Extract the elements from a zero-based start index inclusive to an end index exclusive.',
    `${listInput} The second line contains start and end.`, listOutput, ['0 <= start <= end <= list length.'],
    [['10 20 30 40\n1 3\n','20 30','Indices 1 and 2 are included, but index 3 is excluded.'], ['7 8\n0 2\n','7 8','These bounds select the whole list.'], ['\n0 0\n',''], ['5\n0 0\n',''], ['5\n1 1\n',''], ['1 2 3\n2 3\n','3'], ['-2 0 2 4\n0 3\n','-2 0 2'], ['1 2 3 4 5\n2 4\n','3 4']],
    ['List indices begin at zero.', 'The start position is included.', 'The end position is not included.', 'Use a slice with the two bounds.', 'Equal bounds select an empty slice.'],
    "values = list(map(int, input().split()))\nstart, end = map(int, input().split())\nprint(*values[start:end])\n",
    'A half-open list slice selects the requested positions.'
  ),
  'level-42-problem-1': make(
    'Replace Negative Values with Zero', 'Create a list replacing each negative value with zero and keeping all other values.',
    listInput, listOutput, [],
    [['-2 0 4 -1\n','0 0 4 0','The two negative values become zero.'], ['3 2\n','3 2','Neither value is negative.'], ['\n',''], ['-1\n','0'], ['0\n','0'], ['-5 -5\n','0 0'], ['1000 -1000\n','1000 0'], ['1 -2 3 -4 5\n','1 0 3 0 5']],
    ['Inspect each value independently.', 'A negative value is strictly less than zero.', 'Replace negative values with zero.', 'Keep zeros and positive values unchanged.', 'Output the transformed values in their original positions.'],
    "values = list(map(int, input().split()))\nresult = [0 if value < 0 else value for value in values]\nprint(*result)\n",
    'Map each negative value to zero and retain every other value.'
  ),
  'level-42-problem-2': make(
    'Filter Multiples from a List', 'Keep only values divisible by a supplied positive divisor, preserving their order and repetitions.',
    `${listInput} The second line contains the divisor.`, listOutput, ['1 <= divisor <= 1000.'],
    [['6 7 -3 0\n3\n','6 -3 0','6, -3, and 0 have remainder zero on division by 3.'], ['1 2 3\n5\n','', 'No value is divisible by 5.'], ['\n2\n',''], ['4 4 5\n2\n','4 4'], ['-4 -3 2\n2\n','-4 2'], ['1 2 3\n1\n','1 2 3'], ['1000 -1000 999\n1000\n','1000 -1000'], ['0\n7\n','0']],
    ['Read the divisor on the second line.', 'Visit the values in order.', 'Use the remainder operator to test divisibility.', 'Keep a value when its remainder is zero.', 'Do not discard repeated qualifying values.'],
    "values = list(map(int, input().split()))\ndivisor = int(input())\nresult = [value for value in values if value % divisor == 0]\nprint(*result)\n",
    'Filter on a zero remainder while retaining input order.'
  ),
  'level-42-problem-3': make(
    'Elementwise List Sum', 'Add corresponding elements of two equally long lists.',
    'Two lines, each a space-separated integer list; empty lines represent empty lists.', listOutput, ['The lists have equal lengths.'],
    [['1 2 3\n4 -2 0\n','5 0 3','The corresponding sums are 5, 0, and 3.'], ['-3\n5\n','2','The only pair sums to 2.'], ['\n\n',''], ['0 0\n0 0\n','0 0'], ['1 1\n1 1\n','2 2'], ['-1 -2\n-3 -4\n','-4 -6'], ['1000 -1000\n1000 -1000\n','2000 -2000'], ['9 8 7\n-9 -8 -7\n','0 0 0']],
    ['Both lists have the same number of elements.', 'Pair elements at corresponding indices.', 'Add the two values in each pair.', 'Collect the sums in order.', 'An empty pair of lists produces an empty line.'],
    "first = list(map(int, input().split()))\nsecond = list(map(int, input().split()))\nprint(*[a + b for a, b in zip(first, second)])\n",
    'Pair corresponding elements and add each pair.',
    "first = list(map(int, input().split()))\nsecond = list(map(int, input().split()))\n\n# Compute the corresponding sums.\n"
  ),
  'level-42-problem-4': make(
    'Count Equal Positions', 'Count positions where two equally long lists have equal values.',
    'Two lines, each a space-separated integer list; empty lines represent empty lists.', 'Print the number of matching positions.', ['The lists have equal lengths.'],
    [['1 2 1\n1 3 1\n','2','Positions 0 and 2 match.'], ['5 6\n6 5\n','0','The same values occur but neither position matches.'], ['\n\n','0'], ['4\n4\n','1'], ['4\n-4\n','0'], ['0 0 0\n0 0 0\n','3'], ['-1 2 -1\n-1 -1 2\n','1'], ['1000 -1000\n1000 -1000\n','2']],
    ['Compare the lists position by position.', 'Pair corresponding elements, not arbitrary elements.', 'Start the match count at zero.', 'Increment when both values in a pair are equal.', 'Print the count even for empty lists.'],
    "first = list(map(int, input().split()))\nsecond = list(map(int, input().split()))\ncount = 0\nfor a, b in zip(first, second):\n    if a == b:\n        count += 1\nprint(count)\n",
    'Count equal corresponding pairs.',
    "first = list(map(int, input().split()))\nsecond = list(map(int, input().split()))\n\n# Count equal positions.\n"
  ),
  'level-42-problem-5': make(
    'Remove Element by Index', 'Remove exactly the element at the supplied zero-based index.',
    `${listInput} The second line contains the index.`, listOutput, ['The list is nonempty and the index is valid.'],
    [['4 5 4\n0\n','5 4','Only the first 4 is removed.'], ['1 2 3\n1\n','1 3','The value at index 1 is omitted.'], ['7\n0\n',''], ['1 2\n1\n','1'], ['0 0 0\n1\n','0 0'], ['-1 5 8\n2\n','-1 5'], ['1000 -1000\n0\n','-1000'], ['2 3 4 5\n2\n','2 3 5']],
    ['The index starts at zero.', 'Remove by position, not by value.', 'Take the part before the index.', 'Take the part after the index.', 'Concatenate those parts in order.'],
    "values = list(map(int, input().split()))\nindex = int(input())\nprint(*(values[:index] + values[index + 1:]))\n",
    'Join the slices before and after the chosen index.'
  ),
  'level-43-problem-1': make(
    'Insert into a List', 'Insert a supplied integer at a zero-based position without changing the order of existing elements.',
    `${listInput} The second line contains index and value.`, listOutput, ['0 <= index <= list length.'],
    [['1 3\n1 2\n','1 2 3','2 is inserted between 1 and 3.'], ['4 5\n0 9\n','9 4 5','Index 0 inserts before all existing elements.'], ['\n0 7\n','7'], ['1\n1 2\n','1 2'], ['1\n0 1\n','1 1'], ['-1 -2\n2 0\n','-1 -2 0'], ['2 3 4\n2 -5\n','2 3 -5 4'], ['1000\n1 -1000\n','1000 -1000']],
    ['Indices refer to positions before existing elements.', 'Index zero inserts at the front.', 'The list length is also a valid index.', 'Use insert(index, value) or join slices.', 'Keep the original elements in their original order.'],
    "values = list(map(int, input().split()))\nindex, value = map(int, input().split())\nvalues.insert(index, value)\nprint(*values)\n",
    'Insert at the requested position, including at the end.'
  ),
  'level-43-problem-2': make(
    'Invert a Permutation', 'Invert a permutation: at each value v output the index where v occurs in the input.',
    'One line containing a permutation of 0 through n-1; the line may be empty when n is zero.', listOutput, ['0 <= n <= 100.'],
    [['2 0 1\n','1 2 0','0 is at index 1, 1 at index 2, and 2 at index 0.'], ['0 1 2\n','0 1 2','The identity permutation is its own inverse.'], ['\n',''], ['0\n','0'], ['1 0\n','1 0'], ['3 2 1 0\n','3 2 1 0'], ['1 2 3 0\n','3 0 1 2'], ['2 3 0 1\n','2 3 0 1']],
    ['Each value occurs exactly once.', 'Create a result list of the same length.', 'Visit each input index and value.', 'Store the index at the result position named by the value.', 'Print the result in value order.'],
    "values = list(map(int, input().split()))\nresult = [0] * len(values)\nfor index, value in enumerate(values):\n    result[value] = index\nprint(*result)\n",
    'Write each input index into the output position named by its value.'
  ),
  'level-43-problem-3': make(
    'Swap Adjacent List Pairs', 'Swap each adjacent pair of elements; leave a final unpaired element in place.',
    listInput, listOutput, [],
    [['1 2 3 4 5\n','2 1 4 3 5','The first two pairs swap and 5 remains.'], ['8 9\n','9 8','The only pair swaps.'], ['\n',''], ['7\n','7'], ['1 1 2\n','1 1 2'], ['-1 0 -2 3\n','0 -1 3 -2'], ['1 2 3 4\n','2 1 4 3'], ['1000 -1000 0\n','-1000 1000 0']],
    ['Process positions in steps of two.', 'Each complete pair contains positions i and i+1.', 'Swap the two elements of each complete pair.', 'Do not access i+1 beyond the list.', 'Leave an odd last element untouched.'],
    "values = list(map(int, input().split()))\nfor i in range(0, len(values) - 1, 2):\n    values[i], values[i + 1] = values[i + 1], values[i]\nprint(*values)\n",
    'Swap complete pairs and leave any leftover element.'
  ),
  'level-43-problem-4': make(
    'Stable Even-Odd Partition', 'Place even values before odd values, preserving their original order within each group.',
    listInput, listOutput, [],
    [['3 2 1 4 2\n','2 4 2 3 1','The evens 2, 4, 2 come first, followed by odds 3, 1.'], ['-3 -2 0\n','-2 0 -3','Negative parity and zero are handled normally.'], ['\n',''], ['1\n','1'], ['2 4\n','2 4'], ['1 3 5\n','1 3 5'], ['0 -1 -2 1\n','0 -2 -1 1'], ['2 1 2 1\n','2 2 1 1']],
    ['Use the remainder modulo 2 to identify even values.', 'Collect even values in encounter order.', 'Collect odd values in encounter order.', 'Join the even group before the odd group.', 'Do not sort either group.'],
    "values = list(map(int, input().split()))\nevens = []\nodds = []\nfor value in values:\n    if value % 2 == 0:\n        evens.append(value)\n    else:\n        odds.append(value)\nprint(*(evens + odds))\n",
    'Collect both parity groups stably, then concatenate them.'
  ),
  'level-43-problem-5': make(
    'Apply a List Permutation', 'Rearrange a list so each output position contains the input value at the corresponding supplied index.',
    'First line: a space-separated integer list. Second line: a permutation of its zero-based indices. Both lines are empty for an empty list.', listOutput, ['The second list is a permutation of 0 through n-1, where n is the first list length.'],
    [['10 20 30\n2 0 1\n','30 10 20','Indices 2, 0, 1 select 30, 10, 20.'], ['4 8\n0 1\n','4 8','The identity permutation keeps the order.'], ['\n\n',''], ['7\n0\n','7'], ['1 2\n1 0\n','2 1'], ['5 5 6\n1 2 0\n','5 6 5'], ['-1 0 1 2\n3 2 1 0\n','2 1 0 -1'], ['8 9 10 11\n1 3 0 2\n','9 11 8 10']],
    ['The second line lists source indices.', 'Its first index determines the first output value.', 'Look up each index in the original list.', 'Collect the selected values in index-list order.', 'Do not modify the source while looking up positions.'],
    "values = list(map(int, input().split()))\nindices = list(map(int, input().split()))\nprint(*[values[index] for index in indices])\n",
    'Read each specified source index from the unchanged input list.',
    "values = list(map(int, input().split()))\nindices = list(map(int, input().split()))\n\n# Apply the index permutation.\n"
  ),
  'level-44-problem-1': make(
    'Distance Between First Extrema', 'Find the absolute distance in indices between the first minimum and first maximum of a nonempty list.',
    listInput, 'Print the nonnegative index distance.', ['The list is nonempty.'],
    [['3 1 4 1 4\n','1','The first minimum is at index 1 and first maximum at index 2.'], ['5 5\n','0','Both first extrema occur at index 0.'], ['7\n','0'], ['1 2 3 4\n','3'], ['4 3 2 1\n','3'], ['-5 0 -5 9\n','3'], ['2 9 1 9 1\n','1'], ['1000 -1000\n','1']],
    ['Locate both the smallest and largest values.', 'When an extremum repeats, use its first index.', 'Track or find those two indices.', 'Subtract one index from the other.', 'Take the absolute value to make distance nonnegative.'],
    "values = list(map(int, input().split()))\nminimum_index = maximum_index = 0\nfor i in range(1, len(values)):\n    if values[i] < values[minimum_index]:\n        minimum_index = i\n    if values[i] > values[maximum_index]:\n        maximum_index = i\nprint(abs(maximum_index - minimum_index))\n",
    'Track the first index of each extremum and take their absolute difference.'
  ),
  'level-44-problem-2': make(
    'All Matching List Indices', 'Find every zero-based index at which the list value equals the target.',
    `${listInput} The second line contains the target.`, listOutput, [],
    [['4 1 4 4\n4\n','0 2 3','The target 4 occurs at indices 0, 2, and 3.'], ['1 2\n3\n','', '3 is absent, so there are no indices.'], ['\n0\n',''], ['7\n7\n','0'], ['7\n8\n',''], ['0 0 0\n0\n','0 1 2'], ['-1 2 -1\n-1\n','0 2'], ['1000 -1000\n-1000\n','1']],
    ['Indices start at zero.', 'Visit each value together with its index.', 'Compare the value with the target.', 'Append each matching index to a result list.', 'Print the indices in increasing encounter order.'],
    "values = list(map(int, input().split()))\ntarget = int(input())\nindices = []\nfor i, value in enumerate(values):\n    if value == target:\n        indices.append(i)\nprint(*indices)\n",
    'Collect each index whose value equals the target.'
  ),
  'level-44-problem-3': make(
    'Second Largest Distinct Value', 'Find the second largest distinct list value.',
    listInput, 'Print the value, or NONE if fewer than two distinct values exist.', [],
    [['5 5 2 3\n','3','The distinct values are 2, 3, and 5, so 3 is second largest.'], ['-1 -1\n','NONE','There is only one distinct value.'], ['\n','NONE'], ['7\n','NONE'], ['1 2\n','1'], ['-5 -3 -4\n','-4'], ['0 0 1 1\n','0'], ['1000 -1000 999\n','999']],
    ['Repeated equal values count as one distinct value.', 'You need at least two distinct values.', 'Track the largest and second-largest distinct values.', 'When a new largest appears, the old largest becomes second.', 'Print NONE if no second value was found.'],
    "values = list(map(int, input().split()))\nlargest = second = None\nfor value in values:\n    if largest is None or value > largest:\n        second, largest = largest, value\n    elif value != largest and (second is None or value > second):\n        second = value\nprint(second if second is not None else 'NONE')\n",
    'Track two distinct maxima, ignoring duplicates of the largest.'
  ),
  'level-44-problem-4': make(
    'Count Neighbor-Sum Centers', 'Count interior positions whose value equals the sum of its immediate left and right neighbors.',
    listInput, 'Print the number of qualifying interior positions.', ['Endpoints are not interior; lists shorter than three have no interior positions.'],
    [['1 3 2 5 3\n','2','3 equals 1+2 and 5 equals 2+3.'], ['0 0 0 0\n','2','Both interior zeros equal the sum of their neighbors.'], ['\n','0'], ['1\n','0'], ['1 2\n','0'], ['1 2 3\n','0'], ['-1 -3 -2\n','1'], ['2 5 3 8 5 13\n','2']],
    ['Only positions with both neighbors can qualify.', 'Visit indices from 1 through length minus 2.', 'Add the immediate left and right values.', 'Compare that sum to the center value.', 'Count all qualifying centers, including overlapping ones.'],
    "values = list(map(int, input().split()))\ncount = 0\nfor i in range(1, len(values) - 1):\n    if values[i] == values[i - 1] + values[i + 1]:\n        count += 1\nprint(count)\n",
    'Compare each interior element with the sum of its neighbors.'
  ),
  'level-44-problem-5': make(
    'Count Local Peaks', 'Count interior elements strictly greater than both immediate neighbors.',
    listInput, 'Print the number of local peaks.', ['Endpoints are excluded; lists shorter than three have no peaks.'],
    [['1 4 2 5 1\n','2','4 and 5 both exceed their immediate neighbors.'], ['1 3 3 1\n','0','Equal neighbors prevent either 3 from being a strict peak.'], ['\n','0'], ['1\n','0'], ['1 2\n','0'], ['1 2 1\n','1'], ['-3 -1 -2\n','1'], ['5 4 3 2 1\n','0']],
    ['A peak must have a neighbor on each side.', 'Loop over interior indices only.', 'Compare the center to the left neighbor.', 'Also require it to be strictly greater than the right neighbor.', 'Equal values do not form a strict peak.'],
    "values = list(map(int, input().split()))\ncount = 0\nfor i in range(1, len(values) - 1):\n    if values[i] > values[i - 1] and values[i] > values[i + 1]:\n        count += 1\nprint(count)\n",
    'Count interior values strictly larger than each neighbor.'
  ),
  'level-45-problem-1': make(
    'Remove Repeated List Values', 'Keep the first occurrence of each value, preserving the order of those first occurrences.',
    listInput, listOutput, [],
    [['3 1 3 2 1\n','3 1 2','Later copies of 3 and 1 are removed.'], ['4 4 4\n','4','Only the first 4 remains.'], ['\n',''], ['7\n','7'], ['1 2 3\n','1 2 3'], ['-1 0 -1 0\n','-1 0'], ['2 1 2 1 0\n','2 1 0'], ['1000 -1000 1000\n','1000 -1000']],
    ['Remember which values have already appeared.', 'Traverse the list in its original order.', 'Skip a value if it has been seen before.', 'Otherwise record it as seen and append it.', 'Do not sort the retained values.'],
    "values = list(map(int, input().split()))\nseen = set()\nresult = []\nfor value in values:\n    if value not in seen:\n        seen.add(value)\n        result.append(value)\nprint(*result)\n",
    'Use a seen set while appending only first occurrences.'
  ),
  'level-45-problem-2': make(
    'Merge Sorted Lists', 'Merge two nondecreasing lists into one nondecreasing list, retaining every occurrence.',
    'Two lines, each a space-separated integer list; empty lines represent empty lists.', listOutput, ['Each input list is nondecreasing.'],
    [['1 3 3\n2 3 4\n','1 2 3 3 3 4','All three copies of 3 are retained.'], ['\n-1 2\n','-1 2','Merging an empty list keeps the other list.'], ['\n\n',''], ['1\n2\n','1 2'], ['5\n-1\n','-1 5'], ['0 0\n0\n','0 0 0'], ['-3 -1\n-2 4\n','-3 -2 -1 4'], ['1 2 3\n4 5\n','1 2 3 4 5']],
    ['Both inputs are already sorted.', 'Track the next unused position in each list.', 'Append the smaller next value and advance its position.', 'On equality append one copy and advance one position.', 'When one list ends append the remaining tail.'],
    "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\ni = j = 0\nresult = []\nwhile i < len(a) and j < len(b):\n    if a[i] <= b[j]:\n        result.append(a[i])\n        i += 1\n    else:\n        result.append(b[j])\n        j += 1\nresult.extend(a[i:])\nresult.extend(b[j:])\nprint(*result)\n",
    'Merge the sorted fronts and append any remaining tail.',
    "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\n\n# Merge the sorted lists.\n"
  ),
  'level-45-problem-3': make(
    'Sorted List Intersection with Multiplicity', 'Return common values from two nondecreasing lists, repeating each value as many times as it occurs in both lists.',
    'Two lines, each a space-separated integer list; empty lines represent empty lists.', listOutput, ['Each input list is nondecreasing.', 'The number of copies of a value in the output is the smaller of its two input counts.'],
    [['1 2 2 2 4\n2 2 3 4\n','2 2 4','Two copies of 2 and one 4 are shared.'], ['1 3\n2 4\n','', 'The lists have no values in common.'], ['\n1\n',''], ['\n\n',''], ['0 0\n0 0 0\n','0 0'], ['-2 -1 2\n-2 2\n','-2 2'], ['5\n5\n','5'], ['1 1 2 3\n1 2 2 3 3\n','1 2 3']],
    ['Start at the beginning of each sorted list.', 'If the current values match, append one copy and advance both.', 'If they differ, advance the pointer at the smaller value.', 'Stop when either list is exhausted.', 'Each match consumes one occurrence from each list.'],
    "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\ni = j = 0\nresult = []\nwhile i < len(a) and j < len(b):\n    if a[i] == b[j]:\n        result.append(a[i])\n        i += 1\n        j += 1\n    elif a[i] < b[j]:\n        i += 1\n    else:\n        j += 1\nprint(*result)\n",
    'Match sorted occurrences one at a time, skipping smaller unmatched values.',
    "a = list(map(int, input().split()))\nb = list(map(int, input().split()))\n\n# Find shared occurrences.\n"
  ),
  'level-45-problem-4': make(
    'Insert into a Sorted List', 'Insert one integer into a nondecreasing list so the resulting list remains nondecreasing.',
    `${listInput} The second line contains the value to insert.`, listOutput, ['The input list is nondecreasing.'],
    [['1 3 5\n4\n','1 3 4 5','4 belongs between 3 and 5.'], ['2 2 4\n2\n','2 2 2 4','A third 2 is inserted among the equal values.'], ['\n7\n','7'], ['1\n0\n','0 1'], ['1\n2\n','1 2'], ['-4 -2 0\n-3\n','-4 -3 -2 0'], ['0 0\n0\n','0 0 0'], ['-1000 1000\n1000\n','-1000 1000 1000']],
    ['The existing list is already nondecreasing.', 'Find the first position whose value is at least the new value.', 'If no such position exists, use the end.', 'Insert the new value at that position.', 'Keep all existing values, including duplicates.'],
    "values = list(map(int, input().split()))\nvalue = int(input())\ni = 0\nwhile i < len(values) and values[i] < value:\n    i += 1\nvalues.insert(i, value)\nprint(*values)\n",
    'Find the first value not less than the new value and insert before it.'
  ),
  'level-45-problem-5': make(
    'Sorted Squares', 'Square every value of a nondecreasing integer list and output the squares in nondecreasing order.',
    listInput, listOutput, ['The input list is nondecreasing.'],
    [['-4 -1 0 3\n','0 1 9 16','The squares 16, 1, 0, 9 sort to 0, 1, 9, 16.'], ['-2 -2 2\n','4 4 4','Every element contributes a square, including duplicates.'], ['\n',''], ['-5\n','25'], ['0 1 2\n','0 1 4'], ['-3 -2 -1\n','1 4 9'], ['-1000 1000\n','1000000 1000000'], ['-3 -1 1 3\n','1 1 9 9']],
    ['Negative values can have large squares.', 'Compare the absolute values at both ends.', 'The larger endpoint square is the largest remaining square.', 'Fill a result list from right to left and move the used endpoint.', 'Preserve every occurrence, even when squares tie.'],
    "values = list(map(int, input().split()))\nresult = [0] * len(values)\nleft, right = 0, len(values) - 1\nfor pos in range(len(values) - 1, -1, -1):\n    if abs(values[left]) > abs(values[right]):\n        result[pos] = values[left] ** 2\n        left += 1\n    else:\n        result[pos] = values[right] ** 2\n        right -= 1\nprint(*result)\n",
    'The largest remaining square is at an endpoint, so fill from the back.'
  )
};
