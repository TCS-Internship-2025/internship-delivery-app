package com.tcs.dhv.service;

import com.tcs.dhv.domain.enums.ParcelStatus;
import com.tcs.dhv.domain.event.ParcelCreatedEvent;
import com.tcs.dhv.domain.event.ParcelStatusUpdatedEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@RequiredArgsConstructor
@Service
public class ParcelEventHandler {

    private final EmailService emailService;
    private final ParcelStatusHistoryService parcelStatusHistoryService;

    @Async
    @EventListener
    public void handleParcelCreated(final ParcelCreatedEvent event) {
        final var parcel = event.parcel();
        log.info("Handling ParcelCreatedEvent for parcel ID: {}", parcel.getId());

        try {
            emailService.sendShipmentCreationEmail(
                parcel.getSender().getEmail(),
                parcel.getRecipient().getEmail(),
                parcel.getRecipient().getName(),
                parcel.getTrackingCode()
            );
            log.info("Parcel creation email sent for tracking code: {}", parcel.getTrackingCode());

            final var description = String.format("Parcel created by %s", parcel.getSender().getEmail());
            parcelStatusHistoryService.addStatusHistory(parcel.getId(), description);
            log.info("Parcel status history entry created for parcel ID: {}", parcel.getId());

        } catch (final Exception e) {
            log.error("Error handling ParcelCreatedEvent for parcel ID: {}", parcel.getId(), e);
        }
    }

    @Async
    @EventListener
    public void handleParcelStatusUpdated(final ParcelStatusUpdatedEvent event) {
        final var parcel = event.parcel();
        log.info("Handling ParcelStatusUpdatedEvent for parcel ID: {}", parcel.getId());

        try {
            if (parcel.getCurrentStatus() == ParcelStatus.DELIVERED) {
                emailService.sendDeliveryCompleteEmail(
                    parcel.getRecipient().getEmail(),
                    parcel.getRecipient().getName(),
                    parcel.getTrackingCode()
                );
                log.info("Delivery complete email sent for tracking code: {}", parcel.getTrackingCode());
            } else {
                emailService.sendParcelStatusChangeNotification(
                    parcel.getSender().getEmail(),
                    parcel.getRecipient().getEmail(),
                    parcel.getRecipient().getName(),
                    parcel.getCurrentStatus(),
                    parcel.getTrackingCode()
                );
                log.info("Parcel status change notification sent for tracking code: {}", parcel.getTrackingCode());
            }
        } catch (final Exception e) {
            log.error("Error handling ParcelStatusUpdatedEvent for parcel ID: {}", parcel.getId(), e);
        }

    }
}