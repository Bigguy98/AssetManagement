package demo.vtt.clgsp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import demo.vtt.clgsp.IntegrationTest;
import demo.vtt.clgsp.domain.Asset;
import demo.vtt.clgsp.repository.AssetRepository;
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
 * Integration tests for the {@link AssetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AssetResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/assets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AssetRepository assetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAssetMockMvc;

    private Asset asset;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Asset createEntity(EntityManager em) {
        Asset asset = new Asset().name(DEFAULT_NAME).description(DEFAULT_DESCRIPTION);
        return asset;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Asset createUpdatedEntity(EntityManager em) {
        Asset asset = new Asset().name(UPDATED_NAME).description(UPDATED_DESCRIPTION);
        return asset;
    }

    @BeforeEach
    public void initTest() {
        asset = createEntity(em);
    }

    @Test
    @Transactional
    void createAsset() throws Exception {
        int databaseSizeBeforeCreate = assetRepository.findAll().size();
        // Create the Asset
        restAssetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(asset)))
            .andExpect(status().isCreated());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeCreate + 1);
        Asset testAsset = assetList.get(assetList.size() - 1);
        assertThat(testAsset.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testAsset.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createAssetWithExistingId() throws Exception {
        // Create the Asset with an existing ID
        asset.setId(1L);

        int databaseSizeBeforeCreate = assetRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAssetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(asset)))
            .andExpect(status().isBadRequest());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAssets() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        // Get all the assetList
        restAssetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(asset.getId().intValue())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getAsset() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        // Get the asset
        restAssetMockMvc
            .perform(get(ENTITY_API_URL_ID, asset.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(asset.getId().intValue()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingAsset() throws Exception {
        // Get the asset
        restAssetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAsset() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        int databaseSizeBeforeUpdate = assetRepository.findAll().size();

        // Update the asset
        Asset updatedAsset = assetRepository.findById(asset.getId()).get();
        // Disconnect from session so that the updates on updatedAsset are not directly saved in db
        em.detach(updatedAsset);
        updatedAsset.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restAssetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAsset.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAsset))
            )
            .andExpect(status().isOk());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
        Asset testAsset = assetList.get(assetList.size() - 1);
        assertThat(testAsset.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAsset.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, asset.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(asset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(asset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(asset)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAssetWithPatch() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        int databaseSizeBeforeUpdate = assetRepository.findAll().size();

        // Update the asset using partial update
        Asset partialUpdatedAsset = new Asset();
        partialUpdatedAsset.setId(asset.getId());

        partialUpdatedAsset.name(UPDATED_NAME);

        restAssetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAsset.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAsset))
            )
            .andExpect(status().isOk());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
        Asset testAsset = assetList.get(assetList.size() - 1);
        assertThat(testAsset.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAsset.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateAssetWithPatch() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        int databaseSizeBeforeUpdate = assetRepository.findAll().size();

        // Update the asset using partial update
        Asset partialUpdatedAsset = new Asset();
        partialUpdatedAsset.setId(asset.getId());

        partialUpdatedAsset.name(UPDATED_NAME).description(UPDATED_DESCRIPTION);

        restAssetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAsset.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAsset))
            )
            .andExpect(status().isOk());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
        Asset testAsset = assetList.get(assetList.size() - 1);
        assertThat(testAsset.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testAsset.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, asset.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(asset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(asset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAsset() throws Exception {
        int databaseSizeBeforeUpdate = assetRepository.findAll().size();
        asset.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAssetMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(asset)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Asset in the database
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAsset() throws Exception {
        // Initialize the database
        assetRepository.saveAndFlush(asset);

        int databaseSizeBeforeDelete = assetRepository.findAll().size();

        // Delete the asset
        restAssetMockMvc
            .perform(delete(ENTITY_API_URL_ID, asset.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Asset> assetList = assetRepository.findAll();
        assertThat(assetList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
