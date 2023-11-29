package com.bofa.controllers;

import com.bofa.models.Todo;
import com.bofa.services.TodoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/todo")
@CrossOrigin(origins = {"http://ec2-18-212-86-3.compute-1.amazonaws.com:8080/"})
public class TodoController {

    private final TodoService todoService;

    @Autowired
    public TodoController(TodoService todoService) {
        this.todoService = todoService;
    }

    @PostMapping
    public ResponseEntity<Todo> createTodo(@RequestBody Todo todo,
                                           @RequestParam(name = "username", defaultValue = "no-username-provided") String username){

        if (username.equals("no-username-provided")){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        todo.setComplete(false);
        Todo savedTodo = todoService.saveOrUpdateTodo(todo, username);
        if (savedTodo != null){
            return new ResponseEntity<>(savedTodo, HttpStatus.CREATED);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

    @GetMapping
    public ResponseEntity<List<Todo>> getAllTodosByOwner(@RequestParam(name = "username", defaultValue = "no-username-provided") String username){
        if (username.equals("no-username-provided")){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }

        return new ResponseEntity<>(todoService.getAllTodosByOwner(username), HttpStatus.OK);
    }

    @PutMapping("{id}")
    public ResponseEntity<Todo> updateTodo(@PathVariable int id,
                                            @RequestBody Todo todo,
                                           @RequestParam(name = "username", defaultValue = "no-username-provided") String username){

        if (username.equals("no-username-provided")){
            return new ResponseEntity<>(HttpStatus.FORBIDDEN);
        }
        Todo savedTodo = todoService.updateTodo(id, todo, username);
        if (savedTodo != null){
            return new ResponseEntity<>(savedTodo, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }
}
