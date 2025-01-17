// components/EventList/Pagination.tsx
import React from 'react';
import { Box, Select, MenuItem, Pagination as MuiPagination, IconButton } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  onItemsPerPageChange: (items: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  itemsPerPage,
  onPageChange,
  onItemsPerPageChange
}) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center',
      justifyContent: 'center',
      gap: 2,
      my: 3,
      '& .MuiPaginationItem-root': {
        color: '#000',
        '&.Mui-selected': {
          backgroundColor: '#ff0000',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#ff0000',
          }
        }
      }
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        Per Page:
        <Select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          size="small"
          sx={{
            minWidth: '70px',
            height: '32px',
            '& .MuiSelect-select': {
              padding: '4px 8px',
            }
          }}
        >
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={15}>15</MenuItem>
        </Select>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <IconButton 
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          size="small"
        >
          <NavigateBeforeIcon />
        </IconButton>
        <MuiPagination 
          count={totalPages}
          page={currentPage}
          onChange={(_, page) => onPageChange(page)}
          color="primary"
          siblingCount={1}
          boundaryCount={1}
          hideNextButton
          hidePrevButton
          sx={{
            '& .MuiPaginationItem-ellipsis': {
              color: '#000'
            }
          }}
        />
        <IconButton 
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          size="small"
        >
          <NavigateNextIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Pagination;