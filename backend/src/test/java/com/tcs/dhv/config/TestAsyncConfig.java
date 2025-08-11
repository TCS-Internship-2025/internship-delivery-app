package com.tcs.dhv.config;

import org.springframework.core.task.SyncTaskExecutor;
import org.springframework.scheduling.annotation.AsyncConfigurer;

import java.util.concurrent.Executor;

public class TestAsyncConfig implements AsyncConfigurer {
    @Override
    public Executor getAsyncExecutor() {
        return new SyncTaskExecutor();
    }
}
