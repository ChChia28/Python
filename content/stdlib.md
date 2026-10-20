::: lesson m9-imports

Every program you have written so far lived in one file. Real programs do not.
They are split into **modules** — a module is just a `.py` file — and one file
pulls in what it needs from another with `import`. You have already done this
with `math` and `random`; now you will see where those modules come from and
write one of your own.

The mental model: `import shapes` finds a file called `shapes.py`, runs it top
to bottom **once**, and gives you a module object whose attributes are every
name that file defined. `shapes.area` is "the `area` that lives in `shapes`".

```python
with open("shapes.py", "w") as f:
    f.write("""PI = 3.14159

def area(radius):
    return PI * radius * radius

def circumference(radius):
    return 2 * PI * radius
""")

import shapes

print(shapes.area(2))
print(shapes.circumference(2))
print(shapes.PI)
```

The first block writes the file, so the example is self-contained. Normally
`shapes.py` would already be sitting next to your script. In the exercises you
will write the file yourself, exactly like this.

## Three ways to import

```python
with open("shapes.py", "w") as f:
    f.write("PI = 3.14159\ndef area(radius):\n    return PI * radius * radius\n")

import shapes                      # 1. the whole module, used as shapes.area
from shapes import area, PI        # 2. just these names, used bare
import shapes as sh                # 3. the whole module, under a shorter name

print(shapes.area(1))
print(area(1), PI)
print(sh.area(3))
```

All three run `shapes.py` only once; Python caches the module after the first
import. Choose by readability: `import shapes` keeps it obvious where `area`
came from, `from shapes import area` is shorter when you use it twenty times,
and `as` exists for long names (`import numpy as np` is the famous one).

## Where modules come from

When you write `import shapes`, Python looks through a list of folders called
`sys.path`, in order, and takes the first `shapes.py` it finds. The first entry
is the folder your script lives in — which is why a file you just wrote is
importable with no setup at all. After that come the standard library and any
installed packages.

```python
import sys
import math

print(sys.path[0])
print(math.__name__)
print([name for name in dir(math) if name.startswith("s")])
```

`dir(module)` lists everything a module offers. It is the quickest way to
explore an unfamiliar one.

## `if __name__ == "__main__":`

Every module has a `__name__`. When a file runs directly it is `"__main__"`;
when the same file is imported, `__name__` is the module's own name. That gives
you a way to put a demo or a quick test at the bottom of a module that runs
when you execute the file but stays silent when someone imports it.

```python
with open("temperature.py", "w") as f:
    f.write("""def to_fahrenheit(celsius):
    return celsius * 9 / 5 + 32

if __name__ == "__main__":
    print("Demo:", to_fahrenheit(100))
""")

import temperature
print(temperature.to_fahrenheit(37))
print(__name__)
```

Nothing printed "Demo" — the guard saw `__name__ == "temperature"` and skipped
it. Your own script, meanwhile, reports `__main__`. Get into the habit of
putting the guard in every module you write; it is what makes a file usable
both as a tool and as a library.

> [!warn]
> `from shapes import *` dumps every name in the module into your file. It
> looks convenient, but now `area` could have come from any of five modules,
> and a later `import *` can silently overwrite it. Name what you import.

## Common mistakes

- **Writing `import shapes.py`.** The module name is the filename without the
  extension: `import shapes`.
- **Using a bare name after `import shapes`.** `area(2)` raises `NameError`;
  it is `shapes.area(2)`. Only `from shapes import area` gives you the bare name.
- **Naming your file after a standard module.** A `random.py` in your folder
  shadows the real `random`, because your folder is searched first. Pick a
  name like `dice.py`.

::: lesson m9-math-random

Three modules you will reach for constantly: `math` for the functions the `+ - *
/` operators do not cover, `random` for anything with chance in it, and
`statistics` for averages and spread. None of them need installing.

```python
import math

print(math.sqrt(144))
print(math.floor(7.8), math.ceil(7.2))
print(math.pi)
print(round(math.pi, 3))
print(math.hypot(3, 4))
```

`floor` rounds down, `ceil` rounds up — both return an `int`. Compare with the
built-in `round`, which goes to the nearest. `math.hypot(3, 4)` is the
Pythagorean distance, and `math.pi` is the constant you keep retyping as 3.14.

## Chance, on purpose

`random` picks numbers for you. Each function answers a different question:

| call | gives you |
| --- | --- |
| `random.randint(1, 6)` | a whole number from 1 to 6, **both ends included** |
| `random.choice(items)` | one item from a list |
| `random.sample(items, 3)` | three *different* items, as a new list |
| `random.shuffle(items)` | the list reordered **in place** (returns `None`) |
| `random.random()` | a float from 0.0 up to (not including) 1.0 |

```python
import random

random.seed(7)
print(random.randint(1, 6))
print(random.choice(["red", "green", "blue"]))
print(random.sample(range(1, 50), 6))

cards = ["A", "K", "Q", "J"]
random.shuffle(cards)
print(cards)
```

## Seeds: the same random every time

Run that example twice and you get identical output, because of `random.seed(7)`.
A seed fixes the starting point of the generator, so the whole sequence that
follows is **reproducible**. Without it, every run differs. That is exactly
what you want for a game, and exactly what you do not want when testing or
sharing an analysis — a colleague cannot check a result they cannot reproduce.
Seed once at the top of a script; seeding before every call defeats the point.

```python
import random

random.seed(2026)
first = [random.randint(1, 100) for _ in range(5)]
random.seed(2026)
second = [random.randint(1, 100) for _ in range(5)]
print(first)
print(first == second)
```

## Averages and spread

`statistics` works on any list of numbers:

```python
import statistics

scores = [88, 92, 79, 93, 85]
print(statistics.mean(scores))
print(statistics.median(scores))
print(round(statistics.stdev(scores), 2))
```

`mean` is the average, `median` the middle value once sorted (less swayed by
one outlier), and `stdev` the **standard deviation** — how spread out the
values are. `stdev` needs at least two numbers and raises `StatisticsError`
on fewer; `mean` of an empty list raises too.

> [!warn]
> `random.shuffle(cards)` changes `cards` and returns `None`. `cards =
> random.shuffle(cards)` throws the list away. Shuffle on its own line, or use
> `random.sample(cards, len(cards))` when you want a shuffled copy.

## Common mistakes

- **Expecting `randint` to exclude the top.** `randint(1, 6)` can return 6.
  `randrange(1, 6)` cannot — it follows the `range` rule.
- **Forgetting the module prefix.** `sqrt(2)` is a `NameError` after `import
  math`; write `math.sqrt(2)` or `from math import sqrt`.
- **Calling `random.sample` on a set.** It needs a sequence: `random.sample(
  sorted(my_set), 2)`.

::: lesson m9-datetime

Dates are not strings. `"2026-03-14"` sorts nicely, but ask it "what day of the
week is that?" or "add thirty days" and a string has no answer. The `datetime`
module turns a date into an object that knows the calendar.

```python
from datetime import date

launch = date(2026, 3, 14)
print(launch)
print(launch.year, launch.month, launch.day)
print(launch.weekday())
print(launch.strftime("%A %d %B %Y"))
```

`date(year, month, day)` builds a date. `weekday()` gives Monday = 0 through
Sunday = 6, so 5 means Saturday. `strftime` — "string-format time" — renders
the date however you like using codes: `%A` full weekday name, `%d`
two-digit day, `%B` full month name, `%Y` four-digit year, `%m` two-digit
month, `%H:%M` hours and minutes.

## Parsing text into dates

`strptime` ("string-parse time") goes the other way: give it the text and the
format it is in, and you get an object back. `fromisoformat` is the shortcut
for the `YYYY-MM-DD` shape.

```python
from datetime import date, datetime

d = datetime.strptime("20/10/2026", "%d/%m/%Y").date()
print(d)
print(date.fromisoformat("2026-12-25"))

appointment = datetime.strptime("2026-10-20 14:05", "%Y-%m-%d %H:%M")
print(appointment)
print(appointment.strftime("%I:%M %p on %A"))
```

`datetime` is a date *with* a time of day; `date` is the calendar day alone.
Both parse and format the same way. If the text does not match the format,
`strptime` raises `ValueError` — catch it when the text comes from a user.

## Date arithmetic with timedelta

Subtracting two dates gives a **`timedelta`**, a length of time. Adding a
`timedelta` to a date gives a new date. Python does the calendar work — month
lengths, leap years — so you never count days by hand.

```python
from datetime import date, timedelta

start = date(2026, 1, 1)
christmas = date(2026, 12, 25)
gap = christmas - start
print(gap.days)

due = date(2026, 2, 27) + timedelta(days=2)
print(due)
print(date(2024, 2, 28) + timedelta(days=1))
print(date(2026, 10, 20) + timedelta(weeks=2))
```

`timedelta` takes `days`, `hours`, `minutes`, `seconds` and `weeks` — but not
`months` or `years`, because "one month later" has no single answer. For
"the 1st of next month" build the date with `replace(day=1)` and arithmetic.

## Comparing dates

Date objects compare with the usual operators, and so they sort:

```python
from datetime import date

deadlines = [date(2026, 11, 2), date(2026, 10, 25), date(2026, 12, 1)]
today = date(2026, 10, 28)

overdue = [d for d in deadlines if d < today]
print(overdue)
print(min(deadlines).strftime("%d %b"))
print(sorted(deadlines)[-1])
```

> [!warn]
> `date.today()` and `datetime.now()` are useful, and useless in a test: the
> answer changes every day. In exercises and tests, build fixed dates with
> `date(2026, 10, 20)` so the result is the same tomorrow.

## Common mistakes

- **Comparing a date to a string.** `date(2026, 1, 1) < "2026-02-01"` raises
  `TypeError`. Parse the string first.
- **Mixing `date` and `datetime`.** Subtracting one from the other fails. Call
  `.date()` on the datetime to drop the time part.
- **Using the wrong case in format codes.** `%m` is month, `%M` is minutes;
  `%d` is day of month, `%D` is a whole US-style date. Case matters.

::: lesson m9-collections

The `collections` module holds four containers that each replace a pattern you
have been writing by hand: counting with a dict, grouping with a dict of
lists, a queue made from a list, and a small record made from a tuple.

## Counter: counting things

```python
from collections import Counter

votes = ["pizza", "sushi", "pizza", "tacos", "pizza", "sushi"]
tally = Counter(votes)

print(tally)
print(tally["pizza"])
print(tally["salad"])
print(tally.most_common(2))
```

`Counter` is a dict whose values are counts. Feed it any iterable — a list, a
string, the words of a sentence — and it counts. A key that was never seen
gives `0` instead of a `KeyError`, and `most_common(n)` returns the top *n*
as `(item, count)` pairs, highest first. That is the "what sells best"
question answered in one line.

## defaultdict: grouping

The manual version of grouping is `if key not in groups: groups[key] = []`
before every append. A `defaultdict` runs a factory function for you whenever
a missing key is read.

```python
from collections import defaultdict

people = [("Kuala Lumpur", "Ana"), ("Penang", "Ben"), ("Kuala Lumpur", "Chen")]

by_city = defaultdict(list)
for city, name in people:
    by_city[city].append(name)

print(dict(by_city))
print(by_city["Ipoh"])
```

`defaultdict(list)` creates an empty list on first touch; `defaultdict(int)`
starts at `0`, which makes it a hand-rolled counter. Notice the last line:
*reading* `by_city["Ipoh"]` created the key. Convert to a plain `dict` when
you hand it to code that should not grow it by accident.

## deque: a proper queue

Removing the front of a list with `pop(0)` shifts every other item along —
slow once the list is long. A **deque** ("deck", double-ended queue) adds and
removes at both ends in constant time, and can rotate.

```python
from collections import deque

queue = deque(["Ana", "Ben", "Chen"])
queue.append("Dev")
served = queue.popleft()
print(served, queue)

queue.rotate(-1)
print(queue)

recent = deque(maxlen=3)
for reading in [21, 23, 25, 28, 30]:
    recent.append(reading)
print(recent)
```

`maxlen` is the standout feature: a deque that drops its oldest item
automatically, perfect for "the last three readings".

## namedtuple: a light record

A tuple `("Ana", 34, "Penang")` is compact but you have to remember that `[1]`
is the age. A **namedtuple** names the slots without the weight of a class.

```python
from collections import namedtuple

Employee = namedtuple("Employee", ["name", "age", "city"])
ana = Employee("Ana", 34, "Penang")

print(ana)
print(ana.name, ana[1])
print(ana._asdict())
print(ana._replace(city="Ipoh"))
```

It is still a tuple — immutable, unpackable, sortable — so `_replace` gives
you a new one rather than changing it. For records that need methods or
mutation, the `dataclass` from Module 8 is the next step up.

> [!warn]
> A `defaultdict` creates keys when you merely look at them. Checking
> `if by_city["Ipoh"]:` adds `"Ipoh": []` to the dict. Use `in` for existence
> checks: `if "Ipoh" in by_city:`.

## Common mistakes

- **Calling `most_common()` on a plain dict.** Only `Counter` has it. Wrap the
  dict: `Counter(my_dict).most_common(3)`.
- **Writing `defaultdict(list())`.** You pass the *function* `list`, not a
  list. With the brackets it fails with `TypeError: first argument must be
  callable`.
- **Using `queue.pop(0)` on a deque.** Deques have `popleft()`; `pop()` takes
  no index.

::: lesson m9-decorators

A **decorator** is a function that takes a function and gives back a new one
that does a little extra around it. You have already used `@property` and
`@dataclass`; now you will write your own. They exist because "print the
arguments before every call" or "time this" is something you want to add to a
function without editing its body.

```python
import functools

def log_calls(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        print(f"calling {func.__name__}{args}")
        result = func(*args, **kwargs)
        print(f"{func.__name__} returned {result!r}")
        return result
    return wrapper

@log_calls
def area(width, height):
    """Area of a rectangle."""
    return width * height

print(area(3, 4))
print(area.__name__)
```

Read it inside out. `log_calls` receives `area`, builds `wrapper` — which
prints, calls the original, prints, returns — and hands `wrapper` back. The
`@log_calls` line is just shorthand for `area = log_calls(area)`. From then on
the name `area` points at the wrapper. `*args, **kwargs` lets the wrapper
accept whatever the real function accepts.

`@functools.wraps(func)` copies the original's name and docstring onto the
wrapper. Without it `area.__name__` would be `"wrapper"`, and every decorated
function in your program would look identical in error messages.

## A timing decorator

```python
import functools
import time

def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed * 1000:.1f} ms")
        return result
    return wrapper

@timed
def total_to(n):
    return sum(range(n))

print(total_to(1_000_000))
```

`time.perf_counter()` is the clock to use for measuring: a high-resolution
stopwatch in seconds. The exact milliseconds will differ on your machine.

## Decorators with arguments

`@retry(times=3)` needs one more layer: a function that takes the argument and
returns a decorator.

```python
import functools

def retry(times):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, times + 1):
                try:
                    return func(*args, **kwargs)
                except ValueError as e:
                    print(f"attempt {attempt} failed: {e}")
            raise RuntimeError(f"gave up after {times} attempts")
        return wrapper
    return decorator

calls = 0

@retry(times=3)
def flaky_download():
    global calls
    calls += 1
    if calls < 3:
        raise ValueError("connection dropped")
    return "data"

print(flaky_download())
```

## functools: cache, partial, reduce

The module has three more tools worth knowing. `lru_cache` memoises a
function — it remembers answers, so a recursive `fib` that would take minutes
takes microseconds. `partial` pre-fills arguments. `reduce` folds a list into
one value.

```python
import functools

@functools.lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)

print(fib(90))
print(fib.cache_info())

money = functools.partial(round, ndigits=2)
print(money(3.14159))

product = functools.reduce(lambda acc, x: acc * x, [1, 2, 3, 4, 5])
print(product)
```

> [!warn]
> `lru_cache` keys on the arguments, so they must be hashable: a list argument
> raises `TypeError`. And it only helps a **pure** function — one whose answer
> depends on its arguments alone. Caching a function that reads a file returns
> stale data forever.

## Common mistakes

- **Forgetting to `return wrapper`.** The decorator then returns `None`, and
  the decorated name becomes `None` — `TypeError: 'NoneType' object is not
  callable` on the first call.
- **Forgetting to `return` the result inside the wrapper.** The original runs,
  but every call appears to return `None`.
- **Writing `@retry` instead of `@retry(times=3)`** for a decorator that takes
  arguments. The function gets passed as `times` and nothing works.

::: lesson m9-testing

You have been running exercises against checks all through this course. This
lesson is about writing those checks yourself, plus two habits that make code
easier to trust before a single test runs: type hints and `assert`.

## Type hints

A **type hint** says what a parameter or return value is meant to be. Python
does not enforce it — passing a string still works — but editors and tools read
hints to catch mistakes early, and your future self reads them as documentation.

```python
def average(values: list[float]) -> float:
    return sum(values) / len(values)

def find_index(names: list[str], target: str) -> int | None:
    for i, name in enumerate(names):
        if name == target:
            return i
    return None

print(average([12.5, 9.0, 15.0]))
print(find_index(["Ana", "Ben"], "Ben"))
print(find_index([], "Ana"))
print(average.__annotations__)
```

The grammar: `name: type` for a parameter, `-> type` for the return. Builtin
types work directly — `int`, `str`, `list[int]`, `dict[str, float]`,
`tuple[int, int]`. `int | None` means "an int, or None", the modern spelling
of `Optional[int]` from the `typing` module.

## assert: a check that must hold

`assert condition, "message"` raises `AssertionError` with the message if the
condition is false. Use it for things that should be impossible — invariants —
so a bug blows up where it happens, not three functions later.

```python
def mean(values: list[float]) -> float:
    assert values, "mean() needs at least one value"
    return sum(values) / len(values)

print(mean([3, 4, 5]))

try:
    mean([])
except AssertionError as e:
    print("AssertionError:", e)
```

Do not use `assert` to validate user input: Python can be run with `-O`, which
strips every assert. For input, raise `ValueError` as in Module 7.

## A unit test with unittest

A **unit test** calls one function with known inputs and asserts the output. The
standard library's `unittest` organises them into a class: each method whose
name starts with `test_` is one test.

```python
import sys
import unittest

def slugify(text):
    return text.strip().lower().replace(" ", "-")

class TestSlugify(unittest.TestCase):
    def test_lowercases(self):
        self.assertEqual(slugify("Hello"), "hello")

    def test_replaces_spaces(self):
        self.assertEqual(slugify("python quest"), "python-quest")

    def test_strips_edges(self):
        self.assertEqual(slugify("  padded  "), "padded")

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestSlugify)
unittest.TextTestRunner(stream=sys.stdout, verbosity=2).run(suite)
```

Every test has the same three-part shape, **arrange–act–assert**: set up the
input, call the function, check the result. Here each line does all three at
once; a longer test spreads them out.

Normally the last two lines are `unittest.main()` and you run the file from a
terminal. Inside a notebook or this course, where the file is already running,
`unittest.main(argv=[""], exit=False)` does the same job — the `exit=False`
stops it from shutting Python down afterwards. The explicit runner above does
the same thing and sends the report to stdout so you can see it here.

`assertEqual` is the workhorse. Others you will use: `assertTrue`, `assertIn`,
`assertAlmostEqual` for floats (because `0.1 + 0.2 != 0.3`), and
`assertRaises` as a context manager:

```python
import sys
import unittest

def safe_divide(a, b):
    if b == 0:
        raise ValueError("cannot divide by zero")
    return a / b

class TestSafeDivide(unittest.TestCase):
    def test_divides(self):
        self.assertAlmostEqual(safe_divide(1, 3), 0.3333333)

    def test_rejects_zero(self):
        with self.assertRaises(ValueError):
            safe_divide(1, 0)

suite = unittest.defaultTestLoader.loadTestsFromTestCase(TestSafeDivide)
result = unittest.TextTestRunner(stream=sys.stdout, verbosity=1).run(suite)
print(result.wasSuccessful())
```

> [!warn]
> A test method whose name does not start with `test_` is silently ignored —
> `unittest` reports `Ran 0 tests` and `OK`, which looks like success. Name
> every test `test_<what it checks>`.

## Common mistakes

- **Testing only the happy path.** The empty list, zero, the negative number
  and the missing key are where bugs live. Write one test per edge.
- **Comparing floats with `assertEqual`.** Use `assertAlmostEqual`.
- **Believing a hint is a check.** `def f(n: int)` happily accepts `"3"`. If a
  wrong type must fail, test for it or raise `TypeError` yourself.
