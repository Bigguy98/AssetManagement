package demo.vtt.clgsp.repository;

import demo.vtt.clgsp.domain.Customer;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;

public interface CustomerRepositoryWithBagRelationships {
    Optional<Customer> fetchBagRelationships(Optional<Customer> customer);

    List<Customer> fetchBagRelationships(List<Customer> customers);

    Page<Customer> fetchBagRelationships(Page<Customer> customers);
}
