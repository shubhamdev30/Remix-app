import { BlockStack,Modal, Icon, Spinner, Text} from "@shopify/polaris";

import { DeleteIcon} from "@shopify/polaris-icons";
import { useState, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthenticatedFetch } from "../../hooks"


function Delete_report(props) {
  const fetch = useAuthenticatedFetch();
  const nav = useNavigate();
  const [active, setActive] = useState(false)
  const [deletingdata, setdeletingdata] = useState(false)

  const handleChange = useCallback(() => {
    setActive(!active), [active]
  })
  const deleterport = useCallback(() => {
    setdeletingdata(true);
    let newsavedata = JSON.stringify(props.reportid)
    fetch(`/api/deletereport/?data=${encodeURIComponent(newsavedata)}`)
      .then((response) => response.json())
      .then((data) => {
        if(props.crpage == "cusreport"){
        props.updatedata((prevItems) => prevItems.filter((item) => item.report_id !== props.reportid))
        nav("/cusreportspage");
      }else{
          nav("/")
        }
        if(props.fortoast != undefined){
        props.fortoast();
        }
        setdeletingdata(false);
        setActive(!active), [active]
      })
  })

  const activator = (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: 'pointer',
        padding:"4px 8px"
      }}
      onClick={handleChange}
    >
        <Icon
          source={DeleteIcon}
          color="base"
          style={{ marginRight: '8px' }}
        />
      Delete
    </span>
  );

  return (
    <Modal
      activator={activator}
      open={active}
      onClose={handleChange}
      title={`Delete ${props.reporttitle}`}
      primaryAction={{
        content: deletingdata ? (
          <div style={{ padding: '5px 15px' }}>
          <Spinner accessibilityLabel="Deleting" size="small" />
          </div>
        ) : (
          <div style={{ padding: '6px 15px' }}>Delete</div>
        ),
        onAction: () => deleterport(),
        destructive: true,
      }}
      secondaryActions={[
        {
          content: "Cancel",
          onAction: handleChange
        }
      ]}
    >
      <Modal.Section>
        <BlockStack>
          <p>
            Are you sure you want to delete the report <Text as="span" fontWeight="semibold">{props.reporttitle}</Text>? This action cannot be reversed.
          </p>
        </BlockStack>
      </Modal.Section>
    </Modal>
  )
}

export default Delete_report