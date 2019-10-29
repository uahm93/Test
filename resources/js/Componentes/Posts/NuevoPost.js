import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';

import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

const ColorLinearProgress = withStyles({
	colorPrimary: {
		backgroundColor: '#2c3e50'
	},
	barColorPrimary: {
		backgroundColor: '#cd6155'
	}
})(LinearProgress);

const StyledTableCell = withStyles((theme) => ({
	head: {
		backgroundColor: '#2c3e50',
		color: theme.palette.common.white
	},
	body: {
		fontSize: 14
	}
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
	root: {
		'&:nth-of-type(odd)': {
			backgroundColor: theme.palette.background.default
		}
	}
}))(TableRow);

const useStyles = makeStyles((theme) => ({
	root: {
		width: '100%',
		marginTop: theme.spacing(3),
		overflowX: 'auto'
	},
	table: {
		minWidth: 700
	},
	button: {
		margin: theme.spacing(2)
	},
	aceptar: {
		background: 'linear-gradient(45deg, #2c3e50 30%, #212f3d 90%)',
		border: 0,
		borderRadius: 3,
		boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
        color: 'white',
        marginLeft: theme.spacing(5),
		marginRight: theme.spacing(5),
		width: 400,
		margin: theme.spacing(1)
	},
	textField: {
		marginLeft: theme.spacing(5),
		marginRight: theme.spacing(5),
		width: 400,
		margin: theme.spacing(1)
	}
}));

export default function NuevoPost() {
	const classes = useStyles();
	const [ titulo, setTitulo ] = React.useState('');
	const [ tipo, setTipo ] = React.useState('Heroes');
	const [ descripcion, setDescripcion ] = React.useState('');
	const [ progressBar, setProgressBar ] = React.useState(false);
	const [ respuesta, setRespuesta ] = React.useState('');
	const [ popupHandle, setPopupHandle ] = React.useState(false);
	

	
	const handleChangeTipo = (event) => {
		setTipo(event.target.value);
	};
	const handleChangeTitulo = (event) => {
		setTitulo(event.target.value);
    };
    const handleChangeDescripcion = (event) => {
		setDescripcion(event.target.value);
	};

	const handleCerrarPop = () => {
		setPopupHandle(false);
	};
	
	const handleSubmit = () => {
		setProgressBar(true);
		let url = 'http://127.0.0.1:8000/nuevoPost';
		fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				titulo: titulo ,
                descripcion: descripcion,
                categoria: tipo
			})
		})
			.then((response) => response.json())
			.then((respuesta) => {
				if (respuesta.estado == '200') {
					setProgressBar(false);
                    setRespuesta(respuesta.mensaje);
                    setPopupHandle(true);
				} else {
					setPopupHandle(true);
					setRespuesta('Favor de intentar mas tarde');
					setProgressBar(false);
				}
			});
	};

	return (
		<div>
    <Snackbar
        anchorOrigin={{
            vertical: 'top',
            horizontal: 'right'
        }}
        open={popupHandle}
        TransitionComponent={Transition}
        ContentProps={{
            'aria-describedby': 'message-id'
        }}
        message={<span id="message-id">{respuesta}</span>}
        action={[
            <Button key="undo" color="secondary" size="small" onClick={handleCerrarPop}>
                <CloseIcon />
            </Button>,
            <IconButton key="close" aria-label="close" color="inherit" onClose={handleCerrarPop} />
        ]}
    />
     <Paper>
            {progressBar ? <ColorLinearProgress size={300} /> : <br />}
            <ValidatorForm onSubmit={handleSubmit}>
            <InputLabel className={classes.textField}>Categoria</InputLabel>
            <Select className={classes.textField} onChange={handleChangeTipo} value={tipo} displayEmpty>
                <MenuItem value="Heroes">Heroes</MenuItem>
                <MenuItem value="Romantica">Romantica</MenuItem>
                <MenuItem value="Ficcion">Ficcion</MenuItem>
            </Select>
                    <TextValidator
                        className={classes.textField}
                        label="Titulo"
                        value={titulo}
                        onChange={handleChangeTitulo}
                        validators={[ 'required' ]}
                        errorMessages={[ 'Campo requerido' ]}
                    />
                    <TextValidator
                        className={classes.textField}
                        onChange={handleChangeDescripcion}
                        label="Descripcion"
                        multiline
                        rowsMax="4"
                        value={descripcion}
                        validators={[ 'required']}
                        errorMessages={[ 'Campo requerido' ]}
                    />
                    <Button type="submit" className={classes.aceptar} color="primary">
                        Publicar
                    </Button>
                </ValidatorForm>
		</Paper>				
		</div>
	);
}
