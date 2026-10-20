/* Module 5 — Working with Text ---------------------------------------- */

export default {
  id: "text",
  number: 5,
  title: "Working with Text",
  level: "Intermediate",
  summary:
    "String methods, splitting and joining, formatting numbers into neat columns, characters and encodings, cleaning and validating input, and a first look at regular expressions.",
  packages: [],
  lessons: [
    /* ------------------------------------------------------------------ */
    {
      id: "m5-methods",
      title: "String methods",
      goal: "Change case, trim, replace, find and count inside strings, and keep the result because strings never change in place.",
      keywords: ["upper", "lower", "title", "capitalize", "strip", "replace", "find", "index", "count", "startswith", "endswith", "immutable", "chaining"],
      exercises: [
        {
          id: "m5-methods-e1",
          prompt:
            "The variable `name` holds a customer name with messy spacing and case. Print it **three times**, one per line:\n\n1. trimmed and in Title Case\n2. trimmed and in UPPER CASE\n3. trimmed, lower case, with every space replaced by a dot\n\nFor `\"  priya nair \"` the output is:\n\n```text\nPriya Nair\nPRIYA NAIR\npriya.nair\n```",
          starter: "name = \"  priya nair \"\n# print the three versions\n",
          solution:
            "name = \"  priya nair \"\nclean = name.strip()\nprint(clean.title())\nprint(clean.upper())\nprint(clean.lower().replace(\" \", \".\"))",
          hints: [
            "`strip()` removes the spaces at both ends; do it once and keep the result in a variable.",
            "`title()`, `upper()` and `lower()` each return a new string — put the call inside `print()`.",
            "For the last line chain two calls: `clean.lower().replace(\" \", \".\")`.",
          ],
          expectOutput: true,
          wrong: [
            "name = \"  priya nair \"\nname.strip()\nprint(name.title())\nprint(name.upper())\nprint(name.lower().replace(\" \", \".\"))",
            "name = \"  priya nair \"\nclean = name.strip()\nprint(clean.capitalize())\nprint(clean.upper())\nprint(clean.lower().replace(\" \", \".\"))",
          ],
        },
        {
          id: "m5-methods-e2",
          prompt:
            "Define a function `file_kind(filename)` that classifies a file by its name:\n\n- return `\"image\"` if the name ends with `.png` or `.jpg` (in any letter case — `PHOTO.JPG` counts)\n- return `\"document\"` if it ends with `.pdf` or `.docx`\n- return `\"other\"` for anything else\n\n`file_kind(\"holiday.JPG\")` returns `\"image\"`; `file_kind(\"notes.txt\")` returns `\"other\"`.",
          starter: "def file_kind(filename):\n    pass\n",
          solution:
            "def file_kind(filename):\n    lower = filename.lower()\n    if lower.endswith(\".png\") or lower.endswith(\".jpg\"):\n        return \"image\"\n    if lower.endswith(\".pdf\") or lower.endswith(\".docx\"):\n        return \"document\"\n    return \"other\"",
          hints: [
            "Lower-case the name first so `.JPG` and `.jpg` look the same.",
            "`endswith()` accepts a tuple of options: `lower.endswith((\".png\", \".jpg\"))`.",
            "Three `return` statements: two inside `if`s, and a final `return \"other\"` for everything else.",
          ],
          tests:
            "assert 'file_kind' in dir(), 'Define a function called file_kind'\nassert file_kind('holiday.jpg') == 'image', \"file_kind('holiday.jpg') should return 'image'\"\nassert file_kind('holiday.JPG') == 'image', \"file_kind('holiday.JPG') should return 'image' — compare in lower case\"\nassert file_kind('logo.png') == 'image', \"file_kind('logo.png') should return 'image'\"\nassert file_kind('report.pdf') == 'document', \"file_kind('report.pdf') should return 'document'\"\nassert file_kind('Thesis.DOCX') == 'document', \"file_kind('Thesis.DOCX') should return 'document'\"\nassert file_kind('notes.txt') == 'other', \"file_kind('notes.txt') should return 'other'\"\nassert file_kind('png') == 'other', \"file_kind('png') should return 'other' — the name must END with the extension\"\nassert file_kind('jpg.backup') == 'other', \"file_kind('jpg.backup') should return 'other' — the extension is at the end\"",
          wrong: [
            "def file_kind(filename):\n    if filename.endswith(\".png\") or filename.endswith(\".jpg\"):\n        return \"image\"\n    if filename.endswith(\".pdf\") or filename.endswith(\".docx\"):\n        return \"document\"\n    return \"other\"",
            "def file_kind(filename):\n    lower = filename.lower()\n    if \"png\" in lower or \"jpg\" in lower:\n        return \"image\"\n    if \"pdf\" in lower or \"docx\" in lower:\n        return \"document\"\n    return \"other\"",
          ],
        },
      ],
      quiz: [
        {
          q: "After `name = \"ada\"` and `name.upper()`, what does `print(name)` show?",
          options: ["ADA", "ada", "Ada", "An error — strings have no upper method"],
          answer: 1,
          explain:
            "Strings are immutable. upper() returns a new string, which was thrown away because nothing kept it. name still holds \"ada\".",
        },
        {
          q: "What does `\"banana\".find(\"x\")` return?",
          options: ["-1", "None", "0", "A ValueError"],
          answer: 0,
          explain:
            "find() returns -1 when the text is missing. It is index() that raises ValueError.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m5-split-join",
      title: "split, join and strip",
      goal: "Break a string into pieces, clean each piece, and glue pieces back together with any separator.",
      keywords: ["split", "join", "splitlines", "strip", "csv", "separator", "parse"],
      exercises: [
        {
          id: "m5-split-join-e1",
          prompt:
            "`data` holds three lines of `name,age,city`. Print one line per person in the format `<name> (<age>) - <city>`, in the same order. Note that some fields have stray spaces around them — strip each one.\n\nExpected output:\n\n```text\nPriya (34) - Mumbai\nKenji (29) - Osaka\nAmara (41) - Lagos\n```",
          starter: "data = \"Priya, 34 ,Mumbai\\nKenji,29, Osaka\\n Amara ,41,Lagos\"\n# loop over the lines, split each one, strip the pieces\n",
          solution:
            "data = \"Priya, 34 ,Mumbai\\nKenji,29, Osaka\\n Amara ,41,Lagos\"\nfor line in data.splitlines():\n    name, age, city = line.split(\",\")\n    print(f\"{name.strip()} ({age.strip()}) - {city.strip()}\")",
          hints: [
            "`data.splitlines()` gives you a list of the three lines to loop over.",
            "Inside the loop, `line.split(\",\")` gives three pieces — unpack them into `name, age, city`.",
            "Each piece may have spaces: `name.strip()`, `age.strip()`, `city.strip()` before printing.",
          ],
          expectOutput: true,
          wrong: [
            "data = \"Priya, 34 ,Mumbai\\nKenji,29, Osaka\\n Amara ,41,Lagos\"\nfor line in data.splitlines():\n    name, age, city = line.split(\",\")\n    print(f\"{name} ({age}) - {city}\")",
            "data = \"Priya, 34 ,Mumbai\\nKenji,29, Osaka\\n Amara ,41,Lagos\"\nfor line in data.splitlines():\n    name, age, city = line.strip().split(\",\")\n    print(f\"{name} ({age}) - {city}\")",
          ],
        },
        {
          id: "m5-split-join-e2",
          prompt:
            "Define a function `to_slug(title)` that turns a headline into a URL slug: lower case, words joined by single hyphens, with any extra spacing removed.\n\n- `to_slug(\"Python   for Data Analysts\")` returns `\"python-for-data-analysts\"`\n- `to_slug(\"  Hello World \")` returns `\"hello-world\"`\n\nWords are anything separated by whitespace; do not worry about punctuation.",
          starter: "def to_slug(title):\n    pass\n",
          solution:
            "def to_slug(title):\n    return \"-\".join(title.lower().split())",
          hints: [
            "`split()` with no argument breaks on any run of whitespace and ignores the spacing around the edges.",
            "Join the words back with `\"-\".join(words)` — the separator does the joining.",
            "Lower-case the whole title before or after splitting; either works.",
          ],
          tests:
            "assert 'to_slug' in dir(), 'Define a function called to_slug'\nassert to_slug('Hello World') == 'hello-world', \"to_slug('Hello World') should return 'hello-world'\"\nassert to_slug('Python   for Data Analysts') == 'python-for-data-analysts', \"to_slug('Python   for Data Analysts') should return 'python-for-data-analysts' — collapse the extra spaces\"\nassert to_slug('  Hello World ') == 'hello-world', \"to_slug('  Hello World ') should return 'hello-world' — no hyphens at the ends\"\nassert to_slug('one') == 'one', \"to_slug('one') should return 'one'\"\nassert to_slug('Tabs\\tand\\nnewlines') == 'tabs-and-newlines', \"to_slug should treat tabs and newlines as word separators too\"",
          wrong: [
            "def to_slug(title):\n    return title.lower().replace(\" \", \"-\")",
            "def to_slug(title):\n    return \"-\".join(title.strip().lower().split(\" \"))",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `\"a,,b\".split(\",\")` return?",
          options: ["['a', 'b']", "['a', '', 'b']", "['a', ',', 'b']", "An error"],
          answer: 1,
          explain:
            "With an explicit separator, split keeps empty pieces — an empty field is still a field. Only the no-argument split() drops them.",
        },
        {
          q: "Which line joins the list `parts` with a space?",
          options: ["parts.join(\" \")", "\" \".join(parts)", "join(parts, \" \")", "parts.join()"],
          answer: 1,
          explain:
            "join is a string method called on the separator: \" \".join(parts). Lists have no join method.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m5-format",
      title: "Formatting numbers and columns",
      goal: "Use f-string format specs to control decimals, thousands separators, percentages, padding and alignment, and print an aligned table.",
      keywords: ["f-string", "format spec", ".2f", "thousands separator", "percent", "alignment", "width", "padding", "table"],
      exercises: [
        {
          id: "m5-format-e1",
          prompt:
            "Print an invoice summary from the variables in the starter — **three lines** in exactly this format:\n\n```text\nSubtotal: $1,234.50\nTax rate: 7.5%\nTotal:    $1,327.09\n```\n\n- the money values have a thousands separator and exactly 2 decimals\n- the tax rate is printed as a percentage with 1 decimal\n- `Total:` is followed by **four** spaces so the dollar signs line up",
          starter: "subtotal = 1234.5\ntax_rate = 0.075\ntotal = subtotal * (1 + tax_rate)\n# print the three lines\n",
          solution:
            "subtotal = 1234.5\ntax_rate = 0.075\ntotal = subtotal * (1 + tax_rate)\nprint(f\"Subtotal: ${subtotal:,.2f}\")\nprint(f\"Tax rate: {tax_rate:.1%}\")\nprint(f\"Total:    ${total:,.2f}\")",
          hints: [
            "`{subtotal:,.2f}` gives a thousands separator and two decimals — the comma comes before the precision.",
            "`{tax_rate:.1%}` multiplies by 100 and adds the % sign; do not multiply yourself.",
            "The dollar sign is ordinary text inside the f-string, right before the brace.",
          ],
          expectOutput: true,
          wrong: [
            "subtotal = 1234.5\ntax_rate = 0.075\ntotal = subtotal * (1 + tax_rate)\nprint(f\"Subtotal: ${subtotal:.2f}\")\nprint(f\"Tax rate: {tax_rate:.1%}\")\nprint(f\"Total:    ${total:.2f}\")",
            "subtotal = 1234.5\ntax_rate = 0.075\ntotal = subtotal * (1 + tax_rate)\nprint(f\"Subtotal: ${subtotal:,.2f}\")\nprint(f\"Tax rate: {tax_rate * 100:.1%}\")\nprint(f\"Total:    ${total:,.2f}\")",
          ],
        },
        {
          id: "m5-format-e2",
          prompt:
            "`items` is a list of `(name, quantity, unit_price)` tuples. Print a table with a **header row** and one row per item, in list order:\n\n- column 1: the name, left-aligned in **10** characters\n- column 2: the quantity, right-aligned in **5** characters\n- column 3: the unit price, right-aligned in **8** characters with 2 decimals\n- the header uses the words `Item`, `Qty` and `Price` in the same three widths\n\nExpected output (every line is 23 characters; the `·` marks are spaces, shown so you can count them — print real spaces):\n\n```text\nItem········Qty···Price\nNotebook······3····4.50\nPen··········12····1.25\nBackpack······1···39.99\n```\n\nThe columns butt straight against each other — no extra separator.",
          starter: "items = [(\"Notebook\", 3, 4.5), (\"Pen\", 12, 1.25), (\"Backpack\", 1, 39.99)]\n# header first, then one line per item\n",
          solution:
            "items = [(\"Notebook\", 3, 4.5), (\"Pen\", 12, 1.25), (\"Backpack\", 1, 39.99)]\nprint(f\"{'Item':<10}{'Qty':>5}{'Price':>8}\")\nfor name, qty, price in items:\n    print(f\"{name:<10}{qty:>5}{price:>8.2f}\")",
          hints: [
            "`{name:<10}` pads the name on the right to 10 characters; `{qty:>5}` pads the number on the left.",
            "Decimals and width combine: `{price:>8.2f}` is right-aligned in 8 with 2 decimals.",
            "The header is just three strings with the same specs: `f\"{'Item':<10}{'Qty':>5}{'Price':>8}\"`.",
          ],
          expectOutput: true,
          requires: [{ re: "\\bfor\\b", msg: "Use a for loop to print the rows — the table should work for any list of items." }],
          wrong: [
            "items = [(\"Notebook\", 3, 4.5), (\"Pen\", 12, 1.25), (\"Backpack\", 1, 39.99)]\nprint(f\"{'Item':<10}{'Qty':>5}{'Price':>8}\")\nfor name, qty, price in items:\n    print(f\"{name:<10}{qty:>5}{price:>8}\")",
            "items = [(\"Notebook\", 3, 4.5), (\"Pen\", 12, 1.25), (\"Backpack\", 1, 39.99)]\nprint(f\"{'Item':<10} {'Qty':>5} {'Price':>8}\")\nfor name, qty, price in items:\n    print(f\"{name:<10} {qty:>5} {price:>8.2f}\")",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `f\"{0.075:.1%}\"` produce?",
          options: ["7.5%", "0.1%", "0.075%", "75.0%"],
          answer: 0,
          explain:
            "The % type multiplies by 100 and appends the sign; .1 keeps one decimal. 0.075 becomes 7.5%.",
        },
        {
          q: "Which spec right-aligns a price in 10 characters with a thousands separator and 2 decimals?",
          options: ["{price:>10,.2f}", "{price:.2f,>10}", "{price:,.2f>10}", "{price:>10.2f,}"],
          answer: 0,
          explain:
            "The order is fixed: alignment and width, then the comma, then precision and type. Anything else is a ValueError.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m5-chars",
      title: "Characters, ord/chr and escapes",
      goal: "Walk a string character by character, convert between characters and code points, and write backslash escapes and raw strings correctly.",
      keywords: ["ord", "chr", "code point", "unicode", "escape", "newline", "tab", "raw string", "caesar"],
      exercises: [
        {
          id: "m5-chars-e1",
          prompt:
            "Print the alphabet position of each letter in `word`, one per line in the format `<letter> = <position>`, where `a` is 1, `b` is 2 and so on. The word is lower case.\n\nFor `\"dog\"`:\n\n```text\nd = 4\no = 15\ng = 7\n```",
          starter: "word = \"dog\"\n# loop over the characters and use ord()\n",
          solution:
            "word = \"dog\"\nfor ch in word:\n    print(f\"{ch} = {ord(ch) - ord('a') + 1}\")",
          hints: [
            "`for ch in word:` gives you one character at a time.",
            "`ord(ch) - ord(\"a\")` is 0 for `a`, 1 for `b`… add 1 for the position people expect.",
            "Print with an f-string: `f\"{ch} = {position}\"`.",
          ],
          expectOutput: true,
          wrong: [
            "word = \"dog\"\nfor ch in word:\n    print(f\"{ch} = {ord(ch) - ord('a')}\")",
            "word = \"dog\"\nfor ch in word:\n    print(f\"{ch} = {ord(ch)}\")",
          ],
        },
        {
          id: "m5-chars-e2",
          prompt:
            "Define a function `caesar(text, shift)` that shifts every **lower-case letter** in `text` forward by `shift` places in the alphabet, wrapping from `z` back to `a`. Any other character (spaces, digits, punctuation) stays exactly as it is.\n\n- `caesar(\"abc xyz\", 1)` returns `\"bcd yza\"`\n- `caesar(\"hello, world!\", 3)` returns `\"khoor, zruog!\"`\n- `caesar(\"khoor\", -3)` returns `\"hello\"` (negative shifts go backwards)",
          starter: "def caesar(text, shift):\n    result = \"\"\n    for ch in text:\n        # add either a shifted letter or ch unchanged to result\n        pass\n    return result\n",
          solution:
            "def caesar(text, shift):\n    result = \"\"\n    for ch in text:\n        if \"a\" <= ch <= \"z\":\n            result += chr((ord(ch) - ord(\"a\") + shift) % 26 + ord(\"a\"))\n        else:\n            result += ch\n    return result",
          hints: [
            "Test for a lower-case letter with `ch.islower()` or `\"a\" <= ch <= \"z\"`; everything else is added unchanged.",
            "The shifted code point is `(ord(ch) - ord(\"a\") + shift) % 26 + ord(\"a\")` — the `% 26` does the wrap, and works for negative shifts too.",
            "Build the result with `result += chr(...)` or collect pieces in a list and `\"\".join` them at the end.",
          ],
          tests:
            "assert 'caesar' in dir(), 'Define a function called caesar'\nassert caesar('abc', 1) == 'bcd', \"caesar('abc', 1) should return 'bcd'\"\nassert caesar('abc xyz', 1) == 'bcd yza', \"caesar('abc xyz', 1) should return 'bcd yza' — z must wrap to a and the space must stay\"\nassert caesar('hello, world!', 3) == 'khoor, zruog!', \"caesar('hello, world!', 3) should return 'khoor, zruog!'\"\nassert caesar('khoor', -3) == 'hello', \"caesar('khoor', -3) should return 'hello' — negative shifts go backwards\"\nassert caesar('room 101', 5) == 'wttr 101', \"caesar('room 101', 5) should return 'wttr 101' — digits are unchanged\"\nassert caesar('abc', 26) == 'abc', \"caesar('abc', 26) should return 'abc' — a full turn of the alphabet\"\nassert caesar('', 4) == '', \"caesar('', 4) should return ''\"",
          wrong: [
            "def caesar(text, shift):\n    result = \"\"\n    for ch in text:\n        result += chr(ord(ch) + shift)\n    return result",
            "def caesar(text, shift):\n    result = \"\"\n    for ch in text:\n        if \"a\" <= ch <= \"z\":\n            result += chr(ord(ch) + shift)\n        else:\n            result += ch\n    return result",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `len(\"C:\\\\new\\\\table\")` count, given the string was typed as `\"C:\\new\\table\"` in code?",
          options: [
            "12 — the backslashes are ordinary characters",
            "10 — \\n became a newline and \\t a tab, each one character",
            "An error — \\t is not a valid escape",
            "14 — each backslash counts twice",
          ],
          answer: 1,
          explain:
            "In a normal string every backslash starts an escape: \\n is one newline character and \\t one tab, so the string is C, :, newline, e, w, tab, a, b, l, e — 10 characters. Use r\"C:\\new\\table\" to keep the backslashes.",
        },
        {
          q: "What does `chr(ord(\"z\") + 1)` return?",
          options: ["'a'", "'{'", "'Z'", "An error"],
          answer: 1,
          explain:
            "Code points just keep counting: the character after z (122) is { (123). Wrapping back to a is something your code has to do with % 26.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m5-check",
      title: "Checking and cleaning input",
      goal: "Test what a string contains, compare text without caring about case or spacing, and write flat validation functions that return early on bad input.",
      keywords: ["isdigit", "isalpha", "isalnum", "isspace", "casefold", "in", "normalise", "validate", "early return"],
      exercises: [
        {
          id: "m5-check-e1",
          prompt:
            "Define a function `is_yes(answer)` that returns `True` when the answer means yes — `\"y\"`, `\"yes\"` or `\"yeah\"` — regardless of surrounding spaces or letter case, and `False` otherwise.\n\n- `is_yes(\"  YES \")` returns `True`\n- `is_yes(\"Yeah\")` returns `True`\n- `is_yes(\"yes please\")` returns `False`\n- `is_yes(\"\")` returns `False`",
          starter: "def is_yes(answer):\n    pass\n",
          solution:
            "def is_yes(answer):\n    return answer.strip().casefold() in (\"y\", \"yes\", \"yeah\")",
          hints: [
            "Clean the answer first: `answer.strip().casefold()` (or `.lower()`).",
            "Then test membership with `in` against a tuple of the accepted words.",
            "One line: `return cleaned in (\"y\", \"yes\", \"yeah\")`.",
          ],
          tests:
            "assert 'is_yes' in dir(), 'Define a function called is_yes'\nassert is_yes('yes') is True, \"is_yes('yes') should return True\"\nassert is_yes('  YES ') is True, \"is_yes('  YES ') should return True — strip and ignore case\"\nassert is_yes('Yeah') is True, \"is_yes('Yeah') should return True\"\nassert is_yes('y') is True, \"is_yes('y') should return True\"\nassert is_yes('no') is False, \"is_yes('no') should return False\"\nassert is_yes('yes please') is False, \"is_yes('yes please') should return False — only the exact words count\"\nassert is_yes('') is False, \"is_yes('') should return False\"\nassert is_yes('yesterday') is False, \"is_yes('yesterday') should return False\"",
          wrong: [
            "def is_yes(answer):\n    return answer in (\"y\", \"yes\", \"yeah\")",
            "def is_yes(answer):\n    return \"yes\" in answer.lower() or \"y\" in answer.lower()",
          ],
        },
        {
          id: "m5-check-e2",
          prompt:
            "Define a function `check_username(name)` that returns a short message describing the first problem with a proposed username, or `\"ok\"` if there is none. Check the rules **in this order** and return as soon as one fails:\n\n1. fewer than 3 characters → `\"too short\"`\n2. more than 12 characters → `\"too long\"`\n3. contains any whitespace → `\"no spaces\"`\n4. not every character is a letter, digit or underscore → `\"letters, digits and _ only\"`\n5. does not start with a letter → `\"must start with a letter\"`\n6. otherwise → `\"ok\"`\n\n`check_username(\"priya_28\")` returns `\"ok\"`; `check_username(\"28priya\")` returns `\"must start with a letter\"`; `check_username(\"pri ya\")` returns `\"no spaces\"`.",
          starter: "def check_username(name):\n    # one if per rule, in order; return the message as soon as a rule fails\n    pass\n",
          solution:
            "def check_username(name):\n    if len(name) < 3:\n        return \"too short\"\n    if len(name) > 12:\n        return \"too long\"\n    if any(ch.isspace() for ch in name):\n        return \"no spaces\"\n    if not name.replace(\"_\", \"\").isalnum():\n        return \"letters, digits and _ only\"\n    if not name[0].isalpha():\n        return \"must start with a letter\"\n    return \"ok\"",
          hints: [
            "Each rule is one `if` followed by a `return` — no `else` needed, because returning ends the function.",
            "For whitespace: `\" \" in name` catches spaces, but `any(ch.isspace() for ch in name)` catches tabs too.",
            "`isalnum()` rejects underscores, so remove them first: `name.replace(\"_\", \"\").isalnum()`. Then `name[0].isalpha()` for the last rule.",
          ],
          tests:
            "assert 'check_username' in dir(), 'Define a function called check_username'\nassert check_username('priya_28') == 'ok', \"check_username('priya_28') should return 'ok'\"\nassert check_username('ab') == 'too short', \"check_username('ab') should return 'too short'\"\nassert check_username('') == 'too short', \"check_username('') should return 'too short'\"\nassert check_username('abcdefghijklm') == 'too long', \"check_username('abcdefghijklm') (13 chars) should return 'too long'\"\nassert check_username('abcdefghijkl') != 'too long', \"a 12-character name is not too long\"\nassert check_username('pri ya') == 'no spaces', \"check_username('pri ya') should return 'no spaces'\"\nassert check_username('pri\\tya') == 'no spaces', \"check_username('pri\\\\tya') should return 'no spaces' — a tab is whitespace too\"\nassert check_username('priya!') == 'letters, digits and _ only', \"check_username('priya!') should return 'letters, digits and _ only'\"\nassert check_username('pri-ya') == 'letters, digits and _ only', \"check_username('pri-ya') should return 'letters, digits and _ only'\"\nassert check_username('28priya') == 'must start with a letter', \"check_username('28priya') should return 'must start with a letter'\"\nassert check_username('_priya') == 'must start with a letter', \"check_username('_priya') should return 'must start with a letter' — an underscore is not a letter\"\nassert check_username('a b!') == 'no spaces', \"check_username('a b!') should return 'no spaces' — rules are checked in order, and the space rule comes before the character rule\"\nassert check_username('2 go') == 'no spaces', \"check_username('2 go') should return 'no spaces' — the space rule (3) is checked before the first-letter rule (5)\"\nassert check_username('Kenji') == 'ok', \"check_username('Kenji') should return 'ok'\"",
          wrong: [
            "def check_username(name):\n    if len(name) < 3:\n        return \"too short\"\n    if len(name) > 12:\n        return \"too long\"\n    if \" \" in name:\n        return \"no spaces\"\n    if not name.isalnum():\n        return \"letters, digits and _ only\"\n    if not name[0].isalpha():\n        return \"must start with a letter\"\n    return \"ok\"",
            "def check_username(name):\n    if len(name) < 3:\n        return \"too short\"\n    if len(name) > 12:\n        return \"too long\"\n    if not name[0].isalpha():\n        return \"must start with a letter\"\n    if any(ch.isspace() for ch in name):\n        return \"no spaces\"\n    if not name.replace(\"_\", \"\").isalnum():\n        return \"letters, digits and _ only\"\n    return \"ok\"",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `\"42.5\".isdigit()` return?",
          options: ["True", "False", "42.5", "An error"],
          answer: 1,
          explain:
            "isdigit() is True only when every character is a digit. The decimal point is not one, so the answer is False — which is why isdigit() is not a safe test before float().",
        },
        {
          q: "Why prefer `casefold()` over `lower()` for comparing user input?",
          options: [
            "It is faster",
            "It also strips whitespace",
            "It handles letters like ß that lower() leaves unmatched",
            "lower() only works on ASCII",
          ],
          answer: 2,
          explain:
            "casefold() is a more aggressive lower(): \"straße\".casefold() == \"strasse\", while lower() leaves ß alone and the comparison fails. Neither method strips spaces.",
        },
      ],
    },

    /* ------------------------------------------------------------------ */
    {
      id: "m5-regex",
      title: "Regular expressions",
      goal: "Describe patterns of text with re.search, re.findall and re.sub, use groups to pull out parts, and know when a plain string method is the better tool.",
      keywords: ["re", "regex", "regular expression", "search", "findall", "sub", "group", "character class", "quantifier", "anchor"],
      exercises: [
        {
          id: "m5-regex-e1",
          prompt:
            "Define a function `order_numbers(text)` that returns a **list of the order numbers** mentioned in `text`, as strings without the `#`, in the order they appear. An order number is a `#` followed by one or more digits.\n\n- `order_numbers(\"Orders #1042 and #1077 shipped.\")` returns `[\"1042\", \"1077\"]`\n- `order_numbers(\"nothing to see\")` returns `[]`\n\nUse the `re` module.",
          starter: "import re\n\ndef order_numbers(text):\n    pass\n",
          solution:
            "import re\n\ndef order_numbers(text):\n    return re.findall(r\"#(\\d+)\", text)",
          hints: [
            "`re.findall` returns every match as a list, in order.",
            "`\\d+` is one or more digits. Put `#` in front of it so plain numbers are ignored.",
            "Parentheses around `\\d+` make findall return just the digits, without the `#`.",
          ],
          tests:
            "assert 'order_numbers' in dir(), 'Define a function called order_numbers'\nassert order_numbers('Orders #1042 and #1077 shipped.') == ['1042', '1077'], \"order_numbers('Orders #1042 and #1077 shipped.') should return ['1042', '1077']\"\nassert order_numbers('nothing to see') == [], \"order_numbers('nothing to see') should return []\"\nassert order_numbers('#7 is ready') == ['7'], \"order_numbers('#7 is ready') should return ['7']\"\nassert order_numbers('room 101 has order #55 and 3 boxes') == ['55'], \"only numbers after a # count: expected ['55']\"\nassert order_numbers('#1 #22 #333') == ['1', '22', '333'], \"order_numbers('#1 #22 #333') should return ['1', '22', '333']\"\nassert order_numbers('issue #abc and #12x') == ['12'], \"a # must be followed by digits: expected ['12']\"",
          requires: [{ re: "\\bre\\.", msg: "Use the re module for this one — that is what the lesson is about." }],
          wrong: [
            "import re\n\ndef order_numbers(text):\n    return re.findall(r\"\\d+\", text)",
            "import re\n\ndef order_numbers(text):\n    return re.findall(r\"#\\d+\", text)",
          ],
        },
        {
          id: "m5-regex-e2",
          prompt:
            "Define a function `parse_date(text)` for dates written as `YYYY-MM-DD`. It returns a **tuple of three integers** `(year, month, day)` when the **entire** string is a date in that shape, and `None` otherwise.\n\n- `parse_date(\"2026-10-20\")` returns `(2026, 10, 20)`\n- `parse_date(\"Due 2026-10-20\")` returns `None` (extra text around it)\n- `parse_date(\"2026-1-5\")` returns `None` (month and day need two digits)\n\nYou do not need to check that the month or day is sensible — only the shape. Use the `re` module.",
          starter: "import re\n\ndef parse_date(text):\n    pass\n",
          solution:
            "import re\n\ndef parse_date(text):\n    m = re.search(r\"^(\\d{4})-(\\d{2})-(\\d{2})$\", text)\n    if m is None:\n        return None\n    return (int(m.group(1)), int(m.group(2)), int(m.group(3)))",
          hints: [
            "Anchor the pattern with `^` and `$` so the whole string has to match, not just part of it.",
            "`\\d{4}` is exactly four digits; wrap each number in parentheses to make it a group.",
            "`re.search` returns `None` on no match — check that before calling `.group()`, and convert each group with `int()`.",
          ],
          tests:
            "assert 'parse_date' in dir(), 'Define a function called parse_date'\nassert parse_date('2026-10-20') == (2026, 10, 20), \"parse_date('2026-10-20') should return (2026, 10, 20)\"\nassert parse_date('1999-01-05') == (1999, 1, 5), \"parse_date('1999-01-05') should return (1999, 1, 5) — integers, not strings\"\nassert parse_date('Due 2026-10-20') is None, \"parse_date('Due 2026-10-20') should return None — the whole string must be the date\"\nassert parse_date('2026-10-20 at noon') is None, \"parse_date('2026-10-20 at noon') should return None — nothing may follow the date\"\nassert parse_date('2026-1-5') is None, \"parse_date('2026-1-5') should return None — month and day need two digits\"\nassert parse_date('20-10-2026') is None, \"parse_date('20-10-2026') should return None — the year comes first and has four digits\"\nassert parse_date('') is None, \"parse_date('') should return None\"\nassert parse_date('2026/10/20') is None, \"parse_date('2026/10/20') should return None — the separators must be hyphens\"",
          requires: [{ re: "\\bre\\.", msg: "Use the re module for this one — that is what the lesson is about." }],
          wrong: [
            "import re\n\ndef parse_date(text):\n    m = re.search(r\"(\\d{4})-(\\d{2})-(\\d{2})\", text)\n    if m is None:\n        return None\n    return (int(m.group(1)), int(m.group(2)), int(m.group(3)))",
            "import re\n\ndef parse_date(text):\n    m = re.search(r\"^(\\d+)-(\\d+)-(\\d+)$\", text)\n    if m is None:\n        return None\n    return (int(m.group(1)), int(m.group(2)), int(m.group(3)))",
            "import re\n\ndef parse_date(text):\n    m = re.search(r\"^(\\d{4})-(\\d{2})-(\\d{2})$\", text)\n    return (m.group(1), m.group(2), m.group(3))",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `re.search(r\"\\d+\", \"no digits here\")` return?",
          options: ["None", "An empty string", "An empty match object", "A ValueError"],
          answer: 0,
          explain:
            "search returns None when the pattern never fits. Calling .group() on that None raises AttributeError, so always check the match first.",
        },
        {
          q: "Which task is better done with a string method than a regex?",
          options: [
            "Checking that a line starts with ERROR",
            "Finding every phone number shaped like 555-123-4567",
            "Pulling the year out of 2026-10-20 when the date may sit anywhere in a sentence",
            "Matching an optional 'u' in colour/color",
          ],
          answer: 0,
          explain:
            "line.startswith(\"ERROR\") says exactly what it means. The other three are about the shape of the text — digits in an arrangement, an optional letter — which is what regex is for.",
        },
      ],
    },
  ],
};
