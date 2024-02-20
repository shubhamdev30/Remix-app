import { BlockStack, Layout, LegacyCard,Page, Text } from '@shopify/polaris'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useAuthenticatedFetch } from '../hooks'
import Masonry from 'react-masonry-css';
import Create_custom_report from './Data/Create_custom_report'
import Sk_dashboard from '../Skeleto/sk_dashboard'
function Dashboard(props) {
  let defaultdate = () => {
    function convertdate(dateString,dttype) {
      const inputDate = new Date(dateString);
      let formattedDate;

      const year = inputDate.getUTCFullYear();
      const month = String(inputDate.getUTCMonth() + 1).padStart(2, '0');
      const day = String(inputDate.getUTCDate()).padStart(2, '0');
      if(dttype == "end"){
          formattedDate = `${year}-${month}-${day}T23:59:59Z`;
      }else{
          formattedDate = `${year}-${month}-${day}T00:00:00Z`;
      }

      return formattedDate;
  }
    let obj = {};
    obj["start"] = convertdate(new Date(new Date(new Date().setHours(0, 0, 0, 0))).setFullYear(new Date(new Date().setHours(0, 0, 0, 0)).getFullYear() - 1),""),
      obj["end"] = convertdate(new Date(
        new Date(new Date().setDate(new Date(new Date().setHours(0, 0, 0, 0)).getDate() - 1)).setHours(0, 0, 0, 0)),"end")
    return obj;
  }
  const fetch = useAuthenticatedFetch();
  const [loading, setloading] = useState(true);
  const [cusreportfields, setcusreportfields] = useState([]);
  const [customreportdata, setcustomreportdata] = useState({ title: "", Category: "", type: "", report_id: "", default_columns: [], lastactivefilter: [], lastactivefilterquery: "", lastactivedate: defaultdate(), reporttype: "custom", updated: "", datafrom: "lastYear" });

  const [homepage, sethomepage] = useState([]);
  useEffect(() => {
    GetRecent();
      Promise.all([
        fetch(`/api/Getfieldsinfo`).then((response) => response.json()),
        fetch(`/api/gettemplates`).then((response) => response.json()),
      ])
        .then((data) => {
          const fieldsInfoData = data[0].collection;
          const templatesData = data[1].collection;
          // Set the state variables
          setcusreportfields(fieldsInfoData);
          sethomepage(templatesData);
          setloading(false);
          sessionStorage.setItem("fieldsInfoData", JSON.stringify(fieldsInfoData));
          sessionStorage.setItem("templatesData", JSON.stringify(templatesData));
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
          setloading(false);
        });
    // }
  }, []);


  const [clickedLinks, setClickedLinks] = useState(() => {[]});
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const linkStyle = {
    color: "black",
    textDecoration: isHovered ? 'underline' : 'underline',
    cursor: 'pointer', // Add a pointer cursor on hover
  };

  const GetRecent = async () => {

   await fetch('/api/getrecent')
    .then(response => response.json())
    .then(data => {
      setClickedLinks(data.recents);
      console.log(data.recents);
    })
  }
  const postRecent = async (newClickedLinks) => {

   await fetch('/api/postrecent', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({links:newClickedLinks})
    })
    .then(response => response.json())
    .then(data => {
    
      
      console.log(data);
    })
  }


  const handleLinkClick = (link) => {
    var data = [];
    const linkData = { id: `/Datable?id=${link.id}`, label: link.label };
   data.push(linkData);
    postRecent(data);

  };
  const fetchInventory = async () => {
    try {
      const response = await fetch('https://api.pld.live/stockshare/RGNMVX-8YGGTZ-WEBPER-WB1433');
      
      if (!response.ok) {
        throw new Error('Failed to fetch inventory');
      }
  
      const data = await response.json();
      console.log('Inventory data:', data);
  
      // Now you can use the 'data' to update your Shopify store's inventory
      // ...
  
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };
  const handleFetchInventory = () => {
    fetchInventory();
  };

  return  <>
       
  {!loading ? (
    <Page title="Dashboard" fullWidth primaryAction={{ content:  <Create_custom_report newtags={cusreportfields}
    customreport={customreportdata}
    updatecustomreport={setcustomreportdata}/> ,key:"create_cusrpt"}}>
        {/* <Button onClick={handleFetchInventory}>Fetch Inventory</Button> */}
      <Layout title="Pre Made Templates"> 
      
      <Masonry
  breakpointCols={{ default: 3, 1100: 2, 700: 1, 500: 1 }}
  className="masonry-grid"
  columnClassName="masonry-column"
>
  {[...homepage.filter(obj => obj.label === "Most Popular"), ...homepage.filter(obj => obj.label !== "Most Popular")].map((obj, index) => (
    <div key={obj.prereportid}>
      {clickedLinks !== undefined && clickedLinks.length > 1 && index == 1  && 
              <Layout.Section variant="oneHalf">
                <LegacyCard sectioned>
                  <BlockStack gap="100">
                    <div class="fle">
                    {/* <svg xmlns="http://www.w3.org/2000/svg" width="31" height="32" viewBox="0 0 31 32" fill="none">
                    <path d="M12.744 10.0283C12.744 9.11714 13.4609 8.37811 14.3455 8.37811C15.2301 8.37811 15.9469 9.11714 15.9469 10.0283V16.9433L20.3875 18.954C21.1964 19.3207 21.5633 20.2929 21.2073 21.1255C20.8513 21.9581 19.9073 22.336 19.099 21.9699L13.783 19.5626C13.1757 19.3281 12.744 18.7251 12.744 18.0179V10.0283ZM0.327029 10.511C0.281014 10.3707 0.252557 10.2216 0.244686 10.0663L0.00249743 5.48313C-0.0429128 4.57572 0.635214 3.8024 1.51617 3.75625C2.39713 3.70947 3.14792 4.40796 3.19272 5.31537L3.23752 6.16353C3.89736 5.28893 4.64435 4.48795 5.46626 3.77371C6.55429 2.82826 7.79005 2.02188 9.16023 1.39261C13.0758 -0.406614 17.325 -0.402249 21.0287 1.05896C24.6948 2.50583 27.8317 5.37898 29.59 9.3429C29.6366 9.42896 29.676 9.52001 29.7075 9.61481C31.3943 13.6099 31.3743 17.9299 29.9721 21.7018C28.5674 25.478 25.778 28.7091 21.9296 30.5195C21.6912 30.6572 21.4224 30.7291 21.1491 30.7285C20.2646 30.7285 19.5477 29.9901 19.5477 29.0789C19.5477 28.3617 19.9921 27.7518 20.6127 27.5248C21.0783 27.3046 21.5245 27.0589 21.9502 26.7889C21.9986 26.7477 22.0501 26.709 22.1046 26.6729C22.7906 26.2164 23.4427 25.6937 24.0324 25.1113C24.0711 25.0732 24.1117 25.037 24.1535 25.004C25.4044 23.7255 26.3622 22.1938 26.9816 20.5287C28.1115 17.4915 28.1181 14.014 26.7334 10.8172L26.7328 10.8153C25.3481 7.61851 22.8342 5.30103 19.8898 4.13917C16.9411 2.97606 13.565 2.9692 10.4614 4.39486C9.40313 4.88042 8.4166 5.51719 7.53091 6.28639C6.93392 6.80527 6.39263 7.37528 5.91128 7.98833L6.12017 7.96151C6.9975 7.85113 7.79611 8.49473 7.90328 9.3984C8.01045 10.3021 7.3856 11.1247 6.50828 11.235L2.08471 11.7963C1.25764 11.8999 0.500799 11.3342 0.327029 10.511ZM17.1646 31.8997C18.4288 31.7537 19.0318 30.2202 18.2217 29.208C17.876 28.7758 17.3504 28.5632 16.8116 28.6205C15.8694 28.7297 14.9267 28.7278 13.9852 28.6124C13.4197 28.5432 12.8681 28.7821 12.5206 29.2467C11.7722 30.2713 12.3662 31.7269 13.5995 31.8878C14.7851 32.0338 15.9778 32.0369 17.1646 31.8997ZM6.94785 29.3633C7.42738 29.6913 8.02377 29.7288 8.54144 29.4718C9.64885 28.9068 9.75057 27.3258 8.72369 26.618C7.94808 26.091 7.20154 25.4355 6.56761 24.7371C5.98757 24.1009 5.03698 24.0355 4.38126 24.588C4.21191 24.731 4.07285 24.9083 3.97268 25.1088C3.8725 25.3094 3.81335 25.529 3.79888 25.7541C3.78441 25.9791 3.81492 26.2049 3.88854 26.4173C3.96216 26.6297 4.0773 26.8243 4.22686 26.9891C5.03456 27.8746 5.96214 28.6941 6.94785 29.3633ZM0.661855 20.7033C0.838652 21.292 1.31092 21.7211 1.89762 21.8371C3.08071 22.0635 4.07792 20.9116 3.7219 19.7279C3.43975 18.7924 3.2684 17.8407 3.19877 16.8635C3.11643 15.7203 1.97512 15.0162 0.954902 15.4709C0.333084 15.7609 -0.0417019 16.3933 0.00370837 17.0967C0.0896851 18.3228 0.307654 19.529 0.661855 20.7033Z" fill="black"/>
                    </svg> */}
                    <Text variant="headingLg" as="h6">
                      Most Recent
                    </Text>
                    </div>
                    {clickedLinks.map((link) => (
                      <NavLink onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={linkStyle} key={link.id} to={link.id}>
                        {link.label}
                      </NavLink>
                    ))}
                  </BlockStack>
                </LegacyCard>
              </Layout.Section>
        }
      <Layout.Section variant="oneHalf">
        <LegacyCard sectioned>
          <BlockStack gap="100">
            <div className="fle">
              {/* {parse(obj.svg)} */}
              <Text variant="headingLg" as="h6">
                {obj.label}
              </Text>
            </div>
            {obj.links.map((link) => (
              <NavLink
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={linkStyle}
                onClick={() => handleLinkClick(link)}
                key={link.id}
                to={`/Datable?id=${link.id}`}
              >
                {link.label}
              </NavLink>
            ))}
          </BlockStack>
        </LegacyCard>
      </Layout.Section>
    </div>
  ))}
</Masonry>


      </Layout>
    </Page>
  ) : (
    <Sk_dashboard/>
  )}
</>
}

export default Dashboard