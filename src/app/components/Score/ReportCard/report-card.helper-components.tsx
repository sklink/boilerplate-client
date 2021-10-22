import _ from 'lodash';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export const DiagonalSplit = styled.div`
  background: linear-gradient(to right top,#fff 49%,transparent 50%);
  width: 140px;
`;

export const PlayerIconWrapper = styled.div`
  border-radius: 200px;
  overflow: hidden;
  background: #fafafa;
  width: 160px;
  height: 160px;
  border: 1px solid #aaa;

  & img {
    margin-top: 4px;
    margin-left: 10px;
    height: 80%;
  }
`;

export const PositionBannerWrapper = styled.div`
  display: flex;
  position: relative;
  top: -24px;
`;

export const PositionBannerLeft = styled.div`
  background: linear-gradient(to right bottom,transparent 49%,#eb1c22 50%);
  width: 16px;
`;

export const PositionBannerCenter = styled.div`
  background: #eb1c22;
  color: #fff;
  font-weight: 700;
  font-size: 18px;
  text-align: center;
  text-transform: uppercase;
  flex-grow: 1;
  padding: 8px 0;
`;

export const PositionBannerRight = styled.div`
  background: linear-gradient(to left top,transparent 49%,#eb1c22 50%);
  width: 16px;
`;

export const Highlight = styled.span`
  color: #169dd6!important;
`;

export const PaymentFormWrapper = styled.div`
  box-shadow: 0 0 0 0.5px rgb(50 50 93 / 10%), 0 2px 5px 0 rgb(50 50 93 / 10%), 0 1px 1.5px 0 rgb(0 0 0 / 7%);
  border-radius: 7px;
  width: 100%;
`;

export const CardElementWrapper = styled.div`
  border-radius: 4px 4px 0 0;
  padding: 12px;
  border: 1px solid rgba(50,50,93,.1);
  height: 44px;
  width: 100%;
  background: #fff;
`;

export const CardSubmitButton = styled.button`
  background: #5469d4;
  color: #fff;
  font-family: Arial,sans-serif;
  border-radius: 0 0 4px 4px;
  border: 0;
  padding: 12px 16px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: block;
  transition: all .2s ease;
  box-shadow: 0 4px 5.5px 0 rgb(0 0 0 / 7%);
  width: 100%;
`;

export const CardSpinner = styled.div`
  color: #fff;
  font-size: 22px;
  text-indent: -99999px;
  margin: 0 auto;
  position: relative;
  width: 20px;
  height: 20px;
  box-shadow: inset 0 0 0 2px;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
`;

export const CardError = styled.p`
  color: #697386;
  text-align: left;
  font-size: 13px;
  line-height: 17px;
  margin: 16px 12px 12px;
`;

export const RibbonWrapper = styled.div`
  display: flex;
  float: left;
  position: relative;
  top: 68px;

  & > p {
    background: #eb1c22;
    font-size: 24px;
    color: #fff;
    text-transform: uppercase;
    padding: 16px 68px 16px 120px;
  }
`;

export const RibbonDiagonal = styled.div`
  background: linear-gradient(to left top, transparent 49%, #eb1c22 50%);
  width: 40px;
`;

export const ReportMain = styled.div`
  color: hsla(0,0%,100%,.56);
  background: #242426;
  padding: 60px 120px 40px;
  margin-top: 120px;
`;

export const ReportNotice = styled.h3`
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  color: rgba(0, 0, 0, 0.56);
  text-align: center;
`;

export const ReportFooter = styled.div`
  background: #bdd739;
  color: #fff;
  display: flex;
  flex-direction: row;
  padding: 24px;
`;

export const SkillWrapper = styled.div`
  background: #fff;
  border-radius: 8px;
`

export const SkillRow = styled.div`
  background: #fff;
  padding: 12px 24px;
  margin-bottom: 40px;
  display: flex;
  align-items: center;
`;

export const SkillTitle = styled.div`
  color: #58b0e3;
  font-size: 21px;
  margin-right: 40px;
  padding-right: 40px;
  width: 300px;
  border-right: 1px solid hsla(0,0%,100%,.24);
`;

export const SkillScore = styled.div`
  background: #eef0f0;
  color: #777;
  border-radius: 2px;
  padding: 8px 16px;
  margin: 11px;
  font-weight: 700;
  font-size: 17px;
  text-align: center;
  flex-grow: 1;
`;


export const processSkillName = (name: string) => {
  const split = name.split('-');
  const content: ReactNode[] = [];

  _.each(split, (item, index) => {
    content.push(<span key={item}>{item}</span>);
    if (index < split.length - 1) {
      content.push(<br />);
    }
  });

  return content;
};

export const WeightCategoryRow = styled.div`
  background: #141412;
  padding: 24px;
  display: flex;
  align-items: center;
  margin-top: 40px;
`;

export const WeightCategoryTitle = styled.div`
  color: #58b0e3;
  font-size: 21px;
  margin-right: 24px;
`;

export const WeightCategoryScore = styled.div`
  color: #58b0e3;
  font-size: 21px;
  font-weight: 700;
  text-align: center;
  margin-left: 24px;
`;
