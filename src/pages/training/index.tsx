import React from 'react';
import styled from 'styled-components';

const TrainingWrapper = styled.div`
  animation: 0.2s ease-out 0s 1 fadeIn;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const Training = () => <TrainingWrapper>Training</TrainingWrapper>;

export default Training;
