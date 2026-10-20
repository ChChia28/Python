/* Module 8 — Classes and Objects --------------------------------------- */

export default {
  id: "classes",
  number: 8,
  title: "Classes and Objects",
  level: "Advanced",
  summary:
    "Model things with classes: attributes and methods, the dunder methods that make objects print, compare and sort, inheritance, properties, dataclasses — and when a class is the wrong tool.",
  packages: [],
  lessons: [
    {
      id: "m8-class",
      title: "Classes and __init__",
      goal: "Define a class with __init__, build several objects from it, and store per-object attributes on self.",
      keywords: ["class", "object", "instance", "__init__", "self", "attribute", "blueprint"],
      exercises: [
        {
          id: "m8-class-e1",
          prompt:
            "Define a class `Book` whose `__init__` takes `title`, `author` and `pages` (in that order) and stores each one as an attribute with the **same name**. Then create `dune = Book(\"Dune\", \"Frank Herbert\", 412)`.",
          starter: "class Book:\n    def __init__(self, title, author, pages):\n        pass\n\n# create dune here\n",
          solution:
            "class Book:\n    def __init__(self, title, author, pages):\n        self.title = title\n        self.author = author\n        self.pages = pages\n\ndune = Book(\"Dune\", \"Frank Herbert\", 412)",
          hints: [
            "Inside `__init__`, `self` is the object being built. Store a value on it with `self.name = value`.",
            "You need three lines in `__init__`, one per attribute: `self.title = title`, and so on.",
            "Creating the object looks like calling a function: `dune = Book(\"Dune\", \"Frank Herbert\", 412)` — you pass three values, not four.",
          ],
          tests:
            "assert 'Book' in dir(), 'Define a class called Book'\nb = Book('Emma', 'Jane Austen', 474)\nassert hasattr(b, 'title'), 'A Book should have a title attribute — did you write self.title = title?'\nassert b.title == 'Emma', f\"Book('Emma', ...).title should be 'Emma', got {b.title!r}\"\nassert b.author == 'Jane Austen', f\"the author attribute should be 'Jane Austen', got {getattr(b, 'author', None)!r}\"\nassert b.pages == 474, f\"the pages attribute should be 474, got {getattr(b, 'pages', None)!r}\"\nassert 'dune' in dir(), 'Create a Book called dune'\nassert isinstance(dune, Book), 'dune should be a Book object'\nassert dune.title == 'Dune' and dune.author == 'Frank Herbert' and dune.pages == 412, 'dune should be Book(\"Dune\", \"Frank Herbert\", 412)'",
          wrong: [
            "class Book:\n    def __init__(self, title, author, pages):\n        title = title\n        author = author\n        pages = pages\n\ndune = Book(\"Dune\", \"Frank Herbert\", 412)",
            "class Book:\n    def __init__(self, title, author, pages):\n        self.title = title\n        self.author = author\n        self.pages = pages\n\ndune = Book(\"Dune\", \"Frank Herbert\")",
          ],
        },
        {
          id: "m8-class-e2",
          prompt:
            "Define a class `Player`. `__init__` takes just a `name`. Every new player starts with `score` equal to `0` and `badges` equal to an **empty list** — and each player must get their **own** list, so adding a badge to one player never shows up on another.",
          starter: "class Player:\n    pass\n",
          solution:
            "class Player:\n    def __init__(self, name):\n        self.name = name\n        self.score = 0\n        self.badges = []",
          hints: [
            "`__init__` can set attributes that are not parameters: `self.score = 0`.",
            "Create the list inside `__init__` with `self.badges = []` — a fresh list is made every time a Player is built.",
            "A `badges = []` line in the class body (outside `__init__`) is one list shared by every player. That is the trap.",
          ],
          tests:
            "assert 'Player' in dir(), 'Define a class called Player'\ntry:\n    ana = Player('Ana')\n    ben = Player('Ben')\nexcept TypeError:\n    raise AssertionError(\"Player('Ana') should work — write an __init__(self, name) that takes just the name\")\nassert ana.name == 'Ana', f\"Player('Ana').name should be 'Ana', got {getattr(ana, 'name', None)!r}\"\nassert ana.score == 0, f'a new Player should have score 0, got {getattr(ana, \"score\", None)!r}'\nassert ana.badges == [], f'a new Player should have an empty badges list, got {getattr(ana, \"badges\", None)!r}'\nana.score = 15\nassert ben.score == 0, 'each Player needs its own score: changing ana.score must not change ben.score'\nana.badges.append('first win')\nassert ben.badges == [], 'each Player needs its own badges list — create it inside __init__ with self.badges = [], not in the class body'\nassert ana.badges == ['first win'], 'ana.badges should hold the badge that was appended'",
          wrong: [
            "class Player:\n    badges = []\n\n    def __init__(self, name):\n        self.name = name\n        self.score = 0",
            "class Player:\n    def __init__(self, name, score, badges):\n        self.name = name\n        self.score = score\n        self.badges = badges",
          ],
        },
      ],
      quiz: [
        {
          q: "`__init__` is written as `def __init__(self, title, author, pages)`. How many values do you pass when you write `Book(...)`?",
          options: [
            "Four — one for self, then the three others",
            "Three — Python supplies self",
            "None — __init__ is called separately",
            "It depends on the class name",
          ],
          answer: 1,
          explain:
            "Python creates the object and passes it as self automatically. You only supply the values after self: Book(\"Dune\", \"Frank Herbert\", 412).",
        },
        {
          q: "Inside `__init__`, what does the line `title = title` (without `self.`) do?",
          options: [
            "Stores title on the object, same as self.title = title",
            "Creates a local variable that disappears when __init__ returns — the object gets no title attribute",
            "Raises a SyntaxError",
            "Makes title a class attribute shared by all books",
          ],
          answer: 1,
          explain:
            "Attributes live on self. A bare name inside a function is a local variable, so the object ends up with no title and a later dune.title raises AttributeError.",
        },
      ],
    },

    {
      id: "m8-methods",
      title: "Methods and self",
      goal: "Write methods that read and change an object's state, call each other through self, and know when to return a value.",
      keywords: ["method", "self", "state", "return self", "chaining", "None"],
      exercises: [
        {
          id: "m8-methods-e1",
          prompt:
            "Define a class `BankAccount`. `__init__` takes an `owner` and stores it; the `balance` starts at `0`. Add two methods:\n\n- `deposit(amount)` adds `amount` to the balance.\n- `withdraw(amount)` subtracts `amount` and returns `True` — **unless** `amount` is more than the balance, in which case it leaves the balance unchanged and returns `False`.",
          starter:
            "class BankAccount:\n    def __init__(self, owner):\n        self.owner = owner\n        self.balance = 0\n\n    def deposit(self, amount):\n        pass\n\n    def withdraw(self, amount):\n        pass\n",
          solution:
            "class BankAccount:\n    def __init__(self, owner):\n        self.owner = owner\n        self.balance = 0\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            return False\n        self.balance -= amount\n        return True",
          hints: [
            "The state lives on the object: `self.balance += amount` changes it for every later call.",
            "In `withdraw`, check `if amount > self.balance:` first and `return False` before touching the balance.",
            "Remember the `return True` at the end of the successful path — a method with no return gives back None.",
          ],
          tests:
            "assert 'BankAccount' in dir(), 'Define a class called BankAccount'\nacc = BankAccount('Mei')\nassert acc.owner == 'Mei', \"BankAccount('Mei').owner should be 'Mei'\"\nassert acc.balance == 0, f'a new account should have balance 0, got {acc.balance!r}'\nacc.deposit(50)\nassert acc.balance == 50, f'after deposit(50) the balance should be 50, got {acc.balance!r}'\nresult = acc.withdraw(80)\nassert result is False, f'withdraw(80) on a balance of 50 should return False, got {result!r}'\nassert acc.balance == 50, f'a refused withdrawal must leave the balance unchanged (expected 50, got {acc.balance!r})'\nresult = acc.withdraw(20)\nassert result is True, f'withdraw(20) on a balance of 50 should return True, got {result!r}'\nassert acc.balance == 30, f'after withdraw(20) the balance should be 30, got {acc.balance!r}'\nacc.deposit(5)\nassert acc.withdraw(35) is True, 'withdrawing exactly the balance should be allowed'\nassert acc.balance == 0, 'after withdrawing everything the balance should be 0'",
          wrong: [
            "class BankAccount:\n    def __init__(self, owner):\n        self.owner = owner\n        self.balance = 0\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def withdraw(self, amount):\n        self.balance -= amount\n        return True",
            "class BankAccount:\n    def __init__(self, owner):\n        self.owner = owner\n        self.balance = 0\n\n    def deposit(self, amount):\n        self.balance += amount\n\n    def withdraw(self, amount):\n        if amount > self.balance:\n            return False\n        self.balance -= amount",
          ],
        },
        {
          id: "m8-methods-e2",
          prompt:
            "Define a class `Cart` with no `__init__` arguments. Give it three methods:\n\n- `add(name, price)` records the item and **returns `self`**, so calls can be chained: `cart.add(\"Pen\", 1.5).add(\"Notebook\", 4.0)`.\n- `total()` returns the sum of all prices.\n- `most_expensive()` returns the **name** of the priciest item, or `None` if the cart is empty.",
          starter:
            "class Cart:\n    def __init__(self):\n        self.items = []\n\n    def add(self, name, price):\n        self.items.append((name, price))\n\n    def total(self):\n        pass\n\n    def most_expensive(self):\n        pass\n",
          solution:
            "class Cart:\n    def __init__(self):\n        self.items = []\n\n    def add(self, name, price):\n        self.items.append((name, price))\n        return self\n\n    def total(self):\n        return sum(price for name, price in self.items)\n\n    def most_expensive(self):\n        if not self.items:\n            return None\n        name, price = max(self.items, key=lambda item: item[1])\n        return name",
          hints: [
            "Chaining only works if `add` ends with `return self` — otherwise the second `.add` is called on None.",
            "`total` can be `sum(price for name, price in self.items)`.",
            "For `most_expensive`, check for an empty list first, then use `max(self.items, key=lambda item: item[1])` and return its name.",
          ],
          tests:
            "assert 'Cart' in dir(), 'Define a class called Cart'\ncart = Cart()\nassert cart.total() == 0, f'an empty cart should have total 0, got {cart.total()!r}'\nassert cart.most_expensive() is None, 'most_expensive() on an empty cart should return None'\nreturned = cart.add('Pen', 1.5)\nassert returned is cart, 'add() should return self so that calls can be chained'\ncart.add('Notebook', 4.0).add('Stapler', 2.25)\nassert cart.total() == 7.75, f'after adding 1.5, 4.0 and 2.25 the total should be 7.75, got {cart.total()!r}'\nassert cart.most_expensive() == 'Notebook', f\"most_expensive() should return the name 'Notebook', got {cart.most_expensive()!r}\"\nother = Cart()\nassert other.total() == 0, 'each Cart should keep its own items'",
          wrong: [
            "class Cart:\n    def __init__(self):\n        self.items = []\n\n    def add(self, name, price):\n        self.items.append((name, price))\n\n    def total(self):\n        return sum(price for name, price in self.items)\n\n    def most_expensive(self):\n        if not self.items:\n            return None\n        return max(self.items, key=lambda item: item[1])[0]",
            "class Cart:\n    def __init__(self):\n        self.items = []\n\n    def add(self, name, price):\n        self.items.append((name, price))\n        return self\n\n    def total(self):\n        return sum(price for name, price in self.items)\n\n    def most_expensive(self):\n        return max(self.items, key=lambda item: item[1])",
          ],
        },
      ],
      quiz: [
        {
          q: "`add` is defined as `def add(self, n): self.total += n` with no return. After `t = Tally()` and `result = t.add(5)`, what is `result`?",
          options: ["5", "The Tally object t", "None", "An error"],
          answer: 2,
          explain:
            "A method with no return statement returns None, exactly like a function. The object was changed, but the call itself gives back nothing — which is why t.add(5).add(3) fails.",
        },
        {
          q: "Inside a method, how do you call another method `log` of the same object?",
          options: ["log(\"message\")", "self.log(\"message\")", "this.log(\"message\")", "Tally.log(\"message\")"],
          answer: 1,
          explain:
            "Methods are not in scope as bare names; you reach them through the object, which inside the class is self. Calling through the class name would require passing self explicitly.",
        },
      ],
    },

    {
      id: "m8-dunder",
      title: "__repr__, __str__, __eq__ and friends",
      goal: "Make your objects print nicely, compare by value, support + and sort correctly by defining dunder methods.",
      keywords: ["__repr__", "__str__", "__eq__", "__lt__", "__add__", "__len__", "__contains__", "dunder", "magic methods"],
      exercises: [
        {
          id: "m8-dunder-e1",
          prompt:
            "Define a class `Point` with `__init__(self, x, y)`. Add:\n\n- `__repr__` returning exactly `Point(3, 4)` for `Point(3, 4)` — the class name, then the two numbers separated by a comma and a space.\n- `__eq__` so that two points with the same `x` and `y` are equal.",
          starter: "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n",
          solution:
            "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __repr__(self):\n        return f\"Point({self.x}, {self.y})\"\n\n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y",
          hints: [
            "`__repr__` takes only `self` and must *return* a string — an f-string with `self.x` and `self.y` inside.",
            "`__eq__(self, other)` returns True when `self.x == other.x and self.y == other.y`.",
            "Without `__eq__`, `==` compares identity, so two separately created points are never equal.",
          ],
          tests:
            "assert 'Point' in dir(), 'Define a class called Point'\np = Point(3, 4)\nassert repr(p) == 'Point(3, 4)', f\"repr(Point(3, 4)) should be 'Point(3, 4)', got {repr(p)!r}\"\nassert str(Point(0, -2)) == 'Point(0, -2)', f\"str(Point(0, -2)) should be 'Point(0, -2)', got {str(Point(0, -2))!r}\"\nassert Point(1, 2) == Point(1, 2), 'two points with the same x and y should be equal — define __eq__'\nassert Point(1, 2) != Point(2, 1), 'Point(1, 2) and Point(2, 1) should not be equal'\nassert Point(1, 2) != Point(1, 3), 'Point(1, 2) and Point(1, 3) should not be equal'\nassert str([Point(1, 1)]) == '[Point(1, 1)]', 'a list of points should print using __repr__'",
          wrong: [
            "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __repr__(self):\n        return f\"Point(x={self.x}, y={self.y})\"\n\n    def __eq__(self, other):\n        return self.x == other.x and self.y == other.y",
            "class Point:\n    def __init__(self, x, y):\n        self.x = x\n        self.y = y\n\n    def __repr__(self):\n        return f\"Point({self.x}, {self.y})\"",
          ],
        },
        {
          id: "m8-dunder-e2",
          prompt:
            "Define a class `Money` with `__init__(self, amount, currency)`. Give it:\n\n- `__repr__` returning exactly `Money(10, 'EUR')` for `Money(10, \"EUR\")` — the currency in single quotes.\n- `__eq__`: equal when both amount and currency match.\n- `__add__`: returns a **new** `Money` with the amounts added (the originals must not change). If the currencies differ, raise `ValueError`.\n- `__lt__`: compare by amount, so a list of `Money` can be sorted.",
          starter: "class Money:\n    def __init__(self, amount, currency):\n        self.amount = amount\n        self.currency = currency\n",
          solution:
            "class Money:\n    def __init__(self, amount, currency):\n        self.amount = amount\n        self.currency = currency\n\n    def __repr__(self):\n        return f\"Money({self.amount}, {self.currency!r})\"\n\n    def __eq__(self, other):\n        return self.amount == other.amount and self.currency == other.currency\n\n    def __add__(self, other):\n        if self.currency != other.currency:\n            raise ValueError(\"cannot add different currencies\")\n        return Money(self.amount + other.amount, self.currency)\n\n    def __lt__(self, other):\n        return self.amount < other.amount",
          hints: [
            "`{self.currency!r}` in an f-string gives the repr of the string, which is what adds the quotes.",
            "`__add__` builds and returns `Money(self.amount + other.amount, self.currency)` — it never assigns to `self.amount`.",
            "`sorted` only needs `__lt__`: `return self.amount < other.amount`.",
          ],
          tests:
            "assert 'Money' in dir(), 'Define a class called Money'\na = Money(10, 'EUR')\nassert repr(a) == \"Money(10, 'EUR')\", f\"repr(Money(10, 'EUR')) should be \\\"Money(10, 'EUR')\\\", got {repr(a)!r}\"\nassert a == Money(10, 'EUR'), 'Money(10, \"EUR\") should equal another Money(10, \"EUR\") — define __eq__'\nassert a != Money(10, 'USD'), 'different currencies should not be equal'\nassert a != Money(11, 'EUR'), 'different amounts should not be equal'\nb = Money(2.5, 'EUR')\nc = a + b\nassert isinstance(c, Money), '__add__ should return a Money object'\nassert c == Money(12.5, 'EUR'), f\"Money(10, 'EUR') + Money(2.5, 'EUR') should be Money(12.5, 'EUR'), got {c!r}\"\nassert a.amount == 10 and b.amount == 2.5, '__add__ must return a new Money and leave the originals unchanged'\ntry:\n    a + Money(1, 'USD')\n    raise AssertionError('adding EUR to USD should raise ValueError')\nexcept ValueError:\n    pass\ncoins = [Money(5, 'EUR'), Money(2, 'EUR'), Money(9, 'EUR')]\nassert [m.amount for m in sorted(coins)] == [2, 5, 9], 'sorted() should order Money by amount — define __lt__'\nassert min(coins) == Money(2, 'EUR'), 'min() should find the smallest amount'",
          wrong: [
            "class Money:\n    def __init__(self, amount, currency):\n        self.amount = amount\n        self.currency = currency\n\n    def __repr__(self):\n        return f\"Money({self.amount}, {self.currency!r})\"\n\n    def __eq__(self, other):\n        return self.amount == other.amount and self.currency == other.currency\n\n    def __add__(self, other):\n        if self.currency != other.currency:\n            raise ValueError(\"cannot add different currencies\")\n        self.amount += other.amount\n        return self\n\n    def __lt__(self, other):\n        return self.amount < other.amount",
            "class Money:\n    def __init__(self, amount, currency):\n        self.amount = amount\n        self.currency = currency\n\n    def __repr__(self):\n        return f\"Money({self.amount}, {self.currency})\"\n\n    def __eq__(self, other):\n        return self.amount == other.amount and self.currency == other.currency\n\n    def __add__(self, other):\n        if self.currency != other.currency:\n            raise ValueError(\"cannot add different currencies\")\n        return Money(self.amount + other.amount, self.currency)\n\n    def __lt__(self, other):\n        return self.amount < other.amount",
          ],
        },
      ],
      quiz: [
        {
          q: "`Book` defines `__init__` but no `__eq__`. `a = Book(\"Dune\", 412)` and `b = Book(\"Dune\", 412)`. What is `a == b`?",
          options: ["True — the attributes match", "False — without __eq__, == compares identity", "An error", "None"],
          answer: 1,
          explain:
            "The default __eq__ asks \"are these the same object?\" and a and b are two separate objects. Define __eq__ to compare by value.",
        },
        {
          q: "Which single dunder method is enough for `sorted()`, `min()` and `max()` to work on your objects?",
          options: ["__eq__", "__lt__", "__len__", "__sort__"],
          answer: 1,
          explain:
            "Sorting only ever asks \"is this one less than that one?\". There is no __sort__; __eq__ and __len__ answer different questions.",
        },
      ],
    },

    {
      id: "m8-inheritance",
      title: "Inheritance and super()",
      goal: "Build a subclass that reuses a parent's code with super(), overrides what it needs, and passes isinstance checks.",
      keywords: ["inheritance", "subclass", "super", "override", "isinstance", "is-a", "mro"],
      exercises: [
        {
          id: "m8-inheritance-e1",
          prompt:
            "`Employee` is given. Define `Manager` as a **subclass** of `Employee`:\n\n- `__init__(self, name, salary, team)` — reuse the parent's `__init__` for `name` and `salary`, then store `team` (a list of names).\n- Override `describe()` to return `\"Dana manages 2 people\"` (the name, then `manages`, then the team size, then `people`).",
          starter:
            "class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def describe(self):\n        return f\"{self.name} earns {self.salary:,}\"\n\n\nclass Manager:\n    pass\n",
          solution:
            "class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def describe(self):\n        return f\"{self.name} earns {self.salary:,}\"\n\n\nclass Manager(Employee):\n    def __init__(self, name, salary, team):\n        super().__init__(name, salary)\n        self.team = team\n\n    def describe(self):\n        return f\"{self.name} manages {len(self.team)} people\"",
          hints: [
            "The parent goes in parentheses: `class Manager(Employee):`.",
            "Inside the child's `__init__`, call `super().__init__(name, salary)` first — no `self` in the call — then `self.team = team`.",
            "Defining `describe` again in `Manager` replaces the parent's version for managers only.",
          ],
          tests:
            "assert 'Manager' in dir(), 'Define a class called Manager'\nassert issubclass(Manager, Employee), 'Manager should inherit from Employee: class Manager(Employee)'\ndana = Manager('Dana', 72000, ['Ravi', 'Mei'])\nassert isinstance(dana, Employee), 'a Manager should also be an Employee'\nassert hasattr(dana, 'salary') and dana.salary == 72000, 'dana.salary should be 72000 — call super().__init__(name, salary) to store it'\nassert dana.name == 'Dana', \"dana.name should be 'Dana'\"\nassert dana.team == ['Ravi', 'Mei'], 'dana.team should be the list that was passed in'\nassert dana.describe() == 'Dana manages 2 people', f\"dana.describe() should be 'Dana manages 2 people', got {dana.describe()!r}\"\nsolo = Manager('Lee', 60000, [])\nassert solo.describe() == 'Lee manages 0 people', f\"got {solo.describe()!r}\"\nravi = Employee('Ravi', 48000)\nassert ravi.describe() == 'Ravi earns 48,000', 'Employee.describe() must keep working as before'\nassert not isinstance(ravi, Manager), 'a plain Employee is not a Manager'",
          wrong: [
            "class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def describe(self):\n        return f\"{self.name} earns {self.salary:,}\"\n\n\nclass Manager(Employee):\n    def __init__(self, name, salary, team):\n        self.team = team\n\n    def describe(self):\n        return f\"{self.name} manages {len(self.team)} people\"",
            "class Employee:\n    def __init__(self, name, salary):\n        self.name = name\n        self.salary = salary\n\n    def describe(self):\n        return f\"{self.name} earns {self.salary:,}\"\n\n\nclass Manager(Employee):\n    def __init__(self, name, salary, team):\n        super().__init__(name, salary)\n        self.team = team",
          ],
        },
        {
          id: "m8-inheritance-e2",
          prompt:
            "`Ticket` is given: it has an `event` and a `price`, and `cost()` returns the price. Define two subclasses:\n\n- `StudentTicket(Ticket)` — `cost()` returns **half** the normal cost.\n- `GroupTicket(Ticket)` — `__init__(self, event, price, people)`; `cost()` returns the normal cost times `people`, with **10% off** when `people` is 5 or more.\n\nUse `super()` in both subclasses rather than copying the parent's code.",
          starter:
            "class Ticket:\n    def __init__(self, event, price):\n        self.event = event\n        self.price = price\n\n    def cost(self):\n        return self.price\n\n\n# define StudentTicket and GroupTicket here\n",
          solution:
            "class Ticket:\n    def __init__(self, event, price):\n        self.event = event\n        self.price = price\n\n    def cost(self):\n        return self.price\n\n\nclass StudentTicket(Ticket):\n    def cost(self):\n        return super().cost() / 2\n\n\nclass GroupTicket(Ticket):\n    def __init__(self, event, price, people):\n        super().__init__(event, price)\n        self.people = people\n\n    def cost(self):\n        total = super().cost() * self.people\n        if self.people >= 5:\n            total *= 0.9\n        return total",
          hints: [
            "`StudentTicket` needs no `__init__` of its own — it inherits the parent's. Only `cost` changes: `return super().cost() / 2`.",
            "`GroupTicket.__init__` calls `super().__init__(event, price)` and then stores `self.people`.",
            "In `GroupTicket.cost`, compute `super().cost() * self.people`, then multiply by `0.9` if `self.people >= 5`.",
          ],
          requires: [{ re: "\\bsuper\\(\\)", msg: "Use super() to reuse the parent's code instead of copying it." }],
          tests:
            "assert 'StudentTicket' in dir() and 'GroupTicket' in dir(), 'Define both StudentTicket and GroupTicket'\nassert issubclass(StudentTicket, Ticket) and issubclass(GroupTicket, Ticket), 'both classes should inherit from Ticket'\ns = StudentTicket('Jazz Night', 40)\nassert s.event == 'Jazz Night', 'a StudentTicket should keep the event attribute'\nassert s.cost() == 20, f\"StudentTicket('Jazz Night', 40).cost() should be 20, got {s.cost()!r}\"\ng = GroupTicket('Jazz Night', 40, 3)\nassert g.event == 'Jazz Night' and g.price == 40, 'GroupTicket should store event and price via super().__init__'\nassert g.cost() == 120, f'GroupTicket(..., 40, 3).cost() should be 120, got {g.cost()!r}'\nbig = GroupTicket('Jazz Night', 40, 5)\nassert abs(big.cost() - 180) < 1e-9, f'5 people get 10% off: expected 180, got {big.cost()!r}'\nfour = GroupTicket('Jazz Night', 40, 4)\nassert four.cost() == 160, f'4 people get no discount: expected 160, got {four.cost()!r}'\ntickets = [Ticket('Jazz Night', 30), StudentTicket('Jazz Night', 30), GroupTicket('Jazz Night', 30, 2)]\nassert sum(t.cost() for t in tickets) == 105, 'mixed tickets should each use their own cost(): 30 + 15 + 60 = 105'",
          wrong: [
            "class Ticket:\n    def __init__(self, event, price):\n        self.event = event\n        self.price = price\n\n    def cost(self):\n        return self.price\n\n\nclass StudentTicket(Ticket):\n    def cost(self):\n        return super().cost() / 2\n\n\nclass GroupTicket(Ticket):\n    def __init__(self, event, price, people):\n        self.people = people\n        self.price = price\n\n    def cost(self):\n        total = super().cost() * self.people\n        if self.people >= 5:\n            total *= 0.9\n        return total",
            "class Ticket:\n    def __init__(self, event, price):\n        self.event = event\n        self.price = price\n\n    def cost(self):\n        return self.price\n\n\nclass StudentTicket(Ticket):\n    def cost(self):\n        return super().cost() / 2\n\n\nclass GroupTicket(Ticket):\n    def __init__(self, event, price, people):\n        super().__init__(event, price)\n        self.people = people\n\n    def cost(self):\n        total = super().cost() * self.people\n        if self.people > 5:\n            total *= 0.9\n        return total",
          ],
        },
      ],
      quiz: [
        {
          q: "`class Manager(Employee)` defines its own `__init__` that stores `self.team` but never calls `super().__init__(...)`. After `m = Manager(\"Dana\", 72000, [])`, what is `m.salary`?",
          options: ["72000", "None", "AttributeError — salary was never stored", "0"],
          answer: 2,
          explain:
            "Overriding __init__ replaces the parent's completely. Unless the child calls super().__init__, the parent's attribute-storing lines never run.",
        },
        {
          q: "With `class Manager(Employee)`, which statement is true?",
          options: [
            "isinstance(Manager(...), Employee) is True",
            "isinstance(Employee(...), Manager) is True",
            "A Manager can only use methods it defines itself",
            "Manager must redefine every Employee method",
          ],
          answer: 0,
          explain:
            "A subclass instance is an instance of every class above it. The reverse is not true, and inherited methods work without being redefined.",
        },
      ],
    },

    {
      id: "m8-properties",
      title: "Class attributes, properties and classmethods",
      goal: "Share values across instances with class attributes, expose computed and validated values with @property, and write alternative constructors with @classmethod.",
      keywords: ["class attribute", "property", "setter", "classmethod", "staticmethod", "computed attribute", "validation"],
      exercises: [
        {
          id: "m8-properties-e1",
          prompt:
            "Define a class `Employee` with:\n\n- a **class attribute** `company` equal to `\"Northwind\"`;\n- a **class attribute** `headcount` that starts at `0` and goes up by one every time an `Employee` is created;\n- `__init__(self, first, last)` storing both names;\n- a **property** `full_name` that returns the two names joined by a space, read as `e.full_name` with no parentheses.",
          starter: "class Employee:\n    def __init__(self, first, last):\n        self.first = first\n        self.last = last\n",
          solution:
            "class Employee:\n    company = \"Northwind\"\n    headcount = 0\n\n    def __init__(self, first, last):\n        self.first = first\n        self.last = last\n        Employee.headcount += 1\n\n    @property\n    def full_name(self):\n        return f\"{self.first} {self.last}\"",
          hints: [
            "Class attributes are plain assignments in the class body, above `__init__`: `company = \"Northwind\"`.",
            "Bump the shared counter through the class name — `Employee.headcount += 1` — not through `self`, which would make a per-object copy.",
            "Put `@property` on the line above `def full_name(self):` and return the f-string.",
          ],
          tests:
            "assert 'Employee' in dir(), 'Define a class called Employee'\nassert hasattr(Employee, 'company'), \"Employee needs a class attribute company = 'Northwind' (set in the class body, not in __init__)\"\nassert Employee.company == 'Northwind', \"Employee.company should be the class attribute 'Northwind'\"\nassert hasattr(Employee, 'headcount'), 'Employee needs a class attribute headcount that starts at 0'\nbefore = Employee.headcount\nr = Employee('Ravi', 'Patel')\nm = Employee('Mei', 'Chen')\nassert Employee.headcount == before + 2, f'creating two employees should raise Employee.headcount by 2 (was {before}, now {Employee.headcount}) — increment Employee.headcount, not self.headcount'\nassert r.company == 'Northwind', 'each employee should see the shared company name'\nassert r.full_name == 'Ravi Patel', f\"r.full_name should be 'Ravi Patel' (a property, no parentheses), got {r.full_name!r}\"\nassert m.full_name == 'Mei Chen', f\"got {m.full_name!r}\"\nr.first = 'Ravindra'\nassert r.full_name == 'Ravindra Patel', 'full_name should be computed from the current first and last names'",
          wrong: [
            "class Employee:\n    company = \"Northwind\"\n    headcount = 0\n\n    def __init__(self, first, last):\n        self.first = first\n        self.last = last\n        self.headcount += 1\n\n    @property\n    def full_name(self):\n        return f\"{self.first} {self.last}\"",
            "class Employee:\n    company = \"Northwind\"\n    headcount = 0\n\n    def __init__(self, first, last):\n        self.first = first\n        self.last = last\n        Employee.headcount += 1\n\n    def full_name(self):\n        return f\"{self.first} {self.last}\"",
          ],
        },
        {
          id: "m8-properties-e2",
          prompt:
            "Define a class `Temperature` created as `Temperature(celsius)`:\n\n- `celsius` is a property with a **setter** that raises `ValueError` for anything below `-273.15` (absolute zero). The check must also apply when the object is created.\n- `fahrenheit` is a **read-only** property computed as `celsius * 9 / 5 + 32`.\n- `from_fahrenheit(f)` is a **classmethod** that builds a `Temperature` from a Fahrenheit value (`(f - 32) * 5 / 9`).",
          starter:
            "class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    # add the properties and the classmethod\n",
          solution:
            "class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    @property\n    def celsius(self):\n        return self._celsius\n\n    @celsius.setter\n    def celsius(self, value):\n        if value < -273.15:\n            raise ValueError(\"below absolute zero\")\n        self._celsius = value\n\n    @property\n    def fahrenheit(self):\n        return self.celsius * 9 / 5 + 32\n\n    @classmethod\n    def from_fahrenheit(cls, f):\n        return cls((f - 32) * 5 / 9)",
          hints: [
            "Store the real value in `self._celsius`; the `celsius` getter returns it and the `@celsius.setter` validates before storing. Because `__init__` does `self.celsius = celsius`, the setter runs at creation too.",
            "`fahrenheit` is a plain `@property` with no setter — assigning to it will then raise AttributeError by itself.",
            "`@classmethod` gets `cls` first: `return cls((f - 32) * 5 / 9)`.",
          ],
          requires: [{ re: "@classmethod", msg: "Write from_fahrenheit as a @classmethod." }],
          tests:
            "assert 'Temperature' in dir(), 'Define a class called Temperature'\nt = Temperature(25)\nassert t.celsius == 25, f'Temperature(25).celsius should be 25, got {t.celsius!r}'\nassert t.fahrenheit == 77.0, f'25 °C is 77.0 °F; t.fahrenheit should read 77.0 without parentheses, got {t.fahrenheit!r}'\nt.celsius = 30\nassert t.fahrenheit == 86.0, f'after t.celsius = 30, t.fahrenheit should be 86.0 (recomputed), got {t.fahrenheit!r}'\ntry:\n    t.celsius = -300\n    raise AssertionError('setting celsius to -300 should raise ValueError')\nexcept ValueError:\n    pass\nassert t.celsius == 30, 'a rejected value must leave celsius unchanged'\ntry:\n    Temperature(-500)\n    raise AssertionError('Temperature(-500) should raise ValueError — the check must apply at creation too')\nexcept ValueError:\n    pass\ntry:\n    t.fahrenheit = 50\n    raise AssertionError('fahrenheit should be read-only: assigning to it must raise AttributeError')\nexcept AttributeError:\n    pass\nb = Temperature.from_fahrenheit(212)\nassert isinstance(b, Temperature), 'from_fahrenheit should return a Temperature'\nassert b.celsius == 100, f'Temperature.from_fahrenheit(212).celsius should be 100, got {b.celsius!r}'\nassert Temperature.from_fahrenheit(32).celsius == 0, 'from_fahrenheit(32) should be 0 °C'\nassert Temperature(-273.15).celsius == -273.15, 'exactly -273.15 is allowed'",
          wrong: [
            "class Temperature:\n    def __init__(self, celsius):\n        self.celsius = celsius\n\n    @property\n    def fahrenheit(self):\n        return self.celsius * 9 / 5 + 32\n\n    @classmethod\n    def from_fahrenheit(cls, f):\n        return cls((f - 32) * 5 / 9)",
            "class Temperature:\n    def __init__(self, celsius):\n        if celsius < -273.15:\n            raise ValueError(\"below absolute zero\")\n        self.celsius = celsius\n        self.fahrenheit = celsius * 9 / 5 + 32\n\n    @classmethod\n    def from_fahrenheit(cls, f):\n        return cls((f - 32) * 5 / 9)",
          ],
        },
      ],
      quiz: [
        {
          q: "`area` is defined with `@property` on `Circle`. What happens on `c.area()`?",
          options: [
            "It returns the area",
            "TypeError: 'float' object is not callable — the property already returned the number",
            "It returns the method object",
            "AttributeError",
          ],
          answer: 1,
          explain:
            "A property is read like an attribute: c.area gives the number. Adding () then tries to call that number.",
        },
        {
          q: "What is the first parameter of a `@classmethod`?",
          options: ["self — the current object", "cls — the class itself", "Nothing — it has no automatic first parameter", "super"],
          answer: 1,
          explain:
            "A classmethod receives the class, which is why it can build new instances with cls(...). A staticmethod is the one with no automatic first parameter.",
        },
      ],
    },

    {
      id: "m8-dataclasses",
      title: "dataclasses",
      goal: "Use @dataclass to generate __init__, __repr__ and __eq__, with defaults, default factories, frozen and ordered variants.",
      keywords: ["dataclass", "field", "default_factory", "frozen", "order", "asdict", "annotation"],
      exercises: [
        {
          id: "m8-dataclasses-e1",
          prompt:
            "Write a **dataclass** `Product` with fields `name` (str), `price` (float) and `quantity` (int, default `0`), in that order. Add a method `total()` that returns `price * quantity`.",
          starter: "from dataclasses import dataclass\n\n# define Product here\n",
          solution:
            "from dataclasses import dataclass\n\n@dataclass\nclass Product:\n    name: str\n    price: float\n    quantity: int = 0\n\n    def total(self):\n        return self.price * self.quantity",
          hints: [
            "Put `@dataclass` on the line above `class Product:`.",
            "Each field is `name: type`; a default goes after `=`: `quantity: int = 0`. The annotation is what makes it a field.",
            "Methods are written exactly as in a normal class, below the fields.",
          ],
          requires: [{ re: "@dataclass", msg: "Use the @dataclass decorator." }],
          tests:
            "assert 'Product' in dir(), 'Define a dataclass called Product'\np = Product('Notebook', 3.5, 12)\nassert (p.name, p.price, p.quantity) == ('Notebook', 3.5, 12), 'Product(\"Notebook\", 3.5, 12) should store the three fields in order'\nassert p.total() == 42.0, f'Product(\"Notebook\", 3.5, 12).total() should be 42.0, got {p.total()!r}'\npen = Product('Pen', 1.2)\nassert pen.quantity == 0, f'quantity should default to 0, got {pen.quantity!r}'\nassert pen.total() == 0, 'a product with quantity 0 has total 0'\nassert pen == Product('Pen', 1.2, 0), 'two Products with the same fields should be equal (a dataclass generates __eq__)'\nassert repr(pen) == \"Product(name='Pen', price=1.2, quantity=0)\", f'the generated repr should be \"Product(name=\\'Pen\\', price=1.2, quantity=0)\", got {repr(pen)!r}'",
          wrong: [
            "from dataclasses import dataclass\n\n@dataclass\nclass Product:\n    name: str\n    price: float\n    quantity = 0\n\n    def total(self):\n        return self.price * self.quantity",
            "from dataclasses import dataclass\n\n@dataclass\nclass Product:\n    name: str\n    price: float\n    quantity: int = 0\n\n    def total(self):\n        return self.price + self.quantity",
          ],
        },
        {
          id: "m8-dataclasses-e2",
          prompt:
            "Two dataclasses:\n\n- `Line` — **frozen** (immutable), with fields `name` (str), `price` (float) and `qty` (int, default `1`).\n- `Order` — fields `customer` (str) and `lines`, a list that defaults to a **fresh empty list** for every order. Add `add(line)` that appends a `Line`, and `total()` that returns the sum of `price * qty` over all lines.",
          starter: "from dataclasses import dataclass, field\n\n# define Line and Order here\n",
          solution:
            "from dataclasses import dataclass, field\n\n@dataclass(frozen=True)\nclass Line:\n    name: str\n    price: float\n    qty: int = 1\n\n\n@dataclass\nclass Order:\n    customer: str\n    lines: list = field(default_factory=list)\n\n    def add(self, line):\n        self.lines.append(line)\n\n    def total(self):\n        return sum(line.price * line.qty for line in self.lines)",
          hints: [
            "`@dataclass(frozen=True)` makes every instance read-only after creation.",
            "A list default must be `lines: list = field(default_factory=list)` — a plain `= []` is refused.",
            "`total` is a generator expression: `sum(line.price * line.qty for line in self.lines)`.",
          ],
          requires: [{ re: "@dataclass", msg: "Use the @dataclass decorator." }],
          tests:
            "assert 'Line' in dir() and 'Order' in dir(), 'Define both Line and Order'\nl = Line('Pen', 1.5)\nassert l.qty == 1, f'qty should default to 1, got {l.qty!r}'\nassert Line('Pen', 1.5, 2) == Line('Pen', 1.5, 2), 'Lines with the same fields should be equal'\ntry:\n    l.price = 9.0\n    raise AssertionError('Line should be frozen: assigning to a field must raise an error')\nexcept AttributeError:\n    pass\na = Order('Ana')\nb = Order('Ben')\nassert a.lines == [], f'a new Order should start with no lines, got {a.lines!r}'\na.add(Line('Pen', 1.5, 2))\na.add(Line('Notebook', 4.0))\nassert len(a.lines) == 2, 'add() should append to the order'\nassert b.lines == [], 'each Order needs its own list — use field(default_factory=list)'\nassert a.total() == 7.0, f'1.5*2 + 4.0*1 should be 7.0, got {a.total()!r}'\nassert b.total() == 0, 'an empty order has total 0'\nassert a == Order('Ana', [Line('Pen', 1.5, 2), Line('Notebook', 4.0)]), 'Order should be a dataclass with customer and lines fields'",
          wrong: [
            "from dataclasses import dataclass, field\n\n@dataclass\nclass Line:\n    name: str\n    price: float\n    qty: int = 1\n\n\n@dataclass\nclass Order:\n    customer: str\n    lines: list = field(default_factory=list)\n\n    def add(self, line):\n        self.lines.append(line)\n\n    def total(self):\n        return sum(line.price * line.qty for line in self.lines)",
            "from dataclasses import dataclass, field\n\n@dataclass(frozen=True)\nclass Line:\n    name: str\n    price: float\n    qty: int = 1\n\n\n@dataclass\nclass Order:\n    customer: str\n    lines: list = []\n\n    def add(self, line):\n        self.lines.append(line)\n\n    def total(self):\n        return sum(line.price * line.qty for line in self.lines)",
          ],
        },
      ],
      quiz: [
        {
          q: "What happens when Python reads `@dataclass class Order: customer: str; tags: list = []`?",
          options: [
            "It works; each order gets its own empty list",
            "It works; all orders share one list",
            "ValueError as soon as the class is defined — mutable defaults are refused",
            "SyntaxError",
          ],
          answer: 2,
          explain:
            "dataclasses spot the shared-list trap and refuse it up front. Use field(default_factory=list) to get a fresh list per object.",
        },
        {
          q: "Which methods does a plain `@dataclass` generate for you?",
          options: [
            "__init__, __repr__ and __eq__",
            "__init__ only",
            "__init__, __repr__, __eq__ and __lt__",
            "__str__ and __hash__ only",
          ],
          answer: 0,
          explain:
            "Comparison methods like __lt__ need order=True, and a hash is only generated when the class is frozen or you ask for it.",
        },
      ],
    },

    {
      id: "m8-design",
      title: "Designing with objects",
      goal: "Choose composition over inheritance, rely on duck typing, keep classes small, and recognise when a function or dict is the better tool.",
      keywords: ["composition", "has-a", "duck typing", "design", "small classes", "when not to use a class"],
      exercises: [
        {
          id: "m8-design-e1",
          prompt:
            "`Player` is given (a `name` and a number of `goals`). Define a class `Team` created as `Team(name)` that **holds** players rather than inheriting from `list`:\n\n- `add(player)` adds a player.\n- `total_goals()` returns the sum of all players' goals.\n- `top_scorer()` returns the **Player object** with the most goals, or `None` if the team is empty.",
          starter:
            "class Player:\n    def __init__(self, name, goals):\n        self.name = name\n        self.goals = goals\n\n    def __repr__(self):\n        return f\"Player({self.name!r}, {self.goals})\"\n\n\nclass Team:\n    pass\n",
          solution:
            "class Player:\n    def __init__(self, name, goals):\n        self.name = name\n        self.goals = goals\n\n    def __repr__(self):\n        return f\"Player({self.name!r}, {self.goals})\"\n\n\nclass Team:\n    def __init__(self, name):\n        self.name = name\n        self.players = []\n\n    def add(self, player):\n        self.players.append(player)\n\n    def total_goals(self):\n        return sum(p.goals for p in self.players)\n\n    def top_scorer(self):\n        if not self.players:\n            return None\n        return max(self.players, key=lambda p: p.goals)",
          hints: [
            "Composition: give `Team` a `self.players = []` attribute in `__init__` and append to it in `add`.",
            "`total_goals` is `sum(p.goals for p in self.players)`.",
            "`top_scorer` returns `max(self.players, key=lambda p: p.goals)` — the whole Player, not just the name — after checking for an empty list.",
          ],
          tests:
            "assert 'Team' in dir(), 'Define a class called Team'\nassert not issubclass(Team, list), 'Team should hold a list of players (composition), not inherit from list'\ntry:\n    t = Team('Lions')\nexcept TypeError:\n    raise AssertionError(\"Team('Lions') should work — write an __init__(self, name)\")\nassert t.name == 'Lions', \"Team('Lions').name should be 'Lions'\"\nassert t.total_goals() == 0, 'an empty team has 0 goals'\nassert t.top_scorer() is None, 'top_scorer() on an empty team should return None'\nmei = Player('Mei', 7)\nt.add(Player('Ravi', 3))\nt.add(mei)\nt.add(Player('Lee', 5))\nassert t.total_goals() == 15, f'3 + 7 + 5 goals should be 15, got {t.total_goals()!r}'\ntop = t.top_scorer()\nassert isinstance(top, Player), f'top_scorer() should return a Player object, got {top!r}'\nassert top is mei, f'top_scorer() should be Mei with 7 goals, got {top!r}'\nother = Team('Tigers')\nassert other.total_goals() == 0, 'each Team should keep its own players'",
          wrong: [
            "class Player:\n    def __init__(self, name, goals):\n        self.name = name\n        self.goals = goals\n\n    def __repr__(self):\n        return f\"Player({self.name!r}, {self.goals})\"\n\n\nclass Team:\n    def __init__(self, name):\n        self.name = name\n        self.players = []\n\n    def add(self, player):\n        self.players.append(player)\n\n    def total_goals(self):\n        return sum(p.goals for p in self.players)\n\n    def top_scorer(self):\n        if not self.players:\n            return None\n        return max(self.players, key=lambda p: p.goals).name",
            "class Player:\n    def __init__(self, name, goals):\n        self.name = name\n        self.goals = goals\n\n    def __repr__(self):\n        return f\"Player({self.name!r}, {self.goals})\"\n\n\nclass Team:\n    players = []\n\n    def __init__(self, name):\n        self.name = name\n\n    def add(self, player):\n        self.players.append(player)\n\n    def total_goals(self):\n        return sum(p.goals for p in self.players)\n\n    def top_scorer(self):\n        if not self.players:\n            return None\n        return max(self.players, key=lambda p: p.goals)",
          ],
        },
        {
          id: "m8-design-e2",
          prompt:
            "`Circle` and `Rect` are given; each has an `area()` method and they share no base class. Add:\n\n- a class `Square` created as `Square(side)` with an `area()` method;\n- a function `biggest(shapes)` that returns the **shape object** with the largest area. It must work for *any* object that has an `area()` method — including classes you have never seen — so do not check types.",
          starter:
            "import math\n\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return math.pi * self.radius ** 2\n\n\nclass Rect:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n\n# define Square and biggest here\n",
          solution:
            "import math\n\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return math.pi * self.radius ** 2\n\n\nclass Rect:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n\nclass Square:\n    def __init__(self, side):\n        self.side = side\n\n    def area(self):\n        return self.side ** 2\n\n\ndef biggest(shapes):\n    return max(shapes, key=lambda shape: shape.area())",
          hints: [
            "`Square` needs only `__init__(self, side)` and `area()` returning `self.side ** 2`.",
            "Duck typing: `biggest` just calls `.area()` on each shape and never asks what type it is.",
            "`max(shapes, key=lambda shape: shape.area())` returns the object, not the number.",
          ],
          requires: [{ re: "\\bisinstance\\b", not: true, msg: "No isinstance here — rely on duck typing: anything with .area() is a shape." }],
          tests:
            "assert 'Square' in dir(), 'Define a class called Square'\nassert 'biggest' in dir(), 'Define a function called biggest'\nassert Square(3).area() == 9, f'Square(3).area() should be 9, got {Square(3).area()!r}'\nr = Rect(2, 5)\nresult = biggest([Circle(1), r, Square(3)])\nassert result is r, f'biggest should return the Rect(2, 5) object (area 10), got {result!r}'\nc = Circle(2)\nassert biggest([Square(3), c, Rect(1, 1)]) is c, 'Circle(2) has area ~12.57 and should win'\nclass Hexagon:\n    def area(self):\n        return 99\nh = Hexagon()\nassert biggest([Square(9), h, Rect(10, 9)]) is h, 'biggest must accept any object with an area() method — even one it has never seen'\nonly = Square(1)\nassert biggest([only]) is only, 'a single shape is the biggest'",
          wrong: [
            "import math\n\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return math.pi * self.radius ** 2\n\n\nclass Rect:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n\nclass Square:\n    def __init__(self, side):\n        self.side = side\n\n    def area(self):\n        return self.side ** 2\n\n\ndef biggest(shapes):\n    return max(shape.area() for shape in shapes)",
            "import math\n\nclass Circle:\n    def __init__(self, radius):\n        self.radius = radius\n\n    def area(self):\n        return math.pi * self.radius ** 2\n\n\nclass Rect:\n    def __init__(self, width, height):\n        self.width = width\n        self.height = height\n\n    def area(self):\n        return self.width * self.height\n\n\nclass Square:\n    def __init__(self, side):\n        self.side = side\n\n    def area(self):\n        return self.side ** 2\n\n\ndef biggest(shapes):\n    best = None\n    for shape in shapes:\n        if isinstance(shape, (Circle, Rect, Square)):\n            if best is None or shape.area() > best.area():\n                best = shape\n    return best",
          ],
        },
      ],
      quiz: [
        {
          q: "A function `total_area(shapes)` calls `.area()` on each item. Do `Circle` and `Rect` need a shared `Shape` base class for it to work?",
          options: [
            "Yes — Python checks the type before calling a method",
            "No — anything with an area() method works (duck typing)",
            "Only if the list mixes types",
            "Yes, otherwise sum() fails",
          ],
          answer: 1,
          explain:
            "Python looks up area on each object at call time. If the method is there, it runs; the class hierarchy is irrelevant.",
        },
        {
          q: "A `Library` needs to store books. Which design is recommended?",
          options: [
            "class Library(list) — free append and sort",
            "class Library with a self.books list and a few methods",
            "class Library(Book)",
            "A Library should be a dict subclass",
          ],
          answer: 1,
          explain:
            "A library has books; it is not a kind of list. Composition keeps the public surface to the operations a library actually supports.",
        },
      ],
    },
  ],
};
