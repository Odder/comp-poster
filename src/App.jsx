import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Paper, Stack, TextField, Button, Select, FormControl, InputLabel, OutlinedInput, MenuItem } from '@mui/material';
import { styled } from '@mui/material/styles';
import Default from './templates/Default';
import html2canvas from 'html2canvas';


const SettingsPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  ...theme.typography.body2,
  textAlign: 'center',
}));

export default function App() {
  const [compId, setCompId] = React.useState('');
  const [comp, setComp] = React.useState({});
  const [comps, setComps] = React.useState([]);
  const [color, setColor] = React.useState('#5458AF');

  const printRef = React.useRef();

  const randomColor = () => {
    setColor('#' + Math.floor(Math.random() * 16777215).toString(16));
  }

  React.useEffect(() => {
    setComp(comps.find((c) => c.id === compId))
    randomColor()
  }, [compId]);

  React.useEffect(() => {
    console.info('fetching comps from WCA API')
    fetch(`https://www.worldcubeassociation.org/api/v0/competitions?q=Denmark`)
      .then((response) => response.json())
      .then((data) => {
        console.info('data', data)
        setComps(data.splice(0, 15))
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
                  value={compId}
                  onChange={(event) => setCompId(event.target.value)}
                  input={<OutlinedInput label="Competition" />}>
                  {comps.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField id="standard-basic" value={compId} label="Competition ID" variant="standard" onChange={(event) => setCompId(event.currentTarget.value)} />
              <TextField id="standard-basic" value={color} label="Background hex code" variant="standard" onChange={(event) => setColor(event.currentTarget.value)} />
              <Button onClick={() => {
                console.info('download pressed');
                download()
              }}>
                Download
              </Button>
            </Stack>
          </Container>
        </SettingsPaper>
        <div ref={printRef} >
          <Default comp={comp} color={color} />
        </div>
      </Stack>
    </Container >
  );
}