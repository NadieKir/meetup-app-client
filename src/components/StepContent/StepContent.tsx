import { useContext, useEffect, useState } from 'react';
import { FormikHelpers, FormikProps, FormikValues } from 'formik';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';

import {
  StepperContext,
  StepperContextType,
  Button,
  ButtonVariant,
  Form,
  IStep,
} from 'components';

interface StepContentProps {
  step: number;
  currentStep: number;
  isLast: boolean;
  isFirst: boolean;
  stepDescriptor: IStep;
  setConfirmed: (flag: boolean) => void;
}

export const StepContent = ({
  isFirst,
  isLast,
  stepDescriptor,
  setConfirmed,
}: StepContentProps) => {
  const intl = useIntl();
  const [isStepConfirmed, setIsStepConfirmed] = useState<boolean>(false);

  const {
    formData,
    setFormData,
    finishButtonContent,
    handleFinish,
    handleNextStep,
    handlePreviousStep,
  } = useContext(StepperContext) as StepperContextType<any>;

  const navigate = useNavigate();
  const handleGoBack = () => navigate(-1);

  useEffect(() => {
    setConfirmed(isStepConfirmed);
  }, [isStepConfirmed]);

  const onFormikPropsChange = (props?: FormikProps<FormikValues>) => {
    if (!props) {
      return;
    }

    const isValid = props.isValid && Object.keys(props.touched).length > 0;
    const isDirty = props.dirty;

    const shouldConfirm = stepDescriptor.noVerify
      ? isValid
      : isValid && isDirty;

    setIsStepConfirmed(shouldConfirm);
  };

  const renderGoNextStepButton = (props: FormikProps<FormikValues>) => {
    return (
      <Button
        type="submit"
        variant={ButtonVariant.Primary}
        disabled={
          stepDescriptor.noVerify
            ? !props.isValid
            : !props.isValid || !props.dirty
        }
      >
        {intl.formatMessage({ id: 'nextButton' })}
      </Button>
    );
  };

  const renderSubmitFormButton = (props: FormikProps<FormikValues>) => {
    return (
      <Button
        type="submit"
        variant={ButtonVariant.Primary}
        disabled={
          stepDescriptor.noVerify
            ? !props.isValid
            : !props.isValid || !props.dirty
        }
      >
        {finishButtonContent}
      </Button>
    );
  };

  const handleSubmit = (
    values: FormikValues,
    actions: FormikHelpers<FormikValues>,
  ) => {
    if (isLast) {
      handleFinish({ ...formData, ...values }, actions);
      return;
    }

    setFormData({ ...formData, ...values });
    handleNextStep();
  };

  return (
    <Form
      handleSubmit={handleSubmit}
      handleGoBack={isFirst ? handleGoBack : handlePreviousStep}
      initialValues={stepDescriptor.initialValues}
      validateSchema={stepDescriptor.validateSchema}
      fields={stepDescriptor.fields}
      submitButton={isLast ? renderSubmitFormButton : renderGoNextStepButton}
      onFormikPropsChange={onFormikPropsChange}
    />
  );
};
