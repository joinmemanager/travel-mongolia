import React from 'react';
import styled from 'styled-components';

import { Meta } from '@/layout/Meta';
import { Main } from '@/templates/Main';

const LessonWrapper = styled.div`
  animation: 0.2s ease-out 0s 1 fadeIn;
  display: flex;
  gap: 22px;
  padding: 47px 0;

  .lesson-list {
    flex: 0 0 346px;
    background: #ffffff;
    box-shadow: 0 20px 13px rgba(15, 14, 94, 0.035),
      0 8.14815px 6.51852px rgba(15, 14, 94, 0.0274815),
      0 1.85185px 3.14815px rgba(15, 14, 94, 0.0168519);
    border-radius: 10px;
    padding: 31px 11px;
  }
  .lesson-detail {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 19px;

    h5.title {
      font-weight: 500;
      font-size: 22px;
      line-height: 1.2;
      color: #141414;
    }
    div.content-card {
      background: #ffffff;
      border-radius: 10px;
      padding: 19px 17px;
    }
  }
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const LessonPage = () => (
  <Main meta={<Meta />}>
    <LessonWrapper className="container lesson-container">
      <div className="lesson-list">Index</div>
      <div className="lesson-detail">
        <h5 className="title">Техник шинжилгээ гэж юу вэ?</h5>
        <div className="content-card">player here</div>
        <h5 className="title">Танилцуулга</h5>
        <div className="content-card">
          Уг хичээлээр техник шинжилгээний талаар орох ба...
        </div>
      </div>
    </LessonWrapper>
  </Main>
);

export default LessonPage;
