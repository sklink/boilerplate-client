import _ from 'lodash';
import React from 'react';
import { Formik } from 'formik';
import * as Yup from 'yup';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

// Data
import { COMMON_MAIL_DOMAINS } from '../../../../lib/_constants';
import { isValidEmail } from '../../../../lib/helpers/validation.helpers';
import { buildRegisterCompany, getCompanyByDomain } from '../../company.service';
import { TIMEZONE_NAME_OPTIONS } from '../../../../lib/constants/timezone.constants';

// Components
import RegisterCompanyForm from './register-company-form.component';
import { IRegisterCompanyFields, IRegisterCompanyProps } from './register-company-form.interfaces';

dayjs.extend(utc)
dayjs.extend(timezone)

const RegisterCompanyFormContainer = () => {
  const [currStep, onSetStep] = React.useState(1);
  const [searchDomain, onSetDomain] = React.useState('');
  const { company, loading: loadingCompany } = getCompanyByDomain(searchDomain);
  const { registerCompany } = buildRegisterCompany();

  const initialValues = { email: '', companyName: '', name: '', enableDomainSignOn: true, timezone: TIMEZONE_NAME_OPTIONS[0] };

  const handleSubmit = (values: IRegisterCompanyFields, { setSubmitting, setErrors }: any) => {
    const data: IRegisterCompanyProps = { ..._.omit(values, ['timezone']) };

    if (company) {
      delete data.companyName;
      delete data.enableDomainSignOn;

      data.companyId = company._id;
    } else if (data.enableDomainSignOn) {
      const regDomain = data.email.split('@').pop();

      if (_.includes(COMMON_MAIL_DOMAINS, regDomain)) {
        delete data.enableDomainSignOn;
      }
    }

    data.timezone = values.timezone.value;

    registerCompany(data)
      .then(() => {
        onSetStep(3);
        setSubmitting(false);
      })
      .catch(err => {
        const errors = err.graphQLErrors.map((error: Error) => error.message)
        const formErrors: any = {};

        _.each(errors, error => {
          if (error === 'User with email exists') {
            formErrors.email = 'Email is already in use';
          }
        });

        setSubmitting(false)
        setErrors(formErrors);
      });
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Enter your name'),
    email: Yup.string().test('valid-email', '', isValidEmail),
    timezone: Yup.string().required('Select your timezone')
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {form => (<RegisterCompanyForm
        form={form}
        currStep={currStep}
        onSetStep={onSetStep}
        domain={searchDomain}
        company={company}
        loadingCompany={loadingCompany}
        onSearchCompany={onSetDomain}
      />)}
    </Formik>
  );
};

RegisterCompanyFormContainer.propTypes = {

};

export default RegisterCompanyFormContainer;
