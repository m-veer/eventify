// components/CreateEvent/GoodToKnow.tsx
import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Dialog, RadioGroup, Radio, FormControlLabel, IconButton, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';
import PersonIcon from '@mui/icons-material/Person';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalParkingIcon from '@mui/icons-material/LocalParking';

interface FAQ {
  question: string;
  answer: string;
  hasError?: boolean;
}

interface Highlight {
  type: 'age' | 'doorTime' | 'parking';
  value: string;
  displayText: string;
  icon: JSX.Element;
}

const GoodToKnow: React.FC = () => {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentType, setCurrentType] = useState<'age' | 'doorTime' | 'parking' | null>(null);
  const [selectedOption, setSelectedOption] = useState('');
  const [doorTimeValue, setDoorTimeValue] = useState('');
  const [timeUnit, setTimeUnit] = useState('Minutes');

  const validateFAQ = (faq: FAQ) => {
    return faq.question.trim() !== '' && faq.answer.trim() !== '';
  };

  const handleAddQuestion = () => {
    const hasIncompleteFAQs = faqs.some(faq => !validateFAQ(faq));
    if (hasIncompleteFAQs) {
      const updatedFaqs = faqs.map(faq => ({
        ...faq,
        hasError: !validateFAQ(faq)
      }));
      setFaqs(updatedFaqs);
      return;
    }
    setFaqs([...faqs, { question: '', answer: '', hasError: false }]);
  };

  const handleUpdateFAQ = (index: number, field: 'question' | 'answer', value: string) => {
    if (field === 'answer' && value.length > 300) return;
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = { 
      ...updatedFaqs[index], 
      [field]: value,
      hasError: false
    };
    setFaqs(updatedFaqs);
  };

  const handleBlur = (index: number) => {
    const updatedFaqs = [...faqs];
    updatedFaqs[index] = {
      ...updatedFaqs[index],
      hasError: !validateFAQ(updatedFaqs[index])
    };
    setFaqs(updatedFaqs);
  };

  const handleHighlightClick = (type: 'age' | 'doorTime' | 'parking') => {
    setCurrentType(type);
    setDialogOpen(true);
    setSelectedOption('');
    setDoorTimeValue('');
  };

  const handleAddHighlight = () => {
    if (!currentType) return;

    let newHighlight: Highlight | undefined;

    switch (currentType) {
      case 'age':
        if (selectedOption) {
          newHighlight = {
            type: 'age',
            value: selectedOption,
            displayText: selectedOption,
            icon: <PersonIcon /> as JSX.Element
          };
        }
        break;
      case 'doorTime':
        if (doorTimeValue && timeUnit) {
          newHighlight = {
            type: 'doorTime',
            value: `${doorTimeValue} ${timeUnit}`,
            displayText: `Check-in ${doorTimeValue} ${timeUnit} before event`,
            icon: <AccessTimeIcon /> as JSX.Element
          };
        }
        break;
      case 'parking':
        if (selectedOption) {
          newHighlight = {
            type: 'parking',
            value: selectedOption,
            displayText: selectedOption,
            icon: <LocalParkingIcon /> as JSX.Element
          };
        }
        break;
    }

    if (newHighlight) {
      setHighlights(prev => [...prev.filter(h => h.type !== currentType), newHighlight!]);
      setDialogOpen(false);
      setSelectedOption('');
      setDoorTimeValue('');
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ color: '#f05123', mb: 3, fontWeight: 'bold' }}>
        Good to know
      </Typography>
      
      <Typography sx={{ color: '#666', mb: 4 }}>
        Use this section to feature specific information about your event. Add highlights and frequently asked questions for attendees.
      </Typography>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Highlights</Typography>
        
        {highlights.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
            {highlights.map((highlight) => (
              <Chip
                key={highlight.type}
                icon={highlight.icon}
                label={highlight.displayText}
                onDelete={() => setHighlights(prev => prev.filter(h => h.type !== highlight.type))}
                sx={{
                  bgcolor: '#fff5f2',
                  color: '#f05123',
                  '& .MuiChip-icon': { color: '#f05123' }
                }}
              />
            ))}
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          {!highlights.find(h => h.type === 'age') && (
            <Button 
              startIcon={<AddIcon />}
              onClick={() => handleHighlightClick('age')}
              sx={{ 
                border: '1px solid #ddd',
                color: '#f05123',
                borderRadius: '20px',
                textTransform: 'none'
              }}
            >
              Add Age Info
            </Button>
          )}
          {!highlights.find(h => h.type === 'doorTime') && (
            <Button 
              startIcon={<AddIcon />}
              onClick={() => handleHighlightClick('doorTime')}
              sx={{ 
                border: '1px solid #ddd',
                color: '#f05123',
                borderRadius: '20px',
                textTransform: 'none'
              }}
            >
              Add Door Time
            </Button>
          )}
          {!highlights.find(h => h.type === 'parking') && (
            <Button 
              startIcon={<AddIcon />}
              onClick={() => handleHighlightClick('parking')}
              sx={{ 
                border: '1px solid #ddd',
                color: '#f05123',
                borderRadius: '20px',
                textTransform: 'none'
              }}
            >
              Add Parking Info
            </Button>
          )}
        </Box>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Frequently asked questions
        </Typography>
        <Typography sx={{ color: '#666', mb: 3 }}>
          Answer questions your attendees may have about the event, like accessibility and amenities.
        </Typography>

        {faqs.map((faq, index) => (
          <Box key={index} sx={{ mb: 4 }}>
            <Box sx={{ position: 'relative', mb: 2 }}>
              <Typography sx={{ position: 'absolute', top: -8, right: -8, color: '#f05123' }}>*</Typography>
              <TextField
                fullWidth
                placeholder="Question"
                value={faq.question}
                onChange={(e) => handleUpdateFAQ(index, 'question', e.target.value)}
                onBlur={() => handleBlur(index)}
                error={faq.hasError}
                helperText={faq.hasError ? "This field is required" : ""}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Box>
            <Box sx={{ position: 'relative' }}>
              <Typography sx={{ position: 'absolute', top: -8, right: -8, color: '#f05123' }}>*</Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Answer"
                value={faq.answer}
                onChange={(e) => handleUpdateFAQ(index, 'answer', e.target.value)}
                onBlur={() => handleBlur(index)}
                error={faq.hasError}
                helperText={faq.hasError ? "This field is required" : ""}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
              <Box sx={{ position: 'absolute', bottom: 8, right: 8, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography sx={{ color: faq.hasError ? '#f44336' : '#666', fontSize: '0.875rem' }}>
                  {faq.answer.length}/300
                </Typography>
                <IconButton onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}>
                  <DeleteIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>
        ))}

        <Button
          startIcon={<AddIcon />}
          onClick={handleAddQuestion}
          sx={{ color: '#3366ff', textTransform: 'none' }}
        >
          Add question
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h5">Add highlights about your event</Typography>
            <IconButton onClick={() => setDialogOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
          
          {currentType === 'age' && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Is there an age restriction?</Typography>
              <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                <FormControlLabel value="All ages allowed" control={<Radio />} label="All ages allowed" />
                <FormControlLabel value="There's an age restriction" control={<Radio />} label="There's an age restriction" />
                <FormControlLabel value="Parent or guardian needed" control={<Radio />} label="Parent or guardian needed" />
              </RadioGroup>
            </>
          )}

          {currentType === 'doorTime' && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>What time can attendees check in before the event?</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                <TextField
                  label="Time before event starts"
                  type="number"
                  value={doorTimeValue}
                  onChange={(e) => setDoorTimeValue(e.target.value)}
                />
                <RadioGroup row value={timeUnit} onChange={(e) => setTimeUnit(e.target.value)}>
                  <FormControlLabel value="Minutes" control={<Radio />} label="Minutes" />
                  <FormControlLabel value="Hours" control={<Radio />} label="Hours" />
                </RadioGroup>
              </Box>
            </>
          )}

          {currentType === 'parking' && (
            <>
              <Typography variant="h6" sx={{ mb: 2 }}>Is there parking at your venue?</Typography>
              <RadioGroup value={selectedOption} onChange={(e) => setSelectedOption(e.target.value)}>
                <FormControlLabel value="Free parking" control={<Radio />} label="Free parking" />
                <FormControlLabel value="Paid parking" control={<Radio />} label="Paid parking" />
                <FormControlLabel value="No parking options" control={<Radio />} label="No parking options" />
              </RadioGroup>
            </>
          )}

          <Button
            variant="contained"
            onClick={handleAddHighlight}
            sx={{ 
              mt: 3,
              bgcolor: '#f05123',
              color: 'white',
              '&:hover': { bgcolor: '#d84315' }
            }}
          >
            Add to event
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
};

export default GoodToKnow;