// Run with: node seedModules.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { Module } from "../models/Module.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const modules = [
  {
    slug: "arrays",
    title: "Arrays",
    order: 1,
    summary: "Contiguous memory blocks for storing elements — the foundation of most data structures.",
    content: `An array is a collection of elements stored in contiguous memory locations, all of the same type, accessed using an index.

Key points:
- Indexing starts at 0 in most languages.
- Access by index is O(1).
- Insertion/deletion in the middle is O(n) because elements need to shift.
- Arrays have a fixed size in many languages (use dynamic arrays / lists for resizing).

Common patterns:
- Two pointers (e.g. reversing an array, pair sum problems)
- Sliding window (subarray problems)
- Prefix sums (range sum queries)
- Sorting + binary search

Practice ideas: reverse an array, find the maximum subarray sum (Kadane's algorithm), rotate an array, find duplicates.`,
    resources: [
      { title: "Arrays in One Shot", channel: "Apna College", url: "https://www.youtube.com/watch?v=fE0a-X1l1Y4" },
      { title: "Arrays Strivers A2Z DSA Course", channel: "Striver", url: "https://www.youtube.com/watch?v=tkwnms5iTX0" },
      { title: "Array Data Structure", channel: "CodeWithHarry", url: "https://www.youtube.com/watch?v=mlk0nSL3RY8" },
    ],
  },
  {
    slug: "strings",
    title: "Strings",
    order: 2,
    summary: "Sequences of characters with their own set of common interview patterns.",
    content: `A string is a sequence of characters. In most languages strings are immutable, meaning every modification creates a new string.

Key points:
- Length, indexing, slicing/substring operations.
- String comparison and concatenation costs.
- Common built-in methods: split, join, replace, trim.

Common patterns:
- Two pointers (palindrome check, reversing)
- Sliding window (longest substring without repeating characters)
- Hashing / frequency counting (anagrams)
- Pattern matching (KMP, Rabin-Karp) for advanced problems

Practice ideas: check if a string is a palindrome, find the first non-repeating character, check if two strings are anagrams, longest common prefix.`,
    resources: [
      { title: "Strings in One Shot", channel: "Apna College", url: "https://www.youtube.com/watch?v=PWIuMu4HZ7o" },
      { title: "Strings Strivers A2Z DSA Course", channel: "Striver", url: "https://www.youtube.com/watch?v=4VV89WERR2k" },
      { title: "String Programs", channel: "CodeWithHarry", url: "https://www.youtube.com/watch?v=4cgpu9L2AE8" },
    ],
  },
  {
    slug: "linked-list",
    title: "Linked List",
    order: 3,
    summary: "A chain of nodes where each node points to the next — great for dynamic-size data.",
    content: `A linked list is a linear data structure where each element (node) contains data and a pointer/reference to the next node.

Types:
- Singly Linked List — each node points to the next.
- Doubly Linked List — each node points to both next and previous.
- Circular Linked List — the last node points back to the head.

Key points:
- Insertion/deletion at the head is O(1), unlike arrays.
- No random access — traversal is O(n) to reach a given index.
- Useful for implementing stacks, queues, and adjacency lists.

Common patterns:
- Fast and slow pointers (detect cycles, find the middle)
- Reversing a linked list (iterative and recursive)
- Merging two sorted linked lists

Practice ideas: reverse a linked list, detect a cycle (Floyd's algorithm), find the middle node, merge two sorted lists, remove duplicates.`,
    resources: [
      { title: "Linked List in One Shot", channel: "Apna College", url: "https://www.youtube.com/watch?v=Nq7ok-OyEpg" },
      { title: "Linked List Strivers A2Z DSA Course", channel: "Striver", url: "https://www.youtube.com/watch?v=zp4BMR88260" },
      { title: "Linked List Data Structure", channel: "CodeWithHarry", url: "https://www.youtube.com/watch?v=ECTwORF8Z2E" },
    ],
  },
  {
    slug: "stacks-queues",
    title: "Stacks & Queues",
    order: 4,
    summary: "LIFO and FIFO structures used everywhere from parsing to BFS.",
    content: `A stack is a Last-In-First-Out (LIFO) structure — the last element added is the first removed. Operations: push, pop, peek/top.

A queue is a First-In-First-Out (FIFO) structure — the first element added is the first removed. Operations: enqueue, dequeue, front.

Key points:
- Stacks are used for function call management, undo operations, expression evaluation, and DFS.
- Queues are used for task scheduling and BFS.
- A deque (double-ended queue) allows insertion/removal from both ends.

Common patterns:
- Matching brackets / valid parentheses using a stack
- Monotonic stack (next greater element)
- Sliding window maximum using a deque
- Implementing a queue using two stacks (and vice versa)

Practice ideas: valid parentheses, implement a min stack, next greater element, evaluate reverse Polish notation.`,
    resources: [
      { title: "Stacks and Queues in One Shot", channel: "Apna College", url: "https://www.youtube.com/watch?v=GUDLRan2DWA" },
      { title: "Stack and Queue Strivers A2Z DSA Course", channel: "Striver", url: "https://www.youtube.com/watch?v=GYptUgnIM_I" },
      { title: "Stack Data Structure", channel: "CodeWithHarry", url: "https://www.youtube.com/watch?v=N0y2chu6kHs" },
    ],
  },
  {
    slug: "trees",
    title: "Trees",
    order: 5,
    summary: "Hierarchical structures — the basis for BSTs, heaps, tries, and more.",
    content: `A tree is a hierarchical data structure made of nodes, where each node has a value and references to child nodes. The topmost node is called the root.

Key terms:
- Leaf node — a node with no children.
- Binary tree — each node has at most two children (left and right).
- Binary Search Tree (BST) — left subtree values are smaller, right subtree values are larger than the root.

Traversals:
- Inorder (left, root, right)
- Preorder (root, left, right)
- Postorder (left, right, root)
- Level order (breadth-first, using a queue)

Common patterns:
- Recursion for traversals and height/depth calculations
- BFS/DFS for level order and path problems
- BST operations: search, insert, delete in O(log n) average

Practice ideas: traverse a binary tree (all three DFS orders), find the height of a tree, check if a tree is balanced, validate a BST, lowest common ancestor.`,
    resources: [
      { title: "Trees in One Shot", channel: "Apna College", url: "https://www.youtube.com/watch?v=YlgPi75hIBc" },
      { title: "Binary Trees Strivers A2Z DSA Course", channel: "Striver", url: "https://www.youtube.com/watch?v=_ANrF3FJm70" },
      { title: "Tree Data Structure", channel: "CodeWithHarry", url: "https://www.youtube.com/watch?v=BHF6h_Sd0lY" },
    ],
  },
  {
    slug: "graphs",
    title: "Graphs",
    order: 6,
    summary: "Networks of nodes and edges — model relationships, routes, and dependencies.",
    content: `A graph is a set of nodes (vertices) connected by edges. Graphs can be directed or undirected, and weighted or unweighted.

Representations:
- Adjacency matrix — a 2D array, good for dense graphs.
- Adjacency list — a list of neighbors per node, good for sparse graphs.

Traversals:
- BFS (Breadth-First Search) — explores level by level using a queue, good for shortest paths in unweighted graphs.
- DFS (Depth-First Search) — explores as deep as possible using recursion or a stack, good for connectivity and cycle detection.

Common algorithms:
- Dijkstra's algorithm — shortest path in weighted graphs with non-negative edges.
- Topological sort — ordering of nodes in a Directed Acyclic Graph (DAG).
- Union-Find (Disjoint Set) — for connectivity and cycle detection.

Practice ideas: number of connected components, detect a cycle, shortest path in an unweighted graph (BFS), course schedule (topological sort).`,
    resources: [
      { title: "Graphs in One Shot", channel: "Apna College", url: "https://www.youtube.com/watch?v=eVKQfdSNo7A" },
      { title: "Graphs Strivers A2Z DSA Course", channel: "Striver", url: "https://www.youtube.com/watch?v=YDyqitW8C0k" },
      { title: "Graph Data Structure", channel: "CodeWithHarry", url: "https://www.youtube.com/watch?v=YfYu0kBkVlA" },
    ],
  },
  {
    slug: "sorting",
    title: "Sorting Algorithms",
    order: 7,
    summary: "Foundational algorithms for arranging data — building blocks for many other techniques.",
    content: `Sorting algorithms arrange elements in a particular order (ascending or descending).

Common algorithms:
- Bubble Sort — O(n^2), repeatedly swaps adjacent elements that are out of order.
- Selection Sort — O(n^2), repeatedly selects the minimum element and places it in position.
- Insertion Sort — O(n^2), builds the sorted array one element at a time, efficient for small/nearly-sorted data.
- Merge Sort — O(n log n), divide and conquer, stable, good for linked lists.
- Quick Sort — O(n log n) average, divide and conquer using a pivot, often fastest in practice.

Key points:
- Stability matters when sorting objects with multiple keys.
- In-place sorting avoids extra memory (e.g. quick sort, insertion sort).
- Most languages provide built-in sort functions (Timsort/Introsort) that are efficient for general use.

Practice ideas: implement merge sort and quick sort from scratch, sort an array of 0s, 1s, and 2s (Dutch National Flag), find the kth largest element.`,
    resources: [
      { title: "Sorting Algorithms in One Shot", channel: "Apna College", url: "https://www.youtube.com/watch?v=l9F-uHTV9-Y" },
      { title: "Sorting Strivers A2Z DSA Course", channel: "Striver", url: "https://www.youtube.com/watch?v=HGk_ypEuS24" },
      { title: "Sorting Algorithms", channel: "CodeWithHarry", url: "https://www.youtube.com/watch?v=hQK45-wG2vk" },
    ],
  },
  {
    slug: "dynamic-programming",
    title: "Dynamic Programming",
    order: 8,
    summary: "Breaking problems into overlapping subproblems and reusing solutions.",
    content: `Dynamic Programming (DP) is a technique for solving problems by breaking them into smaller overlapping subproblems, solving each once, and storing results to avoid recomputation.

Key points:
- Memoization — top-down approach, store results of recursive calls (usually in a hash map or array).
- Tabulation — bottom-up approach, fill a table iteratively starting from base cases.
- A problem is a good DP candidate if it has "optimal substructure" and "overlapping subproblems".

Common patterns:
- 1D DP — e.g. Fibonacci, climbing stairs, house robber.
- 2D DP — e.g. grid paths, longest common subsequence, edit distance.
- Knapsack-style DP — picking items under a constraint to maximize/minimize a value.

Practice ideas: climbing stairs, house robber, longest common subsequence, 0/1 knapsack, coin change.`,
    resources: [
      { title: "Dynamic Programming in One Shot", channel: "Apna College", url: "https://www.youtube.com/watch?v=nqowUJzG-iM" },
      { title: "Dynamic Programming Strivers A2Z DSA Course", channel: "Striver", url: "https://www.youtube.com/watch?v=FfXoiwwnxFw" },
      { title: "Dynamic Programming Playlist", channel: "CodeWithHarry", url: "https://www.youtube.com/watch?v=KH5wxKHRcSU" },
    ],
  },
];

const run = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected");

  for (const m of modules) {
    await Module.findOneAndUpdate(
      { slug: m.slug },
      m,
      { upsert: true, new: true, runValidators: true }
    );
    console.log(`Upserted module: ${m.slug}`);
  }

  console.log("🌱 Seeding complete");
  await mongoose.disconnect();
  process.exit(0);
};

run().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});