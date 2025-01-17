// components/User/SearchResults/Filter.tsx
import React, { useState } from 'react';
import { Box, Typography, Checkbox, FormGroup, FormControlLabel, Button, styled } from '@mui/material';
import filtersIcon from "../../../assets/Filters.png";

interface FilterState {
  type: string[];
  startDate: string | null;
  endDate: string | null;
  price: string[];
}

interface FilterProps {
  onSubmit: (filters: FilterState) => void;
}

const FilterContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  maxWidth: 280,
  transition: 'all 0.3s ease',
  display: 'flex',
  flexDirection: 'column'
}));

const FilterSection = styled(Box)({
  padding: '16px',
  backgroundColor: '#ffffff',
  borderRadius: '8px',
  marginBottom: '16px',
});

const FilterTitle = styled(Typography)({
  fontWeight: 600,
  marginBottom: '12px',
  color: '#1a1a1a',
});

const SubmitButton = styled(Button)({
  backgroundColor: '#ff0000',
  color: 'white',
  width: '100%',
  padding: '10px',
  '&:hover': {
    backgroundColor: '#e60000',
  },
});

const Filter: React.FC<FilterProps> = ({ onSubmit }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [filterState, setFilterState] = useState<FilterState>({
    type: [],
    startDate: null,
    endDate: null,
    price: []
  });

  const handleTypeChange = (value: string, checked: boolean) => {
    setFilterState(prev => ({
      ...prev,
      type: checked 
        ? [...prev.type, value]
        : prev.type.filter(t => t !== value)
    }));
  };

  const handleDateChange = (value: string, checked: boolean) => {
    const today = new Date();
    let startDate = null;
    let endDate = null;

    if (checked) {
      switch (value) {
        case 'today':
          startDate = today.toISOString().split('T')[0];
          endDate = startDate;
          break;
        case 'tomorrow':
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          startDate = tomorrow.toISOString().split('T')[0];
          endDate = startDate;
          break;
        case 'weekend':
          const nextSaturday = new Date(today);
          nextSaturday.setDate(today.getDate() + (6 - today.getDay()));
          const nextSunday = new Date(nextSaturday);
          nextSunday.setDate(nextSaturday.getDate() + 1);
          startDate = nextSaturday.toISOString().split('T')[0];
          endDate = nextSunday.toISOString().split('T')[0];
          break;
      }
    }

    setFilterState(prev => ({
      ...prev,
      startDate,
      endDate
    }));
  };

  const handleSubmit = () => {
    onSubmit(filterState);
  };

  return (
    <FilterContainer>
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          cursor: 'pointer'
        }}
        onClick={() => setIsVisible(!isVisible)}
      >
        <img 
          src={filtersIcon} 
          alt="Filters" 
          style={{ height: '40px', marginRight: '20px' }}
        />
      </Box>

      {isVisible && (
        <>
          <FilterSection>
            <FilterTitle>Genre</FilterTitle>
            <FormGroup>
              {['Comedy', 'Tech', 'Fun', 'Social', 'Networking', 'Job Fair'].map((genre) => (
                <FormControlLabel
                  key={genre}
                  control={
                    <Checkbox 
                      onChange={(e) => handleTypeChange(genre, e.target.checked)}
                      sx={{
                        '&.Mui-checked': {
                          color: '#ff0000',
                        },
                      }}
                    />
                  }
                  label={genre}
                />
              ))}
            </FormGroup>
          </FilterSection>

          <FilterSection>
            <FilterTitle>Date</FilterTitle>
            <FormGroup>
              {['Today', 'Tomorrow', 'This Weekend', 'This Month', 'Next Month', 'Custom Date'].map((date) => (
                <FormControlLabel
                  key={date}
                  control={
                    <Checkbox 
                      onChange={(e) => handleDateChange(date.toLowerCase(), e.target.checked)}
                      sx={{
                        '&.Mui-checked': {
                          color: '#ff0000',
                        },
                      }}
                    />
                  }
                  label={date}
                />
              ))}
            </FormGroup>
          </FilterSection>

          <FilterSection>
            <FilterTitle>Price</FilterTitle>
            <FormGroup>
              {['Free', 'Paid'].map((price) => (
                <FormControlLabel
                  key={price}
                  control={
                    <Checkbox 
                      onChange={(e) => {
                        setFilterState(prev => ({
                          ...prev,
                          price: e.target.checked 
                            ? [...prev.price, price.toLowerCase()]
                            : prev.price.filter(p => p !== price.toLowerCase())
                        }));
                      }}
                      sx={{
                        '&.Mui-checked': {
                          color: '#ff0000',
                        },
                      }}
                    />
                  }
                  label={price}
                />
              ))}
            </FormGroup>
          </FilterSection>

          <Box sx={{ mt: 3, px: 2 }}>
            <SubmitButton 
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </SubmitButton>
          </Box>
        </>
      )}
    </FilterContainer>
  );
};

export default Filter;