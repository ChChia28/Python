::: lesson m1-hello

A **program** is a list of instructions written in a language the computer
understands. Python is one of those languages, and the rules are simple:
Python reads your file from the top, does what the first line says, then the
second, then the third, until it reaches the end. Nothing happens that you
did not write down, and nothing happens out of order.

Here is a complete program. Press **Run** and watch the panel below it.

```python
print("Hello, world!")
```

`print()` is a **function** — a named action you can trigger. You trigger it by
writing its name and a pair of parentheses, and whatever you put inside the
parentheses is what it works on. Here it is handed the text `Hello, world!`,
and its job is to show that text in the output.

## Text needs quotes

The quotes are not part of the message; they are a fence. They tell Python
"everything between here and here is text, not code". A piece of text is
called a **string**, and you can fence it with double quotes or single quotes —
just use the same kind at both ends.

```python
print("Double quotes work.")
print('So do single quotes.')
print("It's easiest to use double quotes when the text has an apostrophe.")
```

Leave the quotes off and Python thinks you are talking about something it
should already know. It will stop with an error, which you will learn to read
at the end of this module.

## One line per print

Each call to `print()` ends by moving to a new line, which is why the three
calls above came out as three lines, in the order they were written. Want
four lines? Write four calls.

Numbers do not need quotes. Without them, Python does the arithmetic and prints
the result; with them, it prints the characters exactly as typed:

```python
print(2 + 2)
print("2 + 2")
print("Total:", 2 + 2)
```

The last line shows a handy habit: give `print()` several things separated by
commas and it prints them all on one line, with a single space between each.

## sep and end

Those two defaults — a space between values, a new line at the end — can be
changed. `sep=` sets the separator and `end=` sets what comes after:

```python
print("2026", "10", "20", sep="-")
print("Loading", end="")
print("...", end="")
print(" done")
```

You will rarely need these in the first few modules, but it is worth knowing
they exist so that `print` never feels like magic.

> [!tip]
> The output panel shows exactly what your program printed, character for
> character. When an exercise compares your output with the expected one, a
> missing comma or a capital letter in the wrong place is enough to fail it.
> Read the task text carefully and copy its punctuation.

## Common mistakes

- **Forgetting the quotes.** `print(Hello)` makes Python look for something
  called `Hello`, which does not exist. Text goes in quotes: `print("Hello")`.
- **Mismatched quotes.** `print("Hello')` opens with one kind and closes with
  another, so the string never ends. Match them.
- **Capital P.** Python is case-sensitive. `Print("hi")` is not the same name
  as `print("hi")` and will fail.
- **Missing parentheses.** `print "hi"` was valid in a very old version of
  Python. Today it is a syntax error; the parentheses are required.

::: lesson m1-variables

Programs need to remember things: the user's name, a running total, the number
of jars left on the shelf. A **variable** is a name you attach to a value so
you can use the value later by its name.

```python
city = "Lisbon"
population = 545000
print(city)
print(population)
```

The `=` sign is **assignment**. It does not mean "equals" in the maths sense;
it means "take the value on the right and label it with the name on the left".
Read `city = "Lisbon"` as *city becomes "Lisbon"*. From that line on, writing
`city` anywhere in the program means `"Lisbon"`.

## Labels move

A name is a sticky label, not a box. You can peel it off one value and stick it
on another at any time, and the most recent assignment wins:

```python
score = 10
print(score)
score = 25
print(score)
score = score + 5
print(score)
```

The last assignment looks strange if you read `=` as equality — `score` is
obviously not equal to `score + 5`. Read it as a recipe instead: work out the
right-hand side first (25 + 5 is 30), *then* stick the label `score` on the
result. This "update a value using its old value" move is so common that
Python has a shorthand for it, **augmented assignment**:

```python
balance = 120
balance += 50     # same as balance = balance + 50
balance -= 30     # same as balance = balance - 30
balance *= 2      # same as balance = balance * 2
print(balance)
```

`+=`, `-=`, `*=` and `/=` all follow the same pattern: apply the operator with
the current value on the left and the new value on the right, then store the
result back under the same name.

## Copying a value

Assigning one variable to another copies the value *at that moment*. After
`copy = original`, changing `original` does not reach back and change `copy`;
each name holds its own value. Try it in the next example before the swap.

## Swapping two variables

Suppose `first` and `second` hold the wrong values and you want to exchange
them. `first = second` throws away the old value of `first` before you have
saved it anywhere. The classic fix is a temporary name; the Python fix is a
one-line swap:

```python
original = 5
copy = original
original = 99
print(original, copy)

first = "Daniel"
second = "Aisha"
first, second = second, first
print(first, second)
```

Python works out everything on the right-hand side first, then assigns the
results to the names on the left in order — which is why nothing gets lost.

## Choosing names

A name can contain letters, digits and underscores, cannot start with a digit,
and is case-sensitive (`total`, `Total` and `TOTAL` are three different
variables). A few words are reserved by Python itself — `if`, `for`, `class`,
`True` — and cannot be used as names. `print` is not reserved, but reusing it
as a variable name breaks `print()` for the rest of the program, so leave the
built-in names alone too.

The convention Python programmers follow is **snake_case**: lower-case words
joined by underscores. `unit_price`, `items_sold`, `max_retries`. Pick names
that say what the value *is*: `price` beats `p`, and `price_per_kg` beats
`price2`.

> [!warn]
> Python reads top to bottom, so a variable only exists *after* the line that
> assigns it. Use a name above its assignment and you get `NameError: name
> 'total' is not defined` — the most common error in week one.

## Common mistakes

- **Using a name before assigning it.** Move the assignment above the first
  use, or check the spelling — `totl` and `total` are different names.
- **Spaces in names.** `unit price = 4.5` is a syntax error. Join the words
  with an underscore.
- **Expecting a copy to follow the original.** After `b = a`, changing `a` does
  nothing to `b`. Each name holds its own value.
- **Losing a value in a swap.** `a = b` then `b = a` leaves both names on the
  same value. Use `a, b = b, a`.

::: lesson m1-numbers

Python has two everyday kinds of number. An **int** (integer) is a whole
number: `3`, `-42`, `1000000`. A **float** is a number with a decimal point:
`3.0`, `2.5`, `-0.75`. They look alike but Python treats them differently, and
the difference shows up as soon as you divide.

```python
print(7 + 3)
print(7 - 3)
print(7 * 3)
print(7 / 2)
```

Three of these give whole numbers, but `7 / 2` gives `3.5` — a float. In fact
`/` **always** gives a float, even when the division is exact: `8 / 2` is
`4.0`, not `4`. If you want the whole-number answer, you need a different
operator.

## Division, three ways

| operator | name | `17 ? 5` | what it gives |
| --- | --- | --- | --- |
| `/` | true division | `3.4` | the exact answer, always a float |
| `//` | floor division | `3` | how many whole times 5 fits into 17 |
| `%` | modulo | `2` | what is left over after that |

```python
print(17 / 5)
print(17 // 5)
print(17 % 5)
```

`//` and `%` are a pair: together they answer "how many groups, and how many
left over?". That is exactly what you need to turn 125 minutes into 2 hours
and 5 minutes, or to tell whether a number is even (`number % 2` is `0`) or
odd (`1`).

Two more operators finish the set: `**` raises to a power (`2 ** 10` is
`1024`) and a minus sign in front negates (`-score`).

## Order of operations

Python follows the same rules as school maths: `**` first, then `*`, `/`, `//`
and `%`, then `+` and `-`, working left to right within each level. Parentheses
override everything:

```python
print(2 + 3 * 4)
print((2 + 3) * 4)
print(10 - 4 - 3)
print(2 ** 3 ** 2)
```

The last one is the only surprise: `**` groups from the right, so it is
`2 ** 9`, which is `512`. When in doubt, add parentheses — they cost nothing
and make your intent visible.

## Rounding

`round(value, places)` rounds a float to a number of decimal places. With no
second argument it rounds to the nearest whole number and gives back an int:

```python
bill = 95.90
share = bill / 3
print(share)
print(round(share, 2))
print(round(share))
print(0.1 + 0.2)
```

## Why 0.1 + 0.2 looks wrong

That last line printed `0.30000000000000004`. Floats are stored in binary,
and some decimal fractions — like one tenth — cannot be written exactly in
binary, just as one third cannot be written exactly in decimal. The tiny error
usually hides, but sometimes it leaks out. `round(0.1 + 0.2, 2)` gives the
`0.3` you expected.

This is not a Python bug; every mainstream language does it. The practical
rule: never compare floats for exact equality, and round when you *display*
money, not when you calculate it.

> [!warn]
> Mixing an int and a float gives a float: `3 + 1.5` is `4.5`, and `3 * 1.0`
> is `3.0`. That is harmless for maths, but if you later need a whole number —
> to count items, say — you will have to convert it back with `int()` or
> `round()`.

## Common mistakes

- **Using `/` when you need a whole number.** `185 / 60` is `3.0833…`. For
  whole hours use `185 // 60`.
- **Forgetting that `%` is remainder.** `185 % 60` is `5`, the minutes left
  over — not a percentage.
- **Expecting `round(2.675, 2)` to give `2.68`.** It gives `2.67`, because
  2.675 is stored as slightly less than that. Floats are approximate; accept
  it.
- **Dropping parentheses.** `bill / people * 2` and `bill / (people * 2)` are
  different numbers. Group explicitly.

::: lesson m1-strings

A **string** is a piece of text: a name, a sentence, a product code, an empty
`""`. You write one by putting characters between a matching pair of quotes.
Single and double quotes mean the same thing, which lets you put one kind
inside the other without trouble:

```python
print("She said 'run it again'.")
print('The file is called "report.csv".')
```

## Measuring and gluing

`len()` counts the characters in a string, spaces and punctuation included.
`+` joins two strings end to end — this is called **concatenation** — and `*`
with a whole number repeats a string:

```python
first_name = "Grace"
last_name = "Hopper"
full_name = first_name + " " + last_name
print(full_name)
print(len(full_name))
print("=" * 20)
print("ab" * 3)
```

Notice the `" "` in the middle of `full_name`: `+` glues exactly what you give
it, so if you want a space you have to add one.

## Picking out characters

Every character in a string has a position, called an **index**, and the
counting starts at **0**, not 1. You read a character by putting its index in
square brackets after the string. Negative indexes count from the end, so
`[-1]` is always the last character:

```python
word = "Python"
print(word[0])
print(word[1])
print(word[-1])
print(word[-2])
```

Ask for a position that does not exist — `word[6]` on a six-letter word — and
Python stops with `IndexError: string index out of range`. The last valid
index is always `len(word) - 1`, which is one reason `[-1]` is so handy.

## Special characters

Inside a string, a backslash starts an **escape sequence**: a short code for
a character you cannot easily type. `\n` is a line break, `\t` is a tab, and
`\"` is a double quote that does not end the string:

For a block of text that spans several lines, triple quotes save you from
typing `\n` over and over — line breaks inside them are kept as they are:

```python
print("First line\nSecond line")
print("Name:\tAisha")
print("He said \"hello\" and left.")

address = """Flat 4B
12 Harbour Street
Penang"""
print(address)
print(len(address))
```

The `len()` at the end counts 32: the two line breaks inside `address` are
characters too.

> [!warn]
> A string of digits is still a string. `"42" + "1"` is `"421"`, not `43`, and
> `len("42")` is `2`. If you need to do maths, convert first — that is the
> whole of the next lesson.

## Common mistakes

- **Counting from 1.** `word[1]` is the *second* character. The first is
  `word[0]`.
- **Reaching past the end.** `word[len(word)]` is always one too far. Use
  `word[-1]` for the last character.
- **Forgetting the space in a join.** `first + last` gives `GraceHopper`. Add
  `" "` between them.
- **Multiplying by a string.** `"=" * len(title)` works; `"=" * title` raises
  `TypeError` because the right-hand side must be a whole number.

::: lesson m1-types

Every value in Python has a **type**: the kind of thing it is. `42` is an
`int`, `3.5` is a `float`, `"42"` is a `str`. The type decides what the value
can do: numbers can be divided, strings can be measured with `len()`, and
mixing them up is the source of most early errors. `type()` tells you what
you are holding:

```python
print(type(42))
print(type(3.5))
print(type("42"))
print(type(True))
```

That last one is a **bool**: a value that is either `True` or `False`. You will
meet bools properly in the next module, when programs start making decisions.
For now, just know they exist and that the capital letters matter.

## Why "3" + 4 fails

`+` means "add" for two numbers and "join" for two strings. Give it one of
each and Python refuses, because it cannot tell which you meant:

```python-error
print("3" + 4)
```

The message — `TypeError: can only concatenate str (not "int") to str` — is
Python saying "I was joining strings, and you handed me an int". The fix is to
decide what you want and convert one side to match.

## Converting between types

Three functions, named after the types they produce:

```python
print(int("29") + 1)
print(float("4.99") * 3)
print("Age: " + str(29))
```

- `int()` turns a string of digits (or a float) into a whole number.
- `float()` turns a string or an int into a decimal number.
- `str()` turns anything into text, so it can be joined to other text.

Two details catch people. `int()` on a float does not round, it **truncates** —
it throws away everything after the decimal point. And `int()` only accepts
text that looks like a whole number: `int("3.5")` raises `ValueError`, even
though `3.5` is a perfectly good number. Go through `float()` first.

```python
print(int(9.99))
print(int(-9.99))
print(int(float("3.5")))
print(round(9.99))
```

## Mixing int and float

When an int and a float meet in arithmetic, Python quietly converts the int
and the result is a float. `3 + 1.5` is `4.5`; `3 * 1.0` is `3.0`. The one
place that surprises people is `/`, which gives a float even for two ints —
`8 / 2` is `4.0`. If a whole number matters, use `//` or convert at the end.

```python
quantity = 3
price = 4.99
total = quantity * price
print(total, type(total))
print(8 / 2, type(8 / 2))
```

> [!tip]
> When something behaves unexpectedly, `print(type(x))` is the fastest
> diagnostic you have. Nine times out of ten the "number" is a string.

## Common mistakes

- **Adding text to a number.** `"Total: " + 14.97` raises `TypeError`. Use
  `"Total: " + str(14.97)`, or an f-string (next lesson).
- **Converting the wrong thing.** `int(age + 1)` still tries `"29" + 1` first
  and fails. Convert *before* the arithmetic: `int(age) + 1`.
- **Expecting `int()` to round.** `int(7.8)` is `7`. Use `round(7.8)` for
  `8`.
- **Passing a decimal string to `int()`.** `int("3.5")` raises `ValueError`.
  Use `float("3.5")`, then `int()` if you really need a whole number.

::: lesson m1-fstrings

You have seen two ways to mix values into text: commas in `print()`, which
force a space between every piece, and `+` with `str()`, which is exact but
clumsy. The way Python programmers actually do it is the **f-string**: put an
`f` before the opening quote, and anything inside curly braces is replaced by
its value.

```python
name = "Priya"
age = 34
print(f"{name} is {age} years old.")
print("Without the f: {name} is {age} years old.")
```

The second line shows what happens when you forget the `f` — the braces are
printed as ordinary characters. No error, just the wrong text, so check for the
`f` first whenever an f-string "does nothing".

## Any expression goes in the braces

The braces do not just hold variable names. They hold real Python, worked out
on the spot — arithmetic, function calls, anything that produces a value:

```python
price = 4.99
quantity = 3
print(f"{quantity} items at {price} each = {price * quantity}")
print(f"The word 'Python' has {len('Python')} letters.")
```

Numbers are converted to text automatically, so there is no `str()` to
remember and no `TypeError` to trip over. This is why f-strings replace `+`
almost everywhere.

## Format specs: controlling how a value looks

`4.99 * 3` is `14.97`, but `1299.5 * 2` is `2599.0` and `95.9 / 3` is
`31.96666666666667`. Money needs two decimals every time. A **format spec**
after a colon inside the braces controls the display without changing the
value:

```python
share = 95.9 / 3
print(f"Each person pays {share:.2f}")
print(f"Rounded to one place: {share:.1f}")
print(f"As a whole number: {share:.0f}")

population = 8804190
revenue = 1234567.891
print(f"Population: {population:,}")
print(f"Revenue: {revenue:,.2f}")
```

`.2f` reads as "fixed-point, 2 digits after the decimal point". The number is
rounded for display only; `share` itself is unchanged. A comma in the spec
inserts thousands separators, and the two combine: `:,.2f` is the standard
spec for money.

## Width and alignment

A number before the dot (or on its own) sets a minimum **width**, and `<`,
`>` or `^` pins the value to the left, right or centre of that space. It is how
you line columns up in plain-text output:

```python
print(f"{'Item':<10}{'Price':>8}")
print(f"{'Coffee':<10}{3.5:>8.2f}")
print(f"{'Sandwich':<10}{7.25:>8.2f}")
```

Text is left-aligned by default and numbers right-aligned, which is usually
what a table wants. You will not need width often, but when you do, nothing
else comes close.

> [!warn]
> The format spec belongs to the value, so it goes *inside* the braces after a
> colon: `{total:.2f}`. Writing `{total}:.2f` prints the raw number followed by
> the literal characters `:.2f`.

## Common mistakes

- **Forgetting the `f`.** `"{name}"` prints the braces. `f"{name}"` prints
  the value.
- **Quoting the variable.** `f"{'name'}"` prints the word `name` — the quotes
  make it a string literal. Variables go bare: `f"{name}"`.
- **Putting the spec outside the braces.** `{price}:.2f` is wrong;
  `{price:.2f}` is right.
- **Using `.2f` on a string.** Only numbers accept `f`. Convert first, or drop
  the spec.

::: lesson m1-input

So far every value was typed into the program. `input()` lets the person
running it type a value instead. It shows an optional **prompt**, waits for
them to press Enter, and hands back whatever they typed:

```python-static
name = input("What is your name? ")
print(f"Hello, {name}!")
```

Run with the name `Aisha`, it prints `Hello, Aisha!`. The prompt is just text
that `input()` prints before waiting; if you leave it out, the program waits
silently. Put a space at the end of the prompt or the cursor sits jammed
against the question mark.

## input() always gives you a string

This is the rule to tattoo somewhere. Whatever the person types — `29`,
`4.5`, `yes` — comes back as **text**. Type `29` and you get `"29"`, so `age +
1` is a `TypeError`. Convert on the way in:

```python-static
birth_year = int(input("Birth year: "))
age = 2026 - birth_year
print(f"You are {age} years old.")
```

`int(input(...))` reads inside out: `input()` runs first and returns a string,
then `int()` turns it into a number. Use `float(input(...))` when decimals are
allowed.

> [!warn]
> In the exercises below the input is supplied for you (it is listed above the
> editor), and the output panel does not echo it back. So a prompt and the
> following `print()` land on the same line: `Birth year: You are 28 years
> old.` That is normal — it is also what you would see in a terminal if the
> user typed nothing visible.

## Comments

A `#` starts a **comment**: Python ignores everything from the `#` to the end
of the line. Comments are for the humans reading the code — including you in
three weeks — and they should say *why*, not restate *what*:

```python
# Prices include 6% service tax
subtotal = 89.95
total = subtotal * 1.06   # 1.06 = 100% + 6%
print(round(total, 2))
```

Comments are also the quickest way to switch a line off while you test
something: put a `#` in front of it and it stops existing.

```python
print("This line runs.")
# print("This line is switched off.")
print("So does this one.")   # a comment can share a line with code
```

## Reading an error message

Every programmer, including the ones who wrote Python, makes mistakes
constantly. The skill is reading what Python tells you. Run this — it fails on
purpose:

```python-error
total = 19.99 * 3
print(f"Total: {totl}")
```

Python prints a **traceback**. Read it from the bottom up:

```text
Traceback (most recent call last):
  File "main.py", line 2, in <module>
    print(f"Total: {totl}")
NameError: name 'totl' is not defined
```

1. **The last line** is the headline: the error type (`NameError`) and the
   message (`name 'totl' is not defined`). It says what went wrong.
2. **The line above it** shows the code that failed, with its line number. It
   says where.
3. Everything above that is the route Python took to get there. In a short
   program there is nothing to see; in a bigger one it is the trail back to
   the function that made the bad call.

A `NameError` almost always means a typo or a variable used before it was
assigned. A `SyntaxError` is different: Python could not even read the line, so
nothing ran at all, and the message points at the spot with a caret:

```text
  File "main.py", line 1
    print("Hello"
         ^
SyntaxError: '(' was never closed
```

A `TypeError`, as you saw in the last two lessons, means the values were the
wrong kind for the operation. The editor below shows a plain-language tip
under each error; read the original message too, because that habit is what
you will rely on everywhere else.

## Common mistakes

- **Doing maths on `input()` directly.** It returns a string. Wrap it:
  `int(input())`.
- **Calling `input()` more times than there are lines.** The exercise supplies
  a fixed list; one `input()` per value.
- **Fixing the wrong line.** The traceback names the line number. Go there
  first, not to the line you edited last.
- **Commenting with the wrong symbol.** `//` is floor division, not a
  comment. Python comments start with `#`.
