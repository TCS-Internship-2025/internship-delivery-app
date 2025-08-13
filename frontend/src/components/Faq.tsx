import { useState, type ReactElement } from 'react';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQCategories {
  tracking: FAQItem[];
  delivery: FAQItem[];
}

type CategoryKey = keyof FAQCategories;

const categoryIcons: Record<CategoryKey, ReactElement> = {
  tracking: <LocalShippingIcon color="primary" />,
  delivery: <QueryBuilderIcon color="secondary" />,
};

const faqCategories: FAQCategories = {
  tracking: [
    {
      question: 'How can I track my parcel?',
      answer:
        'You can track your parcel using the tracking link provided in your confirmation email or using your tracking number.',
    },
    {
      question: 'My tracking number isn’t working. What should I do?',
      answer:
        'It may take up to 24 hours for tracking information to update. If it still doesn’t work, contact our support team.',
    },
  ],
  delivery: [
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery takes 3–5 business days. Express delivery is available within 1–2 business days.',
    },
    {
      question: 'Can I change my delivery address?',
      answer:
        'Yes, you can change your address before the parcel is dispatched. You can access this feature when logged in, especially while tracking your parcel.',
    },
  ],
};

//will need to add proper questions, you can use this component like: <Faq/> to render out every single categories or you can use it like <Faq categories=["tracking","delivery"]/>
interface FaqProps {
  categories?: CategoryKey[] | null;
  id?: string;
}

export default function Faq({ categories = null, id = '' }: FaqProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('tracking');
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChangeCategory = (_: React.SyntheticEvent, newValue: CategoryKey) => {
    setSelectedCategory(newValue);
    setExpanded(false);
  };

  const handleChangeAccordion = (panel: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  const renderCategory = (category: CategoryKey) => (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        {categoryIcons[category]}
        <Typography variant="h6" fontWeight="bold">
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </Typography>
      </Box>
      {faqCategories[category].map((faq, index) => {
        const panelId = `${category}-${index}`;
        return (
          <Accordion key={panelId} expanded={expanded === panelId} onChange={handleChangeAccordion(panelId)}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography fontWeight="bold">{faq.question}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography color="text.secondary">{faq.answer}</Typography>
            </AccordionDetails>
          </Accordion>
        );
      })}
    </>
  );

  return (
    <Box id={id} sx={{ width: '100%', my: 5 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Frequently Asked Questions
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Find quick answers to common questions about our parcel delivery service.
      </Typography>

      {categories === null ? (
        <>
          <Tabs
            value={selectedCategory}
            onChange={handleChangeCategory}
            variant="scrollable"
            scrollButtons="auto"
            sx={{ mb: 3 }}
          >
            {Object.keys(faqCategories).map((category) => (
              <Tab key={category} value={category} label={category.charAt(0).toUpperCase() + category.slice(1)} />
            ))}
          </Tabs>
          {renderCategory(selectedCategory)}
        </>
      ) : (
        categories.map((cat) => (
          <Box key={cat} sx={{ mb: 4 }}>
            {renderCategory(cat)}
          </Box>
        ))
      )}
    </Box>
  );
}
