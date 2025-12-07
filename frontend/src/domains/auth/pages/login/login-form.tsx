import * as React from 'react';
import { Stack, TextField } from '@mui/material';
import { UseFormReturn } from 'react-hook-form';
import { LoadingButton } from '@mui/lab';
import { LoginRequest } from '../../types';
import { useWallet } from '../../../../contexts/WalletContext';
import { Button } from '@mui/material';

type LoginFormProps = {
  onSubmit: () => void;
  methods: UseFormReturn<LoginRequest>;
  isFetching: boolean;
};

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit, methods, isFetching }) => {
  const {
    register,
    formState: { errors }
  } = methods;

  return (
    <form onSubmit={onSubmit}>
      <div>
        <TextField
          size='small'
          type='text'
          label='Username'
          sx={{ margin: '30px 0' }}
          fullWidth
          {...register('username')}
          error={!!errors.username}
          helperText={errors.username?.message}
        />
      </div>
      <div>
        <TextField
          size='small'
          type='password'
          label='Password'
          sx={{ marginBottom: '30px' }}
          fullWidth
          {...register('password')}
          error={!!errors.password}
          helperText={errors.password?.message}
        />
      </div>
      <Stack spacing={2}>
        <LoadingButton loading={isFetching} type='submit' size='small' variant='contained'>
          <span>Sign In</span>
        </LoadingButton>
        <ConnectWalletButton />
      </Stack>
    </form>
  );
};

const ConnectWalletButton = () => {
    const { connectWallet, isConnected, account } = useWallet();
  
    return (
      <Button 
        onClick={connectWallet} 
        variant="outlined" 
        size="small" 
        color={isConnected ? "success" : "primary"}
      >
        {isConnected ? `Connected: ${account?.slice(0,6)}...` : "Connect Wallet"}
      </Button>
    );
  };
