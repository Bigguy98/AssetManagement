package demo.vtt.clgsp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import demo.vtt.clgsp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AssetTypeTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AssetType.class);
        AssetType assetType1 = new AssetType();
        assetType1.setId(1L);
        AssetType assetType2 = new AssetType();
        assetType2.setId(assetType1.getId());
        assertThat(assetType1).isEqualTo(assetType2);
        assetType2.setId(2L);
        assertThat(assetType1).isNotEqualTo(assetType2);
        assetType1.setId(null);
        assertThat(assetType1).isNotEqualTo(assetType2);
    }
}
