package com.project.services;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.assembler.AuthAssembler;
import com.project.entity.Token;
import com.project.entity.User;
import com.project.repository.AuthRepository;
import com.project.repository.TokenRepository;
import com.project.utils.TokenType;
import io.swagger.model.AuthenticationResponse;
import io.swagger.model.LoginRequestDTO;
import io.swagger.model.UserDTO;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class AuthServiceImpl implements AuthService{
    @Autowired
    private AuthRepository repo;
    @Autowired
    private JwtService jwtService;
    @Autowired
    private TokenRepository tokenRepository;
    @Autowired
    private AuthenticationManager authenticationManager;

    @Override
    public AuthenticationResponse addUser(UserDTO user) {
        AuthenticationResponse authResponse = new AuthenticationResponse();

        // Convert DTO to entity
        User userEntity = AuthAssembler.DTOtoEntity(user);

        // Save the User entity
        User savedUser = repo.save(userEntity);
        var jwtToken = jwtService.generateToken(userEntity);
        var refreshToken = jwtService.generateRefreshToken(userEntity);
        saveUserToken(savedUser, jwtToken);


        // Prepare the success response
        authResponse.setAccessToken(jwtToken);
        authResponse.setRefreshToken(refreshToken);

        // Return 200 OK with the success response
        return authResponse;
    }

    @Override
    public AuthenticationResponse loginUser(LoginRequestDTO loginRequestDTO) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequestDTO.getUserEmail(),
                        loginRequestDTO.getPassword()
                )
        );
        var user = repo.findByEmail(loginRequestDTO.getUserEmail())
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        var refreshToken = jwtService.generateRefreshToken(user);
        revokeAllUserTokens(user);
        saveUserToken(user, jwtToken);
        AuthenticationResponse authResponse = new AuthenticationResponse();
        authResponse.setAccessToken(jwtToken);
        authResponse.setRefreshToken(refreshToken);

        // Return 200 OK with the success response
        return authResponse;
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .expired(false)
                .revoked(false)
                .build();
        tokenRepository.save(token);
    }

    private void revokeAllUserTokens(User user) {
        var validUserTokens = tokenRepository.findAllValidTokenByUser(Math.toIntExact(user.getId()));
        if (validUserTokens.isEmpty())
            return;
        validUserTokens.forEach(token -> {
            token.setExpired(true);
            token.setRevoked(true);
        });
        tokenRepository.saveAll(validUserTokens);
    }

    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws IOException {
        final String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        final String refreshToken;
        final String userEmail;
        AuthenticationResponse authResponse = new AuthenticationResponse();
        if (authHeader == null ||!authHeader.startsWith("Bearer ")) {
            return;
        }
        refreshToken = authHeader.substring(7);
        userEmail = jwtService.extractUsername(refreshToken);
        if (userEmail != null) {
            var user = this.repo.findByEmail(userEmail)
                    .orElseThrow();
            if (jwtService.isTokenValid(refreshToken, user)) {
                var accessToken = jwtService.generateToken(user);
                revokeAllUserTokens(user);
                saveUserToken(user, accessToken);
                authResponse.setAccessToken(accessToken);
                authResponse.setRefreshToken(refreshToken);
                new ObjectMapper().writeValue(response.getOutputStream(), authResponse);
            }
        }
    }
}
