import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../use-auth';

const loginSchema = yup.object({
  email: yup
    .string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

const useLogin = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
  });

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    setServerError(null);
    const { error } = await signIn(email, password);
    if (error) {
      setServerError(error);
    } else {
      navigate('/', { replace: true });
    }
  });

  return {
    form,
    errors: form.formState.errors,
    formState: form.formState,
    showPassword,
    setShowPassword,
    serverError,
    handleSubmit,
  };
};

export { useLogin };
