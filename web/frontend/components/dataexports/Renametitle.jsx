import { Icon, Modal, TextField } from "@shopify/polaris"
import { EditIcon } from "@shopify/polaris-icons";
import { useState, useCallback, useEffect } from "react"

function Renametitle(props) {
  const [active, setActive] = useState(false)
  const [reporttitle, setreporttitle] = useState(props.reporttitle)

  const handleChange = useCallback(() => setActive(!active), [active])

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
      <Icon source={EditIcon} color="base" style={{ padding: '20px' }} />
      Rename
    </span>
  );
  useEffect(() => {
    setreporttitle(props.reporttitle)
  },[])
  
  return (
      <Modal
        activator={activator}
        open={active}
        onClose={()=>{
          setreporttitle(props.reporttitle)
          handleChange();
        }}
        title="Rename Report"
        primaryAction={{
          content:  <div style={{ padding: '6px 15px' }}>Save</div>,
          onAction: ()=>{
            props.updatetitle(reporttitle);
            handleChange();
          },
          key:"confirmsave"
        }}
        secondaryActions={[
          {
            content: "Cancel",
            onAction: ()=>{
              setreporttitle(props.reporttitle)
              handleChange();
            },
            key:"cancel_popup"
          }
        ]}
      >
        <Modal.Section>
        <TextField
      value={reporttitle}
      onChange={setreporttitle}
      autoComplete="off"
    />
        </Modal.Section>
      </Modal>
  )
}
export default Renametitle