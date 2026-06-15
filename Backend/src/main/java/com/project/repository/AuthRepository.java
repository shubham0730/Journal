package com.project.repository;

import com.project.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface AuthRepository extends CrudRepository<User,Integer> {
    Optional<User> findByEmail(String email);
}
