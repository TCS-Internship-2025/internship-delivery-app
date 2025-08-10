package com.tcs.dhv.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import com.fasterxml.jackson.databind.exc.InvalidFormatException;
import com.tcs.dhv.domain.dto.ApiErrorResponse;
import jakarta.validation.ConstraintViolationException;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.ValidationException;
import java.time.Instant;
import java.util.stream.Collectors;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUsernameNotFoundException(final Exception ex) {
        log.error("Caught Exception", ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ApiErrorResponse> handleRuntimeException(final RuntimeException ex) {
        log.error("Caught RuntimeException", ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, "An unexpected error occurred");
    }

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ApiErrorResponse> handleBadCredentialsException(final BadCredentialsException ex) {
        log.error("Bad Credentials", ex);
        return buildError(HttpStatus.UNAUTHORIZED, "Incorrect username or password");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalArgumentException(final IllegalArgumentException ex) {
        log.error("Illegal Argument", ex);
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(ValidationException.class)
    public ResponseEntity<ApiErrorResponse> handleValidationException(final ValidationException ex) {
        log.error("Validation Exception", ex);
        return buildError(HttpStatus.BAD_REQUEST, ex.getMessage());
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleDataIntegrityViolationException(final DataIntegrityViolationException ex) {
        log.error("Data integrity violation", ex);
        return buildError(HttpStatus.CONFLICT, "Data integrity violation" + ex.getMostSpecificCause().getMessage());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiErrorResponse> handleEntityNotFoundException(final EntityNotFoundException ex) {
        log.error("Entity not found", ex);
        return buildError(HttpStatus.NOT_FOUND, ex.getMessage());
    }

    @ExceptionHandler(InternalAuthenticationServiceException.class)
    public ResponseEntity<ApiErrorResponse> handleInternalAuthenticationServiceException(final InternalAuthenticationServiceException ex) {
        log.error("Internal authentication service error", ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiErrorResponse> handleIllegalStateException(final IllegalStateException ex) {
        log.error("Illegal state error", ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(MailMessagingException.class)
    public ResponseEntity<ApiErrorResponse> handleMailMessagingException(final MailMessagingException ex) {
        log.error("Mail messaging error", ex);
        return buildError(HttpStatus.INTERNAL_SERVER_ERROR, ex.getMessage());
    }

    @ExceptionHandler(InvalidFormatException.class)
    public ResponseEntity<ApiErrorResponse> handleInvalidFormatException(final InvalidFormatException ex) {
        log.error("Invalid format", ex);
        return buildError(HttpStatus.BAD_REQUEST, "Invalid format: " + ex.getMessage());
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ApiErrorResponse> handleHttpMessageNotReadableException(final HttpMessageNotReadableException ex) {
        log.error("HTTP message not readable", ex);
        return buildError(HttpStatus.BAD_REQUEST, "Malformed JSON request");
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ApiErrorResponse> handleConstraintViolationException(final ConstraintViolationException ex) {
        log.error("Constraint Violation", ex);
        final var errorList = ex.getConstraintViolations()
            .stream()
            .map(violation -> new ApiErrorResponse.FieldError(
                violation.getPropertyPath().toString(),
                violation.getMessage()
            ))
            .collect(Collectors.toList());

        final var err = ApiErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .message("Validation failed")
            .timestamp(Instant.now())
            .errors(errorList)
            .build();
        return ResponseEntity.badRequest().body(err);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiErrorResponse> handleMethodArgumentNotValid(final MethodArgumentNotValidException ex) {
        log.error("Method argument not valid", ex);
        final var errorList = ex.getBindingResult()
            .getFieldErrors()
            .stream()
            .map(fieldError -> new ApiErrorResponse.FieldError(
                fieldError.getField(),
                fieldError.getDefaultMessage()
            ))
            .toList();

        final var err = ApiErrorResponse.builder()
            .status(HttpStatus.BAD_REQUEST.value())
            .message("Validation failed")
            .timestamp(Instant.now())
            .errors(errorList)
            .build();
        return ResponseEntity.badRequest().body(err);
    }

    private ResponseEntity<ApiErrorResponse> buildError(final HttpStatus status, final String message) {
        final var err = ApiErrorResponse.builder()
            .status(status.value())
            .message(message)
            .timestamp(Instant.now())
            .build();
        return ResponseEntity.status(status).body(err);
    }
}
