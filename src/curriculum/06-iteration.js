/* Module 6 — Pythonic Iteration ---------------------------------------- */

const LIST_COMP = "\\[(?:[^\\[\\]]|\\[[^\\[\\]]*\\])*\\bfor\\b";
const LIST_COMP_TWO_FOR =
  "\\[(?:[^\\[\\]]|\\[[^\\[\\]]*\\])*\\bfor\\b(?:[^\\[\\]]|\\[[^\\[\\]]*\\])*\\bfor\\b";
const BRACE_COMP = "\\{(?:[^{}]|\\{[^{}]*\\})*\\bfor\\b";

export default {
  id: "iteration",
  number: 6,
  title: "Pythonic Iteration",
  level: "Intermediate",
  summary:
    "Comprehensions, enumerate and zip, sorting with keys, generators, itertools and unpacking — the idioms that make Python code read like Python.",
  packages: [],
  lessons: [
    /* ------------------------------------------------------------------ */
    {
      id: "m6-listcomp",
      title: "List comprehensions",
      goal: "Build a new list from an existing iterable in one readable line, with a filter or a choice, and know when a plain loop is the better tool.",
      keywords: ["list comprehension", "comprehension", "filter", "if else", "nested for", "map"],
      exercises: [
        {
          id: "m6-listcomp-e1",
          prompt:
            "`prices = [12.5, 3.0, 7.7, 20.0, 4.5, 6.6]`. Using **one list comprehension**, build a list of the prices that are **over 5**, each with a 10% discount applied (multiply by `0.9`) and rounded to 2 decimal places with `round(value, 2)`. Then print the list — the output should be `[11.25, 6.93, 18.0, 5.94]`.",
          starter: "prices = [12.5, 3.0, 7.7, 20.0, 4.5, 6.6]\n# build the discounted list with one comprehension, then print it\n",
          solution: `prices = [12.5, 3.0, 7.7, 20.0, 4.5, 6.6]
discounted = [round(p * 0.9, 2) for p in prices if p > 5]
print(discounted)
`,
          hints: [
            "The shape is `[expression for p in prices if condition]` — the `if` at the end keeps only some prices.",
            "The expression is `round(p * 0.9, 2)`; the condition is `p > 5`.",
            "`[round(p * 0.9, 2) for p in prices if p > 5]`, then print it.",
          ],
          expectOutput: true,
          requires: [{ re: LIST_COMP, msg: "Use a list comprehension for this one." }],
          wrong: [
            "prices = [12.5, 3.0, 7.7, 20.0, 4.5, 6.6]\nprint([round(p * 0.9, 2) for p in prices])",
            "prices = [12.5, 3.0, 7.7, 20.0, 4.5, 6.6]\nprint([p * 0.9 for p in prices if p > 5])",
            "prices = [12.5, 3.0, 7.7, 20.0, 4.5, 6.6]\ndiscounted = []\nfor p in prices:\n    if p > 5:\n        discounted.append(round(p * 0.9, 2))\nprint(discounted)",
          ],
        },
        {
          id: "m6-listcomp-e2",
          prompt:
            "Define `seat_labels(rows, seats_per_row)`. `rows` is a string of row letters and `seats_per_row` is a number. Return a list with every row letter combined with every seat number from 1 to `seats_per_row`, **row by row**: `seat_labels(\"AB\", 3)` returns `[\"A1\", \"A2\", \"A3\", \"B1\", \"B2\", \"B3\"]`. Use a single comprehension with two `for` clauses.",
          starter: "def seat_labels(rows, seats_per_row):\n    pass\n",
          solution: `def seat_labels(rows, seats_per_row):
    return [f"{row}{n}" for row in rows for n in range(1, seats_per_row + 1)]
`,
          hints: [
            "Two `for` clauses in one comprehension run like nested loops: the first one is the outer loop.",
            "Looping over a string gives you one character at a time, so `for row in rows` visits each row letter. Seat numbers come from `range(1, seats_per_row + 1)`.",
            "`[f\"{row}{n}\" for row in rows for n in range(1, seats_per_row + 1)]`",
          ],
          tests: `assert 'seat_labels' in dir(), "Define a function called seat_labels"
assert seat_labels("AB", 3) == ["A1", "A2", "A3", "B1", "B2", "B3"], f'seat_labels("AB", 3) should return ["A1", "A2", "A3", "B1", "B2", "B3"], got {seat_labels("AB", 3)}'
assert seat_labels("C", 2) == ["C1", "C2"], 'seat_labels("C", 2) should return ["C1", "C2"] — seat numbers start at 1'
assert seat_labels("XYZ", 1) == ["X1", "Y1", "Z1"], 'seat_labels("XYZ", 1) should return ["X1", "Y1", "Z1"]'
assert seat_labels("A", 0) == [], 'seat_labels("A", 0) should return an empty list'
`,
          requires: [
            { re: LIST_COMP_TWO_FOR, msg: "Use one list comprehension with two for clauses for this one." },
          ],
          wrong: [
            "def seat_labels(rows, seats_per_row):\n    return [f\"{row}{n}\" for n in range(1, seats_per_row + 1) for row in rows]",
            "def seat_labels(rows, seats_per_row):\n    return [f\"{row}{n}\" for row in rows for n in range(seats_per_row)]",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `[x * 2 for x in [1, 2, 3] if x != 2]` produce?",
          options: ["[2, 6]", "[2, 4, 6]", "[2, 0, 6]", "A syntax error"],
          answer: 0,
          explain:
            "An `if` after the `for` is a filter: 2 is skipped entirely, so only 1 and 3 are doubled. To keep every item but change some of them you would use `if … else` before the `for`.",
        },
        {
          q: "Which of these is a syntax error?",
          options: [
            "[s for s in scores if s > 50]",
            "[\"hi\" if s > 50 else \"lo\" for s in scores]",
            "[s for s in scores if s > 50 else 0]",
            "[a + b for a in \"xy\" for b in \"12\"]",
          ],
          answer: 2,
          explain:
            "A trailing `if` filters and cannot take an `else`. If you want a choice per item, the `if … else` belongs in the expression before the `for`.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m6-dict-set-comp",
      title: "Dict and set comprehensions",
      goal: "Build dictionaries and sets in one expression: lookup tables, inverted dicts and de-duplicated, transformed values.",
      keywords: ["dict comprehension", "set comprehension", "lookup table", "invert dict", "dedupe", "items"],
      exercises: [
        {
          id: "m6-dict-set-comp-e1",
          prompt:
            "Define `in_stock(stock)`. `stock` is a dict of product name → quantity. Return a **new dict** containing only the products whose quantity is greater than 0, with their quantities. `in_stock({\"apple\": 12, \"pear\": 0, \"plum\": 7})` returns `{\"apple\": 12, \"plum\": 7}`. The dict you were given must not change. Use a dict comprehension.",
          starter: "def in_stock(stock):\n    pass\n",
          solution: `def in_stock(stock):
    return {name: qty for name, qty in stock.items() if qty > 0}
`,
          hints: [
            "Loop over `stock.items()` so you get both the name and the quantity.",
            "A dict comprehension looks like `{key: value for key, value in pairs if condition}`.",
            "`{name: qty for name, qty in stock.items() if qty > 0}`",
          ],
          tests: `assert 'in_stock' in dir(), "Define a function called in_stock"
sample = {"apple": 12, "pear": 0, "plum": 7}
result = in_stock(sample)
assert isinstance(result, dict), f"in_stock should return a dict, got {type(result).__name__} — a set comprehension has no colon, a dict comprehension needs key: value"
assert result == {"apple": 12, "plum": 7}, f'in_stock({{"apple": 12, "pear": 0, "plum": 7}}) should return {{"apple": 12, "plum": 7}}, got {result}'
assert sample == {"apple": 12, "pear": 0, "plum": 7}, "in_stock must not change the dict it was given — build a new one"
assert in_stock({"kiwi": 0, "fig": 0}) == {}, 'in_stock({"kiwi": 0, "fig": 0}) should return {}'
assert in_stock({}) == {}, "in_stock({}) should return {}"
`,
          requires: [{ re: BRACE_COMP, msg: "Use a dict comprehension for this one." }],
          wrong: [
            "def in_stock(stock):\n    return {name for name, qty in stock.items() if qty > 0}",
            "def in_stock(stock):\n    return {name: qty for name, qty in stock.items() if qty >= 0}",
          ],
        },
        {
          id: "m6-dict-set-comp-e2",
          prompt:
            "Define `unique_domains(emails)`. It takes a list of email addresses and returns a **set** of the domains — the part after the `@` — in lower case, so that `Example.com` and `example.com` count as one. `unique_domains([\"ana@Example.com\", \"ben@example.com\", \"cleo@um.edu.my\"])` returns `{\"example.com\", \"um.edu.my\"}`. Use a set comprehension.",
          starter: "def unique_domains(emails):\n    pass\n",
          solution: `def unique_domains(emails):
    return {email.split("@")[1].lower() for email in emails}
`,
          hints: [
            "`email.split(\"@\")` gives a two-item list; index `[1]` is the domain.",
            "A set comprehension is `{expression for item in iterable}` — curly braces, no colon.",
            "`{email.split(\"@\")[1].lower() for email in emails}`",
          ],
          tests: `assert 'unique_domains' in dir(), "Define a function called unique_domains"
result = unique_domains(["ana@Example.com", "ben@example.com", "cleo@um.edu.my"])
assert isinstance(result, set), f"unique_domains should return a set, got {type(result).__name__}"
assert result == {"example.com", "um.edu.my"}, f'Expected {{"example.com", "um.edu.my"}}, got {result} — lower-case the domain so Example.com and example.com count as one'
assert unique_domains(["dev@UM.EDU.MY"]) == {"um.edu.my"}, 'unique_domains(["dev@UM.EDU.MY"]) should return {"um.edu.my"}'
assert unique_domains([]) == set(), "unique_domains([]) should return an empty set"
`,
          requires: [{ re: BRACE_COMP, msg: "Use a set comprehension for this one." }],
          wrong: [
            "def unique_domains(emails):\n    return [email.split(\"@\")[1].lower() for email in emails]",
            "def unique_domains(emails):\n    return {email.split(\"@\")[1] for email in emails}",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `{len(w) for w in [\"pear\", \"fig\", \"kiwi\"]}` produce?",
          options: ["{4, 3, 4}", "{3, 4}", "{\"pear\": 4, \"fig\": 3, \"kiwi\": 4}", "An error — braces need a colon"],
          answer: 1,
          explain:
            "Braces with a single expression (no colon) make a set comprehension. Sets hold each value once, so the two 4s collapse into one.",
        },
        {
          q: "What does `{v: k for k, v in {\"a\": 1, \"b\": 1}.items()}` produce?",
          options: ["{1: \"a\", 1: \"b\"}", "{1: \"b\"}", "{1: \"a\"}", "An error — duplicate key"],
          answer: 1,
          explain:
            "Both pairs produce the key 1. A dict can hold a key once, and the later assignment wins, so only \"b\" survives. Inverting a dict is only safe when its values are unique.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m6-enumerate-zip",
      title: "enumerate and zip",
      goal: "Loop with an index using enumerate, walk two sequences side by side with zip, and convert between pairs and parallel lists.",
      keywords: ["enumerate", "zip", "index", "start", "parallel lists", "unzip", "strict"],
      exercises: [
        {
          id: "m6-enumerate-zip-e1",
          prompt:
            "`tasks = [\"Buy milk\", \"Call Ana\", \"Submit thesis draft\"]`. Print the tasks as a numbered list **starting at 1**, one per line, in the format `1. Buy milk`. Use `enumerate`.",
          starter: "tasks = [\"Buy milk\", \"Call Ana\", \"Submit thesis draft\"]\n# 1. Buy milk\n# 2. Call Ana\n# ...\n",
          solution: `tasks = ["Buy milk", "Call Ana", "Submit thesis draft"]
for number, task in enumerate(tasks, start=1):
    print(f"{number}. {task}")
`,
          hints: [
            "`enumerate(tasks)` hands out `(index, task)` pairs — unpack them in the `for` line.",
            "Counting starts at 0 unless you say otherwise: `enumerate(tasks, start=1)`.",
            "`for number, task in enumerate(tasks, start=1): print(f\"{number}. {task}\")`",
          ],
          expectOutput: true,
          requires: [{ re: "\\benumerate\\b", msg: "Use enumerate for this one — no manual counter." }],
          wrong: [
            "tasks = [\"Buy milk\", \"Call Ana\", \"Submit thesis draft\"]\nfor number, task in enumerate(tasks):\n    print(f\"{number}. {task}\")",
            "tasks = [\"Buy milk\", \"Call Ana\", \"Submit thesis draft\"]\nfor number, task in enumerate(tasks, start=1):\n    print(number, task)",
          ],
        },
        {
          id: "m6-enumerate-zip-e2",
          prompt:
            "Define `total_cost(prices, quantities)`. The two lists line up item by item: `prices[0]` goes with `quantities[0]`, and so on. Return the total — each price times its quantity, all added up. `total_cost([2.5, 1.0], [4, 3])` returns `13.0`. Use `zip`.",
          starter: "def total_cost(prices, quantities):\n    pass\n",
          solution: `def total_cost(prices, quantities):
    return sum(price * qty for price, qty in zip(prices, quantities))
`,
          hints: [
            "`zip(prices, quantities)` pairs the two lists up: `(2.5, 4)`, then `(1.0, 3)`.",
            "Multiply inside the loop and add to a running total — or hand a generator expression to `sum()`.",
            "`sum(price * qty for price, qty in zip(prices, quantities))`",
          ],
          tests: `assert 'total_cost' in dir(), "Define a function called total_cost"
result = total_cost([2.5, 1.0], [4, 3])
assert isinstance(result, (int, float)), f"total_cost should return one number, got {type(result).__name__}"
assert abs(result - 13.0) < 1e-9, f"total_cost([2.5, 1.0], [4, 3]) should be 13.0, got {result}"
assert abs(total_cost([10.0, 0.5, 3.0], [1, 10, 2]) - 21.0) < 1e-9, "total_cost([10.0, 0.5, 3.0], [1, 10, 2]) should be 21.0"
assert total_cost([], []) == 0, "total_cost([], []) should be 0"
`,
          requires: [{ re: "\\bzip\\b", msg: "Use zip to walk the two lists together." }],
          wrong: [
            "def total_cost(prices, quantities):\n    return [price * qty for price, qty in zip(prices, quantities)]",
            "def total_cost(prices, quantities):\n    return sum(zip(prices, quantities))",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `list(zip([1, 2, 3], [\"a\", \"b\"]))` produce?",
          options: [
            "[(1, 'a'), (2, 'b')]",
            "[(1, 'a'), (2, 'b'), (3, None)]",
            "A ValueError — the lists have different lengths",
            "[(1, 'a'), (2, 'b'), (3,)]",
          ],
          answer: 0,
          explain:
            "zip stops as soon as the shortest input runs out, silently. Pass strict=True if a length mismatch should be an error instead.",
        },
        {
          q: "What is the first thing `enumerate([\"x\", \"y\"], start=1)` yields?",
          options: ["(1, 'x')", "(0, 'x')", "'x'", "(1, 'y')"],
          answer: 0,
          explain:
            "enumerate yields (count, item) pairs. The count starts at `start`, which defaults to 0 but is 1 here.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m6-sorting",
      title: "Sorting with keys",
      goal: "Sort anything by any rule: sorted vs .sort, key functions, multi-key tuples, reverse, stability and sorting a dict by its values.",
      keywords: ["sorted", "sort", "key", "lambda", "reverse", "stable", "itemgetter", "attrgetter", "sort dict by value"],
      exercises: [
        {
          id: "m6-sorting-e1",
          prompt:
            "Define `by_price(products)`. `products` is a list of dicts, each with a `\"name\"` and a `\"price\"`. Return a **new list** of those dicts sorted by price, cheapest first. The list you were given must keep its original order.",
          starter: "def by_price(products):\n    pass\n",
          solution: `def by_price(products):
    return sorted(products, key=lambda p: p["price"])
`,
          hints: [
            "`sorted()` returns a new list and leaves the original alone; `.sort()` changes the list in place and returns `None`.",
            "You can't compare two dicts, so tell `sorted` what to compare: `key=lambda p: p[\"price\"]`.",
            "`return sorted(products, key=lambda p: p[\"price\"])`",
          ],
          tests: `assert 'by_price' in dir(), "Define a function called by_price"
catalogue = [
    {"name": "Keyboard", "price": 45.0},
    {"name": "Mouse", "price": 19.5},
    {"name": "Monitor", "price": 189.0},
    {"name": "Cable", "price": 4.99},
]
result = by_price(catalogue)
assert result is not None, "by_price returned None — .sort() changes a list in place and returns None; sorted() gives you the new list back"
assert isinstance(result, list), f"by_price should return a list, got {type(result).__name__}"
assert [p["name"] for p in result] == ["Cable", "Mouse", "Keyboard", "Monitor"], f"Expected Cable, Mouse, Keyboard, Monitor (cheapest first), got {[p['name'] for p in result]}"
assert [p["name"] for p in catalogue] == ["Keyboard", "Mouse", "Monitor", "Cable"], "The original list must keep its order — use sorted(), not .sort()"
assert by_price([]) == [], "by_price([]) should return []"
`,
          wrong: [
            "def by_price(products):\n    return products.sort(key=lambda p: p[\"price\"])",
            "def by_price(products):\n    return sorted(products, key=lambda p: p[\"price\"], reverse=True)",
            "def by_price(products):\n    products.sort(key=lambda p: p[\"price\"])\n    return products",
          ],
        },
        {
          id: "m6-sorting-e2",
          prompt:
            "`scores = {\"Cleo\": 82, \"Ben\": 95, \"Ana\": 82, \"Dev\": 71}`. Print the leaderboard, one person per line in the format `Ben 95`: highest score first, and people with the **same score in alphabetical order**.",
          starter: "scores = {\"Cleo\": 82, \"Ben\": 95, \"Ana\": 82, \"Dev\": 71}\n# highest score first; equal scores alphabetical\n",
          solution: `scores = {"Cleo": 82, "Ben": 95, "Ana": 82, "Dev": 71}
for name, score in sorted(scores.items(), key=lambda item: (-item[1], item[0])):
    print(f"{name} {score}")
`,
          hints: [
            "Sort `scores.items()` — each item is a `(name, score)` pair.",
            "A key that returns a tuple sorts by the first element, then the second. Negating the score makes big scores come first while names still sort A→Z.",
            "`sorted(scores.items(), key=lambda item: (-item[1], item[0]))`",
          ],
          expectOutput: true,
          requires: [{ re: "\\bsorted\\b|\\.sort\\b", msg: "Use sorted() or .sort() with a key for this one." }],
          wrong: [
            "scores = {\"Cleo\": 82, \"Ben\": 95, \"Ana\": 82, \"Dev\": 71}\nfor name, score in sorted(scores.items(), key=lambda item: item[1], reverse=True):\n    print(f\"{name} {score}\")",
            "scores = {\"Cleo\": 82, \"Ben\": 95, \"Ana\": 82, \"Dev\": 71}\nfor name in sorted(scores, key=scores.get):\n    print(f\"{name} {scores[name]}\")",
          ],
        },
      ],
      quiz: [
        {
          q: "After `names = [\"Cleo\", \"Ana\"]` and `result = names.sort()`, what is `result`?",
          options: ["[\"Ana\", \"Cleo\"]", "None", "[\"Cleo\", \"Ana\"]", "An error"],
          answer: 1,
          explain:
            ".sort() sorts the list in place and returns None — the sorted names are in `names`, not in `result`. Use sorted(names) when you want the result as a value.",
        },
        {
          q: "`sorted(people, key=lambda p: (p[\"city\"], -p[\"age\"]))` orders people…",
          options: [
            "by city A→Z, and within each city oldest first",
            "by city Z→A, and within each city youngest first",
            "by age only — the city is ignored",
            "by city A→Z, and within each city youngest first",
          ],
          answer: 0,
          explain:
            "Tuples compare element by element: city first, and only for equal cities does the second element matter. Negating the age flips just that part of the order.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m6-generators",
      title: "Generators and yield",
      goal: "Write functions that hand out values one at a time with yield, use generator expressions, and know when lazy beats building a list.",
      keywords: ["generator", "yield", "next", "lazy", "generator expression", "infinite", "StopIteration", "memory"],
      exercises: [
        {
          id: "m6-generators-e1",
          prompt:
            "Write a **generator function** `evens_up_to(limit)` that yields the even numbers from 0 up to and including `limit`, one at a time. `list(evens_up_to(10))` gives `[0, 2, 4, 6, 8, 10]`, and `evens_up_to(-1)` yields nothing.",
          starter: "def evens_up_to(limit):\n    pass\n",
          solution: `def evens_up_to(limit):
    for n in range(0, limit + 1, 2):
        yield n
`,
          hints: [
            "A function becomes a generator the moment it contains `yield`. Each `yield n` hands out one value and pauses.",
            "`range(0, limit + 1, 2)` steps through 0, 2, 4, … and includes `limit` when it is even.",
            "`for n in range(0, limit + 1, 2): yield n`",
          ],
          tests: `import types
assert 'evens_up_to' in dir(), "Define a function called evens_up_to"
gen = evens_up_to(10)
assert isinstance(gen, types.GeneratorType), f"evens_up_to(10) should give a generator, got {type(gen).__name__} — use yield instead of building a list"
assert list(gen) == [0, 2, 4, 6, 8, 10], f"list(evens_up_to(10)) should be [0, 2, 4, 6, 8, 10], got {list(evens_up_to(10))}"
assert list(evens_up_to(7)) == [0, 2, 4, 6], f"list(evens_up_to(7)) should be [0, 2, 4, 6], got {list(evens_up_to(7))}"
assert list(evens_up_to(0)) == [0], "list(evens_up_to(0)) should be [0]"
assert list(evens_up_to(-1)) == [], "evens_up_to(-1) should yield nothing"
g = evens_up_to(4)
assert next(g) == 0, "The first value from next() should be 0"
assert next(g) == 2, "The second value from next() should be 2"
`,
          requires: [{ re: "\\byield\\b", msg: "Write a generator function (use yield)." }],
          wrong: [
            "def evens_up_to(limit):\n    return [n for n in range(limit + 1) if n % 2 == 0]",
            "def evens_up_to(limit):\n    for n in range(limit):\n        if n % 2 == 0:\n            yield n",
          ],
        },
        {
          id: "m6-generators-e2",
          prompt:
            "Write a generator function `fibonacci()` that yields the Fibonacci numbers **forever**: 0, 1, 1, 2, 3, 5, 8, 13, … (each number is the sum of the two before it). It never stops on its own — the caller decides when to stop with `next()`, `break` or `itertools.islice`.",
          starter: "def fibonacci():\n    a, b = 0, 1\n    # yield a, then move a and b along — forever\n",
          solution: `def fibonacci():
    a, b = 0, 1
    while True:
        yield a
        a, b = b, a + b
`,
          hints: [
            "Keep two variables, `a` and `b`, holding the current and next number. Start them at 0 and 1.",
            "An infinite generator is a `while True:` loop with a `yield` inside — it only runs as far as the caller asks.",
            "`while True: yield a; a, b = b, a + b`",
          ],
          tests: `import types, itertools
assert 'fibonacci' in dir(), "Define a function called fibonacci"
gen = fibonacci()
assert isinstance(gen, types.GeneratorType), f"fibonacci() should give a generator, got {type(gen).__name__} — use yield"
first = [next(gen) for _ in range(10)]
assert first == [0, 1, 1, 2, 3, 5, 8, 13, 21, 34], f"The first ten values should be 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 — got {first}"
later = list(itertools.islice(fibonacci(), 50, 51))
assert later == [12586269025], f"The 51st value (index 50) should be 12586269025, got {later} — the generator must keep going for as long as it is asked"
`,
          requires: [{ re: "\\byield\\b", msg: "Write a generator function (use yield)." }],
          wrong: [
            "def fibonacci():\n    a, b = 0, 1\n    for _ in range(20):\n        yield a\n        a, b = b, a + b",
            "def fibonacci():\n    a, b = 1, 1\n    while True:\n        yield a\n        a, b = b, a + b",
          ],
        },
      ],
      quiz: [
        {
          q: "A function's body contains `yield`. What happens when you call it?",
          options: [
            "Nothing in the body runs yet — you get a generator object back",
            "It runs up to the first yield and returns that value",
            "It runs the whole body and returns a list of everything yielded",
            "It raises StopIteration",
          ],
          answer: 0,
          explain:
            "Calling a generator function only creates the generator. The body starts running on the first next() (or the first loop step) and pauses at each yield.",
        },
        {
          q: "`g = (x for x in range(3))`, then `list(g)` twice. The second `list(g)` gives…",
          options: ["[0, 1, 2]", "[]", "An error", "[2]"],
          answer: 1,
          explain:
            "A generator is used up once it has been run through. The second list() finds nothing left. Build a list, or call the generator function again, if you need the values twice.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m6-itertools",
      title: "itertools and the iteration toolkit",
      goal: "Reach for any, all, min and max with keys, and the itertools functions — count, islice, chain, product, combinations, accumulate and groupby — instead of hand-written loops.",
      keywords: ["any", "all", "min", "max", "key", "itertools", "count", "islice", "chain", "product", "combinations", "accumulate", "groupby"],
      exercises: [
        {
          id: "m6-itertools-e1",
          prompt:
            "Define `cheapest(products)`. `products` is a non-empty list of dicts, each with a `\"name\"` and a `\"price\"`. Return the **name** of the cheapest product. Use `min` with a `key`.",
          starter: "def cheapest(products):\n    pass\n",
          solution: `def cheapest(products):
    return min(products, key=lambda p: p["price"])["name"]
`,
          hints: [
            "`min(products, key=...)` gives you back the whole dict with the smallest key — not the price.",
            "The key function says what to compare: `lambda p: p[\"price\"]`.",
            "`min(products, key=lambda p: p[\"price\"])[\"name\"]`",
          ],
          tests: `assert 'cheapest' in dir(), "Define a function called cheapest"
catalogue = [{"name": "Keyboard", "price": 45.0}, {"name": "Mouse", "price": 19.5}, {"name": "Monitor", "price": 189.0}, {"name": "Cable", "price": 4.99}]
result = cheapest(catalogue)
assert result == "Cable", f'cheapest should return the name "Cable" for the catalogue, got {result!r}'
assert cheapest([{"name": "Pen", "price": 1.2}, {"name": "Pencil", "price": 0.8}]) == "Pencil", 'cheapest should return "Pencil" for the pen/pencil list'
assert cheapest([{"name": "Solo", "price": 9.0}]) == "Solo", "With one product, cheapest returns that product's name"
`,
          requires: [{ re: "\\bmin\\b", msg: "Use min() with a key function for this one." }],
          wrong: [
            "def cheapest(products):\n    return min(products, key=lambda p: p[\"price\"])",
            "def cheapest(products):\n    return min(p[\"price\"] for p in products)",
          ],
        },
        {
          id: "m6-itertools-e2",
          prompt:
            "Define `names_by_city(people)`. `people` is a list of `(name, city)` tuples in **no particular order**. Return a dict that maps each city to the list of names living there, with the names in **alphabetical order**. For `[(\"Ana\", \"Ipoh\"), (\"Ben\", \"Penang\"), (\"Cleo\", \"Ipoh\")]` return `{\"Ipoh\": [\"Ana\", \"Cleo\"], \"Penang\": [\"Ben\"]}`. Use `itertools.groupby`.",
          starter: "from itertools import groupby\n\ndef names_by_city(people):\n    pass\n",
          solution: `from itertools import groupby

def names_by_city(people):
    ordered = sorted(people, key=lambda p: (p[1], p[0]))
    return {city: [name for name, _ in group] for city, group in groupby(ordered, key=lambda p: p[1])}
`,
          hints: [
            "groupby only groups *adjacent* items, so sort the list by city first — and by name within the city, so the names come out alphabetical.",
            "A sort key of `(city, name)` does both: `sorted(people, key=lambda p: (p[1], p[0]))`.",
            "`{city: [name for name, _ in group] for city, group in groupby(ordered, key=lambda p: p[1])}`",
          ],
          tests: `assert 'names_by_city' in dir(), "Define a function called names_by_city"
sample = [("Ana", "Ipoh"), ("Ben", "Penang"), ("Cleo", "Ipoh"), ("Dev", "Kuala Lumpur"), ("Ela", "Penang")]
result = names_by_city(sample)
assert isinstance(result, dict), f"names_by_city should return a dict, got {type(result).__name__}"
assert result == {"Ipoh": ["Ana", "Cleo"], "Kuala Lumpur": ["Dev"], "Penang": ["Ben", "Ela"]}, f"Expected {{'Ipoh': ['Ana', 'Cleo'], 'Kuala Lumpur': ['Dev'], 'Penang': ['Ben', 'Ela']}}, got {result} — did you sort by city before grouping?"
assert names_by_city([("Zara", "Ipoh"), ("Ana", "Ipoh")]) == {"Ipoh": ["Ana", "Zara"]}, "Names within a city should be in alphabetical order"
assert names_by_city([]) == {}, "names_by_city([]) should return {}"
`,
          requires: [{ re: "\\bgroupby\\b", msg: "Use itertools.groupby for this one." }],
          wrong: [
            "from itertools import groupby\n\ndef names_by_city(people):\n    return {city: [name for name, _ in group] for city, group in groupby(people, key=lambda p: p[1])}",
            "from itertools import groupby\n\ndef names_by_city(people):\n    ordered = sorted(people, key=lambda p: p[1])\n    return {city: [name for name, _ in group] for city, group in groupby(ordered, key=lambda p: p[1])}",
          ],
        },
      ],
      quiz: [
        {
          q: "How many groups does `itertools.groupby([\"a\", \"b\", \"a\"])` produce?",
          options: ["2", "3", "1", "An error — groupby needs sorted input"],
          answer: 1,
          explain:
            "groupby starts a new group every time the key changes, so a, b, a makes three groups. It does not look for equal keys elsewhere in the sequence — sort first if you want each key grouped once.",
        },
        {
          q: "`max({\"Zara\": 82, \"Ben\": 95})` returns…",
          options: ["\"Zara\"", "\"Ben\"", "95", "(\"Ben\", 95)"],
          answer: 0,
          explain:
            "Looping over a dict gives its keys, so max compares the names alphabetically and Zara wins. To find the highest score's name you need max(scores, key=scores.get).",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m6-unpacking",
      title: "Unpacking and star expressions",
      goal: "Pull sequences apart into names with star targets, swap and unpack in loops, and use * and ** to spread values into calls, literals and merged dicts.",
      keywords: ["unpacking", "star", "rest", "swap", "tuple unpacking", "splat", "double star", "merge dicts"],
      exercises: [
        {
          id: "m6-unpacking-e1",
          prompt:
            "`readings = [18.5, 19.0, 21.2, 20.4, 17.9]`. Using **star unpacking in a single assignment**, split the list into the first reading, the middle readings and the last reading. Then print three lines, exactly: `First: 18.5`, `Middle: [19.0, 21.2, 20.4]` and `Last: 17.9`.",
          starter: "readings = [18.5, 19.0, 21.2, 20.4, 17.9]\n# one assignment with a star target, then three prints\n",
          solution: `readings = [18.5, 19.0, 21.2, 20.4, 17.9]
first, *middle, last = readings
print(f"First: {first}")
print(f"Middle: {middle}")
print(f"Last: {last}")
`,
          hints: [
            "A starred name on the left of `=` collects everything the other names don't take.",
            "`first, *middle, last = readings` — `middle` becomes a list.",
            "Print `middle` as a whole list: `print(f\"Middle: {middle}\")`.",
          ],
          expectOutput: true,
          requires: [
            { re: "(?:,\\s*\\*\\s*\\w+|\\*\\s*\\w+\\s*,)[^=\\n]*=[^=]", msg: "Use star unpacking: first, *middle, last = …" },
          ],
          wrong: [
            "readings = [18.5, 19.0, 21.2, 20.4, 17.9]\nfirst, *middle, last = readings\nprint(f\"First: {first}\")\nprint(\"Middle:\", *middle)\nprint(f\"Last: {last}\")",
            "readings = [18.5, 19.0, 21.2, 20.4, 17.9]\n*first, middle, last = readings\nprint(f\"First: {first}\")\nprint(f\"Middle: {middle}\")\nprint(f\"Last: {last}\")",
          ],
        },
        {
          id: "m6-unpacking-e2",
          prompt:
            "Define `merge_settings(defaults, overrides)`. Return a **new dict** with everything from `defaults`, except that any key also present in `overrides` takes the value from `overrides`; keys that only exist in `overrides` are included too. Neither dict you were given may change. Use `**` unpacking.",
          starter: "def merge_settings(defaults, overrides):\n    pass\n",
          solution: `def merge_settings(defaults, overrides):
    return {**defaults, **overrides}
`,
          hints: [
            "`{**a, **b}` builds a brand-new dict containing the pairs of `a` and then `b`.",
            "When both dicts have a key, the one unpacked **later** wins — so put `overrides` last.",
            "`return {**defaults, **overrides}`",
          ],
          tests: `assert 'merge_settings' in dir(), "Define a function called merge_settings"
base = {"theme": "light", "font_size": 14, "autosave": True}
custom = {"theme": "dark", "line_numbers": True}
merged = merge_settings(base, custom)
assert isinstance(merged, dict), f"merge_settings should return a dict, got {type(merged).__name__}"
assert merged == {"theme": "dark", "font_size": 14, "autosave": True, "line_numbers": True}, f"Expected the defaults with theme overridden to 'dark' and line_numbers added, got {merged}"
assert base == {"theme": "light", "font_size": 14, "autosave": True}, "defaults must not change — build a new dict instead of calling .update() on it"
assert custom == {"theme": "dark", "line_numbers": True}, "overrides must not change"
assert merge_settings({}, {}) == {}, "merge_settings({}, {}) should return {}"
assert merge_settings({"a": 1}, {}) == {"a": 1}, 'merge_settings({"a": 1}, {}) should return {"a": 1}'
`,
          requires: [{ re: "\\*\\*\\s*\\w+", msg: "Use ** unpacking to merge the dicts: {**a, **b}." }],
          wrong: [
            "def merge_settings(defaults, overrides):\n    return {**overrides, **defaults}",
            "def merge_settings(defaults, overrides):\n    defaults.update(overrides)\n    return {**defaults}",
          ],
        },
      ],
      quiz: [
        {
          q: "After `first, *rest = (1,)`, what is `rest`?",
          options: ["[]", "()", "None", "An error — nothing is left for rest"],
          answer: 0,
          explain:
            "A starred target takes whatever is left over, even nothing. It is always a list, no matter what kind of sequence was on the right.",
        },
        {
          q: "What does `{**{\"a\": 1, \"b\": 2}, **{\"b\": 3}}` produce?",
          options: ["{\"a\": 1, \"b\": 3}", "{\"a\": 1, \"b\": 2}", "{\"a\": 1, \"b\": [2, 3]}", "An error — duplicate key"],
          answer: 0,
          explain:
            "The pairs are added left to right, so the later value for \"b\" replaces the earlier one. That is exactly what makes {**defaults, **overrides} useful.",
        },
      ],
    },
  ],
};
