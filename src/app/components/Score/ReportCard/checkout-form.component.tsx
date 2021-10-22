import _ from 'lodash';
import React, { useState, useEffect, FormEvent } from 'react';
import {
  CardElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";
import { gql, useMutation } from '@apollo/client';
import { CardElementWrapper, CardError, CardSpinner, CardSubmitButton } from './report-card.helper-components';

const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($ageGroupId: ID!, $playerAssessmentId: ID!) {
    createPaymentIntent(_id: $ageGroupId, playerAssessmentId: $playerAssessmentId) {
      success
      clientSecret
    }
  }
`;

const RECORD_PAYMENT = gql`
  mutation RecordPayment($playerAssessmentId: ID!, $code: String!, $paymentId: String!) {
    recordPayment(_id: $playerAssessmentId, code: $code, paymentId: $paymentId) {
      _id
      paymentRef
    }
  }
`;

interface ICheckoutForm {
  ageGroupId: string;
  playerAssessmentId: string;
  code: string;
}

const CheckoutForm: React.FC<ICheckoutForm> = ({ ageGroupId, playerAssessmentId, code }) => {
  const [createPaymentIntent] = useMutation(CREATE_PAYMENT_INTENT);
  const [recordPayment] = useMutation(RECORD_PAYMENT);
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState();
  const [processing, setProcessing] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    createPaymentIntent({ variables: { playerAssessmentId, ageGroupId } })
      .then((result: any) => {
        const clientSecret = _.get(result, 'data.createPaymentIntent.clientSecret');
        setClientSecret(clientSecret);
      })
  }, []);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  const handleChange = async (event: any) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async (ev: any) => {
    ev.preventDefault();

    if (stripe && elements) {
      const card = elements.getElement(CardElement);

      if (card) {
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
          payment_method: { card }
        });

        if (payload.error) {
          setError(`Payment failed ${payload.error.message}`);
          setProcessing(false);
        } else {
          console.log(payload);
          recordPayment({
            variables: { playerAssessmentId, code, paymentId: payload.paymentIntent.id } })
            .then(() => {
              setError(null);
              setProcessing(false);
              setSucceeded(true);
            });
        }
      }
    }
  };

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElementWrapper>
        <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
      </CardElementWrapper>
      <CardSubmitButton
        disabled={processing || disabled || succeeded}
        id="submit"
      >
        <span id="button-text">
          {processing ? (
            <span>Processing, please wait...</span>
          ) : (
            "Buy & View Results"
          )}
        </span>
      </CardSubmitButton>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <CardError role="alert">
          {error}
        </CardError>
      )}
    </form>
  );
}

export default CheckoutForm;
