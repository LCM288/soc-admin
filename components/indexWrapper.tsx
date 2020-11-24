import React from "react";
import { Section, Container } from "react-bulma-components";

interface Props {
  children: React.ReactElement;
}

const IndexWrapper = ({ children }: Props): React.ReactElement => (
  <div
    style={{
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      position: "absolute",
    }}
  >
    <Section>
      <Container
        className="has-text-centered"
        style={{
          minWidth: "75vw",
          borderRadius: ".25rem",
        }}
      >
        {children}
      </Container>
    </Section>
  </div>
);

export default IndexWrapper;
