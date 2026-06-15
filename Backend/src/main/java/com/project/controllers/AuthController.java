package com.project.controllers;

import com.project.configs.LogoutService;
import com.project.services.AuthService;
import io.swagger.api.AuthApi;
import io.swagger.model.AuthenticationResponse;
import io.swagger.model.LoginRequestDTO;
import io.swagger.model.UserDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class AuthController implements AuthApi {
    @Autowired
    private  AuthService service;
    @Autowired
    private LogoutService logoutService;
    @Override
    public ResponseEntity<AuthenticationResponse>addUser(UserDTO UserDTO){
        ResponseEntity<AuthenticationResponse> responseEntity = null;
        AuthenticationResponse response = service.addUser(UserDTO);
        responseEntity = new ResponseEntity<>(response, HttpStatus.CREATED);
        return responseEntity;
    }
    @Override
    public ResponseEntity<AuthenticationResponse>loginUser(LoginRequestDTO loginRequestDTO){
        ResponseEntity<AuthenticationResponse> responseEntity = null;
        AuthenticationResponse response = service.loginUser(loginRequestDTO);
        responseEntity = new ResponseEntity<>(response, HttpStatus.CREATED);
        return responseEntity;
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        service.refreshToken(request, response);
    }

    @PostMapping("/auth/logout")
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        logoutService.logout(request, response, null);  // Authentication is handled by the service
    }

}
