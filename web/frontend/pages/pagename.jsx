import { Card, Page, Layout, Text } from "@shopify/polaris";
import { TitleBar } from "@shopify/app-bridge-react";

export default function PageName() {
  return (
    <Page>
      <TitleBar
        title="Page name"
      />

      <Layout>
        <Layout.Section>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
            "Heading"
            </Text>
            <BlockStack>
              <p>"Body"</p>
            </BlockStack>
          </Card>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
            "Heading"
            </Text>
            <BlockStack>
              <p>"Body"</p>
            </BlockStack>
          </Card>
        </Layout.Section>
        <Layout.Section secondary>
          <Card sectioned>
            <Text variant="headingMd" as="h2">
            "Heading"
            </Text>
            <BlockStack>
              <p>"Body"</p>
            </BlockStack>
          </Card>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
