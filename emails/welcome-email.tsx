import {
  Html,
  Body,
  Container,
  Heading,
  Text,
  Button,
  Section,
} from '@react-email/components';
import * as React from 'react';

interface EmailProps {
  url: string;
  name?: string;
}

export default function WelcomeEmail({ url, name = 'friend' }: EmailProps) {
  return (
    <Html>
      <Body
        style={{
          backgroundColor: '#f3f4f6',
          padding: '20px',
          fontFamily: 'Arial, sans-serif',
        }}
      >
        <Container
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '10px',
            padding: '30px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          <Heading style={{ color: '#1a202c' }}>
            Welcome to Labres, {name}!
          </Heading>
          <Text
            style={{
              color: '#4a5568',
              fontSize: '16px',
              lineHeight: '1.5',
              marginBottom: '20px',
            }}
          >
            We're thrilled to have you on board. Start exploring our platform
            and discover all the amazing features waiting for you!
          </Text>

          <Section style={{ margin: '20px 0' }}>
            <Button
              href={url}
              style={{
                backgroundColor: '#2566eb',
                color: '#fff',
                fontWeight: 'bold',
                padding: '12px 24px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              Go to Dashboard
            </Button>
          </Section>

          <Text
            style={{ color: '#a0aec0', fontSize: '14px', marginTop: '20px' }}
          >
            If you didn’t sign up for this account, you can safely ignore this
            email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
