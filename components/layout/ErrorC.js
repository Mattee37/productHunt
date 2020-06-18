import React from "react";
import { css } from "@emotion/core";

const ErrorC = ({ texto }) => {
  return (
    <h1
      css={css`
        margin-top: 5rem;
        text-align: center;
      `}
    >
      {texto}
    </h1>
  );
};

export default ErrorC;
