/* Module 3 — Collections ----------------------------------------------- */

export default {
  id: "collections",
  number: 3,
  title: "Collections",
  level: "Beginner",
  summary:
    "Lists, slicing, list methods, tuples, dictionaries, dictionary patterns and sets — the data structures everything else is built from.",
  packages: [],
  lessons: [
    {
      id: "m3-lists",
      title: "Lists",
      goal: "Store many values under one name, pick them out by index, add to them and loop over them.",
      keywords: ["list", "index", "append", "len", "in", "nested list", "IndexError"],
      exercises: [
        {
          id: "m3-lists-e1",
          prompt:
            "`scores` holds five test scores. Print three lines: the **first** score, the **last** score, and the **number** of scores.",
          starter:
            "scores = [72, 88, 95, 61, 79]\n# print the first score\n# print the last score\n# print how many scores there are\n",
          solution:
            "scores = [72, 88, 95, 61, 79]\nprint(scores[0])\nprint(scores[-1])\nprint(len(scores))",
          hints: [
            "Indexes start at 0, so the first item is `scores[0]`.",
            "The last item is `scores[-1]` — negative indexes count from the end.",
            "`len(scores)` is the number of items.",
          ],
          expectOutput: true,
          wrong: [
            "scores = [72, 88, 95, 61, 79]\nprint(scores[1])\nprint(scores[-1])\nprint(len(scores))",
            "scores = [72, 88, 95, 61, 79]\nprint(scores[0])\nprint(scores[5])\nprint(len(scores))",
          ],
        },
        {
          id: "m3-lists-e2",
          prompt:
            "`temps` is a week of daily highs. Starting from the empty list `hot`, loop over `temps` and append every temperature that is **30 or above**. After the loop, print `hot`, then on the next line print how many hot days there were.",
          starter: "temps = [28, 31, 33, 29, 30, 35, 27]\nhot = []\n# your loop here\n",
          solution:
            "temps = [28, 31, 33, 29, 30, 35, 27]\nhot = []\nfor t in temps:\n    if t >= 30:\n        hot.append(t)\nprint(hot)\nprint(len(hot))",
          hints: [
            "`for t in temps:` visits each temperature in turn.",
            "Inside the loop, `if t >= 30:` decides whether to keep it — 30 itself counts.",
            "`hot.append(t)` adds it to the end. Print `hot` and `len(hot)` after the loop, not inside it.",
          ],
          tests:
            "assert 'hot' in dir(), \"Keep the list called hot\"\nassert hot == [31, 33, 30, 35], f\"hot should be [31, 33, 30, 35], got {hot}\"",
          expectOutput: true,
          wrong: [
            "temps = [28, 31, 33, 29, 30, 35, 27]\nhot = []\nfor t in temps:\n    if t > 30:\n        hot.append(t)\nprint(hot)\nprint(len(hot))",
            "temps = [28, 31, 33, 29, 30, 35, 27]\nhot = []\nfor t in temps:\n    if t >= 30:\n        hot = hot.append(t)\nprint(hot)\nprint(len(hot))",
          ],
        },
      ],
      quiz: [
        {
          q: "`cities = [\"Kuala Lumpur\", \"Penang\", \"Ipoh\"]` — what does `cities[1]` give you?",
          options: ["\"Kuala Lumpur\"", "\"Penang\"", "\"Ipoh\"", "An error"],
          answer: 1,
          explain:
            "Indexes start at 0, so [0] is Kuala Lumpur and [1] is Penang. The last item, Ipoh, is [2] or [-1].",
        },
        {
          q: "After `cart = cart.append(\"milk\")`, what does `cart` hold?",
          options: ["The list with \"milk\" added", "None", "\"milk\"", "A copy of the old list"],
          answer: 1,
          explain:
            "append changes the list in place and returns None, so the assignment throws the list away. Call `cart.append(\"milk\")` on its own line.",
        },
      ],
    },

    {
      id: "m3-slicing",
      title: "Indexing and slicing",
      goal: "Take a run of items with [start:stop], use omitted ends, negative indexes and steps, and know a slice is a copy.",
      keywords: ["slice", "slicing", "start stop", "step", "negative index", "copy", "reverse", "string slicing"],
      exercises: [
        {
          id: "m3-slicing-e1",
          prompt:
            "`days` lists the days of the week. Using slices, print three lines: the **first three** days as a list, the **last two** days as a list, and the whole week **reversed** as a list.",
          starter: "days = [\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\", \"Sun\"]\n",
          solution:
            "days = [\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\", \"Sun\"]\nprint(days[:3])\nprint(days[-2:])\nprint(days[::-1])",
          hints: [
            "`days[:3]` means 'from the start, stop before index 3' — that is three items.",
            "Negative numbers count from the end: `days[-2:]` is the last two.",
            "A step of -1 walks backwards: `days[::-1]`.",
          ],
          expectOutput: true,
          requires: [
            { re: "\\[[^\\[\\]]*:[^\\[\\]]*\\]", msg: "Use slice notation like `days[start:stop]` for this one." },
          ],
          wrong: [
            "days = [\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\", \"Sun\"]\nprint(days[0:2])\nprint(days[-2:])\nprint(days[::-1])",
            "days = [\"Mon\", \"Tue\", \"Wed\", \"Thu\", \"Fri\", \"Sat\", \"Sun\"]\nprint(days[:3])\nprint(days[-1:])\nprint(days[::-1])",
          ],
        },
        {
          id: "m3-slicing-e2",
          prompt:
            "`stamp` is a timestamp in the form `YYYY-MM-DDTHH:MM:SS`. Using slicing, create a variable `date` holding the date part (the first 10 characters) and a variable `clock` holding everything after the `T`. Then print `date` on one line and `clock` on the next.",
          starter: "stamp = \"2026-10-20T14:35:00\"\n# date = ...\n# clock = ...\n",
          solution:
            "stamp = \"2026-10-20T14:35:00\"\ndate = stamp[:10]\nclock = stamp[11:]\nprint(date)\nprint(clock)",
          hints: [
            "Strings slice exactly like lists. `stamp[:10]` is the first ten characters.",
            "Count the positions: the `T` sits at index 10, so the clock starts at index 11.",
            "Leaving out the stop index runs to the end: `stamp[11:]`.",
          ],
          tests:
            "assert 'date' in dir(), \"Create a variable called date\"\nassert 'clock' in dir(), \"Create a variable called clock\"\nassert date == \"2026-10-20\", f\"date should be '2026-10-20', got {date!r}\"\nassert clock == \"14:35:00\", f\"clock should be '14:35:00', got {clock!r}\"",
          expectOutput: true,
          requires: [
            { re: "\\[[^\\[\\]]*:[^\\[\\]]*\\]", msg: "Use slice notation like `stamp[start:stop]` for this one." },
          ],
          wrong: [
            "stamp = \"2026-10-20T14:35:00\"\ndate = stamp[:9]\nclock = stamp[11:]\nprint(date)\nprint(clock)",
            "stamp = \"2026-10-20T14:35:00\"\ndate = stamp[0:10]\nclock = stamp[10:]\nprint(date)\nprint(clock)",
          ],
        },
      ],
      quiz: [
        {
          q: "`nums = [10, 20, 30, 40, 50]` — what is `nums[1:3]`?",
          options: ["[20, 30, 40]", "[20, 30]", "[10, 20, 30]", "[30]"],
          answer: 1,
          explain:
            "A slice starts at the first index and stops just before the second, so 1:3 is indexes 1 and 2 — two items, 20 and 30.",
        },
        {
          q: "After `copy = nums[:]` and then `copy.append(60)`, what has happened to `nums`?",
          options: [
            "It also ends in 60",
            "Nothing — a slice is a new list",
            "It is now None",
            "It raised an error",
          ],
          answer: 1,
          explain:
            "Every slice builds a fresh list, so nums[:] is an independent copy. Only plain assignment (copy = nums) shares the same list.",
        },
      ],
    },

    {
      id: "m3-list-methods",
      title: "List methods and mutation",
      goal: "Change lists in place with the built-in methods, choose between sort() and sorted(), and avoid the aliasing trap.",
      keywords: ["append", "extend", "insert", "remove", "pop", "sort", "sorted", "reverse", "copy", "aliasing", "mutation", "None"],
      exercises: [
        {
          id: "m3-list-methods-e1",
          prompt:
            "`waitlist` is a queue of names. Using list methods: add `\"Ana\"` to the **end**, insert `\"Lee\"` at the **front**, remove `\"Raj\"`, then print `waitlist`.",
          starter: "waitlist = [\"Mei\", \"Raj\", \"Tom\"]\n",
          solution:
            "waitlist = [\"Mei\", \"Raj\", \"Tom\"]\nwaitlist.append(\"Ana\")\nwaitlist.insert(0, \"Lee\")\nwaitlist.remove(\"Raj\")\nprint(waitlist)",
          hints: [
            "`append` adds at the end; `insert(index, item)` adds at a position.",
            "The front is index 0: `waitlist.insert(0, \"Lee\")`.",
            "`waitlist.remove(\"Raj\")` takes out the first \"Raj\". None of these need an `=`.",
          ],
          tests:
            "assert waitlist == [\"Lee\", \"Mei\", \"Tom\", \"Ana\"], f\"waitlist should be ['Lee', 'Mei', 'Tom', 'Ana'], got {waitlist}\"",
          expectOutput: true,
          wrong: [
            "waitlist = [\"Mei\", \"Raj\", \"Tom\"]\nwaitlist.append(\"Ana\")\nwaitlist.append(\"Lee\")\nwaitlist.remove(\"Raj\")\nprint(waitlist)",
            "waitlist = [\"Mei\", \"Raj\", \"Tom\"]\nwaitlist = waitlist.append(\"Ana\")\nwaitlist.insert(0, \"Lee\")\nwaitlist.remove(\"Raj\")\nprint(waitlist)",
          ],
        },
        {
          id: "m3-list-methods-e2",
          prompt:
            "`prices` must keep its original order. Create a **new** list `ranked` holding the same prices from **highest to lowest**, then print `ranked` and on the next line print `prices`.",
          starter: "prices = [45, 12, 89, 30, 67]\n",
          solution:
            "prices = [45, 12, 89, 30, 67]\nranked = sorted(prices, reverse=True)\nprint(ranked)\nprint(prices)",
          hints: [
            "`sorted(prices)` returns a new list and leaves `prices` alone; `.sort()` would change it.",
            "Highest first means `reverse=True`.",
            "`ranked = sorted(prices, reverse=True)`.",
          ],
          tests:
            "assert 'ranked' in dir(), \"Create a list called ranked\"\nassert ranked == [89, 67, 45, 30, 12], f\"ranked should be [89, 67, 45, 30, 12], got {ranked}\"\nassert prices == [45, 12, 89, 30, 67], f\"prices must keep its original order [45, 12, 89, 30, 67], got {prices} — use sorted(), not .sort()\"",
          expectOutput: true,
          wrong: [
            "prices = [45, 12, 89, 30, 67]\nprices.sort(reverse=True)\nranked = prices\nprint(ranked)\nprint(prices)",
            "prices = [45, 12, 89, 30, 67]\nranked = prices.sort(reverse=True)\nprint(ranked)\nprint(prices)",
          ],
        },
        {
          id: "m3-list-methods-e3",
          prompt:
            "This program is meant to keep `backup` as an untouched copy of `original` before sorting — but run it and *both* lists come out sorted. Change **one line** so that `original` ends up sorted and `backup` still holds `[8, 3, 5, 1]`. Keep both prints.",
          starter:
            "original = [8, 3, 5, 1]\nbackup = original\noriginal.sort()\nprint(original)\nprint(backup)\n",
          solution:
            "original = [8, 3, 5, 1]\nbackup = original.copy()\noriginal.sort()\nprint(original)\nprint(backup)",
          hints: [
            "`backup = original` does not copy anything — it gives the same list a second name.",
            "Ask for a real copy: `original.copy()`, `original[:]` or `list(original)`.",
            "`backup = original.copy()` on line 2 is enough.",
          ],
          tests:
            "assert original == [1, 3, 5, 8], f\"original should be sorted to [1, 3, 5, 8], got {original}\"\nassert backup == [8, 3, 5, 1], f\"backup should still be [8, 3, 5, 1], got {backup} — `backup = original` shares one list; make a copy before sorting\"",
          expectOutput: true,
          wrong: [
            "original = [8, 3, 5, 1]\nbackup = original\noriginal.sort()\nbackup = backup[:]\nprint(original)\nprint(backup)",
          ],
        },
      ],
      quiz: [
        {
          q: "`a = [3, 1, 2]`, then `b = a`, then `b.sort()`. What is `a` now?",
          options: ["[3, 1, 2]", "[1, 2, 3]", "None", "An error is raised"],
          answer: 1,
          explain:
            "b = a does not copy; both names point at the same list. Sorting through b sorts the one list that a also refers to.",
        },
        {
          q: "What does `prices = prices.sort()` leave in `prices`?",
          options: [
            "The sorted list",
            "None",
            "A sorted copy, with the original unchanged",
            "A syntax error",
          ],
          answer: 1,
          explain:
            "sort() sorts the list in place and returns None. Assigning that None back to prices loses the list. Use prices.sort() alone, or prices = sorted(prices).",
        },
      ],
    },

    {
      id: "m3-tuples",
      title: "Tuples and unpacking",
      goal: "Use tuples for fixed groups of values and unpack them into named variables.",
      keywords: ["tuple", "unpacking", "immutable", "pair", "swap", "divmod", "one-element tuple"],
      exercises: [
        {
          id: "m3-tuples-e1",
          prompt:
            "`booking` is a tuple of guest name, destination and number of nights. **Unpack** it in one line into three variables `name`, `destination` and `nights`, then print exactly `Aisha is going to Langkawi for 3 nights`.",
          starter: "booking = (\"Aisha\", \"Langkawi\", 3)\n",
          solution:
            "booking = (\"Aisha\", \"Langkawi\", 3)\nname, destination, nights = booking\nprint(f\"{name} is going to {destination} for {nights} nights\")",
          hints: [
            "Three names on the left, the tuple on the right: `a, b, c = booking`.",
            "The names must be in the same order as the items in the tuple.",
            "An f-string builds the sentence: `f\"{name} is going to {destination} for {nights} nights\"`.",
          ],
          tests:
            "assert 'name' in dir() and 'destination' in dir() and 'nights' in dir(), \"Create the variables name, destination and nights\"\nassert name == \"Aisha\", f\"name should be 'Aisha', got {name!r}\"\nassert destination == \"Langkawi\", f\"destination should be 'Langkawi', got {destination!r}\"\nassert nights == 3, f\"nights should be 3, got {nights!r}\"",
          expectOutput: true,
          requires: [
            {
              re: "^\\s*\\w+\\s*,\\s*\\w+\\s*,\\s*\\w+\\s*=",
              msg: "Unpack the tuple in one line: `name, destination, nights = booking`.",
            },
          ],
          wrong: [
            "booking = (\"Aisha\", \"Langkawi\", 3)\nname = booking[0]\ndestination = booking[1]\nnights = booking[2]\nprint(f\"{name} is going to {destination} for {nights} nights\")",
            "booking = (\"Aisha\", \"Langkawi\", 3)\nnights, destination, name = booking\nprint(f\"{name} is going to {destination} for {nights} nights\")",
          ],
        },
        {
          id: "m3-tuples-e2",
          prompt:
            "`results` is a list of `(name, score)` pairs. Loop over it **unpacking each pair in the `for` line** and print one line per pair in the form `Mei scored 82`. After the loop, print `Best: Raj` — the name with the highest score. Work the best out inside the loop rather than typing the name in.",
          starter: "results = [(\"Mei\", 82), (\"Raj\", 95), (\"Tom\", 67), (\"Ana\", 88)]\n",
          solution:
            "results = [(\"Mei\", 82), (\"Raj\", 95), (\"Tom\", 67), (\"Ana\", 88)]\nbest_name = \"\"\nbest_score = 0\nfor name, score in results:\n    print(f\"{name} scored {score}\")\n    if score > best_score:\n        best_score = score\n        best_name = name\nprint(f\"Best: {best_name}\")",
          hints: [
            "`for name, score in results:` unpacks each pair as the loop runs.",
            "Keep two variables before the loop, `best_name` and `best_score`, and update both whenever `score` beats `best_score`.",
            "Print the `Best:` line after the loop, using `best_name`, not the score.",
          ],
          expectOutput: true,
          requires: [
            {
              re: "\\bfor\\s+\\w+\\s*,\\s*\\w+\\s+in\\b",
              msg: "Unpack each pair in the for line: `for name, score in results:`.",
            },
          ],
          wrong: [
            "results = [(\"Mei\", 82), (\"Raj\", 95), (\"Tom\", 67), (\"Ana\", 88)]\nbest = 0\nfor name, score in results:\n    print(f\"{name} scored {score}\")\n    if score > best:\n        best = score\nprint(f\"Best: {best}\")",
            "results = [(\"Mei\", 82), (\"Raj\", 95), (\"Tom\", 67), (\"Ana\", 88)]\nfor item in results:\n    print(f\"{item[0]} scored {item[1]}\")\nprint(\"Best: Raj\")",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `type((5))` print?",
          options: ["<class 'tuple'>", "<class 'int'>", "<class 'list'>", "A syntax error"],
          answer: 1,
          explain:
            "Brackets alone do not make a tuple — the comma does. (5) is just the number 5; (5,) is a one-element tuple.",
        },
        {
          q: "What happens on `a, b = (1, 2, 3)`?",
          options: [
            "a is 1, b is 2 and the 3 is dropped",
            "a is 1 and b is (2, 3)",
            "ValueError: too many values to unpack",
            "a is (1, 2) and b is 3",
          ],
          answer: 2,
          explain:
            "Plain unpacking needs exactly as many names as items. Two names for three items is a ValueError.",
        },
      ],
    },

    {
      id: "m3-dicts",
      title: "Dictionaries",
      goal: "Store values under keys, look them up, add, change and delete entries, and handle keys that are missing.",
      keywords: ["dict", "dictionary", "key", "value", "KeyError", "del", "keys", "values", "in", "lookup"],
      exercises: [
        {
          id: "m3-dicts-e1",
          prompt:
            "`stock` counts items in a shop. Add `\"bananas\"` with a count of 20, change `\"pears\"` to 10, delete `\"apples\"`, then print `stock` and on the next line print how many different items it holds.",
          starter: "stock = {\"apples\": 12, \"pears\": 4}\n",
          solution:
            "stock = {\"apples\": 12, \"pears\": 4}\nstock[\"bananas\"] = 20\nstock[\"pears\"] = 10\ndel stock[\"apples\"]\nprint(stock)\nprint(len(stock))",
          hints: [
            "Assigning to a key adds it if it is new and replaces the value if it already exists: `stock[\"bananas\"] = 20`.",
            "`del stock[\"apples\"]` removes a key and its value.",
            "`len(stock)` counts the keys.",
          ],
          tests:
            "assert stock == {\"pears\": 10, \"bananas\": 20}, f\"stock should be {{'pears': 10, 'bananas': 20}}, got {stock}\"",
          expectOutput: true,
          wrong: [
            "stock = {\"apples\": 12, \"pears\": 4}\nstock[\"bananas\"] = 20\nstock[\"pears\"] = 10\nprint(stock)\nprint(len(stock))",
            "stock = {\"apples\": 12, \"pears\": 4}\nstock[\"bananas\"] = 20\nstock[\"pears\"] += 10\ndel stock[\"apples\"]\nprint(stock)\nprint(len(stock))",
          ],
        },
        {
          id: "m3-dicts-e2",
          prompt:
            "`menu` maps dishes to prices and `orders` is what one table asked for. For each item in `orders`, in order, print `nasi lemak: 8.5` if it is on the menu, or `laksa: not available` if it is not. After the loop print `Total: 13.5` — the sum of the prices that were found.",
          starter:
            "menu = {\"nasi lemak\": 8.5, \"roti canai\": 2.0, \"teh tarik\": 3.0}\norders = [\"nasi lemak\", \"teh tarik\", \"laksa\", \"roti canai\"]\n",
          solution:
            "menu = {\"nasi lemak\": 8.5, \"roti canai\": 2.0, \"teh tarik\": 3.0}\norders = [\"nasi lemak\", \"teh tarik\", \"laksa\", \"roti canai\"]\ntotal = 0\nfor item in orders:\n    if item in menu:\n        print(f\"{item}: {menu[item]}\")\n        total += menu[item]\n    else:\n        print(f\"{item}: not available\")\nprint(f\"Total: {total}\")",
          hints: [
            "`if item in menu:` checks whether the key exists before you look it up.",
            "Only add to the total inside the `if` branch — a missing dish has no price.",
            "Start `total = 0` before the loop and print `f\"Total: {total}\"` after it.",
          ],
          expectOutput: true,
          wrong: [
            "menu = {\"nasi lemak\": 8.5, \"roti canai\": 2.0, \"teh tarik\": 3.0}\norders = [\"nasi lemak\", \"teh tarik\", \"laksa\", \"roti canai\"]\ntotal = 0\nfor item in orders:\n    print(f\"{item}: {menu[item]}\")\n    total += menu[item]\nprint(f\"Total: {total}\")",
            "menu = {\"nasi lemak\": 8.5, \"roti canai\": 2.0, \"teh tarik\": 3.0}\norders = [\"nasi lemak\", \"teh tarik\", \"laksa\", \"roti canai\"]\nfor item in orders:\n    if item in menu:\n        print(f\"{item}: {menu[item]}\")\n    else:\n        print(f\"{item}: not available\")",
          ],
        },
      ],
      quiz: [
        {
          q: "`prices = {\"bread\": 3.5}` — what does `prices[\"butter\"]` give you?",
          options: ["None", "0", "A KeyError", "An empty dictionary"],
          answer: 2,
          explain:
            "Looking up a key that is not there is an error, not an empty result. Check with `in` first, or use .get() with a default.",
        },
        {
          q: "In `for x in prices:`, what does `x` take on each time round?",
          options: ["Each key", "Each value", "Each (key, value) pair", "Each index, 0, 1, 2…"],
          answer: 0,
          explain:
            "Looping over a dictionary gives you its keys. Use prices[x] for the value, or .items() to get both at once.",
        },
      ],
    },

    {
      id: "m3-dict-patterns",
      title: "Dictionary patterns",
      goal: "Use get, setdefault and items() to count, group, loop over and sort dictionaries, and model records with nested dicts.",
      keywords: ["get", "default", "counting", "setdefault", "items", "nested dict", "records", "invert", "sort by value", "Counter"],
      exercises: [
        {
          id: "m3-dict-patterns-e1",
          prompt:
            "`sales` lists the drink sold with each order. Build a dictionary `counts` that maps each drink to the number of times it was sold. Then print one line per drink in the form `latte: 3`, in the order the drinks first appear in `sales`.",
          starter: "sales = [\"latte\", \"tea\", \"latte\", \"mocha\", \"tea\", \"latte\", \"tea\"]\ncounts = {}\n",
          solution:
            "sales = [\"latte\", \"tea\", \"latte\", \"mocha\", \"tea\", \"latte\", \"tea\"]\ncounts = {}\nfor drink in sales:\n    counts[drink] = counts.get(drink, 0) + 1\nfor drink, n in counts.items():\n    print(f\"{drink}: {n}\")",
          hints: [
            "For each drink, look up its current count with a default of 0, add one, and store it back.",
            "`counts[drink] = counts.get(drink, 0) + 1` does all three in one line.",
            "Dictionaries keep insertion order, so `for drink, n in counts.items():` already prints them in first-seen order.",
          ],
          tests:
            "assert 'counts' in dir(), \"Keep the dictionary called counts\"\nassert dict(counts) == {\"latte\": 3, \"tea\": 3, \"mocha\": 1}, f\"counts should be {{'latte': 3, 'tea': 3, 'mocha': 1}}, got {dict(counts)}\"",
          expectOutput: true,
          wrong: [
            "sales = [\"latte\", \"tea\", \"latte\", \"mocha\", \"tea\", \"latte\", \"tea\"]\ncounts = {}\nfor drink in sales:\n    counts[drink] += 1\nfor drink, n in counts.items():\n    print(f\"{drink}: {n}\")",
            "sales = [\"latte\", \"tea\", \"latte\", \"mocha\", \"tea\", \"latte\", \"tea\"]\ncounts = {}\nfor drink in sales:\n    counts[drink] = 1\nfor drink, n in counts.items():\n    print(f\"{drink}: {n}\")",
          ],
        },
        {
          id: "m3-dict-patterns-e2",
          prompt:
            "`goals` maps each player to the goals they scored this season. Print one line per player, **highest scorer first**, in the form `Raj: 12`.",
          starter: "goals = {\"Mei\": 7, \"Raj\": 12, \"Tom\": 9, \"Ana\": 4}\n",
          solution:
            "goals = {\"Mei\": 7, \"Raj\": 12, \"Tom\": 9, \"Ana\": 4}\nfor name in sorted(goals, key=goals.get, reverse=True):\n    print(f\"{name}: {goals[name]}\")",
          hints: [
            "`sorted(goals)` would sort the names alphabetically; you want them ranked by their value.",
            "`key=goals.get` tells sorted to rank each name by what goals.get(name) returns.",
            "`reverse=True` puts the biggest first: `for name in sorted(goals, key=goals.get, reverse=True):`.",
          ],
          expectOutput: true,
          wrong: [
            "goals = {\"Mei\": 7, \"Raj\": 12, \"Tom\": 9, \"Ana\": 4}\nfor name, n in goals.items():\n    print(f\"{name}: {n}\")",
            "goals = {\"Mei\": 7, \"Raj\": 12, \"Tom\": 9, \"Ana\": 4}\nfor name in sorted(goals, key=goals.get):\n    print(f\"{name}: {goals[name]}\")",
          ],
        },
      ],
      quiz: [
        {
          q: "`counts = {}` and then `counts[\"latte\"] += 1`. What happens?",
          options: ["counts becomes {'latte': 1}", "A KeyError", "counts becomes {'latte': None}", "A TypeError"],
          answer: 1,
          explain:
            "+= reads the current value first, and there is none. Use counts.get(\"latte\", 0) + 1, which supplies 0 for a key that is not there yet.",
        },
        {
          q: "What does `d.setdefault(\"k\", [])` return when `\"k\"` is already in `d`?",
          options: ["A new empty list", "The existing value of d[\"k\"]", "None", "True"],
          answer: 1,
          explain:
            "setdefault only stores the default when the key is missing. Either way it returns whatever is now under that key, so you can append to it immediately.",
        },
      ],
    },

    {
      id: "m3-sets",
      title: "Sets",
      goal: "Use sets to remove duplicates, test membership quickly, and combine or compare collections.",
      keywords: ["set", "unique", "duplicates", "union", "intersection", "difference", "membership", "unordered", "hashable"],
      exercises: [
        {
          id: "m3-sets-e1",
          prompt:
            "`signups` is every email address entered on a form, and some people signed up more than once. Print how many **distinct** addresses there are, then print each distinct address on its own line in alphabetical order.",
          starter:
            "signups = [\"mei@mail.com\", \"raj@mail.com\", \"mei@mail.com\", \"tom@mail.com\", \"raj@mail.com\", \"mei@mail.com\"]\n",
          solution:
            "signups = [\"mei@mail.com\", \"raj@mail.com\", \"mei@mail.com\", \"tom@mail.com\", \"raj@mail.com\", \"mei@mail.com\"]\nunique = set(signups)\nprint(len(unique))\nfor email in sorted(unique):\n    print(email)",
          hints: [
            "`set(signups)` throws away the duplicates.",
            "`len()` works on a set just like a list.",
            "Sets have no order — wrap it in `sorted()` before you loop and print.",
          ],
          expectOutput: true,
          wrong: [
            "signups = [\"mei@mail.com\", \"raj@mail.com\", \"mei@mail.com\", \"tom@mail.com\", \"raj@mail.com\", \"mei@mail.com\"]\nprint(len(signups))\nfor email in sorted(set(signups)):\n    print(email)",
            "signups = [\"mei@mail.com\", \"raj@mail.com\", \"mei@mail.com\", \"tom@mail.com\", \"raj@mail.com\", \"mei@mail.com\"]\nunique = set(signups)\nprint(len(unique))\nfor email in sorted(signups):\n    print(email)",
          ],
        },
        {
          id: "m3-sets-e2",
          prompt:
            "`morning` and `evening` are the people who attended each session. Create three sets: `both` (attended both sessions), `only_morning` (morning but not evening) and `everyone` (attended at least one). Then print each one as a **sorted list**, in that order — three lines.",
          starter:
            "morning = {\"Mei\", \"Raj\", \"Tom\", \"Ana\"}\nevening = {\"Raj\", \"Lee\", \"Ana\", \"Sam\"}\n",
          solution:
            "morning = {\"Mei\", \"Raj\", \"Tom\", \"Ana\"}\nevening = {\"Raj\", \"Lee\", \"Ana\", \"Sam\"}\nboth = morning & evening\nonly_morning = morning - evening\neveryone = morning | evening\nprint(sorted(both))\nprint(sorted(only_morning))\nprint(sorted(everyone))",
          hints: [
            "`&` is intersection (in both), `|` is union (in either), `-` is difference (in the first but not the second).",
            "`morning - evening` keeps the morning people who did not come in the evening.",
            "`print(sorted(both))` prints a sorted list, which has a predictable order.",
          ],
          tests:
            "assert 'both' in dir() and 'only_morning' in dir() and 'everyone' in dir(), \"Create both, only_morning and everyone\"\nassert set(both) == {\"Raj\", \"Ana\"}, f\"both should hold Raj and Ana, got {sorted(both)}\"\nassert set(only_morning) == {\"Mei\", \"Tom\"}, f\"only_morning should hold Mei and Tom, got {sorted(only_morning)}\"\nassert set(everyone) == {\"Mei\", \"Raj\", \"Tom\", \"Ana\", \"Lee\", \"Sam\"}, f\"everyone should hold all six names, got {sorted(everyone)}\"",
          expectOutput: true,
          wrong: [
            "morning = {\"Mei\", \"Raj\", \"Tom\", \"Ana\"}\nevening = {\"Raj\", \"Lee\", \"Ana\", \"Sam\"}\nboth = morning & evening\nonly_morning = morning | evening\neveryone = morning | evening\nprint(sorted(both))\nprint(sorted(only_morning))\nprint(sorted(everyone))",
            "morning = {\"Mei\", \"Raj\", \"Tom\", \"Ana\"}\nevening = {\"Raj\", \"Lee\", \"Ana\", \"Sam\"}\nboth = morning & evening\nonly_morning = morning - evening\neveryone = morning + evening\nprint(sorted(both))\nprint(sorted(only_morning))\nprint(sorted(everyone))",
          ],
        },
      ],
      quiz: [
        {
          q: "What is `len({1, 2, 2, 3, 3, 3})`?",
          options: ["6", "3", "1", "An error"],
          answer: 1,
          explain:
            "A set keeps each value once, so the duplicates vanish as the set is built and three values remain.",
        },
        {
          q: "What does `{}` create?",
          options: ["An empty set", "An empty dictionary", "An empty list", "None"],
          answer: 1,
          explain:
            "Curly brackets with nothing inside are an empty dict, because dicts came first. The empty set is written set().",
        },
      ],
    },
  ],
};
