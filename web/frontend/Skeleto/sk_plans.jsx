import {
    SkeletonPage,
    Layout,
    LegacyCard,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText,
  } from '@shopify/polaris';
  import React from 'react';
  
  function Sk_plans() {
    return (
      <div className="animate_skeleton">
        <SkeletonPage fullWidth>
        <Layout>

          <Layout.Section variant="oneThird">
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" fullWidth/>
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonDisplayText size="small" />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" fullWidth/>
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonDisplayText size="small" />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" fullWidth/>
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonDisplayText size="small" />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
          <Layout.Section variant="oneThird">
            <LegacyCard>
              <LegacyCard.Section>
                <TextContainer>
                  <SkeletonDisplayText size="small" fullWidth/>
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonBodyText lines={1} />
                  <SkeletonDisplayText size="small" />
                </TextContainer>
              </LegacyCard.Section>
            </LegacyCard>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
      </div>
    );
  }
  export default Sk_plans;