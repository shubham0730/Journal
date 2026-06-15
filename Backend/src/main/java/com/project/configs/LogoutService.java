package com.project.configs;

import com.project.repository.TokenRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {

    private final TokenRepository tokenRepository;

    private static final Logger logger = LoggerFactory.getLogger(LogoutService.class);

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        // Log request and user information (without sensitive data)
        final String authHeader = request.getHeader("Authorization");
        if (authHeader != null) {
            logger.debug("Logout attempt initiated. Authorization Header: [REDACTED]");
        }

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.warn("Authorization header is missing or does not start with 'Bearer '. Aborting logout process.");
            return;
        }

        final String jwt = authHeader.substring(7); // Extract the token without logging the sensitive part
        logger.debug("JWT extracted from Authorization header: [REDACTED]");

        // Find the token in the repository
        var storedToken = tokenRepository.findByToken(jwt).orElse(null);

        if (storedToken == null) {
            logger.warn("No matching token found in the repository for the provided JWT. Logout aborted.");
            return;
        }

        // Log token-related information
        logger.debug("Token found in the repository: [REDACTED]");

        // Mark the token as expired and revoked
        storedToken.setExpired(true);
        storedToken.setRevoked(true);

        // Save the updated token state in the repository
        tokenRepository.save(storedToken);
        logger.info("Token has been marked as expired and revoked in the database.");

        // Clear the security context
        SecurityContextHolder.clearContext();
        logger.info("Security context cleared. User logged out successfully.");
    }
}
