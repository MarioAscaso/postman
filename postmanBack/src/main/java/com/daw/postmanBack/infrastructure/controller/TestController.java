package com.daw.postmanBack.infrastructure.controller;

import com.daw.postmanBack.domain.dto.TestItem;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin
@RestController
@RequestMapping("/api/items")
public class TestController {

    private List<TestItem> database = new ArrayList<>();

    public TestController() {
        database.add(new TestItem(1L, "Laptop", "High end laptop"));
        database.add(new TestItem(2L, "Mouse", "Wireless mouse"));
    }

    @GetMapping
    public ResponseEntity<List<TestItem>> getAllItems() {
        if (database.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(database);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        Optional<TestItem> item = database.stream()
                .filter(i -> i.getId().equals(id))
                .findFirst();

        if (item.isPresent()) {
            return ResponseEntity.ok(item.get());
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Item with ID " + id + " not found.");
        }
    }

    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody TestItem newItem) {
        if (newItem.getName() == null || newItem.getName().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: Name is mandatory.");
        }

        newItem.setId((long) (database.size() + 1));
        database.add(newItem);

        return ResponseEntity.status(HttpStatus.CREATED).body(newItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody TestItem updatedInfo) {
        Optional<TestItem> itemFound = database.stream()
                .filter(i -> i.getId().equals(id))
                .findFirst();

        if (itemFound.isPresent()) {
            TestItem item = itemFound.get();
            item.setName(updatedInfo.getName());
            item.setDescription(updatedInfo.getDescription());
            return ResponseEntity.ok(item);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Cannot update. ID " + id + " not found.");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        boolean removed = database.removeIf(i -> i.getId().equals(id));

        if (removed) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Cannot delete. ID " + id + " doesn't exist.");
        }
    }
}
