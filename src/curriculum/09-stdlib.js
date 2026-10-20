/* Module 9 — Modules and the Standard Library ------------------------- */

export default {
  id: "stdlib",
  number: 9,
  title: "Modules and the Standard Library",
  level: "Advanced",
  summary:
    "Split code into modules and import them, then tour the standard library you will use every week: maths, randomness and statistics, dates and times, the collections module, decorators and functools, type hints and unit tests.",
  packages: [],
  lessons: [
    {
      id: "m9-imports",
      title: "import and your own modules",
      goal: "Import a module three ways, write a module file of your own and import it, and guard demo code with if __name__ == \"__main__\".",
      keywords: ["import", "from import", "as", "module", "sys.path", "__name__", "__main__", "dir"],
      exercises: [
        {
          id: "m9-imports-e1",
          prompt:
            "The `setup` has already created a file `pricing.py` with a function `with_tax(amount)` and a constant `RATE`. Import it and **print two lines**: first the result of `with_tax(100)`, then the value of `RATE`.\n\nUse the **whole-module** form (`import pricing`) so the names stay prefixed.",
          starter: "# pricing.py already exists in the working directory\n\n",
          solution: "import pricing\n\nprint(pricing.with_tax(100))\nprint(pricing.RATE)",
          hints: [
            "The module name is the filename without `.py`: `import pricing`.",
            "After `import pricing`, every name in the file is reached with a dot: `pricing.with_tax(100)`.",
            "Two `print` calls: `print(pricing.with_tax(100))` then `print(pricing.RATE)`.",
          ],
          setup:
            "with open('pricing.py', 'w') as f:\n    f.write('RATE = 0.06\\n\\ndef with_tax(amount):\\n    return round(amount * (1 + RATE), 2)\\n')",
          expectOutput: true,
          requires: [{ re: "^\\s*import\\s+pricing\\b", msg: "Use the whole-module form: `import pricing`." }],
          wrong: [
            "import pricing\n\nprint(pricing.with_tax(100))",
            "from pricing import with_tax, RATE\n\nprint(with_tax(100))\nprint(RATE)",
          ],
        },
        {
          id: "m9-imports-e2",
          prompt:
            "Write your own module. Your code must **create a file `textkit.py`** (open it for writing and write the source) that defines:\n\n- `slugify(text)` — returns `text` stripped of surrounding whitespace, lower-cased, with spaces replaced by `-`.\n- an `if __name__ == \"__main__\":` block that prints `slugify demo: hello-world` (using `slugify(\"Hello World\")`).\n\nThen `import textkit` and print the result of `textkit.slugify(\"  Python Quest  \")`. Your program's only output should be that one line, `python-quest` — the demo must **not** print when the module is imported.",
          starter:
            "source = '''\n# write the module here\n'''\n\nwith open(\"textkit.py\", \"w\") as f:\n    f.write(source)\n\n# import it and print textkit.slugify(\"  Python Quest  \")\n",
          solution:
            "source = '''\ndef slugify(text):\n    return text.strip().lower().replace(\" \", \"-\")\n\nif __name__ == \"__main__\":\n    print(\"slugify demo:\", slugify(\"Hello World\"))\n'''\n\nwith open(\"textkit.py\", \"w\") as f:\n    f.write(source)\n\nimport textkit\nprint(textkit.slugify(\"  Python Quest  \"))",
          hints: [
            "Put the module's code in a triple-quoted string and write it to `textkit.py`, exactly like the examples in the lesson.",
            "Inside the module, `text.strip().lower().replace(\" \", \"-\")` does all three transformations.",
            "The demo goes under `if __name__ == \"__main__\":` — when the file is imported, `__name__` is `\"textkit\"`, so that block is skipped.",
          ],
          expectOutput: true,
          tests:
            "import os, io, sys, runpy, contextlib, importlib\nassert os.path.exists('textkit.py'), 'Your code should create a file called textkit.py'\nsys.modules.pop('textkit', None)\nimportlib.invalidate_caches()\nimport textkit as _tk\nassert hasattr(_tk, 'slugify'), 'textkit.py should define a function called slugify'\nassert _tk.slugify('Hello World') == 'hello-world', f\"slugify('Hello World') should be 'hello-world', got {_tk.slugify('Hello World')!r}\"\nassert _tk.slugify('  padded  ') == 'padded', f\"slugify('  padded  ') should strip the spaces, got {_tk.slugify('  padded  ')!r}\"\nassert _tk.slugify('Kuala Lumpur City') == 'kuala-lumpur-city', f\"slugify('Kuala Lumpur City') should be 'kuala-lumpur-city', got {_tk.slugify('Kuala Lumpur City')!r}\"\n_buf = io.StringIO()\nwith contextlib.redirect_stdout(_buf):\n    runpy.run_path('textkit.py', run_name='__main__')\nassert 'slugify demo: hello-world' in _buf.getvalue(), f\"running textkit.py directly should print 'slugify demo: hello-world', got {_buf.getvalue()!r}\"\n_buf2 = io.StringIO()\nwith contextlib.redirect_stdout(_buf2):\n    runpy.run_path('textkit.py', run_name='textkit')\nassert 'slugify demo' not in _buf2.getvalue(), 'the demo must be inside if __name__ == \"__main__\": so importing the module stays silent'",
          wrong: [
            "source = '''\ndef slugify(text):\n    return text.strip().lower().replace(\" \", \"-\")\n\nprint(\"slugify demo:\", slugify(\"Hello World\"))\n'''\n\nwith open(\"textkit.py\", \"w\") as f:\n    f.write(source)\n\nimport textkit\nprint(textkit.slugify(\"  Python Quest  \"))",
            "source = '''\ndef slugify(text):\n    return text.lower().replace(\" \", \"-\")\n\nif __name__ == \"__main__\":\n    print(\"slugify demo:\", slugify(\"Hello World\"))\n'''\n\nwith open(\"textkit.py\", \"w\") as f:\n    f.write(source)\n\nimport textkit\nprint(textkit.slugify(\"  Python Quest  \"))",
          ],
        },
      ],
      quiz: [
        {
          q: "`temperature.py` ends with `if __name__ == \"__main__\": print(\"demo\")`. What happens when another file runs `import temperature`?",
          options: [
            "\"demo\" is printed, because the file runs top to bottom",
            "Nothing is printed — __name__ is \"temperature\" inside an imported module",
            "SyntaxError: __name__ is not defined",
            "\"demo\" is printed once per import",
          ],
          answer: 1,
          explain:
            "An imported module's __name__ is its own name. Only the file you run directly gets \"__main__\", so the guard skips the demo on import.",
        },
        {
          q: "After `import shapes`, which line calls the `area` function defined in shapes.py?",
          options: ["area(2)", "shapes.area(2)", "shapes.py.area(2)", "import shapes.area(2)"],
          answer: 1,
          explain:
            "The whole-module import gives you a module object; its names are reached with a dot. A bare area(2) only works after from shapes import area.",
        },
      ],
    },

    {
      id: "m9-math-random",
      title: "math, random and statistics",
      goal: "Use math for roots and rounding, random for reproducible chance, and statistics for mean, median and spread.",
      keywords: ["math", "sqrt", "floor", "ceil", "pi", "random", "seed", "randint", "choice", "shuffle", "sample", "statistics", "mean", "median", "stdev"],
      exercises: [
        {
          id: "m9-math-random-e1",
          prompt:
            "Define `describe(values)` that takes a list of numbers and returns a **dict** with three keys:\n\n- `\"mean\"` — the mean,\n- `\"median\"` — the median,\n- `\"stdev\"` — the sample standard deviation **rounded to 2 decimal places**.\n\nUse the `statistics` module. For example `describe([3, 7, 7, 19])` returns `{\"mean\": 9, \"median\": 7.0, \"stdev\": 6.93}`.",
          starter: "import statistics\n\ndef describe(values):\n    pass\n",
          solution:
            "import statistics\n\ndef describe(values):\n    return {\n        \"mean\": statistics.mean(values),\n        \"median\": statistics.median(values),\n        \"stdev\": round(statistics.stdev(values), 2),\n    }",
          hints: [
            "`statistics.mean`, `statistics.median` and `statistics.stdev` each take the list directly.",
            "Build the dict with three keys and return it; `round(x, 2)` handles the rounding.",
            "`return {\"mean\": statistics.mean(values), \"median\": statistics.median(values), \"stdev\": round(statistics.stdev(values), 2)}`",
          ],
          tests:
            "assert 'describe' in dir(), 'Define a function called describe'\n_r = describe([3, 7, 7, 19])\nassert isinstance(_r, dict), f'describe should return a dict, got {type(_r).__name__}'\nassert set(_r) == {'mean', 'median', 'stdev'}, f\"the dict should have exactly the keys mean, median and stdev, got {sorted(_r)}\"\nassert _r['mean'] == 9, f\"mean of [3, 7, 7, 19] should be 9, got {_r['mean']!r}\"\nassert _r['median'] == 7, f\"median of [3, 7, 7, 19] should be 7.0, got {_r['median']!r}\"\nassert _r['stdev'] == 6.93, f\"stdev of [3, 7, 7, 19] rounded to 2 dp should be 6.93, got {_r['stdev']!r}\"\n_r = describe([88, 92, 79, 93, 85])\nassert _r['mean'] == 87.4, f\"mean of the scores should be 87.4, got {_r['mean']!r}\"\nassert _r['median'] == 88, f\"median of the scores should be 88, got {_r['median']!r}\"\nassert _r['stdev'] == 5.68, f\"stdev of the scores should be 5.68 (sample stdev, rounded), got {_r['stdev']!r}\"",
          wrong: [
            "import statistics\n\ndef describe(values):\n    return {\n        \"mean\": statistics.mean(values),\n        \"median\": statistics.median(values),\n        \"stdev\": round(statistics.pstdev(values), 2),\n    }",
            "import statistics\n\ndef describe(values):\n    return {\n        \"mean\": statistics.mean(values),\n        \"median\": statistics.median(values),\n        \"stdev\": statistics.stdev(values),\n    }",
          ],
        },
        {
          id: "m9-math-random-e2",
          prompt:
            "Define `roll_dice(n, seed)` that seeds the random generator with `seed`, then returns a **list** of `n` dice rolls — each a whole number from 1 to 6 inclusive, chosen with `random.randint`.\n\nThe same `seed` must always give the same list, so call `random.seed(seed)` **inside** the function before rolling.",
          starter: "import random\n\ndef roll_dice(n, seed):\n    pass\n",
          solution:
            "import random\n\ndef roll_dice(n, seed):\n    random.seed(seed)\n    return [random.randint(1, 6) for _ in range(n)]",
          hints: [
            "First line of the function: `random.seed(seed)`.",
            "`random.randint(1, 6)` includes both 1 and 6. Collect `n` of them in a list.",
            "A list comprehension does it: `[random.randint(1, 6) for _ in range(n)]`.",
          ],
          tests:
            "import random as _random\nassert 'roll_dice' in dir(), 'Define a function called roll_dice'\n_a = roll_dice(10, 42)\nassert isinstance(_a, list), f'roll_dice should return a list, got {type(_a).__name__}'\nassert len(_a) == 10, f'roll_dice(10, 42) should return 10 rolls, got {len(_a)}'\nassert all(isinstance(x, int) and 1 <= x <= 6 for x in _a), f'every roll should be an int from 1 to 6, got {_a}'\nassert roll_dice(10, 42) == _a, 'the same seed should give the same rolls every time — call random.seed(seed) inside the function'\nassert roll_dice(0, 1) == [], 'roll_dice(0, 1) should return an empty list'\n_seen = set()\nfor _s in range(20):\n    _seen.update(roll_dice(30, _s))\nassert _seen == {1, 2, 3, 4, 5, 6}, f'over many rolls every face from 1 to 6 should appear, saw {sorted(_seen)}'\n_random.seed(42)\n_expected = [_random.randint(1, 6) for _ in range(10)]\nassert _a == _expected, f'with seed 42, randint(1, 6) ten times gives {_expected}, got {_a}'",
          wrong: [
            "import random\n\ndef roll_dice(n, seed):\n    return [random.randint(1, 6) for _ in range(n)]",
            "import random\n\ndef roll_dice(n, seed):\n    random.seed(seed)\n    return [random.randint(1, 5) for _ in range(n)]",
          ],
        },
      ],
      quiz: [
        {
          q: "Which value can `random.randint(1, 6)` never return?",
          options: ["1", "6", "0", "3"],
          answer: 2,
          explain:
            "randint includes both ends, so 1 and 6 are both possible. It is randrange(1, 6) that stops before the top, following the range rule.",
        },
        {
          q: "What does `cards = random.shuffle(cards)` leave in `cards`?",
          options: ["The shuffled list", "None", "The original order", "A shuffled copy"],
          answer: 1,
          explain:
            "shuffle reorders the list in place and returns None, so the assignment overwrites the list with None. Call it on its own line.",
        },
      ],
    },

    {
      id: "m9-datetime",
      title: "Dates and times",
      goal: "Build, parse, format and compare dates, and do calendar arithmetic with timedelta.",
      keywords: ["datetime", "date", "timedelta", "strftime", "strptime", "weekday", "fromisoformat", "days between"],
      exercises: [
        {
          id: "m9-datetime-e1",
          prompt:
            "Define `days_until(start, end)` that takes two date strings in `YYYY-MM-DD` form and returns the **number of days** from `start` to `end` as an `int`. For example `days_until(\"2026-01-01\", \"2026-12-25\")` returns `358`, and a date before `start` gives a negative number.",
          starter: "from datetime import date\n\ndef days_until(start, end):\n    pass\n",
          solution:
            "from datetime import date\n\ndef days_until(start, end):\n    return (date.fromisoformat(end) - date.fromisoformat(start)).days",
          hints: [
            "Turn each string into a date first: `date.fromisoformat(\"2026-01-01\")`.",
            "Subtracting two dates gives a timedelta; its `.days` attribute is the int you want.",
            "`return (date.fromisoformat(end) - date.fromisoformat(start)).days`",
          ],
          tests:
            "assert 'days_until' in dir(), 'Define a function called days_until'\n_r = days_until('2026-01-01', '2026-12-25')\nassert _r == 358, f\"days_until('2026-01-01', '2026-12-25') should be 358, got {_r!r}\"\nassert isinstance(_r, int), f'days_until should return an int, got {type(_r).__name__}'\nassert days_until('2026-10-20', '2026-10-20') == 0, 'the same date twice should give 0'\nassert days_until('2024-02-28', '2024-03-01') == 2, '2024 is a leap year, so 28 Feb to 1 Mar is 2 days'\nassert days_until('2026-03-01', '2026-02-27') == -2, 'an end date before the start should be negative (-2 here)'\nassert days_until('2025-12-31', '2026-01-01') == 1, 'crossing a year boundary should still count correctly'",
          wrong: [
            "from datetime import date\n\ndef days_until(start, end):\n    return (date.fromisoformat(start) - date.fromisoformat(end)).days",
            "from datetime import date\n\ndef days_until(start, end):\n    s = date.fromisoformat(start)\n    e = date.fromisoformat(end)\n    return (e.month - s.month) * 30 + (e.day - s.day)",
          ],
        },
        {
          id: "m9-datetime-e2",
          prompt:
            "Define `due_date(issued, net_days)` for an invoicing system. `issued` is a string like `\"14/03/2026\"` (day/month/year). Add `net_days` days; if the result lands on a Saturday or Sunday, move it forward to the following Monday. Return the date **formatted** like `\"Monday 13 April 2026\"` (full weekday name, two-digit day, full month name, four-digit year).\n\n`due_date(\"14/03/2026\", 30)` returns `\"Monday 13 April 2026\"`.",
          starter: "from datetime import datetime, timedelta\n\ndef due_date(issued, net_days):\n    pass\n",
          solution:
            "from datetime import datetime, timedelta\n\ndef due_date(issued, net_days):\n    due = datetime.strptime(issued, \"%d/%m/%Y\").date() + timedelta(days=net_days)\n    while due.weekday() >= 5:\n        due += timedelta(days=1)\n    return due.strftime(\"%A %d %B %Y\")",
          hints: [
            "Parse with `datetime.strptime(issued, \"%d/%m/%Y\")`, then add `timedelta(days=net_days)`.",
            "`weekday()` gives 5 for Saturday and 6 for Sunday. While that is the case, add one more day.",
            "Format with `strftime(\"%A %d %B %Y\")` — full weekday, day, full month, year.",
          ],
          tests:
            "assert 'due_date' in dir(), 'Define a function called due_date'\n_r = due_date('14/03/2026', 30)\nassert _r == 'Monday 13 April 2026', f\"due_date('14/03/2026', 30) should be 'Monday 13 April 2026', got {_r!r}\"\n_r = due_date('20/10/2026', 10)\nassert _r == 'Friday 30 October 2026', f\"due_date('20/10/2026', 10) lands on a Friday and should stay there, got {_r!r}\"\n_r = due_date('21/10/2026', 10)\nassert _r == 'Monday 02 November 2026', f\"due_date('21/10/2026', 10) lands on Saturday 31 Oct and should move to 'Monday 02 November 2026', got {_r!r}\"\n_r = due_date('22/10/2026', 10)\nassert _r == 'Monday 02 November 2026', f\"due_date('22/10/2026', 10) lands on a Sunday and should move to 'Monday 02 November 2026', got {_r!r}\"\n_r = due_date('20/12/2026', 14)\nassert _r == 'Monday 04 January 2027', f\"due_date('20/12/2026', 14) crosses the year and lands on a Sunday; expected 'Monday 04 January 2027', got {_r!r}\"",
          wrong: [
            "from datetime import datetime, timedelta\n\ndef due_date(issued, net_days):\n    due = datetime.strptime(issued, \"%d/%m/%Y\").date() + timedelta(days=net_days)\n    return due.strftime(\"%A %d %B %Y\")",
            "from datetime import datetime, timedelta\n\ndef due_date(issued, net_days):\n    due = datetime.strptime(issued, \"%d/%m/%Y\").date() + timedelta(days=net_days)\n    while due.weekday() >= 5:\n        due += timedelta(days=1)\n    return due.strftime(\"%A %d %m %Y\")",
          ],
        },
      ],
      quiz: [
        {
          q: "What is `date(2026, 2, 28) + timedelta(days=1)`?",
          options: ["date(2026, 2, 29)", "date(2026, 3, 1)", "A TypeError", "date(2026, 2, 28) — timedelta does not change dates"],
          answer: 1,
          explain:
            "2026 is not a leap year, so February has 28 days and the next day is 1 March. Python handles month lengths and leap years for you.",
        },
        {
          q: "Why should an exercise build dates with `date(2026, 10, 20)` rather than `date.today()`?",
          options: [
            "today() is slower",
            "today() returns a string",
            "The result would change every day, so a test could never pin it down",
            "today() only works on Linux",
          ],
          answer: 2,
          explain:
            "A test must give the same answer every run. A fixed date does; today() does not.",
        },
      ],
    },

    {
      id: "m9-collections",
      title: "collections: Counter, defaultdict, deque, namedtuple",
      goal: "Count with Counter, group with defaultdict, queue with deque and record with namedtuple instead of hand-rolling each one.",
      keywords: ["collections", "Counter", "most_common", "defaultdict", "deque", "popleft", "rotate", "maxlen", "namedtuple"],
      exercises: [
        {
          id: "m9-collections-e1",
          prompt:
            "Define `top_words(text, n)` that returns the `n` most common words in `text` as a **list of `(word, count)` tuples**, most common first. Lower-case the text and split on whitespace before counting. Use `Counter`.\n\n`top_words(\"the cat and the hat and the bat\", 2)` returns `[(\"the\", 3), (\"and\", 2)]`.",
          starter: "from collections import Counter\n\ndef top_words(text, n):\n    pass\n",
          solution:
            "from collections import Counter\n\ndef top_words(text, n):\n    counts = Counter(text.lower().split())\n    return counts.most_common(n)",
          hints: [
            "`text.lower().split()` gives the list of words.",
            "Feed that list straight into `Counter(...)`.",
            "`most_common(n)` already returns the list of (word, count) tuples in the right order.",
          ],
          tests:
            "assert 'top_words' in dir(), 'Define a function called top_words'\n_r = top_words('the cat and the hat and the bat', 2)\nassert _r == [('the', 3), ('and', 2)], f\"top_words('the cat and the hat and the bat', 2) should be [('the', 3), ('and', 2)], got {_r!r}\"\n_r = top_words('Apple apple APPLE pear', 1)\nassert _r == [('apple', 3)], f\"counting should ignore case: expected [('apple', 3)], got {_r!r}\"\n_r = top_words('one two three', 5)\nassert sorted(_r) == [('one', 1), ('three', 1), ('two', 1)], f'asking for more words than exist should just return them all, got {_r!r}'\nassert top_words('', 3) == [], 'empty text should give an empty list'\n_r = top_words('b a b c a b', 2)\nassert _r == [('b', 3), ('a', 2)], f\"most common first: expected [('b', 3), ('a', 2)], got {_r!r}\"",
          requires: [{ re: "\\bCounter\\b", msg: "Use Counter from the collections module for this one." }],
          wrong: [
            "from collections import Counter\n\ndef top_words(text, n):\n    counts = Counter(text.split())\n    return counts.most_common(n)",
            "from collections import Counter\n\ndef top_words(text, n):\n    counts = Counter(text.lower().split())\n    return dict(counts.most_common(n))",
          ],
        },
        {
          id: "m9-collections-e2",
          prompt:
            "Define `group_by_city(people)` where `people` is a list of `(name, city)` tuples. Return a **plain `dict`** mapping each city to the list of names in that city, in the order they appeared. Build it with a `defaultdict(list)` and convert at the end.\n\n`group_by_city([(\"Ana\", \"Penang\"), (\"Ben\", \"Ipoh\"), (\"Chen\", \"Penang\")])` returns `{\"Penang\": [\"Ana\", \"Chen\"], \"Ipoh\": [\"Ben\"]}`.",
          starter: "from collections import defaultdict\n\ndef group_by_city(people):\n    pass\n",
          solution:
            "from collections import defaultdict\n\ndef group_by_city(people):\n    groups = defaultdict(list)\n    for name, city in people:\n        groups[city].append(name)\n    return dict(groups)",
          hints: [
            "`groups = defaultdict(list)` — pass the function `list`, not `list()`.",
            "Loop with `for name, city in people:` and `groups[city].append(name)` — no need to check whether the key exists.",
            "Return `dict(groups)` so the caller gets an ordinary dict.",
          ],
          tests:
            "from collections import defaultdict as _dd\nassert 'group_by_city' in dir(), 'Define a function called group_by_city'\n_r = group_by_city([('Ana', 'Penang'), ('Ben', 'Ipoh'), ('Chen', 'Penang')])\nassert _r == {'Penang': ['Ana', 'Chen'], 'Ipoh': ['Ben']}, f\"expected {{'Penang': ['Ana', 'Chen'], 'Ipoh': ['Ben']}}, got {_r!r}\"\nassert type(_r) is dict, f'return a plain dict (convert with dict(...)), got {type(_r).__name__}'\nassert group_by_city([]) == {}, 'an empty list should give an empty dict'\n_r = group_by_city([('Dev', 'KL'), ('Eva', 'KL'), ('Fay', 'KL')])\nassert _r == {'KL': ['Dev', 'Eva', 'Fay']}, f'names should keep their original order within a city, got {_r!r}'\nassert 'Melaka' not in _r, 'looking up a city that is not present should not have created a key'",
          requires: [{ re: "\\bdefaultdict\\b", msg: "Use defaultdict from the collections module for this one." }],
          wrong: [
            "from collections import defaultdict\n\ndef group_by_city(people):\n    groups = defaultdict(list)\n    for name, city in people:\n        groups[city].append(name)\n    return groups",
            "from collections import defaultdict\n\ndef group_by_city(people):\n    groups = defaultdict(list)\n    for name, city in people:\n        groups[name].append(city)\n    return dict(groups)",
          ],
        },
        {
          id: "m9-collections-e3",
          prompt:
            "A support desk serves tickets in order. Define `serve(tickets, k)` where `tickets` is a list of ticket ids. Put them in a `deque`, serve (remove) the first `k` from the **front**, and return a tuple `(served, waiting)` — two **lists**: the ids that were served, in order, and the ids still waiting.\n\nIf `k` is larger than the number of tickets, serve them all. `serve([101, 102, 103, 104], 2)` returns `([101, 102], [103, 104])`.",
          starter: "from collections import deque\n\ndef serve(tickets, k):\n    pass\n",
          solution:
            "from collections import deque\n\ndef serve(tickets, k):\n    queue = deque(tickets)\n    served = []\n    while queue and len(served) < k:\n        served.append(queue.popleft())\n    return served, list(queue)",
          hints: [
            "`queue = deque(tickets)` builds the queue; `queue.popleft()` removes and returns the front item.",
            "Loop while the queue is not empty and you have served fewer than `k`.",
            "Return `served, list(queue)` — convert the deque back to a list for the caller.",
          ],
          tests:
            "assert 'serve' in dir(), 'Define a function called serve'\n_r = serve([101, 102, 103, 104], 2)\nassert _r == ([101, 102], [103, 104]), f'serve([101, 102, 103, 104], 2) should be ([101, 102], [103, 104]), got {_r!r}'\nassert isinstance(_r, tuple) and len(_r) == 2, 'return a tuple of two lists'\nassert type(_r[0]) is list and type(_r[1]) is list, f'both parts should be plain lists, got {type(_r[0]).__name__} and {type(_r[1]).__name__}'\nassert serve([7, 8], 5) == ([7, 8], []), 'when k is bigger than the queue, serve everything'\nassert serve([], 3) == ([], []), 'an empty queue serves nobody'\nassert serve([1, 2, 3], 0) == ([], [1, 2, 3]), 'k = 0 serves nobody and leaves everyone waiting'\n_orig = [5, 6, 7]\nserve(_orig, 2)\nassert _orig == [5, 6, 7], 'the original tickets list must not be changed'",
          requires: [{ re: "\\bdeque\\b", msg: "Use a deque for the queue." }],
          wrong: [
            "from collections import deque\n\ndef serve(tickets, k):\n    queue = deque(tickets)\n    served = []\n    for _ in range(k):\n        served.append(queue.popleft())\n    return served, list(queue)",
            "from collections import deque\n\ndef serve(tickets, k):\n    queue = deque(tickets)\n    served = []\n    while queue and len(served) < k:\n        served.append(queue.pop())\n    return served, list(queue)",
          ],
        },
      ],
      quiz: [
        {
          q: "`tally = Counter([\"pizza\", \"sushi\", \"pizza\"])`. What is `tally[\"salad\"]`?",
          options: ["A KeyError", "None", "0", "1"],
          answer: 2,
          explain:
            "A Counter returns 0 for anything it has not seen, instead of raising KeyError like a plain dict.",
        },
        {
          q: "`groups = defaultdict(list)`; then you run `if groups[\"Ipoh\"]: ...`. What has changed?",
          options: [
            "Nothing — reading a key never changes a dict",
            "groups now contains \"Ipoh\": []",
            "A KeyError was raised",
            "groups[\"Ipoh\"] is now None",
          ],
          answer: 1,
          explain:
            "A defaultdict creates the key with a fresh default the moment you read it. Use `\"Ipoh\" in groups` to check without adding.",
        },
      ],
    },

    {
      id: "m9-decorators",
      title: "Decorators and functools",
      goal: "Write a decorator that wraps any function, keep its name with functools.wraps, and use lru_cache, partial and reduce.",
      keywords: ["decorator", "wrapper", "functools", "wraps", "lru_cache", "cache", "memoise", "partial", "reduce", "*args", "**kwargs"],
      exercises: [
        {
          id: "m9-decorators-e1",
          prompt:
            "Write a decorator `count_calls` that counts how many times the decorated function has been called. The wrapper must:\n\n- increase a `calls` attribute on the **wrapper function** each call (start it at `0`, so after three calls `greet.calls == 3`),\n- pass any arguments through and return the original function's result,\n- use `functools.wraps` so the decorated function keeps its `__name__`.\n\nThen decorate `greet(name)`, which returns `f\"Hello, {name}\"`.",
          starter:
            "import functools\n\ndef count_calls(func):\n    pass\n\n@count_calls\ndef greet(name):\n    return f\"Hello, {name}\"\n",
          solution:
            "import functools\n\ndef count_calls(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return func(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n\n@count_calls\ndef greet(name):\n    return f\"Hello, {name}\"",
          hints: [
            "Define `wrapper(*args, **kwargs)` inside `count_calls`, call `func(*args, **kwargs)` and return its result.",
            "Functions can carry attributes: set `wrapper.calls = 0` after defining it, and do `wrapper.calls += 1` inside it.",
            "Put `@functools.wraps(func)` directly above `def wrapper`, and finish with `return wrapper`.",
          ],
          tests:
            "assert 'count_calls' in dir(), 'Define a decorator called count_calls'\nassert 'greet' in dir(), 'Keep the decorated greet function'\nassert callable(greet), 'greet is not callable — did the decorator forget to return wrapper?'\nassert hasattr(greet, 'calls'), 'the decorated function should have a calls attribute (set wrapper.calls = 0)'\nassert greet.calls == 0, f'before any call, greet.calls should be 0, got {greet.calls!r}'\n_r = greet('Ana')\nassert _r == 'Hello, Ana', f\"greet('Ana') should still return 'Hello, Ana', got {_r!r}\"\ngreet('Ben'); greet('Chen')\nassert greet.calls == 3, f'after three calls greet.calls should be 3, got {greet.calls!r}'\nassert greet.__name__ == 'greet', f\"use functools.wraps so greet.__name__ stays 'greet', got {greet.__name__!r}\"\n@count_calls\ndef _add(a, b=0):\n    return a + b\nassert _add(2, b=3) == 5, 'the wrapper must pass positional and keyword arguments through'\nassert _add.calls == 1 and greet.calls == 3, 'each decorated function needs its own counter'",
          wrong: [
            "import functools\n\ndef count_calls(func):\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        return func(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n\n@count_calls\ndef greet(name):\n    return f\"Hello, {name}\"",
            "import functools\n\ndef count_calls(func):\n    @functools.wraps(func)\n    def wrapper(*args, **kwargs):\n        wrapper.calls += 1\n        func(*args, **kwargs)\n    wrapper.calls = 0\n    return wrapper\n\n@count_calls\ndef greet(name):\n    return f\"Hello, {name}\"",
          ],
        },
        {
          id: "m9-decorators-e2",
          prompt:
            "Define `fib(n)` that returns the *n*-th Fibonacci number (`fib(0) == 0`, `fib(1) == 1`, `fib(n) == fib(n-1) + fib(n-2)`) **recursively**, and memoise it with `functools.lru_cache` (or `functools.cache`) so that `fib(90)` returns instantly.\n\n`fib(10)` is `55` and `fib(90)` is `2880067194370816120`.",
          starter: "import functools\n\ndef fib(n):\n    pass\n",
          solution:
            "import functools\n\n@functools.lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)",
          hints: [
            "Base case first: if `n < 2`, return `n`.",
            "Then `return fib(n - 1) + fib(n - 2)` — without a cache this is 2^n calls and will time out.",
            "Put `@functools.lru_cache(maxsize=None)` on the line above `def fib`.",
          ],
          tests:
            "assert 'fib' in dir(), 'Define a function called fib'\nassert fib(0) == 0, f'fib(0) should be 0, got {fib(0)!r}'\nassert fib(1) == 1, f'fib(1) should be 1, got {fib(1)!r}'\nassert fib(10) == 55, f'fib(10) should be 55, got {fib(10)!r}'\nassert fib(50) == 12586269025, f'fib(50) should be 12586269025, got {fib(50)!r}'\nassert fib(90) == 2880067194370816120, f'fib(90) should be 2880067194370816120, got {fib(90)!r}'\nassert hasattr(fib, 'cache_info'), 'memoise fib with functools.lru_cache (or functools.cache) so the function has cache_info()'\nassert fib.cache_info().hits > 0, 'the cache should be doing work — repeated calls should hit it'",
          requires: [
            { re: "\\bfib\\s*\\(\\s*n\\s*-\\s*[12]\\s*\\)", msg: "Write fib recursively — it should call itself with n - 1 and n - 2." },
          ],
          wrong: [
            "import functools\n\ndef fib(n):\n    if n < 2:\n        return n\n    return fib(n - 1) + fib(n - 2)",
            "import functools\n\n@functools.lru_cache(maxsize=None)\ndef fib(n):\n    if n < 2:\n        return 1\n    return fib(n - 1) + fib(n - 2)",
          ],
        },
      ],
      quiz: [
        {
          q: "What is `@log_calls` above `def area(...)` shorthand for?",
          options: [
            "area = log_calls(area)",
            "log_calls(area())",
            "area.log_calls()",
            "Nothing — it is a comment",
          ],
          answer: 0,
          explain:
            "The decorator syntax just calls log_calls with the function and rebinds the name to whatever comes back — usually a wrapper.",
        },
        {
          q: "A decorator's inner `wrapper` calls `func(*args, **kwargs)` but never returns it. What does every decorated function now return?",
          options: ["The original result", "None", "The wrapper itself", "A tuple of args"],
          answer: 1,
          explain:
            "The original ran, but the wrapper has no return statement so its own result is None. Always `return func(*args, **kwargs)` (or store it and return it).",
        },
      ],
    },

    {
      id: "m9-testing",
      title: "Type hints, assert and unit tests",
      goal: "Annotate functions with type hints, guard invariants with assert, and write a unittest.TestCase that runs in-process.",
      keywords: ["type hints", "annotations", "typing", "Optional", "assert", "AssertionError", "unittest", "TestCase", "assertEqual", "assertRaises", "arrange act assert"],
      exercises: [
        {
          id: "m9-testing-e1",
          prompt:
            "Define `average(values: list[float]) -> float` — with **exactly those type hints** — that returns the mean of `values`. Guard it with an `assert` so that an **empty list** raises `AssertionError` (any message), instead of `ZeroDivisionError`.",
          starter: "def average(values):\n    return sum(values) / len(values)\n",
          solution:
            "def average(values: list[float]) -> float:\n    assert values, \"average() needs at least one value\"\n    return sum(values) / len(values)",
          hints: [
            "The hint grammar: `def average(values: list[float]) -> float:`.",
            "An empty list is falsy, so `assert values, \"...\"` is the whole guard.",
            "Put the assert on the first line of the body, before the division.",
          ],
          tests:
            "assert 'average' in dir(), 'Define a function called average'\n_ann = average.__annotations__\nassert _ann.get('values') == list[float], f\"annotate the parameter as values: list[float] (got {_ann.get('values')!r})\"\nassert _ann.get('return') is float, f\"annotate the return type as -> float (got {_ann.get('return')!r})\"\nassert average([12.5, 9.0, 15.0, 11.5]) == 12.0, f'average([12.5, 9.0, 15.0, 11.5]) should be 12.0, got {average([12.5, 9.0, 15.0, 11.5])!r}'\nassert average([4]) == 4, 'average([4]) should be 4.0'\nassert average([1, 2]) == 1.5, 'average([1, 2]) should be 1.5'\ntry:\n    average([])\nexcept AssertionError:\n    pass\nexcept ZeroDivisionError:\n    raise AssertionError('average([]) should fail with AssertionError from your assert, not ZeroDivisionError')\nelse:\n    raise AssertionError('average([]) should raise AssertionError')",
          requires: [{ re: "\\bassert\\b", msg: "Use an assert statement to guard against the empty list." }],
          wrong: [
            "def average(values: list[float]) -> float:\n    return sum(values) / len(values)",
            "def average(values: list) -> float:\n    assert values, \"average() needs at least one value\"\n    return sum(values) / len(values)",
          ],
        },
        {
          id: "m9-testing-e2",
          prompt:
            "`total(prices)` is already written for you (it sums a list, and an empty list gives `0`). Write a `unittest.TestCase` subclass named `TestTotal` with **three** test methods:\n\n- `test_empty_cart` — `total([])` is `0`\n- `test_adds_prices` — `total([1.5, 2.5, 4.0])` is `8.0`\n- `test_single_item` — `total([9.99])` is `9.99`\n\nThen run the tests in-process with `unittest.main(argv=[\"\"], exit=False)`. Your tests must actually exercise `total`: a broken `total` has to make them fail.",
          starter:
            "import unittest\n\ndef total(prices):\n    return sum(prices)\n\nclass TestTotal(unittest.TestCase):\n    pass\n\nunittest.main(argv=[\"\"], exit=False)\n",
          solution:
            "import unittest\n\ndef total(prices):\n    return sum(prices)\n\nclass TestTotal(unittest.TestCase):\n    def test_empty_cart(self):\n        self.assertEqual(total([]), 0)\n\n    def test_adds_prices(self):\n        self.assertEqual(total([1.5, 2.5, 4.0]), 8.0)\n\n    def test_single_item(self):\n        self.assertEqual(total([9.99]), 9.99)\n\nunittest.main(argv=[\"\"], exit=False)",
          hints: [
            "Each test is a method taking `self`, named `test_...`, inside the class.",
            "Inside a test: `self.assertEqual(total([]), 0)` — the call first, the expected value second.",
            "Three methods, three `assertEqual` calls, and leave the `unittest.main(argv=[\"\"], exit=False)` line at the bottom.",
          ],
          tests:
            "import io as _io, unittest as _unittest\nassert 'TestTotal' in dir(), 'Define a class called TestTotal'\nassert isinstance(TestTotal, type) and issubclass(TestTotal, _unittest.TestCase), 'TestTotal should subclass unittest.TestCase'\n_names = sorted(n for n in dir(TestTotal) if n.startswith('test'))\nfor _n in ('test_empty_cart', 'test_adds_prices', 'test_single_item'):\n    assert _n in _names, f'TestTotal needs a method called {_n} (found {_names})'\ndef _run_suite():\n    _suite = _unittest.defaultTestLoader.loadTestsFromTestCase(TestTotal)\n    return _unittest.TextTestRunner(stream=_io.StringIO(), verbosity=0).run(_suite)\n_res = _run_suite()\nassert _res.testsRun == 3, f'the loader should find 3 tests, found {_res.testsRun} — do all three names start with test_?'\nassert _res.wasSuccessful(), 'all three tests should pass against the correct total()'\n_real = total\ntotal = lambda prices: sum(prices) + 1\n_res = _run_suite()\nassert not _res.wasSuccessful(), 'a total() that is off by one should make your tests fail — are you really calling total() and checking its result?'\ntotal = lambda prices: 0\n_res = _run_suite()\nassert not _res.wasSuccessful(), 'a total() that always returns 0 should make test_adds_prices and test_single_item fail'\ntotal = _real\nassert _run_suite().wasSuccessful()",
          wrong: [
            "import unittest\n\ndef total(prices):\n    return sum(prices)\n\nclass TestTotal(unittest.TestCase):\n    def test_empty_cart(self):\n        self.assertEqual(0, 0)\n\n    def test_adds_prices(self):\n        self.assertEqual(8.0, 8.0)\n\n    def test_single_item(self):\n        self.assertEqual(9.99, 9.99)\n\nunittest.main(argv=[\"\"], exit=False)",
            "import unittest\n\ndef total(prices):\n    return sum(prices)\n\nclass TestTotal(unittest.TestCase):\n    def empty_cart(self):\n        self.assertEqual(total([]), 0)\n\n    def adds_prices(self):\n        self.assertEqual(total([1.5, 2.5, 4.0]), 8.0)\n\n    def single_item(self):\n        self.assertEqual(total([9.99]), 9.99)\n\nunittest.main(argv=[\"\"], exit=False)",
          ],
        },
      ],
      quiz: [
        {
          q: "`def double(n: int) -> int: return n * 2`. What does `double(\"ab\")` do?",
          options: [
            "Raises TypeError because of the hint",
            "Returns \"abab\" — hints are not enforced",
            "Returns 0",
            "Raises a SyntaxError",
          ],
          answer: 1,
          explain:
            "Type hints are documentation for humans and tools. Python runs the body regardless, and \"ab\" * 2 is \"abab\".",
        },
        {
          q: "A TestCase has methods `check_empty` and `check_total`. Running it prints `Ran 0 tests ... OK`. Why?",
          options: [
            "The functions under test have no bugs",
            "unittest only runs methods whose names start with test_",
            "The class needs a __init__",
            "assertEqual was never imported",
          ],
          answer: 1,
          explain:
            "The loader discovers tests by name. Methods that do not start with test_ are ignored, and zero tests still reports OK — a silent false pass.",
        },
      ],
    },
  ],
};
