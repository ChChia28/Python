::: lesson m6-listcomp

Half the loops you have written so far follow the same three-step pattern:
make an empty list, loop over something, append to the list. Python has a
one-line form for exactly that pattern, called a **list comprehension**. Here
is the loop and the comprehension side by side — they print the same thing.

```python
prices = [12.5, 3.0, 7.7, 20.0]

with_tax = []
for p in prices:
    with_tax.append(round(p * 1.06, 2))
print(with_tax)

with_tax = [round(p * 1.06, 2) for p in prices]
print(with_tax)
```

Read a comprehension from the `for` outwards: *for each `p` in `prices`, give
me `round(p * 1.06, 2)`*. The expression at the front is what goes into the
new list; the `for` clause says where the items come from. The square brackets
tell Python you want a list back.

## Keeping only some items

An `if` **after** the `for` is a filter. Items that fail the test are skipped
entirely, so the result can be shorter than the input.

```python
scores = [82, 45, 91, 67, 38, 75]
passed = [s for s in scores if s >= 50]
print(passed)
print(len(scores), "scores,", len(passed), "passed")
```

## Choosing a value for every item

Sometimes you want every item kept but transformed differently depending on a
condition. That is a different `if` — the one-line conditional expression
`x if condition else y` from Module 2 — and it lives **before** the `for`,
inside the expression:

```python
scores = [82, 45, 91, 67]
labels = ["pass" if s >= 50 else "fail" for s in scores]
print(labels)
```

Same length as `scores`, one label per score. The position tells you which
kind of `if` you are looking at: before the `for` it picks a value, after the
`for` it drops items.

> [!warn]
> `[s for s in scores if s >= 50 else 0]` is a syntax error. A filtering `if`
> cannot take an `else`. If you want an `else`, move the whole
> `x if cond else y` to the front.

## Two loops in one comprehension

A comprehension can have more than one `for` clause. They run like nested
loops, in the order written — the first `for` is the outer loop.

```python
colours = ["red", "blue"]
sizes = ["S", "M", "L"]
variants = [f"{c}-{s}" for c in colours for s in sizes]
print(variants)
```

All the red variants come first, then the blue ones, exactly as if you had
written `for c in colours:` with `for s in sizes:` indented inside it.

## When a plain loop is clearer

Comprehensions are for *building a list from another iterable*. Reach for the
loop instead when:

- you need to `break` or stop early — comprehensions always run to the end
- the body does something other than compute a value (printing, writing a
  file, updating a counter)
- the expression no longer fits on one line, or you have three `for` clauses
  and an `if`

A comprehension that nobody can read in one glance has stopped earning its
place. `[print(x) for x in xs]` is the classic abuse: it builds a list of
`None` values just to get the side effect. Write the loop.

## Common mistakes

- **Filtering with the wrong `if`.** `[x if x > 0 for x in xs]` fails. A
  filter goes after the `for`: `[x for x in xs if x > 0]`.
- **Forgetting the brackets.** `(x * 2 for x in xs)` is a generator
  expression (see the Generators lesson), not a list. Wrap it in `[...]` when
  you want a list.
- **Reusing the loop variable name.** `[name for name in names]` is fine, but
  `[names for names in names]` works and will confuse everyone. Keep the
  loop variable singular and distinct.

::: lesson m6-dict-set-comp

The comprehension idea is not limited to lists. Swap the square brackets for
curly braces and you build a **dict** or a **set** in one expression. The only
difference between the two is the colon: `{key: value for …}` makes a dict,
`{value for …}` makes a set.

## A lookup table from pairs

The most common dict comprehension turns a list of records into something you
can look things up in. Compare the loop and the comprehension:

```python
products = [("Keyboard", 45.0), ("Mouse", 19.5), ("Monitor", 189.0)]

price_of = {}
for name, price in products:
    price_of[name] = price

price_of = {name: price for name, price in products}
print(price_of["Mouse"])
print(price_of)
```

Each pair is unpacked into `name` and `price` in the `for` clause, and the
expression `name: price` says what key and what value to store. A filter at
the end works exactly as in a list comprehension.

## Transforming an existing dict

To build a new dict from an old one, loop over `.items()` so you get both
halves of each pair:

```python
prices_usd = {"Keyboard": 45.0, "Mouse": 19.5, "Monitor": 189.0}
prices_myr = {name: round(p * 4.7, 2) for name, p in prices_usd.items()}
print(prices_myr)

cheap = {name: p for name, p in prices_usd.items() if p < 50}
print(cheap)
```

The original dict is untouched. That matters: a comprehension always builds a
*new* object, which is safer than editing a dict while something else might be
reading it.

## Inverting a dict

Swap the key and the value in the expression and you have flipped the dict
around — handy when you need to look up in both directions:

```python
codes = {"MY": "Malaysia", "SG": "Singapore", "TH": "Thailand"}
code_of = {country: code for code, country in codes.items()}
print(code_of["Singapore"])
```

> [!warn]
> Inverting only works when the **values are unique**. If two keys share a
> value, they become the same key in the new dict and the later one silently
> wins. Check with `len(set(d.values())) == len(d)` if you are not sure.

## Sets: dedupe while you transform

A set comprehension is the natural tool when you want "the distinct
somethings". Because the set drops duplicates for you, you can clean the data
and collapse it in one step:

```python
cities = ["Ipoh", "ipoh", "Penang", "IPOH", "Penang", "Melaka"]
distinct = {c.lower() for c in cities}
print(len(distinct))
print(sorted(distinct))
```

Three distinct cities, even though the spelling varied. Notice the
`sorted()` around the set when printing: a set has no order you can rely on,
so sort it whenever the order of the output matters.

## Common mistakes

- **`{}` is an empty dict, not an empty set.** Write `set()` for an empty set.
  A comprehension with braces and no colon does give you a set, though.
- **Looping over a dict and expecting pairs.** `for k, v in prices:` fails —
  iterating a dict gives keys only. Use `prices.items()`.
- **Trusting set order.** Sets print in whatever order Python stores them.
  Sort before printing or comparing with a list.

::: lesson m6-enumerate-zip

The loop you see in other languages — `for i in range(len(items))` followed by
`items[i]` everywhere — is a smell in Python. Nearly every time you want an
index, you want it *alongside* the item, and Python has a built-in for that.

## enumerate: the item and its position

`enumerate(items)` hands out `(index, item)` pairs. Unpack them straight in
the `for` line:

```python
tasks = ["Buy milk", "Call Ana", "Submit draft"]
for i, task in enumerate(tasks):
    print(i, task)

print("---")
for n, task in enumerate(tasks, start=1):
    print(f"{n}. {task}")
```

The first loop counts from 0, because that is what you need for `tasks[i]`.
When the number is for a human to read, start at 1 with the `start` argument,
as the second loop does. Either way there is no counter variable to
initialise and no `+= 1` to forget.

## zip: two sequences side by side

`zip(a, b)` pairs the first item of `a` with the first item of `b`, the second
with the second, and so on. It is how you walk two parallel lists in one loop:

```python
names = ["Ana", "Ben", "Cleo"]
scores = [82, 95, 71]
for name, score in zip(names, scores):
    print(f"{name}: {score}")
```

You can zip three or more sequences; you just unpack more names. Combine it
with `enumerate` when you want a counter too:
`for i, (name, score) in enumerate(zip(names, scores), start=1)`.

> [!warn]
> `zip` **stops at the shortest** input and says nothing about the leftovers.
> `zip([1, 2, 3], ["a", "b"])` yields two pairs and quietly drops the 3. When
> the lengths are supposed to match, pass `strict=True` and Python raises a
> `ValueError` if they do not — a bug you want to hear about.

## From pairs to dicts and back

Two parallel lists plus `zip` is one step from a dict, because `dict()`
accepts any iterable of pairs:

```python
headers = ["name", "city", "age"]
row = ["Ana", "Ipoh", 29]
record = dict(zip(headers, row))
print(record)
```

That is the idiom for turning a CSV header row and a data row into a record.

Going the other way — a list of pairs back into separate lists — uses `zip`
with a star, which spreads the pairs out as separate arguments:

```python
pairs = [("Ana", 82), ("Ben", 95), ("Cleo", 71)]
names, scores = zip(*pairs)
print(names)
print(scores)
```

`zip(*pairs)` is the same as `zip(("Ana", 82), ("Ben", 95), ("Cleo", 71))`,
and zipping three pairs gives you two triples: all the names, then all the
scores. They come back as tuples; wrap in `list()` if you need to change them.

## Common mistakes

- **Writing `enumerate(tasks, 1)` and then using the number as an index.**
  With `start=1` the number is off by one for `tasks[n]`. Use the item you
  already have instead of indexing again.
- **Expecting `zip` to pad.** It truncates. For padding, look at
  `itertools.zip_longest`.
- **Forgetting that `enumerate` and `zip` are lazy.** `print(zip(a, b))`
  shows `<zip object …>`. Loop over it or wrap it in `list()` to see the
  pairs — and like a generator, a zip object is used up after one pass.

::: lesson m6-sorting

Python can sort anything that can be compared, and it can sort by any rule you
give it. The two tools are `sorted()`, which returns a new list, and the
`.sort()` method, which rearranges a list in place.

```python
names = ["Cleo", "Ana", "Ben"]
ordered = sorted(names)
print(ordered)
print(names)

names.sort()
print(names)
```

After `sorted(names)` the original list is untouched; after `names.sort()` it
is changed. `sorted()` also accepts *any* iterable — a tuple, a set, a dict,
a generator — and always gives you a list back.

> [!warn]
> `.sort()` returns `None`. `names = names.sort()` throws your list away and
> leaves you holding `None`. If you want the sorted list as a value, use
> `sorted()`.

## Sorting by a rule: `key`

Both functions take a `key` argument: a function that is called once per
item, and whose *result* is what gets compared. The items themselves are
untouched; only their order changes.

```python
words = ["kiwi", "fig", "banana", "pear"]
print(sorted(words, key=len))
print(sorted(words, key=str.lower))
```

`key=len` sorts by length. Look at the result: `kiwi` and `pear` both have
four letters and `kiwi` stays first, because it came first in the input.
Python's sort is **stable** — equal keys keep their original order — which
means you can sort by one thing, then by another, and the first sort survives
as the tie-breaker.

## Several keys at once

Usually you want the tie-breaker in one go. Return a **tuple** from the key
function: tuples compare element by element, so the first element is the
main rule and the rest only matter when it ties. Negate a number to flip the
direction of just that part.

```python
from operator import itemgetter

people = [("Ana", "Ipoh", 29), ("Ben", "Penang", 35), ("Cleo", "Ipoh", 41)]

print(sorted(people, key=lambda p: (p[1], -p[2])))
print(sorted(people, key=lambda p: p[2], reverse=True))
print(sorted(people, key=itemgetter(1, 0)))
```

The first sort is by city A→Z, oldest first within a city. The second is by
age, youngest last, using `reverse=True` to flip the whole order.

The third uses `itemgetter` from the `operator` module: for keys that are
"take field 1, then field 0" it reads better than a lambda, and
`itemgetter(1, 0)` builds the tuple `(p[1], p[0])` for you. Its sibling
`attrgetter("price")` does the same for objects with attributes.

## Sorting a dict by its values

Dicts cannot be sorted in place, but their `.items()` can be sorted into a
list of pairs:

```python
scores = {"Cleo": 82, "Ben": 95, "Ana": 71}
for name, score in sorted(scores.items(), key=lambda item: item[1], reverse=True):
    print(name, score)
```

`item[1]` is the score, so this is the leaderboard. To sort the *names* by
score without the pairs, `sorted(scores, key=scores.get)` works too — the
dict's own `.get` is a perfectly good key function.

## Common mistakes

- **Comparing things that cannot be compared.** `sorted([{"a": 1}, {"a": 0}])`
  raises `TypeError` — dicts have no natural order. Give a `key`.
- **Mixing types.** `sorted([3, "10"])` fails. Convert first.
- **Sorting a dict and expecting a dict back.** `sorted(d)` gives a list of
  keys. If you want a dict in sorted order, rebuild it:
  `dict(sorted(d.items()))`.

::: lesson m6-generators

A list holds every item at once. A **generator** holds none of them — it
knows how to produce the *next* one when asked, and otherwise sits paused.
That one idea lets you work with sequences too large for memory, or sequences
that never end.

## A function that pauses

Put `yield` in a function and it becomes a generator function. Calling it
runs nothing; it returns a generator object. Each time something asks for a
value, the body runs until it reaches a `yield`, hands that value out, and
freezes right there — local variables and all — until the next request.

```python
def countdown(n):
    print("starting")
    while n > 0:
        yield n
        n -= 1
    print("finished")

for x in countdown(3):
    print(x)
```

Watch the output order: `starting` is printed only when the loop asks for the
first value, and `finished` appears after `1`, when the loop asks for a
fourth value that is not there. The `for` loop does the asking for you.

## Asking by hand: next()

You can drive a generator yourself with `next()`. When it runs out, `next()`
raises `StopIteration` — unless you give it a default to return instead:

```python
def countdown(n):
    while n > 0:
        yield n
        n -= 1

gen = countdown(2)
print(next(gen))
print(next(gen))
print(next(gen, "done"))
```

This is also how you confirm that nothing runs until asked: `gen =
countdown(2)` prints nothing, because the body has not started.

## Generator expressions

A comprehension with parentheses instead of brackets is a **generator
expression**. It produces the values lazily, one at a time, so you can feed a
huge range to `sum()` without ever building the list:

```python
total = sum(x * x for x in range(1, 100_001))
print(total)

import sys
as_list = [x * x for x in range(100_000)]
as_gen = (x * x for x in range(100_000))
print(sys.getsizeof(as_list) > 100_000)
print(sys.getsizeof(as_gen) < 500)
```

The list version holds a hundred thousand numbers in memory; the generator is
a couple of hundred bytes no matter how long the range is. When a function
call is the only thing around the expression, you can drop the extra
parentheses — `sum(x * x for x in …)` is the idiom.

## Infinite generators

Because nothing runs until asked, a generator can loop forever and still be
useful — the **caller** decides when to stop:

```python
def invoice_numbers(start=1000):
    n = start
    while True:
        yield f"INV-{n}"
        n += 1

numbers = invoice_numbers()
for _ in range(3):
    print(next(numbers))
```

A `for` loop over an infinite generator needs a `break`, or you can slice it
with `itertools.islice` — next lesson.

> [!warn]
> A generator is **one-shot**. Once you have looped over it, it is empty:
> `list(gen)` a second time gives `[]`, and `len(gen)` never works at all. If
> you need the values twice, store them in a list, or call the generator
> function again for a fresh one.

## Common mistakes

- **Using `return value` where you meant `yield`.** A `return` in a
  generator just ends it; the value is lost. Use `yield` for each item.
- **Printing the generator.** `print(countdown(3))` shows
  `<generator object …>`. Loop over it, or wrap it in `list()` to see the
  values.
- **Indexing it.** `gen[0]` fails — generators have no positions. Use `next()`
  or `itertools.islice`.

::: lesson m6-itertools

A lot of loops exist only to answer a yes/no question, pick the biggest thing
or combine sequences. Python ships the answers as functions. Learning them is
less about typing less and more about saying what you mean: `any(...)` reads
as a question, a six-line loop with a flag does not.

## Questions about a sequence

`any()` is true if at least one item is true; `all()` is true if every item
is. Feed them a generator expression and they stop as soon as the answer is
known. `min()` and `max()` take the same `key` argument as `sorted()`, and
return the *item* with the smallest or largest key — not the key itself.

```python
scores = [82, 95, 71]
print(any(s > 90 for s in scores))
print(all(s >= 75 for s in scores))

products = [{"name": "Keyboard", "price": 45.0}, {"name": "Mouse", "price": 19.5}]
print(min(products, key=lambda p: p["price"])["name"])

by_name = {"Cleo": 82, "Ben": 95, "Ana": 71}
print(max(by_name, key=by_name.get))
print(sum(by_name.values()))
```

The last two lines show a trap and its fix: `max(by_name)` on its own compares
the *keys* (alphabetically), so `key=by_name.get` is what makes it find the
best score.

## itertools: counting, slicing, joining

The `itertools` module is a toolbox of lazy iterators. `count(start, step)`
counts forever; `islice` takes a slice of any iterator — including an
infinite one — without building a list; `chain` runs through several
iterables as if they were one.

```python
from itertools import count, islice, chain

for n in islice(count(10, 5), 4):
    print(n)

print(list(islice(range(100), 3, 8, 2)))
print(list(chain(["Ana", "Ben"], ("Cleo",), {"Dev"})))
```

`islice(it, 4)` means "the first 4"; `islice(it, 3, 8, 2)` means start, stop,
step, exactly like a list slice.

## Combining things

`product` gives every pairing of two iterables (the nested-loop result from
the comprehension lesson). `combinations(items, r)` gives every way to choose
`r` items with no repeats and no regard to order. `accumulate` gives running
totals:

```python
from itertools import product, combinations, accumulate

print(list(product("AB", [1, 2])))
print(list(combinations(["Ana", "Ben", "Cleo"], 2)))

spend = [12.0, 8.5, 20.0, 4.5]
print(list(accumulate(spend)))
```

Every one of these is lazy, which is why the examples wrap them in `list()`
to see the values.

## groupby: adjacent runs

`groupby(items, key=…)` yields `(key, group)` pairs, where each group is an
iterator over a run of items with the same key. The word to notice is
**run**: it only groups items that are *next to each other*.

```python
from itertools import groupby

people = [("Ana", "Ipoh"), ("Ben", "Penang"), ("Cleo", "Ipoh")]
people.sort(key=lambda p: p[1])

for city, group in groupby(people, key=lambda p: p[1]):
    print(city, [name for name, _ in group])
```

> [!warn]
> **Sort first.** Without the `.sort()` above, `groupby` would produce three
> groups — Ipoh, Penang, Ipoh — because the two Ipoh rows are not adjacent.
> Sort by the same key you group by, every time.

Each `group` is itself a one-shot iterator, consumed as soon as you move to
the next key, so turn it into a list inside the loop if you need it later.

## Common mistakes

- **`max(d)` on a dict.** You get the largest key, not the key with the
  largest value. Use `max(d, key=d.get)`.
- **`any(xs)` versus `any(cond for x in xs)`.** `any([0, 2])` tests the
  items themselves. To test a condition about each item, you need the
  generator expression.
- **Printing an itertools result directly.** `print(chain(a, b))` shows an
  object. Wrap in `list()` or loop over it.

::: lesson m6-unpacking

You have been **unpacking** since Module 3 without calling it that: every
`for name, score in pairs` pulls a two-item tuple apart into two names. The
rule is simple — put as many names on the left of `=` as there are items on
the right — and the star makes it flexible.

```python
point = (3, 4)
x, y = point
print(x, y)

x, y = y, x
print(x, y)
```

The second assignment is the Python swap. The right side builds the tuple
`(4, 3)` *before* anything is assigned, so no temporary variable is needed.

## The star target

A starred name on the left collects "everything the other names did not
take" — always as a list, however many items that is, even zero.

```python
readings = [18.5, 19.0, 21.2, 20.4, 17.9]

first, *rest = readings
print(first, rest)

first, *middle, last = readings
print(first, middle, last)

first, *_, last = readings
print(first, last)
```

`_` is the conventional name for "I don't care about this". Only one star is
allowed per assignment — Python could not tell where one would end and the
next begin.

> [!warn]
> Without the star, the counts must match exactly. `a, b = [1, 2, 3]` raises
> `ValueError: too many values to unpack`. If you only want the first two of
> an unknown-length list, write `a, b, *_ = items`.

## Unpacking inside a loop

Any `for` loop over a sequence of tuples can unpack them in the loop header,
and nested parentheses unpack nested structure — the `enumerate(zip(…))`
shape from the enumerate and zip lesson:

```python
orders = [("Ana", 2, 4.5), ("Ben", 1, 12.0), ("Cleo", 3, 2.0)]

for name, qty, price in orders:
    print(f"{name} pays {qty * price:.2f}")

for i, (name, qty, price) in enumerate(orders, start=1):
    print(i, name)
```

Naming the parts in the header beats `order[0]`, `order[1]`, `order[2]` in
the body every time: the names document what each position means.

## The star on the right-hand side

A star in a *call* or a *literal* goes the other way: it spreads a sequence
out into separate items. `**` does the same for a dict, spreading its pairs as
keyword arguments or into another dict literal.

```python
a = [1, 2]
b = [3, 4]
print([*a, *b])
print(*a, sep=" | ")

defaults = {"theme": "light", "font_size": 14}
custom = {"theme": "dark"}
settings = {**defaults, **custom}
print(settings)
print(defaults)
```

`[*a, *b]` is a new list made of both. `print(*a)` passes `1` and `2` as two
separate arguments, exactly as if you had typed them. And `{**defaults,
**custom}` builds a brand-new dict: later pairs win, so `custom` overrides
`defaults`, and `defaults` itself is unchanged — which is why this is the
standard way to apply user settings on top of defaults.

## Common mistakes

- **Two stars on the left.** `*a, *b = items` is a `SyntaxError`. One starred
  target per assignment.
- **Expecting a tuple from a star target.** `first, *rest = (1, 2, 3)` makes
  `rest` the *list* `[2, 3]`, even though the right side was a tuple.
- **Mutating instead of merging.** `defaults.update(custom)` changes
  `defaults` for everyone who shares it. `{**defaults, **custom}` leaves both
  inputs alone.
