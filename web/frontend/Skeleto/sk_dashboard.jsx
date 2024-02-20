import {
    SkeletonPage,
    Layout,
    LegacyCard,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText,
  } from '@shopify/polaris';
  import React from 'react';
  
  function Sk_dashboard() {
    return (
      <div className="animate_skeleton">
        <SkeletonPage primaryAction fullWidth>
        <Layout>
          <Layout.Section variant="oneThird">
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={4} />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard subdued>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={9} />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={8} />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={5} />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard subdued>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={17} />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={5} />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard subdued>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={5} />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={7} />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard subdued>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={5} />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={2} />
                </TextContainer>
              </LegacyCard.Section>
              <LegacyCard.Section>
                <SkeletonBodyText lines={1} />
              </LegacyCard.Section>
            </LegacyCard>
            <LegacyCard subdued>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" />
                  <SkeletonBodyText lines={4} />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
      </div>
    );
  }
  export default Sk_dashboard;