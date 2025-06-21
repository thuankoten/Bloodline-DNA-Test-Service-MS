package com.bloodline.repository;

import com.bloodline.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;


public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByPhone(String phone);
    User findByEmailAndPasswordAndActive(String email, String password, boolean active);
    User findByEmailAndPassword(String email, String password);
    User findByUsername(String username);
}
