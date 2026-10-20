::: lesson m4-def

So far every program you have written runs top to bottom once and then stops.
The moment you need the same five lines in three places, you copy and paste —
and the moment you find a bug, you fix it in three places. A **function**
solves that: it is a named block of code that you write once and run as often
as you like.

```python
def greet(name):
    print(f"Hello, {name}! Welcome to the course.")

greet("Aisha")
greet("Daniel")
greet("Mei Ling")
```

Three lines of output from one body. The pieces:

| piece | meaning |
| --- | --- |
| `def` | "I am defining a function" |
| `greet` | its name — snake_case, like a variable |
| `(name)` | the **parameters**: names the body can use |
| `:` and the indented block | the body — runs every time you call the function |
| `greet("Aisha")` | a **call**: run the body with `name` set to `"Aisha"` |

## Parameters and arguments

People use these two words loosely, but they are different things. A
**parameter** is the name in the `def` line — a placeholder. An **argument** is
the actual value you pass in the call. `name` is a parameter; `"Aisha"` is an
argument. Each call binds the arguments to the parameters, runs the body, and
throws the bindings away.

A function can take as many parameters as it needs, separated by commas, and
the arguments are matched left to right:

```python
def print_receipt(item, quantity, unit_price):
    total = quantity * unit_price
    print(f"{quantity} x {item} @ RM{unit_price:.2f} = RM{total:.2f}")

print_receipt("Nasi lemak", 2, 3.50)
print_receipt("Teh tarik", 3, 2.20)
```

## Define before you call

Python reads your file top to bottom. The `def` line does not *run* the body;
it stores the function under its name. The body only runs when something calls
it. That means the definition must come before the first call:

```python-error
total_sales(1200, 850)

def total_sales(morning, afternoon):
    print(morning + afternoon)
```

`NameError: name 'total_sales' is not defined` — at the moment of the call,
Python has not reached the `def` yet. Move the call below the definition and it
works.

## One function, one job

A good function does one thing and its name says what. `print_receipt` prints a
receipt. If you find yourself naming something `load_and_clean_and_print`, that
is three functions. Small functions are easier to test, easier to reuse, and
far easier to read six months from now.

Reuse is the whole point. Once `print_receipt` exists, any part of the program
can use it — a loop over a shopping basket, for instance:

```python
def print_receipt(item, quantity, unit_price):
    print(f"{quantity} x {item} = RM{quantity * unit_price:.2f}")

basket = [("Roti canai", 4, 1.50), ("Kopi", 2, 2.80), ("Curry puff", 6, 1.20)]
for item, quantity, price in basket:
    print_receipt(item, quantity, price)
```

The loop body is one line, and if the receipt format ever changes you edit one
place.

## Common mistakes

- **Defining but never calling.** `def` on its own prints nothing. If your
  function seems to "do nothing", check that you actually call it:
  `greet("Aisha")`, with the parentheses.
- **Forgetting the parentheses.** `greet` on its own is just the function
  object; `greet()` runs it.
- **Calling above the definition.** The call must come after the `def` in the
  file (or inside another function that is called later).
- **Wrong number of arguments.** `print_receipt("Kopi", 2)` fails with
  `TypeError: missing 1 required positional argument`. Count the parameters in
  the `def` line.

::: lesson m4-return

`print` and `return` look similar when you are starting out — both seem to
"give you the answer". They do completely different jobs. **`print` shows a
value to the human** reading the screen. **`return` hands a value back to the
code that called the function**, so the program can keep working with it.

```python
def double(n):
    return n * 2

result = double(21)
print(result + 1)
print(double(5) + double(6))
```

`double(21)` *becomes* `42` wherever it is written. You can store it, add to
it, pass it to another function. A function that only prints cannot do any of
that — its result is gone the moment it hits the screen.

## No return means None

If a function finishes without hitting a `return`, the call evaluates to
`None`:

```python
def shout(word):
    print(word.upper() + "!")

answer = shout("hello")
print(answer)
```

`HELLO!` is printed by the function; `None` is printed by the last line,
because `shout` never returned anything. This is the single most common
beginner bug: writing `print` inside the function, then trying to use the
result and getting `None` — or `TypeError: unsupported operand type(s) for +:
'NoneType' and 'int'` when you try to add to it.

## return ends the function immediately

The moment Python reaches a `return`, the function stops — any lines after it
on that path never run. That makes **early return** a clean way to handle
cases one at a time:

```python
def letter_grade(score):
    if score >= 90:
        return "A"
    if score >= 75:
        return "B"
    if score >= 60:
        return "C"
    return "F"

for score in [95, 78, 61, 40]:
    print(score, letter_grade(score))
```

No `elif` needed: if the first `return` fires, nothing below it is reached.

The same idea inside a loop means "stop at the first match":

```python
def first_long_word(words, min_length):
    for word in words:
        if len(word) >= min_length:
            return word
    return None

cities = ["Ipoh", "Penang", "Kuala Lumpur", "Johor Bahru"]
print(first_long_word(cities, 6))
print(first_long_word(cities, 20))
```

The `return None` after the loop is what runs when nothing matched. Writing it
out makes the "not found" case visible instead of accidental.

## Returning more than one value

`return low, high` returns a **tuple**, and the caller can unpack it straight
into two names:

```python
def min_max(numbers):
    return min(numbers), max(numbers)

lowest, highest = min_max([34, 12, 89, 5, 67])
print(f"Range: {lowest} to {highest}")
```

> [!warn]
> `return` inside a `for` loop ends the *whole function*, not just the loop. If
> your function only ever looks at the first item, the `return` is probably one
> indentation level too far out — it belongs inside the `if`.

## Common mistakes

- **`print` where you meant `return`.** If you want to *use* the result —
  store it, add it, test it — `return` it. Print at the call site instead.
- **`return` inside the loop, unconditionally.** `for n in numbers: return n`
  returns on the very first item. The `return` belongs inside the `if`, or
  after the loop.
- **A branch with no return.** If the `if` returns a value but the `else` only
  prints, half your calls come back as `None`. Make every path return.
- **Code after `return`.** Anything you write below a `return` in the same
  block never runs.

::: lesson m4-params

Most functions have a sensible "usual" setting that callers rarely change. A
**default value** lets you bake that setting into the parameter, so callers
only mention it when they want something different.

```python
def greet(name, greeting="Hello"):
    print(f"{greeting}, {name}!")

greet("Aisha")
greet("Daniel", "Good morning")
```

`greeting="Hello"` means: if the caller gives a second argument, use it;
otherwise use `"Hello"`. The parameter has become optional.

## Keyword arguments

Up to now you have matched arguments to parameters by position. You can also
name them, in which case the order does not matter:

```python
def book_room(guest, nights=1, breakfast=False, room_type="standard"):
    print(f"{guest}: {nights} night(s), {room_type} room, breakfast={breakfast}")

book_room("Mei Ling", 3)
book_room("Daniel", breakfast=True)
book_room("Aisha", room_type="suite", nights=2)
```

Keyword arguments do two things for you. They let you skip the defaults you do
not care about (`breakfast=True` without mentioning `nights`), and they make
the call readable — `book_room("Aisha", 2, True)` says a lot less than
`book_room("Aisha", nights=2, breakfast=True)`.

## The rules

- **Positional arguments come first** in a call. `book_room(guest="Aisha", 2)`
  is a `SyntaxError`.
- **Required parameters come first** in a `def`. Every parameter after the
  first one with a default must also have a default:

```python-error
def book_room(nights=1, guest):
    print(guest, nights)
```

`SyntaxError: parameter without a default follows parameter with a default`.
Python cannot tell whether `book_room("Aisha")` means `nights="Aisha"` or
`guest="Aisha"`, so it refuses. Put the required parameters first.

## The mutable default trap

A default value is created **once**, when Python reads the `def` line — not
fresh on every call. For numbers and strings that does not matter, because
they cannot change. For a list or a dictionary it matters a great deal:

```python
def add_item(item, cart=[]):
    cart.append(item)
    return cart

print(add_item("milk"))
print(add_item("eggs"))
print(add_item("bread"))
```

You probably expected three one-item carts. Instead every call appends to the
*same* list, which Python built once and keeps reusing. The fix is to use
`None` as the default and create the list inside the function:

```python
def add_item(item, cart=None):
    if cart is None:
        cart = []
    cart.append(item)
    return cart

print(add_item("milk"))
print(add_item("eggs"))
print(add_item("bread", ["rice"]))
```

> [!warn]
> Never write `=[]` or `={}` as a default. Use `=None` and build the empty
> collection inside the body. Every experienced Python programmer has been
> bitten by this exactly once.

## Common mistakes

- **A required parameter after an optional one.** `def f(a=1, b)` is a
  `SyntaxError`. Reorder.
- **Positional after keyword.** `greet(greeting="Hi", "Aisha")` is a
  `SyntaxError`. Keywords go last.
- **Mutable defaults.** `items=[]` shares one list across every call. Use
  `items=None`.
- **Misspelling a keyword.** `book_room("Aisha", night=2)` fails with
  `TypeError: got an unexpected keyword argument 'night'`. The name must match
  the `def` exactly.

::: lesson m4-scope

Every function call gets its own private workspace. Variables you create inside
a function live in that workspace, and the workspace is thrown away when the
function returns. That is **local scope**, and it is why two functions can both
use a variable called `total` without stepping on each other.

```python
def count_vowels(text):
    total = 0
    for ch in text.lower():
        if ch in "aeiou":
            total += 1
    return total

print(count_vowels("Kuala Lumpur"))
print(count_vowels("Ipoh"))
```

`total` is born at the start of each call and gone at the end. Trying to read
it outside confirms that:

```python-error
def count_vowels(text):
    total = 0
    for ch in text.lower():
        if ch in "aeiou":
            total += 1
    return total

count_vowels("Penang")
print(total)
```

`NameError: name 'total' is not defined`. The function's `total` is not
visible out here — only its returned *value* is, and that was discarded.

## Reading a global is fine

Variables created at the top level of the file are **global**: visible
everywhere, including inside functions. Reading one from a function is normal
and useful — that is how constants work:

```python
TAX_RATE = 0.06

def price_with_tax(price):
    return round(price * (1 + TAX_RATE), 2)

print(price_with_tax(100))
print(price_with_tax(24.90))
```

Python looks for `TAX_RATE` in the local workspace, does not find it, and then
looks in the global one. Upper-case names are the convention for "this is a
constant, don't reassign it".

## Assigning makes it local

Here is the trap. If a function **assigns** to a name anywhere in its body,
Python decides that name is local for the *whole* function — even on lines
before the assignment:

```python-error
visits = 0

def record_visit():
    visits = visits + 1
    print(visits)

record_visit()
```

`UnboundLocalError: cannot access local variable 'visits' where it is not
associated with a value`. Because `visits = ...` appears in the body, `visits`
is local — and on the right-hand side it has not been given a value yet. The
global `visits` is never consulted at all.

## The global keyword, and why to avoid it

`global visits` at the top of the function tells Python "I mean the one
outside":

```python
visits = 0

def record_visit():
    global visits
    visits = visits + 1

record_visit()
record_visit()
print(visits)
```

It works, and it is almost always the wrong tool. A function that silently
changes variables outside itself is hard to test (the result depends on
history), hard to reuse (it only works with that one variable) and hard to
debug (who changed `visits`? anyone, anywhere). Use it in a throwaway script
if you must; do not build anything on it.

## Pass values in, return them out

The clean pattern is: whatever the function needs comes in as a parameter,
whatever it produces goes out as a return value. The caller decides what to do
with it.

```python
def record_visit(count):
    return count + 1

visits = 0
visits = record_visit(visits)
visits = record_visit(visits)
print(visits)
```

Now `record_visit` is predictable: same input, same output, no surprises. You
can call it on any counter, not just `visits`.

## Common mistakes

- **Expecting a local to survive the call.** Variables inside a function vanish
  when it returns. `return` the value you need.
- **Reading and then assigning a global in one function.** `count = count + 1`
  inside a function is `UnboundLocalError`. Take `count` as a parameter and
  return the new value.
- **Reaching for `global` to "make it work".** It does, and it makes the
  function depend on hidden state. Prefer parameters and return values.
- **Shadowing.** A local called `price` inside the function and a global
  `price` outside are two different variables. The local wins inside the
  function; the global is untouched.

::: lesson m4-args

`print` is a function you have called with one argument, three arguments, and
no arguments at all. How does it accept any number? With a **star parameter**.
Put `*` in front of a parameter name and Python collects every extra positional
argument into a tuple:

```python
def total(*numbers):
    print(f"Got {len(numbers)} numbers: {numbers}")
    return sum(numbers)

print(total(5, 10, 15))
print(total(2.5))
print(total())
```

The name `numbers` is up to you; it is the `*` that does the work. By
convention the catch-all is often called `*args` ("arguments"), but a
descriptive name reads better when you have one.

## **kwargs collects keyword arguments

Two stars collect extra **keyword** arguments into a dictionary, with the
keyword as the key:

```python
def describe(name, **details):
    print(f"{name}:")
    for key, value in details.items():
        print(f"  {key} = {value}")

describe("Aisha", city="Kuala Lumpur", role="analyst")
describe("Daniel", age=31)
```

Again the name is a convention (`**kwargs`, "keyword arguments"); the `**` is
what matters.

The full parameter order is: normal parameters, then `*args`, then
keyword-only parameters, then `**kwargs`. You will rarely need every slot, but
`def f(a, b, *rest, **options)` is the shape to remember.

## Unpacking into a call

The stars work in the opposite direction too. In a *call*, `*` spreads a list
(or tuple) out into separate positional arguments, and `**` spreads a
dictionary out into keyword arguments:

```python
def book_flight(passenger, origin, destination):
    print(f"{passenger}: {origin} -> {destination}")

trip = ["Mei Ling", "KUL", "SIN"]
book_flight(*trip)

details = {"origin": "KUL", "destination": "NRT", "passenger": "Daniel"}
book_flight(**details)
```

Without the star, `book_flight(trip)` passes the whole list as a single
argument and fails: `missing 2 required positional arguments`.

The unpacking trick is everyday Python with `print`:

```python
scores = [88, 92, 79]
print(scores)
print(*scores)
print(*scores, sep=" | ")
```

The first line prints a list; the second prints three separate values, exactly
as if you had written `print(88, 92, 79)`.

## Forwarding arguments

Combine both sides and you can write a function that accepts *anything* and
passes it on unchanged. This is how wrappers and logging helpers work:

```python
def log(*args, **kwargs):
    print("[LOG]", end=" ")
    print(*args, **kwargs)

log("Order", 1042, "shipped")
log("a", "b", "c", sep="-")
```

`log` does not need to know what `print` accepts. Whatever it receives, it
hands over.

## Common mistakes

- **Treating `args` as a list.** It is a tuple. You can loop over it and index
  it, but not append. `list(args)` if you need to.
- **Forgetting the star in the call.** `total(scores)` passes one argument (the
  list); `total(*scores)` passes each item.
- **Thinking the names are magic.** `*args` and `**kwargs` are conventions.
  `*numbers` and `**options` work identically.
- **Putting `*args` after `**kwargs`.** The order is fixed: positional,
  `*args`, keyword-only, `**kwargs`.

::: lesson m4-lambda

In Python, a function is a value like any other. You can store it in a
variable, put it in a list or a dictionary, and — most usefully — pass it to
another function. The name without parentheses *is* the function; the
parentheses *call* it.

```python
def add(a, b):
    return a + b

def multiply(a, b):
    return a * b

operations = {"+": add, "*": multiply}
print(operations["+"](3, 4))
print(operations["*"](3, 4))
print(type(add))
```

`operations["+"]` looks up the function object; the `(3, 4)` that follows
calls it.

## Passing a function as an argument

A function that takes another function as a parameter can be told *what to do*
by its caller. That is the mechanism behind sorting, filtering, event handlers
and most of the data tools you will meet later:

```python
def apply_to_all(func, values):
    return [func(v) for v in values]

def to_ringgit(usd):
    return round(usd * 4.7, 2)

print(apply_to_all(to_ringgit, [10, 25.5, 100]))
print(apply_to_all(len, ["Ipoh", "Penang", "Kuala Lumpur"]))
```

Notice `to_ringgit` and `len` are passed **without parentheses**.
`apply_to_all(to_ringgit(), ...)` would try to call `to_ringgit` with no
arguments and crash before `apply_to_all` even starts.

## lambda: a function in one expression

When the function you want to pass is tiny and used once, defining it with
`def` feels heavy. A **lambda** is an anonymous function written inline:
`lambda parameters: expression`. The expression's value is returned
automatically.

```python
def apply_to_all(func, values):
    return [func(v) for v in values]

double = lambda n: n * 2
print(double(21))

print(apply_to_all(lambda usd: round(usd * 4.7, 2), [10, 25.5, 100]))
```

A lambda can hold one expression only — no statements, no `if` blocks, no
loops. If it will not fit on one readable line, write a `def`.

## Sorting with key=

The place you will use lambdas most is `sorted`. Its `key=` parameter takes a
function; `sorted` calls it on every item and sorts by what comes back. `min`
and `max` take the same `key=`, which answers "which item has the biggest
something?" in one line:

```python
products = [
    {"name": "Keyboard", "price": 129.0},
    {"name": "Mouse", "price": 45.5},
    {"name": "Monitor", "price": 899.0},
]

by_price = sorted(products, key=lambda p: p["price"])
print([p["name"] for p in by_price])

print(sorted(["pear", "fig", "banana"], key=len))

dearest = max(products, key=lambda p: p["price"])
print(dearest["name"])
```

Add `reverse=True` to `sorted` for descending order.

## map and filter

You will see `map(func, items)` and `filter(func, items)` in older code — they
apply a function to every item, or keep the items where it returns `True`. A
comprehension does the same job and reads better: `[f(x) for x in items]` and
`[x for x in items if test(x)]`. Know what they mean; prefer the
comprehension.

## Common mistakes

- **Calling instead of passing.** `sorted(items, key=len())` is wrong — `len()`
  runs immediately and fails. Pass the name: `key=len`.
- **A lambda with a statement.** `lambda x: print(x)` works (a call is an
  expression), but `lambda x: return x` is a `SyntaxError`.
- **Lambdas that are too clever.** If you need to read it twice, give it a
  name with `def`.
- **Assigning a lambda to a name** as a habit. `double = lambda n: n * 2` is
  fine for a demo; in real code `def double(n)` gives better error messages.

::: lesson m4-docs

Code is read far more often than it is written. The habits in this lesson — a
docstring, type hints, small single-purpose functions, guard clauses — are
what make the difference between a function somebody can use without reading
its body and one they have to reverse-engineer.

## Docstrings

A **docstring** is a string literal placed as the *first statement* in a
function body. Python stores it on the function, and `help()` shows it:

```python
def percent(part, whole):
    """Return part as a percentage of whole, rounded to 1 decimal place."""
    return round(part / whole * 100, 1)

help(percent)
print(percent.__doc__)
```

Conventions: triple double quotes, a one-line summary in the imperative
("Return…", "Compute…", not "This function returns…"), and for longer
functions a blank line followed by details about the parameters and the return
value. Every editor shows docstrings in a tooltip when you hover over a call,
which is why they matter more than comments.

## Type hints

**Type hints** label what a function expects and what it gives back:

```python
def percent(part: float, whole: float) -> float:
    """Return part as a percentage of whole, rounded to 1 decimal place."""
    return round(part / whole * 100, 1)

print(percent(3, 8))
print(percent.__annotations__)
```

`part: float` says "part should be a float"; `-> float` says "and the result
is a float". Collections take their item types in square brackets:
`list[int]`, `dict[str, float]`, `tuple[str, int]`.

Python does **not** enforce hints. `percent("3", "8")` still reaches the body
and fails there, not at the call. Hints exist for people and tools: your editor
uses them for autocomplete, and checkers like mypy use them to flag mistakes
before you run anything. Treat them as documentation that machines can read.

## Small functions with honest names

A function should do one thing, and its name should be a verb phrase that says
what: `load_scores`, `average`, `format_report`. If you need "and" to describe
it, split it. Three small functions are easier to test than one big one, and
the big one usually turns out to be three lines:

```python
def average(values: list[float]) -> float:
    """Return the mean of values, or 0.0 for an empty list."""
    if not values:
        return 0.0
    return sum(values) / len(values)

def letter(score: float) -> str:
    """Map a score out of 100 to a letter grade."""
    if score >= 75:
        return "A"
    if score >= 50:
        return "B"
    return "C"

def report(name: str, scores: list[float]) -> str:
    """Build a one-line summary for a student."""
    mean = average(scores)
    return f"{name}: {mean:.1f} ({letter(mean)})"

print(report("Aisha", [82, 91, 77]))
print(report("Daniel", []))
```

## Guard clauses

A **guard clause** is an early `return` that deals with an awkward case at the
top, so the main logic below runs unindented, in the normal case:

```python
def discount(price: float, member: bool) -> float:
    """Return the price after the member discount, if any."""
    if price <= 0:
        return 0.0
    if not member:
        return price
    return round(price * 0.9, 2)

print(discount(200, True))
print(discount(200, False))
print(discount(-5, True))
```

Each `if` answers one question and gets out of the way. The alternative —
nested `if`/`else` three levels deep — says the same thing and is much harder
to follow.

> [!tip]
> Guard clauses go at the top, in order of "cheapest to check". Empty input,
> zero, `None`, negative numbers: deal with those first, then write the real
> logic as if they cannot happen.

## Common mistakes

- **Docstring not first.** If a line of code comes before the string, it is
  just an unused string, and `help()` shows nothing.
- **Trusting hints to validate.** `def f(n: int)` happily accepts `"5"`. If
  you need a check, write one.
- **Comments that restate the code.** `# add one to count` above `count += 1`
  is noise. Say *why*, or say nothing and let the function name speak.
- **One giant function.** If it does not fit on a screen, it is doing several
  jobs. Split it, name the parts, and the `report` function nearly writes
  itself.
