import React from "react";
import { Card, Badge } from "react-bootstrap";

const InfoCard = (props) => {
  const colorClass = props.percentageValue > 0 ? "success" : "danger";

  return (
    <Card bg="dark" text="light" className="z-depth-2 my-3">
      <div className="">
        <span
          className="px-2 ml-3 py-2 mt-n3 rounded unique-color"
          style={{ fontSize: "20px", color: "white" }}
        >
          {props.title.toUpperCase()}
        </span>
        <div className="float-right text-right p-3">
          <p className="text-uppercase mb-1">
            {/* <small> */}
            {props.description} {props.descriptionValue}
            {/* </small> */}
          </p>
          <h4 className="font-weight-bold mb-0">
            {props.value}
            <Badge pill className={`ml-1 badge-${colorClass}`}>
              {props.percentage}
            </Badge>
          </h4>
        </div>
      </div>
      <div
        className={`card-body badge-${colorClass} m-2 mb-n2 rounded pt-0`}
      ></div>
    </Card>
  );
};

export default InfoCard;
