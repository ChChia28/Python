::: lesson m10-numpy

A Python list is fine for a shopping cart. Analysis is different: you have a
*column* of ten thousand prices and you want to add tax to all of them, or a
grid of sales by shop and quarter and you want the total of every row. Doing
that with `for` loops works, but it is slow to run and slow to read. **NumPy**
gives you the **array**: a block of numbers, all of the same type, with maths
that applies to every element at once. pandas, the table library you meet two
lessons from now, is built on top of it.

```python
import numpy as np

temps = np.array([21, 23, 25, 28, 30, 27, 24])
print(temps)
print(type(temps))
print(temps.shape)
print(temps.dtype)
```

`np.array(...)` turns a list into an `ndarray`. Two attributes describe it:
**shape**, a tuple with the size of each dimension — `(7,)` means one
dimension of seven items — and **dtype**, the type of every element. In the
browser the last line says `int32`; a desktop install would say `int64`.
Either way the point is the same: one array, one type. That constraint is
exactly what makes the maths fast.

## Maths on the whole array

Here is the difference from a list, side by side:

```python
import numpy as np

prices = [45.0, 12.5, 6.0, 80.0]
with_tax = [p * 1.06 for p in prices]
print(with_tax)

arr = np.array(prices)
print(arr * 1.06)
print(arr + 5)
print(arr > 20)
print(arr * np.array([2, 1, 10, 1]))
```

`arr * 1.06` multiplies *every* element — no loop, no comprehension. This is
called **vectorised** or **element-wise** arithmetic, and it covers `+ - * /
**`, comparisons (`arr > 20` gives an array of `True`/`False`) and two arrays
of the same shape combined element by element. Try the same thing on a list
and Python refuses:

```python-error
prices = [45.0, 12.5, 6.0, 80.0]
print(prices * 1.06)
```

`*` on a list means *repeat*, and you cannot repeat something 1.06 times.

## Building arrays without typing them

```python
import numpy as np

print(np.arange(5))
print(np.arange(0, 10, 2.5))
print(np.linspace(0, 1, 5))
print(np.zeros(3))
print(np.ones((2, 3)))
```

`arange` works like `range` (start, stop, step — stop excluded) but returns an
array and accepts decimals. `linspace(start, stop, n)` gives `n` evenly spaced
points *including* both ends — the one you want for plotting a curve. `zeros`
and `ones` build a placeholder of a given shape to fill in later.

## Two dimensions

A 2-D array is a grid: rows and columns. Think of a spreadsheet with no
headers.

```python
import numpy as np

sales = np.array([
    [120, 95, 130, 140],
    [80, 110, 100, 90],
    [200, 180, 210, 190],
])
print(sales.shape)
print(sales[1])
print(sales[2, 0])
print(sales[:, -1])
print(sales[0:2, 1:3])
```

Shape `(3, 4)` reads as three rows, four columns — **rows first, always**.
Indexing takes one number per dimension, separated by a comma: `sales[2, 0]`
is row 2, column 0. A bare `:` means "every row" (or every column), so
`sales[:, -1]` is the last column. Slices work in each dimension exactly as
they do on lists, and `sales[0:2, 1:3]` carves out a 2×2 block.

> [!tip] `sales[1][2]` also works — it takes row 1, then item 2 of that row.
> The comma form `sales[1, 2]` is the idiom, and it is the only form that lets
> you slice columns.

## Common mistakes

- **`np.array(1, 2, 3)`.** The function takes *one* list, not several
  numbers: `np.array([1, 2, 3])`.
- **Mixing types.** `np.array([1, "a"])` quietly turns everything into
  strings, because one array has one dtype. Keep numbers and text in separate
  arrays — or use pandas, which handles mixed columns.
- **Integer and float.** `np.array([1, 2.5])` is a float array; `np.zeros(3)`
  is float too. If you need whole numbers, say so: `np.zeros(3, dtype=int)`.

::: lesson m10-numpy-ops

Nearly every question you ask of a column of numbers is one of three moves:
*filter* the values you care about, *aggregate* them to one number, or do
either of those along one direction of a grid. NumPy has a short, consistent
spelling for each.

## Boolean masks

Comparing an array to a value gives an array of `True`/`False` — a **mask**.
Put the mask in square brackets and you keep only the elements where it is
`True`.

```python
import numpy as np

scores = np.array([72, 45, 88, 95, 61, 70, 81, 38, 77, 90])
mask = scores >= 70
print(mask)
print(scores[mask])
print(scores[scores >= 70])
print((scores >= 70).sum())
print(scores[(scores >= 70) & (scores < 90)])
```

`scores[scores >= 70]` is the pattern you will type a thousand times: "the
scores that are at least 70". Summing a mask counts the `True`s, so
`(scores >= 70).sum()` is *how many* passed. To combine conditions use `&`
(and), `|` (or) and `~` (not), and wrap each comparison in parentheses —
`&` binds tighter than `>=`, so without them Python compares the wrong things.

## Aggregates

```python
import numpy as np

scores = np.array([72, 45, 88, 95, 61, 70, 81, 38, 77, 90])
print(scores.sum(), scores.min(), scores.max())
print(round(scores.mean(), 2))
print(round(scores.std(), 2))
print(round(scores.std(ddof=1), 2))
print(np.median(scores))
print(scores.argmax())
```

`argmax` returns the *index* of the largest value (3 — the 95), not the value
itself; `argmin` is its twin. One detail matters if you have done any
statistics: `scores.std()` divides by *n* (the population formula). For the
sample standard deviation pass `ddof=1`, which divides by *n − 1*. pandas uses
`ddof=1` by default, so the two libraries disagree unless you say which you
mean.

## Axis: which direction?

On a 2-D array every aggregate takes an `axis`. The rule: **the axis you name
is the one that collapses.** `axis=0` runs *down* the rows, leaving one answer
per column; `axis=1` runs *across* the columns, leaving one answer per row.

```python
import numpy as np

sales = np.array([
    [120, 95, 130, 140],
    [80, 110, 100, 90],
    [200, 180, 210, 190],
])
print(sales.sum())
print(sales.sum(axis=0))
print(sales.sum(axis=1))
print(sales.argmax(axis=1))
print(sales.mean(axis=0).round(2))
```

No axis gives one grand total. `axis=0` gives four quarterly totals (one per
column). `axis=1` gives three shop totals (one per row). `argmax(axis=1)`
tells you each shop's best quarter as a column index.

## where, broadcasting and reshape

```python
import numpy as np

sales = np.array([
    [120, 95, 130, 140],
    [80, 110, 100, 90],
    [200, 180, 210, 190],
])
print(np.where(sales >= 100, "hit", "miss"))

targets = np.array([100, 100, 120, 120])
print(sales - targets)

totals = sales.sum(axis=1)
print(totals.reshape(3, 1))
print((sales / totals.reshape(3, 1)).round(2))
```

`np.where(condition, a, b)` picks `a` where the condition holds and `b`
elsewhere — an element-wise `if`. `sales - targets` subtracts a 4-element row
from every row of the 3×4 grid: NumPy stretches the smaller shape to fit,
which is called **broadcasting**. A scalar broadcasts to everything; a row
broadcasts down the rows. A *column* needs shape `(3, 1)`, which is what
`reshape(3, 1)` produces — and dividing by it gives each quarter's share of
its shop's year.

## Common mistakes

- **`and` / `or` on arrays.** `(a > 1) and (a < 5)` raises *"truth value of
  an array is ambiguous"*. Use `&` and `|`, with parentheses around each side.
- **Dividing by a plain row when you meant a column.** `sales / totals` with
  `totals` of shape `(3,)` fails against a `(3, 4)` grid; reshape it to
  `(3, 1)` first.
- **Guessing the axis.** If the result has the wrong length, you named the
  wrong axis. One answer per row means `axis=1`.

::: lesson m10-series

A NumPy array has positions but no names. Real data has both: the price *of
the mug*, the sales *in Q2*. **pandas** adds the labels. A **Series** is a
one-dimensional array with an **index** of labels alongside it; a
**DataFrame** is a table — several Series sharing one index, each with a
column name.

```python
import pandas as pd

prices = pd.Series([45.0, 12.5, 6.0, 80.0], index=["lamp", "mug", "notebook", "knife"])
print(prices)
print(prices["mug"])
print(prices.mean())
print(prices * 1.06)
```

The index is printed down the left. `prices["mug"]` looks up by label, and
all the NumPy maths still works — `prices * 1.06` keeps the labels attached
to the new values. Leave out `index=` and you get positions `0, 1, 2…`,
which is what you usually want for rows of a table.

## A DataFrame from a dict of lists

The quickest way to build a small table is a dict: keys become column names,
lists become columns. Every list must be the same length.

```python
import pandas as pd

products = pd.DataFrame({
    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Throw Cushion", "Fountain Pen"],
    "category": ["Home", "Kitchen", "Stationery", "Kitchen", "Home", "Stationery"],
    "price": [45.0, 12.5, 6.0, 80.0, 25.0, 32.0],
    "stock": [12, 40, 150, 5, 20, 8],
})
print(products)
print(products.shape)
print(list(products.columns))
print(products.dtypes)
```

`shape` is `(6, 4)`: six rows, four columns, rows first like NumPy. `columns`
lists the names; `dtypes` shows one type per column. Notice two text columns
hold `str` and the numbers hold `float64` and `int64` — a DataFrame can mix
types across columns, because each column is its own array.

## Looking before you compute

Three methods you run on every dataset you ever open:

```python
import pandas as pd

products = pd.DataFrame({
    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Throw Cushion", "Fountain Pen"],
    "category": ["Home", "Kitchen", "Stationery", "Kitchen", "Home", "Stationery"],
    "price": [45.0, 12.5, 6.0, 80.0, 25.0, 32.0],
    "stock": [12, 40, 150, 5, 20, 8],
})
print(products.head(3))
products.info()
print(products.describe().round(2))
```

`head(n)` shows the first rows — the default is five. `info()` prints the
column list with how many non-missing values each has, which is how you spot
gaps. `describe()` gives count, mean, standard deviation, min, quartiles and
max for every numeric column at once — a first look at the distribution before
you decide what to compute.

## A column is a Series

```python
import pandas as pd

products = pd.DataFrame({
    "name": ["Desk Lamp", "Ceramic Mug", "Notebook"],
    "price": [45.0, 12.5, 6.0],
})
print(products["price"])
print(type(products["price"]))
print(products["price"].max())
print(products.index)
```

Square brackets with a column name hand you that column as a Series, with the
table's index attached. Everything from the Series section — `.mean()`,
`* 1.06`, comparisons — applies to it. And `products.index` shows the row
labels: a `RangeIndex` from 0 to 3, because you did not supply one.

## Common mistakes

- **Lists of different lengths.** `pd.DataFrame({"a": [1, 2], "b": [1]})`
  raises *"All arrays must be of the same length"*. Check the shortest list.
- **`products.info` without parentheses.** That prints the method object, not
  the summary. Call it: `products.info()`.
- **Expecting `describe()` to cover text.** By default it summarises numeric
  columns only. For a text column use `products["category"].value_counts()`,
  coming up in two lessons.

::: lesson m10-select

Most analysis questions start with "which rows?" and "which columns?". pandas
answers both with square brackets, plus two tools — `loc` and `iloc` — that
make the answer unambiguous.

```python
import pandas as pd

products = pd.DataFrame({
    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Throw Cushion", "Fountain Pen", "Mixing Bowl", "Wall Clock"],
    "category": ["Home", "Kitchen", "Stationery", "Kitchen", "Home", "Stationery", "Kitchen", "Home"],
    "price": [45.0, 12.5, 6.0, 80.0, 25.0, 32.0, 18.0, 55.0],
    "stock": [12, 40, 150, 5, 20, 8, 25, 7],
})
print(products["name"].head(3))
print(products[["name", "price"]].head(3))
```

One name gives a Series. A *list* of names — note the double brackets — gives
a DataFrame with just those columns, in the order you asked.

## Filtering rows with a mask

Exactly as in NumPy: compare a column, get a boolean Series, put it in square
brackets.

```python
import pandas as pd

products = pd.DataFrame({
    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Throw Cushion", "Fountain Pen", "Mixing Bowl", "Wall Clock"],
    "category": ["Home", "Kitchen", "Stationery", "Kitchen", "Home", "Stationery", "Kitchen", "Home"],
    "price": [45.0, 12.5, 6.0, 80.0, 25.0, 32.0, 18.0, 55.0],
    "stock": [12, 40, 150, 5, 20, 8, 25, 7],
})
print(products[products["price"] > 50])
print(products[(products["category"] == "Kitchen") & (products["price"] < 50)])
print(products[~(products["category"] == "Home")].shape)
print(products[products["category"].isin(["Home", "Kitchen"])]["name"].tolist())
```

Combine conditions with `&`, `|` and `~`, each comparison in its own
parentheses. `isin(list)` is the tidy way to say "any of these". Notice the
filtered rows keep their *original* index labels (3 and 7 for the expensive
ones) — a row's label travels with it.

## loc and iloc

`loc` selects by **label**; `iloc` selects by **integer position**. Both take
`[rows, columns]`.

```python
import pandas as pd

products = pd.DataFrame({
    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Throw Cushion", "Fountain Pen", "Mixing Bowl", "Wall Clock"],
    "category": ["Home", "Kitchen", "Stationery", "Kitchen", "Home", "Stationery", "Kitchen", "Home"],
    "price": [45.0, 12.5, 6.0, 80.0, 25.0, 32.0, 18.0, 55.0],
    "stock": [12, 40, 150, 5, 20, 8, 25, 7],
})
print(products.loc[0, "name"])
print(products.loc[products["price"] > 50, ["name", "price"]])
print(products.iloc[0])
print(products.iloc[-1, 2])
print(products.iloc[1:3, 0:2])
```

`loc[mask, columns]` is the one to remember: filter rows *and* pick columns
in a single step, and — as the next lesson shows — it is also how you assign
to a subset safely. `iloc` is for "the last row" or "the first three columns"
when you do not care about labels. One trap: `loc` slices are *inclusive* of
the end label (`loc[1:3]` is three rows) while `iloc` slices stop before the
end like a list.

## Sorting

```python
import pandas as pd

products = pd.DataFrame({
    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Throw Cushion", "Fountain Pen", "Mixing Bowl", "Wall Clock"],
    "category": ["Home", "Kitchen", "Stationery", "Kitchen", "Home", "Stationery", "Kitchen", "Home"],
    "price": [45.0, 12.5, 6.0, 80.0, 25.0, 32.0, 18.0, 55.0],
    "stock": [12, 40, 150, 5, 20, 8, 25, 7],
})
print(products.sort_values("price", ascending=False).head(3))
ranked = products.sort_values(["category", "price"], ascending=[True, False]).reset_index(drop=True)
print(ranked)
```

`sort_values` returns a *new* sorted DataFrame; the original is untouched.
Several keys go in a list, with a matching list of directions. After sorting,
the index is scrambled — `reset_index(drop=True)` renumbers it from 0, and
`drop=True` throws the old labels away instead of keeping them as a column.

## Common mistakes

- **`and` / `or` between conditions.** Raises *"truth value of a Series is
  ambiguous"*. Use `&` / `|`.
- **Missing parentheses.** `products["price"] > 20 & products["stock"] > 5`
  evaluates `20 & products["stock"]` first and errors. Wrap each comparison.
- **`loc[3]` after sorting.** That is the row *labelled* 3, wherever it now
  sits. For "the fourth row" use `iloc[3]`, or reset the index.

::: lesson m10-columns

Raw data rarely has the column you need. You derive it: a total from quantity
and price, a category from a number, a clean name from a messy one. And real
data has holes. This lesson is the toolkit for both.

```python
import pandas as pd

orders = pd.DataFrame({
    "customer": ["Ana", "Ben", "Chen", "Dev", "Eva"],
    "qty": [2, 1, 4, 3, 1],
    "unit_price": [12.5, 80.0, 6.0, 25.0, 32.0],
    "coupon": ["SPRING", None, "VIP", None, "SPRING"],
})
orders["total"] = orders["qty"] * orders["unit_price"]
orders["customer_upper"] = orders["customer"].str.upper()
print(orders)
```

Assigning to `orders["total"]` creates the column if it does not exist. The
right-hand side is a Series the same length as the table, so vectorised
arithmetic on existing columns is the usual source. Text columns get their
string methods through `.str` — `.str.upper()`, `.str.strip()`,
`.str.title()`, `.str.contains("...")` — each applied to every value.

## apply and map

When the new value needs logic, write a function and `apply` it to the column.
When it is a straight lookup, `map` a dict.

```python
import pandas as pd

orders = pd.DataFrame({
    "customer": ["Ana", "Ben", "Chen", "Dev", "Eva"],
    "qty": [2, 1, 4, 3, 1],
    "coupon": ["SPRING", None, "VIP", None, "SPRING"],
})

def size_band(qty):
    if qty >= 3:
        return "bulk"
    return "single"

orders["size"] = orders["qty"].apply(size_band)

rates = {"SPRING": 0.10, "VIP": 0.25}
orders["discount"] = orders["coupon"].map(rates).fillna(0.0)
print(orders)
print(orders["coupon"].value_counts())
print(orders["coupon"].value_counts(dropna=False))
```

`apply` calls `size_band` once per value and collects the results. `map(rates)`
replaces each coupon code with its rate — and any value *not* in the dict
becomes `NaN`, which is why `.fillna(0.0)` follows. `value_counts()` counts
how often each value appears, most common first; by default it ignores
missing values, and `dropna=False` shows them too.

## Missing values

pandas marks a hole as `NaN` ("not a number"). Three questions: where are
they, what should they become, and which rows should go?

```python
import pandas as pd

survey = pd.DataFrame({
    "city": ["KL", "Penang", "Ipoh", "KL", None, "KL"],
    "age": [29, None, 41, 35, None, 52],
    "score": ["7", "9", "6", "8", "10", "4"],
})
print(survey.isna().sum())
survey["age"] = survey["age"].fillna(survey["age"].median())
survey["score"] = survey["score"].astype(int)
clean = survey.dropna(subset=["city"])
print(clean)
print(clean.dtypes)
print(round(clean["score"].mean(), 2))
```

`isna().sum()` counts gaps per column. `fillna(value)` returns a filled copy —
assign it back. `dropna(subset=[...])` drops rows missing *those* columns;
without `subset` it drops any row with any gap, which is often far more than
you meant. `astype(int)` converts the text scores so you can average them;
with text, `.mean()` would fail. Means and sums skip `NaN` automatically, so
you only need to fill when the *rows* matter.

## Changing part of a column

To set values for *some* rows, filter and assign in one `loc` step:

```python
import pandas as pd

products = pd.DataFrame({
    "name": ["Desk Lamp", "Ceramic Mug", "Chef Knife", "Wall Clock"],
    "stock": [12, 40, 5, 7],
})
products.loc[products["stock"] < 10, "status"] = "reorder"
products["status"] = products["status"].fillna("ok")
print(products)
```

> [!warn] The two-step version `products[products["stock"] < 10]["status"] =
> "reorder"` looks the same and does **nothing**: the filter makes a copy, and
> pandas 3 never writes through a copy (it warns, then your table is
> unchanged). Always `df.loc[mask, "col"] = value`.

## Common mistakes

- **Forgetting to assign `fillna` back.** `survey["age"].fillna(0)` on its own
  line computes a Series and discards it.
- **`astype(int)` with gaps.** `NaN` cannot be an integer; fill or drop first.
- **`.upper()` without `.str`.** A Series has no `.upper()`; the string
  methods live under `.str`.

::: lesson m10-groupby

"Total sales per city." "Average order per customer." "How many orders in each
month?" Every one of these is the same shape: **split** the rows into groups,
**apply** a calculation to each group, **combine** the answers into a new
table. pandas calls it `groupby`, and once you see the three steps you can
build any per-group summary.

```python
import pandas as pd

orders = pd.DataFrame({
    "customer": ["Ana", "Ben", "Ana", "Chen", "Dev", "Ben", "Ana", "Chen", "Dev", "Ben"],
    "city": ["KL", "Penang", "KL", "Ipoh", "KL", "Penang", "KL", "Ipoh", "KL", "Penang"],
    "amount": [90.0, 48.0, 15.5, 160.0, 30.0, 99.9, 45.0, 60.5, 32.0, 50.0],
})
print(orders.groupby("city")["amount"].sum())
print(orders.groupby("city")["amount"].mean().round(2))
```

Read it left to right: group by `city`, take the `amount` column, sum it. The
result is a Series whose **index is the group key** — one row per city — so
`totals["KL"]` works like any Series lookup. `groupby(...)` on its own does
nothing visible; it is a plan, and the aggregate at the end runs it.

## Several statistics at once

```python
import pandas as pd

orders = pd.DataFrame({
    "customer": ["Ana", "Ben", "Ana", "Chen", "Dev", "Ben", "Ana", "Chen", "Dev", "Ben"],
    "city": ["KL", "Penang", "KL", "Ipoh", "KL", "Penang", "KL", "Ipoh", "KL", "Penang"],
    "amount": [90.0, 48.0, 15.5, 160.0, 30.0, 99.9, 45.0, 60.5, 32.0, 50.0],
})
print(orders.groupby("city")["amount"].agg(["count", "sum", "mean"]).round(2))

summary = orders.groupby("customer").agg(
    orders=("amount", "size"),
    total=("amount", "sum"),
    avg=("amount", "mean"),
).round(2)
print(summary.sort_values("total", ascending=False))
```

`.agg` with a list of names gives one column per statistic. The keyword form —
`new_name=("column", "function")` — lets you name the output columns yourself,
which is what you want for a report. The result is a DataFrame, so
`sort_values` works on it like any other.

## size versus count

```python
import pandas as pd

orders = pd.DataFrame({
    "city": ["KL", "Penang", "KL", "Ipoh", "KL"],
    "amount": [90.0, 48.0, None, 160.0, 30.0],
})
print(orders.groupby("city").size())
print(orders.groupby("city")["amount"].count())
```

`size()` counts rows in each group; `count()` counts *non-missing* values in
a column. They differ exactly where the data has gaps — KL has three orders but
only two amounts. The same distinction as `COUNT(*)` versus `COUNT(column)` in
SQL.

## Two keys, and using the result

```python
import pandas as pd

orders = pd.DataFrame({
    "customer": ["Ana", "Ben", "Ana", "Chen", "Dev", "Ben", "Ana", "Chen", "Dev", "Ben"],
    "city": ["KL", "Penang", "KL", "Ipoh", "KL", "Penang", "KL", "Ipoh", "KL", "Penang"],
    "amount": [90.0, 48.0, 15.5, 160.0, 30.0, 99.9, 45.0, 60.5, 32.0, 50.0],
})
print(orders.groupby(["city", "customer"])["amount"].sum())

by_city = orders.groupby("city")["amount"].sum().sort_values(ascending=False)
for city, total in by_city.items():
    print(f"{city}: {total:.2f}")
print(by_city.idxmax())
print(by_city.reset_index())
```

A list of keys groups by every combination, and the result has a two-level
index. Sorting a Series by its values with `sort_values(ascending=False)`
ranks the groups; `.items()` loops over label and value together, which is the
cleanest way to print a report line per group; `idxmax()` names the top group.
If you would rather have the key as an ordinary column again, `reset_index()`
turns the Series back into a two-column DataFrame.

## Common mistakes

- **`groupby("city").mean()` on a table with text columns.** pandas 3 raises
  a `TypeError` because it cannot average `customer`. Pick the numeric column
  first: `groupby("city")["amount"].mean()`.
- **Looking for the key as a column.** After `groupby`, the key is the
  *index*. Use `result["KL"]` or `result.loc["KL"]`, or `reset_index()`.
- **Sorting before grouping.** Sort the *result*; the order of the input rows
  does not affect the sums.

::: lesson m10-merge

Real data arrives in several tables: orders in one, products in another,
customers in a third. The analysis needs them side by side. `merge` joins two
tables on a shared key, `concat` stacks tables, and `pivot_table` reshapes one
table from long to wide. If you have done the SQL course, `merge` is `JOIN`.

```python
import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6],
    "product_id": [101, 103, 101, 104, 102, 103],
    "qty": [2, 1, 1, 3, 4, 2],
})
products = pd.DataFrame({
    "product_id": [101, 102, 103, 104, 105],
    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Wall Clock"],
    "price": [45.0, 12.5, 6.0, 80.0, 55.0],
})
detail = pd.merge(orders, products, on="product_id")
detail["revenue"] = detail["qty"] * detail["price"]
print(detail)
print(round(detail["revenue"].sum(), 2))
```

`pd.merge(left, right, on="key")` lines up rows where the key matches and
glues the columns together. The default is an **inner** merge: only keys
present in *both* tables survive. Product 105 (Wall Clock) was never ordered,
so it does not appear. Once the price sits next to the quantity, revenue is a
one-line vectorised multiply.

## Left merge: keep everything on the left

```python
import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 5, 6],
    "product_id": [101, 103, 101, 104, 102, 103],
    "qty": [2, 1, 1, 3, 4, 2],
})
products = pd.DataFrame({
    "product_id": [101, 102, 103, 104, 105],
    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Wall Clock"],
    "price": [45.0, 12.5, 6.0, 80.0, 55.0],
})
stocked = pd.merge(products, orders, on="product_id", how="left")
print(stocked)
print(stocked["order_id"].isna().sum())
```

`how="left"` keeps every row of the left table, filling the right-hand columns
with `NaN` where nothing matched. That is how you find products that were
*never* ordered: the rows whose `order_id` is missing. (The `qty` column turns
into floats because `NaN` is a float — expected.)

## Stacking with concat

```python
import pandas as pd

jan = pd.DataFrame({"order_id": [1, 2], "amount": [90.0, 48.0]})
feb = pd.DataFrame({"order_id": [3, 4], "amount": [15.5, 160.0]})
print(pd.concat([jan, feb], ignore_index=True))
```

`concat` puts tables with the same columns one under another — monthly files
into a year. `ignore_index=True` renumbers the rows; without it you get
`0, 1, 0, 1`.

## Long to wide: pivot_table

A **long** table has one row per observation: shop, quarter, units. A **wide**
table has shops as rows and quarters as columns — the layout people read.

```python
import pandas as pd

sales = pd.DataFrame({
    "shop": ["Central", "Central", "Harbour", "Harbour", "Uptown", "Central", "Uptown"],
    "quarter": ["Q1", "Q1", "Q1", "Q2", "Q2", "Q3", "Q3"],
    "units": [8, 6, 5, 7, 9, 4, 3],
})
wide = pd.pivot_table(sales, values="units", index="shop", columns="quarter", aggfunc="sum", fill_value=0)
print(wide)
print(wide.loc["Central", "Q1"])
print(wide.reset_index().melt(id_vars="shop", var_name="quarter", value_name="units").head(4))
```

Four arguments: `values` (the numbers), `index` (rows), `columns` (columns)
and `aggfunc` (what to do when several rows land in one cell — Central has two
Q1 sales, summed to 14). `fill_value=0` replaces the `NaN` for combinations
that never happened. `melt` is the reverse trip, wide back to long, which is
the shape `groupby` and plotting libraries prefer.

## Common mistakes

- **Silently losing rows.** An inner merge drops unmatched keys without a
  word. Print `len()` before and after; if it shrank, decide whether
  `how="left"` is what you meant.
- **Default `aggfunc`.** `pivot_table` *averages* by default. For totals say
  `aggfunc="sum"`.
- **Key named differently in each table.** Use `left_on="id"` and
  `right_on="product_id"`, or rename a column first.

::: lesson m10-capstone

Everything in this module comes together in one workflow, and it is the same
workflow for every dataset you will meet as an analyst: **load → inspect →
clean → enrich → aggregate → answer**. The data here is a small online shop:
an `orders.csv` with one row per order and a `products.csv` catalogue.

## Load and inspect

```python
import pandas as pd

open("orders.csv", "w").write("""order_id,customer,product_id,qty
1,Ana,101,2
2,ben,102,4
3,Ana,103,10
4,Chen,104,1
5,Dev,105,
6,Ana,106,1
7,Ben ,101,1
8,chen,102,2
9,Dev,103,5
10,Ana,104,1
10,Ana,104,1
11,Ben,105,2
""")
orders = pd.read_csv("orders.csv")
print(orders.head())
print(orders.shape)
orders.info()
print(orders["customer"].unique())
print(orders.duplicated().sum())
```

`pd.read_csv` reads the file and guesses each column's type. Then look —
every time. `info()` shows `qty` has 11 non-null values out of 12, so one is
missing (and the column became `float64` because of it). `unique()` reveals
`ben`, `chen` and `Ben ` with a trailing space: the same people typed three
ways. `duplicated().sum()` finds one exact repeat of order 10. None of this
would show up in a total; all of it would make the total wrong.

## Clean

Each problem has a one-line fix from the earlier lessons:

```python
import pandas as pd

open("orders.csv", "w").write("""order_id,customer,product_id,qty
1,Ana,101,2
2,ben,102,4
3,Ana,103,10
4,Chen,104,1
5,Dev,105,
6,Ana,106,1
7,Ben ,101,1
8,chen,102,2
9,Dev,103,5
10,Ana,104,1
10,Ana,104,1
11,Ben,105,2
""")
orders = pd.read_csv("orders.csv")
orders = orders.drop_duplicates()
orders["customer"] = orders["customer"].str.strip().str.title()
orders = orders.dropna(subset=["qty"])
orders["qty"] = orders["qty"].astype(int)
print(orders.shape)
print(sorted(orders["customer"].unique()))
print(orders["qty"].sum())
```

Twelve rows become ten, seven spellings become four customers, and `qty` is
whole numbers again. Do the cleaning *before* any arithmetic, and keep it in
one place at the top of the script so every later number inherits it.

## Enrich and aggregate

```python
import pandas as pd

orders = pd.DataFrame({
    "order_id": [1, 2, 3, 4, 6, 7, 8, 9, 10, 11],
    "customer": ["Ana", "Ben", "Ana", "Chen", "Ana", "Ben", "Chen", "Dev", "Ana", "Ben"],
    "product_id": [101, 102, 103, 104, 106, 101, 102, 103, 104, 105],
    "qty": [2, 4, 10, 1, 1, 1, 2, 5, 1, 2],
})
products = pd.DataFrame({
    "product_id": [101, 102, 103, 104, 105, 106],
    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Throw Cushion", "Fountain Pen"],
    "category": ["Home", "Kitchen", "Stationery", "Kitchen", "Home", "Stationery"],
    "price": [45.0, 12.5, 6.0, 80.0, 25.0, 32.0],
})
detail = pd.merge(orders, products, on="product_id")
detail["revenue"] = detail["qty"] * detail["price"]
by_category = detail.groupby("category")["revenue"].sum().sort_values(ascending=False)
by_customer = detail.groupby("customer")["revenue"].sum().sort_values(ascending=False)
print(by_category)
print(by_customer.head(2))
```

Merge brings the price and category next to each order; one multiply gives
revenue; two `groupby` calls answer "which category earns most?" and "who are
the best customers?". Sorting the result is what turns a table into a ranking.

## Answer, in words

An analysis ends with sentences, not DataFrames. Pull single numbers out with
`.iloc[0]` / `.index[0]` and format them:

```python
import pandas as pd

by_category = pd.Series({"Kitchen": 235.0, "Home": 185.0, "Stationery": 122.0})
total = by_category.sum()
print(f"Revenue: {total:.2f}")
print(f"Top category: {by_category.index[0]} ({by_category.iloc[0]:.2f})")
print(f"Share of top category: {by_category.iloc[0] / total:.1%}")
```

`:.2f` for money, `:.1%` for a share. The next step in a real project would be
a chart — `detail.groupby("category")["revenue"].sum().plot(kind="bar")` with
matplotlib installed — but the numbers above are the analysis; the chart only
shows them.

## Common mistakes

- **Aggregating before cleaning.** A duplicate row doubles one order; a
  trailing space splits one customer in two. Clean first, then count.
- **Trusting `read_csv` types.** A missing value turns an integer column into
  floats; a stray word turns a number column into text. Check `dtypes`.
- **Typing the answer.** `print("Revenue: 542.00")` is right today and wrong
  tomorrow. Compute every number in the output from the data.
