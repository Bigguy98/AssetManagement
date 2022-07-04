package demo.vtt.clgsp.web.rest;

import demo.vtt.clgsp.domain.AssetType;
import demo.vtt.clgsp.repository.AssetTypeRepository;
import demo.vtt.clgsp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link demo.vtt.clgsp.domain.AssetType}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class AssetTypeResource {

    private final Logger log = LoggerFactory.getLogger(AssetTypeResource.class);

    private static final String ENTITY_NAME = "assetType";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AssetTypeRepository assetTypeRepository;

    public AssetTypeResource(AssetTypeRepository assetTypeRepository) {
        this.assetTypeRepository = assetTypeRepository;
    }

    /**
     * {@code POST  /asset-types} : Create a new assetType.
     *
     * @param assetType the assetType to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new assetType, or with status {@code 400 (Bad Request)} if the assetType has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/asset-types")
    public ResponseEntity<AssetType> createAssetType(@RequestBody AssetType assetType) throws URISyntaxException {
        log.debug("REST request to save AssetType : {}", assetType);
        if (assetType.getId() != null) {
            throw new BadRequestAlertException("A new assetType cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AssetType result = assetTypeRepository.save(assetType);
        return ResponseEntity
            .created(new URI("/api/asset-types/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /asset-types/:id} : Updates an existing assetType.
     *
     * @param id the id of the assetType to save.
     * @param assetType the assetType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated assetType,
     * or with status {@code 400 (Bad Request)} if the assetType is not valid,
     * or with status {@code 500 (Internal Server Error)} if the assetType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/asset-types/{id}")
    public ResponseEntity<AssetType> updateAssetType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AssetType assetType
    ) throws URISyntaxException {
        log.debug("REST request to update AssetType : {}, {}", id, assetType);
        if (assetType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, assetType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!assetTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AssetType result = assetTypeRepository.save(assetType);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, assetType.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /asset-types/:id} : Partial updates given fields of an existing assetType, field will ignore if it is null
     *
     * @param id the id of the assetType to save.
     * @param assetType the assetType to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated assetType,
     * or with status {@code 400 (Bad Request)} if the assetType is not valid,
     * or with status {@code 404 (Not Found)} if the assetType is not found,
     * or with status {@code 500 (Internal Server Error)} if the assetType couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/asset-types/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AssetType> partialUpdateAssetType(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AssetType assetType
    ) throws URISyntaxException {
        log.debug("REST request to partial update AssetType partially : {}, {}", id, assetType);
        if (assetType.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, assetType.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!assetTypeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AssetType> result = assetTypeRepository
            .findById(assetType.getId())
            .map(existingAssetType -> {
                if (assetType.getName() != null) {
                    existingAssetType.setName(assetType.getName());
                }
                if (assetType.getDescription() != null) {
                    existingAssetType.setDescription(assetType.getDescription());
                }

                return existingAssetType;
            })
            .map(assetTypeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, assetType.getId().toString())
        );
    }

    /**
     * {@code GET  /asset-types} : get all the assetTypes.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of assetTypes in body.
     */
    @GetMapping("/asset-types")
    public List<AssetType> getAllAssetTypes() {
        log.debug("REST request to get all AssetTypes");
        return assetTypeRepository.findAll();
    }

    /**
     * {@code GET  /asset-types/:id} : get the "id" assetType.
     *
     * @param id the id of the assetType to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the assetType, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/asset-types/{id}")
    public ResponseEntity<AssetType> getAssetType(@PathVariable Long id) {
        log.debug("REST request to get AssetType : {}", id);
        Optional<AssetType> assetType = assetTypeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(assetType);
    }

    /**
     * {@code DELETE  /asset-types/:id} : delete the "id" assetType.
     *
     * @param id the id of the assetType to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/asset-types/{id}")
    public ResponseEntity<Void> deleteAssetType(@PathVariable Long id) {
        log.debug("REST request to delete AssetType : {}", id);
        assetTypeRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
