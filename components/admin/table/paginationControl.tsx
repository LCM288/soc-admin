import React, { useMemo } from "react";
import { Form, Level, Button } from "react-bulma-components";

interface Props {
  gotoPage: (page: number) => void;
  pageIndex: number;
  pageCount: number;
}

const { Field, Control } = Form;

const PaginationControl = ({
  gotoPage,
  pageIndex,
  pageCount,
}: Props): React.ReactElement => {
  const pageIndices = useMemo(() => {
    if (pageCount <= 0) {
      return [];
    }
    const len = Math.ceil(Math.log(pageCount));
    const diff = Array(len)
      .fill(0)
      .map((_, idx) => 2 ** (idx + 1) - 1);

    return [
      ...diff.map((d) => pageIndex - d),
      pageIndex,
      ...diff.map((d) => pageIndex + d),
    ]
      .filter((x) => x > 0 && x < pageCount - 1)
      .concat(pageCount === 1 ? [0] : [0, pageCount - 1])
      .sort((a, b) => a - b);
  }, [pageIndex, pageCount]);

  return (
    <Level>
      <Level.Item>
        <Field kind="addons">
          {pageIndices.map((p) => (
            <Control key={p}>
              <Button
                onClick={() => gotoPage(p)}
                className={pageIndex === p ? "is-info" : ""}
              >
                {p + 1}
              </Button>
            </Control>
          ))}
        </Field>
      </Level.Item>
    </Level>
  );
};

export default PaginationControl;
