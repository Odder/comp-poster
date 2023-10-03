import * as React from 'react';
import { Paper, Stack, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import MapSvg from './map.svg'


const CanvasPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(6),
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

export default function CompName({ comp, color }) {
  const date = (ymd) => new Date(Date.parse(ymd)).toLocaleString('da-DK', { weekday: 'short', month: 'short', day: 'numeric' })
  const compDays = (s, e) => s === e ? date(s) : `${date(s)} - ${date(e)}`

  const PinPosition = (lat, long) => {
    const latMin = 54.3
    const latMax = 58
    const longMin = 7.3
    const longMax = 16

    const x = (long - longMin) / (longMax - longMin) * 100
    const y = 100 - (lat - latMin) / (latMax - latMin) * 100
    return { x, y }
  }

  return (
    <CanvasPaper elevation={2} style={{
      background: color,
    }}>
      {comp?.name}
      <div style={{ position: 'relative' }}>
        <img src={MapSvg} alt="Map" style={{
          width: '100%',
          height: 'auto',
        }} />
        <div style={{
          width: '10px',
          height: '10px',
          background: 'red',
          position: 'absolute',
          marginTop: '-5px',
          marginLeft: '-5px',
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
