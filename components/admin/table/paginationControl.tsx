import React from "react";
import { Form, Level, Button } from "react-bulma-components";

interface Props {
  gotoPage: (page: number) => void;
  pageIndex: number;
  pageCount: number;
}

const { Field, Control } = Form;

const getPageIndices = (currentPage: number, pageCount: number): number[] => {
  if (pageCount <= 0) {
    return [];
  }
  const len = Math.ceil(Math.log(pageCount));
  const diff = Array(len)
    .fill(0)
    .map((_, idx) => 2 ** (idx + 1) - 1);

  return [
    ...diff.map((d) => currentPage - d),
    currentPage,
    ...diff.map((d) => currentPage + d),
  ]
    .filter((x) => x > 0 && x < pageCount - 1)
    .concat(pageCount === 1 ? [0] : [0, pageCount - 1])
    .sort((a, b) => a - b);
};

const PaginationControl = ({
  gotoPage,
  pageIndex,
  pageCount,
}: Props): React.ReactElement => {
  const pageIndices = getPageIndices(pageIndex, pageCount);
  return (
    <Level>
      <Level.Item>
        <Field kind="addons">
          {pageIndices.map((p) => (
            <Control>
              <Button
                key={p}
                onClick={() => gotoPage(p)}
                className={{ "is-info": pageIndex === p }}
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
