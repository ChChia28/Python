/* Module 1 — First Steps ------------------------------------------------ */

export default {
  id: "first-steps",
  number: 1,
  title: "First Steps",
  level: "Beginner",
  summary:
    "What a program is, how to print, how to keep values in variables, and how numbers and text behave. Ends with input(), comments and reading your first error messages.",
  packages: [],
  lessons: [
    {
      id: "m1-hello",
      title: "Your first program",
      goal: "Run a program, understand that Python reads it top to bottom, and print text and numbers with print().",
      keywords: ["print", "program", "string", "quotes", "sep", "end", "function"],
      exercises: [
        {
          id: "m1-hello-e1",
          prompt:
            "Print exactly this line:\n\n```text\nHello, Python!\n```\n\nCapital H, capital P, a comma after Hello and an exclamation mark at the end.",
          starter: "# Write your first line of code below this comment\n",
          solution: 'print("Hello, Python!")',
          hints: [
            "Text goes inside quotes, and the quotes go inside the parentheses of `print()`.",
            'The shape is `print("...")` — replace the dots with the exact text, punctuation included.',
            '`print("Hello, Python!")`',
          ],
          expectOutput: true,
          wrong: ['print("Hello Python!")', "print(Hello, Python!)", 'print("hello, python!")'],
        },
        {
          id: "m1-hello-e2",
          prompt:
            "Print this short profile, one line each, exactly as shown:\n\n```text\nName: Aisha Rahman\nCity: Kuala Lumpur\nAge: 29\n```\n\nThe starter prints the first line already — add the other two.",
          starter: 'print("Name: Aisha Rahman")\n',
          solution: 'print("Name: Aisha Rahman")\nprint("City: Kuala Lumpur")\nprint("Age: 29")',
          hints: [
            "Each `print()` call ends its own line, so one call per line of output.",
            "Copy the first line and change the text — twice.",
            '`print("City: Kuala Lumpur")` then `print("Age: 29")`.',
          ],
          expectOutput: true,
          wrong: [
            'print("Name: Aisha Rahman", "City: Kuala Lumpur", "Age: 29")',
            'print("Name: Aisha Rahman")\nprint("City: Kuala Lumpur")\nprint("Age: 29.")',
          ],
        },
      ],
      quiz: [
        {
          q: 'What does `print("2 + 2")` show?',
          options: ["4", "2 + 2", '"2 + 2"', "An error"],
          answer: 1,
          explain:
            "The quotes make it text, so Python prints the characters exactly as written. Without the quotes, print(2 + 2) would do the maths and show 4.",
        },
        {
          q: 'What does `print("a", "b", "c", sep="-")` show?',
          options: ["a b c", "a-b-c", "abc-", "a, b, c"],
          answer: 1,
          explain:
            "sep= is what print puts between the values. The default is a single space; here it is a hyphen.",
        },
      ],
    },

    {
      id: "m1-variables",
      title: "Variables and assignment",
      goal: "Store a value under a name, change it later, and pick names that other people can read.",
      keywords: ["variable", "assignment", "reassignment", "snake_case", "swap", "augmented assignment", "+="],
      exercises: [
        {
          id: "m1-variables-e1",
          prompt:
            "A small shop starts the day with 40 jars of honey. During the day:\n\n1. 12 jars are sold\n2. 25 jars are delivered\n3. 8 jars are sold\n\nThe starter already has `stock = 40`. Update `stock` after **each** event with `-=` or `+=` (three updates, in that order), then print the final number on its own line.",
          starter: "stock = 40\n\n# 12 jars sold\n\n# 25 jars delivered\n\n# 8 jars sold\n\nprint(stock)\n",
          solution: "stock = 40\nstock -= 12\nstock += 25\nstock -= 8\nprint(stock)",
          hints: [
            "`stock -= 12` means the same as `stock = stock - 12`.",
            "Each event is one line that changes `stock`. Put them under the matching comments, in order.",
            "Three lines: `stock -= 12`, `stock += 25`, `stock -= 8`.",
          ],
          expectOutput: true,
          tests:
            "assert 'stock' in dir(), 'Keep the variable called stock'\nassert stock == 45, f'After all three events stock should be 45, but it is {stock}'",
          requires: [{ re: "(\\+=|-=)", msg: "Update stock with augmented assignment: += or -=." }],
          wrong: [
            "stock = 40\nstock += 12\nstock -= 25\nstock += 8\nprint(stock)",
            "stock = 40\nstock - 12\nstock + 25\nstock - 8\nprint(stock)",
          ],
        },
        {
          id: "m1-variables-e2",
          prompt:
            'The results were entered the wrong way round. In the starter, `winner` holds `"Daniel"` and `runner_up` holds `"Aisha"` — but Aisha actually won. **Swap the two variables** (don\'t retype the names) so the program prints:\n\n```text\nWinner: Aisha\nRunner-up: Daniel\n```',
          starter:
            'winner = "Daniel"\nrunner_up = "Aisha"\n\n# swap them here\n\nprint("Winner:", winner)\nprint("Runner-up:", runner_up)\n',
          solution:
            'winner = "Daniel"\nrunner_up = "Aisha"\nwinner, runner_up = runner_up, winner\nprint("Winner:", winner)\nprint("Runner-up:", runner_up)',
          hints: [
            "If you write `winner = runner_up` first, the old value of `winner` is gone for good. You need to keep it somewhere.",
            "Either park one value in a temporary variable first, or use Python's one-line swap: `a, b = b, a`.",
            "`winner, runner_up = runner_up, winner`",
          ],
          expectOutput: true,
          tests:
            "assert winner == 'Aisha', f'winner should be \"Aisha\" after the swap, got {winner!r}'\nassert runner_up == 'Daniel', f'runner_up should be \"Daniel\" after the swap, got {runner_up!r}'",
          wrong: [
            'winner = "Daniel"\nrunner_up = "Aisha"\nwinner = runner_up\nrunner_up = winner\nprint("Winner:", winner)\nprint("Runner-up:", runner_up)',
          ],
        },
      ],
      quiz: [
        {
          q: "After `x = 5`, then `y = x`, then `x = 10` — what does `print(y)` show?",
          options: ["5", "10", "x", "An error"],
          answer: 0,
          explain:
            "y = x copies the value 5 onto the name y. Moving x to 10 afterwards does not touch y — variables are labels on values, not links to each other.",
        },
        {
          q: "Which of these is a valid variable name?",
          options: ["2nd_place", "total-price", "total_price", "class"],
          answer: 2,
          explain:
            "Names cannot start with a digit, a hyphen is the subtraction operator, and class is a reserved keyword. total_price is proper snake_case.",
        },
      ],
    },

    {
      id: "m1-numbers",
      title: "Numbers and arithmetic",
      goal: "Tell ints from floats, use all seven arithmetic operators, and know why 0.1 + 0.2 looks odd.",
      keywords: ["int", "float", "arithmetic", "division", "floor division", "modulo", "power", "round", "precedence"],
      exercises: [
        {
          id: "m1-numbers-e1",
          prompt:
            "A dinner bill of 95.90 is split evenly between 3 people. The starter defines `bill` and `people`. Print each person's share **rounded to 2 decimal places** — the output should be `31.97`.",
          starter: "bill = 95.90\npeople = 3\n# your code here\n",
          solution: "bill = 95.90\npeople = 3\nprint(round(bill / people, 2))",
          hints: [
            "`/` divides. Print `bill / people` first and look at how many decimals you get.",
            "`round(value, 2)` keeps two decimal places.",
            "`print(round(bill / people, 2))`",
          ],
          expectOutput: true,
          wrong: ["bill = 95.90\npeople = 3\nprint(bill / people)", "bill = 95.90\npeople = 3\nprint(bill // people)"],
        },
        {
          id: "m1-numbers-e2",
          prompt:
            "A film runs for 185 minutes. Using `//` and `%`, store the whole hours in a variable called `hours` and the leftover minutes in a variable called `minutes`, then print one line in exactly this form:\n\n```text\n3 hours and 5 minutes\n```",
          starter: "total_minutes = 185\n# your code here\n",
          solution:
            'total_minutes = 185\nhours = total_minutes // 60\nminutes = total_minutes % 60\nprint(hours, "hours and", minutes, "minutes")',
          hints: [
            "`//` gives the whole hours (no decimals); `%` gives what is left over once the whole hours are taken out.",
            "`hours = total_minutes // 60` and `minutes = total_minutes % 60`.",
            'Print with commas: `print(hours, "hours and", minutes, "minutes")` — print puts one space between the pieces.',
          ],
          expectOutput: true,
          tests:
            "assert 'hours' in dir(), 'Store the whole hours in a variable called hours'\nassert 'minutes' in dir(), 'Store the leftover minutes in a variable called minutes'\nassert hours == 3, f'hours should be 3, got {hours}'\nassert minutes == 5, f'minutes should be 5, got {minutes}'",
          wrong: [
            'total_minutes = 185\nhours = total_minutes / 60\nminutes = total_minutes % 60\nprint(hours, "hours and", minutes, "minutes")',
            'total_minutes = 185\nhours = total_minutes // 60\nminutes = total_minutes - 60\nprint(hours, "hours and", minutes, "minutes")',
          ],
        },
      ],
      quiz: [
        {
          q: "What does `print(7 / 2)` show?",
          options: ["3", "3.5", "4", "3.0"],
          answer: 1,
          explain:
            "/ is true division and always gives a float. If you want the whole-number part, that is 7 // 2, which is 3.",
        },
        {
          q: "What does `print(2 + 3 * 4)` show?",
          options: ["20", "14", "24", "9"],
          answer: 1,
          explain:
            "Multiplication happens before addition, exactly as in school maths: 3 * 4 is 12, then 2 + 12 is 14. Parentheses would make it (2 + 3) * 4 = 20.",
        },
      ],
    },

    {
      id: "m1-strings",
      title: "Strings: text basics",
      goal: "Build, measure and index text, and write line breaks and quotes inside a string.",
      keywords: ["string", "str", "len", "concatenation", "index", "escape", "\\n", "\\t", "multi-line", "triple quotes"],
      exercises: [
        {
          id: "m1-strings-e1",
          prompt:
            "The starter holds the word `Programming` in `word`. Print three lines: its length, its first character and its last character:\n\n```text\n11\nP\ng\n```\n\nUse `len()` and indexing — don't type the letters in yourself.",
          starter: 'word = "Programming"\n# your code here\n',
          solution: 'word = "Programming"\nprint(len(word))\nprint(word[0])\nprint(word[-1])',
          hints: [
            "`len(word)` counts the characters.",
            "The first character is at position 0, not 1.",
            "`word[-1]` is the last character — negative positions count from the end.",
          ],
          expectOutput: true,
          requires: [
            { re: "\\blen\\s*\\(", msg: "Use len() to measure the word." },
            { re: "\\[\\s*-?\\d+\\s*\\]", msg: "Use indexing like word[0] to pick out the characters." },
          ],
          wrong: [
            'word = "Programming"\nprint(len(word))\nprint(word[1])\nprint(word[11])',
            'word = "Programming"\nprint(len(word))\nprint(word[0])\nprint(word[len(word)])',
          ],
        },
        {
          id: "m1-strings-e2",
          prompt:
            "Print a banner: a line of `=` signs exactly as long as the title, then the title itself, then the same line of `=` again. For the starter's title that is:\n\n```text\n============\nSales Report\n============\n```\n\nBuild the line with `*` and `len()` — if the title changed, the banner should still fit.",
          starter: 'title = "Sales Report"\n# your code here\n',
          solution: 'title = "Sales Report"\nline = "=" * len(title)\nprint(line)\nprint(title)\nprint(line)',
          hints: [
            '`"=" * 3` gives `===`. What number do you need instead of 3?',
            '`len(title)` is that number, so `"=" * len(title)` builds the whole line.',
            "Store the line in a variable so you can print it twice.",
          ],
          expectOutput: true,
          requires: [{ re: "\\blen\\s*\\(", msg: "Use len(title) so the line always matches the title's length." }],
          wrong: [
            'title = "Sales Report"\nprint("-" * len(title))\nprint(title)\nprint("-" * len(title))',
            'title = "Sales Report"\nprint("=" * title)\nprint(title)\nprint("=" * title)',
          ],
        },
      ],
      quiz: [
        {
          q: 'What does `print("ab" * 3)` show?',
          options: ["ababab", "6", "ab3", "An error"],
          answer: 0,
          explain:
            "* with a string and a whole number repeats the string. It is the same idea as print(\"-\" * 20) for a divider line.",
        },
        {
          q: 'What is `"hello"[-1]`?',
          options: ["h", "o", "e", "An error"],
          answer: 1,
          explain:
            "Negative positions count from the end: [-1] is the last character, [-2] the one before it. It works for any length of string, which is why it is safer than [4].",
        },
      ],
    },

    {
      id: "m1-types",
      title: "Types and conversion",
      goal: "Check a value's type and convert between text and numbers with int(), float() and str().",
      keywords: ["type", "int", "float", "str", "bool", "conversion", "TypeError", "ValueError"],
      exercises: [
        {
          id: "m1-types-e1",
          prompt:
            'A sign-up form sent the user\'s age as text: the starter has `age = "29"` (notice the quotes). Print the age they will be **next year** — the output should be `30`. Convert first; `"29" + 1` will not work.',
          starter: 'age = "29"\n# your code here\n',
          solution: 'age = "29"\nprint(int(age) + 1)',
          hints: [
            "Text and numbers don't add. Turn the text into a whole number first.",
            "`int(age)` gives the number 29.",
            "`print(int(age) + 1)`",
          ],
          expectOutput: true,
          requires: [{ re: "\\bint\\s*\\(", msg: "Convert the text to a number with int() first." }],
          wrong: ['age = "29"\nprint(age + 1)', 'age = "29"\nprint(age + "1")', 'age = "29"\nprint(int(age + 1))'],
        },
        {
          id: "m1-types-e2",
          prompt:
            'The starter has `price = 4.99` and `quantity = 3`.\n\n1. Store `price * quantity` in a variable called `total`.\n2. Build a variable called `message` holding the text `Total: 14.97` — glue `"Total: "` and the number together with `+` (you will need `str()`).\n3. Print `message`.',
          starter: "price = 4.99\nquantity = 3\n# your code here\n",
          solution: 'price = 4.99\nquantity = 3\ntotal = price * quantity\nmessage = "Total: " + str(total)\nprint(message)',
          hints: [
            "`+` between a string and a float raises TypeError. Make both sides text.",
            "`str(total)` turns the number into text so it can be glued on.",
            '`message = "Total: " + str(total)`',
          ],
          expectOutput: true,
          tests:
            "assert 'total' in dir(), 'Store the result in a variable called total'\nassert abs(total - 14.97) < 1e-9, f'total should be 14.97, got {total}'\nassert 'message' in dir(), 'Store the text in a variable called message'\nassert message == 'Total: 14.97', f'message should be \"Total: 14.97\", got {message!r}'",
          wrong: [
            'price = 4.99\nquantity = 3\ntotal = price * quantity\nmessage = "Total: " + total\nprint(message)',
            'price = 4.99\nquantity = 3\ntotal = price * quantity\nmessage = "Total: ", total\nprint(message)',
          ],
        },
      ],
      quiz: [
        {
          q: 'What does `print("3" + "4")` show?',
          options: ["7", "34", '"34"', "An error"],
          answer: 1,
          explain:
            "Both values are strings, so + glues them: the text 34. Only int(\"3\") + int(\"4\") would give 7.",
        },
        {
          q: "What does `int(7.8)` return?",
          options: ["8", "7", "7.8", "An error"],
          answer: 1,
          explain:
            "int() on a float chops off everything after the decimal point — it truncates, it does not round. round(7.8) is 8.",
        },
      ],
    },

    {
      id: "m1-fstrings",
      title: "f-strings",
      goal: "Build text from values with f-strings, and control decimals, thousands separators and width with a format spec.",
      keywords: ["f-string", "format", "format spec", ".2f", "thousands separator", "padding", "alignment"],
      exercises: [
        {
          id: "m1-fstrings-e1",
          prompt:
            "Using **one f-string**, print this sentence from the three variables in the starter:\n\n```text\nPriya is 34 and lives in Chennai.\n```",
          starter: 'name = "Priya"\nage = 34\ncity = "Chennai"\n# your code here\n',
          solution: 'name = "Priya"\nage = 34\ncity = "Chennai"\nprint(f"{name} is {age} and lives in {city}.")',
          hints: [
            "Put `f` directly before the opening quote.",
            "Each variable goes inside curly braces: `{name}`.",
            '`print(f"{name} is {age} and lives in {city}.")`',
          ],
          expectOutput: true,
          requires: [
            { re: "\\bf\\s*[\"']", msg: "Use an f-string — put f before the opening quote and the variables in {braces}." },
          ],
          wrong: [
            'name = "Priya"\nage = 34\ncity = "Chennai"\nprint("{name} is {age} and lives in {city}.")',
            'name = "Priya"\nage = 34\ncity = "Chennai"\nprint(f"name is age and lives in city.")',
          ],
        },
        {
          id: "m1-fstrings-e2",
          prompt:
            "An order line. From the starter variables, print exactly:\n\n```text\nMonitor x2 = $2,599.00\n```\n\nThe amount is `price * quantity`, shown with a thousands separator and exactly two decimal places. Use one f-string with a format spec — don't type the number in by hand.",
          starter: 'item = "Monitor"\nprice = 1299.5\nquantity = 2\n# your code here\n',
          solution: 'item = "Monitor"\nprice = 1299.5\nquantity = 2\nprint(f"{item} x{quantity} = ${price * quantity:,.2f}")',
          hints: [
            "You can do arithmetic inside the braces: `{price * quantity}`.",
            "A format spec goes after a colon: `:.2f` for two decimals, `:,` for thousands separators.",
            "Combine them: `{price * quantity:,.2f}`",
          ],
          expectOutput: true,
          requires: [
            { re: "\\bf\\s*[\"']", msg: "Use an f-string for this one." },
            { re: "2599", not: true, msg: "Compute the amount from price and quantity rather than typing it in." },
          ],
          wrong: [
            'item = "Monitor"\nprice = 1299.5\nquantity = 2\nprint(f"{item} x{quantity} = ${price * quantity}")',
            'item = "Monitor"\nprice = 1299.5\nquantity = 2\nprint(f"{item} x{quantity} = ${price * quantity:.2f}")',
          ],
        },
      ],
      quiz: [
        {
          q: 'With `price = 5`, what does `print(f"{price * 2}")` show?',
          options: ["{price * 2}", "price * 2", "10", "An error"],
          answer: 2,
          explain:
            "The braces in an f-string hold real Python code. price * 2 is worked out and its result, 10, is dropped into the text.",
        },
        {
          q: 'What does `f"{3.14159:.2f}"` produce?',
          options: ["3.14159", "3.14", "3.1", "3.142"],
          answer: 1,
          explain:
            ".2f means fixed-point with 2 digits after the decimal point, rounded. It is the standard way to show money and measurements.",
        },
      ],
    },

    {
      id: "m1-input",
      title: "input(), comments and reading errors",
      goal: "Read a line typed by the user, leave notes in your code, and read a traceback from the bottom up.",
      keywords: ["input", "prompt", "comment", "#", "traceback", "NameError", "SyntaxError", "TypeError", "error message"],
      exercises: [
        {
          id: "m1-input-e1",
          prompt:
            "Read one line of input with `input()` — **no prompt text** — and store it in a variable called `name`. Then print a greeting in exactly this form (comma, one space, the name, exclamation mark — no extra spaces):\n\n```text\nHello, Aisha!\n```",
          starter: "name = input()\n# greet them\n",
          solution: 'name = input()\nprint(f"Hello, {name}!")',
          stdin: ["Aisha"],
          hints: [
            "`name` already holds whatever was typed. You just need to print text around it.",
            'An f-string is the cleanest way: `f"Hello, {name}!"`.',
            '`print("Hello, " + name + "!")` works too — but `print("Hello,", name, "!")` puts a space before the `!`.',
          ],
          expectOutput: true,
          tests:
            "assert 'name' in dir(), 'Store the input in a variable called name'\nassert name == 'Aisha', f'name should hold the text that was typed, \"Aisha\", got {name!r}'",
          wrong: ['name = input()\nprint("Hello, name!")', 'name = input()\nprint("Hello,", name, "!")'],
        },
        {
          id: "m1-input-e2",
          prompt:
            "This program is meant to ask for a birth year and print the person's age in 2026 — but it crashes. **Run it, read the error message, fix that bug, and run again** (there are two bugs). Keep the prompt text exactly `Birth year: ` (with the trailing space) and the final line in this form:\n\n```text\nYou are 28 years old.\n```\n\nBecause what you type is not echoed back, the prompt and the result end up on the same line in the output panel: `Birth year: You are 28 years old.` That is expected.",
          starter:
            '# Ask for a birth year and print the age in 2026\nbirth_year = input("Birth year: ")\nage = 2026 - birth_year\nprint(f"You are {agee} years old.")\n',
          solution: 'birth_year = int(input("Birth year: "))\nage = 2026 - birth_year\nprint(f"You are {age} years old.")',
          stdin: ["1998"],
          hints: [
            "Run it. The first error is a TypeError on line 3: `input()` gave back text, and you cannot subtract text from a number.",
            "Wrap the input in `int(...)`. Then run again and read the next error — look at the name it complains about.",
            '`birth_year = int(input("Birth year: "))`, and fix the typo `agee` → `age`.',
          ],
          expectOutput: true,
          tests:
            "assert 'age' in dir(), 'Keep the variable called age'\nassert age == 28, f'age should be 28 for a birth year of 1998, got {age}'",
          wrong: [
            'birth_year = input("Birth year: ")\nage = 2026 - birth_year\nprint(f"You are {age} years old.")',
            'birth_year = int(input("Birth year: "))\nage = 2026 - birth_year\nprint(f"You are {agee} years old.")',
            'birth_year = int(input("Birth year: "))\nage = 2026 - birth_year\nprint(f"You are {age} years old")',
          ],
        },
      ],
      quiz: [
        {
          q: "The program runs `age = input()` and the user types 25. What does `print(age + 1)` do?",
          options: ["It prints 26", "It prints 251", "It raises a TypeError", "It prints 25"],
          answer: 2,
          explain:
            "input() always returns a string, so age is the text \"25\". Text plus a number is a TypeError. int(input()) + 1 would print 26.",
        },
        {
          q: "Which part of a traceback should you read first?",
          options: [
            "The first line, Traceback (most recent call last)",
            "The last line — the error type and message",
            "The file name",
            "None of it; just re-run the program",
          ],
          answer: 1,
          explain:
            "The last line names the error and says what went wrong. The line above it shows the code that failed and its line number. Everything above that is the route Python took to get there.",
        },
      ],
    },
  ],
};
