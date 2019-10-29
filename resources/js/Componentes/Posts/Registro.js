import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import LinearProgress from "@material-ui/core/LinearProgress";
import TextField from "@material-ui/core/TextField";
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';


const ColorLinearProgress = withStyles({
    colorPrimary: {
        backgroundColor: "#262b69"
    },
    barColorPrimary: {
        backgroundColor: "#a2832f"
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

function desc(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function stableSort(array, cmp) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = cmp(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
    return order === "desc"
        ? (a, b) => desc(a, b, orderBy)
        : (a, b) => -desc(a, b, orderBy);
}

const headCells = [
    {
        id: "categoria",
        numeric: true,
        disablePadding: false,
        label: "Categoria"
    },
    {
        id: "titulo",
        numeric: true,
        disablePadding: false,
        label: "Titulo"
    },
    {
        id: "descripcion",
        numeric: true,
        disablePadding: false,
        label: "Descripcion"
    },
    {
        id: "created_at",
        numeric: true,
        disablePadding: false,
        label: "Creacion"
    },
];

function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort } = props;
    const createSortHandler = property => event => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                {headCells.map(headCell => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "default"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={order}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === "desc"
                                        ? "sorted descending"
                                        : "sorted ascending"}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired
};

const useStyles = makeStyles(theme => ({
    root: {
        width: "100%",
        marginTop: theme.spacing(3)
    },
    paper: {
        width: "100%",
        marginBottom: theme.spacing(2)
    },
    table: {
        minWidth: 750
    },
    tableWrapper: {
        overflowX: "auto"
    },
    visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1
    },
    select: { margin: 30, minWidth: 540 },
    textField: {
		marginLeft: theme.spacing(5),
		marginRight: theme.spacing(5),
		width: 400,
		margin: theme.spacing(1)
	}
    
}));

export default function EnhancedTable(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState("asc");
    const [orderBy, setOrderBy] = React.useState("rfc_emisor");
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [progressBar, setProgressBar] = React.useState(false);
    const [rows, setRows] = React.useState([]);
    const [arreglo, setArreglo] = React.useState([]);
    const [buscar, setBuscar] = React.useState("");
    const [buscarTitulo, setBuscarTitulo] = React.useState("");

    function handleRequestSort(event, property) {
        const isDesc = orderBy === property && order === "desc";
        setOrder(isDesc ? "asc" : "desc");
        setOrderBy(property);
    }

    function handleChangePage(event, newPage) {
        setPage(newPage);
    }

    function handleChangeRowsPerPage(event) {
        setRowsPerPage(+event.target.value);
        setPage(0);
    }

    function handleChangeDense(event) {
        setDense(event.target.checked);
    }
    
    useEffect(() => {
		fetch('http://127.0.0.1:8000/obtenerPosts').then((response) => response.json()).then((getInfo) => {

        setRows(getInfo.map((row) => {
                return row;
            }));
        setArreglo(getInfo.map((row) => {
                return row;
            }));   
        });
	}, []);
   
    const filter = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            return item.categoria.startsWith(text);
        });

        setRows(newData);
        setBuscar(text);
    };

    const tituloPost = event => {
        var text = event.target.value;
        const data = arreglo;
        const newData = data.filter(function(item) {
            return item.titulo.startsWith(text);
        });

        setRows(newData);
        setBuscarTitulo(text);
        
    };

    

    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

    return (
        <div>
            <div className={classes.root}>
                <Paper className={classes.paper}>
                <InputLabel className={classes.textField}>Categoria</InputLabel>
                <Select className={classes.textField} value={buscar} onChange={filter} displayEmpty>
                    <MenuItem value="">Todas</MenuItem>
                    <MenuItem value="Romantica">Romantica</MenuItem>
                    <MenuItem value="Ficcion">Ficcion</MenuItem>
                    <MenuItem value="Heroes">Heroes</MenuItem>
				</Select>
                <TextField
                    className={classes.textField}
                    label="Titulo"
                    value={buscarTitulo}
                    onChange={tituloPost}
                    
				/>
                    <div className={classes.tableWrapper}>
                        <Table
                            className={classes.table}
                            aria-labelledby="tableTitle"
                            size={dense ? "small" : "medium"}
                        >
                            <EnhancedTableHead
                                classes={classes}
                                order={order}
                                orderBy={orderBy}
                                onRequestSort={handleRequestSort}
                                rowCount={rows.length}
                            />
                          
                                

                            <TableBody>
                                {stableSort(rows, getSorting(order, orderBy))
                                    .slice(
                                        page * rowsPerPage,
                                        page * rowsPerPage + rowsPerPage
                                    )
                                    .map((row, index) => {
                                        return (
                                            <TableRow hover key={row.name}>
                                                <TableCell align="right">
                                                    {row.categoria}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.titulo}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.descripcion}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.created_at}
                                                </TableCell>                                               
                                            </TableRow>
                                        );
                                    })}
                                {emptyRows > 0 && (
                                    <TableRow
                                        style={{ height: 49 * emptyRows }}
                                    >
                                        <TableCell colSpan={6} />
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={rows.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        backIconButtonProps={{
                            "aria-label": "página anterior"
                        }}
                        nextIconButtonProps={{
                            "aria-label": "página siguiente"
                        }}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
                </Paper>
                
                <FormControlLabel
                    control={
                        <Switch checked={dense} onChange={handleChangeDense} />
                    }
                    label="Compactar datos"
                />
            </div>
        </div>
    );
}
