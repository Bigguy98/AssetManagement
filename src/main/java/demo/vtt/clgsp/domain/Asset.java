package demo.vtt.clgsp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;

/**
 * A Asset.
 */
@Entity
@Table(name = "asset")
public class Asset implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @ManyToOne
    @JsonIgnoreProperties(value = { "assets" }, allowSetters = true)
    private AssetType assetType;

    @ManyToMany(mappedBy = "assets")
    @JsonIgnoreProperties(value = { "assets" }, allowSetters = true)
    private Set<Customer> owners = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Asset id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return this.name;
    }

    public Asset name(String name) {
        this.setName(name);
        return this;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public Asset description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AssetType getAssetType() {
        return this.assetType;
    }

    public void setAssetType(AssetType assetType) {
        this.assetType = assetType;
    }

    public Asset assetType(AssetType assetType) {
        this.setAssetType(assetType);
        return this;
    }

    public Set<Customer> getOwners() {
        return this.owners;
    }

    public void setOwners(Set<Customer> customers) {
        if (this.owners != null) {
            this.owners.forEach(i -> i.removeAssets(this));
        }
        if (customers != null) {
            customers.forEach(i -> i.addAssets(this));
        }
        this.owners = customers;
    }

    public Asset owners(Set<Customer> customers) {
        this.setOwners(customers);
        return this;
    }

    public Asset addOwner(Customer customer) {
        this.owners.add(customer);
        customer.getAssets().add(this);
        return this;
    }

    public Asset removeOwner(Customer customer) {
        this.owners.remove(customer);
        customer.getAssets().remove(this);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Asset)) {
            return false;
        }
        return id != null && id.equals(((Asset) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Asset{" +
            "id=" + getId() +
            ", name='" + getName() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
