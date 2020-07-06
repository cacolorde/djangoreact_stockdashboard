import React from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import Row from "react-bootstrap/Row";

const ProgressBarComponent = (props) => {
  return (
    <>
      <Row>
        <ProgressBar
          animated
          variant="dark"
          now={props.loadingProgress}
          style={{ width: "100%" }}
          label={`${Math.round(props.loadingProgress)}%`}
        />
      </Row>
    </>
  );
};

export default ProgressBarComponent;
