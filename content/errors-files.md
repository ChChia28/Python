::: lesson m7-tracebacks

Your code will crash. Everyone's does, several times an hour. The difference
between someone who is stuck and someone who is not is that the second person
**reads the traceback** — the report Python prints when it gives up — instead
of staring at the code.

Press **Run** on this one. It is meant to fail.

```python-error
prices = {"apple": 1.25, "bread": 2.50}
basket = ["apple", "milk"]
total = 0
for item in basket:
    total += prices[item]
print(total)
```

The report looks roughly like this:

```text
Traceback (most recent call last):
  File "main.py", line 5, in <module>
    total += prices[item]
             ~~~~~~^^^^^^
KeyError: 'milk'
```

## Read it from the bottom up

The traceback is written in the order things happened, which means the
useful part is at the **end**:

1. **Last line** — the exception type and its message. `KeyError: 'milk'`
   says "you asked a dictionary for the key `'milk'` and it isn't there".
   Always read this line first.
2. **The line above it** — the exact code that failed, with carets under
   the piece Python was evaluating.
3. **`File "main.py", line 5, in <module>`** — where it happened. `<module>`
   means "at the top level, not inside a function".
4. The first line, `Traceback (most recent call last)`, is just a heading.

So: *what* went wrong, *which* code, *which* line. Then ask why that key,
index or name would be missing.

## When functions call functions

If the crash happens inside a function, the traceback shows the whole chain
of calls that led there, oldest at the top, newest at the bottom.

```python-error
def price_of(item, prices):
    return prices[item]

def basket_total(basket, prices):
    return sum(price_of(item, prices) for item in basket)

prices = {"apple": 1.25, "bread": 2.50}
print(basket_total(["apple", "milk"], prices))
```

The bottom frame (`price_of`, the `prices[item]` line) is where Python
noticed the problem. The frames above show how it got there: `print` called
`basket_total`, which called `price_of`. The code that failed is at the
bottom, but the *data* that caused it (`"milk"`) was typed at the top. Read
the bottom frame for the what, then walk upwards for the why.

## The five you will meet most

| exception | message you'll see | usual cause |
| --- | --- | --- |
| `NameError` | `name 'citty' is not defined` | typo, or using a variable before assigning it |
| `TypeError` | `can only concatenate str (not "int") to str` | mixing types: text + number, calling something that isn't a function |
| `IndexError` | `list index out of range` | asking for position 4 in a list of 4 (the last one is `[3]`) |
| `KeyError` | `'Milk'` | a dictionary key that isn't there — often a capitalisation or spacing difference |
| `ZeroDivisionError` | `division by zero` | an average of an empty list, a percentage of a zero total |

Each of these is one tiny example away:

```python-error
total = 259
print("Total: " + total)
```

```python-error
scores = [88, 92, 79, 95]
print(scores[4])
```

```python-error
cities = ["Lisbon", "Porto"]
for city in cities:
    print(citty.upper())
```

```python-error
visits = []
print(sum(visits) / len(visits))
```

Run each one and read the last line before you read the code. Python 3.14 is
helpful here: for a `NameError` it will often add `Did you mean: 'city'?`.

## Finding the line

The line number counts from the top of *your* file, including blank lines
and comments. Go there, read that one line slowly, and check every name,
index and key against where it was created. Fix it, run again. Tracebacks
come one at a time: fixing the first bug often reveals a second, and that is
normal.

> [!warn]
> The line number is where Python *noticed* the problem, which is not always
> where you *caused* it. `total += prices[item]` fails on the lookup, but the
> real mistake might be `"Milk"` typed with a capital letter ten lines
> earlier when the basket was built.

## Common mistakes

- **Reading only the first line.** `Traceback (most recent call last)` tells
  you nothing. Scroll to the bottom.
- **Changing random things.** If you can't explain why the line failed, add
  a `print()` just above it to see what the variables actually hold.
- **Searching the web for the whole traceback.** Search for the last line
  only — `KeyError` plus a few words — that is the part other people share.

::: lesson m7-try

Some errors you cannot prevent by being careful: the user types `"abc"` when
you asked for a number, a file you need was deleted, a network is down.
**`try`/`except`** lets you say "attempt this; if it raises *that kind* of
exception, do this instead" — and keep running.

```python
text = "forty-two"
try:
    age = int(text)
    print("Next year you will be", age + 1)
except ValueError:
    print(f"'{text}' is not a whole number")
```

Here is the flow. Python runs the `try` block line by line. The moment a line
raises, it **stops the block right there** (the `print` after `int(text)`
never runs), looks for an `except` that matches the exception type, and runs
that instead. If nothing in the `try` block raises, every `except` is
skipped.

## Name the exception you expect

You can handle different problems differently by stacking `except` blocks:

```python
readings = ["12", "x", "0", "8"]
for text in readings:
    try:
        result = 100 / int(text)
    except ValueError:
        print(text, "-> not a number")
    except ZeroDivisionError:
        print(text, "-> cannot divide by zero")
    else:
        print(text, "->", result)
```

Python checks the `except` clauses top to bottom and runs the first one whose
type matches. To catch several types with one block, use a tuple:
`except (ValueError, TypeError):`. To see the message, keep the exception in
a name: `except ValueError as e:` and then `print(e)`.

## The except-everything trap

A bare `except:` (or `except Exception:`) catches *everything*, including
exceptions you never thought about.

```python-static
try:
    total = compute(valuse)     # a typo in the variable name
except:
    print("something went wrong")
```

The `NameError` that would have pointed straight at the typo is swallowed,
and all you get is a vague message. Catch the narrowest type you actually
know how to handle. If you genuinely must catch everything (say, at the top
of a long-running server), at least keep the error:
`except Exception as e: print("failed:", e)`.

## else and finally

Two optional extras complete the statement:

- **`else`** runs only if the `try` block did *not* raise. Put the "it worked"
  code there instead of inside `try`, so that a bug in it isn't mistaken for
  the error you were guarding against.
- **`finally`** runs no matter what — after success, after a handled
  exception, even after an unhandled one. It is for cleanup: closing files,
  releasing locks, printing "done".

```python
def read_setting(settings, key):
    try:
        value = settings[key]
    except KeyError:
        print(f"no setting called {key}, using default")
        value = "default"
    else:
        print(f"found {key}")
    finally:
        print("lookup finished")
    return value

print(read_setting({"theme": "dark"}, "theme"))
print(read_setting({"theme": "dark"}, "font"))
```

Both calls print `lookup finished`, whichever path they took.

## Converting user text safely

The classic use: keep asking until the input is valid.

```python-static
while True:
    text = input("How many tickets? ")
    try:
        tickets = int(text)
        break                      # only reached if int() succeeded
    except ValueError:
        print("Please type a whole number.")
```

`int()` raises `ValueError` for `"abc"`, for `"3.5"`, and for `""`. It is
the right type to catch here — not `TypeError`, which is what you get when
you pass something that isn't a string at all.

> [!warn]
> Keep the `try` block small. Only the line that can fail belongs inside it.
> Wrap twenty lines and you will catch — and hide — errors you never meant
> to handle.

## Common mistakes

- **Bare `except:`.** It hides typos and real bugs. Name the type.
- **Catching the wrong type.** `int("3.5")` is a `ValueError`, not a
  `TypeError`; a missing dictionary key is a `KeyError`, not a `ValueError`.
  Read the traceback once without the `try` to see what is actually raised.
- **Expecting the rest of the `try` block to run.** After the failing line,
  Python jumps straight to `except`. Anything below it inside `try` is skipped.

::: lesson m7-raise

So far exceptions have happened *to* you. Now you make them happen. When a
function is handed something it cannot sensibly work with, the right move is
to stop immediately and say why — and that is exactly what **`raise`** does.

```python
def apply_discount(price, percent):
    if not 0 <= percent <= 100:
        raise ValueError(f"percent must be between 0 and 100, got {percent}")
    return round(price * (1 - percent / 100), 2)

print(apply_discount(80, 25))
```

`raise` takes an exception object. You create one by calling the class with
a message, exactly as you would create any object. From then on it behaves
like any exception you have seen: the function stops, the traceback is
printed unless someone catches it.

```python-error
def apply_discount(price, percent):
    if not 0 <= percent <= 100:
        raise ValueError(f"percent must be between 0 and 100, got {percent}")
    return round(price * (1 - percent / 100), 2)

print(apply_discount(80, 150))
```

The traceback ends with `ValueError: percent must be between 0 and 100, got
150`. Compare that with what would happen without the check: the function
would quietly return `-40.0` and the bug would surface somewhere else, much
later, with no clue where it came from.

## Exceptions versus return codes

You could return `None` or `-1` to signal a problem instead. The trouble is
that a return value is easy to ignore: `total += apply_discount(...)` with a
`None` in it crashes three lines later with a confusing `TypeError`, or
worse, a `-1` silently flows into the sum. An exception **cannot** be
ignored. It carries a message, it stops the program at the right place, and
a caller who knows how to recover can catch it. Validate arguments at the top
of a function and raise early.

Which type? `ValueError` for "right type, unacceptable value" (negative age,
empty list), `TypeError` for "wrong kind of thing entirely" (a string where
a number was needed). Those two cover most of what you will write.

## Custom exceptions

Sometimes none of the built-ins describes your situation, or you want callers
to catch *your* error without catching everything else. Define a class that
inherits from `Exception`. Its body can be just `pass` — the name is the
point.

```python
class InsufficientFunds(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFunds(f"cannot withdraw {amount} from {balance}")
    return balance - amount

print(withdraw(100, 30))
try:
    withdraw(50, 80)
except InsufficientFunds as e:
    print("Declined:", e)
```

Because `InsufficientFunds` inherits from `Exception`, it works everywhere
an exception does: `raise` accepts it, `except InsufficientFunds` catches
it, and `str(e)` gives back the message you passed in.

## Re-raising

Sometimes you want to notice an error — log it, add context — but not
handle it. A bare `raise` inside an `except` block re-raises the current
exception, unchanged, for someone further up to deal with.

```python
def load_balance(account):
    try:
        return account["balance"]
    except KeyError:
        print(f"account {account['id']} has no balance field")
        raise

try:
    load_balance({"id": 7})
except KeyError:
    print("the caller handles it from here")
```

> [!warn]
> Don't `raise Exception("...")`. It works, but the only way for a caller to
> catch it is `except Exception`, which also catches every other error in the
> program. Use a specific built-in, or define your own class.

## Common mistakes

- **Returning an error value instead of raising.** `return -1` is forgotten
  by the next line; `raise ValueError(...)` is not.
- **Raising with no message.** `raise ValueError` is legal but the traceback
  then says only `ValueError`. Say what was wrong *and* what you got.
- **Catching and returning `None` silently.** If you cannot fix the
  problem where you caught it, re-raise it with a bare `raise`.

::: lesson m7-files

A program that only prints is a toy. Real scripts read a file somebody gave
them and write a file somebody else will open. In Python a file is opened
with **`open()`**, which hands you a *file object* you can read from or write
to.

> In this course the working directory is wiped before every run, so each
> example below creates the file it needs first. In the exercises a `setup`
> step has already created the input file for you.

```python
with open("notes.txt", "w") as f:
    f.write("buy milk\n")
    f.write("call Ana\n")
print("written 2 lines")
```

Three things to notice. The second argument, `"w"`, is the **mode**. The
`with` statement opens the file and *guarantees* it is closed when the block
ends. And `write()` does not add a newline for you — the `"\n"` is yours to
write.

## Modes

| mode | meaning | if the file exists | if it doesn't |
| --- | --- | --- | --- |
| `"r"` | read (the default) | reads it | `FileNotFoundError` |
| `"w"` | write | **erases it** | creates it |
| `"a"` | append | adds to the end | creates it |

## Reading

There are three common ways to get text back out, and they suit different
jobs.

```python
with open("notes.txt", "w") as f:
    f.write("buy milk\ncall Ana\nfix bike\n")

with open("notes.txt") as f:
    content = f.read()
print(repr(content))

with open("notes.txt") as f:
    lines = f.readlines()
print(lines)

with open("notes.txt") as f:
    for line in f:
        print(line.strip())
```

- `.read()` gives the whole file as one string — `repr()` shows the hidden
  `\n` characters.
- `.readlines()` gives a list of strings, one per line, **each still ending
  in `\n`**.
- Looping over the file object gives one line at a time without loading
  everything into memory, which is what you want for big files.

In the last two cases the newline is still attached to each line, which is
why nearly every file-reading loop starts with `line.strip()` (or
`line.rstrip("\n")` if leading spaces matter).

## Writing lines

Build each line yourself and add the newline, or let `print` do it with its
`file=` argument.

```python
cities = ["Lisbon", "Porto", "Faro"]
with open("cities.txt", "w") as f:
    for city in cities:
        f.write(city + "\n")

with open("cities.txt", "a") as f:
    print("Braga", file=f)

with open("cities.txt") as f:
    print(f.read().splitlines())
```

`.splitlines()` is the tidy way to turn a block of text into a list of lines
with the newlines already removed.

## Why `with`

Written text sits in a buffer and only reaches the disk when the file is
closed. Without `with` you have to remember `f.close()`, and if an exception
occurs before that line the file stays open and the last lines may never be
written. `with` closes the file on the way out of the block, whatever
happens — it is the `finally` from the previous lesson, built in.

## A file that isn't there

Reading a missing file raises `FileNotFoundError`, and you already know how
to handle that.

```python
try:
    with open("missing.txt") as f:
        print(f.read())
except FileNotFoundError:
    print("no saved data yet, starting fresh")
```

> [!warn]
> `"w"` erases the file the moment it is opened, even if you then write
> nothing. Opening in `"w"` *inside* a loop is the classic way to end up with
> a file containing only the last line.

## Common mistakes

- **Double newlines.** Lines read from a file end in `\n`; `print(line)` adds
  another. Strip first, or `print(line, end="")`.
- **Reading twice.** After `.read()` the position is at the end of the file;
  a second `.read()` returns `""`. Re-open the file or store the content.
- **Forgetting the newline when writing.** `f.write(name)` in a loop
  produces one long line. Write `name + "\n"`.

::: lesson m7-csv

**CSV** — comma-separated values — is the format every spreadsheet can export
and every tool can import. One record per line, fields separated by commas,
usually a header line first. It looks simple enough to handle with
`.split(",")`, and the standard library has a `csv` module precisely because
that is a trap.

```python
import csv

with open("scores.csv", "w", newline="") as f:
    f.write("name,score,city\nAna,91,Lisbon\nBruno,78,Porto\nCarla,100,Faro\n")

with open("scores.csv", newline="") as f:
    for row in csv.reader(f):
        print(row)
```

`csv.reader` turns each line into a **list of strings** — the header row
included. Notice `"91"` in quotes: CSV has no types, everything is text
until you convert it.

## DictReader: rows as dictionaries

Working by position (`row[1]`) is fragile. `csv.DictReader` uses the header
row as keys, so each row becomes a dictionary.

```python
import csv

with open("scores.csv", "w", newline="") as f:
    f.write("name,score,city\nAna,91,Lisbon\nBruno,78,Porto\nCarla,100,Faro\n")

total = 0
with open("scores.csv", newline="") as f:
    for row in csv.DictReader(f):
        total += int(row["score"])
        print(row["name"], "lives in", row["city"])
print("Total:", total)
```

The `int(...)` matters. Without it, `total += "91"` is a `TypeError`, and
`max()` over the raw strings would tell you `"91"` beats `"100"` because
`"9"` comes after `"1"` in the alphabet.

The `newline=""` argument looks odd but is the documented way to open CSV
files: the `csv` module handles line endings itself, and this stops Python
from translating them a second time (which gives blank lines on Windows).

## Writing with csv.writer

```python
import csv

products = [("Coffee, ground", 8.5), ("Tea", 3.0), ("Sugar", 1.25)]
with open("products.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "price"])
    writer.writerows(products)

with open("products.csv") as f:
    print(f.read())
```

Look at the first data line: `"Coffee, ground",8.5`. The name contains a
comma, so the writer wrapped it in quotes, and `csv.reader` will unwrap it
on the way back in. Had you written `",".join(...)` yourself, every reader
in the world would see four fields on that line instead of two.

`DictWriter` is the mirror of `DictReader`: give it the column names, call
`writeheader()`, then hand it dictionaries.

```python
import csv

rows = [{"name": "Tea", "price": 3.0}, {"name": "Sugar", "price": 1.25}]
with open("products.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "price"])
    writer.writeheader()
    writer.writerows(rows)

with open("products.csv") as f:
    print(f.read())
```

> [!warn]
> Never build or parse CSV with string joins and splits. Commas inside
> values, quotes inside values and line breaks inside values are all legal
> CSV, and each one breaks the naive version. `csv.reader` and `csv.writer`
> get every case right.

## Common mistakes

- **Summing strings.** Every value from a CSV is text. Convert with `int()`
  or `float()` before doing maths or comparing sizes.
- **Counting the header as data.** With `csv.reader`, the first row is the
  header. Skip it with `next(reader)` or switch to `DictReader`.
- **Forgetting `newline=""`.** It works by accident on Linux and macOS and
  produces blank lines between rows on Windows. Write it every time.

::: lesson m7-json

**JSON** is the text format of the web: APIs return it, config files are
written in it, and apps use it to save their state. It looks almost exactly
like Python dictionaries and lists written out — which is why the `json`
module can convert between the two in a single call.

| JSON | Python |
| --- | --- |
| `{"a": 1}` object | `dict` |
| `[1, 2]` array | `list` |
| `"text"` | `str` |
| `42`, `3.5` | `int`, `float` |
| `true` / `false` | `True` / `False` |
| `null` | `None` |

Only those six kinds exist in JSON. No tuples, no sets, no dates — and keys
are always strings.

## dumps and loads: strings

`json.dumps()` turns a Python value into a JSON **string** (the *s* is for
string); `json.loads()` parses one back.

```python
import json

profile = {"name": "Ana", "age": 31, "languages": ["pt", "en"], "student": False, "manager": None}
text = json.dumps(profile)
print(text)
print(type(text))
```

Spot the differences: `False` became `false`, `None` became `null`, and
every string uses double quotes. That is JSON's spelling, not Python's.

```python
import json

text = '{"city": "Porto", "temps": [18, 21, 19], "rain": false}'
data = json.loads(text)
print(data["city"])
print(data["temps"][1])
print(data["rain"] is False)
```

After `loads` you have an ordinary dictionary: index it, loop over it, do
maths on its numbers. `data["rain"]` is the real Python `False`.

## dump and load: files

Without the *s*, the same functions talk to a file object instead of a
string. `indent=2` makes the output human-readable, one value per line.

```python
import json

tasks = [{"title": "Write report", "done": False}, {"title": "Email Ana", "done": True}]
with open("tasks.json", "w") as f:
    json.dump(tasks, f, indent=2)

with open("tasks.json") as f:
    print(f.read())

with open("tasks.json") as f:
    loaded = json.load(f)
print(loaded == tasks)
```

That last line is the point of JSON: dump a list of records, load it back,
and you have exactly the same data. Saving and restoring an app's state is
those two calls.

## Nested data

Real JSON nests: objects inside arrays inside objects. There is no new
syntax — chain the keys and indexes you already know.

```python
import json

order = json.loads('{"id": 1042, "customer": {"name": "Bruno", "city": "Porto"}, "items": [{"sku": "A1", "qty": 2}, {"sku": "B7", "qty": 1}]}')
print(order["customer"]["city"])
for item in order["items"]:
    print(item["sku"], "x", item["qty"])
print("units:", sum(item["qty"] for item in order["items"]))
```

When you are not sure of the shape, `print(json.dumps(data, indent=2))` is
the quickest way to see it.

> [!warn]
> The round trip is exact only for the six JSON types. A tuple comes back as
> a list, an integer key such as `{1: "a"}` comes back as the string `"1"`,
> and a set or a `datetime` cannot be dumped at all — `json.dumps` raises
> `TypeError: Object of type set is not JSON serializable`. Convert those to
> lists or strings first.

## Common mistakes

- **`load` vs `loads`.** `loads` takes a string, `load` takes an open file.
  Passing a filename string to `loads` gives a `JSONDecodeError` on the
  first character.
- **Single quotes in JSON text.** `'{"a": 1}'` is fine — the *outer* quotes
  are Python's. `"{'a': 1}"` is not: JSON itself only allows double quotes.
- **Forgetting to write back.** Changing the loaded dictionary changes it in
  memory only. Save with `json.dump` or the file stays as it was.
