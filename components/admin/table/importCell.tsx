import React, { useState, useEffect } from "react";

const ImportCell = ({
  row: { index },
  column: { id },
  data,
}: any): React.ReactElement => {
  const dataValue = data[index][id];
  const [value, setValue] = useState(dataValue);

  // If the initialValue is changed external, sync it up with our state
  useEffect(() => {
    setValue(dataValue);
  }, [dataValue]);

  return value;
};

export default ImportCell;
