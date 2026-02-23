package com.daw.postmanBack.domain.dto;

public class User {

    private Long id;
    private String username;
    private int age;

    public User(Long id, String username, int age) {
        this.id = id;
        this.username = username;
        this.age = age;
    }

    public Long getId() {return id;}
    public String getUsername() {return username;}
    public int getAge() {return age;}
    public void setId(Long id) {this.id = id;}
    public void setUsername(String username) {this.username = username;}
    public void setAge(int age) {this.age = age;}
}
