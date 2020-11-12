import React from "react";
import { Modal, Loader } from "react-bulma-components";
import useClipped from "utils/useClipped";

interface Props {
  loading: boolean;
}

const Loading = ({ loading }: Props): React.ReactElement => {
  useClipped(loading);

  return (
    <Modal
      show={loading}
      closeOnEsc={false}
      showClose={false}
      onClose={() => {}}
    >
      <Loader
        style={{
          position: "absolute",
          margin: "auto",
          height: "50vmin",
          width: "50vmin",
        }}
      />
    </Modal>
  );
};

export default Loading;
