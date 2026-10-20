/* Module 2 — Making Decisions ------------------------------------------ */

export default {
  id: "control-flow",
  number: 2,
  title: "Making Decisions",
  level: "Beginner",
  summary:
    "Comparisons, if/elif/else, logic and truthiness, while and for loops, break and continue, nested loops. After this module your programs can branch and repeat — which is most of what programs do.",
  packages: [],
  lessons: [
    /* ------------------------------------------------------------------ */
    {
      id: "m2-booleans",
      title: "Booleans and comparisons",
      goal: "Write comparisons that produce True or False, and know the difference between == and =.",
      keywords: ["bool", "True", "False", "comparison", "==", "!=", "<", ">", "<=", ">=", "chained comparison"],
      exercises: [
        {
          id: "m2-booleans-e1",
          prompt:
            "A shop gives free delivery on orders of **50 or more**. The starter sets `order_total`. Print **three lines**, each a bare `True` or `False`:\n\n1. whether the order qualifies for free delivery\n2. whether `order_total` is exactly `49.99`\n3. whether `order_total` is **not** equal to `0`\n\nPrint the comparison results directly — do not type the words `True` or `False` yourself.",
          starter: "order_total = 50\n# print three comparison results, one per line\n",
          solution: "order_total = 50\nprint(order_total >= 50)\nprint(order_total == 49.99)\nprint(order_total != 0)",
          hints: [
            "A comparison like `order_total >= 50` is a value you can hand straight to `print()`.",
            "'50 or more' is `>=`, 'exactly' is `==`, 'not equal' is `!=`.",
            "Three `print()` calls: `print(order_total >= 50)`, `print(order_total == 49.99)`, `print(order_total != 0)`.",
          ],
          expectOutput: true,
          requires: [{ re: ">=|==|!=", msg: "Use comparison operators (>=, ==, !=) — don't print the words True and False by hand." }],
          wrong: [
            "order_total = 50\nprint(order_total > 50)\nprint(order_total == 49.99)\nprint(order_total != 0)",
            "order_total = 50\nprint(order_total >= 50)\nprint(order_total == 49.99)\nprint(order_total == 0)",
          ],
        },
        {
          id: "m2-booleans-e2",
          prompt:
            "A cinema sells a standard ticket to anyone aged **13 to 64 inclusive**. The starter sets `age`. Store the result of one comparison in a variable called `standard_price` — `True` if the person pays the standard price, `False` otherwise — then print it.\n\nWrite it as a **chained comparison** (`low <= age <= high` style).",
          starter: "age = 64\n# standard_price = ...\n",
          solution: "age = 64\nstandard_price = 13 <= age <= 64\nprint(standard_price)",
          hints: [
            "Python lets you write both bounds in one expression: `low <= age <= high`.",
            "'Inclusive' means both 13 and 64 count, so use `<=` on both sides.",
            "`standard_price = 13 <= age <= 64`, then `print(standard_price)`.",
          ],
          expectOutput: true,
          tests:
            "assert 'standard_price' in dir(), 'Store the comparison result in a variable called standard_price'\nassert standard_price is True, f'With age = 64, standard_price should be True, got {standard_price!r}'\nage = 12\nstandard_price = 13 <= age <= 64\nassert standard_price is False, 'age 12 should not get the standard price'",
          requires: [{ re: "<=\\s*age\\s*<=|>=\\s*age\\s*>=|<\\s*age\\s*<", msg: "Write it as one chained comparison, like `13 <= age <= 64`." }],
          wrong: [
            "age = 64\nstandard_price = 13 <= age < 64\nprint(standard_price)",
            "age = 64\nstandard_price = age >= 13 and age <= 64\nprint(standard_price)",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `print(5 == 5.0)` print?",
          options: ["True", "False", "An error — you can't compare int and float", "5.0"],
          answer: 0,
          explain:
            "`==` compares values, not types. The integer 5 and the float 5.0 are the same number, so the comparison is True.",
        },
        {
          q: "What happens when you run `if score = 100:`?",
          options: [
            "It checks whether score is 100",
            "It sets score to 100 and the branch always runs",
            "SyntaxError — a single `=` assigns, it can't be used as a condition",
            "It prints 100",
          ],
          answer: 2,
          explain:
            "`=` assigns a value to a name and is not an expression, so it can't sit in an `if`. Python stops with a SyntaxError and even suggests `==`.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m2-if",
      title: "if, elif, else",
      goal: "Branch a program with if/elif/else, and understand why the order of the branches matters.",
      keywords: ["if", "elif", "else", "indentation", "block", "branch", "nested if"],
      exercises: [
        {
          id: "m2-if-e1",
          prompt:
            "The starter sets `temperature` in °C. Print **exactly one line**:\n\n- `Too cold` if the temperature is below 18\n- `Too hot` if it is above 26\n- `Just right` otherwise\n\nThe checks run your code with the starter value, so make sure the branches are right for every range, not just the one shown.",
          starter: "temperature = 27\n# one if / elif / else, one print per branch\n",
          solution:
            "temperature = 27\nif temperature < 18:\n    print(\"Too cold\")\nelif temperature > 26:\n    print(\"Too hot\")\nelse:\n    print(\"Just right\")",
          hints: [
            "Three outcomes means `if`, `elif`, `else` — one `print()` inside each.",
            "Every line inside a branch is indented by 4 spaces; the `if`, `elif` and `else` lines themselves are not.",
            "`if temperature < 18:` … `elif temperature > 26:` … `else:` — the middle range needs no condition of its own.",
          ],
          expectOutput: true,
          requires: [{ re: "\\bif\\b", msg: "Use an if statement for this one." }],
          wrong: [
            "temperature = 27\nif temperature < 18:\n    print(\"Too cold\")\nif temperature > 26:\n    print(\"Too hot\")\nprint(\"Just right\")",
            "temperature = 27\nif temperature < 18:\n    print(\"Too cold\")\nelif temperature >= 26:\n    print(\"Just right\")\nelse:\n    print(\"Too hot\")",
          ],
        },
        {
          id: "m2-if-e2",
          prompt:
            "Turn a mark into a letter grade. The starter sets `mark` (0–100). Print exactly one line holding the grade letter on its own:\n\n| mark | grade |\n| --- | --- |\n| 80 and above | `A` |\n| 65 to 79 | `B` |\n| 50 to 64 | `C` |\n| below 50 | `F` |\n\nUse **one** `if`/`elif`/`else` chain and only one bound per condition — the order of your branches should do the rest.",
          starter: "mark = 65\n",
          solution:
            "mark = 65\nif mark >= 80:\n    print(\"A\")\nelif mark >= 65:\n    print(\"B\")\nelif mark >= 50:\n    print(\"C\")\nelse:\n    print(\"F\")",
          hints: [
            "Start from the highest grade: if the mark is 80 or more it's an A, and nothing else needs checking.",
            "Because `elif` only runs when the branches above it failed, `elif mark >= 65:` already knows the mark is below 80.",
            "`if mark >= 80:` → A, `elif mark >= 65:` → B, `elif mark >= 50:` → C, `else:` → F.",
          ],
          expectOutput: true,
          requires: [{ re: "\\belif\\b", msg: "Use an if / elif / else chain for this one." }],
          wrong: [
            "mark = 65\nif mark >= 50:\n    print(\"C\")\nelif mark >= 65:\n    print(\"B\")\nelif mark >= 80:\n    print(\"A\")\nelse:\n    print(\"F\")",
            "mark = 65\nif mark > 80:\n    print(\"A\")\nelif mark > 65:\n    print(\"B\")\nelif mark > 50:\n    print(\"C\")\nelse:\n    print(\"F\")",
          ],
        },
      ],
      quiz: [
        {
          q: "score is 95. The code is: if score >= 50: print(\"pass\") — then — elif score >= 90: print(\"distinction\"). What is printed?",
          options: ["distinction", "pass", "pass, then distinction", "Nothing"],
          answer: 1,
          explain:
            "Python takes the first branch whose condition is True and skips the rest. 95 >= 50 is True, so it prints pass and never looks at the elif. To get distinction, test the stricter condition first.",
        },
        {
          q: "How does Python know which lines belong inside an `if`?",
          options: [
            "They are wrapped in curly braces",
            "They are indented under the `if` line",
            "They end with a semicolon",
            "They are on the same line as the `if`",
          ],
          answer: 1,
          explain:
            "Indentation is structure in Python. The block ends at the first line that returns to the previous indentation level.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m2-logic",
      title: "and, or, not — and truthiness",
      goal: "Combine conditions with and/or/not, and use plain values as conditions the way experienced Python programmers do.",
      keywords: ["and", "or", "not", "truthiness", "falsy", "short-circuit", "in", "precedence", "None"],
      exercises: [
        {
          id: "m2-logic-e1",
          prompt:
            "A museum ticket is **free** for anyone under 12, anyone 65 or over, or any student — unless it's a weekend, when everybody pays. The starter sets `age`, `is_student` and `is_weekend`.\n\nPrint exactly one line: `Free` if the visitor gets in free, otherwise `Pay`. Use a single `if`/`else` with one combined condition.",
          starter: "age = 70\nis_student = False\nis_weekend = True\n",
          solution:
            "age = 70\nis_student = False\nis_weekend = True\nif (age < 12 or age >= 65 or is_student) and not is_weekend:\n    print(\"Free\")\nelse:\n    print(\"Pay\")",
          hints: [
            "Three ways to qualify joined by `or`, then one thing that cancels them all joined by `and not`.",
            "`and` binds tighter than `or`, so wrap the `or` part in parentheses before you `and` it with the weekend rule.",
            "`if (age < 12 or age >= 65 or is_student) and not is_weekend:`",
          ],
          expectOutput: true,
          requires: [
            { re: "\\bor\\b", msg: "Combine the three ways to qualify with `or`." },
            { re: "\\bnot\\b", msg: "Use `not` for the weekend rule." },
          ],
          wrong: [
            "age = 70\nis_student = False\nis_weekend = True\nif age < 12 or age >= 65 or is_student and not is_weekend:\n    print(\"Free\")\nelse:\n    print(\"Pay\")",
            "age = 70\nis_student = False\nis_weekend = True\nif age < 12 or age >= 65 or is_student:\n    print(\"Free\")\nelse:\n    print(\"Pay\")",
          ],
        },
        {
          id: "m2-logic-e2",
          prompt:
            "The starter sets `cart` (a list of product names) and `discount_code` (a string, possibly empty). Print **two lines**:\n\n1. `Cart is empty` if the list has nothing in it, otherwise `Items: ` followed by the number of items — e.g. `Items: 3`\n2. `Discount applied` if `discount_code` is a non-empty string, otherwise `No discount`\n\nUse the list and the string **directly as conditions** — no `len(...) == 0` and no `== \"\"`.",
          starter: "cart = [\"notebook\", \"pen\", \"stapler\"]\ndiscount_code = \"\"\n",
          solution:
            "cart = [\"notebook\", \"pen\", \"stapler\"]\ndiscount_code = \"\"\nif cart:\n    print(f\"Items: {len(cart)}\")\nelse:\n    print(\"Cart is empty\")\nif discount_code:\n    print(\"Discount applied\")\nelse:\n    print(\"No discount\")",
          hints: [
            "An empty list and an empty string are both falsy, so `if cart:` means 'if the cart has anything in it'.",
            "`if discount_code:` is True only when the string has at least one character.",
            "Two separate `if`/`else` blocks: `if cart:` … and `if discount_code:` …",
          ],
          expectOutput: true,
          requires: [
            { re: "\\bif\\s+(not\\s+)?cart\\s*:", msg: "Use the list itself as the condition: `if cart:` (or `if not cart:`)." },
            { re: "\\bif\\s+(not\\s+)?discount_code\\s*:", msg: "Use the string itself as the condition: `if discount_code:` (or `if not discount_code:`)." },
          ],
          wrong: [
            "cart = [\"notebook\", \"pen\", \"stapler\"]\ndiscount_code = \"\"\nif cart:\n    print(f\"Items: {len(cart)}\")\nelse:\n    print(\"Cart is empty\")\nif discount_code:\n    print(\"No discount\")\nelse:\n    print(\"Discount applied\")",
            "cart = [\"notebook\", \"pen\", \"stapler\"]\ndiscount_code = \"\"\nif cart:\n    print(f\"Items: {cart}\")\nelse:\n    print(\"Cart is empty\")\nif discount_code:\n    print(\"Discount applied\")\nelse:\n    print(\"No discount\")",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `print(bool(\"0\"))` print?",
          options: ["False", "True", "0", "An error"],
          answer: 1,
          explain:
            "Only the *empty* string is falsy. `\"0\"` is a one-character string, so it is truthy. The number 0 is falsy, but a string containing a zero is not.",
        },
        {
          q: "`True or False and False` evaluates to…",
          options: ["False", "True", "An error — mixing and/or needs parentheses", "None"],
          answer: 1,
          explain:
            "`and` binds tighter than `or`, so Python reads it as `True or (False and False)`, which is `True or False`, which is True.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m2-while",
      title: "while loops",
      goal: "Repeat a block while a condition holds, with a loop variable that moves towards the exit.",
      keywords: ["while", "loop", "counter", "accumulator", "infinite loop", "sentinel", "condition"],
      exercises: [
        {
          id: "m2-while-e1",
          prompt:
            "Count down for a rocket launch. Using a `while` loop, print the numbers **5, 4, 3, 2, 1** one per line, then the line `Liftoff!`.\n\nThe starter gives you `count = 5`.",
          starter: "count = 5\n# while loop here\n",
          solution: "count = 5\nwhile count > 0:\n    print(count)\n    count -= 1\nprint(\"Liftoff!\")",
          hints: [
            "Keep looping while `count` is greater than 0, and print `count` each time.",
            "Something inside the loop has to make `count` smaller, or it runs forever: `count -= 1`.",
            "The `Liftoff!` print goes *after* the loop — back at the left margin, not indented.",
          ],
          expectOutput: true,
          requires: [{ re: "\\bwhile\\b", msg: "This exercise is about `while` — use one." }],
          wrong: [
            "count = 5\nwhile count >= 0:\n    print(count)\n    count -= 1\nprint(\"Liftoff!\")",
            "count = 5\nwhile count > 0:\n    count -= 1\n    print(count)\nprint(\"Liftoff!\")",
          ],
        },
        {
          id: "m2-while-e2",
          prompt:
            "You put **1000** into a savings account that grows by **5 %** a year. Using a `while` loop, work out how many whole years it takes for the balance to reach **at least 1500**.\n\nStore the number of years in a variable called `years` and the final balance in `balance`, then print one line in the form `8 years` (the number, a space, the word `years`).",
          starter: "balance = 1000\nyears = 0\n",
          solution:
            "balance = 1000\nyears = 0\nwhile balance < 1500:\n    balance = balance * 1.05\n    years += 1\nprint(f\"{years} years\")",
          hints: [
            "Keep going *while the balance is still below 1500* — the condition describes the state you're in, not the one you want.",
            "Each pass through the loop: multiply the balance by 1.05 and add 1 to `years`.",
            "`while balance < 1500:` … `balance = balance * 1.05` … `years += 1`, then print after the loop.",
          ],
          expectOutput: true,
          tests:
            "assert 'years' in dir(), 'Keep the count in a variable called years'\nassert years == 9, f'It should take 9 years, got {years}'\nassert 'balance' in dir(), 'Keep the running total in a variable called balance'\nassert balance >= 1500, f'balance should have reached at least 1500, got {balance}'\nassert balance < 1600, f'balance looks like it grew for one year too many: {balance}'",
          requires: [{ re: "\\bwhile\\b", msg: "Use a `while` loop — you don't know in advance how many years it takes." }],
          wrong: [
            "balance = 1000\nyears = 0\nwhile balance < 1500:\n    years += 1\n    balance = balance * 1.05\n    print(f\"{years} years\")",
            "balance = 1000\nyears = 0\nwhile balance < 1500:\n    balance = balance + 50\n    years += 1\nprint(f\"{years} years\")",
          ],
        },
      ],
      quiz: [
        {
          q: "n = 1, then: while n < 5: print(n) — and nothing else inside the loop. What happens?",
          options: [
            "It prints 1, 2, 3, 4",
            "It prints 1 forever — nothing in the loop changes n",
            "It prints 1 once",
            "SyntaxError",
          ],
          answer: 1,
          explain:
            "`n` is never changed inside the loop, so `n < 5` stays True and the loop never ends. In this course the run is killed after about 8 seconds; on your own machine it would spin until you stopped it.",
        },
        {
          q: "When is the condition of a `while` loop checked?",
          options: [
            "Once, before the loop starts",
            "Before every pass through the body, including the first",
            "After every pass through the body",
            "Only when the body changes a variable",
          ],
          answer: 1,
          explain:
            "Python tests the condition first, then runs the body, then tests again. If the condition is False at the start, the body never runs at all.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m2-for",
      title: "for loops and range()",
      goal: "Loop a known number of times with range(), walk through the characters of a string and the items of a list, and build up a total.",
      keywords: ["for", "range", "iterate", "sequence", "accumulate", "total", "loop variable"],
      exercises: [
        {
          id: "m2-for-e1",
          prompt:
            "Print the **even numbers from 10 down to 2** — `10 8 6 4 2`, one per line — using a `for` loop with a single `range(...)` call. No `if` needed.",
          starter: "for n in range(...):\n    print(n)\n",
          solution: "for n in range(10, 0, -2):\n    print(n)",
          hints: [
            "`range()` takes a third argument: the step. A negative step counts down.",
            "The stop value is never included, so to finish on 2 you can stop at 1 or 0.",
            "`range(10, 0, -2)` gives 10, 8, 6, 4, 2.",
          ],
          expectOutput: true,
          requires: [
            { re: "\\bfor\\b", msg: "Use a for loop." },
            { re: "\\brange\\s*\\(", msg: "Use range() to produce the numbers." },
            { re: "\\bif\\b", not: true, msg: "No `if` needed — let the range step do the work." },
          ],
          wrong: [
            "for n in range(10, 2, -2):\n    print(n)",
            "for n in range(2, 11, 2):\n    print(n)",
          ],
        },
        {
          id: "m2-for-e2",
          prompt:
            "The starter holds a list of `prices` in a café order. Using a `for` loop, add them up into a variable called `total` and then print one line in the form `Total: 14.5` — the word `Total:`, a space, then the number.\n\nDon't use `sum()` — the point is to build the accumulator yourself.",
          starter: "prices = [3.5, 4.25, 2.75, 4.0]\ntotal = 0\n",
          solution: "prices = [3.5, 4.25, 2.75, 4.0]\ntotal = 0\nfor price in prices:\n    total += price\nprint(f\"Total: {total}\")",
          hints: [
            "Loop directly over the list: `for price in prices:` gives you one price at a time.",
            "Inside the loop add the current price to `total` with `total += price`.",
            "Print *after* the loop, at the left margin: `print(f\"Total: {total}\")`.",
          ],
          expectOutput: true,
          tests:
            "assert 'total' in dir(), 'Keep the running total in a variable called total'\nassert abs(total - 14.5) < 1e-9, f'total should be 14.5, got {total}'",
          requires: [
            { re: "\\bfor\\b", msg: "Use a for loop to walk through the prices." },
            { re: "\\bsum\\s*\\(", not: true, msg: "Build the total yourself instead of calling sum()." },
          ],
          wrong: [
            "prices = [3.5, 4.25, 2.75, 4.0]\ntotal = 0\nfor price in prices:\n    total += price\n    print(f\"Total: {total}\")",
            "prices = [3.5, 4.25, 2.75, 4.0]\ntotal = 0\nfor price in prices:\n    total = price\nprint(f\"Total: {total}\")",
          ],
        },
        {
          id: "m2-for-e3",
          prompt:
            "The starter sets `word`. Count how many **vowels** (`a`, `e`, `i`, `o`, `u` — lower case only) it contains by looping over its characters. Store the count in a variable called `vowels` and print one line in the form `Vowels: 4`.",
          starter: "word = \"programming\"\nvowels = 0\n",
          solution:
            "word = \"programming\"\nvowels = 0\nfor letter in word:\n    if letter in \"aeiou\":\n        vowels += 1\nprint(f\"Vowels: {vowels}\")",
          hints: [
            "A `for` loop over a string gives you one character at a time.",
            "`letter in \"aeiou\"` is True when the character is one of the vowels — use it as the `if` condition.",
            "`for letter in word:` → `if letter in \"aeiou\":` → `vowels += 1`, then print after the loop.",
          ],
          expectOutput: true,
          tests:
            "assert 'vowels' in dir(), 'Keep the count in a variable called vowels'\nassert vowels == 3, f'\"programming\" has 3 vowels, got {vowels}'",
          requires: [{ re: "\\bfor\\b", msg: "Loop over the characters with a for loop." }],
          wrong: [
            "word = \"programming\"\nvowels = 0\nfor letter in word:\n    if letter in \"aeiou\":\n        vowels += 1\n    print(f\"Vowels: {vowels}\")",
            "word = \"programming\"\nvowels = 0\nfor letter in word:\n    if letter not in \"aeiou\":\n        vowels += 1\nprint(f\"Vowels: {vowels}\")",
          ],
        },
      ],
      quiz: [
        {
          q: "How many numbers does `range(1, 10)` produce?",
          options: ["10", "9", "11", "It depends on the step"],
          answer: 1,
          explain:
            "`range(start, stop)` goes from start up to but **not including** stop. 1 to 9 is nine numbers. A quick way to remember: `range(a, b)` has `b - a` items.",
        },
        {
          q: "What does `for ch in \"hey\": print(ch)` print?",
          options: ["hey", "h, e and y on separate lines", "0, 1, 2 on separate lines", "An error — you can only loop over lists"],
          answer: 1,
          explain:
            "A string is a sequence of characters, so a for loop visits each character in turn. To get the indexes instead, loop over `range(len(\"hey\"))`.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m2-break",
      title: "break, continue and loop else",
      goal: "Leave a loop early with break, skip one pass with continue, and use for…else to handle 'not found'.",
      keywords: ["break", "continue", "else", "for else", "search", "flag", "skip"],
      exercises: [
        {
          id: "m2-break-e1",
          prompt:
            "The starter holds a list of `readings` from a temperature sensor. Some are `-999`, which means the sensor glitched. Loop over the list and print every *valid* reading on its own line, **skipping** the glitches with `continue`. Then, after the loop, print one line in the form `Valid readings: 5`.",
          starter: "readings = [21.5, -999, 22.1, 22.8, -999, -999, 23.0, 21.9]\n",
          solution:
            "readings = [21.5, -999, 22.1, 22.8, -999, -999, 23.0, 21.9]\nvalid = 0\nfor reading in readings:\n    if reading == -999:\n        continue\n    print(reading)\n    valid += 1\nprint(f\"Valid readings: {valid}\")",
          hints: [
            "Check for the glitch value first; `continue` jumps straight to the next reading.",
            "Everything after the `continue` only runs for valid readings, so that's where the print and the count go.",
            "`if reading == -999:` → `continue`, then `print(reading)` and `valid += 1`, and the summary print after the loop.",
          ],
          expectOutput: true,
          requires: [{ re: "\\bcontinue\\b", msg: "Use `continue` to skip the glitched readings." }],
          wrong: [
            "readings = [21.5, -999, 22.1, 22.8, -999, -999, 23.0, 21.9]\nvalid = 0\nfor reading in readings:\n    if reading == -999:\n        break\n    print(reading)\n    valid += 1\nprint(f\"Valid readings: {valid}\")",
            "readings = [21.5, -999, 22.1, 22.8, -999, -999, 23.0, 21.9]\nvalid = 0\nfor reading in readings:\n    if reading == -999:\n        continue\n    print(reading)\nprint(f\"Valid readings: {valid}\")",
          ],
        },
        {
          id: "m2-break-e2",
          prompt:
            "The starter holds a list of `guests` on a party list and a `name` to look for. Search the list with a `for` loop. Print `Welcome, Priya!` (using the value of `name`) as soon as you find the name, and stop looking. If the loop finishes without finding it, print `Priya is not on the list` (again using `name`).\n\nUse `break` and the loop's `else` clause — no flag variable.",
          starter: "guests = [\"Amara\", \"Liam\", \"Priya\", \"Noah\", \"Sofia\"]\nname = \"Priya\"\n",
          solution:
            "guests = [\"Amara\", \"Liam\", \"Priya\", \"Noah\", \"Sofia\"]\nname = \"Priya\"\nfor guest in guests:\n    if guest == name:\n        print(f\"Welcome, {name}!\")\n        break\nelse:\n    print(f\"{name} is not on the list\")",
          hints: [
            "Inside the loop: when `guest == name`, print the welcome and `break`.",
            "`else:` lined up with the `for` (not the `if`) runs only when the loop ends *without* a break.",
            "`for guest in guests:` / `if guest == name:` / print + `break` / `else:` / print the not-found line.",
          ],
          expectOutput: true,
          requires: [
            { re: "\\bbreak\\b", msg: "Stop the search with `break` once the name is found." },
            { re: "^else\\s*:", flags: "m", msg: "Use the loop's own `else:` clause (at the same indentation as `for`) for the not-found case." },
          ],
          wrong: [
            "guests = [\"Amara\", \"Liam\", \"Priya\", \"Noah\", \"Sofia\"]\nname = \"Priya\"\nfor guest in guests:\n    if guest == name:\n        print(f\"Welcome, {name}!\")\n        break\n    else:\n        print(f\"{name} is not on the list\")",
            "guests = [\"Amara\", \"Liam\", \"Priya\", \"Noah\", \"Sofia\"]\nname = \"Priya\"\nfor guest in guests:\n    if guest == name:\n        print(f\"Welcome, {name}!\")\nelse:\n    print(f\"{name} is not on the list\")",
          ],
        },
      ],
      quiz: [
        {
          q: "When does the `else` block of a `for` loop run?",
          options: [
            "When the loop body never ran because the list was empty",
            "When the loop finished without hitting a `break`",
            "After every pass through the loop",
            "Only when a `break` was hit",
          ],
          answer: 1,
          explain:
            "Think of it as 'no break'. The else runs after a loop that ran to the end — including a loop over an empty list, which also never broke. A `break` skips it.",
        },
        {
          q: "In a loop, `continue` …",
          options: [
            "ends the loop immediately",
            "skips the rest of this pass and moves to the next item",
            "restarts the loop from the first item",
            "does nothing unless the loop is a `while`",
          ],
          answer: 1,
          explain:
            "`continue` jumps to the top of the loop for the next item; `break` leaves the loop altogether.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m2-nested",
      title: "Nested loops and building patterns",
      goal: "Put a loop inside a loop to work through every combination, and keep the total amount of work small.",
      keywords: ["nested loop", "inner loop", "outer loop", "pattern", "multiplication table", "pairs", "O(n^2)"],
      exercises: [
        {
          id: "m2-nested-e1",
          prompt:
            "Print a right-angled triangle of stars that is **5 rows** tall. Row 1 has one `*`, row 2 has two, and so on, with the stars on each row separated by a single space and no trailing space:\n\n```text\n*\n* *\n* * *\n* * * *\n* * * * *\n```\n\nUse a `for` loop inside a `for` loop and `print(\"*\", end=\" \")` style output — string multiplication (`\"* \" * n`) is not allowed here.",
          starter: "for row in range(1, 6):\n    # inner loop prints the stars for this row\n    print()\n",
          solution:
            "for row in range(1, 6):\n    for col in range(row):\n        if col == row - 1:\n            print(\"*\")\n        else:\n            print(\"*\", end=\" \")",
          hints: [
            "The outer loop picks the row; the inner loop runs `row` times and prints one star each time.",
            "`print(\"*\", end=\" \")` prints a star followed by a space instead of a newline; a bare `print()` after the inner loop ends the line.",
            "Trailing spaces are ignored by the checker, so `print(\"*\", end=\" \")` inside, then `print()` after the inner loop, is enough.",
          ],
          expectOutput: true,
          requires: [
            { re: "\\bfor\\b[\\s\\S]*\\bfor\\b", msg: "Use two for loops, one inside the other." },
            { re: "\\*\\s*\\*\\s*(row|col|i|j|n|\\d)", not: true, msg: "Print the stars one at a time with the inner loop — no string multiplication." },
          ],
          wrong: [
            "for row in range(1, 6):\n    for col in range(row):\n        print(\"*\")\n",
            "for row in range(5):\n    for col in range(row):\n        print(\"*\", end=\" \")\n    print()\n",
          ],
        },
        {
          id: "m2-nested-e2",
          prompt:
            "The starter holds `teams` in a tournament. Every team must play every other team **once** (so `Lions vs Tigers` is a match, but `Tigers vs Lions` is the same match and must not appear again). Print one line per match in the form `Lions vs Tigers`, in the order the teams appear in the list, and finally a line `Matches: 6`.\n\nUse a `for` loop inside a `for` loop over the indexes — the inner loop should start *after* the outer team.",
          starter: "teams = [\"Lions\", \"Tigers\", \"Bears\", \"Wolves\"]\nmatches = 0\n",
          solution:
            "teams = [\"Lions\", \"Tigers\", \"Bears\", \"Wolves\"]\nmatches = 0\nfor i in range(len(teams)):\n    for j in range(i + 1, len(teams)):\n        print(f\"{teams[i]} vs {teams[j]}\")\n        matches += 1\nprint(f\"Matches: {matches}\")",
          hints: [
            "Loop over indexes with `range(len(teams))` so the inner loop can start where the outer one is.",
            "If the inner loop starts at `i + 1`, every pair is visited exactly once and a team never plays itself.",
            "`for i in range(len(teams)):` / `for j in range(i + 1, len(teams)):` / print `teams[i]` vs `teams[j]` and count.",
          ],
          expectOutput: true,
          tests: "assert 'matches' in dir(), 'Count the matches in a variable called matches'\nassert matches == 6, f'4 teams play 6 matches, got {matches}'",
          requires: [{ re: "\\bfor\\b[\\s\\S]*\\bfor\\b", msg: "Use two for loops, one inside the other." }],
          wrong: [
            "teams = [\"Lions\", \"Tigers\", \"Bears\", \"Wolves\"]\nmatches = 0\nfor i in range(len(teams)):\n    for j in range(len(teams)):\n        if i != j:\n            print(f\"{teams[i]} vs {teams[j]}\")\n            matches += 1\nprint(f\"Matches: {matches}\")",
            "teams = [\"Lions\", \"Tigers\", \"Bears\", \"Wolves\"]\nmatches = 0\nfor i in range(len(teams)):\n    for j in range(i, len(teams)):\n        print(f\"{teams[i]} vs {teams[j]}\")\n        matches += 1\nprint(f\"Matches: {matches}\")",
          ],
        },
      ],
      quiz: [
        {
          q: "`for i in range(3):` with `for j in range(4): print(\"hi\")` nested inside it. How many times is hi printed?",
          options: ["7", "12", "3", "4"],
          answer: 1,
          explain:
            "The inner loop runs all 4 of its passes for *each* of the 3 outer passes: 3 × 4 = 12. Nested loops multiply, they don't add.",
        },
        {
          q: "If a nested loop walks 1,000 items against 1,000 items, roughly how many inner passes is that?",
          options: ["2,000", "1,000", "1,000,000", "It depends on the data"],
          answer: 2,
          explain:
            "1,000 × 1,000 = one million. That's fine; 100,000 × 100,000 is ten billion and would be killed by the 8-second limit. Keep nested loops small.",
        },
      ],
    },
  ],
};
