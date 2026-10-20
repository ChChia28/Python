/* Module 4 — Functions ------------------------------------------------- */

export default {
  id: "functions",
  number: 4,
  title: "Functions",
  level: "Intermediate",
  summary:
    "Defining and calling functions, return values, parameters and defaults, scope, *args/**kwargs, lambdas and functions as values, and writing clean functions.",
  packages: [],
  lessons: [
    {
      id: "m4-def",
      title: "Defining and calling functions",
      goal: "Write a function with def, call it with arguments, and know why the definition must come first.",
      keywords: ["def", "function", "call", "parameter", "argument", "reuse"],
      exercises: [
        {
          id: "m4-def-e1",
          prompt:
            "Define a function called `welcome` that takes one parameter, `name`, and prints `Welcome aboard, <name>!` — for example `Welcome aboard, Aisha!`. Then call it three times, for `Aisha`, `Daniel` and `Mei Ling`, in that order.",
          starter: "# define welcome here\n\n\n# then call it three times\n",
          solution:
            'def welcome(name):\n    print(f"Welcome aboard, {name}!")\n\nwelcome("Aisha")\nwelcome("Daniel")\nwelcome("Mei Ling")',
          hints: [
            "A definition starts with `def welcome(name):` and the body is indented underneath.",
            "Inside the body, an f-string builds the message: `f\"Welcome aboard, {name}!\"`.",
            "Calling is the name plus parentheses with the argument inside: `welcome(\"Aisha\")`.",
          ],
          expectOutput: true,
          tests:
            'import io, contextlib\nassert "welcome" in dir(), "Define a function called welcome"\nassert callable(welcome), "welcome should be a function — did you use def?"\n_buf = io.StringIO()\nwith contextlib.redirect_stdout(_buf):\n    welcome("Lee")\n_out = _buf.getvalue()\nassert _out == "Welcome aboard, Lee!\\n", f"welcome(\'Lee\') should print exactly \'Welcome aboard, Lee!\', got {_out!r}"',
          requires: [{ re: "\\bdef\\s+welcome\\s*\\(", msg: "Define the function with `def welcome(name):`." }],
          wrong: [
            'print("Welcome aboard, Aisha!")\nprint("Welcome aboard, Daniel!")\nprint("Welcome aboard, Mei Ling!")',
            'def welcome(name):\n    print(f"Welcome aboard, {name}!")\n\nwelcome("Aisha")\nwelcome("Daniel")',
          ],
        },
        {
          id: "m4-def-e2",
          prompt:
            "Define a function called `print_line_item` with three parameters — `item`, `quantity`, `unit_price` — that prints one line in the format `<quantity> x <item> = RM<total>`, where the total is `quantity * unit_price` shown with exactly two decimal places (for example `4 x Roti canai = RM6.00`). Then loop over `basket` and call `print_line_item` once for every entry, in order.",
          starter:
            'basket = [("Roti canai", 4, 1.50), ("Kopi", 2, 2.80), ("Curry puff", 6, 1.20)]\n\n# define print_line_item here, above the loop\n\n\nfor item, quantity, price in basket:\n    pass  # call print_line_item here\n',
          solution:
            'basket = [("Roti canai", 4, 1.50), ("Kopi", 2, 2.80), ("Curry puff", 6, 1.20)]\n\ndef print_line_item(item, quantity, unit_price):\n    total = quantity * unit_price\n    print(f"{quantity} x {item} = RM{total:.2f}")\n\nfor item, quantity, price in basket:\n    print_line_item(item, quantity, price)',
          hints: [
            "The `def` line lists all three parameters: `def print_line_item(item, quantity, unit_price):`.",
            "`:.2f` inside an f-string placeholder shows a number with two decimals: `f\"RM{total:.2f}\"`.",
            "Inside the loop, pass the three loop variables as arguments: `print_line_item(item, quantity, price)`.",
          ],
          expectOutput: true,
          tests:
            'import io, contextlib\nassert "print_line_item" in dir(), "Define a function called print_line_item"\n_buf = io.StringIO()\nwith contextlib.redirect_stdout(_buf):\n    print_line_item("Teh tarik", 3, 2.50)\n_out = _buf.getvalue()\nassert _out == "3 x Teh tarik = RM7.50\\n", f"print_line_item(\'Teh tarik\', 3, 2.50) should print exactly \'3 x Teh tarik = RM7.50\', got {_out!r}"\n_buf = io.StringIO()\nwith contextlib.redirect_stdout(_buf):\n    print_line_item("Milo", 1, 3)\n_out = _buf.getvalue()\nassert _out == "1 x Milo = RM3.00\\n", f"The total must always show two decimals: print_line_item(\'Milo\', 1, 3) should print \'1 x Milo = RM3.00\', got {_out!r}"',
          wrong: [
            'basket = [("Roti canai", 4, 1.50), ("Kopi", 2, 2.80), ("Curry puff", 6, 1.20)]\n\ndef print_line_item(item, quantity, unit_price):\n    print(f"{quantity} x {item} = RM{quantity * unit_price}")\n\nfor item, quantity, price in basket:\n    print_line_item(item, quantity, price)',
            'basket = [("Roti canai", 4, 1.50), ("Kopi", 2, 2.80), ("Curry puff", 6, 1.20)]\n\nfor item, quantity, price in basket:\n    print(f"{quantity} x {item} = RM{quantity * price:.2f}")',
          ],
        },
      ],
      quiz: [
        {
          q: "A file contains only a definition — `def greet(name): print(f\"Hi, {name}!\")` — and nothing else. What appears on screen when it runs?",
          options: ["Hi, name!", "Nothing", "A NameError", "Hi, !"],
          answer: 1,
          explain:
            "def stores the function under its name; it does not run the body. Nothing is printed until something calls greet(...).",
        },
        {
          q: "In `def total(a, b):`, what are `a` and `b` called?",
          options: ["Parameters", "Arguments", "Return values", "Keywords"],
          answer: 0,
          explain:
            "The names in the def line are parameters. The actual values you pass in a call, like total(3, 4), are arguments.",
        },
      ],
    },

    {
      id: "m4-return",
      title: "return vs print",
      goal: "Hand a value back with return, know that a function without return gives None, and use early returns.",
      keywords: ["return", "print", "None", "early return", "tuple", "multiple return values"],
      exercises: [
        {
          id: "m4-return-e1",
          prompt:
            "Define a function called `rectangle_area` that takes two parameters, `width` and `height`, and **returns** their product. Do not print anything inside the function.",
          starter: "def rectangle_area(width, height):\n    print(width * height)\n",
          solution: "def rectangle_area(width, height):\n    return width * height",
          hints: [
            "The function currently prints the answer, so the caller gets None back.",
            "Replace `print` with `return`.",
            "`return width * height` hands the number back to whoever called the function.",
          ],
          tests:
            'assert "rectangle_area" in dir(), "Define a function called rectangle_area"\n_r = rectangle_area(2, 3)\nassert _r is not None, "rectangle_area(2, 3) returned None — use return, not print"\nassert _r == 6, f"rectangle_area(2, 3) should return 6, got {_r!r}"\nassert rectangle_area(0, 5) == 0, "rectangle_area(0, 5) should return 0"\nassert rectangle_area(2.5, 4) == 10.0, "rectangle_area(2.5, 4) should return 10.0"\nassert rectangle_area(7, 7) == 49, "rectangle_area(7, 7) should return 49"',
          wrong: [
            "def rectangle_area(width, height):\n    area = width * height\n    print(area)",
            "def rectangle_area(width, height):\n    return width + height",
          ],
        },
        {
          id: "m4-return-e2",
          prompt:
            "Define a function called `first_negative` that takes one parameter, `numbers` (a list), and returns the **first** number in the list that is below zero. If there is no negative number — including when the list is empty — return `None`.",
          starter: "def first_negative(numbers):\n    for n in numbers:\n        pass\n",
          solution:
            "def first_negative(numbers):\n    for n in numbers:\n        if n < 0:\n            return n\n    return None",
          hints: [
            "Loop over the numbers and test each one with `if n < 0:`.",
            "`return` inside the `if` stops the function at the first match — nothing after it runs.",
            "After the loop finishes without returning, `return None` handles the 'not found' case.",
          ],
          tests:
            'assert "first_negative" in dir(), "Define a function called first_negative"\n_r = first_negative([3, -2, 5, -9])\nassert _r == -2, f"first_negative([3, -2, 5, -9]) should return -2 (the first negative), got {_r!r}"\n_r = first_negative([1, 2, 3])\nassert _r is None, f"first_negative([1, 2, 3]) has no negatives, so it should return None, got {_r!r}"\n_r = first_negative([])\nassert _r is None, f"first_negative([]) should return None for an empty list, got {_r!r}"\n_r = first_negative([-7])\nassert _r == -7, f"first_negative([-7]) should return -7, got {_r!r}"\n_r = first_negative([0, 4, -1])\nassert _r == -1, f"first_negative([0, 4, -1]) should return -1 (zero is not negative), got {_r!r}"',
          wrong: [
            "def first_negative(numbers):\n    for n in numbers:\n        return n\n    return None",
            "def first_negative(numbers):\n    return [n for n in numbers if n < 0]",
            "def first_negative(numbers):\n    for n in numbers:\n        if n < 0:\n            print(n)\n            return",
          ],
        },
      ],
      quiz: [
        {
          q: "`def shout(word): print(word.upper())` — then `result = shout(\"hi\")` and `print(result)`. What is printed?",
          options: ["HI then HI", "HI then None", "HI only", "A TypeError"],
          answer: 1,
          explain:
            "shout prints HI itself, but it has no return statement, so the call evaluates to None — and that is what the second print shows.",
        },
        {
          q: "What does `return lowest, highest` give back to the caller?",
          options: [
            "Only lowest — the rest is ignored",
            "A tuple holding both values",
            "A list holding both values",
            "A SyntaxError",
          ],
          answer: 1,
          explain:
            "The comma makes a tuple. The caller can unpack it straight into two names: low, high = min_max(numbers).",
        },
      ],
    },

    {
      id: "m4-params",
      title: "Default values and keyword arguments",
      goal: "Give parameters defaults, call with keyword arguments, and avoid the mutable default trap.",
      keywords: ["default", "keyword argument", "optional", "mutable default", "None"],
      exercises: [
        {
          id: "m4-params-e1",
          prompt:
            "Define a function called `format_price` with parameters `amount`, `currency` (default `\"RM\"`) and `decimals` (default `2`). It returns a string: the currency text immediately followed by the amount shown with exactly `decimals` digits after the decimal point. For example `format_price(12.5)` returns `\"RM12.50\"`, `format_price(12.5, \"USD\")` returns `\"USD12.50\"`, and `format_price(3, decimals=0)` returns `\"RM3\"`.",
          starter: "def format_price(amount, currency, decimals):\n    pass\n",
          solution:
            'def format_price(amount, currency="RM", decimals=2):\n    return f"{currency}{amount:.{decimals}f}"',
          hints: [
            "Give the last two parameters defaults in the def line: `currency=\"RM\", decimals=2`.",
            "An f-string can take the number of decimals from a variable: `f\"{amount:.{decimals}f}\"`.",
            "Put the currency in front: `f\"{currency}{amount:.{decimals}f}\"`, and return that string.",
          ],
          tests:
            'assert "format_price" in dir(), "Define a function called format_price"\n_r = format_price(12.5)\nassert _r == "RM12.50", f"format_price(12.5) should return \'RM12.50\' (currency defaults to RM, decimals to 2), got {_r!r}"\n_r = format_price(12.5, "USD")\nassert _r == "USD12.50", f"format_price(12.5, \'USD\') should return \'USD12.50\', got {_r!r}"\n_r = format_price(3, decimals=0)\nassert _r == "RM3", f"format_price(3, decimals=0) should return \'RM3\', got {_r!r}"\n_r = format_price(1234.567, currency="$", decimals=1)\nassert _r == "$1234.6", f"format_price(1234.567, currency=\'$\', decimals=1) should return \'$1234.6\', got {_r!r}"\n_r = format_price(0)\nassert _r == "RM0.00", f"format_price(0) should return \'RM0.00\', got {_r!r}"',
          wrong: [
            'def format_price(amount, currency, decimals):\n    return f"{currency}{amount:.{decimals}f}"',
            'def format_price(amount, currency="RM", decimals=2):\n    return f"{currency}{round(amount, decimals)}"',
          ],
        },
        {
          id: "m4-params-e2",
          prompt:
            "This `add_tag` function is meant to append `tag` to a list of tags and return the list — and when no list is given, to start a **fresh** list every call. Right now every call without a list shares the same list. Fix it: define `add_tag(tag, tags=None)` so that `add_tag(\"urgent\")` returns `[\"urgent\"]`, a later `add_tag(\"later\")` returns `[\"later\"]`, and `add_tag(\"paid\", existing)` appends to the list `existing` you were given (even if that list is empty) and returns that same list.",
          starter:
            'def add_tag(tag, tags=[]):\n    tags.append(tag)\n    return tags\n\nprint(add_tag("urgent"))\nprint(add_tag("later"))\n',
          solution:
            'def add_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    tags.append(tag)\n    return tags\n\nprint(add_tag("urgent"))\nprint(add_tag("later"))',
          hints: [
            "The default list is built once, when Python reads the def line, and reused by every call.",
            "Use `None` as the default, then create the list inside the body when needed.",
            "`if tags is None: tags = []` — then append and return as before. Test with `is None`, not `if not tags`, so an empty list passed in is still used.",
          ],
          tests:
            'assert "add_tag" in dir(), "Define a function called add_tag"\n_first = add_tag("urgent")\nassert _first == ["urgent"], f"add_tag(\'urgent\') should return [\'urgent\'], got {_first!r}"\n_second = add_tag("later")\nassert _second == ["later"], f"A second call add_tag(\'later\') with no list should start a fresh list and return [\'later\'], got {_second!r} — the default list is being shared between calls"\n_existing = ["invoice"]\n_result = add_tag("paid", _existing)\nassert _result == ["invoice", "paid"], f"add_tag(\'paid\', [\'invoice\']) should return [\'invoice\', \'paid\'], got {_result!r}"\nassert _result is _existing, "When a list is passed in, add_tag should append to that same list and return it, not build a new one"\n_empty = []\nadd_tag("first", _empty)\nassert _empty == ["first"], f"add_tag(\'first\', empty_list) should append to the list it was given even when it is empty — check with \'is None\', not \'or []\' or \'if not tags\'. The list was {_empty!r} afterwards"',
          wrong: [
            'def add_tag(tag, tags=[]):\n    tags.append(tag)\n    return tags',
            'def add_tag(tag, tags=None):\n    tags = tags or []\n    tags.append(tag)\n    return tags',
            'def add_tag(tag, tags=None):\n    if tags is None:\n        tags = []\n    return tags + [tag]',
          ],
        },
      ],
      quiz: [
        {
          q: "`def add_item(item, cart=[]): cart.append(item); return cart` — after `add_item(\"milk\")`, what does `add_item(\"eggs\")` return?",
          options: ['["eggs"]', '["milk", "eggs"]', "None", "A TypeError"],
          answer: 1,
          explain:
            "The default list is created once, when the def line runs, and every call that relies on the default appends to that same list. Use None as the default and build the list inside the function.",
        },
        {
          q: "Which def line is a SyntaxError?",
          options: ["def f(a, b=2):", "def f(a=1, b):", "def f(a=1, b=2):", "def f(a, b):"],
          answer: 1,
          explain:
            "A parameter without a default cannot follow one with a default — Python could not tell which parameter a single argument belongs to. Required parameters come first.",
        },
      ],
    },

    {
      id: "m4-scope",
      title: "Scope",
      goal: "Know which variables a function can see, why assigning makes a name local, and why to pass values in and return them out instead of using global.",
      keywords: ["scope", "local", "global", "UnboundLocalError", "constant", "shadowing"],
      exercises: [
        {
          id: "m4-scope-e1",
          prompt:
            "The code below crashes with `UnboundLocalError`, because `deposit` assigns to `balance` and so treats it as local. Rewrite it the clean way: define `deposit(balance, amount)` that takes the current balance **as a parameter** and **returns** the new balance (`balance + amount`). Do not use the `global` keyword, and do not change any variable outside the function. Keep the `balance = 100` line and print `deposit(balance, 50)` at the end.",
          starter:
            "balance = 100\n\ndef deposit(amount):\n    balance = balance + amount\n    return balance\n\nprint(deposit(50))\n",
          solution:
            "balance = 100\n\ndef deposit(balance, amount):\n    return balance + amount\n\nprint(deposit(balance, 50))",
          hints: [
            "Add `balance` as the first parameter so the function receives the current value instead of reaching outside.",
            "The body becomes a single line: return the sum.",
            "At the call site, pass the global in: `deposit(balance, 50)`.",
          ],
          expectOutput: true,
          tests:
            'assert "deposit" in dir(), "Define a function called deposit"\n_r = deposit(100, 50)\nassert _r == 150, f"deposit(100, 50) should return 150, got {_r!r}"\nassert deposit(0, 0) == 0, "deposit(0, 0) should return 0"\nassert deposit(10.5, 2.25) == 12.75, "deposit(10.5, 2.25) should return 12.75"\nbalance = 100\n_new = deposit(balance, 25)\nassert _new == 125, f"deposit(balance, 25) with balance = 100 should return 125, got {_new!r}"\nassert balance == 100, "deposit should not change the balance variable outside the function — return the new value and let the caller store it"',
          requires: [
            {
              re: "\\bglobal\\b",
              not: true,
              msg: "Solve this without the global keyword — pass the balance in as a parameter and return the new one.",
            },
          ],
          wrong: [
            "balance = 100\n\ndef deposit(amount):\n    global balance\n    balance = balance + amount\n    return balance\n\nprint(deposit(50))",
            "balance = 100\n\ndef deposit(balance, amount):\n    print(balance + amount)\n\nprint(deposit(balance, 50))",
          ],
        },
        {
          id: "m4-scope-e2",
          prompt:
            "`TAX_RATE` is a constant defined at the top of the file. Define a function called `with_tax` that takes one parameter, `price`, and returns the price with tax added — `price * (1 + TAX_RATE)` rounded to 2 decimal places. Read `TAX_RATE` from the global scope inside the function; do not pass it in, hard-code `0.06`, or create your own `TAX_RATE` inside the function.",
          starter: "TAX_RATE = 0.06\n\n# define with_tax below\n",
          solution: "TAX_RATE = 0.06\n\ndef with_tax(price):\n    return round(price * (1 + TAX_RATE), 2)",
          hints: [
            "Reading a global inside a function needs nothing special — just use the name.",
            "`round(value, 2)` rounds to two decimal places.",
            "`return round(price * (1 + TAX_RATE), 2)`.",
          ],
          tests:
            'assert "with_tax" in dir(), "Define a function called with_tax"\n_r = with_tax(100)\nassert _r == 106.0, f"with_tax(100) should return 106.0, got {_r!r}"\nassert with_tax(0) == 0, "with_tax(0) should return 0"\n_r = with_tax(24.90)\nassert _r == 26.39, f"with_tax(24.90) should return 26.39 (rounded to 2 decimals), got {_r!r}"\nTAX_RATE = 0.10\n_r = with_tax(100)\nassert _r == 110.0, f"with_tax should read TAX_RATE each time it runs: after setting TAX_RATE = 0.10, with_tax(100) should be 110.0 but got {_r!r}. Do not hard-code 0.06 or create a TAX_RATE inside the function"',
          wrong: [
            "TAX_RATE = 0.06\n\ndef with_tax(price):\n    return round(price * 1.06, 2)",
            "TAX_RATE = 0.06\n\ndef with_tax(price):\n    TAX_RATE = 0.06\n    return round(price * (1 + TAX_RATE), 2)",
          ],
        },
      ],
      quiz: [
        {
          q: "`visits = 0` at the top of the file, then `def record(): visits = visits + 1`. What happens when `record()` is called?",
          options: [
            "visits becomes 1",
            "UnboundLocalError — visits is local to record because it is assigned there",
            "NameError — functions cannot see global variables",
            "Nothing; the function silently does nothing",
          ],
          answer: 1,
          explain:
            "Because the body assigns to visits, Python treats visits as local for the whole function — and on the right-hand side it has no value yet. Pass the count in and return the new one instead.",
        },
        {
          q: "A function reads a global constant like `TAX_RATE` without assigning to it. This…",
          options: [
            "works — reading a global inside a function is normal",
            "needs `global TAX_RATE` first",
            "is a SyntaxError",
            "makes a local copy that goes stale",
          ],
          answer: 0,
          explain:
            "Python looks in the local scope first and then the global one, so reading works. Only assigning to the name inside the function makes it local.",
        },
      ],
    },

    {
      id: "m4-args",
      title: "*args and **kwargs",
      goal: "Accept any number of arguments, unpack a list or dict into a call, and forward arguments to another function.",
      keywords: ["*args", "**kwargs", "variable arguments", "unpacking", "forwarding", "star"],
      exercises: [
        {
          id: "m4-args-e1",
          prompt:
            "Define a function called `average` that accepts **any number** of positional arguments using a star parameter `*numbers`, and returns their mean as a float. With no arguments at all it returns `0.0` instead of crashing. For example `average(2, 4, 6)` returns `4.0` and `average()` returns `0.0`.",
          starter: "def average(numbers):\n    return sum(numbers) / len(numbers)\n",
          solution: "def average(*numbers):\n    if not numbers:\n        return 0.0\n    return sum(numbers) / len(numbers)",
          hints: [
            "A star in front of the parameter collects every positional argument into a tuple: `def average(*numbers):`.",
            "Inside, `numbers` is a tuple — `sum()` and `len()` work on it directly.",
            "Guard the empty case first: `if not numbers: return 0.0`.",
          ],
          tests:
            'assert "average" in dir(), "Define a function called average"\n_r = average(2, 4, 6)\nassert _r == 4.0, f"average(2, 4, 6) should return 4.0, got {_r!r}"\n_r = average(5)\nassert _r == 5.0, f"average(5) should return 5.0, got {_r!r}"\n_r = average()\nassert _r == 0.0, f"average() with no arguments should return 0.0, got {_r!r}"\n_r = average(1, 2)\nassert _r == 1.5, f"average(1, 2) should return 1.5, got {_r!r}"\n_r = average(10, 20, 30, 40)\nassert _r == 25.0, f"average(10, 20, 30, 40) should return 25.0, got {_r!r}"',
          requires: [
            {
              re: "\\bdef\\s+average\\s*\\(\\s*\\*",
              msg: "Give average a star parameter — `def average(*numbers):` — so it accepts any number of arguments.",
            },
          ],
          wrong: [
            "def average(numbers):\n    if not numbers:\n        return 0.0\n    return sum(numbers) / len(numbers)",
            "def average(*numbers):\n    return sum(numbers) / len(numbers)",
          ],
        },
        {
          id: "m4-args-e2",
          prompt:
            "Define a function called `tagged_print` that takes a `tag` followed by any positional arguments (`*args`) and any keyword arguments (`**kwargs`). It prints the tag in square brackets and one space, then prints the remaining arguments **exactly as `print` would**, forwarding every extra argument and keyword argument to `print` unchanged — so `sep=` and `end=` still work on them. `tagged_print(\"INFO\", \"Server\", \"started\")` prints `[INFO] Server started`; `tagged_print(\"WARN\", \"disk\", \"full\", sep=\"-\")` prints `[WARN] disk-full`.",
          starter: 'def tagged_print(tag, *args, **kwargs):\n    pass\n\ntagged_print("INFO", "Server", "started")\n',
          solution:
            'def tagged_print(tag, *args, **kwargs):\n    print(f"[{tag}]", end=" ")\n    print(*args, **kwargs)\n\ntagged_print("INFO", "Server", "started")\ntagged_print("WARN", "disk", "full", sep="-")',
          hints: [
            "Two print calls: the first shows the tag and ends with a space instead of a newline (`end=\" \"`).",
            "The second call forwards everything: `print(*args, **kwargs)` — stars on both.",
            "If you put the tag inside the same print as `*args`, a custom `sep` would also land between the tag and the first value — keep them separate.",
          ],
          tests:
            'import io, contextlib\nassert "tagged_print" in dir(), "Define a function called tagged_print"\ndef _capture(*a, **k):\n    _b = io.StringIO()\n    with contextlib.redirect_stdout(_b):\n        tagged_print(*a, **k)\n    return _b.getvalue()\n_out = _capture("INFO", "Server", "started")\nassert _out == "[INFO] Server started\\n", f"tagged_print(\'INFO\', \'Server\', \'started\') should print \'[INFO] Server started\', got {_out!r}"\n_out = _capture("WARN", "disk", "full", sep="-")\nassert _out == "[WARN] disk-full\\n", f"sep=\'-\' must be forwarded to print so the extra values are joined with \'-\' (but not the tag): expected \'[WARN] disk-full\', got {_out!r}"\n_out = _capture("OK", 1, 2, 3, end="!\\n")\nassert _out == "[OK] 1 2 3!\\n", f"end=\'!\\\\n\' must be forwarded to print: expected \'[OK] 1 2 3!\', got {_out!r}"\n_out = _capture("DATA", "a", "b", sep=", ", end=".\\n")\nassert _out == "[DATA] a, b.\\n", f"Both sep and end should be forwarded: expected \'[DATA] a, b.\', got {_out!r}"',
          wrong: [
            'def tagged_print(tag, *args, **kwargs):\n    print(f"[{tag}]", *args, **kwargs)\n\ntagged_print("INFO", "Server", "started")',
            'def tagged_print(tag, *args):\n    print(f"[{tag}]", *args)\n\ntagged_print("INFO", "Server", "started")',
          ],
        },
      ],
      quiz: [
        {
          q: "`scores = [88, 92, 79]` — what does `print(*scores)` show?",
          options: ["[88, 92, 79]", "88 92 79", "(88, 92, 79)", "A TypeError"],
          answer: 1,
          explain:
            "The star unpacks the list into three separate arguments, exactly as if you had written print(88, 92, 79). print then joins them with spaces.",
        },
        {
          q: "Inside `def f(*args, **kwargs):`, what type is `args`?",
          options: ["A list", "A tuple", "A dict", "A string"],
          answer: 1,
          explain:
            "Extra positional arguments are collected into a tuple; extra keyword arguments go into a dict called kwargs.",
        },
      ],
    },

    {
      id: "m4-lambda",
      title: "Lambdas and functions as values",
      goal: "Pass a function to another function, write a lambda, and sort or pick items with key=.",
      keywords: ["lambda", "first-class", "higher-order", "sorted", "key", "min", "max", "map", "filter"],
      exercises: [
        {
          id: "m4-lambda-e1",
          prompt:
            "Print the names of the `students` sorted by `score`, **highest score first**, one name per line. Use `sorted` (or `.sort`) with a `key=` function — do not rebuild the list by hand.",
          starter:
            'students = [\n    {"name": "Aisha", "score": 88},\n    {"name": "Daniel", "score": 92},\n    {"name": "Mei Ling", "score": 79},\n    {"name": "Ravi", "score": 85},\n]\n# your code here\n',
          solution:
            'students = [\n    {"name": "Aisha", "score": 88},\n    {"name": "Daniel", "score": 92},\n    {"name": "Mei Ling", "score": 79},\n    {"name": "Ravi", "score": 85},\n]\nfor student in sorted(students, key=lambda s: s["score"], reverse=True):\n    print(student["name"])',
          hints: [
            "`sorted(students, key=...)` needs a function that takes one student dict and returns the thing to sort by.",
            "`lambda s: s[\"score\"]` is that function. `reverse=True` flips the order to highest first.",
            "Loop over the sorted list and print `student[\"name\"]` each time.",
          ],
          expectOutput: true,
          requires: [{ re: "\\bkey\\s*=", msg: "Sort with a key= function for this one." }],
          wrong: [
            'students = [\n    {"name": "Aisha", "score": 88},\n    {"name": "Daniel", "score": 92},\n    {"name": "Mei Ling", "score": 79},\n    {"name": "Ravi", "score": 85},\n]\nfor student in sorted(students, key=lambda s: s["score"]):\n    print(student["name"])',
            'students = [\n    {"name": "Aisha", "score": 88},\n    {"name": "Daniel", "score": 92},\n    {"name": "Mei Ling", "score": 79},\n    {"name": "Ravi", "score": 85},\n]\nfor student in sorted(students, key=lambda s: s["name"], reverse=True):\n    print(student["name"])',
          ],
        },
        {
          id: "m4-lambda-e2",
          prompt:
            "Define a function called `cheapest` that takes one parameter, `products` — a list of `(name, price)` tuples — and returns the **name** of the product with the lowest price. Return `None` if the list is empty. No two products share a price.",
          starter: 'def cheapest(products):\n    pass\n\nprint(cheapest([("Mouse", 45.5), ("Keyboard", 129.0), ("Cable", 12.0)]))\n',
          solution:
            'def cheapest(products):\n    if not products:\n        return None\n    name, price = min(products, key=lambda p: p[1])\n    return name\n\nprint(cheapest([("Mouse", 45.5), ("Keyboard", 129.0), ("Cable", 12.0)]))',
          hints: [
            "Guard the empty list first: `if not products: return None`.",
            "`min(products, key=lambda p: p[1])` finds the tuple with the smallest price.",
            "That gives you the whole tuple — return its first element, the name.",
          ],
          tests:
            'assert "cheapest" in dir(), "Define a function called cheapest"\n_r = cheapest([("Mouse", 45.5), ("Keyboard", 129.0), ("Cable", 12.0)])\nassert _r == "Cable", f"cheapest([(\'Mouse\', 45.5), (\'Keyboard\', 129.0), (\'Cable\', 12.0)]) should return \'Cable\' (the name, not the tuple or the price), got {_r!r}"\n_r = cheapest([("Monitor", 899.0)])\nassert _r == "Monitor", f"cheapest with one product should return its name, got {_r!r}"\n_r = cheapest([])\nassert _r is None, f"cheapest([]) should return None, got {_r!r}"\n_r = cheapest([("Pen", 2.0), ("Pencil", 1.5), ("Eraser", 1.75)])\nassert _r == "Pencil", f"cheapest([(\'Pen\', 2.0), (\'Pencil\', 1.5), (\'Eraser\', 1.75)]) should return \'Pencil\', got {_r!r}"',
          wrong: [
            'def cheapest(products):\n    if not products:\n        return None\n    return min(products, key=lambda p: p[1])\n\nprint(cheapest([("Mouse", 45.5), ("Keyboard", 129.0), ("Cable", 12.0)]))',
            'def cheapest(products):\n    name, price = min(products, key=lambda p: p[1])\n    return name\n\nprint(cheapest([("Mouse", 45.5), ("Keyboard", 129.0), ("Cable", 12.0)]))',
            'def cheapest(products):\n    if not products:\n        return None\n    return min(products)[0]\n\nprint(cheapest([("Mouse", 45.5), ("Keyboard", 129.0), ("Cable", 12.0)]))',
          ],
        },
      ],
      quiz: [
        {
          q: "What does `sorted([\"pear\", \"fig\", \"banana\"], key=len)` return?",
          options: [
            '["banana", "fig", "pear"]',
            '["fig", "pear", "banana"]',
            '["banana", "pear", "fig"]',
            "A TypeError — len needs parentheses",
          ],
          answer: 1,
          explain:
            "key=len tells sorted to call len on each word and sort by the result: 3, 4, 6. The function is passed by name, without parentheses.",
        },
        {
          q: "Why does `sorted(words, key=len())` fail?",
          options: [
            "len() runs immediately with no argument and raises before sorted even starts",
            "sorted does not accept a key",
            "len cannot be used on strings",
            "It does not fail — it is the same as key=len",
          ],
          answer: 0,
          explain:
            "The parentheses call the function on the spot. You want to hand sorted the function itself, so pass the bare name: key=len.",
        },
      ],
    },

    {
      id: "m4-docs",
      title: "Docstrings, type hints and clean functions",
      goal: "Document a function with a docstring and type hints, keep it small and single-purpose, and handle awkward cases with guard clauses.",
      keywords: ["docstring", "help", "type hint", "annotation", "guard clause", "clean code", "naming"],
      exercises: [
        {
          id: "m4-docs-e1",
          prompt:
            "Finish `safe_average`: it takes a list of numbers and returns their mean as a float, or `0.0` when the list is empty. Add **type hints** (`values: list[float]` and a return hint `-> float`), add a **docstring** as the first line of the body, and use a guard clause for the empty list.",
          starter: "def safe_average(values):\n    return sum(values) / len(values)\n",
          solution:
            'def safe_average(values: list[float]) -> float:\n    """Return the mean of values, or 0.0 for an empty list."""\n    if not values:\n        return 0.0\n    return sum(values) / len(values)',
          hints: [
            "Hints go in the def line: `def safe_average(values: list[float]) -> float:`.",
            "The docstring is a triple-quoted string on the very first line inside the body.",
            "Guard clause: `if not values: return 0.0` before the division.",
          ],
          tests:
            'assert "safe_average" in dir(), "Define a function called safe_average"\nassert safe_average.__doc__ and safe_average.__doc__.strip(), "safe_average needs a docstring: a triple-quoted string as the first line of the body"\n_r = safe_average([2, 4])\nassert _r == 3.0, f"safe_average([2, 4]) should return 3.0, got {_r!r}"\n_r = safe_average([7])\nassert _r == 7.0, f"safe_average([7]) should return 7.0, got {_r!r}"\n_r = safe_average([])\nassert _r == 0.0, f"safe_average([]) should return 0.0 instead of crashing — add a guard clause for the empty list. Got {_r!r}"\n_r = safe_average([1.5, 2.5, 3.5])\nassert _r == 2.5, f"safe_average([1.5, 2.5, 3.5]) should return 2.5, got {_r!r}"\n_hints = getattr(safe_average, "__annotations__", {})\nassert "values" in _hints, "Add a type hint to the parameter: values: list[float]"\nassert _hints.get("return") is float, "Add a return type hint to the def line: -> float"',
          wrong: [
            'def safe_average(values: list[float]) -> float:\n    """Return the mean of values, or 0.0 for an empty list."""\n    return sum(values) / len(values)',
            "def safe_average(values: list[float]) -> float:\n    if not values:\n        return 0.0\n    return sum(values) / len(values)",
            'def safe_average(values):\n    """Return the mean of values, or 0.0 for an empty list."""\n    if not values:\n        return 0.0\n    return sum(values) / len(values)',
          ],
        },
        {
          id: "m4-docs-e2",
          prompt:
            "Define `shipping_cost(weight_kg: float, country: str) -> float` with a docstring, using guard clauses rather than nested if/else. The rules, in order: a weight of `0` or less costs `0.0`; for `\"Malaysia\"` the cost is a flat `6.0` up to and including 2 kg, plus `1.5` for every kilogram over 2 (so 3 kg costs `7.5`); for every other country the cost is `20.0` plus `4.0` per kilogram of the **whole** weight (so 2 kg costs `28.0`). Return the result rounded to 2 decimal places.",
          starter:
            "def shipping_cost(weight_kg: float, country: str) -> float:\n    # 1. guard: weight of 0 or less\n    # 2. Malaysia\n    # 3. everywhere else\n    pass\n",
          solution:
            'def shipping_cost(weight_kg: float, country: str) -> float:\n    """Return the delivery charge for a parcel of weight_kg going to country."""\n    if weight_kg <= 0:\n        return 0.0\n    if country == "Malaysia":\n        if weight_kg <= 2:\n            return 6.0\n        return round(6.0 + 1.5 * (weight_kg - 2), 2)\n    return round(20.0 + 4.0 * weight_kg, 2)',
          hints: [
            "First line of the body: the docstring. Then `if weight_kg <= 0: return 0.0`.",
            "Next guard: `if country == \"Malaysia\":` — return `6.0` when the weight is 2 or less, otherwise `6.0 + 1.5 * (weight_kg - 2)`.",
            "Whatever is left is 'everywhere else': `return round(20.0 + 4.0 * weight_kg, 2)`.",
          ],
          tests:
            'assert "shipping_cost" in dir(), "Define a function called shipping_cost"\nassert shipping_cost.__doc__ and shipping_cost.__doc__.strip(), "shipping_cost needs a docstring as the first line of the body"\n_r = shipping_cost(0, "Malaysia")\nassert _r == 0.0, f"shipping_cost(0, \'Malaysia\') should return 0.0 (nothing to ship), got {_r!r}"\n_r = shipping_cost(-1, "Japan")\nassert _r == 0.0, f"shipping_cost(-1, \'Japan\') should return 0.0 for a negative weight, got {_r!r}"\n_r = shipping_cost(1.5, "Malaysia")\nassert _r == 6.0, f"shipping_cost(1.5, \'Malaysia\') should return the flat 6.0, got {_r!r}"\n_r = shipping_cost(2, "Malaysia")\nassert _r == 6.0, f"shipping_cost(2, \'Malaysia\') should return 6.0 (2 kg is still the flat rate), got {_r!r}"\n_r = shipping_cost(3, "Malaysia")\nassert _r == 7.5, f"shipping_cost(3, \'Malaysia\') should return 7.5 (6.0 + 1.5 for the kilogram over 2), got {_r!r}"\n_r = shipping_cost(2.5, "Malaysia")\nassert _r == 6.75, f"shipping_cost(2.5, \'Malaysia\') should return 6.75, got {_r!r}"\n_r = shipping_cost(2, "Singapore")\nassert _r == 28.0, f"shipping_cost(2, \'Singapore\') should return 28.0 (20.0 + 4.0 * 2), got {_r!r}"\n_r = shipping_cost(0.5, "Japan")\nassert _r == 22.0, f"shipping_cost(0.5, \'Japan\') should return 22.0, got {_r!r}"',
          wrong: [
            'def shipping_cost(weight_kg: float, country: str) -> float:\n    """Return the delivery charge."""\n    if country == "Malaysia":\n        if weight_kg <= 2:\n            return 6.0\n        return round(6.0 + 1.5 * (weight_kg - 2), 2)\n    return round(20.0 + 4.0 * weight_kg, 2)',
            'def shipping_cost(weight_kg: float, country: str) -> float:\n    if weight_kg <= 0:\n        return 0.0\n    if country == "Malaysia":\n        if weight_kg <= 2:\n            return 6.0\n        return round(6.0 + 1.5 * (weight_kg - 2), 2)\n    return round(20.0 + 4.0 * weight_kg, 2)',
            'def shipping_cost(weight_kg: float, country: str) -> float:\n    """Return the delivery charge."""\n    if weight_kg <= 0:\n        return 0.0\n    if country == "Malaysia":\n        return round(6.0 + 1.5 * (weight_kg - 2), 2)\n    return round(20.0 + 4.0 * weight_kg, 2)',
          ],
        },
      ],
      quiz: [
        {
          q: "`def double(n: int) -> int: return n * 2` — what does `double(\"ab\")` do?",
          options: [
            "Raises a TypeError because \"ab\" is not an int",
            'Returns "abab" — type hints are not enforced',
            "Raises a SyntaxError",
            "Returns 2",
          ],
          answer: 1,
          explain:
            "Hints are documentation for people and tools like editors and mypy. Python itself ignores them at run time, so the body runs and string repetition gives \"abab\".",
        },
        {
          q: "Where must a docstring go for `help()` to find it?",
          options: [
            "As the first statement inside the function body",
            "On the line above the def",
            "In a comment starting with #",
            "Anywhere in the body",
          ],
          answer: 0,
          explain:
            "Python only treats a string as the docstring when it is the first statement in the body. Anywhere else it is just an unused string.",
        },
      ],
    },
  ],
};
