package com.project.assembler;

import com.project.entity.User;
import com.project.utils.Role;
import io.swagger.model.UserDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AuthAssembler {

    private static PasswordEncoder passwordEncoder;

    @Autowired
    public void setPasswordEncoder(PasswordEncoder encoder) {
        passwordEncoder = encoder;
    }

    @Autowired
    public AuthAssembler(PasswordEncoder passwordEncoder) {
        AuthAssembler.passwordEncoder = passwordEncoder;
    }

    public static User DTOtoEntity(UserDTO userDTO) {
        User user = new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastName(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(passwordEncoder.encode(userDTO.getPassword())); // Encode the password
        user.setUsername(userDTO.getUsername());
        user.setPostalCode(userDTO.getPostalCode());
        user.setRole(Role.valueOf(userDTO.getRole())); // Convert role to enum
        return user;
    }
}
