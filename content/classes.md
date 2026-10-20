::: lesson m8-class

So far your data has lived in dicts, lists and tuples, and the functions that
work on that data have lived somewhere else. A `student` dict here, an
`average_grade(student)` function there. That works until you have twenty
functions that all expect the same dict shape, and nothing stops someone
passing the wrong one. A **class** bundles the data and the functions that
belong to it into one thing.

The mental model: a class is a **blueprint**. An **object** (or *instance*)
is one thing built from that blueprint. `Book` is the blueprint; `Book("Dune",
"Frank Herbert", 412)` is one specific book.

```python
class Book:
    def __init__(self, title, author, pages):
        self.title = title
        self.author = author
        self.pages = pages

dune = Book("Dune", "Frank Herbert", 412)
hobbit = Book("The Hobbit", "J. R. R. Tolkien", 310)

print(dune.title)
print(hobbit.pages)
print(type(dune))
```

Four things to notice:

- `class Book:` opens the blueprint. Class names use `CapWords` by convention.
- `__init__` (two underscores each side, "dunder init") is the **initialiser**.
  You never call it yourself — Python runs it for you every time you write
  `Book(...)`.
- `self` is the object being built. `self.title = title` stores the value *on
  that object*. These are **attributes**, and you read them back with a dot:
  `dune.title`.
- `__init__` does not `return` anything. Its job is to fill in attributes.

## Where `self` comes from

When you write `Book("Dune", "Frank Herbert", 412)`, Python creates an empty
`Book` object, then calls `__init__` with that object as the first argument and
your three values after it. So `__init__` has four parameters but you pass
three. Every method you write inside a class gets this same first parameter.

## Every object has its own attributes

Two objects built from the same blueprint do not share values. Change one and
the other is untouched.

```python
class Player:
    def __init__(self, name):
        self.name = name
        self.score = 0

ana = Player("Ana")
ben = Player("Ben")
ana.score = 15

print(ana.name, ana.score)
print(ben.name, ben.score)
```

`Ben 0` — his score never moved. Notice that `score` is not a parameter:
`__init__` can set any attributes it likes, including ones with a fixed
starting value.

## Objects in collections

An object is a value like any other, so it goes into lists and dicts, gets
passed to functions and comes back from them.

```python
class City:
    def __init__(self, name, population):
        self.name = name
        self.population = population

cities = [City("Lisbon", 545_000), City("Porto", 231_000), City("Braga", 193_000)]
total = sum(city.population for city in cities)

print(f"{len(cities)} cities, {total:,} people")
for city in cities:
    print(f"- {city.name}: {city.population:,}")
```

Compare this with a list of dicts: `city.name` instead of `city["name"]`, and a
typo like `city.nmae` raises `AttributeError` immediately instead of silently
creating a new key.

> [!warn]
> Inside `__init__`, `title = title` (without `self.`) creates a local variable
> that vanishes when `__init__` returns. The object ends up with no `title`
> attribute at all.

```python-error
class Book:
    def __init__(self, title):
        title = title        # forgot self.

b = Book("Dune")
print(b.title)
```

`AttributeError: 'Book' object has no attribute 'title'`. The fix is always the
same: `self.title = title`.

## Common mistakes

- **Leaving out `self` in the `def`.** `def __init__(title):` gives
  `TypeError: takes 1 positional argument but 2 were given` — the extra one is
  the object Python passes in.
- **Forgetting `self.` when storing.** See the warning above; the attribute is
  simply never created.
- **Reading attributes from the class instead of an object.** `Book.title`
  fails because `title` only exists on instances; you need `dune.title`.

::: lesson m8-methods

An attribute is what an object *has*. A **method** is what it can *do*. A
method is just a function defined inside the class whose first parameter is
`self` — the object it was called on.

```python
class BankAccount:
    def __init__(self, owner, balance=0):
        self.owner = owner
        self.balance = balance

    def deposit(self, amount):
        self.balance += amount

    def withdraw(self, amount):
        if amount > self.balance:
            print(f"Declined: {self.owner} only has {self.balance}")
            return False
        self.balance -= amount
        return True

acc = BankAccount("Mei", 100)
acc.deposit(50)
acc.withdraw(500)
acc.withdraw(30)
print(acc.balance)
```

`acc.deposit(50)` is shorthand for `BankAccount.deposit(acc, 50)`. The object
before the dot becomes `self`; you only pass the arguments after it.

## State that changes over time

This is the big difference from the functions you wrote in earlier modules. A
function forgets everything when it returns. An object *remembers*: each call
to `deposit` changes `self.balance`, and the next call to `withdraw` sees the
new value. The object carries its state from one call to the next.

That is what classes are for. If nothing needs remembering, a function is
enough.

## Methods calling methods

Inside the class, one method calls another through `self.`:

```python
class Thermostat:
    def __init__(self, target):
        self.target = target
        self.history = []

    def set_target(self, degrees):
        self.target = degrees
        self.log(f"target -> {degrees}")

    def log(self, message):
        self.history.append(message)

    def summary(self):
        return f"{self.target}°C after {len(self.history)} changes"

t = Thermostat(20)
t.set_target(22)
t.set_target(19)
print(t.summary())
print(t.history)
```

Plain `log(...)` inside `set_target` would be a `NameError` — methods are not
in scope as bare names. It has to be `self.log(...)`.

## Return a value or change the object — know which

Look back at `BankAccount`. `deposit` changes the object and returns nothing
(so it returns `None`, like `list.append`). `summary` in `Thermostat` returns a
value and changes nothing. `withdraw` changes the object *and* returns a
`True`/`False` status so the caller can react. All three are fine; the trap is
expecting a value from a method that only changes the object.

Some classes deliberately `return self` from every mutating method so calls
can be chained. pandas does this everywhere:

```python
class Query:
    def __init__(self, table):
        self.table = table
        self.parts = []

    def where(self, condition):
        self.parts.append(f"WHERE {condition}")
        return self

    def limit(self, n):
        self.parts.append(f"LIMIT {n}")
        return self

    def build(self):
        return " ".join([f"SELECT * FROM {self.table}"] + self.parts)

print(Query("orders").where("total > 100").limit(5).build())
```

Each method hands back the same object, so the next `.` has something to work
on. Without `return self`, chaining breaks:

```python-error
class Tally:
    def __init__(self):
        self.total = 0

    def add(self, n):
        self.total += n

t = Tally()
t.add(5).add(3)
```

`AttributeError: 'NoneType' object has no attribute 'add'` — `t.add(5)`
returned `None`, and the second `.add` was called on that.

## Common mistakes

- **Forgetting `self` in a method's `def`.** `def deposit(amount):` fails with
  `takes 1 positional argument but 2 were given`.
- **Using a local variable instead of an attribute.** `balance += amount`
  inside a method is an `UnboundLocalError` or, worse, silently changes a
  copy. State lives on `self.balance`.
- **Calling a method without parentheses.** `acc.deposit` without `(50)` does
  nothing — it is the method object, not a call.

::: lesson m8-dunder

Print an object from your own class and you get
`<__main__.Book object at 0x7f...>`. Compare two books with the same title and
you get `False`. Python does not know what your object *means* — but you can
tell it, by defining **dunder methods** (double-underscore, like `__init__`).
Python calls them for you behind `print`, `==`, `len()`, `sorted()` and `+`.

## Printable objects: `__repr__` and `__str__`

```python
class Book:
    def __init__(self, title, pages):
        self.title = title
        self.pages = pages

    def __repr__(self):
        return f"Book({self.title!r}, {self.pages})"

    def __str__(self):
        return f"{self.title} ({self.pages} pages)"

dune = Book("Dune", 412)
print(dune)
print(repr(dune))
print([dune, Book("Emma", 474)])
```

`__str__` is for people: `print` and f-strings use it. `__repr__` is for
developers: it should be unambiguous, ideally the code that would recreate the
object. Containers use `__repr__` for their items, which is why the list
prints `Book('Dune', 412)`. The `!r` in the f-string means "use the repr of
this value", which is how the title gets its quotes.

If you define only `__repr__`, `print` falls back to it. So the rule is: always
write `__repr__`; add `__str__` only when you want a friendlier display.

## Comparing and adding: `__eq__` and `__add__`

```python
class Money:
    def __init__(self, amount, currency):
        self.amount = amount
        self.currency = currency

    def __repr__(self):
        return f"Money({self.amount}, {self.currency!r})"

    def __eq__(self, other):
        return self.amount == other.amount and self.currency == other.currency

    def __add__(self, other):
        if self.currency != other.currency:
            raise ValueError("cannot add different currencies")
        return Money(self.amount + other.amount, self.currency)

a = Money(10, "EUR")
b = Money(10, "EUR")
print(a == b)
print(a is b)
print(a + Money(2.5, "EUR"))
```

Without `__eq__`, `==` falls back to `is` — "are these the same object in
memory?" — so `a == b` would be `False`. With it, `!=` works too; Python
derives it for you. `__add__` returns a **new** object and leaves both operands
alone, which is exactly how `+` behaves on numbers and strings.

## Size, membership and ordering: `__len__`, `__contains__`, `__lt__`

```python
class Song:
    def __init__(self, title, seconds):
        self.title = title
        self.seconds = seconds

    def __repr__(self):
        return f"Song({self.title!r}, {self.seconds})"

    def __lt__(self, other):
        return self.seconds < other.seconds


class Playlist:
    def __init__(self):
        self.songs = []

    def add(self, song):
        self.songs.append(song)

    def __len__(self):
        return len(self.songs)

    def __contains__(self, title):
        return any(song.title == title for song in self.songs)

p = Playlist()
p.add(Song("Blue Train", 643))
p.add(Song("So What", 562))
p.add(Song("Naima", 261))
print(len(p))
print("Naima" in p, "Giant Steps" in p)
print(sorted(p.songs))
print(min(p.songs))
```

`__lt__` ("less than") is the only comparison `sorted`, `min` and `max` need.
Here is the full map of what you write and what Python calls:

| you write | Python calls |
| --- | --- |
| `print(x)` | `x.__str__()`, falling back to `x.__repr__()` |
| `x == y` | `x.__eq__(y)` |
| `x < y` | `x.__lt__(y)` |
| `x + y` | `x.__add__(y)` |
| `len(x)` | `x.__len__()` |
| `item in x` | `x.__contains__(item)` |

> [!warn]
> Once you define `__eq__`, Python stops letting your objects be dict keys or
> set members (they become *unhashable*) unless you also define `__hash__`.
> That is deliberate: equal things must hash the same. Dataclasses, later in
> this module, handle this for you.

## Common mistakes

- **Printing inside `__repr__` instead of returning.** You get `TypeError:
  __repr__ returned non-string (type NoneType)`. Build the string and
  `return` it.
- **Changing `self` inside `__add__`.** `a + b` should give a new object;
  mutating `a` surprises everyone, including you.
- **`__eq__` that assumes `other` is the same type.** `Money(1, "EUR") == 5`
  raises `AttributeError`. Returning `NotImplemented` when
  `not isinstance(other, Money)` makes Python fall back gracefully.

::: lesson m8-inheritance

Sometimes a new class is "an existing class, plus a bit more". A `Manager` is
an `Employee` with a team. Rather than copying `Employee`'s code, you
**inherit** it: the new class gets everything the old one has, then adds or
changes what it needs.

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def describe(self):
        return f"{self.name} earns {self.salary:,}"


class Manager(Employee):
    def __init__(self, name, salary, team):
        super().__init__(name, salary)
        self.team = team

    def describe(self):
        return f"{self.name} manages {len(self.team)} people"

ravi = Employee("Ravi", 48_000)
dana = Manager("Dana", 72_000, ["Ravi", "Mei"])
print(ravi.describe())
print(dana.describe())
print(dana.salary)
```

`class Manager(Employee)` makes `Manager` a **subclass** (child) of `Employee`
(the parent, or base class). Three things happen:

- `Manager` inherits every method of `Employee`. `dana.salary` works even
  though `Manager` never mentions `salary` — the parent's `__init__` stored it.
- `super().__init__(name, salary)` runs the parent's `__init__` on the *same*
  object. Then the child adds `self.team`. `super()` means "the parent class,
  bound to this object", so you do not pass `self` again.
- Defining `describe` again in `Manager` **overrides** the parent's version.
  Python looks for a method on the child first, then the parent.

## Calling the parent's version from an override

Often the child wants to do what the parent does *and then* something extra.
`super()` lets you call the overridden method instead of copying it:

```python
class Account:
    def __init__(self, owner, balance):
        self.owner = owner
        self.balance = balance

    def withdraw(self, amount):
        if amount > self.balance:
            return False
        self.balance -= amount
        return True


class SavingsAccount(Account):
    MINIMUM = 100

    def withdraw(self, amount):
        if self.balance - amount < self.MINIMUM:
            print(f"Declined: must keep {self.MINIMUM} in savings")
            return False
        return super().withdraw(amount)

s = SavingsAccount("Luis", 500)
print(s.withdraw(450))
print(s.withdraw(300))
print(s.balance)
```

`SavingsAccount` adds one rule and then hands the real work back to
`Account.withdraw`. If the parent's logic changes, the child picks it up.

## Polymorphism and `isinstance`

A list of mixed employees needs no special handling: each object answers with
its own version of the method.

```python
class Employee:
    def __init__(self, name, salary):
        self.name = name
        self.salary = salary

    def annual_cost(self):
        return self.salary * 1.2       # salary plus overheads


class Contractor(Employee):
    def annual_cost(self):
        return self.salary              # no overheads

staff = [Employee("Ravi", 48_000), Contractor("Lee", 40_000)]
for person in staff:
    print(f"{person.name}: {person.annual_cost():,.0f}")

lee = staff[1]
print(isinstance(lee, Contractor), isinstance(lee, Employee))
print([cls.__name__ for cls in Contractor.__mro__])
```

`isinstance(lee, Employee)` is `True`: a contractor *is an* employee. The last
line shows the **method resolution order** — where Python looks for a method,
in order: `Contractor`, then `Employee`, then `object`, the root of every
class.

## When inheritance fits

Ask "is a `Manager` an `Employee`?" Yes — inherit. "Is a `Car` an `Engine`?"
No — a car *has* an engine, which is composition (the last lesson of this
module). Inheriting just to reuse a few methods, without a genuine is-a
relationship, makes code that is hard to follow.

> [!warn]
> A child `__init__` that forgets `super().__init__(...)` produces objects
> missing the parent's attributes. The error appears later, far from the cause.

```python-error
class Employee:
    def __init__(self, name):
        self.name = name


class Manager(Employee):
    def __init__(self, name, team):
        self.team = team     # forgot super().__init__(name)

print(Manager("Dana", []).name)
```

## Common mistakes

- **Skipping `super().__init__`.** See above; `name` is never stored.
- **Passing `self` to `super()`.** `super().__init__(self, name)` sends one
  argument too many. `super()` already knows which object it is bound to.
- **Inheriting for convenience.** `class Library(list)` gives you forty
  methods you did not ask for. Hold a list instead.

::: lesson m8-properties

Three more tools make classes nicer to use: **class attributes** shared by
every instance, **properties** that look like attributes but are computed on
demand, and **classmethods** and **staticmethods** — functions that belong to
the class rather than to one object.

## Class attributes

Everything you have stored so far went on `self`, so each object had its own
copy. A value set directly in the class body is shared by all of them.

```python
class Employee:
    company = "Northwind"     # class attribute: one value, shared
    headcount = 0

    def __init__(self, name):
        self.name = name      # instance attribute: one per object
        Employee.headcount += 1

ravi = Employee("Ravi")
mei = Employee("Mei")
print(ravi.company, mei.company)
print(Employee.headcount)

Employee.company = "Northwind Traders"
print(ravi.company)
```

When you read `ravi.company`, Python looks on the object first, then on the
class. Class attributes are the right place for constants (`MINIMUM = 100`)
and counters that span every instance. Write to them through the class name
(`Employee.headcount += 1`); writing `self.headcount += 1` would quietly create
a per-object copy and the shared count would never move.

## `@property`: a computed attribute

A `Circle` has a radius and an area. Storing both means they can drift apart.
A property computes the area every time it is read, so it is never stale.

```python
import math

class Circle:
    def __init__(self, radius):
        self.radius = radius          # this goes through the setter below

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError("radius must be positive")
        self._radius = value

    @property
    def area(self):
        return math.pi * self._radius ** 2

c = Circle(2)
print(round(c.area, 2))
c.radius = 3
print(round(c.area, 2))
try:
    c.radius = -1
except ValueError as e:
    print("Refused:", e)
```

Two patterns are in that one class:

- `area` is a **read-only computed property**. You read `c.area` with no
  parentheses; assigning to it raises `AttributeError`.
- `radius` is a **validated attribute**. The real value lives in `_radius`
  (the leading underscore means "internal, don't touch"); `c.radius = 3`
  runs the setter, which checks the value first. Even `__init__` goes through
  it, so a bad radius is rejected at construction.

```python-error
import math

class Circle:
    def __init__(self, radius):
        self.radius = radius

    @property
    def area(self):
        return math.pi * self.radius ** 2

c = Circle(2)
c.area = 50
```

`AttributeError: property 'area' of 'Circle' object has no setter`. That is a
feature — a derived value cannot be set to something inconsistent.

## `@classmethod` and `@staticmethod`

```python
class Temperature:
    def __init__(self, celsius):
        self.celsius = celsius

    @classmethod
    def from_fahrenheit(cls, f):
        return cls((f - 32) * 5 / 9)

    @staticmethod
    def is_freezing(celsius):
        return celsius <= 0

boiling = Temperature.from_fahrenheit(212)
print(boiling.celsius)
print(Temperature.is_freezing(-3), Temperature.is_freezing(12))
```

A **classmethod** receives the *class* as its first argument (`cls`, not
`self`), so it can build new objects. That makes it the standard way to write
an alternative constructor — `dict.fromkeys`, `datetime.fromisoformat` and
`pd.DataFrame.from_records` are all classmethods. A **staticmethod** receives
neither: it is a plain function parked inside the class because it belongs
there conceptually.

## Common mistakes

- **Calling a property.** `c.area()` gives `TypeError: 'float' object is not
  callable` — the property already returned the number.
- **A setter that assigns to its own name.** `self.radius = value` *inside*
  the `radius` setter calls the setter again, forever: `RecursionError`. Store
  in `self._radius`.
- **A mutable class attribute.** `tags = []` in the class body is one list
  shared by every object; `self.tags.append(...)` on one shows up on all.
  Create lists in `__init__`.

::: lesson m8-dataclasses

Most classes you write are "a bundle of fields with a few methods". A
`Product` has a name, a price and a quantity. Writing `__init__`, `__repr__`
and `__eq__` for every such class is fifteen lines of boilerplate that all
look the same. `@dataclass` writes them for you from the list of fields.

```python
from dataclasses import dataclass

@dataclass
class Product:
    name: str
    price: float
    quantity: int = 0

p = Product("Notebook", 3.5, 12)
print(p)
print(p == Product("Notebook", 3.5, 12))
print(p.price * p.quantity)
```

Each field is declared with a **type annotation** — the `: str` part. That is
how `@dataclass` knows it is a field; a bare `quantity = 0` would be an
ordinary class attribute and not appear in `__init__`. Defaults go after
fields without defaults, just like function parameters. The annotations are
not enforced: `Product(3.5, "Notebook")` still constructs. They are
documentation, and tools like editors and type checkers read them.

Here is what the decorator saved you from writing:

```python-static
class Product:
    def __init__(self, name, price, quantity=0):
        self.name = name
        self.price = price
        self.quantity = quantity

    def __repr__(self):
        return f"Product(name={self.name!r}, price={self.price!r}, quantity={self.quantity!r})"

    def __eq__(self, other):
        if not isinstance(other, Product):
            return NotImplemented
        return (self.name, self.price, self.quantity) == (other.name, other.price, other.quantity)
```

Same behaviour, and the hand-written version will drift the first time
someone adds a field and forgets to update `__repr__`.

## Mutable defaults need `field(default_factory=...)`

A list default is the same trap as a list default argument in a function:
one list, shared by every object. `@dataclass` refuses to let you do it.

```python-error
from dataclasses import dataclass

@dataclass
class Order:
    customer: str
    items: list = []
```

`ValueError: mutable default <class 'list'> for field items is not allowed:
use default_factory`. The fix is a *factory* — a function that builds a fresh
default for each new object:

```python
from dataclasses import dataclass, field

@dataclass
class Order:
    customer: str
    items: list = field(default_factory=list)

    def add(self, name, price):
        self.items.append((name, price))

    def total(self):
        return sum(price for _, price in self.items)

a = Order("Ana")
b = Order("Ben")
a.add("Notebook", 3.5)
a.add("Pen", 1.2)
print(a.total(), b.items)
print(a)
```

Methods work exactly as in a normal class. `b.items` is still empty because
`list` was called once for `a` and once again for `b`.

## `frozen`, `order` and `asdict`

```python
from dataclasses import dataclass, asdict

@dataclass(frozen=True, order=True)
class Version:
    major: int
    minor: int

releases = [Version(2, 1), Version(1, 9), Version(2, 0)]
print(sorted(releases))
print(max(releases))
print(asdict(Version(3, 0)))
try:
    releases[0].major = 5
except AttributeError as e:
    print("Refused:", type(e).__name__)
```

- `frozen=True` makes instances immutable: assigning raises
  `FrozenInstanceError` (a kind of `AttributeError`). Frozen objects are
  hashable, so they can be set members and dict keys.
- `order=True` generates `__lt__` and friends, comparing field by field in
  declaration order — `major` first, then `minor`.
- `asdict` turns the object into a plain dict, ready for `json.dumps` or a
  pandas `DataFrame`.

## Common mistakes

- **Forgetting the annotation.** `name = "unknown"` without `: str` is not a
  field; `Product("Notebook")` then fails with an argument-count error.
- **`items: list = []`.** `ValueError` at class-definition time. Use
  `field(default_factory=list)` (or `dict`, or your own function).
- **Expecting type checks.** `@dataclass` never validates types at runtime.
  If you need validation, add a `__post_init__` method — it runs right after
  the generated `__init__`.

::: lesson m8-design

You now have every tool in the box. The hard part is choosing. This lesson is
three guidelines and one worked example.

## Composition: "has-a" beats "is-a"

A library is not a kind of book, and not a kind of list. It *holds* books.
Give it a list attribute and a small set of methods that say exactly what a
library can do.

```python
class Book:
    def __init__(self, title, author):
        self.title = title
        self.author = author
        self.checked_out = False

    def __repr__(self):
        return f"Book({self.title!r})"


class Library:
    def __init__(self):
        self.books = []

    def add(self, book):
        self.books.append(book)

    def available(self):
        return [book for book in self.books if not book.checked_out]

    def checkout(self, title):
        for book in self.books:
            if book.title == title and not book.checked_out:
                book.checked_out = True
                return True
        return False

lib = Library()
lib.add(Book("Dune", "Frank Herbert"))
lib.add(Book("Emma", "Jane Austen"))
print(lib.checkout("Dune"), lib.checkout("Dune"))
print(lib.available())
```

`class Library(list)` would have worked too, and it is the wrong call: it
exposes `.pop`, `.sort`, `.insert` and forty other methods that let anyone
bypass `add`. Composition keeps the surface small. The same rule covers `Car`
and `Engine`, `Order` and `OrderLine`, `Team` and `Player`.

## Duck typing: "if it has `.area()`, it is a shape"

Python does not need a `Shape` base class for this to work:

```python
import math

class Circle:
    def __init__(self, radius):
        self.radius = radius

    def area(self):
        return math.pi * self.radius ** 2


class Rect:
    def __init__(self, width, height):
        self.width = width
        self.height = height

    def area(self):
        return self.width * self.height


def total_area(shapes):
    return sum(shape.area() for shape in shapes)

print(round(total_area([Circle(1), Rect(2, 3), Rect(1, 1)]), 2))
```

`total_area` never asks what type a shape is. Anything with an `.area()`
method works, including a class written next year by someone who has never
seen this file. "If it walks like a duck and quacks like a duck…" This is how
`len()`, `for` and `sorted()` already treat your classes through dunder
methods. Reach for `isinstance` only when behaviour genuinely has to branch on
type — and if you find yourself writing an `if isinstance … elif isinstance …`
ladder, that is usually a method each class should implement.

## When a class is the wrong tool

- **Data with no behaviour** — a dict, a tuple or a tiny `@dataclass`.
- **One function, no state** — a function. `class Formatter` with a single
  `format` method and nothing in `__init__` is a function wearing a costume.
- **State that lives for one call** — a function with local variables.

A class earns its place when there is state that changes *and* several
operations on that state that must stay consistent.

## A worked example: shop inventory

The brief: products have a sku, a name and a price; the shop receives stock and
sells it; selling more than is in stock must fail loudly; we need the total
stock value and a low-stock list.

Decisions, in order: a `Product` is pure data that never changes, so it is a
frozen dataclass. Quantities are *not* on `Product` — the same product could sit
in two warehouses — so `Inventory` owns them in a dict keyed by sku
(composition). `sell` raises instead of returning `False`, so a caller cannot
forget to check.

```python
from dataclasses import dataclass

@dataclass(frozen=True)
class Product:
    sku: str
    name: str
    price: float


class Inventory:
    def __init__(self):
        self.products = {}     # sku -> Product
        self.stock = {}        # sku -> quantity

    def receive(self, product, qty):
        self.products[product.sku] = product
        self.stock[product.sku] = self.stock.get(product.sku, 0) + qty

    def sell(self, sku, qty):
        have = self.stock.get(sku, 0)
        if have < qty:
            raise ValueError(f"only {have} of {sku} in stock")
        self.stock[sku] -= qty
        return self.products[sku].price * qty

    def value(self):
        return sum(self.products[sku].price * qty for sku, qty in self.stock.items())

    def low_stock(self, threshold=5):
        return [self.products[sku].name for sku, qty in self.stock.items() if qty < threshold]

inv = Inventory()
inv.receive(Product("NB-01", "Notebook", 3.5), 20)
inv.receive(Product("PN-02", "Pen", 1.2), 4)
print(inv.sell("NB-01", 5))
print(inv.value())
print(inv.low_stock())
try:
    inv.sell("PN-02", 10)
except ValueError as e:
    print("Error:", e)
```

Two small classes, each with one job, and every rule of the brief lives in
exactly one place.

## Common mistakes

- **Subclassing `list` or `dict` to get methods for free.** You also get
  every way of corrupting the data. Hold the collection instead.
- **One class that does everything.** If a class has twenty methods about
  three different things, it is three classes.
- **`isinstance` ladders.** Give each class the method and let the object
  decide.
