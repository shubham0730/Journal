package com.project.utils;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public enum Permission {
    ADMIN_READ("admin:read"),
    ADMIN_UPDATE("admin:update"),
    ADMIN_CREATE("admin:create"),
    ADMIN_DELETE("admin:delete"),
    EDITOR_READ("editorial:read"),
    EDITOR_UPDATE("editorial:update"),
    EDITOR_CREATE("editorial:create"),
    EDITOR_DELETE("editorial:delete"),
    REVIEWER_READ("review:read"),
    REVIEWER_UPDATE("review:update"),
    REVIEWER_CREATE("review:create"),
    REVIEWER_DELETE("review:delete"),
    AUTHOR_READ("user:read"),
    AUTHOR_UPDATE("user:update"),
    AUTHOR_CREATE("user:create"),
    AUTHOR_DELETE("user:delete")
    ;

    @Getter
    private final String permission;
}
