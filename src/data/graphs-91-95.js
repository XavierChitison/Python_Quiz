import { challenge } from './beginner.js';

const graph = 'First line n m, then m lines u v. Vertices are numbered 0 through n-1; each endpoint is a vertex number.';
const directed = ['1 <= n <= 8 and 0 <= m <= n*n.', 'The directed graph is simple: no repeated ordered edges; self-loops are allowed.'];
const undirected = ['1 <= n <= 8 and 0 <= m <= n*(n-1)/2.', 'The undirected graph is simple: no self-loops or repeated edges.'];
const query = ' After the edges, one line s t specifies source and destination, both valid vertex numbers.';
const weighted = 'First line n m, followed by m lines u v w for directed edges. Vertices are numbered 0 through n-1; each endpoint is a vertex number.';
const grid = 'First line h w, then h lines of w space-separated integers.';
const binary = ['1 <= h, w <= 5.', 'Every cell is 0 or 1. Neighbors share an edge, not just a corner.'];
const graphStarter = 'n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\n\n# Compute and print the answer.\n';
const graphQueryStarter = 'n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\ns, t = map(int, input().split())\n\n# Compute and print the answer.\n';
const sourceStarter = 'n, m = map(int, input().split())\nedges = [tuple(map(int, input().split())) for _ in range(m)]\ns = int(input())\n\n# Compute and print the answer.\n';
const gridStarter = 'h, w = map(int, input().split())\ngrid = [list(map(int, input().split())) for _ in range(h)]\n\n# Compute and print the answer.\n';
const gridQueryStarter = 'h, w = map(int, input().split())\ngrid = [list(map(int, input().split())) for _ in range(h)]\nquery = list(map(int, input().split()))\n\n# Compute and print the answer.\n';
const listStarter = 'values = list(map(int, input().split()))\n\n# Compute and print the answer.\n';
const textStarter = 'text = input()\n\n# Compute and print the answer.\n';
const targetStarter = 'values = list(map(int, input().split()))\ntarget = int(input())\n\n# Compute and print the answer.\n';
const parenthesesStarter = 'n = int(input())\nprefix = input()\n\n# Compute and print the answer.\n';

export const graphs9195Challenges = {
  'level-91-problem-1': challenge(
    'Directed Reachability', 'Decide whether t is reachable from s following directed edges; a vertex reaches itself without edges.',
    graph + query, 'Print YES or NO.', directed,
    [['4 3\n0 1\n1 2\n2 1\n0 2\n','YES','The edges 0 to 1 and 1 to 2 form a route.'],['3 1\n1 0\n0 1\n','NO','The only edge points the wrong way.'],['1 0\n0 0\n','YES'],['2 0\n0 1\n','NO'],['3 2\n0 1\n1 2\n2 0\n','NO'],['3 3\n0 0\n0 1\n1 2\n0 2\n','YES'],['4 2\n0 1\n2 3\n0 3\n','NO'],['4 4\n0 1\n1 2\n2 0\n2 3\n1 3\n','YES']],
    ['Follow edges only in their given direction.','Start with s in a stack.','Remember vertices already visited.','Add unseen outgoing neighbors until the stack is empty.','Check whether t was visited, including when s equals t.'],
    `n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
s, t = map(int, input().split())
seen = {s}
stack = [s]
while stack:
    u = stack.pop()
    for v in adj[u]:
        if v not in seen:
            seen.add(v)
            stack.append(v)
print('YES' if t in seen else 'NO')
`, 'A traversal discovers exactly the vertices reachable from s.', graphQueryStarter
  ),
  'level-91-problem-2': challenge(
    'Unweighted Shortest Path Length', 'Find the fewest edges on an undirected path from s to t.',
    graph + query, 'Print the distance, or -1 if unreachable.', undirected,
    [['4 4\n0 1\n1 2\n2 3\n0 3\n0 2\n','2','Either 0-1-2 or 0-3-2 uses two edges.'],['3 1\n0 1\n0 2\n','-1','Vertex 2 is isolated.'],['1 0\n0 0\n','0'],['2 1\n0 1\n1 0\n','1'],['4 3\n0 1\n1 2\n2 3\n0 3\n','3'],['3 0\n1 1\n','0'],['4 2\n0 1\n2 3\n0 3\n','-1'],['3 3\n0 1\n0 2\n1 2\n0 2\n','1']],
    ['Edges can be followed either way.','Use a queue starting at s.','Set the starting distance to zero.','Give each newly discovered neighbor one more than its parent distance.','Unvisited t has distance -1.'],
    `from collections import deque
n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
s, t = map(int, input().split())
dist = [-1] * n
dist[s] = 0
q = deque([s])
while q:
    u = q.popleft()
    for v in adj[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            q.append(v)
print(dist[t])
`, 'Breadth-first search visits vertices in increasing edge distance.', graphQueryStarter
  ),
  'level-91-problem-3': challenge(
    'Connected Components', 'Partition all vertices of an undirected graph into connected components.',
    graph, 'Print the number of components, then one component per line as ascending vertex numbers separated by spaces. Order components by their smallest vertex.', undirected,
    [['5 2\n0 2\n3 4\n','3\n0 2\n1\n3 4','Vertices 0 and 2 form one component, 1 is alone, and 3 joins 4.'],['3 2\n0 1\n1 2\n','1\n0 1 2','The chain connects all three vertices.'],['1 0\n','1\n0'],['3 0\n','3\n0\n1\n2'],['4 2\n0 3\n1 2\n','2\n0 3\n1 2'],['4 3\n0 1\n1 2\n0 2\n','2\n0 1 2\n3'],['2 1\n0 1\n','1\n0 1'],['5 2\n1 3\n1 4\n','3\n0\n1 3 4\n2']],
    ['An isolated vertex is its own component.','Scan vertices in numerical order.','Start a traversal whenever a vertex is unseen.','Collect and sort vertices reached by that traversal.','Print the component count before the sorted groups.'],
    `n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
seen = set()
groups = []
for start in range(n):
    if start in seen:
        continue
    seen.add(start)
    stack = [start]
    group = []
    while stack:
        u = stack.pop()
        group.append(u)
        for v in adj[u]:
            if v not in seen:
                seen.add(v)
                stack.append(v)
    groups.append(sorted(group))
print(len(groups))
for group in groups:
    print(*group)
`, 'Each traversal finds one maximal connected group; ascending starts determine group order.', graphStarter
  ),
  'level-91-problem-4': challenge(
    'Count Unweighted Shortest Paths', 'Count distinct shortest vertex paths from s to t in an undirected graph. The empty path from a vertex to itself counts once.',
    graph + query, 'Print the count, or 0 if unreachable.', undirected,
    [['4 4\n0 1\n0 2\n1 3\n2 3\n0 3\n','2','The two shortest routes go through 1 and 2.'],['4 3\n0 1\n1 2\n2 3\n0 3\n','1','The chain has exactly one route.'],['1 0\n0 0\n','1'],['2 0\n0 1\n','0'],['3 3\n0 1\n1 2\n0 2\n0 2\n','1'],['4 4\n0 1\n1 2\n2 3\n3 0\n1 3\n','2'],['3 1\n0 1\n2 0\n','0'],['3 2\n0 1\n1 2\n1 1\n','1']],
    ['Use BFS to determine shortest distances.','The source has distance zero and one path.','When first reaching a neighbor, record its distance and enqueue it.','Every edge from distance d to d+1 contributes its predecessor’s path count.','Return zero for unreachable vertices.'],
    `from collections import deque
n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
s, t = map(int, input().split())
dist = [-1] * n
ways = [0] * n
dist[s], ways[s] = 0, 1
q = deque([s])
while q:
    u = q.popleft()
    for v in adj[u]:
        if dist[v] == -1:
            dist[v] = dist[u] + 1
            q.append(v)
        if dist[v] == dist[u] + 1:
            ways[v] += ways[u]
print(ways[t])
`, 'BFS accumulates contributions only from the preceding distance layer.', graphQueryStarter
  ),
  'level-91-problem-5': challenge(
    'Check Bipartite Graph', 'Determine whether every vertex of an undirected graph can be assigned one of two colors so each edge has differently colored endpoints.',
    graph, 'Print YES or NO.', undirected,
    [['4 4\n0 1\n1 2\n2 3\n3 0\n','YES','Alternating colors around this even cycle works.'],['3 3\n0 1\n1 2\n0 2\n','NO','A triangle forces two adjacent vertices to share a color.'],['1 0\n','YES'],['4 0\n','YES'],['2 1\n0 1\n','YES'],['5 3\n0 1\n1 2\n2 0\n','NO'],['5 4\n0 1\n0 2\n0 3\n0 4\n','YES'],['6 5\n0 1\n1 2\n3 4\n4 5\n5 3\n','NO']],
    ['Consider every component, including isolated vertices.','Assign an arbitrary starting color to an unseen vertex.','Every neighbor must have the opposite color.','Traverse and assign colors to unseen neighbors.','A previously colored neighbor with the same color proves failure.'],
    `n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
color = [-1] * n
ok = True
for s in range(n):
    if color[s] != -1:
        continue
    color[s] = 0
    stack = [s]
    while stack:
        u = stack.pop()
        for v in adj[u]:
            if color[v] == -1:
                color[v] = 1 - color[u]
                stack.append(v)
            elif color[v] == color[u]:
                ok = False
print('YES' if ok else 'NO')
`, 'Alternating colors on each traversal detects precisely the conflicting edges.', graphStarter
  ),
  'level-92-problem-1': challenge(
    'Undirected Cycle Detection', 'Determine whether a simple undirected graph contains a cycle.',
    graph, 'Print YES if a cycle exists, otherwise NO.', undirected,
    [['3 3\n0 1\n1 2\n2 0\n','YES','The triangle returns to its starting vertex.'],['4 3\n0 1\n1 2\n1 3\n','NO','A branching tree has no cycle.'],['1 0\n','NO'],['4 0\n','NO'],['2 1\n0 1\n','NO'],['5 3\n2 3\n3 4\n4 2\n','YES'],['4 4\n0 1\n1 2\n2 3\n3 0\n','YES'],['5 2\n0 1\n3 4\n','NO']],
    ['Examine every connected component.','During DFS remember the parent of each vertex.','The edge back to the parent is not a cycle.','An edge to any other visited vertex indicates a cycle.','Print NO if no component contains one.'],
    `n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)
seen = set()
def visit(u, parent):
    seen.add(u)
    for v in adj[u]:
        if v == parent:
            continue
        if v in seen or visit(v, u):
            return True
    return False
found = False
for u in range(n):
    if u not in seen and visit(u, -1):
        found = True
print('YES' if found else 'NO')
`, 'A visited nonparent neighbor closes an undirected cycle.', graphStarter
  ),
  'level-92-problem-2': challenge(
    'Directed Cycle Detection', 'Determine whether a directed graph contains a directed cycle; a self-loop is a cycle.',
    graph, 'Print YES if a cycle exists, otherwise NO.', directed,
    [['3 3\n0 1\n1 2\n2 0\n','YES','Following the three arrows returns to 0.'],['3 3\n0 1\n0 2\n1 2\n','NO','All arrows move forward without returning.'],['1 0\n','NO'],['1 1\n0 0\n','YES'],['4 2\n2 3\n3 2\n','YES'],['3 2\n0 1\n1 0\n','YES'],['4 3\n0 1\n2 1\n1 3\n','NO'],['3 0\n','NO']],
    ['Track unvisited, active, and finished vertices.','Start DFS from every unvisited vertex.','Mark a vertex active before following outgoing edges.','An edge to an active vertex closes a directed cycle.','Mark a vertex finished after exploring its outgoing edges.'],
    `n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
state = [0] * n
def visit(u):
    state[u] = 1
    for v in adj[u]:
        if state[v] == 1 or (state[v] == 0 and visit(v)):
            return True
    state[u] = 2
    return False
print('YES' if any(state[u] == 0 and visit(u) for u in range(n)) else 'NO')
`, 'Edges to active ancestors identify directed cycles, including self-loops.', graphStarter
  ),
  'level-92-problem-3': challenge(
    'Lexicographically Smallest Topological Order', 'Output the lexicographically smallest vertex ordering in which each directed edge goes from earlier to later; report cycles.',
    graph, 'Print the vertices separated by spaces, or CYCLE if no order exists.', directed,
    [['4 2\n0 2\n1 2\n','0 1 2 3','After 0 and 1, both 2 and 3 are available; 2 is smaller.'],['2 2\n0 1\n1 0\n','CYCLE','Each vertex would need to precede the other.'],['1 0\n','0'],['1 1\n0 0\n','CYCLE'],['3 0\n','0 1 2'],['3 2\n2 0\n2 1\n','2 0 1'],['4 2\n3 0\n1 2\n','1 2 3 0'],['4 3\n0 1\n2 3\n3 2\n','CYCLE']],
    ['Count incoming edges for each vertex.','Vertices with zero remaining indegree are eligible.','Choose the smallest eligible vertex each time.','Remove its outgoing edges and update indegrees.','If fewer than n vertices are removed, print CYCLE.'],
    `import heapq
n, m = map(int, input().split())
adj = [[] for _ in range(n)]
indeg = [0] * n
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    indeg[v] += 1
heap = [u for u in range(n) if indeg[u] == 0]
heapq.heapify(heap)
order = []
while heap:
    u = heapq.heappop(heap)
    order.append(u)
    for v in adj[u]:
        indeg[v] -= 1
        if indeg[v] == 0:
            heapq.heappush(heap, v)
print(' '.join(map(str, order)) if len(order) == n else 'CYCLE')
`, 'Choosing the smallest available zero-indegree vertex gives the smallest valid order.', graphStarter
  ),
  'level-92-problem-4': challenge(
    'Strongly Connected Components', 'Partition a directed graph into maximal groups whose vertices can all reach one another.',
    graph, 'Print the number of groups, then each group as ascending vertices separated by spaces; order groups by their smallest vertex.', directed,
    [['4 4\n0 1\n1 0\n1 2\n2 3\n','3\n0 1\n2\n3','Only 0 and 1 can reach each other.'],['3 3\n0 1\n1 2\n2 0\n','1\n0 1 2','The directed cycle makes every pair mutually reachable.'],['1 0\n','1\n0'],['1 1\n0 0\n','1\n0'],['3 0\n','3\n0\n1\n2'],['4 4\n0 1\n1 0\n2 3\n3 2\n','2\n0 1\n2 3'],['3 2\n0 1\n1 2\n','3\n0\n1\n2'],['4 4\n0 2\n2 0\n1 3\n3 1\n','2\n0 2\n1 3']],
    ['A group requires reachability in both directions.','Record vertices in DFS finishing order.','Build a graph with every edge reversed.','Visit the reversed graph in reverse finishing order.','Sort each collected group and then sort groups by their first vertex.'],
    `n, m = map(int, input().split())
adj = [[] for _ in range(n)]
rev = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    rev[v].append(u)
seen = set()
order = []
def finish(u):
    seen.add(u)
    for v in adj[u]:
        if v not in seen:
            finish(v)
    order.append(u)
for u in range(n):
    if u not in seen:
        finish(u)
seen.clear()
groups = []
def collect(u, group):
    seen.add(u)
    group.append(u)
    for v in rev[u]:
        if v not in seen:
            collect(v, group)
for u in reversed(order):
    if u not in seen:
        group = []
        collect(u, group)
        groups.append(sorted(group))
groups.sort()
print(len(groups))
for group in groups:
    print(*group)
`, 'Reverse finishing order on the transposed graph isolates each strongly connected component.', graphStarter
  ),
  'level-92-problem-5': challenge(
    'Count Paths in a DAG', 'Count directed paths from s to t in an acyclic directed graph. The empty path from a vertex to itself counts once.',
    graph + query, 'Print the number of paths.', ['1 <= n <= 8 and 0 <= m <= n*(n-1)/2.', 'The directed graph is simple and acyclic.'],
    [['4 4\n0 1\n0 2\n1 3\n2 3\n0 3\n','2','The paths use either vertex 1 or 2.'],['3 3\n0 1\n1 2\n0 2\n0 2\n','2','Both the direct edge and the two-edge route count.'],['1 0\n0 0\n','1'],['2 0\n0 1\n','0'],['3 2\n0 1\n1 2\n2 0\n','0'],['4 3\n0 1\n1 2\n2 3\n0 3\n','1'],['4 4\n0 1\n0 2\n1 2\n2 3\n0 3\n','2'],['3 2\n0 1\n1 2\n1 1\n','1']],
    ['A DAG cannot revisit a vertex on a path.','There is one empty path from t to itself.','For any other vertex, sum the counts from its outgoing neighbors.','Memoize each vertex count to avoid repeated work.','Unreachable vertices contribute zero.'],
    `from functools import lru_cache
n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
s, t = map(int, input().split())
@lru_cache(None)
def paths(u):
    if u == t:
        return 1
    return sum(paths(v) for v in adj[u])
print(paths(s))
`, 'Every path has a unique first edge; the target contributes one empty continuation.', graphQueryStarter
  ),
  'level-93-problem-1': challenge(
    'Nonnegative Shortest Distances', 'Find the minimum total edge weight from source s to every vertex in a directed graph.',
    weighted + ' After the edges, one line contains source vertex s.', 'Print n distances in vertex order, using INF for unreachable vertices.', ['1 <= n <= 8 and 0 <= m <= n*n.', 'Edges are distinct ordered pairs; self-loops are allowed.', '0 <= w <= 20.'],
    [['4 4\n0 1 4\n0 2 1\n2 1 1\n1 3 2\n0\n','0 2 1 4','Going through 2 improves the distance to 1 and then 3.'],['3 1\n1 2 0\n0\n','0 INF INF','No edge leaves source 0.'],['1 0\n0\n','0'],['2 1\n0 1 0\n0\n','0 0'],['3 2\n0 1 5\n1 2 6\n1\n','INF 0 6'],['3 3\n0 1 8\n0 2 3\n2 1 2\n0\n','0 5 3'],['2 1\n1 1 7\n1\n','INF 0'],['4 3\n0 1 1\n1 2 1\n2 0 1\n0\n','0 1 2 INF']],
    ['Start the source at distance zero and other vertices at infinity.','Keep tentative distances in a min-heap.','Discard outdated heap entries.','Relax each outgoing edge by adding its nonnegative weight.','Print INF wherever no distance was found.'],
    `import heapq
n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
s = int(input())
dist = [float('inf')] * n
dist[s] = 0
heap = [(0, s)]
while heap:
    d, u = heapq.heappop(heap)
    if d != dist[u]:
        continue
    for v, w in adj[u]:
        if d + w < dist[v]:
            dist[v] = d + w
            heapq.heappush(heap, (dist[v], v))
print(*(x if x != float('inf') else 'INF' for x in dist))
`, 'Dijkstra relaxes edges in order of increasing tentative distance.', sourceStarter
  ),
  'level-93-problem-2': challenge(
    'Signed Distances and Negative Cycles', 'Find source distances in a directed graph with signed weights, unless a negative-weight cycle is reachable from the source.',
    weighted + ' After the edges, one line contains source vertex s.', 'Print NEGATIVE CYCLE if one is reachable; otherwise print n distances in vertex order, using INF for unreachable vertices.', ['1 <= n <= 8 and 0 <= m <= n*n.', 'Edges are distinct ordered pairs; self-loops are allowed.', '-20 <= w <= 20.'],
    [['3 3\n0 1 4\n0 2 5\n1 2 -3\n0\n','0 4 1','The route through 1 has total weight 1.'],['3 3\n0 1 1\n1 2 -2\n2 1 1\n0\n','NEGATIVE CYCLE','The reachable 1-2-1 cycle has weight -1.'],['1 0\n0\n','0'],['1 1\n0 0 -1\n0\n','NEGATIVE CYCLE'],['3 2\n1 2 -2\n2 1 1\n0\n','0 INF INF'],['2 1\n0 1 -5\n0\n','0 -5'],['2 2\n0 1 -1\n1 0 1\n0\n','0 -1'],['4 2\n0 1 3\n2 3 -8\n0\n','0 3 INF INF']],
    ['Initialize only the source to zero.','Relax every edge up to n-1 times.','Ignore edges whose start is unreachable.','A further possible relaxation proves a reachable negative cycle.','Otherwise print the final distances and INF markers.'],
    `n, m = map(int, input().split())
edges = [tuple(map(int, input().split())) for _ in range(m)]
s = int(input())
inf = float('inf')
dist = [inf] * n
dist[s] = 0
for _ in range(n - 1):
    for u, v, w in edges:
        if dist[u] != inf and dist[u] + w < dist[v]:
            dist[v] = dist[u] + w
if any(dist[u] != inf and dist[u] + w < dist[v] for u, v, w in edges):
    print('NEGATIVE CYCLE')
else:
    print(*(x if x != inf else 'INF' for x in dist))
`, 'After n-1 rounds, any reachable improvement signals a negative cycle.', sourceStarter
  ),
  'level-93-problem-3': challenge(
    'All-Pairs Shortest Distances', 'Find the minimum total weight from every vertex to every other vertex in a directed graph with no negative cycle.',
    weighted, 'Print n lines of n distances, with INF for unreachable pairs. The distance from a vertex to itself is zero.', ['1 <= n <= 8 and 0 <= m <= n*n.', 'Edges are distinct ordered pairs; self-loops are allowed.', '-20 <= w <= 20; no directed cycle has negative total weight.'],
    [['3 3\n0 1 2\n1 2 -1\n0 2 5\n','0 2 1\nINF 0 -1\nINF INF 0','The path through 1 improves 0 to 2 from 5 to 1.'],['2 2\n0 1 3\n1 0 4\n','0 3\n4 0','Both vertices reach each other directly.'],['1 0\n','0'],['2 0\n','0 INF\nINF 0'],['1 1\n0 0 5\n','0'],['2 1\n1 0 -2\n','0 INF\n-2 0'],['3 2\n0 1 0\n1 2 0\n','0 0 0\nINF 0 0\nINF INF 0'],['2 2\n0 1 -2\n1 0 2\n','0 -2\n2 0']],
    ['Create a distance table initialized to infinity.','Set diagonal distances to zero and insert the edges.','Try each vertex k as an intermediate point.','Update i to j only when both i to k and k to j are reachable.','Print the resulting table row by row.'],
    `n, m = map(int, input().split())
inf = float('inf')
d = [[inf] * n for _ in range(n)]
for i in range(n):
    d[i][i] = 0
for _ in range(m):
    u, v, w = map(int, input().split())
    d[u][v] = min(d[u][v], w)
for k in range(n):
    for i in range(n):
        for j in range(n):
            d[i][j] = min(d[i][j], d[i][k] + d[k][j])
for row in d:
    print(*(x if x != inf else 'INF' for x in row))
`, 'Floyd-Warshall progressively permits each vertex as an intermediate.', graphStarter
  ),
  'level-93-problem-4': challenge(
    'Minimum Spanning Forest Weight', 'Find the minimum total edge weight of a spanning forest: one tree spanning each connected component of an undirected graph.',
    'First line n m, then m lines u v w for undirected weighted edges. Vertices are numbered 0 through n-1; each endpoint is a vertex number.', 'Print the integer total; a graph with no edges has total 0.', ['1 <= n <= 8 and 0 <= m <= n*(n-1)/2.', 'The graph is simple, with no self-loops or repeated edges.', '-20 <= w <= 20.'],
    [['3 3\n0 1 4\n1 2 1\n0 2 2\n','3','The two edges of weights 1 and 2 connect all vertices.'],['4 2\n0 1 -2\n2 3 5\n','3','Each separate component needs its only edge.'],['1 0\n','0'],['3 0\n','0'],['2 1\n0 1 0\n','0'],['3 3\n0 1 -4\n1 2 -3\n0 2 -1\n','-7'],['4 3\n0 1 2\n1 2 2\n2 3 2\n','6'],['4 4\n0 1 9\n0 2 1\n1 2 1\n2 3 1\n','3']],
    ['A forest connects each original component without cycles.','Process edges in increasing weight order.','Track which vertices are already connected.','Add an edge only when its endpoints belong to different groups.','Sum all chosen weights, including negative ones.'],
    `n, m = map(int, input().split())
edges = [tuple(map(int, input().split())) for _ in range(m)]
parent = list(range(n))
def root(u):
    while parent[u] != u:
        u = parent[u]
    return u
total = 0
for u, v, w in sorted(edges, key=lambda e: e[2]):
    a, b = root(u), root(v)
    if a != b:
        parent[a] = b
        total += w
print(total)
`, 'Kruskal selects the cheapest edge joining distinct components at each step.', graphStarter
  ),
  'level-93-problem-5': challenge(
    'Minimum Bottleneck Paths', 'For each vertex, minimize the largest edge weight on any directed path from s. The empty path to s has bottleneck zero.',
    weighted + ' After the edges, one line contains source vertex s.', 'Print n bottlenecks in vertex order, using INF if unreachable.', ['1 <= n <= 8 and 0 <= m <= n*n.', 'Edges are distinct ordered pairs; self-loops are allowed.', '0 <= w <= 20.'],
    [['3 3\n0 1 7\n0 2 4\n2 1 4\n0\n','0 4 4','Going through 2 lowers the largest edge on the route to 1 from 7 to 4.'],['3 2\n0 1 2\n1 2 8\n0\n','0 2 8','The bottleneck to 2 is the larger edge, 8, not their sum.'],['1 0\n0\n','0'],['2 0\n0\n','0 INF'],['2 1\n0 1 0\n0\n','0 0'],['3 3\n0 1 9\n0 2 6\n2 1 3\n0\n','0 6 6'],['3 1\n1 2 5\n1\n','INF 0 5'],['2 2\n0 1 4\n1 0 3\n0\n','0 4']],
    ['The cost of extending a path is the maximum of its old cost and the new edge weight.','Initialize the source to zero and the rest to infinity.','Choose the smallest tentative bottleneck next.','Relax outgoing edges using max instead of addition.','Use INF for vertices that cannot be reached.'],
    `import heapq
n, m = map(int, input().split())
adj = [[] for _ in range(n)]
for _ in range(m):
    u, v, w = map(int, input().split())
    adj[u].append((v, w))
s = int(input())
inf = float('inf')
d = [inf] * n
d[s] = 0
heap = [(0, s)]
while heap:
    value, u = heapq.heappop(heap)
    if value != d[u]:
        continue
    for v, w in adj[u]:
        candidate = max(value, w)
        if candidate < d[v]:
            d[v] = candidate
            heapq.heappush(heap, (candidate, v))
print(*(x if x != inf else 'INF' for x in d))
`, 'A path extension cannot decrease its bottleneck, enabling a minimum-first traversal.', sourceStarter
  ),
  'level-94-problem-1': challenge(
    'Largest Island After One Flip', 'Find the largest orthogonally connected group of 1 cells after changing at most one 0 to 1.',
    grid, 'Print the maximum area in cells.', binary,
    [['2 2\n1 0\n0 1\n','3','Flipping either zero joins both diagonal land cells.'],['2 3\n1 1 1\n1 1 1\n','6','The entire grid is already one island; no flip is needed.'],['1 1\n0\n','1'],['1 1\n1\n','1'],['2 2\n0 0\n0 0\n','1'],['1 3\n1 0 1\n','3'],['2 3\n1 1 1\n1 0 1\n','6'],['2 3\n1 0 0\n0 0 1\n','2']],
    ['First label each existing island.','Record the size of every label.','For each water cell inspect its four neighbors.','Add the sizes of distinct neighboring island labels plus one.','Also consider the largest original island if no flip is needed.'],
    `h, w = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(h)]
labels = [[-1] * w for _ in range(h)]
sizes = []
directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]
for r in range(h):
    for c in range(w):
        if a[r][c] and labels[r][c] == -1:
            label = len(sizes)
            labels[r][c] = label
            stack = [(r, c)]
            size = 0
            while stack:
                x, y = stack.pop()
                size += 1
                for dx, dy in directions:
                    nx, ny = x + dx, y + dy
                    if 0 <= nx < h and 0 <= ny < w and a[nx][ny] and labels[nx][ny] == -1:
                        labels[nx][ny] = label
                        stack.append((nx, ny))
            sizes.append(size)
best = max(sizes, default=0)
for r in range(h):
    for c in range(w):
        if not a[r][c]:
            neighbors = {labels[r+dr][c+dc] for dr, dc in directions
                         if 0 <= r+dr < h and 0 <= c+dc < w and labels[r+dr][c+dc] != -1}
            best = max(best, 1 + sum(sizes[i] for i in neighbors))
print(best)
`, 'Each possible flip joins exactly the distinct adjacent islands.', gridStarter
  ),
  'level-94-problem-2': challenge(
    'Flood Fill a Region', 'Recolor the entire orthogonally connected component having the starting cell’s original color.',
    grid + ' Then one line r c color gives a zero-based starting cell and replacement color.', 'Print the resulting grid as h lines of w space-separated integers.', ['1 <= h, w <= 5.', 'All colors are integers from 0 to 9.', 'The start is inside the grid.'],
    [['2 3\n1 1 0\n1 0 1\n0 0 2\n','2 2 0\n2 0 1','Only the three connected 1 cells at the top left change.'],['1 3\n2 2 3\n0 1 2\n','2 2 3','Replacing a color with itself leaves the grid unchanged.'],['1 1\n0\n0 0 9\n','9'],['2 2\n1 2\n2 1\n0 0 3\n','3 2\n2 1'],['1 4\n1 1 1 1\n0 3 0\n','0 0 0 0'],['2 2\n0 0\n0 0\n1 1 1\n','1 1\n1 1'],['2 3\n1 2 1\n1 2 1\n0 2 3\n','1 2 3\n1 2 3'],['3 1\n1\n2\n1\n1 0 5\n','1\n5\n1']],
    ['Record the original color before modifying the grid.','Start a traversal at the given cell.','Only move to in-bounds neighbors of the original color.','Track visited cells even when the replacement equals the original.','Print every row after recoloring.'],
    `h, w = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(h)]
r, c, color = map(int, input().split())
old = a[r][c]
seen = {(r, c)}
stack = [(r, c)]
while stack:
    x, y = stack.pop()
    a[x][y] = color
    for dx, dy in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        nx, ny = x + dx, y + dy
        if 0 <= nx < h and 0 <= ny < w and (nx, ny) not in seen and a[nx][ny] == old:
            seen.add((nx, ny))
            stack.append((nx, ny))
for row in a:
    print(*row)
`, 'The visited set identifies exactly the original-color component, even when colors match.', gridQueryStarter
  ),
  'level-94-problem-3': challenge(
    'Maze With One Wall Break', 'Find the minimum number of orthogonal moves from the start to the destination, entering a wall at most once in total. 0 is open and 1 is a wall.',
    grid + ' Then one line sr sc tr tc gives zero-based start and destination.', 'Print the minimum number of moves, or -1 if impossible.', [...binary, 'The start and destination are open cells.'],
    [['2 3\n0 1 0\n0 1 0\n0 0 0 2\n','2','Breaking the middle wall permits two moves straight across.'],['1 4\n0 1 1 0\n0 0 0 3\n','-1','Both walls would need to be entered.'],['1 1\n0\n0 0 0 0\n','0'],['1 2\n0 0\n0 0 0 1\n','1'],['2 2\n0 1\n1 0\n0 0 1 1\n','2'],['2 3\n0 1 0\n0 0 0\n0 0 0 2\n','2'],['3 3\n0 1 1\n1 1 1\n1 1 0\n0 0 2 2\n','-1'],['2 3\n0 0 0\n1 1 0\n0 0 1 2\n','3']],
    ['A search state must include position and whether a wall has been entered.','Start at distance zero with the break unused.','A wall neighbor is legal only if the break is unused.','Use BFS and mark each position-plus-break state separately.','The first destination state reached has minimum moves.'],
    `from collections import deque
h, w = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(h)]
sr, sc, tr, tc = map(int, input().split())
q = deque([(sr, sc, 0, 0)])
seen = {(sr, sc, 0)}
answer = -1
while q:
    r, c, used, distance = q.popleft()
    if (r, c) == (tr, tc):
        answer = distance
        break
    for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        x, y = r + dr, c + dc
        if 0 <= x < h and 0 <= y < w:
            new = used + a[x][y]
            if new <= 1 and (x, y, new) not in seen:
                seen.add((x, y, new))
                q.append((x, y, new, distance + 1))
print(answer)
`, 'BFS over cell and break state finds the shortest legal route.', gridQueryStarter
  ),
  'level-94-problem-4': challenge(
    'Count Enclosed Water Cells', 'Count water cells that cannot reach any boundary cell by moving orthogonally through water. A 0 is water and 1 is land; a boundary water cell can reach itself.',
    grid, 'Print the number of enclosed water cells. Print 0 when there are none.', binary,
    [['5 5\n1 1 1 1 1\n1 0 0 1 1\n1 1 1 1 1\n1 1 0 0 1\n1 1 1 1 1\n','4','Both separate two-cell water regions are surrounded by land.'],['4 4\n1 0 1 1\n1 0 0 1\n1 1 0 1\n1 1 1 1\n','0','Every water cell connects through water to the top boundary.'],['1 1\n0\n','0'],['1 1\n1\n','0'],['3 3\n0 0 0\n0 0 0\n0 0 0\n','0'],['3 3\n0 1 1\n1 0 1\n1 1 1\n','1'],['1 5\n1 0 1 0 1\n','0'],['5 5\n1 1 0 1 1\n1 0 0 1 1\n1 1 1 1 1\n1 0 0 0 1\n1 1 1 1 1\n','3']],
    ['A water cell is not enclosed if it can reach the outer boundary through water.','Start a traversal from all boundary water cells.','Move only to in-bounds orthogonally adjacent water cells.','Mark every cell reachable from those boundary starts.','Count water cells that were never marked.'],
    `from collections import deque
h, w = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(h)]
seen = set()
q = deque()
for r in range(h):
    for c in range(w):
        if (r == 0 or r == h - 1 or c == 0 or c == w - 1) and a[r][c] == 0:
            seen.add((r, c))
            q.append((r, c))
while q:
    r, c = q.popleft()
    for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
        x, y = r + dr, c + dc
        if 0 <= x < h and 0 <= y < w and a[x][y] == 0 and (x, y) not in seen:
            seen.add((x, y))
            q.append((x, y))
print(sum(a[r][c] == 0 and (r, c) not in seen for r in range(h) for c in range(w)))
`, 'Boundary-started traversal marks every water cell that can escape; the remaining water cells are enclosed.', gridStarter
  ),
  'level-94-problem-5': challenge(
    'Total Island Perimeter', 'Sum the exposed edges of every land cell, including boundaries around enclosed water. A 1 is land and 0 is water.',
    grid, 'Print the total number of exposed unit edges; no land gives 0.', binary,
    [['2 2\n1 1\n1 0\n','8','Three cells have twelve edges, less four shared edges.'],['2 2\n1 0\n0 1\n','8','The diagonal cells share no edge and each contributes four.'],['1 1\n0\n','0'],['1 1\n1\n','4'],['1 3\n1 1 1\n','8'],['2 2\n1 1\n1 1\n','8'],['3 3\n1 1 1\n1 0 1\n1 1 1\n','16'],['1 4\n1 0 1 0\n','8']],
    ['Each land cell has four potential boundary edges.','Inspect its four orthogonal neighbors.','An out-of-bounds neighbor exposes an edge.','A water neighbor also exposes an edge.','Sum exposed edges over all land cells.'],
    `h, w = map(int, input().split())
a = [list(map(int, input().split())) for _ in range(h)]
total = 0
for r in range(h):
    for c in range(w):
        if a[r][c]:
            for dr, dc in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
                x, y = r + dr, c + dc
                if not (0 <= x < h and 0 <= y < w) or a[x][y] == 0:
                    total += 1
print(total)
`, 'Count each land edge adjacent to water or the outside.', gridStarter
  ),
  'level-95-problem-1': challenge(
    'Enumerate Subsets', 'Enumerate every subset of the given distinct integers, including the empty subset.',
    'One line of distinct space-separated integers, empty when there are none.', 'Print the number of subsets, then one subset per line as ascending values separated by spaces. Print - for the empty subset. Sort subsets lexicographically as integer sequences, with a shorter prefix first.',
    ['There are 0 to 4 distinct integers, each from -20 to 20.'],
    [['8 3\n','4\n-\n3\n3 8\n8','The two values produce four subsets, including the empty one.'],['5\n','2\n-\n5','There are two choices: omit or include 5.'],['\n','1\n-'],['1 2 3\n','8\n-\n1\n1 2\n1 2 3\n1 3\n2\n2 3\n3'],['-2 0\n','4\n-\n-2\n-2 0\n0'],['4 3 2 1\n','16\n-\n1\n1 2\n1 2 3\n1 2 3 4\n1 2 4\n1 3\n1 3 4\n1 4\n2\n2 3\n2 3 4\n2 4\n3\n3 4\n4'],['0\n','2\n-\n0'],['10 -10 0\n','8\n-\n-10\n-10 0\n-10 0 10\n-10 10\n0\n0 10\n10']],
    ['Each value can be included or omitted.','Sort the input before building subsets.','Record a copy whenever a choice sequence is complete.','Sort the resulting value sequences lexicographically.','Represent the empty sequence with a single hyphen.'],
    `values = sorted(map(int, input().split()))
answers = []
def generate(i, chosen):
    if i == len(values):
        answers.append(chosen[:])
        return
    generate(i + 1, chosen)
    chosen.append(values[i])
    generate(i + 1, chosen)
    chosen.pop()
generate(0, [])
answers.sort()
print(len(answers))
for answer in answers:
    print(' '.join(map(str, answer)) if answer else '-')
`, 'Each include-or-exclude sequence yields exactly one subset of the sorted values.', listStarter
  ),
  'level-95-problem-2': challenge(
    'Enumerate Permutations', 'Enumerate every ordering of the given distinct integers.',
    'One line of distinct space-separated integers, empty when there are none.', 'Print the number of permutations, then each permutation on its own line, values separated by spaces. Sort permutations lexicographically as integer sequences. Print - for the empty permutation.',
    ['There are 0 to 4 distinct integers, each from -20 to 20.'],
    [['2 1\n','2\n1 2\n2 1','The two possible orders are sorted numerically.'],['7\n','1\n7','A single element has only one ordering.'],['\n','1\n-'],['0 -1\n','2\n-1 0\n0 -1'],['3 1 2\n','6\n1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1'],['-4\n','1\n-4'],['10 2\n','2\n2 10\n10 2'],['2 0 -2\n','6\n-2 0 2\n-2 2 0\n0 -2 2\n0 2 -2\n2 -2 0\n2 0 -2']],
    ['A permutation uses every value exactly once.','Choose an unused value for the next position.','Recurse after marking it used.','Undo the choice before trying another value.','Sort complete sequences and represent the empty one as -.'],
    `values = list(map(int, input().split()))
answers = []
def generate(path, used):
    if len(path) == len(values):
        answers.append(path[:])
        return
    for i, value in enumerate(values):
        if i not in used:
            used.add(i)
            path.append(value)
            generate(path, used)
            path.pop()
            used.remove(i)
generate([], set())
answers.sort()
print(len(answers))
for answer in answers:
    print(' '.join(map(str, answer)) if answer else '-')
`, 'Backtracking tries each unused value at each position exactly once.', listStarter
  ),
  'level-95-problem-3': challenge(
    'Complete Balanced Parentheses', 'Enumerate all balanced strings containing exactly n pairs of parentheses and starting with the supplied prefix.',
    'First line: integer n. Second line: a prefix containing only parentheses, possibly empty.', 'Print the count, then the strings in lexicographic order, one per line. Use - for the empty string.', ['0 <= n <= 4.', 'The prefix has at most n openings and n closings, and no prefix has more closings than openings.'],
    [['2\n\n','2\n(())\n()()','With an empty prefix, two pairs can be nested or adjacent.'],['3\n(()\n','2\n(()())\n(())()','Exactly two three-pair strings start with (().'],['0\n\n','1\n-'],['1\n()\n','1\n()'],['4\n((()\n','3\n((()()))\n((())())\n((()))()'],['2\n()\n','1\n()()'],['3\n((\n','3\n((()))\n(()())\n(())()'],['3\n()(\n','2\n()(())\n()()()']],
    ['Count opening and closing parentheses already in the prefix.','An opener is allowed until n have been used.','A closer is allowed only if fewer closers than openers have been used.','A string is complete after n closers.','Try ( before ) for lexicographic order.'],
    `n = int(input())
prefix = input()
answers = []
def generate(text, opens, closes):
    if closes == n:
        answers.append(text)
        return
    if opens < n:
        generate(text + '(', opens + 1, closes)
    if closes < opens:
        generate(text + ')', opens, closes + 1)
generate(prefix, prefix.count('('), prefix.count(')'))
print(len(answers))
for answer in answers:
    print(answer or '-')
`, 'Starting from the supplied prefix, the balance rule explores every valid completion.', parenthesesStarter
  ),
  'level-95-problem-4': challenge(
    'Enumerate Palindrome Partitions', 'Enumerate all partitions of the input string into nonempty contiguous palindromic pieces.',
    'One line of lowercase ASCII letters, possibly empty.', 'Print the count, then one partition per line with pieces separated by spaces; print - for the empty partition. Sort partitions lexicographically as sequences of strings, with shorter prefixes first.',
    ['The string has at most 5 letters.'],
    [['aab\n','2\na a b\naa b','The first two a characters may be separate or form aa.'],['aba\n','2\na b a\naba','The whole string and the three single letters are palindromic partitions.'],['\n','1\n-'],['a\n','1\na'],['abc\n','1\na b c'],['aa\n','2\na a\naa'],['abba\n','3\na b b a\na bb a\nabba'],['aaa\n','4\na a a\na aa\naa a\naaa']],
    ['Choose a nonempty prefix of the remaining suffix.','A piece is valid when it equals its reverse.','Recurse on the suffix after each valid piece.','The exhausted string contributes one completed partition.','Sort partitions as sequences and use - for the empty one.'],
    `text = input()
answers = []
def generate(i, path):
    if i == len(text):
        answers.append(path[:])
        return
    for end in range(i + 1, len(text) + 1):
        piece = text[i:end]
        if piece == piece[::-1]:
            path.append(piece)
            generate(end, path)
            path.pop()
generate(0, [])
answers.sort()
print(len(answers))
for answer in answers:
    print(' '.join(answer) if answer else '-')
`, 'Each recursive choice takes one palindromic prefix and partitions the rest.', textStarter
  ),
  'level-95-problem-5': challenge(
    'Enumerate Target-Sum Index Subsets', 'Enumerate every subset of indices whose distinct positive input values add to target.',
    'First line: distinct space-separated positive integers, possibly empty. Second line: target.', 'Print the count, then each solution as ascending zero-based indices separated by spaces. Print - for the empty subset. Sort solutions lexicographically as integer sequences, shorter prefixes first; print only 0 if no solution.',
    ['There are 0 to 5 distinct values, each from 1 to 20.', '0 <= target <= 50.'],
    [['2 3 5\n5\n','2\n0 1\n2','Indices 0 and 1 sum to 5, as does index 2 alone.'],['4 1 3\n4\n','2\n0\n1 2','The value 4 and the pair 1 plus 3 both work.'],['\n0\n','1\n-'],['\n2\n','0'],['1 2 3\n0\n','1\n-'],['1 2 4\n8\n','0'],['1 2 3\n6\n','1\n0 1 2'],['5 2 3 1\n6\n','2\n0 3\n1 2 3']],
    ['Decide whether to include each index.','Keep the current sum and selected indices.','At the end, record selections equal to target.','Positive values allow pruning when the sum exceeds target.','Sort the solutions and use - for the empty selection.'],
    `values = list(map(int, input().split()))
target = int(input())
answers = []
def generate(i, total, path):
    if total > target:
        return
    if i == len(values):
        if total == target:
            answers.append(path[:])
        return
    generate(i + 1, total, path)
    path.append(i)
    generate(i + 1, total + values[i], path)
    path.pop()
generate(0, 0, [])
answers.sort()
print(len(answers))
for answer in answers:
    print(' '.join(map(str, answer)) if answer else '-')
`, 'Include-or-exclude recursion enumerates every index subset; positive values permit sum pruning.', targetStarter
  )
};
