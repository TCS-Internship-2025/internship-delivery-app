package com.tcs.dhv.controller;

import com.tcs.dhv.service.ParcelsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parcels")
@RequiredArgsConstructor
// @PreAuthorize("hasRole('USER') or hasRole('ADMIN')")
public class ParcelsController {

    private final ParcelsService parcelsService;
    // private final ParcelsRepository parcelsRepository;

    @PostMapping
    public void /* ResponseEntity<ParcelResponse> */ createParcel(/* @RequestBody @Valid ParcelCreate parcelCreate */) {
        // TODO: Get authenticated user from the security context
        // parcelsService.createParcel(parcelCreate, currentUser);
    }

    @GetMapping
    public void /* ResponseEntity<Page<ParcelResponse>> */ getUserParcels() {
        // TODO: Get authenticated user from the security context
        // return parcelsService.getUserParcels(currentUser);
    }

    @GetMapping("/{id}")
    public void /* ResponseEntity<ParcelResponse> */ getParcel(@PathVariable Long id) {
        // return parcelsService.getParcel(id);
    }

    @PutMapping("/{id}")
    public void /* ResponseEntity<ParcelResponse> */ updateParcel(@PathVariable Long id /*, @RequestBody @Valid ParcelUpdate parcelUpdates */) {
        // TODO: Get authenticated user from the security context
        // parcelsService.updateParcel(id, parcelUpdates, currentUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteParcel(@PathVariable Long id) {
        // TODO: Get authenticated user from the security context
        // parcelsService.deleteParcel(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/status")
    public void /* ResponseEntity<ParcelStatusResponse> */ getParcelStatus(@PathVariable Long id) {
        // return parcelsService.getParcelStatus(id);
    }
}
