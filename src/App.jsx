import * as React from 'react';
import Container from '@mui/material/Container';
import { Paper, Stack, TextField, Button, Select, FormControl, InputLabel, OutlinedInput, MenuItem, ListItemText } from '@mui/material';
import { styled } from '@mui/material/styles';
import Default from './templates/Default';
import html2canvas from 'html2canvas';
import { compDays } from './utils/dates'

const SettingsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: 'center',
}));

export default function App() {
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
    <Container maxWidth="md">
      <Stack spacing={2} paddingTop={5}>
        <SettingsPaper elevation={2}>
          <Container maxWidth="xs">
            <Stack spacing={2}>
              <FormControl>
                <InputLabel id="demo-multiple-name-label">Competition</InputLabel>
                <Select
                  labelId="competitions-dropdown"
                  id="competitions-dropdown"
                  value={selectCompId}
                  onChange={(event) => setSelectCompId(event.target.value)}
                  input={<OutlinedInput label="Competition" />}>
                  {comps.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      <ListItemText primary={c.name} secondary={compDays(c.start_date, c.end_date, { month: "short" })} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField id="standard-basic" value={searchCompId} label="Competition ID" variant="standard" onChange={(event) => setSearchCompId(event.currentTarget.value)} />
              <TextField id="standard-basic" value={color} label="Background hex code" variant="standard" onChange={(event) => setColor(event.currentTarget.value)} />
              <Button onClick={() => {
                exportComponentAsPNG(printRef)
              }}>
                Download
              </Button>
            </Stack>
          </Container>
        </SettingsPaper>
        {comp && <Default comp={comp} color={color} />}
      </Stack>
    </Container >
  );
}
