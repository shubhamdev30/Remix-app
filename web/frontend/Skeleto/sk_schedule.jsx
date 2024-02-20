import {
    SkeletonPage,
    Layout,
    LegacyCard,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText,
  } from '@shopify/polaris';
  import React from 'react';
  
  function Sk_schedule() {
    return (
      <div className="animate_skeleton">
      <SkeletonPage primaryAction fullWidth>
        <Layout>
          <Layout.Section>
            <LegacyCard sectioned>
              <TextContainer>
                <SkeletonBodyText lines={4} />
              </TextContainer>
            </LegacyCard>
            <LegacyCard sectioned>
              <TextContainer>
                <SkeletonBodyText lines={4} />
              </TextContainer>
            </LegacyCard>
            <LegacyCard sectioned>
              <TextContainer>
                <SkeletonBodyText lines={4} />
              </TextContainer>
            </LegacyCard>
            <LegacyCard sectioned>
              <TextContainer>
                <SkeletonBodyText lines={4} />
              </TextContainer>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
      </div>
    );
  }
  export default Sk_schedule;