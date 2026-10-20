/* Module 7 — Errors, Files and Data ---------------------------------- */

export default {
  id: "errors-files",
  number: 7,
  title: "Errors, Files and Data",
  level: "Intermediate",
  summary:
    "Reading tracebacks, handling and raising exceptions, reading and writing files, CSV and JSON — the plumbing of every real script.",
  packages: [],
  lessons: [
    {
      id: "m7-tracebacks",
      title: "Reading a traceback",
      goal: "Read a traceback bottom-up, recognise the five most common exception types, and find the line that caused the crash.",
      keywords: ["traceback", "exception", "NameError", "TypeError", "IndexError", "KeyError", "ZeroDivisionError", "debugging"],
      exercises: [
        {
          id: "m7-tracebacks-e1",
          prompt:
            "This program crashes. Run it, read the **last line** of the traceback, and fix the single typo so that it prints each city in upper case, one per line (`LISBON`, `PORTO`, `FARO`).",
          starter: 'cities = ["Lisbon", "Porto", "Faro"]\nfor city in cities:\n    print(citty.upper())\n',
          solution: 'cities = ["Lisbon", "Porto", "Faro"]\nfor city in cities:\n    print(city.upper())\n',
          hints: [
            "The last line of the traceback names the exception type and the name Python could not find.",
            "A `NameError` means a name is misspelt or was never assigned. Compare the name in the error with the one in the `for` line.",
            "The loop variable is `city`, with one t.",
          ],
          expectOutput: true,
          wrong: [
            'cities = ["Lisbon", "Porto", "Faro"]\nfor city in cities:\n    print(cities.upper())\n',
            'cities = ["Lisbon", "Porto", "Faro"]\nfor city in cities:\n    print(city)\n',
          ],
        },
        {
          id: "m7-tracebacks-e2",
          prompt:
            "This checkout crashes. Run it and read the traceback from the bottom up: the failing line is inside `line_total`, but the mistake is in the **data** that was passed in. Fix the mistake so that the program prints `Total: 9.48`. Don't add keys to the `prices` dictionary.",
          starter:
            'prices = {"apple": 1.25, "bread": 2.50, "milk": 0.99}\n\ndef line_total(item, qty):\n    return prices[item] * qty\n\nbasket = [("apple", 4), ("Bread", 1), ("milk", 2)]\ntotal = 0\nfor item, qty in basket:\n    total += line_total(item, qty)\nprint(f"Total: {total:.2f}")\n',
          solution:
            'prices = {"apple": 1.25, "bread": 2.50, "milk": 0.99}\n\ndef line_total(item, qty):\n    return prices[item] * qty\n\nbasket = [("apple", 4), ("bread", 1), ("milk", 2)]\ntotal = 0\nfor item, qty in basket:\n    total += line_total(item, qty)\nprint(f"Total: {total:.2f}")\n',
          hints: [
            "The last line of the traceback is a `KeyError`. The value after it is the exact key that was looked up and not found.",
            "Dictionary keys are case-sensitive: `\"Bread\"` and `\"bread\"` are different keys.",
            "Fix the spelling in `basket`, or make `line_total` look up `item.lower()`.",
          ],
          expectOutput: true,
          tests:
            "assert len(prices) == 3, 'Do not add keys to prices — fix the basket entry (or the lookup) instead'\nassert line_total('apple', 2) == 2.5, 'line_total(\"apple\", 2) should still return 2.5'",
          wrong: [
            'prices = {"apple": 1.25, "bread": 2.50, "milk": 0.99, "Bread": 2.50}\n\ndef line_total(item, qty):\n    return prices[item] * qty\n\nbasket = [("apple", 4), ("Bread", 1), ("milk", 2)]\ntotal = 0\nfor item, qty in basket:\n    total += line_total(item, qty)\nprint(f"Total: {total:.2f}")\n',
            'prices = {"apple": 1.25, "bread": 2.50, "milk": 0.99}\n\ndef line_total(item, qty):\n    return prices.get(item, 0) * qty\n\nbasket = [("apple", 4), ("Bread", 1), ("milk", 2)]\ntotal = 0\nfor item, qty in basket:\n    total += line_total(item, qty)\nprint(f"Total: {total:.2f}")\n',
          ],
        },
      ],
      quiz: [
        {
          q: "A traceback shows three stacked `File \"main.py\", line …` entries. Which one is the line that actually raised the exception?",
          options: [
            "The first one — Python reports the problem as soon as it sees it",
            "The last one — the most recent call is printed at the bottom",
            "The middle one",
            "Any of them; the order is not meaningful",
          ],
          answer: 1,
          explain:
            "The heading says it: 'most recent call last'. The bottom frame is the code that raised; the frames above it are the chain of calls that led there.",
        },
        {
          q: "Your program ends with `KeyError: 'Milk'`. What does that most likely mean?",
          options: [
            "A variable called Milk was never defined",
            "A list has no position called 'Milk'",
            "A dictionary was asked for the key 'Milk' and does not have it — check spelling and capitalisation",
            "The string 'Milk' could not be converted to a number",
          ],
          answer: 2,
          explain:
            "KeyError is a dictionary lookup that failed. The value in the message is the key that was tried, so a capital M where the key was stored as 'milk' is the usual culprit.",
        },
      ],
    },

    {
      id: "m7-try",
      title: "try, except, else, finally",
      goal: "Catch the specific exceptions you expect, keep the program running, and use else and finally correctly.",
      keywords: ["try", "except", "else", "finally", "exception handling", "ValueError", "int conversion"],
      exercises: [
        {
          id: "m7-try-e1",
          prompt:
            "For each entry in `entries`, try to convert it to a whole number with `int()`. If the conversion works, print `<number> ok` (for example `12 ok`); if it raises `ValueError`, print `<entry> skipped` (for example `seven skipped`). One line per entry, in order.",
          starter: 'entries = ["12", "seven", "3.5", "40"]\nfor text in entries:\n    # your code here\n    pass\n',
          solution:
            'entries = ["12", "seven", "3.5", "40"]\nfor text in entries:\n    try:\n        number = int(text)\n    except ValueError:\n        print(text, "skipped")\n    else:\n        print(number, "ok")\n',
          hints: [
            "Put only the `int(text)` call inside the `try` block.",
            "`except ValueError:` is the block that runs when the conversion fails.",
            "Code that should run only when the conversion succeeded can go in an `else:` block — or straight after `int()` inside the `try`.",
          ],
          expectOutput: true,
          requires: [
            { re: "\\btry\\b", msg: "Use try/except for this one — let int() fail and catch it." },
            { re: "except\\s+[\\w(]", msg: "Name the exception type after except (except ValueError:) — a bare except: catches far too much." },
          ],
          wrong: [
            'entries = ["12", "seven", "3.5", "40"]\nfor text in entries:\n    if text.isdigit():\n        print(int(text), "ok")\n    else:\n        print(text, "skipped")\n',
            'entries = ["12", "seven", "3.5", "40"]\nfor text in entries:\n    try:\n        print(int(text), "ok")\n    except:\n        print(text, "skipped")\n',
          ],
        },
        {
          id: "m7-try-e2",
          prompt:
            "Define `average_of(texts)`. It receives a list of strings, converts each one with `float()`, **skips** any that cannot be converted, and returns the average of the ones that could. If none of them convert (or the list is empty) it returns `0.0` rather than crashing. For example `average_of([\"10\", \"20\", \"x\"])` returns `15.0`.",
          starter: "def average_of(texts):\n    # convert each text with float(); skip the ones that fail\n    pass\n",
          solution:
            "def average_of(texts):\n    good = []\n    for text in texts:\n        try:\n            good.append(float(text))\n        except ValueError:\n            continue\n    if not good:\n        return 0.0\n    return sum(good) / len(good)\n",
          hints: [
            "Collect the successful conversions in a list; wrap only the `float(text)` call in `try`/`except ValueError`.",
            "An empty list of good values makes the division raise `ZeroDivisionError` — guard it with an `if`, or catch that too.",
            "`sum(good) / len(good)` is the average once you know `good` is not empty.",
          ],
          tests:
            "assert 'average_of' in dir(), 'Define a function called average_of'\nassert average_of(['10', '20']) == 15.0, 'average_of([\"10\", \"20\"]) should return 15.0'\nassert average_of(['10', '20', 'x']) == 15.0, 'average_of([\"10\", \"20\", \"x\"]) should skip \"x\" and return 15.0'\nassert average_of(['2.5', 'abc', '3.5', '']) == 3.0, 'average_of([\"2.5\", \"abc\", \"3.5\", \"\"]) should return 3.0 — decimals are fine, only the bad ones are skipped'\nassert average_of([]) == 0.0, 'average_of([]) should return 0.0, not crash'\nassert average_of(['a', 'b']) == 0.0, 'average_of([\"a\", \"b\"]) should return 0.0 when nothing converts'",
          requires: [{ re: "\\btry\\b", msg: "Use try/except to detect the strings that float() rejects." }],
          wrong: [
            "def average_of(texts):\n    good = []\n    for text in texts:\n        try:\n            good.append(float(text))\n        except ValueError:\n            pass\n    return sum(good) / len(good)\n",
            "def average_of(texts):\n    good = [float(t) for t in texts if t.isdigit()]\n    if not good:\n        return 0.0\n    return sum(good) / len(good)\n",
          ],
        },
      ],
      quiz: [
        {
          q: "What does this print?\n\n```python\ntry:\n    n = int(\"abc\")\n    print(\"converted\")\nexcept ValueError:\n    print(\"bad input\")\n```",
          options: [
            "converted, then bad input",
            "bad input only",
            "converted only",
            "Nothing — it crashes with a ValueError",
          ],
          answer: 1,
          explain:
            "int(\"abc\") raises, so Python leaves the try block immediately — the print(\"converted\") line never runs — and jumps to the matching except.",
        },
        {
          q: "What is the problem with a bare `except:` block?",
          options: [
            "It is a syntax error in Python 3",
            "It only catches ValueError",
            "It catches every exception, including the NameError or TypeError from a bug you would want to see",
            "It makes the try block run twice",
          ],
          answer: 2,
          explain:
            "A bare except swallows everything, so a typo in a variable name is reported as 'something went wrong' instead of pointing at the line. Catch the narrowest type you can actually handle.",
        },
      ],
    },

    {
      id: "m7-raise",
      title: "Raising and custom exceptions",
      goal: "Validate arguments with raise, define your own exception classes, and know when to re-raise.",
      keywords: ["raise", "ValueError", "custom exception", "class", "Exception", "re-raise", "validation"],
      exercises: [
        {
          id: "m7-raise-e1",
          prompt:
            "Define `checked_age(age)`. If `age` is between 0 and 130 inclusive, return it unchanged. Otherwise **raise** a `ValueError` whose message includes the bad value — for example `invalid age: -3`.",
          starter: "def checked_age(age):\n    return age\n",
          solution:
            'def checked_age(age):\n    if not 0 <= age <= 130:\n        raise ValueError(f"invalid age: {age}")\n    return age\n',
          hints: [
            "Check the range first; the `return` line only runs if the check passes.",
            "`raise ValueError(\"...\")` stops the function immediately — no `return` needed on that path.",
            "An f-string puts the value into the message: `f\"invalid age: {age}\"`.",
          ],
          tests:
            "assert 'checked_age' in dir(), 'Define a function called checked_age'\nassert checked_age(0) == 0, 'checked_age(0) should return 0'\nassert checked_age(42) == 42, 'checked_age(42) should return 42'\nassert checked_age(130) == 130, 'checked_age(130) should return 130 — 130 is allowed'\nfor bad in (-3, 131, 999):\n    try:\n        result = checked_age(bad)\n    except ValueError as e:\n        assert str(bad) in str(e), f'the ValueError message for checked_age({bad}) should mention {bad}, got: {str(e)!r}'\n    else:\n        raise AssertionError(f'checked_age({bad}) should raise ValueError, but it returned {result!r}')",
          wrong: [
            "def checked_age(age):\n    if 0 <= age <= 130:\n        return age\n    return None\n",
            'def checked_age(age):\n    if not 0 <= age <= 130:\n        raise ValueError("invalid age")\n    return age\n',
          ],
        },
        {
          id: "m7-raise-e2",
          prompt:
            "Build a tiny bank. Define a class `InsufficientFunds` that inherits from `Exception`. Then define `withdraw(balance, amount)` which returns the new balance, but:\n\n- if `amount` is greater than `balance`, raise `InsufficientFunds` with the message `cannot withdraw <amount> from <balance>` (for example `cannot withdraw 80 from 50`);\n- if `amount` is zero or negative, raise `ValueError`.\n\nWithdrawing the whole balance is allowed.",
          starter: "class InsufficientFunds(Exception):\n    pass\n\ndef withdraw(balance, amount):\n    return balance - amount\n",
          solution:
            'class InsufficientFunds(Exception):\n    pass\n\ndef withdraw(balance, amount):\n    if amount <= 0:\n        raise ValueError(f"amount must be positive, got {amount}")\n    if amount > balance:\n        raise InsufficientFunds(f"cannot withdraw {amount} from {balance}")\n    return balance - amount\n',
          hints: [
            "The class body can be just `pass` — inheriting from `Exception` is what makes it raisable.",
            "Check the amount is positive first, then whether it fits in the balance, then return.",
            "`raise InsufficientFunds(f\"cannot withdraw {amount} from {balance}\")` — the message goes in as the argument.",
          ],
          tests:
            "assert 'InsufficientFunds' in dir(), 'Define a class called InsufficientFunds'\nassert isinstance(InsufficientFunds, type) and issubclass(InsufficientFunds, Exception), 'InsufficientFunds should be a class that inherits from Exception'\nassert withdraw(100, 30) == 70, 'withdraw(100, 30) should return 70'\nassert withdraw(50, 50) == 0, 'withdraw(50, 50) should return 0 — taking the whole balance is allowed'\ntry:\n    result = withdraw(50, 80)\nexcept InsufficientFunds as e:\n    assert str(e) == 'cannot withdraw 80 from 50', f\"the message should be 'cannot withdraw 80 from 50', got {str(e)!r}\"\nelse:\n    raise AssertionError(f'withdraw(50, 80) should raise InsufficientFunds, but it returned {result!r}')\nfor bad in (0, -5):\n    try:\n        result = withdraw(50, bad)\n    except ValueError:\n        pass\n    else:\n        raise AssertionError(f'withdraw(50, {bad}) should raise ValueError — the amount must be positive — but it returned {result!r}')",
          wrong: [
            "class InsufficientFunds(Exception):\n    pass\n\ndef withdraw(balance, amount):\n    if amount <= 0:\n        raise ValueError('amount must be positive')\n    if amount > balance:\n        return None\n    return balance - amount\n",
            'class InsufficientFunds(Exception):\n    pass\n\ndef withdraw(balance, amount):\n    if amount <= 0:\n        raise ValueError("amount must be positive")\n    if amount > balance:\n        raise ValueError(f"cannot withdraw {amount} from {balance}")\n    return balance - amount\n',
          ],
        },
      ],
      quiz: [
        {
          q: "Inside a function, what happens at `raise ValueError(\"too big\")`?",
          options: [
            "The function returns the string \"too big\"",
            "The function stops at once and the exception travels up to the caller, which can catch it or let the program crash",
            "A warning is printed and the next line runs",
            "Nothing, unless the function is inside a try block",
          ],
          answer: 1,
          explain:
            "raise is a hard stop. Execution leaves the function immediately; the exception propagates upwards until an except block matches it or it reaches the top and prints a traceback.",
        },
        {
          q: "Why is raising an exception usually better than returning -1 to signal a bad argument?",
          options: [
            "Exceptions are faster",
            "A return value can be silently ignored and flow into later calculations; an exception cannot be ignored and carries a message",
            "Functions are not allowed to return negative numbers",
            "Returning -1 only works for integers",
          ],
          answer: 1,
          explain:
            "Nobody checks every return value. An exception stops the program at the point of the problem with a readable message, and a caller that knows how to recover can still catch it.",
        },
      ],
    },

    {
      id: "m7-files",
      title: "Reading and writing files",
      goal: "Open files in the right mode, read them line by line with a with block, and write lines back out.",
      keywords: ["open", "with", "read", "readlines", "write", "append", "mode", "strip", "FileNotFoundError"],
      exercises: [
        {
          id: "m7-files-e1",
          prompt:
            "`notes.txt` has already been created with one note per line. Print every note numbered from 1, in the format `1. buy milk` — one line per note, with no blank lines between them.",
          starter: 'with open("notes.txt") as f:\n    # your code here\n    pass\n',
          solution: 'with open("notes.txt") as f:\n    for number, line in enumerate(f, start=1):\n        print(f"{number}. {line.strip()}")\n',
          hints: [
            "Looping over the file object gives one line at a time.",
            "Each line still ends with `\\n` — strip it, or you get a blank line after every note.",
            "`enumerate(f, start=1)` gives you the number and the line together.",
          ],
          setup: "open('notes.txt', 'w').write('buy milk\\ncall Ana\\nfix bike\\n')",
          expectOutput: true,
          wrong: [
            'with open("notes.txt") as f:\n    for number, line in enumerate(f, start=1):\n        print(f"{number}. {line}")\n',
            'with open("notes.txt") as f:\n    for number, line in enumerate(f):\n        print(f"{number}. {line.strip()}")\n',
          ],
        },
        {
          id: "m7-files-e2",
          prompt:
            "`scores.txt` has `name score` on each line (for example `Ana 91`). Write a new file called `passed.txt` containing only the **names** whose score is 80 or more, one name per line, each line ending with a newline. Then print how many passed, like `2 passed`.",
          starter: 'with open("scores.txt") as f:\n    lines = f.read().splitlines()\n# your code here\n',
          solution:
            'with open("scores.txt") as f:\n    lines = f.read().splitlines()\n\npassed = []\nfor line in lines:\n    name, score = line.split()\n    if int(score) >= 80:\n        passed.append(name)\n\nwith open("passed.txt", "w") as out:\n    for name in passed:\n        out.write(name + "\\n")\nprint(len(passed), "passed")\n',
          hints: [
            "`line.split()` separates the name from the score; the score is text until you `int()` it.",
            "Open the output file with mode `\"w\"` inside its own `with` block.",
            "`write()` does not add a newline — write `name + \"\\n\"`, or use `print(name, file=out)`.",
          ],
          setup: "open('scores.txt', 'w').write('Ana 91\\nBruno 78\\nCarla 100\\nDiogo 64\\n')",
          expectOutput: true,
          tests:
            "import os\nassert os.path.exists('passed.txt'), \"passed.txt was not created — open it with mode 'w' and write to it\"\ncontent = open('passed.txt').read()\nassert content.splitlines() == ['Ana', 'Carla'], f'passed.txt should contain Ana and Carla, one per line; it contains {content!r}'\nassert content.endswith('\\n'), 'end each line with a newline character'",
          wrong: [
            'with open("scores.txt") as f:\n    lines = f.read().splitlines()\n\npassed = []\nfor line in lines:\n    name, score = line.split()\n    if int(score) >= 80:\n        passed.append(line)\n\nwith open("passed.txt", "w") as out:\n    for entry in passed:\n        out.write(entry + "\\n")\nprint(len(passed), "passed")\n',
            'with open("scores.txt") as f:\n    lines = f.read().splitlines()\n\npassed = []\nfor line in lines:\n    name, score = line.split()\n    if int(score) >= 80:\n        passed.append(name)\n\nwith open("passed.txt", "w") as out:\n    for name in passed:\n        out.write(name)\nprint(len(passed), "passed")\n',
          ],
        },
      ],
      quiz: [
        {
          q: "`notes.txt` contains three lines. What does this print?\n\n```python\nwith open(\"notes.txt\") as f:\n    for line in f:\n        print(line)\n```",
          options: [
            "The three lines, one after another",
            "The three lines with a blank line after each one",
            "One long line",
            "An error — you must call read() first",
          ],
          answer: 1,
          explain:
            "Each line read from a file keeps its trailing newline, and print adds another. Strip the line, or use print(line, end=\"\").",
        },
        {
          q: "What does `open(\"report.txt\", \"w\")` do when report.txt already exists?",
          options: [
            "Raises FileExistsError",
            "Opens it for reading and writing",
            "Empties it immediately, even before anything is written",
            "Adds new text to the end",
          ],
          answer: 2,
          explain:
            "Mode \"w\" truncates the file on open. Use \"a\" to append to an existing file.",
        },
      ],
    },

    {
      id: "m7-csv",
      title: "CSV files",
      goal: "Read CSV files with csv.reader and csv.DictReader, convert columns to numbers, and write CSV safely.",
      keywords: ["csv", "reader", "DictReader", "writer", "DictWriter", "spreadsheet", "newline", "quoting"],
      exercises: [
        {
          id: "m7-csv-e1",
          prompt:
            "`scores.csv` has the columns `name,score,city`. Using the `csv` module, print one line per data row in the form `<name>: <score>` (for example `Ana: 91`), then a final line `Average: <average score>` rounded to 2 decimal places (for example `Average: 89.67`). One of the names contains a comma, so splitting on commas yourself will go wrong.",
          starter: 'import csv\n\nwith open("scores.csv", newline="") as f:\n    # your code here\n    pass\n',
          solution:
            'import csv\n\ntotal = 0\ncount = 0\nwith open("scores.csv", newline="") as f:\n    for row in csv.DictReader(f):\n        print(f"{row[\'name\']}: {row[\'score\']}")\n        total += int(row["score"])\n        count += 1\nprint(f"Average: {total / count:.2f}")\n',
          hints: [
            "`csv.DictReader(f)` gives one dictionary per data row, keyed by the header names.",
            "The score is text — `int(row[\"score\"])` before adding it to a total.",
            "`f\"Average: {total / count:.2f}\"` formats to two decimals.",
          ],
          setup:
            "open('scores.csv', 'w').write('name,score,city\\nAna,91,Lisbon\\nBruno,78,Porto\\n\"Dias, Carla\",100,Faro\\n')",
          expectOutput: true,
          requires: [
            { re: "\\b(DictReader|reader)\\s*\\(", msg: "Use the csv module (csv.reader or csv.DictReader) — don't split lines on commas yourself." },
          ],
          wrong: [
            'total = 0\ncount = 0\nwith open("scores.csv") as f:\n    next(f)\n    for line in f:\n        name, score, city = line.strip().split(",")\n        print(f"{name}: {score}")\n        total += int(score)\n        count += 1\nprint(f"Average: {total / count:.2f}")\n',
            'import csv\n\ntotal = 0\ncount = 0\nwith open("scores.csv", newline="") as f:\n    for row in csv.reader(f):\n        print(f"{row[0]}: {row[1]}")\n        total += int(row[1])\n        count += 1\nprint(f"Average: {total / count:.2f}")\n',
          ],
        },
        {
          id: "m7-csv-e2",
          prompt:
            "Write the `inventory` list to a file called `inventory.csv` using `csv.writer` or `csv.DictWriter`: a header row `name,qty,price`, then one row per item, in the order given. Then print `Wrote 3 rows`. The checks read the file back with the `csv` module, so a name containing a comma must survive the round trip.",
          starter:
            'import csv\n\ninventory = [\n    {"name": "Coffee, ground", "qty": 12, "price": 8.5},\n    {"name": "Tea", "qty": 40, "price": 3.0},\n    {"name": "Sugar", "qty": 25, "price": 1.25},\n]\n# your code here\n',
          solution:
            'import csv\n\ninventory = [\n    {"name": "Coffee, ground", "qty": 12, "price": 8.5},\n    {"name": "Tea", "qty": 40, "price": 3.0},\n    {"name": "Sugar", "qty": 25, "price": 1.25},\n]\nwith open("inventory.csv", "w", newline="") as f:\n    writer = csv.DictWriter(f, fieldnames=["name", "qty", "price"])\n    writer.writeheader()\n    writer.writerows(inventory)\nprint(f"Wrote {len(inventory)} rows")\n',
          hints: [
            "Open the file with `\"w\"` and `newline=\"\"`, then build a writer on it.",
            "`csv.DictWriter(f, fieldnames=[\"name\", \"qty\", \"price\"])` matches the dictionaries; call `writeheader()` before `writerows(inventory)`.",
            "With `csv.writer`, write the header list first, then `[item[\"name\"], item[\"qty\"], item[\"price\"]]` for each item.",
          ],
          expectOutput: true,
          tests:
            "import csv, os\nassert os.path.exists('inventory.csv'), 'inventory.csv was not created'\nwith open('inventory.csv', newline='') as f:\n    rows = list(csv.reader(f))\nassert rows, 'inventory.csv is empty'\nassert rows[0] == ['name', 'qty', 'price'], f\"the first row should be the header ['name', 'qty', 'price'], got {rows[0]}\"\nassert len(rows) == 4, f'expected a header plus 3 data rows, found {len(rows)} rows'\nassert rows[1] == ['Coffee, ground', '12', '8.5'], f\"the first data row should read back as ['Coffee, ground', '12', '8.5'], got {rows[1]} — a value containing a comma must be quoted; let the csv module do it\"\nassert rows[2] == ['Tea', '40', '3.0'], f\"the second data row should be ['Tea', '40', '3.0'], got {rows[2]}\"\nassert rows[3] == ['Sugar', '25', '1.25'], f\"the third data row should be ['Sugar', '25', '1.25'], got {rows[3]}\"",
          requires: [
            { re: "\\b(DictWriter|writer)\\s*\\(", msg: "Use csv.writer or csv.DictWriter to write the file — a value with a comma in it needs the quoting they do for you." },
          ],
          wrong: [
            'import csv\n\ninventory = [\n    {"name": "Coffee, ground", "qty": 12, "price": 8.5},\n    {"name": "Tea", "qty": 40, "price": 3.0},\n    {"name": "Sugar", "qty": 25, "price": 1.25},\n]\nwith open("inventory.csv", "w") as f:\n    f.write("name,qty,price\\n")\n    for item in inventory:\n        f.write(f"{item[\'name\']},{item[\'qty\']},{item[\'price\']}\\n")\nprint(f"Wrote {len(inventory)} rows")\n',
            'import csv\n\ninventory = [\n    {"name": "Coffee, ground", "qty": 12, "price": 8.5},\n    {"name": "Tea", "qty": 40, "price": 3.0},\n    {"name": "Sugar", "qty": 25, "price": 1.25},\n]\nwith open("inventory.csv", "w", newline="") as f:\n    writer = csv.DictWriter(f, fieldnames=["name", "qty", "price"])\n    writer.writerows(inventory)\nprint(f"Wrote {len(inventory)} rows")\n',
          ],
        },
      ],
      quiz: [
        {
          q: "`scores.csv` has a column `score` with the values 91, 78 and 100. After `rows = list(csv.DictReader(f))`, what is `rows[0][\"score\"]`?",
          options: ["91 (an int)", "91.0 (a float)", "\"91\" (a string)", "A list of all three scores"],
          answer: 2,
          explain:
            "CSV has no types. Every field comes back as text, which is why you convert with int() or float() before summing or comparing.",
        },
        {
          q: "Why do you open CSV files with `newline=\"\"`?",
          options: [
            "It removes blank lines from the data",
            "It lets the csv module handle line endings itself, so you don't get blank rows between records on Windows",
            "It is required for mode \"w\"",
            "It makes the reader skip the header",
          ],
          answer: 1,
          explain:
            "The csv module manages its own line endings. Without newline=\"\" Python translates them a second time, which produces an empty line after every record on Windows.",
        },
      ],
    },

    {
      id: "m7-json",
      title: "JSON",
      goal: "Convert between JSON text and Python data with dumps/loads, save and load files with dump/load, and navigate nested data.",
      keywords: ["json", "dumps", "loads", "dump", "load", "indent", "nested", "serialization", "API"],
      exercises: [
        {
          id: "m7-json-e1",
          prompt:
            "`config.json` has already been created and holds an object with the keys `theme`, `font_size` and `plugins` (a list). Load it with `json.load` and print three lines: `theme: <theme>`, `font_size: <font_size>` and `plugins: <how many plugins>` — for example `plugins: 2`.",
          starter: "import json\n\n# your code here\n",
          solution:
            'import json\n\nwith open("config.json") as f:\n    config = json.load(f)\nprint("theme:", config["theme"])\nprint("font_size:", config["font_size"])\nprint("plugins:", len(config["plugins"]))\n',
          hints: [
            "Open the file with `with open(\"config.json\") as f:` and pass `f` — the file object — to `json.load`.",
            "After loading you have an ordinary dictionary: `config[\"theme\"]`.",
            "The third line wants the number of plugins, so `len(config[\"plugins\"])`.",
          ],
          setup:
            "open('config.json', 'w').write('{\"theme\": \"dark\", \"font_size\": 14, \"plugins\": [\"spell\", \"git\"]}')",
          expectOutput: true,
          wrong: [
            'import json\n\nconfig = json.loads("config.json")\nprint("theme:", config["theme"])\nprint("font_size:", config["font_size"])\nprint("plugins:", len(config["plugins"]))\n',
            'import json\n\nwith open("config.json") as f:\n    config = json.load(f)\nprint("theme:", config["theme"])\nprint("font_size:", config["font_size"])\nprint("plugins:", config["plugins"])\n',
          ],
        },
        {
          id: "m7-json-e2",
          prompt:
            "Save the `people` list to a file called `people.json` with `json.dump`, using `indent=2` so the file is readable. Then load the file back with `json.load` into a variable called `restored` and print `restored == people` (it should print `True`).",
          starter:
            'import json\n\npeople = [\n    {"name": "Ana", "age": 31, "cities": ["Lisbon", "Porto"], "member": True},\n    {"name": "Bruno", "age": 45, "cities": [], "member": False},\n]\n# your code here\n',
          solution:
            'import json\n\npeople = [\n    {"name": "Ana", "age": 31, "cities": ["Lisbon", "Porto"], "member": True},\n    {"name": "Bruno", "age": 45, "cities": [], "member": False},\n]\nwith open("people.json", "w") as f:\n    json.dump(people, f, indent=2)\n\nwith open("people.json") as f:\n    restored = json.load(f)\nprint(restored == people)\n',
          hints: [
            "`json.dump(data, f, indent=2)` — the data first, then the open file.",
            "Open the file twice: once with `\"w\"` to write, then again (default mode) to read.",
            "`json.load(f)` returns the data; assign it to `restored`.",
          ],
          expectOutput: true,
          tests:
            "import json, os\nassert os.path.exists('people.json'), 'people.json was not created'\ncontent = open('people.json').read()\nassert json.loads(content) == people, 'people.json should hold exactly the people list — write it with json.dump, not str() or print'\nassert '\\n  ' in content, 'use indent=2 so the file has one value per line'\nassert 'restored' in dir(), 'Load the file back into a variable called restored'\nassert restored == people, 'restored should equal people after the round trip'",
          requires: [{ re: "json\\.dump\\s*\\(", msg: "Use json.dump(data, file, indent=2) to write the file." }],
          wrong: [
            'import json\n\npeople = [\n    {"name": "Ana", "age": 31, "cities": ["Lisbon", "Porto"], "member": True},\n    {"name": "Bruno", "age": 45, "cities": [], "member": False},\n]\nwith open("people.json", "w") as f:\n    f.write(str(people))\n\nwith open("people.json") as f:\n    restored = json.load(f)\nprint(restored == people)\n',
            'import json\n\npeople = [\n    {"name": "Ana", "age": 31, "cities": ["Lisbon", "Porto"], "member": True},\n    {"name": "Bruno", "age": 45, "cities": [], "member": False},\n]\nwith open("people.json", "w") as f:\n    json.dump(people, f)\n\nwith open("people.json") as f:\n    restored = json.load(f)\nprint(restored == people)\n',
          ],
        },
      ],
      quiz: [
        {
          q: "What does `json.dumps({\"ok\": True, \"missing\": None})` return?",
          options: [
            "{'ok': True, 'missing': None}",
            "'{\"ok\": true, \"missing\": null}'",
            "'{\"ok\": True, \"missing\": None}'",
            "An error — None cannot be converted",
          ],
          answer: 1,
          explain:
            "JSON has its own spelling: true/false in lower case, null for None, and double quotes around every key and string. dumps returns that text as a Python string.",
        },
        {
          q: "`json.loads(open(\"data.json\"))` raises a TypeError. Why?",
          options: [
            "loads expects a string; load is the one that reads from a file object",
            "The file must be opened in binary mode",
            "JSON files cannot be opened with open()",
            "loads needs indent=2",
          ],
          answer: 0,
          explain:
            "The s stands for string. json.loads parses text you already have; json.load(f) reads and parses an open file.",
        },
      ],
    },
  ],
};
