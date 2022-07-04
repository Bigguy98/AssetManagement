package demo.vtt.clgsp.repository;

import demo.vtt.clgsp.domain.AssetType;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the AssetType entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AssetTypeRepository extends JpaRepository<AssetType, Long> {}
