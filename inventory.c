/*
 * Inventory Management System using Singly Linked List
 * Beginner-friendly DSA project in C.
 * Compile: gcc inventory.c -o inventory
 * Run:     ./inventory   (Windows: inventory.exe)
 */
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

typedef struct Product {
    int id;
    char name[50];
    int quantity;
    float price;
    struct Product *next;
} Product;

Product *head = NULL;

Product *findProduct(int id) {
    Product *current = head;
    while (current != NULL) {
        if (current->id == id) return current;
        current = current->next;
    }
    return NULL;
}

void addProduct(void) {
    Product *node = (Product *)malloc(sizeof(Product));
    if (node == NULL) {
        printf("Memory allocation failed.\\n");
        return;
    }

    printf("Enter product ID: ");
    if (scanf("%d", &node->id) != 1) { free(node); return; }
    if (findProduct(node->id) != NULL) {
        printf("That product ID already exists.\\n");
        free(node);
        return;
    }

    printf("Enter product name (one word): ");
    scanf("%49s", node->name);
    printf("Enter quantity: ");
    scanf("%d", &node->quantity);
    printf("Enter price: ");
    scanf("%f", &node->price);

    if (node->quantity < 0 || node->price < 0) {
        printf("Quantity and price cannot be negative.\\n");
        free(node);
        return;
    }

    node->next = head;
    head = node;
    printf("Product added successfully.\\n");
}

void displayProducts(void) {
    Product *current = head;
    if (current == NULL) {
        printf("\\nInventory is empty.\\n");
        return;
    }

    printf("\\n%-8s %-20s %-10s %-10s\\n", "ID", "Name", "Quantity", "Price");
    printf("----------------------------------------------------\\n");
    while (current != NULL) {
        printf("%-8d %-20s %-10d Rs.%-7.2f\\n",
               current->id, current->name, current->quantity, current->price);
        current = current->next;
    }
}

void searchProduct(void) {
    int id;
    printf("Enter product ID to search: ");
    if (scanf("%d", &id) != 1) return;
    Product *p = findProduct(id);
    if (p == NULL) printf("Product not found.\\n");
    else printf("Found: ID=%d, Name=%s, Quantity=%d, Price=Rs.%.2f\\n",
                p->id, p->name, p->quantity, p->price);
}

void updateProduct(void) {
    int id, quantity;
    float price;
    printf("Enter product ID to update: ");
    if (scanf("%d", &id) != 1) return;
    Product *p = findProduct(id);
    if (p == NULL) {
        printf("Product not found.\\n");
        return;
    }
    printf("Enter new quantity: ");
    scanf("%d", &quantity);
    printf("Enter new price: ");
    scanf("%f", &price);
    if (quantity < 0 || price < 0) {
        printf("Quantity and price cannot be negative.\\n");
        return;
    }
    p->quantity = quantity;
    p->price = price;
    printf("Product updated successfully.\\n");
}

void deleteProduct(void) {
    int id;
    printf("Enter product ID to delete: ");
    if (scanf("%d", &id) != 1) return;

    Product *current = head, *previous = NULL;
    while (current != NULL && current->id != id) {
        previous = current;
        current = current->next;
    }
    if (current == NULL) {
        printf("Product not found.\\n");
        return;
    }
    if (previous == NULL) head = current->next;
    else previous->next = current->next;
    free(current);
    printf("Product deleted successfully.\\n");
}

void showSummary(void) {
    Product *current = head;
    int products = 0, units = 0, lowStock = 0;
    float value = 0;
    while (current != NULL) {
        products++;
        units += current->quantity;
        value += current->quantity * current->price;
        if (current->quantity <= 5) lowStock++;
        current = current->next;
    }
    printf("\\n--- Inventory Summary ---\\n");
    printf("Product types : %d\\n", products);
    printf("Total units   : %d\\n", units);
    printf("Low-stock items (5 or less): %d\\n", lowStock);
    printf("Inventory value: Rs.%.2f\\n", value);
}

void freeInventory(void) {
    Product *current = head;
    while (current != NULL) {
        Product *next = current->next;
        free(current);
        current = next;
    }
}

int main(void) {
    int choice;
    do {
        printf("\\n====== INVENTORY MANAGEMENT ======\\n");
        printf("1. Add product\\n");
        printf("2. View all products\\n");
        printf("3. Search product\\n");
        printf("4. Update quantity and price\\n");
        printf("5. Delete product\\n");
        printf("6. Inventory summary\\n");
        printf("0. Exit\\n");
        printf("Choose an option: ");

        if (scanf("%d", &choice) != 1) {
            printf("Invalid input. Exiting.\\n");
            break;
        }

        switch (choice) {
            case 1: addProduct(); break;
            case 2: displayProducts(); break;
            case 3: searchProduct(); break;
            case 4: updateProduct(); break;
            case 5: deleteProduct(); break;
            case 6: showSummary(); break;
            case 0: printf("Thank you for using Inventory Management.\\n"); break;
            default: printf("Invalid option. Try again.\\n");
        }
    } while (choice != 0);

    freeInventory();
    return 0;
}
