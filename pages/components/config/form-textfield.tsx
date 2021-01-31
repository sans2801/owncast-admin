import React from 'react';
import { Input, InputNumber } from 'antd';
import { FieldUpdaterFunc } from '../../../types/config-section';
import InfoTip from '../info-tip';
import { StatusState } from '../../../utils/input-statuses';

export const TEXTFIELD_TYPE_TEXT = 'default';
export const TEXTFIELD_TYPE_PASSWORD = 'password'; // Input.Password
export const TEXTFIELD_TYPE_NUMBER = 'numeric'; // InputNumber
export const TEXTFIELD_TYPE_TEXTAREA = 'textarea'; // Input.TextArea
export const TEXTFIELD_TYPE_URL = 'url';

export interface TextFieldProps {
  fieldName: string;

  onSubmit?: () => void;
  onPressEnter?: () => void;

  className?: string;
  disabled?: boolean;
  label?: string;
  maxLength?: number;
  placeholder?: string;
  required?: boolean;
  status?: StatusState;
  tip?: string;
  type?: string;
  value?: string | number;
  onBlur?: FieldUpdaterFunc;
  onChange?: FieldUpdaterFunc;
}

export default function TextField(props: TextFieldProps) {
  const {
    className,
    disabled,
    fieldName,
    label,
    maxLength,
    onBlur,
    onChange,
    onPressEnter,
    placeholder,
    required,
    status,
    tip,
    type,
    value,
  } = props;

  // if field is required but value is empty, or equals initial value, then don't show submit/update button. otherwise clear out any result messaging and display button.
  const handleChange = (e: any) => {
    const val = type === TEXTFIELD_TYPE_NUMBER ? e : e.target.value;
    // if an extra onChange handler was sent in as a prop, let's run that too.
    if (onChange) {
      onChange({ fieldName, value: val });
    }
  };

  // if you blur a required field with an empty value, restore its original value in state (parent's state), if an onChange from parent is available.
  const handleBlur = (e: any) => {
    const val = e.target.value;
    if (onBlur) {
      onBlur({ value: val });
    }
  };

  const handlePressEnter = () => {
    if (onPressEnter) {
      onPressEnter();
    }
  };

  // display the appropriate Ant text field
  let Field = Input as
    | typeof Input
    | typeof InputNumber
    | typeof Input.TextArea
    | typeof Input.Password;
  let fieldProps = {};
  if (type === TEXTFIELD_TYPE_TEXTAREA) {
    Field = Input.TextArea;
    fieldProps = {
      autoSize: true,
    };
  } else if (type === TEXTFIELD_TYPE_PASSWORD) {
    Field = Input.Password;
    fieldProps = {
      visibilityToggle: true,
    };
  } else if (type === TEXTFIELD_TYPE_NUMBER) {
    Field = InputNumber;
    fieldProps = {
      type: 'number',
      min: 1,
      max: 10 ** maxLength - 1,
      onKeyDown: (e: React.KeyboardEvent) => {
        if (e.target.value.length > maxLength - 1) e.preventDefault();
        return false;
      },
    };
  } else if (type === TEXTFIELD_TYPE_URL) {
    fieldProps = {
      type: 'url',
    };
  }

  const fieldId = `field-${fieldName}`;

  const { icon: statusIcon, message: statusMessage } = status || {};

  return (
    <div className={`textfield-container type-${type}`}>
      {required ? <span className="required-label">*</span> : null}
      <label htmlFor={fieldId} className="textfield-label">
        {label}
      </label>
      <div className="textfield">
        <Field
          id={fieldId}
          className={`field ${className} ${fieldId}`}
          {...fieldProps}
          allowClear
          placeholder={placeholder}
          maxLength={maxLength}
          onChange={handleChange}
          onBlur={handleBlur}
          onPressEnter={handlePressEnter}
          disabled={disabled}
          value={value}
        />
      </div>
      <InfoTip tip={tip} />
      {status ? statusMessage : null}
      {status ? statusIcon : null}
    </div>
  );
}

TextField.defaultProps = {
  className: '',
  // configPath: '',
  disabled: false,
  // initialValue: '',
  label: '',
  maxLength: null,

  placeholder: '',
  required: false,
  status: null,
  tip: '',
  type: TEXTFIELD_TYPE_TEXT,
  value: '',
  onSubmit: () => {},
  onBlur: () => {},
  onChange: () => {},
  onPressEnter: () => {},
};
