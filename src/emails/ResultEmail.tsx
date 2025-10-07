import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface Archetype {
  name: string;
  percentage: number;
}

interface ResultEmailProps {
  topArchetypes: Archetype[];
  summary: string;
  shareUrl: string;
}

export default function ResultEmail({
  topArchetypes,
  summary,
  shareUrl,
}: ResultEmailProps) {
  const previewText = `Your Lunatic Profiling results are ready! Top archetype: ${topArchetypes[0]?.name || 'Unknown'}`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logoContainer}>
            <Heading style={h1}>Lunatic Profiling</Heading>
          </Section>

          <Section style={heroContainer}>
            <Heading style={h2}>Your Psychological Profile is Ready!</Heading>
            <Text style={text}>
              Thank you for completing the Lunatic Profiling assessment. Your unique psychological archetype has been analyzed and is ready for review.
            </Text>
          </Section>

          <Section style={codeContainer}>
            <Heading style={h3}>Your Top Archetypes</Heading>
            {topArchetypes.slice(0, 3).map((archetype) => (
              <div key={archetype.name} style={archetypeRow}>
                <Text style={archetypeText}>
                  <strong>{archetype.name.replace(/_/g, ' ').toUpperCase()}</strong>
                  <span style={percentage}>{archetype.percentage}%</span>
                </Text>
              </div>
            ))}
          </Section>

          <Section style={summaryContainer}>
            <Heading style={h3}>Your Psychological Summary</Heading>
            <Text style={text}>{summary}</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={shareUrl}>
              View Full Results
            </Button>
          </Section>

          <Section style={shareContainer}>
            <Text style={smallText}>
              Want to share your results? Copy this link:
            </Text>
            <Text style={shareLink}>{shareUrl}</Text>
          </Section>

          <Section style={footerContainer}>
            <Text style={footerText}>
              This email was sent by Lunatic Profiling. Your results are private and secure.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
};

const logoContainer = {
  padding: '32px 20px',
  backgroundColor: '#7c3aed',
  textAlign: 'center' as const,
};

const h1 = {
  color: '#ffffff',
  fontSize: '32px',
  fontWeight: 'bold',
  margin: '0',
  padding: '0',
};

const heroContainer = {
  padding: '20px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#1f2937',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
};

const h3 = {
  color: '#1f2937',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 12px',
  padding: '0',
};

const text = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const codeContainer = {
  background: '#f8fafc',
  borderRadius: '8px',
  margin: '16px 20px',
  padding: '20px',
};

const archetypeRow = {
  borderBottom: '1px solid #e5e7eb',
  paddingBottom: '8px',
  marginBottom: '8px',
};

const archetypeText = {
  color: '#1f2937',
  fontSize: '16px',
  margin: '0',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const percentage = {
  color: '#7c3aed',
  fontWeight: 'bold',
};

const summaryContainer = {
  margin: '16px 20px',
  padding: '20px',
  backgroundColor: '#f0f9ff',
  borderRadius: '8px',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  backgroundColor: '#7c3aed',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '12px 32px',
};

const shareContainer = {
  margin: '16px 20px',
  padding: '16px',
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  textAlign: 'center' as const,
};

const shareLink = {
  color: '#92400e',
  fontSize: '14px',
  fontFamily: 'monospace',
  wordBreak: 'break-all' as const,
  margin: '8px 0',
};

const smallText = {
  color: '#92400e',
  fontSize: '14px',
  margin: '0',
};

const footerContainer = {
  margin: '32px 20px 0',
  textAlign: 'center' as const,
};

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '0',
};