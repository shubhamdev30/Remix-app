import { Button, Popover, ActionList } from "@shopify/polaris"
import { useState, useCallback } from "react"

function TableCol() {
  const [popoverActive, setPopoverActive] = useState(true)

  const togglePopoverActive = useCallback(
    () => setPopoverActive(popoverActive => !popoverActive),
    []
  )

  const activator = (
      <Button
      variant="plain"
      disclosure
      onClick={togglePopoverActive}
    >
      More actions
    </Button>
  )

  return (
      <Popover
        active={popoverActive}
        activator={activator}
        autofocusTarget="first-node"
        onClose={togglePopoverActive}
      >
        <ActionList
          actionRole="menuitem"
          items={[{ content: "Import" }, { content: "Export" }]}
        />
      </Popover>
  )
}

export default TableCol;