/* Module 10 — Data Hero: NumPy and pandas ----------------------------- */

const PRODUCTS =
  'import pandas as pd\n\nproducts = pd.DataFrame({\n    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Throw Cushion", "Fountain Pen", "Mixing Bowl", "Wall Clock"],\n    "category": ["Home", "Kitchen", "Stationery", "Kitchen", "Home", "Stationery", "Kitchen", "Home"],\n    "price": [45.0, 12.5, 6.0, 80.0, 25.0, 32.0, 18.0, 55.0],\n    "stock": [12, 40, 150, 5, 20, 8, 25, 7],\n})\n';

const ORDERS =
  'import pandas as pd\n\norders = pd.DataFrame({\n    "customer": ["Ana", "Ben", "Ana", "Chen", "Dev", "Ben", "Ana", "Chen", "Dev", "Ben"],\n    "city": ["KL", "Penang", "KL", "Ipoh", "KL", "Penang", "KL", "Ipoh", "KL", "Penang"],\n    "amount": [90.0, 148.0, 15.5, 160.0, 30.0, 99.9, 45.0, 60.5, 32.0, 50.0],\n})\n';

const SALES_GRID =
  "import numpy as np\n\n# three shops (rows) x four quarters (columns)\nsales = np.array([\n    [120, 95, 130, 140],\n    [80, 110, 100, 90],\n    [200, 180, 210, 190],\n])\n";

const SHOP_CSV =
  "open('products.csv', 'w').write('product_id,name,category,price\\n101,Desk Lamp,Home,45.0\\n102,Ceramic Mug,Kitchen,12.5\\n103,Notebook,Stationery,6.0\\n104,Chef Knife,Kitchen,80.0\\n105,Throw Cushion,Home,25.0\\n106,Fountain Pen,Stationery,32.0\\n')\n" +
  "open('orders.csv', 'w').write('order_id,customer,product_id,qty\\n1,Ana,101,2\\n2,ben,102,4\\n3,Ana,103,10\\n4,Chen,104,1\\n5,Dev,105,\\n6,Ana,106,1\\n7,Ben ,101,1\\n8,chen,102,2\\n9,Dev,104,2\\n10,Ana,104,1\\n10,Ana,104,1\\n11,Ben,105,2\\n')";

const CLEAN_ORDERS =
  'import pandas as pd\n\norders = pd.read_csv("orders.csv")\nproducts = pd.read_csv("products.csv")\n\n# cleaning from the previous exercise\norders = orders.drop_duplicates()\norders["customer"] = orders["customer"].str.strip().str.title()\norders = orders.dropna(subset=["qty"])\norders["qty"] = orders["qty"].astype(int)\n';

export default {
  id: "data",
  number: 10,
  title: "Data Hero: NumPy and pandas",
  level: "Hero",
  summary:
    "The two libraries behind every analytics job — arrays and vectorised maths with NumPy, then tables with pandas: selecting, cleaning, grouping, merging, and a capstone analysis.",
  packages: ["numpy", "pandas"],
  lessons: [
    {
      id: "m10-numpy",
      title: "NumPy arrays",
      goal: "Build arrays, read their shape and dtype, do maths on every element at once, and index a 2-D grid.",
      keywords: ["numpy", "array", "ndarray", "shape", "dtype", "arange", "linspace", "zeros", "vectorised", "element-wise", "2-D", "indexing"],
      exercises: [
        {
          id: "m10-numpy-e1",
          prompt:
            "`temps` holds a week of daily highs in Celsius. Create an array called `fahrenheit` that converts **every** temperature using `F = C × 9 / 5 + 32` — no loop, no comprehension — and print it.",
          starter: "import numpy as np\n\ntemps = np.array([21, 23, 25, 28, 30, 27, 24])\n# fahrenheit = ...\n",
          solution: "import numpy as np\n\ntemps = np.array([21, 23, 25, 28, 30, 27, 24])\nfahrenheit = temps * 9 / 5 + 32\nprint(fahrenheit)",
          hints: [
            "Arithmetic on an array applies to every element: `temps * 2` doubles all seven.",
            "Chain the operations exactly as the formula reads: multiply, divide, then add.",
            "`fahrenheit = temps * 9 / 5 + 32`, then `print(fahrenheit)`.",
          ],
          tests:
            "import numpy as _np\nassert 'fahrenheit' in dir(), \"Create an array called fahrenheit\"\nassert isinstance(fahrenheit, _np.ndarray), f\"fahrenheit should be a NumPy array, got {type(fahrenheit).__name__}\"\nassert fahrenheit.shape == (7,), f\"fahrenheit should have 7 values, got shape {fahrenheit.shape}\"\nassert _np.allclose(fahrenheit, [69.8, 73.4, 77.0, 82.4, 86.0, 80.6, 75.2]), f\"fahrenheit should be [69.8 73.4 77. 82.4 86. 80.6 75.2], got {fahrenheit}\"",
          expectOutput: true,
          packages: ["numpy"],
          wrong: [
            "import numpy as np\n\ntemps = np.array([21, 23, 25, 28, 30, 27, 24])\nfahrenheit = [t * 9 / 5 + 32 for t in temps]\nprint(fahrenheit)",
            "import numpy as np\n\ntemps = np.array([21, 23, 25, 28, 30, 27, 24])\nfahrenheit = temps * 9 / 5\nprint(fahrenheit)",
          ],
        },
        {
          id: "m10-numpy-e2",
          prompt:
            "`sales` is a 3×4 grid: one row per shop, one column per quarter. Print four lines, in this order: the **shape** of `sales`; the **second** row (all four quarters of shop 2); the **last column** (Q4 for every shop); and the single value for the **third shop in the first quarter**.",
          starter: SALES_GRID,
          solution:
            SALES_GRID + "print(sales.shape)\nprint(sales[1])\nprint(sales[:, -1])\nprint(sales[2, 0])",
          hints: [
            "Rows come first: `sales[1]` is the second row, because indexes start at 0.",
            "A column needs every row and one column: `sales[:, 3]` or `sales[:, -1]`.",
            "One value is `sales[row, column]` — third shop is row 2, first quarter is column 0.",
          ],
          expectOutput: true,
          packages: ["numpy"],
          wrong: [
            SALES_GRID + "print(sales.shape)\nprint(sales[2])\nprint(sales[:, -1])\nprint(sales[3, 1])",
            SALES_GRID + "print(sales.shape)\nprint(sales[1])\nprint(sales[-1])\nprint(sales[2, 0])",
          ],
        },
      ],
      quiz: [
        {
          q: "What does `np.array([1, 2, 3]) * 2` give you?",
          options: ["[1 2 3 1 2 3]", "[2 4 6]", "An error", "[1 2 3 2]"],
          answer: 1,
          explain:
            "Arithmetic on an array is element-wise: every value is doubled. A plain list would be repeated instead, which is the difference the whole lesson is about.",
        },
        {
          q: "An array has shape `(3, 4)`. What is it?",
          options: ["4 rows and 3 columns", "A 1-D array of 12 values", "3 rows and 4 columns", "3 arrays of length 4 stored in a list"],
          answer: 2,
          explain:
            "Shape is always rows first, then columns. sales[1] is a row of 4 values; sales[:, 1] is a column of 3.",
        },
      ],
    },

    {
      id: "m10-numpy-ops",
      title: "Vectorised maths, masks and aggregates",
      goal: "Filter with boolean masks, aggregate with sum/mean/std/argmax, collapse one axis of a grid, and use np.where, broadcasting and reshape.",
      keywords: ["mask", "boolean indexing", "sum", "mean", "std", "argmax", "axis", "np.where", "broadcasting", "reshape", "ddof"],
      exercises: [
        {
          id: "m10-numpy-ops-e1",
          prompt:
            "`scores` holds ten exam marks. A mark of **70 or more** is a pass. Print three lines: how many students passed; the **mean mark of the passing students**, rounded to 2 decimal places; and the **index** of the highest mark in `scores`.",
          starter: "import numpy as np\n\nscores = np.array([72, 45, 88, 95, 61, 70, 81, 38, 77, 90])\n",
          solution:
            "import numpy as np\n\nscores = np.array([72, 45, 88, 95, 61, 70, 81, 38, 77, 90])\npassed = scores[scores >= 70]\nprint(len(passed))\nprint(round(passed.mean(), 2))\nprint(scores.argmax())",
          hints: [
            "`scores >= 70` is a mask; `scores[scores >= 70]` keeps only the passing marks.",
            "`len()` of the filtered array is the count (or sum the mask). `.mean()` on the filtered array is their average.",
            "`argmax()` returns the position of the largest value, not the value — on the full array, not the filtered one.",
          ],
          expectOutput: true,
          packages: ["numpy"],
          wrong: [
            "import numpy as np\n\nscores = np.array([72, 45, 88, 95, 61, 70, 81, 38, 77, 90])\npassed = scores[scores > 70]\nprint(len(passed))\nprint(round(passed.mean(), 2))\nprint(scores.argmax())",
            "import numpy as np\n\nscores = np.array([72, 45, 88, 95, 61, 70, 81, 38, 77, 90])\npassed = scores[scores >= 70]\nprint(len(passed))\nprint(round(passed.mean(), 2))\nprint(scores.max())",
          ],
        },
        {
          id: "m10-numpy-ops-e2",
          prompt:
            "Using the `sales` grid (3 shops × 4 quarters), create three things: `totals` — the yearly total of **each shop** (one number per row); `best_quarter` — the **column index** of each shop's best quarter; and `share` — a 3×4 array where every cell is that quarter's share of **its own shop's** total. Print `totals`, then `best_quarter`, then `share.round(2)`.",
          starter: SALES_GRID + "# totals = ...\n# best_quarter = ...\n# share = ...\n",
          solution:
            SALES_GRID +
            "totals = sales.sum(axis=1)\nbest_quarter = sales.argmax(axis=1)\nshare = sales / totals.reshape(3, 1)\nprint(totals)\nprint(best_quarter)\nprint(share.round(2))",
          hints: [
            "One answer per row means the columns collapse: `axis=1`.",
            "`sales.argmax(axis=1)` gives each row's best column index.",
            "Dividing a (3, 4) grid by a (3,) row fails; reshape the totals to a column first: `totals.reshape(3, 1)`.",
          ],
          tests:
            "import numpy as _np\nassert 'totals' in dir(), \"Create an array called totals\"\nassert list(totals) == [485, 380, 780], f\"totals should be [485 380 780] (one per shop), got {totals}\"\nassert 'best_quarter' in dir(), \"Create an array called best_quarter\"\nassert list(best_quarter) == [3, 1, 2], f\"best_quarter should be [3 1 2], got {best_quarter}\"\nassert 'share' in dir(), \"Create an array called share\"\nassert share.shape == (3, 4), f\"share should keep the shape (3, 4), got {share.shape}\"\nassert _np.allclose(share.sum(axis=1), 1), \"Each row of share should add up to 1 — divide by the shop's own total\"\nassert abs(share[0, 0] - 120 / 485) < 1e-9, f\"share[0, 0] should be 120/485 = 0.2474, got {share[0, 0]}\"",
          expectOutput: true,
          packages: ["numpy"],
          wrong: [
            SALES_GRID +
              "totals = sales.sum(axis=0)\nbest_quarter = sales.argmax(axis=0)\nshare = sales / totals\nprint(totals)\nprint(best_quarter)\nprint(share.round(2))",
            SALES_GRID +
              "totals = sales.sum(axis=1)\nbest_quarter = sales.argmax(axis=1)\nshare = sales / sales.sum()\nprint(totals)\nprint(best_quarter)\nprint(share.round(2))",
          ],
        },
      ],
      quiz: [
        {
          q: "`a = np.array([5, 12, 7, 20])` — what is `a[a > 6].sum()`?",
          options: ["3", "39", "44", "[12 7 20]"],
          answer: 1,
          explain:
            "a > 6 is a mask keeping 12, 7 and 20; summing them gives 39. Summing the mask itself (a > 6).sum() would count the Trues and give 3.",
        },
        {
          q: "On a `(3, 4)` array, `m.sum(axis=0)` returns how many numbers?",
          options: ["3 — one per row", "1 — the grand total", "12 — one per cell", "4 — one per column"],
          answer: 3,
          explain:
            "The axis you name is the one that collapses. axis=0 runs down the rows, leaving one total per column; axis=1 leaves one per row.",
        },
      ],
    },

    {
      id: "m10-series",
      title: "pandas Series and DataFrames",
      goal: "Build a Series and a DataFrame, and read their shape, columns, dtypes and summary statistics before computing anything.",
      keywords: ["pandas", "Series", "DataFrame", "index", "columns", "dtypes", "head", "shape", "info", "describe"],
      exercises: [
        {
          id: "m10-series-e1",
          prompt:
            "Build a DataFrame called `students` from the three lists, with columns in this order: `name`, `course`, `score`. Then print its `shape`, and on the next line the **average score** rounded to 2 decimal places.",
          starter:
            'import pandas as pd\n\nnames = ["Aisha", "Ben", "Chen", "Dara", "Emil", "Farah"]\ncourses = ["Stats", "Maths", "Stats", "Econ", "Maths", "Stats"]\nscores = [78, 91, 64, 85, 70, 88]\n# students = pd.DataFrame(...)\n',
          solution:
            'import pandas as pd\n\nnames = ["Aisha", "Ben", "Chen", "Dara", "Emil", "Farah"]\ncourses = ["Stats", "Maths", "Stats", "Econ", "Maths", "Stats"]\nscores = [78, 91, 64, 85, 70, 88]\nstudents = pd.DataFrame({"name": names, "course": courses, "score": scores})\nprint(students.shape)\nprint(round(students["score"].mean(), 2))',
          hints: [
            "A dict of lists becomes a DataFrame: keys are column names, lists are columns.",
            '`pd.DataFrame({"name": names, "course": courses, "score": scores})`.',
            '`students["score"]` is a Series; `.mean()` averages it. Wrap in `round(..., 2)`.',
          ],
          tests:
            'assert \'students\' in dir(), "Create a DataFrame called students"\nassert students.shape == (6, 3), f"students should have 6 rows and 3 columns, got {students.shape}"\nassert list(students.columns) == ["name", "course", "score"], f"columns should be [\'name\', \'course\', \'score\'] in that order, got {list(students.columns)}"\nassert list(students["score"]) == [78, 91, 64, 85, 70, 88], "the score column should hold the six scores in order"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            'import pandas as pd\n\nnames = ["Aisha", "Ben", "Chen", "Dara", "Emil", "Farah"]\ncourses = ["Stats", "Maths", "Stats", "Econ", "Maths", "Stats"]\nscores = [78, 91, 64, 85, 70, 88]\nstudents = pd.DataFrame({"score": scores, "name": names, "course": courses})\nprint(students.shape)\nprint(round(students["score"].mean(), 2))',
            'import pandas as pd\n\nnames = ["Aisha", "Ben", "Chen", "Dara", "Emil", "Farah"]\ncourses = ["Stats", "Maths", "Stats", "Econ", "Maths", "Stats"]\nscores = [78, 91, 64, 85, 70, 88]\nstudents = pd.DataFrame({"name": names, "course": courses, "score": scores})\nprint(len(students))\nprint(round(students["score"].mean(), 2))',
          ],
        },
        {
          id: "m10-series-e2",
          prompt:
            "Take a first look at `products`. Print three things, one `print` each: the **first two rows**; the **number of rows** as a plain integer; and the **mean price** rounded to 2 decimal places.",
          starter: PRODUCTS,
          solution: PRODUCTS + 'print(products.head(2))\nprint(len(products))\nprint(round(products["price"].mean(), 2))',
          hints: [
            "`head(n)` shows the first n rows — the default is 5, so pass 2.",
            "`len(products)` or `products.shape[0]` is the row count. `products.shape` alone is a tuple, not an integer.",
            'The price column is `products["price"]`; call `.mean()` on it and round.',
          ],
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            PRODUCTS + 'print(products.head())\nprint(len(products))\nprint(round(products["price"].mean(), 2))',
            PRODUCTS + 'print(products.head(2))\nprint(products.shape)\nprint(round(products["price"].mean(), 2))',
          ],
        },
      ],
      quiz: [
        {
          q: "`df.shape` prints `(8, 4)`. How many columns does `df` have?",
          options: ["8", "4", "32", "It depends on the index"],
          answer: 1,
          explain:
            "Shape is (rows, columns), the same convention as NumPy. Eight rows, four columns.",
        },
        {
          q: "What kind of object is `products[\"price\"]`?",
          options: ["A one-column DataFrame", "A Python list", "A NumPy array", "A Series"],
          answer: 3,
          explain:
            "A single column name in square brackets returns a Series with the table's index attached. A list of names — products[[\"price\"]] — would give a DataFrame.",
        },
      ],
    },

    {
      id: "m10-select",
      title: "Selecting, filtering and sorting rows",
      goal: "Pick columns, filter rows with boolean conditions, use loc and iloc deliberately, and sort by several keys.",
      keywords: ["select", "filter", "boolean", "&", "|", "~", "isin", "loc", "iloc", "sort_values", "reset_index"],
      exercises: [
        {
          id: "m10-select-e1",
          prompt:
            "Create `cheap_kitchen`: the rows of `products` whose category is `\"Kitchen\"` **and** whose price is **below 50**, keeping only the `name` and `price` columns (in that order). Print `cheap_kitchen`.",
          starter: PRODUCTS + "# cheap_kitchen = ...\n",
          solution:
            PRODUCTS +
            'cheap_kitchen = products.loc[(products["category"] == "Kitchen") & (products["price"] < 50), ["name", "price"]]\nprint(cheap_kitchen)',
          hints: [
            "Each condition is a mask: `products[\"category\"] == \"Kitchen\"` and `products[\"price\"] < 50`.",
            "Combine them with `&`, with parentheses around each comparison.",
            "`products.loc[mask, [\"name\", \"price\"]]` filters rows and picks columns in one step.",
          ],
          tests:
            'assert \'cheap_kitchen\' in dir(), "Create a DataFrame called cheap_kitchen"\nassert list(cheap_kitchen.columns) == ["name", "price"], f"cheap_kitchen should have just the columns [\'name\', \'price\'], got {list(cheap_kitchen.columns)}"\nassert list(cheap_kitchen["name"]) == ["Ceramic Mug", "Mixing Bowl"], f"the rows should be Ceramic Mug and Mixing Bowl, got {list(cheap_kitchen[\'name\'])}"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            PRODUCTS +
              'cheap_kitchen = products.loc[(products["category"] == "Kitchen") | (products["price"] < 50), ["name", "price"]]\nprint(cheap_kitchen)',
            PRODUCTS +
              'cheap_kitchen = products[(products["category"] == "Kitchen") & (products["price"] < 50)]\nprint(cheap_kitchen)',
          ],
        },
        {
          id: "m10-select-e2",
          prompt:
            "Create `ranked`: `products` sorted by `category` A→Z and, within each category, by `price` **highest first**, with the index renumbered from 0 (old index dropped). Print `ranked`, then on the next line print the `name` in the **first row** of `ranked` using `loc`.",
          starter: PRODUCTS + "# ranked = ...\n",
          solution:
            PRODUCTS +
            'ranked = products.sort_values(["category", "price"], ascending=[True, False]).reset_index(drop=True)\nprint(ranked)\nprint(ranked.loc[0, "name"])',
          hints: [
            "`sort_values` takes a list of keys and a matching list of directions: `ascending=[True, False]`.",
            "After sorting, `reset_index(drop=True)` renumbers the rows and throws the old labels away.",
            '`ranked.loc[0, "name"]` is the name at label 0 — which is the first row only because you reset the index.',
          ],
          tests:
            'assert \'ranked\' in dir(), "Create a DataFrame called ranked"\nassert list(ranked["name"]) == ["Wall Clock", "Desk Lamp", "Throw Cushion", "Chef Knife", "Mixing Bowl", "Ceramic Mug", "Fountain Pen", "Notebook"], f"rows should be sorted by category then price descending, got {list(ranked[\'name\'])}"\nassert list(ranked.index) == list(range(8)), f"the index should be renumbered 0..7, got {list(ranked.index)}"\nassert list(ranked.columns) == ["name", "category", "price", "stock"], "use drop=True so the old index does not become a column"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            PRODUCTS +
              'ranked = products.sort_values(["category", "price"]).reset_index(drop=True)\nprint(ranked)\nprint(ranked.loc[0, "name"])',
            PRODUCTS +
              'ranked = products.sort_values(["category", "price"], ascending=[True, False])\nprint(ranked)\nprint(ranked.loc[0, "name"])',
          ],
        },
      ],
      quiz: [
        {
          q: "Why does `df[(df[\"price\"] > 20) & (df[\"stock\"] > 5)]` need the parentheses?",
          options: [
            "pandas requires parentheses around every column name",
            "They are optional — the expression works either way",
            "`&` binds tighter than `>`, so without them Python computes `20 & df[\"stock\"]` first",
            "Because `&` is a Python keyword",
          ],
          answer: 2,
          explain:
            "Operator precedence: & is evaluated before comparisons. The parentheses make each comparison a complete mask before they are combined.",
        },
        {
          q: "After `df = df.sort_values(\"price\")`, what does `df.loc[0]` return?",
          options: [
            "The first row of the sorted table",
            "The cheapest product",
            "An error — the index is no longer in order",
            "The row whose index label is 0, wherever it now sits",
          ],
          answer: 3,
          explain:
            "loc works by label and the labels travel with their rows when you sort. For position use iloc[0], or reset_index(drop=True) first.",
        },
      ],
    },

    {
      id: "m10-columns",
      title: "New columns, apply and missing values",
      goal: "Derive new columns with vectorised maths, apply and map, use the .str accessor, and find, fill, drop and convert missing or mistyped values.",
      keywords: ["new column", "apply", "map", "str accessor", "isna", "fillna", "dropna", "astype", "value_counts", "NaN", "copy-on-write", "loc assignment"],
      exercises: [
        {
          id: "m10-columns-e1",
          prompt:
            "Add two columns to `orders`: `total` = `qty` × `unit_price`, and `discount` = the rate for the order's `coupon` looked up in `rates`, with **0.0 for orders that have no coupon**. Then print `orders[[\"customer\", \"total\", \"discount\"]]`.",
          starter:
            'import pandas as pd\n\norders = pd.DataFrame({\n    "customer": ["Ana", "Ben", "Chen", "Dev", "Eva"],\n    "qty": [2, 1, 4, 3, 1],\n    "unit_price": [12.5, 80.0, 6.0, 25.0, 32.0],\n    "coupon": ["SPRING", None, "VIP", None, "SPRING"],\n})\nrates = {"SPRING": 0.10, "VIP": 0.25}\n',
          solution:
            'import pandas as pd\n\norders = pd.DataFrame({\n    "customer": ["Ana", "Ben", "Chen", "Dev", "Eva"],\n    "qty": [2, 1, 4, 3, 1],\n    "unit_price": [12.5, 80.0, 6.0, 25.0, 32.0],\n    "coupon": ["SPRING", None, "VIP", None, "SPRING"],\n})\nrates = {"SPRING": 0.10, "VIP": 0.25}\norders["total"] = orders["qty"] * orders["unit_price"]\norders["discount"] = orders["coupon"].map(rates).fillna(0.0)\nprint(orders[["customer", "total", "discount"]])',
          hints: [
            'Multiply two columns and assign to a new name: `orders["total"] = orders["qty"] * orders["unit_price"]`.',
            '`orders["coupon"].map(rates)` swaps each code for its rate — and gives NaN where there is no coupon.',
            "Chain `.fillna(0.0)` onto the mapped Series before assigning it.",
          ],
          tests:
            'assert "total" in orders.columns, "Add a column called total"\nassert list(orders["total"]) == [25.0, 80.0, 24.0, 75.0, 32.0], f"total should be qty * unit_price = [25.0, 80.0, 24.0, 75.0, 32.0], got {list(orders[\'total\'])}"\nassert "discount" in orders.columns, "Add a column called discount"\nassert orders["discount"].isna().sum() == 0, "discount should be 0.0 where there is no coupon, not NaN — use fillna"\nassert list(orders["discount"]) == [0.1, 0.0, 0.25, 0.0, 0.1], f"discount should be [0.1, 0.0, 0.25, 0.0, 0.1], got {list(orders[\'discount\'])}"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            'import pandas as pd\n\norders = pd.DataFrame({\n    "customer": ["Ana", "Ben", "Chen", "Dev", "Eva"],\n    "qty": [2, 1, 4, 3, 1],\n    "unit_price": [12.5, 80.0, 6.0, 25.0, 32.0],\n    "coupon": ["SPRING", None, "VIP", None, "SPRING"],\n})\nrates = {"SPRING": 0.10, "VIP": 0.25}\norders["total"] = orders["qty"] * orders["unit_price"]\norders["discount"] = orders["coupon"].map(rates)\nprint(orders[["customer", "total", "discount"]])',
            'import pandas as pd\n\norders = pd.DataFrame({\n    "customer": ["Ana", "Ben", "Chen", "Dev", "Eva"],\n    "qty": [2, 1, 4, 3, 1],\n    "unit_price": [12.5, 80.0, 6.0, 25.0, 32.0],\n    "coupon": ["SPRING", None, "VIP", None, "SPRING"],\n})\nrates = {"SPRING": 0.10, "VIP": 0.25}\norders["total"] = orders["qty"] + orders["unit_price"]\norders["discount"] = orders["coupon"].map(rates).fillna(0.0)\nprint(orders[["customer", "total", "discount"]])',
          ],
        },
        {
          id: "m10-columns-e2",
          prompt:
            "`survey` has gaps and a mistyped column. Produce a DataFrame called `clean` in which: missing ages are filled with the **median age**; `score` is converted to **integers**; and rows with **no city** are dropped (rows with a city must all be kept). Print `clean.shape`, then on the next line the **mean score** of `clean` rounded to 2 decimal places.",
          starter:
            'import pandas as pd\n\nsurvey = pd.DataFrame({\n    "city": ["KL", "Penang", "Ipoh", "KL", None, "KL"],\n    "age": [29, None, 41, 35, None, 52],\n    "score": ["7", "9", "6", "8", "10", "4"],\n})\n# clean = ...\n',
          solution:
            'import pandas as pd\n\nsurvey = pd.DataFrame({\n    "city": ["KL", "Penang", "Ipoh", "KL", None, "KL"],\n    "age": [29, None, 41, 35, None, 52],\n    "score": ["7", "9", "6", "8", "10", "4"],\n})\nsurvey["age"] = survey["age"].fillna(survey["age"].median())\nsurvey["score"] = survey["score"].astype(int)\nclean = survey.dropna(subset=["city"])\nprint(clean.shape)\nprint(round(clean["score"].mean(), 2))',
          hints: [
            '`survey["age"].median()` ignores the gaps; pass it to `fillna` and assign the result back to the column.',
            '`survey["score"].astype(int)` converts the text; assign it back too.',
            '`dropna(subset=["city"])` drops only rows missing a city. A bare `dropna()` *before* filling ages would also throw away Penang.',
          ],
          tests:
            'assert \'clean\' in dir(), "Create a DataFrame called clean"\nassert clean.shape == (5, 3), f"clean should keep the 5 rows that have a city (and all 3 columns), got {clean.shape}"\nassert clean["age"].isna().sum() == 0, "every age in clean should be filled"\nassert list(clean["age"]) == [29.0, 38.0, 41.0, 35.0, 52.0], f"missing ages should become the median, 38.0 — got {list(clean[\'age\'])}"\nassert clean["score"].dtype.kind == "i", f"score should be an integer column, got dtype {clean[\'score\'].dtype}"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            'import pandas as pd\n\nsurvey = pd.DataFrame({\n    "city": ["KL", "Penang", "Ipoh", "KL", None, "KL"],\n    "age": [29, None, 41, 35, None, 52],\n    "score": ["7", "9", "6", "8", "10", "4"],\n})\nclean = survey.dropna()\nclean["age"] = clean["age"].fillna(clean["age"].median())\nclean["score"] = clean["score"].astype(int)\nprint(clean.shape)\nprint(round(clean["score"].mean(), 2))',
            'import pandas as pd\n\nsurvey = pd.DataFrame({\n    "city": ["KL", "Penang", "Ipoh", "KL", None, "KL"],\n    "age": [29, None, 41, 35, None, 52],\n    "score": ["7", "9", "6", "8", "10", "4"],\n})\nsurvey["age"] = survey["age"].fillna(survey["age"].median())\nsurvey["score"] = survey["score"].astype(float)\nclean = survey.dropna(subset=["city"])\nprint(clean.shape)\nprint(round(clean["score"].mean(), 2))',
          ],
        },
      ],
      quiz: [
        {
          q: "In pandas 3, what does `df[df[\"stock\"] < 10][\"status\"] = \"reorder\"` do to `df`?",
          options: [
            "Sets status to \"reorder\" for the low-stock rows",
            "Sets status to \"reorder\" for every row",
            "Nothing — the filter made a copy, and the table is unchanged",
            "Raises a KeyError because status does not exist yet",
          ],
          answer: 2,
          explain:
            "Chained assignment writes to a temporary copy under copy-on-write. Use one step: df.loc[df[\"stock\"] < 10, \"status\"] = \"reorder\".",
        },
        {
          q: "`s.map({\"SPRING\": 0.1})` — what does a value `\"VIP\"` become?",
          options: ["NaN", "\"VIP\" — unchanged", "0", "An error"],
          answer: 0,
          explain:
            "map with a dict replaces every value by its lookup, and anything not in the dict becomes NaN. Follow it with fillna if you need a default.",
        },
      ],
    },

    {
      id: "m10-groupby",
      title: "groupby and aggregation",
      goal: "Answer per-group questions with split-apply-combine: one aggregate, several at once, two keys, and a sorted report.",
      keywords: ["groupby", "aggregate", "agg", "sum", "mean", "size", "count", "split-apply-combine", "idxmax", "items"],
      exercises: [
        {
          id: "m10-groupby-e1",
          prompt:
            "Print the **total amount per city**, one line per city, **highest total first**, in exactly this format: `City: 123.45` (two decimal places).",
          starter: ORDERS,
          solution:
            ORDERS +
            'by_city = orders.groupby("city")["amount"].sum().sort_values(ascending=False)\nfor city, total in by_city.items():\n    print(f"{city}: {total:.2f}")',
          hints: [
            '`orders.groupby("city")["amount"].sum()` gives one total per city, indexed by city.',
            "Sort that Series by its values: `.sort_values(ascending=False)`.",
            "`.items()` yields (label, value) pairs — loop over them and format with `:.2f`.",
          ],
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            ORDERS +
              'by_city = orders.groupby("city")["amount"].mean().sort_values(ascending=False)\nfor city, total in by_city.items():\n    print(f"{city}: {total:.2f}")',
            ORDERS +
              'by_city = orders.groupby("city")["amount"].sum()\nfor city, total in by_city.items():\n    print(f"{city}: {total:.2f}")',
          ],
        },
        {
          id: "m10-groupby-e2",
          prompt:
            "Build a per-customer report called `summary`: a DataFrame indexed by `customer` with three columns in this order — `orders` (how many orders), `total` (sum of `amount`) and `avg` (mean of `amount`, rounded to 2 decimal places) — sorted by `total`, **highest first**. Print `summary`.",
          starter: ORDERS + "# summary = ...\n",
          solution:
            ORDERS +
            'summary = orders.groupby("customer").agg(\n    orders=("amount", "size"),\n    total=("amount", "sum"),\n    avg=("amount", "mean"),\n).round(2)\nsummary = summary.sort_values("total", ascending=False)\nprint(summary)',
          hints: [
            "The keyword form of `.agg` names the outputs: `orders=(\"amount\", \"size\")`.",
            "Three keyword arguments, one per column: size, sum and mean of `amount`. `.round(2)` tidies the mean.",
            "The result is a DataFrame, so `.sort_values(\"total\", ascending=False)` orders the customers.",
          ],
          tests:
            'assert \'summary\' in dir(), "Create a DataFrame called summary"\nassert list(summary.columns) == ["orders", "total", "avg"], f"columns should be [\'orders\', \'total\', \'avg\'], got {list(summary.columns)}"\nassert list(summary.index) == ["Ben", "Chen", "Ana", "Dev"], f"rows should be sorted by total, highest first: Ben, Chen, Ana, Dev — got {list(summary.index)}"\nassert list(summary["orders"]) == [3, 2, 3, 2], f"orders should count rows per customer: [3, 2, 3, 2], got {list(summary[\'orders\'])}"\nassert [round(float(x), 2) for x in summary["total"]] == [297.9, 220.5, 150.5, 62.0], f"total should be [297.9, 220.5, 150.5, 62.0], got {list(summary[\'total\'])}"\nassert [round(float(x), 2) for x in summary["avg"]] == [99.3, 110.25, 50.17, 31.0], f"avg should be [99.3, 110.25, 50.17, 31.0], got {list(summary[\'avg\'])}"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            ORDERS +
              'summary = orders.groupby("customer").agg(\n    orders=("amount", "size"),\n    total=("amount", "sum"),\n    avg=("amount", "mean"),\n).round(2)\nprint(summary)',
            ORDERS +
              'summary = orders.groupby("customer")["amount"].agg(["size", "sum", "mean"]).round(2)\nsummary = summary.sort_values("sum", ascending=False)\nprint(summary)',
          ],
        },
      ],
      quiz: [
        {
          q: "What does `orders.groupby(\"city\")[\"amount\"].sum()` return?",
          options: [
            "A Series with one total per city, indexed by city",
            "A DataFrame with a city column and an amount column",
            "A dict mapping city to total",
            "The grand total of amount",
          ],
          answer: 0,
          explain:
            "Split by city, sum the amount column, combine: one value per group, with the group key as the index. reset_index() turns it back into a two-column DataFrame.",
        },
        {
          q: "When do `groupby(\"city\").size()` and `groupby(\"city\")[\"amount\"].count()` differ?",
          options: [
            "Never — they are two spellings of the same thing",
            "When the groups have different numbers of rows",
            "When some amounts are missing — count skips NaN, size does not",
            "When amount is a float column",
          ],
          answer: 2,
          explain:
            "size counts rows per group; count counts non-missing values in a column. The same distinction as COUNT(*) versus COUNT(column) in SQL.",
        },
      ],
    },

    {
      id: "m10-merge",
      title: "Combining tables: merge and pivot",
      goal: "Join two tables on a key with inner and left merges, stack tables with concat, and reshape long data into a wide pivot table.",
      keywords: ["merge", "join", "inner", "left", "on", "concat", "pivot_table", "melt", "wide", "long", "aggfunc", "fill_value"],
      exercises: [
        {
          id: "m10-merge-e1",
          prompt:
            "Create `detail` by merging `orders` (on the **left**) with `products` on `product_id`, keeping only orders whose product exists (an inner merge). Add a column `revenue` = `qty` × `price`. Print `detail[[\"name\", \"qty\", \"revenue\"]]`, then on the next line print the total revenue in the form `Total: 443.00`.",
          starter:
            'import pandas as pd\n\norders = pd.DataFrame({\n    "order_id": [1, 2, 3, 4, 5, 6],\n    "product_id": [101, 103, 101, 104, 102, 103],\n    "qty": [2, 1, 1, 3, 4, 2],\n})\nproducts = pd.DataFrame({\n    "product_id": [101, 102, 103, 104, 105],\n    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Wall Clock"],\n    "price": [45.0, 12.5, 6.0, 80.0, 55.0],\n})\n# detail = ...\n',
          solution:
            'import pandas as pd\n\norders = pd.DataFrame({\n    "order_id": [1, 2, 3, 4, 5, 6],\n    "product_id": [101, 103, 101, 104, 102, 103],\n    "qty": [2, 1, 1, 3, 4, 2],\n})\nproducts = pd.DataFrame({\n    "product_id": [101, 102, 103, 104, 105],\n    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Wall Clock"],\n    "price": [45.0, 12.5, 6.0, 80.0, 55.0],\n})\ndetail = pd.merge(orders, products, on="product_id")\ndetail["revenue"] = detail["qty"] * detail["price"]\nprint(detail[["name", "qty", "revenue"]])\nprint(f"Total: {detail[\'revenue\'].sum():.2f}")',
          hints: [
            '`pd.merge(orders, products, on="product_id")` — inner is the default, so unordered products drop out.',
            "Once price sits next to qty, revenue is one vectorised multiply.",
            'Format the sum with an f-string: `f"Total: {detail[\'revenue\'].sum():.2f}"`.',
          ],
          tests:
            'assert \'detail\' in dir(), "Create a DataFrame called detail"\nassert len(detail) == 6, f"an inner merge of 6 orders should give 6 rows, got {len(detail)}"\nassert "revenue" in detail.columns, "Add a column called revenue"\nassert list(detail["revenue"]) == [90.0, 6.0, 45.0, 240.0, 50.0, 12.0], f"revenue should be qty * price in order order: [90.0, 6.0, 45.0, 240.0, 50.0, 12.0], got {list(detail[\'revenue\'])}"\nassert round(float(detail["revenue"].sum()), 2) == 443.0, f"total revenue should be 443.00, got {detail[\'revenue\'].sum()}"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            'import pandas as pd\n\norders = pd.DataFrame({\n    "order_id": [1, 2, 3, 4, 5, 6],\n    "product_id": [101, 103, 101, 104, 102, 103],\n    "qty": [2, 1, 1, 3, 4, 2],\n})\nproducts = pd.DataFrame({\n    "product_id": [101, 102, 103, 104, 105],\n    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Wall Clock"],\n    "price": [45.0, 12.5, 6.0, 80.0, 55.0],\n})\ndetail = pd.merge(products, orders, on="product_id", how="left")\ndetail["revenue"] = detail["qty"] * detail["price"]\nprint(detail[["name", "qty", "revenue"]])\nprint(f"Total: {detail[\'revenue\'].sum():.2f}")',
            'import pandas as pd\n\norders = pd.DataFrame({\n    "order_id": [1, 2, 3, 4, 5, 6],\n    "product_id": [101, 103, 101, 104, 102, 103],\n    "qty": [2, 1, 1, 3, 4, 2],\n})\nproducts = pd.DataFrame({\n    "product_id": [101, 102, 103, 104, 105],\n    "name": ["Desk Lamp", "Ceramic Mug", "Notebook", "Chef Knife", "Wall Clock"],\n    "price": [45.0, 12.5, 6.0, 80.0, 55.0],\n})\ndetail = pd.merge(orders, products, on="product_id")\ndetail["revenue"] = detail["qty"] + detail["price"]\nprint(detail[["name", "qty", "revenue"]])\nprint(f"Total: {detail[\'revenue\'].sum():.2f}")',
          ],
        },
        {
          id: "m10-merge-e2",
          prompt:
            "`sales` is long: one row per sale. Create `wide` with `pd.pivot_table`: one row per `shop`, one column per `quarter`, each cell the **total** `units` for that shop and quarter, and **0** where a shop made no sales in a quarter. Print `wide`, then on the next line print the value for `Central` in `Q1`.",
          starter:
            'import pandas as pd\n\nsales = pd.DataFrame({\n    "shop": ["Central", "Central", "Harbour", "Harbour", "Uptown", "Central", "Uptown"],\n    "quarter": ["Q1", "Q1", "Q1", "Q2", "Q2", "Q3", "Q3"],\n    "units": [8, 6, 5, 7, 9, 4, 3],\n})\n# wide = ...\n',
          solution:
            'import pandas as pd\n\nsales = pd.DataFrame({\n    "shop": ["Central", "Central", "Harbour", "Harbour", "Uptown", "Central", "Uptown"],\n    "quarter": ["Q1", "Q1", "Q1", "Q2", "Q2", "Q3", "Q3"],\n    "units": [8, 6, 5, 7, 9, 4, 3],\n})\nwide = pd.pivot_table(sales, values="units", index="shop", columns="quarter", aggfunc="sum", fill_value=0)\nprint(wide)\nprint(wide.loc["Central", "Q1"])',
          hints: [
            '`pd.pivot_table(sales, values="units", index="shop", columns="quarter", ...)` sets the shape.',
            'The default aggfunc is the mean — Central has two Q1 sales, so say `aggfunc="sum"`.',
            "`fill_value=0` replaces the NaN for combinations that never happened. Read one cell with `wide.loc[\"Central\", \"Q1\"]`.",
          ],
          tests:
            'assert \'wide\' in dir(), "Create a DataFrame called wide"\nassert list(wide.index) == ["Central", "Harbour", "Uptown"], f"rows should be the three shops, got {list(wide.index)}"\nassert list(wide.columns) == ["Q1", "Q2", "Q3"], f"columns should be the three quarters, got {list(wide.columns)}"\nassert int(wide.isna().sum().sum()) == 0, "empty combinations should be 0, not NaN — use fill_value=0"\nassert wide.loc["Central", "Q1"] == 14, f"Central Q1 should be the total 8 + 6 = 14, got {wide.loc[\'Central\', \'Q1\']} — use aggfunc=\'sum\'"\nassert wide.loc["Uptown", "Q1"] == 0, f"Uptown made no Q1 sales, so the cell should be 0, got {wide.loc[\'Uptown\', \'Q1\']}"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            'import pandas as pd\n\nsales = pd.DataFrame({\n    "shop": ["Central", "Central", "Harbour", "Harbour", "Uptown", "Central", "Uptown"],\n    "quarter": ["Q1", "Q1", "Q1", "Q2", "Q2", "Q3", "Q3"],\n    "units": [8, 6, 5, 7, 9, 4, 3],\n})\nwide = pd.pivot_table(sales, values="units", index="shop", columns="quarter", fill_value=0)\nprint(wide)\nprint(wide.loc["Central", "Q1"])',
            'import pandas as pd\n\nsales = pd.DataFrame({\n    "shop": ["Central", "Central", "Harbour", "Harbour", "Uptown", "Central", "Uptown"],\n    "quarter": ["Q1", "Q1", "Q1", "Q2", "Q2", "Q3", "Q3"],\n    "units": [8, 6, 5, 7, 9, 4, 3],\n})\nwide = pd.pivot_table(sales, values="units", index="shop", columns="quarter", aggfunc="sum")\nprint(wide)\nprint(wide.loc["Central", "Q1"])',
          ],
        },
      ],
      quiz: [
        {
          q: "`orders` has 6 rows and `products` has 5, one of which was never ordered. How many rows does `pd.merge(orders, products, on=\"product_id\")` return?",
          options: ["5", "7", "6", "11"],
          answer: 2,
          explain:
            "An inner merge keeps a row for every match. Each of the 6 orders matches exactly one product; the unordered product has nothing to match and is dropped. A left merge from products would give 7 rows (the extra one full of NaN).",
        },
        {
          q: "If you leave out `aggfunc`, what does `pivot_table` do when several rows land in the same cell?",
          options: ["Sums them", "Averages them", "Keeps the first one", "Raises an error"],
          answer: 1,
          explain:
            "The default aggregation is the mean. For totals you must say aggfunc=\"sum\" — a classic silent mistake in sales reports.",
        },
      ],
    },

    {
      id: "m10-capstone",
      title: "Capstone: a small end-to-end analysis",
      goal: "Take a messy pair of CSV files through load, clean, merge, aggregate and a printed summary — the workflow of every analysis job.",
      keywords: ["capstone", "read_csv", "clean", "drop_duplicates", "strip", "merge", "revenue", "groupby", "report", "summary", "end-to-end"],
      exercises: [
        {
          id: "m10-capstone-e1",
          prompt:
            "`orders.csv` and `products.csv` are in the working directory and the starter loads them. **Clean `orders`** so that: exact duplicate rows are removed; `customer` has no surrounding spaces and is in Title Case (`\"ben\"` and `\"Ben \"` become `\"Ben\"`); rows with a missing `qty` are dropped; and `qty` is an integer column. Then print two lines in exactly this form: `Orders: 10` (the number of rows) and `Customers: 4` (the number of distinct customers).",
          starter: 'import pandas as pd\n\norders = pd.read_csv("orders.csv")\nproducts = pd.read_csv("products.csv")\n# clean orders here\n',
          solution:
            'import pandas as pd\n\norders = pd.read_csv("orders.csv")\nproducts = pd.read_csv("products.csv")\norders = orders.drop_duplicates()\norders["customer"] = orders["customer"].str.strip().str.title()\norders = orders.dropna(subset=["qty"])\norders["qty"] = orders["qty"].astype(int)\nprint(f"Orders: {len(orders)}")\nprint(f"Customers: {orders[\'customer\'].nunique()}")',
          hints: [
            "Look first: `orders[\"customer\"].unique()` and `orders.duplicated().sum()` show what needs fixing.",
            '`drop_duplicates()`, then `.str.strip().str.title()` on the customer column, then `dropna(subset=["qty"])`.',
            '`astype(int)` only works once the gaps are gone. `nunique()` counts distinct values.',
          ],
          setup: SHOP_CSV,
          tests:
            'assert \'orders\' in dir() and \'products\' in dir(), "Keep both DataFrames, orders and products"\nassert products.shape == (6, 4), "products should be loaded untouched: 6 rows, 4 columns"\nassert len(orders) == 10, f"after cleaning there should be 10 orders (12 minus one duplicate and one missing qty), got {len(orders)}"\nassert sorted(orders["customer"].unique()) == ["Ana", "Ben", "Chen", "Dev"], f"customers should be exactly Ana, Ben, Chen, Dev — got {sorted(orders[\'customer\'].unique())}"\nassert orders["qty"].isna().sum() == 0, "drop the row with a missing qty"\nassert orders["qty"].dtype.kind == "i", f"qty should be an integer column, got {orders[\'qty\'].dtype}"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            'import pandas as pd\n\norders = pd.read_csv("orders.csv")\nproducts = pd.read_csv("products.csv")\norders = orders.drop_duplicates()\norders["customer"] = orders["customer"].str.title()\norders = orders.dropna(subset=["qty"])\norders["qty"] = orders["qty"].astype(int)\nprint(f"Orders: {len(orders)}")\nprint(f"Customers: {orders[\'customer\'].nunique()}")',
            'import pandas as pd\n\norders = pd.read_csv("orders.csv")\nproducts = pd.read_csv("products.csv")\norders["customer"] = orders["customer"].str.strip().str.title()\norders = orders.dropna(subset=["qty"])\norders["qty"] = orders["qty"].astype(int)\nprint(f"Orders: {len(orders)}")\nprint(f"Customers: {orders[\'customer\'].nunique()}")',
          ],
        },
        {
          id: "m10-capstone-e2",
          prompt:
            "The starter loads and cleans the data. Now: create `detail` by inner-merging `orders` (left) with `products` on `product_id`, and add `revenue` = `qty` × `price`. Create `by_category` — total revenue per category, **highest first** — and print one line per category as `Category: 123.45`. Then create `by_customer` — total revenue per customer, highest first — and print the **top two** customers as `1. Name: 123.45` and `2. Name: 123.45`.",
          starter: CLEAN_ORDERS + "\n# detail = ...\n",
          solution:
            CLEAN_ORDERS +
            '\ndetail = pd.merge(orders, products, on="product_id")\ndetail["revenue"] = detail["qty"] * detail["price"]\n\nby_category = detail.groupby("category")["revenue"].sum().sort_values(ascending=False)\nfor category, revenue in by_category.items():\n    print(f"{category}: {revenue:.2f}")\n\nby_customer = detail.groupby("customer")["revenue"].sum().sort_values(ascending=False)\nfor rank, (customer, revenue) in enumerate(by_customer.head(2).items(), start=1):\n    print(f"{rank}. {customer}: {revenue:.2f}")',
          hints: [
            '`pd.merge(orders, products, on="product_id")` brings price and category next to every order.',
            '`detail.groupby("category")["revenue"].sum().sort_values(ascending=False)` is the ranking; loop over `.items()` to print it.',
            "For the top two: `by_customer.head(2).items()` inside `enumerate(..., start=1)` gives the rank and the pair.",
          ],
          setup: SHOP_CSV,
          tests:
            'assert \'detail\' in dir(), "Create a DataFrame called detail"\nassert len(detail) == 10, f"detail should have one row per clean order (10), got {len(detail)}"\nassert "revenue" in detail.columns, "Add a column called revenue"\nassert round(float(detail["revenue"].sum()), 2) == 672.0, f"total revenue should be 672.00, got {detail[\'revenue\'].sum()}"\nassert \'by_category\' in dir(), "Create a Series called by_category"\nassert list(by_category.index) == ["Kitchen", "Home", "Stationery"], f"by_category should be sorted highest first: Kitchen, Home, Stationery — got {list(by_category.index)}"\nassert round(float(by_category["Kitchen"]), 2) == 395.0, f"Kitchen revenue should be 395.00, got {by_category[\'Kitchen\']}"\nassert \'by_customer\' in dir(), "Create a Series called by_customer"\nassert list(by_customer.index) == ["Ana", "Dev", "Ben", "Chen"], f"by_customer should be sorted highest first: Ana, Dev, Ben, Chen — got {list(by_customer.index)}"\nassert round(float(by_customer["Ana"]), 2) == 262.0, f"Ana should total 262.00, got {by_customer[\'Ana\']}"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            CLEAN_ORDERS +
              '\ndetail = pd.merge(orders, products, on="product_id")\ndetail["revenue"] = detail["qty"] * detail["price"]\n\nby_category = detail.groupby("category")["revenue"].mean().sort_values(ascending=False)\nfor category, revenue in by_category.items():\n    print(f"{category}: {revenue:.2f}")\n\nby_customer = detail.groupby("customer")["revenue"].sum().sort_values(ascending=False)\nfor rank, (customer, revenue) in enumerate(by_customer.head(2).items(), start=1):\n    print(f"{rank}. {customer}: {revenue:.2f}")',
            CLEAN_ORDERS +
              '\ndetail = pd.merge(orders, products, on="product_id")\ndetail["revenue"] = detail["qty"] * detail["price"]\n\nby_category = detail.groupby("category")["revenue"].sum().sort_values(ascending=False)\nfor category, revenue in by_category.items():\n    print(f"{category}: {revenue:.2f}")\n\nby_customer = detail.groupby("customer")["revenue"].sum()\nfor rank, (customer, revenue) in enumerate(by_customer.head(2).items(), start=1):\n    print(f"{rank}. {customer}: {revenue:.2f}")',
          ],
        },
        {
          id: "m10-capstone-e3",
          prompt:
            "The starter has the clean, merged `detail` table with `revenue`. Compute `by_category` and `by_customer` (total revenue, highest first) and print the final summary — **six lines, exactly this format**, every number computed from the data:\n\n```text\nOrders: 10\nRevenue: 672.00\nAverage order: 67.20\nTop category: Kitchen (395.00)\nTop customer: Ana (262.00)\nTop category share: 58.8%\n```\n\n`Average order` is total revenue divided by the number of orders. `Top category share` is the top category's revenue as a percentage of total revenue, one decimal place.",
          starter:
            CLEAN_ORDERS +
            '\ndetail = pd.merge(orders, products, on="product_id")\ndetail["revenue"] = detail["qty"] * detail["price"]\n\n# by_category = ...\n# by_customer = ...\n',
          solution:
            CLEAN_ORDERS +
            '\ndetail = pd.merge(orders, products, on="product_id")\ndetail["revenue"] = detail["qty"] * detail["price"]\n\nby_category = detail.groupby("category")["revenue"].sum().sort_values(ascending=False)\nby_customer = detail.groupby("customer")["revenue"].sum().sort_values(ascending=False)\ntotal = detail["revenue"].sum()\n\nprint(f"Orders: {len(detail)}")\nprint(f"Revenue: {total:.2f}")\nprint(f"Average order: {detail[\'revenue\'].mean():.2f}")\nprint(f"Top category: {by_category.index[0]} ({by_category.iloc[0]:.2f})")\nprint(f"Top customer: {by_customer.index[0]} ({by_customer.iloc[0]:.2f})")\nprint(f"Top category share: {by_category.iloc[0] / total:.1%}")',
          hints: [
            "Two groupby-sum-sort lines give the rankings; `detail[\"revenue\"].sum()` and `.mean()` give the totals.",
            "The first label of a sorted Series is `.index[0]` and its value is `.iloc[0]`.",
            "`:.2f` formats money; `:.1%` turns a fraction like 0.5878 into `58.8%`.",
          ],
          setup: SHOP_CSV,
          tests:
            'assert \'by_category\' in dir(), "Create a Series called by_category"\nassert by_category.index[0] == "Kitchen", f"the top category should be Kitchen, got {by_category.index[0]}"\nassert round(float(by_category.iloc[0]), 2) == 395.0, f"Kitchen revenue should be 395.00, got {by_category.iloc[0]}"\nassert \'by_customer\' in dir(), "Create a Series called by_customer"\nassert list(by_customer.index) == ["Ana", "Dev", "Ben", "Chen"], f"by_customer should be sorted highest first: Ana, Dev, Ben, Chen — got {list(by_customer.index)}"\nassert round(float(by_customer.iloc[0]), 2) == 262.0, f"Ana should total 262.00, got {by_customer.iloc[0]}"',
          expectOutput: true,
          packages: ["numpy", "pandas"],
          wrong: [
            CLEAN_ORDERS +
              '\ndetail = pd.merge(orders, products, on="product_id")\ndetail["revenue"] = detail["qty"] * detail["price"]\n\nby_category = detail.groupby("category")["revenue"].mean().sort_values(ascending=False)\nby_customer = detail.groupby("customer")["revenue"].sum().sort_values(ascending=False)\ntotal = detail["revenue"].sum()\n\nprint(f"Orders: {len(detail)}")\nprint(f"Revenue: {total:.2f}")\nprint(f"Average order: {detail[\'revenue\'].mean():.2f}")\nprint(f"Top category: {by_category.index[0]} ({by_category.iloc[0]:.2f})")\nprint(f"Top customer: {by_customer.index[0]} ({by_customer.iloc[0]:.2f})")\nprint(f"Top category share: {by_category.iloc[0] / total:.1%}")',
            CLEAN_ORDERS +
              '\ndetail = pd.merge(orders, products, on="product_id")\ndetail["revenue"] = detail["qty"] * detail["price"]\n\nby_category = detail.groupby("category")["revenue"].sum().sort_values(ascending=False)\nby_customer = detail.groupby("customer")["revenue"].sum()\ntotal = detail["revenue"].sum()\n\nprint(f"Orders: {len(detail)}")\nprint(f"Revenue: {total:.2f}")\nprint(f"Average order: {detail[\'revenue\'].mean():.2f}")\nprint(f"Top category: {by_category.index[0]} ({by_category.iloc[0]:.2f})")\nprint(f"Top customer: {by_customer.index[0]} ({by_customer.iloc[0]:.2f})")\nprint(f"Top category share: {by_category.iloc[0] / total:.1%}")',
          ],
        },
      ],
      quiz: [
        {
          q: "`orders.csv` has a blank `qty` on one row. After `pd.read_csv`, what is the `qty` column's dtype?",
          options: ["int64", "float64", "str", "object"],
          answer: 1,
          explain:
            "NaN is a float, so a single gap turns an integer column into floats. Drop or fill the gap, then astype(int) to get integers back.",
        },
        {
          q: "Which order of steps gives a correct revenue total?",
          options: [
            "Merge → groupby → clean",
            "Groupby → clean → merge",
            "The order does not matter for a sum",
            "Clean (dedupe, strip names, drop gaps) → merge → multiply → groupby",
          ],
          answer: 3,
          explain:
            "A duplicate row doubles one order and a trailing space splits one customer into two groups. Every number downstream inherits the cleaning, so it comes first.",
        },
      ],
    },
  ],
};
