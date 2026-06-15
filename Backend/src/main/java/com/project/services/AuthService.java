package com.project.services;

import io.swagger.model.AuthenticationResponse;
import io.swagger.model.LoginRequestDTO;
import io.swagger.model.UserDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;


public interface AuthService {
    AuthenticationResponse loginUser(LoginRequestDTO loginRequestDTO);

    AuthenticationResponse addUser(UserDTO userDTO);

    void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException;
}
