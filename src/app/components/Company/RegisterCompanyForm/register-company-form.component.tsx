import _ from 'lodash';
import React from 'react';
import styled from 'styled-components';
import { Field, Form } from 'formik';

// Material UI
import Box from '@material-ui/core/Box';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';

// Data
import { COMMON_MAIL_DOMAINS } from '../../../lib/constants';
import { isValidEmail } from '../../../lib/helpers/validation.helpers';
import messages from './register-company-form.messages';
import { APP_TITLE, COMPANY_TERM } from '../../../../_configuration';

// Components
import FormikInput from '../../_core/Formik/formik-input.component';
import { FormHelperText, FormLabel } from '../../_core/_ui/forms.component';
import { PrimaryButton } from '../../_core/_ui/buttons.component';
import IntlMsg from '../../_core/IntlMsg/intl-msg.component';
import { SectionHeading } from '../../_core/_ui/typography.component';
import FormikSelect from '../../_core/Formik/formik-select.component';
import { TIMEZONE_NAME_OPTIONS } from '../../../lib/timezone.constants';

const CompanyListing = styled.div`
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-width: 340px;
  margin-top: 16px;
  height: 70px;

  & div {
    margin-right: 16px;
    line-height: 22px;
  }
`;

const VerificationMsg = styled.div`
  margin-top: 16px;
  text-align: center;
  color: rgba(0, 0, 0, 0.56);
  line-height: 22px;
`;

interface IRegisterCompanyFormProps {
  form: any;
  currStep: number;
  onSetStep: Function;
  domain: string;
  loadingCompany: boolean;
  company: ICompany;
  onSearchCompany: Function;
}

const RegisterCompanyForm: React.FC<IRegisterCompanyFormProps> = ({ form, currStep, onSetStep, domain, company, loadingCompany, onSearchCompany }) => {
  const {
    handleChange,
    isSubmitting,
    errors,
    touched,
    values,
    setFieldValue,
    setTouched
  } = form;

  const debounceSearchCompany = React.useCallback(_.debounce((value: string) => {
    const nextDomain = value.split('@').pop();

    setFieldValue('email', value);
    setTouched({ email: true });

    if (isValidEmail(value) && !_.includes(COMMON_MAIL_DOMAINS, nextDomain)) {
      onSearchCompany(nextDomain);
    } else {
      onSearchCompany(null);
    }
  }, 100), []);

  const onKeyUpEmail = (e: any) => {
    if (!errors.email && touched.email && e.key === 'Enter') {
      onSetStep(2);
      setTouched({ email: true });
    } else {
      const { value } = e.currentTarget;
      debounceSearchCompany(value);
    }

    return false;
  };

  return (
    <Form>
      <SectionHeading>{_.capitalize(COMPANY_TERM)} Sign Up</SectionHeading>
      <VerificationMsg hidden={currStep !== 3}>
        An email has been sent to the address you provided<br />Please verify your email to gain access to {APP_TITLE}
      </VerificationMsg>
      <Field
        autoFocus
        fid="rcf"
        name="email"
        type="email"
        onKeyUp={onKeyUpEmail}
        component={FormikInput}
        label={messages.lblEmail}
        disabled={currStep > 1}
        uncontrolled
        defaultValue={values.email}
      />
      {values.email === '' && <FormHelperText>Enter your email to sign up</FormHelperText>}
      <Box hidden={currStep !== 1}>
        {loadingCompany && (
          <CompanyListing>
            <div>Loading...</div>
          </CompanyListing>
        )}
        {!loadingCompany && !errors.email && touched.email && (!domain || (domain && _.isNull(company))) && (
          <CompanyListing>
            <div>Set up a new {COMPANY_TERM}</div>
            <PrimaryButton onClick={() => onSetStep(2)}>Next</PrimaryButton>
          </CompanyListing>
        )}
        {!loadingCompany && company && (
          <CompanyListing>
            <div>You&#8217;re requesting to join<br /><strong>{company.name}</strong></div>
            <PrimaryButton onClick={() => onSetStep(2)}>Next</PrimaryButton>
          </CompanyListing>
        )}
      </Box>
      <div hidden={currStep !== 2}>
        {company && (
          <FormControl margin="normal" fullWidth component="div">
            <FormLabel htmlFor="company_registration__company_name"><IntlMsg {...messages.lblCompany} /></FormLabel>
            <CompanyListing>
              <div>Requesting to join <strong>{company.name}</strong></div>
            </CompanyListing>
          </FormControl>
        )}

        {!company && (
          <React.Fragment>
            <Field fid="rcf" name="companyName" label={messages.lblCompanyName} component={FormikInput} />

            {domain && (
              <FormControl margin="normal" fullWidth component="div">
                <Box display="flex" flexDirection="row">
                  <Checkbox id="enableDomainSignOn" name="enableDomainSignOn" checked={Boolean(values.enableDomainSignOn)} onChange={handleChange} />
                  <FormLabel style={{ lineHeight: '21px', margin: '10px 0', fontSize: '14px' }} htmlFor="enableDomainSignOn"><strong>@{domain}</strong> emails can join your organization without an invite</FormLabel>
                </Box>
              </FormControl>
            )}
          </React.Fragment>
        )}

        <Field fid="rcf" name="timezone" label={messages.lblTimezone} component={FormikSelect} options={TIMEZONE_NAME_OPTIONS} />

        {/* Name */}
        <Field fid="rcf" name="name" label={messages.lblName} component={FormikInput} />

        <FormControl margin="normal">
          <PrimaryButton disabled={isSubmitting} type="submit">
            {!isSubmitting && <IntlMsg {...(company ? messages.btnRequestAccess : messages.btnCreateAccount)} />}
            {isSubmitting && <IntlMsg {...messages.btnSubmitting} />}
          </PrimaryButton>
        </FormControl>
      </div>
    </Form>
  );
};

export default RegisterCompanyForm;
