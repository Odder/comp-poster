import * as React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { compDays } from '../utils/dates'
import MapSvg from './map.svg'


const CanvasPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(8),
  ...theme.typography.h3,
  textAlign: 'center',
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

  return (
    <CanvasPaper elevation={2} style={{
      background: color,
      color: isDark(color) ? 'white' : 'black',
    }}>
      {comp?.name}
      <div style={{ position: 'relative' }}>
        <img src={MapSvg} alt="Map" style={{
          width: '100%',
          height: 'auto',
        }} />
        <div style={{
          width: '48px',
          height: '48px',
          position: 'absolute',
          backgroundImage: 'url("logo.png")',
          backgroundSize: 'cover',
          marginTop: '-24px',
          marginLeft: '-24px',
          left: `${PinPosition(comp?.latitude_degrees, comp?.longitude_degrees).x}%`,
          top: `${PinPosition(comp?.latitude_degrees, comp?.longitude_degrees).y}%`
        }}></div>
      </div>
      <Typography variant="h3" component="h2" gutterBottom>
        {comp?.city}
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        {compDays(comp?.start_date, comp?.end_date)}
      </Typography>
      <Stack direction="row" spacing={2} flexWrap="wrap" justifyContent="center">
        {comp?.event_ids?.map((event) => (
          <div key={event}>
            <div className={`cubing-icon event-${event}`}></div>
          </div>
        ))}
      </Stack>
    </CanvasPaper >
  );
}
