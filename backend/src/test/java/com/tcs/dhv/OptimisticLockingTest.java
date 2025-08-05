package com.tcs.dhv;

import com.tcs.dhv.domain.dto.AuthResponse;
import com.tcs.dhv.domain.dto.LoginRequest;
import com.tcs.dhv.domain.dto.UserProfileDto;
import com.tcs.dhv.domain.entity.User;
import com.tcs.dhv.repository.UserRepository;
import com.tcs.dhv.service.AuthService;
import com.tcs.dhv.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.orm.ObjectOptimisticLockingFailureException;

import org.springframework.transaction.annotation.Propagation;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.dao.ConcurrencyFailureException;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Propagation;

import java.util.UUID;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicReference;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.AssertionsForClassTypes.assertThatThrownBy;

@SpringBootTest
@ActiveProfiles("test")
public class OptimisticLockingTest {

    private String userId;

    @Autowired
    private UserService userService;

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    private final AtomicReference<Exception> exception = new AtomicReference<>();

    @BeforeEach
    void setUp() {
        // Login to get the user identifier (UUID from JWT subject)
        LoginRequest loginRequest = new LoginRequest("ferenckiss19823010@gmail.com", "40!OpenSesame");
        AuthResponse authResponse = authService.authenticate(loginRequest);


        // Extract user identifier from the authentication
        // Since your controller uses authentication.getName() which returns the subject (UUID)
        // You need to decode the JWT or use the user ID directly
        // For simplicity, let's assume you have a method to get user by email
        userId = "223b2fc9-caae-4a18-99e3-faabb5179d86";
    }


    @Test
    @Transactional(value = Transactional.TxType.NEVER)
    void whenTwoThreadsUpdateSameUser_thenOptimisticLockingFails() throws Exception {

        ExecutorService pool = Executors.newFixedThreadPool(2);
        CountDownLatch ready = new CountDownLatch(2);
        CountDownLatch start = new CountDownLatch(1);
        AtomicReference<Throwable> firstFailure = new AtomicReference<>();

        Runnable task = () -> {
            ready.countDown();           // signal “I’m ready”
            try { start.await(); } catch (InterruptedException ignored) { }

            try {
                System.out.println("Name-from-"+Thread.currentThread().getName());
                userService.updateUserProfile(
                    userId,
                    new UserProfileDto("Name-from-"+Thread.currentThread().getName(),
                        null,null,null,true,null,null, null, null));
            } catch (Throwable t) {
                firstFailure.compareAndSet(null, t);
            }
        };

        pool.execute(task);
        pool.execute(task);

        ready.await();   // both threads loaded the same row
        start.countDown();             // fire!
        pool.shutdown();
        pool.awaitTermination(10, TimeUnit.SECONDS);

        assertThat(firstFailure.get())
            .isInstanceOf(ConcurrencyFailureException.class)
            .hasMessage("Profile was updated by another session");
    }


    @Test
    void whenUpdatesAreSequential_thenNoException() {

        userService.updateUserProfile(
            userId,
            new UserProfileDto("First update", null,null,null,true,null,null, null, null));

        assertThatCode(() -> userService.updateUserProfile(
            userId,
            new UserProfileDto("Second update", null,null,null,true,null,null, null, null)))
            .doesNotThrowAnyException();
    }

    @Test
    @Transactional(value = Transactional.TxType.NEVER)
    void testOptimisticLockingWithStaleVersion() {
        User user = userRepository.findById(UUID.fromString(userId)).get();
        Long currentVersion = user.getVersion();

        // Manually set stale version
        user.setVersion(currentVersion - 1);
        user.setName("This should fail");

        assertThatThrownBy(() -> {
            userRepository.saveAndFlush(user);
        }).isInstanceOf(ObjectOptimisticLockingFailureException.class);
    }

    @Test
    @Transactional(value = Transactional.TxType.NEVER)
    void testOptimisticLockingWithStaleVersion2() {
        User user = userRepository.findById(UUID.fromString(userId)).get();
        Long currentVersion = user.getVersion();

        // Manually set stale version
        user.setVersion(currentVersion - 1);
        user.setName("This should fail");

        assertThatThrownBy(() -> {
            userRepository.saveAndFlush(user);
        }).isInstanceOf(ObjectOptimisticLockingFailureException.class);
    }
}
