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

interface ResultEmailProps {
  primaryArchetypeName: string;
  primaryArchetypePubLegend: string;
  primaryArchetypePercentage: number;
  secondaryArchetypeName?: string;
  secondaryArchetypePubLegend?: string;
  secondaryArchetypePercentage?: number;
  isHybrid: boolean;
  summary: string;
  shareUrl: string;
}

export default function ResultEmail({
  primaryArchetypeName,
  primaryArchetypePubLegend,
  primaryArchetypePercentage,
  secondaryArchetypeName,
  secondaryArchetypePubLegend,
  secondaryArchetypePercentage,
  isHybrid,
  summary,
  shareUrl,
}: ResultEmailProps) {
  const previewText = `Your Lunacy Blueprint is ready! You are: ${primaryArchetypePubLegend}`;

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
            <Heading style={h2}>Your Lunacy Blueprint is Ready!</Heading>
            <Text style={text}>
              Thank you for completing the Lunatic Profiling assessment. Your unique chaos archetype has been analyzed and documented.
            </Text>
          </Section>

          <Section style={codeContainer}>
            <Heading style={h3}>Your Primary Archetype</Heading>
            <div style={archetypeRow}>
              <Text style={pubLegendText}>{primaryArchetypePubLegend}</Text>
              <Text style={archetypeNameText}>
                {primaryArchetypeName}
                <span style={percentage}>{Math.round(primaryArchetypePercentage)}%</span>
              </Text>
            </div>

            {isHybrid && secondaryArchetypeName && secondaryArchetypePubLegend && (
              <>
                <Heading style={h3}>Secondary Archetype</Heading>
                <div style={archetypeRow}>
                  <Text style={pubLegendTextSecondary}>{secondaryArchetypePubLegend}</Text>
                  <Text style={archetypeNameText}>
                    {secondaryArchetypeName}
                    <span style={percentage}>{Math.round(secondaryArchetypePercentage || 0)}%</span>
                  </Text>
                </div>
                <Text style={hybridNote}>
                  You have a hybrid profile - your chaos is beautifully conflicted.
                </Text>
              </>
            )}
          </Section>

          <Section style={summaryContainer}>
            <Heading style={h3}>Your Lunacy Summary</Heading>
            <Text style={text}>{summary}</Text>
          </Section>

          <Section style={buttonContainer}>
            <Button style={button} href={shareUrl}>
              View Full Blueprint
            </Button>
          </Section>

          <Section style={shareContainer}>
            <Text style={smallText}>
              Want to share your chaos with the world? Copy this link:
            </Text>
            <Text style={shareLink}>{shareUrl}</Text>
          </Section>

          <Section style={footerContainer}>
            <Text style={footerText}>
              This email was sent by Lunatic Profiling. Your blueprint is private and secure.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#0f0f1a',
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#1a1a2e',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  borderRadius: '16px',
};

const logoContainer = {
  padding: '32px 20px',
  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
  textAlign: 'center' as const,
  borderRadius: '16px 16px 0 0',
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
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '30px 0',
  padding: '0',
};

const h3 = {
  color: '#a78bfa',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '16px 0 12px',
  padding: '0',
};

const text = {
  color: '#d1d5db',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
};

const codeContainer = {
  background: 'rgba(124, 58, 237, 0.1)',
  borderRadius: '12px',
  margin: '16px 20px',
  padding: '20px',
  border: '1px solid rgba(124, 58, 237, 0.3)',
};

const archetypeRow = {
  paddingBottom: '12px',
  marginBottom: '12px',
};

const pubLegendText = {
  color: '#f472b6',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const pubLegendTextSecondary = {
  color: '#a78bfa',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 4px 0',
};

const archetypeNameText = {
  color: '#9ca3af',
  fontSize: '14px',
  margin: '0',
};

const percentage = {
  color: '#10b981',
  fontWeight: 'bold',
  marginLeft: '8px',
};

const hybridNote = {
  color: '#fbbf24',
  fontSize: '14px',
  fontStyle: 'italic',
  margin: '8px 0 0 0',
};

const summaryContainer = {
  margin: '16px 20px',
  padding: '20px',
  backgroundColor: 'rgba(16, 185, 129, 0.1)',
  borderRadius: '12px',
  border: '1px solid rgba(16, 185, 129, 0.3)',
};

const buttonContainer = {
  textAlign: 'center' as const,
  margin: '32px 0',
};

const button = {
  background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)',
  borderRadius: '12px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'inline-block',
  padding: '14px 36px',
};

const shareContainer = {
  margin: '16px 20px',
  padding: '16px',
  backgroundColor: 'rgba(251, 191, 36, 0.1)',
  borderRadius: '12px',
  textAlign: 'center' as const,
  border: '1px solid rgba(251, 191, 36, 0.3)',
};

const shareLink = {
  color: '#fbbf24',
  fontSize: '14px',
  fontFamily: 'monospace',
  wordBreak: 'break-all' as const,
  margin: '8px 0',
};

const smallText = {
  color: '#fbbf24',
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
