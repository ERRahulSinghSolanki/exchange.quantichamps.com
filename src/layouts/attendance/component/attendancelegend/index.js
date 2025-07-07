import React from 'react';
import { Box, Typography } from '@mui/material';
import "./attendancelegend.css"

function AttendanceLegend() {
  return (
    <Box 
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#',
         marginLeft: '10px',
        borderRadius: '8px',
        marginTop: '20px',
        marginRight: '450px',
        
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', }}>
        <Box
          sx={{
            width: '20px',
            height: '20px',
            backgroundColor: '#e0f7fa',
            borderRadius: '50%',
            marginLeft: '350px',
          }}
        />
        <Typography variant="body2">Present</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '20px',
            height: '20px',
            backgroundColor: '#ffecc7',
            borderRadius: '50%',
            marginLeft: '30px',
          }}
        />
        <Typography variant="body2">Leave</Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Box
          sx={{
            width: '20px',
            height: '20px',
            backgroundColor: '#fddede',
            borderRadius: '50%',
            marginLeft: '30px',
            
          }}
        />
        <Typography variant="body2">Weekend</Typography>
      </Box>
    </Box>
  );
}

export default AttendanceLegend;
