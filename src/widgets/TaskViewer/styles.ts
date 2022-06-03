import { createStyles, Theme } from '@material-ui/core';

const styles = (_?: Theme) =>
  createStyles({
    card: {
      margin: '20px',
      padding: '20px',
      width: '300px',
      display: 'inline-block',
      borderRadius: '15px',
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
      color: 'orangered',
    },
    key: {
      fontSize: '20px',
      fontWeight: 700,
      color: '#2da3ad',
      display: 'flex',
      gap: '5px',
      alignItems: 'center',
    },
    name: {
      marginBottom: '20px',
      fontWeight: 700,
      fontSize: '17px',
      display: 'block',
    },
    summary: {
      marginBottom: '20px',
    },
    stats: {
      marginBottom: '10px',
    },
    statStart: {
      display: 'inline-block',
    },
    statEnd: {
      display: 'inline-block',
      float: 'right',
    },
    label: {
      marginRight: '3px',
      color: 'rgba(50, 50, 50, 0.9)',
      fontWeight: 700,
    },
    value: {
      color: '#2da3ad',
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
    assigneeLinkWrapper: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      textDecoration: 'none',
    },
    assigneeContainer: {
      borderRadius: '15px',
      alignItems: 'center',
      boxShadow: '2px 1px 3px 0 lightgray',
      padding: '5px',
      gap: '10px',
      cursor: 'pointer',
      color: '#2da3ad',
      display: 'inline-flex',
      border: '1px solid white',
      '&:hover': {
        border: '1px solid lightgray',
      },
    },
    avatar: {
      borderRadius: '50%',
    },
    icon: {
      width: '15px',
      height: '15px',
      marginRight: '2px',
    },
    centered: {
      display: 'flex',
      alignItems: 'center',
    },
    add: {
      position: 'fixed',
      right: '50px',
      bottom: '50px',
    },
    addPaper: {
      width: '250px',
      margin: '20px',
      padding: '20px',
      '& .MuiTextField-root': {
        width: '100%',
        padding: '5px',
      },
      '& .MuiButton-root': {
        marginTop: '10px',
        marginRight: '10px',
      },
    },
  });

export default styles;
