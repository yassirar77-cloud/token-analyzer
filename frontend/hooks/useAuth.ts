'use client';

import { useEffect, useRef } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';

export function useAuth() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const authenticatingRef = useRef(false);

  useEffect(() => {
    if (!isConnected || !address) {
      return;
    }

    // Already have a token for this address
    const existingToken = localStorage.getItem('authToken');
    const existingAddress = localStorage.getItem('authAddress');
    if (existingToken && existingAddress?.toLowerCase() === address.toLowerCase()) {
      return;
    }

    // Clear stale token from a different address
    if (existingToken && existingAddress?.toLowerCase() !== address.toLowerCase()) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('authAddress');
    }

    // Prevent concurrent auth attempts
    if (authenticatingRef.current) return;
    authenticatingRef.current = true;

    (async () => {
      try {
        // Step 1: Get nonce from backend
        const nonceRes = await authApi.getNonce(address);
        const { nonce } = nonceRes.data;

        // Step 2: Sign message with wallet
        const message = `Back Street Dogs - Sign this message to authenticate. Nonce: ${nonce}`;
        const signature = await signMessageAsync({ message });

        // Step 3: Verify signature and get JWT
        const verifyRes = await authApi.verify(address, signature);
        const { token } = verifyRes.data;

        // Step 4: Store token
        localStorage.setItem('authToken', token);
        localStorage.setItem('authAddress', address.toLowerCase());

        toast.success('Authenticated successfully!');

        // Reload the page to re-fetch data with the new token
        window.location.reload();
      } catch (error: any) {
        // User rejected the signature request — don't show an error
        if (error?.code === 'ACTION_REJECTED' || error?.code === 4001 || error?.message?.includes('User rejected')) {
          console.log('User rejected signature request');
        } else {
          console.error('Authentication error:', error);
          toast.error('Authentication failed. Please try again.');
        }
      } finally {
        authenticatingRef.current = false;
      }
    })();
  }, [isConnected, address, signMessageAsync]);
}
