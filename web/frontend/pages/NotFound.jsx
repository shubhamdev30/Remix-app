import { Card, EmptyState, Page, Text } from "@shopify/polaris";
import { notFoundImage } from "../assets";

 function NotFound() {
  return (
    <Page fullWidth>
      <Card>
        <EmptyState
        heading={      <Text variant="headingLg" as="h5">
        Oops! Page Not Found
      </Text>}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
      >
        <Text as="p" fontWeight="medium">
        Check your coordinates (URL) or return to the homepage.
        </Text>
      </EmptyState>
      </Card>
    </Page>
  );
}

export default NotFound
