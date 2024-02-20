import { Banner, Box} from '@shopify/polaris'

const LinearLoading = () => {

    return  <>
    <Box paddingBlockEnd="400">
    <Banner title="Data Importing" onDismiss={() => {}}>
    <p>This may be take couple of minutes. Please wait...</p>
    </Banner>
    </Box>
    {/* <Card>
     <div className="custom-linear-loading-bar"></div>
    </Card>  */}
    </>
    
   
  };

export default LinearLoading