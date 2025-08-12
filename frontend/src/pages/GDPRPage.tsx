import React from 'react';

import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LockIcon from '@mui/icons-material/Lock';
import MessageIcon from '@mui/icons-material/Message';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import ScheduleIcon from '@mui/icons-material/Schedule';
// MUI Icons
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
// MUI Components
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import type { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

// Type Definitions
interface DataType {
  readonly icon: React.ReactElement;
  readonly title: string;
  readonly description: string;
  readonly retention: string;
}

interface UserRight {
  readonly icon: React.ReactElement;
  readonly title: string;
  readonly description: string;
}

interface SecurityFeature {
  readonly icon: React.ReactElement;
  readonly title: string;
  readonly description: string;
}

interface LegalBasis {
  readonly type: string;
  readonly description: string;
}

// Constants
const ICON_SIZE = 30;
const LARGE_ICON_SIZE = 40;
const HEADER_ICON_SIZE = 80;

const iconStyle: SxProps<Theme> = { fontSize: ICON_SIZE };
const largeIconStyle: SxProps<Theme> = { fontSize: LARGE_ICON_SIZE, mb: 2 };
const headerIconStyle: SxProps<Theme> = { fontSize: HEADER_ICON_SIZE, mb: 2 };
const contactPaperSx: SxProps<Theme> = {
  p: 4,
  mb: 4,
  textAlign: 'center',
};

const dpoIconStyle: SxProps<Theme> = {
  fontSize: LARGE_ICON_SIZE,
  mb: 2,
  color: 'primary.main',
};

const dividerSx: SxProps<Theme> = {
  my: 2,
  bgcolor: 'divider',
};

const GDPRPage: React.FC = (): React.ReactElement => {
  const dataTypes: readonly DataType[] = [
    {
      icon: <PersonIcon color="primary" sx={iconStyle} />,
      title: 'Personal Information',
      description: 'Name, email, phone number for account and delivery management',
      retention: 'Account lifetime + 3 years',
    },
    {
      icon: <LocationOnIcon color="primary" sx={iconStyle} />,
      title: 'Location Data',
      description: 'Delivery addresses and GPS coordinates for accurate delivery',
      retention: 'Until delivery + 1 year',
    },
    {
      icon: <PaymentIcon color="primary" sx={iconStyle} />,
      title: 'Payment Details',
      description: 'Encrypted payment information for secure transactions',
      retention: 'Transaction + 7 years',
    },
    {
      icon: <MessageIcon color="primary" sx={iconStyle} />,
      title: 'Communications',
      description: 'Support messages and delivery notifications',
      retention: '2 years from last contact',
    },
  ] as const;

  const userRights: readonly UserRight[] = [
    {
      icon: <VisibilityIcon color="primary" sx={iconStyle} />,
      title: 'Right to Access',
      description: 'Request a copy of all personal data we hold about you',
    },
    {
      icon: <EditIcon color="primary" sx={iconStyle} />,
      title: 'Right to Rectification',
      description: 'Correct any inaccurate or incomplete information',
    },
    {
      icon: <DeleteIcon color="primary" sx={iconStyle} />,
      title: 'Right to Erasure',
      description: 'Request deletion of your personal data',
    },
    {
      icon: <DownloadIcon color="primary" sx={iconStyle} />,
      title: 'Right to Portability',
      description: 'Receive your data in a portable format',
    },
  ] as const;

  const securityFeatures: readonly SecurityFeature[] = [
    {
      icon: <LockIcon color="primary" sx={largeIconStyle} />,
      title: 'Encryption',
      description: 'All data encrypted in transit and at rest using industry standards',
    },
    {
      icon: <SecurityIcon color="primary" sx={largeIconStyle} />,
      title: 'Access Control',
      description: 'Strict access controls and regular security audits',
    },
    {
      icon: <ScheduleIcon color="primary" sx={largeIconStyle} />,
      title: 'Monitoring',
      description: '24/7 security monitoring and incident response',
    },
  ] as const;

  const legalBases: readonly LegalBasis[] = [
    {
      type: 'Contract Performance',
      description: 'To fulfill our delivery services and manage your account',
    },
    {
      type: 'Legitimate Interest',
      description: 'To improve our services and prevent fraud',
    },
    {
      type: 'Consent',
      description: 'For marketing communications and analytics (you can withdraw anytime)',
    },
    {
      type: 'Legal Obligation',
      description: 'To comply with tax and financial regulations',
    },
  ] as const;

  const contactInfo = {
    email: 'dpo@tcs-internship-demo.com',
    responseTime: 'Within 5 business days',
    languages: 'Available in English, French, and Arabic',
  };

  const containerSx: SxProps<Theme> = {
    minHeight: '100vh',
    bgcolor: 'background.default',
    color: 'text.primary',
    py: 4,
    px: 2,
  };

  const maxWidthContainerSx: SxProps<Theme> = {
    maxWidth: 900,
    mx: 'auto',
  };

  const headerSx: SxProps<Theme> = {
    textAlign: 'center',
    mb: 6,
  };

  const paperSx: SxProps<Theme> = {
    p: 4,
    mb: 4,
  };

  const gridSx: SxProps<Theme> = {
    display: 'grid',
    gap: 3,
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
  };

  const smallGridSx: SxProps<Theme> = {
    display: 'grid',
    gap: 3,
    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  };

  const securityGridSx: SxProps<Theme> = {
    display: 'grid',
    gap: 3,
    gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' },
  };

  const cardSx: SxProps<Theme> = {
    height: '100%',
  };

  const cardContentSx: SxProps<Theme> = {
    textAlign: 'center',
    p: 3,
  };

  const footerSx: SxProps<Theme> = {
    textAlign: 'center',
    mt: 4,
    py: 3,
  };

  return (
    <Box sx={containerSx}>
      <Box sx={maxWidthContainerSx}>
        {/* Header */}
        <Box sx={headerSx}>
          <SecurityIcon color="primary" sx={headerIconStyle} />
          <Typography variant="h2" sx={{ mb: 2, fontWeight: 700, letterSpacing: 2 }}>
            GDPR Privacy Policy
          </Typography>
          <Typography variant="h5" color="text.secondary" sx={{ mb: 2 }}>
            SwiftParcel Data Protection & Privacy Rights
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            We are committed to protecting your privacy and ensuring compliance with the General Data Protection
            Regulation (GDPR). This page outlines how we handle your personal data.
          </Typography>
        </Box>

        {/* Data We Collect */}
        <Paper elevation={2} sx={paperSx}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            What Data We Collect
          </Typography>
          <Box sx={gridSx}>
            {dataTypes.map(
              (item: DataType): React.ReactElement => (
                <Card key={item.title} variant="outlined" sx={cardSx}>
                  <CardContent sx={cardContentSx}>
                    <Box sx={{ mb: 2 }}>{item.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {item.title}
                    </Typography>
                    <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
                      {item.description}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 2 }}>
                      <ScheduleIcon sx={{ fontSize: 16, mr: 0.5, color: 'text.disabled' }} />
                      <Typography variant="caption" color="text.disabled">
                        Retention: {item.retention}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )
            )}
          </Box>
        </Paper>

        {/* Your Rights */}
        <Paper elevation={2} sx={paperSx}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            Your GDPR Rights
          </Typography>
          <Box sx={smallGridSx}>
            {userRights.map(
              (right: UserRight): React.ReactElement => (
                <Card key={right.title} variant="outlined" sx={cardSx}>
                  <CardContent sx={cardContentSx}>
                    <Box sx={{ mb: 2 }}>{right.icon}</Box>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                      {right.title}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {right.description}
                    </Typography>
                  </CardContent>
                </Card>
              )
            )}
          </Box>
        </Paper>

        {/* Legal Basis */}
        <Paper elevation={2} sx={paperSx}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            Legal Basis for Processing
          </Typography>
          <Box sx={{ textAlign: 'left', maxWidth: 700, mx: 'auto' }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              We process your personal data based on the following legal grounds:
            </Typography>
            <Box component="ul" sx={{ pl: 3 }}>
              {legalBases.map(
                (basis: LegalBasis): React.ReactElement => (
                  <Typography key={basis.type} component="li" variant="body1" sx={{ mb: 1 }}>
                    <strong>{basis.type}:</strong> {basis.description}
                  </Typography>
                )
              )}
            </Box>
          </Box>
        </Paper>

        {/* Data Security */}
        <Paper elevation={2} sx={paperSx}>
          <Typography variant="h4" sx={{ mb: 3, fontWeight: 600, textAlign: 'center' }}>
            How We Protect Your Data
          </Typography>
          <Box sx={securityGridSx}>
            {securityFeatures.map(
              (feature: SecurityFeature): React.ReactElement => (
                <Box key={feature.title} sx={{ textAlign: 'center', p: 2 }}>
                  {feature.icon}
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </Box>
              )
            )}
          </Box>
        </Paper>
        {/* Contact DPO */}
        <Paper elevation={2} sx={contactPaperSx}>
          <EmailIcon sx={dpoIconStyle} />
          <Typography variant="h4" sx={{ mb: 2, fontWeight: 600 }}>
            Data Protection Officer
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
            Have questions about your privacy rights or how we handle your data?
          </Typography>
          <Divider sx={dividerSx} />
          <Box sx={{ maxWidth: 400, mx: 'auto' }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Contact Information
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
              Email: {contactInfo.email}
            </Typography>
            <Typography variant="body2" sx={{ mb: 1, opacity: 0.9 }}>
              Response Time: {contactInfo.responseTime}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              {contactInfo.languages}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, fontStyle: 'italic' }}>
              *This is dummy contact information for a TCS internship project*
            </Typography>
          </Box>
        </Paper>

        {/* Footer */}
        <Box sx={footerSx}>
          <Typography variant="body2" color="text.secondary">
            Last updated: {new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })} • SwiftParcel GDPR
            Compliance
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default GDPRPage;
