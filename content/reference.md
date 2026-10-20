## Values, variables and types

| type | example | notes |
| --- | --- | --- |
| `int` | `42`, `-3`, `1_000_000` | whole numbers, unlimited size |
| `float` | `3.14`, `2.0`, `1e-3` | decimals; `0.1 + 0.2 != 0.3` — compare with `math.isclose` |
| `str` | `"hi"`, `'hi'`, `"""multi-line"""` | immutable text |
| `bool` | `True`, `False` | a subclass of int: `True + True == 2` |
| `None` | `None` | "no value"; compare with `is None` |
| `list` | `[1, 2, 3]` | ordered, mutable |
| `tuple` | `(1, 2)`, `1, 2` | ordered, immutable |
| `dict` | `{"a": 1}` | key → value, insertion-ordered |
| `set` | `{1, 2}`, `set()` | unique items, unordered |

```python
age = 29
price = 19.99
name = "Mei"
is_member = True
print(type(age), type(price), type(name), type(is_member))
print(int("42") + 1, float("2.5") * 2, str(7) + "!")
```

## Arithmetic and comparison

| operator | meaning |
| --- | --- |
| `+ - * /` | `/` always gives a float |
| `//` | floor division: `7 // 2 == 3`, `-7 // 2 == -4` |
| `%` | remainder: `7 % 2 == 1` |
| `**` | power: `2 ** 10 == 1024` |
| `== != < <= > >=` | comparisons; chain them: `0 <= x < 10` |
| `and or not` | `not` binds tightest, then `and`, then `or` |
| `in`, `not in` | membership: `"a" in "cat"`, `3 in [1, 2, 3]` |
| `is`, `is not` | identity — use only for `None` |

```python
total = 0
for n in range(1, 6):
    total += n ** 2
print(total, 17 // 5, 17 % 5, round(2.675, 2), abs(-4), divmod(17, 5))
```

## Strings

```python
s = "  Hello, World  "
print(s.strip().lower(), s.strip().upper(), s.strip().title())
print(len(s), s.count("l"), s.find("World"), s.replace("World", "Python"))
print("a,b,c".split(","), " | ".join(["x", "y", "z"]))
print("Hello"[0], "Hello"[-1], "Hello"[1:4], "Hello"[::-1])
print("PY" * 3, "py" + "thon", "python".startswith("py"), "42".isdigit())
```

f-strings:

```python
name, score, ratio = "Ana", 93.456, 0.8732
print(f"{name} scored {score:.1f} ({ratio:.0%})")
print(f"{1234567:,}  {42:05d}  {'left':<8}|  {'right':>8}|  {'mid':^8}|")
print(f"{name=}  {2 + 2 = }")
```

## Control flow

```python
def grade(score):
    if score >= 90:
        return "A"
    elif score >= 75:
        return "B"
    elif score >= 50:
        return "C"
    else:
        return "F"

for s in (95, 80, 60, 20):
    print(s, grade(s))

n = 0
while n < 3:
    n += 1
    if n == 2:
        continue
    print("n is", n)

for word in ["apple", "pear", "fig"]:
    if word == "pear":
        print("found pear")
        break
else:
    print("no pear")
```

Truthiness: `0`, `0.0`, `""`, `[]`, `{}`, `set()`, `None` are false. Everything else is true, so `if items:` means "if not empty".

## Lists

| need | code |
| --- | --- |
| add to end | `xs.append(x)`; several: `xs.extend([a, b])` |
| insert / remove | `xs.insert(i, x)`, `xs.remove(x)`, `xs.pop()`, `xs.pop(i)`, `del xs[i]` |
| slice | `xs[1:3]`, `xs[:2]`, `xs[-2:]`, `xs[::2]`, `xs[::-1]` |
| sort in place / sorted copy | `xs.sort()`, `sorted(xs, key=len, reverse=True)` |
| search | `x in xs`, `xs.index(x)`, `xs.count(x)` |
| copy | `xs.copy()` or `xs[:]` (shallow); `copy.deepcopy(xs)` |
| size / extremes | `len(xs)`, `min(xs)`, `max(xs)`, `sum(xs)` |

```python
scores = [72, 95, 88, 60]
scores.append(81)
scores.sort(reverse=True)
top3 = scores[:3]
print(scores, top3, len(scores), sum(scores) / len(scores))
squares = [n * n for n in range(1, 6)]
evens = [n for n in range(10) if n % 2 == 0]
print(squares, evens)
```

> [!warn]
> `b = a` does not copy a list — both names point at the same list. `b = a.copy()` does.

## Tuples, unpacking, sets

```python
point = (3, 4)
x, y = point
first, *rest = [1, 2, 3, 4]
a, b = 1, 2
a, b = b, a            # swap without a temporary variable
print(x, y, first, rest, a, b)

tags = {"python", "data", "python"}
tags.add("sql")
print(sorted(tags), "data" in tags)
print({1, 2, 3} & {2, 3, 4}, {1, 2, 3} | {4}, {1, 2, 3} - {2})
```

## Dictionaries

```python
prices = {"apple": 1.2, "pear": 0.9}
prices["fig"] = 2.5
print(prices.get("kiwi", 0), prices.get("apple"))
for fruit, price in prices.items():
    print(f"{fruit:<6} {price:>5.2f}")

counts = {}
for word in "the cat and the hat".split():
    counts[word] = counts.get(word, 0) + 1
print(counts)
print(sorted(counts.items(), key=lambda kv: kv[1], reverse=True))
by_len = {w: len(w) for w in ["a", "bb", "ccc"]}
print(by_len, list(prices.keys()), list(prices.values()))
```

## Functions

```python
def area(width, height=1.0, *, unit="m"):
    """Return the area with its unit as a string."""
    return f"{width * height:.1f} {unit}²"

def total(*numbers, **options):
    result = sum(numbers)
    return round(result, options.get("digits", 2))

print(area(3, 4), area(2.5), area(2, 2, unit="cm"))
print(total(1, 2, 3.14159, digits=3))

double = lambda n: n * 2
print(list(map(double, [1, 2, 3])), sorted(["bb", "a", "ccc"], key=len))
```

- `return` with nothing (or no `return`) gives `None`.
- Default values are evaluated once — never use a mutable default (`items=[]`); use `None` and build inside.
- A name assigned inside a function is local to it; pass values in and return them out.

## Comprehensions and iteration tools

```python
pairs = list(zip(["a", "b", "c"], [1, 2, 3]))
for i, (letter, n) in enumerate(pairs, start=1):
    print(i, letter, n)

print(dict(zip("xyz", range(3))))
print(any(n > 2 for n in [1, 2, 3]), all(n > 0 for n in [1, 2, 3]))
print(max(["pear", "fig", "banana"], key=len), sum(n * n for n in range(4)))

def countdown(n):
    while n > 0:
        yield n
        n -= 1
print(list(countdown(3)), next(iter([9, 8])))
```

## Errors and exceptions

```python
def safe_int(text):
    try:
        return int(text)
    except ValueError:
        return None

print(safe_int("42"), safe_int("forty-two"))

class InsufficientFunds(Exception):
    pass

def withdraw(balance, amount):
    if amount > balance:
        raise InsufficientFunds(f"need {amount - balance} more")
    return balance - amount

try:
    withdraw(10, 25)
except InsufficientFunds as e:
    print("blocked:", e)
finally:
    print("done")
```

Common exceptions: `NameError` (unknown name), `TypeError` (wrong type), `ValueError` (right type, bad value), `IndexError`, `KeyError`, `ZeroDivisionError`, `AttributeError`, `FileNotFoundError`. Read a traceback from the bottom up.

## Files, CSV, JSON

```python
import csv, json

with open("notes.txt", "w") as f:
    f.write("first\nsecond\n")
with open("notes.txt") as f:
    lines = [line.rstrip("\n") for line in f]
print(lines)

with open("scores.csv", "w", newline="") as f:
    writer = csv.writer(f)
    writer.writerow(["name", "score"])
    writer.writerows([["Ana", 91], ["Ben", 78]])
with open("scores.csv", newline="") as f:
    rows = list(csv.DictReader(f))
print(rows[0]["name"], int(rows[1]["score"]))

data = {"name": "Ana", "tags": ["python", "stats"], "active": True}
text = json.dumps(data, indent=2)
print(json.loads(text)["tags"][0])
```

## Classes

```python
from dataclasses import dataclass, field

class Account:
    interest = 0.02                      # class attribute

    def __init__(self, owner, balance=0):
        self.owner = owner
        self._balance = balance

    @property
    def balance(self):
        return self._balance

    def deposit(self, amount):
        if amount <= 0:
            raise ValueError("amount must be positive")
        self._balance += amount
        return self

    def __repr__(self):
        return f"Account({self.owner!r}, {self._balance})"

class Savings(Account):
    interest = 0.05
    def add_interest(self):
        return self.deposit(self._balance * self.interest)

@dataclass(order=True)
class Point:
    x: float
    y: float = 0.0
    tags: list = field(default_factory=list)

s = Savings("Mei", 100).add_interest()
print(s, s.balance, isinstance(s, Account))
print(Point(1, 2), Point(1, 2) == Point(1, 2), sorted([Point(2), Point(1)]))
```

## Standard library quick list

| module | reach for it when |
| --- | --- |
| `math` | `sqrt`, `floor`, `ceil`, `pi`, `isclose`, `log` |
| `random` | `seed`, `randint`, `choice`, `shuffle`, `sample` |
| `statistics` | `mean`, `median`, `stdev`, `mode` |
| `datetime` | `date`, `datetime`, `timedelta`, `strftime`/`strptime` |
| `collections` | `Counter`, `defaultdict`, `deque`, `namedtuple` |
| `itertools` | `chain`, `product`, `combinations`, `accumulate`, `groupby`, `islice` |
| `functools` | `lru_cache`, `partial`, `reduce`, `wraps` |
| `re` | `search`, `findall`, `sub`, groups `(...)` |
| `pathlib` | `Path("data") / "file.csv"`, `.exists()`, `.read_text()` |
| `json`, `csv` | data formats |
| `unittest` | `TestCase`, `assertEqual`, `unittest.main()` |

```python
from collections import Counter, defaultdict
from datetime import date, timedelta
from functools import lru_cache
import re, statistics

print(Counter("mississippi").most_common(2))
groups = defaultdict(list)
for word in ["apple", "avocado", "banana"]:
    groups[word[0]].append(word)
print(dict(groups))
print(date(2026, 1, 31) + timedelta(days=1), (date(2026, 3, 1) - date(2026, 1, 1)).days)
print(re.findall(r"\d+", "order 42 shipped in 3 days"), re.sub(r"\s+", " ", "a   b    c"))
print(statistics.mean([2, 4, 9]), statistics.median([2, 4, 9]))

@lru_cache(maxsize=None)
def fib(n):
    return n if n < 2 else fib(n - 1) + fib(n - 2)
print(fib(60))
```

## Decorators

```python
import functools, time

def timed(func):
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__} took {(time.perf_counter() - start) * 1000:.2f} ms")
        return result
    return wrapper

@timed
def slow_sum(n):
    return sum(range(n))

print(slow_sum(100_000))
```

## NumPy and pandas essentials

```python-static
import numpy as np
import pandas as pd

a = np.array([3, 1, 4, 1, 5])
a.mean(), a[a > 2], a * 10, np.where(a > 2, "big", "small")

df = pd.DataFrame({"city": ["KL", "Penang", "KL"], "sales": [120, 80, 95]})
df[df["sales"] > 90]                      # filter rows
df.sort_values("sales", ascending=False)  # sort
df["tax"] = df["sales"] * 0.06            # new column
df.loc[df["city"] == "KL", "region"] = "Central"   # assign through loc, not a chain
df.groupby("city")["sales"].agg(["sum", "mean"])
pd.merge(df, other, on="city", how="left")
df.pivot_table(values="sales", index="city", aggfunc="sum")
df.isna().sum(), df.fillna(0), df.dropna()
```

Open the Data Hero module for runnable versions of every line above.

## Idioms worth memorising

- `for item in items:` — not `for i in range(len(items)):`
- `x, y = y, x` — swap
- `if not items:` — empty test
- `value = d.get(key, default)` — safe lookup
- `with open(path) as f:` — files close themselves
- `[f(x) for x in xs if cond(x)]` — transform + filter
- `", ".join(str(x) for x in xs)` — build text from pieces
- `sorted(items, key=lambda it: (it.priority, it.name))` — multi-key sort
- `if __name__ == "__main__":` — script entry point
- `import this` — the Zen of Python
