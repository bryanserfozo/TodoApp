package com.bofa.models;

import org.springframework.stereotype.Component;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "todos")
public class Todo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private String description;

    private boolean isComplete;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User owner;


    public Todo() {
    }

    public Todo(String description, boolean isComplete, User owner) {
        this.description = description;
        this.isComplete = isComplete;
        this.owner = owner;
    }

    public Todo(int id, String description, boolean isComplete, User owner) {
        this.id = id;
        this.description = description;
        this.isComplete = isComplete;
        this.owner = owner;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public boolean isComplete() {
        return isComplete;
    }

    public void setComplete(boolean complete) {
        isComplete = complete;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Todo todo = (Todo) o;
        return id == todo.id && isComplete == todo.isComplete && Objects.equals(description, todo.description) && Objects.equals(owner, todo.owner);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, description, isComplete, owner);
    }

    @Override
    public String toString() {
        return "Todo{" +
                "id=" + id +
                ", description='" + description + '\'' +
                ", isComplete=" + isComplete +
                '}';
    }
}
