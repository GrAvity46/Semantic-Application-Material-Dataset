import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

const pages = ['Mainpage', 'Complete_Material'];

const ResponsiveAppBar = () => {
 

  const darkTheme = createTheme({
    palette: {
      mode: 'dark',
    },
  });

  return (
    <AppBar position="static" theme={darkTheme}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <EngineeringIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 3 }} />
            <Typography
              variant="h5"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'Segoe UI',
                fontWeight: 400,
                letterSpacing: '.4rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              Engineering Materials Search Application
            </Typography>

         
          <Box theme={darkTheme} sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                sx={{ my: 2, color: 'black', display: 'block' }}
              >
                <Link style={{textDecoration: "none", color:grey[900]}} to={`/${page}`}>
                        {page}
                </Link>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;