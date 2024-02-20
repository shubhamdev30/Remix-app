import {Toast, Button} from '@shopify/polaris';
import {useState, useCallback} from 'react';

function alert() {
  const [active, setActive] = useState(false);

  const toggleActive = useCallback(() => setActive((active) => !active), []);

  const toastMarkup = active ? (
    <Toast content="Message sent" onDismiss={toggleActive} />
  ) : null;

  return (
    <div style={{height: '250px'}}>
          <Button onClick={toggleActive}>Show Toast</Button>
          {toastMarkup}
    </div>
  );
}
export default alert