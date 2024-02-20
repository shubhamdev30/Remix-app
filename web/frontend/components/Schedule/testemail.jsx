import { Autocomplete} from "@shopify/polaris"
import { PlusCircleIcon } from "@shopify/polaris-icons";
import { useState, useCallback } from "react"

function Testemail() {
  const [inputValue, setInputValue] = useState("")
  const updateText = useCallback(
    value => {
      setInputValue(value)
    }
  )


  return (
    <Autocomplete
      actionBefore={{
        accessibilityLabel: "Action label",
        content: "Action with long name",
        ellipsis: true,
        helpText: "Add Email",
        icon: PlusCircleIcon,
        onAction: () => {
          console.log(inputValue)
        }
      }}
      options={[]}
      textField={    <Autocomplete.TextField
          onChange={updateText}
          label="Tags"
          value={inputValue}
          placeholder="Email"
          autoComplete="off"
        />}
    />
  );
}

export default Testemail