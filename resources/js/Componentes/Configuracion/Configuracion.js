import React, { useState, useEffect } from 'react';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Tooltip from '@material-ui/core/Tooltip';
import Slide from '@material-ui/core/Slide';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import RefreshIcon from '@material-ui/icons/Refresh';
import DialogTitle from '@material-ui/core/DialogTitle';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import LinearProgress from '@material-ui/core/LinearProgress';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import Snackbar from '@material-ui/core/Snackbar';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/Edit';

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
		color: 'white'
	},
	cancelar: {
		background: 'linear-gradient(45deg, #cd6155 30%, #c0392b 90%)',
		border: 0,
		borderRadius: 3,
		boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
		color: 'white'
	},
	textField: {
		marginLeft: theme.spacing(5),
		marginRight: theme.spacing(5),
		width: 300,
		margin: theme.spacing(1)
	}
}));

export default function Config() {
	const classes = useStyles();
	const [ rows, setRow ] = useState([]);
	const [ openEdit, setOpenEdit ] = React.useState(false);
	const [ open, setOpen ] = React.useState(false);
	const [ usuario, setUsuario ] = React.useState('');
	const [ tipo, setTipo ] = React.useState('2');
	const [ correo, setCorreo ] = React.useState('');
	const [ progressBar, setProgressBar ] = React.useState(false);
	const [ respuesta, setRespuesta ] = React.useState('');
	const [ popupHandle, setPopupHandle ] = React.useState(false);
	const [ idUser, setIdUser ] = React.useState('');
	const [ contrasena, setContrasena ] = React.useState('');
	const [ openPW, setOpenPW ] = React.useState(false);

	const handleChange = (event) => {
		setUsuario(event.target.value);
	};
	const handleChangeTipo = (event) => {
		setTipo(event.target.value);
	};
	const handleChangeCorreo = (event) => {
		setCorreo(event.target.value);
	};

	const handleClickOpen = () => {
		setOpen(true);
		setUsuario('');
		setTipo('');
		setCorreo('');
	};

	const handleClickOpenEdit = (id) => {
		setOpenEdit(true);
		setIdUser(id);
		fetch('http://127.0.0.1:8000/obtenerUser/' + id).then((response) => response.json()).then((respuesta) => {
			setUsuario(respuesta.name);
			setTipo(respuesta.tipo_user);
			setCorreo(respuesta.email);
		});
	};

	const actualizarPW = (id) => {
		setOpenPW(true);
		setIdUser(id);
		fetch('http://127.0.0.1:8000/ActualizarPW/' + id).then((response) => response.json()).then((respuesta) => {
			if (respuesta.estado == '200') {
				setProgressBar(false);
				setContrasena(respuesta.password);
			} else {
				setPopupHandle(true);
				setRespuesta('Algo falló');
				setProgressBar(false);
			}
		});
	};

	const handleClose = () => {
		setOpen(false);
		setOpenEdit(false);
		setOpenPW(false);
	};

	const handleCerrarPop = () => {
		setPopupHandle(false);
	};

	useEffect(() => {
		fetch('http://127.0.0.1:8000/obtenerUsuarios').then((response) => response.json()).then((getInfo) => {
			setRow(getInfo);
		});
	}, []);
	const handleSubmitEdit = () => {
		setProgressBar(true);
		let url = 'http://127.0.0.1:8000/ActualizarUser';
		fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				id: idUser,
				name: usuario,
				email: correo,
				tipo_user: tipo
			})
		})
			.then((response) => response.json())
			.then((respuesta) => {
				if (respuesta.estado == '200') {
					setProgressBar(false);
					setPopupHandle(true);
					setRespuesta(respuesta.mensaje);
					setOpenEdit(false);
				} else {
					setPopupHandle(true);
					setRespuesta('Favor de intentar con otro Email');
					setProgressBar(false);
				}
			});
	};
	const handleSubmit = () => {
		setProgressBar(true);
		let url = 'http://127.0.0.1:8000/nuevoUser';
		fetch(url, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				remember_token: '{{ csrf_token() }}',
				name: usuario,
				email: correo,
				tipo_user: tipo
			})
		})
			.then((response) => response.json())
			.then((respuesta) => {
				if (respuesta.estado == '200') {
					setOpenPW(true);
					setProgressBar(false);
					setRespuesta(respuesta.mensaje);
					setContrasena(respuesta.password);
				} else {
					setPopupHandle(true);
					setRespuesta('Favor de intentar con otro Email');
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
			<Paper className={classes.root}>
				<Button variant="contained" color="primary" className={classes.button} onClick={handleClickOpen}>
					<AddBoxIcon /> Nuevo usuario
				</Button>
				<Table className={classes.table} aria-label="customized table">
					<TableHead>
						<TableRow>
							<StyledTableCell>Usuario</StyledTableCell>
							<StyledTableCell align="right">Correo</StyledTableCell>
							<StyledTableCell align="right">Tipo usuario</StyledTableCell>
							<StyledTableCell align="right">Alta por</StyledTableCell>
							<StyledTableCell align="right">Fecha Registro</StyledTableCell>
							<StyledTableCell align="right">Opciones</StyledTableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{rows.map((row) => (
							<StyledTableRow key={row.id}>
								<StyledTableCell component="th" scope="row">
									{row.name}
								</StyledTableCell>
								<StyledTableCell align="right">{row.email}</StyledTableCell>
								<StyledTableCell align="right">
									{row.tipo_user == '1' ? <b>Administrador</b> : <b>Normal</b>}
								</StyledTableCell>
								<StyledTableCell align="right">{row.alta_por}</StyledTableCell>
								<StyledTableCell align="right">{row.created_at}</StyledTableCell>
								<StyledTableCell align="right">
									<Tooltip title="Editar usuario" placement="center">
										<IconButton onClick={(event) => handleClickOpenEdit(row.id)}>
											<EditIcon />
										</IconButton>
									</Tooltip>
									<Tooltip title="Resetear contraseña" placement="center">
										<IconButton onClick={(event) => actualizarPW(row.id)}>
											<RefreshIcon />
										</IconButton>
									</Tooltip>
								</StyledTableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</Table>
			</Paper>
			<Dialog
				open={open}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				{progressBar ? <ColorLinearProgress size={300} /> : <br />}
				<DialogTitle id="alert-dialog-slide-title">{'Agregar nuevo usuario'}</DialogTitle>
				<ValidatorForm onSubmit={handleSubmit}>
					<DialogContent>
						<TextValidator
							className={classes.textField}
							label="Usuario"
							name="usuario"
							value={usuario}
							onChange={handleChange}
							validators={[ 'required' ]}
							errorMessages={[ 'Campo requerido' ]}
						/>
						<TextValidator
							className={classes.textField}
							onChange={handleChangeCorreo}
							label="Email"
							name="email"
							value={correo}
							validators={[ 'required', 'isEmail' ]}
							errorMessages={[ 'Campo requerido', 'Correo no valido' ]}
						/>
						<InputLabel className={classes.textField}>Tipo de usuario</InputLabel>
						<Select className={classes.textField} onChange={handleChangeTipo} value={tipo} displayEmpty>
							<MenuItem value="2">Normal</MenuItem>
							<MenuItem value="1">Administrador</MenuItem>
						</Select>
					</DialogContent>
					<DialogActions>
						<Button className={classes.cancelar} onClick={handleClose} color="primary">
							Cancelar
						</Button>
						<Button type="submit" className={classes.aceptar} onClick={handleClose} color="primary">
							Aceptar
						</Button>
					</DialogActions>
				</ValidatorForm>
			</Dialog>
			<Dialog
				open={openEdit}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				{progressBar ? <ColorLinearProgress size={300} /> : <br />}
				<DialogTitle id="alert-dialog-slide-title">{'Modificar usuario'}</DialogTitle>
				<ValidatorForm onSubmit={handleSubmitEdit}>
					<DialogContent>
						<TextValidator
							className={classes.textField}
							label="Usuario"
							name="usuario"
							value={usuario}
							onChange={handleChange}
							validators={[ 'required' ]}
							errorMessages={[ 'Campo requerido' ]}
						/>
						<TextValidator
							className={classes.textField}
							onChange={handleChangeCorreo}
							label="Email"
							name="email"
							value={correo}
							validators={[ 'required', 'isEmail' ]}
							errorMessages={[ 'Campo requerido', 'Correo no valido' ]}
						/>
						<InputLabel className={classes.textField}>Tipo de usuario</InputLabel>
						<Select className={classes.textField} onChange={handleChangeTipo} value={tipo} displayEmpty>
							<MenuItem value="2">Normal</MenuItem>
							<MenuItem value="1">Administrador</MenuItem>
						</Select>
					</DialogContent>
					<DialogActions>
						<Button className={classes.cancelar} onClick={handleClose} color="primary">
							Cancelar
						</Button>
						<Button type="submit" className={classes.aceptar} color="primary">
							Aceptar
						</Button>
					</DialogActions>
				</ValidatorForm>
			</Dialog>

			<Dialog
				open={openPW}
				TransitionComponent={Transition}
				keepMounted
				onClose={handleClose}
				aria-labelledby="alert-dialog-slide-title"
				aria-describedby="alert-dialog-slide-description"
			>
				{progressBar ? <ColorLinearProgress size={300} /> : <br />}
				<DialogTitle id="alert-dialog-slide-title">{'Contraseña de usuario'}</DialogTitle>
				<DialogContent>{contrasena}</DialogContent>
				<DialogActions>
					<Button className={classes.cancelar} onClick={handleClose} color="primary">
						Cerrar
					</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
}
