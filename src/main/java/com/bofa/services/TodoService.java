package com.bofa.services;

import com.bofa.repos.TodoRepository;
import com.bofa.repos.UserRepository;
import com.bofa.models.Todo;
import com.bofa.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class TodoService {

    private final TodoRepository todoRepo;

    private final UserRepository userRepo;

    @Autowired
    public TodoService(TodoRepository todoRepo, UserRepository userRepo) {
        this.todoRepo = todoRepo;
        this.userRepo = userRepo;
    }

    public Todo saveOrUpdateTodo(Todo todo, String username){
        Todo savedTodo = null;
        Optional<User> user = userRepo.findUserByUsername(username);
        if (user.isPresent()){
            todo.setOwner(user.get());
            savedTodo = todoRepo.save(todo);
        }
        return savedTodo;
    }

    public List<Todo> getAllTodosByOwner(String username){
        Optional<User> user = userRepo.findUserByUsername(username);
        if (user.isPresent()){
            return todoRepo.getAllTodoByOwnerOrderById(user.get());
        }
        return new ArrayList<>();
    }

    public Todo updateTodo(int id, Todo todo, String username){
        Optional<Todo> returnedTodo = todoRepo.findById(id);
        Optional<User> returnedUser = userRepo.findUserByUsername(username);

        if (returnedTodo.isPresent() && returnedUser.isPresent()){
            Todo t = returnedTodo.get();
            t.setComplete(todo.isComplete());
            return todoRepo.save(t);

        }
        return null;

    }



}
