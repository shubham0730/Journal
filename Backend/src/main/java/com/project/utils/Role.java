package com.project.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.project.utils.Permission.*;

@RequiredArgsConstructor
public enum Role {
    USER(Collections.emptySet()),
    ADMIN(
            Set.of(
                    ADMIN_READ,
                    ADMIN_UPDATE,
                    ADMIN_DELETE,
                    ADMIN_CREATE,
                    EDITOR_READ,
                    EDITOR_UPDATE,
                    EDITOR_DELETE,
                    EDITOR_CREATE,
                    REVIEWER_READ,
                    REVIEWER_UPDATE,
                    REVIEWER_DELETE,
                    REVIEWER_CREATE,
                    AUTHOR_READ,
                    AUTHOR_UPDATE,
                    AUTHOR_DELETE,
                    AUTHOR_CREATE
            )
    ),
    EDITOR(
            Set.of(
                    EDITOR_READ,
                    EDITOR_UPDATE,
                    EDITOR_DELETE,
                    EDITOR_CREATE,
                    REVIEWER_READ,
                    REVIEWER_UPDATE,
                    REVIEWER_DELETE,
                    REVIEWER_CREATE,
                    AUTHOR_READ,
                    AUTHOR_UPDATE,
                    AUTHOR_DELETE,
                    AUTHOR_CREATE
            )
    ),
    REVIEWER(
            Set.of(
                    REVIEWER_READ,
                    REVIEWER_UPDATE,
                    REVIEWER_DELETE,
                    REVIEWER_CREATE
            )
    ),
    AUTHOR(
            Set.of(
                    AUTHOR_READ,
                    AUTHOR_UPDATE,
                    AUTHOR_DELETE,
                    AUTHOR_CREATE
            )
    ),

    ;

    @Getter
    private final Set<Permission> permissions;

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
        authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
        return authorities;
    }
}
