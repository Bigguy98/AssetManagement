package demo.vtt.clgsp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import demo.vtt.clgsp.IntegrationTest;
import demo.vtt.clgsp.domain.AssetType;
import demo.vtt.clgsp.repository.AssetTypeRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AssetTypeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AssetTypeResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/asset-types";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AssetTypeRepository assetTypeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAssetTypeMockMvc;

    private AssetType assetType;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AssetType createEntity(EntityManager em) {
        AssetType assetType = new AssetType().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return assetType;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AssetType createUpdatedEntity(EntityManager em) {
        AssetType assetType = new AssetType().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return assetType;
    }

    @BeforeEach
    public void initTest() {
        assetType = createEntity(em);
    }

    @Test
    @Transactional
    void createAssetType() throws Exception {
        int databaseSizeBeforeCreate = assetTypeRepository.findAll().size();
        // Create the AssetType
        restAssetTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(assetType)))
            .andExpect(status().isCreated());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeCreate + 1);
        AssetType testAssetType = assetTypeList.get(assetTypeList.size() - 1);
        assertThat(testAssetType.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAssetType.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createAssetTypeWithExistingId() throws Exception {
        // Create the AssetType with an existing ID
        assetType.setId(1L);

        int databaseSizeBeforeCreate = assetTypeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAssetTypeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(assetType)))
            .andExpect(status().isBadRequest());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAssetTypes() throws Exception {
        // Initialize the database
        assetTypeRepository.saveAndFlush(assetType);

        // Get all the assetTypeList
        restAssetTypeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(assetType.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getAssetType() throws Exception {
        // Initialize the database
        assetTypeRepository.saveAndFlush(assetType);

        // Get the assetType
        restAssetTypeMockMvc
            .perform(get(ENTITY_API_URL_ID, assetType.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(assetType.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingAssetType() throws Exception {
        // Get the assetType
        restAssetTypeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAssetType() throws Exception {
        // Initialize the database
        assetTypeRepository.saveAndFlush(assetType);

        int databaseSizeBeforeUpdate = assetTypeRepository.findAll().size();

        // Update the assetType
        AssetType updatedAssetType = assetTypeRepository.findById(assetType.getId()).get();
        // Disconnect from session so that the updates on updatedAssetType are not directly saved in db
        em.detach(updatedAssetType);
        updatedAssetType.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restAssetTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAssetType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAssetType))
            )
            .andExpect(status().isOk());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeUpdate);
        AssetType testAssetType = assetTypeList.get(assetTypeList.size() - 1);
        assertThat(testAssetType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAssetType.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingAssetType() throws Exception {
        int databaseSizeBeforeUpdate = assetTypeRepository.findAll().size();
        assetType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssetTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, assetType.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(assetType))
            )
            .andExpect(status().isBadRequest());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAssetType() throws Exception {
        int databaseSizeBeforeUpdate = assetTypeRepository.findAll().size();
        assetType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetTypeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(assetType))
            )
            .andExpect(status().isBadRequest());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAssetType() throws Exception {
        int databaseSizeBeforeUpdate = assetTypeRepository.findAll().size();
        assetType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetTypeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(assetType)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAssetTypeWithPatch() throws Exception {
        // Initialize the database
        assetTypeRepository.saveAndFlush(assetType);

        int databaseSizeBeforeUpdate = assetTypeRepository.findAll().size();

        // Update the assetType using partial update
        AssetType partialUpdatedAssetType = new AssetType();
        partialUpdatedAssetType.setId(assetType.getId());

        partialUpdatedAssetType.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restAssetTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAssetType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAssetType))
            )
            .andExpect(status().isOk());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeUpdate);
        AssetType testAssetType = assetTypeList.get(assetTypeList.size() - 1);
        assertThat(testAssetType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAssetType.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateAssetTypeWithPatch() throws Exception {
        // Initialize the database
        assetTypeRepository.saveAndFlush(assetType);

        int databaseSizeBeforeUpdate = assetTypeRepository.findAll().size();

        // Update the assetType using partial update
        AssetType partialUpdatedAssetType = new AssetType();
        partialUpdatedAssetType.setId(assetType.getId());

        partialUpdatedAssetType.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restAssetTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAssetType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAssetType))
            )
            .andExpect(status().isOk());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeUpdate);
        AssetType testAssetType = assetTypeList.get(assetTypeList.size() - 1);
        assertThat(testAssetType.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAssetType.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingAssetType() throws Exception {
        int databaseSizeBeforeUpdate = assetTypeRepository.findAll().size();
        assetType.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssetTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, assetType.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(assetType))
            )
            .andExpect(status().isBadRequest());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAssetType() throws Exception {
        int databaseSizeBeforeUpdate = assetTypeRepository.findAll().size();
        assetType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetTypeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(assetType))
            )
            .andExpect(status().isBadRequest());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAssetType() throws Exception {
        int databaseSizeBeforeUpdate = assetTypeRepository.findAll().size();
        assetType.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetTypeMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(assetType))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AssetType in the database
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAssetType() throws Exception {
        // Initialize the database
        assetTypeRepository.saveAndFlush(assetType);

        int databaseSizeBeforeDelete = assetTypeRepository.findAll().size();

        // Delete the assetType
        restAssetTypeMockMvc
            .perform(delete(ENTITY_API_URL_ID, assetType.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AssetType> assetTypeList = assetTypeRepository.findAll();
        assertThat(assetTypeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
