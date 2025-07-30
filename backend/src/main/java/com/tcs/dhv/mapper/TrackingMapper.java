package com.tcs.dhv.mapper;

import com.tcs.dhv.domain.dto.TrackingResponse;
import com.tcs.dhv.domain.dto.TrackingStatus;
import com.tcs.dhv.domain.entity.Parcel;
import com.tcs.dhv.domain.entity.ParcelStatusHistory;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;
@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface TrackingMapper {
    @Mapping(source = "trackingCode", target = "trackingCode")
    @Mapping(source = "status", target = "currentStatus")
    @Mapping(source = "history", target = "timeline")
    TrackingResponse toResponse(Parcel parcel, List<ParcelStatusHistory> history);

    @Mapping(source = "status", target = "status")
    @Mapping(source = "timestamp", target = "timestamp")
    TrackingStatus toTrackingStatus(ParcelStatusHistory history);

    List<TrackingStatus> toTrackingStatusList(List<ParcelStatusHistory> historyList);
}
