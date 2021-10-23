import React from 'react';
import styled from 'styled-components';
import { Field, Form, FormikProps } from 'formik';

// Material UI
import FormControl from '@material-ui/core/FormControl';

// Components
import FormikInput from '../../../../components/_forms/Formik/formik-input.component';
import { PrimaryButton } from '../../../../components/_core/_ui/buttons.component';

const CompanyListing = styled.div`
  background: #fff;
  border-radius: 4px;
  border: 1px solid #ddd;
  padding: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & div {
    margin-right: 16px;
    line-height: 22px;
  }
`

export interface SignUpFormValues {
  email: string;
  name?: string;
  password?: string;
  confirmPassword?: string;
}

interface AcceptInviteFormProps {
  form: FormikProps<SignUpFormValues>;
  invite: IInvite;
}

const AcceptInviteForm: React.FC<AcceptInviteFormProps> = ({ form, invite }) => {
  const { isSubmitting, isValid } = form;

  return (
    <Form>
      <FormControl margin="dense" fullWidth component="div">
        <CompanyListing>
          <div>You&#8217;re joining <strong>{invite.companyName}</strong></div>
        </CompanyListing>
      </FormControl>

      <Field fid="aif" disabled name="email" type="email" component={FormikInput} label="Email" />

      {invite && invite.isPasswordRequired && (
        <>
          <Field fid="aif" name="name" component={FormikInput} label="Name" />
          <Field fid="aif" name="password" type="password" component={FormikInput} label="Password" />
          <Field fid="aif" name="confirmPassword" type="password" component={FormikInput} label="Confirm Password" />
        </>
      )}

      <FormControl margin="dense">
        <PrimaryButton disabled={isSubmitting || !isValid} type="submit" variant="contained">
          {isSubmitting ? "Submitting" : "Accept Invite"}
        </PrimaryButton>
      </FormControl>
    </Form>
  );
};

export default AcceptInviteForm;
