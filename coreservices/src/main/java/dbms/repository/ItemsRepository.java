package dbms.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import dbms.models.Items;

public interface ItemsRepository extends JpaRepository<Items, Long>, JpaSpecificationExecutor<Items> {

    boolean existsByExternalId(String externalId);

    java.util.Optional<Items> findByExternalId(String externalId);
}
