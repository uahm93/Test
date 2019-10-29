import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import CssBaseline from '@material-ui/core/CssBaseline';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Tooltip from '@material-ui/core/Tooltip';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';
import Configuracion from '../Configuracion/Configuracion';
import Registros from '../Posts/Registro';
import NuevoPost from '../Posts/NuevoPost';
import IconButton from '@material-ui/core/IconButton';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TouchAppIcon from '@material-ui/icons/TouchApp';



const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
	root: {
		display: 'flex'
	},
	appBar: {
		width: `calc(100% - ${drawerWidth}px)`,
		marginLeft: drawerWidth,
		backgroundColor: '#2c3e50'
	},
	drawer: {
		width: drawerWidth,
		flexShrink: 0
	},
	drawerPaper: {
		width: drawerWidth
	},
	toolbar: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		backgroundColor: theme.palette.background.default,
		padding: theme.spacing(3)
	},
	title: {
		flexGrow: 1,
	  },
}));

export default function MenuMain() {
	const classes = useStyles();
	const [ MenuMain, setMenu ] = useState([]);

	const salir = () =>{
		window.location = "logout";
	}

	useEffect(() => {
		fetch('http://127.0.0.1:8000/obtenerMenu/').then((response) => response.json()).then((getMenu) => {
			setMenu(getMenu);
			console.log(getMenu);
		});
	}, []);

	return (
		<div className={classes.root}>
			<CssBaseline />
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar>
					<Typography variant="h6" className={classes.title}>
						Test Candidato
					</Typography>
					<IconButton onClick={salir}>
					    <ExitToAppIcon />
					</IconButton>
				</Toolbar>
			</AppBar>
			<Router>
				<Drawer
					className={classes.drawer}
					variant="permanent"
					classes={{
						paper: classes.drawerPaper
					}}
					anchor="left"
				>
					<div className={classes.toolbar} />
					<Divider />
					<List>
						{MenuMain.map((item) => (
							<NavLink to={'/' + item.titulo}>
								<Tooltip title={item.descripcion} placement="right">
									<ListItem button>
									    <TouchAppIcon />
									    <ListItemIcon />
										{item.titulo}
										<ListItemText />
									</ListItem>
								</Tooltip>
							</NavLink>
						))}
					</List>
					<Divider />
				</Drawer>
				<main className={classes.content}>
					<div className={classes.toolbar} />

					<Route path="/Configuracion">
						<Configuracion />
					</Route>
					<Route path="/Registros">
						<Registros />
					</Route>
					<Route path="/Nuevo" exact>
						<NuevoPost />
					</Route>
				</main>
			</Router>
		</div>
	);
}
