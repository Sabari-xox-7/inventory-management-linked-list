# Stockroom — Inventory Management using Linked List in C

A beginner-friendly Data Structures and Algorithms (DSA) project. It demonstrates how a **singly linked list** can store and manage products. The repository also includes a simple responsive browser website so the project is easy to demonstrate.

## Project overview

Small shops need to know which products they have, how many units remain, and the value of their stock. Stockroom lets a user add, view, search, update and delete product records, and see a basic stock summary.

### Features
- Add a product with a unique ID, name, quantity and unit price
- Display all products
- Search for a product by ID
- Update quantity and price
- Delete a product
- Show total product types, total units, low-stock count and stock value
- Browser demo: responsive dashboard, search/filter, add/edit/delete, summary cards and CSV export
- Website demo data is saved in the browser using `localStorage`

## Important: how the C program and website relate

`inventory.c` is the **DSA implementation**. It stores products in a singly linked list in memory and uses C functions to manage nodes.

`index.html`, `style.css` and `app.js` are a separate **front-end demonstration**. The website uses JavaScript and browser local storage, so it runs without a server. It is not connected to the C program. This is intentional to keep the project beginner-friendly; both demonstrate the same inventory-management idea. In a future version, you could connect the C program to a web API.

## Files

```text
inventory-management-linked-list/
├── inventory.c     # Main DSA project in C
├── index.html      # Website layout
├── style.css       # Website styling and responsive layout
├── app.js          # Website interactions and local browser storage
├── README.md       # Project explanation and setup
└── .gitignore      # Ignore compiled files
```

## Run the C program

### Windows (GCC / MinGW)
1. Install a C compiler such as GCC (MinGW-w64).
2. Open this folder in VS Code.
3. Open the terminal in VS Code.
4. Compile:

   ```bash
   gcc inventory.c -o inventory.exe
   ```

5. Run:

   ```bash
   .\inventory.exe
   ```

### Linux / macOS
```bash
gcc inventory.c -o inventory
./inventory
```

The C version stores records in memory while it runs. When you exit, the list is freed; it does not save records to a file.

## Run the website

1. Open `index.html` in a browser, or open the folder in VS Code and use the **Live Server** extension.
2. Try adding, editing, searching, filtering and deleting products.
3. Website changes persist in that browser using local storage. The sample products are loaded the first time.

## Linked-list concept

Each node contains:
- `id`: unique product ID
- `name`: product name
- `quantity`: units in stock
- `price`: price per unit
- `next`: pointer to the next product node

The `head` pointer points to the first node. Adding inserts a node at the beginning. Searching and displaying traverse nodes until the end (`NULL`). Deleting reconnects the previous node to the next node and releases memory using `free()`.

### Time complexity

| Operation | Time complexity | Why |
|---|---:|---|
| Add product at head | O(1), excluding duplicate-ID check | Insertion itself only changes pointers |
| Search by ID | O(n) | May check every node |
| Display all products | O(n) | Visits each node |
| Update by ID | O(n) | First searches for the node |
| Delete by ID | O(n) | Searches for the node |

Because the program checks whether an ID already exists, the full add operation is O(n).

## Example presentation explanation

“My project is an Inventory Management System using a singly linked list in C. Each product is stored as a node containing product ID, name, quantity, price and a pointer to the next node. The program supports insertion, traversal, searching, updating and deletion. I also created a simple responsive website to demonstrate the same inventory workflow in a user-friendly dashboard. The website is a separate front-end demo; the linked-list implementation is in the C program.”

## Suggested GitHub repository details

**Repository name:** `inventory-management-linked-list`

**Short description:** `Beginner-friendly inventory management DSA project in C using a singly linked list, with a simple responsive website demo.`

**Topics:** `c`, `data-structures`, `linked-list`, `inventory-management`, `beginner-project`, `html`, `css`, `javascript`

## Limitations / possible future improvements
- C program currently keeps data only in memory.
- Browser demo uses local storage and is not connected to the C program.
- Beginner extensions: save/load C data from a file, add categories, add a low-stock warning, or later connect a backend API.
