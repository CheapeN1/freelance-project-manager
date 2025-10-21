package com.freelance.project_manager.repository;

import com.freelance.project_manager.model.AdditionalRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AdditionalRequestRepository extends JpaRepository<AdditionalRequest, Long> {

    // Bir projeye ait tüm isterleri bulmak için
    // Artık bir Pageable parametresi alıyor ve List<...> yerine Page<...> döndürüyor.
    Page<AdditionalRequest> findByProjectId(Long projectId, Pageable pageable);
}