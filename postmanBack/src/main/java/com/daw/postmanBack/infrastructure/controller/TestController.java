package com.daw.postmanBack.infrastructure.controller;

import com.daw.postmanBack.domain.dto.TestItem;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@CrossOrigin // Recuerda: Esto abre la puerta a tu Postman
@RestController
@RequestMapping("/api/items")
public class TestController {

    private List<TestItem> database = new ArrayList<>();

    public TestController() {
        database.add(new TestItem(1L, "Laptop", "High end laptop"));
        database.add(new TestItem(2L, "Mouse", "Wireless mouse"));
    }

    // 1. GET ALL -> Puede devolver 200 o 204
    @GetMapping
    public ResponseEntity<List<TestItem>> getAllItems() {
        if (database.isEmpty()) {
            // 204 NO CONTENT: La petición fue bien, pero la lista está vacía.
            // Es muy elegante usar esto en lugar de devolver una lista vacía [].
            return ResponseEntity.noContent().build();
        }
        // 200 OK: Aquí tienes los datos.
        return ResponseEntity.ok(database);
    }

    // 2. GET BY ID -> Puede devolver 200 o 404
    @GetMapping("/{id}")
    public ResponseEntity<?> getItemById(@PathVariable Long id) {
        Optional<TestItem> item = database.stream()
                .filter(i -> i.getId().equals(id))
                .findFirst();

        if (item.isPresent()) {
            // 200 OK
            return ResponseEntity.ok(item.get());
        } else {
            // 404 NOT FOUND: No existe ese ID.
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Item with ID " + id + " not found.");
        }
    }

    // 3. POST -> Devuelve 201 o 400
    @PostMapping
    public ResponseEntity<?> createItem(@RequestBody TestItem newItem) {
        // Validación simple: Si no tiene nombre, devolvemos error
        if (newItem.getName() == null || newItem.getName().trim().isEmpty()) {
            // 400 BAD REQUEST: El cliente ha enviado datos mal formados.
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: Name is mandatory.");
        }

        newItem.setId((long) (database.size() + 1));
        database.add(newItem);

        // 201 CREATED: Se ha creado el recurso correctamente.
        return ResponseEntity.status(HttpStatus.CREATED).body(newItem);
    }

    // 4. PUT -> Devuelve 200 o 404
    @PutMapping("/{id}")
    public ResponseEntity<?> updateItem(@PathVariable Long id, @RequestBody TestItem updatedInfo) {
        Optional<TestItem> itemFound = database.stream()
                .filter(i -> i.getId().equals(id))
                .findFirst();

        if (itemFound.isPresent()) {
            TestItem item = itemFound.get();
            item.setName(updatedInfo.getName());
            item.setDescription(updatedInfo.getDescription());
            // 200 OK
            return ResponseEntity.ok(item);
        } else {
            // 404 NOT FOUND
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Cannot update. ID " + id + " not found.");
        }
    }

    // 5. DELETE -> Devuelve 204 o 404
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteItem(@PathVariable Long id) {
        boolean removed = database.removeIf(i -> i.getId().equals(id));

        if (removed) {
            // 204 NO CONTENT: Se borró bien, no hace falta devolver nada más.
            return ResponseEntity.noContent().build();
        } else {
            // 404 NOT FOUND
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("Error: Cannot delete. ID " + id + " doesn't exist.");
        }
    }

//    ¿Cómo probar estos códigos en tu Postman Web?
//    Para el 201 (Created): Envía un POST con un JSON válido. Verás el status en verde.
//    Para el 400 (Bad Request): Envía un POST con un JSON vacío o sin nombre: { "description": "Hola" }. ¡Bam! Error 400.
//    Para el 404 (Not Found): Intenta hacer GET o DELETE a una ID inventada: /api/items/999.
//    Para el 204 (No Content): Crea un botón en tu front o usa la consola para borrar todos los items, y luego haz un GET general.

}
