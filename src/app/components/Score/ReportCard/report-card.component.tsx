import _ from 'lodash';
import React, { FormEvent } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

// Material UI
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import TableHead from '@material-ui/core/TableHead';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';

// Data
import imgColorLogo from '../../../assets/logo-colour.png';
import imgWhiteLogo from '../../../assets/logo-white.png';
import imgPlayer from '../../../assets/player.png';
import imgAltea from '../../../assets/alteaactive.png';
import imgWinnipegIce from '../../../assets/winnipegice.png';

// Components
import {
  DiagonalSplit,
  Highlight,
  PlayerIconWrapper,
  PositionBannerCenter,
  PositionBannerLeft,
  PositionBannerRight,
  PositionBannerWrapper,
  processSkillName,
  ReportFooter,
  ReportMain,
  ReportNotice,
  RibbonDiagonal,
  RibbonWrapper,
  WeightCategoryRow,
  WeightCategoryScore,
  WeightCategoryTitle
} from './report-card.helper-components';
import { Bold } from '../../_core/_ui/typography.component';
import { Spacer } from '../../_core/_ui/structure.components';
import CheckoutForm from './checkout-form.component';
import { STRIPE_PK } from '../../../lib/constants';

const stripePromise = loadStripe('pk_live_Mef1DB9rn8F8vFEGSAO6VBEp');

interface IReportCard {
  player?: IPlayer;
  playerAssessment?: IPlayerAssessment;
  loading: boolean;
  loadingCategories: boolean;
  categories: IWeightCategory[];
  summaryBySkillId: { [key: string]: IScoreSummary };
  bestSummaryBySkillId: { [key: string]: IScoreSummary };
  summaryByCategoryId: { [key: string]: IScoreSummary };
  groupSummaryBySkillId: { [key: string]: IScoreSummary };
  code: string;
}
const ReportCard: React.FC<IReportCard> = ({
  player,
  playerAssessment,
  loading,
  loadingCategories,
  categories,
  summaryBySkillId,
  bestSummaryBySkillId,
  summaryByCategoryId,
  groupSummaryBySkillId,
  code
}) => {
  if (!player && !playerAssessment && loading) return <Typography>Loading...</Typography>;
  if (!player || !playerAssessment) return <Typography>Unable to show your report card at this time. Please try again later</Typography>;

  const getOutboundLink = function(url: string) {
    gtag('event', 'click', {
      'event_category': 'outbound',
      'event_label': url,
      'transport_type': 'beacon',
      'event_callback': function(){
        // @ts-ignore
        document.location = url;
      }
    });

    setTimeout(() => {
      // @ts-ignore
      document.location = url;
    }, 3000);
  }
  return (
    <Box>
      <Box display="flex">
        <Box pt={12.5} pl={15} pr={5}>
          <img style={{ height: '80px' }} src={imgColorLogo} />
          <Typography variant="h3"><Bold>Report Card</Bold></Typography>
        </Box>
        <Box display="flex" style={{backgroundColor: '#3a3d3f', flexGrow: 1, float: 'left' }}>
          <DiagonalSplit/>
          <Box>
            <a onClick={() => getOutboundLink("https://ev2.evenue.net/cgi-bin/ncommerce3/SEGetGroupList?groupCode=GS&linkID=icesg-multi&shopperContext=&caller=&appCode=")} target="_blank"><img src={imgWinnipegIce} /></a>
          </Box>
        </Box>
      </Box>

      <Box py={5} px={15}>
        <Box display="flex">
          <Box mr={5}>
            <PlayerIconWrapper>
              <img src={imgPlayer} />
            </PlayerIconWrapper>
            <PositionBannerWrapper>
              <PositionBannerLeft/>
              <PositionBannerCenter>{playerAssessment.position.name}</PositionBannerCenter>
              <PositionBannerRight/>
            </PositionBannerWrapper>
          </Box>
          <Box>
            <Typography variant="h6">Report card for:</Typography>
            <Typography variant="h2"><Bold>{player.firstName} {player.lastName}</Bold></Typography>
            <Typography variant="h4">{playerAssessment.assessment.company.name}</Typography>
            <Typography variant="h4">{playerAssessment.assessment.name}, {playerAssessment.ageGroup.name}</Typography>
          </Box>
        </Box>
      </Box>

      <Box ml={15} mr={30}><Divider /></Box>

      <Box my={5} mx={15}>
        <Typography gutterBottom>
          This player report card includes evaluation results for over twenty key attributes related to core
          hockey skills, tactics and game play. This feedback will inform and help guide the long term hockey
          development for <Highlight>{player.firstName} {player.lastName}</Highlight>.
        </Typography>

        {(!playerAssessment.ageGroup.showReportPayment || playerAssessment.paymentRef) && (
          <Typography><Highlight>Your private evaluation results are listed below.</Highlight></Typography>
        )}

        {playerAssessment.ageGroup.showReportPayment && !playerAssessment.paymentRef && (<Box mb={4}>
          <Typography gutterBottom>
            The <Highlight>{playerAssessment.assessment.company.name}</Highlight> Board of Directors has
            opted to make the report card portion of this evaluation an optional purchase for all of its
            members. As a result, <Highlight>{player.firstName} {player.lastName}</Highlight>'s player report
            card is available for a fee of <Highlight>${(playerAssessment.ageGroup.reportPrice / 100).toFixed(2)} + GST</Highlight>.
          </Typography>

          <Typography>
            To view the evaluation results, simply enter your credit card details below and<br/>
            <Highlight>click "Buy & View Results"</Highlight>
          </Typography>
        </Box>)}
      </Box>

      {playerAssessment.ageGroup.showReportPayment && !playerAssessment.paymentRef && (
        <Box mx={15} maxWidth="600px">
          <Elements stripe={stripePromise}>
              <CheckoutForm code={code} playerAssessmentId={playerAssessment._id} ageGroupId={playerAssessment.ageGroup._id} />
          </Elements>
        </Box>
      )}

      <RibbonWrapper>
        <Typography>{playerAssessment.ageGroup.name}, { playerAssessment.position.name}</Typography>
        <RibbonDiagonal />
      </RibbonWrapper>

      <ReportMain>
        {playerAssessment.hasReportCard && loadingCategories && <ReportNotice>Generating Report Card...</ReportNotice>}
        {!playerAssessment.hasReportCard && (
          <ReportNotice>Report card is not ready for {player.firstName} {player.lastName}</ReportNotice>
        )}
        {playerAssessment.hasReportCard && playerAssessment.ageGroup.showReportPayment && !playerAssessment.paymentRef && (
          <ReportNotice>Purchase your report card to see the results</ReportNotice>
        )}
        {!loadingCategories && playerAssessment.hasReportCard && (!playerAssessment.ageGroup.showReportPayment || playerAssessment.paymentRef) && (
          <Box my={4}>
            {categories.map(category => {
              const currCategorySummary = summaryByCategoryId[category._id];
              if (!currCategorySummary) return <></>;

              const eleSkills = category.skills.map(skill => {
                const hiddenSkills = ['6123ca51aad58e0016949bf5', '61390f3934ed940016d2666e', '6123c974aad58e0016949be6'];
                const currSummary = summaryBySkillId[skill._id];
                const currGroupSummary = groupSummaryBySkillId[skill._id];
                const currGroupBest = bestSummaryBySkillId[skill._id];

                if (!currSummary || !currGroupSummary || !currGroupBest || _.includes(hiddenSkills, skill._id)) return null;

                return (
                  <TableRow>
                    <TableCell style={{ background: '#444', color: '#fff', borderTop: '1px solid #555', borderBottom: 'none' }}>
                      {processSkillName(skill.name)}
                    </TableCell>
                    <TableCell style={{ background: '#444', color: '#fff', borderTop: '1px solid #555', borderBottom: 'none' }}>
                      {_.round(currSummary.mean, 2)}
                    </TableCell>
                    <TableCell style={{ background: '#444', color: '#fff', borderTop: '1px solid #555', borderBottom: 'none' }}>
                      {_.round(currGroupSummary.mean, 2)}
                    </TableCell>
                    <TableCell style={{ background: '#444', color: '#fff', borderTop: '1px solid #555', borderBottom: 'none' }}>
                      {_.round(currGroupBest.mean, 2)}
                    </TableCell>
                  </TableRow>
                )
              });
              _.pull(eleSkills, null);

              return (
                <Box>
                  <WeightCategoryRow>
                    <WeightCategoryTitle>{category.name}</WeightCategoryTitle>
                    <Spacer />
                    {category.name === 'Forward Skating' && <a onClick={() => getOutboundLink("https://bit.ly/3kmAoxX")} target="_blank"><img src={imgAltea} /></a>}
                  </WeightCategoryRow>
                  <Paper>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell style={{ width: '40%', background: '#333', color: '#fff', borderTop: '1px solid #444', borderBottom: 'none' }} />
                          <TableCell style={{ width: '20%', background: '#333', color: '#fff', borderTop: '1px solid #444', borderBottom: 'none' }}>
                            {_.capitalize(player.firstName)}'s Avg.
                          </TableCell>
                          <TableCell style={{ width: '20%', background: '#333', color: '#fff', borderTop: '1px solid #444', borderBottom: 'none' }}>
                            Group Avg.
                          </TableCell>
                          <TableCell style={{ width: '20%', background: '#333', color: '#fff', borderTop: '1px solid #444', borderBottom: 'none' }}>
                            Group Best Avg.
                          </TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {eleSkills}
                      </TableBody>
                    </Table>
                  </Paper>
                </Box>
              );
            })}
          </Box>
        )}

        <Box my={4}><Divider /></Box>
        <Typography>It's important that you bear in mind that this report card:</Typography>
        <ul className="circle-bullet max--circle-bullet">
          <li>Is private to you</li>
          <li>Represents a moment in time</li>
          <li>Is intended to help inform you of your hockey strengths and weaknesses so that you can effectively invest
            in your skill development
          </li>
          <li>Is comprised of relevant skills for your age group and weighted according to Hockey Canada evaluation
            guidelines
          </li>
          <li>Shows average scores because for each skill metric being evaluated we’ve collected over 360 data points
            (scores) from multiple evaluators
          </li>
          <li>Compares your individual scores against your age group in your hockey association only</li>
        </ul>

        <Typography>Scoring legend:</Typography>
        <ul>
          <li>0 Cannot perform the skill</li>
          <li>1-2 Difficulty performing the skill</li>
          <li>3-4 Adequately performs the skill</li>
          <li>5-6 Good at performing the skill</li>
          <li>7-8 Very good at performing the skill</li>
          <li>9-10 Excellent at performing the skill</li>
        </ul>
      </ReportMain>

      <ReportFooter>
        <Spacer />
        <img style={{ height: '80px' }} src={imgWhiteLogo} alt="Max Analytics" />
      </ReportFooter>
    </Box>
  );
}

export default ReportCard;
