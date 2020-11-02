import React from "react";
import { Modal, Loader } from "react-bulma-components";

interface Props {
  loading: boolean;
}

const Loading: React.FunctionComponent<Props> = ({ loading }: Props) => (
  <Modal show={loading} closeOnEsc={false} showClose={false}>
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

export default Loading;
