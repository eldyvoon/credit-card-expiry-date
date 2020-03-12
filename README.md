React component for credit card expiry date input
Demo:
https://1lfmm.csb.app

Usage:

```
import React, { useState } from "react";
import ExpiryDateInput from "credit-card-expiry-date";

export default function App() {
  const [expiryDate, setExpiryDate] = useState({
    value: ""
  });

  const handleExpiryDate = date => {
    setExpiryDate({
      value: date
    });
  };

  return (
    <div className="App">
      <div style={{ width: "100px" }}>
        <ExpiryDateInput
          label="Expiry Date"
          onChange={date => handleExpiryDate(date)}
          value={expiryDate}
          disabled={false}
          onBlur={date => handleExpiryDate(date)}
        />
      </div>
    </div>
  );
}
```

https://codesandbox.io/s/expiry-date-1lfmm

source code credit:
https://www.linkedin.com/in/nur-liyana-mohd-lazim
