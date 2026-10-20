::: lesson m5-methods

Most of the data you will ever touch arrives as text: names in a form, lines
in a log file, cells in a spreadsheet export. Python strings come with a
toolbox of **methods** — functions that belong to the value and are called
with a dot — and the first job is to learn the dozen you will use every day.

```python
name = "ada lovelace"
print(name.upper())
print(name.title())
print(name.capitalize())
print("ADA".lower())
```

`upper()` and `lower()` change every letter. `title()` capitalises the first
letter of each word; `capitalize()` only the first letter of the whole string.

## Methods return new strings

Look closely at the example: `name` itself never changed. Strings are
**immutable** — once created, a string cannot be edited in place. Every method
hands you back a *new* string and leaves the original alone.

```python-error
name = "ada"
name[0] = "A"      # TypeError: strings cannot be changed in place
```

So a method call on its own line does nothing useful. Keep the result:

```python
name = "ada"
name.upper()            # computed, then thrown away
print(name)             # still "ada"
name = name.upper()     # keep the new string
print(name)
```

## Trimming and replacing

`strip()` removes whitespace (spaces, tabs, newlines) from both ends;
`lstrip()` and `rstrip()` do one side. `replace(old, new)` swaps every
occurrence.

```python
raw = "   Kuala Lumpur \n"
print(repr(raw.strip()))
print(raw.strip().replace(" ", "_"))
print("2026-10-20".replace("-", "/"))
```

`repr()` shows the quotes, so you can *see* that the spaces are gone.

## Finding and counting

```python
title = "Python for Data Analysts"
print(title.find("Data"))        # index where it starts
print(title.find("SQL"))         # -1: not there
print(title.count("a"))
print(title.startswith("Python"))
print(title.endswith(".pdf"))
```

`find()` returns `-1` when the text is missing. `index()` does the same job but
raises `ValueError` instead — use it when a missing value is a genuine error,
and `find()` (or `in`) when it is merely a possibility.

## Chaining

Because every method returns a string, you can call the next method straight
on the result. Read a chain left to right, one step at a time:

```python
headline = "  breaking: python 3.14 released  "
print(headline.strip().title())
print(headline.strip().upper().replace(":", " -"))
```

> [!warn]
> `title()` is handy but naive: `"o'neil".title()` gives `"O'Neil"`, and
> `"3rd place".title()` gives `"3Rd Place"`. For display it is fine; for
> anything that must be exactly right, do the capitalising yourself.

## Common mistakes

- **Calling a method and ignoring the result.** `text.strip()` on its own line
  changes nothing. Write `text = text.strip()`.
- **Forgetting the parentheses.** `name.upper` without `()` is the method
  itself, not its result — you will see `<built-in method upper …>` in your
  output.
- **Using `index()` for a search that might fail.** It raises. Use `find()` and
  check for `-1`, or test with `in` first.

::: lesson m5-split-join

Text usually comes packed: a sentence is words separated by spaces, a CSV row
is fields separated by commas, a file is lines separated by newlines. `split`
unpacks a string into a list; `join` packs a list back into a string. Most
text processing is split → do something to the pieces → join.

## split

With no argument, `split()` breaks on **any run of whitespace** and drops empty
pieces. With an argument, it breaks on that exact separator — and keeps empty
pieces, because an empty field is still a field.

```python
sentence = "the   quick brown\tfox"
print(sentence.split())

row = "Priya,34,,Mumbai"
print(row.split(","))
```

The first result has four clean words despite the messy spacing. The second
has an empty string in position 2 — the missing field — which is exactly what
you want when parsing data: the columns still line up.

`splitlines()` breaks on newlines and handles `\n`, `\r\n` and a trailing
newline sensibly:

```python
data = "Priya,34,Mumbai\nKenji,29,Osaka\nAmara,41,Lagos\n"
for line in data.splitlines():
    name, age, city = line.split(",")
    print(f"{name} is {age} and lives in {city}")
```

Three fields, three names on the left — Python unpacks the list straight into
variables. If a line had the wrong number of commas you would get a
`ValueError` on the spot, which is better than silently reading the wrong
column.

## join

`join` is written on the **separator**, not on the list. It looks backwards
until you read it as "use this string to glue these pieces":

```python
words = ["python", "is", "eating", "the", "world"]
print(" ".join(words))
print("-".join(words))
print("".join(["a", "b", "c"]))
```

Every piece must be a string. Numbers need converting first:

```python
scores = [88, 92, 79]
print(", ".join(str(s) for s in scores))
```

## strip before you compare

Real data has stray spaces, and `"Mumbai "` is not equal to `"Mumbai"`. Strip
each piece as you take it out:

```python
line = " Priya Nair , 34 ,Mumbai "
name, age, city = line.split(",")
print(repr(city))
print(city.strip() == "Mumbai")
print(int(age))        # int() forgives spaces, but most things don't
```

> [!warn]
> `split()` with no argument and `split(" ")` are not the same. The second
> breaks on *single* spaces, so `"a  b".split(" ")` gives `['a', '', 'b']`.
> When you mean "words", leave the argument out.

## Common mistakes

- **Writing `list.join(sep)`.** It is `sep.join(list)`: the separator does the
  joining.
- **Joining numbers.** `"-".join([1, 2])` raises `TypeError`. Convert with
  `str()` first.
- **Comparing before stripping.** `city == "Mumbai"` fails on `"Mumbai "`.
  Strip once, when the data comes in.

::: lesson m5-format

Numbers print the way Python stores them, which is rarely how people want to
read them: `1234.5` should be `1,234.50`, `0.075` should be `7.5%`, and a
column of prices should line up on the decimal point. An f-string takes a
**format spec** after a colon that handles all of this.

## Decimals, thousands and percent

```python
price = 1234.5
rate = 0.075
print(f"{price:.2f}")       # 2 decimal places
print(f"{price:,}")         # thousands separator
print(f"{price:,.2f}")      # both
print(f"{rate:.1%}")        # as a percentage, 1 decimal
print(f"{2/3:.0%}")
```

The pieces of a spec always come in the same order: *fill and alignment*,
*width*, *comma*, *precision*, *type*. You can leave any of them out.
`.2f` means "fixed-point, 2 decimals"; `%` multiplies by 100 and adds the
sign; `,` inserts separators.

## Alignment and width

A width makes a value occupy a fixed number of characters. `<` pads on the
right (left-aligned), `>` pads on the left (right-aligned), `^` centres.

```python
print(f"[{'Pen':<10}]")
print(f"[{'Pen':>10}]")
print(f"[{'Pen':^10}]")
print(f"[{42:>6}]")
print(f"[{42:06d}]")       # pad with zeros instead of spaces
print(f"Order #{7:04d}")
```

Text aligns left by default and numbers align right, but spell it out — it
makes the table code readable. A `0` before the width pads with zeros, which is
how you get `0007`.

## Building a table

Give every column a fixed width, use the same widths for the header, and let a
loop do the rows. Decimals and widths combine: `:>8.2f` is "right-aligned in 8
characters, 2 decimal places".

```python
cities = [("Kuala Lumpur", 1982000, 243.0), ("Osaka", 2753000, 225.2), ("Lagos", 15388000, 1171.3)]
print(f"{'City':<14}{'People':>12}{'km²':>10}")
for name, people, area in cities:
    print(f"{name:<14}{people:>12,}{area:>10.1f}")
```

Any expression works inside the braces — a calculation, a method call, an
index — and the spec applies to its result:

```python
for name, people, area in [("Osaka", 2753000, 225.2), ("Lagos", 15388000, 1171.3)]:
    print(f"{name.upper():<8}{people / area:>10,.0f} per km²")
```

> [!warn]
> A width is a **minimum**. A 14-character city name in a 10-wide column
> simply overflows and pushes everything after it along. Measure your longest
> value (or cut it with a slice) before choosing widths.

## Common mistakes

- **Putting the pieces in the wrong order.** It is `{x:>10,.2f}`, never
  `{x:.2f>10}`. Alignment and width first, then comma, then precision.
- **Rounding with `round()` and then printing.** `round(2.5, 2)` prints
  `2.5`, not `2.50`. Formatting controls the *display*; leave the number alone.
- **Expecting `%` to need `* 100`.** `{rate:.1%}` already multiplies.
  `{rate * 100:.1%}` gives `750.0%`.

::: lesson m5-chars

A string is a sequence of **characters**, and you can walk it like a list. Each
character has a number behind it — its **code point** — and a handful of
special characters are written with a backslash. Knowing these three facts
explains most of the odd things strings do.

## One character at a time

```python
word = "Lagos"
for ch in word:
    print(ch, end=" ")
print()
print(word[0], word[-1], len(word))
```

`for` hands you each character in turn; indexing and `len()` work exactly as
they do on lists.

## ord and chr

`ord()` turns a character into its code point; `chr()` goes the other way.
Letters are numbered in alphabetical order, so arithmetic on code points moves
through the alphabet:

```python
print(ord("a"), ord("b"), ord("A"), ord("0"))
print(chr(97), chr(65))
print(chr(ord("a") + 1))           # the next letter
```

That is the whole idea behind a **Caesar shift**, the oldest cipher there is:
shift every letter a fixed distance along the alphabet, wrapping from `z` back
round to `a`. The wrap is a remainder:

```python
def shift_letter(ch, n):
    return chr((ord(ch) - ord("a") + n) % 26 + ord("a"))

print(shift_letter("a", 3), shift_letter("x", 3), shift_letter("z", 1))
```

`x` is 23 letters in; 23 + 3 = 26; 26 % 26 = 0; letter 0 is `a`. The `% 26`
is what makes `z` roll back to the start instead of running off the end.

## Escape sequences and raw strings

Some characters cannot be typed directly inside quotes, so a backslash
introduces them: `\n` is a newline, `\t` a tab, `\"` a quote inside a
double-quoted string, `\\` a single backslash.

```python
print("Name:\tPriya\nCity:\tMumbai")
print("She said \"fine\" and left.")
print("C:\\Users\\priya\\notes.txt")
print(r"C:\Users\priya\notes.txt")
```

The last line uses a **raw string** — the `r` before the quote switches
backslash processing off, so what you type is what you get. Raw strings exist
for Windows paths and regular expressions, where backslashes are everywhere.

## Unicode is fine

Python strings hold any character: `é`, `ü`, `中`, `😀`. `len()` counts code
points, not bytes, and `ord()` works on all of them:

```python
city = "Zürich"
print(len(city))
for ch in city:
    print(ch, ord(ch), end=" | ")
print()
print(len("東京"), len("東京".encode("utf-8")))
```

`東京` is two characters but six bytes on disk. You only meet bytes when you
`encode()` for a file or a network; inside your program, think in characters.

> [!warn]
> `"C:\new\table"` does not contain the text you typed: `\n` became a newline
> and `\t` a tab. Use a raw string (`r"C:\new\table"`) or forward slashes,
> which Windows accepts too.

## Common mistakes

- **Forgetting the wrap.** `chr(ord("z") + 1)` is `{`, not `a`. Subtract
  `ord("a")`, take `% 26`, add `ord("a")` back.
- **Counting bytes when you meant characters.** `len(text)` is characters;
  `len(text.encode())` is bytes. They differ as soon as accents appear.
- **Expecting `\` to be harmless.** Every backslash in a normal string is the
  start of an escape. Double it or use `r"…"`.

::: lesson m5-check

Anything that comes from a person — a form, a command line, a spreadsheet
someone typed by hand — is messy. Extra spaces, mixed capitals, a letter where
a number should be. Good code checks input at the door and cleans it once, so
that nothing downstream has to.

## Asking what a string contains

Strings know what kind of characters they hold:

```python
print("2024".isdigit(), "42.5".isdigit(), "-3".isdigit())
print("Priya".isalpha(), "Priya Nair".isalpha())
print("priya28".isalnum(), "priya_28".isalnum())
print("   ".isspace(), "".isspace())
```

Note the traps: `isdigit()` is `False` for a decimal point or a minus sign, so
it does not mean "can be converted to a number". `isalpha()` fails on a space.
An empty string is `False` for all of them.

## Comparing without caring about case

`lower()` is what most people reach for, and it is fine for English.
`casefold()` is the stronger version: it handles letters that change shape
when they lose their case, like German `ß` becoming `ss`.

```python
answer = "  Yes "
print(answer.strip().casefold() == "yes")
print("straße".casefold() == "STRASSE".casefold())
print("straße".lower() == "STRASSE".lower())
```

Combine `strip()` and `casefold()` before any comparison with user input.

## Checking membership with in

`in` answers "does this string contain that one?" and works on lists too,
which makes allow-lists tidy:

```python
plan = "Pro"
print(plan in ("Free", "Pro", "Team"))
print("@" in "priya@example.com")
print("@" in "priya.example.com")
```

## Normalising whitespace

`split()` with no argument throws away every space, tab and newline; joining
with a single space puts back exactly one between words. This two-step idiom
is the standard way to tidy spacing:

```python
raw = "  priya    nair\t  "
clean = " ".join(raw.split())
print(repr(clean))
```

## Validate early, return early

A validation function should state its rules one at a time and give up as soon
as one fails. Here is a rough email check — not a full standard, just enough
to catch typos:

```python
def looks_like_email(address):
    address = address.strip()
    if address.count("@") != 1:
        return False
    user, domain = address.split("@")
    if not user or "." not in domain:
        return False
    if " " in address:
        return False
    return True

for a in ["priya@example.com", "priya@example", "@example.com", "p q@x.com"]:
    print(f"{a:<20} {looks_like_email(a)}")
```

Each `if` guards one rule. The function reads like the rules themselves, and
when a rule changes you edit one line.

> [!warn]
> `isdigit()` is not a safe test before `int()`: `"42.5"` fails it, and so
> does `"-3"`, both of which `float()` and `int()` would happily accept.
> For "is this a number?" the honest answer is `try: float(text) except
> ValueError:`, which Module 6 covers.

## Common mistakes

- **Comparing raw input.** `answer == "yes"` fails on `"Yes "`. Strip and
  casefold first — once, at the top.
- **Treating `isalnum()` as "safe username".** It is `False` for underscores
  and `True` for letters from any alphabet. State the rule you actually mean.
- **Nesting validation.** Five nested `if`s are unreadable. Return `False` as
  soon as a rule fails and keep the function flat.

::: lesson m5-regex

String methods answer yes/no questions about fixed text: does it start with
`#`, does it contain `@`. They cannot say "three digits, a dash, four digits"
or "a `#` followed by any number of digits". That is the job of **regular
expressions** — a tiny language for describing *patterns* of text — and
Python's `re` module runs them.

## search: is the pattern in there?

```python
import re

text = "Orders #1042 and #1077 shipped on 14 March."
match = re.search(r"#\d+", text)
print(match)
print(match.group())
print(re.search(r"#\d+", "no orders here"))
```

`re.search` scans the string for the **first** place the pattern fits and
returns a match object, or `None` if it never fits. `.group()` gives the
matched text. Patterns are written as raw strings (`r"…"`) so that the
backslashes reach `re` untouched.

## The pattern language

A few building blocks cover most real work:

| pattern | matches |
| --- | --- |
| `\d` `\w` `\s` | a digit, a word character (letter, digit, `_`), whitespace |
| `[a-z]` `[A-Za-z0-9]` | one character from a set |
| `.` | any character except newline |
| `x+` `x*` `x?` | one or more, zero or more, zero or one `x` |
| `x{3}` `x{2,4}` | exactly 3, between 2 and 4 |
| `^` `$` | start of string, end of string |

```python
import re

print(re.search(r"^\d{3}-\d{4}$", "555-1234") is not None)
print(re.search(r"^\d{3}-\d{4}$", "call 555-1234") is not None)
print(re.search(r"colou?r", "the colour red").group())
```

The anchors matter: without `^` and `$`, `"call 555-1234"` would also match,
because the pattern fits *somewhere* inside it.

## findall and groups

`re.findall` returns every match as a list. Put parentheses around part of the
pattern and you get just that part — a **group**:

```python
import re

text = "Orders #1042 and #1077 shipped on 14 March; #1105 is delayed."
print(re.findall(r"#\d+", text))
print(re.findall(r"#(\d+)", text))

m = re.search(r"(\d{4})-(\d{2})-(\d{2})", "Due 2026-10-20")
print(m.group(1), m.group(2), m.group(3))
```

Groups are numbered left to right from 1; `.group(0)` is the whole match.

## sub: find and replace by pattern

`re.sub(pattern, replacement, text)` is `replace()` for patterns:

```python
import re

note = "Call 555-123-4567 or 555-987-6543 before noon."
print(re.sub(r"\d{3}-\d{3}-\d{4}", "[hidden]", note))
print(re.sub(r"\s+", " ", "too    many   spaces"))
```

## When not to use regex

If a string method does the job, use it. `line.startswith("ERROR")` is clearer
than `re.search(r"^ERROR", line)`, `"@" in address` beats a pattern, and
`split(",")` parses a simple CSV row faster than any regex. Reach for `re`
when the *shape* of the text matters — digits in a certain arrangement, an
optional part, "anything between two markers" — and keep each pattern short
enough to read aloud.

> [!warn]
> `re.search` returns `None` when nothing matches, and `None.group()` is an
> `AttributeError`. Always check the match before using it:
> `if m:` or `if m is None: return None`.

## Common mistakes

- **Forgetting the `r`.** `"\d"` in a normal string is fine today but `"\b"`
  is a backspace, not a word boundary. Make every pattern a raw string.
- **Calling `.group()` on `None`.** Check that the search succeeded first.
- **Over-matching.** `\d+` finds *every* number. Anchor it (`^`, `$`) or give
  it context (`#\d+`) so it matches only what you mean.
