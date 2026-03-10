package com.daw.postmanBack.infrastructure.controller;

import com.daw.postmanBack.domain.dto.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@CrossOrigin
@RestController
@RequestMapping("/api/users")
public class UserController {

    private List<User> userDataBase = new ArrayList<>();

    public UserController() {
        userDataBase.add(new User(1L, "ascasomario", 24));
        userDataBase.add(new User(2L, "regidorjavi", 23));
        userDataBase.add(new User(3L, "remusdavid", 25));
        userDataBase.add(new User(3L, "suarezcesar", 24));
        userDataBase.add(new User(3L, "bellónsanti", 24));
        userDataBase.add(new User(3L, "victoriaalvaro", 24));
        userDataBase.add(new User(3L, "perezalberto", 25));
        userDataBase.add(new User(3L, "candeladrian", 25));
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        if (userDataBase.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(userDataBase);
    }

    @PostMapping
    public ResponseEntity<?> createNewUser(@RequestBody User newUser) {
        if (newUser.getUsername() == null || newUser.getUsername().trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error: Username is mandatory.");
        }

        newUser.setId((long) (userDataBase.size() + 1));
        userDataBase.add(newUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        boolean removed = userDataBase.removeIf(user -> user.getId().equals(id));

        if (removed) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error: Cannot delete. User ID " + id + " doesn't exist.");
        }
    }

}
