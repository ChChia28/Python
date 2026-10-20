::: lesson m3-lists

So far every value has lived in its own variable: one name, one thing. Real
programs deal with *many* things — every order today, every score in the class,
every city on a route. A **list** holds any number of values under one name, in
order.

```python
cities = ["Kuala Lumpur", "Penang", "Ipoh", "Melaka"]
print(cities)
print(len(cities))
print(cities[0])
print(cities[1])
print(cities[-1])
```

Square brackets make a list, commas separate the items, and `len()` counts
them. The order you write is the order Python keeps.

## Picking one item

Every item has a position, its **index**, and the numbering starts at **0**,
not 1. Picture a row of boxes with labels painted on the front: box 0, box 1,
box 2… So `cities[0]` is Kuala Lumpur and `cities[1]` is Penang.

`cities[-1]` is the last item and `cities[-2]` the one before it — negative
indexes count from the end, and `-1` is the one you will use constantly.

Asking for a box that does not exist is an error, not an empty result:

```python-error
cities = ["Kuala Lumpur", "Penang", "Ipoh", "Melaka"]
print(cities[4])
```

Four items means the last index is 3. `IndexError: list index out of range`
is the message, and the fix is almost always "subtract one" or "use `-1`".

## Growing a list, and asking what is in it

`append` adds one item to the end. It changes the list in place — you do not
write `cart = cart.append(...)`. And `in` asks whether a value appears
anywhere in the list, giving back `True` or `False` — perfect inside an `if`.

```python
cart = []
cart.append("bread")
cart.append("milk")
cart.append("eggs")
print(cart)
print(len(cart))
print("milk" in cart)
print("butter" in cart)
if "eggs" in cart:
    print("Remember to check the eggs")
```

Starting from an empty list `[]` and appending inside a loop is one of the most
common shapes in all of Python.

## Looping over a list

A `for` loop visits each item in turn, and the loop variable takes the value of
the current item:

```python
prices = [3.50, 4.20, 9.90]
total = 0
for price in prices:
    total = total + price
print("Items:", len(prices))
print("Total:", round(total, 2))
```

## Lists can hold anything — including lists

Items can be any type, mixed if you like: `["Mei", 29, True]` is legal. Mostly,
though, a list holds one kind of thing. When each item needs several pieces of
information, put a small list inside the big one:

```python
students = [["Aisha", 91], ["Ben", 78], ["Chen", 85]]
print(students[0])
print(students[0][0])
for student in students:
    print(student[0], "scored", student[1])
```

`students[0]` is the first inner list; `students[0][0]` is the first item *of
that*. Read chained brackets left to right.

> [!tip] To find *where* something is, `cities.index("Ipoh")` returns its
> position (2). It raises an error if the value is not there — check with `in`
> first.

## Common mistakes

- **Off by one.** The first item is `[0]` and the last is `[len(items) - 1]`.
  If you want the last, write `[-1]` and stop counting.
- **Assigning the result of `append`.** `cart = cart.append("milk")` sets
  `cart` to `None`, because `append` returns nothing. Call it on its own line.
- **Appending several things at once.** `append` takes exactly one item.
  `cart.append("milk", "eggs")` is an error, and `cart.append(["milk", "eggs"])`
  adds one nested list. Call it twice, or meet `extend` two lessons from now.

::: lesson m3-slicing

Indexing takes one item. **Slicing** takes a run of them and gives you a new
list. The notation is `items[start:stop]`: start at index `start`, stop *just
before* index `stop`.

```python
temps = [21, 23, 25, 28, 30, 27, 24]
print(temps[1:4])
print(temps[0:2])
print(temps[:3])
print(temps[4:])
print(temps[:])
```

`temps[1:4]` is indexes 1, 2 and 3 — three items, not four. The stop index is
*excluded*. It feels odd for a day and then becomes natural, because it makes
two useful things true:

- the length of a slice is `stop - start` (4 − 1 = 3)
- `temps[:3]` and `temps[3:]` together are the whole list, with nothing
  missing and nothing repeated

A good mental picture: the numbers label the **gaps between items**, not the
items. Slice `1:4` cuts at gap 1 and at gap 4, and you get whatever lies
between the cuts.

## Leaving out an end

Omit `start` and Python starts at the beginning; omit `stop` and it runs to the
end. `temps[:3]` reads as "the first three". `temps[4:]` reads as "from index
4 onwards". `temps[:]` is the whole list — which sounds useless until you learn
that it makes a copy (below).

## Negative indexes and steps

Negative numbers count from the end, in slices as well as in plain indexing.
`temps[-2:]` is "the last two"; `temps[:-1]` is "everything except the last".

A third number is the **step**: `items[start:stop:step]`.

```python
temps = [21, 23, 25, 28, 30, 27, 24]
print(temps[-2:])
print(temps[:-1])
print(temps[::2])
print(temps[::-1])
```

`[::2]` takes every second item. `[::-1]` walks backwards through the whole
list, which is the standard way to reverse a sequence without changing the
original.

## A slice is a copy

Slicing builds a **new list**. Changing it leaves the original untouched:

```python
scores = [72, 88, 95, 61]
top = scores[:2]
top[0] = 100
print(top)
print(scores)
```

`scores` still starts with 72. This matters because, as the next lesson shows,
`top = scores` (no slice) does *not* copy — the two names would share one list.

## Strings slice the same way

Everything above works on strings, and the result is a new string.

```python
date = "2026-10-20"
print(date[:4])
print(date[5:7])
print(date[8:])
print("Kuala Lumpur"[::-1])
```

> [!warn] Slices never raise `IndexError`. `temps[2:100]` quietly stops at the
> end of the list, and `temps[10:20]` is just `[]`. Convenient — but it also
> means a slice can silently return less than you expected. If you need exactly
> three items, check `len()`.

## Common mistakes

- **Expecting the stop index to be included.** `items[2:5]` gives indexes 2, 3
  and 4. For "up to and including index 5", write `items[2:6]`.
- **Mixing up `items[-1]` and `items[-1:]`.** The first is the last *item*; the
  second is a *list* containing the last item.
- **Writing `items[len(items)]` for the last item.** That index is one past the
  end. Use `items[-1]`.

::: lesson m3-list-methods

A list is **mutable**: you can change it after you make it. Python gives lists
a set of **methods** — functions attached to the value, called with a dot — and
most of them change the list in place rather than returning a new one. That one
fact explains almost everything that surprises people in this lesson.

## Adding, removing, finding

```python
queue = ["Mei", "Raj"]
queue.append("Tom")            # one item, at the end
queue.extend(["Lee", "Sam"])   # every item of another list, at the end
queue.insert(0, "Ana")         # at a given index, pushing the rest along
print(queue)

queue.remove("Raj")            # the first matching value
served = queue.pop(0)          # remove by index, and hand the item back
last = queue.pop()             # no index means the last item
print(served, last)
print(queue)

print(queue.index("Tom"))      # position of the first match
print(queue.count("Lee"))      # how many times it appears
```

`pop` is the only one of the changing methods that gives something back. The
rest return `None`. `index` raises `ValueError` if there is no match, so check
with `in` when you are not sure.

## sort() versus sorted()

There are two ways to put a list in order, and the difference is exactly the
in-place question.

```python
prices = [45, 12, 89, 30]

cheapest_first = sorted(prices)   # a NEW list; prices is untouched
print(cheapest_first)
print(prices)

prices.sort()                     # changes prices itself, returns None
print(prices)

prices.sort(reverse=True)
print(prices)
```

Use `sorted()` when you still need the original order, `.sort()` when you do
not. `reverse=True` works with both. `items.reverse()` flips a list in place
the same way, and `items[::-1]` from the previous lesson gives a flipped copy.

> [!warn] `prices = prices.sort()` is the classic mistake. `sort()` returns
> `None`, so after that line `prices` *is* `None`, and the next `len(prices)`
> blows up. Either call `prices.sort()` on its own line, or write
> `prices = sorted(prices)`.

## The aliasing trap

Assignment does not copy a list. It gives the *same* list a second name.

```python
a = [1, 2, 3]
b = a
b.append(4)
print(a)
print(b)
```

Both lines print `[1, 2, 3, 4]`. There is only one list; `a` and `b` are two
labels stuck on it. Change it through either label and both see the change.
This bites hardest when you hand a list to a function or store it in two
places and expect them to stay independent.

When you actually want a separate copy, say so:

```python
a = [1, 2, 3]
b = a.copy()     # or b = a[:], or b = list(a)
b.append(4)
print(a)
print(b)
```

Now `a` is still `[1, 2, 3]`. This also explains the previous lesson: a slice is
a new list, so `a[:]` is a copy.

## Common mistakes

- **Assigning a method's result.** `names = names.append("Zoe")` and
  `names = names.sort()` both leave you holding `None`. These methods change the
  list; they do not return it.
- **Confusing `append` and `extend`.** `a.append([4, 5])` adds *one* item (a
  list). `a.extend([4, 5])` adds two numbers.
- **Removing while looping.** Calling `items.remove(x)` inside
  `for x in items:` skips elements, because the list shifts under the loop.
  Build a new list of the ones you want to keep instead.

::: lesson m3-tuples

A **tuple** is a list that cannot change. Same indexing, same slicing, same
`len` and `in` and `for` — but no `append`, no `remove`, no assigning to an
index. You write it with round brackets instead of square ones.

```python
point = (3, 7)
print(point[0])
print(point[1])
print(len(point))
```

```python-error
point = (3, 7)
point[0] = 10
```

`TypeError: 'tuple' object does not support item assignment`. If you need a
different tuple, you build a new one.

Why would you want a value you *cannot* change? Two reasons:

- **Meaning.** A list says "a collection of things, possibly growing". A tuple
  says "one thing with a fixed number of parts" — a coordinate, a date, a
  name-and-score pair. Readers of your code get that message for free.
- **Safety.** Nothing can quietly modify a tuple behind your back, so Python
  lets tuples go where lists are forbidden: as dictionary keys and inside sets
  (both coming up).

## Unpacking

The real power of tuples is **unpacking**: assigning each part to its own name
in one line. It works anywhere a tuple shows up, including in a `for` loop over
a list of pairs.

```python
trip = ("Kuala Lumpur", "Penang", 355)
origin, destination, km = trip
print(origin, "to", destination, "is", km, "km")

sales = [("Mon", 120), ("Tue", 95), ("Wed", 143)]
for day, amount in sales:
    print(f"{day}: {amount}")
```

The number of names on the left must match the number of items on the right —
otherwise `ValueError: too many values to unpack`.

Compare the loop with `for item in sales:` followed by `item[0]` and
`item[1]`. The unpacked version names the parts, and the code reads like a
sentence.

## Pairs everywhere

Several built-in functions hand you a tuple precisely so you can unpack it.
`divmod` returns a quotient and a remainder together:

```python
minutes, seconds = divmod(125, 60)
print(minutes, "min", seconds, "s")

a = 1
b = 2
a, b = b, a
print(a, b)
```

That last trick swaps two variables with no temporary — the right side builds
the tuple `(2, 1)`, then the left side unpacks it. When you start writing your
own functions, `return total, count` is how you hand back two values at once,
and `total, count = my_function()` is how the caller receives them.

## The comma makes the tuple

The brackets are optional; the **comma** is not.

```python
pair = 3, 7
print(type(pair))

single = (5,)
print(type(single))
print(type((5)))
```

`(5)` is just the number 5 in brackets. `(5,)` is a one-element tuple. You will
rarely need one, but when you do, forgetting the comma produces a confusing
error two lines later.

> [!tip] Unpacking works with lists too: `first, second = [10, 20]`. Tuples are
> simply the type you most often meet it with.

## Common mistakes

- **Trying to change a tuple.** `point[0] = 10` and `point.append(4)` both
  fail. Make a new tuple, or use a list if the value genuinely needs to change.
- **Wrong number of names.** `a, b = (1, 2, 3)` is a `ValueError`. Count the
  items on both sides.
- **Dropping the trailing comma.** `(5)` is an `int`, not a tuple.

::: lesson m3-dicts

A list finds things by *position*. A **dictionary** finds things by *name*:
you store a value under a **key**, and later look it up by that key. A phone
book, a price list, a settings file, the record for one customer — anything
shaped like "this maps to that" is a dict.

```python
prices = {"bread": 3.50, "milk": 4.20, "eggs": 9.90}
print(prices["milk"])
print(len(prices))
```

Curly brackets, and `key: value` pairs separated by commas. Looking up uses
square brackets like a list, but with the key instead of an index. Keys are
usually strings or numbers; values can be anything at all.

## Adding, changing, deleting

Assign to a key that does not exist and it is added. Assign to one that does
and it is replaced. Same syntax for both. `del` removes a key and its value;
`.pop(key)` does the same and gives the value back, like a list's `pop`.

```python
stock = {"apples": 12, "pears": 4}
stock["bananas"] = 20      # new key
stock["pears"] = 10        # existing key: overwritten
stock["apples"] += 3       # read, add, store back
print(stock)

del stock["apples"]
removed = stock.pop("pears")
print(removed)
print(stock)
print(len(stock))
```

## Missing keys

Looking up a key that is not there is an error, not an empty result:

```python-error
prices = {"bread": 3.50, "milk": 4.20}
print(prices["butter"])
```

`KeyError: 'butter'`. The safe way to ask is `in`, which checks the *keys*:

```python
prices = {"bread": 3.50, "milk": 4.20}
for item in ["bread", "butter"]:
    if item in prices:
        print(item, "costs", prices[item])
    else:
        print(item, "is not stocked")
```

The next lesson shows `.get()`, which folds that `if` into a single call.

## Looping and listing

Loop over a dict and you get the keys, in the order they were added:

```python
prices = {"bread": 3.50, "milk": 4.20, "eggs": 9.90}
for item in prices:
    print(item, prices[item])

print(list(prices.keys()))
print(list(prices.values()))
print(sum(prices.values()))
```

`.keys()` and `.values()` give you views you can loop over or turn into lists.
`sum(prices.values())` is the one-line total.

> [!warn] Keys must be exact. `prices["Milk"]` and `prices["milk"]` are
> different keys, and so are `1` and `"1"`. A `KeyError` on a key you are
> *sure* exists is nearly always a capitalisation or type mismatch.

Each key appears once. Writing `{"a": 1, "a": 2}` keeps only the last value.
If you need several values under one key, make the value a list.

## Common mistakes

- **Using `[]` on a key that might be missing.** Check with `in` first, or use
  `.get()` (next lesson).
- **Mixing up keys and values in `in`.** `4.20 in prices` is `False` — `in`
  looks at keys. For values, write `4.20 in prices.values()`.
- **Using a list as a key.** `TypeError: unhashable type: 'list'`. Keys must be
  unchangeable; use a tuple.

::: lesson m3-dict-patterns

You know the mechanics. These are the handful of shapes you will write with
dictionaries over and over — learn them as idioms and a lot of beginner code
collapses into a few lines.

## get, and counting with it

`d.get(key, default)` returns the value if the key exists, and `default` (or
`None` if you gave none) if not. No `KeyError`, no `if`.

That makes it the engine behind the most common dict job there is: "how many
times does each thing appear?" With a default of 0 you can add one whether or
not the key is there yet.

```python
prices = {"bread": 3.50, "milk": 4.20}
print(prices.get("milk", 0))
print(prices.get("butter", 0))
print(prices.get("butter"))

votes = ["pizza", "sushi", "pizza", "tacos", "sushi", "pizza"]
counts = {}
for vote in votes:
    counts[vote] = counts.get(vote, 0) + 1
print(counts)
```

Without `get` you would need an `if vote in counts:` with two branches. Same
result, twice the lines.

## Grouping with setdefault, looping with items()

When the value is a list you want to append to, `setdefault(key, [])` returns
the existing list, or stores an empty one and returns that. And when you need
both halves of every entry, `.items()` gives you `(key, value)` tuples, which
you unpack straight into the loop.

```python
people = [("Mei", "KL"), ("Raj", "Penang"), ("Tom", "KL"), ("Ana", "Ipoh")]
by_city = {}
for name, city in people:
    by_city.setdefault(city, []).append(name)
print(by_city)

for city, names in by_city.items():
    print(f"{city}: {len(names)} people")
```

Every name lands in the list for its city, and each list is created the first
time its city appears. The `items()` loop replaces `for city in by_city:`
followed by `by_city[city]` — use it whenever you need the key *and* the value.

## Records: dicts inside dicts

A dict whose values are dicts models a table of records: one key per row, one
inner key per column.

```python
players = {
    "Mei": {"goals": 7, "team": "Tigers"},
    "Raj": {"goals": 4, "team": "Hawks"},
}
print(players["Mei"]["goals"])
players["Raj"]["goals"] += 1
for name, info in players.items():
    print(name, "plays for the", info["team"], "with", info["goals"], "goals")
```

Chain the brackets: outer key, then inner key.

## Inverting and sorting

Flip keys and values by looping over `items()` and assigning the other way
round. Sort a dict's keys by their values with `sorted(..., key=d.get)`:

```python
scores = {"Mei": 82, "Raj": 95, "Tom": 67}

by_score = {}
for name, score in scores.items():
    by_score[score] = name
print(by_score)

for name in sorted(scores, key=scores.get, reverse=True):
    print(name, scores[name])
```

`key=scores.get` tells `sorted` to rank each name by what `scores.get(name)`
returns — its score. `reverse=True` puts the highest first. Inverting only
works cleanly when the values are unique; if two people share a score, one of
them is lost.

> [!tip] Counting comes up so often that the standard library has a ready-made
> version: `from collections import Counter`, then `Counter(votes)`. It behaves
> like the dict you built by hand, plus `.most_common(3)`.

## Common mistakes

- **`counts[key] += 1` on a new key.** That reads the key first, so it is a
  `KeyError`. Use `get(key, 0)`.
- **Changing a dict while looping over it.** Adding or deleting keys inside
  `for key in d:` raises `RuntimeError`. Loop over `list(d)` instead.
- **Sorting `items()` and expecting a dict.** `sorted(d.items())` is a list of
  tuples. Wrap it in `dict(...)` if you need a dict back.

::: lesson m3-sets

A **set** is a collection with two rules: every item appears at most once, and
there is no order. Give up positions and duplicates and you get two things in
return — a very fast "is it in there?" and a clean way to ask questions like
"which items are in both?".

```python
tags = {"python", "data", "python", "sql", "data"}
print(len(tags))
print(sorted(tags))
```

Curly brackets, like a dict but without the colons. The duplicates vanish at
creation: three unique tags. Printing a set directly shows them in whatever
order Python chooses, so `sorted()` is used here for a stable view.

## Adding, removing, checking

```python
seen = set()
seen.add("Mei")
seen.add("Raj")
seen.add("Mei")
print(len(seen))
print("Raj" in seen)

seen.remove("Raj")
seen.discard("Zoe")
print(seen)
```

`add` ignores an item that is already there. `remove` raises `KeyError` if the
item is missing; `discard` stays quiet. Note that the empty set is `set()` —
`{}` is an empty *dict*.

Membership (`in`) on a set is fast no matter how big the set is, because Python
hashes the value and jumps straight to it. On a list, `in` walks every item.
For a few dozen entries it makes no difference; for a million, it is the
difference between instant and minutes.

## Removing duplicates

`set(a_list)` is the one-line way to find the distinct values:

```python
visits = ["Mei", "Raj", "Mei", "Tom", "Raj", "Mei"]
unique = set(visits)
print(len(unique))
print(sorted(unique))
```

Because sets have no order, `sorted()` is how you get a predictable list back
out.

## Set arithmetic

This is where sets shine. Given two sets, you can ask for everything in both,
everything in either, or everything in one but not the other:

```python
python = {"Mei", "Raj", "Tom", "Ana"}
sql = {"Raj", "Ana", "Lee"}

print(sorted(python & sql))   # intersection: in both
print(sorted(python | sql))   # union: in either
print(sorted(python - sql))   # difference: Python but not SQL
print(sorted(sql - python))
```

The named versions read well too: `python.intersection(sql)`,
`python.union(sql)`, `python.difference(sql)`. The named methods also accept
any collection — `python.intersection(["Raj", "Zoe"])` works where
`python & ["Raj", "Zoe"]` is a `TypeError`.

## No order means no index

```python-error
colours = {"red", "green", "blue"}
print(colours[0])
```

`TypeError: 'set' object is not subscriptable`. A set has no first item. If you
need "the first" or "the one at position 3", you want a list; convert with
`sorted(colours)` or `list(colours)`.

> [!warn] Set items must be **hashable** — strings, numbers, tuples. A list
> cannot go in a set (`TypeError: unhashable type: 'list'`), for the same reason
> it cannot be a dict key. If you need a set of pairs, use tuples.

## Common mistakes

- **Writing `{}` for an empty set.** That is an empty dict. Write `set()`.
- **Expecting order.** Printing a set may show items in any order, and that
  order can change between runs. Sort before you display, or compare with `==`
  rather than by position.
- **Using `+` to combine sets.** Sets do not support `+`. Union is `|` or
  `.union()`.
