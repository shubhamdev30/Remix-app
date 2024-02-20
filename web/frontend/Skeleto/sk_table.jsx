import {
    SkeletonPage,
    Layout,
    LegacyCard,
    SkeletonBodyText,
    TextContainer,
    SkeletonDisplayText,
    SkeletonTabs,
  } from '@shopify/polaris';
  import React from 'react';
  
  function Sk_table() {
    return (
      <div className="animate_skeleton">
      <SkeletonPage backAction primaryAction fullWidth>
        <Layout>
          <Layout.Section>
            <SkeletonDisplayText/>
          </Layout.Section>
          <Layout.Section>
            
          <LegacyCard>
      <SkeletonTabs count={15} />
      <SkeletonTabs count={15} />
      <SkeletonTabs count={15} />
      <SkeletonTabs count={15} />
      <SkeletonTabs count={15} />
      <SkeletonTabs count={15} />
      <SkeletonTabs count={15} />
      <SkeletonTabs count={15} />
      <SkeletonTabs count={15} />
      <SkeletonTabs count={15} />
    </LegacyCard>
          </Layout.Section>
        </Layout>
      </SkeletonPage>
      </div>
    );
  }
  export default Sk_table;