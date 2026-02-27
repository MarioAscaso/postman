package com.daw.postmanBack.infrastructure.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin
@RestController
@RequestMapping("/api/config")
public class ConfigController {

    @Value("${api.key:}")
    private String apiKey;

    @GetMapping("/apikey")
    public ResponseEntity<Map<String, String>> getApiKey() {
        Map<String, String> response = new HashMap<>();
        response.put("apiKey", apiKey);
        return ResponseEntity.ok(response);
    }
}