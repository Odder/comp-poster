import * as React from 'react';
import Container from '@mui/material/Container';
import { Paper, Stack, TextField, Button, Select, FormControl, InputLabel, OutlinedInput, MenuItem, ListItemText, Typography, Box, Chip, Fade } from '@mui/material';
import { styled } from '@mui/material/styles';
import DownloadIcon from '@mui/icons-material/Download';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import PaletteIcon from '@mui/icons-material/Palette';
import Default from './templates/Default';
import html2canvas from 'html2canvas';
import { compDays } from './utils/dates'

const HeaderBox = styled(Box)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
  padding: theme.spacing(6, 3),
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  color: 'white',
  boxShadow: theme.shadows[4],
}));

const SettingsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: theme.shadows[2],
  transition: 'all 0.3s ease',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  boxShadow: theme.shadows[2],
  '&:hover': {
    boxShadow: theme.shadows[3],
    transform: 'translateY(-2px)',
  },
  transition: 'all 0.3s ease',
}));

export default function App() {
  const printRef = React.useRef();
  const [selectCompId, setSelectCompId] = React.useState('');
  const [searchCompId, setSearchCompId] = React.useState('');
  const [comp, setComp] = React.useState(null);
  const [comps, setComps] = React.useState([]);
  const [color, setColor] = React.useState('#5458AF');

  const randomColor = () => {
    setColor('#' + Math.floor(Math.random() * 16777215).toString(16));
  }

  React.useEffect(() => {
    setComp(comps.find((c) => c.id === selectCompId))
    randomColor()
  }, [selectCompId]);

  React.useEffect(() => {
    if (searchCompId.match(/^[a-zA-Z]+[0-9]{4}$/) === null) {
      return;
    }

    fetch(`https://www.worldcubeassociation.org/api/v0/competitions/${searchCompId}`)
      .then((response) => response.json())
      .then((data) => {
        console.info('data', data)
        setComp(data)
        randomColor()
      });
  }, [searchCompId]);

  React.useEffect(() => {
    console.info('fetching comps from WCA API')
    fetch(`https://www.worldcubeassociation.org/api/v0/competitions?q=Denmark`)
      .then((response) => response.json())
      .then((data) => {
        console.info('data', data)
        const recentComps = data.splice(0, 15)
        setComps(recentComps)
        setSelectCompId(recentComps[0].id)
      });
  }, []);


  /**
   * This piece of code is really iffy. I don't think it works...
   */
  const download = async () => {
    console.log('prepping download')
    const element = printRef.current;
    const canvas = await html2canvas(element);
    console.log('canvas prepped')

    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');
    console.log('link', link)

    if (typeof link.download === 'string') {
      console.log('attaching to body')
      link.href = data;
      link.download = 'image.png';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      console.log('opening new window')
      window.open(data);
    }

    console.log('image done!')
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        <Fade in timeout={800}>
          <HeaderBox>
            <EmojiEventsIcon sx={{ fontSize: 60, mb: 2 }} />
            <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
              Competition Poster Generator
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.95, fontWeight: 400 }}>
              Create beautiful posters for WCA competitions in seconds
            </Typography>
          </HeaderBox>
        </Fade>

        <Stack spacing={4}>
          <Fade in timeout={1000}>
            <SettingsPaper elevation={0}>
              <Stack spacing={3}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <PaletteIcon color="primary" />
                  <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
                    Customize Your Poster
                  </Typography>
                </Box>

                <FormControl fullWidth>
                  <InputLabel id="competitions-dropdown-label">Select Competition</InputLabel>
                  <Select
                    labelId="competitions-dropdown-label"
                    id="competitions-dropdown"
                    value={selectCompId}
                    onChange={(event) => setSelectCompId(event.target.value)}
                    input={<OutlinedInput label="Select Competition" />}
                  >
                    {comps.map((c) => (
                      <MenuItem key={c.id} value={c.id}>
                        <ListItemText
                          primary={c.name}
                          secondary={compDays(c.start_date, c.end_date, { month: "short" })}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  value={searchCompId}
                  label="Or Enter Competition ID"
                  variant="outlined"
                  onChange={(event) => setSearchCompId(event.currentTarget.value)}
                  placeholder="e.g. DenmarkOpen2024"
                  helperText="Enter a WCA competition ID to load specific competition"
                />

                <TextField
                  fullWidth
                  value={color}
                  label="Background Color"
                  variant="outlined"
                  onChange={(event) => setColor(event.currentTarget.value)}
                  helperText="Enter a hex color code"
                  InputProps={{
                    startAdornment: (
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 1,
                          backgroundColor: color,
                          border: '2px solid #e0e0e0',
                          mr: 1
                        }}
                      />
                    ),
                  }}
                />

                <StyledButton
                  variant="contained"
                  size="large"
                  onClick={download}
                  startIcon={<DownloadIcon />}
                  fullWidth
                  disabled={!comp}
                >
                  Download Poster
                </StyledButton>
              </Stack>
            </SettingsPaper>
          </Fade>

          <Fade in={!!comp} timeout={600}>
            <div ref={printRef}>
              {comp && <Default comp={comp} color={color} />}
            </div>
          </Fade>
        </Stack>
      </Container>
    </Box>
  );
}
