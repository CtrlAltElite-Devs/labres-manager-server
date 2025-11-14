import * as React from 'react';
import {
  Html,
  Body,
  Container,
  Heading,
  Text,
} from '@react-email/components';

interface OTPEmailProps {
  otp: string;
}

export default function OTPEmail({ otp }: OTPEmailProps) {
  return (
    <Html>
      <Body
        style={{
          backgroundColor: '#f9fafb', // light gray background like your page
          margin: 0,
          padding: 20,
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        <Container
          style={{
            backgroundColor: '#ffffff',
            borderRadius: 24, // matches rounded-2xl
            padding: '32px 24px',
            maxWidth: 480,
            margin: '0 auto',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.08)', // similar shadow
            textAlign: 'center',
          }}
        >
          <Heading style={{ color: '#006877', fontSize: 28, fontWeight: 700 }}>
            Verify Your Email
          </Heading>

          <Text
            style={{
              fontSize: 16,
              color: '#6b7280',
              margin: '16px 0 24px 0',
              lineHeight: 1.5,
            }}
          >
            You requested to verify your email for Lab Result Manager. Enter the code below
            in the app to complete the process.
          </Text>

          <Text
            style={{
              fontSize: 32,
              fontWeight: 'bold',
              letterSpacing: '6px',
              margin: '24px 0',
              color: '#006877',
            }}
          >
            {otp}
          </Text>

          <Text
            style={{
              fontSize: 14,
              color: '#9ca3af',
              marginTop: 24,
            }}
          >
            If you didn’t request this code, you can safely ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
