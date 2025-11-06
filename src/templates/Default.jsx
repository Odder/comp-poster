import * as React from 'react';
import { Paper, Stack, Typography, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { compDays } from '../utils/dates'
import MapSvg from './map.svg'
import PlaceIcon from '@mui/icons-material/Place';

const CanvasPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
  textAlign: 'center',
  position: 'relative',
  overflow: 'hidden',
  boxShadow: theme.shadows[5],
  borderRadius: theme.shape.borderRadius,
  minHeight: '600px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
}));

const MapContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  margin: theme.spacing(3, 0),
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
}));

const events = [
  '222',
  '333',
  '444',
  '555',
  '666',
  '777',
  '333bf',
  '333fm',
  '333oh',
  '333ft',
  'minx',
  'pyram',
  'skewb',
  'sq1',
  'clock',
  '444bf',
  '555bf',
]

export default function Default({ comp, color }) {
  const PinPosition = (lat, long) => {
    const latMin = 54.3
    const latMax = 58
    const longMin = 7.3
    const longMax = 16

    const x = (long - longMin) / (longMax - longMin) * 100
    const y = 100 - (lat - latMin) / (latMax - latMin) * 100
    return { x, y }
  }

  const isDark = (hex) => {
    if (hex === undefined) {
      return false
    }
    const c = hex.substring(1);      // strip #
    const rgb = parseInt(c, 16);   // convert rrggbb to decimal
    const r = (rgb >> 16) & 0xff;  // extract red
    const g = (rgb >> 8) & 0xff;  // extract green
    const b = rgb & 0xff;          // extract blue

    return (r * 0.299 + g * 0.587 + b * 0.114) < 186;
  }

  const textColor = isDark(color) ? 'white' : 'black';
  const textColorRgba = isDark(color) ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)';

  return (
    <CanvasPaper
      elevation={0}
      style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        color: textColor,
      }}
    >
      {/* Decorative background elements */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isDark(color) ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isDark(color) ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.03)'} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <Box sx={{ zIndex: 1, position: 'relative' }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 3,
            textShadow: isDark(color) ? '0 2px 10px rgba(0,0,0,0.3)' : '0 2px 10px rgba(255,255,255,0.3)',
          }}
        >
          {comp?.name}
        </Typography>

        <MapContainer>
          <img
            src={MapSvg}
            alt="Map"
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              opacity: isDark(color) ? 0.9 : 1,
            }}
          />
          <Box
            sx={{
              position: 'absolute',
              left: `${PinPosition(comp?.latitude_degrees, comp?.longitude_degrees).x}%`,
              top: `${PinPosition(comp?.latitude_degrees, comp?.longitude_degrees).y}%`,
              transform: 'translate(-50%, -100%)',
            }}
          >
            <PlaceIcon
              sx={{
                fontSize: 48,
                color: '#ef4444',
                filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
              }}
            />
          </Box>
        </MapContainer>

        <Typography
          variant="h4"
          component="h2"
          gutterBottom
          sx={{
            fontWeight: 600,
            mt: 3,
            color: textColorRgba,
          }}
        >
          {comp?.city}
        </Typography>

        <Typography
          variant="h5"
          component="div"
          gutterBottom
          sx={{
            fontWeight: 500,
            mb: 4,
            opacity: 0.9,
          }}
        >
          {compDays(comp?.start_date, comp?.end_date)}
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
            mt: 3,
            p: 3,
            backgroundColor: isDark(color) ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
          }}
        >
          {comp?.event_ids?.map((event) => (
            <Box
              key={event}
              sx={{
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <div className={`cubing-icon event-${event}`} style={{ fontSize: '2em' }}></div>
            </Box>
          ))}
        </Box>
      </Box>
    </CanvasPaper>
  );
}
