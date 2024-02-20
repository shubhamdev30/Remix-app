import {
    SkeletonPage,
    Layout,
    LegacyCard,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText,
  } from '@shopify/polaris';
  import React from 'react';
  
  function Sk_customreport() {
    return (
      <div className="animate_skeleton">
      <SkeletonPage primaryAction fullWidth>
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </TextContainer>
            </LegacyCard>
            <LegacyCard sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </TextContainer>
            </LegacyCard>
            <LegacyCard sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </TextContainer>
            </LegacyCard>
            <LegacyCard sectioned>
              <TextContainer>
                <SkeletonDisplayText size="small" />
                <SkeletonBodyText lines={2} />
              </TextContainer>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
      </div>
    );
  }
  export default Sk_customreport;