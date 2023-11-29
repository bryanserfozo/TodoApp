package com.bofa.services;

import com.bofa.repos.UserRepository;
import com.bofa.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepo;



    @Autowired
    public UserService(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public User login(String username, String password) {

        Optional<User> user = userRepo.findUserByUsername(username);
        if (user.isPresent()) {
            if (user.get().getPassword().equals(password)) {
                return user.get();
            }
        }
        return null;

    }

    public User register(User user){
        User savedUser = userRepo.save(user);
        return savedUser;
    }





}
