import { createStyles, Theme } from '@material-ui/core';

const styles = (_?: Theme) =>
  createStyles({
    card: {
      margin: '20px',
      padding: '20px',
      width: '400px',
      minHeight: '1750px',
      display: 'block',
      borderRadius: '10px',
      boxShadow: '0px 6px 10px rgba(68, 68, 68, 0.25)',
      transition: 'all 0.2s',
      color: 'rgba(50, 50, 50, 0.9)',
      position: 'relative',
      '&:hover': {
        boxShadow: '0px 6px 10px rgba(68, 68, 68, 0.4)',
        transform: 'scale(1.01)',
      },
    },
    exit: {
      position: 'absolute',
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: '20px',
      right: '20px',
      top: '20px',
    },
    title: {
      marginBottom: '20px',
      fontWeight: 700,
      fontSize: '20px',
      display: 'block',
    },
    summary: {
      marginBottom: '20px',
    },
    statStart: {
      display: 'inline-block',
    },
    statEnd: {
      display: 'inline-block',
      float: 'right',
      marginRight: '50px',
    },
    bold: {
      fontWeight: 700,
    },
    bullet: {
      borderRadius: '15px',
      paddingInline: '7px',
      fontWeight: 700,
      backgroundColor: '#2da3ad',
      color: 'white',
    },
    icon: {
      width: '15px',
      height: '15px',
    },
  });

export default styles;
