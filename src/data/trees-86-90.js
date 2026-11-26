import { challenge } from './beginner.js';

const treeFormat = 'First line: n. Then n lines in node-ID order 0 through n-1, each containing value left right. Child IDs are zero-based; -1 means no child. Node 0 is the root when n > 0.';
const treeLimits = ['0 <= n <= 100; values are integers from -1000 to 1000.', 'The child IDs form one valid binary tree containing every node exactly once; values may repeat.'];
const treeStarter = `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]

# Compute and print the answer.
`;

export const trees8690Challenges = {
  'level-86-problem-1': challenge(
    'Sum Root-to-Leaf Decimal Numbers',
    'Each root-to-leaf path forms a decimal integer by reading its node digits from root to leaf. Sum those integers, counting different paths separately even if their numbers are equal. Leading zeros do not change a number’s value.',
    treeFormat, 'Print the integer sum. An empty tree has no paths and yields 0.',
    ['0 <= n <= 100; each value is a digit from 0 to 9.', 'The child IDs form one valid binary tree containing every node exactly once; digits may repeat.'],
    [
      ['3\n1 1 2\n2 -1 -1\n3 -1 -1\n', '25', 'The paths form 12 and 13, which sum to 25.'],
      ['4\n0 1 2\n1 3 -1\n2 -1 -1\n5 -1 -1\n', '17', 'The paths 015 and 02 represent 15 and 2, so the sum is 17.'],
      ['0\n', '0'],
      ['1\n9 -1 -1\n', '9'],
      ['1\n0 -1 -1\n', '0'],
      ['2\n9 -1 1\n0 -1 -1\n', '90'],
      ['3\n1 1 2\n2 -1 -1\n2 -1 -1\n', '24'],
      ['18\n9 1 -1\n9 2 -1\n9 3 -1\n9 4 -1\n9 5 -1\n9 6 -1\n9 7 -1\n9 8 -1\n9 9 -1\n9 10 -1\n9 11 -1\n9 12 -1\n9 13 -1\n9 14 -1\n9 15 -1\n9 16 -1\n9 17 -1\n9 -1 -1\n', '999999999999999999']
    ],
    ['A complete number comes from a path ending at a leaf.', 'Carry the decimal number formed so far down the tree.', 'Append a digit d by multiplying the previous number by 10 and adding d.', 'At a leaf contribute the completed number; otherwise sum the existing child results.', 'Start the root with prefix zero and return zero for an empty tree.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
def path_sum(i, prefix):
    digit, left, right = nodes[i]
    number = prefix * 10 + digit
    if left == -1 and right == -1:
        return number
    total = 0
    if left != -1:
        total += path_sum(left, number)
    if right != -1:
        total += path_sum(right, number)
    return total
print(path_sum(0, 0) if n else 0)
`, 'Build each decimal number along its path, then add completed numbers at the leaves.', treeStarter
  ),
  'level-86-problem-2': challenge(
    'Nodes Equal to Descendant Sum',
    'Count nodes whose value equals the sum of all their proper descendants, excluding the node itself. A leaf has descendant sum zero.',
    treeFormat, 'Print the count. The empty tree has count 0.', treeLimits,
    [
      ['3\n5 1 2\n2 -1 -1\n3 -1 -1\n', '1', 'The root equals 2 + 3; neither nonzero leaf equals its empty descendant sum.'],
      ['2\n0 -1 1\n0 -1 -1\n', '2', 'Both nodes have descendant sum zero, including the zero-valued leaf.'],
      ['0\n', '0'],
      ['1\n1 -1 -1\n', '0'],
      ['1\n0 -1 -1\n', '1'],
      ['3\n-1 1 -1\n-2 2 -1\n1 -1 -1\n', '1'],
      ['4\n6 1 2\n3 3 -1\n0 -1 -1\n3 -1 -1\n', '3'],
      ['3\n0 1 2\n-1 -1 -1\n1 -1 -1\n', '1']
    ],
    ['A proper descendant excludes the current node.', 'A missing subtree has total zero.', 'Recursively compute the total value in each child subtree.', 'Compare their combined totals with the current value.', 'Return that combined total plus the current value to the parent.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
count = 0
def total(i):
    global count
    if i == -1:
        return 0
    value, left, right = nodes[i]
    descendants = total(left) + total(right)
    if value == descendants:
        count += 1
    return value + descendants
if n:
    total(0)
print(count)
`, 'Postorder subtree sums allow each node to compare its value with the sum below it.', treeStarter
  ),
  'level-86-problem-3': challenge(
    'Palindromic Root-to-Leaf Path',
    'Decide whether some root-to-leaf path has the same sequence of integer values forwards and backwards.',
    treeFormat, 'Print YES or NO. The empty tree has no paths and yields NO.', treeLimits,
    [
      ['3\n1 1 -1\n2 -1 2\n1 -1 -1\n', 'YES', 'The only root-to-leaf sequence is 1, 2, 1, a palindrome.'],
      ['3\n4 1 2\n5 -1 -1\n6 -1 -1\n', 'NO', 'Neither 4, 5 nor 4, 6 reads identically backwards.'],
      ['0\n', 'NO'],
      ['1\n-9 -1 -1\n', 'YES'],
      ['2\n0 1 -1\n0 -1 -1\n', 'YES'],
      ['2\n0 -1 1\n1 -1 -1\n', 'NO'],
      ['4\n2 1 2\n3 -1 -1\n2 -1 3\n2 -1 -1\n', 'YES'],
      ['4\n1 1 -1\n1 2 -1\n2 3 -1\n1 -1 -1\n', 'NO']
    ],
    ['A path must end at a leaf, not at an internal node.', 'Keep the values on the current root-to-node path.', 'Append the current value before exploring children.', 'At a leaf compare the path with its reverse.', 'Remove the current value when returning so sibling paths stay independent.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
def has_path(i, path):
    value, left, right = nodes[i]
    path = path + [value]
    if left == -1 and right == -1:
        return path == path[::-1]
    return ((left != -1 and has_path(left, path)) or
            (right != -1 and has_path(right, path)))
print('YES' if n and has_path(0, []) else 'NO')
`, 'Explore complete root-to-leaf value sequences and compare each with its reverse.', treeStarter
  ),
  'level-86-problem-4': challenge(
    'Binary Tree Level Order',
    'Print values by depth, from the root level down. Within each level print values from left to right.',
    treeFormat, 'Print one space-separated line per nonempty level. Print EMPTY for the empty tree.', treeLimits,
    [
      ['4\n7 1 2\n4 -1 3\n8 -1 -1\n5 -1 -1\n', '7\n4 8\n5', 'The root is alone at depth 0, 4 and 8 at depth 1, and 5 at depth 2.'],
      ['3\n1 -1 1\n2 2 -1\n3 -1 -1\n', '1\n2\n3', 'The single chain has one node at each depth.'],
      ['0\n', 'EMPTY'],
      ['1\n-1 -1 -1\n', '-1'],
      ['2\n3 1 -1\n4 -1 -1\n', '3\n4'],
      ['3\n1 2 1\n3 -1 -1\n2 -1 -1\n', '1\n2 3'],
      ['5\n0 1 2\n1 -1 3\n2 4 -1\n3 -1 -1\n4 -1 -1\n', '0\n1 2\n3 4'],
      ['3\n9 1 2\n9 -1 -1\n9 -1 -1\n', '9\n9 9']
    ],
    ['Start with the root as the first level.', 'Keep node IDs for the current level in left-to-right order.', 'Print the values at those IDs.', 'For each node append its existing left child before its right child to the next level.', 'Stop when no nodes remain; handle an empty tree separately.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
level = [0] if n else []
if not level:
    print('EMPTY')
while level:
    print(*(nodes[i][0] for i in level))
    following = []
    for i in level:
        for child in nodes[i][1:]:
            if child != -1:
                following.append(child)
    level = following
`, 'Collect each level’s children in left-to-right order before advancing to the next depth.', treeStarter
  ),
  'level-86-problem-5': challenge(
    'Count Binary Tree Leaves',
    'Count nodes with neither a left child nor a right child.',
    treeFormat, 'Print the leaf count. The empty tree has zero leaves.', treeLimits,
    [
      ['4\n1 1 2\n2 3 -1\n3 -1 -1\n4 -1 -1\n', '2', 'Nodes 2 and 3 have no children.'],
      ['3\n5 -1 1\n6 2 -1\n7 -1 -1\n', '1', 'Only the last node of the chain is a leaf.'],
      ['0\n', '0'],
      ['1\n0 -1 -1\n', '1'],
      ['2\n0 1 -1\n0 -1 -1\n', '1'],
      ['3\n1 1 2\n2 -1 -1\n3 -1 -1\n', '2'],
      ['5\n1 2 3\n5 -1 -1\n2 1 4\n3 -1 -1\n4 -1 -1\n', '3'],
      ['4\n0 -1 2\n0 -1 -1\n0 -1 3\n0 1 -1\n', '1']
    ],
    ['A leaf is a node with no children.', 'A missing subtree contributes zero leaves.', 'A leaf contributes one.', 'For a non-leaf, add the counts of both child subtrees.', 'Start at node 0 only if the tree is nonempty.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
def leaves(i):
    if i == -1:
        return 0
    _, left, right = nodes[i]
    if left == -1 and right == -1:
        return 1
    return leaves(left) + leaves(right)
print(leaves(0) if n else 0)
`, 'Leaves contribute one; recursive calls add the counts from both children.', treeStarter
  ),
  'level-87-problem-1': challenge(
    'Binary Tree Height',
    'Find the number of edges in a longest root-to-leaf path.',
    treeFormat, 'Print the height; the empty tree has height -1.', treeLimits,
    [
      ['4\n2 1 2\n3 3 -1\n4 -1 -1\n5 -1 -1\n', '2', 'The longest path from node 0 to node 3 uses two edges.'],
      ['1\n7 -1 -1\n', '0', 'The root is itself a leaf, so its path uses no edges.'],
      ['0\n', '-1'],
      ['2\n0 -1 1\n0 -1 -1\n', '1'],
      ['3\n0 1 2\n0 -1 -1\n0 -1 -1\n', '1'],
      ['4\n0 2 -1\n0 -1 -1\n0 3 -1\n0 -1 1\n', '3'],
      ['5\n0 1 2\n0 -1 -1\n0 3 4\n0 -1 -1\n0 -1 -1\n', '2'],
      ['3\n0 -1 2\n0 -1 -1\n0 1 -1\n', '2']
    ],
    ['Height measures edges rather than nodes.', 'Give an absent subtree height -1.', 'A leaf then has height zero.', 'For a node, take the greater child height and add one.', 'Apply this rule at the root, including the empty-tree case.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
def height(i):
    if i == -1:
        return -1
    _, left, right = nodes[i]
    return 1 + max(height(left), height(right))
print(height(0) if n else -1)
`, 'The longest path through a node takes the taller child subtree, adding one edge.', treeStarter
  ),
  'level-87-problem-2': challenge(
    'Mirror a Binary Tree',
    'Mirror the tree by exchanging the left and right child of every node. Keep every original node ID and value.',
    treeFormat, 'Print n lines in original node-ID order, each containing value left right after mirroring. Print EMPTY when n is zero.', treeLimits,
    [
      ['3\n1 1 2\n2 -1 -1\n3 -1 -1\n', '1 2 1\n2 -1 -1\n3 -1 -1', 'Only the root has children, so its two IDs exchange positions.'],
      ['2\n7 1 -1\n9 -1 -1\n', '7 -1 1\n9 -1 -1', 'The root’s left child becomes its right child.'],
      ['0\n', 'EMPTY'],
      ['1\n0 -1 -1\n', '0 -1 -1'],
      ['2\n4 -1 1\n5 -1 -1\n', '4 1 -1\n5 -1 -1'],
      ['3\n0 1 -1\n1 2 -1\n2 -1 -1\n', '0 -1 1\n1 -1 2\n2 -1 -1'],
      ['3\n8 2 1\n9 -1 -1\n10 -1 -1\n', '8 1 2\n9 -1 -1\n10 -1 -1'],
      ['4\n0 1 2\n1 -1 3\n2 -1 -1\n3 -1 -1\n', '0 2 1\n1 3 -1\n2 -1 -1\n3 -1 -1']
    ],
    ['A mirror exchanges child positions at every node.', 'The node IDs themselves do not change.', 'A missing child remains represented by -1.', 'For each original row print its value, right ID, then left ID.', 'For no nodes print EMPTY rather than a row.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
if n == 0:
    print('EMPTY')
for value, left, right in nodes:
    print(value, right, left)
`, 'Swapping the two child IDs in each row mirrors every subtree without changing node IDs.', treeStarter
  ),
  'level-87-problem-3': challenge(
    'Compare Binary Trees',
    'Decide whether two trees have the same structure and matching values at corresponding positions. Their node IDs need not match.',
    'Two trees consecutively, each using this format: ' + treeFormat,
    'Print YES if the trees are identical, otherwise NO. Two empty trees are identical.',
    treeLimits,
    [
      ['3\n1 1 2\n2 -1 -1\n3 -1 -1\n3\n1 2 1\n3 -1 -1\n2 -1 -1\n', 'YES', 'The node IDs differ, but the left value is 2 and the right value is 3 in both trees.'],
      ['2\n1 1 -1\n2 -1 -1\n2\n1 -1 1\n2 -1 -1\n', 'NO', 'One tree has a left child and the other a right child.'],
      ['0\n0\n', 'YES'],
      ['0\n1\n0 -1 -1\n', 'NO'],
      ['1\n0 -1 -1\n1\n1 -1 -1\n', 'NO'],
      ['1\n-1 -1 -1\n1\n-1 -1 -1\n', 'YES'],
      ['2\n1 1 -1\n2 -1 -1\n1\n1 -1 -1\n', 'NO'],
      ['3\n0 1 2\n0 -1 -1\n0 -1 -1\n3\n0 1 2\n0 -1 -1\n1 -1 -1\n', 'NO']
    ],
    ['Compare positions in the two trees, not their numeric IDs.', 'Two missing children match.', 'If only one child is missing, the structures differ.', 'Otherwise compare the values and both pairs of corresponding children.', 'Use the same comparison on the roots, or missing roots for empty trees.'],
    `def read_tree():
    n = int(input())
    return [tuple(map(int, input().split())) for _ in range(n)]
a, b = read_tree(), read_tree()
def same(i, j):
    if i == -1 or j == -1:
        return i == j
    av, al, ar = a[i]
    bv, bl, br = b[j]
    return av == bv and same(al, bl) and same(ar, br)
print('YES' if same(0 if a else -1, 0 if b else -1) else 'NO')
`, 'Recursively compare corresponding values and the presence and contents of their children.', 'import sys\n\n# Read both trees and compare them.\n'
  ),
  'level-87-problem-4': challenge(
    'Root-to-Leaf Target Sum',
    'Decide whether any root-to-leaf path has values summing to the target.',
    treeFormat + ' A final line contains the target integer.',
    'Print YES or NO. The empty tree has no paths, even when the target is zero.',
    [...treeLimits, '-100000 <= target <= 100000.'],
    [
      ['3\n2 1 2\n3 -1 -1\n4 -1 -1\n5\n', 'YES', 'The path 2, 3 sums to 5.'],
      ['3\n2 1 2\n3 -1 -1\n4 -1 -1\n2\n', 'NO', 'The root alone is not a root-to-leaf path because it has children.'],
      ['0\n0\n', 'NO'],
      ['1\n-2 -1 -1\n-2\n', 'YES'],
      ['1\n0 -1 -1\n1\n', 'NO'],
      ['2\n5 -1 1\n-5 -1 -1\n0\n', 'YES'],
      ['3\n1 1 2\n1 -1 -1\n-1 -1 -1\n0\n', 'YES'],
      ['4\n1 1 -1\n2 2 -1\n3 -1 3\n4 -1 -1\n6\n', 'NO']
    ],
    ['Only paths ending at leaves qualify.', 'Subtract the current node value from the remaining target.', 'At a leaf, success means the remaining target becomes zero.', 'Try each existing child with the reduced target.', 'An empty tree cannot supply a path.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
target = int(input())
def matches(i, remaining):
    value, left, right = nodes[i]
    remaining -= value
    if left == -1 and right == -1:
        return remaining == 0
    return ((left != -1 and matches(left, remaining)) or
            (right != -1 and matches(right, remaining)))
print('YES' if n and matches(0, target) else 'NO')
`, 'Subtract each value along a path and accept only a leaf reached with remainder zero.', 'n = int(input())\nnodes = [tuple(map(int, input().split())) for _ in range(n)]\ntarget = int(input())\n\n# Find a matching path.\n'
  ),
  'level-87-problem-5': challenge(
    'Binary Tree Diameter',
    'Find the greatest number of edges on a simple path between any two nodes.',
    treeFormat, 'Print the diameter in edges. The empty tree and a one-node tree both have diameter 0.', treeLimits,
    [
      ['5\n0 1 2\n0 3 4\n0 -1 -1\n0 -1 -1\n0 -1 -1\n', '3', 'A longest path runs from node 3 through 1 and 0 to node 2.'],
      ['3\n0 1 -1\n0 -1 2\n0 -1 -1\n', '2', 'The chain’s endpoints are two edges apart.'],
      ['0\n', '0'],
      ['1\n4 -1 -1\n', '0'],
      ['2\n0 -1 1\n0 -1 -1\n', '1'],
      ['3\n0 1 2\n0 -1 -1\n0 -1 -1\n', '2'],
      ['5\n0 1 -1\n0 2 3\n0 -1 -1\n0 4 -1\n0 -1 -1\n', '3'],
      ['4\n0 2 -1\n0 -1 -1\n0 3 -1\n0 -1 1\n', '3']
    ],
    ['A longest path need not pass through the root.', 'Compute each subtree height while returning from recursion.', 'Use height -1 for a missing subtree.', 'At each node the path joining deepest children has left height plus right height plus two edges.', 'Track the maximum of these candidates over all nodes.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
best = 0
def height(i):
    global best
    if i == -1:
        return -1
    _, left, right = nodes[i]
    lh, rh = height(left), height(right)
    best = max(best, lh + rh + 2)
    return 1 + max(lh, rh)
if n:
    height(0)
print(best)
`, 'Each path has a highest node; combine the two longest downward branches there.', treeStarter
  ),
  'level-88-problem-1': challenge(
    'Sum BST Keys in an Interval',
    'Given a strict binary search tree, sum its keys in the inclusive interval from low to high.',
    treeFormat + ' A final line contains low and high separated by a space.',
    'Print the sum; print 0 if no keys qualify or the tree is empty.',
    [...treeLimits, 'All keys are distinct and the tree is a valid strict BST.', '-1000 <= low <= high <= 1000.'],
    [
      ['3\n5 1 2\n2 -1 -1\n8 -1 -1\n2 5\n', '7', 'Both 2 and 5 are inside the inclusive interval; 8 is not.'],
      ['3\n-2 1 2\n-5 -1 -1\n3 -1 -1\n-4 4\n', '1', 'The qualifying keys are -2 and 3, which sum to 1.'],
      ['0\n-1 1\n', '0'],
      ['1\n0 -1 -1\n0 0\n', '0'],
      ['1\n7 -1 -1\n8 10\n', '0'],
      ['3\n0 1 2\n-1 -1 -1\n1 -1 -1\n-1 1\n', '0'],
      ['4\n10 1 2\n5 -1 3\n20 -1 -1\n7 -1 -1\n6 19\n', '17'],
      ['3\n5 1 2\n2 -1 -1\n8 -1 -1\n8 8\n', '8']
    ],
    ['A key qualifies when it is at least low and at most high.', 'A missing subtree contributes zero.', 'Include the current key only when it is in range.', 'Skip the left subtree when the current key is no greater than low.', 'Skip the right subtree when the current key is no less than high.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
low, high = map(int, input().split())
def total(i):
    if i == -1:
        return 0
    value, left, right = nodes[i]
    answer = value if low <= value <= high else 0
    if value > low:
        answer += total(left)
    if value < high:
        answer += total(right)
    return answer
print(total(0) if n else 0)
`, 'BST ordering permits pruning subtrees entirely outside the interval.', 'n = int(input())\nnodes = [tuple(map(int, input().split())) for _ in range(n)]\nlow, high = map(int, input().split())\n\n# Sum the qualifying keys.\n'
  ),
  'level-88-problem-2': challenge(
    'Insert into a Binary Search Tree',
    'Insert a new key into the strict BST without rebalancing. The new node gets ID n, and all existing IDs stay the same.',
    treeFormat + ' A final line contains the new key.',
    'Print the resulting n+1 rows as value left right in ID order, using -1 for missing children.',
    [...treeLimits, 'The tree is a strict BST with distinct keys; the new key is distinct and between -1000 and 1000.'],
    [
      ['3\n5 1 2\n2 -1 -1\n8 -1 -1\n4\n', '5 1 2\n2 -1 3\n8 -1 -1\n4 -1 -1', '4 is less than 5 but greater than 2, so it becomes node 1’s right child.'],
      ['0\n-3\n', '-3 -1 -1', 'In an empty tree the new node is the root with ID 0.'],
      ['1\n5 -1 -1\n1\n', '5 1 -1\n1 -1 -1'],
      ['1\n5 -1 -1\n9\n', '5 -1 1\n9 -1 -1'],
      ['2\n5 1 -1\n2 -1 -1\n1\n', '5 1 -1\n2 2 -1\n1 -1 -1'],
      ['2\n5 -1 1\n8 -1 -1\n10\n', '5 -1 1\n8 -1 2\n10 -1 -1'],
      ['3\n0 2 1\n5 -1 -1\n-5 -1 -1\n-3\n', '0 2 1\n5 -1 -1\n-5 -1 3\n-3 -1 -1'],
      ['3\n0 1 2\n-1 -1 -1\n1 -1 -1\n-2\n', '0 1 2\n-1 3 -1\n1 -1 -1\n-2 -1 -1']
    ],
    ['The new node starts with no children.', 'If the tree is empty, the new node becomes its root.', 'Otherwise compare the key with the current node.', 'Follow the left child for a smaller key and the right child for a larger key.', 'At the first missing child, replace -1 with the new node ID n.'],
    `n = int(input())
nodes = [list(map(int, input().split())) for _ in range(n)]
key = int(input())
if n:
    i = 0
    while True:
        side = 1 if key < nodes[i][0] else 2
        if nodes[i][side] == -1:
            nodes[i][side] = n
            break
        i = nodes[i][side]
nodes.append([key, -1, -1])
for row in nodes:
    print(*row)
`, 'Comparisons lead to the unique missing child position for the new distinct key.', 'n = int(input())\nnodes = [list(map(int, input().split())) for _ in range(n)]\nkey = int(input())\n\n# Insert the key and print the resulting rows.\n'
  ),
  'level-88-problem-3': challenge(
    'Validate a Binary Search Tree',
    'Determine whether the tree is a strict binary search tree: every value in a node’s left subtree must be smaller than that node, and every value in its right subtree must be larger.',
    treeFormat, 'Print YES or NO. The empty tree is valid.', treeLimits,
    [
      ['3\n5 1 2\n2 -1 -1\n8 -1 -1\n', 'YES', 'Both children are on the correct side of 5.'],
      ['4\n5 1 2\n2 -1 3\n8 -1 -1\n6 -1 -1\n', 'NO', '6 is in the left subtree of 5 even though it is larger than 5.'],
      ['0\n', 'YES'],
      ['1\n0 -1 -1\n', 'YES'],
      ['2\n0 1 -1\n0 -1 -1\n', 'NO'],
      ['2\n0 -1 1\n-1 -1 -1\n', 'NO'],
      ['4\n10 1 2\n5 -1 3\n20 -1 -1\n7 -1 -1\n', 'YES'],
      ['4\n10 1 2\n5 -1 -1\n20 3 -1\n10 -1 -1\n', 'NO']
    ],
    ['Immediate child comparisons are not sufficient.', 'An ancestor can impose an upper or lower bound on every descendant.', 'The left child inherits the lower bound and gains the current value as upper bound.', 'The right child inherits the upper bound and gains the current value as lower bound.', 'Require strict inequalities at each node, and treat missing children as valid.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
def valid(i, low, high):
    if i == -1:
        return True
    value, left, right = nodes[i]
    return (low < value < high and valid(left, low, value)
            and valid(right, value, high))
print('YES' if valid(0 if n else -1, float('-inf'), float('inf')) else 'NO')
`, 'Ancestor bounds propagate through both subtrees, detecting violations beyond immediate children.', treeStarter
  ),
  'level-88-problem-4': challenge(
    'Count BST Insertion Orders',
    'Count the permutations of the tree’s distinct keys that produce the same BST shape and values when inserted into an initially empty BST, without rebalancing.',
    treeFormat, 'Print the number of insertion orders. The empty tree has one empty order.',
    ['0 <= n <= 15; values are distinct integers from -1000 to 1000.', 'The child IDs form one valid strict BST containing every node exactly once.'],
    [
      ['3\n2 1 2\n1 -1 -1\n3 -1 -1\n', '2', 'The root 2 comes first; 1 and 3 can follow in either order.'],
      ['4\n3 1 2\n2 3 -1\n4 -1 -1\n1 -1 -1\n', '3', 'After 3, interleave the fixed left order 2, 1 with the right key 4 in three ways.'],
      ['0\n', '1'],
      ['1\n0 -1 -1\n', '1'],
      ['3\n1 -1 1\n2 -1 2\n3 -1 -1\n', '1'],
      ['5\n3 1 2\n2 3 -1\n5 4 -1\n1 -1 -1\n4 -1 -1\n', '6'],
      ['4\n2 1 2\n1 -1 -1\n3 -1 3\n4 -1 -1\n', '3'],
      ['3\n3 2 -1\n1 -1 -1\n2 1 -1\n', '1']
    ],
    ['The first inserted key must be the root.', 'Left and right subtree keys may be interleaved after the root.', 'Each subtree must retain an insertion order that produces that subtree.', 'Choose positions for the left subtree among all remaining positions.', 'Multiply that binomial coefficient by the numbers of valid left and right orders.'],
    `from math import comb
n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
def count(i):
    if i == -1:
        return 0, 1
    _, left, right = nodes[i]
    ls, lw = count(left)
    rs, rw = count(right)
    return ls + rs + 1, comb(ls + rs, ls) * lw * rw
print(count(0 if n else -1)[1])
`, 'Choose how to interleave independent valid orders of the two child subtrees after the root.', treeStarter
  ),
  'level-88-problem-5': challenge(
    'Largest Ancestor Key Difference',
    'For a strict BST, find the largest absolute difference between the keys of a node and one of its proper ancestors.',
    treeFormat, 'Print the maximum difference, or 0 if no ancestor-descendant pair exists.',
    [...treeLimits, 'All keys are distinct and the tree is a valid strict BST.'],
    [
      ['3\n5 1 2\n2 -1 -1\n9 -1 -1\n', '4', 'The largest difference is between root 5 and its right child 9.'],
      ['3\n10 1 -1\n5 2 -1\n1 -1 -1\n', '9', 'The root 10 and its descendant 1 differ by 9.'],
      ['0\n', '0'],
      ['1\n4 -1 -1\n', '0'],
      ['2\n0 -1 1\n1 -1 -1\n', '1'],
      ['3\n0 1 2\n-5 -1 -1\n3 -1 -1\n', '5'],
      ['4\n10 1 2\n5 -1 3\n20 -1 -1\n7 -1 -1\n', '10'],
      ['4\n-5 -1 1\n0 -1 2\n4 -1 3\n10 -1 -1\n', '15']
    ],
    ['Only compare nodes on the same root-to-node path.', 'The most extreme ancestor keys determine the largest difference at a node.', 'Track the smallest and largest ancestor key while descending.', 'Compare the current key with both extremes before updating them.', 'Take the maximum over all nodes; fewer than two nodes yield zero.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
def search(i, low, high):
    if i == -1:
        return 0
    value, left, right = nodes[i]
    difference = max(abs(value - low), abs(value - high))
    low, high = min(low, value), max(high, value)
    return max(difference, search(left, low, high), search(right, low, high))
print(search(0, nodes[0][0], nodes[0][0]) if n else 0)
`, 'The minimum and maximum keys along each root-to-node path suffice to find the largest ancestor difference.', treeStarter
  ),
  'level-89-problem-1': challenge(
    'Binary Tree Vertical Order',
    'Group node values by horizontal distance from the root. A left child has distance one less than its parent and a right child one more. Within each column order nodes by depth, breaking equal-depth ties from left to right.',
    treeFormat, 'Print one space-separated line per nonempty column, from smallest distance to largest. Print EMPTY for the empty tree.', treeLimits,
    [
      ['5\n1 1 2\n2 -1 3\n3 4 -1\n4 -1 -1\n5 -1 -1\n', '2\n1 4 5\n3', 'The root and nodes with values 4 and 5 share column 0; their equal-depth tie follows left-to-right order.'],
      ['3\n7 1 -1\n8 2 -1\n9 -1 -1\n', '9\n8\n7', 'Each left edge moves one column to the left.'],
      ['0\n', 'EMPTY'],
      ['1\n-1 -1 -1\n', '-1'],
      ['2\n0 -1 1\n1 -1 -1\n', '0\n1'],
      ['3\n1 2 1\n3 -1 -1\n2 -1 -1\n', '2\n1\n3'],
      ['4\n0 1 2\n1 3 -1\n2 -1 -1\n3 -1 -1\n', '3\n1\n0\n2'],
      ['3\n0 -1 1\n1 2 -1\n2 -1 -1\n', '0 2\n1']
    ],
    ['Assign column zero to the root.', 'Move one column left or right for the corresponding child.', 'Use breadth-first order to visit shallower nodes before deeper ones.', 'Visit left children before right children to resolve equal-depth ties.', 'Output columns in increasing numeric order.'],
    `from collections import deque
n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
columns = {}
queue = deque([(0, 0)] if n else [])
while queue:
    i, column = queue.popleft()
    value, left, right = nodes[i]
    columns.setdefault(column, []).append(value)
    if left != -1:
        queue.append((left, column - 1))
    if right != -1:
        queue.append((right, column + 1))
if not columns:
    print('EMPTY')
for column in sorted(columns):
    print(*columns[column])
`, 'Breadth-first traversal preserves depth and left-to-right tie order within each column.', treeStarter
  ),
  'level-89-problem-2': challenge(
    'Binary Tree Right View',
    'Report the value of the rightmost node at each depth, as seen from the right side.',
    treeFormat, 'Print the values from root depth downward, separated by spaces. Print EMPTY for the empty tree.', treeLimits,
    [
      ['4\n1 1 2\n2 -1 3\n3 -1 -1\n4 -1 -1\n', '1 3 4', 'At depth 1 node 3 hides node 2; at depth 2 node 4 is alone.'],
      ['3\n5 1 -1\n6 -1 2\n7 -1 -1\n', '5 6 7', 'Each depth of the chain contains only one node.'],
      ['0\n', 'EMPTY'],
      ['1\n0 -1 -1\n', '0'],
      ['2\n0 -1 1\n1 -1 -1\n', '0 1'],
      ['3\n1 2 1\n3 -1 -1\n2 -1 -1\n', '1 3'],
      ['5\n1 1 2\n2 -1 3\n3 4 -1\n4 -1 -1\n5 -1 -1\n', '1 3 5'],
      ['3\n7 1 2\n7 -1 -1\n7 -1 -1\n', '7 7']
    ],
    ['Nodes at the same depth overlap in the view.', 'Process levels from top to bottom.', 'Within each level order nodes left to right.', 'The final node in that order is visible.', 'For the empty tree there are no visible nodes.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
level = [0] if n else []
view = []
while level:
    view.append(nodes[level[-1]][0])
    following = []
    for i in level:
        for child in nodes[i][1:]:
            if child != -1:
                following.append(child)
    level = following
print(*view) if view else print('EMPTY')
`, 'The final node encountered on each left-to-right level is visible from the right.', treeStarter
  ),
  'level-89-problem-3': challenge(
    'Check Height-Balanced Tree',
    'Determine whether, at every node, the heights of its left and right subtrees differ by at most one edge. An empty subtree has height -1.',
    treeFormat, 'Print YES or NO. The empty tree is balanced.', treeLimits,
    [
      ['3\n0 1 2\n0 -1 -1\n0 -1 -1\n', 'YES', 'Both child subtrees of the root have height 0, and both leaves are balanced.'],
      ['3\n0 1 -1\n0 2 -1\n0 -1 -1\n', 'NO', 'The root’s child heights are 1 and -1, a difference of 2.'],
      ['0\n', 'YES'],
      ['1\n0 -1 -1\n', 'YES'],
      ['2\n0 -1 1\n0 -1 -1\n', 'YES'],
      ['4\n0 1 2\n0 3 -1\n0 -1 -1\n0 -1 -1\n', 'YES'],
      ['5\n0 1 2\n0 3 -1\n0 -1 4\n0 -1 -1\n0 -1 -1\n', 'YES'],
      ['6\n0 1 2\n0 3 -1\n0 4 -1\n0 5 -1\n0 -1 -1\n0 -1 -1\n', 'NO']
    ],
    ['Check every node, not only the root.', 'A missing subtree has height -1.', 'Compute child heights after processing both subtrees.', 'Reject a node if the heights differ by more than one.', 'Propagate an unbalanced result upward as well as a height.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
def inspect(i):
    if i == -1:
        return True, -1
    _, left, right = nodes[i]
    lok, lh = inspect(left)
    rok, rh = inspect(right)
    return lok and rok and abs(lh - rh) <= 1, 1 + max(lh, rh)
print('YES' if inspect(0 if n else -1)[0] else 'NO')
`, 'Each subtree returns both its height and whether every node inside it is balanced.', treeStarter
  ),
  'level-89-problem-4': challenge(
    'Lowest Common Ancestor in a Binary Tree',
    'Find the lowest common ancestor of two node IDs. A node is its own ancestor; lowest means greatest depth from the root.',
    treeFormat + ' A final line contains two IDs a b; when the tree is empty use -1 -1.',
    'Print the ancestor’s node ID, or NONE for the empty tree.',
    [...treeLimits, 'When n > 0, both query IDs exist and may be equal.'],
    [
      ['5\n0 1 2\n0 3 4\n0 -1 -1\n0 -1 -1\n0 -1 -1\n3 4\n', '1', 'Nodes 3 and 4 share parent 1, which is deeper than root 0.'],
      ['3\n0 1 -1\n0 -1 2\n0 -1 -1\n1 2\n', '1', 'Node 1 is an ancestor of node 2 and is its own ancestor.'],
      ['0\n-1 -1\n', 'NONE'],
      ['1\n7 -1 -1\n0 0\n', '0'],
      ['3\n0 1 2\n0 -1 -1\n0 -1 -1\n1 2\n', '0'],
      ['3\n0 1 2\n0 -1 -1\n0 -1 -1\n2 2\n', '2'],
      ['4\n0 2 -1\n0 -1 -1\n0 3 -1\n0 -1 1\n0 1\n', '0'],
      ['5\n0 1 2\n0 3 4\n0 -1 -1\n0 -1 -1\n0 -1 -1\n3 2\n', '0']
    ],
    ['A node counts as its own ancestor.', 'Record the parent of each node.', 'Walk upward from the first node, recording all ancestors.', 'Walk upward from the second node until reaching a recorded ancestor.', 'The first common node found on that upward walk is lowest.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
a, b = map(int, input().split())
if not n:
    print('NONE')
else:
    parent = [-1] * n
    for i, (_, left, right) in enumerate(nodes):
        for child in (left, right):
            if child != -1:
                parent[child] = i
    ancestors = set()
    while a != -1:
        ancestors.add(a)
        a = parent[a]
    while b not in ancestors:
        b = parent[b]
    print(b)
`, 'Mark one node’s ancestors, then find the first marked node walking up from the other.', 'n = int(input())\nnodes = [tuple(map(int, input().split())) for _ in range(n)]\na, b = map(int, input().split())\n\n# Find the lowest common ancestor.\n'
  ),
  'level-89-problem-5': challenge(
    'Rebuild Tree from Traversals',
    'Reconstruct a binary tree from preorder and inorder value sequences. Values are distinct. Assign IDs in preorder order, starting at zero.',
    'First line: n. Second line: n preorder values. Third line: n inorder values. Both sequence lines are empty when n is zero.',
    'Print n rows value left right in ID order, using -1 for no child. Print EMPTY when n is zero.',
    ['0 <= n <= 100; values are distinct integers from -1000 to 1000.', 'The sequences describe the same valid binary tree.'],
    [
      ['3\n1 2 3\n2 1 3\n', '1 1 2\n2 -1 -1\n3 -1 -1', '1 is the root; 2 appears to its left in inorder and 3 to its right.'],
      ['3\n3 2 1\n1 2 3\n', '3 1 -1\n2 2 -1\n1 -1 -1', 'Each next preorder value is in the left inorder segment, forming a chain.'],
      ['0\n\n\n', 'EMPTY'],
      ['1\n5\n5\n', '5 -1 -1'],
      ['2\n1 2\n1 2\n', '1 -1 1\n2 -1 -1'],
      ['3\n1 2 3\n1 2 3\n', '1 -1 1\n2 -1 2\n3 -1 -1'],
      ['4\n5 2 4 9\n2 4 5 9\n', '5 1 3\n2 -1 2\n4 -1 -1\n9 -1 -1'],
      ['4\n2 1 4 3\n1 2 3 4\n', '2 1 2\n1 -1 -1\n4 3 -1\n3 -1 -1']
    ],
    ['Preorder starts each subtree with its root.', 'Find that root in the matching inorder segment.', 'Values before it belong to the left subtree, and values after it to the right.', 'Recursively consume preorder values while building the two subtrees.', 'Assign each new ID at the moment its preorder value is consumed.'],
    `n = int(input())
pre = list(map(int, input().split()))
ino = list(map(int, input().split()))
positions = {value: i for i, value in enumerate(ino)}
rows = []
def build(start, end):
    if start == end:
        return -1
    i = len(rows)
    value = pre[i]
    rows.append([value, -1, -1])
    middle = positions[value]
    rows[i][1] = build(start, middle)
    rows[i][2] = build(middle + 1, end)
    return i
build(0, n)
if not rows:
    print('EMPTY')
for row in rows:
    print(*row)
`, 'The inorder root position separates the two child subtrees; preorder supplies their roots.', 'n = int(input())\npreorder = input().split()\ninorder = input().split()\n\n# Reconstruct and print the tree.\n'
  ),
  'level-90-problem-1': challenge(
    'Count Independent Node Sets',
    'Count subsets of tree nodes in which no parent and child are both selected. Include the empty subset; node values do not matter.',
    treeFormat, 'Print the number of such subsets. The empty tree has one subset.', treeLimits,
    [
      ['3\n0 1 2\n0 -1 -1\n0 -1 -1\n', '5', 'Choose any subset of the two leaves (four options), or choose only the root.'],
      ['2\n0 -1 1\n0 -1 -1\n', '3', 'The allowed subsets are empty, root only, and child only.'],
      ['0\n', '1'],
      ['1\n0 -1 -1\n', '2'],
      ['3\n0 1 -1\n0 -1 2\n0 -1 -1\n', '5'],
      ['4\n0 1 -1\n0 2 -1\n0 3 -1\n0 -1 -1\n', '8'],
      ['5\n0 1 2\n0 3 4\n0 -1 -1\n0 -1 -1\n0 -1 -1\n', '14'],
      ['4\n0 1 2\n0 -1 3\n0 -1 -1\n0 -1 -1\n', '8']
    ],
    ['Classify each subset by whether it includes the root.', 'If the root is selected, neither child may be selected.', 'If the root is not selected, either state is allowed for each child.', 'Multiply independent choices from the two child subtrees.', 'Return both counts from each subtree; an empty subtree has one unselected choice.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
def count(i):
    if i == -1:
        return 1, 0
    _, left, right = nodes[i]
    l0, l1 = count(left)
    r0, r1 = count(right)
    return (l0 + l1) * (r0 + r1), l0 * r0
without, with_root = count(0 if n else -1)
print(without + with_root)
`, 'Combine subtree counts separately for sets excluding or including each subtree root.', treeStarter
  ),
  'level-90-problem-2': challenge(
    'Maximum Binary Tree Path Sum',
    'Find the greatest sum of node values along a nonempty simple path between any two nodes. A path may consist of one node and need not include the root.',
    treeFormat, 'Print the maximum sum, or EMPTY for the empty tree.', treeLimits,
    [
      ['3\n-1 1 2\n3 -1 -1\n4 -1 -1\n', '6', 'The path from 3 through -1 to 4 sums to 6.'],
      ['3\n-5 1 2\n-2 -1 -1\n-9 -1 -1\n', '-2', 'All values are negative, so the best nonempty path is node 1 alone.'],
      ['0\n', 'EMPTY'],
      ['1\n0 -1 -1\n', '0'],
      ['2\n5 -1 1\n-10 -1 -1\n', '5'],
      ['3\n1 1 2\n2 -1 -1\n3 -1 -1\n', '6'],
      ['4\n-10 1 2\n9 -1 -1\n20 3 -1\n15 -1 -1\n', '35'],
      ['4\n2 1 -1\n-1 2 -1\n4 -1 3\n-2 -1 -1\n', '5']
    ],
    ['A path can start and end anywhere.', 'A negative branch can be omitted from a path.', 'For each node compute the best downward path beginning there.', 'Also consider joining the best nonnegative downward branches through the node.', 'Keep the largest candidate, initialized so an all-negative tree still uses one node.'],
    `n = int(input())
nodes = [tuple(map(int, input().split())) for _ in range(n)]
best = None
def downward(i):
    global best
    if i == -1:
        return 0
    value, left, right = nodes[i]
    l = max(0, downward(left))
    r = max(0, downward(right))
    candidate = value + l + r
    if best is None or candidate > best:
        best = candidate
    return value + max(l, r)
if n:
    downward(0)
print(best if n else 'EMPTY')
`, 'At the highest node of a path, join up to two beneficial downward branches.', treeStarter
  ),
  'level-90-problem-3': challenge(
    'Count Distinct Word Prefixes',
    'Count the distinct nonempty prefixes of the supplied words. A complete word is also one of its prefixes; repeated words do not add new prefixes.',
    'First line: n. Next n lines: one word each.',
    'Print the number of distinct nonempty prefixes. An empty word collection has zero.',
    ['0 <= n <= 50.', 'Each word contains 1 to 20 lowercase ASCII letters; words may repeat.'],
    [
      ['2\ncat\ncar\n', '4', 'The distinct prefixes are c, ca, cat and car.'],
      ['2\na\napple\n', '5', 'The prefixes are a, ap, app, appl and apple; a is counted once.'],
      ['0\n', '0'],
      ['1\na\n', '1'],
      ['2\nab\nab\n', '2'],
      ['2\nabc\nxyz\n', '6'],
      ['3\na\nb\nc\n', '3'],
      ['3\napple\nape\napricot\n', '11']
    ],
    ['Words sharing a prefix can share a chain of trie nodes.', 'Each non-root trie node represents one nonempty prefix.', 'Start inserting each word at the root.', 'Create a child only when its character edge is missing.', 'Count each new node once, without counting the root.'],
    `n = int(input())
trie = {}
count = 0
for _ in range(n):
    node = trie
    for char in input():
        if char not in node:
            node[char] = {}
            count += 1
        node = node[char]
print(count)
`, 'Each newly created trie node represents one previously unseen nonempty prefix.', 'n = int(input())\nwords = [input() for _ in range(n)]\n\n# Count distinct prefixes.\n'
  ),
  'level-90-problem-4': challenge(
    'Shortest Unique Word Prefixes',
    'For each distinct word, find its shortest nonempty prefix that is not a prefix of any other supplied word. If none exists, report NONE.',
    'First line: n. Next n lines: one word per line, in the order to report.',
    'Print one prefix or NONE per word, one per line; print nothing for no words.',
    ['0 <= n <= 50.', 'Words are distinct and contain 1 to 20 lowercase ASCII letters.'],
    [
      ['3\ndog\ndove\ncat\n', 'dog\ndov\nc', 'dog and dove share do but differ at their third letters; c identifies cat.'],
      ['2\na\nab\n', 'NONE\nab', 'Every prefix of a also prefixes ab, while ab distinguishes the longer word.'],
      ['0\n', ''],
      ['1\nabc\n', 'a'],
      ['2\ncat\ncar\n', 'cat\ncar'],
      ['3\na\nb\nc\n', 'a\nb\nc'],
      ['2\nabc\nabcd\n', 'NONE\nabcd'],
      ['3\napple\nape\napricot\n', 'app\nape\napr']
    ],
    ['Two words share a prefix while their trie paths coincide.', 'Count how many words pass through each trie node.', 'Build the counts for every word.', 'For each word scan its prefixes from shortest to longest.', 'The first node with count one identifies that word; if none does, print NONE.'],
    `n = int(input())
words = [input() for _ in range(n)]
trie = {}
for word in words:
    node = trie
    for char in word:
        node = node.setdefault(char, {'count': 0})
        node['count'] += 1
for word in words:
    node = trie
    prefix = ''
    answer = 'NONE'
    for char in word:
        prefix += char
        node = node[char]
        if node['count'] == 1:
            answer = prefix
            break
    print(answer)
`, 'Trie pass counts identify the earliest prefix belonging to exactly one word.', 'n = int(input())\nwords = [input() for _ in range(n)]\n\n# Find a distinguishing prefix for each word.\n'
  ),
  'level-90-problem-5': challenge(
    'Parse Infix Arithmetic to Postfix',
    'Convert the valid infix expression to postfix. Operators * and // have higher precedence than + and -; operators at the same precedence associate left to right. Parentheses override precedence.',
    'One line of space-separated tokens: nonnegative integer literals, operators + - * //, and parentheses ( and ).',
    'Print postfix tokens separated by one space, preserving each literal exactly as written.',
    ['There are 1 to 100 tokens; each integer literal has 1 to 10 ASCII digits.', 'The expression is valid, has binary operators only, and uses no unary operators.'],
    [
      ['2 + 3 * 4\n', '2 3 4 * +', 'Multiplication binds first, so 3 and 4 precede *, then + combines that result with 2.'],
      ['( 2 + 3 ) * 4\n', '2 3 + 4 *', 'Parentheses make the addition precede multiplication.'],
      ['7\n', '7'],
      ['8 - 3 - 1\n', '8 3 - 1 -'],
      ['8 // 3 * 2\n', '8 3 // 2 *'],
      ['( 1 )\n', '1'],
      ['10 * ( 2 + ( 3 - 4 ) )\n', '10 2 3 4 - + *'],
      ['01 + 2 // 3 - 4 * 5\n', '01 2 3 // + 4 5 * -']
    ],
    ['Operands go directly into the output.', 'Keep pending operators and opening parentheses on a stack.', 'Before pushing an operator, pop operators of greater or equal precedence.', 'On a closing parenthesis, pop through the matching opening parenthesis without outputting it.', 'After all tokens, pop any remaining operators.'],
    `tokens = input().split()
precedence = {'+': 1, '-': 1, '*': 2, '//': 2}
stack, output = [], []
for token in tokens:
    if token.isdigit():
        output.append(token)
    elif token == '(':
        stack.append(token)
    elif token == ')':
        while stack[-1] != '(':
            output.append(stack.pop())
        stack.pop()
    else:
        while stack and stack[-1] != '(' and precedence[stack[-1]] >= precedence[token]:
            output.append(stack.pop())
        stack.append(token)
while stack:
    output.append(stack.pop())
print(*output)
`, 'A precedence stack delays operators until their operands have been emitted, respecting parentheses and left associativity.', 'tokens = input().split()\n\n# Convert the expression to postfix.\n'
  )
};
