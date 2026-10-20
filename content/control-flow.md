::: lesson m2-booleans

Everything in Module 1 ran top to bottom, every line, every time. Real programs
ask questions — *is the order big enough for free delivery? is this the right
password?* — and do different things depending on the answer. Every one of
those questions boils down to a value that is either `True` or `False`. That
type is called **bool**, and it is the smallest type in Python: exactly two
values, spelt with a capital letter.

```python
print(True)
print(type(False))
```

You rarely type `True` or `False` yourself. You get them by **comparing**
things.

## The six comparison operators

| operator | asks | example | result |
| --- | --- | --- | --- |
| `==` | equal? | `3 == 3` | `True` |
| `!=` | not equal? | `3 != 3` | `False` |
| `<` | less than? | `2 < 5` | `True` |
| `<=` | less than or equal? | `5 <= 5` | `True` |
| `>` | greater than? | `2 > 5` | `False` |
| `>=` | greater than or equal? | `5 >= 6` | `False` |

A comparison is an ordinary expression, so you can print it, store it in a
variable or hand it to anything that wants a value:

```python
order_total = 62.50
free_delivery = order_total >= 50
print(free_delivery)
print(order_total == 100)
print(order_total != 0)
```

Read `free_delivery = order_total >= 50` from right to left: first Python
compares, then it stores the `True` that came out.

## Comparing strings

Strings compare too. `==` and `!=` ask whether the text is identical,
character for character — and capitals matter:

```python
print("Lisbon" == "Lisbon")
print("Lisbon" == "lisbon")
print("apple" < "banana")
print("Zoe" < "adam")
```

`<` on strings is alphabetical order, with one catch that the last line shows:
every capital letter sorts before every lower-case one, so `"Zoe"` comes
*before* `"adam"`. When you really want alphabetical order, compare
`name.lower()` on both sides.

## Chained comparisons

Checking that a value sits inside a range is so common that Python lets you
write both bounds in one go, the way you would on paper:

```python
age = 34
print(18 <= age < 65)
print(0 < -3 < 10)
```

`18 <= age < 65` means "18 is at most `age`, and `age` is below 65". It is
clearer than two separate checks, and it is a Python idiom you will see
everywhere.

> [!tip]
> `==` compares *values*, not types. `5 == 5.0` is `True`, because the integer
> five and the float five are the same number. `"5" == 5` is `False`, because a
> string is never equal to a number — convert first with `int()` if you mean it.

## Common mistakes

- **`=` when you mean `==`.** One equals sign *assigns*; two *compare*.
  `if score = 100:` is a SyntaxError — Python will even suggest `==` in the
  message. The reverse slip, `score == 100` on a line by itself, is legal but
  does nothing: it computes `True` or `False` and throws it away.
- **Comparing a number with text.** `input()` always hands you a string, so
  `age >= 18` with `age = "34"` raises a TypeError. Convert with `int(age)`.
- **Trusting `<` on mixed-case strings.** `"Zoe" < "adam"` is `True` because
  of the capital. Lower-case both sides when you want human alphabetical order.

::: lesson m2-if

An `if` statement runs a block of code only when a condition is `True`. That
one idea is the difference between a calculator and a program.

```python
balance = 20
price = 15

if balance >= price:
    print("Purchase approved")
    balance = balance - price

print(f"Balance left: {balance}")
```

Look at the shape:

- the `if` line ends with a **colon**
- the lines that belong to it are **indented** by four spaces
- the first line that goes back to the left margin is outside the `if` and
  runs no matter what

That indentation is not decoration. In Python, indentation **is** the
structure: there are no curly braces or `end` keywords, so the only way Python
knows which lines belong to the `if` is by how far they are indented. Change
the indentation and you change the program.

## else: the other path

`else` catches everything the `if` did not:

```python
balance = 10
price = 15

if balance >= price:
    print("Purchase approved")
else:
    print(f"Declined: you are {price - balance} short")
```

Exactly one of the two blocks runs. `else` has no condition of its own — it
means "otherwise", and it must line up with the `if` it belongs to.

## elif: more than two outcomes

When there are several possible outcomes, chain them with `elif` ("else if").
Python tests the conditions **top to bottom and takes the first one that is
True**, then skips the rest of the chain entirely:

```python
hour = 14

if hour < 12:
    print("Good morning")
elif hour < 18:
    print("Good afternoon")
else:
    print("Good evening")
```

With `hour = 14` the first test fails, the second succeeds, and the `else`
never gets a look. Notice that `elif hour < 18:` does not need to say
`hour >= 12` — if the chain reached that line, the first test already failed,
so the hour is known to be at least 12.

## Order matters

That "first True wins" rule means the order of your branches is part of the
logic. The grading-letter pattern shows it best: test the **strictest**
condition first and work downwards.

```python
mark = 83

if mark >= 80:
    grade = "A"
elif mark >= 65:
    grade = "B"
elif mark >= 50:
    grade = "C"
else:
    grade = "F"

print(f"Mark {mark} is a {grade}")
```

Flip the order — `if mark >= 50` first — and every pass becomes a `C`, because
83 is of course at least 50 and the chain stops right there.

## if inside if

Blocks nest. Indent another four spaces and you have an `if` inside an `if`:

```python
logged_in = True
is_admin = False

if logged_in:
    print("Welcome back")
    if is_admin:
        print("Admin tools unlocked")
    else:
        print("Standard account")
else:
    print("Please log in")
```

Nesting works, but two or three levels is about as deep as you want to go —
beyond that the next lesson's `and` and `or` keep things flat.

> [!warn]
> Three separate `if` statements are **not** the same as `if`/`elif`/`elif`.
> Separate `if`s are all tested, so several can run. A chain stops at the
> first match. If you want exactly one outcome, use `elif`.

## Common mistakes

- **Forgetting the colon.** Every `if`, `elif` and `else` line ends with `:`.
  Python's error says `expected ':'`.
- **Inconsistent indentation.** Every line in a block needs exactly the same
  indentation. Mixing 4 and 2 spaces, or a tab with spaces, gives an
  IndentationError. Stick to four spaces.
- **Branches in the wrong order.** If a broad condition like `mark >= 50`
  sits above a narrow one like `mark >= 80`, the narrow one can never run.
  Strictest first.

::: lesson m2-logic

One comparison answers one question. Real rules combine several: *free if
you are under 12 or over 65, but not at weekends*. Python has three words for
that — `and`, `or`, `not` — and they read almost like English.

```python
age = 70
is_weekend = False

print(age < 12 or age >= 65)
print(age >= 65 and not is_weekend)
print(not is_weekend)
```

- `a and b` is `True` only when **both** sides are `True`
- `a or b` is `True` when **at least one** side is `True`
- `not a` flips `True` to `False` and back

## Precedence: not, then and, then or

Mixing them without parentheses is where people slip. Python evaluates `not`
first, then `and`, then `or` — the same way `*` beats `+` in arithmetic:

```python
print(True or False and False)
print((True or False) and False)
```

The first line is `True or (False and False)`, which is `True`. The second
forces the `or` first and gets `False`. When a condition mixes `and` with
`or`, add parentheses even when you don't strictly need them — the next
person to read it (usually you) will thank you.

## Short-circuiting

Python stops evaluating as soon as the answer is settled. In `a and b`, if
`a` is `False` the whole thing is `False`, so `b` is never looked at. In
`a or b`, if `a` is `True`, `b` is skipped. That is more than an
optimisation — it lets you guard a dangerous check with a safe one:

```python
items = []

if len(items) > 0 and items[0] == "urgent":
    print("Urgent item first")
else:
    print("No urgent item")
```

`items[0]` on an empty list would raise an IndexError, but `len(items) > 0`
is `False`, so Python never reaches it.

## Truthiness: every value is a bit True or False

You can put *any* value where a condition goes, not just a comparison.
Python treats some values as **falsy** — they count as `False`:

- the number `0` (and `0.0`)
- the empty string `""`
- the empty list `[]` (and empty tuples, dicts, sets)
- `None`

Everything else is **truthy**. That gives you the most common idiom in
Python code:

```python
cart = ["notebook", "pen"]
discount_code = ""

if cart:
    print(f"Items in cart: {len(cart)}")
else:
    print("Cart is empty")

if discount_code:
    print("Discount applied")
else:
    print("No discount")
```

`if cart:` reads as "if there is anything in the cart". It is shorter than
`if len(cart) > 0:` and every Python programmer recognises it instantly.

## `in` as a condition

`x in collection` is `True` when `x` is one of the items. It works on
strings (is this substring present?), lists, and later on dictionaries:

```python
city = "Nairobi"
vowel_start = city[0].lower() in "aeiou"
print(vowel_start)
print("rob" in city)
print("Lagos" in ["Accra", "Nairobi", "Cairo"])
```

`not in` is the negative form and reads better than `not (x in y)`.

> [!warn]
> `bool("0")` is `True`, and so is `bool("False")`. Only the *empty* string
> is falsy — any string with characters in it, whatever they spell, is truthy.
> The number `0` is falsy; the text `"0"` is not.

## Common mistakes

- **`x == 1 or 2`.** This reads as `(x == 1) or 2`, and `2` is truthy, so
  the condition is always `True`. You want `x == 1 or x == 2`, or neater,
  `x in (1, 2)`.
- **Missing parentheses when mixing `and` and `or`.**
  `a or b and not c` groups as `a or (b and not c)`. Put the brackets in.
- **Writing `if flag == True:`.** It works, but `flag` already *is* a
  boolean. `if flag:` says the same thing without the noise; `if not flag:`
  for the opposite.

::: lesson m2-while

A **while loop** repeats a block for as long as a condition stays `True`.
Python checks the condition, runs the body if it holds, goes back and checks
again — and again — until the check finally fails.

```python
count = 3

while count > 0:
    print(count)
    count = count - 1

print("Liftoff!")
```

Trace it by hand once. `count` is 3: `3 > 0` holds, print 3, count becomes 2.
`2 > 0` holds, print 2, count becomes 1. `1 > 0` holds, print 1, count
becomes 0. `0 > 0` fails — the loop is over and Python carries on at the
first unindented line.

The line `count = count - 1` is the whole trick. **Something inside the loop
must change the variable the condition tests.** If nothing does, the
condition can never become `False`.

## The infinite loop trap

Delete that line and the loop prints `3` forever. On your own computer the
program hangs until you press Ctrl-C; in this course the run is stopped after
about 8 seconds and you see "Your code ran for too long". When that happens,
the question to ask is always the same: *what in the body moves the loop
towards its exit?*

```python
n = 1

while n < 100:
    n = n * 2

print(n)
```

Here `n` doubles each pass — 1, 2, 4, 8, … — and the loop ends at the first
power of two that is not below 100.

## Counters and accumulators

A `while` loop shines when you don't know in advance how many passes you
need. Two variables usually ride along: a **counter** that counts the passes
and an **accumulator** that builds up a result.

```python
balance = 1000
years = 0

while balance < 2000:
    balance = balance * 1.07
    years = years + 1

print(f"Doubled after {years} years: {balance:.2f}")
```

The condition describes the state you are *in* (`balance < 2000`), not the
state you want. The loop keeps going until that stops being true.

## The sentinel pattern

A **sentinel** is a special value that means "stop". Reading commands until
the user types `quit`, or readings until a `-1` appears, both use it. Here the
sentinel is a roll of 6:

```python
import random
random.seed(3)

roll = 0
rolls = 0

while roll != 6:
    roll = random.randint(1, 6)
    rolls = rolls + 1
    print(f"Rolled a {roll}")

print(f"It took {rolls} rolls to get a six")
```

`roll` starts at a value that is *not* the sentinel so the condition is `True`
the first time. Each pass draws a new roll; the loop ends the moment a 6
appears.

> [!tip]
> `count += 1` is the short form of `count = count + 1`. There is `-=`, `*=`
> and `/=` too. Use them inside loops — they make the "move towards the exit"
> line stand out.

## Common mistakes

- **Never changing the loop variable.** The condition stays `True` and the
  loop never ends. Every `while` body should contain a line that moves the
  tested variable.
- **Off by one.** `while count >= 0` instead of `while count > 0` runs one
  extra pass and prints an unwanted `0`. Trace the last pass by hand.
- **Printing inside the loop when the result belongs after it.** Summary lines
  like `Doubled after 11 years` go after the loop, back at the left margin.
  Indent them and they print on every pass.

::: lesson m2-for

A **for loop** walks through a sequence and runs its block once per item.
Where `while` says "keep going until", `for` says "do this for each of
these". When you know what you are looping over — the characters of a word,
the prices in a cart, the numbers 1 to 10 — `for` is the right tool.

```python
cities = ["Lisbon", "Nairobi", "Osaka"]

for city in cities:
    print(f"Flights to {city}")

print("Done")
```

`city` is the **loop variable**. On each pass Python sets it to the next item
and runs the body; when the list runs out the loop ends. You never write the
index, never check a condition and never risk an infinite loop — the list
is finite, so the loop is too.

## Looping over a string

A string is a sequence of characters, so the same loop visits each one:

```python
word = "koala"
vowels = 0

for letter in word:
    if letter in "aeiou":
        vowels += 1

print(f"{word} has {vowels} vowels")
```

## range(): counting without a list

For "do this 5 times" or "the numbers from 1 to 10" you don't want to type a
list out. `range()` produces the numbers for you:

```python
for i in range(5):
    print(i)
```

That prints `0 1 2 3 4` — five numbers, starting at zero, **stopping before**
5. The stop value is never included; that is the rule to burn in. There are
three forms:

| call | produces |
| --- | --- |
| `range(5)` | `0, 1, 2, 3, 4` |
| `range(1, 6)` | `1, 2, 3, 4, 5` |
| `range(0, 20, 5)` | `0, 5, 10, 15` |
| `range(10, 0, -2)` | `10, 8, 6, 4, 2` |

Start, stop, step. A negative step counts down, and the stop is still
excluded — `range(10, 0, -2)` ends on 2, not 0.

```python
for n in range(1, 11):
    print(n * n, end=" ")
print()

for n in range(10, 0, -2):
    print(n, end=" ")
print()
```

`end=" "` keeps the numbers on one line; the bare `print()` afterwards ends it.

## Accumulating a total

The accumulator pattern from the last lesson is even cleaner with `for`:
start at zero, add each item, print once the loop is finished.

```python
prices = [3.50, 4.25, 2.75]
total = 0

for price in prices:
    total += price

print(f"Total: {total:.2f}")
```

Python does have `sum(prices)`, and you should use it in real code. But
write the loop by hand a few times first — the "start at zero, add each,
report at the end" shape comes back constantly with things `sum()` cannot do.

## Naming the loop variable

Name the loop variable for **one item**, and the sequence for many:
`for price in prices`, `for city in cities`, `for letter in word`. Use `i`
(and `j` for an inner loop) only when the number itself is what you want,
as with `range()`. A loop that reads `for x in data` tells the reader
nothing.

> [!tip]
> Need the position as well as the item? `for i in range(len(cities))`
> works, but `for i, city in enumerate(cities)` is the Python way — you will
> meet it properly in the collections module.

## Common mistakes

- **Expecting `range(1, 10)` to include 10.** It stops at 9. Write
  `range(1, 11)` for one to ten.
- **Printing the total inside the loop.** The report line goes *after* the
  loop, un-indented. Inside, it prints a running total on every pass.
- **Changing the loop variable to steer the loop.** `i = i + 2` inside
  `for i in range(10)` does nothing to the next pass — `for` always hands you
  the next item regardless. Use a step in `range()` or a `while` loop.

::: lesson m2-break

Most loops run to the end of their sequence. Sometimes you want out early —
you found what you were looking for, or an item is not worth processing.
Python gives you two words for that: `break` leaves the loop entirely, and
`continue` skips the rest of the current pass.

## break: stop searching once you've found it

```python
guests = ["Amara", "Liam", "Priya", "Noah"]

for guest in guests:
    print(f"Checking {guest}")
    if guest == "Priya":
        print("Found Priya — stop looking")
        break

print("Loop finished")
```

The loop prints `Checking` for Amara, Liam and Priya, then hits `break` and
jumps straight to `Loop finished`. Noah is never checked. Without `break` the
loop would carry on through the whole list — harmless for four names,
wasteful for four million.

`break` works in `while` loops too, and it is how you write a loop whose
exit condition sits in the *middle* of the body:

```python
import random
random.seed(7)

total = 0
while True:
    card = random.randint(1, 11)
    total += card
    print(f"Drew {card}, total {total}")
    if total >= 17:
        break

print("Stand")
```

`while True:` would run forever on its own; the `break` is the only way out,
and that is intentional.

## continue: skip this one, keep going

```python
readings = [21.5, -999, 22.1, -999, 23.0]
valid = 0

for reading in readings:
    if reading == -999:
        continue
    print(f"Reading: {reading}")
    valid += 1

print(f"Valid readings: {valid}")
```

When a reading is the glitch value `-999`, `continue` sends Python straight
to the next item — the `print` and the `valid += 1` are skipped for that pass
only. The loop still visits every reading.

You could write the same thing with `if reading != -999:` and indent the rest
under it. `continue` earns its place when the "skip" check is at the top and
the real work below is several lines long: it keeps that work at a shallow
indent.

## for … else: "it was never found"

Searching with `break` raises a question — how do you know whether the loop
found anything? Python has an answer that surprises people: a loop can have an
`else` clause, and it runs **only if the loop finished without a `break`**.

```python
guests = ["Amara", "Liam", "Priya", "Noah"]
name = "Zara"

for guest in guests:
    if guest == name:
        print(f"Welcome, {name}!")
        break
else:
    print(f"{name} is not on the list")
```

The `else` is lined up with the `for`, not with the `if`. Read it as
"no break": if the search ran all the way through without breaking, nobody
matched, so print the not-found message. Change `name` to `"Liam"` and the
welcome prints instead and the `else` is skipped.

## Flags vs break

Before `for … else`, the usual approach was a **flag** — a boolean you set
when you find the item and check afterwards:

```python
guests = ["Amara", "Liam", "Priya", "Noah"]
name = "Zara"
found = False

for guest in guests:
    if guest == name:
        found = True
        break

if found:
    print(f"Welcome, {name}!")
else:
    print(f"{name} is not on the list")
```

Both work. The flag version is longer but more familiar to people coming from
other languages, and it is the right choice when you need the answer later,
away from the loop. `for … else` is tighter when the two outcomes are handled
right there.

> [!warn]
> `break` only leaves the **innermost** loop. In a loop inside a loop, a
> `break` in the inner one returns you to the outer one, which carries on.
> The next lesson shows what to do about that.

## Common mistakes

- **`else` on the `if` instead of the `for`.** Indented one level too deep,
  it becomes the `if`'s else and prints "not on the list" for every
  non-matching guest. The loop's `else` sits at the same indentation as
  `for`.
- **Forgetting that `continue` skips everything below it.** A counter placed
  after the `continue` is not incremented for skipped items — which is
  usually what you want, but check.
- **Using `break` where `continue` is meant.** `break` ends the whole loop at
  the first glitch; `continue` just drops that one item.

::: lesson m2-nested

A loop body can hold anything — including another loop. The **outer loop**
runs its passes, and on *each* of those passes the **inner loop** runs all of
its own. That is how you work through every combination of two things: every
row with every column, every team against every other team.

```python
for row in range(1, 4):
    for col in range(1, 4):
        print(f"({row},{col})", end=" ")
    print()
```

Trace it: `row` is 1 while `col` goes 1, 2, 3 — then `print()` ends the line
— then `row` is 2 while `col` goes 1, 2, 3 again. Three outer passes, three
inner passes each, nine pairs in total. **Nested loops multiply.**

## The multiplication table

The classic use. The outer loop picks the row, the inner loop fills it in:

```python
for i in range(1, 6):
    for j in range(1, 6):
        print(f"{i * j:3}", end="")
    print()
```

`{i * j:3}` pads each product to three characters so the columns line up —
the same f-string formatting from Module 1, doing real work.

## Patterns: the triangle

When the inner loop's length depends on the outer variable you get shapes
instead of grids. A row with `row` stars:

```python
for row in range(1, 5):
    for star in range(row):
        print("*", end=" ")
    print()
```

Row 1 runs the inner loop once, row 4 runs it four times. Swap `range(row)`
for `range(4 - row)` and the triangle flips. These exercises look like toys,
but the thinking — *what does this row need, given the row number?* — is the
same thinking behind formatting a report or drawing a chart.

## Counting pairs without repeats

To pair every team with every other team exactly once, loop over indexes and
start the inner loop **one past** the outer one:

```python
teams = ["Lions", "Tigers", "Bears"]
matches = 0

for i in range(len(teams)):
    for j in range(i + 1, len(teams)):
        print(f"{teams[i]} vs {teams[j]}")
        matches += 1

print(f"Matches: {matches}")
```

Starting at `i + 1` does two things at once: a team never plays itself
(`j` is never equal to `i`), and `Tigers vs Lions` never appears after
`Lions vs Tigers` (`j` is always bigger than `i`). Three teams, three
matches; four teams, six; ten teams, forty-five.

## Keep it small

Because nested loops multiply, their cost grows fast. Two loops over 1,000
items each is a million inner passes — fine, a fraction of a second. Two
loops over 100,000 items is ten billion, and that is well past the 8-second
limit here and far past anybody's patience anywhere. Programmers call this
shape **O(n²)** ("order n squared"): double the input, quadruple the work.

```python
import time
started = time.perf_counter()
pairs = 0
for i in range(1000):
    for j in range(1000):
        pairs += 1
elapsed = time.perf_counter() - started
print(f"{pairs} pairs in {elapsed:.3f} s")
```

A million passes, done well under a second — but notice how quickly the
numbers climb. If an inner loop is only there to *look something up*, there is
usually a way to avoid it with a dictionary or a set; you will meet those in
Module 3.

> [!warn]
> `break` leaves only the inner loop. To stop *both* loops, set a flag
> (`found = True`), `break` the inner one, then check the flag at the top of
> the outer loop and `break` again — or, better, put the loops in a function
> and `return` (Module 4).

## Common mistakes

- **Reusing the same loop variable.** `for i in …:` containing another
  `for i in …:` runs, but the inner loop overwrites `i` and the outer value
  is lost. Use distinct names: `row`/`col`, `i`/`j`.
- **Ending the line in the wrong place.** The `print()` that finishes a row
  belongs *after* the inner loop, at the outer loop's indentation. One level
  too deep and every star gets its own line; at the left margin and you get a
  single line at the very end.
- **Inner loop starting at 0 for pairs.** `range(len(teams))` in both loops
  gives you each match twice plus every team against itself. Start the inner
  loop at `i + 1`.
